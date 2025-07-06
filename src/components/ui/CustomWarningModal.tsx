
import React, { ReactNode } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { WarningIcon } from './icons';

interface CustomWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: ReactNode;
}

const CustomWarningModal: React.FC<CustomWarningModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    const backdropProps: MotionProps = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalProps: MotionProps = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { type: "spring", stiffness: 300, damping: 30 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        {...backdropProps}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60"
                    />

                    {/* Modal */}
                    <motion.div
                        {...modalProps}
                        className="relative w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-10"
                    >
                        <div className="flex items-start space-x-4">
                           <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                                <WarningIcon />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                       {children}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={() => { onConfirm(); onClose(); }}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CustomWarningModal;
