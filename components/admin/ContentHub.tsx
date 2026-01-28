'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminCard, AdminCardHeader } from './ui/AdminCard';
import { AdminBadge } from './ui/AdminBadge';
import { AdminButton } from './ui/AdminButton';
import { AdminIcon } from './ui/AdminIcon';
import { AdminEmptyState } from './ui/AdminEmptyState';

interface PageTranslation {
    localeCode: string;
    title: string;
    status: 'DRAFT' | 'PUBLISHED';
    updatedAt: Date;
}

interface Page {
    id: string;
    slug: string;
    updatedAt: Date;
    translations: PageTranslation[];
    displayInfo: {
        icon: string;
        description: string;
        color: string;
    };
}

interface Locale {
    code: string;
    name: string;
    flag: string | null;
    isDefault: boolean;
    isEnabled: boolean;
}

interface ContentHubProps {
    pages: Page[];
    locales: Locale[];
}

export default function ContentHub({ pages, locales }: ContentHubProps) {
    const [selectedLocale, setSelectedLocale] = useState<string | 'all'>('all');

    // Filter pages by locale if selected
    const filteredPages = selectedLocale === 'all'
        ? pages
        : pages.filter(page =>
            page.translations.some(t => t.localeCode === selectedLocale)
        );

    // Get translation status for a page in a specific locale
    const getTranslationStatus = (page: Page, localeCode: string) => {
        const translation = page.translations.find(t => t.localeCode === localeCode);
        if (!translation) return { status: 'missing' as const, translation: null };
        return { status: translation.status.toLowerCase() as 'draft' | 'published', translation };
    };

    // Format relative time
    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    if (pages.length === 0) {
        return (
            <div className="max-w-5xl mx-auto">
                <AdminEmptyState
                    title="No pages found"
                    description="Pages will appear here once your database is seeded."
                    action={{
                        label: 'Refresh',
                        onClick: () => window.location.reload(),
                    }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-ink">Content Hub</h1>
                    <p className="mt-1 text-muted">
                        Manage your website pages and content across all languages
                    </p>
                </div>

                {/* Locale Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Filter:</span>
                    <div className="inline-flex items-center p-1 bg-white rounded-xl border border-border-light">
                        <button
                            onClick={() => setSelectedLocale('all')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${selectedLocale === 'all'
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-muted hover:text-ink'
                                }`}
                        >
                            All
                        </button>
                        {locales.map((locale) => (
                            <button
                                key={locale.code}
                                onClick={() => setSelectedLocale(locale.code)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${selectedLocale === locale.code
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-muted hover:text-ink'
                                    }`}
                            >
                                {locale.flag} {locale.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AdminCard padding="sm" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                        <AdminIcon name="pages" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-ink">{pages.length}</p>
                        <p className="text-xs text-muted">Total Pages</p>
                    </div>
                </AdminCard>
                <AdminCard padding="sm" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <AdminIcon name="check" className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-ink">
                            {pages.reduce((acc, page) =>
                                acc + page.translations.filter(t => t.status === 'PUBLISHED').length, 0
                            )}
                        </p>
                        <p className="text-xs text-muted">Published</p>
                    </div>
                </AdminCard>
                <AdminCard padding="sm" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <AdminIcon name="edit" className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-ink">
                            {pages.reduce((acc, page) =>
                                acc + page.translations.filter(t => t.status === 'DRAFT').length, 0
                            )}
                        </p>
                        <p className="text-xs text-muted">Drafts</p>
                    </div>
                </AdminCard>
                <AdminCard padding="sm" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <AdminIcon name="globe" className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-ink">{locales.length}</p>
                        <p className="text-xs text-muted">Languages</p>
                    </div>
                </AdminCard>
            </div>

            {/* Pages Grid */}
            <div className="grid gap-4">
                <h2 className="font-heading font-semibold text-lg text-ink">Website Pages</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPages.map((page) => (
                        <AdminCard
                            key={page.id}
                            variant="interactive"
                            padding="none"
                            className="overflow-hidden group"
                        >
                            {/* Card Header with Icon */}
                            <div className={`h-2 bg-gradient-to-r ${page.displayInfo.color}`} />

                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">{page.displayInfo.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-heading font-semibold text-ink capitalize">
                                            {page.slug === 'home' ? 'Home Page' : `${page.slug} Page`}
                                        </h3>
                                        <p className="mt-0.5 text-sm text-muted line-clamp-2">
                                            {page.displayInfo.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Language Status */}
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs font-medium text-muted uppercase tracking-wider">
                                        Translation Status
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {locales.map((locale) => {
                                            const { status, translation } = getTranslationStatus(page, locale.code);
                                            return (
                                                <Link
                                                    key={locale.code}
                                                    href={`/admin/content/pages/${page.slug}?locale=${locale.code}`}
                                                    className="group/badge"
                                                >
                                                    <AdminBadge
                                                        variant={
                                                            status === 'published' ? 'published' :
                                                                status === 'draft' ? 'draft' : 'default'
                                                        }
                                                        dot
                                                        className="transition-all group-hover/badge:shadow-sm"
                                                    >
                                                        {locale.flag} {locale.code.toUpperCase()}
                                                    </AdminBadge>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Last Updated */}
                                {page.translations.length > 0 && (
                                    <p className="mt-4 text-xs text-muted">
                                        Last updated {formatRelativeTime(
                                            page.translations.reduce((latest, t) =>
                                                new Date(t.updatedAt) > new Date(latest) ? t.updatedAt : latest,
                                                page.translations[0].updatedAt
                                            )
                                        )}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-border-light flex items-center gap-2">
                                    <Link href={`/admin/content/pages/${page.slug}`} className="flex-1">
                                        <AdminButton variant="secondary" size="sm" className="w-full">
                                            <AdminIcon name="edit" className="w-4 h-4 mr-1.5" />
                                            Edit Content
                                        </AdminButton>
                                    </Link>
                                    <Link
                                        href={`/${locales[0]?.code || 'en'}${page.slug === 'home' ? '' : `/${page.slug}`}`}
                                        target="_blank"
                                    >
                                        <AdminButton variant="ghost" size="sm">
                                            <AdminIcon name="eye" className="w-4 h-4" />
                                        </AdminButton>
                                    </Link>
                                </div>
                            </div>
                        </AdminCard>
                    ))}
                </div>
            </div>

            {/* Global Settings Card */}
            <div className="grid gap-4">
                <h2 className="font-heading font-semibold text-lg text-ink">Global Settings</h2>

                <AdminCard variant="interactive" padding="none" className="overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-slate-500 to-slate-600" />
                    <div className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                <AdminIcon name="settings" className="w-6 h-6 text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-heading font-semibold text-ink">
                                    Header, Footer & Contact
                                </h3>
                                <p className="mt-0.5 text-sm text-muted">
                                    Site-wide settings including navigation, footer links, social media, and contact information
                                </p>
                            </div>
                            <Link href="/admin/settings">
                                <AdminButton variant="secondary" size="sm">
                                    <AdminIcon name="settings" className="w-4 h-4 mr-1.5" />
                                    Manage Settings
                                </AdminButton>
                            </Link>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}
