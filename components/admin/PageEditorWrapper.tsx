'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { savePageTranslation, publishPage } from '@/lib/actions';
import { useToast } from './ui/AdminToast';
import { AdminCard } from './ui/AdminCard';
import { AdminButton } from './ui/AdminButton';
import { AdminBadge } from './ui/AdminBadge';
import { AdminIcon } from './ui/AdminIcon';
import { AdminInput } from './ui/AdminInput';
import { AdminTextarea } from './ui/AdminTextarea';
import { AdminTabs } from './ui/AdminTabs';
import { AdminConfirmDialog } from './ui/AdminModal';
import GuidedSectionsEditor from '@/components/admin/GuidedSectionsEditor';
import VersionHistoryDrawer from '@/components/admin/VersionHistoryDrawer';

// Simplified block type for the editor
export interface EditorBlock {
    id: string;
    type: string;
    data: Record<string, unknown>;
}

interface PageEditorWrapperProps {
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
        updatedBy: string | null;
    } | null;
    locales: Array<{
        code: string;
        name: string;
        flag: string | null;
        isDefault: boolean;
    }>;
    currentLocale: string;
    allTranslations: Array<{
        localeCode: string;
        status: 'DRAFT' | 'PUBLISHED';
    }>;
}

export default function PageEditorWrapper({
    page,
    translation,
    locales,
    currentLocale,
    allTranslations,
}: PageEditorWrapperProps) {
    const router = useRouter();
    const toast = useToast();
    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Form state
    const [title, setTitle] = useState(translation?.title || '');
    const [seoTitle, setSeoTitle] = useState(translation?.seoTitle || '');
    const [seoDescription, setSeoDescription] = useState(translation?.seoDescription || '');
    const [ogImage, setOgImage] = useState(translation?.ogImage || '');
    const [blocks, setBlocks] = useState<EditorBlock[]>(
        Array.isArray(translation?.blocks)
            ? (translation.blocks as unknown[]).map((b, i) => {
                const block = b as Record<string, unknown>;
                return {
                    id: (block.id as string) || `block-${i}`,
                    type: (block.type as string) || 'text',
                    data: block,
                };
            })
            : []
    );
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(translation?.status || 'DRAFT');

    // UI state
    const [activeTab, setActiveTab] = useState('content');
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(translation?.updatedAt ? new Date(translation.updatedAt) : null);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

    // Track original data for change detection
    const originalDataRef = useRef({
        title: translation?.title || '',
        seoTitle: translation?.seoTitle || '',
        seoDescription: translation?.seoDescription || '',
        ogImage: translation?.ogImage || '',
        blocks: JSON.stringify(translation?.blocks || []),
    });

    // Detect changes
    useEffect(() => {
        const currentData = {
            title,
            seoTitle,
            seoDescription,
            ogImage,
            blocks: JSON.stringify(blocks),
        };
        const hasChanges =
            currentData.title !== originalDataRef.current.title ||
            currentData.seoTitle !== originalDataRef.current.seoTitle ||
            currentData.seoDescription !== originalDataRef.current.seoDescription ||
            currentData.ogImage !== originalDataRef.current.ogImage ||
            currentData.blocks !== originalDataRef.current.blocks;

        setHasUnsavedChanges(hasChanges);
    }, [title, seoTitle, seoDescription, ogImage, blocks]);

    // Autosave (every 30 seconds if there are changes)
    useEffect(() => {
        if (hasUnsavedChanges) {
            autosaveTimerRef.current = setTimeout(() => {
                handleSave(true);
            }, 30000);
        }

        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current);
            }
        };
    }, [hasUnsavedChanges, title, seoTitle, seoDescription, ogImage, blocks]);

    // Warn on unsaved changes when leaving
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

    // Handle locale change
    const handleLocaleChange = useCallback((newLocale: string) => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm('You have unsaved changes. Switch language anyway?');
            if (!confirmed) return;
        }
        router.push(`/admin/content/pages/${page.slug}?locale=${newLocale}`);
    }, [hasUnsavedChanges, page.slug, router]);

    // Get public page URL
    const getPublicPageUrl = useCallback(() => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        if (page.slug === 'home') {
            return `${baseUrl}/${currentLocale}`;
        }
        return `${baseUrl}/${currentLocale}/${page.slug}`;
    }, [currentLocale, page.slug]);

    // Handle view page - opens in new tab
    const handleViewPage = useCallback(() => {
        const url = getPublicPageUrl();
        window.open(url, '_blank');
    }, [getPublicPageUrl]);

    // Handle copy link
    const handleCopyLink = useCallback(async () => {
        const url = getPublicPageUrl();
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard');
        } catch {
            toast.error('Failed to copy link');
        }
    }, [getPublicPageUrl, toast]);

    // Handle save
    const handleSave = useCallback(async (isAutosave = false) => {
        if (!title.trim()) {
            toast.error('Page title is required');
            return;
        }

        setIsSaving(true);
        try {
            // Transform blocks: flatten data property into the block itself
            const transformedBlocks = blocks.map(block => ({
                type: block.type,
                ...block.data,
            }));

            const result = await savePageTranslation({
                pageId: page.id,
                localeCode: currentLocale,
                title: title.trim(),
                seoTitle: seoTitle.trim() || null,
                seoDescription: seoDescription.trim() || null,
                ogImage: ogImage.trim() || null,
                blocks: transformedBlocks,
                status: 'DRAFT',
            });

            if (result.success) {
                setLastSaved(new Date());
                setHasUnsavedChanges(false);
                originalDataRef.current = {
                    title,
                    seoTitle,
                    seoDescription,
                    ogImage,
                    blocks: JSON.stringify(blocks),
                };
                if (!isAutosave) {
                    toast.success('Draft saved successfully');
                }
            } else {
                toast.error(result.error || 'Failed to save');
            }
        } catch (error) {
            toast.error('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    }, [page.id, currentLocale, title, seoTitle, seoDescription, ogImage, blocks, toast]);

    // Handle publish
    const handlePublish = useCallback(async () => {
        if (!title.trim()) {
            toast.error('Page title is required');
            return;
        }

        setIsPublishing(true);
        try {
            // Transform blocks: flatten data property into the block itself
            const transformedBlocks = blocks.map(block => ({
                type: block.type,
                ...block.data,
            }));

            // First save
            const saveResult = await savePageTranslation({
                pageId: page.id,
                localeCode: currentLocale,
                title: title.trim(),
                seoTitle: seoTitle.trim() || null,
                seoDescription: seoDescription.trim() || null,
                ogImage: ogImage.trim() || null,
                blocks: transformedBlocks,
                status: 'PUBLISHED',
            });

            if (saveResult.success) {
                // Then publish (trigger revalidation)
                const publishResult = await publishPage(page.id, currentLocale, page.slug);

                if (publishResult.success) {
                    setStatus('PUBLISHED');
                    setLastSaved(new Date());
                    setHasUnsavedChanges(false);
                    originalDataRef.current = {
                        title,
                        seoTitle,
                        seoDescription,
                        ogImage,
                        blocks: JSON.stringify(blocks),
                    };
                    toast.success('Published successfully! Changes are now live.');
                    setShowPublishDialog(false);
                } else {
                    toast.error(publishResult.error || 'Failed to publish');
                }
            } else {
                toast.error(saveResult.error || 'Failed to save');
            }
        } catch (error) {
            toast.error('An error occurred while publishing');
        } finally {
            setIsPublishing(false);
        }
    }, [page.id, page.slug, currentLocale, title, seoTitle, seoDescription, ogImage, blocks, toast]);

    // Format relative time
    const formatLastSaved = () => {
        if (!lastSaved) return null;
        const diff = Date.now() - lastSaved.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just saved';
        if (minutes < 60) return `Saved ${minutes}m ago`;
        return `Saved at ${lastSaved.toLocaleTimeString()}`;
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Top Bar */}
            <div className="flex-shrink-0 flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border-light">
                {/* Left: Page info & locale */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/content')}
                        className="p-2 -ml-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                    >
                        <AdminIcon name="chevronLeft" className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-heading font-semibold text-lg text-ink capitalize">
                            {page.slug === 'home' ? 'Home Page' : `${page.slug} Page`}
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <select
                                value={currentLocale}
                                onChange={(e) => handleLocaleChange(e.target.value)}
                                className="text-sm text-muted bg-transparent border-none focus:outline-none cursor-pointer hover:text-ink"
                            >
                                {locales.map((locale) => (
                                    <option key={locale.code} value={locale.code}>
                                        {locale.flag} {locale.name}
                                    </option>
                                ))}
                            </select>
                            <span className="text-muted">•</span>
                            <AdminBadge variant={status === 'PUBLISHED' ? 'published' : 'draft'} dot>
                                {status === 'PUBLISHED' ? 'Published' : 'Draft'}
                            </AdminBadge>
                            {lastSaved && (
                                <>
                                    <span className="text-muted">•</span>
                                    <span className="text-xs text-muted">{formatLastSaved()}</span>
                                </>
                            )}
                            {hasUnsavedChanges && (
                                <span className="text-xs text-amber-600 font-medium">• Unsaved</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={handleViewPage}
                        leftIcon={<AdminIcon name="eye" className="w-4 h-4" />}
                    >
                        View Page
                    </AdminButton>
                    <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyLink}
                        leftIcon={<AdminIcon name="link" className="w-4 h-4" />}
                    >
                        Copy Link
                    </AdminButton>
                    <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistoryDrawer(true)}
                        leftIcon={<AdminIcon name="history" className="w-4 h-4" />}
                    >
                        History
                    </AdminButton>
                    <div className="w-px h-6 bg-border-light" />
                    <AdminButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSave(false)}
                        isLoading={isSaving}
                        disabled={!hasUnsavedChanges}
                        leftIcon={<AdminIcon name="save" className="w-4 h-4" />}
                    >
                        Save Draft
                    </AdminButton>
                    <AdminButton
                        variant="primary"
                        size="sm"
                        onClick={() => setShowPublishDialog(true)}
                        leftIcon={<AdminIcon name="publish" className="w-4 h-4" />}
                    >
                        Publish
                    </AdminButton>
                </div>
            </div>

            {/* Main Content Area - Full Width Editor */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Tabs */}
                <AdminTabs
                    tabs={[
                        { id: 'content', label: 'Content', icon: <AdminIcon name="edit" className="w-4 h-4" /> },
                        { id: 'seo', label: 'SEO', icon: <AdminIcon name="search" className="w-4 h-4" /> },
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'content' && (
                        <div className="h-full">
                            {/* Use Guided Sections Editor instead of generic blocks editor */}
                            <GuidedSectionsEditor
                                pageSlug={page.slug}
                                blocks={blocks.map(b => {
                                    const { type, ...data } = b.data as any;
                                    return { type: b.type, ...data };
                                })}
                                onBlocksChange={(newBlocks) => {
                                    const editorBlocks = newBlocks.map((b: any, i: number) => {
                                        const { type, ...data } = b;
                                        return {
                                            id: `block-${i}`,
                                            type,
                                            data: b,
                                        };
                                    });
                                    setBlocks(editorBlocks);
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="p-6 overflow-y-auto h-full">
                            <AdminCard padding="md" className="space-y-6 max-w-4xl">
                                <div className="space-y-1">
                                    <h3 className="font-heading font-semibold text-ink">Search Engine Optimization</h3>
                                    <p className="text-sm text-muted">
                                        Control how this page appears in search results
                                    </p>
                                </div>

                                <AdminInput
                                    label="Page Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter page title..."
                                    helperText="The main page title (used in browser tab and for SEO if no custom SEO title is set)"
                                    required
                                />

                                <AdminInput
                                    label="SEO Title (Override)"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    placeholder="Enter SEO title..."
                                    helperText="Keep under 60 characters for best results. Leave empty to use page title."
                                    showCharCount
                                    maxLength={60}
                                />

                                <AdminTextarea
                                    label="Meta Description"
                                    value={seoDescription}
                                    onChange={(e) => setSeoDescription(e.target.value)}
                                    placeholder="Enter meta description..."
                                    helperText="Keep under 160 characters for best results"
                                    showCharCount
                                    maxLength={160}
                                    rows={3}
                                />

                                <AdminInput
                                    label="OG Image URL"
                                    value={ogImage}
                                    onChange={(e) => setOgImage(e.target.value)}
                                    placeholder="https://..."
                                    helperText="Image shown when sharing on social media (1200x630px recommended)"
                                />

                                {/* Google Preview */}
                                <div className="p-4 bg-surface rounded-xl">
                                    <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                                        Search Preview
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-primary-600 text-lg font-medium truncate">
                                            {seoTitle || title || 'Page Title'}
                                        </p>
                                        <p className="text-emerald-700 text-sm truncate">
                                            silkbridge.com/{currentLocale}/{page.slug === 'home' ? '' : page.slug}
                                        </p>
                                        <p className="text-sm text-muted line-clamp-2">
                                            {seoDescription || 'Add a meta description to improve your search visibility.'}
                                        </p>
                                    </div>
                                </div>
                            </AdminCard>
                        </div>
                    )}
                </div>
            </div>

            {/* Publish Confirmation Dialog */}
            <AdminConfirmDialog
                isOpen={showPublishDialog}
                onClose={() => setShowPublishDialog(false)}
                onConfirm={handlePublish}
                title="Publish Changes?"
                description={`This will make your changes live on the ${locales.find(l => l.code === currentLocale)?.name || currentLocale} version of the ${page.slug} page. Visitors will see the updated content immediately.`}
                confirmText="Publish Now"
                cancelText="Keep as Draft"
                variant="info"
                isLoading={isPublishing}
            />

            {/* Version History Drawer */}
            <VersionHistoryDrawer
                isOpen={showHistoryDrawer}
                onClose={() => setShowHistoryDrawer(false)}
                pageId={page.id}
                localeCode={currentLocale}
                onRestore={(version: { id: string }) => {
                    // In a full implementation, this would restore from version history
                    toast.info('Version history restoration coming soon');
                    setShowHistoryDrawer(false);
                }}
            />
        </div>
    );
}
