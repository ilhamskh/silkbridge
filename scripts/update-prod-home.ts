#!/usr/bin/env tsx
/**
 * Update production home page with new 8-section structure
 * Usage: PROD_DATABASE_URL='...' npx tsx scripts/update-prod-home.ts
 */

import { prisma } from '../lib/db';

const homeBlocks = [
    {
        type: 'hero',
        tagline: 'Based in Baku\nExcellence in Health Tourism & Pharma',
        subtagline: 'Silkbridge International connects you to world-class medical wellness, pharmaceutical market access, and comprehensive travel services in Azerbaijan.',
        ctaPrimary: { text: 'Explore Services', href: '/services' },
        ctaSecondary: { text: 'Contact Us', href: '/contact' },
    },
    {
        type: 'about',
        eyebrow: 'About Us',
        headline: 'Connecting Global Healthcare',
        headlineAccent: 'to Azerbaijan',
        mission: 'Silkbridge International is your gateway to Azerbaijan\'s growing healthcare and pharmaceutical markets. We bridge international medical expertise with local opportunities.',
        pillars: [
            {
                title: 'Market Entry',
                description: 'Navigate regulatory requirements and establish your presence in Azerbaijan.',
                icon: 'regulatory',
            },
            {
                title: 'Health Tourism',
                description: 'Premium medical and wellness tourism experiences in Baku and beyond.',
                icon: 'wellness',
            },
            {
                title: 'Strategic Partnerships',
                description: 'Connect with leading healthcare providers and pharmaceutical distributors.',
                icon: 'market',
            },
        ],
    },
    {
        type: 'services',
        eyebrow: 'Our Services',
        headline: 'Comprehensive Healthcare Solutions',
        services: [
            {
                title: 'Pharmaceutical Market Entry',
                description: 'End-to-end support for pharmaceutical companies entering the Azerbaijan market.',
                features: [
                    'Regulatory consulting and approvals',
                    'Market analysis and strategy',
                    'Distribution partner identification',
                    'Ongoing compliance support',
                ],
                cta: { text: 'Learn More', href: '/services' },
            },
            {
                title: 'Health & Wellness Tourism',
                description: 'Curated medical tourism experiences combining world-class care with cultural exploration.',
                features: [
                    'Medical procedure coordination',
                    'Luxury accommodation arrangements',
                    'Concierge and translation services',
                    'Post-treatment recovery tours',
                ],
                cta: { text: 'Explore Packages', href: '/services' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Market Insights',
        headline: 'Azerbaijan Healthcare by the Numbers',
        stats: [
            { value: '$2.4B', label: 'Healthcare Market', note: '2024' },
            { value: '15%', label: 'Annual Growth', note: 'CAGR' },
            { value: '50K+', label: 'Medical Tourists', note: 'per year' },
            { value: '200+', label: 'Healthcare Facilities' },
        ],
        ctaText: 'View Market Report',
        ctaHref: '/insights',
    },
    {
        type: 'insightsList',
        eyebrow: 'Latest Insights',
        headline: 'Industry News & Analysis',
        items: [
            {
                title: 'Healthcare Innovation in Azerbaijan',
                excerpt: 'Exploring the rapid modernization of healthcare infrastructure across Azerbaijan.',
                date: '2026-02-01',
                image: '/images/insights/healthcare.jpg',
                href: '/insights/healthcare-innovation',
            },
            {
                title: 'Pharmaceutical Market Opportunities',
                excerpt: 'Explore emerging opportunities in the pharmaceutical market across the Caucasus region.',
                date: '2026-01-28',
                image: '/images/insights/pharma.jpg',
                href: '/insights/pharma-opportunities',
            },
            {
                title: 'Medical Tourism Growth',
                excerpt: 'An analysis of the rapid growth of medical tourism in Baku and beyond.',
                date: '2026-01-25',
                image: '/images/insights/tourism.jpg',
                href: '/insights/medical-tourism',
            },
        ],
        viewAllHref: '/insights',
    },
    {
        type: 'testimonials',
        eyebrow: 'Testimonials',
        headline: 'What Our Clients Say',
        testimonials: [
            {
                quote: 'Silkbridge International made our market entry into Azerbaijan seamless. Their expertise in regulatory affairs and deep understanding of the local healthcare landscape was invaluable.',
                author: 'Dr. Sarah Mitchell',
                role: 'Chief Operations Officer',
                company: 'Global MedTech Solutions',
                image: 'https://images.peopleimages.com/picture/202303/2671272-happy-portrait-and-man-in-a-studio-pointing-to-mockup-for-marketing-advertising-or-product-placement.-happiness-smile-and-male-model-from-india-with-showing-gesture-for-mock-up-by-gray-background-fit_400_400.jpg',
            },
            {
                quote: 'Outstanding service and professionalism. They connected us with the right partners and handled all the complexities of doing business in the region.',
                author: 'James Peterson',
                role: 'Director of International Business',
                company: 'PharmaCorp International',
                image: 'https://images.peopleimages.com/picture/202303/2671272-happy-portrait-and-man-in-a-studio-pointing-to-mockup-for-marketing-advertising-or-product-placement.-happiness-smile-and-male-model-from-india-with-showing-gesture-for-mock-up-by-gray-background-fit_400_400.jpg',
            },
            {
                quote: 'The medical tourism experience exceeded our expectations. From arrival to departure, everything was perfectly organized and the care was world-class.',
                author: 'Maria Rodriguez',
                role: 'Patient',
                company: '',
                image: 'https://images.peopleimages.com/picture/202303/2671272-happy-portrait-and-man-in-a-studio-pointing-to-mockup-for-marketing-advertising-or-product-placement.-happiness-smile-and-male-model-from-india-with-showing-gesture-for-mock-up-by-gray-background-fit_400_400.jpg',
            },
        ],
    },
    {
        type: 'logoGrid',
        eyebrow: 'Trusted By',
        headline: 'Our Partners',
        logos: [
            {
                name: 'Healthcare Partner 1',
                logo: 'https://images.peopleimages.com/picture/202303/2671272-happy-portrait-and-man-in-a-studio-pointing-to-mockup-for-marketing-advertising-or-product-placement.-happiness-smile-and-male-model-from-india-with-showing-gesture-for-mock-up-by-gray-background-fit_400_400.jpg',
                href: '#',
            },
            {
                name: 'Healthcare Partner 2',
                logo: 'https://images.peopleimages.com/picture/202303/2671272-happy-portrait-and-man-in-a-studio-pointing-to-mockup-for-marketing-advertising-or-product-placement.-happiness-smile-and-male-model-from-india-with-showing-gesture-for-mock-up-by-gray-background-fit_400_400.jpg',
                href: '#',
            },
            {
                name: 'Healthcare Partner 3',
                logo: 'https://images.peopleimages.com/picture/202303/2671272-happy-portrait-and-man-in-a-studio-pointing-to-mockup-for-marketing-advertising-or-product-placement.-happiness-smile-and-male-model-from-india-with-showing-gesture-for-mock-up-by-gray-background-fit_400_400.jpg',
                href: '#',
            },
        ],
    },
    {
        type: 'contact',
        eyebrow: 'Get in Touch',
        headline: 'Ready to Start Your Journey?',
        description: "Contact us today to discuss how we can help you achieve your goals in Azerbaijan.",
    },
];

async function main() {
    console.log('🔧 Updating production home page...');

    try {
        // Find home page
        const homePage = await prisma.page.findUnique({
            where: { slug: 'home' },
            include: { translations: true },
        });

        if (!homePage) {
            throw new Error('Home page not found in database');
        }

        console.log(`✅ Found page: home (ID: ${homePage.id})`);

        // Update English translation
        const enTranslation = homePage.translations.find((t) => t.localeCode === 'en');

        if (!enTranslation) {
            throw new Error('English translation not found for home page');
        }

        await prisma.pageTranslation.update({
            where: { id: enTranslation.id },
            data: {
                blocks: homeBlocks as any,
                status: 'PUBLISHED',
                updatedAt: new Date(),
            },
        });

        console.log(`✅ Updated English translation (ID: ${enTranslation.id})`);
        console.log(`   Blocks count: ${homeBlocks.length}`);
        console.log(`   Block types: ${homeBlocks.map((b) => b.type).join(', ')}`);
        console.log('');
        console.log('✅ Production home page updated successfully!');
    } catch (error) {
        console.error('❌ Error updating production home page:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
