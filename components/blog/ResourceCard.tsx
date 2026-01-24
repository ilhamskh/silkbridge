'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function ResourceCard() {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="p-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100"
        >
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>

            <h3 className="text-lg font-semibold text-ink mb-2">
                Market Entry Guide
            </h3>
            <p className="text-sm text-muted mb-4">
                Download our comprehensive guide to pharmaceutical market entry in Southeast Asia and the Middle East.
            </p>

            <Link
                href="/contact"
                className="
                    inline-flex items-center gap-2 text-sm font-semibold text-primary-600
                    hover:text-primary-700 transition-colors
                    focus:outline-none focus-visible:underline
                "
            >
                <span>Request Access</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </motion.div>
    );
}
