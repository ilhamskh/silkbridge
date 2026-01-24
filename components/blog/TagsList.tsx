'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { popularTags } from '@/content/posts';

interface TagsListProps {
    tags?: string[];
    title?: string;
}

export function TagsList({ tags = popularTags, title = 'Popular Topics' }: TagsListProps) {
    return (
        <div className="p-6 bg-white rounded-2xl border border-primary-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
                {title}
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                        <Link
                            href={`/market-insights?tag=${encodeURIComponent(tag)}`}
                            className="
                                inline-flex px-3 py-1.5 text-sm
                                bg-primary-50 text-primary-700 rounded-full
                                hover:bg-primary-100 hover:text-primary-800
                                transition-colors duration-200
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                            "
                        >
                            {tag}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
