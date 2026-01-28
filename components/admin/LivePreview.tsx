'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminIcon } from './ui/AdminIcon';

// Simple EditorBlock type for the visual editor
interface EditorBlock {
    id: string;
    type: string;
    data: Record<string, unknown>;
}

interface LivePreviewProps {
    pageSlug: string;
    locale: string;
    title: string;
    blocks: EditorBlock[];
    device: 'desktop' | 'tablet' | 'mobile';
}

const DEVICE_WIDTHS = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
};

// Simplified block renderer for preview
function PreviewBlock({ block }: { block: EditorBlock }) {
    const { type } = block;
    const data = block.data as Record<string, string | undefined>;

    switch (type) {
        case 'hero':
        case 'heroParallax':
            return (
                <div
                    className="relative h-80 flex items-center justify-center text-center"
                    style={{
                        backgroundColor: '#1e3a5f',
                        backgroundImage: data?.backgroundImage ? `url(${data.backgroundImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 px-6 text-white">
                        <h1 className="text-3xl font-bold mb-3">{data?.title || 'Hero Title'}</h1>
                        {data?.subtitle && <p className="text-lg opacity-90 mb-4">{data.subtitle}</p>}
                        {data?.ctaText && (
                            <button className="px-6 py-2.5 bg-white text-gray-900 rounded-lg font-medium text-sm">
                                {data.ctaText}
                            </button>
                        )}
                    </div>
                </div>
            );

        case 'heading':
            const HeadingTag = (data?.level as 'h1' | 'h2' | 'h3') || 'h2';
            const headingStyles = {
                h1: 'text-3xl font-bold',
                h2: 'text-2xl font-bold',
                h3: 'text-xl font-semibold',
            };
            return (
                <div className="py-8 px-6 text-center">
                    <HeadingTag className={`${headingStyles[HeadingTag]} text-gray-900 mb-2`}>
                        {data?.title || 'Section Heading'}
                    </HeadingTag>
                    {data?.subtitle && (
                        <p className="text-gray-600">{data.subtitle}</p>
                    )}
                </div>
            );

        case 'text':
            return (
                <div className="py-6 px-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {data?.content || 'Text content goes here...'}
                    </p>
                </div>
            );

        case 'image':
            return (
                <div className="py-6 px-6">
                    {data?.src ? (
                        <figure>
                            <img
                                src={data.src}
                                alt={data?.alt || ''}
                                className="w-full rounded-lg"
                            />
                            {data?.caption && (
                                <figcaption className="text-sm text-gray-500 text-center mt-2">
                                    {data.caption}
                                </figcaption>
                            )}
                        </figure>
                    ) : (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">Image placeholder</span>
                        </div>
                    )}
                </div>
            );

        case 'cta':
            return (
                <div className="py-12 px-6 bg-blue-600 text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">
                        {data?.title || 'Ready to get started?'}
                    </h3>
                    {data?.description && (
                        <p className="text-blue-100 mb-4">{data.description}</p>
                    )}
                    {data?.buttonText && (
                        <button className="px-6 py-2.5 bg-white text-blue-600 rounded-lg font-medium text-sm">
                            {data.buttonText}
                        </button>
                    )}
                </div>
            );

        case 'features':
            return (
                <div className="py-12 px-6 bg-gray-50">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {data?.title || 'Features'}
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3" />
                                <h4 className="font-semibold text-gray-900 mb-1">Feature {i}</h4>
                                <p className="text-sm text-gray-600">Feature description</p>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'services':
            return (
                <div className="py-12 px-6">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {data?.title || 'Our Services'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 border rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-1">Service {i}</h4>
                                <p className="text-sm text-gray-600">Service description</p>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'stats':
            const stats = (Array.isArray(data?.stats) ? data.stats : [
                { value: '100+', label: 'Clients' },
                { value: '50+', label: 'Projects' },
                { value: '15+', label: 'Years' },
            ]) as Array<{ value: string; label: string }>;
            return (
                <div className="py-12 px-6 bg-gray-900 text-white">
                    {data?.title && (
                        <h3 className="text-2xl font-bold text-center mb-8">{data.title}</h3>
                    )}
                    <div className="flex justify-around">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
                                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'testimonials':
            return (
                <div className="py-12 px-6 bg-gray-50">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {data?.title || 'What Our Clients Say'}
                    </h3>
                    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-700 italic mb-4">
                            "Excellent service and professional team. Highly recommended!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div>
                                <div className="font-semibold text-gray-900">Client Name</div>
                                <div className="text-sm text-gray-500">Company</div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'partners':
            return (
                <div className="py-12 px-6">
                    <h3 className="text-lg font-semibold text-center text-gray-500 mb-8">
                        {data?.title || 'Our Partners'}
                    </h3>
                    <div className="flex justify-center gap-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                                Logo
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'faq':
            return (
                <div className="py-12 px-6">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {data?.title || 'Frequently Asked Questions'}
                    </h3>
                    <div className="space-y-3 max-w-xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="font-semibold text-gray-900">Question {i}?</div>
                                <div className="text-sm text-gray-600 mt-2">Answer to the question goes here.</div>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'contact':
            return (
                <div className="py-12 px-6 bg-gray-50">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {data?.title || 'Contact Us'}
                    </h3>
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="h-10 bg-white border rounded-lg" />
                        <div className="h-10 bg-white border rounded-lg" />
                        <div className="h-24 bg-white border rounded-lg" />
                        <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm">
                            Send Message
                        </button>
                    </div>
                </div>
            );

        case 'about':
            return (
                <div className="py-12 px-6">
                    <div className="flex gap-8 items-center">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {data?.title || 'About Us'}
                            </h3>
                            <p className="text-gray-600">
                                {data?.description || 'Company description and story goes here. We are committed to delivering excellence.'}
                            </p>
                        </div>
                        <div className="w-1/3 aspect-square bg-gray-100 rounded-lg" />
                    </div>
                </div>
            );

        case 'team':
            return (
                <div className="py-12 px-6">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {data?.title || 'Our Team'}
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3" />
                                <div className="font-semibold text-gray-900">Team Member</div>
                                <div className="text-sm text-gray-500">Position</div>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'insights':
            return (
                <div className="py-12 px-6 bg-gray-50">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {data?.title || 'Latest Insights'}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <div className="aspect-video bg-gray-100" />
                                <div className="p-4">
                                    <div className="text-xs text-gray-500 mb-1">Category</div>
                                    <div className="font-semibold text-gray-900">Article Title {i}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'spacer':
            const spacerSizes = { sm: 24, md: 48, lg: 80, xl: 120 };
            const size = spacerSizes[(data?.size as keyof typeof spacerSizes) || 'md'];
            return <div style={{ height: size }} />;

        case 'divider':
            const styles = {
                line: 'border-t border-gray-200',
                dashed: 'border-t border-dashed border-gray-300',
                dots: 'text-center text-gray-300',
            };
            const dividerStyle = (data?.style as keyof typeof styles) || 'line';
            return (
                <div className="py-6 px-6">
                    {dividerStyle === 'dots' ? (
                        <div className={styles.dots}>• • •</div>
                    ) : (
                        <div className={styles[dividerStyle]} />
                    )}
                </div>
            );

        case 'video':
            return (
                <div className="py-6 px-6">
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
                        </div>
                    </div>
                </div>
            );

        case 'map':
            return (
                <div className="py-6 px-6">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        📍 Map Embed
                    </div>
                </div>
            );

        case 'gallery':
            return (
                <div className="py-6 px-6">
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded" />
                        ))}
                    </div>
                </div>
            );

        case 'custom':
            return (
                <div className="py-6 px-6">
                    <div className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center text-gray-500 text-sm">
                        Custom HTML Block
                    </div>
                </div>
            );

        default:
            return (
                <div className="py-6 px-6">
                    <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700 text-sm text-center">
                        Unknown block type: {type}
                    </div>
                </div>
            );
    }
}

export default function LivePreview({ pageSlug, locale, title, blocks, device }: LivePreviewProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate brief loading for smooth transitions
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 150);
        return () => clearTimeout(timer);
    }, [blocks]);

    return (
        <div className="flex-1 bg-surface rounded-xl border border-border-light overflow-hidden flex flex-col">
            {/* Preview Header (simulated browser) */}
            <div className="flex-shrink-0 px-4 py-2 bg-gray-100 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-white rounded-md text-xs text-gray-500 flex items-center gap-2">
                        <AdminIcon name="globe" className="w-3 h-3" />
                        silkbridge.com/{locale}/{pageSlug === 'home' ? '' : pageSlug}
                    </div>
                </div>
                <div className="w-[52px]" /> {/* Spacer for symmetry */}
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-white p-4 flex justify-center">
                <div
                    className="transition-all duration-300 ease-in-out"
                    style={{
                        width: DEVICE_WIDTHS[device],
                        maxWidth: '100%',
                    }}
                >
                    <div
                        className={`bg-white shadow-lg rounded-lg overflow-hidden transition-opacity duration-150 ${isLoading ? 'opacity-50' : 'opacity-100'
                            }`}
                        style={{
                            transform: device !== 'desktop' ? 'scale(0.9)' : 'none',
                            transformOrigin: 'top center',
                        }}
                    >
                        {/* Simulated Header */}
                        <header className="px-6 py-4 border-b flex items-center justify-between">
                            <div className="font-bold text-lg text-blue-600">SILKBRIDGE</div>
                            <nav className="flex gap-4 text-sm text-gray-600">
                                <span>Home</span>
                                <span>About</span>
                                <span>Services</span>
                                <span>Contact</span>
                            </nav>
                        </header>

                        {/* Page Content */}
                        <main className="min-h-[400px]">
                            {blocks.length > 0 ? (
                                blocks.map((block) => (
                                    <PreviewBlock key={block.id} block={block} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                                    <AdminIcon name="layout" className="w-12 h-12 mb-3" />
                                    <p className="text-lg font-medium">No content yet</p>
                                    <p className="text-sm">Add blocks to see them here</p>
                                </div>
                            )}
                        </main>

                        {/* Simulated Footer */}
                        <footer className="px-6 py-8 bg-gray-900 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-lg mb-2">SILKBRIDGE</div>
                                    <p className="text-gray-400 text-sm">Bridging Markets, Building Futures</p>
                                </div>
                                <div className="flex gap-8 text-sm text-gray-400">
                                    <div>
                                        <div className="font-semibold text-white mb-2">Navigation</div>
                                        <div className="space-y-1">
                                            <div>Home</div>
                                            <div>About</div>
                                            <div>Services</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white mb-2">Contact</div>
                                        <div className="space-y-1">
                                            <div>info@silkbridge.com</div>
                                            <div>+1 234 567 890</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
                                © 2024 Silkbridge. All rights reserved.
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
