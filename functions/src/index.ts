import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {
  onCall,
  HttpsError,
  CallableRequest,
} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
initializeApp();

// Define region constant
const REGION = "asia-southeast1"; // Singapore

// Define types for LINE profile
interface LineProfile {
  sub: string;
  name: string;
  picture?: string;
  email?: string;
}

// Authenticate LINE user function
export const authenticateLineUser = onCall(
  {
    region: REGION,
    secrets: ["LINE_CHANNEL_ID"],
  },
  async (request: CallableRequest<{ idToken: string }>) => {
    try {
      // Get the LINE ID token from the request
      const { idToken } = request.data;

      if (!idToken) {
        throw new HttpsError("invalid-argument", "LINE ID token is required");
      }

      // Verify the LINE ID token
      const lineProfile = await verifyLineToken(idToken);
      const uid = `line:${lineProfile.sub}`;

      // Create a custom token with Firebase Admin SDK
      const auth = getAuth();
      const firebaseToken = await auth.createCustomToken(uid);

      // Update or create the user document in Firestore
      const db = getFirestore();
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      let isNewUser = false;

      if (!userDoc.exists) {
        isNewUser = true;
        // Create new user document
        await userRef.set({
          uid: uid,
          displayName: lineProfile.name,
          pictureUrl: lineProfile.picture,
          createdAt: FieldValue.serverTimestamp(),
          lastLogin: FieldValue.serverTimestamp(),
          providers: {
            line: {
              userId: lineProfile.sub,
              displayName: lineProfile.name,
              pictureUrl: lineProfile.picture,
              email: lineProfile.email || null,
              lastLogin: FieldValue.serverTimestamp(),
              linkedAt: FieldValue.serverTimestamp(),
            },
          },
        });
      } else {
        // Update existing user document
        await userRef.update({
          displayName: lineProfile.name,
          pictureUrl: lineProfile.picture,
          lastLogin: FieldValue.serverTimestamp(),
          "providers.line": {
            userId: lineProfile.sub,
            displayName: lineProfile.name,
            pictureUrl: lineProfile.picture,
            email: lineProfile.email || null,
            lastLogin: FieldValue.serverTimestamp(),
            linkedAt:
              userDoc.data()?.providers?.line?.linkedAt ||
              FieldValue.serverTimestamp(),
          },
        });
      }

      console.log("isNewUser", isNewUser);

      return {
        isNewUser,
        firebaseToken,
        userProfile: {
          uid,
          displayName: lineProfile.name,
          pictureUrl: lineProfile.picture,
        },
      };
    } catch (error) {
      console.error("Error authenticating LINE user:", error);
      throw new HttpsError(
        "internal",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

async function verifyLineToken(idToken: string): Promise<LineProfile> {
  // Verify with LINE's API using native fetch
  const url = new URL("https://api.line.me/oauth2/v2.1/verify");
  url.searchParams.append("id_token", idToken);
  url.searchParams.append("client_id", process.env.LINE_CHANNEL_ID || "");

  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("LINE API error response:", errorBody);
    throw new HttpsError("internal", errorBody);
  }

  return (await response.json()) as LineProfile;
}
