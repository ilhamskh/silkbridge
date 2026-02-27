'use client';

import { useAdminLayout } from './AdminLayoutContext';

interface Props {
    children: React.ReactNode;
}

export function AdminShell({ children }: Props) {
    const { isCollapsed } = useAdminLayout();

    return (
        <div className={`min-h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>
            {children}
        </div>
    );
}
