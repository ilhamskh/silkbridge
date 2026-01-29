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
                // === SILKBRIDGE DESIGN TOKENS ===
                // Primary Blue Scale (monochrome-blue only)
                primary: {
                    50: '#F0F6FF',
                    100: '#E1EDFF',
                    200: '#C3DBFF',
                    300: '#6DA0D2',
                    400: '#4F8BCE',
                    500: '#3879C5',
                    600: '#2F68BB',  // Main primary
                    700: '#2953AA',
                    800: '#274CA3',  // Deep primary
                    900: '#1E3A7A',
                    950: '#0B1220',  // Darkest
                },
                // Semantic colors
                ink: '#0B1220',           // Primary text
                muted: '#334155',         // Secondary text
                subtle: '#64748B',        // Tertiary text
                surface: '#F7FAFF',       // Page background
                'surface-elevated': '#FFFFFF',  // Cards/elevated surfaces
                'border-light': '#E6EEF8',     // Light borders
                'border-subtle': '#CBD5E1',    // Subtle borders
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['var(--font-manrope)', 'system-ui', '-apple-system', 'sans-serif'],
            },
            fontSize: {
                // Display sizes (heroes, page titles)
                'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
                'display': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
                'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
                // Headings
                'h1': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
                'h2': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
                'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
                'h4': ['1.125rem', { lineHeight: '1.45', fontWeight: '600' }],
                // Body
                'body-lg': ['1.125rem', { lineHeight: '1.7' }],
                'body': ['1rem', { lineHeight: '1.7' }],
                'body-sm': ['0.875rem', { lineHeight: '1.6' }],
                'caption': ['0.75rem', { lineHeight: '1.5' }],
            },
            // Consistent spacing scale (16/24/32/48/64/80/96)
            spacing: {
                '18': '4.5rem',   // 72px
                '22': '5.5rem',   // 88px
                '30': '7.5rem',   // 120px
            },
            maxWidth: {
                'prose': '65ch',       // Optimal reading width
                'prose-wide': '75ch',  // Wider reading width
            },
            borderRadius: {
                'card': '1rem',        // 16px - cards
                'card-lg': '1.25rem',  // 20px - large cards
                'pill': '9999px',      // Full round
            },
            boxShadow: {
                // Blue-tinted shadows for consistency
                'card': '0 4px 24px -4px rgba(47, 104, 187, 0.06)',
                'card-hover': '0 12px 40px -8px rgba(47, 104, 187, 0.12)',
                'button': '0 2px 8px -2px rgba(47, 104, 187, 0.2)',
                'button-hover': '0 4px 16px -4px rgba(47, 104, 187, 0.3)',
                'elevated': '0 8px 32px -8px rgba(47, 104, 187, 0.1)',
                'glow': '0 0 60px 20px rgba(56, 121, 197, 0.12)',
                'inner-subtle': 'inset 0 1px 2px rgba(47, 104, 187, 0.05)',
            },
            backgroundImage: {
                'noise': "url('/noise.svg')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, rgba(39, 76, 163, 0.95) 0%, rgba(47, 104, 187, 0.85) 50%, rgba(56, 121, 197, 0.9) 100%)',
                'surface-gradient': 'linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 100%)',
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease-out forwards',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'slide-in-right': 'slideInRight 0.4s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-8px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
};

export default config;
