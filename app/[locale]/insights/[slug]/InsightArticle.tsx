'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { InsightPostFull, InsightPostCard } from '@/lib/content';
import type { TocItem } from '@/lib/insights/markdown';
import { CopyLinkButton } from './CopyLinkButton';

// ============================================
// Labels
// ============================================

const labels: Record<string, Record<string, string>> = {
    en: {
        backToInsights: 'Back to Insights',
        tableOfContents: 'On this page',
        relatedArticles: 'Related Articles',
        minRead: 'min read',
        readMore: 'Read more',
        shareArticle: 'Share',
    },
    az: {
        backToInsights: 'Məqalələrə qayıt',
        tableOfContents: 'Bu səhifədə',
        relatedArticles: 'Əlaqəli Məqalələr',
        minRead: 'dəq oxu',
        readMore: 'Ətraflı oxu',
        shareArticle: 'Paylaş',
    },
    ru: {
        backToInsights: 'Назад к статьям',
        tableOfContents: 'На этой странице',
        relatedArticles: 'Похожие статьи',
        minRead: 'мин чтения',
        readMore: 'Читать далее',
        shareArticle: 'Поделиться',
    },
};

// ============================================
// Component
// ============================================

interface InsightArticleProps {
    post: InsightPostFull;
    htmlContent: string;
    headings: TocItem[];
    relatedPosts: InsightPostCard[];
    locale: string;
    formattedDate: string | null;
}

export function InsightArticle({
    post,
    htmlContent,
    headings,
    relatedPosts,
    locale,
    formattedDate,
}: InsightArticleProps) {
    const t = labels[locale] || labels.en;
    const [readProgress, setReadProgress] = useState(0);
    const [activeHeading, setActiveHeading] = useState<string>('');

    // Reading progress bar
    useEffect(() => {
        function handleScroll() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                setReadProgress(Math.min(100, (scrollTop / docHeight) * 100));
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Active heading tracking for ToC
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                    }
                }
            },
            { rootMargin: '-100px 0px -80% 0px', threshold: 0 }
        );

        for (const h of headings) {
            const el = document.getElementById(h.id);
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [headings]);

    return (
        <div className="min-h-screen bg-white">
            {/* Reading progress bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
                <div
                    className="h-full bg-primary-600 transition-[width] duration-150 ease-out"
                    style={{ width: `${readProgress}%` }}
                />
            </div>

            {/* Main container with left rail + content */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
                <div className="lg:grid lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr] lg:gap-12 xl:gap-16">

                    {/* Left Rail - Desktop only, sticky */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-8">
                            {/* Back link */}
                            <nav>
                                <Link
                                    href={`/${locale}/insights`}
                                    className="inline-flex items-center gap-2 text-body-sm text-subtle hover:text-ink transition-colors group"
                                >
                                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    {t.backToInsights}
                                </Link>
                            </nav>

                            {/* Category & Tags */}
                            {(post.categoryName || post.tags.length > 0) && (
                                <div className="space-y-3">
                                    {post.categoryName && (
                                        <div>
                                            <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 text-caption font-semibold rounded-lg">
                                                {post.categoryName}
                                            </span>
                                        </div>
                                    )}
                                    {post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.slice(0, 5).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-block px-2.5 py-1 bg-surface text-subtle text-caption font-medium rounded-lg hover:bg-surface-elevated transition-colors cursor-default"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Share */}
                            <div>
                                <CopyLinkButton locale={locale} />
                            </div>

                            {/* Table of Contents */}
                            {headings.length > 0 && (
                                <nav className="space-y-2">
                                    <h4 className="text-caption font-semibold text-muted uppercase tracking-wider">
                                        {t.tableOfContents}
                                    </h4>
                                    <ul className="space-y-1 border-l-2 border-border-light">
                                        {headings.map((h) => (
                                            <li key={h.id}>
                                                <a
                                                    href={`#${h.id}`}
                                                    className={`block text-body-sm py-1 px-3 -ml-[2px] border-l-2 transition-all ${h.level === 3 ? 'pl-6' : ''
                                                        } ${activeHeading === h.id
                                                            ? 'text-primary-600 font-medium border-primary-600'
                                                            : 'text-subtle hover:text-ink border-transparent hover:border-border'
                                                        }`}
                                                >
                                                    {h.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </aside>

                    {/* Article Content */}
                    <div className="w-full max-w-[760px]">
                        {/* Mobile: Back link */}
                        <nav className="lg:hidden mb-6">
                            <Link
                                href={`/${locale}/insights`}
                                className="inline-flex items-center gap-2 text-body-sm text-subtle hover:text-ink transition-colors group"
                            >
                                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                {t.backToInsights}
                            </Link>
                        </nav>

                        {/* Article Header */}
                        <header className="mb-10 sm:mb-12">
                            <h1 className="font-heading text-display-sm sm:text-display lg:text-display-lg text-ink mb-4 leading-tight">
                                {post.title}
                            </h1>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-3 text-body-sm text-subtle mb-6">
                                {formattedDate && (
                                    <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}>
                                        {formattedDate}
                                    </time>
                                )}
                                {post.readTimeMinutes && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span>{post.readTimeMinutes} {t.minRead}</span>
                                    </>
                                )}
                            </div>

                            {/* Mobile: Category & Tags */}
                            <div className="lg:hidden flex flex-wrap items-center gap-2 mb-4">
                                {post.categoryName && (
                                    <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 text-caption font-semibold rounded-lg">
                                        {post.categoryName}
                                    </span>
                                )}
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-block px-2.5 py-1 bg-surface text-subtle text-caption font-medium rounded-lg"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                <div className="ml-auto">
                                    <CopyLinkButton locale={locale} />
                                </div>
                            </div>
                        </header>

                        {/* Cover Image - In article flow */}
                        {post.coverImageUrl && (
                            <figure className="mb-10 sm:mb-12">
                                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-surface">
                                    <Image
                                        src={post.coverImageUrl}
                                        alt={post.coverImageAlt || post.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 760px"
                                    />
                                </div>
                                {post.coverImageAlt && post.coverImageAlt !== post.title && (
                                    <figcaption className="mt-3 text-caption text-subtle text-center">
                                        {post.coverImageAlt}
                                    </figcaption>
                                )}
                            </figure>
                        )}

                        {/* Article Body */}
                        <article
                            className="prose prose-silkbridge max-w-none"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </div>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
                <section className="border-t border-border-light bg-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                        <h2 className="text-h2 font-heading text-ink mb-8">{t.relatedArticles}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {relatedPosts.map((rp) => (
                                <Link
                                    key={rp.id}
                                    href={`/${locale}/insights/${rp.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card hover:shadow-card-hover transition-all duration-300"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-primary-50">
                                        {rp.coverImageUrl ? (
                                            <Image
                                                src={rp.coverImageUrl}
                                                alt={rp.coverImageAlt || rp.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
                                                <svg className="w-10 h-10 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-h4 font-heading text-ink mb-2 group-hover:text-primary-700 line-clamp-2 transition-colors">
                                            {rp.title}
                                        </h3>
                                        <p className="text-body-sm text-subtle line-clamp-2">{rp.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
