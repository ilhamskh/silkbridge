/**
 * Navigation Items Fetcher
 * ========================
 * 
 * Provides navigation items for header/footer.
 * Currently uses static config, but structured to allow
 * future migration to DB if admin needs to edit nav labels.
 */

export interface NavigationItem {
    href: string;
    label: string;
    labelKey?: string; // For backwards compatibility during migration
}

export interface NavigationConfig {
    main: NavigationItem[];
    footer: {
        services: NavigationItem[];
        company: NavigationItem[];
        resources: NavigationItem[];
    };
    social: Array<{
        name: string;
        href: string;
        icon: string;
    }>;
}

/**
 * Navigation labels by locale
 * These are UI chrome labels - not marketing content
 * Can stay in code since they're structural, not editable content
 */
const navigationLabels: Record<string, Record<string, string>> = {
    en: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        partners: 'Partners',
        contact: 'Contact',
        insights: 'Insights',
        // Footer sections
        servicesTitle: 'Services',
        companyTitle: 'Company',
        resourcesTitle: 'Resources',
        // Footer links
        marketEntry: 'Market Entry',
        regulatory: 'Regulatory',
        healthTourism: 'Health Tourism',
        wellness: 'Wellness',
        aboutUs: 'About Us',
        ourPartners: 'Partners',
        marketInsights: 'Market Insights',
        contactUs: 'Contact',
        reports: 'Industry Reports',
        portal: 'Partner Portal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
    },
    az: {
        home: 'Əsas',
        about: 'Haqqımızda',
        services: 'Xidmətlər',
        partners: 'Tərəfdaşlar',
        contact: 'Əlaqə',
        insights: 'Məqalələr',
        servicesTitle: 'Xidmətlər',
        companyTitle: 'Şirkət',
        resourcesTitle: 'Resurslar',
        marketEntry: 'Bazara Giriş',
        regulatory: 'Tənzimləmə',
        healthTourism: 'Sağlamlıq Turizmi',
        wellness: 'Sağlamlıq',
        aboutUs: 'Haqqımızda',
        ourPartners: 'Tərəfdaşlar',
        marketInsights: 'Bazar Məlumatları',
        contactUs: 'Əlaqə',
        reports: 'Sənaye Hesabatları',
        portal: 'Tərəfdaş Portalı',
        privacy: 'Məxfilik Siyasəti',
        terms: 'İstifadə Şərtləri',
    },
    ru: {
        home: 'Главная',
        about: 'О нас',
        services: 'Услуги',
        partners: 'Партнёры',
        contact: 'Контакты',
        insights: 'Статьи',
        servicesTitle: 'Услуги',
        companyTitle: 'Компания',
        resourcesTitle: 'Ресурсы',
        marketEntry: 'Выход на рынок',
        regulatory: 'Регуляторика',
        healthTourism: 'Медицинский туризм',
        wellness: 'Велнес',
        aboutUs: 'О нас',
        ourPartners: 'Партнёры',
        marketInsights: 'Аналитика рынка',
        contactUs: 'Контакты',
        reports: 'Отраслевые отчёты',
        portal: 'Портал партнёров',
        privacy: 'Политика конфиденциальности',
        terms: 'Условия использования',
    },
};

/**
 * Get navigation items for a specific locale
 */
export function getNavigationItems(locale: string): NavigationConfig {
    const labels = navigationLabels[locale] || navigationLabels.en;

    return {
        main: [
            { href: '/', label: labels.home },
            { href: '/about', label: labels.about },
            { href: '/services', label: labels.services },
            { href: '/partners', label: labels.partners },
            { href: '/market-insights', label: labels.insights },
            { href: '/contact', label: labels.contact },
        ],
        footer: {
            services: [
                { href: '/services#market-entry', label: labels.marketEntry },
                { href: '/services#regulatory', label: labels.regulatory },
                { href: '/services#health-tourism', label: labels.healthTourism },
                { href: '/services#wellness', label: labels.wellness },
            ],
            company: [
                { href: '/about', label: labels.aboutUs },
                { href: '/partners', label: labels.ourPartners },
                { href: '/market-insights', label: labels.marketInsights },
                { href: '/contact', label: labels.contactUs },
            ],
            resources: [
                { href: '/market-insights', label: labels.reports },
                { href: '/partners', label: labels.portal },
                { href: '/privacy', label: labels.privacy },
                { href: '/terms', label: labels.terms },
            ],
        },
        social: [
            { name: 'LinkedIn', href: 'https://linkedin.com/company/silkbridge', icon: 'linkedin' },
            { name: 'Twitter', href: 'https://twitter.com/silkbridge', icon: 'twitter' },
            { name: 'Facebook', href: 'https://facebook.com/silkbridge', icon: 'facebook' },
        ],
    };
}

/**
 * Get footer section labels for a specific locale
 */
export function getFooterSectionLabels(locale: string) {
    const labels = navigationLabels[locale] || navigationLabels.en;
    return {
        services: labels.servicesTitle,
        company: labels.companyTitle,
        resources: labels.resourcesTitle,
    };
}
