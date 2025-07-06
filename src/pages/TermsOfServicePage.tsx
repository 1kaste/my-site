import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useContent } from '../hooks/useContent';

const TermsOfServicePage: React.FC = () => {
    const { content } = useContent();
    const { termsOfService } = content;

    const headerMotionProps: MotionProps = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };
    
    const contentMotionProps: MotionProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 },
    };

    const renderContent = (text: string) => {
        return text.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-custom-text-base leading-relaxed">
                {paragraph.trim() === '' ? <br/> : paragraph}
            </p>
        ));
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <motion.header
                {...headerMotionProps}
                className="text-center pt-16"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-custom-heading">{termsOfService.title}</h1>
                 <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Last Updated: {new Date(termsOfService.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.header>

            <motion.main
                {...contentMotionProps}
                className="mt-12 max-w-4xl mx-auto bg-white/50 dark:bg-black/20 p-8 md:p-12 rounded-2xl shadow-lg"
            >
                <div className="prose prose-lg dark:prose-invert max-w-none">
                     {renderContent(termsOfService.content)}
                </div>
            </motion.main>
        </div>
    );
};

export default TermsOfServicePage;