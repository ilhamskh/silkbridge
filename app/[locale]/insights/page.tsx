import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { locales } from '@/i18n/config';
import { getInsightsList, getInsightCategories } from '@/lib/content';
import { InsightsPageContent } from './InsightsPageContent';

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://silkbridge.az';

const pageMeta: Record<string, { title: string; description: string }> = {
    en: {
        title: 'Insights | Silkbridge International',
        description: 'Expert insights on pharmaceutical market entry, health tourism, and wellness industry trends in Azerbaijan and beyond.',
    },
    az: {
        title: 'Məqalələr | Silkbridge International',
        description: 'Azərbaycanda və onun hüdudlarından kənarda əczaçılıq bazarına giriş, sağlamlıq turizmi və wellness sənayesi tendensiyaları haqqında ekspert məqalələri.',
    },
    ru: {
        title: 'Статьи | Silkbridge International',
        description: 'Экспертные статьи о выходе на фармацевтический рынок, медицинском туризме и трендах индустрии здоровья в Азербайджане и за его пределами.',
    },
};

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const meta = pageMeta[locale] || pageMeta.en;

    return {
        title: meta.title,
        description: meta.description,
        alternates: {
            canonical: `${BASE_URL}/${locale}/insights`,
            languages: Object.fromEntries(
                locales.map((l) => [l, `${BASE_URL}/${l}/insights`])
            ),
        },
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: `${BASE_URL}/${locale}/insights`,
            type: 'website',
        },
    };
}

export default async function InsightsPage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    const { page: pageParam, category, q: search } = await searchParams;

    setRequestLocale(locale);

    const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);

    const [result, categories] = await Promise.all([
        getInsightsList(locale, { category, search, page }),
        getInsightCategories(locale),
    ]);

    return (
        <InsightsPageContent
            posts={result.posts}
            categories={categories}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
            locale={locale}
            activeCategory={category || null}
            searchQuery={search || ''}
        />
    );
}
