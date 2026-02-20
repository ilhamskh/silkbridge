'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminButton } from '../ui/AdminButton';
import { SingleImageUploader } from '../ui/SingleImageUploader';
import type { LogoGridSectionForm as LogoGridData } from '@/lib/admin/section-adapters';

interface LogoGridSectionFormProps {
    data: LogoGridData | null;
    onChange: (data: LogoGridData) => void;
}

export function LogoGridSectionForm({ data, onChange }: LogoGridSectionFormProps) {
    const formData: LogoGridData = data || {
        eyebrow: '',
        headline: '',
        logos: [],
    };

    const handleChange = (field: keyof LogoGridData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const addLogo = () => {
        const newLogos = [...formData.logos, {
            name: '',
            logo: { url: '', alt: '' },
            href: ''
        }];
        handleChange('logos', newLogos);
    };

    const updateLogo = (index: number, field: string, value: any) => {
        const newLogos = [...formData.logos];
        if (field === 'logo') {
            newLogos[index] = { ...newLogos[index], logo: value };
        } else {
            newLogos[index] = { ...newLogos[index], [field]: value };
        }
        handleChange('logos', newLogos);
    };

    const removeLogo = (index: number) => {
        const newLogos = formData.logos.filter((_, i) => i !== index);
        handleChange('logos', newLogos);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Logo Grid Section</strong> - Display partners or clients.
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
                        placeholder="Trusted By"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Headline
                    </label>
                    <AdminInput
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="Our Partners"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Logos</h4>
                    <AdminButton type="button" size="sm" onClick={addLogo}>
                        + Add Logo
                    </AdminButton>
                </div>

                {formData.logos.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No logos yet. Click "+ Add Logo" to add one.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.logos.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                            <div className="absolute top-2 right-2">
                                <button
                                    type="button"
                                    onClick={() => removeLogo(index)}
                                    className="text-red-600 hover:text-red-700 text-xs font-medium bg-white px-2 py-1 rounded shadow-sm"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="space-y-3 pt-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <AdminInput
                                        value={item.name}
                                        onChange={(e) => updateLogo(index, 'name', e.target.value)}
                                        placeholder="Partner Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Link URL (Optional)
                                    </label>
                                    <AdminInput
                                        value={item.href}
                                        onChange={(e) => updateLogo(index, 'href', e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="p-2 bg-white rounded border border-gray-200">
                                    <SingleImageUploader
                                        label="Logo Image"
                                        value={item.logo?.url || ''}
                                        onChange={(url) => updateLogo(index, 'logo', { ...item.logo, url })}
                                    />
                                    <div className="mt-2">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Alt Text
                                        </label>
                                        <AdminInput
                                            value={item.logo?.alt || ''}
                                            onChange={(e) => updateLogo(index, 'logo', { ...item.logo, alt: e.target.value })}
                                            placeholder="Alt text"
                                            className="text-xs"
                                        />
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
