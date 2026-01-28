'use client';

import { useState } from 'react';
import type { ContentBlock } from '@/lib/validations';

interface BlocksEditorProps {
    blocks: ContentBlock[];
    onChange: (blocks: ContentBlock[]) => void;
}

const BLOCK_TYPES = [
    { type: 'hero', label: 'Hero Section', icon: '🎯' },
    { type: 'intro', label: 'Page Intro', icon: '📋' },
    { type: 'heading', label: 'Heading', icon: '📝' },
    { type: 'paragraph', label: 'Paragraph', icon: '📄' },
    { type: 'bullets', label: 'Bullet List', icon: '📌' },
    { type: 'quote', label: 'Quote', icon: '💬' },
    { type: 'callout', label: 'Callout Box', icon: '📢' },
    { type: 'stats', label: 'Stats', icon: '📊' },
    { type: 'statsRow', label: 'Stats Row', icon: '📈' },
    { type: 'about', label: 'About Section', icon: '👥' },
    { type: 'services', label: 'Services Section', icon: '🛠️' },
    { type: 'serviceDetails', label: 'Service Details', icon: '📋' },
    { type: 'partners', label: 'Partners Section', icon: '🤝' },
    { type: 'contact', label: 'Contact Section', icon: '📧' },
    { type: 'insights', label: 'Insights Section', icon: '💡' },
    { type: 'values', label: 'Values Section', icon: '⭐' },
    { type: 'team', label: 'Team Section', icon: '👨‍💼' },
    { type: 'milestones', label: 'Milestones', icon: '🎯' },
    { type: 'process', label: 'Process Steps', icon: '🔄' },
    { type: 'story', label: 'Story Section', icon: '📖' },
    { type: 'cta', label: 'Call to Action', icon: '🚀' },
    { type: 'divider', label: 'Divider', icon: '➖' },
    { type: 'image', label: 'Image', icon: '🖼️' },
];

export default function BlocksEditor({ blocks, onChange }: BlocksEditorProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showAddMenu, setShowAddMenu] = useState(false);

    const addBlock = (type: string) => {
        const newBlock = createDefaultBlock(type);
        if (newBlock) {
            onChange([...blocks, newBlock]);
            setSelectedIndex(blocks.length);
        }
        setShowAddMenu(false);
    };

    const updateBlock = (index: number, updatedBlock: ContentBlock) => {
        const newBlocks = [...blocks];
        newBlocks[index] = updatedBlock;
        onChange(newBlocks);
    };

    const removeBlock = (index: number) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        onChange(newBlocks);
        setSelectedIndex(null);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= blocks.length) return;

        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
        onChange(newBlocks);
        setSelectedIndex(newIndex);
    };

    return (
        <div className="space-y-4">
            {/* Blocks List */}
            {blocks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted mb-4">No content blocks yet</p>
                    <button
                        onClick={() => setShowAddMenu(true)}
                        className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                        Add First Block
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {blocks.map((block, index) => (
                        <BlockItem
                            key={index}
                            block={block}
                            index={index}
                            isSelected={selectedIndex === index}
                            onSelect={() => setSelectedIndex(selectedIndex === index ? null : index)}
                            onUpdate={(updatedBlock) => updateBlock(index, updatedBlock)}
                            onRemove={() => removeBlock(index)}
                            onMoveUp={() => moveBlock(index, 'up')}
                            onMoveDown={() => moveBlock(index, 'down')}
                            canMoveUp={index > 0}
                            canMoveDown={index < blocks.length - 1}
                        />
                    ))}
                </div>
            )}

            {/* Add Block Button */}
            <div className="relative">
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Block
                </button>

                {/* Add Block Menu */}
                {showAddMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowAddMenu(false)}
                        />
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-border-light shadow-lg z-20 max-h-80 overflow-y-auto">
                            <div className="p-2 grid grid-cols-2 gap-1">
                                {BLOCK_TYPES.map((blockType) => (
                                    <button
                                        key={blockType.type}
                                        onClick={() => addBlock(blockType.type)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left hover:bg-surface transition-colors"
                                    >
                                        <span>{blockType.icon}</span>
                                        <span>{blockType.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

interface BlockItemProps {
    block: ContentBlock;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (block: ContentBlock) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

function BlockItem({
    block,
    index,
    isSelected,
    onSelect,
    onUpdate,
    onRemove,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
}: BlockItemProps) {
    const blockInfo = BLOCK_TYPES.find((t) => t.type === block.type);

    return (
        <div
            className={`border rounded-xl transition-all ${isSelected ? 'border-primary-300 ring-2 ring-primary-100' : 'border-border-light hover:border-primary-200'
                }`}
        >
            {/* Block Header */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={onSelect}
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">{blockInfo?.icon || '📦'}</span>
                    <span className="font-medium text-ink">{blockInfo?.label || block.type}</span>
                    <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveUp();
                        }}
                        disabled={!canMoveUp}
                        className="p-1.5 rounded text-muted hover:text-ink hover:bg-surface disabled:opacity-30 transition-colors"
                        title="Move up"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveDown();
                        }}
                        disabled={!canMoveDown}
                        className="p-1.5 rounded text-muted hover:text-ink hover:bg-surface disabled:opacity-30 transition-colors"
                        title="Move down"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Remove this block?')) onRemove();
                        }}
                        className="p-1.5 rounded text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove block"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Block Editor */}
            {isSelected && (
                <div className="px-4 pb-4 border-t border-border-light pt-4">
                    <BlockEditor block={block} onUpdate={onUpdate} />
                </div>
            )}
        </div>
    );
}

interface BlockEditorProps {
    block: ContentBlock;
    onUpdate: (block: ContentBlock) => void;
}

function BlockEditor({ block, onUpdate }: BlockEditorProps) {
    // Generic field renderer based on block type
    switch (block.type) {
        case 'heading':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Level</label>
                        <select
                            value={block.level}
                            onChange={(e) => onUpdate({ ...block, level: parseInt(e.target.value) as 1 | 2 | 3 | 4 })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        >
                            <option value={1}>H1 - Main Title</option>
                            <option value={2}>H2 - Section Title</option>
                            <option value={3}>H3 - Subsection</option>
                            <option value={4}>H4 - Small Heading</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Text</label>
                        <input
                            type="text"
                            value={block.text}
                            onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        />
                    </div>
                </div>
            );

        case 'paragraph':
            return (
                <div>
                    <label className="block text-sm font-medium text-ink mb-2">Text</label>
                    <textarea
                        value={block.text}
                        onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                    />
                </div>
            );

        case 'hero':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Tagline</label>
                        <textarea
                            value={block.tagline}
                            onChange={(e) => onUpdate({ ...block, tagline: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                            placeholder="Main headline (use \n for line breaks)"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Subtagline</label>
                        <textarea
                            value={block.subtagline || ''}
                            onChange={(e) => onUpdate({ ...block, subtagline: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Primary CTA Text</label>
                            <input
                                type="text"
                                value={block.ctaPrimary?.text || ''}
                                onChange={(e) =>
                                    onUpdate({
                                        ...block,
                                        ctaPrimary: { ...block.ctaPrimary, text: e.target.value, href: block.ctaPrimary?.href || '' },
                                    })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Primary CTA Link</label>
                            <input
                                type="text"
                                value={block.ctaPrimary?.href || ''}
                                onChange={(e) =>
                                    onUpdate({
                                        ...block,
                                        ctaPrimary: { ...block.ctaPrimary, href: e.target.value, text: block.ctaPrimary?.text || '' },
                                    })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
            );

        case 'intro':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Eyebrow</label>
                        <input
                            type="text"
                            value={block.eyebrow || ''}
                            onChange={(e) => onUpdate({ ...block, eyebrow: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Headline</label>
                        <input
                            type="text"
                            value={block.headline}
                            onChange={(e) => onUpdate({ ...block, headline: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Headline Accent</label>
                        <input
                            type="text"
                            value={block.headlineAccent || ''}
                            onChange={(e) => onUpdate({ ...block, headlineAccent: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Description Text</label>
                        <textarea
                            value={block.text || ''}
                            onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                        />
                    </div>
                </div>
            );

        case 'bullets':
            return (
                <div>
                    <label className="block text-sm font-medium text-ink mb-2">Items (one per line)</label>
                    <textarea
                        value={block.items.join('\n')}
                        onChange={(e) =>
                            onUpdate({ ...block, items: e.target.value.split('\n').filter((item) => item.trim()) })
                        }
                        rows={6}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                    />
                </div>
            );

        case 'quote':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Quote Text</label>
                        <textarea
                            value={block.text}
                            onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Attribution</label>
                        <input
                            type="text"
                            value={block.by || ''}
                            onChange={(e) => onUpdate({ ...block, by: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        />
                    </div>
                </div>
            );

        case 'cta':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Headline</label>
                        <input
                            type="text"
                            value={block.headline}
                            onChange={(e) => onUpdate({ ...block, headline: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Description</label>
                        <textarea
                            value={block.description || ''}
                            onChange={(e) => onUpdate({ ...block, description: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Button Text</label>
                            <input
                                type="text"
                                value={block.primaryButton?.text || ''}
                                onChange={(e) =>
                                    onUpdate({
                                        ...block,
                                        primaryButton: { text: e.target.value, href: block.primaryButton?.href || '' },
                                    })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Button Link</label>
                            <input
                                type="text"
                                value={block.primaryButton?.href || ''}
                                onChange={(e) =>
                                    onUpdate({
                                        ...block,
                                        primaryButton: { href: e.target.value, text: block.primaryButton?.text || '' },
                                    })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                            />
                        </div>
                    </div>
                </div>
            );

        case 'contact':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Headline</label>
                        <input
                            type="text"
                            value={block.headline}
                            onChange={(e) => onUpdate({ ...block, headline: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Description</label>
                        <textarea
                            value={block.description || ''}
                            onChange={(e) => onUpdate({ ...block, description: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm resize-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={block.showForm}
                                onChange={(e) => onUpdate({ ...block, showForm: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm">Show Form</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={block.showMap}
                                onChange={(e) => onUpdate({ ...block, showMap: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm">Show Map</span>
                        </label>
                    </div>
                </div>
            );

        case 'divider':
            return <p className="text-sm text-muted">This block adds a visual divider between sections.</p>;

        default:
            return (
                <div className="space-y-4">
                    <p className="text-sm text-muted">
                        Edit this block using the JSON editor below. Changes will be validated on save.
                    </p>
                    <textarea
                        value={JSON.stringify(block, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                onUpdate(parsed);
                            } catch {
                                // Invalid JSON, don't update
                            }
                        }}
                        rows={12}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm font-mono resize-none"
                    />
                </div>
            );
    }
}

function createDefaultBlock(type: string): ContentBlock | null {
    switch (type) {
        case 'heading':
            return { type: 'heading', level: 2, text: 'New Heading' };
        case 'paragraph':
            return { type: 'paragraph', text: 'Enter your paragraph text here.' };
        case 'hero':
            return {
                type: 'hero',
                tagline: 'Your Headline Here',
                subtagline: 'Your subheadline text goes here.',
            };
        case 'intro':
            return {
                type: 'intro',
                eyebrow: 'Section Label',
                headline: 'Main Headline',
                headlineAccent: 'Accent Text',
                text: 'Introduction paragraph text.',
            };
        case 'bullets':
            return { type: 'bullets', items: ['First item', 'Second item', 'Third item'] };
        case 'quote':
            return { type: 'quote', text: 'Your quote text here.', by: 'Author Name' };
        case 'callout':
            return { type: 'callout', title: 'Callout Title', text: 'Callout content here.' };
        case 'stats':
            return {
                type: 'stats',
                items: [
                    { label: 'Stat Label', value: '100+', note: 'Source' },
                ],
            };
        case 'statsRow':
            return {
                type: 'statsRow',
                stats: [
                    { value: '100+', label: 'Stat Label' },
                    { value: '50', label: 'Another Stat' },
                ],
            };
        case 'about':
            return {
                type: 'about',
                eyebrow: 'About Us',
                headline: 'Company Name',
                headlineAccent: 'Tagline',
                mission: 'Your mission statement here.',
                pillars: [{ title: 'Pillar 1', description: 'Description', icon: 'star' }],
            };
        case 'services':
            return {
                type: 'services',
                eyebrow: 'Our Services',
                headline: 'What We Offer',
                services: [
                    {
                        title: 'Service Name',
                        description: 'Service description.',
                        features: ['Feature 1', 'Feature 2'],
                    },
                ],
            };
        case 'serviceDetails':
            return {
                type: 'serviceDetails',
                serviceId: 'service1',
                title: 'Service Title',
                description: 'Service description.',
                features: ['Feature 1', 'Feature 2'],
            };
        case 'partners':
            return {
                type: 'partners',
                eyebrow: 'Our Partners',
                headline: 'Trusted Partners',
                description: 'Partner description.',
            };
        case 'contact':
            return {
                type: 'contact',
                headline: 'Get in Touch',
                description: 'Contact us today.',
                showForm: true,
                showMap: true,
            };
        case 'insights':
            return {
                type: 'insights',
                eyebrow: 'Insights',
                headline: 'Market Intelligence',
            };
        case 'values':
            return {
                type: 'values',
                title: 'Our Values',
                values: [{ title: 'Value 1', description: 'Description' }],
            };
        case 'team':
            return {
                type: 'team',
                title: 'Our Team',
                members: [{ name: 'Team Member', role: 'Position', bio: 'Bio text' }],
            };
        case 'milestones':
            return {
                type: 'milestones',
                milestones: [{ year: '2024', event: 'Company founded' }],
            };
        case 'process':
            return {
                type: 'process',
                title: 'Our Process',
                steps: [{ title: 'Step 1', description: 'Description' }],
            };
        case 'story':
            return {
                type: 'story',
                title: 'Our Story',
                paragraphs: ['First paragraph.', 'Second paragraph.'],
            };
        case 'cta':
            return {
                type: 'cta',
                headline: 'Ready to Get Started?',
                description: 'Contact us today.',
                primaryButton: { text: 'Get Started', href: '/contact' },
            };
        case 'divider':
            return { type: 'divider' };
        case 'image':
            return { type: 'image', src: '', alt: 'Image description' };
        default:
            return null;
    }
}
