'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminCard, AdminCardHeader, AdminCardContent } from './ui/AdminCard';
import { AdminButton } from './ui/AdminButton';
import { AdminIcon } from './ui/AdminIcon';
import { AdminInput } from './ui/AdminInput';
import { AdminTextarea } from './ui/AdminTextarea';
import { AdminBadge } from './ui/AdminBadge';
import { AdminModal } from './ui/AdminModal';

// Simple EditorBlock type for the visual editor
export interface EditorBlock {
    id: string;
    type: string;
    data: Record<string, unknown>;
}

// Block type definitions
const BLOCK_TYPES = {
    hero: { label: 'Hero Banner', icon: 'image' as const, description: 'Large hero section with title and CTA' },
    text: { label: 'Text Block', icon: 'text' as const, description: 'Rich text content section' },
    heading: { label: 'Heading', icon: 'text' as const, description: 'Section heading with subtitle' },
    image: { label: 'Image', icon: 'image' as const, description: 'Single image with caption' },
    gallery: { label: 'Image Gallery', icon: 'image' as const, description: 'Grid of multiple images' },
    cta: { label: 'Call to Action', icon: 'link' as const, description: 'Button or link section' },
    features: { label: 'Features Grid', icon: 'grid' as const, description: 'Grid of feature cards' },
    services: { label: 'Services Section', icon: 'grid' as const, description: 'Services showcase' },
    partners: { label: 'Partners Logos', icon: 'users' as const, description: 'Partner logo carousel' },
    testimonials: { label: 'Testimonials', icon: 'users' as const, description: 'Customer testimonials' },
    team: { label: 'Team Members', icon: 'users' as const, description: 'Team member profiles' },
    stats: { label: 'Statistics', icon: 'chart' as const, description: 'Key numbers and metrics' },
    faq: { label: 'FAQ', icon: 'help' as const, description: 'Frequently asked questions' },
    contact: { label: 'Contact Form', icon: 'email' as const, description: 'Contact form section' },
    map: { label: 'Map', icon: 'globe' as const, description: 'Embedded location map' },
    video: { label: 'Video', icon: 'video' as const, description: 'Embedded video player' },
    spacer: { label: 'Spacer', icon: 'layout' as const, description: 'Vertical spacing' },
    divider: { label: 'Divider', icon: 'layout' as const, description: 'Horizontal line divider' },
    about: { label: 'About Section', icon: 'info' as const, description: 'Company about section' },
    insights: { label: 'Insights/Blog', icon: 'article' as const, description: 'Latest blog posts' },
    custom: { label: 'Custom HTML', icon: 'code' as const, description: 'Custom HTML/code block' },
};

interface BlocksEditorNewProps {
    blocks: EditorBlock[];
    onChange: (blocks: EditorBlock[]) => void;
    pageSlug: string;
}

interface SortableBlockProps {
    block: EditorBlock;
    index: number;
    onEdit: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

function SortableBlock({ block, index, onEdit, onDuplicate, onDelete }: SortableBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const blockInfo = BLOCK_TYPES[block.type as keyof typeof BLOCK_TYPES] || {
        label: block.type,
        icon: 'layout' as const,
        description: 'Custom block',
    };

    return (
        <div ref={setNodeRef} style={style} className="group">
            <div className={`relative flex items-stretch bg-white rounded-xl border transition-all ${isDragging ? 'border-primary-400 shadow-lg' : 'border-border-light hover:border-primary-200'
                }`}>
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex items-center justify-center w-10 flex-shrink-0 border-r border-border-light bg-surface rounded-l-xl cursor-grab active:cursor-grabbing"
                >
                    <AdminIcon name="drag" className="w-4 h-4 text-muted" />
                </div>

                {/* Block Info */}
                <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <AdminIcon name={blockInfo.icon} className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-ink">{blockInfo.label}</span>
                                <AdminBadge variant="default" size="sm">#{index + 1}</AdminBadge>
                            </div>
                            {(block.data?.title as string) && (
                                <p className="text-sm text-muted truncate mt-0.5">
                                    {block.data.title as string}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                        title="Edit block"
                    >
                        <AdminIcon name="edit" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDuplicate}
                        className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                        title="Duplicate block"
                    >
                        <AdminIcon name="copy" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete block"
                    >
                        <AdminIcon name="trash" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Block Gallery Modal
function BlockGalleryModal({ isOpen, onClose, onSelect }: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: string) => void;
}) {
    const [search, setSearch] = useState('');
    const categories: Record<string, string[]> = {
        'Layout': ['hero', 'heading', 'spacer', 'divider'],
        'Content': ['text', 'image', 'gallery', 'video'],
        'Sections': ['features', 'services', 'about', 'stats', 'partners', 'team'],
        'Engagement': ['cta', 'testimonials', 'faq', 'contact', 'insights'],
        'Advanced': ['map', 'custom'],
    };

    const filteredCategories = Object.entries(categories).reduce((acc, [category, types]) => {
        const filtered = types.filter(type => {
            const info = BLOCK_TYPES[type as keyof typeof BLOCK_TYPES];
            return info && (
                info.label.toLowerCase().includes(search.toLowerCase()) ||
                info.description.toLowerCase().includes(search.toLowerCase())
            );
        });
        if (filtered.length > 0) {
            acc[category] = filtered;
        }
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Content Block"
            size="lg"
        >
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <AdminIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search blocks..."
                        className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                        autoFocus
                    />
                </div>

                {/* Categories */}
                <div className="max-h-[400px] overflow-y-auto space-y-6">
                    {Object.entries(filteredCategories).map(([category, types]) => (
                        <div key={category}>
                            <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                                {category}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {types.map((type) => {
                                    const info = BLOCK_TYPES[type as keyof typeof BLOCK_TYPES];
                                    if (!info) return null;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                onSelect(type);
                                                onClose();
                                            }}
                                            className="flex items-start gap-3 p-3 text-left bg-surface rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-colors group"
                                        >
                                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-primary-100 transition-colors">
                                                <AdminIcon name={info.icon} className="w-4 h-4 text-primary-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-ink text-sm">{info.label}</p>
                                                <p className="text-xs text-muted mt-0.5 line-clamp-1">{info.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {Object.keys(filteredCategories).length === 0 && (
                        <div className="text-center py-8 text-muted">
                            No blocks match your search
                        </div>
                    )}
                </div>
            </div>
        </AdminModal>
    );
}

// Block Editor Modal
function BlockEditorModal({ isOpen, onClose, block, onSave }: {
    isOpen: boolean;
    onClose: () => void;
    block: EditorBlock | null;
    onSave: (block: EditorBlock) => void;
}) {
    const [data, setData] = useState<Record<string, unknown>>(block?.data || {});

    useEffect(() => {
        if (block) {
            setData(block.data || {});
        }
    }, [block]);

    if (!block) return null;

    const blockInfo = BLOCK_TYPES[block.type as keyof typeof BLOCK_TYPES] || {
        label: block.type,
        icon: 'layout' as const,
        description: 'Custom block',
    };

    const handleSave = () => {
        onSave({ ...block, data });
        onClose();
    };

    // Generic field renderer based on block type
    const renderFields = () => {
        switch (block.type) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <AdminInput
                            label="Title"
                            value={data.title as string || ''}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            placeholder="Enter hero title..."
                        />
                        <AdminTextarea
                            label="Subtitle"
                            value={data.subtitle as string || ''}
                            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                            placeholder="Enter subtitle..."
                            rows={2}
                        />
                        <AdminInput
                            label="CTA Text"
                            value={data.ctaText as string || ''}
                            onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                            placeholder="Get Started"
                        />
                        <AdminInput
                            label="CTA Link"
                            value={data.ctaLink as string || ''}
                            onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
                            placeholder="/contact"
                        />
                    </div>
                );
            case 'text':
                return (
                    <AdminTextarea
                        label="Content"
                        value={data.content as string || ''}
                        onChange={(e) => setData({ ...data, content: e.target.value })}
                        placeholder="Enter your text content..."
                        rows={8}
                        helperText="Markdown formatting is supported"
                    />
                );
            case 'heading':
                return (
                    <div className="space-y-4">
                        <AdminInput
                            label="Heading Text"
                            value={data.title as string || ''}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            placeholder="Section Heading"
                        />
                        <AdminInput
                            label="Subtitle (optional)"
                            value={data.subtitle as string || ''}
                            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                            placeholder="Additional context"
                        />
                        <div>
                            <label className="block text-sm font-medium text-ink mb-1.5">Heading Level</label>
                            <select
                                value={data.level as string || 'h2'}
                                onChange={(e) => setData({ ...data, level: e.target.value })}
                                className="w-full px-4 py-2.5 bg-surface border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary-400"
                            >
                                <option value="h1">H1 - Main Heading</option>
                                <option value="h2">H2 - Section Heading</option>
                                <option value="h3">H3 - Subsection Heading</option>
                            </select>
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="space-y-4">
                        <AdminInput
                            label="Image URL"
                            value={data.src as string || ''}
                            onChange={(e) => setData({ ...data, src: e.target.value })}
                            placeholder="https://..."
                        />
                        <AdminInput
                            label="Alt Text"
                            value={data.alt as string || ''}
                            onChange={(e) => setData({ ...data, alt: e.target.value })}
                            placeholder="Describe the image..."
                            helperText="Important for accessibility and SEO"
                        />
                        <AdminInput
                            label="Caption (optional)"
                            value={data.caption as string || ''}
                            onChange={(e) => setData({ ...data, caption: e.target.value })}
                            placeholder="Photo credit or description"
                        />
                    </div>
                );
            case 'cta':
                return (
                    <div className="space-y-4">
                        <AdminInput
                            label="Heading"
                            value={data.title as string || ''}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            placeholder="Ready to get started?"
                        />
                        <AdminTextarea
                            label="Description"
                            value={data.description as string || ''}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            placeholder="Compelling reason to act..."
                            rows={2}
                        />
                        <AdminInput
                            label="Button Text"
                            value={data.buttonText as string || ''}
                            onChange={(e) => setData({ ...data, buttonText: e.target.value })}
                            placeholder="Contact Us"
                        />
                        <AdminInput
                            label="Button Link"
                            value={data.buttonLink as string || ''}
                            onChange={(e) => setData({ ...data, buttonLink: e.target.value })}
                            placeholder="/contact"
                        />
                    </div>
                );
            case 'stats':
                return (
                    <div className="space-y-4">
                        <AdminInput
                            label="Section Title"
                            value={data.title as string || ''}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            placeholder="Our Impact"
                        />
                        <AdminTextarea
                            label="Stats (JSON)"
                            value={JSON.stringify(data.stats || [], null, 2)}
                            onChange={(e) => {
                                try {
                                    setData({ ...data, stats: JSON.parse(e.target.value) });
                                } catch { }
                            }}
                            placeholder='[{"value": "100+", "label": "Clients"}]'
                            rows={6}
                            helperText='Array of {value, label} objects'
                        />
                    </div>
                );
            case 'spacer':
                return (
                    <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Spacing Size</label>
                        <select
                            value={data.size as string || 'md'}
                            onChange={(e) => setData({ ...data, size: e.target.value })}
                            className="w-full px-4 py-2.5 bg-surface border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary-400"
                        >
                            <option value="sm">Small (24px)</option>
                            <option value="md">Medium (48px)</option>
                            <option value="lg">Large (80px)</option>
                            <option value="xl">Extra Large (120px)</option>
                        </select>
                    </div>
                );
            case 'divider':
                return (
                    <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Divider Style</label>
                        <select
                            value={data.style as string || 'line'}
                            onChange={(e) => setData({ ...data, style: e.target.value })}
                            className="w-full px-4 py-2.5 bg-surface border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary-400"
                        >
                            <option value="line">Simple Line</option>
                            <option value="dashed">Dashed Line</option>
                            <option value="dots">Dots</option>
                        </select>
                    </div>
                );
            default:
                return (
                    <AdminTextarea
                        label="Block Data (JSON)"
                        value={JSON.stringify(data, null, 2)}
                        onChange={(e) => {
                            try {
                                setData(JSON.parse(e.target.value));
                            } catch { }
                        }}
                        rows={10}
                        helperText="Edit raw block data in JSON format"
                    />
                );
        }
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit ${blockInfo.label}`}
            footer={
                <div className="flex justify-end gap-3">
                    <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
                    <AdminButton variant="primary" onClick={handleSave}>Save Changes</AdminButton>
                </div>
            }
        >
            {renderFields()}
        </AdminModal>
    );
}

export default function BlocksEditorNew({ blocks, onChange, pageSlug }: BlocksEditorNewProps) {
    const [showGallery, setShowGallery] = useState(false);
    const [editingBlock, setEditingBlock] = useState<EditorBlock | null>(null);
    const [insertIndex, setInsertIndex] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Generate unique ID
    const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);
            onChange(arrayMove(blocks, oldIndex, newIndex));
        }
    };

    // Add new block
    const handleAddBlock = (type: string) => {
        const newBlock: EditorBlock = {
            id: generateId(),
            type,
            data: {},
        };

        if (insertIndex !== null) {
            const newBlocks = [...blocks];
            newBlocks.splice(insertIndex, 0, newBlock);
            onChange(newBlocks);
            setInsertIndex(null);
        } else {
            onChange([...blocks, newBlock]);
        }

        // Open editor for the new block
        setEditingBlock(newBlock);
    };

    // Duplicate block
    const handleDuplicate = (index: number) => {
        const block = blocks[index];
        const newBlock: EditorBlock = {
            ...block,
            id: generateId(),
            data: { ...block.data },
        };
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        onChange(newBlocks);
    };

    // Delete block
    const handleDelete = (index: number) => {
        onChange(blocks.filter((_, i) => i !== index));
    };

    // Save edited block
    const handleSaveBlock = (updatedBlock: EditorBlock) => {
        const index = blocks.findIndex((b) => b.id === updatedBlock.id);
        if (index >= 0) {
            const newBlocks = [...blocks];
            newBlocks[index] = updatedBlock;
            onChange(newBlocks);
        } else {
            // New block that was just created
            onChange([...blocks, updatedBlock]);
        }
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-ink">Content Blocks</h3>
                <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowGallery(true)}
                    leftIcon={<AdminIcon name="plus" className="w-4 h-4" />}
                >
                    Add Block
                </AdminButton>
            </div>

            {/* Blocks List */}
            {blocks.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {blocks.map((block, index) => (
                                <SortableBlock
                                    key={block.id}
                                    block={block}
                                    index={index}
                                    onEdit={() => setEditingBlock(block)}
                                    onDuplicate={() => handleDuplicate(index)}
                                    onDelete={() => handleDelete(index)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <AdminCard variant="outlined" padding="lg" className="text-center">
                    <div className="py-8">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <AdminIcon name="layout" className="w-6 h-6 text-primary-600" />
                        </div>
                        <h4 className="font-medium text-ink mb-1">No content blocks yet</h4>
                        <p className="text-sm text-muted mb-4">
                            Start building your page by adding content blocks
                        </p>
                        <AdminButton
                            variant="primary"
                            size="sm"
                            onClick={() => setShowGallery(true)}
                            leftIcon={<AdminIcon name="plus" className="w-4 h-4" />}
                        >
                            Add First Block
                        </AdminButton>
                    </div>
                </AdminCard>
            )}

            {/* Block Gallery Modal */}
            <BlockGalleryModal
                isOpen={showGallery}
                onClose={() => {
                    setShowGallery(false);
                    setInsertIndex(null);
                }}
                onSelect={handleAddBlock}
            />

            {/* Block Editor Modal */}
            <BlockEditorModal
                isOpen={!!editingBlock}
                onClose={() => setEditingBlock(null)}
                block={editingBlock}
                onSave={handleSaveBlock}
            />
        </div>
    );
}
