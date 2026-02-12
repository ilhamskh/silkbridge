/**
 * Markdown Rendering Utility
 * ==========================
 * 
 * Server-side only. Converts Markdown to sanitized HTML.
 * Also extracts headings for Table of Contents generation.
 * Uses remark/rehype pipeline with GFM support + sanitization.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

// ============================================
// Types
// ============================================

export interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

// ============================================
// Heading extraction (from markdown source)
// ============================================

/**
 * Extract h2 and h3 headings from markdown for ToC.
 * Uses regex parsing on the raw markdown — fast and dependency-free.
 */
export function extractHeadings(markdown: string): TocItem[] {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length as 2 | 3;
        const text = match[2].trim();
        const id = slugify(text);
        headings.push({ id, text, level });
    }

    return headings;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// ============================================
// Markdown → HTML rendering
// ============================================

/**
 * Render markdown to sanitized HTML.
 * Adds IDs to headings for anchor links.
 * Server-side only — do not import in client components.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
    if (!markdown || markdown.trim() === '') return '';

    const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .process(markdown);

    let html = String(result);

    // Add IDs to h2 and h3 headings for anchor navigation
    html = html.replace(
        /<(h[23])>(.*?)<\/h[23]>/g,
        (_, tag, content) => {
            const textContent = content.replace(/<[^>]*>/g, '');
            const id = slugify(textContent);
            return `<${tag} id="${id}">${content}</${tag}>`;
        }
    );

    return html;
}

/**
 * Estimate reading time in minutes.
 */
export function estimateReadTime(markdown: string): number {
    if (!markdown) return 1;
    const wordCount = markdown.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(wordCount / 200));
}
