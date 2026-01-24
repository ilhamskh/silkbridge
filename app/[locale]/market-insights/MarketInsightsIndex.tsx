'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getPosts, getFeaturedPosts } from '@/content';
import { categoryTranslations, type Post } from '@/content/types';
import { Icons } from '@/components/ui/Icons';

const categories = ['all', 'pharma', 'market-entry', 'health-tourism', 'wellness'] as const;

// Map filter categories to Post category values
const categoryMap: Record<string, string> = {
    'all': 'all',
    'pharma': 'Pharma',
    'market-entry': 'Market Entry',
    'health-tourism': 'Health Tourism',
    'wellness': 'Wellness',
};

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
    const t = useTranslations('blog');
    const locale = useLocale();

    return (
        <Link href={`/market-insights/${post.slug}`}>
            <motion.article
                whileHover={{ y: -4 }}
                className={`group relative bg-white rounded-card border border-border-light overflow-hidden
                    hover:shadow-card-hover transition-all duration-300 ${featured ? 'h-full' : ''}`}
            >
                {/* Image */}
                <div className={`relative overflow-hidden ${featured ? 'h-48 lg:h-64' : 'h-48'}`}>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    {post.featured && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                            {t('featured')}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-muted mb-3">
                        <span className="text-primary-600 font-medium">
                            {categoryTranslations[post.category]?.[locale as 'en' | 'az'] || post.category}
                        </span>
                        <span>•</span>
                        <span>{t('readingTime', { minutes: post.readingTimeMinutes })}</span>
                    </div>

                    <h3 className={`font-heading text-ink group-hover:text-primary-600 transition-colors
                        ${featured ? 'text-h2' : 'text-h3'}`}>
                        {post.title}
                    </h3>

                    <p className="mt-3 text-muted text-body-sm line-clamp-2">
                        {post.excerpt}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-ink">{post.author.name}</p>
                            <p className="text-muted text-xs">{post.publishedAt}</p>
                        </div>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}

export default function MarketInsightsIndex() {
    const t = useTranslations('blog');
    const locale = useLocale();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const allPosts = getPosts(locale as 'en' | 'az');
    const featuredPosts = getFeaturedPosts(locale as 'en' | 'az');

    const filteredPosts = useMemo(() => {
        return allPosts.filter(post => {
            const matchesCategory = selectedCategory === 'all' || post.category === categoryMap[selectedCategory];
            const matchesSearch = searchQuery === '' ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [allPosts, selectedCategory, searchQuery]);

    return (
        <div className="pt-24 lg:pt-32">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block text-primary-600 text-sm font-medium tracking-wide uppercase mb-4">
                            {t('eyebrow')}
                        </span>
                        <h1 className="font-heading text-display-sm lg:text-display text-ink">
                            {t('pageTitle')}
                        </h1>
                        <p className="mt-6 text-xl text-muted leading-relaxed">
                            {t('pageDescription')}
                        </p>

                        {/* Search */}
                        <div className="mt-8 relative">
                            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border-light bg-white
                                    focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                                    text-ink placeholder:text-muted transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
                <section className="py-12 bg-white border-b border-border-light">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-heading text-h2 text-ink mb-8">{t('featuredInsights')}</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {featuredPosts.slice(0, 2).map((post) => (
                                <PostCard key={post.slug} post={post} featured />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                    ${selectedCategory === category
                                        ? 'bg-primary-600 text-white shadow-button'
                                        : 'bg-surface text-muted hover:bg-primary-50 hover:text-primary-700'
                                    }`}
                            >
                                {t(`categories.${category}`)}
                            </button>
                        ))}
                    </div>

                    {/* Posts Grid */}
                    {filteredPosts.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-heading text-h2 text-ink">{t('latestInsights')}</h2>
                                <span className="text-sm text-muted">
                                    {t('articleCount', { count: filteredPosts.length })}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPosts.map((post) => (
                                    <PostCard key={post.slug} post={post} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <Icons.search className="w-12 h-12 text-muted mx-auto mb-4" />
                            <h3 className="font-heading text-h3 text-ink">{t('noArticlesFound')}</h3>
                            <p className="mt-2 text-muted">{t('noArticlesDescription')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-heading text-h1 text-white">{t('newsletter.title')}</h2>
                    <p className="mt-4 text-white/80 text-lg">{t('newsletter.description')}</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder={t('newsletter.placeholder')}
                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white
                                placeholder:text-white/50 focus:outline-none focus:border-white/40"
                        />
                        <button className="px-6 py-3 bg-white text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors">
                            {t('newsletter.subscribe')}
                        </button>
                    </div>
                    <p className="mt-4 text-white/60 text-sm">{t('newsletter.privacyNote')}</p>
                </div>
            </section>
        </div>
    );
}
