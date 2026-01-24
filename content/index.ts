import type { Locale } from '@/i18n/config';
import type { Post, Category } from './types';
import { posts as postsEn } from './posts.en';
import { posts as postsAz } from './posts.az';
import { categories, categoryTranslations, popularTags } from './types';

const postsByLocale: Record<Locale, Post[]> = {
    en: postsEn,
    az: postsAz,
};

export function getPosts(locale: Locale): Post[] {
    return postsByLocale[locale] || postsByLocale.en;
}

export function getPostBySlug(slug: string, locale: Locale): Post | undefined {
    const posts = getPosts(locale);
    return posts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(locale: Locale): Post[] {
    return getPosts(locale).filter((post) => post.featured);
}

export function getPostsByCategory(category: Category, locale: Locale): Post[] {
    return getPosts(locale).filter((post) => post.category === category);
}

export function getPostsByTag(tag: string, locale: Locale): Post[] {
    return getPosts(locale).filter((post) => post.tags.includes(tag));
}

export function getRelatedPosts(currentSlug: string, limit: number, locale: Locale): Post[] {
    const posts = getPosts(locale);
    const currentPost = getPostBySlug(currentSlug, locale);
    if (!currentPost) return [];

    return posts
        .filter((post) => post.slug !== currentSlug)
        .filter(
            (post) =>
                post.category === currentPost.category ||
                post.tags.some((tag) => currentPost.tags.includes(tag))
        )
        .slice(0, limit);
}

export function getLocalizedCategory(category: Category, locale: Locale): string {
    return categoryTranslations[category][locale];
}

export function getPopularTags(locale: Locale): string[] {
    return popularTags[locale];
}

export function getAllSlugs(): string[] {
    // Slugs are the same across locales
    return postsEn.map((post) => post.slug);
}

export { categories };
export type { Post, Category, ContentBlock } from './types';
