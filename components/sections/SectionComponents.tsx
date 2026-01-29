'use client';

import { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * SectionHeader - Consistent section header with eyebrow, title, and subtitle
 * 
 * Usage:
 * <SectionHeader 
 *   eyebrow="Our Services"
 *   title="What We Offer" 
 *   subtitle="Premium tourism solutions tailored to your needs"
 * />
 */
interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    titleAccent?: string;
    subtitle?: string;
    align?: 'left' | 'center';
    theme?: 'light' | 'dark';
    className?: string;
}

export function SectionHeader({
    eyebrow,
    title,
    titleAccent,
    subtitle,
    align = 'center',
    theme = 'light',
    className = '',
}: SectionHeaderProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const textColors = theme === 'dark'
        ? { eyebrow: 'text-primary-300', title: 'text-white', accent: 'text-primary-300', subtitle: 'text-white/80' }
        : { eyebrow: 'text-primary-600', title: 'text-ink', accent: 'text-primary-600', subtitle: 'text-muted' };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`${align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl'} ${className}`}
        >
            {/* Eyebrow with accent line */}
            {eyebrow && (
                <div className={`flex items-center gap-3 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
                    <span className={`text-sm font-semibold tracking-wider uppercase ${textColors.eyebrow}`}>
                        {eyebrow}
                    </span>
                    {align === 'center' && (
                        <div className="w-8 h-0.5 bg-gradient-to-l from-primary-500 to-primary-700 rounded-full" />
                    )}
                </div>
            )}

            {/* Title */}
            <h2 className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${textColors.title}`}>
                {title}
                {titleAccent && (
                    <span className={` ${textColors.accent}`}> {titleAccent}</span>
                )}
            </h2>

            {/* Subtitle */}
            {subtitle && (
                <p className={`mt-4 text-lg leading-relaxed ${textColors.subtitle}`}>
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}

/**
 * SectionShell - Consistent section wrapper with variants
 * 
 * Variants:
 * - plain: Clean layout with bg color
 * - panel: Content in a surface card with border
 * - featured: Raised panel with stronger shadow and accent
 */
interface SectionShellProps {
    children: ReactNode;
    variant?: 'plain' | 'panel' | 'featured';
    background?: 'white' | 'surface' | 'gradient' | 'dark';
    showDivider?: boolean;
    id?: string;
    className?: string;
}

export function SectionShell({
    children,
    variant = 'plain',
    background = 'white',
    showDivider = false,
    id,
    className = '',
}: SectionShellProps) {
    const bgClasses = {
        white: 'bg-white',
        surface: 'bg-surface',
        gradient: 'bg-gradient-to-b from-surface via-white to-surface',
        dark: 'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950',
    };

    return (
        <section
            id={id}
            className={`relative py-20 lg:py-28 ${bgClasses[background]} ${className}`}
        >
            {/* Optional top divider */}
            {showDivider && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {variant === 'plain' && children}

                {variant === 'panel' && (
                    <div className="bg-white rounded-2xl border border-border-light p-8 lg:p-12 shadow-soft">
                        {children}
                    </div>
                )}

                {variant === 'featured' && (
                    <div className="relative">
                        {/* Gradient glow behind */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/10 to-primary-700/10 rounded-3xl blur-xl" />

                        <div className="relative bg-white rounded-2xl border border-primary-100 p-8 lg:p-12 shadow-lg">
                            {/* Corner accent */}
                            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-tl-2xl" />
                            <div className="relative">
                                {children}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

/**
 * CtaBanner - Premium call-to-action banner component
 * 
 * Usage:
 * <CtaBanner
 *   eyebrow="Get Started"
 *   title="Ready to Begin Your Journey?"
 *   subtitle="Contact us today for a free consultation"
 *   primaryCta={{ text: "Get Consultation", href: "/contact" }}
 *   secondaryCta={{ text: "Learn More", href: "/services" }}
 * />
 */
interface CtaBannerProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    variant?: 'dark' | 'light' | 'gradient';
    className?: string;
}

export function CtaBanner({
    eyebrow,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    variant = 'dark',
    className = '',
}: CtaBannerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const variants = {
        dark: {
            bg: 'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950',
            title: 'text-white',
            subtitle: 'text-white/80',
            eyebrow: 'text-primary-300',
            primaryBtn: 'bg-white text-primary-900 hover:bg-primary-50 shadow-xl hover:shadow-2xl',
            secondaryBtn: 'border-2 border-white text-white hover:bg-white hover:text-primary-900',
        },
        light: {
            bg: 'bg-white border border-border-light shadow-soft',
            title: 'text-ink',
            subtitle: 'text-muted',
            eyebrow: 'text-primary-600',
            primaryBtn: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl',
            secondaryBtn: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
        },
        gradient: {
            bg: 'bg-gradient-to-r from-primary-600 to-primary-800',
            title: 'text-white',
            subtitle: 'text-white/90',
            eyebrow: 'text-primary-200',
            primaryBtn: 'bg-white text-primary-700 hover:bg-primary-50 shadow-xl',
            secondaryBtn: 'border-2 border-white/50 text-white hover:bg-white/10',
        },
    };

    const styles = variants[variant];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`relative overflow-hidden rounded-2xl ${styles.bg} ${className}`}
        >
            {/* Decorative elements for dark/gradient variants */}
            {(variant === 'dark' || variant === 'gradient') && (
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
                </div>
            )}

            <div className="relative px-8 py-12 lg:px-16 lg:py-16">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    {/* Content */}
                    <div className="flex-1 text-center lg:text-left">
                        {eyebrow && (
                            <span className={`inline-block text-sm font-semibold tracking-wider uppercase mb-3 ${styles.eyebrow}`}>
                                {eyebrow}
                            </span>
                        )}
                        <h3 className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-bold ${styles.title}`}>
                            {title}
                        </h3>
                        {subtitle && (
                            <p className={`mt-3 text-lg ${styles.subtitle}`}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                        <a
                            href={primaryCta.href}
                            className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 ${styles.primaryBtn}`}
                        >
                            {primaryCta.text}
                        </a>
                        {secondaryCta && (
                            <a
                                href={secondaryCta.href}
                                className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 ${styles.secondaryBtn}`}
                            >
                                {secondaryCta.text}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * PartnerCtaPanel - Premium partnership CTA section
 * 
 * A feature CTA panel specifically for partnership calls-to-action
 */
interface PartnerCtaPanelProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    benefits?: string[];
    primaryCta: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    className?: string;
}

export function PartnerCtaPanel({
    eyebrow = 'PARTNERSHIPS',
    title,
    subtitle,
    benefits = [],
    primaryCta,
    secondaryCta,
    className = '',
}: PartnerCtaPanelProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`relative overflow-hidden ${className}`}
        >
            {/* Gradient border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 rounded-3xl opacity-20 blur-sm" />

            <div className="relative bg-white rounded-2xl border border-primary-100 overflow-hidden">
                {/* Subtle inner gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent" />

                <div className="relative p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left: Content */}
                        <div>
                            {/* Eyebrow */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
                                <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">
                                    {eyebrow}
                                </span>
                            </div>

                            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-ink">
                                {title}
                            </h3>

                            {subtitle && (
                                <p className="mt-3 text-lg text-muted">
                                    {subtitle}
                                </p>
                            )}

                            {/* Benefits list */}
                            {benefits.length > 0 && (
                                <ul className="mt-6 space-y-3">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0" />
                                            <span className="text-muted">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Right: CTA Card */}
                        <div className="lg:pl-8">
                            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 rounded-2xl p-8 text-center relative overflow-hidden">
                                {/* Decorative glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

                                <div className="relative">
                                    <p className="text-white/80 mb-6">
                                        Ready to join our network?
                                    </p>

                                    {/* Primary CTA - High contrast white button */}
                                    <a
                                        href={primaryCta.href}
                                        className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold rounded-xl bg-white text-primary-900 hover:bg-primary-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                                    >
                                        {primaryCta.text}
                                    </a>

                                    {secondaryCta && (
                                        <a
                                            href={secondaryCta.href}
                                            className="inline-flex items-center justify-center w-full mt-4 px-8 py-3 text-white hover:text-primary-200 transition-colors underline-offset-4 hover:underline"
                                        >
                                            {secondaryCta.text}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
