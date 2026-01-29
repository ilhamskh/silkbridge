'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Clock, Users, Sparkles, Award } from 'lucide-react';
import type { WhyUsBlock } from '@/lib/blocks/schema';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    quality: Shield,
    experience: Clock,
    personal: Users,
    unique: Sparkles,
    award: Award,
};

interface WhyUsSectionProps {
    block: WhyUsBlock;
}

export function WhyUsSection({ block }: WhyUsSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mb-12 lg:mb-16"
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
                        <p className="mt-4 text-body-lg text-muted max-w-prose">
                            {block.description}
                        </p>
                    )}
                </motion.div>

                {/* Value Props Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {block.items.map((item, index) => {
                        const Icon = item.icon ? iconMap[item.icon] || Shield : Shield;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                                className="group"
                            >
                                <div className="h-full p-6 lg:p-8 rounded-card-lg bg-surface border border-border-light hover:bg-white hover:shadow-card hover:border-primary-100 transition-all duration-300">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-button mb-5 group-hover:scale-105 transition-transform duration-300">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-heading text-h3 text-ink mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-body text-muted max-w-prose">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
