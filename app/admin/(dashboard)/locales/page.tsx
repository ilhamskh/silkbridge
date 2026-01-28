import { getLocales } from '@/lib/actions';
import { requireAdmin } from '@/lib/auth';
import LocalesManagerNew from '@/components/admin/LocalesManagerNew';

export default async function LocalesPage() {
    // Only admins can access this page
    await requireAdmin();

    const locales = await getLocales();

    return <LocalesManagerNew locales={locales} />;
}
