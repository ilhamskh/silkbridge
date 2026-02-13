'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { PublicPartner } from '@/lib/content';

// Same category configs as in PartnersShowcase — kept as labels only in accordion
const CATEGORY_LABELS: Record<string, string> = {
    government: 'Government',
    hospital: 'Healthcare',
    hotel: 'Hotels',
    airline: 'Airlines',
    transport: 'Transport',
    tourism: 'Tourism',
    technology: 'Technology',
    other: 'Other',
};

interface PartnerAccordionProps {
    groupedPartners: Array<{
        category: string;
        partners: PublicPartner[];
    }>;
}

export function PartnerAccordion({ groupedPartners }: PartnerAccordionProps) {
    // First category open by default
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(groupedPartners.length > 0 ? [groupedPartners[0].category] : [])
    );

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    return (
        <div className="space-y-3">
            {groupedPartners.map(({ category, partners }) => {
                const isOpen = openCategories.has(category);
                const label = CATEGORY_LABELS[category] || category;

                return (
                    <div
                        key={category}
                        className="border border-border-light rounded-card overflow-hidden bg-white"
                    >
                        {/* Trigger */}
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <h3 className="font-heading text-body font-semibold text-ink">
                                    {label}
                                </h3>
                                <span className="px-2 py-0.5 text-caption font-medium bg-primary-50 text-primary-600 rounded-pill">
                                    {partners.length}
                                </span>
                            </div>
                            <ChevronDown className={`
                                w-5 h-5 text-muted transition-transform duration-200
                                ${isOpen ? 'rotate-180' : ''}
                            `} />
                        </button>

                        {/* Content */}
                        <div
                            className={`
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className="px-5 pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {partners.map(partner => (
                                    <MobilePartnerCard key={partner.id} partner={partner} />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================
// Mobile Partner Card (compact)
// ============================================

function MobilePartnerCard({ partner }: { partner: PublicPartner }) {
    const CardWrapper = partner.websiteUrl ? 'a' : 'div';
    const linkProps = partner.websiteUrl
        ? { href: partner.websiteUrl, target: '_blank' as const, rel: 'noopener noreferrer' }
        : {};

    return (
        <CardWrapper
            {...linkProps}
            className="group flex items-center gap-3 p-3 rounded-card border border-border-light hover:border-primary-200 hover:shadow-card transition-all bg-white"
        >
            {/* Logo */}
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
                {partner.logoUrl ? (
                    <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full p-1"
                    />
                ) : (
                    <span className="text-primary-600 font-heading font-bold text-body-sm">
                        {partner.name.charAt(0)}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-body-sm text-ink line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {partner.name}
                </h4>
                {partner.description && (
                    <p className="text-caption text-muted line-clamp-1">{partner.description}</p>
                )}
            </div>

            {/* Visit icon */}
            {partner.websiteUrl && (
                <ExternalLink className="w-4 h-4 text-border-subtle group-hover:text-primary-600 transition-colors flex-shrink-0" />
            )}
        </CardWrapper>
    );
}
