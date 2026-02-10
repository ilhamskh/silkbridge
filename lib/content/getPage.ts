/**
 * Page Content Fetcher — Re-exports from canonical module
 * ========================================================
 *
 * The canonical implementation lives in @/lib/blocks/content.ts which
 * includes hydrateBlocks() for gallery blocks. This file re-exports
 * for use by the barrel @/lib/content/index.ts.
 */

export {
    getPageContent,
    getPageContentForAdmin,
    getPageCacheTag,
    getAllPagesCacheTag,
    type PageContent,
} from '@/lib/blocks/content';
