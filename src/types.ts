
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
    id:string;
    text: string;
    url: string;
}

export type SocialIconName = 'Twitter' | 'GitHub' | 'LinkedIn' | 'Facebook' | 'Instagram' | 'YouTube' | 'Dribbble' | 'Behance' | 'TikTok' | 'Pinterest' | 'Discord' | 'Vimeo' | 'Telegram';

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
    icon: 'Lightbulb' | 'UsersGroup' | 'ShieldCheck';
    title: string;
    description: string;
}

export interface AboutUsData {
    introduction: string;
    mission: string;
    vision: string;
    values: Value[];
    mediaUrl: string;
    mediaType: 'image' | 'video' | 'none';
}

export interface WhyChooseUsFeature {
    id:string;
    icon: 'Innovation' | 'Quality' | 'Partnership';
    title: string;
    description: string;
}

export interface Statistic {
    id: string;
    value: string;
    label: string;
    suffix: string;
}

export type ProjectCategory = string;

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

export interface ContentData {
    siteName: string;
    tagline: string;
    dynamicTitle: DynamicTitleData;
    services: Service[];
    headerLinks: Link[];
    footerLinks: Link[];
    socialLinks: SocialLink[];
    whatsAppNumber: string;
    aiModel: string;
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

export interface ThemeSettings {
    primaryColor: string;
    secondaryColor: string;
    dynamicTitleColorStart: string;
    dynamicTitleColorEnd: string;
    font: string;
    lightModeTextColor: string;
    darkModeTextColor: string;
    lightModeHeadingColor: string;
    darkModeHeadingColor: string;
    lightModeBgColor: string;
    darkModeBgColor: string;
    glowColor: string;
    glowAnimation: 'pulse' | 'static' | 'none';
}