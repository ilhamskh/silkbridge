import type { Locale } from '@/i18n/config';

export type ContentBlock =
    | { type: 'heading'; level: 2 | 3; text: string }
    | { type: 'paragraph'; text: string }
    | { type: 'quote'; text: string; by?: string }
    | { type: 'bullets'; items: string[] }
    | { type: 'callout'; title: string; text: string }
    | { type: 'stats'; items: { label: string; value: string; note?: string }[] }
    | { type: 'image'; src: string; alt: string; caption?: string }
    | { type: 'divider' };

export type Post = {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: 'Pharma' | 'Market Entry' | 'Health Tourism' | 'Wellness';
    tags: string[];
    author: { name: string; role: string; avatar: string };
    publishedAt: string;
    readingTimeMinutes: number;
    featured?: boolean;
    content: ContentBlock[];
};

export const categories = ['Pharma', 'Market Entry', 'Health Tourism', 'Wellness'] as const;
export type Category = (typeof categories)[number];

// Category translations
export const categoryTranslations: Record<Category, Record<Locale, string>> = {
    'Pharma': { en: 'Pharma', az: 'Farmasevtika' },
    'Market Entry': { en: 'Market Entry', az: 'Bazara Giriş' },
    'Health Tourism': { en: 'Health Tourism', az: 'Sağlamlıq Turizmi' },
    'Wellness': { en: 'Wellness', az: 'Wellness' },
};

export const popularTags: Record<Locale, string[]> = {
    en: [
        'Regulatory',
        'ASEAN',
        'Biosimilars',
        'Medical Tourism',
        'Wellness',
        'Market Entry',
        'Digital Health',
        'GCC',
        'Supply Chain',
        'Patient Experience',
    ],
    az: [
        'Tənzimləmə',
        'ASEAN',
        'Biosimilyarlar',
        'Tibbi Turizm',
        'Wellness',
        'Bazara Giriş',
        'Rəqəmsal Səhiyyə',
        'KİŞ',
        'Təchizat Zənciri',
        'Xəstə Təcrübəsi',
    ],
};

// Localized tag mapping (for filtering)
export const tagTranslations: Record<string, Record<Locale, string>> = {
    'Regulatory': { en: 'Regulatory', az: 'Tənzimləmə' },
    'ASEAN': { en: 'ASEAN', az: 'ASEAN' },
    'Biosimilars': { en: 'Biosimilars', az: 'Biosimilyarlar' },
    'Medical Tourism': { en: 'Medical Tourism', az: 'Tibbi Turizm' },
    'Wellness': { en: 'Wellness', az: 'Wellness' },
    'Market Entry': { en: 'Market Entry', az: 'Bazara Giriş' },
    'Digital Health': { en: 'Digital Health', az: 'Rəqəmsal Səhiyyə' },
    'GCC': { en: 'GCC', az: 'KİŞ' },
    'Supply Chain': { en: 'Supply Chain', az: 'Təchizat Zənciri' },
    'Patient Experience': { en: 'Patient Experience', az: 'Xəstə Təcrübəsi' },
    'Asia-Pacific': { en: 'Asia-Pacific', az: 'Asiya-Sakit Okean' },
    'Distribution': { en: 'Distribution', az: 'Paylanma' },
    'Generics': { en: 'Generics', az: 'Generiklər' },
    'Emerging Markets': { en: 'Emerging Markets', az: 'Yüksələn Bazarlar' },
    'Technology': { en: 'Technology', az: 'Texnologiya' },
    'Facilitation': { en: 'Facilitation', az: 'Fasilitasiya' },
    'Middle East': { en: 'Middle East', az: 'Yaxın Şərq' },
    'Harmonization': { en: 'Harmonization', az: 'Harmonizasiya' },
    'Preventive Care': { en: 'Preventive Care', az: 'Profilaktik Müalicə' },
    'Health Screening': { en: 'Health Screening', az: 'Sağlamlıq Müayinəsi' },
    'Asia': { en: 'Asia', az: 'Asiya' },
};
