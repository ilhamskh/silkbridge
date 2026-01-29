/**
 * Seed Contact Recipients & Routing Rules
 * Run with: npx tsx prisma/seed-contact.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding contact recipients and routing rules...\n');

    // Get default recipient email from environment or use fallback
    const defaultEmail =
        process.env.CONTACT_DEFAULT_RECIPIENT || process.env.ADMIN_EMAIL || 'admin@silkbridge.az';

    // ========================================
    // Create Default Recipients
    // ========================================

    console.log('📧 Creating recipients...');

    // General Inquiries (fallback)
    const generalRecipient = await prisma.contactRecipient.upsert({
        where: { id: 'general' },
        update: {},
        create: {
            id: 'general',
            label: 'General Inquiries',
            email: defaultEmail,
            isActive: true,
        },
    });
    console.log(`  ✓ General Inquiries: ${generalRecipient.email}`);

    // Pharma Team
    const pharmaRecipient = await prisma.contactRecipient.upsert({
        where: { id: 'pharma' },
        update: {},
        create: {
            id: 'pharma',
            label: 'Pharmaceutical Services',
            email: process.env.CONTACT_PHARMA_EMAIL || defaultEmail,
            isActive: true,
        },
    });
    console.log(`  ✓ Pharma Team: ${pharmaRecipient.email}`);

    // Patient Services
    const patientRecipient = await prisma.contactRecipient.upsert({
        where: { id: 'patient' },
        update: {},
        create: {
            id: 'patient',
            label: 'Patient Services',
            email: process.env.CONTACT_PATIENT_EMAIL || defaultEmail,
            isActive: true,
        },
    });
    console.log(`  ✓ Patient Services: ${patientRecipient.email}`);

    // Wellness Team
    const wellnessRecipient = await prisma.contactRecipient.upsert({
        where: { id: 'wellness' },
        update: {},
        create: {
            id: 'wellness',
            label: 'Wellness & Spa',
            email: process.env.CONTACT_WELLNESS_EMAIL || defaultEmail,
            isActive: true,
        },
    });
    console.log(`  ✓ Wellness Team: ${wellnessRecipient.email}`);

    // ========================================
    // Create Routing Rules
    // ========================================

    console.log('\n🔀 Creating routing rules...');

    // Pharma routing
    await prisma.contactRoutingRule.upsert({
        where: { type: 'PHARMA' },
        update: { recipientId: pharmaRecipient.id },
        create: {
            type: 'PHARMA',
            recipientId: pharmaRecipient.id,
            isActive: true,
        },
    });
    console.log(`  ✓ PHARMA → ${pharmaRecipient.label}`);

    // Patient routing
    await prisma.contactRoutingRule.upsert({
        where: { type: 'PATIENT' },
        update: { recipientId: patientRecipient.id },
        create: {
            type: 'PATIENT',
            recipientId: patientRecipient.id,
            isActive: true,
        },
    });
    console.log(`  ✓ PATIENT → ${patientRecipient.label}`);

    // Wellness routing
    await prisma.contactRoutingRule.upsert({
        where: { type: 'WELLNESS' },
        update: { recipientId: wellnessRecipient.id },
        create: {
            type: 'WELLNESS',
            recipientId: wellnessRecipient.id,
            isActive: true,
        },
    });
    console.log(`  ✓ WELLNESS → ${wellnessRecipient.label}`);

    // ========================================
    // Summary
    // ========================================

    const recipientCount = await prisma.contactRecipient.count();
    const ruleCount = await prisma.contactRoutingRule.count();

    console.log('\n✅ Contact system seeded successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`   - Recipients: ${recipientCount}`);
    console.log(`   - Routing Rules: ${ruleCount}`);
    console.log(`\n💡 Tip: Change recipient emails in Admin → Contact → Recipients`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
