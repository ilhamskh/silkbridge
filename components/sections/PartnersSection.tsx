'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Handshake, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

interface Partner {
    id: string;
    name: string;
    logoUrl?: string | null;
    location?: string | null;
    specialties: string[];
    websiteUrl?: string | null;
    description?: string | null;
}

interface PartnersEmptyContent {
    eyebrow?: string;
    headline: string;
    description: string;
    ctaText?: string;
    ctaHref?: string;
}

interface PartnersSectionProps {
    partners: Partner[];
    emptyContent: PartnersEmptyContent;
}

export function PartnersSection({ partners, emptyContent }: PartnersSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const hasPartners = partners.length > 0;

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {hasPartners ? (
                    // Partners Grid
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
                        >
                            <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-3">
                                {emptyContent.eyebrow || 'Our Partners'}
                            </span>
                            <h2 className="font-heading text-display-sm lg:text-display text-ink text-balance">
                                {emptyContent.headline}
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {partners.map((partner, index) => (
                                <motion.div
                                    key={partner.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                                    className="group"
                                >
                                    <div className="h-full p-6 rounded-card-lg bg-white border border-border-light hover:shadow-card hover:border-primary-100 transition-all duration-300">
                                        {/* Logo or placeholder */}
                                        <div className="aspect-[3/2] rounded-lg bg-surface flex items-center justify-center mb-4 overflow-hidden">
                                            {partner.logoUrl ? (
                                                <Image
                                                    src={partner.logoUrl}
                                                    alt={partner.name}
                                                    width={120}
                                                    height={60}
                                                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                                                    <span className="text-primary-600 font-heading font-bold text-xl">
                                                        {partner.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <h3 className="font-medium text-ink group-hover:text-primary-600 transition-colors">
                                            {partner.name}
                                        </h3>
                                        {partner.location && (
                                            <p className="text-body-sm text-muted mt-1">
                                                {partner.location}
                                            </p>
                                        )}

                                        {/* Specialties */}
                                        {partner.specialties.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {partner.specialties.slice(0, 2).map((specialty, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 text-caption bg-primary-50 text-primary-700 rounded"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Website link */}
                                        {partner.websiteUrl && (
                                            <a
                                                href={partner.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-4 text-body-sm text-primary-600 hover:underline"
                                            >
                                                Visit website
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="max-w-xl mx-auto">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 mb-6">
                                <Handshake className="w-10 h-10 text-primary-600" />
                            </div>

                            {/* Eyebrow */}
                            {emptyContent.eyebrow && (
                                <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-3">
                                    {emptyContent.eyebrow}
                                </span>
                            )}

                            {/* Headline */}
                            <h2 className="font-heading text-display-sm text-ink mb-4 text-balance">
                                {emptyContent.headline}
                            </h2>

                            {/* Description */}
                            <p className="text-body-lg text-muted mb-8 max-w-prose mx-auto">
                                {emptyContent.description}
                            </p>

                            {/* CTA */}
                            {emptyContent.ctaText && emptyContent.ctaHref && (
                                <Link
                                    href={emptyContent.ctaHref}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-pill shadow-button hover:bg-primary-700 hover:shadow-button-hover transition-all duration-200"
                                >
                                    {emptyContent.ctaText}
                                </Link>
                            )}
                        </div>

                        {/* Decorative elements */}
                        <div className="mt-12 flex justify-center gap-4 opacity-40">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-16 h-16 rounded-lg bg-border-light"
                                    style={{ opacity: 1 - i * 0.15 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
