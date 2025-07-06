import React from 'react';
import { motion, useScroll, useSpring, MotionProps } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../widgets/WhatsAppButton';
import AIAssistant from '../widgets/AIAssistant';
import ScrollToTopButton from '../ui/ScrollToTopButton';

interface LayoutProps {
    children: React.ReactNode;
    showAdminLogin: () => void;
    showAdminPanel: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, showAdminLogin, showAdminPanel }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const progressBarProps: MotionProps = {
        style: { scaleX }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans text-custom-text-base">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary origin-left z-[60]"
                {...progressBarProps}
            />
            <Header onLogoTripleTap={showAdminLogin} onAdminIconClick={showAdminPanel} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <AIAssistant />
            <ScrollToTopButton />
        </div>
    );
};

export default Layout;