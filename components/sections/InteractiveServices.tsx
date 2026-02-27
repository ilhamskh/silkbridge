'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronDown, ArrowRight, CheckCircle2,
    Stethoscope, Truck, FlaskConical, Store, Globe, LineChart,
    Plane, Hotel, MapPin, Car, Users, FileCheck,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import type { InteractiveServicesBlock } from '@/lib/blocks/schema';

// Pharma-relevant icon mapping (expanded to include legacy tourism icons)
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    // Pharma / Medical
    stethoscope: Stethoscope,
    truck: Truck,
    flask: FlaskConical,
    store: Store,
    globe: Globe,
    chart: LineChart,
    // Legacy tourism icons (backward compatibility)
    plane: Plane,
    hotel: Hotel,
    map: MapPin,
    car: Car,
    users: Users,
    file: FileCheck,
};

interface InteractiveServicesProps {
    block: InteractiveServicesBlock;
    variant?: 'tabs' | 'cards';
    gallery?: {
        images: Array<{ url: string; alt: string; caption?: string }>;
    };
}

export function InteractiveServices({ block, gallery }: InteractiveServicesProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedMobile, setExpandedMobile] = useState<number | null>(0);

    const activeService = block.services[activeIndex];

    return (
        <section className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mb-10 lg:mb-14"
                >
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-semibold tracking-wide uppercase mb-3">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-display-sm lg:text-display text-ink text-balance">
                        {block.headline}
                    </h2>
                    {block.description && (
                        <p className="mt-4 text-body-lg text-muted max-w-prose">
                            {block.description}
                        </p>
                    )}
                </motion.div>

                {/* Desktop: Premium Vertical Switcher */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-8">
                    {/* Left: Service Tabs */}
                    <div className="col-span-4 space-y-1.5">
                        {block.services.map((service, index) => {
                            const Icon = service.icon ? iconMap[service.icon] : null;
                            const isActive = index === activeIndex;

                            return (
                                <motion.button
                                    key={service.id}
                                    onClick={() => setActiveIndex(index)}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.06 }}
                                    className={`
                                        group w-full text-left px-5 py-4 rounded-card transition-all duration-200
                                        ${isActive
                                            ? 'bg-white shadow-card border border-primary-200'
                                            : 'hover:bg-white/70 border border-transparent'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3.5">
                                        {/* Active indicator bar */}
                                        <div className={`
                                            w-1 h-9 rounded-full transition-all duration-200
                                            ${isActive ? 'bg-primary-600' : 'bg-transparent group-hover:bg-primary-200'}
                                        `} />

                                        {/* Icon */}
                                        {Icon && (
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                                                ${isActive
                                                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-button'
                                                    : 'bg-primary-50 text-primary-600 group-hover:bg-primary-100'
                                                }
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        )}

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`
                                                font-heading text-body font-semibold truncate transition-colors duration-200
                                                ${isActive ? 'text-ink' : 'text-muted group-hover:text-ink'}
                                            `}>
                                                {service.shortTitle || service.title}
                                            </h3>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className={`
                                            w-4 h-4 transition-all duration-200 flex-shrink-0
                                            ${isActive
                                                ? 'text-primary-600 translate-x-0'
                                                : 'text-border-subtle -translate-x-1 group-hover:translate-x-0 group-hover:text-muted'
                                            }
                                        `} />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Right: Detail Panel */}
                    <div className="col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                className="bg-white rounded-card-lg border border-border-light shadow-card p-8"
                            >
                                {/* Header row */}
                                <div className="flex items-start gap-4 mb-5">
                                    {activeService.icon && iconMap[activeService.icon] && (
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-button flex-shrink-0">
                                            {(() => {
                                                const Icon = iconMap[activeService.icon!];
                                                return <Icon className="w-7 h-7 text-white" />;
                                            })()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-heading text-h2 text-ink">
                                            {activeService.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-body text-muted mb-6 max-w-prose leading-relaxed">
                                    {activeService.description}
                                </p>

                                {/* Features: 2-column grid with check icons */}
                                {activeService.features && activeService.features.length > 0 && (
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 pt-5 border-t border-border-light">
                                        {activeService.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2.5">
                                                <CheckCircle2 className="w-4.5 h-4.5 text-primary-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-body-sm text-muted">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* CTA */}
                                {block.ctaText && block.ctaHref && (
                                    <Link
                                        href={block.ctaHref}
                                        className="inline-flex items-center gap-2 text-primary-600 font-medium group/link"
                                    >
                                        <span className="relative">
                                            {block.ctaText}
                                            <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-primary-600 group-hover/link:w-full transition-all duration-300" />
                                        </span>
                                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile: Accordion Layout */}
                <div className="lg:hidden space-y-3">
                    {block.services.map((service, index) => {
                        const Icon = service.icon ? iconMap[service.icon] : null;
                        const isExpanded = expandedMobile === index;

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white rounded-card border border-border-light shadow-card overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedMobile(isExpanded ? null : index)}
                                    className="w-full px-5 py-4 flex items-center gap-3.5 text-left"
                                >
                                    {Icon && (
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                            ${isExpanded
                                                ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-button'
                                                : 'bg-primary-50 text-primary-600'
                                            }
                                        `}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-heading text-body font-semibold text-ink">
                                            {service.shortTitle || service.title}
                                        </h3>
                                    </div>
                                    <ChevronDown className={`
                                        w-5 h-5 text-muted transition-transform duration-200
                                        ${isExpanded ? 'rotate-180' : ''}
                                    `} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 pt-2 border-t border-border-light">
                                                <p className="text-body-sm text-muted mb-4 leading-relaxed">
                                                    {service.description}
                                                </p>

                                                {service.features && service.features.length > 0 && (
                                                    <div className="space-y-2 mb-4">
                                                        {service.features.map((feature, i) => (
                                                            <div key={i} className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                                                                <span className="text-body-sm text-muted">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {block.ctaText && block.ctaHref && (
                                                    <Link
                                                        href={block.ctaHref}
                                                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-medium"
                                                    >
                                                        {block.ctaText}
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Optional Gallery Strip */}
                {gallery && gallery.images && gallery.images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {gallery.images.slice(0, 8).map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative aspect-[4/3] rounded-card overflow-hidden bg-surface"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {image.caption && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
