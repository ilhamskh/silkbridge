'use client';

import { motion } from 'framer-motion';
import { categories } from '@/content/posts';

type Category = (typeof categories)[number] | 'All';

interface CategoryPillsProps {
    selected: Category;
    onChange: (category: Category) => void;
}

export function CategoryPills({ selected, onChange }: CategoryPillsProps) {
    const allCategories: Category[] = ['All', ...categories];

    return (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
            {allCategories.map((category) => {
                const isSelected = selected === category;
                return (
                    <button
                        key={category}
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => onChange(category)}
                        className={`
                            relative px-4 py-2 text-sm font-medium rounded-full
                            transition-colors duration-200
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                            ${isSelected
                                ? 'text-white'
                                : 'text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100'
                            }
                        `}
                    >
                        {isSelected && (
                            <motion.span
                                layoutId="category-pill-bg"
                                className="absolute inset-0 bg-primary-600 rounded-full"
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 35,
                                }}
                            />
                        )}
                        <span className="relative z-10">{category}</span>
                    </button>
                );
            })}
        </div>
    );
}
