'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, ClipboardList, Plane } from 'lucide-react';
import type { HowItWorksBlock } from '@/lib/blocks/schema';

// Icon mapping for steps
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    request: MessageSquare,
    plan: ClipboardList,
    travel: Plane,
};

interface HowItWorksSectionProps {
    block: HowItWorksBlock;
}

export function HowItWorksSection({ block }: HowItWorksSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-gradient-to-b from-surface to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
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

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-20 left-1/2 w-2/3 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {block.steps.map((step, index) => {
                            const Icon = step.icon ? iconMap[step.icon] || MessageSquare : MessageSquare;
                            const stepNumber = (index + 1).toString().padStart(2, '0');

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                                    className="relative text-center"
                                >
                                    {/* Step number + icon container */}
                                    <div className="relative inline-flex flex-col items-center mb-6">
                                        {/* Background circle */}
                                        <div className="w-16 h-16 rounded-full bg-white border-2 border-border-light shadow-card flex items-center justify-center relative z-10">
                                            <Icon className="w-7 h-7 text-primary-600" />
                                        </div>

                                        {/* Step number badge */}
                                        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shadow-button">
                                            {stepNumber}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-heading text-h3 text-ink mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-body text-muted max-w-xs mx-auto">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
