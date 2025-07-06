import React from 'react';
import { useContent } from '../../hooks/useContent';
import { SocialIcon } from '../ui/icons';

const Footer: React.FC = () => {
    const { content } = useContent();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        e.preventDefault();
        window.location.hash = url;
    };

    return (
        <footer className="bg-white/50 dark:bg-black/30 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-lg font-semibold text-custom-heading">{content.siteName}</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{content.tagline}</p>
                         <div className="flex justify-center md:justify-start items-center mt-6">
                            <img src={content.logos.footer} alt={`${content.siteName} Footer Logo`} className="h-10"/>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-custom-text-base">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            {content.footerLinks.map(link => (
                                <li key={link.id}>
                                    <a href={link.url} onClick={(e) => handleNavClick(e, link.url)} className="text-base text-gray-500 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-custom-text-base">Follow Us</h3>
                        <div className="flex justify-center md:justify-start mt-4 space-x-6">
                            {content.socialLinks.map(social => (
                                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                                    <span className="sr-only">{social.name}</span>
                                    <SocialIcon name={social.name} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/20 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} {content.siteName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;