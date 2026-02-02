'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import type { HeroSectionForm as HeroData } from '@/lib/admin/section-adapters';

interface HeroSectionFormProps {
    data: HeroData | null;
    onChange: (data: HeroData) => void;
}

export function HeroSectionForm({ data, onChange }: HeroSectionFormProps) {
    const formData: HeroData = data || {
        tagline: '',
        subtagline: '',
        ctaPrimary: { text: '', href: '' },
        ctaSecondary: { text: '', href: '' },
        quickLinks: [],
    };

    const handleChange = (field: keyof HeroData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Hero Section</strong> - The first thing visitors see. Make it compelling!
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Main Tagline <span className="text-red-500">*</span>
                </label>
                <AdminTextarea
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    placeholder="Based in Baku&#10;Your Gateway to Azerbaijan"
                    rows={3}
                    className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                    💡 Use line breaks (\n) for multi-line headlines. Example: "Based in Baku\nYour Gateway to Azerbaijan"
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subheadline
                </label>
                <AdminTextarea
                    value={formData.subtagline}
                    onChange={(e) => handleChange('subtagline', e.target.value)}
                    placeholder="Silkbridge International specializing in comprehensive tourism services..."
                    rows={2}
                    className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                    💡 Supporting text that appears below the main tagline. Keep it concise (1-2 sentences).
                </p>
            </div>

            <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Primary Call-to-Action Button</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Button Text <span className="text-red-500">*</span>
                        </label>
                        <AdminInput
                            value={formData.ctaPrimary.text}
                            onChange={(e) => handleChange('ctaPrimary', { ...formData.ctaPrimary, text: e.target.value })}
                            placeholder="Explore Our Services"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Link URL <span className="text-red-500">*</span>
                        </label>
                        <AdminInput
                            value={formData.ctaPrimary.href}
                            onChange={(e) => handleChange('ctaPrimary', { ...formData.ctaPrimary, href: e.target.value })}
                            placeholder="/services"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Secondary Call-to-Action Button (Optional)</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Button Text
                        </label>
                        <AdminInput
                            value={formData.ctaSecondary.text}
                            onChange={(e) => handleChange('ctaSecondary', { ...formData.ctaSecondary, text: e.target.value })}
                            placeholder="View Tour Packages"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Link URL
                        </label>
                        <AdminInput
                            value={formData.ctaSecondary.href}
                            onChange={(e) => handleChange('ctaSecondary', { ...formData.ctaSecondary, href: e.target.value })}
                            placeholder="/programs"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Quick Links (Optional)</h4>
                    <button
                        type="button"
                        onClick={() => handleChange('quickLinks', [...(formData.quickLinks || []), { text: '', href: '' }])}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        + Add Link
                    </button>
                </div>

                <div className="space-y-4">
                    {(formData.quickLinks || []).map((link, index) => (
                        <div key={index} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex-1 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Link Text
                                    </label>
                                    <AdminInput
                                        value={link.text}
                                        onChange={(e) => {
                                            const newLinks = [...(formData.quickLinks || [])];
                                            newLinks[index] = { ...newLinks[index], text: e.target.value };
                                            handleChange('quickLinks', newLinks);
                                        }}
                                        placeholder="E.g. Visa Support"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        URL
                                    </label>
                                    <AdminInput
                                        value={link.href}
                                        onChange={(e) => {
                                            const newLinks = [...(formData.quickLinks || [])];
                                            newLinks[index] = { ...newLinks[index], href: e.target.value };
                                            handleChange('quickLinks', newLinks);
                                        }}
                                        placeholder="/services#visa"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const newLinks = (formData.quickLinks || []).filter((_, i) => i !== index);
                                    handleChange('quickLinks', newLinks);
                                }}
                                className="text-red-600 hover:text-red-700 text-xs mt-8"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
