'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import Image from 'next/image';
import { shouldReduceAnimations, isTouchDevice } from '@/lib/device-detection';

export default function HeroParallaxFramed() {
    const t = useTranslations('heroFramed');
    const tNav = useTranslations('nav');
    const frameRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const parallaxElementRef = useRef<HTMLDivElement>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(true);
    const [isMobile, setIsMobile] = useState(true);

    // Mouse position for pointer parallax (desktop only)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        setIsMounted(true);
        setReduceMotion(shouldReduceAnimations());
        setIsMobile(isTouchDevice());
    }, []);

    // Scroll parallax - reduced range on mobile
    const { scrollYProgress } = useScroll({
        target: contentRef,
        offset: ['start start', 'end start'],
    });

    // Mobile: 0-12px, Desktop: 0-40px
    const scrollParallaxRange = isMobile ? [0, 12] : [0, 40];
    const imageScrollY = useTransform(
        scrollYProgress,
        [0, 1],
        reduceMotion ? [0, 0] : scrollParallaxRange
    );

    const glowY = useTransform(
        scrollYProgress,
        [0, 1],
        reduceMotion ? [0, 0] : isMobile ? [0, 6] : [0, 20]
    );

    // Pointer parallax (desktop only, disabled on mobile)
    useEffect(() => {
        if (reduceMotion || isMobile) return;

        let rafId: number;
        let lastX = 0;
        let lastY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (!frameRef.current) return;

            const rect = frameRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalize to -1 to 1
            const x = (e.clientX - centerX) / (rect.width / 2);
            const y = (e.clientY - centerY) / (rect.height / 2);

            // Quantize - only update if delta > threshold (performance optimization)
            const deltaX = Math.abs(x - lastX);
            const deltaY = Math.abs(y - lastY);

            if (deltaX > 0.05 || deltaY > 0.05) {
                if (rafId) cancelAnimationFrame(rafId);

                rafId = requestAnimationFrame(() => {
                    mouseX.set(x);
                    mouseY.set(y);
                    lastX = x;
                    lastY = y;
                });
            }
        };

        const frame = frameRef.current;
        if (frame) {
            frame.addEventListener('mousemove', handleMouseMove, { passive: true });
            return () => {
                frame.removeEventListener('mousemove', handleMouseMove);
                if (rafId) cancelAnimationFrame(rafId);
            };
        }
    }, [reduceMotion, isMobile, mouseX, mouseY]);

    // Apply parallax directly to element style (avoids re-renders)
    useEffect(() => {
        if (reduceMotion || isMobile || !parallaxElementRef.current) return;

        const unsubscribeX = mouseX.on('change', (latest) => {
            if (!parallaxElementRef.current) return;
            const translateX = latest * -8; // Max 8px translation
            const rotateY = latest * -1.5; // Max 1.5deg rotation
            parallaxElementRef.current.style.transform = `translateX(${translateX}px) rotateY(${rotateY}deg)`;
        });

        const unsubscribeY = mouseY.on('change', (latest) => {
            if (!parallaxElementRef.current) return;
            const translateY = latest * -8;
            const currentTransform = parallaxElementRef.current.style.transform;
            const translateXMatch = currentTransform.match(/translateX\([^)]+\)/);
            const rotateYMatch = currentTransform.match(/rotateY\([^)]+\)/);
            parallaxElementRef.current.style.transform = `${translateXMatch?.[0] || 'translateX(0px)'} translateY(${translateY}px) ${rotateYMatch?.[0] || 'rotateY(0deg)'}`;
        });

        return () => {
            unsubscribeX();
            unsubscribeY();
        };
    }, [reduceMotion, isMobile, mouseX, mouseY]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
                delayChildren: reduceMotion ? 0 : 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: reduceMotion ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    };

    if (!isMounted) {
        return <div className="h-screen" />;
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f5f7fa] overflow-hidden">
            {/* Large Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary-100/20 blur-3xl" />
                <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary-50/30 blur-3xl" />
            </div>

            <div ref={contentRef} className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
                    {/* Browser Frame Container */}
                    <motion.div
                        ref={frameRef}
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative bg-white rounded-[28px] lg:rounded-[32px] shadow-2xl border border-gray-200/60 overflow-hidden"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 30px -15px rgba(47, 104, 187, 0.1)',
                        }}
                    >
                        {/* Browser Chrome Bar */}
                        <div className="relative h-10 lg:h-12 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200/60 flex items-center px-4 lg:px-6">
                            {/* Dots */}
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                            </div>

                            {/* URL Bar */}
                            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2 px-4 h-7 bg-gray-100/60 rounded-lg border border-gray-200/40 min-w-[280px]">
                                <Icons.globe className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500">silkbridge.com</span>
                            </div>

                            {/* Icons */}
                            <div className="ml-auto flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-gray-100/60 flex items-center justify-center">
                                    <div className="w-3 h-0.5 bg-gray-400 rounded" />
                                </div>
                                <div className="hidden sm:flex w-6 h-6 rounded bg-gray-100/60 items-center justify-center">
                                    <Icons.grid className="w-3 h-3 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Internal Navigation */}
                        <div className="relative h-16 lg:h-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 lg:px-12 flex items-center">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center transition-transform group-hover:scale-105">
                                    <span className="text-white text-sm font-bold">S</span>
                                </div>
                                <span className="hidden sm:inline-block font-heading text-lg font-semibold text-ink">Silkbridge</span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden lg:flex items-center gap-1 mx-auto">
                                {['home', 'services', 'about', 'marketInsights', 'partners'].map((item) => (
                                    <Link
                                        key={item}
                                        href={item === 'home' ? '/' : `/${item === 'marketInsights' ? 'market-insights' : item}`}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
                                    >
                                        {tNav(item)}
                                    </Link>
                                ))}
                            </nav>

                            {/* Desktop CTA */}
                            <div className="hidden lg:block ml-auto">
                                <Link href="/contact">
                                    <Button size="md" className="rounded-full">
                                        {t('navCta')}
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden ml-auto p-2 text-ink hover:text-primary-600 transition-colors"
                                aria-label="Toggle menu"
                            >
                                <Icons.menu className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Hero Content */}
                        <div className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
                            {/* Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50/20" />

                            {/* Noise Texture Overlay */}
                            <div
                                className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                }}
                            />

                            <div className="relative h-full grid lg:grid-cols-2 gap-8 lg:gap-0">
                                {/* Left Content */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="relative z-20 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-20"
                                >
                                    <motion.div variants={itemVariants}>
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50/50 text-primary-700 text-xs font-medium tracking-wide uppercase">
                                            {t('labelPill')}
                                        </span>
                                    </motion.div>

                                    <motion.h1
                                        variants={itemVariants}
                                        className="mt-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight"
                                    >
                                        {t('headline').split('\n').map((line, i) => (
                                            <span key={i}>
                                                {line}
                                                {i < t('headline').split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </motion.h1>

                                    <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
                                        {t('subline')}
                                    </motion.p>

                                    <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
                                        <Link href="/contact">
                                            <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
                                                {t('primaryCta')}
                                                <Icons.arrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>

                                        <Link href="/services">
                                            <Button variant="secondary" size="lg" className="rounded-full">
                                                {t('secondaryCta')}
                                            </Button>
                                        </Link>
                                    </motion.div>

                                    {/* Secondary Row */}
                                    <motion.div variants={itemVariants} className="mt-8 flex items-center gap-3">
                                        <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600">
                                            {t('secondaryRowText')}
                                        </div>
                                        <button className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 flex items-center justify-center transition-colors group">
                                            <Icons.plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </motion.div>

                                    {/* Bottom Left Scroll Indicator */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="hidden lg:flex absolute bottom-8 left-16 items-center gap-2 text-sm text-gray-500"
                                    >
                                        <span>{t('scrollDownLabel')}</span>
                                        <Icons.chevronDown className="w-4 h-4 animate-bounce" />
                                    </motion.div>
                                </motion.div>

                                {/* Right Visual */}
                                <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 flex items-center justify-center">
                                    {/* Glow Effect - reduced on mobile */}
                                    <motion.div
                                        style={{ y: glowY }}
                                        className={`absolute inset-0 bg-gradient-radial from-primary-400/20 via-primary-300/10 to-transparent ${isMobile ? 'blur-2xl' : 'blur-3xl'
                                            }`}
                                    />

                                    {/* 3D Object with Parallax */}
                                    <motion.div
                                        ref={parallaxElementRef}
                                        style={{
                                            y: imageScrollY,
                                            transformStyle: 'preserve-3d',
                                            willChange: reduceMotion || isMobile ? 'auto' : 'transform',
                                        }}
                                        className="relative w-full h-full flex items-center justify-center px-8 lg:px-0"
                                    >
                                        <div className="relative w-full max-w-[500px] lg:max-w-none lg:w-[140%] aspect-square">
                                            {/* Placeholder - Replace with actual 3D ribbon image */}
                                            <div className="absolute inset-0 rounded-3xl overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 opacity-90" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="relative w-3/4 h-3/4">
                                                        {/* Abstract ribbon shapes - reduced animation on mobile */}
                                                        {!reduceMotion && (
                                                            <>
                                                                <motion.div
                                                                    animate={{
                                                                        rotate: [0, 360],
                                                                    }}
                                                                    transition={{
                                                                        duration: isMobile ? 30 : 20,
                                                                        repeat: Infinity,
                                                                        ease: 'linear',
                                                                    }}
                                                                    className="absolute inset-0 rounded-full border-8 border-white/20"
                                                                />
                                                                <motion.div
                                                                    animate={{
                                                                        rotate: [360, 0],
                                                                    }}
                                                                    transition={{
                                                                        duration: isMobile ? 35 : 25,
                                                                        repeat: Infinity,
                                                                        ease: 'linear',
                                                                    }}
                                                                    className="absolute inset-8 rounded-full border-8 border-white/10"
                                                                />
                                                            </>
                                                        )}
                                                        {reduceMotion && (
                                                            <>
                                                                <div className="absolute inset-0 rounded-full border-8 border-white/20" />
                                                                <div className="absolute inset-8 rounded-full border-8 border-white/10" />
                                                            </>
                                                        )}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Icons.globe className="w-32 h-32 text-white/40" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Edge Fade Mask - solid on mobile for performance */}
                                            <div className={`absolute inset-0 pointer-events-none ${isMobile
                                                    ? 'bg-gradient-to-l from-transparent via-transparent to-white/70'
                                                    : 'bg-gradient-to-l from-transparent via-transparent to-white/60 lg:to-white/80'
                                                }`} />
                                        </div>
                                    </motion.div>

                                    {/* Floating Play Video Button - hidden on mobile */}
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: reduceMotion ? 0 : 0.8, duration: reduceMotion ? 0.3 : 0.5 }}
                                        whileHover={reduceMotion ? {} : { scale: 1.05, y: -2 }}
                                        className="hidden lg:flex absolute bottom-8 right-8 items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all text-sm font-medium text-ink"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                                            <Icons.play className="w-4 h-4 text-white ml-0.5" />
                                        </div>
                                        {t('playVideoLabel')}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-white lg:hidden"
                >
                    <div className="flex flex-col h-full p-6">
                        <div className="flex items-center justify-between mb-8">
                            <span className="font-heading text-xl font-semibold text-ink">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2" aria-label="Close menu">
                                <Icons.close className="w-6 h-6 text-ink" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2 flex-1">
                            {['home', 'services', 'about', 'marketInsights', 'partners', 'contact'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'home' ? '/' : `/${item === 'marketInsights' ? 'market-insights' : item}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-3 text-lg font-medium text-ink hover:text-primary-600 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    {tNav(item)}
                                </Link>
                            ))}
                        </nav>

                        <div className="pt-6 border-t border-gray-100">
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                                <Button size="lg" className="w-full rounded-full">
                                    {t('navCta')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
