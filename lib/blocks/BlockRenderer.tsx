'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from '@/i18n/routing';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/button';
import type {
    ContentBlock,
    HeroBlock,
    AboutBlock,
    ServicesBlock,
    PartnersBlock,
    ContactBlock,
    InsightsBlock,
    IntroBlock,
    StoryBlock,
    MilestonesBlock,
    ValuesBlock,
    TeamBlock,
    CtaBlock,
    ServiceDetailsBlock,
    ProcessBlock,
    StatsRowBlock,
} from '@/lib/blocks/schema';

// ============================================
// Animation Variants
// ============================================

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

// ============================================
// Icon Mapping
// ============================================

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    regulatory: Icons.regulatory,
    market: Icons.market,
    wellness: Icons.wellness,
    insights: Icons.insights,
    search: Icons.search,
    strategy: Icons.regulatory,
    execute: Icons.market,
    success: Icons.wellness,
};

// ============================================
// Block Components
// ============================================

function HeroBlockRenderer({ block }: { block: HeroBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const taglineLines = block.tagline.split('\n');

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: block.backgroundImage ? `url(${block.backgroundImage})` : undefined,
            }}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
            
            {/* Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            >
                <motion.h1
                    variants={fadeUp}
                    className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight"
                >
                    {taglineLines.map((line, i) => (
                        <span key={i} className="block">
                            {line}
                        </span>
                    ))}
                </motion.h1>

                {block.subtagline && (
                    <motion.p
                        variants={fadeUp}
                        className="mt-6 text-xl text-white/80 max-w-2xl mx-auto"
                    >
                        {block.subtagline}
                    </motion.p>
                )}

                <motion.div
                    variants={fadeUp}
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                >
                    {block.ctaPrimary && (
                        <Link href={block.ctaPrimary.href}>
                            <Button size="lg" variant="secondary">
                                {block.ctaPrimary.text}
                            </Button>
                        </Link>
                    )}
                    {block.ctaSecondary && (
                        <Link href={block.ctaSecondary.href}>
                            <Button size="lg" variant="ghost">
                                {block.ctaSecondary.text}
                            </Button>
                        </Link>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
}

function AboutBlockRenderer({ block }: { block: AboutBlock }) {
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
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">
                        {block.headline}
                        {block.headlineAccent && (
                            <>
                                <br />
                                <span className="text-primary-600">{block.headlineAccent}</span>
                            </>
                        )}
                    </h2>
                    <p className="mt-6 text-muted text-lg leading-relaxed">
                        {block.mission}
                    </p>
                </motion.div>

                {block.pillars && block.pillars.length > 0 && (
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {block.pillars.map((pillar, index) => {
                            const Icon = pillar.icon ? iconMap[pillar.icon] || Icons.regulatory : Icons.regulatory;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="p-8 bg-white rounded-2xl border border-border-light shadow-card hover:shadow-card-hover transition-shadow"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center">
                                        <Icon className="w-7 h-7 text-primary-600" />
                                    </div>
                                    <h3 className="mt-6 font-heading text-xl text-ink">{pillar.title}</h3>
                                    <p className="mt-2 text-muted">{pillar.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

function ServicesBlockRenderer({ block }: { block: ServicesBlock }) {
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
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {block.services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 bg-surface rounded-2xl border border-border-light"
                        >
                            <h3 className="font-heading text-2xl text-ink">{service.title}</h3>
                            <p className="mt-4 text-muted">{service.description}</p>
                            
                            {service.features && service.features.length > 0 && (
                                <ul className="mt-6 space-y-3">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                            <span className="text-muted">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {service.cta && (
                                <div className="mt-8">
                                    <Link href={service.cta.href}>
                                        <Button variant="ghost">
                                            {service.cta.text}
                                            <Icons.arrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PartnersBlockRenderer({ block }: { block: PartnersBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                    {block.description && (
                        <p className="mt-4 text-muted text-lg">{block.description}</p>
                    )}
                </motion.div>

                {block.partners && block.partners.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {block.partners.map((partner, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="p-6 bg-white rounded-xl border border-border-light"
                            >
                                <h4 className="font-heading font-semibold text-ink">{partner.name}</h4>
                                {partner.location && (
                                    <p className="text-sm text-muted mt-1">{partner.location}</p>
                                )}
                                {partner.specialty && (
                                    <p className="text-sm text-primary-600 mt-2">{partner.specialty}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {block.ctaText && block.ctaHref && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-12 text-center"
                    >
                        <Link href={block.ctaHref}>
                            <Button size="lg">
                                {block.ctaText}
                                <Icons.arrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function ContactBlockRenderer({ block }: { block: ContactBlock }) {
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
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                    {block.description && (
                        <p className="mt-4 text-muted text-lg">{block.description}</p>
                    )}
                </motion.div>

                {/* Contact form would go here - using existing Contact component or a new one */}
                <div className="text-center text-muted">
                    <p>Contact form placeholder - implement based on your existing form</p>
                </div>
            </div>
        </section>
    );
}

function InsightsBlockRenderer({ block }: { block: InsightsBlock }) {
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
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                    {block.subheadline && (
                        <p className="mt-4 text-muted text-lg">{block.subheadline}</p>
                    )}
                </motion.div>

                {block.stats && block.stats.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {block.stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="text-center p-6 bg-surface rounded-xl"
                            >
                                <p className="font-heading text-3xl font-bold text-primary-600">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-ink font-medium">{stat.label}</p>
                                {stat.note && (
                                    <p className="mt-1 text-sm text-muted">{stat.note}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {block.ctaText && block.ctaHref && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <Link href={block.ctaHref}>
                            <Button variant="ghost">
                                {block.ctaText}
                                <Icons.arrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function IntroBlockRenderer({ block }: { block: IntroBlock }) {
    return (
        <section className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {block.eyebrow}
                        </span>
                    )}
                    <h1 className="font-heading text-4xl lg:text-5xl text-ink">
                        {block.headline}
                        {block.headlineAccent && (
                            <>
                                <br />
                                <span className="text-primary-600">{block.headlineAccent}</span>
                            </>
                        )}
                    </h1>
                    {block.text && (
                        <p className="mt-6 text-xl text-muted leading-relaxed">{block.text}</p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

function StoryBlockRenderer({ block }: { block: StoryBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    {block.title && (
                        <h2 className="font-heading text-3xl text-ink">{block.title}</h2>
                    )}
                    <div className="mt-6 space-y-4 text-muted leading-relaxed">
                        {block.paragraphs.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function MilestonesBlockRenderer({ block }: { block: MilestonesBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative pl-8 border-l-2 border-primary-200 max-w-xl">
                    {block.milestones.map((milestone, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="relative mb-8 last:mb-0"
                        >
                            <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary-500 border-4 border-white" />
                            <span className="text-primary-600 font-heading font-semibold">
                                {milestone.year}
                            </span>
                            <p className="mt-1 text-ink">{milestone.event}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ValuesBlockRenderer({ block }: { block: ValuesBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(block.title || block.subtitle) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        {block.title && (
                            <h2 className="font-heading text-3xl text-ink">{block.title}</h2>
                        )}
                        {block.subtitle && (
                            <p className="mt-4 text-muted text-lg">{block.subtitle}</p>
                        )}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {block.values.map((value, index) => {
                        const Icon = value.icon ? iconMap[value.icon] || Icons.regulatory : Icons.regulatory;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-8 bg-white rounded-2xl border border-border-light"
                            >
                                <Icon className="w-10 h-10 text-primary-600" />
                                <h3 className="mt-4 font-heading text-xl text-ink">{value.title}</h3>
                                <p className="mt-2 text-muted">{value.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function TeamBlockRenderer({ block }: { block: TeamBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(block.title || block.subtitle) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        {block.title && (
                            <h2 className="font-heading text-3xl text-ink">{block.title}</h2>
                        )}
                        {block.subtitle && (
                            <p className="mt-4 text-muted text-lg">{block.subtitle}</p>
                        )}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {block.members.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                <span className="text-2xl font-heading font-bold text-primary-600">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <h4 className="mt-4 font-heading font-semibold text-ink">{member.name}</h4>
                            <p className="text-sm text-primary-600">{member.role}</p>
                            {member.bio && (
                                <p className="mt-2 text-sm text-muted">{member.bio}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CtaBlockRenderer({ block }: { block: CtaBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-primary-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-heading text-3xl sm:text-4xl text-white">{block.headline}</h2>
                    {block.description && (
                        <p className="mt-4 text-xl text-white/80">{block.description}</p>
                    )}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        {block.primaryButton && (
                            <Link href={block.primaryButton.href}>
                                <Button size="lg" variant="secondary">
                                    {block.primaryButton.text}
                                </Button>
                            </Link>
                        )}
                        {block.secondaryButton && (
                            <Link href={block.secondaryButton.href}>
                                <Button size="lg" variant="ghost" className="border-white/30 text-white hover:bg-white/10">
                                    {block.secondaryButton.text}
                                </Button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function ServiceDetailsBlockRenderer({ block }: { block: ServiceDetailsBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} id={block.serviceId} className="py-16 lg:py-24 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="lg:sticky lg:top-32"
                    >
                        <h2 className="font-heading text-3xl text-ink">{block.title}</h2>
                        <p className="mt-4 text-muted text-lg leading-relaxed">{block.description}</p>
                        
                        {block.features && block.features.length > 0 && (
                            <ul className="mt-6 space-y-3">
                                {block.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                        <span className="text-muted">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {block.ctaText && block.ctaHref && (
                            <div className="mt-8">
                                <Link href={block.ctaHref}>
                                    <Button size="lg">
                                        {block.ctaText}
                                        <Icons.arrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>

                    {block.details && block.details.length > 0 && (
                        <div className="space-y-6">
                            {block.details.map((detail, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 bg-surface rounded-2xl border border-border-light"
                                >
                                    <h3 className="font-heading text-xl text-ink">{detail.title}</h3>
                                    <p className="mt-3 text-muted">{detail.description}</p>
                                    {detail.tags && detail.tags.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {detail.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-white text-primary-700 text-sm rounded-full border border-primary-100"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function ProcessBlockRenderer({ block }: { block: ProcessBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(block.title || block.subtitle) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        {block.title && (
                            <h2 className="font-heading text-3xl text-ink">{block.title}</h2>
                        )}
                        {block.subtitle && (
                            <p className="mt-4 text-muted text-lg">{block.subtitle}</p>
                        )}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {block.steps.map((step, index) => {
                        const Icon = step.icon ? iconMap[step.icon] || Icons.regulatory : Icons.regulatory;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative p-6 bg-white rounded-2xl border border-border-light"
                            >
                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="mt-2">
                                    <Icon className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="mt-4 font-heading text-lg text-ink">{step.title}</h3>
                                <p className="mt-2 text-sm text-muted">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function StatsRowBlockRenderer({ block }: { block: StatsRowBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {block.stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <p className="font-heading text-4xl font-bold text-primary-600">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-muted">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// Main BlockRenderer Component
// ============================================

interface BlockRendererProps {
    blocks: ContentBlock[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <>
            {blocks.map((block, index) => {
                const key = `block-${index}-${block.type}`;
                
                switch (block.type) {
                    case 'hero':
                        return <HeroBlockRenderer key={key} block={block} />;
                    case 'about':
                        return <AboutBlockRenderer key={key} block={block} />;
                    case 'services':
                        return <ServicesBlockRenderer key={key} block={block} />;
                    case 'partners':
                        return <PartnersBlockRenderer key={key} block={block} />;
                    case 'contact':
                        return <ContactBlockRenderer key={key} block={block} />;
                    case 'insights':
                        return <InsightsBlockRenderer key={key} block={block} />;
                    case 'intro':
                        return <IntroBlockRenderer key={key} block={block} />;
                    case 'story':
                        return <StoryBlockRenderer key={key} block={block} />;
                    case 'milestones':
                        return <MilestonesBlockRenderer key={key} block={block} />;
                    case 'values':
                        return <ValuesBlockRenderer key={key} block={block} />;
                    case 'team':
                        return <TeamBlockRenderer key={key} block={block} />;
                    case 'cta':
                        return <CtaBlockRenderer key={key} block={block} />;
                    case 'serviceDetails':
                        return <ServiceDetailsBlockRenderer key={key} block={block} />;
                    case 'process':
                        return <ProcessBlockRenderer key={key} block={block} />;
                    case 'statsRow':
                        return <StatsRowBlockRenderer key={key} block={block} />;
                    default:
                        // Unknown block type - skip or render placeholder
                        console.warn(`Unknown block type: ${(block as ContentBlock).type}`);
                        return null;
                }
            })}
        </>
    );
}
