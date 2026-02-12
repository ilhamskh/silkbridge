import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';
import { routing } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { MotionConfigProvider } from '@/components/ui/MotionConfigProvider';
import { getSiteSettings } from '@/lib/content/getSettings';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://silkbridge.az';

const inter = Inter({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    variable: '--font-inter',
    display: 'swap',
});

const manrope = Manrope({
    weight: ['500', '600', '700', '800'],
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    variable: '--font-manrope',
    display: 'swap',
});

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { locale } = await params;

    const titles: Record<string, string> = {
        en: 'Silkbridge International | Connecting Markets & Health Tourism',
        az: 'Silkbridge International | Bazarları və Sağlamlıq Turizmini Birləşdiririk',
        ru: 'Silkbridge International | Связываем Рынки и Медицинский Туризм',
    };

    const descriptions: Record<string, string> = {
        en: 'Premium pharmaceutical market entry and health & wellness tourism services connecting global markets.',
        az: 'Qlobal bazarları birləşdirən premium əczaçılıq bazarına giriş və sağlamlıq & wellness turizmi xidmətləri.',
        ru: 'Премиум услуги выхода на фармацевтический рынок и оздоровительный туризм, связывающие глобальные рынки.',
    };

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            default: titles[locale] || titles.en,
            template: `%s | Silkbridge International`,
        },
        description: descriptions[locale] || descriptions.en,
        keywords: [
            'pharmaceutical market entry',
            'health tourism',
            'medical tourism',
            'wellness tourism',
            'regulatory consulting',
            'healthcare',
            'international healthcare',
        ],
        authors: [{ name: 'Silkbridge International' }],
        creator: 'Silkbridge International',
        openGraph: {
            type: 'website',
            locale: locale === 'az' ? 'az_AZ' : locale === 'ru' ? 'ru_RU' : 'en_US',
            url: 'https://silkbridge.com',
            title: 'Silkbridge International',
            description: descriptions[locale] || descriptions.en,
            siteName: 'Silkbridge International',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Silkbridge International',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Silkbridge International',
            description: descriptions[locale] || descriptions.en,
            images: ['/og-image.jpg'],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}`,
            languages: Object.fromEntries(
                locales.map((l) => [l, `${BASE_URL}/${l}`])
            ),
        },
    };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Providing all messages to the client side
    const messages = await getMessages();

    // Fetch site settings for logo and branding
    const settings = await getSiteSettings(locale);

    return (
        <div lang={locale} className={`${inter.variable} ${manrope.variable}`}>
            <NextIntlClientProvider messages={messages}>
                <MotionConfigProvider>
                    <Toaster position="top-right" richColors closeButton />
                    <Header logoUrl={settings?.logoUrl} siteName={settings?.siteName} />
                    <main className="min-h-screen font-sans antialiased">{children}</main>
                    <Footer locale={locale as Locale} />
                </MotionConfigProvider>
            </NextIntlClientProvider>
            {/* Organization JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'Silkbridge International',
                        url: BASE_URL,
                        logo: `${BASE_URL}/logo.png`,
                        description: 'Health Tourism, Pharmaceutical Market Entry & Tourism Services in Azerbaijan.',
                        contactPoint: {
                            '@type': 'ContactPoint',
                            contactType: 'customer service',
                            availableLanguage: ['English', 'Azerbaijani', 'Russian'],
                        },
                        sameAs: [
                            'https://linkedin.com/company/silkbridge',
                        ],
                    }),
                }}
            />
        </div>
    );
}
