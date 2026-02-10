'use client';

import { useState, useCallback } from 'react';
import type { SectionConfig, FieldSchema } from '@/lib/admin/page-config';
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from '@/components/admin/ui';

// ============================================
// Section Accordion Editor
// ============================================

interface SectionData {
    config: SectionConfig;
    data: Record<string, unknown>;
    isHidden: boolean;
}

interface SectionEditorProps {
    sections: SectionData[];
    onChange: (sections: SectionData[]) => void;
    disabled?: boolean;
}

export default function SectionEditor({ sections, onChange, disabled }: SectionEditorProps) {
    const [openSections, setOpenSections] = useState<Set<string>>(
        new Set(sections.filter(s => !s.isHidden).slice(0, 1).map(s => s.config.sectionId))
    );

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    const updateSection = useCallback((index: number, data: Record<string, unknown>) => {
        const next = [...sections];
        next[index] = { ...next[index], data };
        onChange(next);
    }, [sections, onChange]);

    const toggleVisibility = useCallback((index: number) => {
        const next = [...sections];
        next[index] = { ...next[index], isHidden: !next[index].isHidden };
        onChange(next);
    }, [sections, onChange]);

    return (
        <div className="space-y-3">
            {sections.map((section, index) => (
                <SectionAccordion
                    key={section.config.sectionId}
                    section={section}
                    isOpen={openSections.has(section.config.sectionId)}
                    onToggle={() => toggleSection(section.config.sectionId)}
                    onDataChange={(data) => updateSection(index, data)}
                    onVisibilityToggle={() => toggleVisibility(index)}
                    disabled={disabled}
                />
            ))}
        </div>
    );
}

// ============================================
// Single Section Accordion
// ============================================

function SectionAccordion({
    section,
    isOpen,
    onToggle,
    onDataChange,
    onVisibilityToggle,
    disabled,
}: {
    section: SectionData;
    isOpen: boolean;
    onToggle: () => void;
    onDataChange: (data: Record<string, unknown>) => void;
    onVisibilityToggle: () => void;
    disabled?: boolean;
}) {
    const { config, data, isHidden } = section;

    return (
        <div
            className={`border rounded-xl overflow-hidden transition-colors ${isHidden
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white'
                }`}
        >
            {/* Header */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <SectionIcon name={config.icon} />
                    <div>
                        <h3 className="font-semibold text-sm text-gray-900">{config.label}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isHidden && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            Hidden
                        </span>
                    )}
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Content */}
            {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100">
                    {/* Visibility Toggle */}
                    {config.canHide && (
                        <div className="flex items-center justify-between py-3 mb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Show this section on the page</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!isHidden}
                                    onChange={onVisibilityToggle}
                                    disabled={disabled}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                            </label>
                        </div>
                    )}

                    {/* Fields */}
                    <div className="space-y-4 mt-3">
                        {config.fields.map((field) => (
                            <FieldRenderer
                                key={field.key}
                                field={field}
                                value={data[field.key]}
                                onChange={(value) => onDataChange({ ...data, [field.key]: value })}
                                disabled={disabled || isHidden}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// Field Renderer (maps field config to input)
// ============================================

function FieldRenderer({
    field,
    value,
    onChange,
    disabled,
}: {
    field: FieldSchema;
    value: unknown;
    onChange: (value: unknown) => void;
    disabled?: boolean;
}) {
    switch (field.type) {
        case 'text':
            return (
                <AdminInput
                    label={field.label}
                    value={(value as string) ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    required={field.required}
                    helperText={field.hint}
                    disabled={disabled}
                />
            );

        case 'textarea':
        case 'richtext':
            return (
                <AdminTextarea
                    label={field.label}
                    value={(value as string) ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    required={field.required}
                    helperText={field.hint}
                    disabled={disabled}
                    rows={4}
                />
            );

        case 'url':
            return (
                <AdminInput
                    label={field.label}
                    value={(value as string) ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? 'https://...'}
                    required={field.required}
                    helperText={field.hint}
                    disabled={disabled}
                    type="url"
                />
            );

        case 'image':
            return (
                <AdminInput
                    label={field.label}
                    value={(value as string) ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Image URL"
                    required={field.required}
                    helperText={field.hint ?? 'Paste an image URL or upload via Settings.'}
                    disabled={disabled}
                />
            );

        case 'boolean':
            return (
                <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value === true}
                            onChange={(e) => onChange(e.target.checked)}
                            disabled={disabled}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                    <span className="text-sm text-gray-700">{field.label}</span>
                    {field.hint && <span className="text-xs text-gray-400">{field.hint}</span>}
                </div>
            );

        case 'select':
            return (
                <AdminSelect
                    label={field.label}
                    value={(value as string) ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    helperText={field.hint}
                    disabled={disabled}
                    options={(field.options ?? []).map(o => ({ label: o.label, value: o.value }))}
                />
            );

        case 'number':
            return (
                <AdminInput
                    label={field.label}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(Number(e.target.value) || 0)}
                    type="number"
                    required={field.required}
                    helperText={field.hint}
                    disabled={disabled}
                />
            );

        case 'array':
            return (
                <ArrayFieldRenderer
                    field={field}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            );

        default:
            return null;
    }
}

// ============================================
// Array Field Renderer (for nested items)
// ============================================

function ArrayFieldRenderer({
    field,
    value,
    onChange,
    disabled,
}: {
    field: FieldSchema;
    value: unknown;
    onChange: (value: unknown) => void;
    disabled?: boolean;
}) {
    const items = Array.isArray(value) ? value : [];
    const itemFields = field.itemFields ?? [];
    const maxItems = field.maxItems ?? 10;

    // For CTA buttons (maxItems=1), render inline instead of as array
    if (maxItems === 1) {
        const item = items[0] ?? {};
        return (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                <label className="block text-sm font-medium text-gray-700 mb-3">{field.label}</label>
                <div className="space-y-3">
                    {itemFields.map((subField) => (
                        <FieldRenderer
                            key={subField.key}
                            field={subField}
                            value={(item as Record<string, unknown>)[subField.key]}
                            onChange={(val) => {
                                const updated = { ...item as Record<string, unknown>, [subField.key]: val };
                                onChange([updated]);
                            }}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>
        );
    }

    const addItem = () => {
        if (items.length >= maxItems) return;
        const newItem: Record<string, unknown> = {};
        itemFields.forEach((f) => { newItem[f.key] = ''; });
        onChange([...items, newItem]);
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_: unknown, i: number) => i !== index));
    };

    const updateItem = (index: number, key: string, val: unknown) => {
        const next = [...items];
        next[index] = { ...(next[index] as Record<string, unknown>), [key]: val };
        onChange(next);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.hint && <span className="text-xs text-gray-400 ml-2 font-normal">{field.hint}</span>}
                </label>
                <span className="text-xs text-gray-400">{items.length}/{maxItems}</span>
            </div>

            <div className="space-y-3">
                {items.map((item: Record<string, unknown>, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 relative group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                disabled={disabled}
                                className="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="space-y-3">
                            {itemFields.map((subField) => {
                                // Special handling: "features" or multi-line text stored as arrays
                                if (subField.key === 'features' && subField.type === 'textarea') {
                                    const val = item[subField.key];
                                    const textValue = Array.isArray(val) ? (val as string[]).join('\n') : (val as string) ?? '';
                                    return (
                                        <AdminTextarea
                                            key={subField.key}
                                            label={subField.label}
                                            value={textValue}
                                            onChange={(e) => {
                                                const lines = e.target.value.split('\n').filter(Boolean);
                                                updateItem(index, subField.key, lines);
                                            }}
                                            rows={3}
                                            disabled={disabled}
                                            helperText={subField.hint}
                                        />
                                    );
                                }

                                // Special handling: tags stored as arrays
                                if (subField.key === 'tags' && subField.type === 'text') {
                                    const val = item[subField.key];
                                    const textValue = Array.isArray(val) ? (val as string[]).join(', ') : (val as string) ?? '';
                                    return (
                                        <AdminInput
                                            key={subField.key}
                                            label={subField.label}
                                            value={textValue}
                                            onChange={(e) => {
                                                const tags = e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean);
                                                updateItem(index, subField.key, tags);
                                            }}
                                            disabled={disabled}
                                            helperText={subField.hint}
                                        />
                                    );
                                }

                                return (
                                    <FieldRenderer
                                        key={subField.key}
                                        field={subField}
                                        value={item[subField.key]}
                                        onChange={(val) => updateItem(index, subField.key, val)}
                                        disabled={disabled}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {items.length < maxItems && (
                <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={addItem}
                    disabled={disabled}
                    className="mt-3"
                >
                    + Add {field.label.replace(/s$/, '')}
                </AdminButton>
            )}
        </div>
    );
}

// ============================================
// Section Icon Component
// ============================================

function SectionIcon({ name }: { name: string }) {
    const icons: Record<string, string> = {
        layout: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        handshake: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        megaphone: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
        type: 'M4 6h16M4 12h8m-8 6h16',
        clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
        users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        award: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
        list: 'M4 6h16M4 10h16M4 14h16M4 18h16',
        layers: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        map: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
        image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        help: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };

    const path = icons[name] || icons.layout;

    return (
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
        </svg>
    );
}
