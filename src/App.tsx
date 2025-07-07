import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
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


const AppContent: React.FC = () => {
    const [isLoginVisible, setLoginVisible] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const { themeSettings } = useContent();
    const [isAdminPanelVisible, setAdminPanelVisible] = useState(false);
    // Initialize route directly from the URL hash. Fallback to '#/' for the homepage.
    const [route, setRoute] = useState(() => window.location.hash || '#/');

    useEffect(() => {
        const emailJsPublicKey = config.EMAILJS_PUBLIC_KEY;
        // Initialize EmailJS
        if (emailJsPublicKey) {
            emailjs.init({ publicKey: emailJsPublicKey });
        } else {
            console.warn("EmailJS Public Key is not set in config.ts. Contact form will run in demo mode.");
        }

        // Apply theme settings as CSS variables
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

    // This effect only listens for subsequent hash changes after the initial load.
    useEffect(() => {
        const handleHashChange = () => {
            // We always want a hash, default to '#/' for the homepage.
            setRoute(window.location.hash || '#/');
        };

        window.addEventListener('hashchange', handleHashChange);
        
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []); // Run only once on mount

    // This effect handles all navigation/scrolling behaviors when the route changes.
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const hash = route;
        const projectDetailMatch = hash.match(/^#\/project\/(.+)$/);
        const isLegalPage = hash.startsWith('#/privacy-policy') || hash.startsWith('#/terms-of-service');
        const isContactPage = hash.startsWith('#/contact');
        const isProjectsPage = hash.startsWith('#/projects');

        const isHomePageSectionAnchor = !isProjectsPage && !projectDetailMatch && !isLegalPage && !isContactPage && hash.length > 1 && hash !== '#/';

        if (isHomePageSectionAnchor) {
            // This logic is specifically for scrolling to sections on the homepage.
            // The `setTimeout` is a safeguard to ensure the HomePage component has had time to render
            // and the target element is available in the DOM, especially when navigating from a different "page".
            setTimeout(() => {
                const id = hash.substring(1);
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Fallback: If after a delay the element still doesn't exist,
                    // scroll to the top of the current page to prevent a broken state.
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100); 
        } else {
            // For all other cases (e.g., navigating to #/projects, #/contact, or just #),
            // simply scroll to the top of the page.
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [route]); // Depend on `route` state


    const showLogin = () => setLoginVisible(true);
    const closeLogin = () => setLoginVisible(false);

    const showAdminPanel = () => {
        if(user) {
            setAdminPanelVisible(true);
            closeLogin();
        }
    };
    const closeAdminPanel = () => setAdminPanelVisible(false);

    const renderPage = () => {
        const projectDetailMatch = route.match(/^#\/project\/(.+)$/);
        if (projectDetailMatch) {
            return <ProjectDetailPage projectId={projectDetailMatch[1]} />;
        }

        if (route.startsWith('#/projects')) {
            return <ProjectsPage />;
        }

        if (route.startsWith('#/privacy-policy')) {
            return <PrivacyPolicyPage />;
        }

        if (route.startsWith('#/terms-of-service')) {
            return <TermsOfServicePage />;
        }

        if (route.startsWith('#/contact')) {
            return <ContactPage />;
        }
        
        return <HomePage />;
    };

    return (
        <>
            <Layout showAdminLogin={showLogin} showAdminPanel={showAdminPanel}>
                {renderPage()}
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
    <ThemeProvider>
        <AuthProvider>
            <ContentProvider>
                <AppContent />
            </ContentProvider>
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
