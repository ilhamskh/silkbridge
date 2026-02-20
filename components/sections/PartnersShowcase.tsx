import { Handshake } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { PublicPartner } from '@/lib/content';
import { PartnerGalleryCard } from './PartnerGalleryCard';
import { getTranslations } from 'next-intl/server';

// ============================================
// Category Configuration
// ============================================

const CATEGORY_KEYS = new Set([
    'government',
    'hospital',
    'pharma',
    'investor',
    'association',
    'hotel',
    'airline',
    'transport',
    'tourism',
    'technology',
    'other',
]);

// ============================================
// Partner Showcase Props
// ============================================

interface PartnersShowcaseProps {
    partners: PublicPartner[];
    eyebrow?: string;
    headline: string;
    description?: string;
}

function normalizeCategory(category?: string | null): string {
    if (!category) return 'other';
    const lowered = category.toLowerCase();
    return CATEGORY_KEYS.has(lowered) ? lowered : 'other';
}

// ============================================
// Main Component
// ============================================

export async function PartnersShowcase({
    partners,
    eyebrow,
    headline,
    description,
}: PartnersShowcaseProps) {
    const t = await getTranslations('partnersPage');

    // Empty state
    if (partners.length === 0) {
        return (
            <EmptyPartnersState
                headline={headline}
                description={t('ui.noPartnersAvailable')}
                ctaLabel={t('ui.contactCta')}
            />
        );
    }

    return (
        <section className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ============================================ */}
                {/* Section Header — matches About / Services pattern */}
                {/* ============================================ */}
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                    {eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">
                        {headline}
                    </h2>
                    {description && (
                        <p className="mt-4 text-muted text-lg leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {partners.map((partner) => {
                        const normalizedCategory = normalizeCategory(partner.category);
                        const categoryLabel = t(`categories.${normalizedCategory}.label`);

                        return (
                            <PartnerGalleryCard
                                key={partner.id}
                                partner={{
                                    name: partner.name,
                                    logoUrl: partner.logoUrl,
                                    websiteUrl: partner.websiteUrl,
                                    description: partner.description,
                                    location: partner.location,
                                    specialties: partner.specialties ?? [],
                                    categoryLabel,
                                    galleryImages: partner.galleryImages,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================
// Empty Partners State
// ============================================

function EmptyPartnersState({
    headline,
    description,
    ctaLabel,
}: {
    headline: string;
    description: string;
    ctaLabel: string;
}) {
    return (
        <section className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
                        <Handshake className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink mb-4">
                        {headline}
                    </h2>
                    <p className="text-lg text-muted max-w-md mx-auto mb-8 leading-relaxed">
                        {description}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 shadow-button hover:shadow-button-hover transition-all"
                    >
                        {ctaLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
}
