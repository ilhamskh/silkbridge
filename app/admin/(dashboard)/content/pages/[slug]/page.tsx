import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import PageEditorWrapper from '@/components/admin/PageEditorWrapper';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ locale?: string }>;
}

// Types
interface Locale {
    code: string;
    name: string;
    flag: string | null;
    isDefault: boolean;
}

interface PageTranslation {
    id: string;
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImage: string | null;
    blocks: unknown;
    status: 'DRAFT' | 'PUBLISHED';
    updatedAt: Date;
    updatedBy: string | null;
}

interface Page {
    id: string;
    slug: string;
}

async function getPageData(slug: string, localeCode?: string) {
    try {
        // Get page with all translations
        const page = await prisma.page.findUnique({
            where: { slug },
            include: {
                translations: true,
            },
        });

        if (!page) return null;

        // Get all enabled locales
        const locales = await prisma.locale.findMany({
            where: { isEnabled: true },
            orderBy: { isDefault: 'desc' },
        });

        // Determine current locale
        const defaultLocale = locales.find(l => l.isDefault)?.code || 'en';
        const currentLocale = localeCode && locales.some(l => l.code === localeCode)
            ? localeCode
            : defaultLocale;

        // Get translation for current locale
        const translation = page.translations.find(t => t.localeCode === currentLocale) || null;

        // Get all versions for this page/locale (for version history)
        // In a full implementation, you'd have a separate versions table
        // For now, we'll just pass the current translation

        return {
            page: { id: page.id, slug: page.slug } as Page,
            translation: translation as PageTranslation | null,
            locales: locales as Locale[],
            currentLocale,
            allTranslations: page.translations.map(t => ({
                localeCode: t.localeCode,
                status: t.status,
            })),
        };
    } catch (error) {
        console.error('Error fetching page data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    return {
        title: `Edit ${slug.charAt(0).toUpperCase() + slug.slice(1)} Page`,
    };
}

export default async function PageEditorPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { locale } = await searchParams;

    const data = await getPageData(slug, locale);

    if (!data) {
        notFound();
    }

    return (
        <PageEditorWrapper
            page={data.page}
            translation={data.translation}
            locales={data.locales}
            currentLocale={data.currentLocale}
            allTranslations={data.allTranslations}
        />
    );
}
