
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useContent } from '../../hooks/useContent';
import { getAiResponse } from '../../services/geminiService';
import { CloseIcon, SendIcon, CustomIcon } from '../ui/icons';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! How can I help you with our services today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { content } = useContent();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            const botResponseText = await getAiResponse(
                input, 
                history, 
                content.aiModel, 
                content.siteName, 
                content.tagline
            );
            const botMessage: Message = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("AI response error:", error);
            const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonMotionProps: MotionProps = {
        whileHover: { scale: 1.1, y: -5 },
        whileTap: { scale: 0.9 },
    };

    const chatboxMotionProps: MotionProps = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 50, scale: 0.9 },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center shadow-lg text-white"
                {...buttonMotionProps}
                aria-label="Open AI Assistant"
            >
                <CustomIcon setting={content.floatingButtons.aiAssistantIcon} />
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        {...chatboxMotionProps}
                        className="fixed bottom-[10.5rem] right-6 z-40 w-[350px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        <header className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-gray-800 dark:text-white">AI Assistant</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><CloseIcon/></button>
                        </header>
                        <main className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <span className="block w-2 h-2 bg-brand-primary rounded-full animate-bounce "/>
                                                <span className="block w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"/>
                                                <span className="block w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </main>
                        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask something..."
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                                <button onClick={handleSend} disabled={isLoading} className="p-3 bg-brand-primary text-white rounded-full disabled:opacity-50">
                                    <SendIcon />
                                </button>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
