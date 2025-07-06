
import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useContent } from '../../hooks/useContent';

interface EngagingButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

const EngagingButton: React.FC<EngagingButtonProps> = ({ children, onClick }) => {
    const { themeSettings } = useContent();

    const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgb = hexToRgb(themeSettings.glowColor);
    const glowBoxShadow = rgb ? `0px 0px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)` : "0px 0px 20px rgba(59, 130, 246, 0.7)";

    const motionProps: MotionProps = {
        whileHover: { scale: 1.05, boxShadow: glowBoxShadow },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 17 }
    };

    return (
        <motion.button
            onClick={onClick}
            {...motionProps}
            className="px-8 py-4 bg-brand-primary text-white font-semibold rounded-full shadow-lg"
        >
            {children}
        </motion.button>
    );
};

export default EngagingButton;
