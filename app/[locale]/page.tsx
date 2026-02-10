import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPageContent } from '@/lib/blocks/content';
import BlockRenderer from '@/lib/blocks/BlockRenderer';
import type { ContentBlock } from '@/lib/blocks/schema';

// Force dynamic rendering to see admin changes immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch page content from database
    const pageContent = await getPageContent('home', locale as 'en' | 'az');

    if (!pageContent) {
        notFound();
    }

    return <BlockRenderer blocks={pageContent.blocks as ContentBlock[]} />;
}
