import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // NEW IMPORTS
import { ThemeProvider } from './context/ThemeContext';
// REMOVED: AuthProvider and ContentProvider imports (they are now imported in main.tsx)
import Layout from './components/core/Layout';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ContactPage from './pages/ContactPage';
import { useTheme } from './hooks/useTheme';
import { useContent } from './hooks/useContent';


// This component now contains all the actual routing logic and page rendering
const AppContent: React.FC = () => {
    const [isLoginVisible, setLoginVisible] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const { themeSettings } = useContent();
    const [isAdminPanelVisible, setAdminPanelVisible] = useState(false);
    const location = useLocation(); // NEW: Hook to get current location from React Router DOM

    // Initialize EmailJS and apply theme settings as CSS variables (KEEP THIS)
    useEffect(() => {
        const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (emailJsPublicKey) {
            emailjs.init({ publicKey: emailJsPublicKey });
        } else {
            console.warn("EmailJS Public Key (VITE_EMAILJS_PUBLIC_KEY) is not set in environment variables. Contact form will run in demo mode.");
        }

        const root = document.documentElement;
        root.style.setProperty('--color-brand-primary', themeSettings.primaryColor);
        root.style.setProperty('--color-brand-secondary', themeSettings.secondaryColor);
        root.style.setProperty('--color-bg-light', themeSettings.lightModeBgColor);
        root.style.setProperty('--color-bg-dark', themeSettings.darkModeBgColor);
        root.style.setProperty('--color-glow', themeSettings.glowColor);
        root.style.fontFamily = themeSettings.font;
        
        if (theme === 'dark') {
            root.style.setProperty('--color-text-base', themeSettings.darkModeTextColor);
            root.style.setProperty('--color-heading', themeSettings.darkModeHeadingColor);
        } else {
            root.style.setProperty('--color-text-base', themeSettings.lightModeTextColor);
            root.style.setProperty('--color-heading', themeSettings.lightModeHeadingColor);
        }
    }, [theme, themeSettings]);

    // NEW: Scroll to section logic using useLocation for hash changes from React Router
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1); // Get ID without '#'
            const element = document.getElementById(id);
            if (element) {
                // Use setTimeout as a safeguard to ensure the element is rendered,
                // especially when navigating from a different "page" or refreshing directly to a hash.
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            // For all other cases (e.g., navigating to /projects, /contact, or just /),
            // simply scroll to the top of the page.
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]); // Re-run when location (path or hash) changes


    const showLogin = () => setLoginVisible(true);
    const closeLogin = () => setLoginVisible(false);

    const showAdminPanel = () => {
        if(user) {
            setAdminPanelVisible(true);
            closeLogin();
        }
    };
    const closeAdminPanel = () => setAdminPanelVisible(false);

    // REMOVED: renderPage function (it's replaced by <Routes>)

    return (
        <>
            <Layout showAdminLogin={showLogin} showAdminPanel={showAdminPanel}>
                {/* React Router DOM Routes now define your application's pages */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/project/:projectId" element={<ProjectDetailPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    {/* Catch-all route for unmatched paths (e.g., a simple 404 or redirect to home) */}
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </Layout>
            <AdminLogin 
                isOpen={isLoginVisible} 
                onClose={closeLogin}
                onLoginSuccess={showAdminPanel}
            />
            {user && (
                <AdminPanel
                    isOpen={isAdminPanelVisible}
                    onClose={closeAdminPanel}
                />
            )}
        </>
    );
};

const App: React.FC = () => {
  return (
    // ThemeProvider stays here to provide theme context
    <ThemeProvider>
        {/* BrowserRouter (aliased as Router) wraps AppContent to enable routing */}
        <Router> 
            <AppContent />
        </Router>
    </ThemeProvider>
    // AuthProvider and ContentProvider are expected to be provided higher up (e.g., in main.tsx)
  );
};

export default App;
