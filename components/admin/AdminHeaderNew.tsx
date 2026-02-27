'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { AdminIcon } from './ui/AdminIcon';
import { AdminButton } from './ui/AdminButton';
import { useAdminLayout } from './AdminLayoutContext';

type Role = 'ADMIN' | 'EDITOR';

interface AdminHeaderProps {
    user: {
        id: string;
        email: string;
        name?: string | null;
        role: Role;
    };
    // For page editor context
    pageContext?: {
        title: string;
        locale: string;
        locales: Array<{ code: string; name: string; flag?: string | null }>;
        status: 'DRAFT' | 'PUBLISHED';
        hasChanges: boolean;
        onSave?: () => void;
        onPublish?: () => void;
        onPreview?: () => void;
        onLocaleChange?: (locale: string) => void;
        isSaving?: boolean;
        isPublishing?: boolean;
    };
}

const ADMIN_LOCALES = [
    { code: 'en', flag: '🇺🇸' },
    { code: 'az', flag: '🇦🇿' },
    { code: 'ru', flag: '🇷🇺' },
];

export default function AdminHeader({ user, pageContext }: AdminHeaderProps) {
    const pathname = usePathname();
    const t = useTranslations('Admin');
    const { adminLocale, setAdminLocale } = useAdminLayout();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);

    // Handle keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get page title from pathname — localized
    const getPageTitle = () => {
        if (pageContext?.title) return pageContext.title;

        const segments = pathname.split('/').filter(Boolean);
        if (segments.length <= 1) return t('header.overview');

        const titleMap: Record<string, string> = {
            'pages': t('header.pages'),
            'settings': t('header.settings'),
            'locales': t('header.languages'),
            'users': t('header.users'),
            'insights': t('header.insights'),
            'partners': t('header.partners'),
            'contact': t('header.contact'),
        };

        return titleMap[segments[segments.length - 1]] || t('header.admin');
    };

    const currentFlag = ADMIN_LOCALES.find(l => l.code === adminLocale)?.flag || '🇺🇸';

    return (
        <>
            {/* Desktop Header — margin syncs with sidebar via context */}
            <header className={`sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border-light/60 transition-all duration-300`}>
                <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                    {/* Left: Page Title & Breadcrumb */}
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                        >
                            <AdminIcon name="menu" className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="font-heading font-semibold text-lg text-ink">
                                {getPageTitle()}
                            </h1>
                        </div>
                    </div>

                    {/* Center: Page Editor Controls (when in editor) */}
                    {pageContext && (
                        <div className="hidden md:flex items-center gap-3">
                            {/* Locale Selector */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg">
                                <AdminIcon name="globe" className="w-4 h-4 text-muted" />
                                <select
                                    value={pageContext.locale}
                                    onChange={(e) => pageContext.onLocaleChange?.(e.target.value)}
                                    className="text-sm font-medium text-ink bg-transparent border-none focus:outline-none cursor-pointer"
                                >
                                    {pageContext.locales.map((locale) => (
                                        <option key={locale.code} value={locale.code}>
                                            {locale.flag} {locale.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Badge */}
                            <span className={`
                                inline-flex items-center gap-1.5 px-2.5 py-1
                                text-xs font-semibold rounded-full
                                ${pageContext.status === 'PUBLISHED'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }
                            `}>
                                <span className={`w-1.5 h-1.5 rounded-full ${pageContext.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`} />
                                {pageContext.status === 'PUBLISHED' ? t('status.published') : t('status.draft')}
                            </span>

                            {/* Unsaved indicator */}
                            {pageContext.hasChanges && (
                                <span className="text-xs text-amber-600 font-medium">
                                    {t('status.unsavedChanges')}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Editor Actions */}
                        {pageContext && (
                            <>
                                <AdminButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={pageContext.onPreview}
                                    leftIcon={<AdminIcon name="eye" className="w-4 h-4" />}
                                >
                                    <span className="hidden sm:inline">{t('actions.preview')}</span>
                                </AdminButton>
                                <AdminButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={pageContext.onSave}
                                    isLoading={pageContext.isSaving}
                                    disabled={!pageContext.hasChanges}
                                    leftIcon={<AdminIcon name="save" className="w-4 h-4" />}
                                >
                                    <span className="hidden sm:inline">{t('actions.save')}</span>
                                </AdminButton>
                                <AdminButton
                                    variant="primary"
                                    size="sm"
                                    onClick={pageContext.onPublish}
                                    isLoading={pageContext.isPublishing}
                                    leftIcon={<AdminIcon name="publish" className="w-4 h-4" />}
                                >
                                    <span className="hidden sm:inline">{t('actions.publish')}</span>
                                </AdminButton>
                            </>
                        )}

                        {/* Search */}
                        {!pageContext && (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface text-muted hover:text-ink transition-colors"
                            >
                                <AdminIcon name="search" className="w-4 h-4" />
                                <span className="hidden sm:inline text-sm">{t('actions.search')}...</span>
                                <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white border border-border-light font-mono">
                                    ⌘K
                                </kbd>
                            </button>
                        )}

                        {/* Language Switcher */}
                        <div className="relative" ref={langMenuRef}>
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="flex items-center gap-1 p-2 rounded-xl hover:bg-surface transition-colors text-sm"
                                title={t('langSwitcher.label')}
                            >
                                <span>{currentFlag}</span>
                                <AdminIcon name="chevronDown" className="w-3 h-3 text-muted" />
                            </button>

                            {isLangMenuOpen && (
                                <div className="absolute right-0 mt-2 w-44 py-1 bg-white rounded-card shadow-card border border-border-light z-50">
                                    {ADMIN_LOCALES.map((locale) => (
                                        <button
                                            key={locale.code}
                                            onClick={() => {
                                                setAdminLocale(locale.code);
                                                setIsLangMenuOpen(false);
                                            }}
                                            className={`
                                                w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                                                ${adminLocale === locale.code
                                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                                    : 'text-muted hover:text-ink hover:bg-surface'
                                                }
                                            `}
                                        >
                                            <span>{locale.flag}</span>
                                            <span>{t(`langSwitcher.${locale.code}`)}</span>
                                            {adminLocale === locale.code && (
                                                <AdminIcon name="check" className="w-4 h-4 ml-auto text-primary-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        {user.name?.[0] || user.email[0].toUpperCase()}
                                    </span>
                                </div>
                                <AdminIcon name="chevronDown" className="w-4 h-4 text-muted hidden sm:block" />
                            </button>

                            {/* Dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 py-2 bg-white rounded-card shadow-card border border-border-light">
                                    <div className="px-4 py-2 border-b border-border-light">
                                        <p className="text-sm font-medium text-ink">{user.name || 'User'}</p>
                                        <p className="text-xs text-muted">{user.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-ink hover:bg-surface transition-colors"
                                        >
                                            <AdminIcon name="settings" className="w-4 h-4" />
                                            {t('userMenu.settings')}
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <AdminIcon name="logout" className="w-4 h-4" />
                                            {t('userMenu.signOut')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center pt-24"
                    onClick={() => setIsSearchOpen(false)}
                >
                    <div
                        className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl shadow-card overflow-hidden animate-fade-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 px-4 border-b border-border-light">
                            <AdminIcon name="search" className="w-5 h-5 text-muted" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={t('search.placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 py-4 text-ink placeholder:text-muted/60 bg-transparent border-none focus:outline-none focus:ring-0"
                            />
                            <kbd className="text-xs px-2 py-1 rounded bg-surface text-muted font-mono">
                                ESC
                            </kbd>
                        </div>
                        <div className="p-2 max-h-80 overflow-y-auto">
                            {/* Quick Links */}
                            <div className="px-2 py-1.5">
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    {t('search.quickLinks')}
                                </p>
                                {[
                                    { nameKey: 'homePage', href: '/admin/content/pages/home', icon: 'pages' },
                                    { nameKey: 'aboutPage', href: '/admin/content/pages/about', icon: 'pages' },
                                    { nameKey: 'servicesPage', href: '/admin/content/pages/services', icon: 'pages' },
                                    { nameKey: 'globalSettings', href: '/admin/settings', icon: 'settings' },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsSearchOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:text-ink hover:bg-surface transition-colors"
                                    >
                                        <AdminIcon name={item.icon} className="w-4 h-4" />
                                        {t(`search.${item.nameKey}`)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-fade-in">
                        {/* Mobile menu header — gradient logo area */}
                        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-br from-primary-600 to-primary-700">
                            <Link href="/admin" className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                    <span className="text-white font-heading font-bold text-sm">S</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-heading font-semibold text-sm text-white leading-tight">Silkbridge</span>
                                    <span className="text-[10px] text-white/70 uppercase tracking-wider">Admin</span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <AdminIcon name="close" className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="p-4 space-y-1">
                            {[
                                { nameKey: 'overview', href: '/admin', icon: 'dashboard' },
                                { nameKey: 'pages', href: '/admin/pages', icon: 'pages' },
                                { nameKey: 'insights', href: '/admin/insights', icon: 'pages' },
                                { nameKey: 'partners', href: '/admin/partners', icon: 'users' },
                                { nameKey: 'contactInbox', href: '/admin/contact', icon: 'inbox' },
                                { nameKey: 'settings', href: '/admin/settings', icon: 'settings' },
                                ...(user.role === 'ADMIN' ? [
                                    { nameKey: 'languages', href: '/admin/locales', icon: 'globe' },
                                    { nameKey: 'users', href: '/admin/users', icon: 'users' },
                                ] : []),
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                                        ${pathname === item.href || pathname.startsWith(item.href + '/')
                                            ? 'bg-primary-50 text-primary-700 border-l-[3px] border-primary-600'
                                            : 'text-muted hover:text-ink hover:bg-surface border-l-[3px] border-transparent'
                                        }
                                    `}
                                >
                                    <AdminIcon name={item.icon} className="w-5 h-5" />
                                    {t(`nav.${item.nameKey}`)}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
