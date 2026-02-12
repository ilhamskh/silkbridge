import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales } from '@/i18n/config';
import { getInsightBySlug, getRelatedInsights } from '@/lib/content';
import { renderMarkdown, extractHeadings } from '@/lib/insights/markdown';
import { InsightArticle } from './InsightArticle';

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://silkbridge.in';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getInsightBySlug(locale, slug);

    if (!post) {
        return { title: 'Not Found' };
    }

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    const ogImage = post.ogImageUrl || post.coverImageUrl;

    return {
        title: `${title} | Silkbridge International`,
        description,
        alternates: {
            canonical: `${BASE_URL}/${locale}/insights/${slug}`,
            languages: Object.fromEntries(
                locales.map((l) => [l, `${BASE_URL}/${l}/insights/${slug}`])
            ),
        },
        openGraph: {
            type: 'article',
            title,
            description,
            url: `${BASE_URL}/${locale}/insights/${slug}`,
            publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
            modifiedTime: new Date(post.updatedAt).toISOString(),
            authors: ['Silkbridge International'],
            ...(ogImage && {
                images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(ogImage && { images: [ogImage] }),
        },
    };
}

export default async function InsightPostPage({ params }: PageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await getInsightBySlug(locale, slug);
    if (!post) notFound();

    const [htmlContent, relatedPosts] = await Promise.all([
        renderMarkdown(post.bodyMarkdown),
        getRelatedInsights(locale, slug, post.categoryKey, 3),
    ]);

    const headings = extractHeadings(post.bodyMarkdown);

    // Format the published date on server to prevent hydration mismatch
    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    // JSON-LD Article structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        dateModified: new Date(post.updatedAt).toISOString(),
        author: {
            '@type': 'Organization',
            name: 'Silkbridge International',
            url: BASE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Silkbridge International',
            url: BASE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
            },
        },
        ...(post.coverImageUrl && {
            image: {
                '@type': 'ImageObject',
                url: post.coverImageUrl,
            },
        }),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/${locale}/insights/${slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <InsightArticle
                post={post}
                htmlContent={htmlContent}
                headings={headings}
                relatedPosts={relatedPosts}
                locale={locale}
                formattedDate={formattedDate}
            />
        </>
    );
}
