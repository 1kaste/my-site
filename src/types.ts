// src/types.ts

// Core Data Interfaces
export interface Service {
    id: string;
    title: string;
    description: string;
}

export interface DynamicTitleData {
    prefix: string;
    rotatingWords: string[];
    suffix: string;
}

export interface Link {
    id: string;
    text: string;
    url: string;
}

export type SocialIconName = 'Twitter' | 'GitHub' | 'LinkedIn' | 'Facebook' | 'Instagram' | 'YouTube' | 'Dribbble' | 'Behance' | 'TikTok' | 'Pinterest' | 'Discord' | 'Vimeo' | 'Telegram'; // Added 'TikTok'
export type FloatingIconName = 'WhatsApp' | 'Bot' | 'ArrowUp' | 'Message' | 'Support' | 'Chat' | 'Question';

export type IconSourceType = 'pre-built' | 'url';

export interface IconSetting {
    type: IconSourceType;
    value: FloatingIconName | string; // FloatingIconName for 'pre-built', URL string for 'url'
}

export interface FloatingButtonSettings {
    whatsAppIcon: IconSetting;
    aiAssistantIcon: IconSetting;
    scrollToTopIcon: IconSetting;
}

export interface SocialLink {
    id: string;
    name: SocialIconName;
    url: string;
}

export interface Value {
    id: string;
    icon: 'Lightbulb' | 'UsersGroup' | 'ShieldCheck'; // Example icons, adjust as needed
    title: string;
    description: string;
}

export interface AboutUsData {
    introduction: string;
    mission: string;
    vision: string;
    values: Value[];
    mediaUrl: string;
    mediaType: 'image' | 'video' | 'none'; // Added 'none' option
}

export interface WhyChooseUsFeature {
    id: string;
    icon: 'Innovation' | 'Quality' | 'Partnership'; // Example icons, adjust as needed
    title: string;
    description: string;
}

export interface Statistic {
    id: string;
    value: string;
    label: string;
    suffix: string;
}

export type ProjectCategory = string; // Allows any string for category

export interface Project {
    id: string;
    title: string;
    description: string;
    mediaUrl: string; // Cover image
    mediaType: 'image' | 'video';
    category: ProjectCategory;
    projectUrl?: string; // Optional: Link to a live demo or site
    gallery?: string[];  // Optional: A list of image URLs for a gallery
}

export interface LegalPage {
    title: string;
    lastUpdated: string;
    content: string;
}

export interface ContactInfo {
    email: string;
    phone: string;
    address: string;
    mapEmbedUrl: string;
}

// Main Content State Interface (renamed from ContentData to ContentState for consistency with context)
export interface ContentState {
    siteName: string;
    tagline: string;
    dynamicTitle: DynamicTitleData;
    services: Service[];
    headerLinks: Link[];
    footerLinks: Link[];
    socialLinks: SocialLink[];
    whatsAppNumber: string;
    aiModel: string; // e.g., 'gpt-3.5-turbo', 'gpt-4'
    logos: {
        header: string;
        footer: string;
    };
    aboutUs: AboutUsData;
    whyChooseUs: {
        title: string;
        features: WhyChooseUsFeature[];
        statistics: Statistic[];
    };
    latestProjects: {
        title: string;
        projects: Project[];
    };
    privacyPolicy: LegalPage;
    termsOfService: LegalPage;
    contactInfo: ContactInfo;
    contactFormRecipientEmail: string;
    floatingButtons: FloatingButtonSettings;
}

// Theme Settings Interface
export interface ThemeSettings {
    primaryColor: string;
    secondaryColor: string;
    dynamicTitleColorStart: string;
    dynamicTitleColorEnd: string;
    fontFamily: string; // Renamed from 'font' to 'fontFamily' for CSS consistency
    lightModeTextColor: string;
    darkModeTextColor: string;
    lightModeHeadingColor: string;
    darkModeHeadingColor: string;
    lightModeBgColor: string;
    darkModeBgColor: string;
    glowColor: string;
    glowAnimation: 'pulse' | 'static' | 'none';
}

// --- Initial/Default Data Values ---

export const initialContentState: ContentState = {
    siteName: "Your Brand",
    tagline: "Innovate. Create. Inspire.",
    dynamicTitle: {
        prefix: "We create ",
        rotatingWords: ["stunning websites", "powerful apps", "engaging brands", "innovative solutions"],
        suffix: "."
    },
    services: [
        { id: "s1", title: "Web Development", description: "Crafting responsive and modern web experiences." },
        { id: "s2", title: "Mobile App Development", description: "Building intuitive and high-performance mobile applications." },
        { id: "s3", title: "UI/UX Design", description: "Designing user-centric interfaces for seamless interactions." },
    ],
    headerLinks: [
        { id: "hl1", text: "Home", url: "/" },
        { id: "hl2", text: "Services", url: "/services" },
        { id: "hl3", text: "Projects", url: "/projects" },
        { id: "hl4", text: "About", url: "/about" },
        { id: "hl5", text: "Contact", url: "/contact" },
    ],
    footerLinks: [
        { id: "fl1", text: "Privacy Policy", url: "/privacy-policy" },
        { id: "fl2", text: "Terms of Service", url: "/terms-of-service" },
    ],
    socialLinks: [
        { id: "sl1", name: "Twitter", url: "https://twitter.com/yourbrand" },
        { id: "sl2", name: "LinkedIn", url: "https://linkedin.com/company/yourbrand" },
        { id: "sl3", name: "GitHub", url: "https://github.com/yourbrand" },
    ],
    whatsAppNumber: "+1234567890",
    aiModel: "gpt-3.5-turbo",
    logos: {
        header: "/path/to/default-header-logo.png",
        footer: "/path/to/default-footer-logo.png",
    },
    aboutUs: {
        introduction: "We are a passionate team dedicated to delivering exceptional digital solutions. Our mission is to transform your ideas into reality with creativity and precision.",
        mission: "Our mission is to empower businesses with cutting-edge technology and design, fostering growth and success in the digital landscape.",
        vision: "To be a global leader in digital innovation, recognized for our commitment to excellence, client satisfaction, and impactful solutions.",
        values: [
            { id: "v1", icon: "Lightbulb", title: "Innovation", description: "Constantly seeking new and better ways to solve challenges." },
            { id: "v2", icon: "UsersGroup", title: "Collaboration", description: "Working closely with clients to achieve shared goals." },
            { id: "v3", icon: "ShieldCheck", title: "Integrity", description: "Operating with honesty, transparency, and ethical practices." },
        ],
        mediaUrl: "/path/to/about-us-default-image.jpg",
        mediaType: "image",
    },
    whyChooseUs: {
        title: "Why Choose Us",
        features: [
            { id: "wcu1", icon: "Innovation", title: "Innovative Solutions", description: "Leveraging the latest tech to build future-proof products." },
            { id: "wcu2", icon: "Quality", title: "Uncompromising Quality", description: "Delivering pixel-perfect designs and robust code." },
            { id: "wcu3", icon: "Partnership", title: "Client-Centric Approach", description: "Your vision is our priority, fostering true partnerships." },
        ],
        statistics: [
            { id: "stat1", value: "10+", label: "Years in Business", suffix: "" },
            { id: "stat2", value: "150+", label: "Projects Completed", suffix: "" },
            { id: "stat3", value: "99%", label: "Client Satisfaction", suffix: "" },
        ],
    },
    latestProjects: {
        title: "Our Latest Creations",
        projects: [
            {
                id: "p1",
                title: "E-commerce Redesign",
                description: "A modern and responsive e-commerce platform for a fashion brand.",
                mediaUrl: "/path/to/project1-cover.jpg",
                mediaType: "image",
                category: "Website",
                projectUrl: "https://example.com/project1",
                gallery: ["/path/to/project1-gal1.jpg", "/path/to/project1-gal2.jpg"]
            },
            {
                id: "p2",
                title: "Mobile Banking App",
                description: "Secure and intuitive mobile application for daily banking needs.",
                mediaUrl: "/path/to/project2-cover.jpg",
                mediaType: "image",
                category: "Mobile App",
                projectUrl: "https://example.com/project2",
                gallery: ["/path/to/project2-gal1.jpg", "/path/to/project2-gal2.jpg"]
            },
        ],
    },
    privacyPolicy: {
        title: "Privacy Policy",
        lastUpdated: "2024-01-01",
        content: `This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        
We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
        
Interpretation and Definitions
Interpretation
The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.`
    },
    termsOfService: {
        title: "Terms of Service",
        lastUpdated: "2024-01-01",
        content: `Welcome to Our Service!
        
These Terms and Conditions describe the rules and regulations for the use of Our Website.
        
By accessing this website we assume you accept these terms and conditions. Do not continue to use Our Service if you do not agree to take all of the terms and conditions stated on this page.
        
The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions.`
    },
    contactInfo: {
        email: "info@yourbrand.com",
        phone: "+1 (555) 123-4567",
        address: "123 Innovation Drive, Tech City, TC 98765",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d... (your Google Maps embed URL)"
    },
    contactFormRecipientEmail: "contact@yourbrand.com",
    floatingButtons: {
        whatsAppIcon: { type: 'pre-built', value: 'WhatsApp' },
        aiAssistantIcon: { type: 'pre-built', value: 'Bot' },
        scrollToTopIcon: { type: 'pre-built', value: 'ArrowUp' },
    },
};

export const initialThemeSettings: ThemeSettings = {
    primaryColor: "#FF4C60", // Bright Red/Pink
    secondaryColor: "#17D161", // Green
    dynamicTitleColorStart: "#FF4C60",
    dynamicTitleColorEnd: "#17D161",
    fontFamily: "'Inter', sans-serif", // Example, ensure you link this font in your CSS/HTML
    lightModeTextColor: "#333333",
    darkModeTextColor: "#F0F0F0",
    lightModeHeadingColor: "#1A1A1A",
    darkModeHeadingColor: "#FFFFFF",
    lightModeBgColor: "#FFFFFF",
    darkModeBgColor: "#1A1A1A",
    glowColor: "#FF4C60",
    glowAnimation: 'pulse', // Default animation
};
