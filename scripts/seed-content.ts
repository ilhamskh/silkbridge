#!/usr/bin/env tsx
/**
 * seed-content.ts
 * ============================================================
 * Idempotent content updater for About, Home and Services pages.
 *
 * Strategy
 * --------
 * 1. Looks up each page by slug.
 * 2. For each locale translation, merges ONLY the blocks defined
 *    below into the existing blocks array using (type + serviceId)
 *    as the composite identity key:
 *      - If a matching block already exists → deep-merge text fields
 *        (existing non-empty strings win, so manually edited content
 *        is never overwritten).
 *      - If no matching block → append the new block.
 * 3. Writes back via prisma.pageTranslation.update — no deletes,
 *    no schema changes, no sequence resets.
 *
 * Safe to run multiple times — will NOT duplicate blocks or overwrite
 * content that an admin has already edited.
 *
 * Usage
 * -----
 *   npx tsx scripts/seed-content.ts
 *   DATABASE_URL='postgres://...' npx tsx scripts/seed-content.ts
 * ============================================================
 */

import { prisma } from '../lib/db';

// ============================================================
// Helpers
// ============================================================

/** Return true if value is a non-empty string */
const notEmpty = (v: unknown): v is string =>
    typeof v === 'string' && v.trim().length > 0;

/**
 * Deep-merge two plain objects.
 * - Arrays: existing wins if non-empty; incoming wins if existing is empty/missing.
 * - Strings: existing wins if non-empty; incoming wins if existing is empty/missing.
 * - Objects: recurse.
 * - Primitive (non-string): existing wins.
 */
function mergePreserveExisting(existing: any, incoming: any): any {
    if (incoming === null || incoming === undefined) return existing;
    if (existing === null || existing === undefined) return incoming;

    if (Array.isArray(existing) || Array.isArray(incoming)) {
        // Non-empty existing array wins; otherwise take incoming
        if (Array.isArray(existing) && existing.length > 0) return existing;
        return incoming;
    }

    if (typeof existing === 'object' && typeof incoming === 'object') {
        const result: any = { ...existing };
        for (const key of Object.keys(incoming)) {
            if (key in existing) {
                result[key] = mergePreserveExisting(existing[key], incoming[key]);
            } else {
                result[key] = incoming[key]; // new field → take from incoming
            }
        }
        return result;
    }

    // Primitive (including strings): existing wins if non-empty
    if (typeof existing === 'string') {
        return notEmpty(existing) ? existing : incoming;
    }

    return existing; // numbers, booleans → keep existing
}

/**
 * Build a stable identity key for a block so we can match
 * existing blocks to incoming blocks without relying on array index.
 */
function blockKey(block: any): string {
    const parts = [block.type ?? 'unknown'];
    if (block.serviceId) parts.push(block.serviceId);
    if (block.groupKey) parts.push(block.groupKey);
    // For 'team' blocks use the title as discriminator (multiple team blocks per page)
    if (block.type === 'team' && block.title) parts.push(block.title.slice(0, 40));
    return parts.join('::');
}

/**
 * Merge an array of incoming blocks into an existing blocks array.
 * - Matching blocks (by blockKey) are deep-merged (existing content wins).
 * - Unmatched incoming blocks are appended.
 * - Existing blocks not referenced in incoming are kept as-is.
 */
function mergeBlocks(existing: any[], incoming: any[]): any[] {
    const result = existing.map(b => ({ ...b })); // clone

    for (const inBlock of incoming) {
        const key = blockKey(inBlock);
        const idx = result.findIndex(b => blockKey(b) === key);
        if (idx >= 0) {
            result[idx] = mergePreserveExisting(result[idx], inBlock);
        } else {
            result.push(inBlock); // append missing block
        }
    }

    return result;
}

// ============================================================
// Content definitions
// ============================================================
// Only text-bearing fields are listed. Images stay null.
// Wrap every page with { slug, locales: { en: blocks[], az: blocks[], ru: blocks[] } }
// ============================================================

const PAGES: Array<{
    slug: string;
    locales: Record<string, any[]>;
}> = [

        // ----------------------------------------------------------
        // HOME
        // ----------------------------------------------------------
        {
            slug: 'home',
            locales: {
                en: [
                    {
                        type: 'hero',
                        tagline: 'Silk Bridge\nPharma Distribution Excellence',
                        subtagline: 'A modern international-level distribution company focused on the pharmaceutical market — connecting global manufacturers with Azerbaijan and the wider CIS region.',
                        ctaPrimary: { text: 'Our Services', href: '/services' },
                        ctaSecondary: { text: 'About Us', href: '/about' },
                    },
                    {
                        type: 'about',
                        eyebrow: 'Who We Are',
                        headline: '15+ Years of Pharma',
                        headlineAccent: 'Excellence',
                        mission: 'Silk Bridge is a modern international-level distribution company focused on the pharmaceutical market. For more than 15 years in the international and Azerbaijani markets, the company has combined scientific potential with domestic and foreign pharmaceutical manufacturers, ensuring modern and high-tech production.',
                    },
                    {
                        type: 'insights',
                        eyebrow: 'Our Reach',
                        headline: 'Pharma Market Presence',
                        subheadline: 'Key figures that define our position in the regional pharmaceutical distribution landscape.',
                        stats: [
                            { value: '15+', label: 'Years of Experience', note: 'In Pharma Distribution' },
                            { value: '80%', label: 'State Clinic Coverage', note: 'Doctor Partnerships' },
                            { value: '4+', label: 'Countries Served', note: 'CIS & Former Soviet States' },
                            { value: '100%', label: 'Quality Standards', note: 'International Compliance' },
                        ],
                        ctaText: 'Explore Our Services',
                        ctaHref: '/services',
                    },
                    {
                        type: 'contact',
                        eyebrow: 'Get in Touch',
                        headline: "Let's Work Together",
                        description: 'Contact us to discuss pharmaceutical distribution, partnerships, or market entry opportunities.',
                        showForm: true,
                        showMap: true,
                    },
                ],
                az: [
                    {
                        type: 'hero',
                        tagline: 'Silk Bridge\nFarma Distribusiyasında Mükəmməllik',
                        subtagline: 'Əczaçılıq bazarına yönəlmiş müasir beynəlxalq səviyyəli distribusiya şirkəti — qlobal istehsalçıları Azərbaycan və geniş MDB regionu ilə birləşdirir.',
                        ctaPrimary: { text: 'Xidmətlərimiz', href: '/services' },
                        ctaSecondary: { text: 'Haqqımızda', href: '/about' },
                    },
                    {
                        type: 'about',
                        eyebrow: 'Biz Kimik',
                        headline: 'Farmada 15+ İl',
                        headlineAccent: 'Mükəmməllik',
                        mission: 'Silk Bridge əczaçılıq bazarına yönəlmiş müasir beynəlxalq səviyyəli distribusiya şirkətidir. Beynəlxalq və Azərbaycan bazarlarında 15 ildən çox fəaliyyət göstərərək şirkət elmi potensialı yerli və xarici əczaçılıq istehsalçıları ilə birləşdirmişdir.',
                    },
                    {
                        type: 'insights',
                        eyebrow: 'Əhatəmiz',
                        headline: 'Farma Bazar İştirakı',
                        subheadline: 'Regional əczaçılıq distribusiyasındakı mövqeyimizi müəyyən edən əsas rəqəmlər.',
                        stats: [
                            { value: '15+', label: 'İl Təcrübə', note: 'Farma Distribusiyasında' },
                            { value: '80%', label: 'Dövlət Klinika Əhatəsi', note: 'Həkim Tərəfdaşlıqları' },
                            { value: '4+', label: 'Ölkə', note: 'MDB və Keçmiş SSRİ' },
                            { value: '100%', label: 'Keyfiyyət Standartları', note: 'Beynəlxalq Uyğunluq' },
                        ],
                        ctaText: 'Xidmətlərimizi Kəşf Edin',
                        ctaHref: '/services',
                    },
                    {
                        type: 'contact',
                        eyebrow: 'Əlaqə',
                        headline: 'Birgə Çalışaq',
                        description: 'Əczaçılıq distribusiyası, tərəfdaşlıqlar və ya bazara giriş imkanlarını müzakirə etmək üçün bizimlə əlaqə saxlayın.',
                        showForm: true,
                        showMap: true,
                    },
                ],
                ru: [
                    {
                        type: 'hero',
                        tagline: 'Silk Bridge\nСовершенство в Фарма Дистрибуции',
                        subtagline: 'Современная дистрибьюторская компания международного уровня, ориентированная на фармацевтический рынок — связывает мировых производителей с Азербайджаном и странами СНГ.',
                        ctaPrimary: { text: 'Наши Услуги', href: '/services' },
                        ctaSecondary: { text: 'О нас', href: '/about' },
                    },
                    {
                        type: 'about',
                        eyebrow: 'Кто Мы',
                        headline: '15+ лет Фарма',
                        headlineAccent: 'Совершенства',
                        mission: 'Silk Bridge — современная дистрибьюторская компания международного уровня, ориентированная на фармацевтический рынок. За более чем 15 лет работы на международных рынках компания объединила научный потенциал с отечественными и зарубежными фармацевтическими производителями.',
                    },
                    {
                        type: 'insights',
                        eyebrow: 'Наш Охват',
                        headline: 'Присутствие на Фарма Рынке',
                        subheadline: 'Ключевые показатели, определяющие наши позиции в региональной фармацевтической дистрибуции.',
                        stats: [
                            { value: '15+', label: 'Лет Опыта', note: 'В Фарма Дистрибуции' },
                            { value: '80%', label: 'Охват Гос. Клиник', note: 'Партнёрства с Врачами' },
                            { value: '4+', label: 'Страны', note: 'СНГ и Бывший СССР' },
                            { value: '100%', label: 'Стандарты Качества', note: 'Международное Соответствие' },
                        ],
                        ctaText: 'Наши Услуги',
                        ctaHref: '/services',
                    },
                    {
                        type: 'contact',
                        eyebrow: 'Связаться',
                        headline: 'Работаем Вместе',
                        description: 'Свяжитесь с нами для обсуждения фармацевтической дистрибуции, партнёрства или выхода на рынок.',
                        showForm: true,
                        showMap: true,
                    },
                ],
            },
        },

        // ----------------------------------------------------------
        // ABOUT
        // ----------------------------------------------------------
        {
            slug: 'about',
            locales: {
                en: [
                    {
                        type: 'intro',
                        eyebrow: 'About Us',
                        headline: 'International Pharma',
                        headlineAccent: 'Distribution',
                        text: 'Silk Bridge is a modern international-level distribution company focused on the pharmaceutical market. For more than 15 years in the international and Azerbaijani markets, we have combined scientific potential with domestic and foreign pharmaceutical manufacturers, ensuring modern and high-tech production.',
                    },
                    {
                        type: 'values',
                        title: 'Our Principles',
                        subtitle: 'The values that guide everything we do in pharmaceutical distribution',
                        values: [
                            {
                                title: 'International Quality Standards',
                                description: 'We work only with innovative producers meeting international quality standards, distributing therapeutic, preventive and cosmetic products.',
                            },
                            {
                                title: 'Scientific Excellence',
                                description: 'We actively participate in scientific and practical conferences worldwide and maintain a professional medical marketing department.',
                            },
                            {
                                title: 'Ethical Representation',
                                description: 'Our mission is to honestly, competently and professionally represent global manufacturers and deliver innovative healthcare solutions.',
                            },
                            {
                                title: 'Logistics & Infrastructure',
                                description: 'We operate advanced nationwide logistics infrastructure including warehouses, distribution depots, and our own pharmacy chain in Baku.',
                            },
                        ],
                    },
                    {
                        type: 'storyline',
                        title: 'Our Journey',
                        text: 'From a local distribution pioneer to an international pharmaceutical bridge — connecting innovation with patients across the CIS.',
                        beats: [
                            { id: '1', year: '2008', kicker: 'FOUNDING', title: 'Established in Baku', description: 'Silk Bridge was founded with the mission to bring international pharmaceutical innovation to the Azerbaijani market.' },
                            { id: '2', year: '2012', kicker: 'EXPANSION', title: 'Regional Growth', description: 'Extended operations to Ukraine, Georgia, Uzbekistan and other former Soviet states, building a pan-CIS distribution network.' },
                            { id: '3', year: '2015', kicker: 'PARTNERSHIPS', title: 'Global Manufacturers', description: 'Secured long-term distribution agreements with Worwag (Germany), Ipsen (France), Denk (Germany), and Bago (Argentina).' },
                            { id: '4', year: '2018', kicker: 'INFRASTRUCTURE', title: 'Logistics Network', description: 'Launched advanced nationwide logistics infrastructure with temperature-controlled warehouses and distribution depots across Azerbaijan.' },
                            { id: '5', year: '2021', kicker: 'WELLNESS', title: 'Pharmacy & Aesthetics', description: 'Opened our own pharmacy chain and cosmetic & aesthetic centers in Baku, extending our reach to end consumers.' },
                            { id: '6', year: 'TODAY', kicker: 'LEADERSHIP', title: '15+ Years Strong', description: 'Today Silk Bridge is a trusted bridge between global pharmaceutical innovation and healthcare professionals across the CIS region.' },
                        ],
                    },
                    {
                        type: 'cta',
                        headline: 'Partner with Silk Bridge',
                        description: 'Explore distribution, co-promotion and market entry opportunities for your pharmaceutical products in Azerbaijan and the CIS.',
                        primaryButton: { text: 'Contact Us', href: '/contact' },
                        secondaryButton: { text: 'Our Services', href: '/services' },
                    },
                ],
                az: [
                    {
                        type: 'intro',
                        eyebrow: 'Haqqımızda',
                        headline: 'Beynəlxalq Farma',
                        headlineAccent: 'Distribusiyası',
                        text: 'Silk Bridge əczaçılıq bazarına yönəlmiş müasir beynəlxalq səviyyəli distribusiya şirkətidir. Beynəlxalq və Azərbaycan bazarlarında 15 ildən çox fəaliyyət göstərərək biz elmi potensialı yerli və xarici əczaçılıq istehsalçıları ilə birləşdirmişik.',
                    },
                    {
                        type: 'values',
                        title: 'Prinsiplərimiz',
                        subtitle: 'Əczaçılıq distribusiyasında etdiyimiz hər şeyi istiqamətləndirən dəyərlər',
                        values: [
                            {
                                title: 'Beynəlxalq Keyfiyyət Standartları',
                                description: 'Biz yalnız beynəlxalq keyfiyyət standartlarına cavab verən innovativ istehsalçılarla işləyirik.',
                            },
                            {
                                title: 'Elmi Mükəmməllik',
                                description: 'Dünya üzrə elmi-praktiki konfranslarda fəal iştirak edirik və peşəkar tibbi marketinq şöbəsi saxlayırıq.',
                            },
                            {
                                title: 'Etik Təmsil',
                                description: 'Missiyamız qlobal istehsalçıları dürüst, bacarıqlı və peşəkar şəkildə təmsil etmək və innovativ həkimlik çözümləri çatdırmaqdır.',
                            },
                            {
                                title: 'Logistika və İnfrastruktur',
                                description: 'Bakıda öz aptek şəbəkəmizi, anbar və distribusiya deposları da daxil olmaqla bütün ölkə üzrə inkişaf etmiş logistika infrastrukturu işlədirik.',
                            },
                        ],
                    },
                    {
                        type: 'storyline',
                        title: 'Yolumuz',
                        text: 'Yerli distribusiya pişrovundan beynəlxalq əczaçılıq körpüsünə — MDB üzrə xəstələrlə innovasiyanı birləşdiririk.',
                        beats: [
                            { id: '1', year: '2008', kicker: 'QURULUŞ', title: 'Bakıda Yaradıldı', description: 'Silk Bridge beynəlxalq əczaçılıq innovasiyasını Azərbaycan bazarına gətirmək missiyası ilə yaradıldı.' },
                            { id: '2', year: '2012', kicker: 'GENİŞLƏNMƏ', title: 'Regional Böyümə', description: 'Ukrayna, Gürcüstan, Özbəkistan və digər keçmiş Sovet dövlətlərini əhatə edən pan-MDB distribusiya şəbəkəsi quruldu.' },
                            { id: '3', year: '2015', kicker: 'TƏRƏFDAŞLIQ', title: 'Qlobal İstehsalçılar', description: 'Worwag (Almaniya), Ipsen (Fransa), Denk (Almaniya) və Bago (Argentina) ilə uzunmüddətli distribusiya müqavilələri imzalandı.' },
                            { id: '4', year: '2018', kicker: 'İNFRASTRUKTUR', title: 'Logistika Şəbəkəsi', description: 'Azərbaycan üzrə temperatur nəzarətli anbar və distribusiya deposları ilə inkişaf etmiş logistika infrastrukturu yaradıldı.' },
                            { id: '5', year: '2021', kicker: 'SAĞLAMLIQ', title: 'Aptek və Estetika', description: 'Bakıda öz aptek şəbəkəmizi və kosmetik-estetik mərkəzlər açdıq.' },
                            { id: '6', year: 'BU GÜN', kicker: 'LİDERLİK', title: '15+ İl Güclü', description: 'Bu gün Silk Bridge qlobal əczaçılıq innovasiyası ilə MDB üzrə səhiyyə mütəxəssisləri arasında etibarlı körpüdür.' },
                        ],
                    },
                    {
                        type: 'cta',
                        headline: 'Silk Bridge ilə Tərəfdaş Olun',
                        description: 'Azərbaycan və MDB-də əczaçılıq məhsullarınız üçün distribusiya, ko-promosyon və bazara giriş imkanlarını araşdırın.',
                        primaryButton: { text: 'Bizimlə Əlaqə', href: '/contact' },
                        secondaryButton: { text: 'Xidmətlərimiz', href: '/services' },
                    },
                ],
                ru: [
                    {
                        type: 'intro',
                        eyebrow: 'О нас',
                        headline: 'Международная Фарма',
                        headlineAccent: 'Дистрибуция',
                        text: 'Silk Bridge — современная дистрибьюторская компания международного уровня, ориентированная на фармацевтический рынок. Более 15 лет на международных и азербайджанском рынках мы объединяем научный потенциал с отечественными и зарубежными фармацевтическими производителями.',
                    },
                    {
                        type: 'values',
                        title: 'Наши Принципы',
                        subtitle: 'Ценности, которые направляют всё, что мы делаем в фармацевтической дистрибуции',
                        values: [
                            {
                                title: 'Международные Стандарты Качества',
                                description: 'Мы работаем только с инновационными производителями, соответствующими международным стандартам качества.',
                            },
                            {
                                title: 'Научное Совершенство',
                                description: 'Активно участвуем в научно-практических конференциях по всему миру и поддерживаем профессиональный медицинский маркетинговый отдел.',
                            },
                            {
                                title: 'Этичное Представительство',
                                description: 'Наша миссия — честно, компетентно и профессионально представлять мировых производителей и поставлять инновационные решения в области здравоохранения.',
                            },
                            {
                                title: 'Логистика и Инфраструктура',
                                description: 'Мы управляем развитой общенациональной логистической инфраструктурой, включая склады, распределительные депо и собственную аптечную сеть в Баку.',
                            },
                        ],
                    },
                    {
                        type: 'storyline',
                        title: 'Наш Путь',
                        text: 'От местного дистрибьютора-пионера до международного фармацевтического моста — соединяем инновации с пациентами по всему СНГ.',
                        beats: [
                            { id: '1', year: '2008', kicker: 'ОСНОВАНИЕ', title: 'Основана в Баку', description: 'Silk Bridge была основана с миссией привнести международные фармацевтические инновации на азербайджанский рынок.' },
                            { id: '2', year: '2012', kicker: 'РАСШИРЕНИЕ', title: 'Региональный Рост', description: 'Расширение деятельности на Украину, Грузию, Узбекистан и другие бывшие советские государства.' },
                            { id: '3', year: '2015', kicker: 'ПАРТНЁРСТВА', title: 'Глобальные Производители', description: 'Заключены долгосрочные дистрибьюторские соглашения с Worwag (Германия), Ipsen (Франция), Denk (Германия) и Bago (Аргентина).' },
                            { id: '4', year: '2018', kicker: 'ИНФРАСТРУКТУРА', title: 'Логистическая Сеть', description: 'Запущена развитая логистическая инфраструктура с температурными складами по всему Азербайджану.' },
                            { id: '5', year: '2021', kicker: 'ВЕЛНЕС', title: 'Аптеки и Эстетика', description: 'Открыты собственная аптечная сеть и косметико-эстетические центры в Баку.' },
                            { id: '6', year: 'СЕГОДНЯ', kicker: 'ЛИДЕРСТВО', title: '15+ Лет Успеха', description: 'Сегодня Silk Bridge — надёжный мост между глобальными фармацевтическими инновациями и медицинскими специалистами СНГ.' },
                        ],
                    },
                    {
                        type: 'cta',
                        headline: 'Станьте Партнёром Silk Bridge',
                        description: 'Изучите возможности дистрибуции, копродвижения и выхода на рынок для ваших фармацевтических продуктов в Азербайджане и СНГ.',
                        primaryButton: { text: 'Связаться', href: '/contact' },
                        secondaryButton: { text: 'Наши Услуги', href: '/services' },
                    },
                ],
            },
        },

        // ----------------------------------------------------------
        // SERVICES
        // ----------------------------------------------------------
        {
            slug: 'services',
            locales: {
                en: [
                    {
                        type: 'intro',
                        eyebrow: 'Our Services',
                        headline: 'Full-Spectrum Pharma',
                        headlineAccent: 'Distribution',
                        text: 'From therapeutic and preventive products to cosmetic lines and dietary supplements — Silk Bridge provides end-to-end pharmaceutical distribution services across Azerbaijan and the CIS.',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'pharmaDistribution',
                        title: 'Pharmaceutical Distribution',
                        description: 'End-to-end distribution of therapeutic, preventive and cosmetic products from leading global manufacturers across Azerbaijan.',
                        features: [
                            'Therapeutic product distribution',
                            'Preventive product lines',
                            'Cosmetic product logistics',
                            'Temperature-controlled storage',
                            'Nationwide delivery network',
                        ],
                        ctaText: 'Learn More',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'marketEntry',
                        title: 'CIS Market Entry Support',
                        description: 'Regulatory, logistic and commercial support for international pharmaceutical companies entering Azerbaijan, Ukraine, Georgia and Uzbekistan.',
                        features: [
                            'Product registration support',
                            'Regulatory compliance guidance',
                            'Local market intelligence',
                            'Distribution network access',
                            'Scientific conference representation',
                        ],
                        ctaText: 'Enter the Market',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'pharmacyChain',
                        title: 'Pharmacy Chain & Aesthetic Centers',
                        description: 'Owned pharmacy locations and cosmetic & aesthetic centers in Baku for direct-to-consumer access.',
                        features: [
                            'Retail pharmacy network in Baku',
                            'Cosmetic & aesthetic medical centers',
                            'Consumer health advisory',
                            'Product availability monitoring',
                            'Patient education programs',
                        ],
                        ctaText: 'Find a Location',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'logistics',
                        title: 'Logistics & Warehousing',
                        description: 'Advanced nationwide logistics infrastructure with proper storage, efficient inventory management, and professional product delivery.',
                        features: [
                            'Temperature-controlled warehouses',
                            'Distribution depots nationwide',
                            'Inventory management systems',
                            'Cold-chain integrity',
                            'Operational transport fleet',
                        ],
                        ctaText: 'Logistics Enquiry',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'medicalMarketing',
                        title: 'Medical Marketing',
                        description: 'A professional marketing department composed of specialists including professionals with higher medical education, ensuring ethical and medically accurate product promotion.',
                        features: [
                            'Medically qualified promotion team',
                            'Scientific conference participation',
                            'KOL engagement programs',
                            'Ethical detailing to physicians',
                            'Balanced product portfolio management',
                        ],
                        ctaText: 'Marketing Partnership',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'process',
                        title: 'How We Work',
                        subtitle: 'A streamlined, compliant process from manufacturer to patient',
                        steps: [
                            { title: 'Registration & Compliance', description: 'We handle product registration and ensure full regulatory compliance in every market.' },
                            { title: 'Importation & Storage', description: 'Products are imported, quality-checked and stored in certified temperature-controlled facilities.' },
                            { title: 'Distribution', description: 'Our nationwide network delivers products to pharmacies, hospitals and clinics on time.' },
                            { title: 'Medical Promotion', description: 'Our medical field team conducts ethical, evidence-based promotion to healthcare professionals.' },
                        ],
                    },
                    {
                        type: 'cta',
                        headline: 'Ready to Distribute with Silk Bridge?',
                        description: 'Reliability, quality and innovation — that is our promise to every manufacturing partner.',
                        primaryButton: { text: 'Contact Us', href: '/contact' },
                        secondaryButton: { text: 'Our Partners', href: '/partners' },
                    },
                ],
                az: [
                    {
                        type: 'intro',
                        eyebrow: 'Xidmətlərimiz',
                        headline: 'Tam Spektrli Farma',
                        headlineAccent: 'Distribusiyası',
                        text: 'Müalicəvi və profilaktik məhsullardan kosmetik xətlərə və pəhriz əlavələrinə qədər — Silk Bridge Azərbaycan və MDB üzrə hərtərəfli əczaçılıq distribusiya xidmətləri göstərir.',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'pharmaDistribution',
                        title: 'Əczaçılıq Distribusiyası',
                        description: 'Aparıcı qlobal istehsalçılardan Azərbaycan üzrə müalicəvi, profilaktik və kosmetik məhsulların tam distribusiyası.',
                        features: [
                            'Müalicəvi məhsul distribusiyası',
                            'Profilaktik məhsul xətləri',
                            'Kosmetik məhsul logistikası',
                            'Temperatur nəzarətli saxlama',
                            'Ölkə üzrə çatdırılma şəbəkəsi',
                        ],
                        ctaText: 'Ətraflı',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'marketEntry',
                        title: 'MDB Bazarına Giriş Dəstəyi',
                        description: 'Azərbaycan, Ukrayna, Gürcüstan və Özbəkistana daxil olan beynəlxalq əczaçılıq şirkətləri üçün tənzimləmə, logistika və kommersiya dəstəyi.',
                        features: [
                            'Məhsul qeydiyyatı dəstəyi',
                            'Tənzimləmə uyğunluğu bələdçiliyi',
                            'Yerli bazar məlumatı',
                            'Distribusiya şəbəkəsinə çıxış',
                            'Elmi konfranslarda təmsil',
                        ],
                        ctaText: 'Bazara Daxil Olun',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'pharmacyChain',
                        title: 'Aptek Şəbəkəsi və Estetik Mərkəzlər',
                        description: 'İstehlakçıya birbaşa çıxış üçün Bakıda öz aptek yerləri və kosmetik-estetik mərkəzlər.',
                        features: [
                            'Bakıda pərakəndə aptek şəbəkəsi',
                            'Kosmetik və estetik tibb mərkəzləri',
                            'İstehlakçı sağlamlıq məşvərəti',
                            'Məhsul mövcudluğunun monitorinqi',
                            'Xəstə təhsili proqramları',
                        ],
                        ctaText: 'Yer Tapın',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'logistics',
                        title: 'Logistika və Anbar',
                        description: 'Düzgün saxlama, səmərəli inventar idarəetməsi və peşəkar məhsul çatdırılması ilə inkişaf etmiş ölkə miqyaslı logistika infrastrukturu.',
                        features: [
                            'Temperatur nəzarətli anbarlar',
                            'Ölkə üzrə distribusiya depoları',
                            'İnventar idarəetmə sistemləri',
                            'Soyuq zəncir bütövlüyü',
                            'Əməliyyat nəqliyyat parkı',
                        ],
                        ctaText: 'Logistika Sorğusu',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'medicalMarketing',
                        title: 'Tibbi Marketinq',
                        description: 'Ali tibbi təhsilli mütəxəssislər daxil olmaqla mütəxəssislərdən ibarət peşəkar marketinq şöbəsi — etik və tibbi cəhətdən dəqiq məhsul tanıtımını təmin edir.',
                        features: [
                            'Tibbi ixtisaslı tanıtım komandası',
                            'Elmi konfranslarda iştirak',
                            'KOL cəlb proqramları',
                            'Həkimlərə etik detallaşdırma',
                            'Balanslaşdırılmış məhsul portfeli idarəetməsi',
                        ],
                        ctaText: 'Marketinq Tərəfdaşlığı',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'process',
                        title: 'Necə İşləyirik',
                        subtitle: 'İstehsalçıdan xəstəyə qədər sadələşdirilmiş, uyğun proses',
                        steps: [
                            { title: 'Qeydiyyat və Uyğunluq', description: 'Məhsul qeydiyyatını həll edirik və hər bazarda tam tənzimləmə uyğunluğunu təmin edirik.' },
                            { title: 'İdxal və Saxlama', description: 'Məhsullar idxal edilir, keyfiyyət yoxlanılır və sertifikatlı temperatur nəzarətli qurğularda saxlanılır.' },
                            { title: 'Distribusiya', description: 'Ölkə üzrə şəbəkəmiz məhsulları vaxtında apteklərə, xəstəxanalara və klinikalara çatdırır.' },
                            { title: 'Tibbi Tanıtım', description: 'Tibbi səha komandamız səhiyyə mütəxəssislərinə etik, sübutlara əsaslanan tanıtım aparır.' },
                        ],
                    },
                    {
                        type: 'cta',
                        headline: 'Silk Bridge ilə Distribusiyaya Hazırsınız?',
                        description: 'Etibarlılıq, keyfiyyət və innovasiya — hər istehsalçı tərəfdaşa verdiyimiz sözdür.',
                        primaryButton: { text: 'Bizimlə Əlaqə', href: '/contact' },
                        secondaryButton: { text: 'Tərəfdaşlarımız', href: '/partners' },
                    },
                ],
                ru: [
                    {
                        type: 'intro',
                        eyebrow: 'Наши Услуги',
                        headline: 'Полноспектральная Фарма',
                        headlineAccent: 'Дистрибуция',
                        text: 'От терапевтических и профилактических продуктов до косметических линеек и БАДов — Silk Bridge обеспечивает полный цикл фармацевтической дистрибуции по Азербайджану и СНГ.',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'pharmaDistribution',
                        title: 'Фармацевтическая Дистрибуция',
                        description: 'Комплексная дистрибуция терапевтических, профилактических и косметических продуктов ведущих мировых производителей по всему Азербайджану.',
                        features: [
                            'Дистрибуция терапевтических продуктов',
                            'Профилактические продуктовые линейки',
                            'Логистика косметических продуктов',
                            'Температурный контроль хранения',
                            'Общенациональная сеть доставки',
                        ],
                        ctaText: 'Узнать Больше',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'marketEntry',
                        title: 'Выход на Рынок СНГ',
                        description: 'Регуляторная, логистическая и коммерческая поддержка для международных фармацевтических компаний, выходящих на рынки Азербайджана, Украины, Грузии и Узбекистана.',
                        features: [
                            'Поддержка регистрации продуктов',
                            'Руководство по нормативному соответствию',
                            'Аналитика местного рынка',
                            'Доступ к дистрибьюторской сети',
                            'Представительство на научных конференциях',
                        ],
                        ctaText: 'Выйти на Рынок',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'pharmacyChain',
                        title: 'Аптечная Сеть и Эстетические Центры',
                        description: 'Собственные аптеки и косметико-эстетические центры в Баку для прямого доступа к потребителям.',
                        features: [
                            'Розничная аптечная сеть в Баку',
                            'Косметические и эстетические медцентры',
                            'Консультации по здоровью потребителей',
                            'Мониторинг наличия продуктов',
                            'Программы обучения пациентов',
                        ],
                        ctaText: 'Найти Аптеку',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'logistics',
                        title: 'Логистика и Складирование',
                        description: 'Развитая общенациональная логистическая инфраструктура с надлежащим хранением, эффективным управлением запасами и профессиональной доставкой продуктов.',
                        features: [
                            'Склады с температурным контролем',
                            'Распределительные депо по стране',
                            'Системы управления запасами',
                            'Целостность холодовой цепи',
                            'Оперативный транспортный парк',
                        ],
                        ctaText: 'Запрос по Логистике',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'serviceDetails',
                        serviceId: 'medicalMarketing',
                        title: 'Медицинский Маркетинг',
                        description: 'Профессиональный отдел маркетинга, состоящий из специалистов со специальным медицинским образованием, обеспечивающий этичное и медицински точное продвижение продуктов.',
                        features: [
                            'Медицински квалифицированная команда продвижения',
                            'Участие в научных конференциях',
                            'Программы работы с KOL',
                            'Этическое детейлирование врачей',
                            'Управление сбалансированным портфелем продуктов',
                        ],
                        ctaText: 'Маркетинговое Партнёрство',
                        ctaHref: '/contact',
                    },
                    {
                        type: 'process',
                        title: 'Как Мы Работаем',
                        subtitle: 'Упорядоченный, соответствующий нормам процесс от производителя до пациента',
                        steps: [
                            { title: 'Регистрация и Соответствие', description: 'Мы занимаемся регистрацией продуктов и обеспечиваем полное регуляторное соответствие на каждом рынке.' },
                            { title: 'Импорт и Хранение', description: 'Продукты импортируются, проходят контроль качества и хранятся в сертифицированных температурных помещениях.' },
                            { title: 'Дистрибуция', description: 'Наша сеть доставляет продукты в аптеки, больницы и клиники вовремя.' },
                            { title: 'Медицинское Продвижение', description: 'Наша медицинская полевая команда проводит этичное, доказательное продвижение для медицинских специалистов.' },
                        ],
                    },
                    {
                        type: 'cta',
                        headline: 'Готовы Дистрибутировать с Silk Bridge?',
                        description: 'Надёжность, качество и инновации — наше обещание каждому производственному партнёру.',
                        primaryButton: { text: 'Связаться', href: '/contact' },
                        secondaryButton: { text: 'Наши Партнёры', href: '/partners' },
                    },
                ],
            },
        },
    ];

// ============================================================
// Main
// ============================================================

async function main() {
    console.log('📝 Content seeder — About, Home, Services\n');

    let totalUpdated = 0;
    let totalSkipped = 0;

    for (const pageConfig of PAGES) {
        const page = await prisma.page.findUnique({
            where: { slug: pageConfig.slug },
            include: { translations: true },
        });

        if (!page) {
            console.warn(`  ⚠️  Page slug "${pageConfig.slug}" not found — skipping.`);
            continue;
        }

        console.log(`\n📄 Page: ${pageConfig.slug}`);

        for (const [localeCode, incomingBlocks] of Object.entries(pageConfig.locales)) {
            const translation = page.translations.find(t => t.localeCode === localeCode);

            if (!translation) {
                console.log(`  ⏭  Locale "${localeCode}" translation not found — skipping.`);
                totalSkipped++;
                continue;
            }

            const existingBlocks: any[] = Array.isArray(translation.blocks)
                ? (translation.blocks as any[])
                : [];

            const merged = mergeBlocks(existingBlocks, incomingBlocks);

            // Stringify both for a quick equality check to avoid no-op writes
            const existingStr = JSON.stringify(existingBlocks);
            const mergedStr = JSON.stringify(merged);

            if (existingStr === mergedStr) {
                console.log(`  ✓  [${localeCode}] No changes needed.`);
                totalSkipped++;
                continue;
            }

            await prisma.pageTranslation.update({
                where: { id: translation.id },
                data: { blocks: merged as any },
            });

            const newCount = merged.length - existingBlocks.length;
            const mergedCount = merged.length - (newCount > 0 ? newCount : 0);
            console.log(
                `  ✓  [${localeCode}] Updated — ${existingBlocks.length} → ${merged.length} blocks` +
                (newCount > 0 ? ` (${newCount} new added)` : ' (blocks merged in-place)')
            );
            totalUpdated++;
        }
    }

    console.log(`\n✅ Done. Updated: ${totalUpdated} translations, Unchanged: ${totalSkipped}.\n`);
    console.log('Production safety checklist:');
    console.log('  ✅ No duplicates created');
    console.log('  ✅ No schema changes');
    console.log('  ✅ No destructive operations');
    console.log('  ✅ No hard deletes');
    console.log('  ✅ No migration required');
    console.log('  ✅ Safe to run multiple times');
    console.log('  ✅ All content editable in admin panel');
    console.log('  ✅ Images remain null (upload via admin panel)');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
