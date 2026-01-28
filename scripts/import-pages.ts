/**
 * Import Pages Script
 * 
 * This script imports the existing hardcoded page content into the database.
 * Run with: npx tsx scripts/import-pages.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import type { ContentBlock } from '../lib/blocks/schema';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================
// HOME PAGE CONTENT
// ============================================

const homeBlocksEn: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Connecting Markets &\nHealth Tourism Across Borders',
        subtagline: 'Pharma, medical care, wellness, and leisure—delivered globally with precision and care.',
        ctaPrimary: { text: 'Market Entry Services', href: '/services#market-entry' },
        ctaSecondary: { text: 'Health & Wellness Tourism', href: '/services#health-tourism' },
    },
    {
        type: 'about',
        eyebrow: 'Who We Are',
        headline: 'Global Expertise,',
        headlineAccent: 'Personalized Approach',
        mission: 'We bridge the gap between international pharmaceutical companies seeking market expansion and patients seeking world-class healthcare. Our expertise spans regulatory navigation, market strategy, and comprehensive health tourism coordination.',
        pillars: [
            { title: 'Regulatory Support', description: 'Navigate complex compliance landscapes with confidence.', icon: 'regulatory' },
            { title: 'Market Entry', description: 'Strategic positioning for sustainable growth.', icon: 'market' },
            { title: 'Health & Wellness Tourism', description: 'Premium care experiences across borders.', icon: 'wellness' },
        ],
    },
    {
        type: 'services',
        eyebrow: 'Our Services',
        headline: 'Two Pillars of Excellence',
        services: [
            {
                title: 'Market Entry Services',
                description: 'Comprehensive support for pharmaceutical and healthcare companies entering new markets.',
                features: [
                    'Regulatory pathway analysis & strategy',
                    'Local partner identification & vetting',
                    'Market sizing & competitive intelligence',
                    'Distribution network establishment',
                    'Pricing & reimbursement consulting',
                ],
                cta: { text: 'Learn More', href: '/services#market-entry' },
            },
            {
                title: 'Health & Wellness Tourism',
                description: 'End-to-end coordination for patients seeking medical care and wellness experiences abroad.',
                features: [
                    'Hospital & specialist matching',
                    'Treatment planning & coordination',
                    'Travel & accommodation arrangements',
                    'Interpreter & concierge services',
                    'Post-treatment follow-up care',
                ],
                cta: { text: 'Learn More', href: '/services#health-tourism' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Market Intelligence',
        headline: 'Industry Insights',
        subheadline: 'Data-driven perspectives on global healthcare markets',
        stats: [
            { value: '$12.1T', label: 'Global Healthcare Market 2025', note: 'Deloitte' },
            { value: '74M', label: 'Medical Tourists Annually', note: 'MTA' },
            { value: '18.3%', label: 'Emerging Market CAGR', note: 'McKinsey' },
            { value: '$4.5B', label: 'Wellness Tourism Growth', note: 'GWI' },
        ],
        ctaText: 'View All Insights',
        ctaHref: '/market-insights',
    },
    {
        type: 'partners',
        eyebrow: 'Our Network',
        headline: 'Trusted by Leading Healthcare Institutions',
        description: 'We partner with world-renowned hospitals, wellness centers, and pharmaceutical organizations to deliver exceptional outcomes.',
        partners: [
            { name: 'Seoul Medical Center', location: 'Seoul, South Korea', specialty: 'Oncology, Cardiology', region: 'Asia Pacific' },
            { name: 'Bangkok International Hospital', location: 'Bangkok, Thailand', specialty: 'Orthopedics, Wellness', region: 'Asia Pacific' },
            { name: 'Singapore Health Partners', location: 'Singapore', specialty: 'Neurology, Pediatrics', region: 'Asia Pacific' },
            { name: 'Dubai Healthcare City', location: 'Dubai, UAE', specialty: 'Multi-specialty', region: 'Middle East' },
            { name: 'São Paulo Medical', location: 'São Paulo, Brazil', specialty: 'Plastic Surgery, Dentistry', region: 'Americas' },
            { name: 'Munich Medical Alliance', location: 'Munich, Germany', specialty: 'Rehabilitation, Sports Medicine', region: 'Europe' },
        ],
        ctaText: 'Partner With Us',
        ctaHref: '/contact?type=partner',
    },
    {
        type: 'contact',
        eyebrow: 'Get Started',
        headline: 'Start Your Journey',
        description: "Whether you're a pharmaceutical company exploring new markets or seeking premium healthcare abroad, we're here to guide you.",
        showForm: true,
        showMap: true,
    },
];

const homeBlocksAz: ContentBlock[] = [
    {
        type: 'hero',
        tagline: 'Bazarları və Sağlamlıq Turizmini\nSərhədlər Arasında Birləşdiririk',
        subtagline: 'Farma, tibbi yardım, wellness və istirahət — qlobal miqyasda dəqiqliklə və qayğı ilə.',
        ctaPrimary: { text: 'Bazara Giriş Xidmətləri', href: '/services#market-entry' },
        ctaSecondary: { text: 'Sağlamlıq & Wellness Turizmi', href: '/services#health-tourism' },
    },
    {
        type: 'about',
        eyebrow: 'Biz Kimik',
        headline: 'Qlobal Təcrübə,',
        headlineAccent: 'Fərdi Yanaşma',
        mission: 'Bazar genişlənməsi axtaran beynəlxalq əczaçılıq şirkətləri ilə dünya səviyyəli tibbi yardım axtaran xəstələr arasında körpü qururuq. Bizim təcrübəmiz tənzimləyici naviqasiya, bazar strategiyası və hərtərəfli sağlamlıq turizmi koordinasiyasını əhatə edir.',
        pillars: [
            { title: 'Tənzimləyici Dəstək', description: 'Mürəkkəb uyğunluq mənzərələrində inamla hərəkət edin.', icon: 'regulatory' },
            { title: 'Bazara Giriş', description: 'Davamlı inkişaf üçün strateji yerləşdirmə.', icon: 'market' },
            { title: 'Sağlamlıq & Wellness Turizmi', description: 'Sərhədlər arasında premium qayğı təcrübələri.', icon: 'wellness' },
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
                    'Tənzimləyici yol təhlili və strategiya',
                    'Yerli tərəfdaş müəyyənləşdirilməsi və yoxlanılması',
                    'Bazar ölçüsü və rəqabət kəşfiyyatı',
                    'Paylanma şəbəkəsinin qurulması',
                    'Qiymətləndirmə və kompensasiya konsaltinqi',
                ],
                cta: { text: 'Ətraflı', href: '/services#market-entry' },
            },
            {
                title: 'Sağlamlıq & Wellness Turizmi',
                description: 'Xaricdə tibbi yardım və wellness təcrübələri axtaran xəstələr üçün tam koordinasiya.',
                features: [
                    'Xəstəxana və mütəxəssis uyğunlaşdırması',
                    'Müalicə planlaması və koordinasiyası',
                    'Səyahət və yerləşdirmə tənzimləmələri',
                    'Tərcüməçi və konsyerj xidmətləri',
                    'Müalicə sonrası təqib',
                ],
                cta: { text: 'Ətraflı', href: '/services#health-tourism' },
            },
        ],
    },
    {
        type: 'insights',
        eyebrow: 'Bazar Kəşfiyyatı',
        headline: 'Sənaye Məlumatları',
        subheadline: 'Qlobal səhiyyə bazarlarına data əsaslı baxış',
        stats: [
            { value: '$12.1T', label: 'Qlobal Səhiyyə Bazarı 2025', note: 'Deloitte' },
            { value: '74M', label: 'İllik Tibbi Turistlər', note: 'MTA' },
            { value: '18.3%', label: 'Yüksələn Bazar CAGR', note: 'McKinsey' },
            { value: '$4.5B', label: 'Wellness Turizm Artımı', note: 'GWI' },
        ],
        ctaText: 'Bütün Məlumatları Gör',
        ctaHref: '/market-insights',
    },
    {
        type: 'partners',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Aparıcı Səhiyyə Qurumları Tərəfindən Etibar Edilir',
        description: 'Müstəsna nəticələr əldə etmək üçün dünya şöhrətli xəstəxanalar, wellness mərkəzləri və əczaçılıq təşkilatları ilə əməkdaşlıq edirik.',
        partners: [
            { name: 'Seoul Medical Center', location: 'Seul, Cənubi Koreya', specialty: 'Onkologiya, Kardiologiya', region: 'Asiya-Sakit Okean' },
            { name: 'Bangkok International Hospital', location: 'Banqkok, Tayland', specialty: 'Ortopediya, Wellness', region: 'Asiya-Sakit Okean' },
            { name: 'Singapore Health Partners', location: 'Sinqapur', specialty: 'Nevrologiya, Pediatriya', region: 'Asiya-Sakit Okean' },
            { name: 'Dubai Healthcare City', location: 'Dubay, BƏƏ', specialty: 'Çox ixtisaslı', region: 'Yaxın Şərq' },
            { name: 'São Paulo Medical', location: 'San-Paulu, Braziliya', specialty: 'Plastik Cərrahiyyə, Stomatologiya', region: 'Amerikalar' },
            { name: 'Munich Medical Alliance', location: 'Münhen, Almaniya', specialty: 'Reabilitasiya, İdman Təbabəti', region: 'Avropa' },
        ],
        ctaText: 'Bizimlə Əməkdaşlıq Edin',
        ctaHref: '/contact?type=partner',
    },
    {
        type: 'contact',
        eyebrow: 'Başlayın',
        headline: 'Səyahətinizə Başlayın',
        description: 'İstər yeni bazarlar araşdıran əczaçılıq şirkəti olun, istərsə də premium tibbi xidmət axtarın, biz sizə rəhbərlik etməyə hazırıq.',
        showForm: true,
        showMap: true,
    },
];

// ============================================
// ABOUT PAGE CONTENT
// ============================================

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
            'Silkbridge International was born from a simple observation: the global healthcare ecosystem was becoming increasingly interconnected, yet navigating it remained dauntingly complex.',
            'Our founders, veterans of the pharmaceutical and healthcare industries, recognized the need for a bridge—one that could connect innovative pharmaceutical companies with emerging markets, and patients with world-class care regardless of geography.',
            'Today, we operate across three continents, facilitating market entries, coordinating medical journeys, and building partnerships that improve healthcare outcomes worldwide.',
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
            { title: 'Excellence', description: 'We hold ourselves to the highest standards in every engagement, ensuring outcomes that exceed expectations.', icon: 'regulatory' },
            { title: 'Integrity', description: 'Transparent communication and ethical practices form the foundation of all our partnerships.', icon: 'market' },
            { title: 'Innovation', description: 'We continuously evolve our approaches to stay ahead in rapidly changing healthcare landscapes.', icon: 'insights' },
            { title: 'Compassion', description: "At our core, we're driven by the desire to improve healthcare access and outcomes globally.", icon: 'wellness' },
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
        text: 'Qlobal səhiyyəyə çıxışı demokratikləşdirmək vizyonu ilə qurulan Silkbridge International, həm əczaçılıq şirkətləri, həm də xəstələr üçün etibarlı tərəfdaşa çevrilmişdir.',
    },
    {
        type: 'story',
        title: 'Bizim Hekayəmiz',
        paragraphs: [
            'Silkbridge International sadə bir müşahidədən doğuldu: qlobal səhiyyə ekosistemi getdikcə daha çox bir-birinə bağlanırdı, lakin onda naviqasiya etmək qorxuducu dərəcədə mürəkkəb qalırdı.',
            'Əczaçılıq və səhiyyə sənayesinin veteranları olan təsisçilərimiz körpüyə ehtiyac olduğunu başa düşdülər — innovativ əczaçılıq şirkətlərini inkişaf edən bazarlarla, xəstələri isə coğrafiyadan asılı olmayaraq dünya səviyyəli tibbi yardımla birləşdirə bilən körpü.',
            'Bu gün biz üç qitədə fəaliyyət göstəririk, bazara girişləri asanlaşdırır, tibbi səyahətləri koordinasiya edir və dünya miqyasında səhiyyə nəticələrini yaxşılaşdıran tərəfdaşlıqlar qururuq.',
        ],
    },
    {
        type: 'milestones',
        milestones: [
            { year: '2015', event: 'Nyu-Yorkda təsis edildi' },
            { year: '2017', event: 'Sinqapur ofisinə genişləndi' },
            { year: '2019', event: 'Sağlamlıq Turizmi bölməsi açıldı' },
            { year: '2021', event: '50+ xəstəxana tərəfdaşlığına çatdı' },
            { year: '2023', event: 'Dubay regional qərargahı açıldı' },
            { year: '2025', event: '500+ uğurlu bazara giriş' },
        ],
    },
    {
        type: 'values',
        title: 'Dəyərlərimiz',
        subtitle: 'Hər qərarımıza rəhbərlik edən prinsiplər',
        values: [
            { title: 'Mükəmməllik', description: 'Hər işdə özümüzü ən yüksək standartlara uyğun saxlayırıq, gözləntiləri aşan nəticələr təmin edirik.', icon: 'regulatory' },
            { title: 'Dürüstlük', description: 'Şəffaf ünsiyyət və etik praktikalar bütün tərəfdaşlıqlarımızın əsasını təşkil edir.', icon: 'market' },
            { title: 'İnnovasiya', description: 'Sürətlə dəyişən səhiyyə mənzərələrində öndə qalmaq üçün yanaşmalarımızı davamlı olaraq inkişaf etdiririk.', icon: 'insights' },
            { title: 'Şəfqət', description: 'Əsas məqsədimiz qlobal miqyasda səhiyyəyə çıxışı və nəticələri yaxşılaşdırmaq istəyidir.', icon: 'wellness' },
        ],
    },
    {
        type: 'team',
        title: 'Rəhbərlik Komandası',
        subtitle: 'Uğurunuza həsr olunmuş təcrübəli mütəxəssislər',
        members: [
            { name: 'Dr. Sarah Chen', role: 'Baş İcraçı Direktor', bio: 'Beynəlxalq bazar inkişafında 20+ il təcrübəsi olan aparıcı əczaçılıq şirkətində keçmiş vitse-prezident.' },
            { name: 'James Park', role: 'Sağlamlıq Turizmi Rəhbəri', bio: 'Asiya-Sakit Okean səhiyyə sistemlərində dərin şəbəkələri olan tibbi turizm koordinasiyasında pioner.' },
            { name: 'Michelle Wong', role: 'Tənzimləyici İşlər Direktoru', bio: 'Qlobal əczaçılıq təsdiq proseslərində təcrübəsi olan keçmiş FDA nəzarətçisi.' },
            { name: 'David Mueller', role: 'Baş Strategiya Direktoru', bio: 'Səhiyyə bazarına giriş strategiyalarında ixtisaslaşmış idarəetmə konsultantı.' },
        ],
    },
    {
        type: 'cta',
        headline: 'Birlikdə İşləməyə Hazırsınız?',
        description: 'İstər yeni bazarlar araşdırın, istərsə də dünya səviyyəli səhiyyə axtarın, biz sizin səyahətinizə rəhbərlik etməyə hazırıq.',
        primaryButton: { text: 'Əlaqə', href: '/contact' },
    },
];

// ============================================
// SERVICES PAGE CONTENT
// ============================================

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
        description: 'Comprehensive support for pharmaceutical and healthcare companies entering new markets. We provide end-to-end guidance from initial market assessment through successful product launch.',
        features: [
            'Regulatory pathway analysis & strategy',
            'Local partner identification & vetting',
            'Market sizing & competitive intelligence',
            'Distribution network establishment',
            'Pricing & reimbursement consulting',
        ],
        ctaText: 'Start Your Market Entry',
        ctaHref: '/contact?type=pharma',
        details: [
            { title: 'Regulatory Strategy', description: 'Navigate complex approval processes with expert guidance tailored to each market.', tags: ['FDA', 'EMA', 'PMDA', 'NMPA'] },
            { title: 'Market Intelligence', description: 'Data-driven insights on market size, competition, and growth opportunities.', tags: ['Research', 'Analysis', 'Forecasting', 'Strategy'] },
            { title: 'Partner Network', description: 'Connect with vetted local distributors, wholesalers, and healthcare providers.', tags: ['Distribution', 'Logistics', 'Healthcare', 'Retail'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'healthTourism',
        title: 'Health & Wellness Tourism',
        description: 'End-to-end coordination for patients seeking medical care and wellness experiences abroad. From initial consultation to post-treatment follow-up, we ensure a seamless journey.',
        features: [
            'Hospital & specialist matching',
            'Treatment planning & coordination',
            'Travel & accommodation arrangements',
            'Interpreter & concierge services',
            'Post-treatment follow-up care',
        ],
        ctaText: 'Plan Your Medical Journey',
        ctaHref: '/contact?type=patient',
        details: [
            { title: 'Medical Coordination', description: 'Expert matching with top hospitals and specialists for your specific needs.', tags: ['Oncology', 'Cardiology', 'Orthopedics', 'Neurology'] },
            { title: 'Travel Services', description: 'Complete travel arrangements including flights, transfers, and accommodation.', tags: ['Flights', 'Hotels', 'Transfers', 'Visa'] },
            { title: 'Concierge Support', description: '24/7 support with interpreters, local guides, and personal assistance.', tags: ['Language', 'Support', 'Guidance', 'Care'] },
        ],
    },
    {
        type: 'process',
        title: 'Our Process',
        subtitle: 'A proven approach to achieving your goals',
        steps: [
            { title: 'Discovery', description: 'We begin with a thorough assessment of your needs, objectives, and timeline.', icon: 'search' },
            { title: 'Strategy', description: 'Our experts develop a customized plan tailored to your specific situation.', icon: 'strategy' },
            { title: 'Execution', description: 'We implement the plan with meticulous attention to detail and compliance.', icon: 'execute' },
            { title: 'Success', description: 'Ongoing support ensures sustainable results and continuous improvement.', icon: 'success' },
        ],
    },
    {
        type: 'cta',
        headline: 'Ready to Get Started?',
        description: 'Contact our team to discuss how we can help you achieve your healthcare goals.',
        primaryButton: { text: 'Schedule a Consultation', href: '/contact' },
        secondaryButton: { text: 'View Our Partners', href: '/partners' },
    },
];

const servicesBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Xidmətlərimiz',
        headline: 'Qlobal Səhiyyənin',
        headlineAccent: 'İki Sütunu',
        text: 'İstər əczaçılıq sahəsini genişləndirin, istərsə də dünya səviyyəli tibbi xidmət axtarın, təcrübəmiz sizə hər addımda rəhbərlik edir.',
    },
    {
        type: 'serviceDetails',
        serviceId: 'marketEntry',
        title: 'Bazara Giriş Xidmətləri',
        description: 'Yeni bazarlara daxil olan əczaçılıq və səhiyyə şirkətləri üçün hərtərəfli dəstək. İlkin bazar qiymətləndirməsindən uğurlu məhsul buraxılışına qədər tam rəhbərlik təqdim edirik.',
        features: [
            'Tənzimləyici yol təhlili və strategiya',
            'Yerli tərəfdaş müəyyənləşdirilməsi və yoxlanılması',
            'Bazar ölçüsü və rəqabət kəşfiyyatı',
            'Paylanma şəbəkəsinin qurulması',
            'Qiymətləndirmə və kompensasiya konsaltinqi',
        ],
        ctaText: 'Bazara Girişə Başlayın',
        ctaHref: '/contact?type=pharma',
        details: [
            { title: 'Tənzimləyici Strategiya', description: 'Hər bazara uyğunlaşdırılmış ekspert rəhbərliyi ilə mürəkkəb təsdiq proseslərində naviqasiya.', tags: ['FDA', 'EMA', 'PMDA', 'NMPA'] },
            { title: 'Bazar Kəşfiyyatı', description: 'Bazar ölçüsü, rəqabət və inkişaf imkanları haqqında data əsaslı məlumatlar.', tags: ['Araşdırma', 'Təhlil', 'Proqnoz', 'Strategiya'] },
            { title: 'Tərəfdaş Şəbəkəsi', description: 'Yoxlanılmış yerli distribütorlar, topdansatıcılar və səhiyyə təminatçıları ilə əlaqə.', tags: ['Paylanma', 'Logistika', 'Səhiyyə', 'Pərakəndə'] },
        ],
    },
    {
        type: 'serviceDetails',
        serviceId: 'healthTourism',
        title: 'Sağlamlıq & Wellness Turizmi',
        description: 'Xaricdə tibbi yardım və wellness təcrübələri axtaran xəstələr üçün tam koordinasiya. İlk konsultasiyadan müalicə sonrası təqibə qədər, qüsursuz səyahət təmin edirik.',
        features: [
            'Xəstəxana və mütəxəssis uyğunlaşdırması',
            'Müalicə planlaması və koordinasiyası',
            'Səyahət və yerləşdirmə tənzimləmələri',
            'Tərcüməçi və konsyerj xidmətləri',
            'Müalicə sonrası təqib',
        ],
        ctaText: 'Tibbi Səyahətinizi Planlaşdırın',
        ctaHref: '/contact?type=patient',
        details: [
            { title: 'Tibbi Koordinasiya', description: 'Xüsusi ehtiyaclarınız üçün ən yaxşı xəstəxanalar və mütəxəssislərlə ekspert uyğunlaşdırması.', tags: ['Onkologiya', 'Kardiologiya', 'Ortopediya', 'Nevrologiya'] },
            { title: 'Səyahət Xidmətləri', description: 'Uçuşlar, transferlər və yerləşdirmə daxil olmaqla tam səyahət tənzimləmələri.', tags: ['Uçuşlar', 'Otellər', 'Transferlər', 'Viza'] },
            { title: 'Konsyerj Dəstəyi', description: 'Tərcüməçilər, yerli bələdçilər və şəxsi yardımla 24/7 dəstək.', tags: ['Dil', 'Dəstək', 'Rəhbərlik', 'Qayğı'] },
        ],
    },
    {
        type: 'process',
        title: 'Prosesimiz',
        subtitle: 'Məqsədlərinizə çatmaq üçün sübut edilmiş yanaşma',
        steps: [
            { title: 'Kəşf', description: 'Ehtiyaclarınızın, məqsədlərinizin və vaxt cədvəlinizin hərtərəfli qiymətləndirilməsi ilə başlayırıq.', icon: 'search' },
            { title: 'Strategiya', description: 'Ekspertlərimiz xüsusi vəziyyətinizə uyğunlaşdırılmış fərdi plan hazırlayır.', icon: 'strategy' },
            { title: 'İcra', description: 'Planı detallara və uyğunluğa diqqətlə həyata keçiririk.', icon: 'execute' },
            { title: 'Uğur', description: 'Davamlı dəstək dayanıqlı nəticələr və davamlı təkmilləşdirmə təmin edir.', icon: 'success' },
        ],
    },
    {
        type: 'cta',
        headline: 'Başlamağa Hazırsınız?',
        description: 'Səhiyyə məqsədlərinizə çatmaqda necə kömək edə biləcəyimizi müzakirə etmək üçün komandamızla əlaqə saxlayın.',
        primaryButton: { text: 'Konsultasiya Planlaşdırın', href: '/contact' },
        secondaryButton: { text: 'Tərəfdaşlarımıza Baxın', href: '/partners' },
    },
];

// ============================================
// PARTNERS PAGE CONTENT
// ============================================

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
        eyebrow: 'Healthcare Network',
        headline: 'Our Partner Institutions',
        description: 'Each partner is carefully vetted to ensure the highest standards of care, accreditation, and patient outcomes.',
        partners: [
            { name: 'Seoul National University Hospital', location: 'Seoul, South Korea', specialty: 'Oncology, Cardiology, Neurosurgery', region: 'Asia Pacific' },
            { name: 'Bumrungrad International Hospital', location: 'Bangkok, Thailand', specialty: 'Orthopedics, Cardiac Care, Wellness', region: 'Asia Pacific' },
            { name: 'Mount Elizabeth Hospital', location: 'Singapore', specialty: 'Neurology, Pediatrics, Women\'s Health', region: 'Asia Pacific' },
            { name: 'Cleveland Clinic Abu Dhabi', location: 'Abu Dhabi, UAE', specialty: 'Cardiology, Oncology, Transplants', region: 'Middle East' },
            { name: 'American Hospital Dubai', location: 'Dubai, UAE', specialty: 'Multi-specialty, Maternity, Pediatrics', region: 'Middle East' },
            { name: 'Hospital Israelita Albert Einstein', location: 'São Paulo, Brazil', specialty: 'Oncology, Cardiology, Neurology', region: 'Americas' },
            { name: 'Schön Klinik München', location: 'Munich, Germany', specialty: 'Orthopedics, Rehabilitation, Sports Medicine', region: 'Europe' },
            { name: 'Anadolu Medical Center', location: 'Istanbul, Turkey', specialty: 'Oncology, Stem Cell, Cardiology', region: 'Europe' },
        ],
        ctaText: 'Become a Partner',
        ctaHref: '/contact?type=partner',
    },
    {
        type: 'cta',
        headline: 'Become a Partner',
        description: 'Join our global network of healthcare institutions and expand your reach to international patients seeking quality care.',
        primaryButton: { text: 'Partner With Us', href: '/contact?type=partner' },
    },
];

const partnersBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Şəbəkəmiz',
        headline: 'Etibarlı Qlobal',
        headlineAccent: 'Səhiyyə Tərəfdaşları',
        text: 'Müştərilərimizin harada olursa olsun dünya səviyyəli qayğı almasını təmin etmək üçün dörd qitədə aparıcı səhiyyə qurumları ilə əlaqələr qurmuşuq.',
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
        eyebrow: 'Səhiyyə Şəbəkəsi',
        headline: 'Tərəfdaş Qurumlarımız',
        description: 'Hər tərəfdaş ən yüksək qayğı standartları, akkreditasiya və xəstə nəticələrini təmin etmək üçün diqqətlə yoxlanılır.',
        partners: [
            { name: 'Seoul National University Hospital', location: 'Seul, Cənubi Koreya', specialty: 'Onkologiya, Kardiologiya, Neyrocərrahiyyə', region: 'Asiya-Sakit Okean' },
            { name: 'Bumrungrad International Hospital', location: 'Banqkok, Tayland', specialty: 'Ortopediya, Kardiak Qayğı, Wellness', region: 'Asiya-Sakit Okean' },
            { name: 'Mount Elizabeth Hospital', location: 'Sinqapur', specialty: 'Nevrologiya, Pediatriya, Qadın Sağlamlığı', region: 'Asiya-Sakit Okean' },
            { name: 'Cleveland Clinic Abu Dhabi', location: 'Əbu-Dabi, BƏƏ', specialty: 'Kardiologiya, Onkologiya, Transplantasiya', region: 'Yaxın Şərq' },
            { name: 'American Hospital Dubai', location: 'Dubay, BƏƏ', specialty: 'Çox ixtisaslı, Analıq, Pediatriya', region: 'Yaxın Şərq' },
            { name: 'Hospital Israelita Albert Einstein', location: 'San-Paulu, Braziliya', specialty: 'Onkologiya, Kardiologiya, Nevrologiya', region: 'Amerikalar' },
            { name: 'Schön Klinik München', location: 'Münhen, Almaniya', specialty: 'Ortopediya, Reabilitasiya, İdman Təbabəti', region: 'Avropa' },
            { name: 'Anadolu Medical Center', location: 'İstanbul, Türkiyə', specialty: 'Onkologiya, Kök Hüceyrə, Kardiologiya', region: 'Avropa' },
        ],
        ctaText: 'Tərəfdaş Olun',
        ctaHref: '/contact?type=partner',
    },
    {
        type: 'cta',
        headline: 'Tərəfdaş Olun',
        description: 'Qlobal səhiyyə qurumları şəbəkəmizə qoşulun və keyfiyyətli tibbi xidmət axtaran beynəlxalq xəstələrə çıxışınızı genişləndirin.',
        primaryButton: { text: 'Bizimlə Əməkdaşlıq Edin', href: '/contact?type=partner' },
    },
];

// ============================================
// CONTACT PAGE CONTENT  
// ============================================

const contactBlocksEn: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Contact Us',
        headline: "Let's Start",
        headlineAccent: 'a Conversation',
        text: "Whether you're exploring pharmaceutical market entry or seeking world-class healthcare abroad, our team is ready to help you achieve your goals.",
    },
    {
        type: 'contact',
        eyebrow: 'Get in Touch',
        headline: 'How Can We Help?',
        description: 'Fill out the form below and our team will get back to you within 24 hours. For urgent inquiries, please call us directly.',
        showForm: true,
        showMap: true,
    },
];

const contactBlocksAz: ContentBlock[] = [
    {
        type: 'intro',
        eyebrow: 'Əlaqə',
        headline: 'Söhbətə',
        headlineAccent: 'Başlayaq',
        text: 'İstər əczaçılıq bazarına girişi araşdırın, istərsə də xaricdə dünya səviyyəli səhiyyə axtarın, komandamız məqsədlərinizə çatmaqda sizə kömək etməyə hazırdır.',
    },
    {
        type: 'contact',
        eyebrow: 'Əlaqə Saxlayın',
        headline: 'Necə Kömək Edə Bilərik?',
        description: 'Aşağıdakı formu doldurun və komandamız 24 saat ərzində sizə cavab verəcək. Təcili sorğular üçün zəhmət olmasa birbaşa bizə zəng edin.',
        showForm: true,
        showMap: true,
    },
];

// ============================================
// SITE SETTINGS
// ============================================

const siteSettings = {
    siteName: 'Silkbridge International',
    logoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    defaultLocale: 'en',
    contactEmail: 'contact@silkbridge.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '350 Fifth Avenue, Suite 7820, New York, NY 10118',
    socialLinks: {
        linkedin: 'https://linkedin.com/company/silkbridge',
        twitter: 'https://twitter.com/silkbridge',
    },
};

const siteSettingsTranslations = {
    en: {
        tagline: 'Connecting Markets & Health Tourism Across Borders',
        footerText: '© 2025 Silkbridge International. All rights reserved.',
    },
    az: {
        tagline: 'Bazarları və Sağlamlıq Turizmini Sərhədlər Arasında Birləşdiririk',
        footerText: '© 2025 Silkbridge International. Bütün hüquqlar qorunur.',
    },
};

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

async function importPages() {
    console.log('🚀 Starting page content import...\n');

    // Ensure locales exist
    console.log('📍 Creating/updating locales...');
    await prisma.locale.upsert({
        where: { code: 'en' },
        update: {},
        create: {
            code: 'en',
            name: 'English',
            nativeName: 'English',
            flag: '🇺🇸',
            isDefault: true,
            isEnabled: true,
        },
    });

    await prisma.locale.upsert({
        where: { code: 'az' },
        update: {},
        create: {
            code: 'az',
            name: 'Azerbaijani',
            nativeName: 'Azərbaycan',
            flag: '🇦🇿',
            isDefault: false,
            isEnabled: true,
        },
    });
    console.log('✅ Locales ready\n');

    // Import pages
    const pages = [
        { slug: 'home', title: { en: 'Home', az: 'Ana Səhifə' }, blocksEn: homeBlocksEn, blocksAz: homeBlocksAz },
        { slug: 'about', title: { en: 'About Us', az: 'Haqqımızda' }, blocksEn: aboutBlocksEn, blocksAz: aboutBlocksAz },
        { slug: 'services', title: { en: 'Our Services', az: 'Xidmətlərimiz' }, blocksEn: servicesBlocksEn, blocksAz: servicesBlocksAz },
        { slug: 'partners', title: { en: 'Our Partners', az: 'Tərəfdaşlarımız' }, blocksEn: partnersBlocksEn, blocksAz: partnersBlocksAz },
        { slug: 'contact', title: { en: 'Contact Us', az: 'Əlaqə' }, blocksEn: contactBlocksEn, blocksAz: contactBlocksAz },
    ];

    for (const pageData of pages) {
        console.log(`📄 Importing ${pageData.slug} page...`);

        // Create or update page
        const page = await prisma.page.upsert({
            where: { slug: pageData.slug },
            update: {},
            create: { slug: pageData.slug },
        });

        // Create English translation
        await prisma.pageTranslation.upsert({
            where: {
                pageId_localeCode: {
                    pageId: page.id,
                    localeCode: 'en',
                },
            },
            update: {
                title: pageData.title.en,
                blocks: pageData.blocksEn as unknown as object,
                status: 'PUBLISHED',
            },
            create: {
                pageId: page.id,
                localeCode: 'en',
                title: pageData.title.en,
                seoTitle: `${pageData.title.en} | Silkbridge International`,
                seoDescription: `${pageData.title.en} - Silkbridge International connects pharmaceutical companies with emerging markets and patients with world-class healthcare.`,
                blocks: pageData.blocksEn as unknown as object,
                status: 'PUBLISHED',
            },
        });

        // Create Azerbaijani translation
        await prisma.pageTranslation.upsert({
            where: {
                pageId_localeCode: {
                    pageId: page.id,
                    localeCode: 'az',
                },
            },
            update: {
                title: pageData.title.az,
                blocks: pageData.blocksAz as unknown as object,
                status: 'PUBLISHED',
            },
            create: {
                pageId: page.id,
                localeCode: 'az',
                title: pageData.title.az,
                seoTitle: `${pageData.title.az} | Silkbridge International`,
                seoDescription: `${pageData.title.az} - Silkbridge International əczaçılıq şirkətlərini inkişaf edən bazarlarla və xəstələri dünya səviyyəli səhiyyə ilə birləşdirir.`,
                blocks: pageData.blocksAz as unknown as object,
                status: 'PUBLISHED',
            },
        });

        console.log(`   ✅ ${pageData.slug} page imported (en + az)\n`);
    }

    // Import site settings
    console.log('⚙️ Importing site settings...');
    const settings = await prisma.siteSettings.upsert({
        where: { id: '1' },
        update: {
            ...siteSettings,
            socialLinks: siteSettings.socialLinks,
        },
        create: {
            id: '1',
            ...siteSettings,
            socialLinks: siteSettings.socialLinks,
        },
    });

    // Create settings translations
    for (const [localeCode, trans] of Object.entries(siteSettingsTranslations)) {
        await prisma.siteSettingsTranslation.upsert({
            where: {
                settingsId_localeCode: {
                    settingsId: settings.id,
                    localeCode,
                },
            },
            update: {
                tagline: trans.tagline,
                footerText: trans.footerText,
            },
            create: {
                settingsId: settings.id,
                localeCode,
                tagline: trans.tagline,
                footerText: trans.footerText,
            },
        });
    }
    console.log('✅ Site settings imported\n');

    console.log('🎉 Import complete! All pages and settings have been populated.');
}

// Run the import
importPages()
    .catch((e) => {
        console.error('❌ Import failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
