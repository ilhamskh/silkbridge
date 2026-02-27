import type { ContentBlock, InsightsListBlock } from './schema';
import BlockRenderer from './BlockRenderer';
import { DynamicInsightsBlock } from './DynamicInsightsBlock';

/**
 * Server Component wrapper for BlockRenderer.
 * Handles server-side data fetching for dynamic blocks like insightsList.
 * Groups consecutive serviceDetails blocks for compact grid rendering.
 */
interface ServerBlockRendererProps {
    blocks: ContentBlock[];
    locale: string;
}

export default async function ServerBlockRenderer({ blocks, locale }: ServerBlockRendererProps) {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    // Pre-group blocks: consecutive serviceDetails → batched, insightsList → server-fetched, others → individual
    const renderGroups: Array<{ type: 'insights'; block: InsightsListBlock; index: number } | { type: 'blockBatch'; blocks: ContentBlock[]; startIndex: number }> = [];
    let i = 0;
    while (i < blocks.length) {
        if (blocks[i].type === 'insightsList') {
            renderGroups.push({ type: 'insights', block: blocks[i] as InsightsListBlock, index: i });
            i++;
        } else if (blocks[i].type === 'serviceDetails') {
            // Collect consecutive run of serviceDetails
            const run: ContentBlock[] = [];
            const startIndex = i;
            while (i < blocks.length && blocks[i].type === 'serviceDetails') {
                run.push(blocks[i]);
                i++;
            }
            renderGroups.push({ type: 'blockBatch', blocks: run, startIndex });
        } else {
            renderGroups.push({ type: 'blockBatch', blocks: [blocks[i]], startIndex: i });
            i++;
        }
    }

    return (
        <>
            {renderGroups.map((group) => {
                if (group.type === 'insights') {
                    return <DynamicInsightsBlock key={`block-${group.index}-insightsList`} block={group.block} locale={locale} />;
                }

                // Pass block batch to client BlockRenderer (grouping logic handles serviceDetails grids)
                return <BlockRenderer key={`blocks-${group.startIndex}`} blocks={group.blocks} />;
            })}
        </>
    );
}
