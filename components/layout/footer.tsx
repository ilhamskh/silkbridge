'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { navigationConfig, siteConfig } from '@/content/site-config';
import Logo from '@/components/ui/Logo';
import { Icons } from '@/components/ui/Icons';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');

    const footerLinks = [
        {
            titleKey: 'services.title',
            links: [
                { labelKey: 'services.marketEntry', href: '/services#market-entry' },
                { labelKey: 'services.regulatory', href: '/services#regulatory' },
                { labelKey: 'services.healthTourism', href: '/services#health-tourism' },
                { labelKey: 'services.wellness', href: '/services#wellness' },
            ],
        },
        {
            titleKey: 'company.title',
            links: [
                { labelKey: 'company.about', href: '/about' },
                { labelKey: 'company.partners', href: '/partners' },
                { labelKey: 'company.insights', href: '/market-insights' },
                { labelKey: 'company.contact', href: '/contact' },
            ],
        },
        {
            titleKey: 'resources.title',
            links: [
                { labelKey: 'resources.reports', href: '/market-insights' },
                { labelKey: 'resources.portal', href: '/partners' },
                { labelKey: 'resources.privacy', href: '/privacy' },
                { labelKey: 'resources.terms', href: '/terms' },
            ],
        },
    ];

    return (
        <footer className="bg-ink text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Logo className="h-8 w-auto text-white" />
                        <p className="mt-6 text-white/60 text-body-sm leading-relaxed max-w-sm">
                            {t('tagline')}
                        </p>
                        {/* Social Links */}
                        <div className="mt-8 flex items-center gap-4">
                            {navigationConfig.social.map((item) => {
                                const Icon = Icons[item.icon as keyof typeof Icons];
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center 
                             hover:bg-primary-600 transition-colors duration-200"
                                        aria-label={item.name}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                            {footerLinks.map((group) => (
                                <div key={group.titleKey}>
                                    <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                                        {t(group.titleKey)}
                                    </h3>
                                    <ul className="mt-4 space-y-3">
                                        {group.links.map((link) => (
                                            <li key={link.labelKey}>
                                                <Link
                                                    href={link.href}
                                                    className="text-white/60 hover:text-white text-body-sm transition-colors"
                                                >
                                                    {t(link.labelKey)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-white/40 text-sm">
                            {t('copyright', { year: currentYear, company: siteConfig.name })}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-white/40">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                {t('privacyPolicy')}
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                {t('termsOfService')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
