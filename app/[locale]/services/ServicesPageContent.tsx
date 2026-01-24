'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/button';

const marketEntryDetailKeys = ['regulatory', 'intelligence', 'partner'] as const;
const healthTourismDetailKeys = ['medical', 'travel', 'concierge'] as const;
const processSteps = ['discovery', 'strategy', 'execution', 'success'] as const;

export default function ServicesPageContent() {
    const t = useTranslations('servicesPage');

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

            {/* Market Entry Section */}
            <section id="market-entry" className="py-16 lg:py-24 bg-white scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:sticky lg:top-32"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 
                            flex items-center justify-center shadow-button">
                                <Icons.market className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="mt-6 font-heading text-h1 text-ink">
                                {t('marketEntry.title')}
                            </h2>
                            <p className="mt-4 text-muted text-lg leading-relaxed">
                                {t('marketEntry.description')}
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                        <span className="text-muted">{t(`marketEntry.feature${i}`)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link href="/contact?type=pharma">
                                    <Button size="lg">
                                        {t('marketEntry.cta')}
                                        <Icons.arrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        <div className="space-y-6">
                            {marketEntryDetailKeys.map((key, index) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 bg-surface rounded-card border border-border-light"
                                >
                                    <h3 className="font-heading text-h3 text-ink">
                                        {t(`marketEntry.details.${key}.title`)}
                                    </h3>
                                    <p className="mt-3 text-muted">
                                        {t(`marketEntry.details.${key}.description`)}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-white text-primary-700 text-sm rounded-full 
                                 border border-primary-100"
                                            >
                                                {t(`marketEntry.details.${key}.tag${i}`)}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
            </div>

            {/* Health Tourism Section */}
            <section id="health-tourism" className="py-16 lg:py-24 bg-white scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        <div className="space-y-6 order-2 lg:order-1">
                            {healthTourismDetailKeys.map((key, index) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 bg-surface rounded-card border border-border-light"
                                >
                                    <h3 className="font-heading text-h3 text-ink">
                                        {t(`healthTourism.details.${key}.title`)}
                                    </h3>
                                    <p className="mt-3 text-muted">
                                        {t(`healthTourism.details.${key}.description`)}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-white text-primary-700 text-sm rounded-full 
                                 border border-primary-100"
                                            >
                                                {t(`healthTourism.details.${key}.tag${i}`)}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:sticky lg:top-32 order-1 lg:order-2"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 
                            flex items-center justify-center shadow-button">
                                <Icons.wellness className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="mt-6 font-heading text-h1 text-ink">
                                {t('healthTourism.title')}
                            </h2>
                            <p className="mt-4 text-muted text-lg leading-relaxed">
                                {t('healthTourism.description')}
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                        <span className="text-muted">{t(`healthTourism.feature${i}`)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link href="/contact?type=patient">
                                    <Button size="lg">
                                        {t('healthTourism.cta')}
                                        <Icons.arrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 lg:py-24 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <h2 className="font-heading text-h1 text-ink">{t('process.title')}</h2>
                        <p className="mt-4 text-muted text-lg">{t('process.subtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="text-5xl font-heading font-bold text-primary-100">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <h3 className="mt-4 font-heading text-h3 text-ink">
                                    {t(`process.steps.${step}.title`)}
                                </h3>
                                <p className="mt-2 text-muted text-body-sm">
                                    {t(`process.steps.${step}.description`)}
                                </p>

                                {/* Connector line (hidden on last item) */}
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-primary-200 to-transparent" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-ink">
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
                        <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
                            {t('cta.description')}
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/contact">
                                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                                    {t('cta.button1')}
                                </Button>
                            </Link>
                            <Link href="/partners">
                                <Button variant="ghost" size="lg">
                                    {t('cta.button2')}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
