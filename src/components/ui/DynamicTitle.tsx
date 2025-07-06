
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { DynamicTitleData } from '../../types';
import { useContent } from '../../hooks/useContent';

const DynamicTitle: React.FC<DynamicTitleData> = ({ prefix, rotatingWords, suffix }) => {
    const [index, setIndex] = useState(0);
    const { themeSettings } = useContent();

    useEffect(() => {
        if (rotatingWords && rotatingWords.length > 1) {
            const interval = setInterval(() => {
                setIndex(prev => (prev + 1) % rotatingWords.length);
            }, 3000); // Change every 3 seconds
            return () => clearInterval(interval);
        }
    }, [rotatingWords]);

    const wordAnimation: MotionProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { type: 'spring', stiffness: 200, damping: 20 }
    };

    const AnimatedWord: React.FC<{ word: string }> = ({ word }) => (
        <motion.span
            key={word}
            {...wordAnimation}
            className="relative inline-block text-transparent bg-clip-text"
            style={{
                backgroundImage: `linear-gradient(to right, ${themeSettings.dynamicTitleColorStart}, ${themeSettings.dynamicTitleColorEnd})`,
            }}
        >
            {word}
        </motion.span>
    );
    
    // Ensure array is not empty to prevent errors
    const safeRotatingWords = rotatingWords && rotatingWords.length > 0 ? rotatingWords : ['...'];

    return (
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-custom-heading leading-tight">
            {prefix}
            <AnimatePresence mode="wait">
                <AnimatedWord word={safeRotatingWords[index]} />
            </AnimatePresence>
            {suffix}
        </h1>
    );
};

export default DynamicTitle;
