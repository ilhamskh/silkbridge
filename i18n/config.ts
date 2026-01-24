export const locales = ['en', 'az'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
    en: 'English',
    az: 'Azərbaycan',
};

export const localeFlags: Record<Locale, string> = {
    en: '🇺🇸',
    az: '🇦🇿',
};
