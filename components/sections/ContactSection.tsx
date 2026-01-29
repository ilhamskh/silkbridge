'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { siteConfig } from '@/content/site-config';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import { Icons } from '@/components/ui/Icons';

interface ContactSectionProps {
    eyebrow?: string;
    headline: string;
    description?: string;
}

export default function ContactSection({ eyebrow, headline, description }: ContactSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        type: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setStatus('success');
            setFormState({ name: '', email: '', type: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const inquiryTypes = [
        { value: 'flights', label: 'Flight Bookings' },
        { value: 'hotels', label: 'Hotel Reservations' },
        { value: 'packages', label: 'Travel Packages' },
        { value: 'transfers', label: 'Transfers & Car Rental' },
        { value: 'guides', label: 'Professional Guides' },
        { value: 'visa', label: 'Visa Support' },
        { value: 'partnership', label: 'Partnership Inquiry' },
        { value: 'general', label: 'General Inquiry' },
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
                    {eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-h1 sm:text-display-sm text-ink">
                        {headline}
                    </h2>
                    {description && (
                        <p className="mt-4 text-muted text-lg">
                            {description}
                        </p>
                    )}
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
                                    label="Name"
                                    placeholder="Your name"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    required
                                    disabled={status === 'loading'}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    required
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <Select
                                label="Inquiry Type"
                                placeholder="Select a service"
                                options={inquiryTypes}
                                value={formState.type}
                                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                                required
                                disabled={status === 'loading'}
                            />

                            <Textarea
                                label="Message"
                                placeholder="Tell us about your travel plans..."
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                rows={5}
                                required
                                disabled={status === 'loading'}
                            />

                            {status === 'success' && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                                    ✓ Message sent successfully! We'll get back to you soon.
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                                    ✗ Failed to send message. Please try again.
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
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
                        <div className="relative h-64 rounded-card bg-gradient-to-br from-primary-100 to-primary-50 border border-border-light overflow-hidden">
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
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-600/20 rounded-full animate-ping" />
                                </div>
                            </div>

                            {/* Label */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-border-light">
                                <p className="text-sm font-medium text-ink">Our Office</p>
                                <p className="text-sm text-muted mt-1">View on Map →</p>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-card bg-surface border border-border-light">
                                <Icons.email className="w-6 h-6 text-primary-600" />
                                <p className="mt-4 text-sm text-muted">Email Us</p>
                                <a
                                    href={`mailto:${siteConfig.email}`}
                                    className="mt-1 text-ink font-medium hover:text-primary-600 transition-colors block"
                                >
                                    {siteConfig.email}
                                </a>
                            </div>

                            <div className="p-6 rounded-card bg-surface border border-border-light">
                                <Icons.phone className="w-6 h-6 text-primary-600" />
                                <p className="mt-4 text-sm text-muted">Call Us</p>
                                <a
                                    href={`tel:${siteConfig.phone}`}
                                    className="mt-1 text-ink font-medium hover:text-primary-600 transition-colors block"
                                >
                                    {siteConfig.phone}
                                </a>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="p-6 rounded-card bg-surface border border-border-light">
                            <Icons.mapPin className="w-6 h-6 text-primary-600" />
                            <p className="mt-4 text-sm text-muted">Visit Us</p>
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
