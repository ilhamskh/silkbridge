'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import { AdminButton } from '../ui/AdminButton';
import type { ServicesSectionForm as ServicesData } from '@/lib/admin/section-adapters';

interface ServicesSectionFormProps {
    data: ServicesData | null;
    onChange: (data: ServicesData) => void;
}

export function ServicesSectionForm({ data, onChange }: ServicesSectionFormProps) {
    const formData: ServicesData = data || {
        eyebrow: '',
        headline: '',
        services: [],
    };

    const handleChange = (field: keyof ServicesData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const addService = () => {
        const newServices = [...formData.services, { title: '', description: '', features: [] }];
        handleChange('services', newServices);
    };

    const updateService = (index: number, field: string, value: any) => {
        const newServices = [...formData.services];
        newServices[index] = { ...newServices[index], [field]: value };
        handleChange('services', newServices);
    };

    const removeService = (index: number) => {
        const newServices = formData.services.filter((_, i) => i !== index);
        handleChange('services', newServices);
    };

    const addFeature = (serviceIndex: number) => {
        const newServices = [...formData.services];
        newServices[serviceIndex].features.push('');
        handleChange('services', newServices);
    };

    const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
        const newServices = [...formData.services];
        newServices[serviceIndex].features[featureIndex] = value;
        handleChange('services', newServices);
    };

    const removeFeature = (serviceIndex: number, featureIndex: number) => {
        const newServices = [...formData.services];
        newServices[serviceIndex].features = newServices[serviceIndex].features.filter((_, i) => i !== featureIndex);
        handleChange('services', newServices);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Services Section</strong> - Showcase your service offerings with clear descriptions.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Eyebrow Text
                </label>
                <AdminInput
                    value={formData.eyebrow}
                    onChange={(e) => handleChange('eyebrow', e.target.value)}
                    placeholder="OUR SERVICES"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Section Headline <span className="text-red-500">*</span>
                </label>
                <AdminInput
                    value={formData.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    placeholder="Comprehensive Tourism Solutions"
                />
            </div>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Services</h4>
                    <AdminButton type="button" size="sm" onClick={addService}>
                        + Add Service
                    </AdminButton>
                </div>

                {formData.services.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No services yet. Click "Add Service" to add your first one.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {formData.services.map((service, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-gray-900">Service #{index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => removeService(index)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Service Title <span className="text-red-500">*</span>
                                    </label>
                                    <AdminInput
                                        value={service.title}
                                        onChange={(e) => updateService(index, 'title', e.target.value)}
                                        placeholder="01 Air Tickets Reservation"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <AdminTextarea
                                        value={service.description}
                                        onChange={(e) => updateService(index, 'description', e.target.value)}
                                        placeholder="Brief description of this service..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Features (Optional)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => addFeature(index)}
                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            + Add Feature
                                        </button>
                                    </div>

                                    {service.features.length > 0 && (
                                        <div className="space-y-2">
                                            {service.features.map((feature, fIndex) => (
                                                <div key={fIndex} className="flex gap-2">
                                                    <AdminInput
                                                        value={feature}
                                                        onChange={(e) => updateFeature(index, fIndex, e.target.value)}
                                                        placeholder="Feature description..."
                                                        className="flex-1"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeature(index, fIndex)}
                                                        className="text-red-600 hover:text-red-700 text-sm px-2"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Call-to-Action (Optional)</h5>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Button Text</label>
                                            <AdminInput
                                                value={service.cta?.text || ''}
                                                onChange={(e) => updateService(index, 'cta', { ...service.cta, text: e.target.value })}
                                                placeholder="Learn More"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Link URL</label>
                                            <AdminInput
                                                value={service.cta?.href || ''}
                                                onChange={(e) => updateService(index, 'cta', { ...service.cta, href: e.target.value })}
                                                placeholder="/services/details"
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
