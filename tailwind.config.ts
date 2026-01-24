import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    300: '#6DA0D2',
                    400: '#4F8BCE',
                    500: '#3879C5',
                    600: '#2F68BB',
                    700: '#2953AA',
                    800: '#274CA3',
                    900: '#1E3A7A',
                },
                ink: '#0B1220',
                muted: '#334155',
                surface: '#F7FAFF',
                'border-light': '#E6EEF8',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                heading: ['var(--font-sora)', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
                'display-sm': ['2.125rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
                'h1': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
                'h2': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
                'h3': ['1.375rem', { lineHeight: '1.4' }],
                'body': ['1rem', { lineHeight: '1.625' }],
                'body-sm': ['0.875rem', { lineHeight: '1.6' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                'card': '1rem',
                'pill': '9999px',
            },
            boxShadow: {
                'card': '0 4px 24px -4px rgba(47, 104, 187, 0.08)',
                'card-hover': '0 12px 40px -8px rgba(47, 104, 187, 0.15)',
                'button': '0 2px 8px -2px rgba(47, 104, 187, 0.25)',
                'glow': '0 0 60px 20px rgba(56, 121, 197, 0.15)',
            },
            backgroundImage: {
                'noise': "url('/noise.svg')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, rgba(39, 76, 163, 0.95) 0%, rgba(47, 104, 187, 0.85) 50%, rgba(56, 121, 197, 0.9) 100%)',
            },
            animation: {
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
