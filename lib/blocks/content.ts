import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import type { ContentBlock } from '@/lib/blocks/schema';

// ============================================
// Cache Tags
// ============================================

export function getPageCacheTag(slug: string, locale: string) {
    return `page:${slug}:${locale}`;
}

export function getSettingsCacheTag(locale: string) {
    return `settings:${locale}`;
}

export function getAllPagesCacheTag() {
    return 'pages:all';
}

// ============================================
// Page Content Fetching
// ============================================

export interface PageContent {
    id: string;
    slug: string;
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImage: string | null;
    blocks: ContentBlock[];
    status: 'DRAFT' | 'PUBLISHED';
    updatedAt: Date;
}

/**
 * Fetches published page content by slug and locale.
 * Falls back to default locale if translation doesn't exist.
 * Uses unstable_cache with tags for instant revalidation.
 */
export async function getPageContent(
    slug: string,
    locale: string
): Promise<PageContent | null> {
    // Direct DB fetch function
    const fetchFromDB = async () => {
        // First try to get the page
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

        // If no translation or not published, try default locale
        if (!translation || translation.status !== 'PUBLISHED') {
            const defaultLocale = await prisma.locale.findFirst({
                where: { isDefault: true },
            });

            if (defaultLocale && defaultLocale.code !== locale) {
                translation = await prisma.pageTranslation.findUnique({
                    where: {
                        pageId_localeCode: {
                            pageId: page.id,
                            localeCode: defaultLocale.code,
                        },
                    },
                });
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
            revalidate: false, // Only revalidate via tags
        }
    );

    return fetchPage();
}

/**
 * Fetches page content for admin editing (includes drafts).
 * Not cached - always fresh data for editing.
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

    const translation = await prisma.pageTranslation.findUnique({
        where: {
            pageId_localeCode: {
                pageId: page.id,
                localeCode: locale,
            },
        },
    });

    // If no translation exists, try to copy from default locale
    if (!translation) {
        const defaultLocale = await prisma.locale.findFirst({
            where: { isDefault: true },
        });

        if (defaultLocale && defaultLocale.code !== locale) {
            const defaultTranslation = await prisma.pageTranslation.findUnique({
                where: {
                    pageId_localeCode: {
                        pageId: page.id,
                        localeCode: defaultLocale.code,
                    },
                },
            });

            if (defaultTranslation) {
                // Create a draft translation from default
                const newTranslation = await prisma.pageTranslation.create({
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

                return {
                    page: { id: page.id, slug: page.slug },
                    translation: {
                        id: newTranslation.id,
                        title: newTranslation.title,
                        seoTitle: newTranslation.seoTitle,
                        seoDescription: newTranslation.seoDescription,
                        ogImage: newTranslation.ogImage,
                        blocks: (newTranslation.blocks as unknown as ContentBlock[]) || [],
                        status: newTranslation.status as 'DRAFT' | 'PUBLISHED',
                        updatedAt: newTranslation.updatedAt,
                        updatedBy: newTranslation.updatedBy,
                    },
                    allTranslations: [
                        ...page.translations.map(t => ({
                            localeCode: t.localeCode,
                            status: t.status as 'DRAFT' | 'PUBLISHED',
                        })),
                        { localeCode: locale, status: 'DRAFT' as const },
                    ],
                };
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
                status: translation.status as 'DRAFT' | 'PUBLISHED',
                updatedAt: translation.updatedAt,
                updatedBy: translation.updatedBy,
            }
            : null,
        allTranslations: page.translations.map(t => ({
            localeCode: t.localeCode,
            status: t.status as 'DRAFT' | 'PUBLISHED',
        })),
    };
}

// ============================================
// Site Settings Fetching
// ============================================

export interface SiteSettings {
    siteName: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    contactAddress: string | null;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    tagline: string | null;
    footerText: string | null;
}

/**
 * Fetches site settings with locale-specific translations.
 * Uses unstable_cache with tags for instant revalidation.
 */
export async function getSiteSettings(locale: string): Promise<SiteSettings> {
    const fetchSettings = unstable_cache(
        async () => {
            const settings = await prisma.siteSettings.findUnique({
                where: { id: '1' },
                include: {
                    translations: {
                        where: { localeCode: locale },
                    },
                },
            });

            if (!settings) {
                return {
                    siteName: 'Silkbridge International',
                    logoUrl: null,
                    faviconUrl: null,
                    contactEmail: null,
                    contactPhone: null,
                    contactAddress: null,
                    socialLinks: {},
                    tagline: null,
                    footerText: null,
                };
            }

            // Try locale translation, fall back to default
            let translation: typeof settings.translations[0] | null = settings.translations[0] ?? null;
            if (!translation) {
                const defaultLocale = await prisma.locale.findFirst({
                    where: { isDefault: true },
                });
                if (defaultLocale) {
                    const defaultTranslation = await prisma.siteSettingsTranslation.findUnique({
                        where: {
                            settingsId_localeCode: {
                                settingsId: '1',
                                localeCode: defaultLocale.code,
                            },
                        },
                    });
                    translation = defaultTranslation;
                }
            }

            return {
                siteName: settings.siteName,
                logoUrl: settings.logoUrl,
                faviconUrl: settings.faviconUrl,
                contactEmail: settings.contactEmail,
                contactPhone: settings.contactPhone,
                contactAddress: settings.contactAddress,
                socialLinks: (settings.socialLinks as SiteSettings['socialLinks']) || {},
                tagline: translation?.tagline || null,
                footerText: translation?.footerText || null,
            };
        },
        [`site-settings-${locale}`],
        {
            tags: [getSettingsCacheTag(locale)],
            revalidate: false,
        }
    );

    return fetchSettings();
}

/**
 * Fetches all enabled locales.
 */
export async function getEnabledLocales() {
    const fetchLocales = unstable_cache(
        async () => {
            return prisma.locale.findMany({
                where: { isEnabled: true },
                orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
            });
        },
        ['enabled-locales'],
        {
            tags: ['locales'],
            revalidate: 3600, // Revalidate every hour
        }
    );

    return fetchLocales();
}

// ============================================
// Navigation Data
// ============================================

export interface NavigationItem {
    name: string;
    href: string;
}

export interface NavigationData {
    main: NavigationItem[];
    footer: Array<{
        title: string;
        links: NavigationItem[];
    }>;
    social: Array<{
        name: string;
        href: string;
        icon: string;
    }>;
}

/**
 * Get navigation data - this can be customized based on your needs.
 * For now, returns a static structure that can be enhanced later.
 */
export async function getNavigationData(locale: string): Promise<NavigationData> {
    // Navigation labels by locale
    const navLabels: Record<string, Record<string, string>> = {
        en: {
            home: 'Home',
            about: 'About',
            services: 'Services',
            partners: 'Partners',
            contact: 'Contact',
            marketInsights: 'Market Insights',
            servicesTitle: 'Services',
            companyTitle: 'Company',
            resourcesTitle: 'Resources',
            marketEntry: 'Market Entry',
            regulatory: 'Regulatory Support',
            healthTourism: 'Health Tourism',
            wellness: 'Wellness Programs',
            industryReports: 'Industry Reports',
            partnerPortal: 'Partner Portal',
            privacyPolicy: 'Privacy Policy',
            termsOfService: 'Terms of Service',
        },
        az: {
            home: 'Ana Səhifə',
            about: 'Haqqımızda',
            services: 'Xidmətlər',
            partners: 'Tərəfdaşlar',
            contact: 'Əlaqə',
            marketInsights: 'Bazar Məlumatları',
            servicesTitle: 'Xidmətlər',
            companyTitle: 'Şirkət',
            resourcesTitle: 'Resurslar',
            marketEntry: 'Bazara Giriş',
            regulatory: 'Tənzimləyici Dəstək',
            healthTourism: 'Sağlamlıq Turizmi',
            wellness: 'Wellness Proqramları',
            industryReports: 'Sənaye Hesabatları',
            partnerPortal: 'Tərəfdaş Portalı',
            privacyPolicy: 'Məxfilik Siyasəti',
            termsOfService: 'Xidmət Şərtləri',
        },
        ru: {
            home: 'Главная',
            about: 'О нас',
            services: 'Услуги',
            partners: 'Партнёры',
            contact: 'Контакты',
            marketInsights: 'Аналитика рынка',
            servicesTitle: 'Услуги',
            companyTitle: 'Компания',
            resourcesTitle: 'Ресурсы',
            marketEntry: 'Выход на рынок',
            regulatory: 'Регуляторная поддержка',
            healthTourism: 'Медицинский туризм',
            wellness: 'Велнес программы',
            industryReports: 'Отраслевые отчёты',
            partnerPortal: 'Портал партнёров',
            privacyPolicy: 'Политика конфиденциальности',
            termsOfService: 'Условия использования',
        },
    };

    const labels = navLabels[locale] || navLabels.en;

    return {
        main: [
            { name: labels.home, href: `/${locale}` },
            { name: labels.about, href: `/${locale}/about` },
            { name: labels.services, href: `/${locale}/services` },
            { name: labels.marketInsights, href: `/${locale}/market-insights` },
            { name: labels.partners, href: `/${locale}/partners` },
            { name: labels.contact, href: `/${locale}/contact` },
        ],
        footer: [
            {
                title: labels.servicesTitle,
                links: [
                    { name: labels.marketEntry, href: `/${locale}/services#market-entry` },
                    { name: labels.regulatory, href: `/${locale}/services#regulatory` },
                    { name: labels.healthTourism, href: `/${locale}/services#health-tourism` },
                    { name: labels.wellness, href: `/${locale}/services#wellness` },
                ],
            },
            {
                title: labels.companyTitle,
                links: [
                    { name: labels.about, href: `/${locale}/about` },
                    { name: labels.partners, href: `/${locale}/partners` },
                    { name: labels.marketInsights, href: `/${locale}/market-insights` },
                    { name: labels.contact, href: `/${locale}/contact` },
                ],
            },
            {
                title: labels.resourcesTitle,
                links: [
                    { name: labels.industryReports, href: `/${locale}/market-insights` },
                    { name: labels.partnerPortal, href: `/${locale}/partners` },
                    { name: labels.privacyPolicy, href: `/${locale}/privacy` },
                    { name: labels.termsOfService, href: `/${locale}/terms` },
                ],
            },
        ],
        social: [
            { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
            { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
        ],
    };
}
