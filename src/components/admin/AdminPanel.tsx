import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../firebase/firebaseConfig';
import { CloseIcon } from '../ui/icons';
import { WhyChooseUsFeature, Statistic, Project, ProjectCategory, LegalPage, SocialIconName, FloatingIconName, IconSourceType, IconSetting, ThemeSettings, ContentState } from '../../types';

// IMPORTANT: Import useContent from your context path if useContent.ts just re-exports it
// If your useContent.ts file now just exports useContent and ContentContext,
// and ContentContext.tsx holds the provider, then the import path might be:
import { useContent } from '../../hooks/useContent'; // Keep this line as is if it re-exports useContent from context
// OR, if you decide to put useContent directly in ContentContext.tsx and import it from there:
// import { useContent } from '../../context/ContentContext';


const emptyProject: Project = {
    id: `p${Date.now()}`,
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    category: 'Website',
    projectUrl: '',
    gallery: []
};

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details className="bg-gray-700/50 rounded-lg open:bg-gray-700/80 transition-colors duration-300" open={defaultOpen}>
        <summary className="text-lg font-semibold p-4 cursor-pointer hover:bg-gray-700/60 rounded-t-lg transition-colors">
            {title}
        </summary>
        <div className="p-4 border-t border-gray-600 space-y-4">
            {children}
        </div>
    </details>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    // Destructure content, themeSettings, and the new saveContentToDb
    const { content: fetchedContent, themeSettings: fetchedThemeSettings, loading, error, saveContentToDb } = useContent();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('content');

    // LOCAL STATE to hold changes before saving
    const [localContent, setLocalContent] = useState<ContentState>(fetchedContent);
    const [localThemeSettings, setLocalThemeSettings] = useState<ThemeSettings>(fetchedThemeSettings);

    // Sync fetched data with local state whenever fetched data changes
    // This ensures that when new data is loaded (e.g., after a save or initial fetch),
    // the local state in the admin panel is up-to-date.
    useEffect(() => {
        setLocalContent(fetchedContent);
        setLocalThemeSettings(fetchedThemeSettings);
    }, [fetchedContent, fetchedThemeSettings]);


    // State for the "Add New Project" form (remains local)
    const [newProject, setNewProject] = useState<Project>(emptyProject);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

    // State for save status feedback
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const projectCategories = useMemo(() =>
        [...new Set(localContent.latestProjects.projects.map(p => p.category))].sort(),
    [localContent.latestProjects.projects]);

    const socialIconNames: SocialIconName[] = ['Twitter', 'GitHub', 'LinkedIn', 'Facebook', 'Instagram', 'YouTube', 'Dribbble', 'Behance', 'TikTok', 'Pinterest', 'Discord', 'Vimeo', 'Telegram'];

    const floatingIconNames: FloatingIconName[] = ['WhatsApp', 'Bot', 'ArrowUp', 'Message', 'Support', 'Chat', 'Question'];

    // All these handlers now update LOCAL state
    const handleLocalContentChange = <K extends keyof ContentState>(key: K, value: ContentState[K]) => {
        setLocalContent(prev => ({ ...prev, [key]: value }));
    };

    const handleLocalThemeChange = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
        setLocalThemeSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleLocalArrayChange = (arrayName: keyof ContentState, index: number, field: string, value: any) => {
        const newArray = [...(localContent[arrayName] as any[])];
        newArray[index] = { ...newArray[index], [field]: value };
        handleLocalContentChange(arrayName, newArray as any);
    };

    const addLocalArrayItem = (arrayName: keyof ContentState, newItem: any) => {
        const newArray = [...(localContent[arrayName] as any[]), newItem];
        handleLocalContentChange(arrayName, newArray as any);
    };

    const deleteLocalArrayItem = (arrayName: keyof ContentState, index: number) => {
        const newArray = (localContent[arrayName] as any[]).filter((_, i) => i !== index);
        handleLocalContentChange(arrayName, newArray as any);
    };

    const handleLocalLegalPageChange = (page: 'privacyPolicy' | 'termsOfService', field: keyof LegalPage, value: string) => {
        setLocalContent(prev => ({
            ...prev,
            [page]: {
                ...prev[page],
                [field]: value
            }
        }));
    };

    const handleLocalProjectChange = (projectIndex: number, field: keyof Project, value: any) => {
        const updatedProjects = [...localContent.latestProjects.projects];
        const project = { ...updatedProjects[projectIndex], [field]: value };
        updatedProjects[projectIndex] = project;
        handleLocalContentChange('latestProjects', { ...localContent.latestProjects, projects: updatedProjects });
    };

    const handleLocalGalleryChange = (projectIndex: number, value: string) => {
        const updatedProjects = [...localContent.latestProjects.projects];
        updatedProjects[projectIndex].gallery = value.split('\n').map(s => s.trim()).filter(Boolean);
        handleLocalContentChange('latestProjects', { ...localContent.latestProjects, projects: updatedProjects });
    };

    const handleNewProjectChange = (field: keyof Project, value: any) => {
        setNewProject(prev => ({ ...prev, [field]: value }));
    };

    const handleAddNewProject = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCategory = isCreatingNewCategory ? newCategoryName.trim() : newProject.category;
        if (!finalCategory) {
            alert("Please select or create a category.");
            return;
        }
        const projectToAdd: Project = { ...newProject, category: finalCategory, id: `p${Date.now()}` };

        handleLocalContentChange('latestProjects', { ...localContent.latestProjects, projects: [...localContent.latestProjects.projects, projectToAdd] });

        // Reset form
        setNewProject(emptyProject);
        setNewCategoryName('');
        setIsCreatingNewCategory(false);
    };

    const deleteProject = (id: string) => {
        const updatedProjects = localContent.latestProjects.projects.filter(p => p.id !== id);
        handleLocalContentChange('latestProjects', { ...localContent.latestProjects, projects: updatedProjects });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = event.target.files?.[0];
        if (file) {
            // For now, still using FileReader as Firebase Storage integration is a separate phase
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    callback(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
            // TODO: In a later phase, this will involve uploading to Firebase Storage
            // and then calling callback with the Storage URL.
        }
    };

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
        }
        onClose();
    };

    const renderIconSettings = (buttonKey: 'whatsAppIcon' | 'aiAssistantIcon' | 'scrollToTopIcon', label: string) => {
        // Use localContent for reading values
        const setting = localContent.floatingButtons[buttonKey];

        const handleTypeChange = (newType: IconSourceType) => {
            const newSetting: IconSetting = {
                type: newType,
                value: newType === 'pre-built' ? 'WhatsApp' : '' // Default value
            };
            handleLocalContentChange('floatingButtons', { ...localContent.floatingButtons, [buttonKey]: newSetting });
        };

        const handleValueChange = (newValue: string) => {
            handleLocalContentChange('floatingButtons', { ...localContent.floatingButtons, [buttonKey]: { ...setting, value: newValue } });
        };

        return (
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                <div className="flex items-center space-x-4 bg-gray-600 p-2 rounded-lg">
                    <label className="flex items-center space-x-2 cursor-pointer text-sm">
                        <input type="radio" name={`${buttonKey}-type`} value="pre-built" checked={setting.type === 'pre-built'} onChange={() => handleTypeChange('pre-built')} className="form-radio h-4 w-4 text-brand-primary bg-gray-700 border-gray-500 focus:ring-brand-primary" />
                        <span>Pre-built</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer text-sm">
                        <input type="radio" name={`${buttonKey}-type`} value="url" checked={setting.type === 'url'} onChange={() => handleTypeChange('url')} className="form-radio h-4 w-4 text-brand-primary bg-gray-700 border-gray-500 focus:ring-brand-primary" />
                        <span>Custom</span>
                    </label>
                </div>

                <div className='mt-2'>
                    {setting.type === 'pre-built' ? (
                        <select
                            value={setting.value}
                            onChange={e => handleValueChange(e.target.value)}
                            className="w-full p-2 bg-gray-600 text-white rounded"
                        >
                            {floatingIconNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    ) : (
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Enter image URL"
                                value={setting.value as string}
                                onChange={e => handleValueChange(e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded"
                            />
                            <label htmlFor={`${buttonKey}-upload`} className="mt-2 inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                                Or Upload Icon
                            </label>
                            <input id={`${buttonKey}-upload`} type="file" accept="image/*,.svg" className="hidden" onChange={e => handleFileUpload(e, handleValueChange)} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderProjectsSection = () => (
        <>
            <CollapsibleSection title="Add New Project" defaultOpen>
                <form onSubmit={handleAddNewProject} className="space-y-4">
                    <input required placeholder="Project Title" type="text" value={newProject.title} onChange={e => handleNewProjectChange('title', e.target.value)} className="w-full p-2 bg-gray-600 rounded" />
                    <textarea required placeholder="Description" value={newProject.description} onChange={e => handleNewProjectChange('description', e.target.value)} className="w-full p-2 bg-gray-600 rounded" rows={3}/>
                    <input required placeholder="Cover Media URL" type="text" value={newProject.mediaUrl} onChange={e => handleNewProjectChange('mediaUrl', e.target.value)} className="w-full p-2 bg-gray-600 rounded" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <select
                                value={isCreatingNewCategory ? '--new--' : newProject.category}
                                onChange={e => {
                                    if (e.target.value === '--new--') {
                                        setIsCreatingNewCategory(true);
                                    } else {
                                        setIsCreatingNewCategory(false);
                                        handleNewProjectChange('category', e.target.value);
                                    }
                                }}
                                className="w-full p-2 bg-gray-600 rounded"
                            >
                                <option value="" disabled>Select a category</option>
                                {projectCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                <option value="--new--">Create New Category...</option>
                            </select>
                        </div>
                        {isCreatingNewCategory && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">New Category Name</label>
                                <input required type="text" placeholder="e.g. Video Production" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full p-2 bg-gray-600 rounded" />
                            </div>
                        )}
                    </div>
                    <input placeholder="Demo URL (optional)" type="url" value={newProject.projectUrl || ''} onChange={e => handleNewProjectChange('projectUrl', e.target.value)} className="w-full p-2 bg-gray-600 rounded" />
                    <textarea placeholder="Gallery Images (one URL per line, optional)" value={(newProject.gallery || []).join('\n')} onChange={e => handleNewProjectChange('gallery', e.target.value.split('\n'))} className="w-full p-2 bg-gray-600 rounded" rows={4}/>

                    <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Add Project</button>
                </form>
            </CollapsibleSection>

            <CollapsibleSection title="Manage Existing Projects">
                {projectCategories.length === 0 && <p className="text-gray-400">No projects yet. Add one above!</p>}
                {projectCategories.map(category => (
                    <CollapsibleSection key={category} title={category}>
                        {localContent.latestProjects.projects // Use localContent
                            .map((project, index) => ({ project, originalIndex: index })) // Keep original index
                            .filter(({ project }) => project.category === category)
                            .map(({ project, originalIndex }) => (
                                <div key={project.id} className="p-3 bg-gray-800 rounded-lg space-y-3">
                                    <input placeholder="Title" type="text" value={project.title} onChange={e => handleLocalProjectChange(originalIndex, 'title', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                                    <textarea placeholder="Description" value={project.description} onChange={e => handleLocalProjectChange(originalIndex, 'description', e.target.value)} className="w-full p-2 bg-gray-700 rounded" rows={2}/>
                                    <input placeholder="Cover Media URL" type="text" value={project.mediaUrl} onChange={e => handleLocalProjectChange(originalIndex, 'mediaUrl', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />

                                    <input placeholder="Demo URL (optional)" type="text" value={project.projectUrl || ''} onChange={e => handleLocalProjectChange(originalIndex, 'projectUrl', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                                    <textarea placeholder="Gallery Images (one URL per line, optional)" value={(project.gallery || []).join('\n')} onChange={e => handleLocalGalleryChange(originalIndex, e.target.value)} className="w-full p-2 bg-gray-700 rounded" rows={3}/>

                                    <button onClick={() => deleteProject(project.id)} className="w-full mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">Delete Project</button>
                                </div>
                            ))
                        }
                    </CollapsibleSection>
                ))}
            </CollapsibleSection>
        </>
    );

    // This function will be called when the "Save Changes" button is clicked
    const handleSaveAllChanges = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            // Call the saveContentToDb function from your context
            await saveContentToDb(localContent, localThemeSettings);
            setSaveMessage("Changes saved successfully!");
        } catch (err) {
            console.error("Error saving content:", err);
            setSaveMessage(`Error saving changes: ${(err as Error).message}`);
        } finally {
            setIsSaving(false);
            // Clear message after a few seconds
            setTimeout(() => setSaveMessage(null), 5000);
        }
    };

    const renderContentTab = () => (
        <div className="space-y-4">
            <CollapsibleSection title="Branding & Identity">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Site Name</label>
                    <input type="text" value={localContent.siteName} onChange={e => handleLocalContentChange('siteName', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tagline</label>
                    <input type="text" value={localContent.tagline} onChange={e => handleLocalContentChange('tagline', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Dynamic Title Structure</label>
                    <p className="text-xs text-gray-500 mb-2">Define the static prefix/suffix text and a comma-separated list of rotating words.</p>

                    <label className="block text-xs font-medium text-gray-400 mt-2 mb-1">Prefix Text</label>
                    <input type="text" placeholder="e.g., We Build " value={localContent.dynamicTitle.prefix} onChange={e => handleLocalContentChange('dynamicTitle', {...localContent.dynamicTitle, prefix: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" />

                    <label className="block text-xs font-medium text-gray-400 mt-2 mb-1">Rotating Words (comma separated)</label>
                    <textarea placeholder="e.g., Extraordinary Brands, Intelligent AI" value={(localContent.dynamicTitle.rotatingWords || []).join(', ')} onChange={e => handleLocalContentChange('dynamicTitle', {...localContent.dynamicTitle, rotatingWords: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 bg-gray-700 text-white rounded" rows={2}/>

                    <label className="block text-xs font-medium text-gray-400 mt-2 mb-1">Suffix Text</label>
                    <input type="text" placeholder="e.g., ." value={localContent.dynamicTitle.suffix} onChange={e => handleLocalContentChange('dynamicTitle', {...localContent.dynamicTitle, suffix: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Header Logo URL</label>
                    <input type="text" value={localContent.logos.header} onChange={e => handleLocalContentChange('logos', {...localContent.logos, header: e.target.value})} className="w-full p-2 bg-gray-600 text-white rounded" />
                    <label htmlFor="header-logo-upload" className="mt-2 inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                        Upload Header Logo
                    </label>
                    <input id="header-logo-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => handleLocalContentChange('logos', {...localContent.logos, header: url}))} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Footer Logo URL</label>
                    <input type="text" value={localContent.logos.footer} onChange={e => handleLocalContentChange('logos', {...localContent.logos, footer: e.target.value})} className="w-full p-2 bg-gray-600 text-white rounded" />
                    <label htmlFor="footer-logo-upload" className="mt-2 inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                        Upload Footer Logo
                    </label>
                    <input id="footer-logo-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => handleLocalContentChange('logos', {...localContent.logos, footer: url}))} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Projects">
                {renderProjectsSection()}
            </CollapsibleSection>

            <CollapsibleSection title="Page Sections">
                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">About Us</h4>
                <div>
                    <label htmlFor="about-us-intro" className="block text-sm font-medium text-gray-400 mb-1">Introduction</label>
                    <textarea id="about-us-intro" value={localContent.aboutUs.introduction} onChange={e => handleLocalContentChange('aboutUs', { ...localContent.aboutUs, introduction: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" rows={4}/>
                </div>
                <div>
                    <label htmlFor="about-us-mission" className="block text-sm font-medium text-gray-400 mb-1">Mission</label>
                    <textarea id="about-us-mission" value={localContent.aboutUs.mission} onChange={e => handleLocalContentChange('aboutUs', { ...localContent.aboutUs, mission: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" rows={3}/>
                </div>
                <div>
                    <label htmlFor="about-us-vision" className="block text-sm font-medium text-gray-400 mb-1">Vision</label>
                    <textarea id="about-us-vision" value={localContent.aboutUs.vision} onChange={e => handleLocalContentChange('aboutUs', { ...localContent.aboutUs, vision: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" rows={3}/>
                </div>
                <div>
                    <label htmlFor="about-us-media-url" className="block text-sm font-medium text-gray-400 mb-1">Media URL</label>
                    <input id="about-us-media-url" type="text" value={localContent.aboutUs.mediaUrl} onChange={e => handleLocalContentChange('aboutUs', { ...localContent.aboutUs, mediaUrl: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" placeholder="https://example.com/image.jpg"/>
                </div>

                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Services</h4>
                <p className="text-xs text-gray-500 mb-2">Add, edit, or delete the services offered. These appear in the 'Our Services' section on the homepage.</p>
                <button onClick={() => addLocalArrayItem('services', {id: `s${Date.now()}`, title: 'New Service', description: 'Description'})} className="mb-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+ Add Service</button>
                {localContent.services.map((service, index) => (
                    <div key={service.id} className="p-3 bg-gray-800 rounded space-y-2 mb-2">
                        <input placeholder="Service Title" type="text" value={service.title} onChange={e => handleLocalArrayChange('services', index, 'title', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                        <textarea placeholder="Service Description" value={service.description} onChange={e => handleLocalArrayChange('services', index, 'description', e.target.value)} className="w-full p-2 bg-gray-700 rounded" rows={2}/>
                        <button onClick={() => deleteLocalArrayItem('services', index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>
                    </div>
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Contact & Links">
                <div>
                    <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number</label>
                    <input id="whatsapp-number" type="text" value={localContent.whatsAppNumber} onChange={e => handleLocalContentChange('whatsAppNumber', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>

                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Contact Information</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Contact Form Recipient Email</label>
                    <p className="text-xs text-gray-500 mb-2">The email address where submitted contact forms will be sent.</p>
                    <input
                        type="email"
                        value={localContent.contactFormRecipientEmail}
                        onChange={e => handleLocalContentChange('contactFormRecipientEmail', e.target.value)}
                        className="w-full p-2 bg-gray-600 text-white rounded"
                        placeholder="recipient@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Public Email</label>
                    <input type="email" value={localContent.contactInfo.email} onChange={e => setLocalContent(p => ({ ...p, contactInfo: { ...p.contactInfo, email: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    <input type="tel" value={localContent.contactInfo.phone} onChange={e => setLocalContent(p => ({ ...p, contactInfo: { ...p.contactInfo, phone: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                    <input type="text" value={localContent.contactInfo.address} onChange={e => setLocalContent(p => ({ ...p, contactInfo: { ...p.contactInfo, address: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Map Embed URL</label>
                    <textarea value={localContent.contactInfo.mapEmbedUrl} onChange={e => setLocalContent(p => ({ ...p, contactInfo: { ...p.contactInfo, mapEmbedUrl: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" rows={4} />
                </div>

                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Header Links</h4>
                <button onClick={() => addLocalArrayItem('headerLinks', {id: `h${Date.now()}`, text: 'New', url: '#'})} className="mb-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+</button>
                {localContent.headerLinks.map((link, index) => (
                    <div key={link.id} className="p-3 bg-gray-800 rounded space-y-2 mb-2">
                        <input placeholder="Text" type="text" value={link.text} onChange={e => handleLocalArrayChange('headerLinks', index, 'text', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                        <input placeholder="URL" type="text" value={link.url} onChange={e => handleLocalArrayChange('headerLinks', index, 'url', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                        <button onClick={() => deleteLocalArrayItem('headerLinks', index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>
                    </div>
                ))}

                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Social Links</h4>
                <button onClick={() => addLocalArrayItem('socialLinks', {id: `so${Date.now()}`, name: 'Twitter', url: ''})} className="mb-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">+</button>
                {localContent.socialLinks.map((link, index) => (
                    <div key={link.id} className="p-3 bg-gray-800 rounded space-y-3 mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Icon</label>
                                <select value={link.name} onChange={e => handleLocalArrayChange('socialLinks', index, 'name', e.target.value)} className="w-full p-2 bg-gray-700 rounded capitalize">
                                    {socialIconNames.map(iconName => (
                                        <option key={iconName} value={iconName}>{iconName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">URL</label>
                                <input placeholder="https://social.com/profile" type="url" value={link.url} onChange={e => handleLocalArrayChange('socialLinks', index, 'url', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                            </div>
                        </div>
                        <button onClick={() => deleteLocalArrayItem('socialLinks', index)} className="w-full mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">Delete Social Link</button>
                    </div>
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Floating Action Buttons">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {renderIconSettings('whatsAppIcon', 'WhatsApp Button Icon')}
                    {renderIconSettings('aiAssistantIcon', 'AI Assistant Button Icon')}
                    {renderIconSettings('scrollToTopIcon', 'Scroll To Top Button Icon')}
                </div>
            </CollapsibleSection>


            <CollapsibleSection title="Legal Pages">
                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">Privacy Policy</h4>
                <div>
                    <label htmlFor="privacy-title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input id="privacy-title" type="text" value={localContent.privacyPolicy.title} onChange={e => handleLocalLegalPageChange('privacyPolicy', 'title', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label htmlFor="privacy-date" className="block text-sm font-medium text-gray-400 mb-1">Last Updated Date</label>
                    <input id="privacy-date" type="date" value={localContent.privacyPolicy.lastUpdated} onChange={e => handleLocalLegalPageChange('privacyPolicy', 'lastUpdated', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label htmlFor="privacy-content" className="block text-sm font-medium text-gray-400 mb-1">Content (use new lines for paragraphs)</label>
                    <textarea id="privacy-content" value={localContent.privacyPolicy.content} onChange={e => handleLocalLegalPageChange('privacyPolicy', 'content', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" rows={12}/>
                </div>

                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-6 mb-3">Terms of Service</h4>
                <div>
                    <label htmlFor="terms-title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input id="terms-title" type="text" value={localContent.termsOfService.title} onChange={e => handleLocalLegalPageChange('termsOfService', 'title', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label htmlFor="terms-date" className="block text-sm font-medium text-gray-400 mb-1">Last Updated Date</label>
                    <input id="terms-date" type="date" value={localContent.termsOfService.lastUpdated} onChange={e => handleLocalLegalPageChange('termsOfService', 'lastUpdated', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label htmlFor="terms-content" className="block text-sm font-medium text-gray-400 mb-1">Content (use new lines for paragraphs)</label>
                    <textarea id="terms-content" value={localContent.termsOfService.content} onChange={e => handleLocalLegalPageChange('termsOfService', 'content', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" rows={12}/>
                </div>
            </CollapsibleSection>
        </div>
    );

    const renderThemeTab = () => (
        <div className="space-y-4">
            <CollapsibleSection title="Colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Primary Color</label>
                        <input type="color" value={localThemeSettings.primaryColor} onChange={e => handleLocalThemeChange('primaryColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Secondary Color</label>
                        <input type="color" value={localThemeSettings.secondaryColor} onChange={e => handleLocalThemeChange('secondaryColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Light Mode Background</label>
                        <input type="color" value={localThemeSettings.lightModeBgColor} onChange={e => handleLocalThemeChange('lightModeBgColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Dark Mode Background</label>
                        <input type="color" value={localThemeSettings.darkModeBgColor} onChange={e => handleLocalThemeChange('darkModeBgColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Light Mode Text Color</label>
                        <input type="color" value={localThemeSettings.lightModeTextColor} onChange={e => handleLocalThemeChange('lightModeTextColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Dark Mode Text Color</label>
                        <input type="color" value={localThemeSettings.darkModeTextColor} onChange={e => handleLocalThemeChange('darkModeTextColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Light Mode Heading Color</label>
                        <input type="color" value={localThemeSettings.lightModeHeadingColor} onChange={e => handleLocalThemeChange('lightModeHeadingColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Dark Mode Heading Color</label>
                        <input type="color" value={localThemeSettings.darkModeHeadingColor} onChange={e => handleLocalThemeChange('darkModeHeadingColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Glow Color</label>
                        <input type="color" value={localThemeSettings.glowColor} onChange={e => handleLocalThemeChange('glowColor', e.target.value)} className="w-full h-10 p-1 bg-gray-600 rounded" />
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Typography">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Font Family</label>
                    <input type="text" value={localThemeSettings.fontFamily} onChange={e => handleLocalThemeChange('fontFamily', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" placeholder="e.g., 'Arial', sans-serif" />
                    <p className="text-xs text-gray-500 mt-1">Enter CSS font-family string. E.g., 'Roboto', sans-serif.</p>
                </div>
            </CollapsibleSection>
        </div>
    );


    if (loading) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-800 text-white shadow-lg p-6 z-50 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Admin Panel</h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                                <CloseIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                            <p className="text-lg text-gray-400">Loading content...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    if (error) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-red-800 text-white shadow-lg p-6 z-50 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Admin Panel Error</h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-red-700 transition-colors">
                                <CloseIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-grow flex items-center justify-center text-center">
                            <p className="text-lg text-white">
                                Failed to load content: {error.message}
                                <br />
                                Please check your Firebase configuration and network connection.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-800 text-white shadow-lg p-6 z-50 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Admin Panel</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {user && (
                        <div className="mb-4 text-sm text-gray-400">
                            Logged in as: <span className="font-semibold">{user.email}</span>
                            <button onClick={handleLogout} className="ml-4 text-brand-primary hover:underline">Logout</button>
                        </div>
                    )}

                    <div className="flex mb-6 border-b border-gray-600">
                        <button
                            className={`py-2 px-4 ${activeTab === 'content' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}
                            onClick={() => setActiveTab('content')}
                        >
                            Content
                        </button>
                        <button
                            className={`py-2 px-4 ${activeTab === 'theme' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}
                            onClick={() => setActiveTab('theme')}
                        >
                            Theme
                        </button>
                        {/* Add more tabs if needed */}
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        {activeTab === 'content' && renderContentTab()}
                        {activeTab === 'theme' && renderThemeTab()}
                    </div>

                    {/* Save Changes Button and Feedback */}
                    <div className="mt-6 pt-4 border-t border-gray-700">
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
                        {/* Display global loading/error from context */}
                        {loading && <p className="mt-2 text-center text-yellow-400 text-sm">Loading initial data...</p>}
                        {error && <p className="mt-2 text-center text-red-400 text-sm">Error loading data: {error.message}</p>}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdminPanel;