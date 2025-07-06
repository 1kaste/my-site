
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useContent } from '../../hooks/useContent';
import { CustomIcon } from '../ui/icons';

const WhatsAppButton: React.FC = () => {
    const { content } = useContent();
    const url = `https://wa.me/${content.whatsAppNumber}`;

    const motionProps: MotionProps = {
        whileHover: { scale: 1.1, rotate: 10 },
        whileTap: { scale: 0.9 },
    };

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg text-white"
            {...motionProps}
            aria-label="Chat on WhatsApp"
        >
            <CustomIcon setting={content.floatingButtons.whatsAppIcon} />
        </motion.a>
    );
};

export default WhatsAppButton;
