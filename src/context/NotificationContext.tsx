import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationContextType {
    showToast: (message: string, type: NotificationType) => void;
    showConfirm: (message: string, onConfirm: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

interface Toast {
    id: number;
    message: string;
    type: NotificationType;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

    const showToast = (message: string, type: NotificationType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const showConfirm = (message: string, onConfirm: () => void) => {
        setConfirmModal({ message, onConfirm });
    };

    const closeConfirm = () => setConfirmModal(null);
    const handleConfirm = () => {
        if (confirmModal) confirmModal.onConfirm();
        closeConfirm();
    };

    return (
        <NotificationContext.Provider value={{ showToast, showConfirm }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`min-w-[300px] p-4 rounded-xl shadow-2xl text-white font-bold animate-fade-in flex items-center justify-between ${toast.type === 'success' ? 'bg-green-600' :
                            toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                            }`}
                    >
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>

            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in">
                        <h3 className="text-xl font-bold mb-4 font-montserrat">Confirm Action</h3>
                        <p className="text-neutral-600 mb-8">{confirmModal.message}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={closeConfirm}
                                className="flex-1 py-3 border border-neutral-200 rounded-xl font-bold text-neutral-500 hover:bg-neutral-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}
