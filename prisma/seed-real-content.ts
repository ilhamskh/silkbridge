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
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// ============================================
// REAL COMPANY CONTENT - HOME PAGE
// ============================================

const homeBlocksEn: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Based in Baku\nYour Gateway to Azerbaijan',
        subtagline: 'Silkbridge International specializing in a wide range of comprehensive tourism services in Azerbaijan.',
        ctaPrimary: { text: 'Explore Our Services', href: '/services' },
        ctaSecondary: { text: 'View Tour Packages', href: '#packages' },
    },
    {
        type: 'about',
        eyebrow: 'Who are we?',
        headline: 'Experience, Talent',
        headlineAccent: 'Hospitality',
        mission: 'Silkbridge International specializing in a wide range of comprehensive tourism services in Azerbaijan. Our experience, talent, hospitality, flexibility, and expertise are harmoniously combined to meet your wishes and satisfy all your travel and leisure needs.',
        pillars: [
            { title: 'Quality is our focus', description: 'We hold ourselves to the highest standards ensuring exceptional experiences.', icon: 'quality' },
            { title: 'Experience', description: 'Years of expertise in Azerbaijan tourism and hospitality industry.', icon: 'experience' },
            { title: 'Personal service', description: 'Tailored solutions to meet your unique travel needs.', icon: 'personal' },
            { title: 'Uniqueness', description: 'Discover one-of-a-kind experiences in Azerbaijan.', icon: 'unique' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'OUR SERVICES',
        headline: 'Comprehensive Tourism Solutions',
        services: [
            {
                title: '01 Air Tickets Reservation',
                description: 'MWA team can offer air tickets reservation to any corner of the world, as well as to Azerbaijan on regular airline flights',
                features: [],
            },
            {
                title: '02 Travel Packages',
                description: 'Thematic, VIP, MICE, Tailormade, Business, FIT/Group, Day trips, Combined tours',
                features: [],
            },
            {
                title: '03 Hotel Reservation',
                description: 'Thanks to our high booking volume, we get special hotel rates, allowing us to offer great prices with guaranteed quality service.',
                features: [],
            },
            {
                title: '04 Transfer Services & Car rental',
                description: 'MWA and Weekend Travel offer a top fleet of luxury cars, vans, and coaches with skilled drivers.',
                features: [],
            },
            {
                title: '05 Professional Guiding',
                description: 'Our guides are speaking in your language',
                features: [],
            },
            {
                title: '06 Visa & Immigration Support',
                description: 'Visas and registration in Azerbaijan can be complex; our team makes the process quick and easy.',
                features: [],
            },
        ],
    },
    {
        type: 'contact',
        eyebrow: 'Get in Touch',
        headline: "Let's Start Planning Your Journey",
        description: "Contact us to learn more about our services and start your Azerbaijan adventure.",
        showForm: true,
        showMap: true,
    },
];

// AZ translations - copy EN as draft for translator
const homeBlocksAz: ContentBlock[] = homeBlocksEn;

// ============================================
// ABOUT PAGE
// ============================================

const aboutBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'About Us',
        headline: 'Silkbridge International',
        headlineAccent: 'Based in Baku',
        text: 'Specializing in a wide range of comprehensive tourism services in Azerbaijan.',
    },
    {
        type: 'story',
        title: 'Who are we?',
        paragraphs: [
            "Silkbridge International specializing in a wide range of comprehensive tourism services in Azerbaijan.",
            "Our experience, talent, hospitality, flexibility, and expertise are harmoniously combined to meet your wishes and satisfy all your travel and leisure needs.",
        ],
    },
    {
        type: 'values',
        title: 'Why us?',
        subtitle: 'Our core values',
        values: [
            { title: 'Quality is our focus', description: 'We hold ourselves to the highest standards ensuring exceptional experiences.', icon: 'quality' },
            { title: 'Experience', description: 'Jupiter is the biggest planet of them all', icon: 'experience' },
            { title: 'Personal service', description: 'Venus has extremely high temperatures', icon: 'personal' },
            { title: 'Uniqueness', description: 'Saturn is a gas giant and has several rings', icon: 'unique' },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Explore Azerbaijan?',
        description: "Let's plan your perfect journey together.",
        primaryButton: { text: 'Contact Us', href: '/contact' },
        secondaryButton: { text: 'View Services', href: '/services' },
    },
];

const aboutBlocksAz: ContentBlock[] = aboutBlocksEn;

// ============================================
// SERVICES PAGE - PROGRAMS
// ============================================

const servicesBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Services',
        headline: 'Discover Azerbaijan',
        headlineAccent: 'Your Way',
        text: 'From air tickets to wellness retreats, we offer comprehensive tourism services tailored to your needs.',
    },
    // Service cards
    {
        type: 'serviceDetails',
        serviceId: 'air-tickets',
        title: '01 Air Tickets Reservation',
        description: 'MWA team can offer air tickets reservation to any corner of the world, as well as to Azerbaijan on regular airline flights',
        features: [],
    },
    {
        type: 'serviceDetails',
        serviceId: 'travel-packages',
        title: '02 Travel Packages',
        description: 'Thematic, VIP, MICE, Tailormade, Business, FIT/Group, Day trips, Combined tours',
        features: [],
    },
    {
        type: 'serviceDetails',
        serviceId: 'hotel',
        title: '03 Hotel Reservation',
        description: 'Thanks to our high booking volume, we get special hotel rates, allowing us to offer great prices with guaranteed quality service.',
        features: [],
    },
    {
        type: 'serviceDetails',
        serviceId: 'transfer',
        title: '04 Transfer Services & Car rental',
        description: 'MWA and Weekend Travel offer a top fleet of luxury cars, vans, and coaches with skilled drivers.',
        features: [],
    },
    {
        type: 'serviceDetails',
        serviceId: 'guiding',
        title: '05 Professional Guiding',
        description: 'Our guides are speaking in your language',
        features: [],
    },
    {
        type: 'serviceDetails',
        serviceId: 'visa',
        title: '06 Visa & Immigration Support',
        description: 'Visas and registration in Azerbaijan can be complex; our team makes the process quick and easy.',
        features: [],
    },
    {
        type: 'cta',
        headline: 'Ready to Get Started?',
        description: "Let's discuss your travel plans and create the perfect itinerary.",
        primaryButton: { text: 'Contact Us', href: '/contact' },
    },
];

const servicesBlocksAz: ContentBlock[] = servicesBlocksEn;

// ============================================
// CONTACT PAGE
// ============================================

const contactBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Contact Us',
        headline: "Let's Plan Your Journey",
        text: 'Get in touch with our team to discuss your travel needs and discover Azerbaijan.',
    },
    {
        type: 'contact',
        headline: 'Get in Touch',
        description: 'Our team is available to answer your questions and help plan your perfect Azerbaijan experience.',
        showForm: true,
        showMap: true,
    },
];

const contactBlocksAz: ContentBlock[] = contactBlocksEn;

// ============================================
// PROGRAMS PAGE (New dedicated page for packages)
// ============================================

const programsBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'OUR PROGRAMS',
        headline: 'Travel Programs',
        headlineAccent: 'For Every Style',
        text: 'Whether you seek luxury VIP experiences, wellness retreats, or cultural adventures, we have the perfect program for you.',
    },
    {
        type: 'paragraph',
        text: 'Thematic: If you\'ve got an idea of which style of trip will suit you best, take a look at our different trip themes, as there\'s something to suit everyone. Whether you\'re chasing a global gastronomic dream or wanting to ride your bike to camp, we have a themed adventure that\'s perfect for you',
    },
    {
        type: 'paragraph',
        text: 'VIP: Welcome to luxury travel redefined, where enchanting refinements and thrilling discoveries merge into a singular trip of a lifetime. Discover the VIP approach to immersive, luxury travel!',
    },
    {
        type: 'paragraph',
        text: 'MICE: Preparation of the plan of measures; determination of the place and time of their conduct; Rent of conference halls and rooms in hotels in Baku and other cities of Azerbaijan; Organization and service of business meetings; Organization of banquets; Organization of entertainment program; Translation and secretarial services',
    },
    {
        type: 'paragraph',
        text: 'Business: High-class suites in the best hotels in the country; Sailing ships and yachts rent Business trips for domestic as well as international destinations with ticket, travelling and international visa assistance. Arrangement of conference halls and cabs Planning and advisory for a leisure trip to the nearby destinations in spare time',
    },
    {
        type: 'paragraph',
        text: 'Tailormade: Tailor-made tours offer you the flexibility to design your own trip exactly how you like it. You can decide how and when to travel, the level of service and the hotel standard. With all that choice it can seem overwhelming, so we have a small, tight-knit tailormade team of experts to give advice and assist you to craft the ideal trip',
    },
    {
        type: 'paragraph',
        text: 'FIT/GROUP: All sorts of people travel on our trips; groups are usually a mix of solos, couples and friends united by an adventurous spirit and a sense of fun. If you\'d prefer a more private experience, we also offer FIT trips or you can call us to see if we could run one of our small group tours as a private trip for a group you are organising',
    },
    {
        type: 'paragraph',
        text: 'Day trips: The best day trips from Baku will take you to locations filled with high artistic achievement, mysterious temples, and amazing natural phenomenon. All of these outings are within one or two hours of Baku giving you an opportunity to visit them all within one or two days depending on how much time you spend at each location and what your interest level is. But they are all worth visiting!',
    },
    {
        type: 'paragraph',
        text: 'Combined tours: Such tours cover main beauties of Azerbaijan and its neighboring countries, reveal the secrets and will let you feel specifics of local culture and enjoy local cuisine. We invite you to a trip full of unusual monuments and charming landscapes!',
    },
    {
        type: 'heading',
        level: 2,
        text: 'VEHICLE FLEET',
    },
    {
        type: 'paragraph',
        text: 'Sedan: Capacity 1-2 person, Width 1,75 m, Length 4 m',
    },
    {
        type: 'paragraph',
        text: 'Vito: Capacity 7+1 person, Width 2 m, Length 3 m',
    },
    {
        type: 'paragraph',
        text: 'Sprinter: Capacity 20+1 person, Width 2,75 m, Length 5,5 m',
    },
    {
        type: 'paragraph',
        text: 'Isuzu: Capacity 30 person, Width 2,75 m, Length 7 m',
    },
    {
        type: 'paragraph',
        text: 'Travego: Capacity 52 person, Width 2,5 m, Length 5,5 m',
    },
    {
        type: 'paragraph',
        text: 'VIP Cars: Width 1,85 m, Length 4,85 m',
    },
    {
        type: 'heading',
        level: 2,
        text: 'Azerbaijan Tour Packages',
    },
    {
        type: 'paragraph',
        text: '3 nights 4 days - Day 1: Arrival transfer to hotel | Day 2: Baku city tour | Day 3: Absheron and Gobustan Tour | Day 4: Departure Transfer',
    },
    {
        type: 'paragraph',
        text: 'Options: 3* hotel $119 per person in double room | 4* hotel $139 per person in double room | 5* hotel $159 per person in double room',
    },
    {
        type: 'paragraph',
        text: 'Includes: Accommodation 3 nights, Breakfasts, Guide service, 3 excursion (without entrance tickets to museum)',
    },
    {
        type: 'divider',
    },
    {
        type: 'paragraph',
        text: '4 nights 5 days - Day 1: Arrival transfer to hotel | Day 2: Baku city tour | Day 3: Gobustan tour and Heydar Aliyev center | Day 4: Absheron tour and shopping tour | Day 5: Departure transfer to airport',
    },
    {
        type: 'paragraph',
        text: 'Options: 3* hotel $155 per person in double room | 4* hotel $179 per person in double room | 5* hotel $195 per person in double room',
    },
    {
        type: 'paragraph',
        text: 'Includes: Accommodation 4 nights, Breakfasts, Guide service, 3 excursion (without entrance tickets to museum)',
    },
    {
        type: 'divider',
    },
    {
        type: 'paragraph',
        text: '5 nights 6 days - Day 1: Arrival transfer to hotel | Day 2: Baku city tour | Day 3: Gabala Tour and overnight | Day 4: Return to Baku | Day 5: Daily Shahdag Tour | Day 6: Departure transfer to airport',
    },
    {
        type: 'paragraph',
        text: 'Options: 3* hotel $219 per person in double room | 4* hotel $229 per person in double room | 5* hotel $245 per person in double room',
    },
    {
        type: 'paragraph',
        text: 'Includes: Accommodation 5 nights, Breakfasts, Guide service, 3 excursion (without entrance tickets to museum)',
    },
    {
        type: 'divider',
    },
    {
        type: 'paragraph',
        text: '6 nights 7 days - Day 1: Arrival transfer to hotel | Day 2: Baku city tour | Day 3: Gabala Tour and overnight | Day 4: Sheki Tour and overnight | Day 5: Return to Baku | Day 6: Free day | Day 7: Departure transfer to airport',
    },
    {
        type: 'paragraph',
        text: 'Options: 3* hotel $245 per person in double room | 4* hotel $259 per person in double room | 5* hotel $315 per person in double room',
    },
    {
        type: 'paragraph',
        text: 'Includes: Accommodation 6 nights, Breakfasts, Guide service, 3 excursion (without entrance tickets to museum)',
    },
    {
        type: 'heading',
        level: 2,
        text: 'Wellness Packages',
    },
    {
        type: 'paragraph',
        text: 'A Journey of Healing, Nature & Luxury - Azerbaijan is one of the region\'s most unique wellness destinations, combining natural healing resources, centuries-old traditions, and world-class hospitality. From the legendary Naftalan oil to mineral springs and luxurious spa resorts, the country offers a wide range of wellness treatments for both leisure and medical travelers.',
    },
    {
        type: 'heading',
        level: 3,
        text: 'Naftalan – World-Famous Healing Oil',
    },
    {
        type: 'paragraph',
        text: 'Naftalan is globally known for its therapeutic oil, used for treating: Joint and bone diseases, Skin conditions, Neurological problems, Stress & chronic fatigue',
    },
    {
        type: 'paragraph',
        text: 'Garabagh Hotel FBT 7 nights - $675 per person',
    },
    {
        type: 'paragraph',
        text: 'Chinar Hotel FBT 7 nights - $570 per person',
    },
    {
        type: 'paragraph',
        text: 'Gashalti Health Hotel FBT 7 nights - $515 per person',
    },
    {
        type: 'heading',
        level: 3,
        text: 'Shabran Wellbeing Resort',
    },
    {
        type: 'paragraph',
        text: 'A feeling of serenity slowly follows as you drive further through the mountains and forest to our state-of-the-art Ayurveda retreat resort. Upon entering the vast green hotel area, you will be bound to be allured by the striking architecture of the hotel and welcoming interior design.',
    },
    {
        type: 'paragraph',
        text: 'Ayurveda Wellness Packages: Detox General (starting from $409 per person) - A complete reset for body and mind. Enjoy deep relaxation at our Ayurveda Spa, energising yoga sessions and daily activities that help you disconnect, recharge, and return refreshed.',
    },
    {
        type: 'paragraph',
        text: 'Destress General (starting from $369 per person) - Perfect for those seeking a break from everyday stress. Includes two full-body oil massages, forehead oil therapy, salt–oil peeling, and calming yoga & meditation sessions for full mental and physical restoration',
    },
    {
        type: 'paragraph',
        text: 'Antiage Full Body (starting from $355 per person) - A targeted regeneration program designed to slow, prevent, or reverse early ageing processes. Strengthens the immune and nervous systems, boosts physical vitality, and supports healthy digestion',
    },
    {
        type: 'paragraph',
        text: 'Packages are available from 3 days / 2 nights up to 7 days / 6 nights.',
    },
    {
        type: 'heading',
        level: 3,
        text: 'Lankaran Springs Wellness Resort',
    },
    {
        type: 'paragraph',
        text: 'Spring Into Serenity and Health - Lankaran Springs Wellness Resort is a modern wellness retreat nestled in the lush, subtropical landscape of southern Azerbaijan. Located in the heart of Lankaran — a region celebrated for its healing mineral springs, tea plantations, and coastal charm.',
    },
    {
        type: 'paragraph',
        text: 'Medical Packages (7 nights FBT, standard room): Standard medical package starting from $425 per person | Arthrosis medical package starting from $509 per person | Premium Medical package starting from $669 per person',
    },
    {
        type: 'heading',
        level: 3,
        text: 'Chenot Palace',
    },
    {
        type: 'paragraph',
        text: 'Exclusive wellness retreat nestled in the stunning foothills of the Caucasus Mountains.',
    },
    {
        type: 'paragraph',
        text: 'Azerbaijan offers a perfect blend of healing, relaxation, and luxury, making it an ideal destination for wellness travelers seeking both medical and holistic rejuvenation. From world-famous Naftalan treatments to exclusive Chenot detox programs, every guest can find a personalized wellness journey.',
    },
    {
        type: 'cta',
        headline: 'Find Your Perfect Package',
        description: 'Contact us to customize your Azerbaijan experience.',
        primaryButton: { text: 'Contact Us', href: '/contact' },
    },
];

const programsBlocksAz: ContentBlock[] = programsBlocksEn;

// ============================================
// Main Seed Function
// ============================================

async function main() {
    console.log('🌱 Starting database seed with real company content...\n');

    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.pageTranslation.deleteMany();
    await prisma.page.deleteMany();
    await prisma.siteSettingsTranslation.deleteMany();
    await prisma.siteSettings.deleteMany();
    await prisma.locale.deleteMany();
    await prisma.user.deleteMany();

    // Create locales
    console.log('🌍 Creating locales...');
    const localeEn = await prisma.locale.create({
        data: {
            code: 'en',
            name: 'English',
            nativeName: 'English',
            flag: '🇺🇸',
            isRTL: false,
            isDefault: true,
            isEnabled: true,
        },
    });

    const localeAz = await prisma.locale.create({
        data: {
            code: 'az',
            name: 'Azerbaijani',
            nativeName: 'Azərbaycan',
            flag: '🇦🇿',
            isRTL: false,
            isDefault: false,
            isEnabled: true,
        },
    });
    console.log(`  ✓ Created locales: ${localeEn.code}, ${localeAz.code}\n`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@silkbridge.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash,
            name: 'Admin',
            role: 'ADMIN' as Role,
            isActive: true,
        },
    });
    console.log(`  ✓ Created admin: ${admin.email}\n`);

    // Create pages with real content
    console.log('📄 Creating pages with real company content...');
    const pageConfigs = [
        { slug: 'home', enTitle: 'Home', azTitle: 'Ana Səhifə', enBlocks: homeBlocksEn, azBlocks: homeBlocksAz },
        { slug: 'about', enTitle: 'About', azTitle: 'Haqqımızda', enBlocks: aboutBlocksEn, azBlocks: aboutBlocksAz },
        { slug: 'services', enTitle: 'Services', azTitle: 'Xidmətlər', enBlocks: servicesBlocksEn, azBlocks: servicesBlocksAz },
        { slug: 'programs', enTitle: 'Programs & Packages', azTitle: 'Proqramlar və Paketlər', enBlocks: programsBlocksEn, azBlocks: programsBlocksAz },
        { slug: 'contact', enTitle: 'Contact', azTitle: 'Əlaqə', enBlocks: contactBlocksEn, azBlocks: contactBlocksAz },
    ];

    for (const config of pageConfigs) {
        const page = await prisma.page.create({
            data: {
                slug: config.slug,
            },
        });

        // Create English translation (PUBLISHED)
        await prisma.pageTranslation.create({
            data: {
                pageId: page.id,
                localeCode: 'en',
                title: config.enTitle,
                seoTitle: `${config.enTitle} | Silkbridge International - Azerbaijan Tourism`,
                seoDescription: `${config.enTitle} - Silkbridge International: Your trusted partner for comprehensive tourism services in Azerbaijan.`,
                blocks: config.enBlocks as unknown as object,
                status: 'PUBLISHED' as PageStatus,
            },
        });

        // Create Azerbaijani translation (DRAFT - for translator to edit)
        await prisma.pageTranslation.create({
            data: {
                pageId: page.id,
                localeCode: 'az',
                title: config.azTitle,
                seoTitle: `${config.azTitle} | Silkbridge International - Azərbaycan Turizmi`,
                seoDescription: `${config.azTitle} - Silkbridge International: Azərbaycanda hərtərəfli turizm xidmətləri üçün etibarlı tərəfdaşınız.`,
                blocks: config.azBlocks as unknown as object,
                status: 'DRAFT' as PageStatus, // Translator will edit and publish
            },
        });

        console.log(`  ✓ Created page: ${config.slug} (EN: PUBLISHED, AZ: DRAFT)`);
    }

    // Create site settings
    console.log('\n⚙️ Creating site settings...');
    const settings = await prisma.siteSettings.create({
        data: {
            id: '1',
            siteName: 'Silkbridge International',
            contactEmail: 'info@silkbridge.az',
            contactPhone: '+994 12 555 1234',
            contactAddress: 'Baku, Azerbaijan',
            socialLinks: {
                linkedin: 'https://linkedin.com/company/silkbridge',
                instagram: 'https://instagram.com/silkbridge',
                facebook: 'https://facebook.com/silkbridge',
            },
        },
    });

    // Create settings translations
    await prisma.siteSettingsTranslation.create({
        data: {
            settingsId: settings.id,
            localeCode: 'en',
            tagline: 'Your trusted partner for comprehensive tourism services in Azerbaijan',
            footerText: '© {year} Silkbridge International. All rights reserved. Based in Baku, Azerbaijan.',
        },
    });

    await prisma.siteSettingsTranslation.create({
        data: {
            settingsId: settings.id,
            localeCode: 'az',
            tagline: 'Azərbaycanda hərtərəfli turizm xidmətləri üçün etibarlı tərəfdaşınız',
            footerText: '© {year} Silkbridge International. Bütün hüquqlar qorunur. Bakı, Azərbaycan.',
        },
    });
    console.log('  ✓ Created site settings\n');

    console.log('✅ Database seeded successfully with real company content!\n');
    console.log('📋 Summary:');
    console.log(`   - Locales: ${await prisma.locale.count()}`);
    console.log(`   - Users: ${await prisma.user.count()}`);
    console.log(`   - Pages: ${await prisma.page.count()}`);
    console.log(`   - Page Translations: ${await prisma.pageTranslation.count()}`);
    console.log(`   - Site Settings: ${await prisma.siteSettings.count()}`);
    console.log(`   - Settings Translations: ${await prisma.siteSettingsTranslation.count()}`);
    console.log('\n🔐 Admin credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n📝 Note: AZ translations are set as DRAFT for translator to edit and publish later.');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
