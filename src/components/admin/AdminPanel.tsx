import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { CloseIcon } from '../ui/icons';
import {
    Project, ContentState, ThemeSettings,
    WhyChooseUsFeature, Statistic, LegalPage, SocialLink, Link as HeaderLink, Service, IconSetting,
    SocialIconName, FloatingIconName
} from '../../types';

import { useContent } from '../../hooks/useContent';

const generateUniqueId = () => `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const emptyProject: Project = {
    id: generateUniqueId(),
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    category: 'Website',
    projectUrl: '',
    gallery: []
};

const emptyService: Service = {
    id: generateUniqueId(),
    title: '',
    description: ''
};

const emptyHeaderLink: HeaderLink = {
    id: generateUniqueId(),
    text: '',
    url: ''
};

const emptySocialLink: SocialLink = {
    id: generateUniqueId(),
    name: 'Facebook',
    url: ''
};

const emptyWhyChooseUsFeature: WhyChooseUsFeature = {
    id: generateUniqueId(),
    title: '',
    description: '',
    icon: 'Innovation'
};

const emptyStatistic: Statistic = {
    id: generateUniqueId(),
    label: '',
    value: '',
    suffix: ''
};

const emptyAboutUsValue: { id: string; title: string; description: string; icon: 'Lightbulb' | 'UsersGroup' | 'ShieldCheck' } = {
    id: generateUniqueId(),
    title: '',
    description: '',
    icon: 'Lightbulb'
};

const emptyLegalPage: LegalPage = {
    id: generateUniqueId(),
    title: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    content: ''
};

const defaultIconSetting: IconSetting = {
    type: 'pre-built',
    value: 'WhatsApp'
};

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details className="bg-gray-700/50 rounded-lg open:bg-gray-800 p-4 mb-4" open={defaultOpen}>
        <summary className="text-white font-semibold text-lg cursor-pointer outline-none focus:outline-none">
            {title}
        </summary>
        <div className="mt-4 border-t border-gray-600 pt-4">
            {children}
        </div>
    </details>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    const { user, signOut } = useAuth();
    const { content: fetchedContent, themeSettings: fetchedThemeSettings, loading, error, saveContentToDb } = useContent();

    const [localContent, setLocalContent] = useState<ContentState>(fetchedContent);
    const [localThemeSettings, setLocalThemeSettings] = useState<ThemeSettings>(fetchedThemeSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [newProject, setNewProject] = useState<Project>(emptyProject);
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [activeTab, setActiveTab] = useState<'general' | 'content' | 'theme' | 'projects'>('general');

    const [scrollToId, setScrollToId] = useState<string | null>(null);
    const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

    useEffect(() => {
        setLocalContent(fetchedContent);
        setLocalThemeSettings(fetchedThemeSettings);
    }, [fetchedContent, fetchedThemeSettings]);

    useEffect(() => {
        if (scrollToId && itemRefs.current[scrollToId]) {
            itemRefs.current[scrollToId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const firstInput = itemRefs.current[scrollToId]?.querySelector('input, textarea, select') as HTMLElement;
            if (firstInput) {
                firstInput.focus();
            }
            setScrollToId(null);
        }
    }, [scrollToId]);


    const projectCategories = useMemo(() =>
        [...new Set(localContent.latestProjects.projects.map(p => p.category))].sort(),
        [localContent.latestProjects.projects]
    );

    const handleContentFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, path: string) => {
        const { name, value } = e.target;
        setLocalContent(prevContent => {
            const newContent = JSON.parse(JSON.stringify(prevContent));
            let currentLevel: any = newContent;
            const pathParts = path.split('.');

            for (let i = 0; i < pathParts.length; i++) {
                if (i === pathParts.length - 1) {
                    currentLevel[pathParts[i]][name] = value;
                } else {
                    if (!currentLevel[pathParts[i]]) {
                        currentLevel[pathParts[i]] = {};
                    }
                    currentLevel = currentLevel[pathParts[i]];
                }
            }
            return newContent;
        });
        setSaveMessage('Changes pending. Click Save All Changes.');
    }, []);

    const handleArrayItemChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, arrayKey: keyof ContentState, id: string, field: string) => {
        const { value } = e.target;
        setLocalContent(prevContent => ({
            ...prevContent,
            [arrayKey]: (prevContent[arrayKey] as any[]).map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
        setSaveMessage('Changes pending. Click Save All Changes.');
    }, []);

    const handleAddItem = useCallback((arrayKey: keyof ContentState, defaultItem: any) => {
        const newId = generateUniqueId();
        setLocalContent(prevContent => ({
            ...prevContent,
            [arrayKey]: [...(prevContent[arrayKey] as any[]), { ...defaultItem, id: newId }]
        }));
        setSaveMessage('Changes pending. Click Save All Changes.');
        setScrollToId(newId);
    }, []);

    const handleRemoveItem = useCallback((arrayKey: keyof ContentState, id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setLocalContent(prevContent => ({
                ...prevContent,
                [arrayKey]: (prevContent[arrayKey] as any[]).filter(item => item.id !== id)
            }));
            setSaveMessage('Changes pending. Click Save All Changes.');
        }
    }, []);

    const handleIconSettingChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, iconName: keyof typeof localContent.floatingButtons) => {
        const { name, value } = e.target;
        setLocalContent(prevContent => ({
            ...prevContent,
            floatingButtons: {
                ...prevContent.floatingButtons,
                [iconName]: {
                    ...prevContent.floatingButtons[iconName],
                    [name]: value
                }
            }
        }));
        setSaveMessage('Changes pending. Click Save All Changes.');
    }, []);

    const handleThemeSettingChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalThemeSettings(prevTheme => ({
            ...prevTheme,
            [name]: value,
        }));
        setSaveMessage('Changes pending. Click Save All Changes.');
    }, []);

    const handleAddNewProject = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const finalCategory = isCreatingNewCategory && newCategoryName.trim() ? newCategoryName.trim() : newProject.category;

        if (!finalCategory) {
            alert("Please select or create a category for the project.");
            return;
        }

        const newProjectId = generateUniqueId();
        const projectToAdd: Project = {
            ...newProject,
            id: newProjectId,
            category: finalCategory,
        };

        setLocalContent(prevContent => ({
            ...prevContent,
            latestProjects: {
                ...prevContent.latestProjects,
                projects: [...prevContent.latestProjects.projects, projectToAdd],
            },
        }));

        setNewProject(emptyProject);
        setNewCategoryName('');
        setIsCreatingNewCategory(false);
        setSaveMessage('Changes pending. Click Save All Changes.');
        setScrollToId(newProjectId);
    }, [newProject, isCreatingNewCategory, newCategoryName]);

    const deleteProject = useCallback((id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setLocalContent(prevContent => ({
                ...prevContent,
                latestProjects: {
                    ...prevContent.latestProjects,
                    projects: prevContent.latestProjects.projects.filter(p => p.id !== id),
                },
            }));
            setSaveMessage('Changes pending. Click Save All Changes.');
        }
    }, []);

    const handleNewProjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleExistingProjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, projectId: string, field: keyof Project) => {
        const { value } = e.target;
        setLocalContent(prevContent => ({
            ...prevContent,
            latestProjects: {
                ...prevContent.latestProjects,
                projects: prevContent.latestProjects.projects.map(p =>
                    p.id === projectId ? { ...p, [field]: value } : p
                ),
            },
        }));
        setSaveMessage('Changes pending. Click Save All Changes.');
    }, []);


    const handleSaveAllChanges = useCallback(async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            await saveContentToDb(localContent, localThemeSettings);
            setSaveMessage("Changes saved successfully!");
        } catch (error: any) {
            setSaveMessage(`Error saving changes: ${error.message}`);
            console.error("Failed to save changes:", error);
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 5000);
        }
    }, [localContent, localThemeSettings, saveContentToDb]);

    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
            onClose();
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to sign out. Please try again.");
        }
    }, [signOut, onClose]);


    const MotionDiv = motion.div;

    if (!user) {
        return null;
    }

    const panelVariants = {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: "0%", opacity: 1 },
        exit: { x: "100%", opacity: 0 },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 0.7 },
        exit: { opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    className="fixed inset-0 bg-black z-40"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                />
            )}
            {isOpen && (
                <MotionDiv
                    className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-gray-900 shadow-lg p-6 overflow-y-auto z-50 text-white"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-brand-primary">Admin Panel</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <CloseIcon className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-300">Welcome, {user.email}!</p>
                        <button
                            onClick={handleSignOut}
                            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors mb-4"
                        >
                            Sign Out
                        </button>

                        <div className="flex border-b border-gray-700 mb-4">
                            <button
                                className={`py-2 px-4 text-lg font-medium ${activeTab === 'general' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('general')}
                            >
                                General
                            </button>
                            <button
                                className={`py-2 px-4 text-lg font-medium ${activeTab === 'content' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('content')}
                            >
                                Content
                            </button>
                            <button
                                className={`py-2 px-4 text-lg font-medium ${activeTab === 'projects' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('projects')}
                            >
                                Projects
                            </button>
                            <button
                                className={`py-2 px-4 text-lg font-medium ${activeTab === 'theme' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('theme')}
                            >
                                Theme
                            </button>
                        </div>

                        <div>
                            {activeTab === 'general' && (
                                <>
                                    <CollapsibleSection title="General Site Content">
                                        <label className="block mb-2">Site Name</label>
                                        <input
                                            type="text"
                                            name="siteName"
                                            value={localContent.siteName || ''}
                                            onChange={e => {
                                                setLocalContent(prev => ({ ...prev, siteName: e.target.value }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                            }}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Tagline</label>
                                        <input
                                            type="text"
                                            name="tagline"
                                            value={localContent.tagline || ''}
                                            onChange={e => {
                                                setLocalContent(prev => ({ ...prev, tagline: e.target.value }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                            }}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Header Logo URL</label>
                                        <input
                                            type="text"
                                            name="header"
                                            value={localContent.logos.header || ''}
                                            onChange={e => {
                                                setLocalContent(prev => ({ ...prev, logos: { ...prev.logos, header: e.target.value } }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                            }}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Footer Logo URL</label>
                                        <input
                                            type="text"
                                            name="footer"
                                            value={localContent.logos.footer || ''}
                                            onChange={e => {
                                                setLocalContent(prev => ({ ...prev, logos: { ...prev.logos, footer: e.target.value } }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                            }}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                    </CollapsibleSection>

                                    <CollapsibleSection title="About Us Section">
                                        <label className="block mb-2">Introduction Text</label>
                                        <textarea
                                            name="introduction"
                                            value={localContent.aboutUs.introduction || ''}
                                            onChange={e => handleContentFieldChange(e, 'aboutUs')}
                                            rows={4}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Mission Text</label>
                                        <textarea
                                            name="mission"
                                            value={localContent.aboutUs.mission || ''}
                                            onChange={e => handleContentFieldChange(e, 'aboutUs')}
                                            rows={4}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Vision Text</label>
                                        <textarea
                                            name="vision"
                                            value={localContent.aboutUs.vision || ''}
                                            onChange={e => handleContentFieldChange(e, 'aboutUs')}
                                            rows={4}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">About Us Media Type</label>
                                        <select
                                            name="mediaType"
                                            value={localContent.aboutUs.mediaType || 'none'}
                                            onChange={e => handleContentFieldChange(e, 'aboutUs')}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        >
                                            <option value="none">None</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                        {localContent.aboutUs.mediaType !== 'none' && (
                                            <>
                                                <label className="block mb-2">About Us Media URL</label>
                                                <input
                                                    type="text"
                                                    name="mediaUrl"
                                                    value={localContent.aboutUs.mediaUrl || ''}
                                                    onChange={e => handleContentFieldChange(e, 'aboutUs')}
                                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                                />
                                            </>
                                        )}

                                        <h3 className="text-xl font-semibold mb-2 mt-6">Core Values</h3>
                                        {(localContent.aboutUs.values ?? []).map((value) => (
                                            <div key={value.id} ref={el => itemRefs.current[value.id] = el} className="bg-gray-800 p-3 rounded-md mb-3">
                                                <label className="block mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={value.title}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            aboutUs: {
                                                                ...prev.aboutUs,
                                                                values: prev.aboutUs.values.map(item => item.id === value.id ? { ...item, title: e.target.value } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Description</label>
                                                <textarea
                                                    value={value.description}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            aboutUs: {
                                                                ...prev.aboutUs,
                                                                values: prev.aboutUs.values.map(item => item.id === value.id ? { ...item, description: e.target.value } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    rows={2}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Icon</label>
                                                <select
                                                    value={value.icon}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            aboutUs: {
                                                                ...prev.aboutUs,
                                                                values: prev.aboutUs.values.map(item => item.id === value.id ? { ...item, icon: e.target.value as any } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                >
                                                    <option value="Lightbulb">Lightbulb</option>
                                                    <option value="UsersGroup">Users Group</option>
                                                    <option value="ShieldCheck">Shield Check</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this value?')) {
                                                            setLocalContent(prev => ({
                                                                ...prev,
                                                                aboutUs: {
                                                                    ...prev.aboutUs,
                                                                    values: prev.aboutUs.values.filter(item => item.id !== value.id)
                                                                }
                                                            }));
                                                            setSaveMessage('Changes pending. Click Save All Changes.');
                                                        }
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                                                >
                                                    Remove Value
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newId = generateUniqueId();
                                                setLocalContent(prev => ({
                                                    ...prev,
                                                    aboutUs: {
                                                        ...prev.aboutUs,
                                                        values: [...prev.aboutUs.values, { ...emptyAboutUsValue, id: newId }]
                                                    }
                                                }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                                setScrollToId(newId);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                                        >
                                            Add New Value
                                        </button>
                                    </CollapsibleSection>

                                    <CollapsibleSection title="Why Choose Us Section">
                                        <label className="block mb-2">Section Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={localContent.whyChooseUs.title || ''}
                                            onChange={e => {
                                                setLocalContent(prev => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, title: e.target.value } }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                            }}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />

                                        <h3 className="text-xl font-semibold mb-2 mt-6">Features</h3>
                                        {(localContent.whyChooseUs.features ?? []).map((feature) => (
                                            <div key={feature.id} ref={el => itemRefs.current[feature.id] = el} className="bg-gray-800 p-3 rounded-md mb-3">
                                                <label className="block mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={feature.title}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            whyChooseUs: {
                                                                ...prev.whyChooseUs,
                                                                features: prev.whyChooseUs.features.map(item => item.id === feature.id ? { ...item, title: e.target.value } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Description</label>
                                                <textarea
                                                    value={feature.description}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            whyChooseUs: {
                                                                ...prev.whyChooseUs,
                                                                features: prev.whyChooseUs.features.map(item => item.id === feature.id ? { ...item, description: e.target.value } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    rows={2}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Icon</label>
                                                <select
                                                    value={feature.icon}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            whyChooseUs: {
                                                                ...prev.whyChooseUs,
                                                                features: prev.whyChooseUs.features.map(item => item.id === feature.id ? { ...item, icon: e.target.value as any } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                >
                                                    <option value="Innovation">Innovation</option>
                                                    <option value="Quality">Quality</option>
                                                    <option value="Partnership">Partnership</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this feature?')) {
                                                            setLocalContent(prev => ({
                                                                ...prev,
                                                                whyChooseUs: {
                                                                    ...prev.whyChooseUs,
                                                                    features: prev.whyChooseUs.features.filter(item => item.id !== feature.id)
                                                                }
                                                            }));
                                                            setSaveMessage('Changes pending. Click Save All Changes.');
                                                        }
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                                                >
                                                    Remove Feature
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newId = generateUniqueId();
                                                setLocalContent(prev => ({
                                                    ...prev,
                                                    whyChooseUs: {
                                                        ...prev.whyChooseUs,
                                                        features: [...prev.whyChooseUs.features, { ...emptyWhyChooseUsFeature, id: newId }]
                                                    }
                                                }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                                setScrollToId(newId);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                                        >
                                            Add New Feature
                                        </button>

                                        <h3 className="text-xl font-semibold mb-2 mt-6">Statistics</h3>
                                        {(localContent.whyChooseUs.statistics ?? []).map((stat) => (
                                            <div key={stat.id} ref={el => itemRefs.current[stat.id] = el} className="bg-gray-800 p-3 rounded-md mb-3">
                                                <label className="block mb-1">Label</label>
                                                <input
                                                    type="text"
                                                    value={stat.label}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            whyChooseUs: {
                                                                ...prev.whyChooseUs,
                                                                statistics: prev.whyChooseUs.statistics.map(item => item.id === stat.id ? { ...item, label: e.target.value } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Value</label>
                                                <input
                                                    type="text"
                                                    value={stat.value}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            whyChooseUs: {
                                                                ...prev.whyChooseUs,
                                                                statistics: prev.whyChooseUs.statistics.map(item => item.id === stat.id ? { ...item, value: e.target.value } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Suffix</label>
                                                <input
                                                    type="text"
                                                    value={stat.suffix}
                                                    onChange={e => {
                                                        setLocalContent(prev => ({
                                                            ...prev,
                                                            whyChooseUs: {
                                                                ...prev.whyChooseUs,
                                                                statistics: prev.whyChooseUs.statistics.map(item => item.id === stat.id ? { ...item, suffix: e.target.value } : item)
                                                            }
                                                        }));
                                                        setSaveMessage('Changes pending. Click Save All Changes.');
                                                    }}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this statistic?')) {
                                                            setLocalContent(prev => ({
                                                                ...prev,
                                                                whyChooseUs: {
                                                                    ...prev.whyChooseUs,
                                                                    statistics: prev.whyChooseUs.statistics.filter(item => item.id !== stat.id)
                                                                }
                                                            }));
                                                            setSaveMessage('Changes pending. Click Save All Changes.');
                                                        }
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                                                >
                                                    Remove Statistic
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newId = generateUniqueId();
                                                setLocalContent(prev => ({
                                                    ...prev,
                                                    whyChooseUs: {
                                                        ...prev.whyChooseUs,
                                                        statistics: [...prev.whyChooseUs.statistics, { ...emptyStatistic, id: newId }]
                                                    }
                                                }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                                setScrollToId(newId);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                                        >
                                            Add New Statistic
                                        </button>
                                    </CollapsibleSection>
                                </>
                            )}

                            {activeTab === 'content' && (
                                <>
                                    <CollapsibleSection title="Our Services">
                                        {(localContent.services ?? []).map((service) => (
                                            <div key={service.id} ref={el => itemRefs.current[service.id] = el} className="bg-gray-800 p-3 rounded-md mb-3">
                                                <label className="block mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={service.title}
                                                    onChange={e => handleArrayItemChange(e, 'services', service.id, 'title')}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Description</label>
                                                <textarea
                                                    value={service.description}
                                                    onChange={e => handleArrayItemChange(e, 'services', service.id, 'description')}
                                                    rows={3}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <button
                                                    onClick={() => handleRemoveItem('services', service.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                                                >
                                                    Remove Service
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleAddItem('services', emptyService)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                                        >
                                            Add New Service
                                        </button>
                                    </CollapsibleSection>

                                    <CollapsibleSection title="Contact Information">
                                        <label className="block mb-2">Contact Form Recipient Email</label>
                                        <input
                                            type="email"
                                            name="contactFormRecipientEmail"
                                            value={localContent.contactFormRecipientEmail || ''}
                                            onChange={e => {
                                                setLocalContent(prev => ({ ...prev, contactFormRecipientEmail: e.target.value }));
                                                setSaveMessage('Changes pending. Click Save All Changes.');
                                            }}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={localContent.contactInfo.email || ''}
                                            onChange={e => handleContentFieldChange(e, 'contactInfo')}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={localContent.contactInfo.phone || ''}
                                            onChange={e => handleContentFieldChange(e, 'contactInfo')}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={localContent.contactInfo.address || ''}
                                            onChange={e => handleContentFieldChange(e, 'contactInfo')}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                        <label className="block mb-2">Map Embed URL (iFrame src)</label>
                                        <textarea
                                            name="mapEmbedUrl"
                                            value={localContent.contactInfo.mapEmbedUrl || ''}
                                            onChange={e => handleContentFieldChange(e, 'contactInfo')}
                                            rows={3}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                        />
                                    </CollapsibleSection>

                                    <CollapsibleSection title="Header Links (Main Menu)">
                                        {(localContent.headerLinks ?? []).map((link) => (
                                            <div key={link.id} ref={el => itemRefs.current[link.id] = el} className="bg-gray-800 p-3 rounded-md mb-3">
                                                <label className="block mb-1">Text</label>
                                                <input
                                                    type="text"
                                                    value={link.text}
                                                    onChange={e => handleArrayItemChange(e, 'headerLinks', link.id, 'text')}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">URL</label>
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={e => handleArrayItemChange(e, 'headerLinks', link.id, 'url')}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <button
                                                    onClick={() => handleRemoveItem('headerLinks', link.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                                                >
                                                    Remove Link
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleAddItem('headerLinks', emptyHeaderLink)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                                        >
                                            Add New Link
                                        </button>
                                    </CollapsibleSection>

                                    <CollapsibleSection title="Social Links">
                                        {(localContent.socialLinks ?? []).map((link) => (
                                            <div key={link.id} ref={el => itemRefs.current[link.id] = el} className="bg-gray-800 p-3 rounded-md mb-3">
                                                <label className="block mb-1">Name (for icon)</label>
                                                <select
                                                    value={link.name}
                                                    onChange={e => handleArrayItemChange(e, 'socialLinks', link.id, 'name')}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                >
                                                    {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'GitHub', 'Dribbble', 'Behance', 'TikTok', 'Pinterest', 'Discord', 'Vimeo', 'Telegram'].map(iconName => (
                                                        <option key={iconName} value={iconName}>{iconName}</option>
                                                    ))}
                                                </select>
                                                <label className="block mb-1">URL</label>
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={e => handleArrayItemChange(e, 'socialLinks', link.id, 'url')}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <button
                                                    onClick={() => handleRemoveItem('socialLinks', link.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                                                >
                                                    Remove Social Link
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleAddItem('socialLinks', emptySocialLink)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                                        >
                                            Add New Social Link
                                        </button>
                                    </CollapsibleSection>

                                    <CollapsibleSection title="Floating Action Buttons">
                                        {Object.keys(localContent.floatingButtons).map(key => {
                                            const iconSetting = localContent.floatingButtons[key as keyof typeof localContent.floatingButtons];
                                            return (
                                                <div key={key} className="bg-gray-800 p-3 rounded-md mb-3">
                                                    <h4 className="font-semibold text-white mb-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                                                    <label className="block mb-1">Icon Type</label>
                                                    <select
                                                        name="type"
                                                        value={iconSetting.type}
                                                        onChange={e => handleIconSettingChange(e, key as keyof typeof localContent.floatingButtons)}
                                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                    >
                                                        <option value="pre-built">Pre-built Icon</option>
                                                        <option value="url">Image URL</option>
                                                    </select>
                                                    <label className="block mb-1">
                                                        {iconSetting.type === 'pre-built' ? 'Pre-built Icon Name' : 'Image URL'}
                                                    </label>
                                                    {iconSetting.type === 'pre-built' ? (
                                                        <select
                                                            name="value"
                                                            value={iconSetting.value}
                                                            onChange={e => handleIconSettingChange(e, key as keyof typeof localContent.floatingButtons)}
                                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                        >
                                                            {['WhatsApp', 'Bot', 'ArrowUp', 'Message', 'Support', 'Chat', 'Question'].map(iconName => (
                                                                <option key={iconName} value={iconName}>{iconName}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="value"
                                                            value={iconSetting.value}
                                                            onChange={e => handleIconSettingChange(e, key as keyof typeof localContent.floatingButtons)}
                                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </CollapsibleSection>

                                    <CollapsibleSection title="Legal Pages">
                                        {(localContent.legalPages ?? []).map((page) => (
                                            <div key={page.id} ref={el => itemRefs.current[page.id] = el} className="bg-gray-800 p-3 rounded-md mb-3">
                                                <label className="block mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={page.title}
                                                    onChange={e => handleArrayItemChange(e, 'legalPages', page.id, 'title')}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Last Updated</label>
                                                <input
                                                    type="date"
                                                    value={page.lastUpdated}
                                                    onChange={e => handleArrayItemChange(e, 'legalPages', page.id, 'lastUpdated')}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <label className="block mb-1">Content</label>
                                                <textarea
                                                    value={page.content}
                                                    onChange={e => handleArrayItemChange(e, 'legalPages', page.id, 'content')}
                                                    rows={5}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                />
                                                <button
                                                    onClick={() => handleRemoveItem('legalPages', page.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                                                >
                                                    Remove Page
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleAddItem('legalPages', emptyLegalPage)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                                        >
                                            Add New Legal Page
                                        </button>
                                    </CollapsibleSection>
                                </>
                            )}

                            {activeTab === 'theme' && (
                                <CollapsibleSection title="Theme Settings">
                                    <label className="block mb-2">Font Family (CSS string)</label>
                                    <input
                                        type="text"
                                        name="fontFamily"
                                        value={localThemeSettings.fontFamily || ''}
                                        onChange={handleThemeSettingChange}
                                        placeholder="'Roboto', sans-serif"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                    />
                                    <label className="block mb-2">Primary Color</label>
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={localThemeSettings.primaryColor || '#FF4C60'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"

                                    />
                                    <label className="block mb-2">Secondary Color</label>
                                    <input
                                        type="color"
                                        name="secondaryColor"
                                        value={localThemeSettings.secondaryColor || '#17D161'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                    />

                                    <label className="block mb-2">Dark Mode Background Color</label>
                                    <input
                                        type="color"
                                        name="darkModeBgColor"
                                        value={localThemeSettings.darkModeBgColor || '#1A1A1A'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                    />
                                    <label className="block mb-2">Dark Mode Heading Color</label>
                                    <input
                                        type="color"
                                        name="darkModeHeadingColor"
                                        value={localThemeSettings.darkModeHeadingColor || '#FFFFFF'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                    />
                                    <label className="block mb-2">Dark Mode Text Color</label>
                                    <input
                                        type="color"
                                        name="darkModeTextColor"
                                        value={localThemeSettings.darkModeTextColor || '#F0F0F0'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                    />
                                    <label className="block mb-2">Light Mode Background Color</label>
                                    <input
                                        type="color"
                                        name="lightModeBgColor"
                                        value={localThemeSettings.lightModeBgColor || '#FFFFFF'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4" />
                                    <label className="block mb-2">Light Mode Heading Color</label>
                                    <input
                                        type="color"
                                        name="lightModeHeadingColor"
                                        value={localThemeSettings.lightModeHeadingColor || '#333333'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                    />
                                    <label className="block mb-2">Light Mode Text Color</label>
                                    <input
                                        type="color"
                                        name="lightModeTextColor"
                                        value={localThemeSettings.lightModeTextColor || '#555555'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4" />

                                    <label className="block mb-2">Dynamic Title Color Start</label>
                                    <input
                                        type="color"
                                        name="dynamicTitleColorStart"
                                        value={localThemeSettings.dynamicTitleColorStart || '#FF4C60'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4" />

                                    <label className="block mb-2">Dynamic Title Color End</label>
                                    <input
                                        type="color"
                                        name="dynamicTitleColorEnd"
                                        value={localThemeSettings.dynamicTitleColorEnd || '#17D161'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4" />

                                    <label className="block mb-2">Glow Animation (CSS string)</label>
                                    <input
                                        type="text"
                                        name="glowAnimation"
                                        value={localThemeSettings.glowAnimation || 'pulse'}
                                        onChange={handleThemeSettingChange}
                                        placeholder="'pulse, spin'"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                                    />
                                    <label className="block mb-2">Glow Color</label>
                                    <input
                                        type="color"
                                        name="glowColor"
                                        value={localThemeSettings.glowColor || '#FF4C60'}
                                        onChange={handleThemeSettingChange}
                                        className="w-full h-8 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4" />
                                </CollapsibleSection>
                            )}

                            {activeTab === 'projects' && (
                                <CollapsibleSection title="Project Management">
                                    <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
                                    <form onSubmit={handleAddNewProject} className="space-y-4 mb-8">
                                        <label className="block">Project Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newProject.title}
                                            onChange={handleNewProjectChange}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                                            required
                                        />

                                        <label className="block">Project Description</label>
                                        <textarea
                                            name="description"
                                            value={newProject.description}
                                            onChange={handleNewProjectChange}
                                            rows={3}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                                            required
                                        />

                                        <label className="block">Project Media URL (Image/Video)</label>
                                        <input
                                            type="text"
                                            name="mediaUrl"
                                            value={newProject.mediaUrl}
                                            onChange={handleNewProjectChange}
                                            placeholder="e.g., https://example.com/image.jpg"
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                                            required
                                        />

                                        <label className="block">Media Type</label>
                                        <select
                                            name="mediaType"
                                            value={newProject.mediaType}
                                            onChange={handleNewProjectChange}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                                        >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>

                                        <label className="block">Project URL (External Link)</label>
                                        <input
                                            type="url"
                                            name="projectUrl"
                                            value={newProject.projectUrl}
                                            onChange={handleNewProjectChange}
                                            placeholder="e.g., https://www.yourproject.com"
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                                        />

                                        <label className="block">Project Category</label>
                                        {isCreatingNewCategory ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Enter new category name"
                                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreatingNewCategory(false)}
                                                    className="text-sm text-brand-secondary hover:underline"
                                                >
                                                    Use existing categories
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <select
                                                    name="category"
                                                    value={newProject.category}
                                                    onChange={handleNewProjectChange}
                                                    className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white flex-grow"
                                                >
                                                    {projectCategories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                    {/* Option for existing category, if editing to a new one not already in list */}
                                                    {!projectCategories.includes(newProject.category) && newProject.category && (
                                                        <option value={newProject.category}>{newProject.category} (Current)</option>
                                                    )}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreatingNewCategory(true)}
                                                    className="py-2 px-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-md text-sm"
                                                >
                                                    + New Category
                                                </button>
                                            </div>
                                        )}


                                        <button
                                            type="submit"
                                            className="w-full py-3 px-6 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
                                        >
                                            Add Project
                                        </button>
                                    </form>

                                    <h3 className="text-xl font-semibold mb-4">Existing Projects</h3>
                                    <div className="space-y-4">
                                        {localContent.latestProjects.projects.length === 0 ? (
                                            <p className="text-gray-400">No projects added yet.</p>
                                        ) : (
                                            (localContent.latestProjects.projects ?? []).map((project) => (
                                                <div key={project.id} ref={el => itemRefs.current[project.id] = el} className="bg-gray-800 p-4 rounded-lg space-y-3">
                                                    <label className="block mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={project.title}
                                                        onChange={e => handleExistingProjectChange(e, project.id, 'title')}
                                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                                    />
                                                    <label className="block mb-1">Description</label>
                                                    <textarea
                                                        value={project.description}
                                                        onChange={e => handleExistingProjectChange(e, project.id, 'description')}
                                                        rows={3}
                                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                                    />
                                                    <label className="block mb-1">Media URL</label>
                                                    <input
                                                        type="text"
                                                        value={project.mediaUrl}
                                                        onChange={e => handleExistingProjectChange(e, project.id, 'mediaUrl')}
                                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                                    />
                                                    <label className="block mb-1">Media Type</label>
                                                    <select
                                                        value={project.mediaType}
                                                        onChange={e => handleExistingProjectChange(e, project.id, 'mediaType')}
                                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                                    >
                                                        <option value="image">Image</option>
                                                        <option value="video">Video</option>
                                                    </select>
                                                    <label className="block mb-1">Category</label>
                                                    <select
                                                        value={project.category}
                                                        onChange={e => handleExistingProjectChange(e, project.id, 'category')}
                                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                                    >
                                                        {projectCategories.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                        {/* Option for existing category, if editing to a new one not already in list */}
                                                        {!projectCategories.includes(project.category) && project.category && (
                                                            <option value={project.category}>{project.category} (Current)</option>
                                                        )}
                                                    </select>

                                                    <label className="block mb-1">Project URL</label>
                                                    <input
                                                        type="text"
                                                        value={project.projectUrl}
                                                        onChange={e => handleExistingProjectChange(e, project.id, 'projectUrl')}
                                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                                    />
                                                    <button
                                                        onClick={() => deleteProject(project.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm mt-3 w-full"
                                                    >
                                                        Delete Project
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CollapsibleSection>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <button
                            onClick={handleSaveAllChanges}
                            disabled={isSaving}
                            className={`w-full py-3 px-6 rounded-lg text-lg font-bold transition-colors ${
                                isSaving ? 'bg-gray-500 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-secondary'
                            } text-white`}
                        >
                            {isSaving ? 'Saving...' : 'Save All Changes'}
                        </button>
                        {saveMessage && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`mt-3 text-center text-sm ${saveMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}
                            >
                                {saveMessage}
                            </motion.p>
                        )}
                        {loading && <p className="mt-2 text-center text-yellow-400 text-sm">Loading initial data...</p>}
                        {error && <p className="mt-2 text-center text-red-400 text-sm">Error loading data: {error.message}</p>}
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};

export default AdminPanel;
