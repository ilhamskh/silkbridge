'use client';

import { AdminInput } from '../ui/AdminInput';
import { GallerySectionForm as GalleryData } from '@/lib/admin/section-adapters';

interface GallerySectionFormProps {
    data: GalleryData | null;
    onChange: (data: GalleryData) => void;
}

export function GallerySectionForm({ data, onChange }: GallerySectionFormProps) {
    const formData: GalleryData = data || {
        groupKey: '',
        headline: '',
        layout: 'grid',
    };

    const handleChange = (field: keyof GalleryData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Gallery Section</strong> - Display a collection of images.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Headline
                </label>
                <AdminInput
                    value={formData.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    placeholder="Our Gallery"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gallery Group Key <span className="text-red-500">*</span>
                </label>
                <AdminInput
                    value={formData.groupKey}
                    onChange={(e) => handleChange('groupKey', e.target.value)}
                    placeholder="health-tourism"
                />
                <p className="text-xs text-gray-500 mt-1">
                    The unique key of the gallery group to display. Manage groups in the "Galleries" page.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Layout
                </label>
                <select
                    value={formData.layout}
                    onChange={(e) => handleChange('layout', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                    <option value="grid">Grid</option>
                    <option value="carousel">Carousel</option>
                    <option value="masonry">Masonry</option>
                </select>
            </div>
        </div>
    );
}
