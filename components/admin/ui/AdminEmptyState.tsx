'use client';

import { AdminButton } from './AdminButton';

interface AdminEmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function AdminEmptyState({
    icon,
    title,
    description,
    action,
    className = '',
}: AdminEmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
            {icon ? (
                <div className="mb-4">{icon}</div>
            ) : (
                <div className="w-16 h-16 mb-4 rounded-2xl bg-surface flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
            )}
            <h3 className="font-heading text-lg font-semibold text-ink mb-1">
                {title}
            </h3>
            <p className="text-sm text-muted max-w-sm mb-6">
                {description}
            </p>
            {action && (
                <AdminButton onClick={action.onClick}>
                    {action.label}
                </AdminButton>
            )}
        </div>
    );
}
