'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/content/site-config';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import { Icons } from '@/components/ui/Icons';

export default function ContactPageContent() {
    const t = useTranslations('contactPage');
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        company: '',
        type: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inquiryTypes = [
        { value: 'market-entry', label: t('form.typeMarketEntry') },
        { value: 'health-tourism', label: t('form.typeHealthTourism') },
        { value: 'partnership', label: t('form.typePartnership') },
        { value: 'general', label: t('form.typeGeneral') },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Form submission would be handled here
        console.log('Form submitted:', formState);
        setTimeout(() => setIsSubmitting(false), 1000);
    };

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
                        </h1>
                        <p className="mt-6 text-xl text-muted leading-relaxed">
                            {t('intro')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form + Info */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="font-heading text-h2 text-ink mb-8">{t('form.title')}</h2>
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

                                <Input
                                    label={t('form.companyLabel')}
                                    placeholder={t('form.companyPlaceholder')}
                                    value={formState.company}
                                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                                />

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
                                    rows={6}
                                    required
                                />

                                <Button type="submit" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? t('form.submitting') : t('form.submit')}
                                    <Icons.arrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="font-heading text-h2 text-ink mb-8">{t('info.title')}</h2>
                                <p className="text-muted text-lg">{t('info.description')}</p>
                            </div>

                            {/* Contact Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-card bg-surface border border-border-light">
                                    <Icons.email className="w-8 h-8 text-primary-600" />
                                    <h3 className="mt-4 font-heading text-h4 text-ink">{t('info.emailTitle')}</h3>
                                    <p className="mt-2 text-sm text-muted">{t('info.emailDesc')}</p>
                                    <a
                                        href={`mailto:${siteConfig.email}`}
                                        className="mt-3 inline-block text-primary-600 font-medium hover:text-primary-700 transition-colors"
                                    >
                                        {siteConfig.email}
                                    </a>
                                </div>

                                <div className="p-6 rounded-card bg-surface border border-border-light">
                                    <Icons.phone className="w-8 h-8 text-primary-600" />
                                    <h3 className="mt-4 font-heading text-h4 text-ink">{t('info.phoneTitle')}</h3>
                                    <p className="mt-2 text-sm text-muted">{t('info.phoneDesc')}</p>
                                    <a
                                        href={`tel:${siteConfig.phone}`}
                                        className="mt-3 inline-block text-primary-600 font-medium hover:text-primary-700 transition-colors"
                                    >
                                        {siteConfig.phone}
                                    </a>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="p-6 rounded-card bg-surface border border-border-light">
                                <Icons.mapPin className="w-8 h-8 text-primary-600" />
                                <h3 className="mt-4 font-heading text-h4 text-ink">{t('info.officeTitle')}</h3>
                                <p className="mt-2 text-muted">{siteConfig.address}</p>
                            </div>

                            {/* Map Placeholder */}
                            <div className="relative h-64 rounded-card bg-gradient-to-br from-primary-100 to-primary-50 
                                border border-border-light overflow-hidden">
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
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                                    <div className="relative">
                                        <Icons.mapPin className="w-10 h-10 text-primary-600" />
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 
                                            bg-primary-600/20 rounded-full animate-ping" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
