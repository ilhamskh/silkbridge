'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
        bg-gradient-to-b from-primary-500 to-primary-600 
        text-white font-medium
        shadow-button hover:shadow-card
        hover:from-primary-600 hover:to-primary-700
        active:from-primary-700 active:to-primary-800
        focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
    `,
    secondary: `
        bg-white border border-border-light
        text-ink font-medium
        shadow-sm hover:shadow-card
        hover:bg-surface hover:border-primary-200
        active:bg-primary-50
        focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
    `,
    ghost: `
        bg-transparent
        text-muted font-medium
        hover:bg-surface hover:text-ink
        active:bg-primary-50
        focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
    `,
    danger: `
        bg-gradient-to-b from-red-500 to-red-600 
        text-white font-medium
        shadow-sm hover:shadow-md
        hover:from-red-600 hover:to-red-700
        active:from-red-700 active:to-red-800
        focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
    `,
    success: `
        bg-gradient-to-b from-emerald-500 to-emerald-600 
        text-white font-medium
        shadow-sm hover:shadow-md
        hover:from-emerald-600 hover:to-emerald-700
        active:from-emerald-700 active:to-emerald-800
        focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2
    `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
};

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        className = '',
        disabled,
        children,
        ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
                    inline-flex items-center justify-center
                    transition-all duration-200 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                    ${variantStyles[variant]}
                    ${sizeStyles[size]}
                    ${className}
                `}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : leftIcon ? (
                    <span className="flex-shrink-0">{leftIcon}</span>
                ) : null}
                {children}
                {rightIcon && !isLoading && (
                    <span className="flex-shrink-0">{rightIcon}</span>
                )}
            </button>
        );
    }
);

AdminButton.displayName = 'AdminButton';
