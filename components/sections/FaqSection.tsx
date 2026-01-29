'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

interface FaqSectionProps {
    faqs: FaqItem[];
    title?: string;
    subtitle?: string;
}

export function FaqSection({ faqs, title, subtitle }: FaqSectionProps) {
    const [openId, setOpenId] = useState<string | null>(null);

    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-surface">
            <div className="container mx-auto px-4 max-w-4xl">
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-4">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-lg text-muted max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <FaqItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openId === faq.id}
                            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface FaqItemProps {
    faq: FaqItem;
    isOpen: boolean;
    onToggle: () => void;
}

function FaqItem({ faq, isOpen, onToggle }: FaqItemProps) {
    return (
        <div className="bg-white rounded-lg shadow-soft border border-border-light overflow-hidden transition-shadow hover:shadow-md">
            <button
                onClick={onToggle}
                className="w-full flex items-start justify-between p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-heading font-semibold text-ink pr-4 flex-1">
                    {faq.question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 mt-1"
                >
                    <ChevronDown className="w-5 h-5 text-primary-600" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-0">
                            <div className="text-base text-muted leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
