'use client';

import type { ContentBlock } from '@/lib/validations';

interface BlockPreviewProps {
    blocks: ContentBlock[];
}

export default function BlockPreview({ blocks }: BlockPreviewProps) {
    if (blocks.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted">
                <p>No blocks to preview</p>
            </div>
        );
    }

    return (
        <div className="prose prose-slate max-w-none space-y-8">
            {blocks.map((block, index) => (
                <BlockRenderer key={index} block={block} />
            ))}
        </div>
    );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case 'heading':
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return <HeadingTag className="font-serif">{block.text}</HeadingTag>;

        case 'paragraph':
            return <p className="text-ink-light">{block.text}</p>;

        case 'hero':
            return (
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
                    <h1 className="text-3xl font-serif font-medium text-ink mb-4">
                        {block.tagline.split('\n').map((line, i) => (
                            <span key={i}>
                                {line}
                                {i < block.tagline.split('\n').length - 1 && <br />}
                            </span>
                        ))}
                    </h1>
                    {block.subtagline && <p className="text-ink-light">{block.subtagline}</p>}
                    {block.ctaPrimary && (
                        <div className="mt-6">
                            <span className="inline-block px-6 py-3 bg-primary-600 text-white rounded-full text-sm font-medium">
                                {block.ctaPrimary.text}
                            </span>
                        </div>
                    )}
                </div>
            );

        case 'intro':
            return (
                <div className="space-y-4">
                    {block.eyebrow && (
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                            {block.eyebrow}
                        </p>
                    )}
                    <h2 className="text-2xl font-serif font-medium text-ink">
                        {block.headline}
                        {block.headlineAccent && (
                            <span className="text-primary-600"> {block.headlineAccent}</span>
                        )}
                    </h2>
                    {block.text && <p className="text-ink-light">{block.text}</p>}
                </div>
            );

        case 'bullets':
            return (
                <ul className="space-y-2 list-disc list-inside text-ink-light">
                    {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            );

        case 'quote':
            return (
                <blockquote className="border-l-4 border-primary-300 pl-6 py-2">
                    <p className="text-lg italic text-ink">&ldquo;{block.text}&rdquo;</p>
                    {block.by && <cite className="text-sm text-muted mt-2 block">— {block.by}</cite>}
                </blockquote>
            );

        case 'callout':
            return (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    {block.title && <h4 className="font-semibold text-amber-900 mb-2">{block.title}</h4>}
                    <p className="text-amber-800">{block.text}</p>
                </div>
            );

        case 'stats':
            return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {block.items.map((stat, i) => (
                        <div key={i} className="text-center p-4 bg-surface rounded-xl">
                            <div className="text-3xl font-serif font-bold text-primary-600">{stat.value}</div>
                            <div className="text-sm text-ink-light mt-1">{stat.label}</div>
                            {stat.note && <div className="text-xs text-muted mt-1">{stat.note}</div>}
                        </div>
                    ))}
                </div>
            );

        case 'statsRow':
            return (
                <div className="flex flex-wrap gap-8 justify-center py-4">
                    {block.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                            <div className="text-sm text-muted">{stat.label}</div>
                        </div>
                    ))}
                </div>
            );

        case 'about':
            return (
                <div className="space-y-6 bg-surface rounded-2xl p-8">
                    {block.eyebrow && (
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                            {block.eyebrow}
                        </p>
                    )}
                    <h2 className="text-2xl font-serif font-medium text-ink">
                        {block.headline}
                        {block.headlineAccent && (
                            <span className="text-primary-600"> {block.headlineAccent}</span>
                        )}
                    </h2>
                    {block.mission && <p className="text-ink-light">{block.mission}</p>}
                    {block.pillars && block.pillars.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            {block.pillars.map((pillar, i) => (
                                <div key={i} className="p-4 bg-white rounded-xl">
                                    <h4 className="font-semibold text-ink">{pillar.title}</h4>
                                    <p className="text-sm text-muted mt-1">{pillar.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );

        case 'services':
            return (
                <div className="space-y-6">
                    {block.eyebrow && (
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                            {block.eyebrow}
                        </p>
                    )}
                    <h2 className="text-2xl font-serif font-medium text-ink">
                        {block.headline}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {block.services.map((service, i) => (
                            <div key={i} className="p-6 bg-surface rounded-xl">
                                <h3 className="font-semibold text-ink mb-2">{service.title}</h3>
                                <p className="text-sm text-muted mb-4">{service.description}</p>
                                {service.features && (
                                    <ul className="text-sm text-ink-light space-y-1">
                                        {service.features.map((feat, j) => (
                                            <li key={j}>• {feat}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'partners':
            return (
                <div className="text-center py-8 bg-surface rounded-2xl">
                    {block.eyebrow && (
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-2">
                            {block.eyebrow}
                        </p>
                    )}
                    <h2 className="text-2xl font-serif font-medium text-ink">{block.headline}</h2>
                    {block.description && <p className="text-muted mt-2 max-w-xl mx-auto">{block.description}</p>}
                </div>
            );

        case 'contact':
            return (
                <div className="bg-surface rounded-2xl p-8">
                    <h2 className="text-2xl font-serif font-medium text-ink mb-2">{block.headline}</h2>
                    {block.description && <p className="text-muted mb-6">{block.description}</p>}
                    <div className="flex gap-4">
                        {block.showForm && (
                            <div className="flex-1 bg-white rounded-xl p-4 border border-border-light">
                                <p className="text-sm text-muted">[Contact Form Placeholder]</p>
                            </div>
                        )}
                        {block.showMap && (
                            <div className="flex-1 bg-white rounded-xl p-4 border border-border-light">
                                <p className="text-sm text-muted">[Map Placeholder]</p>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'insights':
            return (
                <div className="text-center py-8">
                    {block.eyebrow && (
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-2">
                            {block.eyebrow}
                        </p>
                    )}
                    <h2 className="text-2xl font-serif font-medium text-ink">{block.headline}</h2>
                    <p className="text-muted mt-2">[Blog posts will appear here]</p>
                </div>
            );

        case 'values':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-medium text-ink">{block.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {block.values.map((value, i) => (
                            <div key={i} className="p-4 border border-border-light rounded-xl">
                                <h4 className="font-semibold text-ink">{value.title}</h4>
                                <p className="text-sm text-muted mt-1">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'team':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-medium text-ink">{block.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {block.members.map((member, i) => (
                            <div key={i} className="text-center p-4 bg-surface rounded-xl">
                                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-3" />
                                <h4 className="font-semibold text-ink">{member.name}</h4>
                                <p className="text-sm text-primary-600">{member.role}</p>
                                {member.bio && <p className="text-xs text-muted mt-2">{member.bio}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'milestones':
            return (
                <div className="space-y-4">
                    {block.milestones.map((milestone, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="text-lg font-bold text-primary-600 min-w-[60px]">{milestone.year}</div>
                            <div className="text-ink-light">{milestone.event}</div>
                        </div>
                    ))}
                </div>
            );

        case 'process':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-medium text-ink">{block.title}</h2>
                    <div className="space-y-4">
                        {block.steps.map((step, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-ink">{step.title}</h4>
                                    <p className="text-sm text-muted">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'story':
            return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-medium text-ink">{block.title}</h2>
                    {block.paragraphs.map((p, i) => (
                        <p key={i} className="text-ink-light">{p}</p>
                    ))}
                </div>
            );

        case 'cta':
            return (
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-2xl font-serif font-medium mb-2">{block.headline}</h2>
                    {block.description && <p className="text-primary-100 mb-6">{block.description}</p>}
                    {block.primaryButton && (
                        <span className="inline-block px-6 py-3 bg-white text-primary-600 rounded-full text-sm font-medium">
                            {block.primaryButton.text}
                        </span>
                    )}
                </div>
            );

        case 'divider':
            return <hr className="border-border my-8" />;

        case 'image':
            return (
                <div className="rounded-xl overflow-hidden bg-surface">
                    {block.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={block.src} alt={block.alt} className="w-full h-auto" />
                    ) : (
                        <div className="w-full h-48 flex items-center justify-center text-muted">
                            [Image: {block.alt || 'No alt text'}]
                        </div>
                    )}
                    {block.caption && <p className="text-sm text-muted text-center p-2">{block.caption}</p>}
                </div>
            );

        default:
            return (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                    <p className="font-semibold text-amber-800">Unknown block type: {(block as ContentBlock).type}</p>
                    <pre className="mt-2 text-xs text-amber-700 overflow-auto">
                        {JSON.stringify(block, null, 2)}
                    </pre>
                </div>
            );
    }
}
