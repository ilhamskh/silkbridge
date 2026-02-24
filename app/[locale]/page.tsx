import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPageContent } from '@/lib/blocks/content';
import ServerBlockRenderer from '@/lib/blocks/ServerBlockRenderer';
import type { ContentBlock } from '@/lib/blocks/schema';

// ISR — revalidated on-demand via revalidateTag() in admin save actions
export const revalidate = 60;

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

    // Filter out insights blocks from homepage
    const filteredBlocks = (pageContent.blocks as ContentBlock[]).filter(
        (block) => block.type !== 'insights' && block.type !== 'insightsList'
    );

    return <ServerBlockRenderer blocks={filteredBlocks} locale={locale} />;
}
