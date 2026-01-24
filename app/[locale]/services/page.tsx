import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/content/site-config';
import ServicesPageContent from './ServicesPageContent';

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
        title: t('services.title'),
        description: t('services.description'),
        alternates: {
            canonical: `/${locale}/services`,
            languages: {
                en: '/en/services',
                az: '/az/services',
            },
        },
        openGraph: {
            title: `${t('services.title')} | ${siteConfig.name}`,
            description: t('services.description'),
            url: `/${locale}/services`,
            siteName: siteConfig.name,
            locale: locale === 'az' ? 'az_AZ' : 'en_US',
            type: 'website',
        },
    };
}

export default async function ServicesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <ServicesPageContent />;
}
