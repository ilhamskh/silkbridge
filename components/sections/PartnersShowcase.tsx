import { Handshake } from 'lucide-react';
import { Landmark, Building2, Hotel, Plane, Bus, Compass, Cpu, LayoutGrid } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { PublicPartner } from '@/lib/content';
import { PartnerGalleryCard } from './PartnerGalleryCard';
import { getTranslations } from 'next-intl/server';

// ============================================
// Category Configuration
// ============================================

const CATEGORY_CONFIG: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    key: string;
}> = {
    government: {
        icon: Landmark,
        key: 'government',
    },
    hospital: {
        icon: Building2,
        key: 'hospital',
    },
    pharma: {
        icon: Building2,
        key: 'pharma',
    },
    investor: {
        icon: LayoutGrid,
        key: 'investor',
    },
    association: {
        icon: LayoutGrid,
        key: 'association',
    },
    hotel: {
        icon: Hotel,
        key: 'hotel',
    },
    airline: {
        icon: Plane,
        key: 'airline',
    },
    transport: {
        icon: Bus,
        key: 'transport',
    },
    tourism: {
        icon: Compass,
        key: 'tourism',
    },
    technology: {
        icon: Cpu,
        key: 'technology',
    },
    other: {
        icon: LayoutGrid,
        key: 'other',
    },
};

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
    return CATEGORY_CONFIG[lowered] ? lowered : 'other';
}

// ============================================
// Group partners by category
// ============================================

function groupByCategory(partners: PublicPartner[]) {
    const groups: Record<string, PublicPartner[]> = {};

    partners.forEach(partner => {
        const cat = normalizeCategory(partner.category);
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(partner);
    });

    // Sort categories by count (larger groups first), with 'other' last
    return Object.entries(groups)
        .sort(([a, aPartners], [b, bPartners]) => {
            if (a === 'other') return 1;
            if (b === 'other') return -1;
            return bPartners.length - aPartners.length;
        })
        .map(([category, partners]) => ({ category, partners }));
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
                description={t('ui.emptyDescription')}
                ctaLabel={t('ui.contactCta')}
            />
        );
    }

    const grouped = groupByCategory(partners);

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

                {/* ============================================ */}
                {/* Category Spotlight Sections */}
                {/* ============================================ */}
                <div className="space-y-12 lg:space-y-16">
                    {grouped.map(({ category, partners: categoryPartners }) => {
                        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
                        const CategoryIcon = config.icon;
                        const categoryLabel = t(`categories.${config.key}.label`);
                        const localizedDescription = t(`categories.${config.key}.description`);

                        return (
                            <div key={category} className="space-y-6">
                                {/* Category Header */}
                                <div className="flex items-start justify-between gap-4 pb-4 border-b border-border-light">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center mt-0.5">
                                            <CategoryIcon className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-xl sm:text-2xl text-ink">
                                                {categoryLabel}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted max-w-2xl">
                                                {localizedDescription}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted whitespace-nowrap mt-1">
                                        {categoryPartners.length} {categoryPartners.length === 1 ? t('ui.partner') : t('ui.partners')}
                                    </span>
                                </div>

                                {/* Partners Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {categoryPartners.map(partner => (
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
                                    ))}
                                </div>
                            </div>
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
