
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useContent } from '../../hooks/useContent';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../firebase/firebaseConfig';
import { CloseIcon } from '../ui/icons';
import { WhyChooseUsFeature, Statistic, Project, ProjectCategory, LegalPage, SocialIconName, FloatingIconName, IconSourceType, IconSetting, ThemeSettings } from '../../types';

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
    const { content, setContent, themeSettings, setThemeSettings } = useContent();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('content');
    
    // State for the "Add New Project" form
    const [newProject, setNewProject] = useState<Project>(emptyProject);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

    const projectCategories = useMemo(() => 
        [...new Set(content.latestProjects.projects.map(p => p.category))].sort(),
    [content.latestProjects.projects]);

    const socialIconNames: SocialIconName[] = ['Twitter', 'GitHub', 'LinkedIn', 'Facebook', 'Instagram', 'YouTube', 'Dribbble', 'Behance', 'TikTok', 'Pinterest', 'Discord', 'Vimeo', 'Telegram'];

    const floatingIconNames: FloatingIconName[] = ['WhatsApp', 'Bot', 'ArrowUp', 'Message', 'Support', 'Chat', 'Question'];

    const handleContentChange = <K extends keyof typeof content>(key: K, value: (typeof content)[K]) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const handleThemeChange = <K extends keyof typeof themeSettings>(key: K, value: (typeof themeSettings)[K]) => {
        setThemeSettings(prev => ({ ...prev, [key]: value }));
    };
    
    const handleArrayChange = (arrayName: keyof typeof content, index: number, field: string, value: any) => {
        const newArray = [...(content[arrayName] as any[])];
        newArray[index] = { ...newArray[index], [field]: value };
        handleContentChange(arrayName, newArray as any);
    };

    const addArrayItem = (arrayName: keyof typeof content, newItem: any) => {
        const newArray = [...(content[arrayName] as any[]), newItem];
        handleContentChange(arrayName, newArray as any);
    };

    const deleteArrayItem = (arrayName: keyof typeof content, index: number) => {
        const newArray = (content[arrayName] as any[]).filter((_, i) => i !== index);
        handleContentChange(arrayName, newArray as any);
    };
    
    const handleLegalPageChange = (page: 'privacyPolicy' | 'termsOfService', field: keyof LegalPage, value: string) => {
        setContent(prev => ({
            ...prev,
            [page]: {
                ...prev[page],
                [field]: value
            }
        }));
    };

    const handleProjectChange = (projectIndex: number, field: keyof Project, value: any) => {
        const updatedProjects = [...content.latestProjects.projects];
        const project = { ...updatedProjects[projectIndex], [field]: value };
        updatedProjects[projectIndex] = project;
        handleContentChange('latestProjects', { ...content.latestProjects, projects: updatedProjects });
    };

    const handleGalleryChange = (projectIndex: number, value: string) => {
        const updatedProjects = [...content.latestProjects.projects];
        updatedProjects[projectIndex].gallery = value.split('\n').map(s => s.trim()).filter(Boolean);
        handleContentChange('latestProjects', { ...content.latestProjects, projects: updatedProjects });
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
        
        handleContentChange('latestProjects', { ...content.latestProjects, projects: [...content.latestProjects.projects, projectToAdd] });

        // Reset form
        setNewProject(emptyProject);
        setNewCategoryName('');
        setIsCreatingNewCategory(false);
    };

    const deleteProject = (id: string) => {
        const updatedProjects = content.latestProjects.projects.filter(p => p.id !== id);
        handleContentChange('latestProjects', { ...content.latestProjects, projects: updatedProjects });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    callback(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
        }
        onClose();
    };
    
    const renderIconSettings = (buttonKey: 'whatsAppIcon' | 'aiAssistantIcon' | 'scrollToTopIcon', label: string) => {
        const setting = content.floatingButtons[buttonKey];

        const handleTypeChange = (newType: IconSourceType) => {
            const newSetting: IconSetting = {
                type: newType,
                value: newType === 'pre-built' ? 'WhatsApp' : '' // Default value
            };
            handleContentChange('floatingButtons', { ...content.floatingButtons, [buttonKey]: newSetting });
        };

        const handleValueChange = (newValue: string) => {
            handleContentChange('floatingButtons', { ...content.floatingButtons, [buttonKey]: { ...setting, value: newValue } });
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
                        {content.latestProjects.projects
                            .map((project, index) => ({ project, originalIndex: index })) // Keep original index
                            .filter(({ project }) => project.category === category)
                            .map(({ project, originalIndex }) => (
                                <div key={project.id} className="p-3 bg-gray-800 rounded-lg space-y-3">
                                    <input placeholder="Title" type="text" value={project.title} onChange={e => handleProjectChange(originalIndex, 'title', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                                    <textarea placeholder="Description" value={project.description} onChange={e => handleProjectChange(originalIndex, 'description', e.target.value)} className="w-full p-2 bg-gray-700 rounded" rows={2}/>
                                    <input placeholder="Cover Media URL" type="text" value={project.mediaUrl} onChange={e => handleProjectChange(originalIndex, 'mediaUrl', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                                    
                                    <input placeholder="Demo URL (optional)" type="text" value={project.projectUrl || ''} onChange={e => handleProjectChange(originalIndex, 'projectUrl', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                                    <textarea placeholder="Gallery Images (one URL per line, optional)" value={(project.gallery || []).join('\n')} onChange={e => handleGalleryChange(originalIndex, e.target.value)} className="w-full p-2 bg-gray-700 rounded" rows={3}/>

                                    <button onClick={() => deleteProject(project.id)} className="w-full mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">Delete Project</button>
                                </div>
                            ))
                        }
                    </CollapsibleSection>
                ))}
            </CollapsibleSection>
        </>
    );
    
    const renderContentTab = () => (
        <div className="space-y-4">
             <CollapsibleSection title="Branding & Identity">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Site Name</label>
                    <input type="text" value={content.siteName} onChange={e => handleContentChange('siteName', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tagline</label>
                    <input type="text" value={content.tagline} onChange={e => handleContentChange('tagline', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Dynamic Title Structure</label>
                    <p className="text-xs text-gray-500 mb-2">Define the static prefix/suffix text and a comma-separated list of rotating words.</p>
                    
                    <label className="block text-xs font-medium text-gray-400 mt-2 mb-1">Prefix Text</label>
                    <input type="text" placeholder="e.g., We Build " value={content.dynamicTitle.prefix} onChange={e => handleContentChange('dynamicTitle', {...content.dynamicTitle, prefix: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" />
                    
                    <label className="block text-xs font-medium text-gray-400 mt-2 mb-1">Rotating Words (comma separated)</label>
                    <textarea placeholder="e.g., Extraordinary Brands, Intelligent AI" value={(content.dynamicTitle.rotatingWords || []).join(', ')} onChange={e => handleContentChange('dynamicTitle', {...content.dynamicTitle, rotatingWords: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 bg-gray-700 text-white rounded" rows={2}/>

                    <label className="block text-xs font-medium text-gray-400 mt-2 mb-1">Suffix Text</label>
                    <input type="text" placeholder="e.g., ." value={content.dynamicTitle.suffix} onChange={e => handleContentChange('dynamicTitle', {...content.dynamicTitle, suffix: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Header Logo URL</label>
                    <input type="text" value={content.logos.header} onChange={e => handleContentChange('logos', {...content.logos, header: e.target.value})} className="w-full p-2 bg-gray-600 text-white rounded" />
                    <label htmlFor="header-logo-upload" className="mt-2 inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                        Upload Header Logo
                    </label>
                    <input id="header-logo-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => handleContentChange('logos', {...content.logos, header: url}))} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Footer Logo URL</label>
                    <input type="text" value={content.logos.footer} onChange={e => handleContentChange('logos', {...content.logos, footer: e.target.value})} className="w-full p-2 bg-gray-600 text-white rounded" />
                     <label htmlFor="footer-logo-upload" className="mt-2 inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                        Upload Footer Logo
                    </label>
                    <input id="footer-logo-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => handleContentChange('logos', {...content.logos, footer: url}))} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Projects">
                {renderProjectsSection()}
            </CollapsibleSection>

            <CollapsibleSection title="Page Sections">
                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">About Us</h4>
                <div>
                    <label htmlFor="about-us-intro" className="block text-sm font-medium text-gray-400 mb-1">Introduction</label>
                    <textarea id="about-us-intro" value={content.aboutUs.introduction} onChange={e => handleContentChange('aboutUs', { ...content.aboutUs, introduction: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" rows={4}/>
                </div>
                <div>
                    <label htmlFor="about-us-mission" className="block text-sm font-medium text-gray-400 mb-1">Mission</label>
                    <textarea id="about-us-mission" value={content.aboutUs.mission} onChange={e => handleContentChange('aboutUs', { ...content.aboutUs, mission: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" rows={3}/>
                </div>
                <div>
                    <label htmlFor="about-us-vision" className="block text-sm font-medium text-gray-400 mb-1">Vision</label>
                    <textarea id="about-us-vision" value={content.aboutUs.vision} onChange={e => handleContentChange('aboutUs', { ...content.aboutUs, vision: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" rows={3}/>
                </div>
                <div>
                    <label htmlFor="about-us-media-url" className="block text-sm font-medium text-gray-400 mb-1">Media URL</label>
                    <input id="about-us-media-url" type="text" value={content.aboutUs.mediaUrl} onChange={e => handleContentChange('aboutUs', { ...content.aboutUs, mediaUrl: e.target.value })} className="w-full p-2 bg-gray-600 text-white rounded" placeholder="https://example.com/image.jpg"/>
                </div>
                 
                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Services</h4>
                <p className="text-xs text-gray-500 mb-2">Add, edit, or delete the services offered. These appear in the 'Our Services' section on the homepage.</p>
                <button onClick={() => addArrayItem('services', {id: `s${Date.now()}`, title: 'New Service', description: 'Description'})} className="mb-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+ Add Service</button>
                {content.services.map((service, index) => (
                    <div key={service.id} className="p-3 bg-gray-800 rounded space-y-2 mb-2">
                        <input placeholder="Service Title" type="text" value={service.title} onChange={e => handleArrayChange('services', index, 'title', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                        <textarea placeholder="Service Description" value={service.description} onChange={e => handleArrayChange('services', index, 'description', e.target.value)} className="w-full p-2 bg-gray-700 rounded" rows={2}/>
                        <button onClick={() => deleteArrayItem('services', index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>
                    </div>
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Contact & Links">
                 <div>
                    <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number</label>
                    <input id="whatsapp-number" type="text" value={content.whatsAppNumber} onChange={e => handleContentChange('whatsAppNumber', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                 </div>

                 <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Contact Information</h4>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Contact Form Recipient Email</label>
                    <p className="text-xs text-gray-500 mb-2">The email address where submitted contact forms will be sent.</p>
                    <input 
                        type="email" 
                        value={content.contactFormRecipientEmail} 
                        onChange={e => handleContentChange('contactFormRecipientEmail', e.target.value)} 
                        className="w-full p-2 bg-gray-600 text-white rounded" 
                        placeholder="recipient@example.com"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Public Email</label>
                    <input type="email" value={content.contactInfo.email} onChange={e => setContent(p => ({ ...p, contactInfo: { ...p.contactInfo, email: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    <input type="tel" value={content.contactInfo.phone} onChange={e => setContent(p => ({ ...p, contactInfo: { ...p.contactInfo, phone: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                    <input type="text" value={content.contactInfo.address} onChange={e => setContent(p => ({ ...p, contactInfo: { ...p.contactInfo, address: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Map Embed URL</label>
                    <textarea value={content.contactInfo.mapEmbedUrl} onChange={e => setContent(p => ({ ...p, contactInfo: { ...p.contactInfo, mapEmbedUrl: e.target.value }}))} className="w-full p-2 bg-gray-600 text-white rounded" rows={4} />
                 </div>
                 
                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Header Links</h4>
                <button onClick={() => addArrayItem('headerLinks', {id: `h${Date.now()}`, text: 'New', url: '#'})} className="mb-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+</button>
                 {content.headerLinks.map((link, index) => (
                    <div key={link.id} className="p-3 bg-gray-800 rounded space-y-2 mb-2">
                        <input placeholder="Text" type="text" value={link.text} onChange={e => handleArrayChange('headerLinks', index, 'text', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                        <input placeholder="URL" type="text" value={link.url} onChange={e => handleArrayChange('headerLinks', index, 'url', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                        <button onClick={() => deleteArrayItem('headerLinks', index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>
                    </div>
                 ))}

                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-4 mb-3">Social Links</h4>
                <button onClick={() => addArrayItem('socialLinks', {id: `so${Date.now()}`, name: 'Twitter', url: ''})} className="mb-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">+</button>
                {content.socialLinks.map((link, index) => (
                    <div key={link.id} className="p-3 bg-gray-800 rounded space-y-3 mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Icon</label>
                                <select value={link.name} onChange={e => handleArrayChange('socialLinks', index, 'name', e.target.value)} className="w-full p-2 bg-gray-700 rounded capitalize">
                                    {socialIconNames.map(iconName => (
                                        <option key={iconName} value={iconName}>{iconName}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">URL</label>
                                <input placeholder="https://social.com/profile" type="url" value={link.url} onChange={e => handleArrayChange('socialLinks', index, 'url', e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                            </div>
                        </div>
                        <button onClick={() => deleteArrayItem('socialLinks', index)} className="w-full mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">Delete Social Link</button>
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
                    <input id="privacy-title" type="text" value={content.privacyPolicy.title} onChange={e => handleLegalPageChange('privacyPolicy', 'title', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                 <div>
                    <label htmlFor="privacy-date" className="block text-sm font-medium text-gray-400 mb-1">Last Updated Date</label>
                    <input id="privacy-date" type="date" value={content.privacyPolicy.lastUpdated} onChange={e => handleLegalPageChange('privacyPolicy', 'lastUpdated', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label htmlFor="privacy-content" className="block text-sm font-medium text-gray-400 mb-1">Content (use new lines for paragraphs)</label>
                    <textarea id="privacy-content" value={content.privacyPolicy.content} onChange={e => handleLegalPageChange('privacyPolicy', 'content', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" rows={12}/>
                </div>

                <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mt-6 mb-3">Terms of Service</h4>
                <div>
                    <label htmlFor="terms-title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input id="terms-title" type="text" value={content.termsOfService.title} onChange={e => handleLegalPageChange('termsOfService', 'title', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label htmlFor="terms-date" className="block text-sm font-medium text-gray-400 mb-1">Last Updated Date</label>
                    <input id="terms-date" type="date" value={content.termsOfService.lastUpdated} onChange={e => handleLegalPageChange('termsOfService', 'lastUpdated', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
                <div>
                    <label htmlFor="terms-content" className="block text-sm font-medium text-gray-400 mb-1">Content (use new lines for paragraphs)</label>
                    <textarea id="terms-content" value={content.termsOfService.content} onChange={e => handleLegalPageChange('termsOfService', 'content', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" rows={12}/>
                </div>
            </CollapsibleSection>
        </div>
    );
    
    const renderThemeTab = () => (
        <div className="space-y-6">
            <CollapsibleSection title="Colors & Font" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.primaryColor} onChange={e => handleThemeChange('primaryColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.primaryColor}</span>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.secondaryColor} onChange={e => handleThemeChange('secondaryColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.secondaryColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Dynamic Title Start Color</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.dynamicTitleColorStart} onChange={e => handleThemeChange('dynamicTitleColorStart', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.dynamicTitleColorStart}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Dynamic Title End Color</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.dynamicTitleColorEnd} onChange={e => handleThemeChange('dynamicTitleColorEnd', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.dynamicTitleColorEnd}</span>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Background (Light Mode)</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.lightModeBgColor} onChange={e => handleThemeChange('lightModeBgColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.lightModeBgColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Background (Dark Mode)</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.darkModeBgColor} onChange={e => handleThemeChange('darkModeBgColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.darkModeBgColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Heading Color (Light Mode)</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.lightModeHeadingColor} onChange={e => handleThemeChange('lightModeHeadingColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.lightModeHeadingColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Heading Color (Dark Mode)</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.darkModeHeadingColor} onChange={e => handleThemeChange('darkModeHeadingColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.darkModeHeadingColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Text Color (Light Mode)</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.lightModeTextColor} onChange={e => handleThemeChange('lightModeTextColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.lightModeTextColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Text Color (Dark Mode)</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.darkModeTextColor} onChange={e => handleThemeChange('darkModeTextColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.darkModeTextColor}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-700 mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Font Family (e.g., "Roboto", "system-ui")</label>
                    <input type="text" value={themeSettings.font} onChange={e => handleThemeChange('font', e.target.value)} className="w-full p-2 bg-gray-600 text-white rounded" />
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Glow Effect">
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Glow Color</label>
                        <div className="flex items-center space-x-4">
                            <input type="color" value={themeSettings.glowColor} onChange={e => handleThemeChange('glowColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-700 cursor-pointer" />
                            <span>{themeSettings.glowColor}</span>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Glow Animation</label>
                         <div className="flex items-center space-x-4 bg-gray-600 p-2 rounded-lg">
                           {(['pulse', 'static', 'none'] as const).map(anim => (
                                <label key={anim} className="flex items-center space-x-2 cursor-pointer text-sm capitalize">
                                    <input 
                                        type="radio" 
                                        name="glow-animation" 
                                        value={anim} 
                                        checked={themeSettings.glowAnimation === anim} 
                                        onChange={e => handleThemeChange('glowAnimation', e.target.value as ThemeSettings['glowAnimation'])}
                                        className="form-radio h-4 w-4 text-brand-primary bg-gray-700 border-gray-500 focus:ring-brand-primary" 
                                    />
                                    <span>{anim}</span>
                                </label>
                           ))}
                         </div>
                    </div>
                </div>
            </CollapsibleSection>

        </div>
    );

    const modalProps: MotionProps = {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        transition: { type: 'spring', stiffness: 400, damping: 40 },
    };

    return (
         <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
                    {/* Main Editing Panel */}
                    <motion.div
                        {...modalProps}
                        className="w-full max-w-6xl h-full max-h-[90vh] bg-gray-800 text-white shadow-2xl flex flex-col rounded-2xl"
                    >
                        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold">Admin Panel</h3>
                                <p className="text-sm text-gray-400">Changes save automatically. Refresh page to view.</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <button onClick={handleLogout} className="text-sm text-red-400 hover:underline">Logout</button>
                               <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full"><CloseIcon /></button>
                            </div>
                        </header>
                        
                        <div className="flex p-1 bg-gray-900 flex-shrink-0">
                            <button onClick={() => setActiveTab('content')} className={`flex-1 py-2 text-center rounded transition-colors text-sm font-medium ${activeTab === 'content' ? 'bg-brand-primary' : 'hover:bg-gray-700'}`}>Content</button>
                            <button onClick={() => setActiveTab('theme')} className={`flex-1 py-2 text-center rounded transition-colors text-sm font-medium ${activeTab === 'theme' ? 'bg-brand-primary' : 'hover:bg-gray-700'}`}>Theme</button>
                        </div>

                        <main className="flex-grow p-4 md:p-6 overflow-y-auto">
                           {activeTab === 'content' && renderContentTab()}
                           {activeTab === 'theme' && renderThemeTab()}
                        </main>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminPanel;
