'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FaqBlock } from '@/lib/blocks/schema';

interface FaqSectionProps {
    block: FaqBlock;
}

export function FaqSection({ block }: FaqSectionProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-16 lg:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 lg:mb-16"
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
                        <p className="mt-4 text-body-lg text-muted max-w-2xl mx-auto">
                            {block.description}
                        </p>
                    )}
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-3">
                    {block.items.map((item, index) => {
                        const isExpanded = expandedIndex === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                                className={`
                                    rounded-card-lg border overflow-hidden transition-all duration-200
                                    ${isExpanded
                                        ? 'bg-white border-primary-200 shadow-card'
                                        : 'bg-surface border-border-light hover:border-primary-100'
                                    }
                                `}
                            >
                                <button
                                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                    className="w-full px-6 py-5 flex items-start gap-4 text-left"
                                    aria-expanded={isExpanded}
                                >
                                    {/* Question icon */}
                                    <div className={`
                                        mt-0.5 w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors duration-200
                                        ${isExpanded
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-primary-50 text-primary-600'
                                        }
                                    `}>
                                        <HelpCircle className="w-4 h-4" />
                                    </div>

                                    {/* Question text */}
                                    <div className="flex-1">
                                        <h3 className={`
                                            font-medium text-body transition-colors duration-200
                                            ${isExpanded ? 'text-ink' : 'text-ink'}
                                        `}>
                                            {item.question}
                                        </h3>
                                    </div>

                                    {/* Expand icon */}
                                    <ChevronDown className={`
                                        w-5 h-5 text-muted flex-shrink-0 mt-0.5 transition-transform duration-200
                                        ${isExpanded ? 'rotate-180' : ''}
                                    `} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                        >
                                            <div className="px-6 pb-5 pl-[4.5rem]">
                                                <p className="text-body text-muted max-w-prose">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
