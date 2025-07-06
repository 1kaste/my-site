import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { config } from '../../config';

const firebaseConfig = config.FIREBASE_CONFIG;

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
    console.warn("Firebase credentials not set in config.ts. Authentication features will be disabled.");
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = authInstance;
export default app;
