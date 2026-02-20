'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { savePageTranslation } from '@/lib/actions';
import { blocksToSections, sectionsToBlocks } from '@/lib/admin/page-config';
import type { PageConfig } from '@/lib/admin/page-config';
import type { ContentBlock } from '@/lib/blocks/schema';
import SectionEditor from '@/components/admin/SectionEditor';
import { AdminButton, AdminBadge, AdminInput, AdminTextarea } from '@/components/admin/ui';

// ============================================
// Types
// ============================================

interface TranslationData {
    id: string;
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImage: string | null;
    blocks: ContentBlock[];
    status: 'DRAFT' | 'PUBLISHED';
    updatedAt: Date;
    updatedBy: string | null;
}

interface LocaleInfo {
    code: string;
    name: string;
    nativeName: string;
    flag: string | null;
    isDefault: boolean;
}

interface PageEditorNewProps {
    pageConfig: PageConfig;
    pageId: string;
    translation: TranslationData;
    locales: LocaleInfo[];
    currentLocale: string;
    allTranslations: Array<{ localeCode: string; status: 'DRAFT' | 'PUBLISHED' }>;
}

// ============================================
// Page Editor Component
// ============================================

export default function PageEditorNew({
    pageConfig,
    pageId,
    translation,
    locales,
    currentLocale,
    allTranslations,
}: PageEditorNewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Form state — initialized from server data on mount (or remount via key prop)
    const [title, setTitle] = useState(translation.title);
    const [seoTitle, setSeoTitle] = useState(translation.seoTitle ?? '');
    const [seoDescription, setSeoDescription] = useState(translation.seoDescription ?? '');

    // Initialize sections from blocks
    const initialSections = blocksToSections(
        pageConfig.slug,
        translation.blocks as unknown as Record<string, unknown>[]
    );
    const [sections, setSections] = useState(initialSections);

    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSeo, setShowSeo] = useState(false);

    // Track current published status locally so it updates after save
    const [currentStatus, setCurrentStatus] = useState<'DRAFT' | 'PUBLISHED'>(
        allTranslations.find(t => t.localeCode === currentLocale)?.status ?? 'DRAFT'
    );

    const handleSectionsChange = useCallback((newSections: typeof sections) => {
        setSections(newSections);
        setIsDirty(true);
    }, []);

    // Locale switching — uses router.replace to trigger server re-fetch
    const handleLocaleChange = (newLocale: string) => {
        if (newLocale === currentLocale) return;
        if (isDirty && !confirm('You have unsaved changes. Switch locale anyway?')) return;

        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('locale', newLocale);
            router.replace(`/admin/pages/${pageConfig.slug}?${params.toString()}`);
        });
    };

    // Save (draft or publish)
    const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
        setIsSaving(true);
        try {
            const blocks = sectionsToBlocks(sections);
            const result = await savePageTranslation({
                pageId,
                localeCode: currentLocale,
                title,
                seoTitle: seoTitle || null,
                seoDescription: seoDescription || null,
                ogImage: translation.ogImage,
                blocks,
                status,
            });

            if (result.success) {
                if (result.translation) {
                    setTitle(result.translation.title ?? title);
                    setSeoTitle(result.translation.seoTitle ?? '');
                    setSeoDescription(result.translation.seoDescription ?? '');
                    const syncedSections = blocksToSections(
                        pageConfig.slug,
                        (result.translation.blocks as unknown as Record<string, unknown>[]) ?? []
                    );
                    setSections(syncedSections);
                }

                // Update local state: form is now in sync with server
                setIsDirty(false);
                setCurrentStatus(status);
                toast.success(status === 'PUBLISHED' ? 'Published successfully!' : 'Draft saved!');
                // Refresh server component data in background (for navigation/cache)
                router.refresh();
            } else {
                console.error('[Admin Save Error]', result.error);
                toast.error(result.error || 'Failed to save');
            }
        } catch (err) {
            console.error('[Admin Save Exception]', err);
            toast.error('An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Top Bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Left: Page name + status */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-gray-900">{pageConfig.label}</h1>
                        <AdminBadge variant={currentStatus === 'PUBLISHED' ? 'success' : 'draft'}>
                            {currentStatus}
                        </AdminBadge>
                        {isDirty && (
                            <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Locale Selector */}
                        <select
                            value={currentLocale}
                            onChange={(e) => handleLocaleChange(e.target.value)}
                            disabled={isPending}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {locales.map((locale) => {
                                const trans = allTranslations.find(t => t.localeCode === locale.code);
                                return (
                                    <option key={locale.code} value={locale.code}>
                                        {locale.flag} {locale.nativeName}
                                        {trans ? ` (${trans.status === 'PUBLISHED' ? '✓' : '○'})` : ' (new)'}
                                    </option>
                                );
                            })}
                        </select>

                        <AdminButton
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSave('DRAFT')}
                            disabled={isSaving || !isDirty}
                            isLoading={isSaving}
                        >
                            Save Draft
                        </AdminButton>
                        <AdminButton
                            variant="primary"
                            size="sm"
                            onClick={() => handleSave('PUBLISHED')}
                            disabled={isSaving}
                            isLoading={isSaving}
                        >
                            Publish
                        </AdminButton>
                        <AdminButton
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/${currentLocale}${pageConfig.route === '/' ? '' : pageConfig.route}`, '_blank')}
                        >
                            View Page ↗
                        </AdminButton>
                    </div>
                </div>
            </div>

            {/* Page Title */}
            <div className="mb-6">
                <AdminInput
                    label="Page Title"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                    required
                    helperText="The main title for this page."
                />
            </div>

            {/* SEO Section (collapsible) */}
            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => setShowSeo(!showSeo)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    <svg
                        className={`w-4 h-4 transition-transform ${showSeo ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    SEO Settings
                </button>
                {showSeo && (
                    <div className="mt-3 space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                        <AdminInput
                            label="SEO Title"
                            value={seoTitle}
                            onChange={(e) => { setSeoTitle(e.target.value); setIsDirty(true); }}
                            maxLength={60}
                            helperText="Appears in search results. Max 60 characters."
                        />
                        <AdminTextarea
                            label="SEO Description"
                            value={seoDescription}
                            onChange={(e) => { setSeoDescription(e.target.value); setIsDirty(true); }}
                            maxLength={160}
                            helperText="Appears in search results. Max 160 characters."
                            rows={3}
                        />
                    </div>
                )}
            </div>

            {/* Section Editor (accordions) */}
            <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Page Sections
                </h2>
                <SectionEditor
                    sections={sections}
                    onChange={handleSectionsChange}
                    disabled={isSaving}
                />
            </div>
        </div>
    );
}
