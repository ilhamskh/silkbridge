#!/usr/bin/env tsx
/**
 * Check what content is actually stored in the database
 * Usage: npx tsx scripts/check-db-content.ts
 */

import { prisma } from '../lib/db';

async function main() {
    console.log('='.repeat(60));
    console.log('DATABASE CONTENT CHECK');
    console.log('='.repeat(60));

    // Get home page
    const homePage = await prisma.page.findUnique({
        where: { slug: 'home' },
        include: {
            translations: {
                include: {
                    locale: true,
                },
                orderBy: { localeCode: 'asc' },
            },
        },
    });

    if (!homePage) {
        console.log('❌ Home page not found in database!');
        return;
    }

    console.log(`\n✅ Found page: ${homePage.slug} (ID: ${homePage.id})`);
    console.log(`   Translations: ${homePage.translations.length}`);

    for (const translation of homePage.translations) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`Locale: ${translation.localeCode} (${translation.locale.nativeName})`);
        console.log(`Status: ${translation.status}`);
        console.log(`Title: ${translation.title}`);
        console.log(`Updated: ${translation.updatedAt.toISOString()}`);
        console.log(`Updated by: ${translation.updatedBy || 'N/A'}`);

        const blocks = translation.blocks as any[];
        console.log(`Blocks: ${blocks?.length || 0}`);

        if (blocks && blocks.length > 0) {
            const heroBlock = blocks.find((b: any) => b.type === 'hero');
            if (heroBlock) {
                console.log(`\n📋 HERO BLOCK:`);
                console.log(`   Tagline: "${heroBlock.tagline}"`);
                console.log(`   Subtagline: "${heroBlock.subtagline || 'N/A'}"`);
                if (heroBlock.ctaPrimary) {
                    console.log(`   Primary CTA: ${heroBlock.ctaPrimary.text} → ${heroBlock.ctaPrimary.href}`);
                }
            }

            console.log(`\n📦 All block types:`);
            blocks.forEach((block: any, i: number) => {
                console.log(`   ${i + 1}. ${block.type}${block._isHidden ? ' (HIDDEN)' : ''}`);
            });
        }
    }

    console.log(`\n${'='.repeat(60)}`);
}

main()
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
