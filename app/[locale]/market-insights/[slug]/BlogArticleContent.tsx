'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { type Post, type ContentBlock as ContentBlockType, categoryTranslations } from '@/content/types';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/button';

interface Props {
    post: Post;
    relatedPosts: Post[];
}

function ContentBlock({ block }: { block: ContentBlockType }) {
    switch (block.type) {
        case 'heading':
            const HeadingTag = block.level === 2 ? 'h2' : 'h3';
            return (
                <HeadingTag
                    id={block.text.toLowerCase().replace(/\s+/g, '-')}
                    className={`font-heading text-ink mt-12 mb-4 scroll-mt-24 ${block.level === 2 ? 'text-h2' : 'text-h3'}`}
                >
                    {block.text}
                </HeadingTag>
            );
        case 'paragraph':
            return <p className="text-muted leading-relaxed mb-6">{block.text}</p>;
        case 'bullets':
            return (
                <ul className="space-y-3 mb-6 ml-6">
                    {block.items?.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                            <span className="text-muted">{item}</span>
                        </li>
                    ))}
                </ul>
            );
        case 'quote':
            return (
                <blockquote className="border-l-4 border-primary-500 pl-6 py-4 my-8 bg-primary-50/50 rounded-r-xl">
                    <p className="text-ink italic text-lg">{block.text}</p>
                    {block.by && (
                        <cite className="mt-3 block text-muted text-sm not-italic">— {block.by}</cite>
                    )}
                </blockquote>
            );
        case 'callout':
            return (
                <div className="p-6 bg-primary-50 border border-primary-100 rounded-xl my-8">
                    {block.title && <h4 className="font-heading text-h4 text-primary-900 mb-2">{block.title}</h4>}
                    <p className="text-primary-800">{block.text}</p>
                </div>
            );
        case 'stats':
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
                    {block.items?.map((stat, index) => (
                        <div key={index} className="p-4 bg-surface rounded-xl text-center">
                            <p className="text-h2 font-heading text-primary-600">{stat.value}</p>
                            <p className="text-sm text-muted">{stat.label}</p>
                            {stat.note && <p className="text-xs text-muted/70 mt-1">{stat.note}</p>}
                        </div>
                    ))}
                </div>
            );
        case 'image':
            return (
                <figure className="my-8">
                    <div
                        className="w-full h-64 lg:h-80 bg-cover bg-center rounded-xl"
                        style={{ backgroundImage: `url(${block.src})` }}
                        role="img"
                        aria-label={block.alt}
                    />
                    {block.caption && (
                        <figcaption className="mt-2 text-sm text-muted text-center">{block.caption}</figcaption>
                    )}
                </figure>
            );
        case 'divider':
            return <hr className="my-12 border-border-light" />;
        default:
            return null;
    }
}

export default function BlogArticleContent({ post, relatedPosts }: Props) {
    const t = useTranslations('blog');
    const locale = useLocale();

    // Generate table of contents from headings
    const headings = post.content.filter(block => block.type === 'heading');

    return (
        <div className="pt-24 lg:pt-32">
            {/* Hero Section */}
            <section className="py-12 lg:py-16 bg-surface">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-muted mb-6">
                            <Link href="/market-insights" className="hover:text-primary-600 transition-colors">
                                {t('pageTitle')}
                            </Link>
                            <Icons.chevronRight className="w-4 h-4" />
                            <span className="text-primary-600">
                                {categoryTranslations[post.category]?.[locale as 'en' | 'az'] || post.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-heading text-display-sm lg:text-display text-ink">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="mt-6 flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                                    {post.author.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="font-medium text-ink">{post.author.name}</p>
                                    <p className="text-sm text-muted">{post.author.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted">
                                <span className="flex items-center gap-1.5">
                                    <Icons.calendar className="w-4 h-4" />
                                    {post.publishedAt}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Icons.clock className="w-4 h-4" />
                                    {t('readingTime', { minutes: post.readingTimeMinutes })}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Cover Image */}
            <div className="relative h-64 lg:h-96 bg-ink">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            </div>

            {/* Article Content */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Sidebar - Table of Contents */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-32">
                                {headings.length > 0 && (
                                    <div className="p-6 bg-surface rounded-card border border-border-light">
                                        <h3 className="font-heading text-h4 text-ink mb-4">{t('toc.title')}</h3>
                                        <nav className="space-y-2">
                                            {headings.map((heading, index) => (
                                                <a
                                                    key={index}
                                                    href={`#${heading.text?.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="block text-sm text-muted hover:text-primary-600 transition-colors"
                                                >
                                                    {heading.text}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                )}

                                {/* Share */}
                                <div className="mt-6 p-6 bg-surface rounded-card border border-border-light">
                                    <h3 className="font-heading text-h4 text-ink mb-4">{t('share.title')}</h3>
                                    <div className="flex gap-3">
                                        <button className="p-2 rounded-lg bg-white border border-border-light hover:border-primary-200 transition-colors">
                                            <Icons.linkedin className="w-5 h-5 text-muted" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white border border-border-light hover:border-primary-200 transition-colors">
                                            <Icons.twitter className="w-5 h-5 text-muted" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white border border-border-light hover:border-primary-200 transition-colors">
                                            <Icons.email className="w-5 h-5 text-muted" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <article className="lg:col-span-9 max-w-none prose prose-lg">
                            {/* Content Blocks */}
                            <div className="not-prose">
                                {post.content.map((block, index) => (
                                    <ContentBlock key={index} block={block} />
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="mt-12 pt-8 border-t border-border-light not-prose">
                                <h3 className="font-heading text-h4 text-ink mb-4">{t('tags.title')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1.5 bg-surface text-muted text-sm rounded-full border border-border-light"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-16 bg-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-heading text-h1 text-ink mb-8">{t('relatedPosts.title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <Link key={relatedPost.slug} href={`/market-insights/${relatedPost.slug}`}>
                                    <motion.article
                                        whileHover={{ y: -4 }}
                                        className="group bg-white rounded-card border border-border-light overflow-hidden hover:shadow-card-hover transition-all"
                                    >
                                        <div className="h-40 overflow-hidden">
                                            <div
                                                className="h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${relatedPost.coverImage})` }}
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-heading text-h3 text-ink group-hover:text-primary-600 transition-colors line-clamp-2">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-muted">
                                                {t('readingTime', { minutes: relatedPost.readingTimeMinutes })}
                                            </p>
                                        </div>
                                    </motion.article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-ink">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-heading text-h1 text-white">{t('consultation.headline')}</h2>
                    <p className="mt-4 text-white/70 text-lg">{t('consultation.description')}</p>
                    <div className="mt-8">
                        <Link href="/contact">
                            <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                                {t('consultation.cta')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
