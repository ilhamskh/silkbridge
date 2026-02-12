import type { ContentBlock, InsightsListBlock } from './schema';
import BlockRenderer from './BlockRenderer';
import { DynamicInsightsBlock } from './DynamicInsightsBlock';

/**
 * Server Component wrapper for BlockRenderer.
 * Handles server-side data fetching for dynamic blocks like insightsList.
 */
interface ServerBlockRendererProps {
    blocks: ContentBlock[];
    locale: string;
}

export default async function ServerBlockRenderer({ blocks, locale }: ServerBlockRendererProps) {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <>
            {blocks.map((block, index) => {
                const key = `block-${index}-${block.type}`;

                // Handle insightsList with server-side fetching when dynamic
                if (block.type === 'insightsList') {
                    return <DynamicInsightsBlock key={key} block={block as InsightsListBlock} locale={locale} />;
                }

                // All other blocks render through the client BlockRenderer
                // We wrap each block individually so we can mix server and client components
                return <BlockRenderer key={key} blocks={[block]} />;
            })}
        </>
    );
}
