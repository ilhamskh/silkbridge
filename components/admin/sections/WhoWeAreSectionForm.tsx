'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import { AdminButton } from '../ui/AdminButton';
import type { WhoWeAreSectionForm as WhoWeAreData } from '@/lib/admin/section-adapters';

interface WhoWeAreSectionFormProps {
    data: WhoWeAreData | null;
    onChange: (data: WhoWeAreData) => void;
}

export function WhoWeAreSectionForm({ data, onChange }: WhoWeAreSectionFormProps) {
    const formData: WhoWeAreData = data || {
        eyebrow: '',
        headline: '',
        headlineAccent: '',
        mission: '',
        pillars: [],
    };

    const handleChange = (field: keyof WhoWeAreData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const addPillar = () => {
        const newPillars = [...formData.pillars, { title: '', description: '', icon: '' }];
        handleChange('pillars', newPillars);
    };

    const updatePillar = (index: number, field: string, value: string) => {
        const newPillars = [...formData.pillars];
        newPillars[index] = { ...newPillars[index], [field]: value };
        handleChange('pillars', newPillars);
    };

    const removePillar = (index: number) => {
        const newPillars = formData.pillars.filter((_, i) => i !== index);
        handleChange('pillars', newPillars);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Who We Are Section</strong> - Introduce your company with mission and value pillars.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Eyebrow Text
                </label>
                <AdminInput
                    value={formData.eyebrow}
                    onChange={(e) => handleChange('eyebrow', e.target.value)}
                    placeholder="Who are we?"
                />
                <p className="text-xs text-gray-500 mt-1">
                    💡 Small text that appears above the headline. Optional.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Headline Part 1 <span className="text-red-500">*</span>
                    </label>
                    <AdminInput
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="Experience, Talent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Headline Part 2 (Accent)
                    </label>
                    <AdminInput
                        value={formData.headlineAccent}
                        onChange={(e) => handleChange('headlineAccent', e.target.value)}
                        placeholder="Hospitality"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        💡 This part will be styled differently (accent color).
                    </p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mission Statement <span className="text-red-500">*</span>
                </label>
                <AdminTextarea
                    value={formData.mission}
                    onChange={(e) => handleChange('mission', e.target.value)}
                    placeholder="Our experience, talent, hospitality, flexibility, and expertise are harmoniously combined..."
                    rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                    💡 Describe what your company does and your approach. 2-3 sentences recommended.
                </p>
            </div>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Value Pillars</h4>
                    <AdminButton type="button" size="sm" onClick={addPillar}>
                        + Add Pillar
                    </AdminButton>
                </div>

                {formData.pillars.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No pillars yet. Click "Add Pillar" to add your first one.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {formData.pillars.map((pillar, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-700">Pillar #{index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => removePillar(index)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <AdminInput
                                        value={pillar.title}
                                        onChange={(e) => updatePillar(index, 'title', e.target.value)}
                                        placeholder="Quality is our focus"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <AdminTextarea
                                        value={pillar.description}
                                        onChange={(e) => updatePillar(index, 'description', e.target.value)}
                                        placeholder="We hold ourselves to the highest standards..."
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Icon (Optional)
                                    </label>
                                    <AdminInput
                                        value={pillar.icon || ''}
                                        onChange={(e) => updatePillar(index, 'icon', e.target.value)}
                                        placeholder="quality"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        💡 Icon identifier for the frontend (e.g., "quality", "experience").
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
