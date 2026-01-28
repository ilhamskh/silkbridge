'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createLocale, updateLocale, deleteLocale } from '@/lib/actions';

interface Locale {
    code: string;
    name: string;
    nativeName: string;
    isRTL: boolean;
    isEnabled: boolean;
}

interface LocalesManagerProps {
    locales: Locale[];
}

export default function LocalesManager({ locales }: LocalesManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLocale, setEditingLocale] = useState<Locale | null>(null);

    // Form state for add/edit
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [nativeName, setNativeName] = useState('');
    const [isRTL, setIsRTL] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);

    const resetForm = () => {
        setCode('');
        setName('');
        setNativeName('');
        setIsRTL(false);
        setIsEnabled(true);
    };

    const openEditModal = (locale: Locale) => {
        setEditingLocale(locale);
        setCode(locale.code);
        setName(locale.name);
        setNativeName(locale.nativeName);
        setIsRTL(locale.isRTL);
        setIsEnabled(locale.isEnabled);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingLocale(null);
        resetForm();
    };

    const handleAdd = () => {
        startTransition(async () => {
            await createLocale({ code, name, nativeName, isRTL, isEnabled });
            closeModal();
            router.refresh();
        });
    };

    const handleUpdate = () => {
        if (!editingLocale) return;
        startTransition(async () => {
            await updateLocale(editingLocale.code, { name, nativeName, isRTL, isEnabled });
            closeModal();
            router.refresh();
        });
    };

    const handleDelete = (localeCode: string) => {
        if (!confirm(`Are you sure you want to delete the "${localeCode}" locale? This will also delete all translations for this locale.`)) {
            return;
        }
        startTransition(async () => {
            await deleteLocale(localeCode);
            router.refresh();
        });
    };

    const handleToggleEnabled = (locale: Locale) => {
        startTransition(async () => {
            await updateLocale(locale.code, { isEnabled: !locale.isEnabled });
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
                    Add Locale
                </button>
            </div>

            {/* Locales List */}
            <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface border-b border-border-light">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Native Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Direction
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {locales.map((locale) => (
                            <tr key={locale.code} className="hover:bg-surface/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-sm font-semibold text-ink">
                                        {locale.code}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-ink">{locale.name}</td>
                                <td className="px-6 py-4 text-sm text-ink">{locale.nativeName}</td>
                                <td className="px-6 py-4 text-sm text-muted">
                                    {locale.isRTL ? 'RTL' : 'LTR'}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleEnabled(locale)}
                                        disabled={isPending}
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${locale.isEnabled
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {locale.isEnabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(locale)}
                                            className="p-2 text-muted hover:text-ink hover:bg-surface rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(locale.code)}
                                            disabled={isPending || locales.length <= 1}
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
            {(showAddModal || editingLocale) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <h2 className="text-lg font-serif font-medium text-ink mb-6">
                            {editingLocale ? 'Edit Locale' : 'Add New Locale'}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Language Code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toLowerCase())}
                                    disabled={!!editingLocale}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-surface disabled:cursor-not-allowed"
                                    placeholder="en, az, de, fr..."
                                    maxLength={5}
                                />
                                <p className="text-xs text-muted mt-1">
                                    ISO 639-1 code (e.g., en, az, de)
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Name (English)
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="English, Azerbaijani, German..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Native Name
                                </label>
                                <input
                                    type="text"
                                    value={nativeName}
                                    onChange={(e) => setNativeName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="English, Azərbaycan, Deutsch..."
                                />
                            </div>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isRTL}
                                        onChange={(e) => setIsRTL(e.target.checked)}
                                        className="rounded border-border text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-ink">Right-to-Left (RTL)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={(e) => setIsEnabled(e.target.checked)}
                                        className="rounded border-border text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-ink">Enabled</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted hover:text-ink hover:border-ink transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingLocale ? handleUpdate : handleAdd}
                                disabled={isPending || !code || !name || !nativeName}
                                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Saving...' : editingLocale ? 'Update' : 'Add Locale'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
