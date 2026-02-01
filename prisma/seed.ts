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
// Initial Content Blocks for Pages
// ============================================

const homeBlocksEn: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Based in Baku\nYour Gateway to Azerbaijan',
        subtagline: 'Silkbridge International specializing in a wide range of comprehensive tourism services in Azerbaijan.',
        ctaPrimary: { text: 'Explore Our Services', href: '/services' },
        ctaSecondary: { text: 'View Tour Packages', href: '/services#packages' },
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
                title: 'Air Tickets Reservation',
                description: 'Book flights to any destination worldwide and to Azerbaijan on regular airline routes.',
                features: [
                    'Global airline connections',
                    'Competitive pricing',
                    'Flexible booking options',
                    'Multi-city itineraries',
                    '24/7 booking support',
                ],
                cta: { text: 'Learn More', href: '/services#flights' },
            },
            {
                title: 'Travel Packages & Tours',
                description: 'Curated experiences including thematic tours, VIP packages, MICE, business travel, and custom itineraries.',
                features: [
                    'Customized tour packages',
                    'Cultural experiences',
                    'Adventure tourism',
                    'City tours and excursions',
                    'Group and private options',
                ],
                cta: { text: 'View Packages', href: '/services#packages' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Tourism Insights',
        headline: 'Azerbaijan Tourism at a Glance',
        subheadline: 'Key statistics shaping Azerbaijan\'s growing tourism industry',
        stats: [
            { value: '3.5M', label: 'Annual Tourists', note: 'Ministry of Culture' },
            { value: '15%', label: 'Tourism Growth YoY', note: 'Tourism Board' },
            { value: '850+', label: 'Hotels & Resorts', note: 'Industry Data' },
            { value: '$2.1B', label: 'Tourism Revenue', note: 'State Statistics' },
        ],
        ctaText: 'Explore Azerbaijan',
        ctaHref: '/services',
    },
    {
        type: 'partners',
        eyebrow: 'Our Network',
        headline: 'Trusted by Leading Hospitality Providers',
        description: 'We partner with premier hotels, resorts, and tourism operators across Azerbaijan.',
        ctaText: 'View Our Partners',
        ctaHref: '/partners',
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

const homeBlocksAz: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Bakıda Yerləşir\nAzərbaycana Açılan Qapınız',
        subtagline: 'Silkbridge International Azərbaycanda geniş çeşiddə hərtərəfli turizm xidmətlərində ixtisaslaşır.',
        ctaPrimary: { text: 'Xidmətlərimizi Kəşf Edin', href: '/services' },
        ctaSecondary: { text: 'Tur Paketlərini Görün', href: '/services#packages' },
    },
    {
        type: 'about',
        eyebrow: 'Biz Kimik?',
        headline: 'Təcrübə, İstedadlı',
        headlineAccent: 'Qonaqpərvərlik',
        mission: 'Silkbridge International Azərbaycanda geniş çeşiddə hərtərəfli turizm xidmətlərində ixtisaslaşır. Təcrübəmiz, istedadımız, qonaqpərvərliyimiz, çevikliyimiz və ekspertizamız arzularınızı yerinə yetirmək və bütün səyahət və istirahət ehtiyaclarınızı ödəmək üçün harmonik şəkildə birləşir.',
        pillars: [
            { title: 'Keyfiyyət fokusumzdur', description: 'Müstəsna təcrübələr təmin edərək ən yüksək standartlara riayət edirik.', icon: 'quality' },
            { title: 'Təcrübə', description: 'Azərbaycan turizm və qonaqpərvərlik sənayesində uzun illərin təcrübəsi.', icon: 'experience' },
            { title: 'Fərdi xidmət', description: 'Unikal səyahət ehtiyaclarınıza uyğun fərdi həllər.', icon: 'personal' },
            { title: 'Unikallıq', description: 'Azərbaycanda özünəməxsus təcrübələri kəşf edin.', icon: 'unique' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'XİDMƏTLƏRİMİZ',
        headline: 'Hərtərəfli Turizm Həlləri',
        services: [
            {
                title: 'Aviabilet Rezervasiyası',
                description: 'Dünyanın istənilən nöqtəsinə və Azərbaycana müntəzəm aviareyslər üzrə uçuşlar rezerv edin.',
                features: [
                    'Qlobal aviaşirkət əlaqələri',
                    'Rəqabətli qiymətlər',
                    'Çevik rezervasiya variantları',
                    'Çoxşəhərli marşrutlar',
                    '24/7 rezervasiya dəstəyi',
                ],
                cta: { text: 'Ətraflı', href: '/services#flights' },
            },
            {
                title: 'Səyahət Paketləri və Turlar',
                description: 'Tematik turlar, VIP paketlər, MICE, iş səyahətləri və fərdi marşrutlar daxil olmaqla kuratorluq edilmiş təcrübələr.',
                features: [
                    'Fərdi tur paketləri',
                    'Mədəni təcrübələr',
                    'Macəra turizmi',
                    'Şəhər turları və ekskursiyalar',
                    'Qrup və fərdi variantlar',
                ],
                cta: { text: 'Paketlərə Baxın', href: '/services#packages' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Turizm Məlumatları',
        headline: 'Azərbaycan Turizminə Baxış',
        subheadline: 'Azərbaycanın inkişaf edən turizm sənayesini formalaşdıran əsas göstəricilər',
        stats: [
            { value: '3.5M', label: 'İllik Turistlər', note: 'Mədəniyyət Nazirliyi' },
            { value: '15%', label: 'İllik Turizm Artımı', note: 'Turizm Şurası' },
            { value: '850+', label: 'Otel və Kurort', note: 'Sənaye Məlumatları' },
            { value: '$2.1B', label: 'Turizm Gəliri', note: 'Dövlət Statistikası' },
        ],
        ctaText: 'Azərbaycanı Kəşf Edin',
        ctaHref: '/services',
    },
    {
        type: 'partners',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Aparıcı Qonaqpərvərlik Təchizatçıları Tərəfindən Etibar Edilir',
        description: 'Azərbaycan üzrə premium otellər, kurortlar və turizm operatorları ilə əməkdaşlıq edirik.',
        ctaText: 'Tərəfdaşlarımızı Görün',
        ctaHref: '/partners',
    },
    {
        type: 'contact',
        eyebrow: 'Əlaqə',
        headline: 'Səyahətinizi Planlaşdırmağa Başlayaq',
        description: 'Xidmətlərimiz haqqında daha çox məlumat almaq və Azərbaycan macəranıza başlamaq üçün bizimlə əlaqə saxlayın.',
        showForm: true,
        showMap: true,
    },
];

const aboutBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'About Us',
        headline: 'Experience, Talent',
        headlineAccent: 'Hospitality',
        text: 'Silkbridge International specializes in a wide range of comprehensive tourism services in Azerbaijan. Our experience, talent, hospitality, flexibility, and expertise are harmoniously combined to meet your wishes and satisfy all your travel and leisure needs.',
    },
    {
        type: 'storyline',
        title: 'Our Journey',
        text: 'From local roots to global reach, discover how Silkbridge became Azerbaijan’s premier tourism partner.',
        beats: [
            { id: '1', year: '2010', kicker: 'ORIGINS', title: 'Founded in Baku', description: 'Silkbridge International was founded with a passion for showcasing the beauty and culture of Azerbaijan to travelers from around the world.' },
            { id: '2', year: '2013', kicker: 'EXPANSION', title: 'MICE & Corporate', description: 'We expanded our services to include comprehensive MICE solutions, supporting international conferences and corporate events in Baku.' },
            { id: '3', year: '2016', kicker: 'INNOVATION', title: 'Custom Packages', description: 'Launched our signature "Silk Road" custom itineraries, allowing guests to explore regions beyond Baku like Sheki and Gabala.' },
            { id: '4', year: '2019', kicker: 'PARTNERSHIPS', title: 'Hotel Network', description: 'Established direct partnerships with over 50 premier hotels and resorts across Azerbaijan, ensuring best rates for our clients.' },
            { id: '5', year: '2022', kicker: 'WELLNESS', title: 'Health Tourism', description: 'Introduced specialized wellness programs partnering with Naftalan and Chenot Palace resorts.' },
            { id: '6', year: '2025', kicker: 'TODAY', title: 'Leading the Way', description: 'Today, we serve over 10,000 satisfied travelers annually, bridging East and West with modern luxury and ancient hospitality.' },
        ],
    },
    {
        type: 'values',
        title: 'Why Choose Us?',
        subtitle: 'The principles that guide every journey we create',
        values: [
            { title: 'Quality is Our Focus', description: 'We hold ourselves to the highest standards, ensuring exceptional experiences that exceed expectations.' },
            { title: 'Experience', description: 'Years of expertise in Azerbaijan tourism and hospitality industry.' },
            { title: 'Personal Service', description: 'Tailored solutions to meet your unique travel needs and preferences.' },
            { title: 'Uniqueness', description: 'Discover one-of-a-kind experiences that showcase the best of Azerbaijan.' },
        ],
    },
    {
        type: 'team',
        title: 'Our Team',
        subtitle: 'Experienced professionals dedicated to your perfect Azerbaijan experience',
        members: [
            { name: 'Leyla Aliyeva', role: 'Founder & CEO', bio: '15+ years in Azerbaijan tourism, specializing in luxury travel and cultural experiences.' },
            { name: 'Rashid Mammadov', role: 'Head of Tour Operations', bio: 'Expert guide with deep knowledge of Azerbaijan regions and attractions.' },
            { name: 'Nigar Hasanova', role: 'Client Relations Director', bio: 'Multilingual professional ensuring seamless service for international guests.' },
            { name: 'Elvin Huseynov', role: 'MICE & Corporate Manager', bio: 'Specialist in business travel, conferences, and corporate events in Azerbaijan.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Explore Azerbaijan?',
        description: "Let us create your perfect Azerbaijan experience with our local expertise and personalized service.",
        primaryButton: { text: 'Plan Your Trip', href: '/contact' },
    },
];

const aboutBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Haqqımızda',
        headline: 'Təcrübə, İstedadlı',
        headlineAccent: 'Qonaqpərvərlik',
        text: 'Silkbridge International Azərbaycanda geniş çeşiddə hərtərəfli turizm xidmətlərində ixtisaslaşır. Təcrübəmiz, istedadımız, qonaqpərvərliyimiz, çevikliyimiz və ekspertizamız arzularınızı yerinə yetirmək və bütün səyahət və istirahət ehtiyaclarınızı ödəmək üçün harmonik şəkildə birləşir.',
    },
    {
        type: 'storyline',
        title: 'Hekayəmiz',
        text: 'Yerli köklərdən qlobal miqyaslı fəaliyyətə, Silkbridge-in necə Azərbaycanın aparıcı turizm tərəfdaşına çevrildiyini kəşf edin.',
        beats: [
            { id: '1', year: '2010', kicker: 'MƏNŞƏYİ', title: 'Bakıda Təsis Edildi', description: 'Silkbridge International, Azərbaycanın gözəlliklərini və mədəniyyətini dünyaya tanıtmaq ehtirası ilə təsis edilmişdir.' },
            { id: '2', year: '2013', kicker: 'GENİŞLƏNMƏ', title: 'MICE və Korporativ', description: 'Xidmətlərimizi genişləndirərək Bakıda beynəlxalq konfranslar və korporativ tədbirləri dəstəkləyən MICE həllərini təqdim etməyə başladıq.' },
            { id: '3', year: '2016', kicker: 'İNNOVASİYA', title: 'Fərdi Paketlər', description: 'Qonaqlara Bakıdan kənar, Şəki və Qəbələ kimi bölgələri kəşf etməyə imkan verən "İpək Yolu" fərdi marşrutlarımızı işə saldıq.' },
            { id: '4', year: '2019', kicker: 'TƏRƏFDAŞLIQ', title: 'Otel Şəbəkəsi', description: 'Müştərilərimiz üçün ən yaxşı qiymətləri təmin etmək məqsədilə 50-dən çox premium otel və kurortla birbaşa tərəfdaşlıq qurduq.' },
            { id: '5', year: '2022', kicker: 'SAĞLAMLIQ', title: 'Tibbi Turizm', description: 'Naftalan və Çenot Palace kurortları ilə əməkdaşlıq edərək ixtisaslaşmış wellness proqramlarını təqdim etdik.' },
            { id: '6', year: '2025', kicker: 'BU GÜN', title: 'Liderlik', description: 'Bu gün Şərq və Qərbi müasir lüks və qədim qonaqpərvərliklə birləşdirərək hər il 10,000-dən çox məmnun səyahətçiyə xidmət edirik.' },
        ],
    },
    {
        type: 'values',
        title: 'Niyə Bizi Seçməlisiniz?',
        subtitle: 'Yaratdığımız hər səyahətə rəhbərlik edən prinsiplər',
        values: [
            { title: 'Keyfiyyət Fokusumzdur', description: 'Gözləntiləri aşan müstəsna təcrübələr təmin edərək özümüzü ən yüksək standartlara riayət etməyə öhdələyirik.' },
            { title: 'Təcrübə', description: 'Azərbaycan turizm və qonaqpərvərlik sənayesində uzun illərin ekspertizası.' },
            { title: 'Fərdi Xidmət', description: 'Unikal səyahət ehtiyaclarınıza və üstünlüklərinizə uyğun fərdiləşdirilmiş həllər.' },
            { title: 'Unikallıq', description: 'Azərbaycanın ən yaxşı tərəflərini nümayiş etdirən özünəməxsus təcrübələr kəşf edin.' },
        ],
    },
    {
        type: 'team',
        title: 'Komandamız',
        subtitle: 'Mükəmməl Azərbaycan təcrübənizə həsr olunmuş təcrübəli mütəxəssislər',
        members: [
            { name: 'Leyla Əliyeva', role: 'Təsisçi və Baş Direktor', bio: 'Lüks səyahət və mədəni təcrübələrdə ixtisaslaşmış Azərbaycan turizmində 15+ illik təcrübə.' },
            { name: 'Rəşid Məmmədov', role: 'Tur Əməliyyatları Rəhbəri', bio: 'Azərbaycanın regionları və attraksionları haqqında dərin bilikləri olan ekspert bələdçi.' },
            { name: 'Nigar Həsənova', role: 'Müştəri Münasibətləri Direktoru', bio: 'Beynəlxalq qonaqlar üçün qüsursuz xidməti təmin edən çoxdilli mütəxəssis.' },
            { name: 'Elvin Hüseynov', role: 'MICE və Korporativ Menecer', bio: 'Azərbaycanda biznes səyahətləri, konfranslar və korporativ tədbirlər üzrə mütəxəssis.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Azərbaycanı Kəşf Etməyə Hazırsınız?',
        description: 'Yerli ekspertizamız və fərdi xidmətimizlə mükəmməl Azərbaycan təcrübənizi yaradaq.',
        primaryButton: { text: 'Səyahətinizi Planlayın', href: '/contact' },
    },
];

const servicesBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Services',
        headline: 'Comprehensive Tourism',
        headlineAccent: 'Solutions',
        text: "From flight bookings to guided tours, hotel reservations to visa support—we provide complete travel services to make your Azerbaijan experience seamless and unforgettable.",
    },
    {
        type: 'serviceDetails',
        serviceId: 'airTickets',
        title: 'Air Tickets Reservation',
        description: 'Book flights to any corner of the world, as well as to Azerbaijan on regular airline flights.',
        features: [
            'Global airline connections',
            'Competitive pricing',
            'Flexible booking options',
            'Multi-city itineraries',
            '24/7 booking support',
        ],
        ctaText: 'Book Your Flight',
        ctaHref: '/contact',
        details: [
            { title: 'International Flights', description: 'Connections to major airlines worldwide with competitive fares and flexible rebooking options.', tags: ['All major airlines', 'Best price guarantee', 'E-ticket delivery', 'Multi-city routes'] },
            { title: 'Domestic Flights', description: 'Quick and easy booking for domestic routes within Azerbaijan and neighboring countries.', tags: ['Azerbaijan Airlines', 'Regional carriers', 'Same-day booking', 'Group discounts'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'travelPackages',
        title: 'Travel Packages & Tours',
        description: 'Curated experiences including thematic tours, VIP packages, MICE, business travel, and tailormade itineraries.',
        features: [
            'Thematic & cultural tours',
            'VIP luxury packages',
            'MICE & corporate events',
            'Day trips & excursions',
            'Tailormade itineraries',
        ],
        ctaText: 'Explore Packages',
        ctaHref: '/contact',
        details: [
            { title: 'Tour Types', description: 'Choose from thematic, VIP, MICE, business travel, FIT/Group tours, day trips, and combined regional tours.', tags: ['Thematic', 'VIP', 'MICE', 'Business', 'FIT/Group', 'Day trips'] },
            { title: 'Popular Packages', description: 'Explore Azerbaijan with 3-7 night packages covering Baku, Gobustan, Absheron, Gabala, Sheki, and Shahdag.', tags: ['3-4 nights $119+', '4-5 nights $155+', '5-6 nights $219+', '6-7 nights $245+'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'hotelReservation',
        title: 'Hotel Reservation',
        description: 'Thanks to our high booking volume, we get special hotel rates, allowing us to offer great prices with guaranteed quality service.',
        features: [
            '3-5 star accommodations',
            'Special partner rates',
            'Quality guaranteed',
            'Central locations',
            'Wellness resorts',
        ],
        ctaText: 'Find Your Hotel',
        ctaHref: '/contact',
        details: [
            { title: 'City Hotels', description: 'Premium accommodations in Baku and other major cities with special rates for our clients.', tags: ['Baku center', 'Old City', 'Seaside', 'Business districts'] },
            { title: 'Wellness Resorts', description: 'Naftalan healing treatments, Shabran Ayurveda retreats, Lankaran Springs, and Chenot Palace wellness programs.', tags: ['Naftalan', 'Shabran', 'Lankaran', 'Gabala'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'transfers',
        title: 'Transfer Services & Car Rental',
        description: 'We offer a top fleet of luxury cars, vans, and coaches with skilled professional drivers.',
        features: [
            'Airport transfers',
            'VIP cars & sedans',
            'Sprinters & vans',
            'Coaches for groups',
            'Professional drivers',
        ],
        ctaText: 'Book Transfer',
        ctaHref: '/contact',
        details: [
            { title: 'Vehicle Fleet', description: 'Sedan (1-2 pax), Vito (7+1), Sprinter (20+1), Isuzu (30 pax), Travego (52 pax), and VIP cars.', tags: ['Sedan', 'Vito', 'Sprinter', 'Isuzu', 'Travego', 'VIP'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'guiding',
        title: 'Professional Guiding',
        description: 'Our experienced guides speak your language and share deep knowledge of Azerbaijan culture and history.',
        features: [
            'Multilingual guides',
            'Licensed professionals',
            'Local expertise',
            'Cultural insights',
            'Flexible scheduling',
        ],
        ctaText: 'Request a Guide',
        ctaHref: '/contact',
    },
    {
        type: 'serviceDetails',
        serviceId: 'visa',
        title: 'Visa & Immigration Support',
        description: 'Visas and registration in Azerbaijan can be complex; our team makes the process quick and easy.',
        features: [
            'E-visa assistance',
            'Invitation letters',
            'Registration support',
            'Document preparation',
            'Express processing',
        ],
        ctaText: 'Get Visa Help',
        ctaHref: '/contact',
    },
    {
        type: 'process',
        title: 'How We Work',
        subtitle: 'A proven process for exceptional travel experiences',
        steps: [
            { title: 'Consultation', description: 'Tell us about your travel goals, preferences, and dates.' },
            { title: 'Planning', description: 'We design a customized itinerary tailored to your needs.' },
            { title: 'Booking', description: 'We handle all reservations—flights, hotels, tours, transfers.' },
            { title: 'Travel', description: '24/7 support throughout your Azerbaijan adventure.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Plan Your Trip?',
        description: "Let us create your perfect Azerbaijan experience.",
        primaryButton: { text: 'Get a Quote', href: '/contact' },
        secondaryButton: { text: 'View Partners', href: '/partners' },
    },
];

const servicesBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Xidmətlərimiz',
        headline: 'Hərtərəfli Turizm',
        headlineAccent: 'Həlləri',
        text: 'Uçuş rezervasiyalarından bələdçili turlara, otel rezervasiyalarından viza dəstəyinə qədər—Azərbaycan təcrübənizi qüsursuz və unudulmaz etmək üçün tam səyahət xidmətləri təqdim edirik.',
    },
    {
        type: 'serviceDetails',
        serviceId: 'airTickets',
        title: 'Aviabilet Rezervasiyası',
        description: 'Dünyanın istənilən nöqtəsinə, eləcə də müntəzəm aviareyslər ilə Azərbaycana uçuşlar rezerv edin.',
        features: [
            'Qlobal aviaşirkət əlaqələri',
            'Rəqabətli qiymətlər',
            'Çevik rezervasiya variantları',
            'Çoxşəhərli marşrutlar',
            '24/7 rezervasiya dəstəyi',
        ],
        ctaText: 'Uçuşunuzu Rezerv Edin',
        ctaHref: '/contact',
        details: [
            { title: 'Beynəlxalq Uçuşlar', description: 'Rəqabətli qiymətlər və çevik yenidən rezervasiya variantları ilə dünya üzrə əsas aviaşirkətlərə qoşulmalar.', tags: ['Bütün əsas aviaşirkətlər', 'Ən yaxşı qiymət təminatı', 'E-bilet çatdırılması', 'Çoxşəhərli marşrutlar'] },
            { title: 'Daxili Uçuşlar', description: 'Azərbaycan daxili və qonşu ölkələrə daxili marşrutlar üçün sürətli və asan rezervasiya.', tags: ['Azərbaycan Hava Yolları', 'Regional daşıyıcılar', 'Eyni gün rezervasiya', 'Qrup endirmləri'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'travelPackages',
        title: 'Səyahət Paketləri və Turlar',
        description: 'Tematik turlar, VIP paketlər, MICE, biznes səyahət və fərdi marşrutlar daxil olmaqla seçilmiş təcrübələr.',
        features: [
            'Tematik və mədəni turlar',
            'VIP lüks paketlər',
            'MICE və korporativ tədbirlər',
            'Günlük turlar və ekskursiyalar',
            'Fərdi marşrutlar',
        ],
        ctaText: 'Paketləri Araşdırın',
        ctaHref: '/contact',
        details: [
            { title: 'Tur Növləri', description: 'Tematik, VIP, MICE, biznes səyahət, FIT/Qrup turları, günlük turlar və birləşdirilmiş regional turlar arasından seçin.', tags: ['Tematik', 'VIP', 'MICE', 'Biznes', 'FIT/Qrup', 'Günlük turlar'] },
            { title: 'Populyar Paketlər', description: 'Bakı, Qobustan, Abşeron, Qəbələ, Şəki və Şahdağı əhatə edən 3-7 gecəlik paketlərlə Azərbaycanı kəşf edin.', tags: ['3-4 gecə $119+', '4-5 gecə $155+', '5-6 gecə $219+', '6-7 gecə $245+'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'hotelReservation',
        title: 'Otel Rezervasiyası',
        description: 'Yüksək rezervasiya həcmimiz sayəsində xüsusi otel tarifləri əldə edirik, bu da bizə təminatlı keyfiyyətli xidmət ilə əla qiymətlər təklif etməyə imkan verir.',
        features: [
            '3-5 ulduzlu yerləşmə',
            'Xüsusi tərəfdaş tarifləri',
            'Keyfiyyət təminatı',
            'Mərkəzi yerlər',
            'Wellness kurortları',
        ],
        ctaText: 'Otelinizi Tapın',
        ctaHref: '/contact',
        details: [
            { title: 'Şəhər Otelləri', description: 'Bakı və digər əsas şəhərlərdə müştərilərimiz üçün xüsusi tariflərlə premium yerləşmə.', tags: ['Bakı mərkəzi', 'İçərişəhər', 'Dəniz kənarı', 'Biznes rayonları'] },
            { title: 'Wellness Kurortları', description: 'Naftalan müalicəvi yağ terapiyası, Şabran Ayurveda kurortları, Lənkəran Springs və Çenot Palace wellness proqramları.', tags: ['Naftalan', 'Şabran', 'Lənkəran', 'Qəbələ'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'transfers',
        title: 'Transfer Xidmətləri və Avtomobil İcarəsi',
        description: 'Bacarıqlı peşəkar sürücülərlə lüks avtomobillər, mikroavtobuslar və avtobuların yüksək səviyyəli parkını təklif edirik.',
        features: [
            'Hava limanı transferləri',
            'VIP avtomobillər və sedanlar',
            'Sprinter və mikroavtobuslar',
            'Qruplar üçün avtobuslar',
            'Peşəkar sürücülər',
        ],
        ctaText: 'Transfer Rezerv Edin',
        ctaHref: '/contact',
        details: [
            { title: 'Nəqliyyat Parkı', description: 'Sedan (1-2 nəfər), Vito (7+1), Sprinter (20+1), Isuzu (30 nəfər), Travego (52 nəfər) və VIP avtomobillər.', tags: ['Sedan', 'Vito', 'Sprinter', 'Isuzu', 'Travego', 'VIP'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'guiding',
        title: 'Peşəkar Bələdçilik',
        description: 'Təcrübəli bələdçilərimiz sizin dilinizdə danışır və Azərbaycan mədəniyyəti və tarixi haqqında dərin bilik paylaşır.',
        features: [
            'Çoxdilli bələdçilər',
            'Lisenziyalı peşəkarlar',
            'Yerli ekspertiza',
            'Mədəni biliklər',
            'Çevik planlaşdırma',
        ],
        ctaText: 'Bələdçi İstəyin',
        ctaHref: '/contact',
    },
    {
        type: 'serviceDetails',
        serviceId: 'visa',
        title: 'Viza və İmmiqrasiya Dəstəyi',
        description: 'Azərbaycanda vizalar və qeydiyyat mürəkkəb ola bilər; komandamız prosesi sürətli və asan edir.',
        features: [
            'E-viza köməyi',
            'Dəvət məktubları',
            'Qeydiyyat dəstəyi',
            'Sənəd hazırlanması',
            'Ekspress işlənmə',
        ],
        ctaText: 'Viza Köməyi Alın',
        ctaHref: '/contact',
    },
    {
        type: 'process',
        title: 'Necə İşləyirik',
        subtitle: 'Müstəsna səyahət təcrübələri üçün sübut edilmiş proses',
        steps: [
            { title: 'Konsultasiya', description: 'Səyahət məqsədləriniz, üstünlükləriniz və tarixləriniz haqqında bizə danışın.' },
            { title: 'Planlaşdırma', description: 'Ehtiyaclarınıza uyğun fərdiləşdirilmiş marşrut hazırlayırıq.' },
            { title: 'Rezervasiya', description: 'Bütün rezervasiyaları — uçuşlar, otellər, turlar, transferlər — biz idarə edirik.' },
            { title: 'Səyahət', description: 'Azərbaycan səyahətiniz boyunca 24/7 dəstək.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Səyahətinizi Planlamağa Hazırsınız?',
        description: 'Mükəmməl Azərbaycan təcrübənizi yaradaq.',
        primaryButton: { text: 'Qiymət Alın', href: '/contact' },
        secondaryButton: { text: 'Tərəfdaşlara Baxın', href: '/partners' },
    },
];

const partnersBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Network',
        headline: 'Trusted Tourism',
        headlineAccent: 'Partners',
        text: "We've built relationships with leading hotels, airlines, and tour operators across Azerbaijan, ensuring our clients receive exceptional service and experiences.",
    },
    {
        type: 'statsRow',
        stats: [
            { value: '50+', label: 'Partner Hotels' },
            { value: '10+', label: 'Airlines' },
            { value: '20+', label: 'Tour Operators' },
            { value: '10K+', label: 'Travelers Served' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Our Network',
        headline: 'Trusted Tourism Partners',
        description: 'We collaborate with leading hospitality and travel providers to deliver exceptional experiences.',
        partners: [
            { name: 'Garabagh Resort & SPA', location: 'Naftalan, Azerbaijan', specialty: 'Wellness & Healing Treatments' },
            { name: 'Chenot Palace', location: 'Gabala, Azerbaijan', specialty: 'Exclusive Wellness Retreat' },
            { name: 'Shabran Wellbeing Resort', location: 'Shabran, Azerbaijan', specialty: 'Ayurveda & Wellness' },
            { name: 'Lankaran Springs', location: 'Lankaran, Azerbaijan', specialty: 'Medical & Wellness Packages' },
        ],
    },
    {
        type: 'cta',
        headline: 'Become a Partner',
        description: 'Join our tourism network and expand your reach to international travelers visiting Azerbaijan.',
        primaryButton: { text: 'Partner With Us', href: '/contact' },
    },
];

const partnersBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Etibarlı Turizm',
        headlineAccent: 'Tərəfdaşları',
        text: 'Müştərilərimizin müstəsna xidmət və təcrübələr almasını təmin etmək üçün Azərbaycanda aparıcı otellər, aviaşirkətlər və tur operatorları ilə münasibətlər qurmuşuq.',
    },
    {
        type: 'statsRow',
        stats: [
            { value: '50+', label: 'Tərəfdaş Otellər' },
            { value: '10+', label: 'Aviaşirkətlər' },
            { value: '20+', label: 'Tur Operatorları' },
            { value: '10K+', label: 'Xidmət Edilən Səyahətçi' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Etibarlı Turizm Tərəfdaşları',
        description: 'Müstəsna təcrübələr təqdim etmək üçün aparıcı qonaqpərvərlik və səyahət təchizatçıları ilə əməkdaşlıq edirik.',
        partners: [
            { name: 'Qarabağ Resort & SPA', location: 'Naftalan, Azərbaycan', specialty: 'Wellness və Müalicə Terapiyası' },
            { name: 'Çenot Palace', location: 'Qəbələ, Azərbaycan', specialty: 'Eksklüziv Wellness Kurort' },
            { name: 'Şabran Wellbeing Resort', location: 'Şabran, Azərbaycan', specialty: 'Ayurveda və Wellness' },
            { name: 'Lənkəran Springs', location: 'Lənkəran, Azərbaycan', specialty: 'Tibbi və Wellness Paketlər' },
        ],
    },
    {
        type: 'cta',
        headline: 'Tərəfdaş Olun',
        description: 'Turizm şəbəkəmizə qoşulun və Azərbaycana gələn beynəlxalq səyahətçilərə əhatənizi genişləndirin.',
        primaryButton: { text: 'Bizimlə Tərəfdaş Olun', href: '/contact' },
    },
];

const contactBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Contact Us',
        headline: "Let's Start a Conversation",
        text: "Whether you're planning a vacation, organizing a corporate event, or seeking wellness experiences in Azerbaijan, our team is ready to help.",
    },
    {
        type: 'contact',
        headline: 'Get in Touch',
        description: 'Our team is available to answer your questions and help you plan your perfect Azerbaijan experience.',
        showForm: true,
        showMap: true,
    },
];


const contactBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Əlaqə',
        headline: 'Söhbətə Başlayaq',
        text: 'İstər tətil planlayırsınız, istər korporativ tədbir təşkil edirsiniz, istərsə də Azərbaycanda wellness təcrübələri axtarırsınız—komandamız kömək etməyə hazırdır.',
    },
    {
        type: 'contact',
        headline: 'Əlaqə Saxlayın',
        description: 'Komandamız suallarınıza cavab verməyə və mükəmməl Azərbaycan təcrübənizi planlamağa kömək etməyə hazırdır.',
        showForm: true,
        showMap: true,
    },
];

// ============================================
// Russian Content Blocks
// ============================================

const homeBlocksRu: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Базируемся в Баку\nВаш путь в Азербайджан',
        subtagline: 'Silkbridge International специализируется на широком спектре комплексных туристических услуг в Азербайджане.',
        ctaPrimary: { text: 'Наши услуги', href: '/services' },
        ctaSecondary: { text: 'Туристические пакеты', href: '/services#packages' },
    },
    {
        type: 'about',
        eyebrow: 'Кто мы?',
        headline: 'Опыт, талант',
        headlineAccent: 'Гостеприимство',
        mission: 'Silkbridge International специализируется на широком спектре комплексных туристических услуг в Азербайджане. Наш опыт, талант, гостеприимство, гибкость и экспертиза гармонично сочетаются для удовлетворения ваших пожеланий и всех потребностей в путешествиях и отдыхе.',
        pillars: [
            { title: 'Качество — наш фокус', description: 'Мы придерживаемся высочайших стандартов, обеспечивая исключительный опыт.', icon: 'quality' },
            { title: 'Опыт', description: 'Многолетний опыт в туризме и индустрии гостеприимства Азербайджана.', icon: 'experience' },
            { title: 'Персональный сервис', description: 'Индивидуальные решения для ваших уникальных потребностей в путешествиях.', icon: 'personal' },
            { title: 'Уникальность', description: 'Откройте для себя неповторимые впечатления в Азербайджане.', icon: 'unique' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'НАШИ УСЛУГИ',
        headline: 'Комплексные туристические решения',
        services: [
            {
                title: 'Бронирование авиабилетов',
                description: 'Бронируйте авиабилеты в любую точку мира и в Азербайджан на регулярных авиарейсах.',
                features: [
                    'Глобальные авиасообщения',
                    'Конкурентные цены',
                    'Гибкие варианты бронирования',
                    'Маршруты с несколькими городами',
                    'Поддержка бронирования 24/7',
                ],
                cta: { text: 'Подробнее', href: '/services#flights' },
            },
            {
                title: 'Туристические пакеты и туры',
                description: 'Курируемые впечатления, включая тематические туры, VIP-пакеты, MICE, деловые поездки и индивидуальные маршруты.',
                features: [
                    'Индивидуальные туры',
                    'Культурные впечатления',
                    'Приключенческий туризм',
                    'Экскурсии по городу',
                    'Групповые и частные туры',
                ],
                cta: { text: 'Посмотреть пакеты', href: '/services#packages' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Туристическая аналитика',
        headline: 'Туризм Азербайджана одним взглядом',
        subheadline: 'Ключевые показатели растущей туристической индустрии Азербайджана',
        stats: [
            { value: '3.5M', label: 'Туристов ежегодно', note: 'Министерство культуры' },
            { value: '15%', label: 'Рост туризма г/г', note: 'Совет по туризму' },
            { value: '850+', label: 'Отелей и курортов', note: 'Данные отрасли' },
            { value: '$2.1B', label: 'Доход от туризма', note: 'Госстатистика' },
        ],
        ctaText: 'Исследуйте Азербайджан',
        ctaHref: '/services',
    },
    {
        type: 'partners',
        eyebrow: 'Наша сеть',
        headline: 'Нам доверяют ведущие поставщики услуг гостеприимства',
        description: 'Мы сотрудничаем с премиальными отелями, курортами и туроператорами по всему Азербайджану.',
        ctaText: 'Наши партнёры',
        ctaHref: '/partners',
    },
    {
        type: 'contact',
        eyebrow: 'Связаться с нами',
        headline: 'Начнём планировать ваше путешествие',
        description: 'Свяжитесь с нами, чтобы узнать больше о наших услугах и начать ваше приключение в Азербайджане.',
        showForm: true,
        showMap: true,
    },
];

const aboutBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'О нас',
        headline: 'Опыт, талант',
        headlineAccent: 'Гостеприимство',
        text: 'Silkbridge International специализируется на широком спектре комплексных туристических услуг в Азербайджане. Наш опыт, талант, гостеприимство, гибкость и экспертиза гармонично сочетаются для удовлетворения ваших пожеланий и всех потребностей в путешествиях и отдыхе.',
    },
    {
        type: 'storyline',
        title: 'Наш путь',
        text: 'От локальных корней до глобального охвата — узнайте, как Silkbridge стал ведущим туристическим партнером Азербайджана.',
        beats: [
            { id: '1', year: '2010', kicker: 'НАЧАЛО', title: 'Основание в Баку', description: 'Silkbridge International была основана со страстью показать красоту и культуру Азербайджана путешественникам со всего мира.' },
            { id: '2', year: '2013', kicker: 'РАСШИРЕНИЕ', title: 'MICE и Корпоративы', description: 'Мы расширили наши услуги, включив комплексные решения MICE, поддерживая международные конференции и корпоративные мероприятия в Баку.' },
            { id: '3', year: '2016', kicker: 'ИННОВАЦИИ', title: 'Авторские пакеты', description: 'Запустили наши фирменные маршруты "Шелковый путь", позволяющие гостям исследовать регионы за пределами Баку, такие как Шеки и Габала.' },
            { id: '4', year: '2019', kicker: 'ПАРТНЕРСТВА', title: 'Сеть отелей', description: 'Установили прямые партнерские отношения с более чем 50 премиальными отелями и курортами по всему Азербайджану.' },
            { id: '5', year: '2022', kicker: 'ЗДОРОВЬЕ', title: 'Оздоровительный туризм', description: 'Представили специализированные велнес-программы в партнерстве с курортами Нафталан и Chenot Palace.' },
            { id: '6', year: '2025', kicker: 'СЕГОДНЯ', title: 'Ведущий путь', description: 'Сегодня мы обслуживаем более 10 000 довольных путешественников ежегодно, объединяя Восток и Запад с современной роскошью.' },
        ],
    },
    {
        type: 'values',
        title: 'Почему выбирают нас?',
        subtitle: 'Принципы, которыми мы руководствуемся в каждом путешествии',
        values: [
            { title: 'Качество — наш фокус', description: 'Мы придерживаемся высочайших стандартов, обеспечивая исключительный опыт, превосходящий ожидания.' },
            { title: 'Опыт', description: 'Многолетняя экспертиза в туризме и индустрии гостеприимства Азербайджана.' },
            { title: 'Персональный сервис', description: 'Индивидуальные решения для ваших уникальных потребностей и предпочтений в путешествиях.' },
            { title: 'Уникальность', description: 'Откройте для себя неповторимые впечатления, демонстрирующие лучшее в Азербайджане.' },
        ],
    },
    {
        type: 'team',
        title: 'Наша команда',
        subtitle: 'Опытные профессионалы, посвящённые вашему идеальному азербайджанскому опыту',
        members: [
            { name: 'Лейла Алиева', role: 'Основатель и CEO', bio: '15+ лет в туризме Азербайджана, специализация на люксовых путешествиях и культурном опыте.' },
            { name: 'Рашид Мамедов', role: 'Руководитель туроперирования', bio: 'Эксперт-гид с глубокими знаниями регионов и достопримечательностей Азербайджана.' },
            { name: 'Нигяр Гасанова', role: 'Директор по работе с клиентами', bio: 'Мультиязычный профессионал, обеспечивающий безупречный сервис для международных гостей.' },
            { name: 'Эльвин Гусейнов', role: 'MICE и корпоративный менеджер', bio: 'Специалист по деловым поездкам, конференциям и корпоративным мероприятиям в Азербайджане.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Готовы исследовать Азербайджан?',
        description: 'Позвольте нам создать ваш идеальный азербайджанский опыт с нашей местной экспертизой и персональным сервисом.',
        primaryButton: { text: 'Спланировать поездку', href: '/contact' },
    },
];

const servicesBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Наши услуги',
        headline: 'Комплексные туристические',
        headlineAccent: 'решения',
        text: 'От бронирования авиабилетов до экскурсий с гидом, от бронирования отелей до визовой поддержки — мы предоставляем полный спектр услуг для незабываемого опыта в Азербайджане.',
    },
    {
        type: 'serviceDetails',
        serviceId: 'airTickets',
        title: 'Бронирование авиабилетов',
        description: 'Бронируйте авиабилеты в любую точку мира и в Азербайджан на регулярных рейсах.',
        features: [
            'Глобальные авиасообщения',
            'Конкурентные цены',
            'Гибкие варианты бронирования',
            'Маршруты с несколькими городами',
            'Поддержка 24/7',
        ],
        ctaText: 'Забронировать рейс',
        ctaHref: '/contact',
        details: [
            { title: 'Международные рейсы', description: 'Связи с крупными авиакомпаниями мира с конкурентными тарифами и гибким перебронированием.', tags: ['Все крупные авиакомпании', 'Гарантия лучшей цены', 'E-билеты', 'Многогородовые маршруты'] },
            { title: 'Внутренние рейсы', description: 'Быстрое и лёгкое бронирование внутренних рейсов в Азербайджане и соседних странах.', tags: ['Azerbaijan Airlines', 'Региональные перевозчики', 'Бронирование в тот же день', 'Групповые скидки'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'travelPackages',
        title: 'Турпакеты и туры',
        description: 'Курируемые впечатления: тематические туры, VIP-пакеты, MICE, деловые поездки и индивидуальные маршруты.',
        features: [
            'Тематические и культурные туры',
            'VIP люкс-пакеты',
            'MICE и корпоративные мероприятия',
            'Однодневные экскурсии',
            'Индивидуальные маршруты',
        ],
        ctaText: 'Смотреть пакеты',
        ctaHref: '/contact',
        details: [
            { title: 'Типы туров', description: 'Выбирайте из тематических, VIP, MICE, деловых, FIT/групповых туров, однодневных экскурсий и комбинированных региональных туров.', tags: ['Тематические', 'VIP', 'MICE', 'Деловые', 'FIT/Группа', 'Однодневные'] },
            { title: 'Популярные пакеты', description: 'Исследуйте Азербайджан с 3-7 ночными пакетами по Баку, Гобустану, Абшерону, Габале, Шеки и Шахдагу.', tags: ['3-4 ночи $119+', '4-5 ночей $155+', '5-6 ночей $219+', '6-7 ночей $245+'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'hotelReservation',
        title: 'Бронирование отелей',
        description: 'Благодаря большому объёму бронирований мы получаем специальные тарифы, что позволяет предлагать отличные цены с гарантией качества.',
        features: [
            'Размещение 3-5 звёзд',
            'Специальные партнёрские тарифы',
            'Гарантия качества',
            'Центральные локации',
            'Велнес-курорты',
        ],
        ctaText: 'Найти отель',
        ctaHref: '/contact',
        details: [
            { title: 'Городские отели', description: 'Премиальное размещение в Баку и других крупных городах со специальными тарифами для наших клиентов.', tags: ['Центр Баку', 'Старый город', 'Приморский', 'Бизнес-районы'] },
            { title: 'Велнес-курорты', description: 'Лечение нафталаном, Аюрведа–курорты Шабрана, Ленкоранские источники и программы Chenot Palace.', tags: ['Нафталан', 'Шабран', 'Ленкоран', 'Габала'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'transfers',
        title: 'Трансферы и аренда авто',
        description: 'Мы предлагаем парк люксовых автомобилей, микроавтобусов и автобусов с профессиональными водителями.',
        features: [
            'Трансферы из аэропорта',
            'VIP-автомобили и седаны',
            'Спринтеры и микроавтобусы',
            'Автобусы для групп',
            'Профессиональные водители',
        ],
        ctaText: 'Заказать трансфер',
        ctaHref: '/contact',
        details: [
            { title: 'Автопарк', description: 'Седан (1-2 чел.), Vito (7+1), Sprinter (20+1), Isuzu (30 чел.), Travego (52 чел.) и VIP-авто.', tags: ['Седан', 'Vito', 'Sprinter', 'Isuzu', 'Travego', 'VIP'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'guiding',
        title: 'Профессиональные гиды',
        description: 'Наши опытные гиды говорят на вашем языке и делятся глубокими знаниями о культуре и истории Азербайджана.',
        features: [
            'Многоязычные гиды',
            'Лицензированные профессионалы',
            'Местная экспертиза',
            'Культурные инсайты',
            'Гибкий график',
        ],
        ctaText: 'Запросить гида',
        ctaHref: '/contact',
    },
    {
        type: 'serviceDetails',
        serviceId: 'visa',
        title: 'Визовая поддержка',
        description: 'Визы и регистрация в Азербайджане могут быть сложными; наша команда делает процесс быстрым и лёгким.',
        features: [
            'Помощь с e-визой',
            'Приглашения',
            'Поддержка регистрации',
            'Подготовка документов',
            'Экспресс-обработка',
        ],
        ctaText: 'Получить помощь с визой',
        ctaHref: '/contact',
    },
    {
        type: 'process',
        title: 'Как мы работаем',
        subtitle: 'Проверенный процесс для исключительных путешествий',
        steps: [
            { title: 'Консультация', description: 'Расскажите о ваших целях, предпочтениях и датах путешествия.' },
            { title: 'Планирование', description: 'Мы разрабатываем индивидуальный маршрут под ваши потребности.' },
            { title: 'Бронирование', description: 'Мы берём на себя все бронирования — рейсы, отели, туры, трансферы.' },
            { title: 'Путешествие', description: 'Поддержка 24/7 на протяжении всего вашего азербайджанского приключения.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Готовы спланировать поездку?',
        description: 'Позвольте нам создать ваш идеальный азербайджанский опыт.',
        primaryButton: { text: 'Получить предложение', href: '/contact' },
        secondaryButton: { text: 'Наши партнёры', href: '/partners' },
    },
];

const partnersBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Наша сеть',
        headline: 'Надёжные туристические',
        headlineAccent: 'партнёры',
        text: 'Мы построили отношения с ведущими отелями, авиакомпаниями и туроператорами по всему Азербайджану, обеспечивая клиентам исключительный сервис и впечатления.',
    },
    {
        type: 'statsRow',
        stats: [
            { value: '50+', label: 'Партнёрских отелей' },
            { value: '10+', label: 'Авиакомпаний' },
            { value: '20+', label: 'Туроператоров' },
            { value: '10K+', label: 'Обслуженных путешественников' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Наша сеть',
        headline: 'Надёжные туристические партнёры',
        description: 'Мы сотрудничаем с ведущими поставщиками услуг гостеприимства для предоставления исключительного опыта.',
        partners: [
            { name: 'Garabagh Resort & SPA', location: 'Нафталан, Азербайджан', specialty: 'Велнес и лечение' },
            { name: 'Chenot Palace', location: 'Габала, Азербайджан', specialty: 'Эксклюзивный велнес-курорт' },
            { name: 'Shabran Wellbeing Resort', location: 'Шабран, Азербайджан', specialty: 'Аюрведа и велнес' },
            { name: 'Lankaran Springs', location: 'Ленкоран, Азербайджан', specialty: 'Медицинские и велнес-пакеты' },
        ],
    },
    {
        type: 'cta',
        headline: 'Стать партнёром',
        description: 'Присоединяйтесь к нашей туристической сети и расширьте охват международных путешественников в Азербайджан.',
        primaryButton: { text: 'Стать партнёром', href: '/contact' },
    },
];

const contactBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Контакты',
        headline: 'Давайте начнём разговор',
        text: 'Планируете отпуск, организуете корпоративное мероприятие или ищете велнес-опыт в Азербайджане — наша команда готова помочь.',
    },
    {
        type: 'contact',
        headline: 'Связаться с нами',
        description: 'Наша команда готова ответить на ваши вопросы и помочь спланировать идеальное путешествие в Азербайджан.',
        showForm: true,
        showMap: true,
    },
];

// ============================================
// Main Seed Function
// ============================================


async function main() {
    console.log('🌱 Starting database seed...\n');

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

    const localeRu = await prisma.locale.create({
        data: {
            code: 'ru',
            name: 'Russian',
            nativeName: 'Русский',
            flag: '🇷🇺',
            isRTL: false,
            isDefault: false,
            isEnabled: true,
        },
    });
    console.log(`  ✓ Created locales: ${localeEn.code}, ${localeAz.code}, ${localeRu.code}\n`);

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

    // Create pages
    console.log('📄 Creating pages...');
    const pageConfigs = [
        { slug: 'home', enTitle: 'Home', azTitle: 'Ana Səhifə', ruTitle: 'Главная', enBlocks: homeBlocksEn, azBlocks: homeBlocksAz, ruBlocks: homeBlocksRu },
        { slug: 'about', enTitle: 'About', azTitle: 'Haqqımızda', ruTitle: 'О нас', enBlocks: aboutBlocksEn, azBlocks: aboutBlocksAz, ruBlocks: aboutBlocksRu },
        { slug: 'services', enTitle: 'Services', azTitle: 'Xidmətlər', ruTitle: 'Услуги', enBlocks: servicesBlocksEn, azBlocks: servicesBlocksAz, ruBlocks: servicesBlocksRu },
        { slug: 'partners', enTitle: 'Partners', azTitle: 'Tərəfdaşlar', ruTitle: 'Партнёры', enBlocks: partnersBlocksEn, azBlocks: partnersBlocksAz, ruBlocks: partnersBlocksRu },
        { slug: 'contact', enTitle: 'Contact', azTitle: 'Əlaqə', ruTitle: 'Контакты', enBlocks: contactBlocksEn, azBlocks: contactBlocksAz, ruBlocks: contactBlocksRu },
    ];

    for (const config of pageConfigs) {
        const page = await prisma.page.create({
            data: {
                slug: config.slug,
            },
        });

        // Create English translation
        await prisma.pageTranslation.create({
            data: {
                pageId: page.id,
                localeCode: 'en',
                title: config.enTitle,
                seoTitle: `${config.enTitle} | Silkbridge International`,
                seoDescription: `${config.enTitle} page for Silkbridge International - connecting markets and health tourism across borders.`,
                blocks: config.enBlocks as unknown as object,
                status: 'PUBLISHED' as PageStatus,
            },
        });

        // Create Azerbaijani translation
        await prisma.pageTranslation.create({
            data: {
                pageId: page.id,
                localeCode: 'az',
                title: config.azTitle,
                seoTitle: `${config.azTitle} | Silkbridge International`,
                seoDescription: `${config.azTitle} səhifəsi - Silkbridge International bazarları və sağlamlıq turizmini birləşdirir.`,
                blocks: config.azBlocks as unknown as object,
                status: 'PUBLISHED' as PageStatus,
            },
        });

        // Create Russian translation
        await prisma.pageTranslation.create({
            data: {
                pageId: page.id,
                localeCode: 'ru',
                title: config.ruTitle,
                seoTitle: `${config.ruTitle} | Silkbridge International`,
                seoDescription: `${config.ruTitle} - Silkbridge International объединяет рынки и медицинский туризм через границы.`,
                blocks: config.ruBlocks as unknown as object,
                status: 'PUBLISHED' as PageStatus,
            },
        });

        console.log(`  ✓ Created page: ${config.slug}`);
    }

    // Create site settings
    console.log('\n⚙️ Creating site settings...');
    const settings = await prisma.siteSettings.create({
        data: {
            id: '1',
            siteName: 'Silkbridge International',
            contactEmail: 'contact@silkbridge.com',
            contactPhone: '+1 (555) 123-4567',
            contactAddress: '350 Fifth Avenue, Suite 7820, New York, NY 10118',
            socialLinks: {
                linkedin: 'https://linkedin.com/company/silkbridge',
                twitter: 'https://twitter.com/silkbridge',
            },
        },
    });

    // Create settings translations
    await prisma.siteSettingsTranslation.create({
        data: {
            settingsId: settings.id,
            localeCode: 'en',
            tagline: 'Bridging global healthcare markets with precision, compliance, and care.',
            footerText: '© {year} Silkbridge International. All rights reserved.',
        },
    });

    await prisma.siteSettingsTranslation.create({
        data: {
            settingsId: settings.id,
            localeCode: 'az',
            tagline: 'Qlobal səhiyyə bazarlarını dəqiqlik, uyğunluq və qayğı ilə birləşdiririk.',
            footerText: '© {year} Silkbridge International. Bütün hüquqlar qorunur.',
        },
    });

    await prisma.siteSettingsTranslation.create({
        data: {
            settingsId: settings.id,
            localeCode: 'ru',
            tagline: 'Связываем глобальные рынки здравоохранения с точностью, соответствием и заботой.',
            footerText: '© {year} Silkbridge International. Все права защищены.',
        },
    });
    console.log('  ✓ Created site settings\n');

    console.log('✅ Database seeded successfully!\n');
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
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
