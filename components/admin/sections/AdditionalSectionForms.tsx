// Simple placeholder forms for sections - you can expand these later

'use client';

import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';
import { AdminButton } from '../ui/AdminButton';

// Story Section Form
export function StorySectionForm({ data, onChange }: any) {
    const formData = data || { title: '', paragraphs: [] };

    const addParagraph = () => {
        onChange({ ...formData, paragraphs: [...formData.paragraphs, ''] });
    };

    const updateParagraph = (index: number, value: string) => {
        const newParagraphs = [...formData.paragraphs];
        newParagraphs[index] = value;
        onChange({ ...formData, paragraphs: newParagraphs });
    };

    const removeParagraph = (index: number) => {
        const newParagraphs = formData.paragraphs.filter((_: any, i: number) => i !== index);
        onChange({ ...formData, paragraphs: newParagraphs });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Story Section</strong> - Share your company's narrative.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Section Title
                </label>
                <AdminInput
                    value={formData.title}
                    onChange={(e: any) => onChange({ ...formData, title: e.target.value })}
                    placeholder="Who are we?"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Story Paragraphs <span className="text-red-500">*</span>
                    </label>
                    <AdminButton type="button" size="sm" onClick={addParagraph}>
                        + Add Paragraph
                    </AdminButton>
                </div>

                <div className="space-y-3">
                    {formData.paragraphs.map((paragraph: string, index: number) => (
                        <div key={index} className="relative">
                            <AdminTextarea
                                value={paragraph}
                                onChange={(e: any) => updateParagraph(index, e.target.value)}
                                placeholder={`Paragraph ${index + 1}...`}
                                rows={3}
                            />
                            <button
                                type="button"
                                onClick={() => removeParagraph(index)}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Milestones Section Form
export function MilestonesSectionForm({ data, onChange }: any) {
    const formData = data || { milestones: [] };

    const addMilestone = () => {
        onChange({ milestones: [...formData.milestones, { year: '', event: '' }] });
    };

    const updateMilestone = (index: number, field: string, value: string) => {
        const newMilestones = [...formData.milestones];
        newMilestones[index] = { ...newMilestones[index], [field]: value };
        onChange({ milestones: newMilestones });
    };

    const removeMilestone = (index: number) => {
        const newMilestones = formData.milestones.filter((_: any, i: number) => i !== index);
        onChange({ milestones: newMilestones });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Milestones Section</strong> - Timeline of key achievements.
                </p>
            </div>

            <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Company Milestones</h4>
                <AdminButton type="button" size="sm" onClick={addMilestone}>
                    + Add Milestone
                </AdminButton>
            </div>

            <div className="space-y-4">
                {formData.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Milestone #{index + 1}</span>
                            <button
                                type="button"
                                onClick={() => removeMilestone(index)}
                                className="text-red-600 hover:text-red-700 text-sm"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Year <span className="text-red-500">*</span>
                                </label>
                                <AdminInput
                                    value={milestone.year}
                                    onChange={(e: any) => updateMilestone(index, 'year', e.target.value)}
                                    placeholder="2020"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Event <span className="text-red-500">*</span>
                                </label>
                                <AdminInput
                                    value={milestone.event}
                                    onChange={(e: any) => updateMilestone(index, 'event', e.target.value)}
                                    placeholder="Founded in Baku"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Values Section Form
export function ValuesSectionForm({ data, onChange }: any) {
    const formData = data || { title: '', subtitle: '', values: [] };

    const addValue = () => {
        onChange({ ...formData, values: [...formData.values, { title: '', description: '', icon: '' }] });
    };

    const updateValue = (index: number, field: string, value: string) => {
        const newValues = [...formData.values];
        newValues[index] = { ...newValues[index], [field]: value };
        onChange({ ...formData, values: newValues });
    };

    const removeValue = (index: number) => {
        const newValues = formData.values.filter((_: any, i: number) => i !== index);
        onChange({ ...formData, values: newValues });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Values Section</strong> - Core company values and principles.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Section Title
                </label>
                <AdminInput
                    value={formData.title}
                    onChange={(e: any) => onChange({ ...formData, title: e.target.value })}
                    placeholder="Why us?"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subtitle
                </label>
                <AdminInput
                    value={formData.subtitle}
                    onChange={(e: any) => onChange({ ...formData, subtitle: e.target.value })}
                    placeholder="Our core values"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Values</h4>
                    <AdminButton type="button" size="sm" onClick={addValue}>
                        + Add Value
                    </AdminButton>
                </div>

                <div className="space-y-4">
                    {formData.values.map((value: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-700">Value #{index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => removeValue(index)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="space-y-3">
                                <AdminInput
                                    value={value.title}
                                    onChange={(e: any) => updateValue(index, 'title', e.target.value)}
                                    placeholder="Value Title"
                                />
                                <AdminTextarea
                                    value={value.description}
                                    onChange={(e: any) => updateValue(index, 'description', e.target.value)}
                                    placeholder="Description..."
                                    rows={2}
                                />
                                <AdminInput
                                    value={value.icon || ''}
                                    onChange={(e: any) => updateValue(index, 'icon', e.target.value)}
                                    placeholder="Icon name (optional)"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Team Section Form
export function TeamSectionForm({ data, onChange }: any) {
    const formData = data || { title: '', subtitle: '', members: [] };

    const addMember = () => {
        onChange({ ...formData, members: [...formData.members, { name: '', role: '', bio: '', image: undefined }] });
    };

    const updateMember = (index: number, field: string, value: any) => {
        const newMembers = [...formData.members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        onChange({ ...formData, members: newMembers });
    };

    const removeMember = (index: number) => {
        const newMembers = formData.members.filter((_: any, i: number) => i !== index);
        onChange({ ...formData, members: newMembers });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Team Section</strong> - Introduce your leadership team.
                </p>
            </div>

            <AdminInput
                value={formData.title}
                onChange={(e: any) => onChange({ ...formData, title: e.target.value })}
                placeholder="Leadership Team"
            />
            <AdminInput
                value={formData.subtitle}
                onChange={(e: any) => onChange({ ...formData, subtitle: e.target.value })}
                placeholder="Meet our experts"
            />

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Team Members</h4>
                    <AdminButton type="button" size="sm" onClick={addMember}>
                        + Add Member
                    </AdminButton>
                </div>

                <div className="space-y-4">
                    {formData.members.map((member: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex justify-between mb-3">
                                <span className="font-medium">Member #{index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => removeMember(index)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="space-y-3">
                                <AdminInput
                                    value={member.name}
                                    onChange={(e: any) => updateMember(index, 'name', e.target.value)}
                                    placeholder="Full Name"
                                />
                                <AdminInput
                                    value={member.role}
                                    onChange={(e: any) => updateMember(index, 'role', e.target.value)}
                                    placeholder="Job Title"
                                />
                                <AdminTextarea
                                    value={member.bio}
                                    onChange={(e: any) => updateMember(index, 'bio', e.target.value)}
                                    placeholder="Bio..."
                                    rows={2}
                                />
                                <AdminInput
                                    value={member.image?.url || ''}
                                    onChange={(e: any) => updateMember(index, 'image', e.target.value ? { url: e.target.value, alt: member.name } : undefined)}
                                    placeholder="Photo URL (optional)"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// CTA Section Form
export function CTASectionForm({ data, onChange }: any) {
    const formData = data || {
        headline: '',
        description: '',
        primaryButton: { text: '', href: '' },
        secondaryButton: undefined,
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Call to Action</strong> - Final conversion section.
                </p>
            </div>

            <AdminInput
                value={formData.headline}
                onChange={(e: any) => onChange({ ...formData, headline: e.target.value })}
                placeholder="Ready to Get Started?"
            />
            <AdminTextarea
                value={formData.description}
                onChange={(e: any) => onChange({ ...formData, description: e.target.value })}
                placeholder="Description..."
                rows={2}
            />

            <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Primary Button</h4>
                <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                        value={formData.primaryButton.text}
                        onChange={(e: any) => onChange({ ...formData, primaryButton: { ...formData.primaryButton, text: e.target.value } })}
                        placeholder="Button Text"
                    />
                    <AdminInput
                        value={formData.primaryButton.href}
                        onChange={(e: any) => onChange({ ...formData, primaryButton: { ...formData.primaryButton, href: e.target.value } })}
                        placeholder="/contact"
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Secondary Button (Optional)</h4>
                <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                        value={formData.secondaryButton?.text || ''}
                        onChange={(e: any) => onChange({ ...formData, secondaryButton: e.target.value ? { text: e.target.value, href: formData.secondaryButton?.href || '' } : undefined })}
                        placeholder="Button Text"
                    />
                    <AdminInput
                        value={formData.secondaryButton?.href || ''}
                        onChange={(e: any) => onChange({ ...formData, secondaryButton: formData.secondaryButton ? { ...formData.secondaryButton, href: e.target.value } : undefined })}
                        placeholder="/services"
                    />
                </div>
            </div>
        </div>
    );
}

// Contact Form Section
export function ContactFormSectionForm({ data, onChange }: any) {
    const formData = data || {
        eyebrow: '',
        headline: '',
        description: '',
        showForm: true,
        showMap: true,
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Contact Form</strong> - Contact form and information.
                </p>
            </div>

            <AdminInput
                value={formData.eyebrow}
                onChange={(e: any) => onChange({ ...formData, eyebrow: e.target.value })}
                placeholder="Contact Us"
            />
            <AdminInput
                value={formData.headline}
                onChange={(e: any) => onChange({ ...formData, headline: e.target.value })}
                placeholder="Get in Touch"
            />
            <AdminTextarea
                value={formData.description}
                onChange={(e: any) => onChange({ ...formData, description: e.target.value })}
                placeholder="Description..."
                rows={3}
            />

            <div className="space-y-3">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.showForm}
                        onChange={(e) => onChange({ ...formData, showForm: e.target.checked })}
                        className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Contact Form</span>
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.showMap}
                        onChange={(e) => onChange({ ...formData, showMap: e.target.checked })}
                        className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Map</span>
                </label>
            </div>
        </div>
    );
}
