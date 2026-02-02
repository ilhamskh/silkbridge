'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import { AdminButton } from '../ui/AdminButton';
import type { TestimonialsSectionForm as TestimonialsData } from '@/lib/admin/section-adapters';

interface TestimonialsSectionFormProps {
    data: TestimonialsData | null;
    onChange: (data: TestimonialsData) => void;
}

export function TestimonialsSectionForm({ data, onChange }: TestimonialsSectionFormProps) {
    const formData: TestimonialsData = data || {
        eyebrow: '',
        headline: '',
        testimonials: [],
    };

    const handleChange = (field: keyof TestimonialsData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const addTestimonial = () => {
        const newTestimonials = [...formData.testimonials, {
            quote: '',
            author: '',
            role: '',
            company: ''
        }];
        handleChange('testimonials', newTestimonials);
    };

    const updateTestimonial = (index: number, field: string, value: any) => {
        const newTestimonials = [...formData.testimonials];
        if (field === 'image') {
            newTestimonials[index] = { ...newTestimonials[index], image: value };
        } else {
            newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        }
        handleChange('testimonials', newTestimonials);
    };

    const removeTestimonial = (index: number) => {
        const newTestimonials = formData.testimonials.filter((_, i) => i !== index);
        handleChange('testimonials', newTestimonials);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Testimonials Section</strong> - showcase customer feedback.
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
                        placeholder="Testimonials"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Headline <span className="text-red-500">*</span>
                    </label>
                    <AdminInput
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="What our clients say"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Testimonials</h4>
                    <AdminButton type="button" size="sm" onClick={addTestimonial}>
                        + Add Testimonial
                    </AdminButton>
                </div>

                {formData.testimonials.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No testimonials yet. Click "+ Add Testimonial" to create one.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {formData.testimonials.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    type="button"
                                    onClick={() => removeTestimonial(index)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>

                            <h5 className="text-sm font-medium text-gray-900 mb-4">Testimonial #{index + 1}</h5>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Quote <span className="text-red-500">*</span>
                                    </label>
                                    <AdminTextarea
                                        value={item.quote}
                                        onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                                        placeholder="Service was excellent..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Author Name <span className="text-red-500">*</span>
                                        </label>
                                        <AdminInput
                                            value={item.author}
                                            onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Role
                                        </label>
                                        <AdminInput
                                            value={item.role}
                                            onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                            placeholder="CEO"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Company
                                        </label>
                                        <AdminInput
                                            value={item.company}
                                            onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-2">
                                    <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Author Image</h6>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Image URL
                                            </label>
                                            <AdminInput
                                                value={item.image?.url || ''}
                                                onChange={(e) => updateTestimonial(index, 'image', { ...item.image, url: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Alt Text
                                            </label>
                                            <AdminInput
                                                value={item.image?.alt || ''}
                                                onChange={(e) => updateTestimonial(index, 'image', { ...item.image, alt: e.target.value })}
                                                placeholder="Portrait of John Doe"
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
