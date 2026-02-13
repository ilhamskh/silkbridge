'use client';

import { motion } from 'framer-motion';
import { Plane, Hotel, MapPin, Car, Users, FileCheck, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import type { InteractiveServicesBlock } from '@/lib/blocks/schema';

// Icon mapping for services
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    plane: Plane,
    hotel: Hotel,
    map: MapPin,
    car: Car,
    users: Users,
    file: FileCheck,
};

interface ServicesEnhancedProps {
    block: InteractiveServicesBlock;
    gallery?: {
        images: Array<{ url: string; alt: string; caption?: string }>;
    };
}

export function ServicesEnhanced({ block, gallery }: ServicesEnhancedProps) {
    // Derive capability highlights from first 3 services
    const highlights = block.services.slice(0, 3).map(s => s.shortTitle || s.title);

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="max-w-3xl mb-12 lg:mb-16">
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-semibold tracking-wide uppercase mb-3">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-display-sm lg:text-display text-ink mb-4">
                        {block.headline}
                    </h2>
                    {block.description && (
                        <p className="text-body-lg text-muted leading-relaxed">
                            {block.description}
                        </p>
                    )}

                    {/* Capability Highlights */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {highlights.map((highlight, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="px-3 py-1.5 bg-primary-50 text-primary-700 text-body-sm font-medium rounded-pill border border-primary-100"
                            >
                                {highlight}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {block.services.map((service, index) => {
                        const Icon = service.icon ? iconMap[service.icon] : null;

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: index * 0.1 }}
                                className="group h-full"
                            >
                                <div className="h-full flex flex-col bg-white rounded-card-lg border border-border-light hover:border-primary-200 hover:shadow-card-hover transition-all duration-300 p-6">
                                    {/* Top Row: Icon + Title */}
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Icon Badge */}
                                        <div className="flex-shrink-0">
                                            {Icon ? (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-button group-hover:shadow-button-hover transition-shadow">
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                            ) : (
                                                // Fallback to initials
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-button group-hover:shadow-button-hover transition-shadow">
                                                    <span className="text-white font-heading font-bold text-lg">
                                                        {service.title.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-heading text-h3 text-ink group-hover:text-primary-600 transition-colors line-clamp-2">
                                                {service.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Description - 2-3 line clamp */}
                                    <p className="text-body text-muted line-clamp-3 mb-4 flex-1">
                                        {service.description}
                                    </p>

                                    {/* Features (optional) */}
                                    {service.features && service.features.length > 0 && (
                                        <ul className="space-y-2 mb-4 border-t border-border-light pt-4">
                                            {service.features.slice(0, 3).map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-body-sm text-muted">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-500 flex-shrink-0" />
                                                    <span className="line-clamp-1">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Action Row */}
                                    {block.ctaHref && (
                                        <div className="mt-auto pt-2">
                                            <Link
                                                href={block.ctaHref}
                                                className="inline-flex items-center gap-2 text-primary-600 font-medium text-body-sm group/link"
                                            >
                                                <span className="relative">
                                                    {block.ctaText || 'Learn more'}
                                                    <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-primary-600 group-hover/link:w-full transition-all duration-300" />
                                                </span>
                                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Services Gallery Strip (Optional) */}
                {gallery && gallery.images && gallery.images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12"
                    >
                        <div className="text-center mb-8">
                            <h3 className="font-heading text-h2 text-ink mb-2">
                                Our Services in Action
                            </h3>
                            <p className="text-body text-muted">
                                See how we deliver exceptional experiences
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gallery.images.slice(0, 8).map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative aspect-[4/3] rounded-card overflow-hidden bg-surface"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {image.caption && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                                <p className="text-white text-caption font-medium">
                                                    {image.caption}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
