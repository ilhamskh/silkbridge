import { Link } from '@/i18n/routing';
import { siteConfig } from '@/content/site-config';
import { getNavigationItems, getFooterSectionLabels } from '@/lib/content/getNavigation';
import Logo from '@/components/ui/Logo';
import { Icons } from '@/components/ui/Icons';
import type { Locale } from '@/i18n/config';

// UI labels for footer chrome (not marketing content)
const footerUiLabels: Record<string, { copyright: string; privacyPolicy: string; termsOfService: string }> = {
    en: { copyright: '© {year} {company}. All rights reserved.', privacyPolicy: 'Privacy Policy', termsOfService: 'Terms of Service' },
    az: { copyright: '© {year} {company}. Bütün hüquqlar qorunur.', privacyPolicy: 'Məxfilik Siyasəti', termsOfService: 'İstifadə Şərtləri' },
    ru: { copyright: '© {year} {company}. Все права защищены.', privacyPolicy: 'Политика конфиденциальности', termsOfService: 'Условия использования' },
};

// Taglines by locale (will be replaced by DB when settings are properly populated)
const taglines: Record<string, string> = {
    en: 'Bridging global healthcare markets with premium pharmaceutical services and world-class medical tourism.',
    az: 'Premium əczaçılıq xidmətləri və dünya səviyyəli tibbi turizm ilə qlobal səhiyyə bazarlarını birləşdiririk.',
    ru: 'Связываем глобальные рынки здравоохранения с премиальными фармацевтическими услугами и медицинским туризмом мирового класса.',
};

interface FooterProps {
    locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
    const currentYear = new Date().getFullYear();

    // Get navigation items from content layer
    const navigation = getNavigationItems(locale);
    const sectionLabels = getFooterSectionLabels(locale);
    const uiLabels = footerUiLabels[locale] || footerUiLabels.en;
    const tagline = taglines[locale] || taglines.en;

    const footerLinks = [
        {
            title: sectionLabels.services,
            links: navigation.footer.services,
        },
        {
            title: sectionLabels.company,
            links: navigation.footer.company,
        },
        {
            title: sectionLabels.resources,
            links: navigation.footer.resources,
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
                        <p className="mt-6 font-sans text-white/60 text-body-sm leading-relaxed max-w-sm">
                            {tagline}
                        </p>
                        {/* Social Links */}
                        <div className="mt-8 flex items-center gap-4">
                            {navigation.social.map((item) => {
                                const Icon = Icons[item.icon as keyof typeof Icons];
                                if (!Icon) return null; // Guard against missing icons
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
                                <div key={group.title}>
                                    <h3 className="font-sans text-sm font-semibold text-white tracking-wide uppercase">
                                        {group.title}
                                    </h3>
                                    <ul className="mt-4 space-y-3">
                                        {group.links.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="font-sans text-white/60 hover:text-white text-body-sm transition-colors"
                                                >
                                                    {link.label}
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
                        <p className="font-sans text-white/40 text-sm">
                            {uiLabels.copyright.replace('{year}', String(currentYear)).replace('{company}', siteConfig.name)}
                        </p>
                        <div className="flex items-center gap-6 font-sans text-sm text-white/40">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                {uiLabels.privacyPolicy}
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                {uiLabels.termsOfService}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
