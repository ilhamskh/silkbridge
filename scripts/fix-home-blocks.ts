import { prisma } from '../lib/db';

const homeBlocksEn = [
    {
        type: 'hero',
        tagline: 'Based in Baku\nExcellence in Health Tourism & Pharma',
        subtagline: 'Silkbridge International connects you to world-class medical wellness, pharmaceutical market access, and comprehensive travel services in Azerbaijan.',
        ctaPrimary: { text: 'Health Tourism', href: '/services' },
        ctaSecondary: { text: 'Market Access', href: '/services' },
        quickLinks: [],
    },
    {
        type: 'about',
        eyebrow: 'About Us',
        headline: 'Bridging Wellness,',
        headlineAccent: 'Pharma & Travel',
        mission: 'We are a Baku-based consultancy dedicated to empowering businesses and individuals with seamless access to Azerbaijan\'s thriving health tourism, pharmaceutical market, and travel sectors.',
        pillars: [
            {
                title: 'Health Tourism',
                description: 'Premium medical wellness packages and concierge services.',
                icon: 'wellness',
            },
            {
                title: 'Pharma Consulting',
                description: 'Market entry, regulatory support, and distribution strategies.',
                icon: 'regulatory',
            },
            {
                title: 'Travel Services',
                description: 'Luxury tours, logistics, and cultural experiences.',
                icon: 'market',
            },
        ],
    },
    {
        type: 'services',
        eyebrow: 'Our Services',
        headline: 'Comprehensive Solutions',
        services: [
            {
                title: 'Medical Wellness',
                description: 'Access to top clinics and wellness centers in Azerbaijan.',
                features: [
                    'Pre-treatment consultations',
                    'Hospital coordination',
                    'Post-care follow-up',
                ],
                cta: { text: 'Explore Services', href: '/services' },
            },
            {
                title: 'Pharma Market Access',
                description: 'Navigate regulatory landscapes and establish market presence.',
                features: [
                    'Regulatory compliance',
                    'Distribution networks',
                    'Market analysis',
                ],
                cta: { text: 'Learn More', href: '/services' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Impact',
        headline: 'Trusted by Global Clients',
        subheadline: 'Excellence in service delivery and client satisfaction.',
        stats: [
            { value: '200+', label: 'Clients Served' },
            { value: '95%', label: 'Satisfaction Rate' },
            { value: '10+', label: 'Countries' },
            { value: '24/7', label: 'Support' },
        ],
        ctaText: 'Get Started',
        ctaHref: '/contact',
    },
    {
        type: 'insightsList',
        eyebrow: 'Latest Updates',
        headline: 'Industry Insights',
        items: [
            {
                title: 'Healthcare Innovation in Azerbaijan',
                excerpt: 'Discover the latest trends and developments in Azerbaijan\'s growing healthcare sector.',
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
    console.log('🔧 Fixing home page blocks for English locale...');

    const page = await prisma.page.findUnique({
        where: { slug: 'home' },
    });

    if (!page) {
        console.error('❌ Home page not found!');
        return;
    }

    console.log(`✅ Found page: ${page.slug} (ID: ${page.id})`);

    const result = await prisma.pageTranslation.update({
        where: {
            pageId_localeCode: {
                pageId: page.id,
                localeCode: 'en',
            },
        },
        data: {
            blocks: homeBlocksEn as any,
        },
    });

    console.log(`✅ Updated English translation (ID: ${result.id})`);
    console.log(`   Blocks count: ${(result.blocks as any[]).length}`);
    console.log('   Block types:', (result.blocks as any[]).map((b: any) => b.type).join(', '));
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    });
