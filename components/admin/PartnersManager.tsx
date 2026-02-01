'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { AdminInput } from './ui/AdminInput';
import { AdminTextarea } from './ui/AdminTextarea';
import { ImageUploader } from './ui/ImageUploader';
import Button from '@/components/ui/button';

interface Partner {
    id: string;
    name: string;
    logoUrl: string | null;
    images: string[];
    location: string | null;
    specialties: string[];
    websiteUrl: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    order: number;
    translations: Array<{
        id: string;
        localeCode: string;
        description: string | null;
    }>;
}

interface Locale {
    code: string;
    name: string;
}

interface PartnersManagerProps {
    initialPartners: Partner[];
    locales: Locale[];
}

export function PartnersManager({ initialPartners, locales }: PartnersManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [partners, setPartners] = useState(initialPartners);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        images: [] as string[],
        location: '',
        specialties: '',
        websiteUrl: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
        descriptions: {} as Record<string, string>,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            logoUrl: '',
            images: [],
            location: '',
            specialties: '',
            websiteUrl: '',
            status: 'ACTIVE',
            descriptions: {},
        });
    };

    const openCreateModal = () => {
        resetForm();
        setEditingPartner(null);
        setIsCreating(true);
    };

    const openEditModal = (partner: Partner) => {
        setFormData({
            name: partner.name,
            logoUrl: partner.logoUrl || '',
            images: partner.images || [],
            location: partner.location || '',
            specialties: partner.specialties.join(', '),
            websiteUrl: partner.websiteUrl || '',
            status: partner.status,
            descriptions: partner.translations.reduce((acc, t) => {
                acc[t.localeCode] = t.description || '';
                return acc;
            }, {} as Record<string, string>),
        });
        setEditingPartner(partner);
        setIsCreating(true);
    };

    const closeModal = () => {
        setIsCreating(false);
        setEditingPartner(null);
        resetForm();
    };

    const handleSave = async () => {
        const specialtiesArray = formData.specialties
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        const payload = {
            name: formData.name,
            logoUrl: formData.images[0] || formData.logoUrl || null,
            images: formData.images,
            location: formData.location || null,
            specialties: specialtiesArray,
            websiteUrl: formData.websiteUrl || null,
            status: formData.status,
            descriptions: formData.descriptions,
        };

        startTransition(async () => {
            try {
                const url = editingPartner
                    ? `/api/admin/partners/${editingPartner.id}`
                    : '/api/admin/partners';

                const response = await fetch(url, {
                    method: editingPartner ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    router.refresh();
                    closeModal();
                }
            } catch (error) {
                console.error('Failed to save partner:', error);
            }
        });
    };

    const handleDelete = async (partnerId: string) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;

        startTransition(async () => {
            try {
                const response = await fetch(`/api/admin/partners/${partnerId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    router.refresh();
                }
            } catch (error) {
                console.error('Failed to delete partner:', error);
            }
        });
    };

    const handleReorder = async (partnerId: string, direction: 'up' | 'down') => {
        const currentIndex = partners.findIndex(p => p.id === partnerId);
        if (currentIndex === -1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= partners.length) return;

        const newPartners = [...partners];
        [newPartners[currentIndex], newPartners[newIndex]] = [newPartners[newIndex], newPartners[currentIndex]];

        // Update order values
        const updates = newPartners.map((p, i) => ({ id: p.id, order: i }));

        setPartners(newPartners);

        startTransition(async () => {
            try {
                await fetch('/api/admin/partners/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ updates }),
                });
            } catch (error) {
                console.error('Failed to reorder:', error);
            }
        });
    };

    return (
        <div>
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-500">
                    {partners.length} partner{partners.length !== 1 ? 's' : ''}
                </div>
                <Button onClick={openCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Partner
                </Button>
            </div>

            {/* Partners List */}
            {partners.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">No partners yet</h3>
                    <p className="text-gray-500 mb-4">
                        Add your first partner to display on the public site.
                    </p>
                    <Button onClick={openCreateModal} variant="secondary">
                        Add Partner
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-10 px-4 py-3"></th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Partner</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Location</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Specialties</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                                <th className="w-24 px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {partners.map((partner, index) => (
                                <tr key={partner.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => handleReorder(partner.id, 'up')}
                                                disabled={index === 0}
                                                className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleReorder(partner.id, 'down')}
                                                disabled={index === partners.length - 1}
                                                className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {partner.logoUrl ? (
                                                <img
                                                    src={partner.logoUrl}
                                                    alt={partner.name}
                                                    className="w-10 h-10 object-contain rounded border bg-white"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold">
                                                        {partner.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{partner.name}</div>
                                                {partner.websiteUrl && (
                                                    <a
                                                        href={partner.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        Website <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {partner.location || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {partner.specialties.slice(0, 3).map((s, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                                                    {s}
                                                </span>
                                            ))}
                                            {partner.specialties.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{partner.specialties.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`
                                            px-2 py-1 text-xs font-medium rounded-full
                                            ${partner.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }
                                        `}>
                                            {partner.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(partner)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(partner.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                            </h2>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <AdminInput
                                    label="Partner Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Grand Hotel Baku"
                                    required
                                />
                                <AdminInput
                                    label="Location"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="e.g., Baku, Azerbaijan"
                                />
                            </div>

                            {/* Image Upload */}
                            <ImageUploader
                                images={formData.images}
                                onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                                maxImages={10}
                            />

                            <AdminInput
                                label="Website URL"
                                value={formData.websiteUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                                placeholder="https://..."
                            />

                            <AdminInput
                                label="Specialties (comma-separated)"
                                value={formData.specialties}
                                onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                                placeholder="e.g., Hotels, Luxury, Wellness"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>

                            {/* Localized Descriptions */}
                            <div className="border-t pt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">
                                    Descriptions (by language)
                                </h3>
                                <div className="space-y-4">
                                    {locales.map((locale) => (
                                        <AdminTextarea
                                            key={locale.code}
                                            label={`Description (${locale.name})`}
                                            value={formData.descriptions[locale.code] || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                descriptions: {
                                                    ...prev.descriptions,
                                                    [locale.code]: e.target.value,
                                                },
                                            }))}
                                            placeholder={`Partner description in ${locale.name}...`}
                                            rows={2}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <Button variant="ghost" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={!formData.name || isPending}>
                                {isPending ? 'Saving...' : editingPartner ? 'Update Partner' : 'Create Partner'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
