'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Logo from '@/components/ui/Logo';
import { AdminIcon } from './ui/AdminIcon';

type Role = 'ADMIN' | 'EDITOR';

interface AdminSidebarProps {
    user: {
        id: string;
        email: string;
        name?: string | null;
        role: Role;
    };
}

interface NavItem {
    name: string;
    href: string;
    icon: string;
    badge?: number;
}

interface NavSection {
    title?: string;
    items: NavItem[];
    adminOnly?: boolean;
}

const navigation: NavSection[] = [
    {
        items: [
            { name: 'Overview', href: '/admin', icon: 'dashboard' },
        ],
    },
    {
        title: 'Content',
        items: [
            { name: 'Pages', href: '/admin/content', icon: 'pages' },
            { name: 'Global Settings', href: '/admin/settings', icon: 'settings' },
        ],
    },
    {
        title: 'Insights',
        items: [
            { name: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
        ],
    },
    {
        title: 'Administration',
        adminOnly: true,
        items: [
            { name: 'Languages', href: '/admin/locales', icon: 'globe' },
            { name: 'Users', href: '/admin/users', icon: 'users' },
        ],
    },
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
            className={`
                fixed left-0 top-0 z-40 h-screen
                bg-white border-r border-border-light/60
                transition-all duration-300 ease-out
                hidden lg:flex lg:flex-col
                ${isCollapsed ? 'w-[72px]' : 'w-64'}
            `}
        >
            {/* Logo Area */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-border-light/60">
                <Link
                    href="/admin"
                    className="flex items-center gap-3 text-ink transition-opacity hover:opacity-80"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
                        <span className="text-white font-heading font-bold text-sm">S</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-heading font-semibold text-sm text-ink leading-tight">Silkbridge</span>
                            <span className="text-[10px] text-muted uppercase tracking-wider">Admin</span>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`
                        p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface 
                        transition-all duration-200
                        ${isCollapsed ? 'ml-auto' : ''}
                    `}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <AdminIcon
                        name={isCollapsed ? 'chevronRight' : 'chevronLeft'}
                        className="w-4 h-4"
                    />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <div className="space-y-6">
                    {navigation.map((section, sectionIdx) => {
                        // Skip admin-only sections for non-admins
                        if (section.adminOnly && !isAdmin) return null;

                        return (
                            <div key={sectionIdx}>
                                {/* Section Title */}
                                {section.title && !isCollapsed && (
                                    <p className="px-3 mb-2 text-[10px] font-semibold text-muted uppercase tracking-wider">
                                        {section.title}
                                    </p>
                                )}
                                {section.title && isCollapsed && (
                                    <div className="h-px bg-border-light mx-3 mb-2" />
                                )}

                                {/* Section Items */}
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`
                                                    group flex items-center gap-3 px-3 py-2.5 
                                                    rounded-xl text-sm font-medium
                                                    transition-all duration-200
                                                    ${active
                                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                                        : 'text-muted hover:text-ink hover:bg-surface'
                                                    }
                                                    ${isCollapsed ? 'justify-center' : ''}
                                                `}
                                                title={isCollapsed ? item.name : undefined}
                                            >
                                                <AdminIcon
                                                    name={item.icon}
                                                    className={`
                                                        w-5 h-5 flex-shrink-0 transition-colors
                                                        ${active ? 'text-primary-600' : 'text-muted group-hover:text-ink'}
                                                    `}
                                                />
                                                {!isCollapsed && (
                                                    <span className="flex-1">{item.name}</span>
                                                )}
                                                {!isCollapsed && item.badge !== undefined && (
                                                    <span className={`
                                                        inline-flex items-center justify-center
                                                        min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full
                                                        ${active
                                                            ? 'bg-primary-100 text-primary-700'
                                                            : 'bg-slate-100 text-muted'
                                                        }
                                                    `}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-border-light/60">
                <div className={`
                    flex items-center gap-3 p-2 rounded-xl
                    bg-surface/50 
                    ${isCollapsed ? 'justify-center' : ''}
                `}>
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                            {user.name?.[0] || user.email[0].toUpperCase()}
                        </span>
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">
                                {user.name || 'User'}
                            </p>
                            <p className="text-xs text-muted truncate">
                                {user.role === 'ADMIN' ? 'Administrator' : 'Editor'}
                            </p>
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                            className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Sign out"
                        >
                            <AdminIcon name="logout" className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isCollapsed && (
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="w-full mt-2 p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors flex justify-center"
                        title="Sign out"
                    >
                        <AdminIcon name="logout" className="w-4 h-4" />
                    </button>
                )}
            </div>
        </aside>
    );
}
