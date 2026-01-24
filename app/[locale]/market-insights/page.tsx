import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/content/site-config';
import MarketInsightsIndex from './MarketInsightsIndex';

type Props = {
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo' });

    return {
        title: t('marketInsights.title'),
        description: t('marketInsights.description'),
        alternates: {
            canonical: `/${locale}/market-insights`,
            languages: {
                en: '/en/market-insights',
                az: '/az/market-insights',
            },
        },
        openGraph: {
            title: `${t('marketInsights.title')} | ${siteConfig.name}`,
            description: t('marketInsights.description'),
            url: `/${locale}/market-insights`,
            siteName: siteConfig.name,
            locale: locale === 'az' ? 'az_AZ' : 'en_US',
            type: 'website',
        },
    };
}

export default async function MarketInsightsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <MarketInsightsIndex />;
}
