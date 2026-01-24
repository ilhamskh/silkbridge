'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { partnerItems } from '@/content/site-config';
import Button from '@/components/ui/button';

export default function Partners() {
    const t = useTranslations('partners');
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                        {t('eyebrow')}
                    </span>
                    <h2 className="font-heading text-h1 sm:text-display-sm text-ink">
                        {t('headline')}
                    </h2>
                    <p className="mt-4 text-muted text-lg">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Partners Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {partnerItems.map((partner, index) => (
                        <motion.div
                            key={partner.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                            className="relative"
                            onMouseEnter={() => setHoveredPartner(index)}
                            onMouseLeave={() => setHoveredPartner(null)}
                        >
                            <div className="relative h-32 lg:h-40 rounded-card bg-white border border-border-light
                            flex items-center justify-center p-6 cursor-pointer
                            hover:border-primary-200 hover:shadow-card transition-all duration-300">
                                {/* Logo Placeholder */}
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary-50 flex items-center justify-center
                                text-primary-600 font-heading font-semibold text-lg">
                                        {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                    </div>
                                    <p className="mt-3 font-medium text-ink text-sm">{partner.name}</p>
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
                               bg-ink text-white rounded-xl p-4 shadow-lg min-w-[200px]"
                                        >
                                            {/* Arrow */}
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 
                                    bg-ink rotate-45 rounded-sm" />
                                            <div className="relative">
                                                <p className="text-white/60 text-xs">{partner.location}</p>
                                                <p className="mt-1 text-sm font-medium">{partner.specialty}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <Link href="/partners">
                        <Button variant="secondary" size="lg">
                            {t('cta')}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
