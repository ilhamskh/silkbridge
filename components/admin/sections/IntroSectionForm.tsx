'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import type { IntroSectionForm as IntroData } from '@/lib/admin/section-adapters';

interface IntroSectionFormProps {
    data: IntroData | null;
    onChange: (data: IntroData) => void;
}

export function IntroSectionForm({ data, onChange }: IntroSectionFormProps) {
    const formData: IntroData = data || {
        eyebrow: '',
        headline: '',
        headlineAccent: '',
        text: '',
    };

    const handleChange = (field: keyof IntroData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Page Introduction</strong> - The header section for this page.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Eyebrow Text
                </label>
                <AdminInput
                    value={formData.eyebrow}
                    onChange={(e) => handleChange('eyebrow', e.target.value)}
                    placeholder="About Us"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Headline <span className="text-red-500">*</span>
                    </label>
                    <AdminInput
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="Silkbridge International"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Headline Accent
                    </label>
                    <AdminInput
                        value={formData.headlineAccent}
                        onChange={(e) => handleChange('headlineAccent', e.target.value)}
                        placeholder="Based in Baku"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        💡 This part will be styled with an accent color.
                    </p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Introduction Text
                </label>
                <AdminTextarea
                    value={formData.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    placeholder="Specializing in a wide range of comprehensive tourism services..."
                    rows={4}
                />
            </div>
        </div>
    );
}
