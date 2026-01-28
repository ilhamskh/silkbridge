'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createLocale, updateLocale, deleteLocale } from '@/lib/actions';
import { useToast } from './ui/AdminToast';
import { AdminCard, AdminCardHeader, AdminCardContent } from './ui/AdminCard';
import { AdminButton } from './ui/AdminButton';
import { AdminIcon } from './ui/AdminIcon';
import { AdminInput } from './ui/AdminInput';
import { AdminBadge } from './ui/AdminBadge';
import { AdminModal, AdminConfirmDialog } from './ui/AdminModal';
import { AdminEmptyState } from './ui/AdminEmptyState';

interface LocalesManagerNewProps {
    locales: Array<{
        code: string;
        name: string;
        nativeName: string;
        flag: string | null;
        isRTL: boolean;
        isEnabled: boolean;
        isDefault: boolean;
    }>;
}

interface LocaleFormData {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    isRTL: boolean;
    isEnabled: boolean;
}

const COMMON_LOCALES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

export default function LocalesManagerNew({ locales: initialLocales }: LocalesManagerNewProps) {
    const router = useRouter();
    const toast = useToast();
    const [locales, setLocales] = useState(initialLocales);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLocale, setEditingLocale] = useState<typeof initialLocales[0] | null>(null);
    const [deleteLocaleCode, setDeleteLocaleCode] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<LocaleFormData>({
        code: '',
        name: '',
        nativeName: '',
        flag: '',
        isRTL: false,
        isEnabled: true,
    });

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            nativeName: '',
            flag: '',
            isRTL: false,
            isEnabled: true,
        });
    };

    const handlePresetSelect = (preset: typeof COMMON_LOCALES[0]) => {
        setFormData({
            code: preset.code,
            name: preset.name,
            nativeName: preset.nativeName,
            flag: preset.flag,
            isRTL: 'isRTL' in preset ? (preset as any).isRTL : false,
            isEnabled: true,
        });
    };

    const handleAdd = async () => {
        if (!formData.code || !formData.name || !formData.nativeName) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (locales.some(l => l.code === formData.code)) {
            toast.error('A locale with this code already exists');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createLocale(formData);
            if (result.success) {
                toast.success(`${formData.name} locale added successfully`);
                setShowAddModal(false);
                resetForm();
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to add locale');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingLocale || !formData.name || !formData.nativeName) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateLocale(editingLocale.code, {
                name: formData.name,
                nativeName: formData.nativeName,
                flag: formData.flag || undefined,
                isRTL: formData.isRTL,
                isEnabled: formData.isEnabled,
            });
            if (result.success) {
                toast.success(`${formData.name} locale updated`);
                setEditingLocale(null);
                resetForm();
                router.refresh();
            } else {
                toast.error('Failed to update locale');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteLocaleCode) return;

        const locale = locales.find(l => l.code === deleteLocaleCode);
        if (locale?.isDefault) {
            toast.error('Cannot delete the default locale');
            setDeleteLocaleCode(null);
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await deleteLocale(deleteLocaleCode);
            if (result.success) {
                toast.success('Locale deleted');
                setDeleteLocaleCode(null);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete locale');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSetDefault = async (code: string) => {
        setIsSubmitting(true);
        try {
            const result = await updateLocale(code, { isDefault: true });
            if (result.success) {
                toast.success('Default locale updated');
                router.refresh();
            } else {
                toast.error('Failed to update default locale');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleEnabled = async (code: string, isEnabled: boolean) => {
        const locale = locales.find(l => l.code === code);
        if (locale?.isDefault && !isEnabled) {
            toast.error('Cannot disable the default locale');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateLocale(code, { isEnabled: !isEnabled });
            if (result.success) {
                toast.success(isEnabled ? 'Locale disabled' : 'Locale enabled');
                router.refresh();
            } else {
                toast.error('Failed to update locale');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (locale: typeof initialLocales[0]) => {
        setEditingLocale(locale);
        setFormData({
            code: locale.code,
            name: locale.name,
            nativeName: locale.nativeName,
            flag: locale.flag || '',
            isRTL: locale.isRTL,
            isEnabled: locale.isEnabled,
        });
    };

    const availablePresets = COMMON_LOCALES.filter(
        preset => !locales.some(l => l.code === preset.code)
    );

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-heading font-semibold text-2xl text-ink">Languages</h1>
                    <p className="text-muted mt-1">Manage available languages for your site</p>
                </div>
                <AdminButton
                    variant="primary"
                    onClick={() => setShowAddModal(true)}
                    leftIcon={<AdminIcon name="plus" className="w-4 h-4" />}
                >
                    Add Language
                </AdminButton>
            </div>

            {/* Locales List */}
            {locales.length > 0 ? (
                <div className="space-y-3">
                    {locales.map((locale) => (
                        <AdminCard key={locale.code} padding="md" className="group">
                            <div className="flex items-center justify-between">
                                {/* Left: Info */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{locale.flag || '🌐'}</div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-ink">{locale.name}</span>
                                            <span className="text-sm text-muted">({locale.nativeName})</span>
                                            <AdminBadge variant="default" size="sm">{locale.code}</AdminBadge>
                                            {locale.isDefault && (
                                                <AdminBadge variant="success" size="sm" dot>Default</AdminBadge>
                                            )}
                                            {locale.isRTL && (
                                                <AdminBadge variant="info" size="sm">RTL</AdminBadge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted mt-0.5">
                                            {locale.isEnabled ? 'Active' : 'Disabled'}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!locale.isDefault && (
                                        <AdminButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSetDefault(locale.code)}
                                            disabled={isSubmitting}
                                        >
                                            Set Default
                                        </AdminButton>
                                    )}
                                    <AdminButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleEnabled(locale.code, locale.isEnabled)}
                                        disabled={isSubmitting || (locale.isDefault && locale.isEnabled)}
                                    >
                                        {locale.isEnabled ? 'Disable' : 'Enable'}
                                    </AdminButton>
                                    <AdminButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditModal(locale)}
                                        leftIcon={<AdminIcon name="edit" className="w-4 h-4" />}
                                    >
                                        Edit
                                    </AdminButton>
                                    {!locale.isDefault && (
                                        <AdminButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteLocaleCode(locale.code)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            leftIcon={<AdminIcon name="trash" className="w-4 h-4" />}
                                        >
                                            Delete
                                        </AdminButton>
                                    )}
                                </div>
                            </div>
                        </AdminCard>
                    ))}
                </div>
            ) : (
                <AdminEmptyState
                    icon={<AdminIcon name="globe" className="w-8 h-8" />}
                    title="No languages configured"
                    description="Add your first language to get started"
                    action={{
                        label: 'Add Language',
                        onClick: () => setShowAddModal(true),
                    }}
                />
            )}

            {/* Add Modal */}
            <AdminModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    resetForm();
                }}
                title="Add Language"
                footer={
                    <div className="flex justify-end gap-3">
                        <AdminButton variant="ghost" onClick={() => {
                            setShowAddModal(false);
                            resetForm();
                        }}>
                            Cancel
                        </AdminButton>
                        <AdminButton variant="primary" onClick={handleAdd} isLoading={isSubmitting}>
                            Add Language
                        </AdminButton>
                    </div>
                }
            >
                <div className="space-y-4">
                    {/* Quick Select */}
                    {availablePresets.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Quick Select</label>
                            <div className="flex flex-wrap gap-2">
                                {availablePresets.slice(0, 6).map((preset) => (
                                    <button
                                        key={preset.code}
                                        onClick={() => handlePresetSelect(preset)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-surface hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        {preset.flag} {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <AdminInput
                            label="Language Code"
                            value={formData.code}
                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toLowerCase() }))}
                            placeholder="en"
                            helperText="ISO 639-1 code (e.g., en, az, ru)"
                            required
                            maxLength={5}
                        />
                        <AdminInput
                            label="Flag Emoji"
                            value={formData.flag}
                            onChange={(e) => setFormData(prev => ({ ...prev, flag: e.target.value }))}
                            placeholder="🇬🇧"
                        />
                    </div>

                    <AdminInput
                        label="Name (English)"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="English"
                        required
                    />

                    <AdminInput
                        label="Native Name"
                        value={formData.nativeName}
                        onChange={(e) => setFormData(prev => ({ ...prev, nativeName: e.target.value }))}
                        placeholder="English"
                        helperText="How speakers of this language call it"
                        required
                    />

                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isRTL}
                                onChange={(e) => setFormData(prev => ({ ...prev, isRTL: e.target.checked }))}
                                className="w-4 h-4 rounded border-border-light text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-ink">Right-to-left (RTL)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isEnabled}
                                onChange={(e) => setFormData(prev => ({ ...prev, isEnabled: e.target.checked }))}
                                className="w-4 h-4 rounded border-border-light text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-ink">Enabled</span>
                        </label>
                    </div>
                </div>
            </AdminModal>

            {/* Edit Modal */}
            <AdminModal
                isOpen={!!editingLocale}
                onClose={() => {
                    setEditingLocale(null);
                    resetForm();
                }}
                title={`Edit ${editingLocale?.name || 'Language'}`}
                footer={
                    <div className="flex justify-end gap-3">
                        <AdminButton variant="ghost" onClick={() => {
                            setEditingLocale(null);
                            resetForm();
                        }}>
                            Cancel
                        </AdminButton>
                        <AdminButton variant="primary" onClick={handleUpdate} isLoading={isSubmitting}>
                            Save Changes
                        </AdminButton>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <AdminInput
                            label="Language Code"
                            value={formData.code}
                            disabled
                            helperText="Code cannot be changed"
                        />
                        <AdminInput
                            label="Flag Emoji"
                            value={formData.flag}
                            onChange={(e) => setFormData(prev => ({ ...prev, flag: e.target.value }))}
                            placeholder="🇬🇧"
                        />
                    </div>

                    <AdminInput
                        label="Name (English)"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="English"
                        required
                    />

                    <AdminInput
                        label="Native Name"
                        value={formData.nativeName}
                        onChange={(e) => setFormData(prev => ({ ...prev, nativeName: e.target.value }))}
                        placeholder="English"
                        required
                    />

                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isRTL}
                                onChange={(e) => setFormData(prev => ({ ...prev, isRTL: e.target.checked }))}
                                className="w-4 h-4 rounded border-border-light text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-ink">Right-to-left (RTL)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isEnabled}
                                onChange={(e) => setFormData(prev => ({ ...prev, isEnabled: e.target.checked }))}
                                disabled={editingLocale?.isDefault}
                                className="w-4 h-4 rounded border-border-light text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                            />
                            <span className="text-sm text-ink">Enabled</span>
                        </label>
                    </div>
                </div>
            </AdminModal>

            {/* Delete Confirmation */}
            <AdminConfirmDialog
                isOpen={!!deleteLocaleCode}
                onClose={() => setDeleteLocaleCode(null)}
                onConfirm={handleDelete}
                title="Delete Language?"
                description={`This will permanently delete the "${locales.find(l => l.code === deleteLocaleCode)?.name}" locale and all its translations. This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={isSubmitting}
            />
        </div>
    );
}
