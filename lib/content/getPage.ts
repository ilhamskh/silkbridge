/**
 * Page Content Fetcher
 * ====================
 * 
 * Fetches page content from DB with proper locale fallback.
 * Used by all public pages to render content blocks.
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import type { ContentBlock } from '@/lib/blocks/schema';

// Cache tags for instant revalidation
export function getPageCacheTag(slug: string, locale: string) {
    return `page:${slug}:${locale}`;
}

export function getAllPagesCacheTag() {
    return 'pages:all';
}

export interface PageContent {
    id: string;
    slug: string;
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImage: string | null;
    blocks: ContentBlock[];
    status: 'DRAFT' | 'PUBLISHED';
    locale: string;
    updatedAt: Date;
}

/**
 * Fetches published page content by slug and locale.
 * Fallback order:
 * 1. Requested locale (published)
 * 2. Default locale (published)
 * 3. null (caller should show placeholder, NOT 404)
 */
export async function getPageContent(
    slug: string,
    locale: string
): Promise<PageContent | null> {
    const fetchFromDB = async (): Promise<PageContent | null> => {
        // First get the page
        const page = await prisma.page.findUnique({
            where: { slug },
        });

        if (!page) {
            return null;
        }

        // Try to get translation for requested locale
        let translation = await prisma.pageTranslation.findUnique({
            where: {
                pageId_localeCode: {
                    pageId: page.id,
                    localeCode: locale,
                },
            },
        });

        let usedLocale = locale;

        // If no translation or not published, try default locale
        if (!translation || translation.status !== 'PUBLISHED') {
            const defaultLocale = await prisma.locale.findFirst({
                where: { isDefault: true },
            });

            if (defaultLocale && defaultLocale.code !== locale) {
                const fallbackTranslation = await prisma.pageTranslation.findUnique({
                    where: {
                        pageId_localeCode: {
                            pageId: page.id,
                            localeCode: defaultLocale.code,
                        },
                    },
                });

                if (fallbackTranslation && fallbackTranslation.status === 'PUBLISHED') {
                    translation = fallbackTranslation;
                    usedLocale = defaultLocale.code;
                }
            }
        }

        // Still no published translation
        if (!translation || translation.status !== 'PUBLISHED') {
            return null;
        }

        return {
            id: page.id,
            slug: page.slug,
            title: translation.title,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            ogImage: translation.ogImage,
            blocks: (translation.blocks as unknown as ContentBlock[]) || [],
            status: translation.status,
            locale: usedLocale,
            updatedAt: translation.updatedAt,
        };
    };

    // In development, skip cache for easier debugging
    if (process.env.NODE_ENV === 'development') {
        return fetchFromDB();
    }

    // In production, use cache with tags
    const fetchPage = unstable_cache(
        fetchFromDB,
        [`page-content-${slug}-${locale}`],
        {
            tags: [getPageCacheTag(slug, locale), getAllPagesCacheTag()],
            revalidate: false,
        }
    );

    return fetchPage();
}

/**
 * Fetches page content for admin editing (includes drafts).
 * Not cached - always fresh data for editing.
 * If translation doesn't exist for locale, creates it from default locale.
 */
export async function getPageContentForAdmin(
    slug: string,
    locale: string
): Promise<{
    page: { id: string; slug: string } | null;
    translation: {
        id: string;
        title: string;
        seoTitle: string | null;
        seoDescription: string | null;
        ogImage: string | null;
        blocks: ContentBlock[];
        status: 'DRAFT' | 'PUBLISHED';
        updatedAt: Date;
        updatedBy: string | null;
    } | null;
    allTranslations: Array<{ localeCode: string; status: 'DRAFT' | 'PUBLISHED' }>;
}> {
    const page = await prisma.page.findUnique({
        where: { slug },
        include: {
            translations: {
                select: {
                    localeCode: true,
                    status: true,
                },
            },
        },
    });

    if (!page) {
        return { page: null, translation: null, allTranslations: [] };
    }

    let translation = await prisma.pageTranslation.findUnique({
        where: {
            pageId_localeCode: {
                pageId: page.id,
                localeCode: locale,
            },
        },
    });

    // If translation doesn't exist, create it from default locale
    if (!translation) {
        const defaultLocale = await prisma.locale.findFirst({
            where: { isDefault: true },
        });

        if (defaultLocale) {
            const defaultTranslation = await prisma.pageTranslation.findUnique({
                where: {
                    pageId_localeCode: {
                        pageId: page.id,
                        localeCode: defaultLocale.code,
                    },
                },
            });

            if (defaultTranslation) {
                // Auto-create translation as draft, copying from default
                translation = await prisma.pageTranslation.create({
                    data: {
                        pageId: page.id,
                        localeCode: locale,
                        title: defaultTranslation.title,
                        seoTitle: defaultTranslation.seoTitle,
                        seoDescription: defaultTranslation.seoDescription,
                        ogImage: defaultTranslation.ogImage,
                        blocks: defaultTranslation.blocks as object,
                        status: 'DRAFT',
                    },
                });
            }
        }
    }

    return {
        page: { id: page.id, slug: page.slug },
        translation: translation
            ? {
                id: translation.id,
                title: translation.title,
                seoTitle: translation.seoTitle,
                seoDescription: translation.seoDescription,
                ogImage: translation.ogImage,
                blocks: (translation.blocks as unknown as ContentBlock[]) || [],
                status: translation.status,
                updatedAt: translation.updatedAt,
                updatedBy: translation.updatedBy,
            }
            : null,
        allTranslations: page.translations,
    };
}
