'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { statsData } from '@/content/site-config';
import Button from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

export default function InsightsSnapshot() {
    const t = useTranslations('insights');
    const tStats = useTranslations('stats');
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-ink relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="inline-block text-primary-300 text-sm font-medium tracking-wide uppercase mb-4">
                        {t('eyebrow')}
                    </span>
                    <h2 className="font-heading text-h1 sm:text-display-sm text-white">
                        {t('headline')}
                    </h2>
                    <p className="mt-4 text-white/60 text-lg">
                        {t('subheadline')}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={stat.labelKey}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                            className="relative group"
                        >
                            <div className="relative p-6 lg:p-8 rounded-card bg-white/5 border border-white/10
                            backdrop-blur-sm hover:bg-white/[0.08] transition-colors duration-300">
                                {/* Value */}
                                <div className="font-heading text-3xl lg:text-4xl text-white font-semibold">
                                    {stat.value}
                                </div>

                                {/* Label */}
                                <p className="mt-2 text-white/70 text-body-sm leading-snug">
                                    {tStats(stat.labelKey)}
                                </p>

                                {/* Source */}
                                <p className="mt-3 text-white/40 text-xs">
                                    {tStats('source')}: {stat.source}
                                </p>

                                {/* Hover accent */}
                                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/market-insights">
                        <Button variant="ghost" size="lg">
                            {t('viewAll')}
                        </Button>
                    </Link>
                    <button className="inline-flex items-center gap-2 px-6 py-3 text-white/80 hover:text-white
                           transition-colors group">
                        <Icons.download className="w-5 h-5" />
                        <span>{t('downloadReport')}</span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
