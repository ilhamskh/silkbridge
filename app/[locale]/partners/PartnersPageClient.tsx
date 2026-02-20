import { PartnersShowcase } from '@/components/sections/PartnersShowcase';
import {
    IntroBlockRenderer,
    StatsRowBlockRenderer,
    CtaBlockRenderer,
} from '@/lib/blocks/renderers/extended-blocks';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { ContentBlock, HeroBlock, IntroBlock, PartnersBlock, StatsRowBlock, CtaBlock } from '@/lib/blocks/schema';
import type { PublicPartner } from '@/lib/content';

// ============================================
// Partners Page Client
// ============================================

interface PartnersPageClientProps {
    introBlock?: ContentBlock;
    heroBlock?: ContentBlock;  // fallback for legacy data
    statsRowBlock?: ContentBlock;
    partnersBlock?: ContentBlock;
    ctaBlock?: ContentBlock;
    partners: PublicPartner[];
    locale: string;
}

export default async function PartnersPageClient({
    introBlock,
    heroBlock,
    statsRowBlock,
    partnersBlock,
    ctaBlock,
    partners,
    locale,
}: PartnersPageClientProps) {
    const t = await getTranslations({ locale, namespace: 'partnersPage' });

    const intro = introBlock as IntroBlock | undefined;
    const hero = heroBlock as HeroBlock | undefined;
    const partnersInfo = partnersBlock as PartnersBlock | undefined;
    const statsRow = statsRowBlock as StatsRowBlock | undefined;
    const cta = ctaBlock as CtaBlock | undefined;

    // Build intro block from hero data if no intro block exists (legacy compatibility)
    const resolvedIntro: IntroBlock | undefined = intro
        ? intro
        : hero
            ? {
                type: 'intro' as const,
                eyebrow: '',
                headline: hero.tagline,
                headlineAccent: undefined,
                text: hero.subtagline,
            }
            : undefined;

    return (
        <div className="min-h-screen pt-24 lg:pt-32">
            {/* Hero — identical IntroBlockRenderer used by About & Services */}
            {resolvedIntro && (
                <IntroBlockRenderer block={resolvedIntro} />
            )}

            {/* Stats Row — same StatsRowBlockRenderer used by About / Services */}
            {statsRow && (
                <StatsRowBlockRenderer block={statsRow} />
            )}

            {/* Partner List — server-fetched, consistent landing style */}
            <PartnersShowcase
                partners={partners}
                eyebrow={partnersInfo?.eyebrow}
                headline={partnersInfo?.headline || t('ui.fallbackHeadline')}
                description={partnersInfo?.description}
            />

            {/* CTA — same CtaBlockRenderer used by About / Services */}
            {cta && (
                <CtaBlockRenderer block={cta} />
            )}

            {!cta && (
                <section className="relative py-20 lg:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                            {t('cta.headline')}
                        </h2>
                        <p className="mt-5 text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                            {t('cta.description')}
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-900 font-semibold rounded-full hover:bg-primary-50 transition-colors"
                            >
                                {t('cta.button')}
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
