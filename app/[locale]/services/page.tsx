import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/content/site-config';
import { getPageContent } from '@/lib/blocks/content';
import BlockRenderer from '@/lib/blocks/BlockRenderer';
import { FaqSection } from '@/components/sections/FaqSection';
import { getFaqsByGroup } from '@/lib/data/faqs';
import type { ContentBlock } from '@/lib/blocks/schema';

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

    // Fetch page content from database
    const pageContent = await getPageContent('services', locale as 'en' | 'az');

    if (!pageContent) {
        notFound();
    }

    // Fetch FAQs for services from database
    const faqs = await getFaqsByGroup('services', locale);

    return (
        <div className="pt-24 lg:pt-32">
            <BlockRenderer blocks={pageContent.blocks as ContentBlock[]} />

            {/* Database-driven FAQ Section */}
            {faqs && faqs.length > 0 && (
                <FaqSection
                    faqs={faqs}
                    title={locale === 'az' ? 'Tez-tez Verilən Suallar' : 'Frequently Asked Questions'}
                    subtitle={locale === 'az'
                        ? 'Xidmətlərimiz haqqında ən çox verilən sualların cavabları'
                        : 'Find answers to common questions about our services'
                    }
                />
            )}
        </div>
    );
}
