import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getInsightCategoriesForAdmin } from '@/lib/insights/actions';
import { InsightEditorNew } from '@/components/admin/insights/InsightEditor';

export const metadata = {
    title: 'New Insight Post',
};

export default async function AdminInsightsNewPage() {
    const session = await auth();
    if (!session) redirect('/admin/login');

    const categories = await getInsightCategoriesForAdmin();

    return (
        <InsightEditorNew
            mode="create"
            categories={categories}
        />
    );
}
