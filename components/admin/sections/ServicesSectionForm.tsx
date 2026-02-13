'use client';

import { useState } from 'react';
import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import { AdminButton } from '../ui/AdminButton';
import { ChevronDown, GripVertical, Trash2, Plus } from 'lucide-react';
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

    // Track which service panels are expanded
    const [expandedPanels, setExpandedPanels] = useState<Set<number>>(
        new Set(formData.services.length > 0 ? [0] : [])
    );

    const togglePanel = (index: number) => {
        setExpandedPanels(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const handleChange = (field: keyof ServicesData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const addService = () => {
        const newIndex = formData.services.length;
        const newServices = [...formData.services, { title: '', description: '', features: [] }];
        handleChange('services', newServices);
        setExpandedPanels(prev => new Set(prev).add(newIndex));
    };

    const updateService = (index: number, field: string, value: any) => {
        const newServices = [...formData.services];
        newServices[index] = { ...newServices[index], [field]: value };
        handleChange('services', newServices);
    };

    const removeService = (index: number) => {
        const newServices = formData.services.filter((_, i) => i !== index);
        handleChange('services', newServices);
        setExpandedPanels(prev => {
            const next = new Set<number>();
            prev.forEach(i => {
                if (i < index) next.add(i);
                else if (i > index) next.add(i - 1);
            });
            return next;
        });
    };

    const addFeature = (serviceIndex: number) => {
        const newServices = [...formData.services];
        newServices[serviceIndex] = {
            ...newServices[serviceIndex],
            features: [...newServices[serviceIndex].features, ''],
        };
        handleChange('services', newServices);
    };

    const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
        const newServices = [...formData.services];
        const features = [...newServices[serviceIndex].features];
        features[featureIndex] = value;
        newServices[serviceIndex] = { ...newServices[serviceIndex], features };
        handleChange('services', newServices);
    };

    const removeFeature = (serviceIndex: number, featureIndex: number) => {
        const newServices = [...formData.services];
        newServices[serviceIndex] = {
            ...newServices[serviceIndex],
            features: newServices[serviceIndex].features.filter((_, i) => i !== featureIndex),
        };
        handleChange('services', newServices);
    };

    const moveService = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= formData.services.length) return;

        const newServices = [...formData.services];
        [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];
        handleChange('services', newServices);

        // Update expanded panels to follow the moved item
        setExpandedPanels(prev => {
            const next = new Set<number>();
            prev.forEach(i => {
                if (i === index) next.add(newIndex);
                else if (i === newIndex) next.add(index);
                else next.add(i);
            });
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Services Section</strong> — The first 6 services appear in the interactive switcher on the
                    public site. Additional services appear as compact cards below.
                </p>
            </div>

            {/* Section-level fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Eyebrow Text
                    </label>
                    <AdminInput
                        value={formData.eyebrow}
                        onChange={(e) => handleChange('eyebrow', e.target.value)}
                        placeholder="OUR SERVICES"
                    />
                    <p className="mt-1 text-xs text-gray-500">Small uppercase label above the headline</p>
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
            </div>

            {/* Service Items List */}
            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="font-medium text-gray-900">Service Items</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{formData.services.length} services configured</p>
                    </div>
                    <AdminButton type="button" size="sm" onClick={addService}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Service
                    </AdminButton>
                </div>

                {formData.services.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No services yet. Click &quot;Add Service&quot; to add your first one.</p>
                    </div>
                )}

                <div className="space-y-2">
                    {formData.services.map((service, index) => {
                        const isExpanded = expandedPanels.has(index);
                        const isInSwitcher = index < 6;

                        return (
                            <div
                                key={index}
                                className={`border rounded-lg bg-white shadow-sm ${isInSwitcher ? 'border-blue-200' : 'border-gray-200'}`}
                            >
                                {/* Collapsed header */}
                                <button
                                    type="button"
                                    onClick={() => togglePanel(index)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
                                >
                                    <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />

                                    <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${isInSwitcher ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium text-gray-900 block truncate">
                                            {service.title || 'Untitled Service'}
                                        </span>
                                        {!isExpanded && service.description && (
                                            <span className="text-xs text-gray-500 block truncate mt-0.5">
                                                {service.description}
                                            </span>
                                        )}
                                    </div>

                                    {isInSwitcher && (
                                        <span className="px-1.5 py-0.5 text-[0.6rem] font-semibold bg-blue-100 text-blue-700 rounded">
                                            SWITCHER
                                        </span>
                                    )}

                                    {/* Position controls */}
                                    <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={() => moveService(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move up"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveService(index, 'down')}
                                            disabled={index === formData.services.length - 1}
                                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move down"
                                        >
                                            ↓
                                        </button>
                                    </div>

                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Expanded content */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 pt-2 border-t">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Service Title <span className="text-red-500">*</span>
                                                </label>
                                                <AdminInput
                                                    value={service.title}
                                                    onChange={(e) => updateService(index, 'title', e.target.value)}
                                                    placeholder="Air Tickets Reservation"
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
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Sentences become &quot;What&apos;s included&quot; bullets automatically
                                                </p>
                                            </div>

                                            {/* Features */}
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
                                                <p className="text-xs text-gray-500 mb-2">
                                                    When present, features replace auto-derived bullets in the switcher panel
                                                </p>

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

                                            {/* CTA */}
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

                                            {/* Delete button */}
                                            <div className="border-t pt-3 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeService(index)}
                                                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Remove Service
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
