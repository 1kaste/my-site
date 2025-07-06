
import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, MotionProps } from 'framer-motion';
import { CustomIcon } from './icons';
import { useContent } from '../../hooks/useContent';

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollY } = useScroll();
    const { content } = useContent();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const motionProps: MotionProps = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { type: 'spring', stiffness: 300, damping: 25 },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    {...motionProps}
                    className="fixed bottom-6 left-6 z-40 w-16 h-16 bg-gray-800/50 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-white dark:text-gray-200 hover:bg-gray-900/70 dark:hover:bg-white/30 transition-colors"
                    aria-label="Scroll to top"
                >
                    <CustomIcon setting={content.floatingButtons.scrollToTopIcon} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTopButton;
