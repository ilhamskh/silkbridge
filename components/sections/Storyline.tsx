'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { StorylineBlock } from '@/lib/blocks/schema';
import { cn } from '@/lib/utils';

export function Storyline({ block }: { block: StorylineBlock }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {block.eyebrow && (
                <div className="absolute top-12 left-0 w-full text-center pointer-events-none opacity-20">
                    <span className="text-[10rem] font-bold text-primary-50 tracking-tighter uppercase whitespace-nowrap">
                        {block.eyebrow}
                    </span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
                    {block.eyebrow && (
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="block text-primary-600 font-medium tracking-widest text-sm uppercase mb-4"
                        >
                            {block.eyebrow}
                        </motion.span>
                    )}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-4xl lg:text-6xl text-ink leading-tight mb-6"
                    >
                        {block.title}
                    </motion.h2>
                    {block.text && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-muted leading-relaxed"
                        >
                            {block.text}
                        </motion.p>
                    )}
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* The Glowing Line */}
                    <div className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-px bg-primary-100/50 -translate-x-1/2">
                        <motion.div
                            style={{ scaleY, originY: 0 }}
                            className="absolute top-0 w-full bg-gradient-to-b from-primary-400 via-primary-600 to-primary-400 w-[2px] -ml-[0.5px] shadow-[0_0_12px_rgba(47,104,187,0.6)]"
                        />
                    </div>

                    <div className="space-y-16 lg:space-y-32">
                        {block.beats.map((beat, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <BeatCard
                                    key={beat.id}
                                    beat={beat}
                                    index={index}
                                    isEven={isEven}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function BeatCard({ beat, index, isEven }: { beat: any, index: number, isEven: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={cn(
                "relative flex items-center gap-8 lg:gap-16",
                "flex-col lg:flex-row",
                !isEven && "lg:flex-row-reverse"
            )}
        >
            {/* Center Dot */}
            <div className="absolute left-[20px] lg:left-1/2 w-4 h-4 -translate-x-1/2 flex items-center justify-center z-20">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-primary-500 shadow-[0_0_0_4px_rgba(255,255,255,1)]" />
                <div className="absolute inset-0 bg-primary-500/30 rounded-full animate-ping" />
            </div>

            {/* Content Card */}
            <div className={cn(
                "w-full lg:w-[calc(50%-32px)] ml-12 lg:ml-0",
                isEven ? "lg:text-right" : "lg:text-left"
            )}>
                <div className="relative group perspective">
                    <div className={cn(
                        "p-8 lg:p-10 rounded-2xl border border-primary-100 bg-white/50 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200",
                        "bg-gradient-to-br from-white to-primary-50/30"
                    )}>
                        {/* Decorative number/year */}
                        {(beat.year || beat.kicker) && (
                            <span className={cn(
                                "absolute -top-6 text-6xl lg:text-8xl font-bold text-primary-100/50 pointer-events-none font-heading",
                                isEven ? "right-4" : "left-4"
                            )}>
                                {beat.year || beat.kicker}
                            </span>
                        )}

                        <div className="relative z-10">
                            {beat.kicker && (
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary-700 uppercase bg-primary-100 rounded-full">
                                    {beat.kicker}
                                </span>
                            )}
                            <h3 className="text-2xl lg:text-3xl font-heading text-ink mb-4 leading-tight">
                                {beat.title}
                            </h3>
                            <p className="text-muted leading-relaxed text-lg">
                                {beat.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty space for the other side (Desktop only) */}
            <div className="hidden lg:block w-[calc(50%-32px)]" />
        </motion.div>
    )
}
