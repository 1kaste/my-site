import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react'; // Import useCallback
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebase/firebaseConfig'; // Assuming 'auth' is correctly imported and initialized from firebaseConfig

interface AuthContextType {
  user: firebase.User | null;
  loading: boolean;
  signOut: () => Promise<void>; // Add signOut function to the context type
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // It's crucial that 'auth' is properly initialized before this runs.
    // If firebaseConfig.ts doesn't export 'auth' or it's undefined,
    // this check is good, but the app won't function correctly without auth.
    if (!auth) {
      console.error("Firebase Auth is not initialized. Check firebaseConfig.ts");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Implement the signOut function
  const signOut = useCallback(async () => {
    if (auth) { // Ensure auth is available before attempting to sign out
      await auth.signOut();
    } else {
      console.warn("Attempted to sign out, but Firebase Auth was not initialized.");
      // Optionally, handle this case for the user, e.g., throw an error or show a message
      throw new Error("Authentication service not available.");
    }
  }, []); // No dependencies needed for signOut if 'auth' is stable

  // Provide the signOut function in the context value
  const value = { user, loading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when loading is complete */}
    </AuthContext.Provider>
  );
};
