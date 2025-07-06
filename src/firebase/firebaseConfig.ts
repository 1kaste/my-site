import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app: firebase.app.App | null = null;
let authInstance: firebase.auth.Auth | null = null;

// Only initialize Firebase if the API key is provided. This prevents the app from
// crashing when config is not filled out.
if (firebaseConfig.apiKey) {
    try {
        // Check if Firebase has already been initialized to avoid re-initialization errors.
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.app(); // Get the already-initialized app
        }
        authInstance = firebase.auth();
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        // Ensure authInstance remains null if initialization fails.
        authInstance = null;
    }
} else {
    console.warn("Firebase credentials not set in environment variables. Authentication features will be disabled.");
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = authInstance;
export default app;
