#!/usr/bin/env tsx
/**
 * Seed Medical Scientific Council section into the About page.
 * 
 * Idempotent — safe to run multiple times, will not duplicate.
 * Works on both local and production environments.
 * 
 * Usage:
 *   npx tsx scripts/seed-medical-council.ts
 *   DATABASE_URL='...' npx tsx scripts/seed-medical-council.ts
 */

import { prisma } from '../lib/db';

// ============================================
// Council block data per locale
// ============================================

const councilBlockEn = {
    type: 'team' as const,
    title: 'The Leaders of the Medical Scientific Council',
    subtitle: 'SILKBRIDGE – The leaders of the Medical Scientific Council are a team of professionals who represent Azerbaijani healthcare at the international level.',
    members: [
        { name: 'Dr. Khalilzade Rovshan', role: 'Head of the Department of Neurosurgery of the Azerbaijan Medical University, Chairman of the Association of Neurosurgeons, Doctor of Philosophy, Associate Professor' },
        { name: 'Prof. Dr. Ahmadov Ilham Samidoglu', role: 'Professor of the Department of Urology, Azerbaijan Medical University, Doctor of Medical Sciences, Chairman of the Association of Urologists and Andrologists' },
        { name: 'Abbasov Eldar Shamkhaloglu', role: 'Professor of the Department of Traumatology, Azerbaijan Medical University, Doctor of Medical Sciences' },
        { name: 'Babek Salek Gannadi', role: 'Chief Endocrinologist of the Republic of Azerbaijan' },
        { name: 'Tural Pashayev', role: 'Hematologist at Liv Bona Dea Hospital, Peripheral Specialist' },
    ],
};

const councilBlockAz = {
    type: 'team' as const,
    title: 'Tibbi Elmi Şüra üzvləri',
    subtitle: 'SILKBRIDGE – Tibbi Elmi Şüranın liderləri Azərbaycan səhiyyəsini beynəlxalq səviyyədə təmsil edən peşəkarlar komandasıdır.',
    members: [
        { name: 'Dr. Xəlilzadə Rövşən', role: 'Azərbaycan Tibb Universitetinin Neyroc\u0259rrahiyy\u0259 kafedrasının müdiri, Neyroc\u0259rrahlar Assosiasiyasının sədri, Fəlsəfə doktoru, Dosent' },
        { name: 'Prof. Dr. Əhmədov İlham Samidoğlu', role: 'Azərbaycan Tibb Universitetinin Urologiya kafedrasının professoru, Tibb Elmləri Doktoru, Uroloqlar və Androloqlar Assosiasiyasının sədri' },
        { name: 'Abbasov Eldar Şamxaloğlu', role: 'Azərbaycan Tibb Universitetinin Travmatologiya kafedrasının professoru, Tibb Elmləri Doktoru' },
        { name: 'Babək Saleh Gənnadi', role: 'Azərbaycan Respublikasının Baş Endokrinoloqu' },
        { name: 'Tural Paşayev', role: 'Liv Bona Dea Xəstəxanasının Hematoloqu, Periferik Mütəxəssis' },
    ],
};

const councilBlockRu = {
    type: 'team' as const,
    title: 'Члены Медицинского Научного Совета',
    subtitle: 'SILKBRIDGE – Лидеры Медицинского Научного Совета — команда профессионалов, представляющих азербайджанское здравоохранение на международном уровне.',
    members: [
        { name: 'Др. Халилзаде Ровшан', role: 'Заведующий кафедрой нейрохирургии Азербайджанского Медицинского Университета, Председатель Ассоциации нейрохирургов, Доктор философии, Доцент' },
        { name: 'Проф. Др. Ахмедов Ильхам Самидоглу', role: 'Профессор кафедры урологии Азербайджанского Медицинского Университета, Доктор медицинских наук, Председатель Ассоциации урологов и андрологов' },
        { name: 'Аббасов Эльдар Шамхалоглу', role: 'Профессор кафедры травматологии Азербайджанского Медицинского Университета, Доктор медицинских наук' },
        { name: 'Бабек Салех Ганнади', role: 'Главный эндокринолог Азербайджанской Республики' },
        { name: 'Турал Пашаев', role: 'Гематолог клиники Liv Bona Dea, Специалист по периферии' },
    ],
};

// ============================================
// Idempotent insertion logic
// ============================================

function hasCouncilBlock(blocks: unknown[]): boolean {
    return blocks.some(
        (b: any) =>
            b.type === 'team' &&
            typeof b.title === 'string' &&
            (b.title.includes('Medical Scientific Council') ||
                b.title.includes('Tibbi Elmi Şüra') ||
                b.title.includes('Медицинского Научного Совета'))
    );
}

function insertCouncilBlock(blocks: unknown[], councilBlock: Record<string, unknown>): unknown[] {
    if (hasCouncilBlock(blocks)) return blocks;

    // Insert after the last existing team block (before insights/gallery/cta)
    let insertIndex = blocks.length;
    for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i] as any;
        if (b.type === 'team') {
            insertIndex = i + 1;
            break;
        }
    }

    const updated = [...blocks];
    updated.splice(insertIndex, 0, councilBlock);
    return updated;
}

async function main() {
    console.log('🏥 Seeding Medical Scientific Council into About page...\n');

    // Find the about page
    const aboutPage = await prisma.page.findUnique({
        where: { slug: 'about' },
        include: { translations: true },
    });

    if (!aboutPage) {
        console.error('❌ About page not found. Run the main seed first.');
        process.exit(1);
    }

    const localeBlocks: Record<string, Record<string, unknown>> = {
        en: councilBlockEn,
        az: councilBlockAz,
        ru: councilBlockRu,
    };

    for (const translation of aboutPage.translations) {
        const locale = translation.localeCode;
        const councilBlock = localeBlocks[locale];

        if (!councilBlock) {
            console.log(`  ⏭  Skipping locale "${locale}" — no council data defined.`);
            continue;
        }

        const currentBlocks = (translation.blocks as unknown[]) ?? [];

        if (hasCouncilBlock(currentBlocks)) {
            console.log(`  ✓ Locale "${locale}" already has Medical Scientific Council — skipping.`);
            continue;
        }

        const updatedBlocks = insertCouncilBlock(currentBlocks, councilBlock);

        await prisma.pageTranslation.update({
            where: { id: translation.id },
            data: {
                blocks: updatedBlocks as any,
            },
        });

        console.log(`  ✓ Added Medical Scientific Council to "${locale}" translation (${updatedBlocks.length} blocks total).`);
    }

    console.log('\n✅ Done. Medical Scientific Council seeded successfully.');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
