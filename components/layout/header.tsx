'use client';

import { useState, useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { navigationConfig } from '@/content/site-config';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const locale = useLocale() as Locale;
    const router = useRouter();
    const t = useTranslations('nav');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Check if we're on a page with a dark hero (homepage)
    const isHomePage = pathname === `/${locale}` || pathname === '/';
    const hasDarkHero = isHomePage;

    const switchLocale = (newLocale: Locale) => {
        startTransition(() => {
            // Get the path without the locale prefix
            const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
            router.replace(pathWithoutLocale, { locale: newLocale });
        });
    };

    return (
        <>
            <header
                className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled
                        ? 'py-3 bg-white/80 backdrop-blur-xl shadow-sm border-b border-border-light'
                        : hasDarkHero
                            ? 'py-5 bg-transparent'
                            : 'py-5 bg-white/80 backdrop-blur-xl border-b border-border-light'
                    }
        `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className={`transition-colors ${isScrolled || !hasDarkHero ? 'text-primary-700' : 'text-white'}`}
                        >
                            <Logo className="h-8 w-auto" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navigationConfig.main.map((item) => {
                                const isActive = pathname === `/${locale}${item.href}` ||
                                    (item.href === '/' && (pathname === `/${locale}` || pathname === `/${locale}/`));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      relative px-4 py-2 text-sm font-medium transition-colors
                      ${isScrolled || !hasDarkHero
                                                ? isActive
                                                    ? 'text-primary-600'
                                                    : 'text-muted hover:text-primary-600'
                                                : isActive
                                                    ? 'text-white'
                                                    : 'text-white/80 hover:text-white'
                                            }
                    `}
                                    >
                                        {t(item.labelKey)}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${isScrolled || !hasDarkHero ? 'bg-primary-500' : 'bg-white'
                                                    }`}
                                                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Desktop Right Side: Language Switcher + CTA */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Language Switcher */}
                            <div className="relative group">
                                <button
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isScrolled || !hasDarkHero
                                            ? 'text-muted hover:text-primary-600 hover:bg-primary-50'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'}
                  `}
                                    aria-label={t('toggleMenu')}
                                >
                                    <span className="text-base">{localeFlags[locale]}</span>
                                    <span className="uppercase">{locale}</span>
                                    <Icons.chevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 mt-1 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="py-2 bg-white rounded-xl shadow-card border border-border-light">
                                        {locales.map((loc) => (
                                            <button
                                                key={loc}
                                                onClick={() => switchLocale(loc)}
                                                disabled={isPending}
                                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                          ${loc === locale ? 'bg-primary-50 text-primary-600' : 'text-ink hover:bg-surface'}
                          ${isPending ? 'opacity-50' : ''}
                        `}
                                            >
                                                <span className="text-base">{localeFlags[loc]}</span>
                                                <span>{localeNames[loc]}</span>
                                                {loc === locale && (
                                                    <Icons.check className="w-4 h-4 ml-auto" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link href="/contact">
                                <Button
                                    variant={isScrolled || !hasDarkHero ? 'primary' : 'ghost'}
                                    size="sm"
                                >
                                    {t('getConsultation')}
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden p-2 -mr-2 transition-colors ${isScrolled || !hasDarkHero ? 'text-ink' : 'text-white'
                                }`}
                            aria-label={t('toggleMenu')}
                        >
                            {isMobileMenuOpen ? (
                                <Icons.close className="w-6 h-6" />
                            ) : (
                                <Icons.menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-card-hover p-6"
                        >
                            <div className="space-y-1">
                                {navigationConfig.main.map((item) => {
                                    const isActive = pathname === `/${locale}${item.href}` ||
                                        (item.href === '/' && (pathname === `/${locale}` || pathname === `/${locale}/`));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                        block px-4 py-3 rounded-xl text-base font-medium transition-colors
                        ${isActive
                                                    ? 'bg-primary-50 text-primary-700'
                                                    : 'text-ink hover:bg-surface'
                                                }
                      `}
                                        >
                                            {t(item.labelKey)}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile Language Switcher */}
                            <div className="mt-4 pt-4 border-t border-border-light">
                                <div className="flex gap-2">
                                    {locales.map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => switchLocale(loc)}
                                            disabled={isPending}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                        ${loc === locale ? 'bg-primary-50 text-primary-700' : 'bg-surface text-ink hover:bg-primary-50'}
                        ${isPending ? 'opacity-50' : ''}
                      `}
                                        >
                                            <span>{localeFlags[loc]}</span>
                                            <span>{localeNames[loc]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link href="/contact">
                                    <Button className="w-full" size="lg">
                                        {t('getConsultation')}
                                    </Button>
                                </Link>
                            </div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
