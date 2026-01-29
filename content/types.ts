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
    'Pharma': { en: 'Pharma', az: 'Farmasevtika', ru: 'Фарма' },
    'Market Entry': { en: 'Market Entry', az: 'Bazara Giriş', ru: 'Выход на рынок' },
    'Health Tourism': { en: 'Health Tourism', az: 'Sağlamlıq Turizmi', ru: 'Медицинский туризм' },
    'Wellness': { en: 'Wellness', az: 'Wellness', ru: 'Велнес' },
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
    ru: [
        'Регулирование',
        'АСЕАН',
        'Биосимиляры',
        'Медицинский туризм',
        'Велнес',
        'Выход на рынок',
        'Цифровое здоровье',
        'GCC',
        'Цепочка поставок',
        'Опыт пациента',
    ],
};

// Localized tag mapping (for filtering)
export const tagTranslations: Record<string, Record<Locale, string>> = {
    'Regulatory': { en: 'Regulatory', az: 'Tənzimləmə', ru: 'Регулирование' },
    'ASEAN': { en: 'ASEAN', az: 'ASEAN', ru: 'АСЕАН' },
    'Biosimilars': { en: 'Biosimilars', az: 'Biosimilyarlar', ru: 'Биосимиляры' },
    'Medical Tourism': { en: 'Medical Tourism', az: 'Tibbi Turizm', ru: 'Медицинский туризм' },
    'Wellness': { en: 'Wellness', az: 'Wellness', ru: 'Велнес' },
    'Market Entry': { en: 'Market Entry', az: 'Bazara Giriş', ru: 'Выход на рынок' },
    'Digital Health': { en: 'Digital Health', az: 'Rəqəmsal Səhiyyə', ru: 'Цифровое здоровье' },
    'GCC': { en: 'GCC', az: 'KİŞ', ru: 'GCC' },
    'Supply Chain': { en: 'Supply Chain', az: 'Təchizat Zənciri', ru: 'Цепочка поставок' },
    'Patient Experience': { en: 'Patient Experience', az: 'Xəstə Təcrübəsi', ru: 'Опыт пациента' },
    'Asia-Pacific': { en: 'Asia-Pacific', az: 'Asiya-Sakit Okean', ru: 'Азиатско-Тихоокеанский' },
    'Distribution': { en: 'Distribution', az: 'Paylanma', ru: 'Дистрибуция' },
    'Generics': { en: 'Generics', az: 'Generiklər', ru: 'Дженерики' },
    'Emerging Markets': { en: 'Emerging Markets', az: 'Yüksələn Bazarlar', ru: 'Развивающиеся рынки' },
    'Technology': { en: 'Technology', az: 'Texnologiya', ru: 'Технологии' },
    'Facilitation': { en: 'Facilitation', az: 'Fasilitasiya', ru: 'Фасилитация' },
    'Middle East': { en: 'Middle East', az: 'Yaxın Şərq', ru: 'Ближний Восток' },
    'Harmonization': { en: 'Harmonization', az: 'Harmonizasiya', ru: 'Гармонизация' },
    'Preventive Care': { en: 'Preventive Care', az: 'Profilaktik Müalicə', ru: 'Профилактика' },
    'Health Screening': { en: 'Health Screening', az: 'Sağlamlıq Müayinəsi', ru: 'Медицинское обследование' },
    'Asia': { en: 'Asia', az: 'Asiya', ru: 'Азия' },
};
