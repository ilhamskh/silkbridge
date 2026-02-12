import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getInsightPostForAdmin, getInsightCategoriesForAdmin } from '@/lib/insights/actions';
import { InsightEditorEdit } from '@/components/admin/insights/InsightEditor';

export const metadata = {
    title: 'Edit Insight Post',
};

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ locale?: string }>;
}

export default async function AdminInsightsEditPage({ params, searchParams }: PageProps) {
    const session = await auth();
    if (!session) redirect('/admin/login');

    const { id } = await params;
    const { locale: localeParam } = await searchParams;
    const locale = localeParam || 'en';

    const [postData, categories] = await Promise.all([
        getInsightPostForAdmin(id, locale),
        getInsightCategoriesForAdmin(),
    ]);

    if (!postData) notFound();

    return (
        <InsightEditorEdit
            key={`${id}:${locale}`}
            mode="edit"
            postData={postData}
            categories={categories}
            currentLocale={locale}
        />
    );
}
