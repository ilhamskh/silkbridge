'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Logo from '@/components/ui/Logo';

type Role = 'ADMIN' | 'EDITOR';

interface AdminSidebarProps {
    user: {
        id: string;
        email: string;
        name?: string | null;
        role: Role;
    };
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Pages', href: '/admin/pages', icon: 'pages' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

const adminOnlyNavigation = [
    { name: 'Locales', href: '/admin/locales', icon: 'globe' },
    { name: 'Users', href: '/admin/users', icon: 'users' },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isAdmin = user.role === 'ADMIN';

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`fixed left-0 top-0 z-40 h-screen bg-white border-r border-border-light transition-all duration-300 hidden lg:block ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-border-light">
                    <Link href="/admin" className="flex items-center gap-3 text-primary-700">
                        <Logo className="h-8 w-auto flex-shrink-0" />
                        {!isCollapsed && <span className="font-semibold text-ink">Admin</span>}
                    </Link>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <AdminIcon name={isCollapsed ? 'chevronRight' : 'chevronLeft'} className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.href)
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-muted hover:text-ink hover:bg-surface'
                                }`}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <AdminIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    ))}

                    {/* Admin-only section */}
                    {isAdmin && (
                        <>
                            <div className="pt-4 pb-2">
                                {!isCollapsed && (
                                    <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                                        Administration
                                    </p>
                                )}
                            </div>
                            {adminOnlyNavigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.href)
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-muted hover:text-ink hover:bg-surface'
                                        }`}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <AdminIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span>{item.name}</span>}
                                </Link>
                            ))}
                        </>
                    )}
                </nav>

                {/* User Menu */}
                <div className="p-3 border-t border-border-light">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl bg-surface`}>
                        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-ink truncate">
                                    {user.name || user.email.split('@')[0]}
                                </p>
                                <p className="text-xs text-muted truncate">{user.role}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className={`mt-2 w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-600 hover:bg-red-50 transition-all`}
                        title={isCollapsed ? 'Sign out' : undefined}
                    >
                        <AdminIcon name="logout" className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}

// Admin-specific icons
function AdminIcon({ name, className }: { name: string; className?: string }) {
    const icons: Record<string, React.ReactNode> = {
        dashboard: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
        ),
        pages: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8M16 17H8M10 9H8" />
            </svg>
        ),
        settings: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
        ),
        globe: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
        ),
        users: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
        logout: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
        ),
        chevronLeft: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M15 18l-6-6 6-6" />
            </svg>
        ),
        chevronRight: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M9 18l6-6-6-6" />
            </svg>
        ),
    };

    return <>{icons[name] || null}</>;
}
