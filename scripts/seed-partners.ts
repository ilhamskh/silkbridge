#!/usr/bin/env tsx
/**
 * Seed new clinic/hospital Partners into the database.
 *
 * Idempotent — safe to run multiple times. Skips any partner
 * whose name already exists (case-insensitive exact match).
 *
 * Works on local and production:
 *   npx tsx scripts/seed-partners.ts
 *   DATABASE_URL='postgres://...' npx tsx scripts/seed-partners.ts
 *
 * Does NOT:
 *   - modify the schema
 *   - remove or overwrite existing partners
 *   - create new fields
 */

import { prisma } from '../lib/db';

// ============================================
// Partners to seed (name only)
// Images/logos will be uploaded via admin panel later.
// ============================================

const PARTNERS_TO_SEED: { name: string; category: 'HOSPITAL' }[] = [
    { name: 'YENİ KLİNİKA', category: 'HOSPITAL' },
    { name: 'LİV BONADEA HOSPİTAL BAKU', category: 'HOSPITAL' },
    { name: 'ONKOLOGİYA INSTITITU', category: 'HOSPITAL' },
    { name: 'HEMATOLOGİYA INSTITITU', category: 'HOSPITAL' },
    { name: 'BAKU MEDİKAL PLAZA', category: 'HOSPITAL' },
    { name: 'SAGLAM AILƏ KLİNİKA', category: 'HOSPITAL' },
    { name: 'ALYANS KLİNİKA', category: 'HOSPITAL' },
    { name: 'Gold Naftalan & SPA KLİNİK, HOTEL', category: 'HOSPITAL' },
];

// ============================================
// Main
// ============================================

async function main() {
    console.log('🏥 Seeding clinic partners...\n');

    // Fetch all existing partner names once (case-insensitive comparison)
    const existingPartners = await prisma.partner.findMany({
        select: { name: true, order: true },
        orderBy: { order: 'desc' },
    });

    const existingNamesLower = new Set(
        existingPartners.map((p) => p.name.trim().toLowerCase())
    );

    // Determine the next order offset
    const maxOrder = existingPartners.length > 0
        ? Math.max(...existingPartners.map((p) => p.order))
        : -1;
    let orderCounter = maxOrder + 1;

    let created = 0;
    let skipped = 0;

    for (const partner of PARTNERS_TO_SEED) {
        const nameLower = partner.name.trim().toLowerCase();

        if (existingNamesLower.has(nameLower)) {
            console.log(`  ⏭  Skipping "${partner.name}" — already exists.`);
            skipped++;
            continue;
        }

        await prisma.partner.create({
            data: {
                name: partner.name,
                category: partner.category,
                isActive: true,
                order: orderCounter,
                // logoUrl, galleryImages, coverPhotoUrl, websiteUrl, location, specialties
                // left as defaults (null / []) — to be filled via admin panel
            },
        });

        console.log(`  ✓ Created "${partner.name}" (order: ${orderCounter})`);
        orderCounter++;
        created++;
    }

    console.log(`\n✅ Done. Created: ${created}, Skipped (already existed): ${skipped}.`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
