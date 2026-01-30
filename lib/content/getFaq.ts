/**
 * FAQ Content Fetcher
 * ===================
 * 
 * Fetches FAQ items from database for a specific page/group.
 * FAQs are stored as content blocks within page translations.
 */

import { getPageContent } from './getPage';
import type { ContentBlock, FaqBlock } from '@/lib/blocks/schema';

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

/**
 * Extract FAQ items from a page's content blocks
 */
export async function getFaqItems(
    pageSlug: string,
    locale: string
): Promise<FaqItem[]> {
    const pageContent = await getPageContent(pageSlug, locale);

    if (!pageContent) {
        return [];
    }

    // Find FAQ blocks in the page content
    const faqBlocks = pageContent.blocks.filter(
        (block: ContentBlock): block is FaqBlock => block.type === 'faq'
    );

    const items: FaqItem[] = [];

    for (const block of faqBlocks) {
        // FAQ block has items array directly (not in data)
        if (block.items && Array.isArray(block.items)) {
            block.items.forEach((item, index) => {
                items.push({
                    id: `${pageSlug}-faq-${index}`,
                    question: item.question,
                    answer: item.answer,
                });
            });
        }
    }

    return items;
}

/**
 * Get FAQ items for the services page specifically
 */
export async function getServicesFaq(locale: string): Promise<FaqItem[]> {
    return getFaqItems('services', locale);
}
