'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/ui/Icons';

const iconMap = {
    regulatory: Icons.regulatory,
    market: Icons.market,
    wellness: Icons.wellness,
};

const pillars = [
    { icon: 'regulatory', titleKey: 'pillar1Title', descKey: 'pillar1Desc' },
    { icon: 'market', titleKey: 'pillar2Title', descKey: 'pillar2Desc' },
    { icon: 'wellness', titleKey: 'pillar3Title', descKey: 'pillar3Desc' },
] as const;

export default function About() {
    const t = useTranslations('about');
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                        {t('eyebrow')}
                    </span>
                    <h2 className="font-heading text-h1 sm:text-display-sm text-ink">
                        {t('headline')}
                        <br />
                        <span className="text-primary-600">{t('headlineAccent')}</span>
                    </h2>
                    <p className="mt-6 text-muted text-lg leading-relaxed">
                        {t('mission')}
                    </p>
                </motion.div>

                {/* Pillars */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pillars.map((pillar, index) => {
                        const Icon = iconMap[pillar.icon as keyof typeof iconMap];

                        return (
                            <motion.div
                                key={pillar.titleKey}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative p-8 bg-white rounded-card border border-border-light
                              shadow-card hover:shadow-card-hover transition-shadow duration-300">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center
                                group-hover:bg-primary-100 transition-colors duration-300">
                                        <Icon className="w-7 h-7 text-primary-600" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="mt-6 font-heading text-h3 text-ink">
                                        {t(pillar.titleKey)}
                                    </h3>
                                    <p className="mt-2 text-muted text-body-sm">
                                        {t(pillar.descKey)}
                                    </p>

                                    {/* Decorative corner */}
                                    <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-card">
                                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-primary-100/50 to-transparent rotate-45" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
