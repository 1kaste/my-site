import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useContent } from '../../hooks/useContent';

interface GlowingBlockProps {
    title: string;
    children: ReactNode;
}

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const GlowingBlock: React.FC<GlowingBlockProps> = ({ title, children }) => {
    const { themeSettings } = useContent();

    const motionProps: MotionProps = {
        variants: cardVariants,
        whileHover: { scale: 1.05, y: -8 }, // The "pop" effect
        transition: { type: "spring", stiffness: 300, damping: 20 }
    };
    
    let animationClass = '';
    // The pulse animation should only apply when not hovering for a more dynamic effect.
    if (themeSettings.glowAnimation === 'pulse') {
        animationClass = 'group-hover:animate-none animate-pulse';
    }

    return (
        <motion.div
            {...motionProps}
            // The outer div is a container for the content and its glow, and a group for hover states
            className="group relative h-full"
        >
            {/* 
              The glow effect is a separate, blurred element positioned behind the content.
              It is only rendered if the glow animation is not set to 'none'.
              It's made larger, more blurred, and now fades in on hover.
            */}
            {themeSettings.glowAnimation !== 'none' && (
                <div
                    className={`absolute -inset-1 bg-gradient-to-r from-glow-color to-brand-secondary rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${animationClass}`}
                    style={{ animationDuration: '4s' }}
                />
            )}

            {/* The main content card, positioned relatively on top of the glow */}
            <div className="relative h-full p-6 rounded-2xl bg-white/80 dark:bg-black/30 backdrop-blur-sm overflow-hidden">
                {/* This div creates the "light up" effect on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 dark:from-white/10 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

                <div className="relative"> {/* Content needs to be relative to sit on top of the light-up effect */}
                    <h3 className="text-xl font-bold text-custom-heading">{title}</h3>
                    <p className="mt-2 text-custom-text-base">
                        {children}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default GlowingBlock;