import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from '../firebase/firebaseConfig'; // Default import for 'app'
import { ContentState, ThemeSettings, initialContentState, initialThemeSettings } from '../types';

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
    const [error, setError] = useState<Error | null>(null); // <--- CORRECTED THIS LINE
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
    }, [app]); // Depend on 'app' to ensure it's initialized

    // Effect to listen for real-time updates from Firebase
    useEffect(() => {
        if (!contentRef || !themeRef) return; // Wait for refs to be initialized

        setLoading(true);
        setError(null); // Clear error on new fetch attempt

        // Listener for content data
        const unsubscribeContent = onValue(contentRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setContent(prevContent => ({ ...initialContentState, ...data }));
            } else {
                console.log("No content data found in Firebase, initializing with default.");
                setContent(initialContentState);
                set(contentRef, initialContentState).catch(e => console.error("Failed to set initial content:", e));
            }
            // Do not set loading to false here, wait for both listeners or a combined flag
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
                console.log("No theme settings found in Firebase, initializing with default.");
                setThemeSettings(initialThemeSettings);
                set(themeRef, initialThemeSettings).catch(e => console.error("Failed to set initial theme settings:", e));
            }
            setLoading(false); // Set loading to false once theme is fetched (assuming content is also done or will be)
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
    const saveContentToDb = async (newContent: ContentState, newTheme: ThemeSettings) => {
        if (!contentRef || !themeRef) { // Check both refs before attempting to save
            console.error("Firebase Realtime Database references not initialized.");
            throw new Error("Database references not initialized.");
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
    };

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