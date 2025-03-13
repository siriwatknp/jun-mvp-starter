"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeDialog } from "@/components/WelcomeDialog";

export default function Dashboard() {
  const {
    login,
    logout,
    shouldShowLogin,
    authStatus,
    lineProfile,
    userProfile,
    isNewUser,
  } = useAuth();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const hasShownWelcomeDialogRef = useRef(false);
  const profile = userProfile || lineProfile;

  // Show welcome dialog when a new user logs in, but only once
  useEffect(() => {
    if (isNewUser && userProfile && !hasShownWelcomeDialogRef.current) {
      setShowWelcomeDialog(true);
      hasShownWelcomeDialogRef.current = true;
    }
  }, [isNewUser, userProfile]);

  return (
    <div className="jun-layout jun-layout-noTransition">
      {/* Welcome Dialog for new users */}
      <WelcomeDialog
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
      />

      <div className="jun-header jun-header-h-[64px] jun-header-clip-left px-4 md:px-4">
        <h1 className="font-bold text-lg">⚡️ Jun MVP Starter</h1>
        <div className="ml-auto">
          {shouldShowLogin && (
            <button
              onClick={login}
              className={`
              flex items-center justify-center gap-4 cursor-pointer
              rounded-full font-bold py-2 px-4 text-sm
             bg-[#06C755] text-white hover:bg-[#05a648] active:bg-[#049c3f] transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#06C755] focus:ring-opacity-50
            `}
              aria-label="Login with LINE"
              tabIndex={0}
            >
              {/* LINE icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-10 h-10 -mx-4 -my-4 flex-shrink-0`}
              >
                <path
                  fill="#FFFFFF"
                  d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611h-0.001C36.203,26.879,37.113,24.764,37.113,22.417z M18.875,25.907h-2.604c-0.379,0-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687c0.379,0,0.687,0.308,0.687,0.687v4.521h1.917c0.379,0,0.687,0.308,0.687,0.687C19.562,25.598,19.254,25.907,18.875,25.907z M21.568,25.219c0,0.379-0.308,0.688-0.687,0.688s-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687s0.687,0.308,0.687,0.687V25.219z M27.838,25.219c0,0.297-0.188,0.559-0.47,0.652c-0.071,0.024-0.145,0.036-0.218,0.036c-0.215,0-0.42-0.103-0.549-0.275l-2.669-3.635v3.222c0,0.379-0.308,0.688-0.688,0.688c-0.379,0-0.688-0.308-0.688-0.688V20.01c0-0.296,0.189-0.558,0.47-0.652c0.071-0.024,0.144-0.035,0.218-0.035c0.214,0,0.42,0.103,0.549,0.275l2.67,3.635V20.01c0-0.379,0.309-0.687,0.688-0.687c0.379,0,0.687,0.308,0.687,0.687V25.219z M32.052,21.927c0.379,0,0.688,0.308,0.688,0.688c0,0.379-0.308,0.687-0.688,0.687h-1.917v1.23h1.917c0.379,0,0.688,0.308,0.688,0.687c0,0.379-0.309,0.688-0.688,0.688h-2.604c-0.378,0-0.687-0.308-0.687-0.688v-2.603c0-0.001,0-0.001,0-0.001c0,0,0-0.001,0-0.001v-2.601c0-0.001,0-0.001,0-0.002c0-0.379,0.308-0.687,0.687-0.687h2.604c0.379,0,0.688,0.308,0.688,0.687s-0.308,0.687-0.688,0.687h-1.917v1.23H32.052z"
                />
              </svg>
              Log in
            </button>
          )}
          {authStatus === "authenticating" && !profile && (
            <Avatar className="h-9 w-9 bg-neutral-200"></Avatar>
          )}
          {profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                  />
                  <AvatarFallback>
                    {profile.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 z-50 bg-white shadow-lg border border-gray-200"
                sideOffset={5}
              >
                <div className="px-4 py-3">
                  <div className="font-medium">{profile.displayName}</div>
                  {userProfile && (
                    <>
                      <div className="text-xs text-gray-500 truncate">
                        {userProfile.providers?.line?.email || "LINE User"}
                      </div>
                      {userProfile.description ? (
                        <button
                          onClick={() => setShowWelcomeDialog(true)}
                          className="mt-2 text-sm text-gray-600 italic group flex items-start w-full text-left hover:bg-gray-50 rounded px-1 py-0.5 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1 mt-0.5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                          <span className="flex-1">
                            &ldquo;{userProfile.description}&rdquo;
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowWelcomeDialog(true)}
                          className="mt-2 text-xs text-blue-500 hover:underline flex items-center"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Add a description
                        </button>
                      )}
                    </>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <main className="jun-content">
        <div className="container mx-auto max-w-7xl py-8 px-4 2xl:w-full 2xl:max-w-fit 2xl:mx-[128px]">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              Go production in minutes
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Next.js SSG, Line Login, Firebase
            </p>
            <a
              href="https://github.com/siriwatknp/jun-mvp-starter/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-bold"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>Get the code</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3">
                Ready-to-use authentication flow
              </h3>
              <p className="text-gray-600 text-sm">
                Secure authentication system with Line login integration and
                Firebase Auth backend, ready to use out of the box.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3">
                Next.js SSG + Tailwind CSS
              </h3>
              <p className="text-gray-600 text-sm">
                Built with Next.js Static Site Generation for optimal
                performance and Tailwind CSS for beautiful, responsive designs.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3">
                Default deployment to Firebase hosting
              </h3>
              <p className="text-gray-600 text-sm">
                Seamless deployment to Firebase hosting with pre-configured
                settings for a smooth production experience.
              </p>
            </div>
          </div>

          {/* Authentication Flow Section */}
          <div className="mt-16 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
              Authentication Flow
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">LIFF Initialization</h3>
                    <p className="text-gray-600 text-sm">
                      The app initializes the LINE LIFF SDK and checks if the
                      user is already logged in.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
                    <span className="font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">LINE Login</h3>
                    <p className="text-gray-600 text-sm">
                      User clicks the login button and is redirected to
                      LINE&apos;s login page. After successful login,
                      they&apos;re redirected back with authentication tokens.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-4">
                    <span className="font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Firebase Integration</h3>
                    <p className="text-gray-600 text-sm">
                      The app sends the LINE ID token to a Firebase Cloud
                      Function, which verifies it and creates a Firebase custom
                      token. It also creates or updates the user&apos;s document
                      in Firestore.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2 mr-4">
                    <span className="font-bold text-yellow-600">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium">User Session</h3>
                    <p className="text-gray-600 text-sm">
                      The app signs in to Firebase using the custom token and
                      loads the user profile data from Firestore. Authentication
                      state is maintained using React context.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-4">
                    <span className="font-bold text-red-600">5</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Logout Process</h3>
                    <p className="text-gray-600 text-sm">
                      When logging out, the app signs out from both Firebase and
                      LINE, and the UI is updated to show the login button
                      again.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="jun-footer min-h-[60px]">
        <div className="h-full py-4 flex flex-wrap items-center justify-center gap-y-4 text-sm">
          <div>
            Crafted by{" "}
            <a
              href="https://siriwatk.dev/"
              target="_blank"
              className="text-blue-500 font-medium underline underline-offset-2"
            >
              siriwatknp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
