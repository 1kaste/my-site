import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from '../firebase/firebaseConfig'; // <--- CHANGED THIS LINE: Now it's a DEFAULT import
import { ContentState, ThemeSettings, initialContentState, initialThemeSettings } from '../types'; // Adjust 'initialContentState' and 'initialThemeSettings' as per your types.ts

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
    const [error, setError] = null; // Changed to null directly, not useState
    const [database, setDatabase] = useState<any>(null); // State for database instance
    const [contentRef, setContentRef] = useState<any>(null); // State for content ref
    const [themeRef, setThemeRef] = useState<any>(null); // State for theme ref


    // Initialize Firebase Realtime Database
    useEffect(() => {
        if (app) {
            const dbInstance = getDatabase(app);
            setDatabase(dbInstance);
            setContentRef(ref(dbInstance, 'websiteData/content'));
            setThemeRef(ref(dbInstance, 'websiteData/themeSettings'));
        }
    }, [app]); // Depend on 'app' to ensure it's initialized

    // Effect to listen for real-time updates from Firebase
    useEffect(() => {
        if (!contentRef || !themeRef) return; // Wait for refs to be initialized

        setLoading(true);
        setError(null);

        // Listener for content data
        const unsubscribeContent = onValue(contentRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Merge fetched data with initial state to ensure all fields are present
                setContent(prevContent => ({ ...initialContentState, ...data }));
            } else {
                // If no data exists, use initialContentState and save it to DB
                console.log("No content data found in Firebase, initializing with default.");
                setContent(initialContentState);
                set(contentRef, initialContentState).catch(e => console.error("Failed to set initial content:", e));
            }
            // setLoading(false); // Don't set loading to false here, wait for both listeners
        }, (dbError) => {
            console.error("Firebase content fetch error:", dbError);
            setError(new Error(dbError.message));
            setLoading(false);
        });

        // Listener for theme settings
        const unsubscribeTheme = onValue(themeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Merge fetched data with initial settings to ensure all fields are present
                setThemeSettings(prevTheme => ({ ...initialThemeSettings, ...data }));
            } else {
                // If no data exists, use initialThemeSettings and save it to DB
                console.log("No theme settings found in Firebase, initializing with default.");
                setThemeSettings(initialThemeSettings);
                set(themeRef, initialThemeSettings).catch(e => console.error("Failed to set initial theme settings:", e));
            }
            setLoading(false); // Set loading to false once theme is fetched (assuming content is also done or will be)
        }, (dbError) => {
            console.error("Firebase theme fetch error:", dbError);
            setError(new Error(dbError.message));
            setLoading(false);
        });

        // Cleanup function to detach listeners when the component unmounts
        return () => {
            unsubscribeContent();
            unsubscribeTheme();
        };
    }, [contentRef, themeRef]); // Depend on refs to re-run effect when they are set

    // Function to save content and theme settings to Firebase Realtime Database
    const saveContentToDb = async (newContent: ContentState, newTheme: ThemeSettings) => {
        if (!database) {
            console.error("Firebase Realtime Database not initialized.");
            throw new Error("Database not initialized.");
        }
        try {
            // Use Promise.all to save both content and theme settings concurrently
            await Promise.all([
                set(contentRef, newContent),
                set(themeRef, newTheme)
            ]);
            // The onValue listeners will automatically update the state,
            // so no need to call setContent or setThemeSettings here.
            console.log("Content and theme settings saved to Firebase successfully!");
        } catch (saveError) {
            console.error("Error saving data to Firebase:", saveError);
            throw saveError; // Re-throw to allow component to handle the error
        }
    };

    const contextValue = {
        content,
        themeSettings,
        loading,
        error,
        saveContentToDb, // Expose the save function through the context
    };

    return (
        <ContentContext.Provider value={contextValue}>
            {children}
        </ContentContext.Provider>
    );
};