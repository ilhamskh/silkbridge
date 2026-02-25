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
        tagline: 'Based in Baku\nExcellence in Health Tourism & Pharma',
        subtagline: 'Silkbridge International connects you to world-class medical wellness, pharmaceutical market access, and comprehensive travel services in Azerbaijan.',
        ctaPrimary: { text: 'Health Tourism', href: '/services' },
        ctaSecondary: { text: 'Pharma Solutions', href: '/services#packages' },
        quickLinks: [
            { text: 'Wellness', href: '/services#visa' },
            { text: 'Pharma', href: '/services#tours' },
            { text: 'Tours', href: '/services#hotels' },
            { text: 'Contact', href: '/services#transport' },
        ],
    },
    {
        type: 'about',
        eyebrow: 'Who are we?',
        headline: 'Experience, Talent',
        headlineAccent: 'Hospitality',
        mission: 'Silkbridge International is your premier partner for health tourism and pharmaceutical business in Azerbaijan. We combine medical wellness expertise with professional market entry support, wrapped in our signature hospitality to ensure a seamless experience for patients and partners.',
        pillars: [
            { title: 'Quality is our focus', description: 'We partner with accredited medical institutions and certified distributors.', icon: 'quality' },
            { title: 'Experience', description: 'Decades of expertise in medical logistics and pharma regulations.', icon: 'experience' },
            { title: 'Personal service', description: 'Dedicated patient coordinators and business consultants providing 24/7 support.', icon: 'personal' },
            { title: 'Uniqueness', description: 'The only agency integrating wellness journeys with market access.', icon: 'unique' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'OUR SERVICES',
        headline: 'Comprehensive Solutions',
        services: [
            {
                title: 'Medical & Corporate Flights',
                description: 'Seamless flight arrangements for patients, medical delegations, and corporate teams to and from Azerbaijan.',
                features: [
                    'Medical stretcher flights',
                    'Corporate group booking',
                    'Flexible changes',
                    'Multi-city itineraries',
                    '24/7 support',
                ],
                cta: { text: 'Flight Services', href: '/services#flights' },
            },
            {
                title: 'Health & Business Itineraries',
                description: 'Curated experiences for wellness retreats, post-treatment recovery, and pharmaceutical business inspections.',
                features: [
                    'Wellness retreats',
                    'Medical recovery tours',
                    'Pharma delegation trips',
                    'Site inspections',
                    'Corporate hospitality',
                ],
                cta: { text: 'View Itineraries', href: '/services#packages' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Market Insights',
        headline: 'Azerbaijan Health & Business',
        subheadline: 'Key statistics shaping Azerbaijan\'s growing health and pharma sectors',
        stats: [
            { value: '15k+', label: 'Medical Tourists', note: 'Annual Growth' },
            { value: '20+', label: 'Accredited Clinics', note: 'JCI & ISO Certified' },
            { value: '12%', label: 'Pharma Market Growth', note: 'Year over Year' },
            { value: '$450M', label: 'Market Value', note: 'Healthcare Sector' },
        ],
        ctaText: 'Explore Opportunities',
        ctaHref: '/services',
    },
    {
        type: 'insightsList',
        eyebrow: 'Latest News',
        headline: 'Insights & Updates',
        viewAllHref: '/insights',
        items: [
            { title: 'The Rise of Naftalan Therapy', excerpt: 'How natural oil baths are attracting patients worldwide.', date: 'Oct 15, 2023', href: '/insights/top-10-baku' },
            { title: 'Silkbridge at Arab Health 2024', excerpt: 'Showcasing Azerbaijan\'s medical potential in Dubai.', date: 'Nov 2, 2023', href: '/insights/atm-dubai' },
            { title: 'Pharma Market Entry Guide', excerpt: 'Key regulations for international companies entering Azerbaijan.', date: 'Dec 10, 2023', href: '/insights/wellness-tourism' },
        ],
    },
    {
        type: 'testimonials',
        eyebrow: 'Testimonials',
        headline: 'What Our Clients Say',
        testimonials: [
            { quote: "The medical coordination for my father's treatment was flawless. Silkbridge handled everything with care.", author: "Sarah Johnson", role: "Patient Family", company: "UK" },
            { quote: "Invaluable support for our pharmaceutical market entry. Professional, compliant, and well-connected.", author: "Michael Chen", role: "Director", company: "PharmaCorp" },
            { quote: "A perfect mix of business meetings and cultural recovery tours for our delegation.", author: "Elena Petrov", role: "Group Leader", company: "MediGroup" },
        ],
    },
    {
        type: 'logoGrid',
        eyebrow: 'Our Partners',
        headline: 'Trusted by Global Brands',
        logos: [
            { name: 'Hilton', logo: 'https://placehold.co/200x80?text=Hilton', href: '#' },
            { name: 'Chenot', logo: 'https://placehold.co/200x80?text=Chenot', href: '#' },
            { name: 'Acibadem', logo: 'https://placehold.co/200x80?text=Acibadem', href: '#' },
            { name: 'Four Seasons', logo: 'https://placehold.co/200x80?text=Four+Seasons', href: '#' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Our Network',
        headline: 'Trusted by Leading Medical Institutions',
        description: 'We partner with premier clinics, wellness resorts, and pharma distributors across Azerbaijan.',
        ctaText: 'View Our Partners',
        ctaHref: '/partners',
    },
    {
        type: 'contact',
        eyebrow: 'Get in Touch',
        headline: "Let's Plan Your Journey",
        description: "Contact us to discuss your health tourism needs or pharmaceutical business objectives.",
        showForm: true,
        showMap: true,
    },
];

const homeBlocksAz: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Bakıda Yerləşən\nSağlamlıq Turizmi və Əczaçılıqda Mükəmməllik',
        subtagline: 'Silkbridge International sizi dünya səviyyəli tibbi wellness, əczaçılıq bazarına çıxış və Azərbaycanda hərtərəfli səyahət xidmətləri ilə təmin edir.',
        ctaPrimary: { text: 'Sağlamlıq Turizmi', href: '/services' },
        ctaSecondary: { text: 'Farma Həlləri', href: '/services#packages' },
        quickLinks: [
            { text: 'Wellness', href: '/services#visa' },
            { text: 'Farma', href: '/services#tours' },
            { text: 'Turlar', href: '/services#hotels' },
            { text: 'Əlaqə', href: '/services#transport' },
        ],
    },
    {
        type: 'about',
        eyebrow: 'Biz Kimik?',
        headline: 'Təcrübə, İstedad',
        headlineAccent: 'Qonaqpərvərlik',
        mission: 'Silkbridge International Azərbaycanda sağlamlıq turizmi və əczaçılıq biznesi üçün sizin əsas tərəfdaşınızdır. Biz pasiyentlər və tərəfdaşlar üçün qüsursuz bir təcrübə təmin etmək məqsədilə tibbi wellness ekspertizasını peşəkar bazara giriş dəstəyi ilə birləşdirir, özünəməxsus qonaqpərvərliyimizlə təqdim edirik.',
        pillars: [
            { title: 'Keyfiyyət fokusumzdur', description: 'Akkreditə olunmuş tibbi müəssisələr və sertifikatlı distribyutorlarla əməkdaşlıq edirik.', icon: 'quality' },
            { title: 'Təcrübə', description: 'Tibbi logistika və farma tənzimləmələri sahəsində onilliklərin təcrübəsi.', icon: 'experience' },
            { title: 'Fərdi xidmət', description: 'Pasiyentlər və biznes nümayəndə heyətləri üçün 24/7 dəstək verən fərdi koordinatorlar.', icon: 'personal' },
            { title: 'Unikallıq', description: 'Wellness səyahətlərini bazara çıxışla birləşdirən yeganə agentlik.', icon: 'unique' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'XİDMƏTLƏRİMİZ',
        headline: 'Hərtərəfli Həllər',
        services: [
            {
                title: 'Tibbi və Korporativ Uçuşlar',
                description: 'Pasiyentlər, tibbi nümayəndə heyətləri və korporativ komandalar üçün Azərbaycana və əks istiqamətdə qüsursuz uçuş təşkili.',
                features: [
                    'Tibbi xərəklə uçuşlar',
                    'Korporativ qrup rezervasiyası',
                    'Çevik dəyişikliklər',
                    'Çoxşəhərli marşrutlar',
                    '24/7 dəstək',
                ],
                cta: { text: 'Uçuş Xidmətləri', href: '/services#flights' },
            },
            {
                title: 'Sağlamlıq və Biznes Marşrutları',
                description: 'Wellness istirahətləri, müalicə sonrası bərpa və əczaçılıq biznesi yoxlamaları üçün seçilmiş təcrübələr.',
                features: [
                    'Wellness istirahətləri',
                    'Tibbi bərpa turları',
                    'Farma nümayəndə heyəti səfərləri',
                    'Obyekt inspeksiyaları',
                    'Korporativ qonaqpərvərlik',
                ],
                cta: { text: 'Marşrutlara Baxın', href: '/services#packages' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Bazar Məlumatları',
        headline: 'Azərbaycan Səhiyyə və Biznes',
        subheadline: 'Azərbaycanın inkişaf edən səhiyyə və farma sektorlarını formalaşdıran əsas göstəricilər',
        stats: [
            { value: '15k+', label: 'Tibbi Turist', note: 'İllik Artım' },
            { value: '20+', label: 'Akkreditəli Klinika', note: 'JCI və ISO Sertifikatlı' },
            { value: '12%', label: 'Farma Bazar Artımı', note: 'İllik' },
            { value: '$450M', label: 'Bazar Dəyəri', note: 'Səhiyyə Sektoru' },
        ],
        ctaText: 'İmkanları Araşdırın',
        ctaHref: '/services',
    },
    {
        type: 'insightsList',
        eyebrow: 'Son Xəbərlər',
        headline: 'Məlumatlar və Yeniliklər',
        viewAllHref: '/insights',
        items: [
            { title: 'Naftalan Terapiyasının Yüksəlişi', excerpt: 'Təbii neft vannaları dünya üzrə pasiyentləri necə cəlb edir.', date: '15 Okt 2023', href: '/insights/top-10-baku' },
            { title: 'Silkbridge Arab Health 2024-də', excerpt: 'Azərbaycanın tibbi potensialını Dubayda nümayiş etdiririk.', date: '2 Noy 2023', href: '/insights/atm-dubai' },
            { title: 'Farma Bazarına Giriş Bələdçisi', excerpt: 'Azərbaycana daxil olan beynəlxalq şirkətlər üçün əsas qaydalar.', date: '10 Dek 2023', href: '/insights/wellness-tourism' },
        ],
    },
    {
        type: 'testimonials',
        eyebrow: 'Rəylər',
        headline: 'Müştərilərimiz nə deyir',
        testimonials: [
            { quote: "Atamın müalicəsi üçün tibbi koordinasiya qüsursuz idi. Silkbridge hər şeyi qayğı ilə həll etdi.", author: "Sarah Johnson", role: "Pasiyent Ailəsi", company: "Böyük Britaniya" },
            { quote: "Əczaçılıq bazarına girişimiz üçün əvəzolunmaz dəstək. Peşəkar, qaydalara uyğun və geniş əlaqəli.", author: "Michael Chen", role: "Direktor", company: "PharmaCorp" },
            { quote: "Nümayəndə heyətimiz üçün biznes görüşləri və mədəni bərpa turlarının mükəmməl qarışığı.", author: "Elena Petrov", role: "Qrup Rəhbəri", company: "MediGroup" },
        ],
    },
    {
        type: 'logoGrid',
        eyebrow: 'Tərəfdaşlarımız',
        headline: 'Qlobal Brendlər Tərəfindən Etibar Edilir',
        logos: [
            { name: 'Hilton', logo: 'https://placehold.co/200x80?text=Hilton', href: '#' },
            { name: 'Chenot', logo: 'https://placehold.co/200x80?text=Chenot', href: '#' },
            { name: 'Acibadem', logo: 'https://placehold.co/200x80?text=Acibadem', href: '#' },
            { name: 'Four Seasons', logo: 'https://placehold.co/200x80?text=Four+Seasons', href: '#' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Aparıcı Tibbi Müəssisələr Tərəfindən Etibar Edilir',
        description: 'Azərbaycan üzrə aparıcı klinikalar, wellness kurortları və farma distribyutorları ilə əməkdaşlıq edirik.',
        ctaText: 'Tərəfdaşlarımızı Görün',
        ctaHref: '/partners',
    },
    {
        type: 'contact',
        eyebrow: 'Əlaqə',
        headline: 'Səyahətinizi Planlaşdırmağa Başlayaq',
        description: 'Sağlamlıq turizmi ehtiyaclarınızı və ya əczaçılıq biznesi hədəflərinizi müzakirə etmək üçün bizimlə əlaqə saxlayın.',
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
        text: 'Silkbridge International is your premier partner for health tourism and pharmaceutical business in Azerbaijan. We combine medical wellness expertise with professional market entry support, wrapped in our signature hospitality to ensure a seamless experience.',
    },
    {
        type: 'storyline',
        title: 'Our Journey',
        text: 'From local roots to global reach, discover how Silkbridge became Azerbaijan’s premier medical tourism partner.',
        beats: [
            { id: '1', year: '2010', kicker: 'ORIGINS', title: 'Founded in Baku', description: 'Silkbridge International was founded with a passion for showcasing the healing potential of Azerbaijan to the world.' },
            { id: '2', year: '2013', kicker: 'EXPANSION', title: 'Pharma Logistics', description: 'We expanded our services to include pharmaceutical logistics and regulatory support for international companies.' },
            { id: '3', year: '2016', kicker: 'INNOVATION', title: 'Medical Packages', description: 'Launched our signature "Health & Heritage" custom itineraries, combining treatments with cultural discovery.' },
            { id: '4', year: '2019', kicker: 'PARTNERSHIPS', title: 'Clinical Network', description: 'Established direct partnerships with top clinics and Naftalan resorts, ensuring priority access for our clients.' },
            { id: '5', year: '2022', kicker: 'WELLNESS', title: 'Holistic Centers', description: 'Partnered with Chenot Palace and other luxury wellness centers to offer premium detox and anti-aging programs.' },
            { id: '6', year: '2025', kicker: 'TODAY', title: 'Market Leader', description: 'Today, we are the trusted gateway for medical tourists and pharmaceutical businesses, bridging East and West.' },
        ],
    },
    {
        type: 'values',
        title: 'Why Choose Us?',
        subtitle: 'The principles that guide every journey we create',
        values: [
            { title: 'Quality is Our Focus', description: 'We partner only with accredited medical institutions and certified distributors.' },
            { title: 'Experience', description: 'Decades of expertise in medical logistics and pharma regulations.' },
            { title: 'Personal Service', description: 'Dedicated patient coordinators and business consultants providing 24/7 support.' },
            { title: 'Uniqueness', description: 'The only agency integrating wellness journeys with market access.' },
        ],
    },
    {
        type: 'team',
        title: 'Our Team',
        subtitle: 'Experienced professionals dedicated to your health and business success',
        members: [
            { name: 'Leyla Aliyeva', role: 'Founder & CEO', bio: '15+ years in medical tourism, specializing in patient care and clinic partnerships.' },
            { name: 'Rashid Mammadov', role: 'Head of Pharma', bio: 'Expert in pharmaceutical regulations, registration, and market entry strategies.' },
            { name: 'Nigar Hasanova', role: 'Patient Coordinator', bio: 'Multilingual professional ensuring seamless journeys for international patients.' },
            { name: 'Elvin Huseynov', role: 'Corporate Manager', bio: 'Specialist in business logistics, delegation visits, and MICE events.' },
        ],
    },
    {
        type: 'team',
        title: 'The Leaders of the Medical Scientific Council',
        subtitle: 'SILKBRIDGE – The leaders of the Medical Scientific Council are a team of professionals who represent Azerbaijani healthcare at the international level.',
        members: [
            { name: 'Dr. Khalilzade Rovshan', role: 'Head of the Department of Neurosurgery of the Azerbaijan Medical University, Chairman of the Association of Neurosurgeons, Doctor of Philosophy, Associate Professor' },
            { name: 'Prof. Dr. Ahmadov Ilham Samidoglu', role: 'Professor of the Department of Urology, Azerbaijan Medical University, Doctor of Medical Sciences, Chairman of the Association of Urologists and Andrologists' },
            { name: 'Abbasov Eldar Shamkhaloglu', role: 'Professor of the Department of Traumatology, Azerbaijan Medical University, Doctor of Medical Sciences' },
            { name: 'Babek Salek Gannadi', role: 'Chief Endocrinologist of the Republic of Azerbaijan' },
            { name: 'Tural Pashayev', role: 'Hematologist at Liv Bona Dea Hospital, Peripheral Specialist' },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Market Opportunity',
        headline: 'Medical Tourism Growth',
        subheadline: 'Be part of the fastest-growing health destination in the region.',
        stats: [
            { value: '25%', label: 'Yearly Growth', note: 'Medical Visitors' },
            { value: '15+', label: 'JCI Clinics', note: 'International Standards' },
            { value: '50+', label: 'Pharma Partners', note: 'Global Brands' },
            { value: 'Visa', label: 'Medical E-Visa', note: 'Simplified Process' },
        ],
    },
    {
        type: 'gallery',
        groupKey: 'about-gallery',
        headline: 'Life at Silkbridge',
        layout: 'masonry',
    },
    {
        type: 'cta',
        headline: 'Ready to Explore Opportunities?',
        description: "Let us create your perfect medical journey or business strategy with our local expertise.",
        primaryButton: { text: 'Contact Us', href: '/contact' },
    },
];

const aboutBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Haqqımızda',
        headline: 'Təcrübə, İstedad',
        headlineAccent: 'Qonaqpərvərlik',
        text: 'Silkbridge International Azərbaycanda sağlamlıq turizmi və əczaçılıq biznesi üçün sizin əsas tərəfdaşınızdır. Biz pasiyentlər və tərəfdaşlar üçün qüsursuz bir təcrübə təmin etmək məqsədilə tibbi wellness ekspertizasını peşəkar bazara giriş dəstəyi ilə birləşdirir, özünəməxsus qonaqpərvərliyimizlə təqdim edirik.',
    },
    {
        type: 'storyline',
        title: 'Hekayəmiz',
        text: 'Yerli köklərdən qlobal miqyaslı fəaliyyətə, Silkbridge-in necə Azərbaycanın aparıcı tibbi turizm tərəfdaşına çevrildiyini kəşf edin.',
        beats: [
            { id: '1', year: '2010', kicker: 'MƏNŞƏYİ', title: 'Bakıda Təsis Edildi', description: 'Silkbridge International, Azərbaycanın şəfa potensialını dünyaya tanıtmaq ehtirası ilə təsis edilmişdir.' },
            { id: '2', year: '2013', kicker: 'GENİŞLƏNMƏ', title: 'Farma Logistika', description: 'Xidmətlərimizi genişləndirərək beynəlxalq şirkətlər üçün əczaçılıq logistikası və tənzimləmə dəstəyini əlavə etdik.' },
            { id: '3', year: '2016', kicker: 'İNNOVASİYA', title: 'Tibbi Paketlər', description: 'Müalicələri mədəni kəşflə birləşdirən "Sağlamlıq və İrs" fərdi marşrutlarımızı işə saldıq.' },
            { id: '4', year: '2019', kicker: 'TƏRƏFDAŞLIQ', title: 'Klinik Şəbəkə', description: 'Müştərilərimiz üçün prioritet giriş təmin etmək məqsədilə ən yaxşı klinikalar və Naftalan kurortları ilə birbaşa əlaqələr qurduq.' },
            { id: '5', year: '2022', kicker: 'SAĞLAMLIQ', title: 'Holistik Mərkəzlər', description: 'Premium detoks və anti-aging proqramları təklif etmək üçün Chenot Palace və digər lüks wellness mərkəzləri ilə tərəfdaşlıq etdik.' },
            { id: '6', year: '2025', kicker: 'BU GÜN', title: 'Bazar Lideri', description: 'Bu gün Şərq və Qərbi birləşdirərək tibbi turistlər və əczaçılıq biznesləri üçün etibarlı qapıyıq.' },
        ],
    },
    {
        type: 'values',
        title: 'Niyə Bizi Seçməlisiniz?',
        subtitle: 'Yaratdığımız hər səyahətə rəhbərlik edən prinsiplər',
        values: [
            { title: 'Keyfiyyət Fokusumzdur', description: 'Yalnız akkreditə olunmuş tibbi müəssisələr və sertifikatlı distribyutorlarla əməkdaşlıq edirik.' },
            { title: 'Təcrübə', description: 'Tibbi logistika və farma tənzimləmələri sahəsində onilliklərin təcrübəsi.' },
            { title: 'Fərdi Xidmət', description: 'Pasiyentlər və biznes nümayəndə heyətləri üçün 24/7 dəstək verən fərdi koordinatorlar.' },
            { title: 'Unikallıq', description: 'Wellness səyahətlərini bazara çıxışla birləşdirən yeganə agentlik.' },
        ],
    },
    {
        type: 'team',
        title: 'Komandamız',
        subtitle: 'Sizin sağlamlıq və biznes uğurunuza həsr olunmuş təcrübəli mütəxəssislər',
        members: [
            { name: 'Leyla Əliyeva', role: 'Təsisçi və Baş Direktor', bio: 'Tibbi turizm üzrə 15+ illik təcrübə, pasiyent qayğısı və klinika tərəfdaşlıqları üzrə ixtisaslaşmışdır.' },
            { name: 'Rəşid Məmmədov', role: 'Farma Rəhbəri', bio: 'Farma tənzimləmələri, qeydiyyat və bazara giriş strategiyaları üzrə ekspert.' },
            { name: 'Nigar Həsənova', role: 'Pasiyent Koordinatoru', bio: 'Beynəlxalq pasiyentlər üçün qüsursuz səyahətləri təmin edən çoxdilli mütəxəssis.' },
            { name: 'Elvin Hüseynov', role: 'Korporativ Menecer', bio: 'Biznes logistikası, nümayəndə heyəti səfərləri və MICE tədbirləri üzrə mütəxəssis.' },
        ],
    },
    {
        type: 'team',
        title: 'Tibbi Elmi Şüra üzvləri',
        subtitle: 'SILKBRIDGE – Tibbi Elmi Şüranın liderləri Azərbaycan səhiyyəsini beynəlxalq səviyyədə təmsil edən peşəkarlar komandadır.',
        members: [
            { name: 'Dr. Xəlilzadə Rövşən', role: 'Azərbaycan Tibb Universitetinin Neyrocərrahiyyə kafedrasının müdiri, Neyrocərrahlar Assosiasiyasının sədri, Fəlsəfə doktoru, Dosent' },
            { name: 'Prof. Dr. Əhmədov İlham Samidoğlu', role: 'Azərbaycan Tibb Universitetinin Urologiya kafedrasının professoru, Tibb Elmləri Doktoru, Uroloqlar və Androloqlar Assosiasiyasının sədri' },
            { name: 'Abbasov Eldar Şamxaloğlu', role: 'Azərbaycan Tibb Universitetinin Travmatologiya kafedrasının professoru, Tibb Elmləri Doktoru' },
            { name: 'Babək Saleh Gənnadi', role: 'Azərbaycan Respublikasının Baş Endokrinoloqu' },
            { name: 'Tural Paşayev', role: 'Liv Bona Dea Xəstəxanasının Hematoloqu, Periferik Mütəxəssis' },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Bazar İmkanları',
        headline: 'Tibbi Turizm Artımı',
        subheadline: 'Regionun ən sürətlə inkişaf edən sağlamlıq istiqamətinin bir hissəsi olun.',
        stats: [
            { value: '25%', label: 'İllik Artım', note: 'Tibbi Ziyarətçilər' },
            { value: '15+', label: 'JCI Klinikalar', note: 'Beynəlxalq Standartlar' },
            { value: '50+', label: 'Farma Tərəfdaşlar', note: 'Qlobal Brendlər' },
            { value: 'Viza', label: 'Tibbi E-Viza', note: 'Sadələşdirilmiş Proses' },
        ],
    },
    {
        type: 'gallery',
        groupKey: 'about-gallery',
        headline: 'Silkbridge-də Həyat',
        layout: 'masonry',
    },
    {
        type: 'cta',
        headline: 'İmkanları Araşdırmağa Hazırsınız?',
        description: 'Yerli ekspertizamızla mükəmməl tibbi səyahətinizi və ya biznes strategiyanızı yaradaq.',
        primaryButton: { text: 'Bizimlə Əlaqə', href: '/contact' },
    },
];

const servicesBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Services',
        headline: 'Comprehensive Solutions for',
        headlineAccent: 'Health & Business',
        text: 'From medical logistics to pharmaceutical market entry support, we provide end-to-end services for patients and professionals in Azerbaijan.',
    },
    {
        type: 'serviceDetails',
        serviceId: 'airTickets',
        title: 'Medical & Corporate Flights',
        description: 'Seamless flight arrangements for patients (including stretcher booking) and business delegations.',
        features: [
            'Medical assistance booking',
            'Business class corporate rates',
            'Flexible changes',
            'Urgent flight coordination',
            '24/7 support',
        ],
        ctaText: 'Book Flight',
        ctaHref: '/contact',
        details: [
            { title: 'Medical Travel', description: 'Coordination with airlines for oxygen, stretchers, and medical escorts.', tags: ['Stretcher', 'Oxygen', 'Medical Escort', 'Priority Boarding'] },
            { title: 'Corporate Delegations', description: 'Group bookings for conferences and site inspections with flexible terms.', tags: ['Group Rates', 'Flexible Dates', 'Business Class', 'Lounge Access'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'travelPackages',
        title: 'Health & Business Itineraries',
        description: 'Curated wellness programs at Naftalan/Chenot and pharmaceutical business inspection tours.',
        features: [
            'Naftalan treatment packages',
            'Detox & Anti-aging retreats',
            'Pharma market entry tours',
            'Factory & Clinic visits',
            'Corporate MICE events',
        ],
        ctaText: 'View Itineraries',
        ctaHref: '/contact',
        details: [
            { title: 'Wellness Programs', description: 'choose from Naftalan Arthritis relief, Post-op recovery, or Chenot Detox weeks.', tags: ['Naftalan', 'Chenot', 'Recovery', 'Detox', 'Thermal Springs'] },
            { title: 'Business Pack', description: 'Inspection visits for pharma companies including B2B meetings and regulatory consults.', tags: ['Market Entry', 'B2B Meetings', 'Site Visits', 'Networking'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'hotelReservation',
        title: 'Wellness Resorts & Hotels',
        description: 'Exclusive partner rates at leading wellness resorts and business hotels near medical centers.',
        features: [
            'Proximity to major clinics',
            'Sanitized & Accessible rooms',
            'Long-stay recovery discounts',
            'Wellness resort exclusives',
            'Corporate rates',
        ],
        ctaText: 'Find Accommodation',
        ctaHref: '/contact',
        details: [
            { title: 'City Hotels', description: 'Strategic locations near Bona Dea, Memorial, and other key clinics in Baku.', tags: ['Clinic Proximity', 'Accessible', 'Patient Friendly', '5-Star'] },
            { title: 'Wellness Resorts', description: 'Direct booking for Garabagh Resort (Naftalan), Chenot Palace (Gabala), and Lankaran Springs.', tags: ['Naftalan', 'Gabala', 'Lankaran', 'Shabran'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'transfers',
        title: 'Medical Transport & Fleet',
        description: 'From patient transfer to VIP delegation transport, ensuring comfort, safety, and hygiene.',
        features: [
            'Airport meet & greet',
            'Wheelchair accessible vans',
            'VIP sedans for executives',
            'Group coaches for events',
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
        title: 'Medical Interpreters & Hosts',
        description: 'Specialized support for doctor consultations, business negotiations, and cultural guidance.',
        features: [
            'Medical terminology certified',
            'Business negotiation support',
            'Multilingual (EN/RU/AR)',
            'Confidentiality guaranteed',
            'Cultural liaison',
        ],
        ctaText: 'Request Interpreter',
        ctaHref: '/contact',
    },
    {
        type: 'serviceDetails',
        serviceId: 'visa',
        title: 'Medical & Business Visas',
        description: 'Expedited visa processing for urgent medical treatment or official business invitations.',
        features: [
            'Urgent Medical Visa',
            'Business Invitation Letters',
            'ASAN Visa Support',
            'Temporary Residency assistance',
            'Meet & Assist at border',
        ],
        ctaText: 'Get Visa Help',
        ctaHref: '/contact',
    },
    {
        type: 'process',
        title: 'Our Workflow',
        subtitle: 'A streamlined process for your health or business journey',
        steps: [
            { title: 'Consultation', description: 'We assess your medical needs or business objectives.' },
            { title: 'Planning', description: 'Our team creates a custom itinerary, flight, and care plan.' },
            { title: 'Logistics', description: 'We handle all bookings, visas, and appointments.' },
            { title: 'Arrival & Care', description: '24/7 support throughout your stay in Azerbaijan.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Plan Your Trip?',
        description: 'Let us handle the details while you focus on health or business.',
        primaryButton: { text: 'Get a Quote', href: '/contact' },
        secondaryButton: { text: 'View Partners', href: '/partners' },
    },
];

const servicesBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Xidmətlərimiz',
        headline: 'Sağlamlıq və Biznes üçün',
        headlineAccent: 'Həllər',
        text: 'Tibbi logistikadan əczaçılıq bazarına giriş dəstəyinə qədər, Azərbaycanda pasiyentlər və peşəkarlar üçün hərtərəfli xidmətlər təqdim edirik.',
    },
    {
        type: 'serviceDetails',
        serviceId: 'airTickets',
        title: 'Tibbi və Korporativ Uçuşlar',
        description: 'Pasiyentlər (xərək daxil olmaqla) və biznes nümayəndə heyətləri üçün qüsursuz uçuş təşkili.',
        features: [
            'Tibbi yardım rezervasiyası',
            'Biznes klass korporativ tariflər',
            'Çevik dəyişikliklər',
            'Təcili uçuş koordinasiyası',
            '24/7 dəstək',
        ],
        ctaText: 'Bilet Rezerv Edin',
        ctaHref: '/contact',
        details: [
            { title: 'Tibbi Səyahət', description: 'Oksigen, xərək və tibbi müşayiət üçün aviaşirkətlərlə koordinasiya.', tags: ['Xərək', 'Oksigen', 'Tibbi Müşayiət', 'Prioritet'] },
            { title: 'Korporativ Nümayəndəlik', description: 'Konfranslar və obyekt yoxlamaları üçün çevik şərtlərlə qrup rezervasiyaları.', tags: ['Qrup Tarifləri', 'Çevik Tarixlər', 'Biznes Klass'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'travelPackages',
        title: 'Sağlamlıq və Biznes Marşrutları',
        description: 'Naftalan/Chenot-da seçilmiş wellness proqramları və əczaçılıq biznesi yoxlama turları.',
        features: [
            'Naftalan müalicə paketləri',
            'Detoks və Anti-aging istirahətləri',
            'Farma bazara giriş turları',
            'Zavod və Klinika ziyarətləri',
            'Korporativ MICE tədbirləri',
        ],
        ctaText: 'Marşrutlara Baxın',
        ctaHref: '/contact',
        details: [
            { title: 'Wellness Proqramları', description: 'Naftalan Artrit müalicəsi, Əməliyyat sonrası bərpa və ya Chenot Detoks həftələri.', tags: ['Naftalan', 'Chenot', 'Bərpa', 'Detoks', 'Termal Sular'] },
            { title: 'Biznes Paket', description: 'B2B görüşləri və tənzimləmə konsultasiyaları daxil olmaqla farma şirkətləri üçün inspeksiya səfərləri.', tags: ['Bazara Giriş', 'B2B Görüşlər', 'Obyekt Ziyarətləri'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'hotelReservation',
        title: 'Wellness Kurortlar və Otellər',
        description: 'Tibbi mərkəzlərə yaxın aparıcı wellness kurortlarında və biznes otellərində xüsusi tərəfdaş tarifləri.',
        features: [
            'Əsas klinikalara yaxınlıq',
            'Gigiyenik və Əlçatan otaqlar',
            'Uzunmüddətli bərpa endirimləri',
            'Wellness kurort eksklüzivləri',
            'Korporativ tariflər',
        ],
        ctaText: 'Yerləşmə Tapın',
        ctaHref: '/contact',
        details: [
            { title: 'Şəhər Otelləri', description: 'Bakıda Bona Dea, Memorial və digər əsas klinikalara yaxın strateji yerləşmələr.', tags: ['Klinikaya Yaxın', 'Əlçatan', 'Pasiyent Dostu', '5-Ulduz'] },
            { title: 'Wellness Kurortları', description: 'Qarabağ Resort (Naftalan), Chenot Palace (Qəbələ) və Lənkəran Springs üçün birbaşa rezervasiya.', tags: ['Naftalan', 'Qəbələ', 'Lənkəran', 'Şabran'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'transfers',
        title: 'Tibbi Nəqliyyat və Avtopark',
        description: 'Pasiyent transferindən VIP nümayəndə heyəti nəqliyyatına qədər rahatlıq, təhlükəsizlik və gigiyena.',
        features: [
            'Hava limanında qarşılama',
            'Əlil arabası üçün uyğun',
            'Rəhbərlər üçün VIP sedanlar',
            'Tədbirlər üçün qrup avtobusları',
            'Peşəkar sürücülər',
        ],
        ctaText: 'Transfer Sifariş Edin',
        ctaHref: '/contact',
        details: [
            { title: 'Nəqliyyat Parkı', description: 'Sedan (1-2 nəfər), Vito (7+1), Sprinter (20+1), Isuzu (30 nəfər), Travego (52 nəfər) və VIP avtomobillər.', tags: ['Sedan', 'Vito', 'Sprinter', 'Isuzu', 'Travego', 'VIP'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'guiding',
        title: 'Tibbi Tərcüməçilər və Bələdçilər',
        description: 'Həkim konsultasiyaları, biznes danışıqları və mədəni bələdçilik üçün ixtisaslaşmış dəstək.',
        features: [
            'Tibbi terminologiya sertifikatlı',
            'Biznes danışıqları dəstəyi',
            'Çoxdilli (EN/RU/AR)',
            'Məxfilik zəmanəti',
            'Mədəni əlaqələndirici',
        ],
        ctaText: 'Tərcüməçi İstəyin',
        ctaHref: '/contact',
    },
    {
        type: 'serviceDetails',
        serviceId: 'visa',
        title: 'Tibbi və Biznes Vizalar',
        description: 'Təcili tibbi müalicə və ya rəsmi biznes dəvətləri üçün sürətləndirilmiş viza işlənməsi.',
        features: [
            'Təcili Tibbi Viza',
            'Biznes Dəvət Məktubları',
            'ASAN Viza Dəstəyi',
            'Müvəqqəti Yaşayış köməyi',
            'Sərhəddə qarşılama',
        ],
        ctaText: 'Viza Köməyi Alın',
        ctaHref: '/contact',
    },
    {
        type: 'process',
        title: 'İş Prosesimiz',
        subtitle: 'Sağlamlıq və ya biznes səyahətiniz üçün sadələşdirilmiş proses',
        steps: [
            { title: 'Konsultasiya', description: 'Tibbi ehtiyaclarınızı və ya biznes məqsədlərinizi qiymətləndiririk.' },
            { title: 'Planlaşdırma', description: 'Komandamız fərdi marşrut və uçuş planı hazırlayır.' },
            { title: 'Logistika', description: 'Bütün rezervasiyaları, vizaları və görüşləri biz həll edirik.' },
            { title: 'Gəliş və Qayğı', description: 'Azərbaycanda olduğunuz müddətdə 24/7 dəstək.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Səyahətinizi Planlamağa Hazırsınız?',
        description: 'Siz sağlamlıq və ya biznesə diqqət yetirin, detalları biz həll edək.',
        primaryButton: { text: 'Qiymət Alın', href: '/contact' },
        secondaryButton: { text: 'Tərəfdaşlara Baxın', href: '/partners' },
    },
];

const partnersBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Network',
        headline: 'Trusted Clinical & Business',
        headlineAccent: 'Partners',
        text: 'We have built deep relationships with Azerbaijan\'s leading medical institutions, pharmaceutical distributors, and luxury hospitality providers.',
    },
    {
        type: 'statsRow',
        stats: [
            { value: '25+', label: 'JCI/ISO Clinics' },
            { value: '50+', label: 'Pharma Distributors' },
            { value: '100+', label: 'Partner Hotels' },
            { value: '15k+', label: 'Patients Served' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Our Network',
        headline: 'Strategic Partnerships',
        description: 'Collaborating with the best to deliver excellence in health and business.',
        partners: [
            { name: 'Bona Dea International', location: 'Baku, Azerbaijan', specialty: 'JCI Accredited Hospital' },
            { name: 'Chenot Palace', location: 'Gabala, Azerbaijan', specialty: 'Medical Wellness & Detox' },
            { name: 'Garabagh Resort', location: 'Naftalan, Azerbaijan', specialty: 'Thermal Healing' },
            { name: 'Avromed', location: 'Baku, Azerbaijan', specialty: 'Pharmaceutical Logistics' },
        ],
    },
    {
        type: 'cta',
        headline: 'Become a Partner',
        description: 'Join our network of medical and business excellence in Azerbaijan.',
        primaryButton: { text: 'Join Network', href: '/contact' },
    },
];

const partnersBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Etibarlı Klinik və Biznes',
        headlineAccent: 'Tərəfdaşları',
        text: 'Azərbaycanın aparıcı tibbi müəssisələri, əczaçılıq distribyutorları və lüks qonaqpərvərlik təchizatçıları ilə dərin münasibətlər qurmuşuq.',
    },
    {
        type: 'statsRow',
        stats: [
            { value: '25+', label: 'JCI/ISO Klinikalar' },
            { value: '50+', label: 'Farma Distribyutorlar' },
            { value: '100+', label: 'Tərəfdaş Otellər' },
            { value: '15k+', label: 'Xidmət Edilən Pasiyent' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Strateji Tərəfdaşlıqlar',
        description: 'Sağlamlıq və biznesdə mükəmməlliyi çatdırmaq üçün ən yaxşılarla əməkdaşlıq edirik.',
        partners: [
            { name: 'Bona Dea International', location: 'Bakı, Azərbaycan', specialty: 'JCI Akkreditəli Xəstəxana' },
            { name: 'Chenot Palace', location: 'Qəbələ, Azərbaycan', specialty: 'Tibbi Wellness və Detoks' },
            { name: 'Qarabağ Resort', location: 'Naftalan, Azərbaycan', specialty: 'Termal Sağlamlıq' },
            { name: 'Avromed', location: 'Bakı, Azərbaycan', specialty: 'Əczaçılıq Logistikası' },
        ],
    },
    {
        type: 'cta',
        headline: 'Tərəfdaş Olun',
        description: 'Azərbaycanda tibbi və biznes mükəmməlliyi şəbəkəmizə qoşulun.',
        primaryButton: { text: 'Şəbəkəyə Qoşulun', href: '/contact' },
    },
];

const contactBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Contact Us',
        headline: 'Let\'s Start the Conversation',
        text: 'Whether you are seeking medical treatment, planning a pharma market entry, or organizing a delegation - our team is here to assist.',
    },
    {
        type: 'contact',
        headline: 'Get in Touch',
        description: 'Reach out to our specialized teams for health tourism or business consulting.',
        showForm: true,
        showMap: true,
    },
];


const contactBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Əlaqə',
        headline: 'Söhbətə Başlayaq',
        text: 'Tibbi müalicə axtarırsınızsa, farma bazarına giriş planlayırsınızsa və ya nümayəndə heyəti təşkil edirsinizsə - komandamız kömək etmək üçün buradadır.',
    },
    {
        type: 'contact',
        headline: 'Əlaqə Saxlayın',
        description: 'Sağlamlıq turizmi və ya biznes konsultasiyası üçün ixtisaslaşmış komandalarımıza müraciət edin.',
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
        tagline: 'Базируемся в Баку\nСовершенство в Медицинском Туризме и Фарме',
        subtagline: 'Silkbridge International соединяет вас с мировым уровнем медицинского оздоровления, доступом к фармацевтическому рынку и комплексными туристическими услугами в Азербайджане.',
        ctaPrimary: { text: 'Медицинский Туризм', href: '/services' },
        ctaSecondary: { text: 'Фарма Решения', href: '/services#packages' },
        quickLinks: [
            { text: 'Велнес', href: '/services#visa' },
            { text: 'Фарма', href: '/services#tours' },
            { text: 'Туры', href: '/services#hotels' },
            { text: 'Контакты', href: '/services#transport' },
        ],
    },
    {
        type: 'about',
        eyebrow: 'Кто мы?',
        headline: 'Опыт, талант',
        headlineAccent: 'Гостеприимство',
        mission: 'Silkbridge International — ваш главный партнер в сфере медицинского туризма и фармацевтического бизнеса в Азербайджане. Мы сочетаем экспертизу в медицинском оздоровлении с профессиональной поддержкой выхода на рынок, обеспечивая безупречный опыт для пациентов и партнеров.',
        pillars: [
            { title: 'Качество — наш фокус', description: 'Мы сотрудничаем с аккредитованными медицинскими учреждениями и сертифицированными дистрибьюторами.', icon: 'quality' },
            { title: 'Опыт', description: 'Десятилетия опыта в медицинской логистике и фармацевтическом регулировании.', icon: 'experience' },
            { title: 'Персональный сервис', description: 'Выделенные координаторы пациентов и бизнес-консультанты с поддержкой 24/7.', icon: 'personal' },
            { title: 'Уникальность', description: 'Единственное агентство, объединяющее оздоровительные путешествия с доступом к рынку.', icon: 'unique' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'НАШИ УСЛУГИ',
        headline: 'Комплексные Решения',
        services: [
            {
                title: 'Медицинские и Корпоративные Рейсы',
                description: 'Бесшовные перелеты для пациентов, медицинских делегаций и корпоративных команд в Азербайджан и обратно.',
                features: [
                    'Рейсы с медицинскими носилками',
                    'Корпоративное групповое бронирование',
                    'Гибкие изменения',
                    'Поддержка 24/7',
                ],
                cta: { text: 'Авиа Услуги', href: '/services#flights' },
            },
            {
                title: 'Оздоровительные и Деловые Маршруты',
                description: 'Курируемые программы для велнес-туров, реабилитации и инспекций фармацевтического бизнеса.',
                features: [
                    'Велнес-туры',
                    'Туры медицинской реабилитации',
                    'Поездки фарма-делегаций',
                    'Инспекции объектов',
                    'Корпоративное гостеприимство',
                ],
                cta: { text: 'Посмотреть маршруты', href: '/services#packages' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Аналитика Рынка',
        headline: 'Здравоохранение и Бизнес Азербайджана',
        subheadline: 'Ключевые показатели растущих секторов здравоохранения и фармацевтики Азербайджана',
        stats: [
            { value: '15k+', label: 'Медицинских Туристов', note: 'Ежегодный Рост' },
            { value: '20+', label: 'Аккредитованных Клиник', note: 'Сертификация JCI и ISO' },
            { value: '12%', label: 'Рост Фарма Рынка', note: 'Год к Году' },
            { value: '$450M', label: 'Стоимость Рынка', note: 'Сектор Здравоохранения' },
        ],
        ctaText: 'Исследовать Возможности',
        ctaHref: '/services',
    },
    {
        type: 'insightsList',
        eyebrow: 'Последние новости',
        headline: 'Инсайты и обновления',
        viewAllHref: '/insights',
        items: [
            { title: 'Рост Нафталановой Терапии', excerpt: 'Как природные нефтяные ванны привлекают пациентов со всего мира.', date: '15 Окт 2023', href: '/insights/top-10-baku' },
            { title: 'Silkbridge на Arab Health 2024', excerpt: 'Демонстрация медицинского потенциала Азербайджана в Дубае.', date: '2 Ноя 2023', href: '/insights/atm-dubai' },
            { title: 'Гид по Входу на Фарма Рынок', excerpt: 'Ключевые правила для международных компаний, выходящих в Азербайджан.', date: '10 Дек 2023', href: '/insights/wellness-tourism' },
        ],
    },
    {
        type: 'testimonials',
        eyebrow: 'Отзывы',
        headline: 'Что говорят наши клиенты',
        testimonials: [
            { quote: "Медицинская координация для лечения моего отца была безупречной. Silkbridge позаботились обо всем.", author: "Сара Джонсон", role: "Семья Пациента", company: "Великобритания" },
            { quote: "Неоценимая поддержка для нашего выхода на фармацевтический рынок. Профессионально и с соблюдением всех норм.", author: "Майкл Чен", role: "Директор", company: "PharmaCorp" },
            { quote: "Идеальное сочетание деловых встреч и туров культурной реабилитации для нашей делегации.", author: "Елена Петрова", role: "Лидер группы", company: "MediGroup" },
        ],
    },
    {
        type: 'logoGrid',
        eyebrow: 'Наши партнеры',
        headline: 'Нам доверяют мировые бренды',
        logos: [
            { name: 'Hilton', logo: 'https://placehold.co/200x80?text=Hilton', href: '#' },
            { name: 'Chenot', logo: 'https://placehold.co/200x80?text=Chenot', href: '#' },
            { name: 'Acibadem', logo: 'https://placehold.co/200x80?text=Acibadem', href: '#' },
            { name: 'Four Seasons', logo: 'https://placehold.co/200x80?text=Four+Seasons', href: '#' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Наша сеть',
        headline: 'Партнерство Ведущих Медицинских Учреждений',
        description: 'Мы сотрудничаем с лучшими клиниками, велнес-курортами и фармацевтическими дистрибьюторами по всему Азербайджану.',
        ctaText: 'Наши Партнёры',
        ctaHref: '/partners',
    },
    {
        type: 'contact',
        eyebrow: 'Связаться с нами',
        headline: 'Давайте спланируем ваше путешествие',
        description: 'Свяжитесь с нами, чтобы обсудить ваши потребности в медицинском туризме или задачи фармацевтического бизнеса.',
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
        text: 'Silkbridge International — ваш главный партнер в сфере медицинского туризма и фармацевтического бизнеса в Азербайджане. Мы сочетаем экспертизу в медицинском оздоровлении с профессиональной поддержкой выхода на рынок, обеспечивая безупречный опыт.',
    },
    {
        type: 'storyline',
        title: 'Наш путь',
        text: 'От локальных корней до глобального охвата — узнайте, как Silkbridge стал ведущим партнером в сфере медицинского туризма Азербайджана.',
        beats: [
            { id: '1', year: '2010', kicker: 'НАЧАЛО', title: 'Основание в Баку', description: 'Silkbridge International была основана со страстью показать целительный потенциал Азербайджана миру.' },
            { id: '2', year: '2013', kicker: 'РАСШИРЕНИЕ', title: 'Фарма Логистика', description: 'Мы расширили услуги, включив фармацевтическую логистику и регуляторную поддержку для международных компаний.' },
            { id: '3', year: '2016', kicker: 'ИННОВАЦИИ', title: 'Медицинские пакеты', description: 'Запустили фирменные маршруты "Здоровье и Наследие", объединяющие лечение с культурными открытиями.' },
            { id: '4', year: '2019', kicker: 'ПАРТНЕРСТВА', title: 'Клиническая сеть', description: 'Установили прямые связи с лучшими клиниками и курортами Нафталана, обеспечивая приоритетный доступ для клиентов.' },
            { id: '5', year: '2022', kicker: 'ВЕЛНЕС', title: 'Холистические центры', description: 'Партнерство с Chenot Palace и другими люкс-центрами для предложения премиальных детокс и анти-эйдж программ.' },
            { id: '6', year: '2025', kicker: 'СЕГОДНЯ', title: 'Лидер Рынка', description: 'Сегодня мы — надежные ворота для медицинских туристов и фармацевтического бизнеса, соединяющие Восток и Запад.' },
        ],
    },
    {
        type: 'values',
        title: 'Почему выбирают нас?',
        subtitle: 'Принципы, которыми мы руководствуемся в каждом путешествии',
        values: [
            { title: 'Качество — наш фокус', description: 'Мы сотрудничаем только с аккредитованными медицинскими учреждениями и сертифицированными дистрибьюторами.' },
            { title: 'Опыт', description: 'Десятилетия опыта в медицинской логистике и фармацевтическом регулировании.' },
            { title: 'Персональный сервис', description: 'Выделенные координаторы пациентов и бизнес-консультанты с поддержкой 24/7.' },
            { title: 'Уникальность', description: 'Единственное агентство, объединяющее оздоровительные путешествия с доступом к рынку.' },
        ],
    },
    {
        type: 'team',
        title: 'Наша команда',
        subtitle: 'Опытные профессионалы, посвящённые вашему здоровью и успеху в бизнесе',
        members: [
            { name: 'Лейла Алиева', role: 'Основатель и CEO', bio: '15+ лет в медицинском туризме, специализация на заботе о пациентах и партнёрстве с клиниками.' },
            { name: 'Рашид Мамедов', role: 'Глава Фарма направления', bio: 'Эксперт в фармацевтическом регулировании, регистрации и стратегиях выхода на рынок.' },
            { name: 'Нигяр Гасанова', role: 'Координатор пациентов', bio: 'Мультиязычный профессионал, обеспечивающий бесшовные поездки для международных пациентов.' },
            { name: 'Эльвин Гусейнов', role: 'Корпоративный менеджер', bio: 'Специалист по бизнес-логистике, визитам делегаций и MICE мероприятиям.' },
        ],
    },
    {
        type: 'team',
        title: 'Члены Медицинского Научного Совета',
        subtitle: 'SILKBRIDGE – Лидеры Медицинского Научного Совета — команда профессионалов, представляющих азербайджанское здравоохранение на международном уровне.',
        members: [
            { name: 'Др. Халилзаде Ровшан', role: 'Заведующий кафедрой нейрохирургии Азербайджанского Медицинского Университета, Председатель Ассоциации нейрохирургов, Доктор философии, Доцент' },
            { name: 'Проф. Др. Ахмедов Ильхам Самидоглу', role: 'Профессор кафедры урологии Азербайджанского Медицинского Университета, Доктор медицинских наук, Председатель Ассоциации урологов и андрологов' },
            { name: 'Аббасов Эльдар Шамхалоглу', role: 'Профессор кафедры травматологии Азербайджанского Медицинского Университета, Доктор медицинских наук' },
            { name: 'Бабек Салех Ганнади', role: 'Главный эндокринолог Азербайджанской Республики' },
            { name: 'Турал Пашаев', role: 'Гематолог клиники Liv Bona Dea, Специалист по периферии' },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Рыночные возможности',
        headline: 'Рост Медицинского Туризма',
        subheadline: 'Станьте частью одного из самых быстрорастущих оздоровительных направлений в регионе.',
        stats: [
            { value: '25%', label: 'Ежегодный рост', note: 'Медицинские Посетители' },
            { value: '15+', label: 'Клиники JCI', note: 'Международные Стандарты' },
            { value: '50+', label: 'Фарма Партнеры', note: 'Мировые Бренды' },
            { value: 'Виза', label: 'Медицинская E-Visa', note: 'Упрощенный процесс' },
        ],
    },
    {
        type: 'gallery',
        groupKey: 'about-gallery',
        headline: 'Жизнь в Silkbridge',
        layout: 'masonry',
    },
    {
        type: 'cta',
        headline: 'Готовы исследовать возможности?',
        description: 'Позвольте нам создать ваше идеальное медицинское путешествие или бизнес-стратегию с нашей местной экспертизой.',
        primaryButton: { text: 'Связаться', href: '/contact' },
    },
];

const servicesBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Наши Услуги',
        headline: 'Решения для Здоровья',
        headlineAccent: 'и Бизнеса',
        text: 'От медицинской логистики до поддержки входа на фармацевтический рынок — мы предоставляем комплексные услуги для пациентов и профессионалов в Азербайджане.',
    },
    {
        type: 'serviceDetails',
        serviceId: 'airTickets',
        title: 'Медицинские и Корпоративные Перелеты',
        description: 'Безупречная организация перелетов для пациентов (включая носилочных) и бизнес-делегаций.',
        features: [
            'Бронирование медицинской помощи',
            'Корпоративные тарифы бизнес-класса',
            'Гибкие изменения',
            'Координация срочных рейсов',
            'Поддержка 24/7',
        ],
        ctaText: 'Забронировать Билет',
        ctaHref: '/contact',
        details: [
            { title: 'Медицинские Путешествия', description: 'Координация с авиакомпаниями для кислорода, носилок и медицинского сопровождения.', tags: ['Носилки', 'Кислород', 'Медицинский Эскорт', 'Приоритет'] },
            { title: 'Корпоративные Делегации', description: 'Групповое бронирование с гибкими условиями для конференций и инспекций объектов.', tags: ['Групповые Тарифы', 'Гибкие Даты', 'Бизнес-Класс'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'travelPackages',
        title: 'Оздоровительные и Деловые Маршруты',
        description: 'Курируемые велнес-программы в Нафталане/Chenot и инспекционные туры для фармацевтического бизнеса.',
        features: [
            'Лечебные пакеты Нафталан',
            'Детокс и Анти-возрастные программы',
            'Туры входа на фарма-рынок',
            'Посещение заводов и клиник',
            'Корпоративные MICE мероприятия',
        ],
        ctaText: 'Посмотреть Маршруты',
        ctaHref: '/contact',
        details: [
            { title: 'Велнес Программы', description: 'Лечение артрита в Нафталане, послеоперационная реабилитация или недели детокса в Chenot.', tags: ['Нафталан', 'Chenot', 'Реабилитация', 'Детокс', 'Термальные Воды'] },
            { title: 'Бизнес Пакет', description: 'Инспекционные поездки для фарма-компаний, включая B2B встречи и консультации по регулированию.', tags: ['Вход на Рынок', 'B2B Встречи', 'Посещение Объектов'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'hotelReservation',
        title: 'Велнес-Курорты и Отели',
        description: 'Специальные партнерские тарифы в ведущих велнес-курортах и бизнес-отелях рядом с медицинскими центрами.',
        features: [
            'Близость к ключевым клиникам',
            'Гигиеничные и доступные номера',
            'Скидки на длительную реабилитацию',
            'Эксклюзивы велнес-курортов',
            'Корпоративные тарифы',
        ],
        ctaText: 'Найти Размещение',
        ctaHref: '/contact',
        details: [
            { title: 'Городские Отели', description: 'Стратегические локации рядом с Bona Dea, Memorial и другими ключевыми клиниками в Баку.', tags: ['Рядом с Клиникой', 'Доступность', 'Для Пациентов', '5 Звезд'] },
            { title: 'Велнес Курорты', description: 'Прямое бронирование для Garabagh Resort (Нафталан), Chenot Palace (Габала) и Lankaran Springs.', tags: ['Нафталан', 'Габала', 'Ленкорань', 'Шабран'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'transfers',
        title: 'Медицинский Транспорт и Автопарк',
        description: 'Комфорт, безопасность и гигиена от трансфера пациентов до транспорта VIP-делегаций.',
        features: [
            'Встреча в аэропорту',
            'Доступность для инвалидных колясок',
            'VIP седаны для руководителей',
            'Автобусы для групп',
            'Профессиональные водители',
        ],
        ctaText: 'Заказать Трансфер',
        ctaHref: '/contact',
        details: [
            { title: 'Автопарк', description: 'Седан (1-2 чел.), Vito (7+1), Sprinter (20+1), Isuzu (30 чел.), Travego (52 чел.) и VIP автомобили.', tags: ['Седан', 'Vito', 'Sprinter', 'Isuzu', 'Travego', 'VIP'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'guiding',
        title: 'Медицинские Переводчики и Гиды',
        description: 'Специализированная поддержка для врачебных консультаций, деловых переговоров и культурного сопровождения.',
        features: [
            'Сертификация по мед. терминологии',
            'Поддержка деловых переговоров',
            'Многоязычность (EN/RU/AR)',
            'Гарантия конфиденциальности',
            'Культурный связной',
        ],
        ctaText: 'Запросить Переводчика',
        ctaHref: '/contact',
    },
    {
        type: 'serviceDetails',
        serviceId: 'visa',
        title: 'Медицинские и Бизнес Визы',
        description: 'Ускоренное оформление виз для срочного медицинского лечения или официальных деловых приглашений.',
        features: [
            'Срочная Медицинская Виза',
            'Деловые Приглашения',
            'Поддержка ASAN Visa',
            'Помощь с ВНЖ',
            'Встреча на границе',
        ],
        ctaText: 'Получить Помощь с Визой',
        ctaHref: '/contact',
    },
    {
        type: 'process',
        title: 'Наш Процесс',
        subtitle: 'Упрощённый путь для вашего оздоровительного или делового визита',
        steps: [
            { title: 'Консультация', description: 'Мы оцениваем ваши медицинские потребности или бизнес-цели.' },
            { title: 'Планирование', description: 'Наша команда готовит индивидуальный маршрут и план поездки.' },
            { title: 'Логистика', description: 'Мы берем на себя все бронирования, визы и встречи.' },
            { title: 'Прибытие и Забота', description: 'Поддержка 24/7 во время вашего пребывания в Азербайджане.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Готовы спланировать поездку?',
        description: 'Сосредоточьтесь на здоровье или бизнесе, а детали мы возьмем на себя.',
        primaryButton: { text: 'Получить Предложение', href: '/contact' },
        secondaryButton: { text: 'Посмотреть Партнеров', href: '/partners' },
    },
];

const partnersBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Наша сеть',
        headline: 'Надёжные Клинические и Бизнес',
        headlineAccent: 'Партнеры',
        text: 'Мы построили глубокие отношения с ведущими медицинскими учреждениями Азербайджана, фармацевтическими дистрибьюторами и поставщиками люксового гостеприимства.',
    },
    {
        type: 'statsRow',
        stats: [
            { value: '25+', label: 'Клиники JCI/ISO' },
            { value: '50+', label: 'Фарма Дистрибьюторы' },
            { value: '100+', label: 'Отелей-Партнеров' },
            { value: '15k+', label: 'Обслуженных Пациентов' },
        ],
    },
    {
        type: 'partners',
        eyebrow: 'Наша сеть',
        headline: 'Стратегические Партнерства',
        description: 'Мы сотрудничаем с лучшими для предоставления превосходства в здравоохранении и бизнесе.',
        partners: [
            { name: 'Bona Dea International', location: 'Баку, Азербайджан', specialty: 'Больница с аккредитацией JCI' },
            { name: 'Chenot Palace', location: 'Габала, Азербайджан', specialty: 'Медицинский Велнес и Детокс' },
            { name: 'Garabagh Resort', location: 'Нафталан, Азербайджан', specialty: 'Термальное Лечение' },
            { name: 'Avromed', location: 'Баку, Азербайджан', specialty: 'Фармацевтическая Логистика' },
        ],
    },
    {
        type: 'cta',
        headline: 'Стать Пациентом или Партнером',
        description: 'Присоединяйтесь к нашей сети медицинского и бизнес-превосходства в Азербайджане.',
        primaryButton: { text: 'Присоединиться к Сети', href: '/contact' },
    },
];

const contactBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Контакты',
        headline: 'Давайте начнём разговор',
        text: 'Ищете медицинское лечение, планируете вход на рынок фармацевтики или организуете делегацию — наша команда готова помочь.',
    },
    {
        type: 'contact',
        headline: 'Связаться с нами',
        description: 'Обратитесь к нашим специализированным командам по медицинскому туризму или бизнес-консалтингу.',
        showForm: true,
        showMap: true,
    },
];

const insightsBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Insights & Updates',
        text: 'Stay up to date with the latest news, trends, and analysis from the Azerbaijan tourism industry.',
    },
    {
        type: 'insightsList',
        headline: 'Latest Articles',
        items: [
            { title: 'Top 10 Places to Visit in Baku', excerpt: 'Discover the hidden gems of the City of Winds.', date: 'Oct 15, 2023', href: '/insights/top-10-baku', image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8' },
            { title: 'Silkbridge at ATM Dubai 2024', excerpt: 'We are excited to showcase Azerbaijan at the Arabian Travel Market.', date: 'Nov 2, 2023', href: '/insights/atm-dubai', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' },
            { title: 'The Rise of Wellness Tourism', excerpt: 'Exploring the healing properties of Naftalan oil.', date: 'Dec 10, 2023', href: '/insights/wellness-tourism', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef' },
        ],
    },
];

const insightsBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Məlumatlar və Yeniliklər',
        text: 'Azərbaycan turizm sənayesindən ən son xəbərlər, trendlər və təhlillərlə tanış olun.',
    },
    {
        type: 'insightsList',
        headline: 'Son Məqalələr',
        items: [
            { title: 'Bakıda ziyarət edilməli 10 yer', excerpt: 'Küləklər şəhərinin gizli incilərini kəşf edin.', date: '15 Okt 2023', href: '/insights/top-10-baku', image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8' },
            { title: 'Silkbridge ATM Dubai 2024-də', excerpt: 'Azərbaycanı Arabian Travel Market sərgisində təmsil etməkdən qürur duyuruq.', date: '2 Noy 2023', href: '/insights/atm-dubai', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' },
            { title: 'Sağlamlıq Turizminin Yüksəlişi', excerpt: 'Naftalan neftinin müalicəvi xüsusiyyətlərini keşf edin.', date: '10 Dek 2023', href: '/insights/wellness-tourism', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef' },
        ],
    },
];

const insightsBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Инсайты и обновления',
        text: 'Будьте в курсе последних новостей, тенденций и аналитики туристической индустрии Азербайджана.',
    },
    {
        type: 'insightsList',
        headline: 'Последние статьи',
        items: [
            { title: 'Топ-10 мест для посещения в Баку', excerpt: 'Откройте для себя скрытые жемчужины Города Ветров.', date: '15 Окт 2023', href: '/insights/top-10-baku', image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8' },
            { title: 'Silkbridge на ATM Dubai 2024', excerpt: 'Мы рады представить Азербайджан на Arabian Travel Market.', date: '2 Ноя 2023', href: '/insights/atm-dubai', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' },
            { title: 'Рост оздоровительного туризма', excerpt: 'Изучение целебных свойств нафталановой нефти.', date: '10 Дек 2023', href: '/insights/wellness-tourism', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef' },
        ],
    },
];

// ============================================
// New Service Page Blocks
// ============================================

const healthTourismBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Advanced Medical',
        headlineAccent: 'Wellness Care',
        text: 'From specialized treatments to holistic rehabilitation, we connect you with Azerbaijan\'s top medical facilities and wellness resorts.',
    },
    {
        type: 'packages',
        headline: 'Featured Wellness Packages',
        packages: [
            { title: 'Naftalan Arthritis Therapy', duration: '7 Days', price: 'From $1200', includes: ['Initial Check-up', 'Naftalan Baths', 'Physiotherapy'] },
            { title: 'Chenot Advanced Detox', duration: '5 Days', price: 'From $3500', includes: ['Bio-energetic Check-up', 'Hydro-aromatherapy', 'Plant-based Diet'] }
        ]
    },
    {
        type: 'gallery',
        groupKey: 'health-tourism',
        headline: 'Our Partner Resorts',
        layout: 'grid',
    },
];

const healthTourismBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Qabaqcıl Tibbi',
        headlineAccent: 'Wellness Xidməti',
        text: 'İxtisaslaşmış müalicələrdən holistik bərpaya qədər, sizi Azərbaycanın ən yaxşı tibbi müəssisələri və wellness kurortları ilə əlaqələndiririk.',
    },
    {
        type: 'packages',
        headline: 'Wellness Paketləri',
        packages: [
            { title: 'Naftalan Artrit Terapiyası', duration: '7 Gün', price: '$1200-dan', includes: ['İlkin Müayinə', 'Naftalan Vannaları', 'Fizioterapiya'] },
            { title: 'Chenot İləri Detoks', duration: '5 Gün', price: '$3500-dan', includes: ['Bio-energetik Müayinə', 'Hidro-aromaterapiya', 'Bitki əsaslı Pəhriz'] }
        ]
    },
    {
        type: 'gallery',
        groupKey: 'health-tourism',
        headline: 'Tərəfdaş Kurortlarımız',
        layout: 'grid',
    },
];

const healthTourismBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Продвинутый Медицинский',
        headlineAccent: 'Велнес Уход',
        text: 'От специализированного лечения до холистической реабилитации — мы соединяем вас с лучшими медицинскими учреждениями и велнес-курортами Азербайджана.',
    },
    {
        type: 'packages',
        headline: 'Популярные Велнес Пакеты',
        packages: [
            { title: 'Терапия Артрита Нафталан', duration: '7 Дней', price: 'От $1200', includes: ['Первичный Осмотр', 'Нафталановые Ванны', 'Физиотерапия'] },
            { title: 'Продвинутый Детокс Chenot', duration: '5 Дней', price: 'От $3500', includes: ['Био-энергетический Чекап', 'Гидро-ароматерапия', 'Растительная Диета'] }
        ]
    },
    {
        type: 'gallery',
        groupKey: 'health-tourism',
        headline: 'Наши Курорты-Партнеры',
        layout: 'grid',
    },
];

const pharmaMarketingBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Pharma Market',
        headlineAccent: 'Access Solutions',
        text: 'Strategic support for international pharmaceutical companies entering and expanding within the Azerbaijani market.',
    },
    {
        type: 'process',
        title: 'Strategic Approach',
        steps: [
            { title: 'Regulatory Intelligence', description: 'Navigation of local MOH regulations and registration requirements.' },
            { title: 'Market Entry', description: 'Distributor selection, pricing analysis, and supply chain setup.' },
            { title: 'KOL Engagement', description: 'Scientific marketing and connection with key opinion leaders.' }
        ]
    },
    {
        type: 'cta',
        headline: 'Expand Your Reach',
        primaryButton: { text: 'Contact Strategy Team', href: '/contact?type=business' }
    }
];

const pharmaMarketingBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Farma Bazarına',
        headlineAccent: 'Çıxış Həlləri',
        text: 'Azərbaycan bazarına daxil olan və genişlənən beynəlxalq əczaçılıq şirkətləri üçün strateji dəstək.',
    },
    {
        type: 'process',
        title: 'Strateji Yanaşma',
        steps: [
            { title: 'Tənzimləmə Kəşfiyyatı', description: 'Yerli Səhiyyə Nazirliyi qaydaları və qeydiyyat tələblərinin naviqasiyası.' },
            { title: 'Bazara Giriş', description: 'Distribyutor seçimi, qiymət analizi və təchizat zəncirinin qurulması.' },
            { title: 'KOL Əlaqələri', description: 'Elmi marketinq və əsas fikir liderləri ilə əlaqələr.' }
        ]
    },
    {
        type: 'cta',
        headline: 'Əhatənizi Genişləndirin',
        primaryButton: { text: 'Strategiya Komandası ilə Əlaqə', href: '/contact?type=business' }
    }
];

const pharmaMarketingBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Решения Доступа к',
        headlineAccent: 'Фарма Рынку',
        text: 'Стратегическая поддержка для международных фармацевтических компаний, выходящих и расширяющихся на рынке Азербайджана.',
    },
    {
        type: 'process',
        title: 'Стратегический Подход',
        steps: [
            { title: 'Регуляторная Разведка', description: 'Навигация по правилам Минздрава и требованиям регистрации.' },
            { title: 'Вход на Рынок', description: 'Выбор дистрибьютора, ценовой анализ и настройка цепочки поставок.' },
            { title: 'Работа с KOL', description: 'Научный маркетинг и связь с ключевыми лидерами мнений.' }
        ]
    },
    {
        type: 'cta',
        headline: 'Расширьте Ваш Охват',
        primaryButton: { text: 'Команда Стратегии', href: '/contact?type=business' }
    }
];

const tourismBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Cultural & Leisure',
        headlineAccent: 'Discovery',
        text: 'Enhance your medical or business trip with curated travel experiences across the Land of Fire.',
    },
    {
        type: 'packages',
        headline: 'Recovery & Leisure Tours',
        packages: [
            { title: 'Baku Old City Walk', duration: '3 Hours', price: 'From $50', includes: ['Private Guide', 'Museum Entry'] },
            { title: 'Gabala Alpine Retreat', duration: '2 Days', price: 'From $250', includes: ['Resort Stay', 'Mountain Cable Car'] }
        ]
    },
    {
        type: 'gallery',
        groupKey: 'tourism',
        headline: 'Discovery Gallery',
        layout: 'grid',
    }
];

const tourismBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Mədəni və İstirahət',
        headlineAccent: 'Kəşfi',
        text: 'Tibbi və ya biznes səyahətinizi Odlar Yurdu üzrə seçilmiş səyahət təcrübələri ilə zənginləşdirin.',
    },
    {
        type: 'packages',
        headline: 'Bərpa və İstirahət Turları',
        packages: [
            { title: 'Bakı İçərişəhər Gəzintisi', duration: '3 Saat', price: '$50-dan', includes: ['Fərdi Bələdçi', 'Muzey Girişi'] },
            { title: 'Qəbələ Dağ İstirahəti', duration: '2 Gün', price: '$250-dan', includes: ['Kurort Qonaqlama', 'Dağ Kanat Yolu'] }
        ]
    },
    {
        type: 'gallery',
        groupKey: 'tourism',
        headline: 'Kəşf Qalereyası',
        layout: 'grid',
    }
];

const tourismBlocksRu: ContentBlock[] = [
    {
        type: 'intro',
        headline: 'Культурные и Досуговые',
        headlineAccent: 'Открытия',
        text: 'Дополните вашу медицинскую или деловую поездку курируемыми впечатлениями по Стране Огней.',
    },
    {
        type: 'packages',
        headline: 'Туры Реабилитации и Отдыха',
        packages: [
            { title: 'Прогулка по Старому Городу', duration: '3 Часа', price: 'От $50', includes: ['Частный Гид', 'Вход в Музеи'] },
            { title: 'Горный Отдых в Габале', duration: '2 Дня', price: 'От $250', includes: ['Проживание на Курорте', 'Канатная Дорога'] }
        ]
    },
    {
        type: 'gallery',
        groupKey: 'tourism',
        headline: 'Галерея Открытий',
        layout: 'grid',
    }
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
    await prisma.galleryGroup.deleteMany();
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
        { slug: 'health-tourism', enTitle: 'Health Tourism', azTitle: 'Sağlamlıq Turizmi', ruTitle: 'Лечебный Туризм', enBlocks: healthTourismBlocksEn, azBlocks: healthTourismBlocksAz, ruBlocks: healthTourismBlocksRu },
        { slug: 'pharma-marketing', enTitle: 'Pharma Marketing', azTitle: 'Farma Marketinq', ruTitle: 'Фарма Маркетинг', enBlocks: pharmaMarketingBlocksEn, azBlocks: pharmaMarketingBlocksAz, ruBlocks: pharmaMarketingBlocksRu },
        { slug: 'tourism', enTitle: 'Tourism', azTitle: 'Turizm', ruTitle: 'Туризм', enBlocks: tourismBlocksEn, azBlocks: tourismBlocksAz, ruBlocks: tourismBlocksRu },
        { slug: 'insights', enTitle: 'Insights', azTitle: 'Məlumatlar', ruTitle: 'Инсайты', enBlocks: insightsBlocksEn, azBlocks: insightsBlocksAz, ruBlocks: insightsBlocksRu },
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

    // Create Gallery Groups
    console.log('🖼️ Creating gallery groups...');
    await prisma.galleryGroup.create({
        data: {
            key: 'health-tourism',
            images: [
                { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef', alt: 'Spa Treatment' },
                { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874', alt: 'Relaxation' },
                { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b', alt: 'Pool' }
            ]
        }
    });

    await prisma.galleryGroup.create({
        data: {
            key: 'tourism',
            images: [
                { url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8', alt: 'Baku City' },
                { url: 'https://images.unsplash.com/photo-1522851458872-4d6b6a67f677', alt: 'Mountains' }
            ]
        }
    });

    await prisma.galleryGroup.create({
        data: {
            key: 'about-gallery',
            images: [
                { url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d', alt: 'Team Meeting' },
                { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf', alt: 'Office Life' },
                { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7', alt: 'Collaboration' }
            ]
        }
    });
    console.log('  ✓ Created gallery groups\n');

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
