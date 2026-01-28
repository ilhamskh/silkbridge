'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    success: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string;
    error: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string;
    warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string;
    info: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);
        return id;
    }, []);

    const success = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
        return addToast({ message, type: 'success', duration: 4000, ...options });
    }, [addToast]);

    const error = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
        return addToast({ message, type: 'error', duration: 6000, ...options });
    }, [addToast]);

    const warning = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
        return addToast({ message, type: 'warning', duration: 5000, ...options });
    }, [addToast]);

    const info = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
        return addToast({ message, type: 'info', duration: 4000, ...options });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
            {isMounted && <ToastContainer toasts={toasts} removeToast={removeToast} />}
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <AdminToast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>,
        document.body
    );
}

const typeStyles: Record<ToastType, { bg: string; icon: string; iconColor: string }> = {
    success: {
        bg: 'bg-emerald-50 border-emerald-200',
        icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        iconColor: 'text-emerald-500',
    },
    error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
        iconColor: 'text-red-500',
    },
    warning: {
        bg: 'bg-amber-50 border-amber-200',
        icon: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
        iconColor: 'text-amber-500',
    },
    info: {
        bg: 'bg-primary-50 border-primary-200',
        icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
        iconColor: 'text-primary-500',
    },
};

export function AdminToast({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const { message, type, duration = 4000, action } = toast;
    const styles = typeStyles[type];

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onRemove, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onRemove]);

    return (
        <div
            className={`
                pointer-events-auto
                flex items-center gap-3 
                min-w-[320px] max-w-md p-4 
                rounded-xl border shadow-card
                animate-fade-up
                ${styles.bg}
            `}
            role="alert"
        >
            <svg className={`w-5 h-5 flex-shrink-0 ${styles.iconColor}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={styles.icon} clipRule="evenodd" />
            </svg>
            <p className="flex-1 text-sm font-medium text-ink">{message}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
            <button
                onClick={onRemove}
                className="p-1 -m-1 text-muted hover:text-ink rounded transition-colors"
                aria-label="Dismiss"
            >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}
