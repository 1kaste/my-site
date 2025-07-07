import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { CloseIcon } from '../ui/icons';
import {
    Project, ContentState, ThemeSettings
} from '../../types';
import { useContent } from '../../hooks/useContent';

// Helper function to generate a unique ID
// This is a simple timestamp + random string. For very high-volume apps, consider a dedicated UUID library.
const generateUniqueId = () => `p-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const emptyProject: Project = {
    id: generateUniqueId(), // Use the helper to generate ID for new project forms
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
    const { user, signOut } = useAuth(); // Assuming useAuth provides user and signOut
    const { content: fetchedContent, themeSettings: fetchedThemeSettings, loading, error, saveContentToDb } = useContent();

    const [localContent, setLocalContent] = useState<ContentState>(fetchedContent);
    const [localThemeSettings, setLocalThemeSettings] = useState<ThemeSettings>(fetchedThemeSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [newProject, setNewProject] = useState<Project>(emptyProject);
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Sync fetched data with local state whenever fetched data changes
    useEffect(() => {
        // This effect runs when content from Firebase changes.
        // It's important for initial load and for external changes.
        setLocalContent(fetchedContent);
        setLocalThemeSettings(fetchedThemeSettings);
    }, [fetchedContent, fetchedThemeSettings]);

    // Derived state for project categories (memoized for performance)
    const projectCategories = useMemo(() =>
        [...new Set(localContent.latestProjects.projects.map(p => p.category))].sort(),
        [localContent.latestProjects.projects]
    );

    // Generic handler for changing simple text/input fields in localContent
    const handleLocalContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, path: string) => {
        const { name, value } = e.target;
        setLocalContent(prevContent => {
            const updatedContent = { ...prevContent };
            // Simple path handling for direct properties
            // For nested objects, you'd need a more robust deep update function
            if (path === 'aboutUs' && name === 'mission') {
                return {
                    ...prevContent,
                    aboutUs: { ...prevContent.aboutUs, mission: value }
                };
            }
            if (path === 'aboutUs' && name === 'introduction') {
                 return {
                    ...prevContent,
                    aboutUs: { ...prevContent.aboutUs, introduction: value }
                };
            }
            if (path === 'aboutUs' && name === 'vision') {
                 return {
                    ...prevContent,
                    aboutUs: { ...prevContent.aboutUs, vision: value }
                };
            }
            if (path === 'siteName' && name === 'siteName') { // Handle siteName directly
                return {
                    ...prevContent,
                    siteName: value
                };
            }
            if (path === 'tagline' && name === 'tagline') { // Handle tagline directly
                return {
                    ...prevContent,
                    tagline: value
                };
            }
            // Add more specific path handlers as needed for other direct text fields
            // For more complex nested updates, consider a utility like `immer` or a deep-set function.
            return updatedContent; // Return the unchanged state if path/name combo not handled
        });
    }, []);

    // Handler for theme settings changes
    const handleThemeSettingChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalThemeSettings(prevTheme => ({
            ...prevTheme,
            [name]: value,
        }));
    }, []);

    // Handler for adding a new project
    const handleAddNewProject = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const finalCategory = isCreatingNewCategory && newCategoryName.trim() ? newCategoryName.trim() : newProject.category;

        if (!finalCategory) {
            alert("Please select or create a category for the project.");
            return;
        }

        const projectToAdd: Project = {
            ...newProject,
            id: generateUniqueId(), // Ensure unique ID for the new project
            category: finalCategory,
        };

        setLocalContent(prevContent => ({
            ...prevContent,
            latestProjects: {
                ...prevContent.latestProjects,
                // Add the new project to the array of projects
                projects: [...prevContent.latestProjects.projects, projectToAdd],
            },
        }));

        // Reset form
        setNewProject(emptyProject);
        setNewCategoryName('');
        setIsCreatingNewCategory(false);
        setSaveMessage(null); // Clear save message
    }, [newProject, isCreatingNewCategory, newCategoryName]);

    // Handler for deleting a project
    const deleteProject = useCallback((id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setLocalContent(prevContent => ({
                ...prevContent,
                latestProjects: {
                    ...prevContent.latestProjects,
                    projects: prevContent.latestProjects.projects.filter(p => p.id !== id),
                },
            }));
            setSaveMessage(null); // Clear save message
        }
    }, []);

    // Handler for project form changes
    const handleNewProjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    }, []);

    // Handler for saving all changes to Firebase
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
            setTimeout(() => setSaveMessage(null), 5000); // Clear message after 5 seconds
        }
    }, [localContent, localThemeSettings, saveContentToDb]);

    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
            onClose(); // Close admin panel after sign out
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to sign out. Please try again.");
        }
    }, [signOut, onClose]);


    const MotionDiv = motion.div; // Alias for convenience

    if (!user) {
        return null; // Or render a "Please log in" message
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
                    className="fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-1/3 bg-gray-900 shadow-lg p-6 overflow-y-auto z-50 text-white"
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
                            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
                        >
                            Sign Out
                        </button>

                        {/* General Site Content */}
                        <CollapsibleSection title="General Site Content" defaultOpen={true}>
                            <label className="block mb-2">Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={localContent.siteName || ''}
                                onChange={e => handleLocalContentChange(e, 'siteName')}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Tagline</label>
                            <input
                                type="text"
                                name="tagline"
                                value={localContent.tagline || ''}
                                onChange={e => handleLocalContentChange(e, 'tagline')}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            {/* Mission text */}
                            <label className="block mb-2">Our Mission Text</label>
                            <textarea
                                name="mission"
                                value={localContent.aboutUs.mission || ''}
                                onChange={e => handleLocalContentChange(e, 'aboutUs')}
                                rows={4}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            {/* Introduction text */}
                            <label className="block mb-2">About Us Introduction</label>
                            <textarea
                                name="introduction"
                                value={localContent.aboutUs.introduction || ''}
                                onChange={e => handleLocalContentChange(e, 'aboutUs')}
                                rows={4}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            {/* Vision text */}
                            <label className="block mb-2">About Us Vision</label>
                            <textarea
                                name="vision"
                                value={localContent.aboutUs.vision || ''}
                                onChange={e => handleLocalContentChange(e, 'aboutUs')}
                                rows={4}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            {/* Add other general text fields here as needed */}
                        </CollapsibleSection>


                        {/* Theme Settings - NOW WITH ALL OPTIONS */}
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
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Secondary Color</label>
                            <input
                                type="color"
                                name="secondaryColor"
                                value={localThemeSettings.secondaryColor || '#17D161'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />

                            {/* Added Missing Theme Options */}
                            <label className="block mb-2">Dark Mode Background Color</label>
                            <input
                                type="color"
                                name="darkModeBgColor"
                                value={localThemeSettings.darkModeBgColor || '#1A1A1A'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Dark Mode Heading Color</label>
                            <input
                                type="color"
                                name="darkModeHeadingColor"
                                value={localThemeSettings.darkModeHeadingColor || '#FFFFFF'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Dark Mode Text Color</label>
                            <input
                                type="color"
                                name="darkModeTextColor"
                                value={localThemeSettings.darkModeTextColor || '#F0F0F0'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Light Mode Background Color</label>
                            <input
                                type="color"
                                name="lightModeBgColor"
                                value={localThemeSettings.lightModeBgColor || '#FFFFFF'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Light Mode Heading Color</label>
                            <input
                                type="color"
                                name="lightModeHeadingColor"
                                value={localThemeSettings.lightModeHeadingColor || '#333333'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Light Mode Text Color</label>
                            <input
                                type="color"
                                name="lightModeTextColor"
                                value={localThemeSettings.lightModeTextColor || '#555555'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Dynamic Title Color Start</label>
                            <input
                                type="color"
                                name="dynamicTitleColorStart"
                                value={localThemeSettings.dynamicTitleColorStart || '#FF4C60'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Dynamic Title Color End</label>
                            <input
                                type="color"
                                name="dynamicTitleColorEnd"
                                value={localThemeSettings.dynamicTitleColorEnd || '#17D161'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                             <label className="block mb-2">Glow Animation (CSS string)</label>
                            <input
                                type="text"
                                name="glowAnimation"
                                value={localThemeSettings.glowAnimation || 'pulse'}
                                onChange={handleThemeSettingChange}
                                placeholder="e.g., pulse, spin"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                            <label className="block mb-2">Glow Color</label>
                            <input
                                type="color"
                                name="glowColor"
                                value={localThemeSettings.glowColor || '#FF4C60'}
                                onChange={handleThemeSettingChange}
                                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                            />
                        </CollapsibleSection>

                        {/* Project Management Section */}
                        <CollapsibleSection title="Project Management" defaultOpen={true}>
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
                                    localContent.latestProjects.projects.map((project) => (
                                        <div key={project.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-white">{project.title} ({project.category})</h4>
                                                <p className="text-gray-400 text-sm">{project.description}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteProject(project.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CollapsibleSection>


                        {/* Save Changes Button */}
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
                        {loading && <p className="mt-2 text-center text-yellow-400 text-sm">Loading initial data...</p>
                        }
                        {error && <p className="mt-2 text-center text-red-400 text-sm">Error loading data: {error.message}</p>}
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};

export default AdminPanel;
