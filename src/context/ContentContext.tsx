import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from '../firebase/firebaseConfig'; // Default import for 'app'
import { ContentState, ThemeSettings, initialContentState, initialThemeSettings, Project } from '../types';
import { useAuth } from '../hooks/useAuth'; // <-- NEW: Import useAuth hook

// Define the shape of your context data, including the new saveContentToDb function
interface ContentContextType {
    content: ContentState;
    themeSettings: ThemeSettings;
    loading: boolean;
    error: Error | null;
    saveContentToDb: (newContent: ContentState, newTheme: ThemeSettings) => Promise<void>;
}

// Create the context with a default undefined value
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<ContentState>(initialContentState);
    const [themeSettings, setThemeSettings] = useState<ThemeSettings>(initialThemeSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [database, setDatabase] = useState<any>(null);
    const [contentRef, setContentRef] = useState<any>(null);
    const [themeRef, setThemeRef] = useState<any>(null);

    // NEW: Get user and authentication loading status from useAuth
    const { user, loading: authLoading } = useAuth();

    // Initialize Firebase Realtime Database references
    useEffect(() => {
        if (app) {
            const dbInstance = getDatabase(app);
            setDatabase(dbInstance);
            setContentRef(ref(dbInstance, 'websiteData/content'));
            setThemeRef(ref(dbInstance, 'websiteData/themeSettings'));
        }
    }, []); // app is a static import, so no need for it in dependencies

    // Effect to listen for real-time updates from Firebase
    useEffect(() => {
        // Only attach listeners if refs are initialized AND if there is an authenticated user (user is not null)
        // If authLoading is true, it means we are still determining auth status, so wait.
        if (!contentRef || !themeRef || !user || authLoading) {
            // If auth is loaded and no user, and we're trying to fetch protected data,
            // set an error indicating authentication is needed.
            if (!user && !authLoading) {
                setError(new Error("Authentication required to load protected content."));
                setLoading(false); // Stop loading if authentication is missing
            }
            return; // Do not proceed with fetching if conditions are not met
        }

        setLoading(true);
        setError(null); // Clear previous errors on new fetch attempt

        let contentLoaded = false;
        let themeLoaded = false;

        const checkAllLoaded = () => {
            if (contentLoaded && themeLoaded) {
                setLoading(false);
            }
        };

        // Listener for content data
        const unsubscribeContent = onValue(contentRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const projectsData = data.latestProjects?.projects;
                const projectsArray = projectsData
                    ? (Array.isArray(projectsData)
                        ? projectsData
                        : Object.values(projectsData) as Project[])
                    : [];

                setContent(prevContent => ({
                    ...initialContentState,
                    ...data,
                    latestProjects: {
                        ...data.latestProjects,
                        projects: projectsArray
                    }
                }));
            } else {
                console.log("No content data found in Firebase, initializing with default client-side.");
                setContent(initialContentState);
            }
            contentLoaded = true;
            checkAllLoaded();
        }, (dbError) => {
            console.error("Firebase content fetch error:", dbError);
            setError(new Error(dbError.message));
            setLoading(false);
        });

        // Listener for theme settings
        const unsubscribeTheme = onValue(themeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setThemeSettings(prevTheme => ({ ...initialThemeSettings, ...data }));
            } else {
                console.log("No theme settings found in Firebase, initializing with default client-side.");
                setThemeSettings(initialThemeSettings);
            }
            themeLoaded = true;
            checkAllLoaded();
        }, (dbError) => {
            console.error("Firebase theme fetch error:", dbError);
            setError(new Error(dbError.message));
            setLoading(false);
        });

        // Cleanup function to detach listeners when the component unmounts or dependencies change
        return () => {
            unsubscribeContent();
            unsubscribeTheme();
        };
    }, [contentRef, themeRef, user, authLoading]); // <-- IMPORTANT: Add 'user' and 'authLoading' to dependencies

    // Function to save content and theme settings to Firebase Realtime Database
    const saveContentToDb = useCallback(async (newContent: ContentState, newTheme: ThemeSettings) => {
        if (!contentRef || !themeRef || !user) { // Ensure refs and user are available before saving
            console.error("Cannot save: Database references not initialized or user not authenticated.");
            throw new Error("Cannot save: User not authenticated or database not ready.");
        }
        try {
            await Promise.all([
                set(contentRef, newContent),
                set(themeRef, newTheme)
            ]);
            console.log("Content and theme settings saved to Firebase successfully!");
        } catch (saveError) {
            console.error("Error saving data to Firebase:", saveError);
            throw saveError;
        }
    }, [contentRef, themeRef, user]); // Add 'user' to dependencies for save function too

    const contextValue = {
        content,
        themeSettings,
        loading,
        error,
        saveContentToDb,
    };

    return (
        <ContentContext.Provider value={contextValue}>
            {children}
        </ContentContext.Provider>
    );
};
