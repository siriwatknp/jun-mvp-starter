# Jun MVP Starter

This is a starter project for building MVP (minimal viable product) for Thai users.

The starter provides you:

- Authentication flow via Line login and store user to Fibase auth.
- React Contect and hook to get the status and data from the authentication flow.
- The user data is kept in Firestore database with minimal secure rules (only the user can access their own data).
- Ready-to-use static site generation with Next.js that deploys on Firebase hosting via Github actions.
- Configured TypeScript

## Demo

You can try the demo here: [Jun MVP starter demo](https://jun-mvp-starter.web.app)

<!-- TODO: add a video -->

## Prerequisite

Before you begin, you'll need to set up the following accounts and services:

### GitHub account

1. Go to [GitHub.com](https://github.com) and click "Sign up"
2. Enter your email, create a password, and choose a username
3. Verify your account through the email you receive
4. Complete any additional verification steps if prompted

### Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and enter a project name
3. Choose whether to enable Google Analytics (optional)
4. Click "Create project" and wait for setup to complete
5. On the project overview page, click the web icon (</>) to add a web app
6. Enter a nickname for your app (e.g., "My MVP Web")
7. Check the "Also set up Firebase Hosting" option
8. Click "Register app" and continue through the setup
9. Enable Firestore Database:
   - In the left sidebar, click "Firestore Database"
   - Click "Create database"
   - Keep the default name and choose location `asia-southeast1 (Singapore)`.
   - Start in production mode

### LINE LIFF project

1. Create a LINE Developer account:

   - Go to [LINE Developers Console](https://developers.line.biz/console/)
   - Sign in with your LINE account or create one if needed
   - Create a new provider if you don't have one (click "Create" next to Providers)
   - Enter a provider name and click "Create"

2. Create a new channel:

   - At the selected provider, click "Create a new channel"
   - Choose "LINE Login"
   - Fill in required information and click "Create" at the end of the form

3. Set up LIFF app:
   - In your channel, go to the LIFF tab
   - Click "Add" to create a new LIFF app
   - Enter the following details:
     - LIFF app name: Your app name
     - Size: Full (or choose another size based on your needs)
     - Endpoint URL: `https://localhost:4416`
     - Scopes: Check "profile" and "openid"
   - Click "Add"
   - Note your LIFF ID for later use in [environment variables](#environment-variables)

## Get started

Please follow the [Prerequisite](#prerequisite) first.

After you clone the project to your local machine, do the following:

### Environment variables

There are 2 places to configure the env variables:

- `.env.local` for Next.js (frontend)
- `functions/.secret.local` for Firebase Cloud Functions (backend)

> the env files are for local only, they are ignored from git.

**.env.local**

Duplicate file `.env.example` and rename to `.env.local`, then update the content of the file with the following variables:

- `*_FIREBASE_*`: You can find these variables from [Firebase console](https://console.firebase.google.com/u/0/project/scrappy-prod/settings/general/web).
- `NEXT_PUBLIC_LINE_LIFF_ID`: access the LINE Developers Console, select your provider and channel, then locate the LIFF ID under Basic settings after adding the LIFF app to your channel.

**functions/.secret.local**

Duplicate file `functions/.secret.example` and rename to `.secret.local`, then update the content of the file with the following variables:

- `LINE_CHANNEL_ID`: log into the LINE Developers Console, navigate to your Messaging API channel, and then go to the "Basic settings" tab; your Channel ID will be displayed there.

### Run locally

1. Install dependencies

```bash
npm install
```

2. Run development

Next.js app:

```bash
npm run dev
```

Then open another terminal for the local backend:

```bash
npm run emulators
```

> Both support hot-reloading

- Frontend is running on port `https://localhost:4416`
- Backend (GUI) is running on port `http://localhost:4000`

## Go Production

You just need to configure the production env to work with Github actions and deployment to Firebase hosting.

Follow the following configuration before you commit/push the code to the `main` branch.

### Line channel

Create a new channel for production (it's the same [steps](#line-liff-project) you did).

You can add the "Endpoint URL" later. You will know the url after the first production deployment by going to Firebase console hosting page.

### Github

To add a GitHub Actions secret, navigate to your repository's "Settings," then "Secrets and variables", click "Actions," and finally "New repository secret" to enter the secret name and value.

Use the same variables as in `.env.local`. Fore Firebase variables, the values can be the same as the `.env.local` file.

However, it's recommended to create a different Line channel from the one you use for local development.

**Firebase token for frontend deployment**

you can get the value by running `firebase login:ci` and use the value returned from the command.

Add the secret with name `FIREBASE_TOKEN` and use the value from the command.

**Service account for backend deployment**

In the Firebase console, open Settings > Service Accounts. Click Generate New Private Key, then confirm by clicking Generate Key.

Save the file to the root of the project (it will be ignored from git, do not change the file name).

Add the secret with name `FIREBASE_SERVICE_ACCOUNT` and use the value the service account file (copy the JSON content and paste to the value input).

### Firebase

**Secrets for cloud functions**

To add Firebase secrets through the CLI, navigate to your project directory, run:

```bash
firebase functions:secrets:set LINE_CHANNEL_ID
```

> If you haven't logged in, run `firebase login` first.

Then enter the secret value (the Line channel ID for production). You can check the added value by running `firebase functions:secrets:access LINE_CHANNEL_ID`.

### Rules

- Copy the rules from `firestore.rules` file
- Open Firebase console > Firestore > Rules tab
- Paste the existing rules and save

## Project structure

The project follows a standard Next.js application structure with additional Firebase configuration:

```
├── src/                      # Source code
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── layout.tsx        # Root layout component
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/               # UI components (shadcn/ui)
│   │   └── WelcomeDialog.tsx # User welcome dialog
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context provider
│   ├── lib/                  # Utility libraries
│   │   ├── firebase.ts       # Firebase configuration and utilities
│   │   └── utils.ts          # General utility functions
│   └── server-types.d.ts     # TypeScript definitions for server types
├── functions/                # Firebase Cloud Functions
│   ├── src/                  # Cloud Functions source code
│   │   └── index.ts          # Main functions entry point (LINE auth)
│   └── lib/                  # Functions utility libraries
├── public/                   # Static assets
├── .github/workflows/        # GitHub Actions workflows
│   ├── web-release.yml       # Production deployment workflow
│   ├── web-pr-preview.yml    # PR preview deployment workflow
│   └── deploy-functions.yml  # Functions deployment workflow
├── .env.example              # Example environment variables
├── .env.local                # Local environment variables (git-ignored)
├── firebase.json             # Firebase configuration
├── firestore.rules           # Firestore security rules
└── next.config.ts            # Next.js configuration
```

### Key directories and files

- **src/app**: Contains the Next.js application using the App Router
- **src/components**: Reusable React components
- **src/contexts/AuthContext.tsx**: Manages authentication state and user data
- **src/lib/firebase.ts**: Firebase configuration and utility functions
- **functions/src/index.ts**: Cloud Functions for LINE authentication
- **.github/workflows**: CI/CD pipelines for automated deployment
- **firestore.rules**: Security rules for Firestore database

## Authentication flow

The authentication flow integrates LINE Login with Firebase Authentication:

1. **LIFF Initialization**: The app initializes the LINE LIFF SDK and checks if the user is already logged in.

2. **LINE Login**: When a user clicks the login button, they're redirected to LINE's login page. After successful login, they're redirected back with authentication tokens.

3. **Firebase Integration**: The app sends the LINE ID token to a Firebase Cloud Function, which verifies it and creates a Firebase custom token. It also creates or updates the user's document in Firestore.

4. **User Session**: The app signs in to Firebase using the custom token and loads the user profile data from Firestore. Authentication state is maintained using React context.

5. **Logout Process**: When logging out, the app signs out from both Firebase and LINE, and the UI is updated to show the login button again.

## API

### `AuthProvider`

A React context provider that manages authentication state and user data.

```jsx
// Wrap your app with AuthProvider
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### `useAuth`

A React hook that provides access to authentication state and functions.

```jsx
import { useAuth } from "@/contexts/AuthContext";

function YourComponent() {
  const {
    // Authentication status
    authStatus, // Current auth status: "idle" | "authenticating" | "fetchingProfile" | "error"
    isNewUser, // Whether the user is new (first login)
    shouldShowLogin, // Whether to show the login button

    // User data
    authUser, // Firebase Auth user object
    userProfile, // User profile data from Firestore
    lineProfile, // LINE profile data

    // Authentication actions
    login, // Function to trigger LINE login
    logout, // Function to sign out from both Firebase and LINE
  } = useAuth();

  // Use these values and functions in your component
}
```

## Why I pick these tools

Fatest POC with no cost!

- Line Login because it's a very popular chat app that most Thai people use. It has other powerful features when you scale the app.
- Next.js offers a simple config (just one flag) to generate static pages.
  - I prefer SSG over SSR because it's simpler for MVP which is more flexible to pick CDN and cost effective.
- Firebase hosting over Vercel because Vercel will charge you $25 for each new team members.
- Firebase custom token because it's the only way to create users from Line with free tier applied. Another way is to use [Open ID connect](https://firebase.google.com/docs/auth/web/openid-connect) which simplifies the auth flow because you no longer need the cloud function but it might cost a lot of money, see [Tier 2 pricing](https://cloud.google.com/identity-platform/pricing#pricing_table).
