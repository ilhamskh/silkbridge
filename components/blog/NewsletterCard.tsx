'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function NewsletterCard() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Static - just show success state
        setIsSubmitted(true);
    };

    return (
        <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl text-white">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>

            <h3 className="text-lg font-semibold mb-2">Market Intelligence</h3>
            <p className="text-white/80 text-sm mb-4">
                Get our quarterly insights on pharmaceutical markets, health tourism trends, and regulatory updates.
            </p>

            {isSubmitted ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-white/20 rounded-xl text-center"
                >
                    <svg className="w-8 h-8 mx-auto text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium">Thank you for subscribing!</p>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="
                            w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
                            text-white placeholder:text-white/50
                            focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent
                            text-sm
                        "
                    />
                    <button
                        type="submit"
                        className="
                            w-full px-4 py-3 bg-white text-primary-700 font-semibold rounded-xl
                            hover:bg-primary-50 transition-colors
                            focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600
                            text-sm
                        "
                    >
                        Subscribe
                    </button>
                </form>
            )}

            <p className="text-xs text-white/60 mt-3">
                No spam. Unsubscribe anytime.
            </p>
        </div>
    );
}
