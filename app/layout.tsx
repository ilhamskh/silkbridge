import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://silkbridge.az';

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'Silkbridge International',
        template: '%s | Silkbridge International',
    },
    description: 'Health Tourism, Pharmaceutical Market Entry & Tourism Services in Azerbaijan.',
    openGraph: {
        type: 'website',
        siteName: 'Silkbridge International',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// Root layout MUST have html and body tags (Next.js requirement)
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
