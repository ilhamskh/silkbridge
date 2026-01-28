'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';

interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

interface AdminSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    helperText?: string;
    error?: string;
    options: Option[];
    placeholder?: string;
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
    ({ label, helperText, error, options, placeholder, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-ink">
                        {label}
                        {props.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={`
                            w-full h-10 px-3.5 pr-10
                            text-sm text-ink
                            bg-white border rounded-xl
                            appearance-none cursor-pointer
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
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value} disabled={option.disabled}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-4 w-4 text-muted" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                {(helperText || error) && (
                    <p className={`text-xs ${error ? 'text-red-500' : 'text-muted'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

AdminSelect.displayName = 'AdminSelect';
