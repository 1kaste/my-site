
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ContentData, ThemeSettings } from '../types';
import { initialContent, initialTheme } from '../data/mockData';

interface ContentContextType {
    content: ContentData;
    setContent: React.Dispatch<React.SetStateAction<ContentData>>;
    themeSettings: ThemeSettings;
    setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);


export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<ContentData>(() => {
        try {
            const storedContent = localStorage.getItem('siteContent');
            return storedContent ? JSON.parse(storedContent) : initialContent;
        } catch (error) {
            console.error("Failed to parse content from localStorage", error);
            return initialContent;
        }
    });

    const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
        try {
            const storedTheme = localStorage.getItem('siteThemeSettings');
            return storedTheme ? JSON.parse(storedTheme) : initialTheme;
        } catch (error) {
            console.error("Failed to parse theme settings from localStorage", error);
            return initialTheme;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('siteContent', JSON.stringify(content));
        } catch (error) {
            console.error("Failed to save content to localStorage", error);
        }
    }, [content]);

    useEffect(() => {
        try {
            localStorage.setItem('siteThemeSettings', JSON.stringify(themeSettings));
        } catch (error) {
            console.error("Failed to save theme settings to localStorage", error);
        }
    }, [themeSettings]);


    return (
        <ContentContext.Provider value={{ content, setContent, themeSettings, setThemeSettings }}>
            {children}
        </ContentContext.Provider>
    );
};