'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutContextType {
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
    adminLocale: string;
    setAdminLocale: (locale: string) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

export function useAdminLayout() {
    const ctx = useContext(AdminLayoutContext);
    if (!ctx) throw new Error('useAdminLayout must be used within AdminLayoutContextProvider');
    return ctx;
}

interface Props {
    children: ReactNode;
    initialLocale: string;
}

export function AdminLayoutContextProvider({ children, initialLocale }: Props) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [adminLocale, setAdminLocaleState] = useState(initialLocale);
    const router = useRouter();

    const setAdminLocale = useCallback((locale: string) => {
        // Write cookie for server-side pickup
        document.cookie = `admin-locale=${locale};path=/admin;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
        setAdminLocaleState(locale);
        // Trigger a server re-render so AdminLocaleProvider picks up the new locale
        router.refresh();
    }, [router]);

    return (
        <AdminLayoutContext.Provider value={{ isCollapsed, setIsCollapsed, adminLocale, setAdminLocale }}>
            {children}
        </AdminLayoutContext.Provider>
    );
}
