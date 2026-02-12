'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteInsightPost } from '@/lib/insights/actions';
import { AdminIcon } from '../ui/AdminIcon';

interface Post {
    id: string;
    slug: string;
    featured: boolean;
    category: {
        key: string;
        translations: Array<{ localeCode: string; name: string }>;
    } | null;
    translations: Array<{
        locale: string;
        status: string;
        title: string;
        publishedAt: Date | null;
        updatedAt: Date;
    }>;
    updatedAt: Date;
}

interface Category {
    id: string;
    key: string;
    translations: Array<{ localeCode: string; name: string }>;
}

interface Props {
    posts: Post[];
    categories: Category[];
}

const LOCALES = ['en', 'az', 'ru'] as const;

export function InsightsAdminList({ posts, categories }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const getTitle = (post: Post) => {
        const enT = post.translations.find((t) => t.locale === 'en');
        return enT?.title || post.translations[0]?.title || 'Untitled';
    };

    const getCategoryName = (post: Post) => {
        if (!post.category) return '—';
        const enT = post.category.translations.find((t) => t.localeCode === 'en');
        return enT?.name || post.category.key;
    };

    const filtered = posts.filter((post) => {
        // Search
        if (search) {
            const q = search.toLowerCase();
            const matches = post.translations.some((t) => t.title.toLowerCase().includes(q)) || post.slug.includes(q);
            if (!matches) return false;
        }

        // Status filter
        if (filterStatus !== 'all') {
            const hasStatus = post.translations.some((t) => t.status === filterStatus);
            if (!hasStatus) return false;
        }

        // Category filter
        if (filterCategory !== 'all') {
            if (post.category?.key !== filterCategory) return false;
        }

        return true;
    });

    async function handleDelete(postId: string, title: string) {
        if (!confirm(`Delete "${title}"? This is a soft delete — the post won't be visible publicly.`)) return;
        startTransition(async () => {
            await deleteInsightPost(postId);
            router.refresh();
        });
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Insights</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage blog posts and articles</p>
                </div>
                <Link
                    href="/admin/insights/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <AdminIcon name="plus" className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl border border-gray-200 p-4">
                {/* Search */}
                <div className="relative flex-1">
                    <AdminIcon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search posts..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                {/* Status */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                    <option value="all">All Statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                </select>
                {/* Category */}
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => {
                        const name = cat.translations.find((t) => t.localeCode === 'en')?.name || cat.key;
                        return (
                            <option key={cat.key} value={cat.key}>{name}</option>
                        );
                    })}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <AdminIcon name="pages" className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No insight posts found</p>
                        <Link
                            href="/admin/insights/new"
                            className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <AdminIcon name="plus" className="w-3.5 h-3.5" />
                            Create your first post
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                                    <th className="text-center px-4 py-3 font-medium text-gray-600">
                                        <span className="inline-flex gap-2">
                                            {LOCALES.map((l) => (
                                                <span key={l} className="w-8 text-center uppercase">{l}</span>
                                            ))}
                                        </span>
                                    </th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Updated</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((post) => {
                                    const title = getTitle(post);
                                    return (
                                        <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/insights/${post.id}?locale=en`}
                                                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                                                    >
                                                        {title}
                                                    </Link>
                                                    {post.featured && (
                                                        <span className="shrink-0 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">/{post.slug}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {getCategoryName(post)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">
                                                    {LOCALES.map((locale) => {
                                                        const t = post.translations.find((tr) => tr.locale === locale);
                                                        return (
                                                            <Link
                                                                key={locale}
                                                                href={`/admin/insights/${post.id}?locale=${locale}`}
                                                                className={`w-8 h-6 flex items-center justify-center rounded text-xs font-medium transition-colors ${t?.status === 'PUBLISHED'
                                                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                        : t
                                                                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                                    }`}
                                                                title={`${locale.toUpperCase()}: ${t?.status || 'Missing'}`}
                                                            >
                                                                {locale.toUpperCase()}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                                {new Date(post.updatedAt).toLocaleDateString('en', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/insights/${post.id}?locale=en`}
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <AdminIcon name="edit" className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(post.id, title)}
                                                        disabled={isPending}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        <AdminIcon name="trash" className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
