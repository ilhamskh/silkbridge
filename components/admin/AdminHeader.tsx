'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Logo from '@/components/ui/Logo';

type Role = 'ADMIN' | 'EDITOR';

interface AdminHeaderProps {
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

export default function AdminHeader({ user }: AdminHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isAdmin = user.role === 'ADMIN';

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    const allNavigation = isAdmin ? [...navigation, ...adminOnlyNavigation] : navigation;

    return (
        <>
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-light lg:hidden">
                <div className="flex items-center justify-between h-16 px-4">
                    <Link href="/admin" className="flex items-center gap-2 text-primary-700">
                        <Logo className="h-8 w-auto" />
                        <span className="font-semibold text-ink">Admin</span>
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-xl">
                        <div className="flex items-center justify-between h-16 px-4 border-b border-border-light">
                            <span className="font-semibold text-ink">Menu</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="p-4 space-y-1">
                            {allNavigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.href)
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-muted hover:text-ink hover:bg-surface'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-light">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface mb-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-ink truncate">
                                        {user.name || user.email.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-muted">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
