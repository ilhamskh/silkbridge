'use client';

import { PartnersEnhanced } from '@/components/sections/PartnersEnhanced';
import type { ContentBlock, HeroBlock, PartnersBlock, CtaBlock } from '@/lib/blocks/schema';
import type { PublicPartner } from '@/lib/content';

// ============================================
// Partners Page Client
// ============================================

interface PartnersPageClientProps {
    heroBlock?: ContentBlock;
    partnersBlock?: ContentBlock;
    ctaBlock?: ContentBlock;
    partnersEmptyBlock?: ContentBlock;  // Keep for backward compatibility even if not used
    partners: PublicPartner[];
    locale: string;
}

export default function PartnersPageClient({
    heroBlock,
    partnersBlock,
    ctaBlock,
    // partnersEmptyBlock, // Preserved for backward compatibility but handled internally by PartnersEnhanced
    partners,
    locale,
}: PartnersPageClientProps) {
    const hero = heroBlock as HeroBlock | undefined;
    const partnersInfo = partnersBlock as PartnersBlock | undefined;
    const cta = ctaBlock as CtaBlock | undefined;

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

            {/* Enhanced Partners Section */}
            <PartnersEnhanced
                partners={partners}
                eyebrow={partnersInfo?.eyebrow}
                headline={partnersInfo?.headline || 'Our Partners'}
                description={partnersInfo?.description}
                locale={locale}
            />

            {/* CTA Section */}
            {cta && (
                <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-600 to-primary-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="font-heading text-display-sm lg:text-display text-white mb-6">
                            {cta.headline}
                        </h2>
                        {cta.text && (
                            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                                {cta.text}
                            </p>
                        )}
                        {cta.ctaText && cta.ctaHref && (
                            <a
                                href={cta.ctaHref}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-pill hover:bg-primary-50 shadow-button hover:shadow-button-hover transition-all"
                            >
                                {cta.ctaText}
                            </a>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
