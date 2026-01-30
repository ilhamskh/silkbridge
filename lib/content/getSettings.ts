/**
 * Site Settings Fetcher
 * =====================
 * 
 * Fetches site-wide settings including localized content.
 * Used for header, footer, contact info, and social links.
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

// Cache tag for site settings
export function getSettingsCacheTag(locale: string) {
    return `settings:${locale}`;
}

export interface PublicSiteSettings {
    siteName: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    defaultLocale: string;
    contactEmail: string | null;
    contactPhone: string | null;
    contactAddress: string | null;
    socialLinks: Record<string, string>;
    // Localized content
    tagline: string | null;
    footerText: string | null;
}

/**
 * Fetches site settings with locale-specific translations.
 * Falls back to default locale if translation doesn't exist.
 */
export async function getSiteSettings(locale: string): Promise<PublicSiteSettings | null> {
    const fetchFromDB = async (): Promise<PublicSiteSettings | null> => {
        const settings = await prisma.siteSettings.findFirst({
            include: {
                translations: true,
            },
        });

        if (!settings) {
            return null;
        }

        // Find translation for requested locale
        let translation = settings.translations.find(t => t.localeCode === locale);

        // Fallback to default locale translation
        if (!translation) {
            translation = settings.translations.find(t => t.localeCode === settings.defaultLocale);
        }

        // Fallback to first available translation
        if (!translation && settings.translations.length > 0) {
            translation = settings.translations[0];
        }

        return {
            siteName: settings.siteName,
            logoUrl: settings.logoUrl,
            faviconUrl: settings.faviconUrl,
            defaultLocale: settings.defaultLocale,
            contactEmail: settings.contactEmail,
            contactPhone: settings.contactPhone,
            contactAddress: settings.contactAddress,
            socialLinks: (settings.socialLinks as Record<string, string>) || {},
            tagline: translation?.tagline || null,
            footerText: translation?.footerText || null,
        };
    };

    // In development, skip cache
    if (process.env.NODE_ENV === 'development') {
        return fetchFromDB();
    }

    // In production, use cache with tags
    const fetchSettings = unstable_cache(
        fetchFromDB,
        [`site-settings-${locale}`],
        {
            tags: [getSettingsCacheTag(locale)],
            revalidate: false,
        }
    );

    return fetchSettings();
}

/**
 * Get all enabled locales from database
 */
export async function getEnabledLocales() {
    const fetchFromDB = async () => {
        return prisma.locale.findMany({
            where: { isEnabled: true },
            orderBy: [{ isDefault: 'desc' }, { code: 'asc' }],
            select: {
                code: true,
                name: true,
                nativeName: true,
                flag: true,
                isDefault: true,
                isRTL: true,
            },
        });
    };

    if (process.env.NODE_ENV === 'development') {
        return fetchFromDB();
    }

    const cachedFetch = unstable_cache(
        fetchFromDB,
        ['enabled-locales'],
        {
            tags: ['locales'],
            revalidate: 3600, // Refresh every hour
        }
    );

    return cachedFetch();
}
