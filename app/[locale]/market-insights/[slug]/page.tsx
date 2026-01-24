import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/content/site-config';
import { getPosts, getPostBySlug, getRelatedPosts } from '@/content';
import BlogArticleContent from './BlogArticleContent';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];

    for (const locale of routing.locales) {
        const posts = getPosts(locale);
        for (const post of posts) {
            params.push({ locale, slug: post.slug });
        }
    }

    return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = getPostBySlug(slug, locale as 'en' | 'az');

    if (!post) {
        const t = await getTranslations({ locale, namespace: 'seo' });
        return {
            title: t('notFound.title'),
        };
    }

    return {
        title: `${post.title} | ${siteConfig.name}`,
        description: post.excerpt,
        authors: [{ name: post.author.name }],
        alternates: {
            canonical: `/${locale}/market-insights/${slug}`,
            languages: {
                en: `/en/market-insights/${slug}`,
                az: `/az/market-insights/${slug}`,
            },
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author.name],
            url: `/${locale}/market-insights/${slug}`,
            siteName: siteConfig.name,
            locale: locale === 'az' ? 'az_AZ' : 'en_US',
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        },
    };
}

export default async function BlogArticlePage({ params }: PageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = getPostBySlug(slug, locale as 'en' | 'az');

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(slug, 3, locale as 'en' | 'az');

    // JSON-LD structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
        },
        publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
                '@type': 'ImageObject',
                url: '/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `/${locale}/market-insights/${post.slug}`,
        },
        inLanguage: locale,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogArticleContent post={post} relatedPosts={relatedPosts} />
        </>
    );
}
