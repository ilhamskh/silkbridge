import Image from 'next/image';
import { ExternalLink, Handshake } from 'lucide-react';
import { Landmark, Building2, Hotel, Plane, Bus, Compass, Cpu, LayoutGrid } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { PublicPartner } from '@/lib/content';
import { PartnerAccordion } from './PartnerAccordion';

// ============================================
// Category Configuration
// ============================================

const CATEGORY_CONFIG: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
}> = {
    government: {
        icon: Landmark,
        label: 'Government',
        description: 'Official government agencies and regulatory bodies',
    },
    hospital: {
        icon: Building2,
        label: 'Healthcare',
        description: 'Hospitals, clinics, and medical facilities',
    },
    hotel: {
        icon: Hotel,
        label: 'Hotels',
        description: 'Accommodation and hospitality partners',
    },
    airline: {
        icon: Plane,
        label: 'Airlines',
        description: 'Air travel and flight service providers',
    },
    transport: {
        icon: Bus,
        label: 'Transport',
        description: 'Ground transportation and logistics',
    },
    tourism: {
        icon: Compass,
        label: 'Tourism',
        description: 'Tourism boards and travel agencies',
    },
    technology: {
        icon: Cpu,
        label: 'Technology',
        description: 'Technology and digital service providers',
    },
    other: {
        icon: LayoutGrid,
        label: 'Other',
        description: 'Specialized industry partners',
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
    locale: string;
}

// ============================================
// Group partners by category
// ============================================

function groupByCategory(partners: PublicPartner[]) {
    const groups: Record<string, PublicPartner[]> = {};

    partners.forEach(partner => {
        const cat = partner.category || 'other';
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

export function PartnersShowcase({
    partners,
    eyebrow,
    headline,
    description,
}: PartnersShowcaseProps) {
    // Empty state
    if (partners.length === 0) {
        return <EmptyPartnersState headline={headline} />;
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
                {/* Desktop: Stacked Category Segments */}
                {/* ============================================ */}
                <div className="hidden lg:block space-y-12">
                    {grouped.map(({ category, partners: categoryPartners }) => {
                        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
                        const CategoryIcon = config.icon;

                        return (
                            <div key={category}>
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
                                    <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center">
                                        <CategoryIcon className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <h3 className="font-heading text-xl text-ink">
                                        {config.label}
                                    </h3>
                                    <span className="text-sm text-muted">
                                        {categoryPartners.length} {categoryPartners.length === 1 ? 'partner' : 'partners'}
                                    </span>
                                </div>

                                {/* Partners Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {categoryPartners.map(partner => (
                                        <PartnerTrustCard key={partner.id} partner={partner} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ============================================ */}
                {/* Mobile/Tablet: Accordion */}
                {/* ============================================ */}
                <div className="lg:hidden">
                    <PartnerAccordion groupedPartners={grouped} />
                </div>
            </div>
        </section>
    );
}

// ============================================
// Partner Trust Card (Desktop)
// ============================================

function PartnerTrustCard({ partner }: { partner: PublicPartner }) {
    const category = partner.category || 'other';
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;

    const CardWrapper = partner.websiteUrl ? 'a' : 'div';
    const linkProps = partner.websiteUrl
        ? { href: partner.websiteUrl, target: '_blank' as const, rel: 'noopener noreferrer' }
        : {};

    return (
        <CardWrapper
            {...linkProps}
            className="group block h-full p-6 bg-white rounded-2xl border border-border-light shadow-card hover:shadow-card-hover transition-all duration-200"
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-center mb-5">
                {partner.logoUrl ? (
                    <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        width={120}
                        height={60}
                        className="object-contain max-w-full max-h-[3.5rem] group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center">
                        <span className="text-primary-600 font-heading font-bold text-xl">
                            {partner.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <h4 className="font-heading text-lg text-ink line-clamp-1 group-hover:text-primary-600 transition-colors">
                {partner.name}
            </h4>
            {partner.description && (
                <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">
                    {partner.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                <span className="text-sm text-muted">
                    {config.label}
                </span>
                {partner.websiteUrl && (
                    <span className="flex items-center gap-1.5 text-sm text-muted group-hover:text-primary-600 transition-colors">
                        Visit
                        <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                )}
            </div>
        </CardWrapper>
    );
}

// ============================================
// Empty Partners State
// ============================================

function EmptyPartnersState({ headline }: { headline: string }) {
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
                        We&apos;re building our partner network. Interested in collaborating?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 shadow-button hover:shadow-button-hover transition-all"
                    >
                        Get in Touch
                    </Link>
                </div>
            </div>
        </section>
    );
}
