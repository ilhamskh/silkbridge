'use client';

import { useState, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
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
    const t = useTranslations('Admin');

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

    const handleAddNew = () => {
        setEditingRecipient(null);
        setFormData({ label: '', email: '' });
        setError('');
        setIsModalOpen(true);
    };

    const handleEdit = (recipient: Recipient) => {
        setEditingRecipient(recipient);
        setFormData({ label: recipient.label, email: recipient.email });
        setError('');
        setIsModalOpen(true);
    };

    const handleToggleActive = async (recipient: Recipient) => {
        startTransition(async () => {
            const result = await toggleRecipientActive(recipient.id, !recipient.isActive);
            if (result.success) {
                loadRecipients();
            }
        });
    };

    const handleSave = async () => {
        setError('');

        if (!formData.label.trim()) {
            setError(t('contact.recipients.modal.labelRequired'));
            return;
        }

        if (!formData.email.trim()) {
            setError(t('contact.recipients.modal.emailRequired'));
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
                setError(result.error || t('contact.recipients.modal.saveFailed'));
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading font-semibold text-ink">
                        {t('contact.recipients.title')}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        {t('contact.recipients.subtitle')}
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700"
                >
                    <Plus className="h-4 w-4" />
                    {t('contact.recipients.add')}
                </button>
            </div>

            {/* Recipients Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipients.map((recipient) => (
                    <div
                        key={recipient.id}
                        className={`rounded-card border p-5 transition-all shadow-card ${recipient.isActive
                            ? 'border-border-light bg-white'
                            : 'border-border-light bg-surface opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${recipient.isActive
                                        ? 'bg-primary-100'
                                        : 'bg-surface'
                                        }`}
                                >
                                    <Users
                                        className={`h-5 w-5 ${recipient.isActive
                                            ? 'text-primary-600'
                                            : 'text-muted'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-ink">
                                        {recipient.label}
                                    </h3>
                                    <p className="text-sm text-muted">{recipient.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggleActive(recipient)}
                                className={`transition-colors ${recipient.isActive
                                    ? 'text-emerald-600 hover:text-emerald-700'
                                    : 'text-muted hover:text-ink'
                                    }`}
                                title={recipient.isActive ? t('contact.recipients.deactivate') : t('contact.recipients.activate')}
                            >
                                {recipient.isActive ? (
                                    <ToggleRight className="h-6 w-6" />
                                ) : (
                                    <ToggleLeft className="h-6 w-6" />
                                )}
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-muted">
                                <Tag className="h-4 w-4" />
                                {recipient._count.routingRules} routing{' '}
                                {recipient._count.routingRules === 1 ? 'rule' : 'rules'}
                            </div>
                            <button
                                onClick={() => handleEdit(recipient)}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                                {t('contact.recipients.edit')}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty state */}
                {recipients.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-card border-2 border-dashed border-border-light py-12">
                        <div className="h-16 w-16 rounded-full bg-surface flex items-center justify-center">
                            <Users className="h-8 w-8 text-muted" />
                        </div>
                        <p className="mt-4 text-ink font-medium">{t('contact.recipients.empty')}</p>
                        <button
                            onClick={handleAddNew}
                            className="mt-4 flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700"
                        >
                            <Plus className="h-4 w-4" />
                            {t('contact.recipients.addFirst')}
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-card bg-white p-6 shadow-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-heading font-semibold text-ink">
                                {editingRecipient ? t('contact.recipients.modal.editTitle') : t('contact.recipients.modal.addTitle')}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* Label */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                                    <Tag className="h-4 w-4 text-muted" />
                                    {t('contact.recipients.modal.label')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) =>
                                        setFormData((f) => ({ ...f, label: e.target.value }))
                                    }
                                    placeholder={t('contact.recipients.modal.labelPlaceholder')}
                                    className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-ink placeholder:text-muted/60 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                                    <Mail className="h-4 w-4 text-muted" />
                                    {t('contact.recipients.modal.email')}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((f) => ({ ...f, email: e.target.value }))
                                    }
                                    placeholder={t('contact.recipients.modal.emailPlaceholder')}
                                    className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-ink placeholder:text-muted/60 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
                                    className="rounded-xl px-4 py-2 font-medium text-muted transition-colors hover:bg-surface"
                                >
                                    {t('contact.recipients.modal.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isPending}
                                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {isPending ? t('contact.recipients.modal.saving') : t('contact.recipients.modal.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
