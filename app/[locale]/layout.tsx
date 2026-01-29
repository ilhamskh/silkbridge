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
import '../globals.css';

const inter = Inter({
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    variable: '--font-inter',
    display: 'swap',
});

const manrope = Manrope({
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
        metadataBase: new URL('https://silkbridge.com'),
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
            canonical: `https://silkbridge.com/${locale}`,
            languages: {
                en: 'https://silkbridge.com/en',
                az: 'https://silkbridge.com/az',
                ru: 'https://silkbridge.com/ru',
            },
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

    return (
        <html lang={locale} className={`${inter.variable} ${manrope.variable}`}>
            <body className="font-sans antialiased">
                <NextIntlClientProvider messages={messages}>
                    <Toaster position="top-right" richColors closeButton />
                    <Header />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
