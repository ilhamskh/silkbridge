import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getInsightPostsForAdmin, getInsightCategoriesForAdmin } from '@/lib/insights/actions';
import { InsightsAdminList } from '@/components/admin/insights/InsightsAdminList';

export const metadata = {
    title: 'Insights',
};

export default async function AdminInsightsPage() {
    const session = await auth();
    if (!session) redirect('/admin/login');

    const [posts, categories] = await Promise.all([
        getInsightPostsForAdmin(),
        getInsightCategoriesForAdmin(),
    ]);

    return (
        <InsightsAdminList
            posts={posts}
            categories={categories}
        />
    );
}
