'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    showCharCount?: boolean;
    maxLength?: number;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
    ({ label, helperText, error, showCharCount, maxLength, className = '', value, ...props }, ref) => {
        const charCount = typeof value === 'string' ? value.length : 0;
        const isOverLimit = maxLength && charCount > maxLength;

        return (
            <div className="space-y-1.5">
                {label && (
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-ink">
                            {label}
                            {props.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                        {showCharCount && maxLength && (
                            <span className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : 'text-muted'}`}>
                                {charCount}/{maxLength}
                            </span>
                        )}
                    </div>
                )}
                <input
                    ref={ref}
                    value={value}
                    maxLength={maxLength}
                    className={`
                        w-full h-10 px-3.5
                        text-sm text-ink placeholder:text-muted/60
                        bg-white border rounded-xl
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400
                        disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-60
                        ${error
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-400/30'
                            : 'border-border-light hover:border-primary-200'
                        }
                        ${className}
                    `}
                    {...props}
                />
                {(helperText || error) && (
                    <p className={`text-xs ${error ? 'text-red-500' : 'text-muted'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

AdminInput.displayName = 'AdminInput';
