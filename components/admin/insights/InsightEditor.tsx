'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import {
    createInsightPost,
    updateInsightPost,
    publishInsightPost,
    unpublishInsightPost,
} from '@/lib/insights/actions';
import { AdminIcon } from '../ui/AdminIcon';

// Dynamic import for rich text editor (admin-only, no SSR)
const RichTextEditor = dynamic(
    () => import('./RichTextEditor').then((mod) => ({ default: mod.RichTextEditor })),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[500px] bg-gray-50 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading editor...</p>
            </div>
        ),
    }
);

// ============================================
// Types
// ============================================

interface Category {
    id: string;
    key: string;
    translations: Array<{ localeCode: string; name: string }>;
}

interface PostData {
    post: {
        id: string;
        slug: string;
        categoryId: string | null;
        featured: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    translation: {
        id: string;
        locale: string;
        status: string;
        publishedAt: Date | null;
        title: string;
        excerpt: string;
        bodyMarkdown: string;
        coverImageUrl: string | null;
        coverImageAlt: string | null;
        tags: string[];
        seoTitle: string | null;
        seoDescription: string | null;
        ogImageUrl: string | null;
        readTimeMinutes: number | null;
    };
    allTranslations: Array<{ locale: string; status: string }>;
}

interface EditorBaseProps {
    categories: Category[];
}

interface CreateProps extends EditorBaseProps {
    mode: 'create';
}

interface EditProps extends EditorBaseProps {
    mode: 'edit';
    postData: PostData;
    currentLocale: string;
}

// ============================================
// Helpers
// ============================================

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Upload an image to Vercel Blob (admin-only endpoint)
 */
async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/uploads/blob', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || 'Upload failed' };
        }

        return { url: data.url };
    } catch (error) {
        console.error('Upload error:', error);
        return { error: 'Upload failed. Please try again.' };
    }
}

const LOCALES = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

// ============================================
// Create mode
// ============================================

export function InsightEditorNew({ categories }: CreateProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugManual, setSlugManual] = useState(false);
    const [excerpt, setExcerpt] = useState('');
    const [bodyMarkdown, setBodyMarkdown] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [featured, setFeatured] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [coverImageAlt, setCoverImageAlt] = useState('');
    const [tags, setTags] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugManual && title) {
            setSlug(slugify(title));
        }
    }, [title, slugManual]);

    // Handle cover image upload
    const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        toast.loading('Uploading cover image...', { id: 'cover-upload' });

        const result = await uploadImage(file);

        if (result.error) {
            toast.error(result.error, { id: 'cover-upload' });
        } else if (result.url) {
            setCoverImageUrl(result.url);
            toast.success('Cover image uploaded!', { id: 'cover-upload' });
        }

        setIsUploading(false);
        e.target.value = '';
    }, []);

    const handleSubmit = useCallback(async () => {
        setError(null);
        if (!title.trim()) { setError('Title is required.'); return; }
        if (!slug.trim()) { setError('Slug is required.'); return; }

        startTransition(async () => {
            const result = await createInsightPost('en', {
                slug: slug.trim(),
                categoryId: categoryId || null,
                featured,
                title: title.trim(),
                excerpt: excerpt.trim(),
                bodyMarkdown,
                coverImageUrl: coverImageUrl || null,
                coverImageAlt: coverImageAlt || null,
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                seoTitle: seoTitle || null,
                seoDescription: seoDescription || null,
                ogImageUrl: null,
            });

            if (result.error) {
                setError(result.error);
            } else if (result.postId) {
                router.push(`/admin/insights/${result.postId}?locale=en`);
            }
        });
    }, [title, slug, categoryId, featured, excerpt, bodyMarkdown, coverImageUrl, coverImageAlt, tags, seoTitle, seoDescription, router]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/insights" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <AdminIcon name="chevronLeft" className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">New Insight Post</h1>
                        <p className="text-sm text-gray-500">Creating in English — save to add other languages</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isPending ? 'Saving...' : 'Save Draft'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Editor layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* Left: Content */}
                <div className="space-y-5">
                    <EditorField label="Title" required>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Post title"
                            className="editor-input text-lg font-medium"
                        />
                    </EditorField>

                    <EditorField label="Slug">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">/insights/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                                placeholder="post-slug"
                                className="editor-input flex-1 font-mono text-sm"
                            />
                        </div>
                    </EditorField>

                    <EditorField label="Excerpt">
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Brief description for cards and SEO..."
                            rows={3}
                            className="editor-input resize-y"
                        />
                    </EditorField>

                    <EditorField label="Content">
                        <RichTextEditor
                            key="new-post"
                            initialContent={bodyMarkdown}
                            onChange={(markdown) => setBodyMarkdown(markdown)}
                            onImageUpload={uploadImage}
                            placeholder="Start writing your article..."
                        />
                    </EditorField>
                </div>

                {/* Right: Meta */}
                <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">Post Settings</h3>

                        <EditorField label="Category">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="editor-input"
                            >
                                <option value="">No category</option>
                                {categories.map((cat) => {
                                    const name = cat.translations.find((t) => t.localeCode === 'en')?.name || cat.key;
                                    return <option key={cat.id} value={cat.id}>{name}</option>;
                                })}
                            </select>
                        </EditorField>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="featured" className="text-sm text-gray-700">Featured post</label>
                        </div>

                        <EditorField label="Tags (comma-separated)">
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. pharma, market-entry, health"
                                className="editor-input"
                            />
                        </EditorField>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">Cover Image</h3>

                        <div className="space-y-3">
                            <input
                                id="cover-upload-new"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('cover-upload-new')?.click()}
                                disabled={isUploading}
                                className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {isUploading ? 'Uploading...' : coverImageUrl ? 'Replace Image' : 'Upload Cover Image'}
                            </button>
                        </div>

                        <EditorField label="Image URL" subtext="Or paste a URL directly">
                            <input
                                type="text"
                                value={coverImageUrl}
                                onChange={(e) => setCoverImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="editor-input"
                            />
                        </EditorField>

                        <EditorField label="Alt Text" required>
                            <input
                                type="text"
                                value={coverImageAlt}
                                onChange={(e) => setCoverImageAlt(e.target.value)}
                                placeholder="Describe the image for accessibility"
                                className="editor-input"
                            />
                        </EditorField>

                        {coverImageUrl && (
                            <div className="space-y-2">
                                <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                                    <img src={coverImageUrl} alt={coverImageAlt || 'Preview'} className="w-full h-32 object-cover" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCoverImageUrl('');
                                        setCoverImageAlt('');
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">SEO</h3>

                        <EditorField label="SEO Title">
                            <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                placeholder="Override title for search engines"
                                className="editor-input"
                            />
                        </EditorField>

                        <EditorField label="SEO Description">
                            <textarea
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                placeholder="Override excerpt for search engines"
                                rows={2}
                                className="editor-input resize-y"
                            />
                        </EditorField>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Edit mode (locale-aware)
// ============================================

export function InsightEditorEdit({ postData, categories, currentLocale }: EditProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const { post, translation, allTranslations } = postData;

    // Form state — initialized from translation
    const [title, setTitle] = useState(translation.title);
    const [slug, setSlug] = useState(post.slug);
    const [excerpt, setExcerpt] = useState(translation.excerpt);
    const [bodyMarkdown, setBodyMarkdown] = useState(translation.bodyMarkdown);
    const [categoryId, setCategoryId] = useState(post.categoryId || '');
    const [featured, setFeatured] = useState(post.featured);
    const [coverImageUrl, setCoverImageUrl] = useState(translation.coverImageUrl || '');
    const [coverImageAlt, setCoverImageAlt] = useState(translation.coverImageAlt || '');
    const [tags, setTags] = useState(translation.tags.join(', '));
    const [seoTitle, setSeoTitle] = useState(translation.seoTitle || '');
    const [seoDescription, setSeoDescription] = useState(translation.seoDescription || '');

    // Reactive publish status — updated immediately from server response
    const [currentStatus, setCurrentStatus] = useState<'PUBLISHED' | 'DRAFT'>(
        translation.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'
    );
    const isPublished = currentStatus === 'PUBLISHED';

    // Warn before leaving if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Handle cover image upload
    const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        toast.loading('Uploading cover image...', { id: 'cover-upload' });

        const result = await uploadImage(file);

        if (result.error) {
            toast.error(result.error, { id: 'cover-upload' });
        } else if (result.url) {
            setCoverImageUrl(result.url);
            toast.success('Cover image uploaded!', { id: 'cover-upload' });
        }

        setIsUploading(false);
        e.target.value = '';
    }, []);

    // Locale switching — warn if dirty
    function handleLocaleSwitch(locale: string) {
        if (locale === currentLocale) return;
        if (isDirty && !confirm('You have unsaved changes. Switch locale anyway?')) {
            return;
        }
        router.replace(`/admin/insights/${post.id}?locale=${locale}`);
    }

    const handleSave = useCallback(async () => {
        setError(null);
        setSuccess(null);
        if (!title.trim()) { setError('Title is required.'); return; }

        startTransition(async () => {
            const result = await updateInsightPost(post.id, currentLocale, {
                slug: slug.trim(),
                categoryId: categoryId || null,
                featured,
                title: title.trim(),
                excerpt: excerpt.trim(),
                bodyMarkdown,
                coverImageUrl: coverImageUrl || null,
                coverImageAlt: coverImageAlt || null,
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                seoTitle: seoTitle || null,
                seoDescription: seoDescription || null,
                ogImageUrl: null,
            });

            if (result.error) {
                setError(result.error);
            } else {
                if ('status' in result) {
                    setCurrentStatus(result.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
                }
                setIsDirty(false); // Clear dirty state on successful save
                setSuccess('Saved successfully.');
                router.refresh();
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    }, [post.id, currentLocale, title, slug, categoryId, featured, excerpt, bodyMarkdown, coverImageUrl, coverImageAlt, tags, seoTitle, seoDescription, router]);

    function handlePublish() {
        setError(null);
        setSuccess(null);
        if (!title.trim()) { setError('Title is required to publish.'); return; }

        startTransition(async () => {
            // Save first, then publish
            const saveResult = await updateInsightPost(post.id, currentLocale, {
                slug: slug.trim(),
                categoryId: categoryId || null,
                featured,
                title: title.trim(),
                excerpt: excerpt.trim(),
                bodyMarkdown,
                coverImageUrl: coverImageUrl || null,
                coverImageAlt: coverImageAlt || null,
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                seoTitle: seoTitle || null,
                seoDescription: seoDescription || null,
                ogImageUrl: null,
            });

            if (saveResult.error) { setError(saveResult.error); return; }

            const result = await publishInsightPost(post.id, currentLocale);
            if (result.error) {
                setError(result.error);
            } else {
                setCurrentStatus('PUBLISHED');
                setIsDirty(false); // Clear dirty state on successful publish
                setSuccess('Published successfully!');
                router.refresh();
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    }

    function handleUnpublish() {
        startTransition(async () => {
            const result = await unpublishInsightPost(post.id, currentLocale);
            if (result.error) {
                setError(result.error);
            } else {
                setCurrentStatus('DRAFT');
                setIsDirty(false); // Clear dirty state
                setSuccess('Unpublished.');
                router.refresh();
                setTimeout(() => setSuccess(null), 3000);
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/insights" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <AdminIcon name="chevronLeft" className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Edit Post</h1>
                        <p className="text-xs text-gray-400 mt-0.5">/{slug}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Status badge */}
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                        {isPublished ? 'Published' : 'Draft'}
                    </span>

                    {/* Locale switcher */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        {LOCALES.map(({ code, flag }) => {
                            const localeT = allTranslations.find((t) => t.locale === code);
                            return (
                                <button
                                    key={code}
                                    onClick={() => handleLocaleSwitch(code)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${currentLocale === code
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <span>{flag}</span>
                                    <span className="uppercase">{code}</span>
                                    {localeT && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${localeT.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-400'
                                            }`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* View on site */}
                    {isPublished && (
                        <Link
                            href={`/${currentLocale}/insights/${slug}`}
                            target="_blank"
                            className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            View on site ↗
                        </Link>
                    )}

                    {/* Actions */}
                    {isPublished ? (
                        <>
                            <button
                                onClick={handleUnpublish}
                                disabled={isPending}
                                className="px-4 py-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 disabled:opacity-50 transition-colors"
                            >
                                Unpublish
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {isPending ? 'Saving...' : 'Save & Update'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                {isPending ? 'Saving...' : 'Save Draft'}
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isPending}
                                className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {isPending ? 'Publishing...' : 'Publish'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Feedback */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
                    {success}
                </div>
            )}

            {/* Editor layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* Left: Content */}
                <div className="space-y-5">
                    <EditorField label="Title" required>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Post title"
                            className="editor-input text-lg font-medium"
                        />
                    </EditorField>

                    {/* Slug — only for en locale to avoid confusion */}
                    {currentLocale === 'en' && (
                        <EditorField label="Slug">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">/insights/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value);
                                        setIsDirty(true);
                                    }}
                                    className="editor-input flex-1 font-mono text-sm"
                                />
                            </div>
                        </EditorField>
                    )}

                    <EditorField label="Excerpt">
                        <textarea
                            value={excerpt}
                            onChange={(e) => {
                                setExcerpt(e.target.value);
                                setIsDirty(true);
                            }}
                            placeholder="Brief description..."
                            rows={3}
                            className="editor-input resize-y"
                        />
                    </EditorField>

                    <EditorField label="Content">
                        <RichTextEditor
                            key={`${post.id}:${currentLocale}`}
                            initialContent={bodyMarkdown}
                            onChange={(markdown) => {
                                setBodyMarkdown(markdown);
                                setIsDirty(true);
                            }}
                            onImageUpload={uploadImage}
                            placeholder="Start writing your article..."
                        />
                    </EditorField>
                </div>

                {/* Right: Meta */}
                <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">Post Settings</h3>

                        <EditorField label="Category">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="editor-input"
                            >
                                <option value="">No category</option>
                                {categories.map((cat) => {
                                    const name = cat.translations.find((t) => t.localeCode === currentLocale)?.name
                                        || cat.translations.find((t) => t.localeCode === 'en')?.name
                                        || cat.key;
                                    return <option key={cat.id} value={cat.id}>{name}</option>;
                                })}
                            </select>
                        </EditorField>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured-edit"
                                checked={featured}
                                onChange={(e) => {
                                    setFeatured(e.target.checked);
                                    setIsDirty(true);
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="featured-edit" className="text-sm text-gray-700">Featured post</label>
                        </div>

                        <EditorField label="Tags (comma-separated)">
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. pharma, market-entry, health"
                                className="editor-input"
                            />
                        </EditorField>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">Cover Image</h3>

                        <div className="space-y-3">
                            <input
                                id="cover-upload-edit"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('cover-upload-edit')?.click()}
                                disabled={isUploading}
                                className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {isUploading ? 'Uploading...' : coverImageUrl ? 'Replace Image' : 'Upload Cover Image'}
                            </button>
                        </div>

                        <EditorField label="Image URL" subtext="Or paste a URL directly">
                            <input
                                type="text"
                                value={coverImageUrl}
                                onChange={(e) => setCoverImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="editor-input"
                            />
                        </EditorField>

                        <EditorField label="Alt Text" required>
                            <input
                                type="text"
                                value={coverImageAlt}
                                onChange={(e) => setCoverImageAlt(e.target.value)}
                                placeholder="Describe the image"
                                className="editor-input"
                            />
                        </EditorField>

                        {coverImageUrl && (
                            <div className="space-y-2">
                                <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                                    <img src={coverImageUrl} alt={coverImageAlt || 'Preview'} className="w-full h-32 object-cover" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCoverImageUrl('');
                                        setCoverImageAlt('');
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">SEO</h3>

                        <EditorField label="SEO Title">
                            <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                placeholder="Override title for search engines"
                                className="editor-input"
                            />
                        </EditorField>

                        <EditorField label="SEO Description">
                            <textarea
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                placeholder="Override excerpt for search engines"
                                rows={2}
                                className="editor-input resize-y"
                            />
                        </EditorField>
                    </div>

                    {/* Info panel */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                            <span>Post ID</span>
                            <span className="font-mono">{post.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Created</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        {translation.publishedAt && (
                            <div className="flex justify-between">
                                <span>Published</span>
                                <span>{new Date(translation.publishedAt).toLocaleDateString()}</span>
                            </div>
                        )}
                        {translation.readTimeMinutes && (
                            <div className="flex justify-between">
                                <span>Read time</span>
                                <span>{translation.readTimeMinutes} min</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Shared sub-components
// ============================================

function EditorField({
    label,
    required,
    subtext,
    children,
}: {
    label: string;
    required?: boolean;
    subtext?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-600">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
            {children}
        </div>
    );
}

