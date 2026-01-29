import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import type { ContentBlock } from '../lib/validations';

type Role = 'ADMIN' | 'EDITOR';
type PageStatus = 'DRAFT' | 'PUBLISHED';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// ============================================
// EXPANDED HOME PAGE CONTENT
// ============================================

const homeBlocksEn: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Based in Baku\nYour Gateway to Azerbaijan',
        subtagline: 'Silkbridge International provides comprehensive tourism services across Azerbaijan—from seamless travel planning to personalized experiences that showcase the best of our country.',
        ctaPrimary: { text: 'Explore Our Services', href: '/services' },
        ctaSecondary: { text: 'Contact Us', href: '/contact' },
    },
    {
        type: 'about',
        eyebrow: 'Who We Are',
        headline: 'Experience, Expertise',
        headlineAccent: 'and Hospitality',
        mission: 'Based in Baku, Silkbridge International combines local expertise with a genuine passion for hospitality. We understand that every journey is unique—whether you\'re visiting for business, leisure, or medical treatment. Our team works closely with you to create experiences that match your exact needs.',
        pillars: [
            {
                title: 'Quality-Focused',
                description: 'We partner only with trusted hotels, transport providers, and guides to ensure consistent service standards.',
                icon: 'quality'
            },
            {
                title: 'Local Expertise',
                description: 'Our team knows Azerbaijan intimately—from hidden gems in Baku to mountain villages in the Caucasus.',
                icon: 'experience'
            },
            {
                title: 'Personal Service',
                description: 'Every inquiry receives individual attention. We adapt our services to your schedule, preferences, and budget.',
                icon: 'personal'
            },
            {
                title: 'Flexibility',
                description: 'Travel plans change. We handle adjustments smoothly so you can focus on enjoying your trip.',
                icon: 'unique'
            },
        ],
    },
    {
        type: 'whyUs',
        eyebrow: 'Why Silkbridge',
        headline: 'What Sets Us Apart',
        description: 'We\'re not a booking portal—we\'re your partner on the ground in Azerbaijan.',
        items: [
            {
                title: 'Single Point of Contact',
                description: 'One dedicated coordinator handles your entire trip. No bouncing between departments or repeating your requirements.',
                icon: 'personal',
            },
            {
                title: 'Transparent Pricing',
                description: 'Clear quotes with no hidden fees. We explain what\'s included so you can budget with confidence.',
                icon: 'quality',
            },
            {
                title: 'Local Network',
                description: 'Relationships built over years with hotels, drivers, and guides mean we can often accommodate special requests.',
                icon: 'experience',
            },
            {
                title: 'Responsive Support',
                description: 'Questions or issues during your trip? Our team is reachable by phone and responds quickly.',
                icon: 'unique',
            },
        ],
    },
    {
        type: 'interactiveServices',
        eyebrow: 'Our Services',
        headline: 'How We Can Help',
        description: 'From flights and hotels to guided tours and visa assistance—we cover all aspects of travel in Azerbaijan.',
        services: [
            {
                id: 'flights',
                title: 'Flight Bookings',
                shortTitle: 'Flights',
                description: 'We book flights to and from Azerbaijan on all major carriers. Need a multi-city itinerary or last-minute change? We handle it.',
                features: [
                    'Competitive rates on international and domestic flights',
                    'Flexible rebooking when plans change',
                    'Group booking coordination',
                ],
                icon: 'plane',
            },
            {
                id: 'hotels',
                title: 'Hotel Reservations',
                shortTitle: 'Hotels',
                description: 'Access our negotiated rates at hotels across Azerbaijan—from business hotels in Baku to boutique properties in the regions.',
                features: [
                    'Properties vetted for quality and service',
                    'Options from budget to luxury',
                    'Special requests handled directly with hotels',
                ],
                icon: 'hotel',
            },
            {
                id: 'packages',
                title: 'Travel Packages',
                shortTitle: 'Packages',
                description: 'Pre-designed itineraries or fully custom trips. Tell us your interests and timeframe; we\'ll build a program.',
                features: [
                    'Day trips from Baku to Gobustan, Gabala, Sheki',
                    'Multi-day cultural and adventure tours',
                    'MICE and corporate retreat planning',
                ],
                icon: 'map',
            },
            {
                id: 'transfers',
                title: 'Transfers & Car Rental',
                shortTitle: 'Transfers',
                description: 'Airport pickups, intercity transfers, or self-drive rentals. Our fleet ranges from sedans to coaches.',
                features: [
                    'Professional, English-speaking drivers',
                    'Meet-and-greet at Baku airport',
                    'Vehicles for groups of any size',
                ],
                icon: 'car',
            },
            {
                id: 'guides',
                title: 'Professional Guides',
                shortTitle: 'Guides',
                description: 'Licensed guides fluent in English, Russian, and other languages who bring Azerbaijan\'s history and culture to life.',
                features: [
                    'City walking tours and regional excursions',
                    'Specialized cultural, culinary, or adventure themes',
                    'Private or group options',
                ],
                icon: 'users',
            },
            {
                id: 'visa',
                title: 'Visa & Immigration',
                shortTitle: 'Visa Support',
                description: 'Visa requirements can be confusing. We guide you through the process and assist with documentation.',
                features: [
                    'E-visa application support',
                    'Letter of invitation for business visas',
                    'Registration assistance for longer stays',
                ],
                icon: 'file',
            },
        ],
        ctaText: 'Get a Quote',
        ctaHref: '/contact',
    },
    {
        type: 'howItWorks',
        eyebrow: 'Simple Process',
        headline: 'How It Works',
        description: 'Planning your Azerbaijan trip is straightforward.',
        steps: [
            {
                title: 'Share Your Requirements',
                description: 'Tell us your dates, interests, group size, and any special needs via our contact form or email.',
                icon: 'request',
            },
            {
                title: 'Receive Your Proposal',
                description: 'We\'ll send a detailed itinerary and quote within 24-48 hours. Revisions are welcome.',
                icon: 'plan',
            },
            {
                title: 'Confirm & Travel',
                description: 'Once confirmed, we handle all bookings. You receive a complete travel pack before departure.',
                icon: 'travel',
            },
        ],
    },
    {
        type: 'areas',
        eyebrow: 'Destinations',
        headline: 'Areas We Cover',
        description: 'From the Caspian coast to the mountain villages—we organize trips throughout Azerbaijan.',
        areas: [
            { name: 'Baku', description: 'Capital city blending ancient walls with modern architecture' },
            { name: 'Absheron Peninsula', description: 'Fire temples, mud volcanoes, and Caspian beaches' },
            { name: 'Sheki', description: 'Historic Silk Road town with stunning Khan\'s Palace' },
            { name: 'Gabala', description: 'Mountain resort region with forests and adventure activities' },
            { name: 'Gobustan', description: 'Ancient rock petroglyphs and mud volcanoes' },
            { name: 'Naftalan', description: 'Unique oil bath treatments and wellness facilities' },
            { name: 'Lahij', description: 'Traditional copper-craft village in the mountains' },
            { name: 'Guba & Khinalig', description: 'Carpet-weaving center and Europe\'s highest village' },
        ],
    },
    {
        type: 'partnersEmpty',
        eyebrow: 'Network',
        headline: 'Partners & Collaborations',
        description: 'We\'re building a network of trusted partners—hotels, resorts, wellness centers, and tour operators. If you represent a hospitality or tourism business in Azerbaijan, we\'d welcome the opportunity to collaborate.',
        ctaText: 'Partner With Us',
        ctaHref: '/contact?type=partnership',
    },
    {
        type: 'cta',
        headline: 'Ready to Plan Your Trip?',
        description: 'Contact us with your travel dates and interests. We\'ll respond within 24 hours with a personalized proposal.',
        primaryButton: { text: 'Get in Touch', href: '/contact' },
        secondaryButton: { text: 'View Services', href: '/services' },
    },
];

// Copy EN to AZ as draft (will need translation)
const homeBlocksAz: ContentBlock[] = homeBlocksEn;

// ============================================
// EXPANDED ABOUT PAGE
// ============================================

const aboutBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'About Silkbridge',
        headline: 'Your Partner in',
        headlineAccent: 'Azerbaijan',
        text: 'We\'re a Baku-based travel company dedicated to making Azerbaijan accessible and enjoyable for international visitors.',
    },
    {
        type: 'story',
        title: 'Our Story',
        paragraphs: [
            'Silkbridge International was founded to bridge the gap between Azerbaijan\'s growing tourism potential and the needs of international travelers seeking reliable, quality services.',
            'Our team combines local knowledge with professional hospitality standards. We\'ve helped business travelers, cultural tourists, medical patients, and adventure seekers—each with different needs, all receiving the same level of attention and care.',
            'We believe that good travel planning is about listening first. Understanding your goals, constraints, and preferences allows us to recommend options that actually fit—not just fill an itinerary.',
        ],
    },
    {
        type: 'whyUs',
        eyebrow: 'Our Approach',
        headline: 'What Guides Us',
        items: [
            {
                title: 'Honesty',
                description: 'We\'ll tell you if something isn\'t the best fit for your needs. Our goal is a trip you\'ll actually enjoy, not maximizing bookings.',
                icon: 'quality',
            },
            {
                title: 'Reliability',
                description: 'When we say a driver will be there at 8am, they\'re there at 8am. We follow through on commitments.',
                icon: 'experience',
            },
            {
                title: 'Adaptability',
                description: 'Weather changes, interests evolve, schedules shift. We adjust plans smoothly and communicate clearly.',
                icon: 'personal',
            },
            {
                title: 'Local Roots',
                description: 'We live here. Our recommendations come from genuine experience, not search algorithms.',
                icon: 'unique',
            },
        ],
    },
    {
        type: 'cta',
        headline: 'Let\'s Work Together',
        description: 'Whether you\'re planning your first visit or your tenth, we\'re here to help make it smooth and memorable.',
        primaryButton: { text: 'Contact Us', href: '/contact' },
        secondaryButton: { text: 'View Services', href: '/services' },
    },
];

const aboutBlocksAz: ContentBlock[] = aboutBlocksEn;

// ============================================
// EXPANDED SERVICES PAGE
// ============================================

const servicesBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Services',
        headline: 'Everything You Need',
        headlineAccent: 'for Azerbaijan',
        text: 'From arrival to departure, we coordinate the details so you can focus on the experience.',
    },
    {
        type: 'interactiveServices',
        eyebrow: 'Full Range',
        headline: 'Services Overview',
        services: [
            {
                id: 'flights',
                title: 'Flight Bookings',
                shortTitle: 'Flights',
                description: 'Book your flights to Azerbaijan through us. We work with major carriers and can often find competitive rates, especially for group bookings.',
                features: [
                    'International flights to Baku Heydar Aliyev Airport',
                    'Domestic connections within Azerbaijan',
                    'Flexible booking and rebooking support',
                    'Group discounts for 10+ passengers',
                ],
                icon: 'plane',
            },
            {
                id: 'hotels',
                title: 'Hotel Reservations',
                shortTitle: 'Hotels',
                description: 'Access our curated selection of hotels across Azerbaijan. We negotiate rates and handle reservations directly.',
                features: [
                    '3-star to 5-star properties in Baku',
                    'Regional hotels in Sheki, Gabala, Guba',
                    'Wellness resorts in Naftalan',
                    'Special rates for extended stays',
                ],
                icon: 'hotel',
            },
            {
                id: 'packages',
                title: 'Travel Packages',
                shortTitle: 'Packages',
                description: 'Choose from ready-made itineraries or work with us to design a custom trip. Options range from weekend city breaks to two-week cultural explorations.',
                features: [
                    'Day trips from Baku (Gobustan, Absheron, etc.)',
                    'Multi-day regional tours (Sheki, Gabala circuit)',
                    'MICE programs for corporate groups',
                    'Themed tours: culinary, historical, adventure',
                ],
                icon: 'map',
            },
            {
                id: 'transfers',
                title: 'Transfers & Car Rental',
                shortTitle: 'Transfers',
                description: 'Airport transfers, intercity transport, or self-drive rentals. Our fleet includes sedans, minivans, and coaches for groups.',
                features: [
                    'Meet-and-greet airport pickup',
                    'Comfortable intercity transfers',
                    'Vehicle options from 2 to 50+ passengers',
                    'Self-drive rental with full insurance',
                ],
                icon: 'car',
            },
            {
                id: 'guides',
                title: 'Professional Guides',
                shortTitle: 'Guides',
                description: 'Our licensed guides speak English, Russian, Arabic, and other languages. They bring expertise and personality to every tour.',
                features: [
                    'City tours and museum visits',
                    'Regional excursions with cultural context',
                    'Specialized themes on request',
                    'Private or small group formats',
                ],
                icon: 'users',
            },
            {
                id: 'visa',
                title: 'Visa & Immigration Support',
                shortTitle: 'Visa',
                description: 'Azerbaijan\'s visa requirements vary by nationality. We help you understand what\'s needed and assist with the application process.',
                features: [
                    'E-visa guidance and support',
                    'Business visa invitation letters',
                    'Registration for stays over 15 days',
                    'Expedited processing when available',
                ],
                icon: 'file',
            },
        ],
        ctaText: 'Request a Quote',
        ctaHref: '/contact',
    },
    {
        type: 'faq',
        eyebrow: 'Common Questions',
        headline: 'Frequently Asked',
        items: [
            {
                question: 'How far in advance should I book?',
                answer: 'For standard services, 1-2 weeks is usually sufficient. For peak season (April-June, September-October) or large groups, we recommend 3-4 weeks minimum.',
            },
            {
                question: 'Can you customize a package for my specific needs?',
                answer: 'Absolutely. Most of our clients request customized itineraries. Share your dates, interests, and any constraints—we\'ll build a proposal around that.',
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept bank transfers and major credit cards. A deposit confirms your booking, with the balance due before travel.',
            },
            {
                question: 'What languages do your guides speak?',
                answer: 'English and Russian are standard. We also have guides fluent in Arabic, German, French, and other languages—please specify when booking.',
            },
            {
                question: 'Can you help with medical tourism or wellness trips?',
                answer: 'Yes. We coordinate visits to Naftalan oil spa resorts and can arrange medical consultations. Let us know your requirements.',
            },
            {
                question: 'What\'s your cancellation policy?',
                answer: 'Policies vary by service. Hotel and flight cancellations depend on supplier terms. We\'ll explain the specific conditions when you book.',
            },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Start Planning?',
        description: 'Send us your requirements and we\'ll prepare a detailed proposal within 24-48 hours.',
        primaryButton: { text: 'Contact Us', href: '/contact' },
    },
];

const servicesBlocksAz: ContentBlock[] = servicesBlocksEn;

// ============================================
// PARTNERS PAGE (Empty state ready)
// ============================================

const partnersBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Network',
        headline: 'Partners &',
        headlineAccent: 'Collaborations',
        text: 'We work with a growing network of hotels, transport providers, and tourism operators across Azerbaijan.',
    },
    {
        type: 'partnersEmpty',
        eyebrow: 'Growing Together',
        headline: 'Building Trusted Partnerships',
        description: 'We\'re selective about who we work with because our reputation depends on consistent service quality. If you represent a hotel, resort, wellness center, or tourism business in Azerbaijan, we\'d like to hear from you.',
        ctaText: 'Become a Partner',
        ctaHref: '/contact?type=partnership',
    },
];

const partnersBlocksAz: ContentBlock[] = partnersBlocksEn;

// ============================================
// CONTACT PAGE
// ============================================

const contactBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Get in Touch',
        headline: 'Let\'s Plan',
        headlineAccent: 'Your Journey',
        text: 'Share your travel requirements and we\'ll respond within 24 hours with a personalized proposal.',
    },
    {
        type: 'contact',
        headline: 'Contact Us',
        description: 'Fill out the form below or reach us directly by phone or email. We\'re based in Baku and respond promptly during business hours.',
        showForm: true,
        showMap: true,
    },
    {
        type: 'faq',
        eyebrow: 'Quick Answers',
        headline: 'Before You Write',
        items: [
            {
                question: 'How quickly will you respond?',
                answer: 'We aim to reply within 24 hours on business days. Urgent requests can also be made by phone.',
            },
            {
                question: 'What information should I include in my inquiry?',
                answer: 'Travel dates (even approximate), number of travelers, main interests or purpose of trip, and any special requirements.',
            },
            {
                question: 'Do you offer quotes without obligation?',
                answer: 'Yes. All our proposals are free with no commitment required. Take your time to review and ask questions.',
            },
            {
                question: 'Can you help if I\'m already in Azerbaijan?',
                answer: 'Yes, though availability for last-minute requests may be limited. Call us directly for urgent needs.',
            },
        ],
    },
];

const contactBlocksAz: ContentBlock[] = contactBlocksEn;

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
    console.log('\n🌱 Starting expanded content seed...\n');

    // Check if we need to update or create
    const existingPages = await prisma.page.findMany();

    if (existingPages.length > 0) {
        console.log('📦 Found existing pages. Updating content...\n');

        // Update existing page translations
        const pageConfigs = [
            { slug: 'home', enBlocks: homeBlocksEn, azBlocks: homeBlocksAz },
            { slug: 'about', enBlocks: aboutBlocksEn, azBlocks: aboutBlocksAz },
            { slug: 'services', enBlocks: servicesBlocksEn, azBlocks: servicesBlocksAz },
            { slug: 'partners', enBlocks: partnersBlocksEn, azBlocks: partnersBlocksAz },
            { slug: 'contact', enBlocks: contactBlocksEn, azBlocks: contactBlocksAz },
        ];

        for (const config of pageConfigs) {
            const page = await prisma.page.findUnique({ where: { slug: config.slug } });

            if (page) {
                // Update EN translation
                await prisma.pageTranslation.updateMany({
                    where: { pageId: page.id, localeCode: 'en' },
                    data: { blocks: config.enBlocks as unknown as object },
                });

                // Update AZ translation  
                await prisma.pageTranslation.updateMany({
                    where: { pageId: page.id, localeCode: 'az' },
                    data: { blocks: config.azBlocks as unknown as object },
                });

                console.log(`  ✓ Updated: ${config.slug}`);
            } else {
                // Create new page (e.g., partners)
                const newPage = await prisma.page.create({
                    data: { slug: config.slug },
                });

                await prisma.pageTranslation.createMany({
                    data: [
                        {
                            pageId: newPage.id,
                            localeCode: 'en',
                            title: config.slug.charAt(0).toUpperCase() + config.slug.slice(1),
                            blocks: config.enBlocks as unknown as object,
                            status: 'PUBLISHED' as PageStatus,
                        },
                        {
                            pageId: newPage.id,
                            localeCode: 'az',
                            title: config.slug.charAt(0).toUpperCase() + config.slug.slice(1),
                            blocks: config.azBlocks as unknown as object,
                            status: 'DRAFT' as PageStatus,
                        },
                    ],
                });

                console.log(`  ✓ Created: ${config.slug}`);
            }
        }
    } else {
        console.log('📦 No existing pages. Running full seed...\n');
        // Run the full seed (import from seed-real-content.ts logic)
    }

    console.log('\n✅ Content update complete!\n');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
