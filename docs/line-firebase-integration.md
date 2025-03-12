# LINE Authentication with Firebase Integration

## Overview

This document outlines the implementation of LINE authentication for our application using Firebase. Since LINE is not natively supported as an authentication provider in Firebase, we will use a Cloud Function to create custom tokens that bridge LINE authentication with Firebase Auth, while also managing user data in Firestore.

## System Architecture

![Architecture Overview]

1. User logs in via LINE (LIFF)
2. Application sends LINE ID token to Firebase Cloud Function
3. Firebase Cloud Function:
   - Verifies LINE token
   - Creates a Firebase custom token
   - Creates/updates user document in Firestore
4. Client signs in to Firebase with the custom token
5. Application loads user data already prepared by the Cloud Function

## Implementation Details

### 1. Firebase Cloud Function

Create a callable Cloud Function to handle the complete LINE authentication process:

```javascript
// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.authenticateLineUser = functions.https.onCall(async (data, context) => {
  try {
    // Get the LINE ID token from the request
    const lineIdToken = data.idToken;

    if (!lineIdToken) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "LINE ID token is required"
      );
    }

    // Verify the LINE ID token
    const lineProfile = await verifyLineToken(lineIdToken);
    const uid = `line:${lineProfile.userId}`;

    // Create a custom token with Firebase Admin SDK
    const firebaseToken = await admin.auth().createCustomToken(uid);

    // Update or create the user document in Firestore
    const userRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create new user document
      await userRef.set({
        uid: uid,
        displayName: lineProfile.displayName,
        pictureUrl: lineProfile.pictureUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        providers: {
          line: {
            userId: lineProfile.userId,
            displayName: lineProfile.displayName,
            pictureUrl: lineProfile.pictureUrl,
            email: lineProfile.email || null,
            lastLogin: admin.firestore.FieldValue.serverTimestamp(),
            linkedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
        },
      });
    } else {
      // Update existing user document
      await userRef.update({
        displayName: lineProfile.displayName,
        pictureUrl: lineProfile.pictureUrl,
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        "providers.line": {
          userId: lineProfile.userId,
          displayName: lineProfile.displayName,
          pictureUrl: lineProfile.pictureUrl,
          email: lineProfile.email || null,
          lastLogin: admin.firestore.FieldValue.serverTimestamp(),
          linkedAt:
            userDoc.data().providers?.line?.linkedAt ||
            admin.firestore.FieldValue.serverTimestamp(),
        },
      });
    }

    // Return token and basic profile info to minimize additional Firestore reads
    return {
      firebaseToken,
      userProfile: {
        uid,
        displayName: lineProfile.displayName,
        pictureUrl: lineProfile.pictureUrl,
      },
    };
  } catch (error) {
    console.error("Error authenticating LINE user:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

async function verifyLineToken(idToken) {
  try {
    // Verify with LINE's API using native fetch instead of axios
    const url = new URL("https://api.line.me/oauth2/v2.1/verify");
    url.searchParams.append("id_token", idToken);
    url.searchParams.append("client_id", process.env.LINE_CHANNEL_ID);

    const response = await fetch(url, { method: "POST" });

    if (!response.ok) {
      throw new Error(`LINE API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("LINE token verification failed:", error);
    throw new Error("Invalid LINE token");
  }
}
```

### 2. Client-Side Integration

The client-side code is simplified since user data management is handled by the Cloud Function:

```javascript
// client/src/auth/lineAuth.js
import firebase from "../firebase";
import liff from "@line/liff";

export async function signInWithLINE() {
  try {
    // Initialize LIFF
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });

    // Check if user is logged in to LINE
    if (!liff.isLoggedIn()) {
      // Redirect to LINE login
      liff.login();
      return null; // This will redirect the browser
    }

    // Get the LINE ID token
    const lineIdToken = liff.getIDToken();

    // Call Firebase Function to authenticate the LINE user
    const authenticateLine = firebase
      .functions()
      .httpsCallable("authenticateLineUser");
    const result = await authenticateLine({ idToken: lineIdToken });

    // Sign in to Firebase with the custom token
    const userCredential = await firebase
      .auth()
      .signInWithCustomToken(result.data.firebaseToken);

    // User document has been created/updated by the Cloud Function
    return userCredential.user;
  } catch (error) {
    console.error("LINE sign-in failed:", error);
    throw error;
  }
}
```

### 3. Firestore User Data Structure

The user data in Firestore follows this schema for multi-provider support:

```javascript
// users/{userId} document
{
  uid: "line:line_user_id",              // Prefixed UID for provider identification
  displayName: "User Display Name",      // User's primary display name
  pictureUrl: "https://...",               // Profile photo URL
  createdAt: timestamp,                  // Account creation timestamp
  lastLogin: timestamp,                  // Last login timestamp

  // Auth providers section - stores all linked providers
  providers: {
    line: {
      userId: "line_user_id",            // LINE user ID
      displayName: "LINE Display Name",  // Name from LINE
      pictureUrl: "https://...",           // Photo from LINE
      email: "line_email@example.com",   // Email if available
      lastLogin: timestamp,              // Last LINE login
      linkedAt: timestamp                // When LINE was first linked
    },
    // Additional providers can be added here as needed
    google: {
      userId: "google_user_id",
      // ... other Google-specific user data
    }
  },

  // User settings (app preferences)
  settings: {
    theme: "dark",
    notifications: true,
    // Other app-specific settings
  },

  // User profile (editable information)
  profile: {
    bio: "User bio text",
    location: "Tokyo, Japan",
    // Other profile fields
  }
}
```

### 4. Firestore Security Rules

Implement these security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only access their own documents
      allow read: if request.auth != null && request.auth.uid == userId;

      // For writes, prevent modification of critical fields
      allow write: if request.auth != null && request.auth.uid == userId &&
                    (!request.resource.data.diff(resource.data).affectedKeys()
                      .hasAny(['uid', 'createdAt']));
    }

    // Additional collection rules for user-specific data
    match /userContent/{document} {
      allow read, write: if request.auth != null &&
                           request.auth.uid == resource.data.userId;
    }
  }
}
```

## Adding Future Authentication Providers

To add additional authentication providers:

1. Create a new Cloud Function for each provider (e.g., `authenticateGoogleUser`)
2. Follow a similar pattern of:
   - Verifying the provider's token/credentials
   - Creating/updating Firebase custom auth
   - Updating the user's Firestore document with provider information

Example of a Google authentication function:

```javascript
exports.authenticateGoogleUser = functions.https.onCall(
  async (data, context) => {
    try {
      const googleIdToken = data.idToken;

      // Verify Google token
      const googleUser = await verifyGoogleToken(googleIdToken);

      // Check if user already exists with a different provider
      const existingUserByEmail = await findUserByEmail(googleUser.email);

      let uid;
      if (existingUserByEmail) {
        // Use existing user's UID if found
        uid = existingUserByEmail.uid;
      } else {
        // Create new UID for Google user
        uid = `google:${googleUser.sub}`;
      }

      // Create Firebase custom token
      const firebaseToken = await admin.auth().createCustomToken(uid);

      // Update Firestore user document with Google provider info
      const userRef = admin.firestore().collection("users").doc(uid);

      // Update or create user document and add Google provider
      // [Similar pattern to LINE authentication]

      return {
        firebaseToken,
        userProfile: {
          /* ... */
        },
      };
    } catch (error) {
      console.error("Error authenticating Google user:", error);
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);
```

## Handling Multi-Provider Authentication

When users authenticate with multiple providers, consider these scenarios:

1. **Same User, Different Providers**:

   - Detect by matching email addresses across providers
   - Link providers to the same user document
   - Maintain a single UID for the user across all providers

2. **Account Linking**:
   - For existing users, offer account linking functionality
   - Update the providers map with each new authentication method
   - Preserve user preferences and data across all login methods

## Environment Setup

Required environment variables:

- `LINE_CHANNEL_ID`: Your LINE Channel ID
- `LINE_CHANNEL_SECRET`: Your LINE Channel Secret
- `REACT_APP_LIFF_ID`: Your LIFF ID for client-side
- Firebase project configuration

Note: The implementation uses native `fetch()` instead of external HTTP libraries to reduce bundle size and dependencies in the Cloud Functions.

## Deployment

1. Deploy the Cloud Function to Firebase:

   ```
   firebase deploy --only functions
   ```

2. Deploy Firestore security rules:

   ```
   firebase deploy --only firestore:rules
   ```

3. Build and deploy the client application as per your frontend framework

## Security Considerations

- **Token Verification**: Always verify provider tokens on the server side
- **Rate Limiting**: Implement rate limiting on authentication functions
- **Error Logging**: Set up proper error logging for authentication issues
- **Data Validation**: Validate all user data before storing in Firestore
- **Timeouts**: Set appropriate timeouts for authentication processes

## Testing

Test the following scenarios:

1. New user authentication with LINE
2. Returning user authentication
3. Error cases (invalid tokens, network failures)
4. Security rule effectiveness
5. Multi-device login
