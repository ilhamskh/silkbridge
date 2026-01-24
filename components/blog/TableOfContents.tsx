'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContentBlock } from '@/content/posts';

interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

interface TableOfContentsProps {
    content: ContentBlock[];
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);

    // Extract headings from content
    const headings: TocItem[] = content
        .filter((block): block is { type: 'heading'; level: 2 | 3; text: string } =>
            block.type === 'heading'
        )
        .map((block) => ({
            id: block.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            text: block.text,
            level: block.level,
        }));

    const handleScroll = useCallback(() => {
        const headingElements = headings.map((h) => document.getElementById(h.id));
        const scrollPosition = window.scrollY + 120;

        let currentActiveId = '';
        for (let i = headingElements.length - 1; i >= 0; i--) {
            const element = headingElements[i];
            if (element && element.offsetTop <= scrollPosition) {
                currentActiveId = headings[i].id;
                break;
            }
        }

        setActiveId(currentActiveId);
    }, [headings]);

    useEffect(() => {
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            setIsOpen(false);
        }
    };

    if (headings.length === 0) return null;

    return (
        <>
            {/* Desktop TOC - Sticky Sidebar */}
            <nav
                className="hidden xl:block sticky top-32 w-64 max-h-[calc(100vh-160px)] overflow-y-auto"
                aria-label="Table of contents"
            >
                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-4">
                    Contents
                </h2>
                <ul className="space-y-1">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <button
                                onClick={() => scrollToHeading(heading.id)}
                                className={`
                                    w-full text-left py-2 text-sm transition-all duration-200
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded
                                    ${heading.level === 3 ? 'pl-4' : 'pl-0'}
                                    ${activeId === heading.id
                                        ? 'text-primary-700 font-medium'
                                        : 'text-muted hover:text-primary-600'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    {activeId === heading.id && (
                                        <motion.span
                                            layoutId="toc-indicator"
                                            className="w-1 h-4 bg-primary-500 rounded-full"
                                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                    <span className={activeId !== heading.id ? 'ml-3' : ''}>
                                        {heading.text}
                                    </span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile TOC - Collapsible Button */}
            <div className="xl:hidden mb-8">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                        w-full flex items-center justify-between px-4 py-3
                        bg-primary-50 rounded-xl text-primary-700 font-medium
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                    "
                    aria-expanded={isOpen}
                    aria-controls="mobile-toc"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Contents
                    </span>
                    <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            id="mobile-toc"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <ul className="mt-2 p-4 bg-white rounded-xl border border-primary-100 space-y-1">
                                {headings.map((heading) => (
                                    <li key={heading.id}>
                                        <button
                                            onClick={() => scrollToHeading(heading.id)}
                                            className={`
                                                w-full text-left py-2 px-3 text-sm rounded-lg transition-colors
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                                                ${heading.level === 3 ? 'pl-6' : 'pl-3'}
                                                ${activeId === heading.id
                                                    ? 'bg-primary-100 text-primary-700 font-medium'
                                                    : 'text-muted hover:bg-primary-50 hover:text-primary-600'
                                                }
                                            `}
                                        >
                                            {heading.text}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
