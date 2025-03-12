# Familee

Familee is a family tree visualization application that lets people create family groups and invite members to visualize as a tree.

## Features

- **Line Login Authentication**: Secure authentication using Line's OAuth system
- **Family Management**: Create and manage family groups, invite members
- **Family Tree Visualization**: Interactive family tree display
- **Member Management**: Add and edit family member profiles, define relationships

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: TailwindCSS
- **Database**: Firestore
- **Authentication**: Line Login + Firebase Custom Authentication
- **Backend**: Firebase Cloud Functions (Node.js 20 with TypeScript and ES modules)

## Prerequisites

- Node.js 18+ for Next.js, Node.js 20+ for Cloud Functions
- npm
- Firebase project with Firestore, Authentication, and Cloud Functions enabled
- Line Developer account with a LIFF app

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/familee-poc.git
cd familee-poc
```

2. Install dependencies:

```bash
npm install
cd functions
npm install
cd ..
```

3. Set up environment variables:

For the client:

```bash
cp .env.local.example .env.local
```

For Firebase Cloud Functions:

```bash
cd functions
cp .env.example .env
cd ..
```

4. Set up Line Login:

- Create a Line Login channel in the [Line Developer Console](https://developers.line.biz/)
- Create a LIFF app and note the LIFF ID
- Set the callback URL to your app's URL (e.g., `http://localhost:3000`)
- Enable "ID Token" in the LIFF settings

5. Set up Firebase:

- Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication with "Custom Authentication"
- Set up Firestore database
- Enable Cloud Functions with Node.js 20 runtime
- Add your LINE Channel ID to the Cloud Functions environment variables
- Set up secrets for Firebase Functions:

```bash
firebase functions:secrets:set LINE_CHANNEL_ID
```

## Development

You can run the development servers using the following commands:

### Run Next.js development server only:

```bash
npm run dev
```

### Build Cloud Functions TypeScript:

```bash
npm run build:functions
```

### Run Firebase Emulators

The project is configured to run Firebase emulators for local development. This allows you to test your application without connecting to the actual Firebase services.

#### Run all emulators (Functions, Firestore, Authentication):

```bash
npm run emulators
```

#### Run only Functions emulator:

```bash
npm run emulators:functions
```

#### Run only Firestore emulator:

```bash
npm run emulators:firestore
```

#### Run only Authentication emulator:

```bash
npm run emulators:auth
```

#### Run Next.js and all Firebase emulators together:

```bash
npm run dev:all
```

The Firebase Emulator UI is available at [http://localhost:4000](http://localhost:4000), where you can:

- View and manage Firestore data
- Manage Authentication users
- Monitor Cloud Functions
- View logs for all emulated services

### Emulator Ports

- **Firestore**: [http://localhost:8080](http://localhost:8080)
- **Authentication**: [http://localhost:9099](http://localhost:9099)
- **Functions**: [http://localhost:5001](http://localhost:5001)
- **Emulator UI**: [http://localhost:4000](http://localhost:4000)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Next.js application.

## Authentication Flow

1. User clicks "Login with Line" button
2. Line Login popup appears and user authenticates
3. Line returns an ID token
4. The ID token is sent to the Firebase Cloud Function
5. Cloud Function verifies the token with Line API
6. Cloud Function creates a Firebase custom token
7. Frontend uses the custom token to authenticate with Firebase
8. User is now authenticated and can access the application

## Deployment

### Deploy Firebase Cloud Functions

The Firebase Cloud Functions are written in TypeScript and need to be compiled before deployment. The deployment process is configured to automatically build the TypeScript code before deploying.

1. Test the build process before deployment:

```bash
npm run test:deploy
```

This will:

- Build the TypeScript code to JavaScript in the `functions/lib` directory
- Verify that everything is ready for deployment

2. Deploy the Firebase Cloud Functions:

```bash
npm run deploy:functions
```

This will:

- Build the TypeScript code to JavaScript in the `functions/lib` directory
- Deploy the compiled JavaScript to Firebase

### Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy the Next.js Application to Vercel

```bash
vercel
```

## License

[MIT](LICENSE)
