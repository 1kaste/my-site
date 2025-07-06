
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Project } from '../../types';
import { ExternalLinkIcon } from './icons';

interface ProjectCardProps {
    project: Project;
}

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    
    const renderMedia = () => {
        if (project.mediaType === 'video') {
            return (
                <video
                    src={project.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            );
        }
        return <img src={project.mediaUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />;
    };

    const hasGallery = !!project.gallery && project.gallery.length > 0;
    const hasLinkOnly = !hasGallery && !!project.projectUrl;

    const isClickable = hasGallery || hasLinkOnly;
    const CardElement = isClickable ? motion.a : motion.div;

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (hasGallery) {
            e.preventDefault();
            window.location.hash = `#/project/${project.id}`;
        }
    };

    const cardMotionProps: MotionProps = {
        variants: cardVariants,
    };

    const textMotionProps: MotionProps = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2 },
    };

    const cardProps: any = {
      ...cardMotionProps,
      className: "group relative block w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-900",
    };

    if (isClickable) {
        cardProps.href = hasGallery ? `#/project/${project.id}` : project.projectUrl;
        if (hasGallery) {
            cardProps.onClick = handleNav;
        } else { // hasLinkOnly
            cardProps.target = '_blank';
            cardProps.rel = 'noopener noreferrer';
        }
    }

    return (
        <CardElement {...cardProps}>
            {renderMedia()}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <motion.div {...textMotionProps} >
                    <h3 className="font-bold text-xl">{project.title}</h3>
                </motion.div>
                 <motion.div 
                    className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40"
                 >
                    <p className="mt-2 text-sm text-gray-300">{project.description}</p>
                    {isClickable && (
                        <div className="inline-flex items-center mt-4 text-sm font-semibold text-brand-primary dark:text-blue-400">
                            {hasGallery ? 'View Gallery' : 'View Project'} 
                            <span className="ml-1.5"><ExternalLinkIcon /></span>
                        </div>
                    )}
                </motion.div>
            </div>
        </CardElement>
    );
};

export default ProjectCard;