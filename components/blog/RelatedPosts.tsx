'use client';

import { motion } from 'framer-motion';
import { PostCard } from './PostCard';
import type { Post } from '@/content/posts';

interface RelatedPostsProps {
    posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    if (posts.length === 0) return null;

    return (
        <section className="mt-16 md:mt-24 pt-12 border-t border-primary-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-ink mb-2">
                    Related Insights
                </h2>
                <p className="text-muted mb-8">
                    Continue exploring our market analysis and industry perspectives.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <PostCard post={post} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
