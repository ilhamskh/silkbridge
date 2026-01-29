import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ContactAdminPage from '@/components/admin/contact/ContactAdminPage';

export default async function AdminContactPage() {
    const session = await getSession();

    if (!session) {
        redirect('/admin/login');
    }

    return <ContactAdminPage />;
}
