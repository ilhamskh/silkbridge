'use client';

import { useState, useEffect, useTransition } from 'react';
import {
    Users,
    Plus,
    Mail,
    Edit2,
    ToggleLeft,
    ToggleRight,
    X,
    Save,
    Tag,
} from 'lucide-react';
import {
    getRecipients,
    createRecipient,
    updateRecipient,
    toggleRecipientActive,
} from '@/lib/admin/contact-actions';

interface Recipient {
    id: string;
    label: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    _count: { routingRules: number };
}

export default function ContactRecipients() {
    const [isPending, startTransition] = useTransition();
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
    const [formData, setFormData] = useState({ label: '', email: '' });
    const [error, setError] = useState('');

    // Load recipients
    const loadRecipients = async () => {
        const result = await getRecipients();
        if (result.success && result.data) {
            setRecipients(result.data as Recipient[]);
        }
    };

    useEffect(() => {
        loadRecipients();
    }, []);

    // Open modal for new recipient
    const handleAddNew = () => {
        setEditingRecipient(null);
        setFormData({ label: '', email: '' });
        setError('');
        setIsModalOpen(true);
    };

    // Open modal for editing
    const handleEdit = (recipient: Recipient) => {
        setEditingRecipient(recipient);
        setFormData({ label: recipient.label, email: recipient.email });
        setError('');
        setIsModalOpen(true);
    };

    // Toggle active status
    const handleToggleActive = async (recipient: Recipient) => {
        startTransition(async () => {
            const result = await toggleRecipientActive(recipient.id, !recipient.isActive);
            if (result.success) {
                loadRecipients();
            }
        });
    };

    // Save recipient
    const handleSave = async () => {
        setError('');

        if (!formData.label.trim()) {
            setError('Please enter a label');
            return;
        }

        if (!formData.email.trim()) {
            setError('Please enter an email address');
            return;
        }

        startTransition(async () => {
            let result;
            if (editingRecipient) {
                result = await updateRecipient(editingRecipient.id, formData);
            } else {
                result = await createRecipient(formData);
            }

            if (result.success) {
                setIsModalOpen(false);
                loadRecipients();
            } else {
                setError(result.error || 'Failed to save recipient');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Email Recipients
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage who receives contact form submissions
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Recipient
                </button>
            </div>

            {/* Recipients Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipients.map((recipient) => (
                    <div
                        key={recipient.id}
                        className={`rounded-xl border p-5 transition-all ${recipient.isActive
                                ? 'border-slate-200 bg-white'
                                : 'border-slate-200 bg-slate-50 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${recipient.isActive
                                            ? 'bg-primary-100'
                                            : 'bg-slate-100'
                                        }`}
                                >
                                    <Users
                                        className={`h-5 w-5 ${recipient.isActive
                                                ? 'text-primary-600'
                                                : 'text-slate-400'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">
                                        {recipient.label}
                                    </h3>
                                    <p className="text-sm text-slate-500">{recipient.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggleActive(recipient)}
                                className={`transition-colors ${recipient.isActive
                                        ? 'text-emerald-600 hover:text-emerald-700'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                title={recipient.isActive ? 'Deactivate' : 'Activate'}
                            >
                                {recipient.isActive ? (
                                    <ToggleRight className="h-6 w-6" />
                                ) : (
                                    <ToggleLeft className="h-6 w-6" />
                                )}
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Tag className="h-4 w-4" />
                                {recipient._count.routingRules} routing{' '}
                                {recipient._count.routingRules === 1 ? 'rule' : 'rules'}
                            </div>
                            <button
                                onClick={() => handleEdit(recipient)}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty state */}
                {recipients.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12">
                        <Users className="h-12 w-12 text-slate-300" />
                        <p className="mt-4 text-slate-500">No recipients configured</p>
                        <button
                            onClick={handleAddNew}
                            className="mt-4 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add First Recipient
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingRecipient ? 'Edit Recipient' : 'Add Recipient'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* Label */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Tag className="h-4 w-4" />
                                    Label
                                </label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) =>
                                        setFormData((f) => ({ ...f, label: e.target.value }))
                                    }
                                    placeholder="e.g., General Inquiries, Pharma Team"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((f) => ({ ...f, email: e.target.value }))
                                    }
                                    placeholder="team@silkbridge.az"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isPending}
                                    className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {isPending ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
