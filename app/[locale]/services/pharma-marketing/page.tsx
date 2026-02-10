import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPageContent } from '@/lib/blocks/content';

// Force dynamic rendering to see admin changes immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import BlockRenderer from '@/lib/blocks/BlockRenderer';
import type { ContentBlock } from '@/lib/blocks/schema';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function PharmaMarketingPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const pageContent = await getPageContent('pharma-marketing', locale);

    if (!pageContent) {
        notFound();
    }

    return <BlockRenderer blocks={pageContent.blocks as ContentBlock[]} />;
}
