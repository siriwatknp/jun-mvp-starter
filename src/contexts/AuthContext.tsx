"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "firebase/auth";
import {
  onAuthStateChange,
  signInWithToken,
  getUserData,
  signOut as firebaseSignOut,
  authenticateLineUser,
} from "@/lib/firebase";
import liff, { type Liff } from "@line/liff";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";

/**
 * Represents the different authentication states of the user with Firebase
 *
 * @property idle - No authentication activity is happening (either success or no user)
 * @property authenticating - User is being authenticated with LINE
 * @property fetchingProfile - Fetching user data from Firestore
 * @property signingOut - User is being signed out
 */
type AuthStatus = "idle" | "authenticating" | "fetchingProfile" | "error";

/**
 * Represents the different states of LIFF initialization
 *
 * @property initializing - LIFF is being initialized
 * @property success - LIFF has been successfully initialized (applied for logged in or logged out)
 * @property error - LIFF initialization failed
 */
type LiffState = "initializing" | "success" | "error";

// Define the shape of the auth context
type AuthContextType = {
  isNewUser: boolean;
  login: () => void;
  logout: () => Promise<void>;
  shouldShowLogin: boolean;
  isLineAuthenticating: boolean;
} & ReturnType<typeof useObserveFirebaseUser> &
  ReturnType<typeof useLineLogin>;

// Define the shape of the LINE profile
type LineProfile = Awaited<ReturnType<Liff["getProfile"]>>;

// Define the shape of the user data from Firestore
type UserData = {
  uid: string;
  displayName: string;
  pictureUrl?: string;
  description?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  providers: {
    line?: {
      userId: string;
      displayName: string;
      pictureUrl?: string;
      email?: string | null;
      lastLogin: Timestamp;
      linkedAt: Timestamp;
    };
  };
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function useLineLogin() {
  const [liffState, setLiffState] = useState<LiffState>("initializing");
  const [lineProfile, setLineProfile] = useState<LineProfile | null>(null);

  // Initialize LIFF
  useEffect(() => {
    const init = async () => {
      try {
        const LIFF_ID = process.env.NEXT_PUBLIC_LINE_LIFF_ID!;
        if (process.env.NODE_ENV === "development") {
          if (!LIFF_ID) {
            console.error("LIFF_ID should not be empty!");
          }
        }
        await liff.init({ liffId: LIFF_ID });
        setLiffState("success");
        if (liff.isLoggedIn()) {
          try {
            const profile = await liff.getProfile();
            setLineProfile(profile);
          } catch {}
        }
      } catch {
        setLiffState("error");
      }
    };

    init();
  }, []);

  return { liffState, lineProfile, setLineProfile };
}

function useObserveFirebaseUser(enabled: boolean) {
  const [authUser, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("authenticating");

  // Listen for Firebase auth state changes
  useEffect(() => {
    if (enabled) {
      const unsubscribe = onAuthStateChange(async (user) => {
        setUser(user);

        if (user && liff.isLoggedIn()) {
          // Fetch user data from Firestore
          setAuthStatus("fetchingProfile");
          const userData = await getUserData(user.uid);
          setUserProfile(userData as UserData);
        }

        setAuthStatus("idle");
      });

      return () => unsubscribe();
    }
  }, [enabled]);

  return {
    authUser,
    userProfile,
    setUserProfile,
    authStatus,
    setAuthStatus,
  };
}

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNewUser, setIsNewUser] = useState(false);
  const { liffState, lineProfile, setLineProfile } = useLineLogin();
  const { authUser, userProfile, setUserProfile, authStatus, setAuthStatus } =
    useObserveFirebaseUser(liffState === "success");

  // Check if we're in the LINE redirect process
  const isLineRedirect =
    searchParams?.has("liffRedirectUri") || searchParams?.has("code");

  // Login with LINE
  const login = useCallback(() => {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  }, []);

  // Logout from both Firebase and LINE
  const logout = useCallback(async () => {
    try {
      await firebaseSignOut();

      if (liff.isLoggedIn()) {
        liff.logout();
        // Use Next.js router instead of window.location
        router.refresh();
      }

      setLineProfile(null);
      setUserProfile(null);
    } catch {}
  }, [router, setLineProfile, setUserProfile]);

  // Check if LINE login is completed but Firebase auth is not
  useEffect(() => {
    // Only proceed after LIFF redirect and no user from Firebase auth,
    if (
      isLineRedirect &&
      liffState === "success" &&
      liff.isLoggedIn() &&
      authStatus === "idle" &&
      !authUser
    ) {
      async function authenticateWithLine() {
        try {
          setAuthStatus("authenticating");

          // Get LINE ID token
          const idToken = liff.isLoggedIn() ? liff.getIDToken() : null;

          if (!idToken) {
            console.error("No LINE ID token available");
            setAuthStatus("error");
            return;
          }

          // Call Firebase Cloud Function to authenticate with LINE
          const {
            data: { firebaseToken, isNewUser },
          } = await authenticateLineUser({ idToken });

          if (isNewUser) {
            setIsNewUser(isNewUser);
          }

          // Sign in to Firebase with custom token
          // If success, fetching user profile will be handled by Firebase user hook
          await signInWithToken(firebaseToken);

          // Clean up query parameters after successful authentication
          router.replace(pathname);
        } catch {
          setAuthStatus("error");
        }
      }

      authenticateWithLine();
    }
  }, [
    liffState,
    authUser,
    router,
    pathname,
    isLineRedirect,
    authStatus,
    setAuthStatus,
  ]);

  return (
    <AuthContext.Provider
      value={{
        liffState,
        lineProfile,
        authUser,
        authStatus,
        userProfile,
        isNewUser,
        setAuthStatus,
        setLineProfile,
        setUserProfile,
        login,
        logout,
        isLineAuthenticating:
          authStatus === "authenticating" && !authUser && isLineRedirect,
        shouldShowLogin:
          authStatus === "idle" &&
          liffState === "success" &&
          !liff.isLoggedIn(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
