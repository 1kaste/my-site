
import { ContentData, ThemeSettings, ProjectCategory } from '../types';

export const initialContent: ContentData = {
    siteName: "Kaste Brands & Designs",
    tagline: "Bespoke AI Solutions & Compelling Brand Identities",
    dynamicTitle: {
        prefix: "We Build ",
        rotatingWords: ["Extraordinary Brands", "Intelligent AI", "Modern Websites"],
        suffix: "."
    },
    services: [
        { id: "s1", title: "AI Systems", description: "Bespoke artificial intelligence systems tailored to your business needs." },
        { id: "s2", title: "AI Integrations & Solutions", description: "Seamlessly integrate AI into your existing infrastructure for enhanced efficiency." },
        { id: "s3", title: "Brand Identity", description: "Crafting memorable brand identities that resonate with your target audience." },
        { id: "s4", title: "Modern Websites", description: "Developing responsive, high-performance websites with a modern aesthetic." },
        { id: "s5", title: "Mobile Applications", description: "Building intuitive and engaging mobile apps for both iOS and Android." },
        { id: "s6", title: "Automated Systems", description: "Designing automated workflows to streamline operations and boost productivity." },
        { id: "s7", title: "Branding & Graphics", description: "Creating stunning visuals and graphics that elevate your brand's presence." },
        { id: "s8", title: "Digital Marketing", description: "Strategic digital marketing campaigns to drive growth and engagement." }
    ],
    headerLinks: [
        { id: 'h1', text: 'Home', url: '#/' },
        { id: 'h2', text: 'Services', url: '#services' },
        { id: 'h3', text: 'Projects', url: '#/projects' },
        { id: 'h4', text: 'About Us', url: '#about' },
        { id: 'h5', text: 'Contact', url: '#/contact' },
    ],
    footerLinks: [
        { id: 'f1', text: 'Home', url: '#/' },
        { id: 'f2', text: 'Privacy Policy', url: '#/privacy-policy' },
        { id: 'f3', text: 'Terms of Service', url: '#/terms-of-service' }
    ],
    socialLinks: [
        { id: 'so1', name: 'Twitter', url: 'https://twitter.com' },
        { id: 'so2', name: 'GitHub', url: 'https://github.com' },
        { id: 'so3', name: 'LinkedIn', url: 'https://linkedin.com' },
        { id: 'so4', name: 'TikTok', url: 'https://tiktok.com' }
    ],
    whatsAppNumber: '1234567890',
    aiModel: 'gemini-2.5-flash-preview-04-17',
    logos: {
        header: '/logo.svg',
        footer: '/logo.svg'
    },
    aboutUs: {
        introduction: "Kaste Brands & Designs is a forward-thinking digital agency specializing in creating bespoke AI solutions and compelling brand identities. We merge cutting-edge technology with creative design to build extraordinary digital experiences. Our team is passionate about innovation and dedicated to helping our clients thrive in an ever-evolving digital landscape.",
        mission: "Our mission is to empower businesses by delivering intelligent, beautiful, and intuitive digital solutions. We strive to demystify complex technology and make it an accessible, powerful tool for growth and connection.",
        vision: "We envision a future where technology and human-centric design work in perfect harmony, creating seamless interactions that enrich lives and drive progress. We aim to be at the forefront of this digital evolution, pioneering change and setting new standards for excellence.",
        values: [
            { id: 'v1', icon: 'Lightbulb', title: 'Innovation', description: 'We constantly explore new frontiers, pushing the boundaries of what\'s possible with AI and design.' },
            { id: 'v2', icon: 'UsersGroup', title: 'Collaboration', description: 'We believe the best results come from true partnership, working hand-in-hand with our clients.' },
            { id: 'v3', icon: 'ShieldCheck', title: 'Integrity', description: 'We build with purpose and principle, ensuring our solutions are ethical, transparent, and reliable.' }
        ],
        mediaUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        mediaType: 'image'
    },
    whyChooseUs: {
        title: "Why Partner with Kaste?",
        features: [
            { id: 'w1', icon: 'Innovation', title: 'Pioneering Innovation', description: 'We stay at the forefront of AI and design trends to deliver cutting-edge solutions.' },
            { id: 'w2', icon: 'Quality', title: 'Uncompromising Quality', description: 'Our commitment to excellence ensures robust, scalable, and polished final products.' },
            { id: 'w3', icon: 'Partnership', title: 'Collaborative Partnership', description: 'We work with you as a true partner, aligning our strategy with your business goals.' },
        ],
        statistics: [
            { id: 'st1', value: '98', suffix: '%', label: 'Client Satisfaction' },
            { id: 'st2', value: '50', suffix: '+', label: 'Projects Completed' },
            { id: 'st3', value: '10', suffix: '+', label: 'Years of Experience' },
            { id: 'st4', value: '24/7', suffix: '', label: 'Dedicated Support' },
        ]
    },
    latestProjects: {
        title: "Our Latest Work",
        projects: [
            { id: 'p1', title: 'AI-Powered E-commerce', description: 'A personalized shopping assistant with a dynamic UI.', mediaUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2670&auto=format&fit=crop', mediaType: 'image', category: 'AI', projectUrl: '#', gallery: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2574&auto=format&fit=crop', 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2670&auto=format&fit=crop'] },
            { id: 'p2', title: 'Fintech Mobile App', description: 'A sleek, modern banking experience.', mediaUrl: 'https://images.unsplash.com/photo-1589750664879-7817b8d14615?q=80&w=2574&auto=format&fit=crop', mediaType: 'image', category: 'Mobile App', projectUrl: '#' },
            { 
                id: 'p3', 
                title: 'Corporate Rebranding', 
                description: 'A fresh identity for a tech giant, showcasing a new logo, color palette, and brand assets.', 
                mediaUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2670&auto=format&fit=crop', 
                mediaType: 'image', 
                category: 'Branding',
                projectUrl: '#',
                gallery: [
                    'https://images.unsplash.com/photo-1559028006-44a8a5b4809e?q=80&w=2574&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1611162616475-46b6352b126b?q=80&w=2574&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1541701494587-b959cc3f5284?q=80&w=2503&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1561998394-2396d5729729?q=80&w=2564&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2669&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1521123985672-356c39a838de?q=80&w=2574&auto=format&fit=crop'
                ]
            },
            { id: 'p4', title: 'Healthcare Automation', description: 'Streamlining patient data management.', mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop', mediaType: 'image', category: 'AI', projectUrl: '#' },
            { id: 'p5', title: 'SaaS Platform UI/UX', description: 'An intuitive interface for a complex tool.', mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2574&auto=format&fit=crop', mediaType: 'image', category: 'Website', projectUrl: '#' },
            { id: 'p6', title: 'Logistics AI', description: 'Optimizing supply chain routes.', mediaUrl: 'https://images.unsplash.com/photo-1577563908411-5ab7254a6964?q=80&w=2670&auto=format&fit=crop', mediaType: 'image', category: 'AI', projectUrl: '#' },
            { id: 'p7', title: 'Smart Home App', description: 'Controlling homes from anywhere.', mediaUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2574&auto=format&fit=crop', mediaType: 'image', category: 'Mobile App', projectUrl: '#' },
            { id: 'p8', title: 'Digital Art Marketplace', description: 'A platform for NFT creators.', mediaUrl: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=2532&auto=format&fit=crop', mediaType: 'image', category: 'Website', projectUrl: '#' },
            { 
                id: 'p9', 
                title: 'Faces of the City: A Portrait Series', 
                description: 'A gallery project showcasing a series of candid and posed portraits that capture the diverse personalities and stories of people in an urban environment. Each photograph aims to reveal a unique human narrative.', 
                mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop', 
                mediaType: 'image', 
                category: 'Photography',
                gallery: [
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2574&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2560&auto=format&fit=crop'
                ]
            },
        ]
    },
    contactInfo: {
        email: "contact@kaste.design",
        phone: "+1 (555) 123-4567",
        address: "123 Innovation Drive, Tech City, 12345",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21387.14723910996!2d-122.09151163456868!3d37.4215286954625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba024251be6d%3A0xdb0c7b50036f0e45!2sGoogleplex!5e0!3m2!1sen!2sus!4v1676902484738!5m2!1sen!2sus"
    },
    contactFormRecipientEmail: 'kamaustephenpaul@gmail.com',
    privacyPolicy: {
        title: "Privacy Policy",
        lastUpdated: "2024-07-28",
        content: `Your privacy is important to us. It is Kaste Brands & Designs' policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.

We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.

We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.

We don’t share any personally identifying information publicly or with third-parties, except when required to by law.

Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.

You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.

Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.`
    },
    termsOfService: {
        title: "Terms of Service",
        lastUpdated: "2024-07-28",
        content: `1. Terms
By accessing the website at Kaste Brands & Designs, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.

2. Use License
Permission is granted to temporarily download one copy of the materials (information or software) on Kaste Brands & Designs' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose, or for any public display (commercial or non-commercial); attempt to decompile or reverse engineer any software contained on Kaste Brands & Designs' website; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or "mirror" the materials on any other server. This license shall automatically terminate if you violate any of these restrictions and may be terminated by Kaste Brands & Designs at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.

3. Disclaimer
The materials on Kaste Brands & Designs' website are provided on an 'as is' basis. Kaste Brands & Designs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, Kaste Brands & Designs does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.

4. Limitations
In no event shall Kaste Brands & Designs or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kaste Brands & Designs' website, even if Kaste Brands & Designs or a Kaste Brands & Designs authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.

5. Accuracy of materials
The materials appearing on Kaste Brands & Designs' website could include technical, typographical, or photographic errors. Kaste Brands & Designs does not warrant that any of the materials on its website are accurate, complete or current. Kaste Brands & Designs may make changes to the materials contained on its website at any time without notice. However Kaste Brands & Designs does not make any commitment to update.

6. Links
Kaste Brands & Designs has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Kaste Brands & Designs of the site. Use of any such linked website is at the user's own risk.

7. Modifications
Kaste Brands & Designs may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.

8. Governing Law
These terms and conditions are governed by and construed in accordance with the laws of our state and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.`
    },
    floatingButtons: {
        whatsAppIcon: { type: 'pre-built', value: 'WhatsApp' },
        aiAssistantIcon: { type: 'pre-built', value: 'Bot' },
        scrollToTopIcon: { type: 'pre-built', value: 'ArrowUp' },
    },
};

export const initialTheme: ThemeSettings = {
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#8b5cf6', // violet-500
    dynamicTitleColorStart: '#a855f7', // purple-500
    dynamicTitleColorEnd: '#ec4899', // pink-500
    font: 'system-ui',
    lightModeTextColor: '#374151', // gray-700
    darkModeTextColor: '#d1d5db',  // gray-300
    lightModeHeadingColor: '#111827', // gray-900
    darkModeHeadingColor: '#f9fafb',   // gray-50
    lightModeBgColor: '#fef3c7', // amber-100
    darkModeBgColor: '#083344', // cyan-950
    glowColor: '#3b82f6',
    glowAnimation: 'pulse',
};