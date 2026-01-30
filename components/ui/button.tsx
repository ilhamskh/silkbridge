'use client';
/// 
import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center font-medium transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:pointer-events-none
    `;

        const variants = {
            primary: `
        bg-primary-600 text-white
        hover:bg-primary-700 active:bg-primary-800
        shadow-button hover:shadow-card-hover
      `,
            secondary: `
        bg-white text-primary-700 border border-primary-200
        hover:bg-primary-50 hover:border-primary-300 active:bg-primary-100
      `,
            ghost: `
        bg-transparent text-white border border-white/30
        hover:bg-white/10 hover:border-white/50 active:bg-white/20
      `,
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm rounded-lg',
            md: 'px-6 py-3 text-base rounded-xl',
            lg: 'px-8 py-4 text-base rounded-xl',
        };

        return (
            <motion.button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
