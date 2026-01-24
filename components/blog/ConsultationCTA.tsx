'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function ConsultationCTA() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 md:mt-24"
        >
            <div className="relative p-8 md:p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="1.5" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#cta-pattern)" />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
                        Ready to Enter New Markets?
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                        Our team of market specialists can help you navigate regulatory requirements,
                        identify partnership opportunities, and develop winning market entry strategies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/contact"
                            className="
                                inline-flex items-center justify-center gap-2 px-6 py-3.5
                                bg-white text-primary-700 font-semibold rounded-xl
                                hover:bg-primary-50 transition-colors
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700
                            "
                        >
                            <span>Book a Consultation</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            href="/services"
                            className="
                                inline-flex items-center justify-center gap-2 px-6 py-3.5
                                bg-white/10 text-white font-semibold rounded-xl border border-white/20
                                hover:bg-white/20 transition-colors
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700
                            "
                        >
                            Explore Services
                        </Link>
                    </div>
                </div>

                {/* Decorative element */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl" />
            </div>
        </motion.section>
    );
}
