
import React, { useState } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { auth } from '../../firebase/firebaseConfig';
import { CloseIcon } from '../ui/icons';

interface AdminLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isFirebaseConfigured = !!auth;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!isFirebaseConfigured) {
            setError('Admin login is disabled because Firebase is not configured.');
            setLoading(false);
            return;
        }

        try {
            // The 'auth' object is guaranteed to be non-null here due to the check above
            await auth!.signInWithEmailAndPassword(email, password);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const backdropProps: MotionProps = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const modalProps: MotionProps = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
        transition: { type: "spring", stiffness: 300, damping: 30 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <motion.div
                        {...backdropProps}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        {...modalProps}
                        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                            <CloseIcon />
                        </button>
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Admin Access</h2>
                        
                        {!isFirebaseConfigured ? (
                             <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg mt-4">
                                <p className="font-semibold">Admin Features Disabled</p>
                                <p className="text-sm text-red-400 mt-1">Firebase credentials are not configured in the environment. Please set them up for deployment.</p>
                            </div>
                        ) : (
                           <>
                                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Enter credentials to manage site content.</p>
                                <form onSubmit={handleLogin}>
                                    <div className="space-y-4">
                                        <input
                                            id="admin-email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="Email"
                                            aria-label="Admin Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                            required
                                        />
                                        <input
                                            id="admin-password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            aria-label="Admin Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                            required
                                        />
                                    </div>
                                    {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? 'Logging In...' : 'Login'}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminLogin;
