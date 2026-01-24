import type { Locale } from '@/i18n/config';

// Non-localized site configuration
export const siteConfig = {
    name: 'Silkbridge International',
    url: 'https://silkbridge.com',
    email: 'contact@silkbridge.com',
    phone: '+1 (555) 123-4567',
    address: '350 Fifth Avenue, Suite 7820, New York, NY 10118',
};

// Stats data (values are not localized, labels come from messages)
export const statsData = [
    { value: '$12.1T', labelKey: 'globalHealthcareMarket', source: 'Deloitte' },
    { value: '74M', labelKey: 'medicalTouristsAnnually', source: 'MTA' },
    { value: '18.3%', labelKey: 'emergingMarketCagr', source: 'McKinsey' },
    { value: '$4.5B', labelKey: 'wellnessTourismGrowth', source: 'GWI' },
];

// Partner items (names stay the same, specialty text can be localized if needed)
export const partnerItems = [
    { name: 'Seoul Medical Center', location: 'Seoul, South Korea', specialty: 'Oncology, Cardiology', region: 'asia-pacific' },
    { name: 'Bangkok International Hospital', location: 'Bangkok, Thailand', specialty: 'Orthopedics, Wellness', region: 'asia-pacific' },
    { name: 'Singapore Health Partners', location: 'Singapore', specialty: 'Neurology, Pediatrics', region: 'asia-pacific' },
    { name: 'Dubai Healthcare City', location: 'Dubai, UAE', specialty: 'Multi-specialty', region: 'middle-east' },
    { name: 'São Paulo Medical', location: 'São Paulo, Brazil', specialty: 'Plastic Surgery, Dentistry', region: 'americas' },
    { name: 'Munich Medical Alliance', location: 'Munich, Germany', specialty: 'Rehabilitation, Sports Medicine', region: 'europe' },
];

// Form inquiry types - values for form submission, labels come from messages
export const inquiryTypes = [
    { value: 'marketEntry', labelKey: 'marketEntry' },
    { value: 'distribution', labelKey: 'distribution' },
    { value: 'healthTourism', labelKey: 'healthTourism' },
    { value: 'wellness', labelKey: 'wellness' },
    { value: 'other', labelKey: 'other' },
];

// Navigation structure - href values stay the same, labels come from messages
export const navigationConfig = {
    main: [
        { href: '/', labelKey: 'home' },
        { href: '/about', labelKey: 'about' },
        { href: '/services', labelKey: 'services' },
        { href: '/market-insights', labelKey: 'marketInsights' },
        { href: '/partners', labelKey: 'partners' },
        { href: '/contact', labelKey: 'contact' },
    ],
    mobile: [
        { href: '/', labelKey: 'home', icon: 'home' },
        { href: '/services', labelKey: 'services', icon: 'services' },
        { href: '/market-insights', labelKey: 'insights', icon: 'insights' },
        { href: '/partners', labelKey: 'partners', icon: 'partners' },
        { href: '/contact', labelKey: 'contact', icon: 'contact' },
    ],
    social: [
        { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
        { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    ],
};

// Service features lists - these come from messages

// Pillar icons mapping
export const pillarIcons = ['regulatory', 'market', 'wellness'] as const;
