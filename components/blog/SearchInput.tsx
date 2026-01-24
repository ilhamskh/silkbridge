'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchInputProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

export function SearchInput({ placeholder = 'Search insights...', onSearch }: SearchInputProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(query);
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
            <motion.div
                animate={{
                    boxShadow: isFocused
                        ? '0 4px 20px rgba(47, 104, 187, 0.15)'
                        : '0 2px 8px rgba(47, 104, 187, 0.08)',
                }}
                className="relative"
            >
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="
                        w-full pl-12 pr-4 py-3.5 
                        bg-white border border-primary-200 rounded-xl
                        text-ink placeholder:text-muted
                        focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
                        transition-all duration-200
                    "
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </motion.div>
        </form>
    );
}
