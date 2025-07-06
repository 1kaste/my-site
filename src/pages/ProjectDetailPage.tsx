
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import EngagingButton from '../components/ui/EngagingButton';
import { ExternalLinkIcon } from '../components/ui/icons';

const ProjectDetailPage: React.FC<{ projectId: string }> = ({ projectId }) => {
    const { content } = useContent();
    const project = content.latestProjects.projects.find(p => p.id === projectId);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        e.preventDefault();
        window.location.hash = url;
    };

    if (!project) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
                <h1 className="text-4xl font-bold text-custom-heading">Project Not Found</h1>
                <p className="mt-4 text-lg text-custom-text-base">The project you're looking for doesn't exist or has been moved.</p>
                <a 
                    href="#/projects" 
                    onClick={(e) => handleNavClick(e, '#/projects')}
                    className="mt-8 inline-block px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Back to All Projects
                </a>
            </div>
        );
    }

    const headerMotionProps: MotionProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const galleryMotionProps: MotionProps = {
        initial: "hidden",
        animate: "visible",
        variants: {
            visible: { transition: { staggerChildren: 0.05 } }
        }
    };

    const galleryItemMotionProps: MotionProps = {
        variants: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }
    };
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <style>
                {`
                .masonry-gallery {
                    column-count: 1;
                    column-gap: 1.5rem;
                }
                @media (min-width: 768px) {
                    .masonry-gallery {
                        column-count: 2;
                    }
                }
                @media (min-width: 1024px) {
                    .masonry-gallery {
                        column-count: 3;
                    }
                }
                .masonry-item {
                    break-inside: avoid;
                    margin-bottom: 1.5rem;
                }
                `}
            </style>
            <motion.div 
                {...headerMotionProps}
                className="pt-16"
            >
                <a 
                    href="#/projects" 
                    onClick={(e) => handleNavClick(e, '#/projects')} 
                    className="text-brand-primary dark:text-blue-400 hover:underline mb-6 inline-block text-sm"
                >
                    &larr; Back to All Projects
                </a>
                <h1 className="text-4xl md:text-5xl font-extrabold text-custom-heading">{project.title}</h1>
                <p className="mt-4 max-w-3xl text-lg text-custom-text-base">
                    {project.description}
                </p>
                
                {project.projectUrl && (
                    <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <EngagingButton onClick={() => window.open(project.projectUrl, '_blank', 'noopener,noreferrer')}>
                            <span className="flex items-center space-x-2">
                                <span>View Live Project</span>
                                <ExternalLinkIcon />
                            </span>
                        </EngagingButton>
                    </motion.div>
                )}

            </motion.div>

            {project.gallery && project.gallery.length > 0 && (
                <motion.div 
                    className="mt-16 masonry-gallery"
                    {...galleryMotionProps}
                >
                    {project.gallery.map((imgSrc, index) => (
                        <motion.div 
                            key={index} 
                            className="masonry-item rounded-xl overflow-hidden shadow-lg dark:shadow-brand-primary/10"
                            {...galleryItemMotionProps}
                        >
                             <img 
                                src={imgSrc} 
                                alt={`${project.title} - gallery image ${index + 1}`} 
                                className="w-full h-auto block" 
                                loading="lazy"
                             />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default ProjectDetailPage;