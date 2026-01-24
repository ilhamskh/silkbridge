import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/content/site-config';
import PartnersPageContent from './PartnersPageContent';

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
        title: t('partners.title'),
        description: t('partners.description'),
        alternates: {
            canonical: `/${locale}/partners`,
            languages: {
                en: '/en/partners',
                az: '/az/partners',
            },
        },
        openGraph: {
            title: `${t('partners.title')} | ${siteConfig.name}`,
            description: t('partners.description'),
            url: `/${locale}/partners`,
            siteName: siteConfig.name,
            locale: locale === 'az' ? 'az_AZ' : 'en_US',
            type: 'website',
        },
    };
}

export default async function PartnersPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <PartnersPageContent />;
}
