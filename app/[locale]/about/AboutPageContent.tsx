'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Icons } from '@/components/ui/Icons';

const teamKeys = ['member1', 'member2', 'member3', 'member4'] as const;
const valueKeys = ['excellence', 'integrity', 'innovation', 'compassion'] as const;
const milestoneKeys = ['milestone1', 'milestone2', 'milestone3', 'milestone4', 'milestone5', 'milestone6'] as const;

const valueIcons = {
    excellence: Icons.regulatory,
    integrity: Icons.market,
    innovation: Icons.insights,
    compassion: Icons.wellness,
};

export default function AboutPageContent() {
    const t = useTranslations('aboutPage');

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

            {/* Story Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="font-heading text-h1 text-ink">{t('story.title')}</h2>
                            <div className="mt-6 space-y-4 text-muted leading-relaxed">
                                <p>{t('story.para1')}</p>
                                <p>{t('story.para2')}</p>
                                <p>{t('story.para3')}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Timeline */}
                            <div className="relative pl-8 border-l-2 border-primary-200">
                                {milestoneKeys.map((key, index) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="relative mb-8 last:mb-0"
                                    >
                                        {/* Dot */}
                                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary-500 border-4 border-white" />

                                        <span className="text-primary-600 font-heading font-semibold">
                                            {t(`milestones.${key}.year`)}
                                        </span>
                                        <p className="mt-1 text-ink">{t(`milestones.${key}.event`)}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 lg:py-24 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <h2 className="font-heading text-h1 text-ink">{t('values.title')}</h2>
                        <p className="mt-4 text-muted text-lg">{t('values.subtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {valueKeys.map((key, index) => {
                            const Icon = valueIcons[key];
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 bg-white rounded-card border border-border-light"
                                >
                                    <Icon className="w-10 h-10 text-primary-600" />
                                    <h3 className="mt-4 font-heading text-h3 text-ink">
                                        {t(`values.${key}.title`)}
                                    </h3>
                                    <p className="mt-2 text-muted">{t(`values.${key}.description`)}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <h2 className="font-heading text-h1 text-ink">{t('team.title')}</h2>
                        <p className="mt-4 text-muted text-lg">{t('team.subtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamKeys.map((key, index) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                {/* Avatar Placeholder */}
                                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-primary-50 
                              flex items-center justify-center border-4 border-white shadow-card">
                                    <span className="text-3xl font-heading font-semibold text-primary-600">
                                        {t(`team.${key}.name`).split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <h3 className="mt-6 font-heading text-h3 text-ink">
                                    {t(`team.${key}.name`)}
                                </h3>
                                <p className="mt-1 text-primary-600 text-sm font-medium">
                                    {t(`team.${key}.role`)}
                                </p>
                                <p className="mt-3 text-muted text-body-sm">{t(`team.${key}.bio`)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
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
                            <Link
                                href="/contact"
                                className="inline-flex items-center px-8 py-4 bg-white text-primary-700 
                         font-medium rounded-xl hover:bg-primary-50 transition-colors"
                            >
                                {t('cta.button')}
                                <Icons.arrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
