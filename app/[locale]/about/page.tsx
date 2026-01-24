import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/content/site-config';
import AboutPageContent from './AboutPageContent';

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
        title: t('about.title'),
        description: t('about.description'),
        alternates: {
            canonical: `/${locale}/about`,
            languages: {
                en: '/en/about',
                az: '/az/about',
            },
        },
        openGraph: {
            title: `${t('about.title')} | ${siteConfig.name}`,
            description: t('about.description'),
            url: `/${locale}/about`,
            siteName: siteConfig.name,
            locale: locale === 'az' ? 'az_AZ' : 'en_US',
            type: 'website',
        },
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <AboutPageContent />;
}
