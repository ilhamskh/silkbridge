'use client';

import { useState } from 'react';
import type { ContentBlock, HeroBlock, PartnersBlock, CtaBlock, PartnersEmptyBlock } from '@/lib/blocks/schema';
import type { PublicPartner } from '@/lib/content';
import { Link } from '@/i18n/routing';

// ============================================
// Category Config
// ============================================

const CATEGORIES = [
    { key: 'ALL', label: { en: 'All Partners', az: 'Bütün Tərəfdaşlar', ru: 'Все партнёры' } },
    { key: 'GOVERNMENT', label: { en: 'Government', az: 'Dövlət', ru: 'Государство' } },
    { key: 'HOSPITAL', label: { en: 'Hospitals', az: 'Xəstəxanalar', ru: 'Больницы' } },
    { key: 'PHARMA', label: { en: 'Pharma', az: 'Əczaçılıq', ru: 'Фарма' } },
    { key: 'INVESTOR', label: { en: 'Investors', az: 'İnvestorlar', ru: 'Инвесторы' } },
    { key: 'ASSOCIATION', label: { en: 'Associations', az: 'Assosiasiyalar', ru: 'Ассоциации' } },
] as const;

// ============================================
// Partners Page Client
// ============================================

interface PartnersPageClientProps {
    heroBlock?: ContentBlock;
    partnersBlock?: ContentBlock;
    ctaBlock?: ContentBlock;
    partnersEmptyBlock?: ContentBlock;
    partners: PublicPartner[];
    locale: string;
}

export default function PartnersPageClient({
    heroBlock,
    partnersBlock,
    ctaBlock,
    partnersEmptyBlock,
    partners,
    locale,
}: PartnersPageClientProps) {
    const [activeCategory, setActiveCategory] = useState('ALL');

    const hero = heroBlock as HeroBlock | undefined;
    const partnersInfo = partnersBlock as PartnersBlock | undefined;
    const cta = ctaBlock as CtaBlock | undefined;
    const emptyState = partnersEmptyBlock as PartnersEmptyBlock | undefined;

    const filtered = activeCategory === 'ALL'
        ? partners
        : partners.filter((p) => p.category === activeCategory);

    const loc = locale as 'en' | 'az' | 'ru';

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            {hero && (
                <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-700/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-600/10 rounded-full blur-2xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="font-heading text-display-lg lg:text-display-xl font-bold tracking-tight">
                            {hero.tagline}
                        </h1>
                        {hero.subtagline && (
                            <p className="mt-6 text-lg lg:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
                                {hero.subtagline}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* Partners Info + Category Chips */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    {partnersInfo && (
                        <div className="text-center mb-12">
                            {partnersInfo.eyebrow && (
                                <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
                                    {partnersInfo.eyebrow}
                                </span>
                            )}
                            <h2 className="text-heading-lg lg:text-display-sm font-heading font-bold text-ink">
                                {partnersInfo.headline}
                            </h2>
                            {partnersInfo.description && (
                                <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
                                    {partnersInfo.description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Category Chips */}
                    {partners.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-12">
                            {CATEGORIES.map((cat) => {
                                const count = cat.key === 'ALL'
                                    ? partners.length
                                    : partners.filter((p) => p.category === cat.key).length;

                                if (cat.key !== 'ALL' && count === 0) return null;

                                return (
                                    <button
                                        key={cat.key}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.key
                                                ? 'bg-primary-600 text-white shadow-button'
                                                : 'bg-surface text-muted hover:bg-primary-50 hover:text-primary-700 border border-border-light'
                                            }`}
                                    >
                                        {cat.label[loc] || cat.label.en}
                                        <span className="ml-1.5 opacity-70">({count})</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Partners Grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map((partner) => (
                                <PartnerCard key={partner.id} partner={partner} />
                            ))}
                        </div>
                    ) : partners.length === 0 ? (
                        /* Empty State — no partners at all */
                        <EmptyPartnerState emptyState={emptyState} locale={loc} />
                    ) : (
                        /* No partners in this category */
                        <div className="text-center py-12">
                            <p className="text-muted text-lg">
                                {loc === 'az' ? 'Bu kateqoriyada tərəfdaş yoxdur.' :
                                    loc === 'ru' ? 'В этой категории нет партнёров.' :
                                        'No partners in this category yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            {cta && (
                <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="font-heading text-heading-lg lg:text-display-sm font-bold">
                            {cta.headline}
                        </h2>
                        {cta.description && (
                            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
                                {cta.description}
                            </p>
                        )}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            {cta.primaryButton && (
                                <Link
                                    href={cta.primaryButton.href}
                                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-primary-900 font-semibold text-base hover:bg-primary-50 transition-colors shadow-button"
                                >
                                    {cta.primaryButton.text}
                                </Link>
                            )}
                            {cta.secondaryButton && (
                                <Link
                                    href={cta.secondaryButton.href}
                                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors"
                                >
                                    {cta.secondaryButton.text}
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

// ============================================
// Partner Card
// ============================================

function PartnerCard({ partner }: { partner: PublicPartner }) {
    return (
        <div className="group relative bg-white border border-border-light rounded-2xl p-6 hover:shadow-card-hover hover:border-primary-200 transition-all duration-300">
            {/* Logo */}
            <div className="w-full h-20 flex items-center justify-center mb-4">
                {partner.logoUrl ? (
                    <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">
                            {partner.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <h3 className="font-heading font-semibold text-ink text-base text-center mb-2">
                {partner.name}
            </h3>

            {/* Category Badge */}
            <div className="flex justify-center mb-3">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                    {partner.category.charAt(0) + partner.category.slice(1).toLowerCase()}
                </span>
            </div>

            {partner.description && (
                <p className="text-sm text-muted text-center line-clamp-3">
                    {partner.description}
                </p>
            )}

            {/* Website Link */}
            {partner.websiteUrl && (
                <div className="mt-4 text-center">
                    <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Visit website
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
}

// ============================================
// Empty State
// ============================================

function EmptyPartnerState({
    emptyState,
    locale,
}: {
    emptyState?: PartnersEmptyBlock;
    locale: 'en' | 'az' | 'ru';
}) {
    const defaultHeadline = locale === 'az'
        ? 'Tərəfdaşlıq şəbəkəmizə qoşulun'
        : locale === 'ru'
            ? 'Присоединяйтесь к нашей сети'
            : 'Join Our Partnership Network';

    const defaultDescription = locale === 'az'
        ? 'Strateji tərəfdaşlıq imkanlarımız haqqında ətraflı məlumat üçün bizimlə əlaqə saxlayın.'
        : locale === 'ru'
            ? 'Свяжитесь с нами, чтобы узнать о стратегических партнёрствах.'
            : 'Contact us to learn about strategic partnership opportunities.';

    return (
        <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>
            <h3 className="font-heading text-heading-md font-bold text-ink mb-3">
                {emptyState?.headline || defaultHeadline}
            </h3>
            <p className="text-lg text-muted max-w-xl mx-auto mb-8">
                {emptyState?.description || defaultDescription}
            </p>
            <Link
                href={emptyState?.ctaHref || '/contact'}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary-600 text-white font-semibold text-base hover:bg-primary-700 transition-colors shadow-button"
            >
                {emptyState?.ctaText || (locale === 'az' ? 'Əlaqə' : locale === 'ru' ? 'Связаться' : 'Contact Us')}
            </Link>
        </div>
    );
}
