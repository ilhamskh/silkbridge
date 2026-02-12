'use client';

import { useState, useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { getNavigationItems } from '@/lib/content/getNavigation';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import MobileMenu from '@/components/layout/MobileMenu';

// UI labels for chrome elements (not marketing content)
const uiLabels: Record<string, { selectLanguage: string; toggleMenu: string; getConsultation: string }> = {
    en: { selectLanguage: 'Select language', toggleMenu: 'Toggle menu', getConsultation: 'Get Consultation' },
    az: { selectLanguage: 'Dili seçin', toggleMenu: 'Menyunu aç', getConsultation: 'Konsultasiya alın' },
    ru: { selectLanguage: 'Выбрать язык', toggleMenu: 'Меню', getConsultation: 'Консультация' },
};

interface HeaderProps {
    logoUrl?: string | null;
    siteName?: string | null;
}

export default function Header({ logoUrl, siteName }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const locale = useLocale() as Locale;
    const router = useRouter();

    // Get navigation items from content layer (not messages)
    const navigation = getNavigationItems(locale);
    const labels = uiLabels[locale] || uiLabels.en;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={siteName || 'Silkbridge International'}
                                    width={150}
                                    height={32}
                                    className="h-8 w-auto object-contain"
                                    priority
                                />
                            ) : (
                                <Logo className="h-8 w-auto" />
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1 font-sans">
                            {navigation.main.map((item) => {
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
                                        {item.label}
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
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-sans text-sm font-medium transition-colors
                    ${isScrolled || !hasDarkHero
                                            ? 'text-muted hover:text-primary-600 hover:bg-primary-50'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'}
                  `}
                                    aria-label={labels.selectLanguage}
                                >
                                    <span className="text-base">{localeFlags[locale]}</span>
                                    <span className="uppercase font-semibold">{locale}</span>
                                    <Icons.chevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
                                    <div className="py-1 bg-white rounded-card shadow-elevated border border-border-light">
                                        {locales.map((loc) => (
                                            <button
                                                key={loc}
                                                onClick={() => switchLocale(loc)}
                                                disabled={isPending}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 font-sans text-sm font-medium transition-colors
                          ${loc === locale ? 'bg-primary-50 text-primary-600' : 'text-ink hover:bg-surface'}
                          ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                                            >
                                                <span className="text-lg">{localeFlags[loc]}</span>
                                                <span className="flex-1 text-left">{localeNames[loc]}</span>
                                                {loc === locale && (
                                                    <Icons.check className="w-4 h-4 text-primary-600" />
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
                                    {labels.getConsultation}
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Right Side: CTA Pill + Menu Button */}
                        <div className="flex lg:hidden items-center gap-2">
                            {/* Compact CTA Pill */}
                            <Link href="/contact">
                                <button
                                    className={`
                                        font-sans px-3 py-2 rounded-full text-xs font-medium transition-all
                                        ${isScrolled || !hasDarkHero
                                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                                            : 'bg-white/90 text-primary-700 hover:bg-white'}
                                    `}
                                >
                                    {navigation.main.find(i => i.href === '/contact')?.label || 'Contact'}
                                </button>
                            </Link>

                            {/* Hamburger Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2 transition-colors rounded-lg
                                    ${isScrolled || !hasDarkHero ? 'text-ink hover:bg-surface' : 'text-white hover:bg-white/10'}
                                `}
                                aria-label={labels.toggleMenu}
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? (
                                    <Icons.close className="w-6 h-6" />
                                ) : (
                                    <Icons.menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Component */}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </>
    );
}
