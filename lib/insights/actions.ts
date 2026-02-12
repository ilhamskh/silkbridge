'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import {
    getInsightsListCacheTag,
    getInsightSlugCacheTag,
    getInsightsCategoriesCacheTag,
} from '@/lib/content';
import { estimateReadTime } from '@/lib/insights/markdown';
import { locales } from '@/i18n/config';

// ============================================
// Types
// ============================================

interface InsightPostData {
    slug: string;
    categoryId: string | null;
    featured: boolean;
}

interface InsightTranslationData {
    title: string;
    excerpt: string;
    bodyMarkdown: string;
    coverImageUrl: string | null;
    coverImageAlt: string | null;
    tags: string[];
    seoTitle: string | null;
    seoDescription: string | null;
    ogImageUrl: string | null;
}

// ============================================
// Helpers
// ============================================

function revalidateInsightsCaches(slug?: string) {
    // Revalidate all locale listings
    for (const locale of locales) {
        revalidateTag(getInsightsListCacheTag(locale));
        if (slug) {
            revalidateTag(getInsightSlugCacheTag(slug, locale));
        }
    }
    revalidateTag(getInsightsCategoriesCacheTag());
    revalidateTag('insights:all');
    // Revalidate public insight pages
    for (const locale of locales) {
        revalidatePath(`/${locale}/insights`);
        if (slug) {
            revalidatePath(`/${locale}/insights/${slug}`);
        }
    }
}

// ============================================
// CRUD Actions
// ============================================

/**
 * Create a new insight post.
 * Creates the post + an initial DRAFT translation for the specified locale.
 */
export async function createInsightPost(
    locale: string,
    data: InsightPostData & InsightTranslationData
) {
    await requireAuth();

    // Validate slug uniqueness
    const existing = await prisma.insightPost.findUnique({
        where: { slug: data.slug },
    });
    if (existing) {
        return { error: 'A post with this slug already exists.' };
    }

    // If setting as featured, unset other featured posts
    if (data.featured) {
        await prisma.insightPost.updateMany({
            where: { featured: true },
            data: { featured: false },
        });
    }

    const post = await prisma.insightPost.create({
        data: {
            slug: data.slug,
            categoryId: data.categoryId || undefined,
            featured: data.featured,
            translations: {
                create: {
                    locale,
                    status: 'DRAFT',
                    title: data.title,
                    excerpt: data.excerpt,
                    bodyMarkdown: data.bodyMarkdown,
                    coverImageUrl: data.coverImageUrl,
                    coverImageAlt: data.coverImageAlt,
                    tags: data.tags,
                    seoTitle: data.seoTitle,
                    seoDescription: data.seoDescription,
                    ogImageUrl: data.ogImageUrl,
                    readTimeMinutes: estimateReadTime(data.bodyMarkdown),
                },
            },
        },
    });

    revalidatePath('/admin/insights');

    return { success: true, postId: post.id };
}

/**
 * Update an insight post's metadata + locale-specific translation.
 */
export async function updateInsightPost(
    postId: string,
    locale: string,
    data: Partial<InsightPostData> & InsightTranslationData
) {
    await requireAuth();

    const post = await prisma.insightPost.findUnique({
        where: { id: postId },
        select: { slug: true, featured: true },
    });
    if (!post) return { error: 'Post not found.' };

    // Update post-level fields
    const postUpdate: any = {};
    if (data.slug !== undefined && data.slug !== post.slug) {
        // Validate new slug uniqueness
        const slugExists = await prisma.insightPost.findUnique({
            where: { slug: data.slug },
        });
        if (slugExists && slugExists.id !== postId) {
            return { error: 'A post with this slug already exists.' };
        }
        postUpdate.slug = data.slug;
    }
    if (data.categoryId !== undefined) {
        postUpdate.categoryId = data.categoryId || null;
    }
    if (data.featured !== undefined) {
        postUpdate.featured = data.featured;
        if (data.featured) {
            // Unset other featured posts
            await prisma.insightPost.updateMany({
                where: { featured: true, id: { not: postId } },
                data: { featured: false },
            });
        }
    }

    if (Object.keys(postUpdate).length > 0) {
        await prisma.insightPost.update({
            where: { id: postId },
            data: postUpdate,
        });
    }

    // Upsert translation
    const translationData = {
        title: data.title,
        excerpt: data.excerpt,
        bodyMarkdown: data.bodyMarkdown,
        coverImageUrl: data.coverImageUrl,
        coverImageAlt: data.coverImageAlt,
        tags: data.tags,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImageUrl: data.ogImageUrl,
        readTimeMinutes: estimateReadTime(data.bodyMarkdown),
    };

    const updated = await prisma.insightPostTranslation.upsert({
        where: {
            postId_locale: {
                postId,
                locale,
            },
        },
        update: translationData,
        create: {
            postId,
            locale,
            status: 'DRAFT',
            ...translationData,
        },
    });

    const newSlug = data.slug || post.slug;
    revalidateInsightsCaches(newSlug);
    if (data.slug && data.slug !== post.slug) {
        revalidateInsightsCaches(post.slug);
    }
    revalidatePath('/admin/insights');

    return { success: true as const, status: updated.status, updatedAt: updated.updatedAt };
}

/**
 * Publish a post translation.
 */
export async function publishInsightPost(postId: string, locale: string) {
    await requireAuth();

    const translation = await prisma.insightPostTranslation.findUnique({
        where: { postId_locale: { postId, locale } },
        include: { post: { select: { slug: true } } },
    });

    if (!translation) return { error: 'Translation not found.' };

    const updated = await prisma.insightPostTranslation.update({
        where: { id: translation.id },
        data: {
            status: 'PUBLISHED',
            publishedAt: translation.publishedAt || new Date(),
            readTimeMinutes: estimateReadTime(translation.bodyMarkdown),
        },
    });

    revalidateInsightsCaches(translation.post.slug);
    revalidatePath('/admin/insights');

    return { success: true as const, status: updated.status as 'PUBLISHED', publishedAt: updated.publishedAt };
}

/**
 * Unpublish a post translation (revert to DRAFT).
 */
export async function unpublishInsightPost(postId: string, locale: string) {
    await requireAuth();

    const translation = await prisma.insightPostTranslation.findUnique({
        where: { postId_locale: { postId, locale } },
        include: { post: { select: { slug: true } } },
    });

    if (!translation) return { error: 'Translation not found.' };

    await prisma.insightPostTranslation.update({
        where: { id: translation.id },
        data: { status: 'DRAFT' },
    });

    revalidateInsightsCaches(translation.post.slug);
    revalidatePath('/admin/insights');

    return { success: true as const, status: 'DRAFT' as const };
}

/**
 * Soft-delete a post.
 */
export async function deleteInsightPost(postId: string) {
    await requireAuth();

    const post = await prisma.insightPost.findUnique({
        where: { id: postId },
        select: { slug: true },
    });

    if (!post) return { error: 'Post not found.' };

    await prisma.insightPost.update({
        where: { id: postId },
        data: { isDeleted: true },
    });

    revalidateInsightsCaches(post.slug);
    revalidatePath('/admin/insights');

    return { success: true };
}

// ============================================
// Admin Data Fetching (uncached — always fresh)
// ============================================

/**
 * Get all insight posts for admin list view.
 */
export async function getInsightPostsForAdmin() {
    const posts = await prisma.insightPost.findMany({
        where: { isDeleted: false },
        include: {
            category: {
                include: {
                    translations: true,
                },
            },
            translations: {
                select: {
                    locale: true,
                    status: true,
                    title: true,
                    publishedAt: true,
                    updatedAt: true,
                },
            },
        },
        orderBy: { updatedAt: 'desc' },
    });

    return posts;
}

/**
 * Get a single insight post for admin editing.
 * No fallback — returns exact locale translation or null.
 * If translation doesn't exist, auto-creates DRAFT from default locale.
 */
export async function getInsightPostForAdmin(
    postId: string,
    locale: string
) {
    const post = await prisma.insightPost.findUnique({
        where: { id: postId, isDeleted: false },
        include: {
            category: true,
            translations: {
                select: {
                    locale: true,
                    status: true,
                },
            },
        },
    });

    if (!post) return null;

    // Get exact locale translation
    let translation = await prisma.insightPostTranslation.findUnique({
        where: { postId_locale: { postId, locale } },
    });

    // If missing, auto-create DRAFT from default locale (en)
    if (!translation) {
        const defaultTranslation = await prisma.insightPostTranslation.findUnique({
            where: { postId_locale: { postId, locale: 'en' } },
        });

        if (defaultTranslation) {
            translation = await prisma.insightPostTranslation.create({
                data: {
                    postId,
                    locale,
                    status: 'DRAFT',
                    title: defaultTranslation.title,
                    excerpt: defaultTranslation.excerpt,
                    bodyMarkdown: defaultTranslation.bodyMarkdown,
                    coverImageUrl: defaultTranslation.coverImageUrl,
                    coverImageAlt: defaultTranslation.coverImageAlt,
                    tags: defaultTranslation.tags,
                    seoTitle: defaultTranslation.seoTitle,
                    seoDescription: defaultTranslation.seoDescription,
                    ogImageUrl: defaultTranslation.ogImageUrl,
                    readTimeMinutes: defaultTranslation.readTimeMinutes,
                },
            });
        } else {
            // Create empty translation
            translation = await prisma.insightPostTranslation.create({
                data: {
                    postId,
                    locale,
                    status: 'DRAFT',
                    title: '',
                    excerpt: '',
                    bodyMarkdown: '',
                },
            });
        }
    }

    return {
        post: {
            id: post.id,
            slug: post.slug,
            categoryId: post.categoryId,
            featured: post.featured,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        },
        translation: {
            id: translation.id,
            locale: translation.locale,
            status: translation.status,
            publishedAt: translation.publishedAt,
            title: translation.title,
            excerpt: translation.excerpt,
            bodyMarkdown: translation.bodyMarkdown,
            coverImageUrl: translation.coverImageUrl,
            coverImageAlt: translation.coverImageAlt,
            tags: translation.tags,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            ogImageUrl: translation.ogImageUrl,
            readTimeMinutes: translation.readTimeMinutes,
        },
        allTranslations: post.translations.map((t) => ({
            locale: t.locale,
            status: t.status,
        })),
    };
}

/**
 * Get all categories for admin selects.
 */
export async function getInsightCategoriesForAdmin() {
    return prisma.insightCategory.findMany({
        include: { translations: true },
        orderBy: { order: 'asc' },
    });
}
