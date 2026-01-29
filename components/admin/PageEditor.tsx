'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { savePageTranslation } from '@/lib/actions';
import type { ContentBlock } from '@/lib/validations';
import BlocksEditor from './BlocksEditor';
import BlockPreview from './BlockPreview';

interface PageEditorProps {
    page: {
        id: string;
        slug: string;
    };
    translation: {
        id: string;
        title: string;
        seoTitle: string | null;
        seoDescription: string | null;
        ogImage: string | null;
        blocks: unknown;
        status: 'DRAFT' | 'PUBLISHED';
        updatedAt: Date;
    } | null;
    locales: Array<{
        code: string;
        name: string;
        flag: string | null;
        isDefault: boolean;
    }>;
    currentLocale: string;
}

export default function PageEditor({ page, translation, locales, currentLocale }: PageEditorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Form state
    const [title, setTitle] = useState(translation?.title || '');
    const [seoTitle, setSeoTitle] = useState(translation?.seoTitle || '');
    const [seoDescription, setSeoDescription] = useState(translation?.seoDescription || '');
    const [ogImage, setOgImage] = useState(translation?.ogImage || '');
    const [blocks, setBlocks] = useState<ContentBlock[]>((translation?.blocks as ContentBlock[]) || []);
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(translation?.status || 'DRAFT');

    // UI state
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
    const [showPreview, setShowPreview] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Reset form state when translation changes (locale switch)
    useEffect(() => {
        setTitle(translation?.title || '');
        setSeoTitle(translation?.seoTitle || '');
        setSeoDescription(translation?.seoDescription || '');
        setOgImage(translation?.ogImage || '');
        setBlocks((translation?.blocks as ContentBlock[]) || []);
        setStatus(translation?.status || 'DRAFT');
        setHasUnsavedChanges(false);
        setError(null);
        setSuccess(null);
    }, [translation, currentLocale]);

    // Track changes
    useEffect(() => {
        const originalData = JSON.stringify({
            title: translation?.title || '',
            seoTitle: translation?.seoTitle || '',
            seoDescription: translation?.seoDescription || '',
            ogImage: translation?.ogImage || '',
            blocks: translation?.blocks || [],
            status: translation?.status || 'DRAFT',
        });

        const currentData = JSON.stringify({
            title,
            seoTitle,
            seoDescription,
            ogImage,
            blocks,
            status,
        });

        setHasUnsavedChanges(originalData !== currentData);
    }, [title, seoTitle, seoDescription, ogImage, blocks, status, translation]);

    // Warn on unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleLocaleChange = (newLocale: string) => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch locales?');
            if (!confirmed) return;
        }
        const params = new URLSearchParams(searchParams.toString());
        params.set('locale', newLocale);
        router.push(`/admin/pages/${page.slug}?${params.toString()}`);
    };

    const handleSave = useCallback(async (newStatus: 'DRAFT' | 'PUBLISHED') => {
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await savePageTranslation({
                pageId: page.id,
                localeCode: currentLocale,
                title,
                seoTitle: seoTitle || undefined,
                seoDescription: seoDescription || undefined,
                ogImage: ogImage || undefined,
                blocks,
                status: newStatus,
            });

            if (result.success) {
                setStatus(newStatus);
                setSuccess(`Page ${newStatus === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully!`);
                setHasUnsavedChanges(false);
                router.refresh();
            } else {
                setError(result.error || 'Failed to save page');
            }
        });
    }, [page.id, currentLocale, title, seoTitle, seoDescription, ogImage, blocks, router]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/admin/pages')}
                            className="p-2 -ml-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-semibold text-ink capitalize">{page.slug}</h1>
                    </div>
                    {translation?.updatedAt && (
                        <p className="text-sm text-muted mt-1">
                            Last updated: {new Date(translation.updatedAt).toLocaleString()}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Locale Selector */}
                    <select
                        value={currentLocale}
                        onChange={(e) => handleLocaleChange(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {locales.map((locale) => (
                            <option key={locale.code} value={locale.code}>
                                {locale.flag} {locale.name}
                            </option>
                        ))}
                    </select>

                    {/* Preview Toggle */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showPreview
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border border-border text-ink hover:bg-surface'
                            }`}
                    >
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>

                    {/* Save Buttons */}
                    <button
                        onClick={() => handleSave('DRAFT')}
                        disabled={isPending}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-border text-ink hover:bg-surface disabled:opacity-50 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('PUBLISHED')}
                        disabled={isPending}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                        {isPending ? 'Saving...' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
            {success && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <p className="text-sm text-green-600">{success}</p>
                </div>
            )}

            {/* Unsaved Changes Warning */}
            {hasUnsavedChanges && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-sm text-amber-700">You have unsaved changes</p>
                </div>
            )}

            {showPreview ? (
                /* Preview Mode */
                <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8">
                    <div className="max-w-4xl mx-auto">
                        <BlockPreview blocks={blocks} />
                    </div>
                </div>
            ) : (
                /* Edit Mode */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-2xl border border-border-light shadow-sm">
                            <div className="flex border-b border-border-light">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'content'
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-muted hover:text-ink'
                                        }`}
                                >
                                    Content Blocks
                                </button>
                                <button
                                    onClick={() => setActiveTab('seo')}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'seo'
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-muted hover:text-ink'
                                        }`}
                                >
                                    SEO Settings
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'content' ? (
                                    <BlocksEditor blocks={blocks} onChange={setBlocks} />
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-ink mb-2">
                                                SEO Title
                                            </label>
                                            <input
                                                type="text"
                                                value={seoTitle}
                                                onChange={(e) => setSeoTitle(e.target.value)}
                                                placeholder="Page title for search engines"
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-muted mt-2">
                                                {seoTitle.length}/60 characters recommended
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-ink mb-2">
                                                SEO Description
                                            </label>
                                            <textarea
                                                value={seoDescription}
                                                onChange={(e) => setSeoDescription(e.target.value)}
                                                placeholder="Brief description for search results"
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                            />
                                            <p className="text-xs text-muted mt-2">
                                                {seoDescription.length}/160 characters recommended
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-ink mb-2">
                                                OG Image URL
                                            </label>
                                            <input
                                                type="url"
                                                value={ogImage}
                                                onChange={(e) => setOgImage(e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Page Info */}
                        <div className="bg-white rounded-2xl border border-border-light shadow-sm p-6">
                            <h3 className="font-semibold text-ink mb-4">Page Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        Page Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Page title"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        Status
                                    </label>
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status === 'PUBLISHED'
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        URL
                                    </label>
                                    <p className="text-sm text-muted">
                                        /{currentLocale}{page.slug === 'home' ? '' : `/${page.slug}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Locale Status */}
                        <div className="bg-white rounded-2xl border border-border-light shadow-sm p-6">
                            <h3 className="font-semibold text-ink mb-4">Translations</h3>
                            <div className="space-y-2">
                                {locales.map((locale) => (
                                    <button
                                        key={locale.code}
                                        onClick={() => handleLocaleChange(locale.code)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${locale.code === currentLocale
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'hover:bg-surface text-ink'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{locale.flag}</span>
                                            <span>{locale.name}</span>
                                        </span>
                                        {locale.code === currentLocale && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
