// Firebase App (the core Firebase SDK)
import { initializeApp, getApps, getApp } from 'firebase/app';

// Firebase Authentication (for user login/admin panel)
import { getAuth } from 'firebase/auth';

// Firebase Realtime Database (for dynamic content storage)
import { getDatabase } from 'firebase/database';

// Your Firebase project configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional, if using Analytics
};

// Initialize Firebase App
// This checks if a Firebase app instance already exists to prevent re-initialization errors.
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // Get the already initialized app instance
}

// Initialize Firebase Authentication and export its instance
export const auth = getAuth(app);

// Initialize Firebase Realtime Database and export its instance
export const rtdb = getDatabase(app);

// Optional: Console warning if the API key isn't set (useful for debugging)
if (!firebaseConfig.apiKey) {
    console.warn("Firebase API Key (VITE_FIREBASE_API_KEY) not set in environment variables. Authentication and Database features might be disabled.");
}

// Export the Firebase app instance itself (can be useful for other Firebase services)
export default app;