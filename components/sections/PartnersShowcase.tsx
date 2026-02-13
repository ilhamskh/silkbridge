import Image from 'next/image';
import { ArrowRight, ExternalLink, Users2, LayoutGrid, Handshake } from 'lucide-react';
import { Landmark, Building2, Hotel, Plane, Bus, Compass, Cpu } from 'lucide-react';
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
// Stats computation
// ============================================

function computeStats(partners: PublicPartner[]) {
    const categories = new Set(partners.map(p => p.category || 'other'));
    return {
        partnerCount: partners.length,
        categoryCount: categories.size,
    };
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
    const stats = computeStats(partners);

    return (
        <section className="py-16 lg:py-24 bg-white">
            {/* Top border accent */}
            <div className="border-t-2 border-primary-100" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ============================================ */}
                {/* Trust Band */}
                {/* ============================================ */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 pt-8">
                    <div className="max-w-2xl">
                        {eyebrow && (
                            <span className="inline-block text-primary-600 text-caption font-semibold tracking-[0.15em] uppercase mb-3">
                                {eyebrow}
                            </span>
                        )}
                        <h2 className="font-heading text-display-sm lg:text-display text-ink">
                            {headline}
                        </h2>
                        {description && (
                            <p className="mt-3 text-body-lg text-muted max-w-prose">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Stats Chips */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <StatsChip
                            icon={Users2}
                            label="Partners"
                            value={stats.partnerCount}
                        />
                        <StatsChip
                            icon={LayoutGrid}
                            label="Categories"
                            value={stats.categoryCount}
                        />
                    </div>
                </div>

                {/* ============================================ */}
                {/* Desktop: Stacked Category Segments */}
                {/* ============================================ */}
                <div className="hidden lg:block space-y-10">
                    {grouped.map(({ category, partners: categoryPartners }) => {
                        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
                        const CategoryIcon = config.icon;

                        return (
                            <div key={category}>
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
                                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                                        <CategoryIcon className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <h3 className="font-heading text-h3 text-ink">
                                        {config.label}
                                    </h3>
                                    <span className="px-2 py-0.5 text-caption font-medium bg-primary-50 text-primary-600 rounded-pill">
                                        {categoryPartners.length}
                                    </span>
                                    <span className="text-body-sm text-muted ml-auto hidden xl:block">
                                        {config.description}
                                    </span>
                                </div>

                                {/* Partners Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

                {/* ============================================ */}
                {/* CTA Panel */}
                {/* ============================================ */}
                <div className="mt-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-card-lg p-8 lg:p-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Handshake className="w-6 h-6 text-primary-200" />
                    </div>
                    <h3 className="font-heading text-h2 text-white mb-3">
                        Become a Partner
                    </h3>
                    <p className="text-body text-primary-100 max-w-xl mx-auto mb-6">
                        Join our trusted partner network and connect with international
                        clients. We&apos;re always looking for quality organizations to collaborate with.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-pill hover:bg-primary-50 shadow-button hover:shadow-button-hover transition-all"
                    >
                        Get in Touch
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ============================================
// Stats Chip
// ============================================

function StatsChip({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
}) {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-pill border border-border-light">
            <Icon className="w-4 h-4 text-primary-600" />
            <span className="text-body-sm text-ink font-semibold">{value}</span>
            <span className="text-caption text-muted">{label}</span>
        </div>
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
            className="group block h-full rounded-card border border-border-light bg-white hover:border-primary-200 hover:shadow-card transition-all duration-200"
        >
            {/* Logo */}
            <div className="h-20 flex items-center justify-center bg-surface/50 rounded-t-card border-b border-border-light overflow-hidden px-4">
                {partner.logoUrl ? (
                    <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        width={100}
                        height={60}
                        className="object-contain max-w-full max-h-[3.5rem] group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                        <span className="text-primary-600 font-heading font-bold text-lg">
                            {partner.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h4 className="font-medium text-body-sm text-ink line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {partner.name}
                </h4>
                {partner.description && (
                    <p className="text-caption text-muted mt-1 line-clamp-2">
                        {partner.description}
                    </p>
                )}

                {/* Footer: category pill + visit link */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
                    <span className="px-2 py-0.5 text-[0.65rem] font-medium bg-primary-50 text-primary-600 rounded-pill leading-snug">
                        {config.label}
                    </span>
                    {partner.websiteUrl && (
                        <span className="flex items-center gap-1 text-caption text-muted group-hover:text-primary-600 transition-colors">
                            Visit
                            <ExternalLink className="w-3 h-3" />
                        </span>
                    )}
                </div>
            </div>
        </CardWrapper>
    );
}

// ============================================
// Empty Partners State
// ============================================

function EmptyPartnersState({ headline }: { headline: string }) {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mx-auto mb-6">
                        <Handshake className="w-10 h-10 text-primary-600" />
                    </div>
                    <h2 className="font-heading text-display-sm text-ink mb-3">
                        {headline}
                    </h2>
                    <p className="text-body-lg text-muted max-w-md mx-auto mb-8">
                        We&apos;re building our partner network. Interested in collaborating?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-pill hover:bg-primary-700 shadow-button hover:shadow-button-hover transition-all"
                    >
                        Become a Partner
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
