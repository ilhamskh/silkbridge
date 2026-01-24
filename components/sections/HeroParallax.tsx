'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

export default function HeroParallax() {
    const t = useTranslations('hero');
    const ref = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();
    const [isMounted, setIsMounted] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Mouse parallax effect
    useEffect(() => {
        if (shouldReduceMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [shouldReduceMotion]);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const backgroundY = useTransform(
        scrollYProgress,
        [0, 1],
        shouldReduceMotion ? ['0%', '0%'] : ['0%', '40%']
    );

    const contentY = useTransform(
        scrollYProgress,
        [0, 1],
        shouldReduceMotion ? ['0%', '0%'] : ['0%', '20%']
    );

    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.8, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    // Smooth spring animations
    const mouseX = useSpring(mousePosition.x, { damping: 25, stiffness: 150 });
    const mouseY = useSpring(mousePosition.y, { damping: 25, stiffness: 150 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    // Split tagline by newlines for multi-line display
    const taglineLines = t('tagline').split('\n');

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Layer */}
            <motion.div
                className="absolute inset-0"
                style={{
                    y: isMounted ? backgroundY : 0,
                    x: shouldReduceMotion ? 0 : mouseX,
                }}
            >
                {/* Gradient Overlay - Enhanced */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 z-10" />

                {/* Animated Gradient Orbs */}
                <motion.div
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary-600/30 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{ x: shouldReduceMotion ? 0 : mouseX, y: shouldReduceMotion ? 0 : mouseY }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary-500/20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />

                {/* Noise Texture */}
                <div
                    className="absolute inset-0 z-20 opacity-[0.03] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Grid Pattern - Enhanced */}
                <div
                    className="absolute inset-0 z-10 opacity-[0.06]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Vignette - Improved */}
                <div className="absolute inset-0 z-20 bg-gradient-radial from-transparent via-transparent to-primary-950/60" />
            </motion.div>

            {/* Floating Shapes */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/10 rounded-full"
                        style={{
                            left: `${(i * 20 + 10)}%`,
                            top: `${(i * 15 + 20)}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <motion.div
                className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40"
                style={{
                    y: isMounted ? contentY : 0,
                    opacity: isMounted ? opacity : 1,
                    scale: isMounted ? scale : 1,
                }}
            >
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Tagline */}
                    <motion.h1
                        variants={itemVariants}
                        className="font-heading text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
                    >
                        {taglineLines.map((line, i) => (
                            <span key={i} className="block">
                                {line}
                            </span>
                        ))}
                    </motion.h1>

                    {/* Subtagline */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t('subtagline')}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/contact">
                            <Button size="lg" className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-shadow">
                                {t('ctaPrimary')}
                                <Icons.arrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full sm:w-auto backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20"
                            >
                                {t('ctaSecondary')}
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Icons.check className="w-4 h-4 text-primary-400" />
                            <span>15+ Countries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icons.check className="w-4 h-4 text-primary-400" />
                            <span>60+ Partner Hospitals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icons.check className="w-4 h-4 text-primary-400" />
                            <span>10K+ Patients Served</span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator - Enhanced */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-white/50 text-xs uppercase tracking-wider">Scroll</span>
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
