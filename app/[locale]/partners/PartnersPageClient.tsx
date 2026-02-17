import { PartnersShowcase } from '@/components/sections/PartnersShowcase';
import {
    IntroBlockRenderer,
    StatsRowBlockRenderer,
    CtaBlockRenderer,
} from '@/lib/blocks/renderers/extended-blocks';
import { getTranslations } from 'next-intl/server';
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
        </div>
    );
}
