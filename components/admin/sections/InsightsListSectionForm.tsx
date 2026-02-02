'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import { AdminButton } from '../ui/AdminButton';
import type { InsightsListSectionForm as InsightsListData } from '@/lib/admin/section-adapters';

interface InsightsListSectionFormProps {
    data: InsightsListData | null;
    onChange: (data: InsightsListData) => void;
}

export function InsightsListSectionForm({ data, onChange }: InsightsListSectionFormProps) {
    const formData: InsightsListData = data || {
        eyebrow: '',
        headline: '',
        viewAllHref: '',
        items: [],
    };

    const handleChange = (field: keyof InsightsListData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const addItem = () => {
        const newItems = [...formData.items, {
            title: '',
            excerpt: '',
            date: '',
            href: ''
        }];
        handleChange('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        if (field === 'image') {
            newItems[index] = { ...newItems[index], image: value };
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        handleChange('items', newItems);
    };

    const removeItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        handleChange('items', newItems);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Insights List Section</strong> - Display latest news or articles.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Eyebrow
                    </label>
                    <AdminInput
                        value={formData.eyebrow}
                        onChange={(e) => handleChange('eyebrow', e.target.value)}
                        placeholder="Insights"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Headline <span className="text-red-500">*</span>
                    </label>
                    <AdminInput
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="Latest News"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        View All Link
                    </label>
                    <AdminInput
                        value={formData.viewAllHref}
                        onChange={(e) => handleChange('viewAllHref', e.target.value)}
                        placeholder="/insights"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Insight Items</h4>
                    <AdminButton type="button" size="sm" onClick={addItem}>
                        + Add Insight
                    </AdminButton>
                </div>

                {formData.items.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No items yet. Click "+ Add Insight" to create one.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {formData.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>

                            <h5 className="text-sm font-medium text-gray-900 mb-4">Item #{index + 1}</h5>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <AdminInput
                                        value={item.title}
                                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                                        placeholder="Article Title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Excerpt <span className="text-red-500">*</span>
                                    </label>
                                    <AdminTextarea
                                        value={item.excerpt}
                                        onChange={(e) => updateItem(index, 'excerpt', e.target.value)}
                                        placeholder="Short summary..."
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Date
                                        </label>
                                        <AdminInput
                                            value={item.date}
                                            onChange={(e) => updateItem(index, 'date', e.target.value)}
                                            placeholder="Oct 12, 2023"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Link URL
                                        </label>
                                        <AdminInput
                                            value={item.href}
                                            onChange={(e) => updateItem(index, 'href', e.target.value)}
                                            placeholder="/insights/..."
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-2">
                                    <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cover Image</h6>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Image URL
                                            </label>
                                            <AdminInput
                                                value={item.image?.url || ''}
                                                onChange={(e) => updateItem(index, 'image', { ...item.image, url: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Alt Text
                                            </label>
                                            <AdminInput
                                                value={item.image?.alt || ''}
                                                onChange={(e) => updateItem(index, 'image', { ...item.image, alt: e.target.value })}
                                                placeholder="Image description"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
