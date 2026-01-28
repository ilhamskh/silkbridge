import { prisma } from '@/lib/db';
import type { ContentBlock } from '@/lib/validations';

/**
 * Fetch page content from database for a given page slug and locale.
 * Falls back to default locale if translation doesn't exist.
 */
export async function getPageContent(slug: string, locale: string) {
    // Try to get translation for the requested locale
    const translation = await prisma.pageTranslation.findFirst({
        where: {
            page: { slug },
            localeCode: locale,
            status: 'PUBLISHED',
        },
        include: {
            page: true,
        },
    });

    if (translation) {
        return {
            title: translation.title,
            metaTitle: translation.seoTitle,
            metaDescription: translation.seoDescription,
            blocks: translation.blocks as ContentBlock[],
            locale: translation.localeCode,
        };
    }

    // Fallback to any published translation (preferably en)
    const fallbackTranslation = await prisma.pageTranslation.findFirst({
        where: {
            page: { slug },
            status: 'PUBLISHED',
        },
        orderBy: {
            localeCode: 'asc', // 'en' comes before most codes alphabetically
        },
        include: {
            page: true,
        },
    });

    if (fallbackTranslation) {
        return {
            title: fallbackTranslation.title,
            metaTitle: fallbackTranslation.seoTitle,
            metaDescription: fallbackTranslation.seoDescription,
            blocks: fallbackTranslation.blocks as ContentBlock[],
            locale: fallbackTranslation.localeCode,
        };
    }

    return null;
}

/**
 * Get all enabled locales
 */
export async function getPublicLocales() {
    return prisma.locale.findMany({
        where: { isEnabled: true },
        orderBy: { code: 'asc' },
    });
}

/**
 * Get site settings with translation for a specific locale
 */
export async function getPublicSiteSettings(locale: string) {
    const settings = await prisma.siteSettings.findFirst({
        include: {
            translations: {
                where: { localeCode: locale },
            },
        },
    });

    if (!settings) {
        return null;
    }

    const translation = settings.translations[0];

    return {
        siteName: settings.siteName,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
        socialLinks: settings.socialLinks as Record<string, string>,
        tagline: translation?.tagline || null,
        footerText: translation?.footerText || null,
    };
}

/**
 * Find a specific block type from content blocks
 */
export function findBlock<T extends ContentBlock['type']>(
    blocks: ContentBlock[],
    type: T
): Extract<ContentBlock, { type: T }> | undefined {
    return blocks.find((b) => b.type === type) as Extract<ContentBlock, { type: T }> | undefined;
}

/**
 * Find all blocks of a specific type
 */
export function findBlocks<T extends ContentBlock['type']>(
    blocks: ContentBlock[],
    type: T
): Extract<ContentBlock, { type: T }>[] {
    return blocks.filter((b) => b.type === type) as Extract<ContentBlock, { type: T }>[];
}
