import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from '../firebase/firebaseConfig';
import { ContentState, ThemeSettings, initialContentState, initialThemeSettings, Project } from '../types';
import { useAuth } from '../hooks/useAuth'; // We still need this for save functionality and admin panel state

interface ContentContextType {
    content: ContentState;
    themeSettings: ThemeSettings;
    loading: boolean;
    error: Error | null;
    saveContentToDb: (newContent: ContentState, newTheme: ThemeSettings) => Promise<void>;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<ContentState>(initialContentState);
    const [themeSettings, setThemeSettings] = useState<ThemeSettings>(initialThemeSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [database, setDatabase] = useState<any>(null);
    const [contentRef, setContentRef] = useState<any>(null);
    const [themeRef, setThemeRef] = useState<any>(null);

    const { user, loading: authLoading } = useAuth(); // Still get user for write permissions in saveContentToDb

    // Initialize Firebase Realtime Database references
    useEffect(() => {
        if (app) {
            const dbInstance = getDatabase(app);
            setDatabase(dbInstance);
            setContentRef(ref(dbInstance, 'websiteData/content'));
            setThemeRef(ref(dbInstance, 'websiteData/themeSettings'));
        }
    }, []);

    // Effect to listen for real-time updates from Firebase
    useEffect(() => {
        // --- KEY CHANGE HERE ---
        // Only proceed if refs are initialized and auth is not still loading.
        // We removed the `!user` check because content and themeSettings are now publicly readable.
        if (!contentRef || !themeRef || authLoading) {
            // If auth is done loading and user is null, it just means they're not logged in,
            // which is fine for public reads.
            if (!authLoading && !user) {
                // We're ready to load public content. No specific error here for non-login.
            }
            // If we're still waiting for refs or authLoading, return.
            return;
        }
        // --- END KEY CHANGE ---

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
    }, [contentRef, themeRef, authLoading]); // --- KEY CHANGE: Removed 'user' from dependencies ---

    // Function to save content and theme settings to Firebase Realtime Database
    const saveContentToDb = useCallback(async (newContent: ContentState, newTheme: ThemeSettings) => {
        // Saving still requires an authenticated user (admin)
        if (!contentRef || !themeRef || !user) {
            console.error("Cannot save: Database references not initialized or user not authenticated.");
            throw new Error("Cannot save: User not authenticated.");
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
    }, [contentRef, themeRef, user]); // 'user' remains a dependency for saving

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
