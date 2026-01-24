'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { navigationConfig } from '@/content/site-config';
import { Icons } from '@/components/ui/Icons';
import type { Locale } from '@/i18n/config';

export default function MobileTabBar() {
    const pathname = usePathname();
    const locale = useLocale() as Locale;
    const t = useTranslations('nav');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY;

            if (scrollDiff > 10 && currentScrollY > 100) {
                setIsVisible(false);
            } else if (scrollDiff < -10 || currentScrollY < 100) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const getActiveIndex = () => {
        const index = navigationConfig.mobile.findIndex((item) => {
            const itemPath = `/${locale}${item.href}`;
            if (item.href === '/') return pathname === `/${locale}` || pathname === `/${locale}/`;
            return pathname.startsWith(itemPath);
        });
        return index >= 0 ? index : 0;
    };

    const activeIndex = getActiveIndex();

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: isVisible ? 0 : 100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
            {/* Gradient fade effect */}
            <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />

            <nav className="bg-white border-t border-border-light pb-safe">
                <div className="relative flex items-center justify-around px-2 py-2">
                    {/* Active pill indicator */}
                    <motion.div
                        layoutId="tabbar-pill"
                        className="absolute top-1.5 bottom-1.5 bg-primary-50 rounded-xl"
                        style={{
                            width: `${100 / navigationConfig.mobile.length - 2}%`,
                        }}
                        animate={{
                            left: `${(activeIndex * 100) / navigationConfig.mobile.length + 1}%`,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 35,
                        }}
                    />

                    {navigationConfig.mobile.map((item, index) => {
                        const Icon = Icons[item.icon as keyof typeof Icons];
                        const isActive = index === activeIndex;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex-1 flex flex-col items-center py-2 z-10"
                            >
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1 : 0.95,
                                    }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Icon
                                        className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-muted'
                                            }`}
                                    />
                                </motion.div>
                                <motion.span
                                    className={`mt-1 text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-muted'
                                        }`}
                                    animate={{
                                        opacity: isActive ? 1 : 0.7,
                                    }}
                                >
                                    {t(item.labelKey)}
                                </motion.span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </motion.div>
    );
}
