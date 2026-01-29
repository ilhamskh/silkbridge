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

const homeBlocksAz: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Bazarları və\nSağlamlıq Turizmini Birləşdiririk',
        subtagline: 'Farmasevtika, tibbi xidmət, sağlamlıq və istirahət—qlobal miqyasda dəqiqliklə təqdim edilir.',
        ctaPrimary: { text: 'Bazara Giriş Xidmətləri', href: '/services#market-entry' },
        ctaSecondary: { text: 'Sağlamlıq və Wellness Turizmi', href: '/services#health-tourism' },
    },
    {
        type: 'about',
        eyebrow: 'Biz Kimik',
        headline: 'Qlobal Təcrübə,',
        headlineAccent: 'Fərdi Yanaşma',
        mission: 'Biz beynəlxalq əczaçılıq şirkətlərinin bazar genişlənməsi axtarışı ilə dünya səviyyəli səhiyyə axtaran xəstələr arasında körpü qururuq. Təcrübəmiz tənzimləyici naviqasiya, bazar strategiyası və hərtərəfli sağlamlıq turizmi koordinasiyasını əhatə edir.',
        pillars: [
            { title: 'Tənzimləyici Dəstək', description: 'Mürəkkəb uyğunluq mənzərələrində inamla hərəkət edin.', icon: 'regulatory' },
            { title: 'Bazara Giriş', description: 'Davamlı artım üçün strateji mövqeləndirmə.', icon: 'market' },
            { title: 'Sağlamlıq və Wellness Turizmi', description: 'Sərhədlər arası premium müalicə təcrübələri.', icon: 'wellness' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'Xidmətlərimiz',
        headline: 'Mükəmməlliyin İki Sütunu',
        services: [
            {
                title: 'Bazara Giriş Xidmətləri',
                description: 'Yeni bazarlara daxil olan əczaçılıq və səhiyyə şirkətləri üçün hərtərəfli dəstək.',
                features: [
                    'Tənzimləyici yol analizi və strategiya',
                    'Yerli tərəfdaş müəyyənləşdirmə və yoxlama',
                    'Bazar ölçüsü və rəqabət kəşfiyyatı',
                    'Paylanma şəbəkəsinin qurulması',
                    'Qiymətqoyma və geri ödəmə konsaltinqi',
                ],
                cta: { text: 'Ətraflı', href: '/services#market-entry' },
            },
            {
                title: 'Sağlamlıq və Wellness Turizmi',
                description: 'Xaricdə tibbi xidmət və sağlamlıq təcrübəsi axtaran xəstələr üçün başdan-başa koordinasiya.',
                features: [
                    'Xəstəxana və mütəxəssis seçimi',
                    'Müalicə planlaması və koordinasiyası',
                    'Səyahət və yerləşmə tənzimləmələri',
                    'Tərcüməçi və konsyerj xidmətləri',
                    'Müalicədən sonrakı izləmə',
                ],
                cta: { text: 'Ətraflı', href: '/services#health-tourism' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Bazar Kəşfiyyatı',
        headline: 'Qlobal Səhiyyəyə Bir Baxış',
        subheadline: 'Beynəlxalq səhiyyə bazarlarını formalaşdıran əsas göstəricilər',
        stats: [
            { value: '$12.1T', label: 'Qlobal Səhiyyə Bazarı 2025', note: 'Deloitte' },
            { value: '74M', label: 'İllik Tibbi Turistlər', note: 'MTA' },
            { value: '18.3%', label: 'Yüksələn Bazar CAGR', note: 'McKinsey' },
            { value: '$4.5B', label: 'Wellness Turizm Artımı', note: 'GWI' },
        ],
        ctaText: 'Bütün Araşdırmalara Bax',
        ctaHref: '/market-insights',
    },
    {
        type: 'partners',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Aparıcı Səhiyyə Müəssisələri Tərəfindən Etibar Edilir',
        description: 'Biz dünya üzrə premier xəstəxanalar, klinikalar və wellness mərkəzləri ilə tərəfdaşlıq edirik.',
        ctaText: 'Tərəfdaş Şəbəkəsini Kəşf Edin',
        ctaHref: '/partners',
    },
    {
        type: 'contact',
        eyebrow: 'Əlaqə',
        headline: 'Söhbətə Başlayaq',
        description: "Whether you're exploring market entry or seeking healthcare abroad, we're here to help.",
        showForm: true,
        showMap: true,
    },
];

const aboutBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'About Us',
        headline: 'Bridging Healthcare',
        headlineAccent: 'Across Borders',
        text: 'Founded with a vision to democratize access to global healthcare, Silkbridge International has grown into a trusted partner for pharmaceutical companies and patients alike.',
    },
    {
        type: 'story',
        title: 'Our Story',
        paragraphs: [
            "Silkbridge International was born from a simple observation: the global healthcare ecosystem was becoming increasingly interconnected, yet navigating it remained dauntingly complex.",
            "Our founders, veterans of the pharmaceutical and healthcare industries, recognized the need for a bridge—one that could connect innovative pharmaceutical companies with emerging markets, and patients with world-class care regardless of geography.",
            "Today, we operate across three continents, facilitating market entries, coordinating medical journeys, and building partnerships that improve healthcare outcomes worldwide.",
        ],
    },
    {
        type: 'milestones',
        milestones: [
            { year: '2015', event: 'Founded in New York City' },
            { year: '2017', event: 'Expanded to Singapore office' },
            { year: '2019', event: 'Launched Health Tourism division' },
            { year: '2021', event: 'Reached 50+ hospital partnerships' },
            { year: '2023', event: 'Opened Dubai regional hub' },
            { year: '2025', event: '500+ successful market entries' },
        ],
    },
    {
        type: 'values',
        title: 'Our Values',
        subtitle: 'The principles that guide every decision we make',
        values: [
            { title: 'Excellence', description: 'We hold ourselves to the highest standards in every engagement, ensuring outcomes that exceed expectations.' },
            { title: 'Integrity', description: 'Transparent communication and ethical practices form the foundation of all our partnerships.' },
            { title: 'Innovation', description: 'We continuously evolve our approaches to stay ahead in rapidly changing healthcare landscapes.' },
            { title: 'Compassion', description: "At our core, we're driven by the desire to improve healthcare access and outcomes globally." },
        ],
    },
    {
        type: 'team',
        title: 'Leadership Team',
        subtitle: 'Experienced professionals dedicated to your success',
        members: [
            { name: 'Dr. Sarah Chen', role: 'Chief Executive Officer', bio: 'Former VP at a leading pharmaceutical company with 20+ years in international market development.' },
            { name: 'James Park', role: 'Head of Health Tourism', bio: 'Pioneer in medical tourism coordination with deep networks across Asia-Pacific healthcare systems.' },
            { name: 'Michelle Wong', role: 'Director of Regulatory Affairs', bio: 'Ex-FDA reviewer with expertise in global pharmaceutical approval processes.' },
            { name: 'David Mueller', role: 'Chief Strategy Officer', bio: 'Management consultant background specializing in healthcare market entry strategies.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Work Together?',
        description: "Whether you're exploring new markets or seeking world-class healthcare, we're here to guide your journey.",
        primaryButton: { text: 'Get in Touch', href: '/contact' },
    },
];

const aboutBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Haqqımızda',
        headline: 'Səhiyyəni Birləşdiririk',
        headlineAccent: 'Sərhədlər Arasında',
        text: 'Qlobal səhiyyəyə çıxışı demokratikləşdirmək vizyonu ilə qurulan Silkbridge International, əczaçılıq şirkətləri və xəstələr üçün etibarlı tərəfdaşa çevrilmişdir.',
    },
    {
        type: 'story',
        title: 'Tariximiz',
        paragraphs: [
            'Silkbridge International sadə bir müşahidədən doğuldu: qlobal səhiyyə ekosistemi getdikcə daha çox bir-birinə bağlı olurdu, lakin onu naviqasiya etmək hələ də çox mürəkkəb olaraq qalırdı.',
            'Əczaçılıq və səhiyyə sənayesi veteranları olan təsisçilərimiz körpüyə ehtiyacı dərk etdilər—innovativ əczaçılıq şirkətlərini yüksələn bazarlarla və coğrafiyadan asılı olmayaraq xəstələri dünya səviyyəli xidmətlə birləşdirə biləcək bir körpü.',
            'Bu gün biz üç qitədə fəaliyyət göstəririk, bazara girişləri asanlaşdırır, tibbi səyahətləri koordinasiya edir və dünya üzrə səhiyyə nəticələrini yaxşılaşdıran tərəfdaşlıqlar qururuq.',
        ],
    },
    {
        type: 'milestones',
        milestones: [
            { year: '2015', event: 'Nyu-Yorkda təsis edildi' },
            { year: '2017', event: 'Sinqapur ofisi açıldı' },
            { year: '2019', event: 'Sağlamlıq Turizmi bölməsi başladı' },
            { year: '2021', event: '50+ xəstəxana tərəfdaşlığına çatdı' },
            { year: '2023', event: 'Dubay regional mərkəzi açıldı' },
            { year: '2025', event: '500+ uğurlu bazara giriş' },
        ],
    },
    {
        type: 'values',
        title: 'Dəyərlərimiz',
        subtitle: 'Verdiyimiz hər qərara rəhbərlik edən prinsiplər',
        values: [
            { title: 'Mükəmməllik', description: 'Hər bir işdə ən yüksək standartlara riayət edir, gözləntiləri aşan nəticələr təmin edirik.' },
            { title: 'Dürüstlük', description: 'Şəffaf ünsiyyət və etik təcrübələr bütün tərəfdaşlıqlarımızın əsasını təşkil edir.' },
            { title: 'İnnovasiya', description: 'Sürətlə dəyişən səhiyyə mənzərələrində öndə qalmaq üçün yanaşmalarımızı daim inkişaf etdiririk.' },
            { title: 'Şəfqət', description: 'Əsasımızda qlobal miqyasda səhiyyəyə çıxışı və nəticələri yaxşılaşdırmaq istəyi dayanır.' },
        ],
    },
    {
        type: 'team',
        title: 'Rəhbərlik Komandası',
        subtitle: 'Uğurunuza həsr olunmuş təcrübəli mütəxəssislər',
        members: [
            { name: 'Dr. Sara Çen', role: 'Baş İcraçı Direktor', bio: 'Beynəlxalq bazar inkişafında 20+ illik təcrübəyə malik aparıcı əczaçılıq şirkətinin keçmiş vitse-prezidenti.' },
            { name: 'Ceyms Park', role: 'Sağlamlıq Turizmi Rəhbəri', bio: 'Asiya-Sakit Okean səhiyyə sistemlərində dərin şəbəkələri olan tibbi turizm koordinasiyasında pioner.' },
            { name: 'Mişel Vonq', role: 'Tənzimləyici İşlər Direktoru', bio: 'Qlobal əczaçılıq təsdiq proseslərində təcrübəsi olan keçmiş FDA rəyçisi.' },
            { name: 'David Müller', role: 'Baş Strategiya Məsləhətçisi', bio: 'Səhiyyə bazarına giriş strategiyalarında ixtisaslaşmış idarəetmə konsaltinqi təcrübəsi.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Birlikdə İşləməyə Hazırsınız?',
        description: 'İstər yeni bazarlar araşdırırsınız, istərsə də dünya səviyyəli səhiyyə axtarırsınız—biz səyahətinizə rəhbərlik etməyə hazırıq.',
        primaryButton: { text: 'Əlaqə Saxlayın', href: '/contact' },
    },
];

const servicesBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Services',
        headline: 'Two Pillars of',
        headlineAccent: 'Global Healthcare',
        text: "Whether you're expanding pharmaceutical reach or seeking world-class medical care, our expertise guides you every step of the way.",
    },
    {
        type: 'serviceDetails',
        serviceId: 'marketEntry',
        title: 'Market Entry Services',
        description: 'Comprehensive support for pharmaceutical and healthcare companies entering new markets.',
        features: [
            'Regulatory pathway analysis & strategy',
            'Local partner identification & vetting',
            'Market sizing & competitive intelligence',
            'Distribution network establishment',
            'Pricing & reimbursement consulting',
        ],
        ctaText: 'Discuss Your Market Entry',
        ctaHref: '/contact',
        details: [
            { title: 'Regulatory Strategy', description: 'Navigate complex approval processes with our expert guidance on regulatory pathways, documentation requirements, and submission strategies.', tags: ['Pre-submission meetings', 'Dossier preparation', 'Agency liaison', 'Post-approval variations'] },
            { title: 'Market Intelligence', description: 'Make informed decisions with comprehensive market analysis, competitive landscape assessment, and demand forecasting.', tags: ['Market sizing', 'Competitive analysis', 'Pricing strategy', 'Distribution mapping'] },
            { title: 'Partner Development', description: 'Identify and vet local partners, distributors, and manufacturing partners to ensure sustainable market presence.', tags: ['Partner identification', 'Due diligence', 'Contract negotiation', 'Relationship management'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'healthTourism',
        title: 'Health & Wellness Tourism',
        description: 'End-to-end coordination for patients seeking medical care and wellness experiences abroad.',
        features: [
            'Hospital & specialist matching',
            'Treatment planning & coordination',
            'Travel & accommodation arrangements',
            'Interpreter & concierge services',
            'Post-treatment follow-up care',
        ],
        ctaText: 'Start Your Journey',
        ctaHref: '/contact',
        details: [
            { title: 'Medical Coordination', description: 'End-to-end coordination of your medical journey, from initial consultation to post-treatment follow-up.', tags: ['Hospital matching', 'Specialist appointments', 'Treatment planning', 'Second opinions'] },
            { title: 'Travel & Logistics', description: 'Seamless travel arrangements including flights, accommodations, and ground transportation.', tags: ['Flight booking', 'Medical visas', 'Accommodation', 'Airport transfers'] },
            { title: 'Concierge Services', description: 'Personalized support throughout your stay including interpretation, companion care, and wellness experiences.', tags: ['Medical interpreters', 'Companion services', 'Recovery retreats', 'Local experiences'] },
        ],
    },
    {
        type: 'process',
        title: 'How We Work',
        subtitle: 'A proven process for exceptional outcomes',
        steps: [
            { title: 'Discovery', description: 'We understand your goals, constraints, and vision through in-depth consultation.' },
            { title: 'Strategy', description: 'Our experts develop a tailored roadmap aligned with your objectives.' },
            { title: 'Execution', description: 'We manage every detail while keeping you informed at each milestone.' },
            { title: 'Success', description: 'Ongoing support ensures sustained success and partnership growth.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Get Started?',
        description: "Let's discuss how we can help you achieve your healthcare goals.",
        primaryButton: { text: 'Schedule a Consultation', href: '/contact' },
        secondaryButton: { text: 'View Our Partners', href: '/partners' },
    },
];

const servicesBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Xidmətlərimiz',
        headline: 'İki Sütun',
        headlineAccent: 'Qlobal Səhiyyə',
        text: 'İstər əczaçılıq əhatəsini genişləndirir, istərsə də dünya səviyyəli tibbi xidmət axtarırsınız—təcrübəmiz hər addımda sizə rəhbərlik edir.',
    },
    {
        type: 'serviceDetails',
        serviceId: 'marketEntry',
        title: 'Bazara Giriş Xidmətləri',
        description: 'Yeni bazarlara daxil olan əczaçılıq və səhiyyə şirkətləri üçün hərtərəfli dəstək.',
        features: [
            'Tənzimləyici yol analizi və strategiya',
            'Yerli tərəfdaş müəyyənləşdirmə və yoxlama',
            'Bazar ölçüsü və rəqabət kəşfiyyatı',
            'Paylanma şəbəkəsinin qurulması',
            'Qiymətqoyma və geri ödəmə konsaltinqi',
        ],
        ctaText: 'Bazara Girişinizi Müzakirə Edin',
        ctaHref: '/contact',
        details: [
            { title: 'Tənzimləyici Strategiya', description: 'Tənzimləyici yollar, sənədləşdirmə tələbləri və təqdimetmə strategiyaları üzrə ekspert rəhbərliyimizlə mürəkkəb təsdiq proseslərini naviqasiya edin.', tags: ['Ön-təqdimetmə görüşləri', 'Dosye hazırlanması', 'Agentlik əlaqəsi', 'Təsdiq sonrası dəyişikliklər'] },
            { title: 'Bazar Kəşfiyyatı', description: 'Hərtərəfli bazar analizi, rəqabət mənzərəsinin qiymətləndirilməsi və tələb proqnozlaşdırması ilə məlumatlı qərarlar verin.', tags: ['Bazar ölçüsü', 'Rəqabət analizi', 'Qiymət strategiyası', 'Paylanma xəritələməsi'] },
            { title: 'Tərəfdaş İnkişafı', description: 'Davamlı bazar mövcudluğunu təmin etmək üçün yerli tərəfdaşları, distribyutorları və istehsal tərəfdaşlarını müəyyən edin və yoxlayın.', tags: ['Tərəfdaş müəyyənləşdirmə', 'Lazımi yoxlama', 'Müqavilə danışıqları', 'Münasibət idarəetməsi'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'healthTourism',
        title: 'Sağlamlıq və Wellness Turizmi',
        description: 'Xaricdə tibbi xidmət və sağlamlıq təcrübəsi axtaran xəstələr üçün başdan-başa koordinasiya.',
        features: [
            'Xəstəxana və mütəxəssis seçimi',
            'Müalicə planlaması və koordinasiyası',
            'Səyahət və yerləşmə tənzimləmələri',
            'Tərcüməçi və konsyerj xidmətləri',
            'Müalicədən sonrakı izləmə',
        ],
        ctaText: 'Səyahətinizə Başlayın',
        ctaHref: '/contact',
        details: [
            { title: 'Tibbi Koordinasiya', description: 'İlkin konsultasiyadan müalicə sonrası izləməyə qədər tibbi səyahətinizin başdan-başa koordinasiyası.', tags: ['Xəstəxana seçimi', 'Mütəxəssis görüşləri', 'Müalicə planlaması', 'İkinci rəylər'] },
            { title: 'Səyahət və Logistika', description: 'Uçuşlar, yerləşmə və yerüstü nəqliyyat daxil olmaqla qüsursuz səyahət tənzimləmələri.', tags: ['Uçuş rezervasiyası', 'Tibbi vizalar', 'Yerləşmə', 'Hava limanı transferləri'] },
            { title: 'Konsyerj Xidmətləri', description: 'Tərcümə, müşayiət xidməti və wellness təcrübələri daxil olmaqla qalma müddətiniz boyunca fərdi dəstək.', tags: ['Tibbi tərcüməçilər', 'Müşayiət xidmətləri', 'Bərpa kurortları', 'Yerli təcrübələr'] },
        ],
    },
    {
        type: 'process',
        title: 'Necə İşləyirik',
        subtitle: 'Müstəsna nəticələr üçün sübut edilmiş proses',
        steps: [
            { title: 'Kəşf', description: 'Dərin konsultasiya vasitəsilə məqsədlərinizi, məhdudiyyətlərinizi və vizyonunuzu anlayırıq.' },
            { title: 'Strategiya', description: 'Ekspertlərimiz məqsədlərinizə uyğun fərdiləşdirilmiş yol xəritəsi hazırlayır.' },
            { title: 'İcra', description: 'Hər bir mərhələdə sizi məlumatlandıraraq hər detalı idarə edirik.' },
            { title: 'Uğur', description: 'Davamlı dəstək davamlı uğur və tərəfdaşlıq inkişafını təmin edir.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Başlamağa Hazırsınız?',
        description: 'Səhiyyə məqsədlərinizə çatmağınıza necə kömək edə biləcəyimizi müzakirə edək.',
        primaryButton: { text: 'Konsultasiya Planlaşdırın', href: '/contact' },
        secondaryButton: { text: 'Tərəfdaşlarımıza Baxın', href: '/partners' },
    },
];

const partnersBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Our Network',
        headline: 'Trusted Global',
        headlineAccent: 'Healthcare Partners',
        text: "We've built relationships with leading healthcare institutions across four continents, ensuring our clients receive world-class care wherever they are.",
    },
    {
        type: 'statsRow',
        stats: [
            { value: '60+', label: 'Partner Hospitals' },
            { value: '15', label: 'Countries' },
            { value: '500+', label: 'Specialists' },
            { value: '10K+', label: 'Patients Served' },
        ],
    },
    {
        type: 'partners',
        eyebrow: '',
        headline: 'Our Partner Institutions',
        partners: [
            { name: 'Seoul Medical Center', location: 'Seoul, South Korea', specialty: 'Oncology, Cardiology', region: 'asia-pacific' },
            { name: 'Bangkok International Hospital', location: 'Bangkok, Thailand', specialty: 'Orthopedics, Wellness', region: 'asia-pacific' },
            { name: 'Singapore Health Partners', location: 'Singapore', specialty: 'Neurology, Pediatrics', region: 'asia-pacific' },
            { name: 'Dubai Healthcare City', location: 'Dubai, UAE', specialty: 'Multi-specialty', region: 'middle-east' },
            { name: 'São Paulo Medical', location: 'São Paulo, Brazil', specialty: 'Plastic Surgery, Dentistry', region: 'americas' },
            { name: 'Munich Medical Alliance', location: 'Munich, Germany', specialty: 'Rehabilitation, Sports Medicine', region: 'europe' },
        ],
    },
    {
        type: 'cta',
        headline: 'Become a Partner',
        description: 'Join our global network of healthcare institutions and expand your reach to international patients.',
        primaryButton: { text: 'Partner With Us', href: '/contact' },
    },
];

const partnersBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Etibarlı Qlobal',
        headlineAccent: 'Səhiyyə Tərəfdaşları',
        text: 'Müştərilərimizin harada olursa olsunlar dünya səviyyəli xidmət almasını təmin etmək üçün dörd qitədə aparıcı səhiyyə müəssisələri ilə münasibətlər qurmuşuq.',
    },
    {
        type: 'statsRow',
        stats: [
            { value: '60+', label: 'Tərəfdaş Xəstəxanalar' },
            { value: '15', label: 'Ölkə' },
            { value: '500+', label: 'Mütəxəssis' },
            { value: '10K+', label: 'Xidmət Edilən Xəstə' },
        ],
    },
    {
        type: 'partners',
        eyebrow: '',
        headline: 'Tərəfdaş Müəssisələrimiz',
        partners: [
            { name: 'Seoul Medical Center', location: 'Seul, Cənubi Koreya', specialty: 'Onkologiya, Kardiologiya', region: 'asia-pacific' },
            { name: 'Bangkok International Hospital', location: 'Banqkok, Tailand', specialty: 'Ortopediya, Wellness', region: 'asia-pacific' },
            { name: 'Singapore Health Partners', location: 'Sinqapur', specialty: 'Nevrologiya, Pediatriya', region: 'asia-pacific' },
            { name: 'Dubai Healthcare City', location: 'Dubay, BƏƏ', specialty: 'Multi-ixtisas', region: 'middle-east' },
            { name: 'São Paulo Medical', location: 'San-Paulo, Braziliya', specialty: 'Plastik Cərrahiyyə, Stomatologiya', region: 'americas' },
            { name: 'Munich Medical Alliance', location: 'Münhen, Almaniya', specialty: 'Reabilitasiya, İdman Təbabəti', region: 'europe' },
        ],
    },
    {
        type: 'cta',
        headline: 'Tərəfdaş Olun',
        description: 'Qlobal səhiyyə müəssisələri şəbəkəmizə qoşulun və beynəlxalq xəstələrə əhatənizi genişləndirin.',
        primaryButton: { text: 'Bizimlə Tərəfdaş Olun', href: '/contact' },
    },
];

const contactBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Contact Us',
        headline: "Let's Start a Conversation",
        text: "Whether you're exploring pharmaceutical market entry or seeking world-class healthcare abroad, our team is ready to help you achieve your goals.",
    },
    {
        type: 'contact',
        headline: 'Get in Touch',
        description: 'Our team is available to answer your questions and discuss how we can support your healthcare or market entry objectives.',
        showForm: true,
        showMap: true,
    },
];

const contactBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Əlaqə',
        headline: 'Söhbətə Başlayaq',
        text: 'İstər əczaçılıq bazarına girişi araşdırırsınız, istərsə də xaricdə dünya səviyyəli səhiyyə axtarırsınız—komandamız məqsədlərinizə çatmağınıza kömək etməyə hazırdır.',
    },
    {
        type: 'contact',
        headline: 'Əlaqə Saxlayın',
        description: 'Komandamız suallarınıza cavab verməyə və səhiyyə və ya bazara giriş məqsədlərinizə necə dəstək verə biləcəyimizi müzakirə etməyə hazırdır.',
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

    // Create pages
    console.log('📄 Creating pages...');
    const pageConfigs = [
        { slug: 'home', enTitle: 'Home', azTitle: 'Ana Səhifə', enBlocks: homeBlocksEn, azBlocks: homeBlocksAz },
        { slug: 'about', enTitle: 'About', azTitle: 'Haqqımızda', enBlocks: aboutBlocksEn, azBlocks: aboutBlocksAz },
        { slug: 'services', enTitle: 'Services', azTitle: 'Xidmətlər', enBlocks: servicesBlocksEn, azBlocks: servicesBlocksAz },
        { slug: 'partners', enTitle: 'Partners', azTitle: 'Tərəfdaşlar', enBlocks: partnersBlocksEn, azBlocks: partnersBlocksAz },
        { slug: 'contact', enTitle: 'Contact', azTitle: 'Əlaqə', enBlocks: contactBlocksEn, azBlocks: contactBlocksAz },
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
