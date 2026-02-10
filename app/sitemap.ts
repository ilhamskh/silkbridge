import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://silkbridge.az';

const pages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/services', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/partners', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/services/health-tourism', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/services/pharma-marketing', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/services/tourism', changeFrequency: 'monthly' as const, priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    for (const page of pages) {
        for (const locale of locales) {
            entries.push({
                url: `${BASE_URL}/${locale}${page.path}`,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${BASE_URL}/${l}${page.path}`])
                    ),
                },
            });
        }
    }

    return entries;
}
