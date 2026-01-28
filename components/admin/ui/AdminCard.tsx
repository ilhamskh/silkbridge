'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface AdminCardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'interactive' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const variantStyles = {
    default: 'bg-white border border-border-light',
    elevated: 'bg-white shadow-card border border-border-light/50',
    interactive: 'bg-white border border-border-light hover:border-primary-200 hover:shadow-card cursor-pointer',
    outlined: 'bg-transparent border-2 border-dashed border-border-light',
};

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const AdminCard = forwardRef<HTMLDivElement, AdminCardProps>(
    ({ variant = 'default', padding = 'md', hover = false, className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
                    rounded-2xl transition-all duration-200
                    ${variantStyles[variant]}
                    ${paddingStyles[padding]}
                    ${hover ? 'hover:shadow-card-hover hover:border-primary-200' : ''}
                    ${className}
                `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

AdminCard.displayName = 'AdminCard';

// Card sub-components for consistent layouts
export function AdminCardHeader({
    title,
    description,
    action,
    className = ''
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex items-start justify-between gap-4 ${className}`}>
            <div>
                <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-muted">{description}</p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}

export function AdminCardContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
    return <div className={`mt-4 ${className}`}>{children}</div>;
}

export function AdminCardFooter({ className = '', children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`mt-6 pt-4 border-t border-border-light flex items-center justify-end gap-3 ${className}`}>
            {children}
        </div>
    );
}
