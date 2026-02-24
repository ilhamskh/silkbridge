import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getPageContent } from '@/lib/blocks/content';
import ServerBlockRenderer from '@/lib/blocks/ServerBlockRenderer';
import type { ContentBlock } from '@/lib/blocks/schema';

// ISR — revalidated on-demand via revalidateTag() in admin save actions
export const revalidate = 60;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch page content from database
    const pageContent = await getPageContent('home', locale as 'en' | 'az');

    if (!pageContent) {
        // Temporarily log and render empty instead of 404 to debug production issue
        console.error(`[HomePage] No pageContent found for locale: ${locale}`);
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 pb-20">
                <div className="text-center p-8 bg-amber-50 rounded-xl border border-amber-200">
                    <h1 className="text-2xl font-bold text-amber-800">Content Missing</h1>
                    <p className="mt-2 text-amber-700">The homepage content is currently unavailable or drafting.</p>
                </div>
            </div>
        );
    }

    // Filter out insights blocks from homepage
    const filteredBlocks = (pageContent.blocks as ContentBlock[]).filter(
        (block) => block.type !== 'insights' && block.type !== 'insightsList'
    );

    return <ServerBlockRenderer blocks={filteredBlocks} locale={locale} />;
}
