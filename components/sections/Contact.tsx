'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/content/site-config';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import { Icons } from '@/components/ui/Icons';

export default function Contact() {
    const t = useTranslations('contact');
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        type: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission would be handled here
        console.log('Form submitted:', formState);
    };

    // Generate inquiry type options from translations
    const inquiryTypes = [
        { value: 'market-entry', label: t('form.typeMarketEntry') },
        { value: 'health-tourism', label: t('form.typeHealthTourism') },
        { value: 'partnership', label: t('form.typePartnership') },
        { value: 'general', label: t('form.typeGeneral') },
    ];

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
                    <p className="mt-4 text-muted text-lg">
                        {t('description')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input
                                    label={t('form.nameLabel')}
                                    placeholder={t('form.namePlaceholder')}
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t('form.emailLabel')}
                                    type="email"
                                    placeholder={t('form.emailPlaceholder')}
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    required
                                />
                            </div>

                            <Select
                                label={t('form.typeLabel')}
                                placeholder={t('form.typePlaceholder')}
                                options={inquiryTypes}
                                value={formState.type}
                                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                                required
                            />

                            <Textarea
                                label={t('form.messageLabel')}
                                placeholder={t('form.messagePlaceholder')}
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                rows={5}
                                required
                            />

                            <Button type="submit" size="lg" className="w-full sm:w-auto">
                                {t('form.submit')}
                                <Icons.arrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </motion.div>

                    {/* Contact Info + Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Map Placeholder */}
                        <div className="relative h-64 rounded-card bg-gradient-to-br from-primary-100 to-primary-50 
                          border border-border-light overflow-hidden">
                            {/* Map pattern */}
                            <div className="absolute inset-0 opacity-30">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `
                      linear-gradient(90deg, #2F68BB 1px, transparent 1px),
                      linear-gradient(#2F68BB 1px, transparent 1px)
                    `,
                                        backgroundSize: '20px 20px',
                                    }}
                                />
                            </div>

                            {/* Pin */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                                <div className="relative">
                                    <Icons.mapPin className="w-10 h-10 text-primary-600" />
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 
                                bg-primary-600/20 rounded-full animate-ping" />
                                </div>
                            </div>

                            {/* Label */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm 
                            rounded-xl p-4 border border-border-light">
                                <p className="text-sm font-medium text-ink">{t('officeLabel')}</p>
                                <p className="text-sm text-muted mt-1">{t('viewOnMap')} →</p>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-card bg-surface border border-border-light">
                                <Icons.email className="w-6 h-6 text-primary-600" />
                                <p className="mt-4 text-sm text-muted">{t('emailUs')}</p>
                                <a
                                    href={`mailto:${siteConfig.email}`}
                                    className="mt-1 text-ink font-medium hover:text-primary-600 transition-colors"
                                >
                                    {siteConfig.email}
                                </a>
                            </div>

                            <div className="p-6 rounded-card bg-surface border border-border-light">
                                <Icons.phone className="w-6 h-6 text-primary-600" />
                                <p className="mt-4 text-sm text-muted">{t('callUs')}</p>
                                <a
                                    href={`tel:${siteConfig.phone}`}
                                    className="mt-1 text-ink font-medium hover:text-primary-600 transition-colors"
                                >
                                    {siteConfig.phone}
                                </a>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="p-6 rounded-card bg-surface border border-border-light">
                            <Icons.mapPin className="w-6 h-6 text-primary-600" />
                            <p className="mt-4 text-sm text-muted">{t('visitUs')}</p>
                            <p className="mt-1 text-ink font-medium">
                                {siteConfig.address}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
