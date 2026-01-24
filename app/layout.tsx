import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Silkbridge International',
    description: 'Connecting Markets & Health Tourism Across Borders',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
