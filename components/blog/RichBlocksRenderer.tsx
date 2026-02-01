'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ContentBlock } from '@/content/posts';

interface RichBlocksRendererProps {
    blocks: ContentBlock[];
}

export function RichBlocksRenderer({ blocks }: RichBlocksRendererProps) {
    return (
        <div className="prose-silkbridge">
            {blocks.map((block, index) => (
                <Block key={index} block={block} />
            ))}
        </div>
    );
}

function Block({ block }: { block: ContentBlock }) {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    switch (block.type) {
        case 'heading':
            const HeadingTag = block.level === 2 ? 'h2' : 'h3';
            const headingId = block.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            return (
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <HeadingTag
                        id={headingId}
                        className={`
                            font-display font-semibold text-ink scroll-mt-28
                            ${block.level === 2
                                ? 'text-2xl md:text-3xl mt-12 mb-6'
                                : 'text-xl md:text-2xl mt-8 mb-4'
                            }
                        `}
                    >
                        {block.text}
                    </HeadingTag>
                </motion.div>
            );

        case 'paragraph':
            return (
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-base md:text-lg leading-relaxed text-ink/90 mb-6"
                >
                    {block.text}
                </motion.p>
            );

        case 'quote':
            return (
                <motion.blockquote
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative my-10 pl-6 md:pl-8 border-l-4 border-primary-400"
                >
                    <p className="text-lg md:text-xl italic text-ink/90 mb-2">
                        "{block.text}"
                    </p>
                    {block.by && (
                        <cite className="text-sm text-muted not-italic">
                            — {block.by}
                        </cite>
                    )}
                </motion.blockquote>
            );

        case 'bullets':
            return (
                <motion.ul
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="my-6 space-y-3"
                >
                    {block.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-base md:text-lg text-ink/90">
                            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </motion.ul>
            );

        case 'callout':
            return (
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="my-10 p-6 md:p-8 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl border border-primary-200"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-primary-800 mb-2">
                                {block.title}
                            </h4>
                            <p className="text-primary-900/80 leading-relaxed">
                                {block.text}
                            </p>
                        </div>
                    </div>
                </motion.div>
            );

        case 'stats':
            return (
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="my-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                >
                    {block.items.map((stat, i) => (
                        <div
                            key={i}
                            className="p-5 md:p-6 bg-white rounded-xl border border-primary-100 shadow-soft text-center"
                        >
                            <div className="text-2xl md:text-3xl font-display font-bold text-primary-600 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-ink mb-1">
                                {stat.label}
                            </div>
                            {stat.note && (
                                <div className="text-xs text-muted">
                                    {stat.note}
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            );

        case 'image':
            return (
                <motion.figure
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="my-10"
                >
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-primary-100">
                        <Image
                            src={block.src}
                            alt={block.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 720px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 to-transparent" />
                    </div>
                    {block.caption && (
                        <figcaption className="mt-3 text-center text-sm text-muted">
                            {block.caption}
                        </figcaption>
                    )}
                </motion.figure>
            );

        case 'divider':
            return (
                <div className="my-12 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-300" />
                </div>
            );

        default:
            return null;
    }
}
