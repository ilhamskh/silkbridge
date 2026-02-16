'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition, useEffect, useRef } from 'react';
import type { InsightPostCard, InsightCategory } from '@/lib/content';

// ============================================
// Labels
// ============================================

const labels: Record<string, Record<string, string>> = {
    en: {
        pageTitle: 'Insights',
        pageSubtitle: 'Expert analysis on healthcare, pharmaceuticals, and market trends',
        featured: 'Featured',
        allCategories: 'All',
        readMore: 'Read more',
        minRead: 'min read',
        noResults: 'No articles found',
        noResultsSub: 'Try adjusting your filters or check back later for new content.',
        searchPlaceholder: 'Search articles...',
        prev: 'Previous',
        next: 'Next',
        pageOf: 'of',
    },
    az: {
        pageTitle: 'Məqalələr',
        pageSubtitle: 'Səhiyyə, əczaçılıq və bazar tendensiyaları üzrə ekspert təhlili',
        featured: 'Seçilmiş',
        allCategories: 'Hamısı',
        readMore: 'Ətraflı oxu',
        minRead: 'dəq oxu',
        noResults: 'Məqalə tapılmadı',
        noResultsSub: 'Filtrlərinizi tənzimləyin və ya yeni məzmun üçün sonra yoxlayın.',
        searchPlaceholder: 'Məqalə axtar...',
        prev: 'Əvvəlki',
        next: 'Növbəti',
        pageOf: '/',
    },
    ru: {
        pageTitle: 'Статьи',
        pageSubtitle: 'Экспертный анализ в области здравоохранения, фармацевтики и рыночных трендов',
        featured: 'Избранное',
        allCategories: 'Все',
        readMore: 'Читать далее',
        minRead: 'мин чтения',
        noResults: 'Статьи не найдены',
        noResultsSub: 'Попробуйте изменить фильтры или вернитесь позже за новым контентом.',
        searchPlaceholder: 'Поиск статей...',
        prev: 'Назад',
        next: 'Далее',
        pageOf: 'из',
    },
};

// ============================================
// Component
// ============================================

interface InsightsPageContentProps {
    posts: InsightPostCard[];
    categories: InsightCategory[];
    total: number;
    page: number;
    totalPages: number;
    locale: string;
    activeCategory: string | null;
    searchQuery: string;
}

export function InsightsPageContent({
    posts,
    categories,
    total: _total,
    page,
    totalPages,
    locale,
    activeCategory,
    searchQuery,
}: InsightsPageContentProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(searchQuery);
    const t = labels[locale] || labels.en;
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const featuredPost = posts.find((p) => p.featured);
    const regularPosts = posts.filter((p) => !p.featured || page > 1);


    function navigate(params: { category?: string | null; page?: number; search?: string }) {
        const sp = new URLSearchParams();
        const cat = params.category !== undefined ? params.category : activeCategory;
        if (cat) sp.set('category', cat);
        if (params.page && params.page > 1) sp.set('page', String(params.page));

        // Handle search parameter - only add if it has a value after trimming
        const searchVal = params.search !== undefined ? params.search : searchQuery;
        const trimmedSearch = searchVal?.trim();
        if (trimmedSearch) {
            sp.set('q', trimmedSearch);
        }

        const qs = sp.toString();
        startTransition(() => {
            router.replace(`/${locale}/insights${qs ? `?${qs}` : ''}`);
        });
    }

    // Debounced search
    function handleSearchChange(value: string) {
        setSearch(value);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            // Pass empty string to explicitly clear search, or the trimmed value
            navigate({ search: value.trim(), page: 1 });
        }, 300);
    }

    // Cleanup debounce timer
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Immediate search on Enter key press
    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        // Clear any pending debounce
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        // Trigger immediate search with trimmed value
        navigate({ search: search.trim(), page: 1 });
    }


    // Sync local search state with URL on mount and searchParams changes
    useEffect(() => {
        setSearch(searchQuery);
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero with integrated search and filters */}
            <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden mt-20 sm:mt-24">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                    {/* Title and subtitle with max-width for readability */}
                    <div className="max-w-3xl mb-8 sm:mb-10">
                        <h1 className="font-heading text-display-sm sm:text-display lg:text-display-xl text-white mb-3 sm:mb-4">
                            {t.pageTitle}
                        </h1>
                        <p className="text-body sm:text-body-lg text-primary-100 leading-relaxed">
                            {t.pageSubtitle}
                        </p>
                    </div>

                    {/* Search and filters in hero */}
                    <div className="space-y-4">
                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="relative max-w-2xl">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder={t.searchPlaceholder}
                                className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-card text-body-sm bg-white/95 backdrop-blur-sm border border-white/20 text-ink placeholder:text-subtle focus:border-primary-300 focus:ring-2 focus:ring-primary-200/50 focus:bg-white outline-none transition-all shadow-elevated"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-subtle pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        navigate({ search: '', page: 1 });
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-subtle hover:text-ink rounded-full hover:bg-surface transition-colors"
                                    aria-label="Clear search"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </form>

                        {/* Category chips */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => navigate({ category: null, page: 1 })}
                                className={`px-3.5 sm:px-4 py-2 rounded-pill text-body-sm font-medium transition-all ${!activeCategory
                                    ? 'bg-white text-primary-700 shadow-card'
                                    : 'bg-white/10 backdrop-blur-sm text-white/90 border border-white/20 hover:bg-white/20 hover:border-white/30'
                                    }`}
                            >
                                {t.allCategories}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() =>
                                        navigate({
                                            category: activeCategory === cat.key ? null : cat.key,
                                            page: 1,
                                        })
                                    }
                                    className={`px-3.5 sm:px-4 py-2 rounded-pill text-body-sm font-medium transition-all ${activeCategory === cat.key
                                        ? 'bg-white text-primary-700 shadow-card'
                                        : 'bg-white/10 backdrop-blur-sm text-white/90 border border-white/20 hover:bg-white/20 hover:border-white/30'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Loading overlay */}
            <div className={`transition-opacity duration-200 ${isPending ? 'opacity-60' : ''}`}>
                {/* Featured post (page 1 only) */}
                {featuredPost && page === 1 && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                        <FeaturedCard post={featuredPost} locale={locale} t={t} />
                    </section>
                )}

                {/* Posts grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-16 sm:pb-20">
                    {regularPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {regularPosts.map((post) => (
                                <PostCard key={post.id} post={post} locale={locale} t={t} />
                            ))}
                        </div>
                    ) : (
                        !featuredPost && (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-h3 font-heading text-ink mb-2">{t.noResults}</h3>
                                <p className="text-body text-subtle max-w-md mx-auto">{t.noResultsSub}</p>
                            </div>
                        )
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-12">
                            <button
                                onClick={() => navigate({ page: page - 1 })}
                                disabled={page <= 1}
                                className="px-5 py-2.5 rounded-card text-body-sm font-medium bg-white border border-border-light text-muted hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {t.prev}
                            </button>
                            <span className="text-body-sm text-subtle px-3">
                                {page} {t.pageOf} {totalPages}
                            </span>
                            <button
                                onClick={() => navigate({ page: page + 1 })}
                                disabled={page >= totalPages}
                                className="px-5 py-2.5 rounded-card text-body-sm font-medium bg-white border border-border-light text-muted hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {t.next}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// ============================================
// Sub-components
// ============================================

function FeaturedCard({
    post,
    locale,
    t,
}: {
    post: InsightPostCard;
    locale: string;
    t: Record<string, string>;
}) {
    return (
        <Link
            href={`/${locale}/insights/${post.slug}`}
            className="group block relative overflow-hidden rounded-card-lg bg-white shadow-card hover:shadow-card-hover transition-all duration-300"
        >
            <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-primary-50">
                    {post.coverImageUrl ? (
                        <Image
                            src={post.coverImageUrl}
                            alt={post.coverImageAlt || post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
                            <svg className="w-16 h-16 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                    )}
                    {/* Featured badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary-600 text-white text-caption font-semibold rounded-pill shadow-button">
                            {t.featured}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    {post.categoryName && (
                        <span className="text-caption font-semibold text-primary-600 uppercase tracking-wider mb-3">
                            {post.categoryName}
                        </span>
                    )}
                    <h2 className="text-h1 sm:text-display-sm font-heading text-ink mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                    <p className="text-body text-subtle mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-caption text-subtle">
                        {post.publishedAt && (
                            <time dateTime={new Date(post.publishedAt).toISOString()}>
                                {new Date(post.publishedAt).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </time>
                        )}
                        {post.readTimeMinutes && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-border-subtle" />
                                <span>{post.readTimeMinutes} {t.minRead}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function PostCard({
    post,
    locale,
    t,
}: {
    post: InsightPostCard;
    locale: string;
    t: Record<string, string>;
}) {
    return (
        <Link
            href={`/${locale}/insights/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card hover:shadow-card-hover transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-primary-50">
                {post.coverImageUrl ? (
                    <Image
                        src={post.coverImageUrl}
                        alt={post.coverImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
                        <svg className="w-12 h-12 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                )}
                {post.categoryName && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-primary-700 text-caption font-semibold rounded-pill">
                            {post.categoryName}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 sm:p-6">
                <h3 className="text-h3 font-heading text-ink mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-body-sm text-subtle mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-caption text-subtle">
                        {post.publishedAt && (
                            <time dateTime={new Date(post.publishedAt).toISOString()}>
                                {new Date(post.publishedAt).toLocaleDateString(locale, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </time>
                        )}
                        {post.readTimeMinutes && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-border-subtle" />
                                <span>{post.readTimeMinutes} {t.minRead}</span>
                            </>
                        )}
                    </div>
                    <span className="text-primary-600 text-body-sm font-medium group-hover:translate-x-0.5 transition-transform">
                        →
                    </span>
                </div>
            </div>
        </Link>
    );
}
