'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, updateUser, deleteUser } from '@/lib/actions';

type Role = 'ADMIN' | 'EDITOR';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    isActive: boolean;
    createdAt: Date;
}

interface UsersManagerProps {
    users: User[];
}

export default function UsersManager({ users }: UsersManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form state
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('EDITOR');
    const [isActive, setIsActive] = useState(true);

    const resetForm = () => {
        setEmail('');
        setName('');
        setPassword('');
        setRole('EDITOR');
        setIsActive(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEmail(user.email);
        setName(user.name || '');
        setPassword(''); // Don't show existing password
        setRole(user.role);
        setIsActive(user.isActive);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingUser(null);
        resetForm();
    };

    const handleAdd = () => {
        startTransition(async () => {
            const result = await createUser({ email, name: name || undefined, password, role });
            if (result.success) {
                closeModal();
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    const handleUpdate = () => {
        if (!editingUser) return;
        startTransition(async () => {
            const result = await updateUser(editingUser.id, {
                email,
                name: name || undefined,
                password: password || undefined, // Only update if provided
                role,
                isActive,
            });
            if (result.success) {
                closeModal();
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    const handleDelete = (userId: string, userEmail: string) => {
        if (!confirm(`Are you sure you want to delete user "${userEmail}"?`)) {
            return;
        }
        startTransition(async () => {
            const result = await deleteUser(userId);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    const handleToggleActive = (user: User) => {
        startTransition(async () => {
            await updateUser(user.id, { isActive: !user.isActive });
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            {/* Add Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                </button>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface border-b border-border-light">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                                            {(user.name || user.email)[0].toUpperCase()}
                                        </div>
                                        <div>
                                            {user.name && (
                                                <div className="font-medium text-ink">{user.name}</div>
                                            )}
                                            <div className="text-sm text-muted">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleActive(user)}
                                        disabled={isPending || users.filter(u => u.role === 'ADMIN' && u.isActive).length <= 1 && user.role === 'ADMIN' && user.isActive}
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                            user.isActive
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="p-2 text-muted hover:text-ink hover:bg-surface rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.email)}
                                            disabled={isPending || (user.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1)}
                                            className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingUser) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <h2 className="text-lg font-serif font-medium text-ink mb-6">
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Role
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as Role)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="EDITOR">Editor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <p className="text-xs text-muted mt-1">
                                    Admins can manage users and locales. Editors can only manage content.
                                </p>
                            </div>
                            {editingUser && (
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="rounded border-border text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-ink">Active</span>
                                </label>
                            )}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted hover:text-ink hover:border-ink transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingUser ? handleUpdate : handleAdd}
                                disabled={isPending || !email || (!editingUser && !password)}
                                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Saving...' : editingUser ? 'Update' : 'Add User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
