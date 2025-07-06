import React, { useState, useEffect, useRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useContent } from '../../hooks/useContent';
import { useDebounce } from '../../hooks/useDebounce';

const AdminPreview: React.FC = () => {
    const { content, themeSettings } = useContent();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isIframeReady, setIsIframeReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Debounce the content and theme settings to avoid excessive updates
    const debouncedContent = useDebounce(content, 300);
    const debouncedThemeSettings = useDebounce(themeSettings, 300);

    // Listen for the "ready" message from the iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.source === iframeRef.current?.contentWindow && event.data.type === 'PREVIEW_READY') {
                setIsIframeReady(true);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Post updates to the iframe when debounced content changes
    useEffect(() => {
        if (isIframeReady && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: 'PREVIEW_UPDATE',
                    payload: { content: debouncedContent, themeSettings: debouncedThemeSettings }
                },
                window.location.origin
            );
        }
    }, [debouncedContent, debouncedThemeSettings, isIframeReady]);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const loaderProps: MotionProps = {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <div className="w-full h-full bg-gray-900/50 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-700">
            <div className="bg-gray-700 p-2 flex items-center space-x-2 flex-shrink-0">
                 <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 </div>
                 <div className="flex-grow bg-gray-600 rounded-full h-6 text-xs flex items-center px-4 text-gray-400 truncate">
                    {window.location.origin + window.location.pathname}
                 </div>
            </div>
            <div className="relative w-full h-full bg-gray-900">
                {isLoading && (
                    <motion.div {...loaderProps} className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                        <div className="flex items-center space-x-2 text-white">
                           <span className="block w-2 h-2 bg-brand-primary rounded-full animate-bounce "/>
                           <span className="block w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"/>
                           <span className="block w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"/>
                        </div>
                    </motion.div>
                )}
                <iframe
                    ref={iframeRef}
                    src={window.location.href.split('?')[0]} // Remove query params to avoid issues
                    className={`w-full h-full border-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    title="Live Preview"
                    onLoad={handleLoad}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>
        </div>
    );
};

export default AdminPreview;
