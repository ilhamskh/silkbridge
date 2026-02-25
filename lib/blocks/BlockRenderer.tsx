'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import * as React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/routing';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/button';
import { fadeUp, stagger, iconMap } from './renderers/shared';

// Dynamic imports for heavy section components — only loaded when their block type is used
const HeroParallaxBlue = dynamic(() =>
    import('@/components/sections/HeroParallaxBlue').then(m => ({ default: m.HeroParallaxBlue }))
);
const InteractiveServices = dynamic(() =>
    import('@/components/sections/InteractiveServices').then(m => ({ default: m.InteractiveServices }))
);
const WhyUsSection = dynamic(() =>
    import('@/components/sections/WhyUsSection').then(m => ({ default: m.WhyUsSection }))
);
const HowItWorksSection = dynamic(() =>
    import('@/components/sections/HowItWorksSection').then(m => ({ default: m.HowItWorksSection }))
);
const FaqSection = dynamic(() =>
    import('@/components/sections/FaqSection').then(m => ({ default: m.FaqSection }))
);
const ContactSection = dynamic(() =>
    import('@/components/sections/ContactSection').then(m => ({ default: m.default }))
);

// Lazy-loaded renderers for non-home pages (about, services, partners, tourism)
const LazyPartnersBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.PartnersBlockRenderer }))
);
const LazyIntroBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.IntroBlockRenderer }))
);
const LazyStoryBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.StoryBlockRenderer }))
);
const LazyStorylineBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.StorylineBlockRenderer }))
);
const LazyMilestonesBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.MilestonesBlockRenderer }))
);
const LazyValuesBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.ValuesBlockRenderer }))
);
const LazyTeamBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.TeamBlockRenderer }))
);
const LazyCtaBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.CtaBlockRenderer }))
);
const LazyServiceDetailsBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.ServiceDetailsBlockRenderer }))
);
const LazyProcessBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.ProcessBlockRenderer }))
);
const LazyStatsRowBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.StatsRowBlockRenderer }))
);
const LazyAreasBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.AreasBlockRenderer }))
);
const LazyPartnersEmptyBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.PartnersEmptyBlockRenderer }))
);
const LazyGalleryBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.GalleryBlockRenderer }))
);
const LazyPackagesBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.PackagesBlockRenderer }))
);
const LazyVehicleFleetBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.VehicleFleetBlockRenderer }))
);
const LazyFormSelectorBlockRenderer = dynamic(() =>
    import('./renderers/extended-blocks').then(m => ({ default: m.FormSelectorBlockRenderer }))
);

import type {
    ContentBlock,
    HeroBlock,
    AboutBlock,
    ServicesBlock,
    ContactBlock,
    InsightsBlock,
    TestimonialsBlock,
    InsightsListBlock,
    LogoGridBlock,
    FaqBlock,
} from '@/lib/blocks/schema';

// ============================================
// Home Page Block Components (inlined for critical path)
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
                    className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-[1.1] tracking-tight"
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
                    <div className="mt-16 flex flex-wrap justify-center gap-6">
                        {block.pillars.map((pillar, index) => {
                            const Icon = pillar.icon ? iconMap[pillar.icon] || Icons.regulatory : Icons.regulatory;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="p-8 bg-white rounded-2xl border border-border-light shadow-card hover:shadow-card-hover transition-shadow w-full md:w-80"
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
                    <div className="flex flex-wrap justify-center gap-6">
                        {block.stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="text-center p-6 bg-surface rounded-xl flex-none w-36 lg:w-48"
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

// ============================================
// Home-Page Only Block Components
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

                <div className="flex flex-wrap justify-center gap-8">
                    {block.testimonials.map((testimonial: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col w-full md:w-80 lg:w-96 flex-none"
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
                                        <Image src={testimonial.image} alt={testimonial.author} fill sizes="48px" className="object-cover" />
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

    // If no items, don't render
    if (!block.items || block.items.length === 0) {
        return null;
    }

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

                <div className="flex flex-wrap justify-center gap-8">
                    {block.items.map((item: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group cursor-pointer w-full md:w-80 lg:w-96 flex-none"
                        >
                            <Link href={item.href || '#'}>
                                <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden mb-6 relative">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
        <section ref={ref} className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(block.headline || block.eyebrow) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        {block.eyebrow && (
                            <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">{block.eyebrow}</span>
                        )}
                        {block.headline && (
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink">{block.headline}</h2>
                        )}
                    </motion.div>
                )}

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {block.logos.map((logo: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-none"
                        >
                            {logo.href ? (
                                <a href={logo.href} className="group block">
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        {logo.logo.startsWith('http') || logo.logo.startsWith('/') ? (
                                            <Image
                                                src={logo.logo}
                                                alt={logo.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 128px, 160px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-400">{logo.name.slice(0, 2)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-3 text-center text-sm font-medium text-muted group-hover:text-primary-600 transition-colors">{logo.name}</p>
                                </a>
                            ) : (
                                <div>
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md">
                                        {logo.logo.startsWith('http') || logo.logo.startsWith('/') ? (
                                            <Image
                                                src={logo.logo}
                                                alt={logo.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 128px, 160px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-400">{logo.name.slice(0, 2)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-3 text-center text-sm font-medium text-muted">{logo.name}</p>
                                </div>
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
                    // Home page blocks (inlined for critical path performance)
                    case 'hero':
                        return <HeroBlockRenderer key={key} block={block} />;
                    case 'about':
                        return <AboutBlockRenderer key={key} block={block} />;
                    case 'services':
                        return <ServicesBlockRenderer key={key} block={block} />;
                    case 'contact':
                        return <ContactBlockRenderer key={key} block={block} />;
                    case 'insights':
                        return <InsightsBlockRenderer key={key} block={block} />;
                    case 'testimonials':
                        return <TestimonialsBlockRenderer key={key} block={block} />;
                    case 'insightsList':
                        return <InsightsListBlockRenderer key={key} block={block} />;
                    case 'logoGrid':
                        return <LogoGridBlockRenderer key={key} block={block} />;

                    // Already-dynamic external section components
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

                    // Lazy-loaded extended blocks (separate chunk, loaded on demand)
                    case 'partners':
                        return <LazyPartnersBlockRenderer key={key} block={block} />;
                    case 'intro':
                        return <LazyIntroBlockRenderer key={key} block={block} />;
                    case 'story':
                        return <LazyStoryBlockRenderer key={key} block={block} />;
                    case 'storyline':
                        return <LazyStorylineBlockRenderer key={key} block={block} />;
                    case 'milestones':
                        return <LazyMilestonesBlockRenderer key={key} block={block} />;
                    case 'values':
                        return <LazyValuesBlockRenderer key={key} block={block} />;
                    case 'team':
                        return <LazyTeamBlockRenderer key={key} block={block} />;
                    case 'cta':
                        return <LazyCtaBlockRenderer key={key} block={block} />;
                    case 'serviceDetails':
                        return <LazyServiceDetailsBlockRenderer key={key} block={block} />;
                    case 'process':
                        return <LazyProcessBlockRenderer key={key} block={block} />;
                    case 'statsRow':
                        return <LazyStatsRowBlockRenderer key={key} block={block} />;
                    case 'areas':
                        return <LazyAreasBlockRenderer key={key} block={block} />;
                    case 'partnersEmpty':
                        return <LazyPartnersEmptyBlockRenderer key={key} block={block} />;
                    case 'gallery':
                        return <LazyGalleryBlockRenderer key={key} block={block} />;
                    case 'packages':
                        return <LazyPackagesBlockRenderer key={key} block={block} />;
                    case 'vehicleFleet':
                        return <LazyVehicleFleetBlockRenderer key={key} block={block} />;
                    case 'formSelector':
                        return <LazyFormSelectorBlockRenderer key={key} block={block} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}

// Export for use in server components
export { InsightsListBlockRenderer };
