import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getAllPublishedInsightSlugs } from '@/lib/content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://silkbridge.az';

const pages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/services', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/partners', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/insights', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/services/health-tourism', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/services/pharma-marketing', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/services/tourism', changeFrequency: 'monthly' as const, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    // Static pages
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

    // Dynamic: published insight posts
    try {
        const insightSlugs = await getAllPublishedInsightSlugs();
        const slugMap = new Map<string, { locales: string[]; updatedAt: Date }>();

        for (const item of insightSlugs) {
            const existing = slugMap.get(item.slug);
            if (existing) {
                existing.locales.push(item.locale);
                if (item.updatedAt > existing.updatedAt) {
                    existing.updatedAt = item.updatedAt;
                }
            } else {
                slugMap.set(item.slug, { locales: [item.locale], updatedAt: item.updatedAt });
            }
        }

        for (const [slug, data] of slugMap) {
            for (const locale of data.locales) {
                entries.push({
                    url: `${BASE_URL}/${locale}/insights/${slug}`,
                    lastModified: data.updatedAt,
                    changeFrequency: 'weekly',
                    priority: 0.6,
                    alternates: {
                        languages: Object.fromEntries(
                            data.locales.map((l) => [l, `${BASE_URL}/${l}/insights/${slug}`])
                        ),
                    },
                });
            }
        }
    } catch (e) {
        // Sitemap generation should not fail if DB is unavailable
        console.error('Failed to fetch insight slugs for sitemap:', e);
    }

    return entries;
}
