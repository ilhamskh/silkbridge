'use client';

import * as React from 'react';

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className="w-full">{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
    return (
        <div
            role="tablist"
            className={`inline-flex items-center rounded-lg p-1 ${className}`}
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error('TabsTrigger must be used within Tabs');
    }

    const isActive = context.value === value;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            onClick={() => context.onValueChange(value)}
            className={`
                inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                ${isActive
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }
                ${className}
            `}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error('TabsContent must be used within Tabs');
    }

    if (context.value !== value) {
        return null;
    }

    return (
        <div role="tabpanel" className={className}>
            {children}
        </div>
    );
}
