import React, { useState } from 'react';
import { motion, MotionProps } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useContent } from '../hooks/useContent';
import EngagingButton from '../components/ui/EngagingButton';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, SocialIcon } from '../components/ui/icons';

const ContactPage: React.FC = () => {
    const { content } = useContent();
    const { contactInfo, socialLinks, contactFormRecipientEmail } = content;
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        
        // Get EmailJS credentials from environment variables
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        // Check if EmailJS is configured. If not, run in demo mode.
        if (!serviceId || !templateId || !publicKey) {
            console.warn("Contact form is in demo mode. Please configure EmailJS environment variables to send real emails.");
            console.log('Form Data:', formData);
            console.log('Intended Recipient:', contactFormRecipientEmail);
             // Simulate API call for demo purposes
            setTimeout(() => {
                setFormStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 1500);
            return;
        }

        const templateParams = {
            to_email: contactFormRecipientEmail,
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
        };
        
        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then(() => {
                setFormStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, (error: any) => {
                console.error('EmailJS failed:', error);
                setFormStatus('error');
            });
    };

    const headerMotionProps: MotionProps = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const sectionMotionProps = (delay = 0): MotionProps => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.2 + delay, ease: "easeOut" },
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <motion.header {...headerMotionProps} className="text-center pt-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-custom-heading">Contact Us</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-custom-text-base">
                    Have a project in mind or just want to say hello? We'd love to hear from you.
                </p>
            </motion.header>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Contact Form */}
                <motion.div {...sectionMotionProps(0.2)} className="bg-white/50 dark:bg-black/20 p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-custom-heading mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-custom-text-base">Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-50 border-transparent rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-custom-text-base">Email</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-50 border-transparent rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-custom-text-base">Subject</label>
                            <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-50 border-transparent rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-custom-text-base">Message</label>
                            <textarea name="message" id="message" rows={5} value={formData.message} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-50 border-transparent rounded-lg focus:ring-brand-primary focus:border-brand-primary"></textarea>
                        </div>
                        <div>
                            <EngagingButton>
                                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                            </EngagingButton>
                        </div>
                        {formStatus === 'success' && <p className="text-green-500 mt-4">Message sent successfully! We'll be in touch soon.</p>}
                        {formStatus === 'error' && <p className="text-red-500 mt-4">Something went wrong. Please try again or email us directly.</p>}
                    </form>
                </motion.div>

                {/* Contact Info */}
                <motion.div {...sectionMotionProps(0.4)} className="space-y-12">
                     <div className="bg-white/50 dark:bg-black/20 p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-custom-heading mb-6">Contact Information</h2>
                        <ul className="space-y-4 text-custom-text-base">
                            <li className="flex items-start">
                                <PhoneIcon /><span className="ml-4">{contactInfo.phone}</span>
                            </li>
                            <li className="flex items-start">
                                <EnvelopeIcon /><span className="ml-4">{contactInfo.email}</span>
                            </li>
                            <li className="flex items-start">
                                <MapPinIcon /><span className="ml-4">{contactInfo.address}</span>
                            </li>
                        </ul>
                         <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/20">
                             <h3 className="text-lg font-semibold text-custom-heading">Follow Us</h3>
                             <div className="flex mt-4 space-x-6">
                                {socialLinks.map(social => (
                                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                                        <span className="sr-only">{social.name}</span>
                                        <SocialIcon name={social.name} />
                                    </a>
                                ))}
                            </div>
                         </div>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden aspect-[16/9]">
                        <iframe
                            src={contactInfo.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Office Location"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
