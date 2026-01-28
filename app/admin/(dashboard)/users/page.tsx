import { getUsers } from '@/lib/actions';
import { requireAdmin } from '@/lib/auth';
import UsersManager from '@/components/admin/UsersManager';

export default async function UsersPage() {
    // Only admins can access this page
    await requireAdmin();

    const users = await getUsers();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-serif font-medium text-ink">User Management</h1>
                <p className="text-muted mt-1">Manage admin users and their permissions</p>
            </div>
            <UsersManager users={users} />
        </div>
    );
}
