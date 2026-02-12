/**
 * Insights (Blog) Content Fetcher
 * ================================
 * 
 * Provides public-facing insight/blog content from DB.
 * Follows the same pattern as getPage.ts / getPartners.ts:
 *   - Requested locale PUBLISHED → default locale PUBLISHED → null
 *   - unstable_cache with tag-based revalidation
 *   - No draft content exposed publicly
 *
 * Cache tags:
 *   - insights:list:{locale}  — listing page per locale
 *   - insight:{slug}:{locale} — single post per locale
 *   - insights:categories      — categories list
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

// ============================================
// Cache Tag Helpers
// ============================================

export function getInsightsListCacheTag(locale: string) {
    return `insights:list:${locale}`;
}

export function getInsightSlugCacheTag(slug: string, locale: string) {
    return `insight:${slug}:${locale}`;
}

export function getInsightsCategoriesCacheTag() {
    return 'insights:categories';
}

// ============================================
// Types
// ============================================

export interface InsightPostCard {
    id: string;
    slug: string;
    featured: boolean;
    categoryKey: string | null;
    categoryName: string | null;
    title: string;
    excerpt: string;
    coverImageUrl: string | null;
    coverImageAlt: string | null;
    tags: string[];
    readTimeMinutes: number | null;
    publishedAt: Date | null;
    locale: string;
}

export interface InsightPostFull extends InsightPostCard {
    bodyMarkdown: string;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface InsightCategory {
    id: string;
    key: string;
    name: string;
    order: number;
}

export interface InsightsListResult {
    posts: InsightPostCard[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// Data Fetching — Public (cached)
// ============================================

const DEFAULT_PAGE_SIZE = 9;

/**
 * Get paginated list of published insight posts for a locale.
 * Falls back to default locale if no published translation in requested locale.
 */
export async function getInsightsList(
    locale: string,
    options: {
        category?: string;
        search?: string;
        page?: number;
        pageSize?: number;
        excludeSlug?: string;
    } = {}
): Promise<InsightsListResult> {
    const { category, search, page = 1, pageSize = DEFAULT_PAGE_SIZE, excludeSlug } = options;

    const fetchFn = async (): Promise<InsightsListResult> => {
        // Get default locale for fallbacks
        const defaultLocaleRow = await prisma.locale.findFirst({ where: { isDefault: true } });
        const defaultLocale = defaultLocaleRow?.code || 'en';

        // Build where clause for posts
        const postWhere: any = {
            isDeleted: false,
            translations: {
                some: {
                    status: 'PUBLISHED',
                    locale: { in: locale === defaultLocale ? [locale] : [locale, defaultLocale] },
                    // Add search filter at DB level
                    ...(search && {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { excerpt: { contains: search, mode: 'insensitive' } },
                            { tags: { has: search } }, // exact match for tag
                        ],
                    }),
                },
            },
        };

        if (category) {
            postWhere.category = { key: category };
        }

        if (excludeSlug) {
            postWhere.slug = { not: excludeSlug };
        }

        // Count total for pagination
        const total = await prisma.insightPost.count({ where: postWhere });

        // Fetch posts with translations
        const posts = await prisma.insightPost.findMany({
            where: postWhere,
            include: {
                category: {
                    include: {
                        translations: {
                            where: { localeCode: { in: [locale, defaultLocale] } },
                        },
                    },
                },
                translations: {
                    where: {
                        status: 'PUBLISHED',
                        locale: { in: locale === defaultLocale ? [locale] : [locale, defaultLocale] },
                    },
                },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        // Map to cards, preferring requested locale
        const cards: InsightPostCard[] = posts
            .map((post) => {
                // Prefer requested locale, fallback to default
                const translation =
                    post.translations.find((t) => t.locale === locale) ||
                    post.translations.find((t) => t.locale === defaultLocale);

                if (!translation) return null;

                // Category name: prefer requested locale
                const catTranslation =
                    post.category?.translations.find((t) => t.localeCode === locale) ||
                    post.category?.translations.find((t) => t.localeCode === defaultLocale);

                return {
                    id: post.id,
                    slug: post.slug,
                    featured: post.featured,
                    categoryKey: post.category?.key || null,
                    categoryName: catTranslation?.name || null,
                    title: translation.title,
                    excerpt: translation.excerpt,
                    coverImageUrl: translation.coverImageUrl,
                    coverImageAlt: translation.coverImageAlt,
                    tags: translation.tags,
                    readTimeMinutes: translation.readTimeMinutes,
                    publishedAt: translation.publishedAt,
                    locale: translation.locale,
                };
            })
            .filter(Boolean) as InsightPostCard[];

        return {
            posts: cards,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    };

    // Include search term in cache key to prevent stale results
    const searchKey = search ? `-s${search.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '';
    const cacheKey = `insights-list-${locale}-${category || 'all'}${searchKey}-p${page}-${pageSize}`;
    const tags = [getInsightsListCacheTag(locale), 'insights:all'];

    const cached = unstable_cache(fetchFn, [cacheKey], {
        tags,
        revalidate: 60,
    });

    return cached();
}

/**
 * Get a single published insight post by slug.
 * Falls back to default locale if not published in requested locale.
 */
export async function getInsightBySlug(
    locale: string,
    slug: string
): Promise<InsightPostFull | null> {
    const fetchFn = async (): Promise<InsightPostFull | null> => {
        const defaultLocaleRow = await prisma.locale.findFirst({ where: { isDefault: true } });
        const defaultLocale = defaultLocaleRow?.code || 'en';

        const post = await prisma.insightPost.findUnique({
            where: { slug, isDeleted: false },
            include: {
                category: {
                    include: {
                        translations: {
                            where: { localeCode: { in: [locale, defaultLocale] } },
                        },
                    },
                },
                translations: {
                    where: {
                        status: 'PUBLISHED',
                        locale: { in: locale === defaultLocale ? [locale] : [locale, defaultLocale] },
                    },
                },
            },
        });

        if (!post || post.translations.length === 0) return null;

        const translation =
            post.translations.find((t) => t.locale === locale) ||
            post.translations.find((t) => t.locale === defaultLocale);

        if (!translation) return null;

        const catTranslation =
            post.category?.translations.find((t) => t.localeCode === locale) ||
            post.category?.translations.find((t) => t.localeCode === defaultLocale);

        return {
            id: post.id,
            slug: post.slug,
            featured: post.featured,
            categoryKey: post.category?.key || null,
            categoryName: catTranslation?.name || null,
            title: translation.title,
            excerpt: translation.excerpt,
            coverImageUrl: translation.coverImageUrl,
            coverImageAlt: translation.coverImageAlt,
            tags: translation.tags,
            readTimeMinutes: translation.readTimeMinutes,
            publishedAt: translation.publishedAt,
            locale: translation.locale,
            bodyMarkdown: translation.bodyMarkdown,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            ogImageUrl: translation.ogImageUrl,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    };

    const cached = unstable_cache(fetchFn, [`insight-${slug}-${locale}`], {
        tags: [getInsightSlugCacheTag(slug, locale), getInsightsListCacheTag(locale)],
        revalidate: 60,
    });

    return cached();
}

/**
 * Get all insight categories with localized names (cached).
 */
export async function getInsightCategories(locale: string): Promise<InsightCategory[]> {
    const fetchFn = async (): Promise<InsightCategory[]> => {
        const defaultLocaleRow = await prisma.locale.findFirst({ where: { isDefault: true } });
        const defaultLocale = defaultLocaleRow?.code || 'en';

        const categories = await prisma.insightCategory.findMany({
            include: {
                translations: {
                    where: { localeCode: { in: [locale, defaultLocale] } },
                },
            },
            orderBy: { order: 'asc' },
        });

        return categories.map((cat) => {
            const translation =
                cat.translations.find((t) => t.localeCode === locale) ||
                cat.translations.find((t) => t.localeCode === defaultLocale);

            return {
                id: cat.id,
                key: cat.key,
                name: translation?.name || cat.key,
                order: cat.order,
            };
        });
    };

    const cached = unstable_cache(fetchFn, [`insight-categories-${locale}`], {
        tags: [getInsightsCategoriesCacheTag()],
        revalidate: 300,
    });

    return cached();
}

/**
 * Get related posts (same category, excluding current post).
 */
export async function getRelatedInsights(
    locale: string,
    currentSlug: string,
    categoryKey: string | null,
    limit: number = 3
): Promise<InsightPostCard[]> {
    if (!categoryKey) {
        // If no category, get latest posts excluding current
        const result = await getInsightsList(locale, {
            excludeSlug: currentSlug,
            pageSize: limit,
        });
        return result.posts;
    }

    const result = await getInsightsList(locale, {
        category: categoryKey,
        excludeSlug: currentSlug,
        pageSize: limit,
    });

    // If not enough related posts in same category, fill with latest
    if (result.posts.length < limit) {
        const more = await getInsightsList(locale, {
            excludeSlug: currentSlug,
            pageSize: limit - result.posts.length,
        });
        const slugs = new Set(result.posts.map((p) => p.slug));
        const additional = more.posts.filter((p) => !slugs.has(p.slug));
        return [...result.posts, ...additional].slice(0, limit);
    }

    return result.posts;
}

/**
 * Get latest published insights for homepage sections (no pagination).
 * Used by dynamic insightsList blocks.
 */
export async function getLatestInsights(
    locale: string,
    limit: number = 3
): Promise<InsightPostCard[]> {
    const fetchFn = async (): Promise<InsightPostCard[]> => {
        const defaultLocaleRow = await prisma.locale.findFirst({ where: { isDefault: true } });
        const defaultLocale = defaultLocaleRow?.code || 'en';

        const posts = await prisma.insightPost.findMany({
            where: {
                isDeleted: false,
                translations: {
                    some: {
                        status: 'PUBLISHED',
                        locale: { in: locale === defaultLocale ? [locale] : [locale, defaultLocale] },
                    },
                },
            },
            include: {
                category: {
                    include: {
                        translations: {
                            where: { localeCode: { in: [locale, defaultLocale] } },
                        },
                    },
                },
                translations: {
                    where: {
                        status: 'PUBLISHED',
                        locale: { in: locale === defaultLocale ? [locale] : [locale, defaultLocale] },
                    },
                },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
            take: limit,
        });

        const cards: InsightPostCard[] = posts
            .map((post) => {
                const translation =
                    post.translations.find((t) => t.locale === locale) ||
                    post.translations.find((t) => t.locale === defaultLocale);

                if (!translation) return null;

                const catTranslation =
                    post.category?.translations.find((t) => t.localeCode === locale) ||
                    post.category?.translations.find((t) => t.localeCode === defaultLocale);

                return {
                    id: post.id,
                    slug: post.slug,
                    featured: post.featured,
                    categoryKey: post.category?.key || null,
                    categoryName: catTranslation?.name || null,
                    title: translation.title,
                    excerpt: translation.excerpt,
                    coverImageUrl: translation.coverImageUrl,
                    coverImageAlt: translation.coverImageAlt,
                    tags: translation.tags,
                    readTimeMinutes: translation.readTimeMinutes,
                    publishedAt: translation.publishedAt,
                    locale: translation.locale,
                };
            })
            .filter(Boolean) as InsightPostCard[];

        return cards;
    };

    const cacheKey = `insights-latest-${locale}-${limit}`;
    const tags = [getInsightsListCacheTag(locale), 'insights:all'];

    const cached = unstable_cache(fetchFn, [cacheKey], {
        tags,
        revalidate: 300, // 5 minutes for homepage section
    });

    return cached();
}

/**
 * Get all published insight slugs for sitemap generation.
 */
export async function getAllPublishedInsightSlugs(): Promise<
    Array<{ slug: string; locale: string; updatedAt: Date }>
> {
    const translations = await prisma.insightPostTranslation.findMany({
        where: {
            status: 'PUBLISHED',
            post: { isDeleted: false },
        },
        select: {
            locale: true,
            updatedAt: true,
            post: { select: { slug: true } },
        },
    });

    return translations.map((t) => ({
        slug: t.post.slug,
        locale: t.locale,
        updatedAt: t.updatedAt,
    }));
}
