import { getLatestInsights } from '@/lib/content';
import type { InsightsListBlock } from './schema';
import { InsightsListBlockRenderer } from './BlockRenderer';

/**
 * Server Component wrapper for dynamic insights blocks.
 * Fetches latest insights from DB when useDynamicContent is true.
 */
export async function DynamicInsightsBlock({
    block,
    locale,
}: {
    block: InsightsListBlock;
    locale: string;
}) {
    // If using dynamic content, fetch latest insights
    if (block.useDynamicContent) {
        const limit = block.limit || 3; // Default to 3 if not specified
        const insights = await getLatestInsights(locale, limit);

        // If no insights found, don't render the block
        if (insights.length === 0) {
            return null;
        }

        // Transform InsightPostCard to match the expected items format
        const items = insights.map((insight) => ({
            title: insight.title,
            excerpt: insight.excerpt,
            date: insight.publishedAt
                ? new Date(insight.publishedAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
                : undefined,
            image: insight.coverImageUrl || undefined,
            href: `/${locale}/insights/${insight.slug}`,
        }));

        // Pass to client renderer with transformed items
        return <InsightsListBlockRenderer block={{ ...block, items }} />;
    }

    // Static content mode - just render with provided items
    // If no items provided in static mode, hide the block
    if (!block.items || block.items.length === 0) {
        return null;
    }

    return <InsightsListBlockRenderer block={block} />;
}
