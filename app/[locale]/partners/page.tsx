import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPageContent } from '@/lib/blocks/content';
import { getPartners } from '@/lib/content';

// ISR — revalidated on-demand via revalidateTag() in admin save actions
export const revalidate = 60;
import type { ContentBlock } from '@/lib/blocks/schema';
import type { Metadata } from 'next';
import { locales } from '@/i18n/config';
import PartnersPageClient from './PartnersPageClient';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const pageContent = await getPageContent('partners', locale);
    const t = await getTranslations({ locale, namespace: 'partnersPage' });

    const title = pageContent?.seoTitle || pageContent?.title || t('metadata.title');
    const description = pageContent?.seoDescription || t('metadata.description');

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        alternates: {
            languages: Object.fromEntries(
                locales.map((l) => [l, `/${l}/partners`])
            ),
        },
    };
}

export default async function PartnersPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const [pageContent, partners] = await Promise.all([
        getPageContent('partners', locale),
        getPartners(locale),
    ]);

    if (!pageContent) {
        notFound();
    }

    // Extract blocks for the page layout
    const blocks = pageContent.blocks as ContentBlock[];
    const introBlock = blocks.find((b) => b.type === 'intro');
    const heroBlock = blocks.find((b) => b.type === 'hero'); // fallback for legacy data
    const statsRowBlock = blocks.find((b) => b.type === 'statsRow');
    const partnersBlock = blocks.find((b) => b.type === 'partners');
    const ctaBlock = blocks.find((b) => b.type === 'cta');

    return (
        <PartnersPageClient
            introBlock={introBlock}
            heroBlock={heroBlock}
            statsRowBlock={statsRowBlock}
            partnersBlock={partnersBlock}
            ctaBlock={ctaBlock}
            partners={partners}
            locale={locale}
        />
    );
}
