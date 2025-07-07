import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from '../firebase/firebaseConfig'; // Default import for 'app'
import { ContentState, ThemeSettings, initialContentState, initialThemeSettings, Project } from '../types';

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

    // Initialize Firebase Realtime Database
    useEffect(() => {
        if (app) {
            const dbInstance = getDatabase(app);
            setDatabase(dbInstance);
            setContentRef(ref(dbInstance, 'websiteData/content'));
            setThemeRef(ref(dbInstance, 'websiteData/themeSettings'));
        }
    }, []); // Removed app from dependency array as it's a static import

    // Effect to listen for real-time updates from Firebase
    useEffect(() => {
        if (!contentRef || !themeRef) return; // Wait for refs to be initialized

        setLoading(true);
        setError(null); // Clear error on new fetch attempt

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
                // Safely convert projects object to array if it exists and is an object
                const projectsData = data.latestProjects?.projects;
                const projectsArray = projectsData
                    ? (Array.isArray(projectsData)
                        ? projectsData // Already an array
                        : Object.values(projectsData) as Project[]) // Convert object to array
                    : []; // Default to empty array if no projects data or it's empty

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
                // Removed the problematic set(contentRef, initialContentState) here
                // Initial data should be written once, not on every onValue callback if not found.
            }
            contentLoaded = true;
            checkAllLoaded();
        }, (dbError) => {
            console.error("Firebase content fetch error:", dbError);
            setError(new Error(dbError.message));
            setLoading(false); // Set loading false if error occurs
        });

        // Listener for theme settings
        const unsubscribeTheme = onValue(themeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setThemeSettings(prevTheme => ({ ...initialThemeSettings, ...data }));
            } else {
                console.log("No theme settings found in Firebase, initializing with default client-side.");
                setThemeSettings(initialThemeSettings);
                // Removed the problematic set(themeRef, initialThemeSettings) here
            }
            themeLoaded = true;
            checkAllLoaded();
        }, (dbError) => {
            console.error("Firebase theme fetch error:", dbError);
            setError(new Error(dbError.message));
            setLoading(false); // Set loading false if error occurs
        });

        // Cleanup function to detach listeners when the component unmounts
        return () => {
            unsubscribeContent();
            unsubscribeTheme();
        };
    }, [contentRef, themeRef]); // Depend on refs to re-run effect when they are set

    // Function to save content and theme settings to Firebase Realtime Database
    // Using useCallback to memoize the function, good for performance
    const saveContentToDb = useCallback(async (newContent: ContentState, newTheme: ThemeSettings) => {
        if (!contentRef || !themeRef) { // Check both refs before attempting to save
            console.error("Firebase Realtime Database references not initialized.");
            throw new Error("Database references not initialized.");
        }
        try {
            // When saving, if newContent.latestProjects.projects is an array,
            // Firebase will automatically convert it to an object with integer keys.
            // This is generally acceptable when using `set` on the parent node.
            await Promise.all([
                set(contentRef, newContent),
                set(themeRef, newTheme)
            ]);
            console.log("Content and theme settings saved to Firebase successfully!");
        } catch (saveError) {
            console.error("Error saving data to Firebase:", saveError);
            throw saveError;
        }
    }, [contentRef, themeRef]); // Depend on refs

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