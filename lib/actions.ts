'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';
import {
    pageTranslationSchema,
    localeSchema,
    userCreateSchema,
    userUpdateSchema,
    blocksArraySchema,
} from '@/lib/validations';
import bcrypt from 'bcryptjs';
import {
    getPageCacheTag,
    getSettingsCacheTag,
} from '@/lib/content';
import { getPageConfig } from '@/lib/admin/page-config';

type PageStatus = 'DRAFT' | 'PUBLISHED';

// ============================================
// Page Actions
// ============================================

export async function getPages() {
    const pages = await prisma.page.findMany({
        include: {
            translations: {
                include: {
                    locale: true,
                },
            },
        },
        orderBy: { slug: 'asc' },
    });

    return pages;
}

export async function getPageBySlug(slug: string) {
    const page = await prisma.page.findUnique({
        where: { slug },
        include: {
            translations: {
                include: {
                    locale: true,
                },
            },
        },
    });

    return page;
}

export async function getPageTranslation(slug: string, localeCode: string) {
    const page = await prisma.page.findUnique({
        where: { slug },
    });

    if (!page) return null;

    const translation = await prisma.pageTranslation.findUnique({
        where: {
            pageId_localeCode: {
                pageId: page.id,
                localeCode,
            },
        },
        include: {
            page: true,
            locale: true,
        },
    });

    return translation;
}

export async function savePageTranslation(data: {
    pageId: string;
    localeCode: string;
    title: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImage?: string | null;
    blocks: unknown;
    status: 'DRAFT' | 'PUBLISHED';
}) {
    const session = await requireAuth();

    // Validate blocks
    const blocksResult = blocksArraySchema.safeParse(data.blocks);
    if (!blocksResult.success) {
        console.error('[savePageTranslation] Blocks validation FAILED:', blocksResult.error.issues);
        return {
            success: false,
            error: 'Invalid blocks format: ' + blocksResult.error.issues.map((e) => e.message).join(', '),
        };
    }

    // Merge _isHidden flags from raw data into validated blocks.
    // Zod strips unknown fields, but _isHidden is used by the admin
    // to toggle section visibility and must be preserved in storage.
    const rawBlocks = data.blocks as Record<string, unknown>[];
    const validatedBlocks = blocksResult.data.map((block, i) => {
        const rawBlock = rawBlocks[i];
        if (rawBlock?._isHidden === true) {
            return { ...block, _isHidden: true };
        }
        return block;
    });

    // Validate full input
    const validationResult = pageTranslationSchema.safeParse({
        title: data.title,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImage: data.ogImage,
        blocks: blocksResult.data,
        status: data.status,
    });

    if (!validationResult.success) {
        console.error('[savePageTranslation] Full validation FAILED:', validationResult.error.issues);
        return {
            success: false,
            error: validationResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        };
    }
    const page = await prisma.page.findUnique({ where: { id: data.pageId } });
    if (!page) {
        return { success: false, error: 'Page not found' };
    }

    const translation = await prisma.pageTranslation.upsert({
        where: {
            pageId_localeCode: {
                pageId: data.pageId,
                localeCode: data.localeCode,
            },
        },
        update: {
            title: data.title,
            seoTitle: data.seoTitle || null,
            seoDescription: data.seoDescription || null,
            ogImage: data.ogImage || null,
            blocks: validatedBlocks as object,
            status: data.status as PageStatus,
            updatedBy: session.user.id,
        },
        create: {
            pageId: data.pageId,
            localeCode: data.localeCode,
            title: data.title,
            seoTitle: data.seoTitle || null,
            seoDescription: data.seoDescription || null,
            ogImage: data.ogImage || null,
            blocks: validatedBlocks as object,
            status: data.status as PageStatus,
            updatedBy: session.user.id,
        },
    });

    // Invalidate cache tags for instant updates on the public site
    revalidateTag(getPageCacheTag(page.slug, data.localeCode));
    revalidateTag('pages:all');

    // Revalidate admin pages
    revalidatePath('/admin/pages');
    revalidatePath(`/admin/pages/${page.slug}`);

    // Revalidate public pages using the correct route from page config
    const pageConfig = getPageConfig(page.slug);
    const publicRoute = pageConfig?.route ?? `/${page.slug}`;

    // Revalidate for all locales (a save in 'en' may affect 'az' fallback)
    const locales = await prisma.locale.findMany({ where: { isEnabled: true }, select: { code: true } });
    for (const loc of locales) {
        const localizedPath = publicRoute === '/' ? `/${loc.code}` : `/${loc.code}${publicRoute}`;
        revalidatePath(localizedPath);
    }

    return { success: true, translation };
}

// Publish a page and trigger revalidation
export async function publishPage(pageId: string, localeCode: string, slug: string) {
    const session = await requireAuth();

    const translation = await prisma.pageTranslation.findUnique({
        where: {
            pageId_localeCode: {
                pageId,
                localeCode,
            },
        },
    });

    if (!translation) {
        return { success: false, error: 'Translation not found' };
    }

    // Update status to published
    await prisma.pageTranslation.update({
        where: {
            pageId_localeCode: {
                pageId,
                localeCode,
            },
        },
        data: {
            status: 'PUBLISHED',
            updatedBy: session.user.id,
        },
    });

    // Invalidate cache tags for instant updates on the public site
    revalidateTag(getPageCacheTag(slug, localeCode));
    revalidateTag('pages:all');

    // Revalidate all relevant paths
    revalidatePath('/admin/pages');
    revalidatePath(`/admin/pages/${slug}`);
    revalidatePath(`/${localeCode}`);
    revalidatePath(`/${localeCode}/${slug === 'home' ? '' : slug}`);

    return { success: true };
}

// ============================================
// Locale Actions
// ============================================

export async function getLocales() {
    return prisma.locale.findMany({
        orderBy: [{ isDefault: 'desc' }, { code: 'asc' }],
    });
}

export async function getEnabledLocales() {
    return prisma.locale.findMany({
        where: { isEnabled: true },
        orderBy: [{ isDefault: 'desc' }, { code: 'asc' }],
    });
}

export async function createLocale(data: { code: string; name: string; nativeName: string; flag?: string; isRTL?: boolean; isEnabled?: boolean }) {
    await requireAdmin();

    const validationResult = localeSchema.safeParse(data);
    if (!validationResult.success) {
        return {
            success: false,
            error: validationResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        };
    }

    // Check if locale already exists
    const existing = await prisma.locale.findUnique({ where: { code: data.code } });
    if (existing) {
        return { success: false, error: 'Locale with this code already exists' };
    }

    // Create the locale
    const locale = await prisma.locale.create({
        data: {
            code: data.code,
            name: data.name,
            nativeName: data.nativeName,
            flag: data.flag || null,
            isRTL: data.isRTL ?? false,
            isEnabled: data.isEnabled ?? true,
            isDefault: false,
        },
    });

    // Get default locale for content duplication
    const defaultLocale = await prisma.locale.findFirst({ where: { isDefault: true } });
    if (defaultLocale) {
        // Duplicate all page translations from default locale
        const defaultTranslations = await prisma.pageTranslation.findMany({
            where: { localeCode: defaultLocale.code },
        });

        for (const translation of defaultTranslations) {
            await prisma.pageTranslation.create({
                data: {
                    pageId: translation.pageId,
                    localeCode: locale.code,
                    title: translation.title,
                    seoTitle: translation.seoTitle,
                    seoDescription: translation.seoDescription,
                    ogImage: translation.ogImage,
                    blocks: translation.blocks as object,
                    status: 'DRAFT', // New translations start as draft
                },
            });
        }

        // Duplicate site settings translations
        const defaultSettingsTranslation = await prisma.siteSettingsTranslation.findFirst({
            where: { localeCode: defaultLocale.code },
        });

        if (defaultSettingsTranslation) {
            await prisma.siteSettingsTranslation.create({
                data: {
                    settingsId: defaultSettingsTranslation.settingsId,
                    localeCode: locale.code,
                    tagline: defaultSettingsTranslation.tagline,
                    footerText: defaultSettingsTranslation.footerText,
                },
            });
        }
    }

    revalidatePath('/admin/locales');
    return { success: true, locale };
}

export async function updateLocale(
    code: string,
    data: { name?: string; nativeName?: string; flag?: string; isRTL?: boolean; isEnabled?: boolean; isDefault?: boolean }
) {
    await requireAdmin();

    // If setting as default, unset other defaults
    if (data.isDefault) {
        await prisma.locale.updateMany({
            where: { isDefault: true },
            data: { isDefault: false },
        });
    }

    const locale = await prisma.locale.update({
        where: { code },
        data: {
            name: data.name,
            nativeName: data.nativeName,
            flag: data.flag,
            isRTL: data.isRTL,
            isEnabled: data.isEnabled,
            isDefault: data.isDefault,
        },
    });

    revalidatePath('/admin/locales');
    return { success: true, locale };
}

export async function deleteLocale(code: string) {
    await requireAdmin();

    const locale = await prisma.locale.findUnique({ where: { code } });
    if (!locale) {
        return { success: false, error: 'Locale not found' };
    }

    if (locale.isDefault) {
        return { success: false, error: 'Cannot delete the default locale' };
    }

    await prisma.locale.delete({ where: { code } });

    revalidatePath('/admin/locales');
    return { success: true };
}

// ============================================
// Site Settings Actions
// ============================================

export async function getSiteSettings() {
    let settings = await prisma.siteSettings.findUnique({
        where: { id: '1' },
        include: {
            translations: {
                include: {
                    locale: true,
                },
            },
        },
    });

    // Create settings if they don't exist
    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: { id: '1' },
            include: {
                translations: {
                    include: {
                        locale: true,
                    },
                },
            },
        });
    }

    return settings;
}

export async function updateSiteSettings(data: {
    siteName?: string;
    logoUrl?: string | null;
    faviconUrl?: string | null;
    defaultLocale?: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    contactAddress?: string | null;
    socialLinks?: Record<string, string>;
}) {
    await requireAuth();

    const settings = await prisma.siteSettings.upsert({
        where: { id: '1' },
        update: {
            siteName: data.siteName,
            logoUrl: data.logoUrl,
            faviconUrl: data.faviconUrl,
            defaultLocale: data.defaultLocale,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            contactAddress: data.contactAddress,
            socialLinks: data.socialLinks || {},
        },
        create: {
            id: '1',
            siteName: data.siteName,
            logoUrl: data.logoUrl,
            faviconUrl: data.faviconUrl,
            defaultLocale: data.defaultLocale || 'en',
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            contactAddress: data.contactAddress,
            socialLinks: data.socialLinks || {},
        },
    });

    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { success: true, settings };
}

export async function updateSiteSettingsTranslation(
    settingsId: string,
    localeCode: string,
    data: {
        tagline?: string;
        footerText?: string;
    }
) {
    await requireAuth();

    const translation = await prisma.siteSettingsTranslation.upsert({
        where: {
            settingsId_localeCode: {
                settingsId,
                localeCode,
            },
        },
        update: {
            tagline: data.tagline || null,
            footerText: data.footerText || null,
        },
        create: {
            settingsId,
            localeCode,
            tagline: data.tagline || null,
            footerText: data.footerText || null,
        },
    });

    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { success: true, translation };
}

// Comprehensive save settings function
export async function saveSiteSettings(data: {
    siteName: string;
    logoUrl?: string | null;
    faviconUrl?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    address?: string | null;
    socialLinks?: Record<string, string | undefined>;
    translations?: Array<{
        localeCode: string;
        tagline: string | null;
        footerText: string | null;
    }>;
}): Promise<{ success: true; settings: unknown } | { success: false; error: string }> {
    try {
        await requireAuth();

        // Update main settings
        const settings = await prisma.siteSettings.upsert({
            where: { id: '1' },
            update: {
                siteName: data.siteName,
                logoUrl: data.logoUrl || null,
                faviconUrl: data.faviconUrl || null,
                contactEmail: data.contactEmail || null,
                contactPhone: data.contactPhone || null,
                contactAddress: data.address || null,
                socialLinks: data.socialLinks || {},
            },
            create: {
                id: '1',
                siteName: data.siteName,
                logoUrl: data.logoUrl || null,
                faviconUrl: data.faviconUrl || null,
                defaultLocale: 'en',
                contactEmail: data.contactEmail || null,
                contactPhone: data.contactPhone || null,
                contactAddress: data.address || null,
                socialLinks: data.socialLinks || {},
            },
        });

        // Update translations
        if (data.translations) {
            for (const translation of data.translations) {
                await prisma.siteSettingsTranslation.upsert({
                    where: {
                        settingsId_localeCode: {
                            settingsId: settings.id,
                            localeCode: translation.localeCode,
                        },
                    },
                    update: {
                        tagline: translation.tagline,
                        footerText: translation.footerText,
                    },
                    create: {
                        settingsId: settings.id,
                        localeCode: translation.localeCode,
                        tagline: translation.tagline,
                        footerText: translation.footerText,
                    },
                });

                // Invalidate cache tag for this locale's settings
                revalidateTag(getSettingsCacheTag(translation.localeCode));
            }
        }

        // Invalidate all locales settings dynamically
        const allLocales = await prisma.locale.findMany({ where: { isEnabled: true }, select: { code: true } });
        for (const loc of allLocales) {
            revalidateTag(getSettingsCacheTag(loc.code));
        }

        revalidatePath('/admin/settings');
        revalidatePath('/');
        return { success: true, settings };
    } catch (error) {
        console.error('Failed to save site settings:', error);
        return { success: false, error: 'Failed to save settings' };
    }
}

// ============================================
// User Actions
// ============================================

export async function getUsers() {
    await requireAdmin();
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createUser(data: {
    email: string;
    password: string;
    name?: string;
    role?: 'ADMIN' | 'EDITOR';
}) {
    await requireAdmin();

    const validationResult = userCreateSchema.safeParse(data);
    if (!validationResult.success) {
        return {
            success: false,
            error: validationResult.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        };
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
        return { success: false, error: 'User with this email already exists' };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            name: data.name || null,
            role: data.role || 'EDITOR',
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
        },
    });

    revalidatePath('/admin/users');
    return { success: true, user };
}

export async function updateUser(
    id: string,
    data: {
        email?: string;
        name?: string;
        role?: 'ADMIN' | 'EDITOR';
        password?: string;
        isActive?: boolean;
    }
) {
    const session = await requireAdmin();

    const validationResult = userUpdateSchema.safeParse(data);
    if (!validationResult.success) {
        return {
            success: false,
            error: validationResult.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        };
    }

    // Prevent demoting yourself
    if (id === session.user.id && data.role && data.role !== 'ADMIN') {
        return { success: false, error: 'You cannot change your own role' };
    }

    // Prevent deactivating yourself
    if (id === session.user.id && data.isActive === false) {
        return { success: false, error: 'You cannot deactivate your own account' };
    }

    const updateData: {
        email?: string;
        name?: string | null;
        role?: 'ADMIN' | 'EDITOR';
        passwordHash?: string;
        isActive?: boolean;
    } = {
        email: data.email,
        name: data.name,
        role: data.role,
        isActive: data.isActive,
    };

    if (data.password) {
        updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });

    revalidatePath('/admin/users');
    return { success: true, user };
}

export async function deleteUser(id: string) {
    const session = await requireAdmin();

    // Prevent deleting yourself
    if (id === session.user.id) {
        return { success: false, error: 'You cannot delete your own account' };
    }

    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');
    return { success: true };
}
