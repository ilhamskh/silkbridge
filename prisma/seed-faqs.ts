import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function seedFaqs() {
    console.log('🌱 Seeding FAQ groups and items...');

    // Create FAQ groups
    const groups = await Promise.all([
        prisma.faqGroup.upsert({
            where: { key: 'home' },
            update: {},
            create: { key: 'home' },
        }),
        prisma.faqGroup.upsert({
            where: { key: 'services' },
            update: {},
            create: { key: 'services' },
        }),
        prisma.faqGroup.upsert({
            where: { key: 'partners' },
            update: {},
            create: { key: 'partners' },
        }),
        prisma.faqGroup.upsert({
            where: { key: 'contact' },
            update: {},
            create: { key: 'contact' },
        }),
    ]);

    console.log(`✅ Created ${groups.length} FAQ groups`);

    // FAQ content for HOME group
    const homeFaqs = [
        {
            question: 'What services does Silkbridge International provide?',
            answer: 'We specialize in two core areas: pharmaceutical market entry services and health & wellness tourism. Our market entry services help pharmaceutical companies navigate regulatory approval, identify partners, and establish distribution networks in new markets. Our health tourism division coordinates end-to-end medical travel experiences, from specialist matching to post-treatment care.',
        },
        {
            question: 'Which countries and regions do you operate in?',
            answer: 'We operate across Asia-Pacific, Middle East, Europe, and the Americas. Our network includes partnerships with leading hospitals and healthcare institutions in over 15 countries. We have offices in New York, Singapore, and Dubai, allowing us to provide local expertise with global reach.',
        },
        {
            question: 'How does Silkbridge ensure quality and compliance?',
            answer: 'Quality and compliance are fundamental to everything we do. Our team includes former regulatory agency reviewers, certified healthcare professionals, and compliance experts. We follow ISO-certified processes, conduct thorough due diligence on all partners, and maintain strict adherence to international healthcare standards and local regulations.',
        },
        {
            question: 'What makes Silkbridge different from other consultancies?',
            answer: 'Our unique combination of pharmaceutical industry expertise and health tourism coordination sets us apart. We understand both the commercial and patient care aspects of international healthcare. This dual focus allows us to bridge markets effectively, whether you\'re a pharmaceutical company or an individual seeking medical care abroad.',
        },
    ];

    // FAQ content for SERVICES group
    const servicesFaqs = [
        {
            question: 'What is included in your pharmaceutical market entry services?',
            answer: 'Our market entry services include regulatory pathway analysis, local partner identification and vetting, market sizing and competitive intelligence, distribution network establishment, pricing and reimbursement consulting, and ongoing market support. We tailor our approach to each client\'s specific product and target markets.',
        },
        {
            question: 'How long does a typical market entry project take?',
            answer: 'Timeline varies by market and product complexity. Regulatory approval processes can range from 6 months to 2 years depending on the country and therapeutic area. Our initial assessment phase typically takes 4-6 weeks, after which we provide a detailed timeline and roadmap for your specific situation.',
        },
        {
            question: 'What medical procedures do you coordinate for health tourism?',
            answer: 'We coordinate a wide range of medical procedures including cardiac surgery, orthopedic procedures, cosmetic surgery, fertility treatments, dental care, and cancer treatment. We also arrange wellness retreats, spa therapies, and recovery programs. Our team matches you with specialists and facilities best suited to your specific needs.',
        },
        {
            question: 'Is travel and accommodation included in health tourism packages?',
            answer: 'Yes, we provide comprehensive travel coordination including flight booking, medical visa assistance, accommodation near your chosen hospital, ground transportation, and 24/7 local support. We can also arrange for family members to accompany you and provide interpreter services throughout your stay.',
        },
        {
            question: 'Do you provide post-treatment follow-up care?',
            answer: 'Absolutely. We coordinate post-treatment follow-up with your medical team, arrange telemedicine consultations, facilitate medical records transfer to your home physician, and provide ongoing support during your recovery period. Continuity of care is a critical part of our service.',
        },
    ];

    // FAQ content for PARTNERS group
    const partnersFaqs = [
        {
            question: 'How do you select and vet healthcare partners?',
            answer: 'We employ a rigorous vetting process that includes verification of accreditations and certifications, review of clinical outcomes and safety records, on-site facility inspections, interviews with medical staff, and ongoing performance monitoring. Only institutions meeting our strict quality standards join our network.',
        },
        {
            question: 'Can I choose my own hospital or doctor?',
            answer: 'Yes, patient choice is important to us. We provide recommendations based on your specific medical needs and preferences, but you make the final decision. If you already have a preferred institution or specialist in mind, we can facilitate coordination with them if they meet our quality standards.',
        },
        {
            question: 'How can my healthcare institution become a Silkbridge partner?',
            answer: 'We welcome inquiries from accredited hospitals, clinics, and wellness centers interested in joining our network. Please contact us with information about your facility, services, and international patient capabilities. Our partner development team will review your submission and schedule a discovery call.',
        },
        {
            question: 'Do you work with pharmaceutical distributors?',
            answer: 'Yes, we work extensively with pharmaceutical distributors as part of our market entry services. We help companies identify reputable distributors, conduct due diligence, negotiate agreements, and establish successful partnerships. Our network includes distributors across all our key markets.',
        },
    ];

    // FAQ content for CONTACT group
    const contactFaqs = [
        {
            question: 'How do I get started with Silkbridge?',
            answer: 'Simply fill out our contact form or reach out to us directly via email or phone. Tell us about your needs - whether pharmaceutical market entry or health tourism. We\'ll schedule an initial consultation to understand your goals and explain how we can help.',
        },
        {
            question: 'Is the initial consultation free?',
            answer: 'Yes, we provide a complimentary initial consultation to discuss your needs and determine if we\'re a good fit. This allows you to learn about our services and get preliminary guidance without any commitment.',
        },
        {
            question: 'What information should I prepare for the consultation?',
            answer: 'For market entry inquiries, please prepare information about your product, target markets, and timeline. For health tourism, have details about your medical condition, any previous treatments, and your preferred destinations. Any relevant medical records or market research you\'ve already done is also helpful.',
        },
        {
            question: 'How quickly can I expect a response?',
            answer: 'We typically respond to all inquiries within 1-2 business days. Urgent matters are prioritized. Once you submit a contact form or send an email, you\'ll receive an acknowledgment immediately, followed by a detailed response from the appropriate team member.',
        },
        {
            question: 'Do you offer services in languages other than English?',
            answer: 'Yes, our team is multilingual and we provide services in English, Russian, Azerbaijani, Turkish, Arabic, and Chinese. We also have access to professional medical interpreters in many other languages to ensure clear communication throughout your journey.',
        },
    ];

    // Seed HOME FAQs
    const homeGroup = groups.find((g) => g.key === 'home')!;
    for (const [index, faq] of homeFaqs.entries()) {
        await prisma.faqItem.create({
            data: {
                groupId: homeGroup.id,
                order: index,
                isActive: true,
                translations: {
                    create: [
                        {
                            localeCode: 'en',
                            question: faq.question,
                            answer: faq.answer,
                        },
                    ],
                },
            },
        });
    }
    console.log(`✅ Created ${homeFaqs.length} FAQs for HOME`);

    // Seed SERVICES FAQs
    const servicesGroup = groups.find((g) => g.key === 'services')!;
    for (const [index, faq] of servicesFaqs.entries()) {
        await prisma.faqItem.create({
            data: {
                groupId: servicesGroup.id,
                order: index,
                isActive: true,
                translations: {
                    create: [
                        {
                            localeCode: 'en',
                            question: faq.question,
                            answer: faq.answer,
                        },
                    ],
                },
            },
        });
    }
    console.log(`✅ Created ${servicesFaqs.length} FAQs for SERVICES`);

    // Seed PARTNERS FAQs
    const partnersGroup = groups.find((g) => g.key === 'partners')!;
    for (const [index, faq] of partnersFaqs.entries()) {
        await prisma.faqItem.create({
            data: {
                groupId: partnersGroup.id,
                order: index,
                isActive: true,
                translations: {
                    create: [
                        {
                            localeCode: 'en',
                            question: faq.question,
                            answer: faq.answer,
                        },
                    ],
                },
            },
        });
    }
    console.log(`✅ Created ${partnersFaqs.length} FAQs for PARTNERS`);

    // Seed CONTACT FAQs
    const contactGroup = groups.find((g) => g.key === 'contact')!;
    for (const [index, faq] of contactFaqs.entries()) {
        await prisma.faqItem.create({
            data: {
                groupId: contactGroup.id,
                order: index,
                isActive: true,
                translations: {
                    create: [
                        {
                            localeCode: 'en',
                            question: faq.question,
                            answer: faq.answer,
                        },
                    ],
                },
            },
        });
    }
    console.log(`✅ Created ${contactFaqs.length} FAQs for CONTACT`);

    console.log('✅ FAQ seeding complete!');
}

seedFaqs()
    .catch((e) => {
        console.error('❌ Error seeding FAQs:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
