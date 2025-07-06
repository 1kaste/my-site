
import React, { useRef, useEffect } from 'react';
import { motion, useInView, animate, MotionProps, Variants } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import DynamicTitle from '../components/ui/DynamicTitle';
import EngagingButton from '../components/ui/EngagingButton';
import GlowingBlock from '../components/ui/GlowingBlock';
import { InnovationIcon, QualityIcon, PartnershipIcon, LightbulbIcon, UsersGroupIcon, ShieldCheckIcon } from '../components/ui/icons';
import ProjectCard from '../components/ui/ProjectCard';

function IconComponent({ name }: { name: 'Innovation' | 'Quality' | 'Partnership' }) {
    switch (name) {
        case 'Innovation': return <InnovationIcon />;
        case 'Quality': return <QualityIcon />;
        case 'Partnership': return <PartnershipIcon />;
        default: return null;
    }
}

function ValueIconComponent({ name }: { name: 'Lightbulb' | 'UsersGroup' | 'ShieldCheck' }) {
    switch (name) {
        case 'Lightbulb': return <LightbulbIcon />;
        case 'UsersGroup': return <UsersGroupIcon />;
        case 'ShieldCheck': return <ShieldCheckIcon />;
        default: return null;
    }
}

function StatisticCounter({ value, suffix, label }: { value: string, suffix: string, label: string }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));

    useEffect(() => {
        if (isInView && !isNaN(numericValue) && ref.current) {
            const controls = animate(0, numericValue, {
                duration: 2,
                ease: "easeOut",
                onUpdate(latest) {
                    if (ref.current) {
                        ref.current.textContent = Math.round(latest).toString();
                    }
                }
            });
            return () => controls.stop();
        } else if (ref.current && isNaN(numericValue)) {
            ref.current.textContent = value;
        }
    }, [isInView, numericValue, value]);

    return (
        <div className="text-center">
            <h3 className="text-5xl font-bold text-brand-primary dark:text-blue-400">
                <span ref={ref}>{isNaN(numericValue) ? value : '0'}</span>{suffix}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
    );
};


function HomePage() {
    const { content } = useContent();

    const handleStartProjectClick = () => {
        window.location.hash = '#/contact';
    };

    const sectionContainerReveal: Variants = {
      hidden: {
        opacity: 0,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      },
      visible: {
        opacity: 1,
        // Use calc() in clipPath to expand the area, preventing shadows/glows from being cropped.
        clipPath: 'polygon(-30px -30px, calc(100% + 30px) -30px, calc(100% + 30px) calc(100% + 30px), -30px calc(100% + 30px))',
        transition: {
          duration: 1,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    
    const aboutSectionVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.3, delayChildren: 0.2 },
      },
    };

    const mediaVariants: Variants = {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const textVariants: Variants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const itemVariant: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    
    const renderMedia = () => {
        const { mediaType, mediaUrl } = content.aboutUs;
        if (!mediaUrl || mediaType === 'none') return null;

        if (mediaType === 'video') {
            return (
                <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                />
            );
        }

        return <img src={mediaUrl} alt="About Kaste Brands & Designs" className="w-full h-full object-cover rounded-2xl" />;
    };

    const heroMotionProps: MotionProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
    };

    const sectionRevealProps: MotionProps = {
        variants: sectionContainerReveal,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.15 },
    };
    
    const aboutSectionRevealProps: MotionProps = {
        variants: sectionContainerReveal,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.1 },
    };
    
    const staggeredContainerProps: MotionProps = {
        variants: containerVariants,
    };
    
    const aboutSectionProps: MotionProps = {
        variants: aboutSectionVariants
    };

    const mediaMotionProps: MotionProps = { variants: mediaVariants };
    const textMotionProps: MotionProps = { variants: textVariants };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <section className="text-center pt-16 pb-20">
                <motion.div {...heroMotionProps}>
                    <DynamicTitle {...content.dynamicTitle} />
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-custom-text-base">
                        From groundbreaking AI systems to stunning brand identities, we craft the future of digital interaction. Let's build something extraordinary together.
                    </p>
                    <div className="mt-8">
                        <EngagingButton onClick={handleStartProjectClick}>
                            Start a Project
                        </EngagingButton>
                    </div>
                </motion.div>
            </section>

            <section id="services" className="py-24">
                <motion.div {...sectionRevealProps}>
                    <h2 className="text-3xl font-bold text-center text-custom-heading mb-12">Our Services</h2>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        {...staggeredContainerProps}
                    >
                        {content.services.map(service => (
                            <GlowingBlock key={service.id} title={service.title}>
                                {service.description}
                            </GlowingBlock>
                        ))}
                    </motion.div>
                </motion.div>
            </section>
            
            <section id="why-us" className="py-24 bg-gray-50 dark:bg-black/20 rounded-3xl my-12">
                 <motion.div
                    className="container mx-auto px-4 sm:px-6 lg:px-8"
                    {...sectionRevealProps}
                >
                    <motion.div {...staggeredContainerProps} >
                        <h2 className="text-3xl font-bold text-center text-custom-heading mb-12">{content.whyChooseUs.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {content.whyChooseUs.features.map(feature => (
                                <motion.div key={feature.id} {...textMotionProps}>
                                    <div className="inline-block p-4 bg-brand-primary/10 rounded-full mb-4">
                                        <div className="text-brand-primary dark:text-blue-400"><IconComponent name={feature.icon} /></div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-custom-heading">{feature.title}</h3>
                                    <p className="mt-2 text-custom-text-base">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {content.whyChooseUs.statistics.map(stat => (
                                <StatisticCounter key={stat.id} {...stat} />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            <section id="projects" className="py-24">
                 <motion.div {...sectionRevealProps}>
                    <h2 className="text-3xl font-bold text-center text-custom-heading mb-12">{content.latestProjects.title}</h2>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        {...staggeredContainerProps}
                    >
                        {content.latestProjects.projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            <section id="about" className="py-24 overflow-hidden">
                <motion.div {...aboutSectionRevealProps}>
                    <h2 className="text-3xl font-bold text-center text-custom-heading mb-16">About Kaste Brands & Designs</h2>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
                        {...aboutSectionProps}
                    >
                        <motion.div 
                            className="w-full h-96 md:h-full rounded-2xl shadow-2xl dark:shadow-brand-primary/20 bg-gray-200 dark:bg-black/20"
                            {...mediaMotionProps}
                        >
                            {renderMedia()}
                        </motion.div>
                        <motion.div {...textMotionProps}>
                            <p className="text-lg text-custom-text-base leading-relaxed">
                                {content.aboutUs.introduction}
                            </p>
                            <div className="mt-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-custom-heading mb-2">Our Mission</h3>
                                    <p className="text-custom-text-base leading-relaxed">
                                        {content.aboutUs.mission}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-custom-heading mb-2">Our Vision</h3>
                                    <p className="text-custom-text-base leading-relaxed">
                                        {content.aboutUs.vision}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                     <motion.div 
                        className="mt-24"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <h3 className="text-3xl font-bold text-center text-custom-heading mb-12">Our Core Values</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content.aboutUs.values.map(value => (
                                <motion.div key={value.id} variants={itemVariant} className="text-center p-8 bg-white/50 dark:bg-black/20 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-brand-primary/20 hover:-translate-y-2">
                                    <div className="inline-block p-4 bg-brand-primary/10 rounded-full mb-4 text-brand-primary dark:text-blue-400">
                                        <ValueIconComponent name={value.icon} />
                                    </div>
                                    <h4 className="text-xl font-semibold text-custom-heading">{value.title}</h4>
                                    <p className="mt-2 text-sm text-custom-text-base">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </motion.div>
            </section>
        </div>
    );
};

export default HomePage;