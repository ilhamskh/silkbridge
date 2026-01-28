'use client';

import { useState } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
}

interface AdminTabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'default' | 'pills';
}

export function AdminTabs({ tabs, activeTab, onChange, variant = 'default' }: AdminTabsProps) {
    if (variant === 'pills') {
        return (
            <div className="inline-flex items-center gap-1 p-1 bg-surface rounded-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                            transition-all duration-200
                            ${activeTab === tab.id
                                ? 'bg-white text-ink shadow-sm'
                                : 'text-muted hover:text-ink'
                            }
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.badge !== undefined && (
                            <span className={`
                                inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                                text-xs font-semibold rounded-full
                                ${activeTab === tab.id
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-slate-100 text-muted'
                                }
                            `}>
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="border-b border-border-light">
            <nav className="flex gap-8" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
                            relative flex items-center gap-2 py-4 text-sm font-medium
                            transition-colors duration-200
                            ${activeTab === tab.id
                                ? 'text-primary-600'
                                : 'text-muted hover:text-ink'
                            }
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.badge !== undefined && (
                            <span className={`
                                inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                                text-xs font-semibold rounded-full
                                ${activeTab === tab.id
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-slate-100 text-muted'
                                }
                            `}>
                                {tab.badge}
                            </span>
                        )}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}

// Tab Content wrapper for consistent spacing
export function AdminTabContent({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`pt-6 ${className}`}>
            {children}
        </div>
    );
}
