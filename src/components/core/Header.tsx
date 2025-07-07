import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, MotionProps } from 'framer-motion';
import { useContent } from '../../hooks/useContent';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { SunIcon, MoonIcon, AdminIcon, MenuIcon, CloseIcon } from '../ui/icons';
import { Link, useNavigate } from 'react-router-dom'; // NEW IMPORTS: Link and useNavigate

interface HeaderProps {
    onLogoTripleTap: () => void;
    onAdminIconClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoTripleTap, onAdminIconClick }) => {
    const { content } = useContent();
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [hidden, setHidden] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    // const navigate = useNavigate(); // useNavigate is not directly needed here unless you have complex programmatic navigation outside of simple Link clicks

    useMotionValueEvent(scrollY, "change", (latest) => {
      const previous = scrollY.getPrevious() || 0;
      if (latest > previous && latest > 150) {
        setHidden(true);
        setIsMenuOpen(false); // Close menu on scroll
      } else {
        setHidden(false);
      }
    });

    const tapCount = useRef(0);
    const tapTimer = useRef<number | null>(null);

    const handleLogoTap = () => {
        tapCount.current += 1;

        if (tapTimer.current) {
            clearTimeout(tapTimer.current);
        }

        if (tapCount.current === 3) {
            onLogoTripleTap();
            tapCount.current = 0;
        } else {
            tapTimer.current = window.setTimeout(() => {
                tapCount.current = 0;
            }, 1500);
        }
    };

    // REMOVED: handleNavClick function (it's no longer needed in its current form)

    const headerMotionProps: MotionProps = {
        variants: {
            visible: { y: 0 },
            hidden: { y: "-100%" },
        },
        animate: hidden ? "hidden" : "visible",
        transition: { duration: 0.35, ease: "easeInOut" }
    };

    const mobileMenuMotionProps: MotionProps = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <motion.header
            {...headerMotionProps}
            className="fixed top-0 left-0 right-0 z-50 w-full"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 bg-white/80 dark:bg-black/30 backdrop-blur-sm rounded-b-2xl shadow-lg dark:shadow-brand-primary/20 px-6">
                    <div onClick={handleLogoTap} className="flex items-center space-x-3 cursor-pointer flex-shrink-0">
                        {/* Use Link component for logo to navigate to homepage */}
                        <Link to="/" className="flex items-center space-x-3">
                            <img src={content.logos.header} alt={`${content.siteName} Logo`} className="h-10 w-auto" />
                            <div className="hidden sm:block">
                                <div className="font-bold text-lg text-custom-heading leading-tight">{content.siteName}</div>
                                <div className="text-xs font-light text-gray-500 dark:text-gray-300 leading-tight">{content.tagline}</div>
                            </div>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        {content.headerLinks.map(link => (
                            // Use Link component for all internal navigation
                            <Link 
                                key={link.id} 
                                to={link.url} // 'to' prop replaces 'href'
                                className="text-sm font-medium text-custom-text-base hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                            >
                                {link.text}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                        {user && (
                            <button onClick={onAdminIconClick} className="p-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                <AdminIcon />
                            </button>
                        )}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors z-50 relative">
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    {...mobileMenuMotionProps}
                    className="md:hidden absolute top-0 left-0 right-0 pt-20"
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-lg rounded-b-2xl p-6 flex flex-col space-y-4">
                            {content.headerLinks.map(link => (
                                // Use Link component for mobile menu navigation
                                <Link 
                                    key={link.id} 
                                    to={link.url} // 'to' prop replaces 'href'
                                    className="text-lg font-medium text-center text-custom-heading hover:text-brand-primary dark:hover:text-brand-primary transition-colors py-2"
                                    onClick={() => { // Simply close menu on click
                                        setIsMenuOpen(false); // Close the mobile menu after clicking a link
                                    }}
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;
