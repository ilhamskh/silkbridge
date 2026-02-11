'use client';

import { useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { getNavigationItems } from '@/lib/content/getNavigation';
import Button from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';

// UI labels for mobile menu chrome (not marketing content)
const mobileMenuLabels: Record<string, { menu: string; closeMenu: string; language: string; getConsultation: string }> = {
  en: { menu: 'Menu', closeMenu: 'Close menu', language: 'Language', getConsultation: 'Get Consultation' },
  az: { menu: 'Menyu', closeMenu: 'Menyunu bağla', language: 'Dil', getConsultation: 'Konsultasiya alın' },
  ru: { menu: 'Меню', closeMenu: 'Закрыть меню', language: 'Язык', getConsultation: 'Консультация' },
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get navigation items from content layer
  const navigation = getNavigationItems(locale);
  const labels = mobileMenuLabels[locale] || mobileMenuLabels.en;

  // Close on pathname change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const switchLocale = (newLocale: Locale) => {
    startTransition(() => {
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      router.replace(pathWithoutLocale, { locale: newLocale });
    });
  };

  const menuVariants = {
    hidden: { x: '100%', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
    visible: { x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  };

  const overlayVariants = {
    hidden: { opacity: 0, transition: { duration: 0.2 } },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 right-0 bottom-0 z-[60] w-full max-w-sm bg-white shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
                <span className="text-lg font-semibold text-ink">{labels.menu}</span>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-muted hover:text-ink transition-colors rounded-lg hover:bg-surface"
                  aria-label={labels.closeMenu}
                >
                  <Icons.close className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-1">
                  {navigation.main.map((item, index) => {
                    const isActive =
                      pathname === `/${locale}${item.href}` ||
                      (item.href === '/' && (pathname === `/${locale}` || pathname === `/${locale}/`));

                    return (
                      <motion.div
                        key={item.href}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={item.href}
                          className={`
                            block px-4 py-3.5 rounded-xl text-base font-medium transition-all
                            ${isActive
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-ink hover:bg-surface hover:text-primary-600'
                            }
                          `}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Language Switcher */}
                <motion.div
                  custom={navigation.main.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 pt-6 border-t border-border-light"
                >
                  <p className="px-4 mb-3 text-xs font-medium text-muted uppercase tracking-wider">
                    {labels.language}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        disabled={isPending}
                        className={`
                          flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                          ${loc === locale
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface text-ink hover:bg-primary-50 hover:text-primary-600'
                          }
                          ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <span className="text-base">{localeFlags[loc]}</span>
                        <span>{localeNames[loc]}</span>
                        {loc === locale && <Icons.check className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </nav>

              {/* Footer CTA */}
              <motion.div
                custom={navigation.main.length + 1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="px-6 py-6 border-t border-border-light bg-surface/50"
              >
                <Link href="/contact">
                  <Button className="w-full" size="lg">
                    <Icons.phone className="w-4 h-4 mr-2" />
                    {labels.getConsultation}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
