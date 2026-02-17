/**
 * Partners Content Fetcher
 * ========================
 *
 * Fetches active partners from DB with locale-specific translations.
 * Used by public partners page.
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

export interface PartnerGalleryImage {
    url: string;
    alt: string;
}

function normalizeGalleryImages(value: unknown): PartnerGalleryImage[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const url = typeof (item as { url?: unknown }).url === 'string'
                ? (item as { url: string }).url.trim()
                : '';
            const alt = typeof (item as { alt?: unknown }).alt === 'string'
                ? (item as { alt: string }).alt.trim()
                : '';
            if (!url) return null;
            return { url, alt };
        })
        .filter((item): item is PartnerGalleryImage => Boolean(item));
}

// Cache tag for partners
export function getPartnersCacheTag(locale: string) {
    return `partners:${locale}`;
}

export function getAllPartnersCacheTag() {
    return 'partners:all';
}

export interface PublicPartner {
    id: string;
    name: string;
    logoUrl: string | null;
    galleryImages: PartnerGalleryImage[];
    coverPhotoUrl: string | null;
    coverPhotoAlt: string | null;
    websiteUrl: string | null;
    category: string;
    location: string | null;
    specialties: string[];
    description: string | null;
    order: number;
}

/**
 * Fetches all active partners with locale-specific descriptions.
 * Fallback: requested locale → default locale (en) → null description
 */
export async function getPartners(locale: string): Promise<PublicPartner[]> {
    const fetchFromDB = async (): Promise<PublicPartner[]> => {
        const partners = await prisma.partner.findMany({
            where: { isActive: true },
            include: {
                translations: true,
            },
            orderBy: [{ order: 'asc' }, { name: 'asc' }],
        });

        return partners.map((partner) => {
            // Find translation for requested locale
            let translation = partner.translations.find(
                (t) => t.localeCode === locale
            );
            // Fallback to default locale
            if (!translation) {
                translation = partner.translations.find(
                    (t) => t.localeCode === 'en'
                );
            }
            // Fallback to first available
            if (!translation && partner.translations.length > 0) {
                translation = partner.translations[0];
            }

            return {
                id: partner.id,
                name: partner.name,
                logoUrl: partner.logoUrl,
                galleryImages: normalizeGalleryImages(partner.galleryImages),
                coverPhotoUrl: partner.coverPhotoUrl,
                coverPhotoAlt: partner.coverPhotoAlt,
                websiteUrl: partner.websiteUrl,
                category: partner.category,
                location: partner.location,
                specialties: partner.specialties,
                description: translation?.description || null,
                order: partner.order,
            };
        });
    };

    // In development, skip cache
    if (process.env.NODE_ENV === 'development') {
        return fetchFromDB();
    }

    const cachedFetch = unstable_cache(fetchFromDB, [`partners-${locale}`], {
        tags: [getPartnersCacheTag(locale), getAllPartnersCacheTag()],
        revalidate: false,
    });

    return cachedFetch();
}
