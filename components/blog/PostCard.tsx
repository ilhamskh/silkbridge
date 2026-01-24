'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/content/posts';

interface PostCardProps {
    post: Post;
    variant?: 'featured' | 'compact' | 'default';
    priority?: boolean;
}

export function PostCard({ post, variant = 'default', priority = false }: PostCardProps) {
    const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    if (variant === 'featured') {
        return (
            <Link href={`/market-insights/${post.slug}`} className="group block">
                <motion.article
                    className="relative h-full min-h-[400px] md:min-h-[480px] rounded-2xl overflow-hidden"
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={post.coverImage}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={priority}
                        />
                        {/* Blue overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/60 to-primary-900/20" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                        {/* Category */}
                        <span className="inline-flex self-start px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-white/20 backdrop-blur-sm text-white rounded-full mb-4">
                            {post.category}
                        </span>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-white mb-3 leading-tight">
                            <span className="bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat bg-left-bottom transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
                                {post.title}
                            </span>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
                            {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-white/70 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary-400/30 flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">
                                        {post.author.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <span>{post.author.name}</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-white/50" />
                            <time dateTime={post.publishedAt}>{formattedDate}</time>
                            <span className="w-1 h-1 rounded-full bg-white/50" />
                            <span>{post.readingTime}</span>
                        </div>
                    </div>
                </motion.article>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link href={`/market-insights/${post.slug}`} className="group block">
                <motion.article
                    className="flex gap-4 p-4 rounded-xl bg-white hover:bg-primary-50/50 transition-colors"
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src={post.coverImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                        />
                        <div className="absolute inset-0 bg-primary-900/10" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                            {post.category}
                        </span>
                        <h4 className="text-sm md:text-base font-semibold text-ink mt-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
                            {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                            <time dateTime={post.publishedAt}>{formattedDate}</time>
                            <span>·</span>
                            <span>{post.readingTime}</span>
                        </div>
                    </div>
                </motion.article>
            </Link>
        );
    }

    // Default variant
    return (
        <Link href={`/market-insights/${post.slug}`} className="group block h-full">
            <motion.article
                className="h-full bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-shadow duration-300"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent" />

                    {/* Category badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-white/95 backdrop-blur-sm text-primary-700 rounded-full">
                        {post.category}
                    </span>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-display font-semibold text-ink mb-2 leading-snug line-clamp-2">
                        <span className="bg-gradient-to-r from-primary-600 to-primary-600 bg-[length:0%_2px] bg-no-repeat bg-left-bottom transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
                            {post.title}
                        </span>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-700">
                                    {post.author.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-ink">{post.author.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted">
                            <time dateTime={post.publishedAt}>{formattedDate}</time>
                            <span>·</span>
                            <span>{post.readingTime}</span>
                        </div>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}
