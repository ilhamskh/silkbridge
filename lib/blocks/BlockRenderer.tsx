'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import * as React from 'react';
import { Link } from '@/i18n/routing';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/button';
import { HeroParallaxBlue } from '@/components/sections/HeroParallaxBlue';
import { InteractiveServices } from '@/components/sections/InteractiveServices';
import { WhyUsSection } from '@/components/sections/WhyUsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { Storyline } from '@/components/sections/Storyline';
import ContactSection from '@/components/sections/ContactSection';
import { PartnerCard } from '@/components/partners/PartnerCard';
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
    StorylineBlock,
    MilestonesBlock,
    ValuesBlock,
    TeamBlock,
    CtaBlock,
    ServiceDetailsBlock,
    ProcessBlock,
    StatsRowBlock,
    AreasBlock,
    PartnersEmptyBlock,
    GalleryBlock,
    PackagesBlock,
    VehicleFleetBlock,
    FormSelectorBlock,
    TestimonialsBlock,
    InsightsListBlock,
    LogoGridBlock,
    FaqBlock,
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
        >
            {/* Animated Blue Parallax Background */}
            <HeroParallaxBlue />

            {/* Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            >
                <motion.h1
                    variants={fadeUp}
                    className="font-heading text-6xl sm:text-8xl lg:text-9xl text-white font-bold leading-[1.0] tracking-tighter"
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
                    className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
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

                {block.quickLinks && block.quickLinks.length > 0 && (
                    <motion.div
                        variants={fadeUp}
                        className="mt-16 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-4xl mx-auto"
                    >
                        {block.quickLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-white transition-colors" />
                                {link.text}
                            </Link>
                        ))}
                    </motion.div>
                )}
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
                                        <Button variant="primary">
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
    const [partners, setPartners] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchPartners() {
            try {
                const response = await fetch('/api/partners');
                if (response.ok) {
                    const data = await response.json();
                    setPartners(data);
                }
            } catch (error) {
                console.error('Failed to fetch partners:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPartners();
    }, []);

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    {block.eyebrow && (
                        <p className="text-sm font-semibold text-primary-600 tracking-wider uppercase mb-3">
                            {block.eyebrow}
                        </p>
                    )}
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {block.headline}
                    </h2>
                    {block.description && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {block.description}
                        </p>
                    )}
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-2xl h-80"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Partners Grid */}
                {!loading && partners.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {partners.map((partner, index) => (
                            <PartnerCard
                                key={partner.id}
                                partner={partner}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && partners.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🤝</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            No Partners Yet
                        </h3>
                        <p className="text-lg text-gray-600 max-w-md mx-auto">
                            We're currently building our network of trusted partners. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

function ContactBlockRenderer({ block }: { block: ContactBlock }) {
    return (
        <ContactSection
            eyebrow={block.eyebrow}
            headline={block.headline}
            description={block.description}
        />
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
                            <Button variant="primary">
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

function StorylineBlockRenderer({ block }: { block: StorylineBlock }) {
    return <Storyline block={block} />;
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
        <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
            {/* Premium gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />

            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* Large, bold headline */}
                    <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                        {block.headline}
                    </h2>

                    {block.description && (
                        <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                            {block.description}
                        </p>
                    )}

                    {/* High-contrast buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        {block.primaryButton && (
                            <Link href={block.primaryButton.href}>
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="!bg-white !text-primary-900 hover:!bg-primary-50 !border-0 text-lg px-8 py-6 h-auto font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                                >
                                    {block.primaryButton.text}
                                    <Icons.arrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                        {block.secondaryButton && (
                            <Link href={block.secondaryButton.href}>
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="border-2 border-white text-white hover:bg-white hover:text-primary-900 text-lg px-8 py-6 h-auto font-semibold transition-all"
                                >
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

function AreasBlockRenderer({ block }: { block: AreasBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
                >
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-3">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-display-sm lg:text-display text-ink text-balance">
                        {block.headline}
                    </h2>
                    {block.description && (
                        <p className="mt-4 text-body-lg text-muted">
                            {block.description}
                        </p>
                    )}
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {block.areas.map((area, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                            className="group relative overflow-hidden rounded-card-lg bg-surface border border-border-light hover:shadow-card transition-all duration-300"
                        >
                            {area.image ? (
                                <div className="aspect-[4/3] relative">
                                    <img
                                        src={area.image}
                                        alt={area.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="font-heading text-lg text-white">{area.name}</h3>
                                        {area.description && (
                                            <p className="text-body-sm text-white/80 mt-1">{area.description}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5">
                                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
                                        <Icons.market className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <h3 className="font-heading text-lg text-ink">{area.name}</h3>
                                    {area.description && (
                                        <p className="text-body-sm text-muted mt-2">{area.description}</p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
function PartnersEmptyBlockRenderer({ block }: { block: PartnersEmptyBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-20 lg:py-28 bg-gradient-to-b from-white via-surface to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden"
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
                                    {/* Eyebrow with accent line */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
                                        <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">
                                            {block.eyebrow || 'PARTNERSHIPS'}
                                        </span>
                                    </div>

                                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
                                        {block.headline}
                                    </h2>

                                    <p className="mt-4 text-lg text-muted leading-relaxed">
                                        {block.description}
                                    </p>

                                    {/* Benefits list */}
                                    <ul className="mt-6 space-y-3">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0" />
                                            <span className="text-muted">Access to international client network</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0" />
                                            <span className="text-muted">Premium partnership benefits</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0" />
                                            <span className="text-muted">Marketing and promotional support</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Right: CTA Card */}
                                <div className="lg:pl-8">
                                    <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 rounded-2xl p-8 text-center relative overflow-hidden">
                                        {/* Decorative glow */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                                        <div className="relative">
                                            {/* Icon */}
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
                                                <Icons.regulatory className="w-8 h-8 text-white" />
                                            </div>

                                            <p className="text-white/90 text-lg mb-6">
                                                Ready to join our network?
                                            </p>

                                            {/* Primary CTA - High contrast white button */}
                                            {block.ctaText && block.ctaHref && (
                                                <Link
                                                    href={block.ctaHref}
                                                    className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold rounded-xl bg-white text-primary-900 hover:bg-primary-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                                                >
                                                    {block.ctaText}
                                                    <Icons.arrowRight className="ml-2 w-5 h-5" />
                                                </Link>
                                            )}

                                            {/* Secondary link */}
                                            <a
                                                href="/contact"
                                                className="inline-flex items-center justify-center w-full mt-4 px-8 py-3 text-white/80 hover:text-white transition-colors underline-offset-4 hover:underline"
                                            >
                                                Contact us directly
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function GalleryBlockRenderer({ block }: { block: GalleryBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    if (!block.images || block.images.length === 0) return null;

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {block.headline && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {block.images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {image.caption && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-white font-medium">{image.caption}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PackagesBlockRenderer({ block }: { block: PackagesBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} id="packages" className="py-16 lg:py-24 bg-surface scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {block.eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-3">
                            {block.eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.packages.map((pkg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl border border-border-light overflow-hidden hover:shadow-card hover:border-primary-200 transition-all duration-300 group"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-heading text-xl font-bold text-ink group-hover:text-primary-600 transition-colors">
                                        {pkg.title}
                                    </h3>
                                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
                                        {pkg.duration}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <span className="text-sm text-muted">from</span>
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-bold text-ink">{pkg.price}</span>
                                        <span className="text-muted ml-1">/ person</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {pkg.includes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Icons.check className="w-2.5 h-2.5 text-green-600" />
                                            </div>
                                            <span className="text-sm text-muted">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/contact?type=tour" className="block">
                                    <Button variant="secondary" className="w-full group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        Request Details
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function VehicleFleetBlockRenderer({ block }: { block: VehicleFleetBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {block.vehicles.map((vehicle, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-surface rounded-xl overflow-hidden border border-border-light"
                        >
                            <div className="aspect-[3/2] bg-gray-100 relative">
                                {vehicle.image ? (
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted">
                                        <Icons.services className="w-10 h-10 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-heading text-lg font-bold text-ink">{vehicle.name}</h3>
                                <div className="mt-3 space-y-1 text-sm text-muted">
                                    <div className="flex justify-between">
                                        <span>Capacity:</span>
                                        <span className="font-medium text-ink">{vehicle.capacity}</span>
                                    </div>
                                    {vehicle.dimensions && (
                                        <div className="flex justify-between">
                                            <span>Size:</span>
                                            <span className="font-medium text-ink">{vehicle.dimensions}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FormSelectorBlockRenderer({ block }: { block: FormSelectorBlock }) {
    // This component renders buttons but functionality is handled by page via URL params
    // or it could be interactive. For now, we'll assume it's just a visual helper if needed.
    // Actually, the main use is Contact Page which has special logic.
    // Maybe this block just renders a "Select your inquiry type" UI that links to param?

    return (
        <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold mb-8">{block.headline}</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {['patient', 'tour', 'business'].map((type) => (
                        <Link key={type} href={`?type=${type}`} scroll={false}>
                            <Button variant="secondary" className="min-w-[140px] capitalize">
                                {type === 'patient' ? 'Patient Inquiry' : type === 'tour' ? 'Tour Inquiry' : 'Business Inquiry'}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// Main BlockRenderer Component
// ============================================


function TestimonialsBlockRenderer({ block }: { block: TestimonialsBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-gray-50">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.testimonials.map((testimonial: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
                        >
                            <div className="mb-6 flex-grow">
                                <Icons.quote className="w-8 h-8 text-primary-200 mb-4" />
                                <p className="text-gray-600 text-lg leading-relaxed italic">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                                {testimonial.image ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img src={testimonial.image} alt={testimonial.author} className="object-cover w-full h-full" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}{testimonial.company && `, ${testimonial.company}`}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function InsightsListBlockRenderer({ block }: { block: InsightsListBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        {block.eyebrow && (
                            <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                                {block.eyebrow}
                            </span>
                        )}
                        <h2 className="font-heading text-3xl sm:text-4xl text-ink">{block.headline}</h2>
                    </motion.div>
                    {block.viewAllHref && (
                        <Link href={block.viewAllHref} className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors">
                            View All Insights <Icons.arrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {block.items.map((item: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <Link href={item.href || '#'}>
                                <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden mb-6">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                            <Icons.image className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {item.date && (
                                        <span className="text-sm text-primary-600 font-medium">{item.date}</span>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 line-clamp-2">{item.excerpt}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {block.viewAllHref && (
                    <div className="mt-8 md:hidden text-center">
                        <Link href={block.viewAllHref}>
                            <Button variant="ghost">View All Insights</Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

function LogoGridBlockRenderer({ block }: { block: LogoGridBlock }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-16 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(block.headline || block.eyebrow) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10"
                    >
                        {block.eyebrow && (
                            <span className="block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">{block.eyebrow}</span>
                        )}
                        {block.headline && (
                            <h2 className="text-2xl font-bold text-gray-900">{block.headline}</h2>
                        )}
                    </motion.div>
                )}

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {block.logos.map((logo: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-12 w-auto relative"
                        >
                            {/* Placeholder for actual logo rendering - using text if simple, or img tag */}
                            {logo.logo.startsWith('http') || logo.logo.startsWith('/') ? (
                                <img src={logo.logo} alt={logo.name} className="h-full w-auto object-contain" />
                            ) : (
                                <span className="text-xl font-bold text-gray-400">{logo.name}</span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

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
                    case 'storyline':
                        return <StorylineBlockRenderer key={key} block={block} />;
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
                    case 'whyUs':
                        return <WhyUsSection key={key} block={block} />;
                    case 'howItWorks':
                        return <HowItWorksSection key={key} block={block} />;
                    case 'faq':
                        return (
                            <FaqSection
                                key={key}
                                faqs={(block as FaqBlock).items?.map((item: any, idx: number) => ({
                                    id: `faq-${idx}`,
                                    question: item.question,
                                    answer: item.answer,
                                })) || []}
                                title={(block as FaqBlock).headline}
                                subtitle={(block as FaqBlock).description}
                            />
                        );
                    case 'interactiveServices':
                        return <InteractiveServices key={key} block={block} />;
                    case 'areas':
                        return <AreasBlockRenderer key={key} block={block} />;
                    case 'partnersEmpty':
                        return <PartnersEmptyBlockRenderer key={key} block={block} />;
                    case 'gallery':
                        return <GalleryBlockRenderer key={key} block={block} />;
                    case 'packages':
                        return <PackagesBlockRenderer key={key} block={block} />;
                    case 'vehicleFleet':
                        return <VehicleFleetBlockRenderer key={key} block={block} />;
                    case 'formSelector':
                        return <FormSelectorBlockRenderer key={key} block={block} />;
                    case 'testimonials':
                        return <TestimonialsBlockRenderer key={key} block={block} />;
                    case 'insightsList':
                        return <InsightsListBlockRenderer key={key} block={block} />;
                    case 'logoGrid':
                        return <LogoGridBlockRenderer key={key} block={block} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}
