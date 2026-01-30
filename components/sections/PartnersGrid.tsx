'use client';

import { motion } from 'framer-motion';
import { PartnerCard } from '@/components/partners/PartnerCard';

interface Partner {
    id: string;
    name: string;
    logoUrl?: string;
    images: string[];
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
        <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm font-semibold text-primary-600 tracking-wider uppercase mb-3">
                        Our Partners
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Trusted Tourism Partners
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We collaborate with leading hospitality and travel providers to deliver exceptional experiences.
                    </p>
                </motion.div>

                {/* Partners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {partners.map((partner, index) => (
                        <PartnerCard
                            key={partner.id}
                            partner={partner}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
