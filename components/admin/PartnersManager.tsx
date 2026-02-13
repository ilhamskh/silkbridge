'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { AdminInput } from './ui/AdminInput';
import { AdminTextarea } from './ui/AdminTextarea';
import Button from '@/components/ui/button';

type PartnerCategory = 'GOVERNMENT' | 'HOSPITAL' | 'PHARMA' | 'INVESTOR' | 'ASSOCIATION';

const CATEGORY_LABELS: Record<PartnerCategory, string> = {
    GOVERNMENT: 'Government',
    HOSPITAL: 'Hospital',
    PHARMA: 'Pharma',
    INVESTOR: 'Investor',
    ASSOCIATION: 'Association',
};

const CATEGORY_COLORS: Record<PartnerCategory, string> = {
    GOVERNMENT: 'bg-blue-100 text-blue-700',
    HOSPITAL: 'bg-emerald-100 text-emerald-700',
    PHARMA: 'bg-purple-100 text-purple-700',
    INVESTOR: 'bg-amber-100 text-amber-700',
    ASSOCIATION: 'bg-slate-100 text-slate-700',
};

interface Partner {
    id: string;
    name: string;
    logoUrl: string | null;
    websiteUrl: string | null;
    category: PartnerCategory;
    isActive: boolean;
    order: number;
    translations: Array<{
        id: string;
        localeCode: string;
        description: string | null;
        notes: string | null;
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
        websiteUrl: '',
        category: 'ASSOCIATION' as PartnerCategory,
        isActive: true,
        descriptions: {} as Record<string, string>,
        notes: {} as Record<string, string>,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            logoUrl: '',
            websiteUrl: '',
            category: 'ASSOCIATION',
            isActive: true,
            descriptions: {},
            notes: {},
        });
    };

    const openCreateModal = () => {
        resetForm();
        setEditingPartner(null);
        setIsCreating(true);
    };

    const openEditModal = (partner: Partner) => {
        const descriptions: Record<string, string> = {};
        const notes: Record<string, string> = {};
        partner.translations.forEach(t => {
            descriptions[t.localeCode] = t.description || '';
            notes[t.localeCode] = t.notes || '';
        });
        setFormData({
            name: partner.name,
            logoUrl: partner.logoUrl || '',
            websiteUrl: partner.websiteUrl || '',
            category: partner.category,
            isActive: partner.isActive,
            descriptions,
            notes,
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
        const payload = {
            name: formData.name,
            logoUrl: formData.logoUrl || null,
            websiteUrl: formData.websiteUrl || null,
            category: formData.category,
            isActive: formData.isActive,
            descriptions: formData.descriptions,
            notes: formData.notes,
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

        setPartners(newPartners);

        startTransition(async () => {
            try {
                const updates = newPartners.map((p, i) => ({ id: p.id, order: i }));
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

    // Category filter
    const [activeFilter, setActiveFilter] = useState<string>('ALL');

    // Filter partners by category
    const filteredPartners = activeFilter === 'ALL'
        ? partners
        : partners.filter(p => p.category === activeFilter);

    // Get unique categories from actual data
    const usedCategories = Array.from(new Set(partners.map(p => p.category)));

    return (
        <div>
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        {partners.length} partner{partners.length !== 1 ? 's' : ''}
                        {activeFilter !== 'ALL' && ` · ${filteredPartners.length} shown`}
                    </div>
                    <a
                        href="/en/partners"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        View Partners Page <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <Button onClick={openCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Partner
                </Button>
            </div>

            {/* Category Filter Tabs */}
            {partners.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-4 mb-4 -mx-1 px-1">
                    <button
                        onClick={() => setActiveFilter('ALL')}
                        className={`
                            px-3 py-1.5 text-xs font-medium rounded-full transition-all flex-shrink-0
                            ${activeFilter === 'ALL'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        All ({partners.length})
                    </button>
                    {usedCategories.map(cat => {
                        const count = partners.filter(p => p.category === cat).length;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`
                                    px-3 py-1.5 text-xs font-medium rounded-full transition-all flex-shrink-0
                                    ${activeFilter === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {CATEGORY_LABELS[cat as PartnerCategory] || cat} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Partners List */}
            {filteredPartners.length === 0 && partners.length === 0 ? (
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
            ) : filteredPartners.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No partners in this category.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-10 px-4 py-3"></th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Partner</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Category</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                                <th className="w-24 px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPartners.map((partner, index) => (
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
                                                disabled={index === filteredPartners.length - 1}
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
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${CATEGORY_COLORS[partner.category]}`}>
                                            {CATEGORY_LABELS[partner.category]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`
                                            px-2 py-1 text-xs font-medium rounded-full
                                            ${partner.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }
                                        `}>
                                            {partner.isActive ? 'Active' : 'Inactive'}
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
                                    placeholder="e.g., Ministry of Health"
                                    required
                                />
                                <AdminInput
                                    label="Website URL"
                                    value={formData.websiteUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                                    placeholder="https://..."
                                />
                            </div>

                            <AdminInput
                                label="Logo URL"
                                value={formData.logoUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                                placeholder="https://... or /uploads/logo.png"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as PartnerCategory }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.isActive ? 'active' : 'inactive'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
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
