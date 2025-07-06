import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import { ProjectCategory } from '../types';
import ProjectCard from '../components/ui/ProjectCard';

const ProjectsPage: React.FC = () => {
    const { content } = useContent();
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const categories = useMemo(() => 
        ['All', ...Array.from(new Set(content.latestProjects.projects.map(p => p.category)))].sort(),
    [content.latestProjects.projects]);

    const filteredProjects = activeCategory === 'All'
        ? content.latestProjects.projects
        : content.latestProjects.projects.filter(p => p.category === activeCategory);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const headerMotionProps: MotionProps = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const activeTabMotionProps: MotionProps = {
        layoutId: "active-project-tab",
        transition: { type: 'spring', stiffness: 300, damping: 30 },
    };

    const gridMotionProps: MotionProps = {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
    };

    const cardWrapperMotionProps: MotionProps = {
        layout: true,
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        transition: { duration: 0.4, ease: 'easeInOut' },
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <motion.div
                {...headerMotionProps}
                className="text-center pt-16"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-custom-heading">Our Work</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-custom-text-base">
                    A selection of projects that we're proud of. Explore our diverse portfolio of AI solutions, brand identities, and digital experiences.
                </p>
            </motion.div>

            <div className="flex justify-center my-12 flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`relative px-4 py-2 text-sm md:text-base font-medium transition-colors rounded-full ${
                            activeCategory === category
                                ? 'text-white'
                                : 'text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10'
                        }`}
                    >
                        {activeCategory === category && (
                            <motion.div {...activeTabMotionProps} className="absolute inset-0 bg-brand-primary rounded-full z-0" />
                        )}
                        <span className="relative z-10">{category}</span>
                    </button>
                ))}
            </div>

            <motion.div
                key={activeCategory}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                {...gridMotionProps}
            >
                <AnimatePresence>
                    {filteredProjects.map(project => (
                        <motion.div
                            key={project.id}
                            {...cardWrapperMotionProps}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ProjectsPage;