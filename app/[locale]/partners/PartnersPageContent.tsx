'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { partnerItems } from '@/content/site-config';
import Button from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

const regionKeys = ['all', 'asiaPacific', 'middleEast', 'europe', 'americas'] as const;

// Map display region keys to data region values
const regionMap: Record<string, string> = {
    'all': 'all',
    'asiaPacific': 'asia-pacific',
    'middleEast': 'middle-east',
    'europe': 'europe',
    'americas': 'americas',
};

export default function PartnersPageContent() {
    const t = useTranslations('partnersPage');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);

    const filteredPartners = selectedRegion === 'all'
        ? partnerItems
        : partnerItems.filter(p => p.region === regionMap[selectedRegion]);

    return (
        <div className="pt-24 lg:pt-32">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {t('eyebrow')}
                        </span>
                        <h1 className="font-heading text-display-sm lg:text-display text-ink">
                            {t('headline')}
                            <br />
                            <span className="text-primary-600">{t('headlineAccent')}</span>
                        </h1>
                        <p className="mt-6 text-xl text-muted leading-relaxed">
                            {t('intro')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-ink">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {['hospitals', 'countries', 'specialists', 'patients'].map((key, index) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="font-heading text-3xl lg:text-4xl text-white font-semibold">
                                    {t(`stats.${key}.value`)}
                                </div>
                                <p className="mt-2 text-white/60 text-sm">
                                    {t(`stats.${key}.label`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Grid */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Region Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {regionKeys.map((region) => (
                            <button
                                key={region}
                                onClick={() => setSelectedRegion(region)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                    ${selectedRegion === region
                                        ? 'bg-primary-600 text-white shadow-button'
                                        : 'bg-surface text-muted hover:bg-primary-50 hover:text-primary-700'
                                    }`}
                            >
                                {t(`regions.${region}`)}
                            </button>
                        ))}
                    </div>

                    {/* Partners Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredPartners.map((partner, index) => (
                                <motion.div
                                    key={partner.name}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                    className="relative"
                                    onMouseEnter={() => setHoveredPartner(index)}
                                    onMouseLeave={() => setHoveredPartner(null)}
                                >
                                    <div className="relative h-40 rounded-card bg-surface border border-border-light
                                        flex items-center justify-center p-6 cursor-pointer
                                        hover:border-primary-200 hover:shadow-card transition-all duration-300">
                                        <div className="text-center">
                                            <div className="w-14 h-14 mx-auto rounded-xl bg-primary-50 flex items-center justify-center
                                                text-primary-600 font-heading font-semibold text-xl">
                                                {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                            </div>
                                            <p className="mt-3 font-medium text-ink text-sm">{partner.name}</p>
                                            <p className="mt-1 text-xs text-muted">{partner.location}</p>
                                        </div>

                                        {/* Hover Tooltip */}
                                        <AnimatePresence>
                                            {hoveredPartner === index && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full z-10
                                                        bg-ink text-white rounded-xl p-4 shadow-lg min-w-[220px]"
                                                >
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 
                                                        bg-ink rotate-45 rounded-sm" />
                                                    <div className="relative">
                                                        <p className="font-medium">{partner.specialty}</p>
                                                        <p className="mt-1 text-white/60 text-xs">{partner.location}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredPartners.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted">{t('noPartners')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Become Partner CTA */}
            <section className="py-16 lg:py-24 bg-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-heading text-h1 sm:text-display-sm text-white">
                            {t('cta.headline')}
                        </h2>
                        <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
                            {t('cta.description')}
                        </p>
                        <div className="mt-8">
                            <Link href="/contact?type=partnership">
                                <Button
                                    size="lg"
                                    className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl hover:shadow-2xl transition-shadow"
                                >
                                    {t('cta.button')}
                                    <Icons.arrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
