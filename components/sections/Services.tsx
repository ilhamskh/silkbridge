'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Icons } from '@/components/ui/Icons';

const serviceCards = [
    {
        id: 'marketEntry',
        icon: Icons.market,
        gradient: 'from-primary-600 to-primary-700',
        href: '/services#market-entry',
        featuresCount: 5,
    },
    {
        id: 'healthTourism',
        icon: Icons.wellness,
        gradient: 'from-primary-500 to-primary-600',
        href: '/services#health-tourism',
        featuresCount: 5,
    },
];

export default function Services() {
    const t = useTranslations('services');
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-white">
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
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {serviceCards.map((service, index) => {
                        const Icon = service.icon;
                        const features = [];
                        for (let i = 1; i <= service.featuresCount; i++) {
                            features.push(t(`${service.id}.feature${i}`));
                        }

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                                className="group relative"
                            >
                                <div className="relative h-full overflow-hidden rounded-card">
                                    {/* Background layers */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-surface to-white" />
                                    <div className="absolute inset-0 border border-border-light rounded-card" />

                                    {/* Hover gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 
                                  group-hover:opacity-[0.03] transition-opacity duration-500`} />

                                    {/* Content */}
                                    <div className="relative p-8 lg:p-10">
                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} 
                                   flex items-center justify-center shadow-button
                                   group-hover:scale-105 transition-transform duration-300`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="mt-6 font-heading text-h2 text-ink">
                                            {t(`${service.id}.title`)}
                                        </h3>
                                        <p className="mt-3 text-muted text-body">
                                            {t(`${service.id}.description`)}
                                        </p>

                                        {/* Features */}
                                        <ul className="mt-6 space-y-3">
                                            {features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-3">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                                    <span className="text-body-sm text-muted">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Link */}
                                        <Link
                                            href={service.href}
                                            className="inline-flex items-center gap-2 mt-8 text-primary-600 font-medium
                               group/link hover:gap-3 transition-all duration-200"
                                        >
                                            <span className="relative">
                                                {t('learnMore')}
                                                <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-primary-600
                                       group-hover/link:w-full transition-all duration-300" />
                                            </span>
                                            <Icons.chevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
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
