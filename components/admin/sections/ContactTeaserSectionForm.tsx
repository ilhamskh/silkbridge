'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import type { ContactTeaserSectionForm as ContactTeaserData } from '@/lib/admin/section-adapters';

interface ContactTeaserSectionFormProps {
    data: ContactTeaserData | null;
    onChange: (data: ContactTeaserData) => void;
}

export function ContactTeaserSectionForm({ data, onChange }: ContactTeaserSectionFormProps) {
    const formData: ContactTeaserData = data || {
        eyebrow: '',
        headline: '',
        description: '',
        cta: { text: '', href: '' },
    };

    const handleChange = (field: keyof ContactTeaserData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Contact Teaser</strong> - Encourage visitors to get in touch.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Eyebrow Text
                </label>
                <AdminInput
                    value={formData.eyebrow}
                    onChange={(e) => handleChange('eyebrow', e.target.value)}
                    placeholder="Get in Touch"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Headline <span className="text-red-500">*</span>
                </label>
                <AdminInput
                    value={formData.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    placeholder="Let's Start Planning Your Journey"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                </label>
                <AdminTextarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Contact us to learn more about our services..."
                    rows={3}
                />
            </div>

            <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Call-to-Action Button</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Button Text <span className="text-red-500">*</span>
                        </label>
                        <AdminInput
                            value={formData.cta.text}
                            onChange={(e) => handleChange('cta', { ...formData.cta, text: e.target.value })}
                            placeholder="Contact Us"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Link URL <span className="text-red-500">*</span>
                        </label>
                        <AdminInput
                            value={formData.cta.href}
                            onChange={(e) => handleChange('cta', { ...formData.cta, href: e.target.value })}
                            placeholder="/contact"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
