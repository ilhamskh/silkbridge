'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ExternalLink, Building2 } from 'lucide-react';

interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    location?: string;
    specialties: string[];
    websiteUrl?: string;
    description?: string;
}

interface PartnersGridProps {
    partners: Partner[];
}

export default function PartnersGrid({ partners }: PartnersGridProps) {
    if (partners.length === 0) {
        return null; // Will be handled by partnersEmpty block
    }

    return (
        <section className="py-section bg-surface">
            <div className="container-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="bg-white rounded-lg border border-border-subtle p-6 hover:shadow-card-hover transition-shadow duration-300"
                        >
                            {/* Logo */}
                            <div className="h-16 flex items-center mb-4">
                                {partner.logoUrl ? (
                                    <Image
                                        src={partner.logoUrl}
                                        alt={partner.name}
                                        width={160}
                                        height={60}
                                        className="max-h-14 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-7 h-7 text-primary-600" />
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <h3 className="text-lg font-semibold text-ink mb-2">
                                {partner.name}
                            </h3>

                            {/* Location */}
                            {partner.location && (
                                <div className="flex items-center gap-1.5 text-sm text-ink-muted mb-3">
                                    <MapPin className="w-4 h-4" />
                                    <span>{partner.location}</span>
                                </div>
                            )}

                            {/* Description */}
                            {partner.description && (
                                <p className="text-sm text-ink-muted mb-4 line-clamp-2">
                                    {partner.description}
                                </p>
                            )}

                            {/* Specialties */}
                            {partner.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {partner.specialties.slice(0, 3).map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                    {partner.specialties.length > 3 && (
                                        <span className="px-2 py-1 text-xs text-ink-muted">
                                            +{partner.specialties.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Website Link */}
                            {partner.websiteUrl && (
                                <Link
                                    href={partner.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    <span>Visit Website</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
