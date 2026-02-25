#!/usr/bin/env tsx
/**
 * seed-real-about.ts
 * ==========================================
 * Seeds the REAL Silk Bridge International company content
 * into About, Home and Services pages.
 *
 * Strategy: INCOMING TEXT WINS — this is intentional content
 * replacement, not accidental overwrite. Block structure fields
 * (type, serviceId, etc.) are always preserved.
 *
 * Idempotent: running twice produces identical DB state.
 *
 * Usage:
 *   set -a && source .env && set +a && npx tsx scripts/seed-real-about.ts
 *   DATABASE_URL='...' npx tsx scripts/seed-real-about.ts
 */

import { prisma } from '../lib/db';

// ── helpers ──────────────────────────────────────────────────

function blockKey(b: any): string {
    const p = [b.type ?? 'unknown'];
    if (b.serviceId) p.push(b.serviceId);
    if (b.groupKey) p.push(b.groupKey);
    if (b.type === 'team' && b.title) p.push(b.title.slice(0, 40));
    return p.join('::');
}

/** Merge: for plain objects recurse; arrays and primitives — incoming wins */
function mergeIncomingWins(existing: any, incoming: any): any {
    if (incoming == null) return existing;
    if (existing == null) return incoming;
    if (Array.isArray(incoming)) return incoming;           // arrays: incoming wins
    if (typeof incoming === 'object' && typeof existing === 'object') {
        const result: any = { ...existing };
        for (const k of Object.keys(incoming)) {
            result[k] = mergeIncomingWins(existing[k], incoming[k]);
        }
        return result;
    }
    return incoming;   // primitive (string/number/bool): incoming wins
}

function mergeBlocks(existing: any[], incoming: any[]): any[] {
    const result = existing.map(b => ({ ...b }));
    for (const inB of incoming) {
        const key = blockKey(inB);
        const idx = result.findIndex(b => blockKey(b) === key);
        if (idx >= 0) {
            result[idx] = mergeIncomingWins(result[idx], inB);
        } else {
            result.push(inB);
        }
    }
    return result;
}

// ── content ──────────────────────────────────────────────────

const PAGES: Array<{ slug: string; locales: Record<string, any[]> }> = [

    // ══════════════════════════════════════════════════════════
    // HOME
    // ══════════════════════════════════════════════════════════
    {
        slug: 'home',
        locales: {
            en: [
                {
                    type: 'hero',
                    tagline: 'Silk Bridge\nReliability, Quality and Innovation',
                    subtagline: 'A modern international-level distribution company focused on the pharmaceutical market — 15+ years connecting global manufacturers with patients across Azerbaijan and the CIS.',
                    ctaPrimary: { text: 'Our Services', href: '/services' },
                    ctaSecondary: { text: 'About Us', href: '/about' },
                },
                {
                    type: 'about',
                    eyebrow: 'Who We Are',
                    headline: '15+ Years of Pharma',
                    headlineAccent: 'Excellence',
                    mission: 'Silk Bridge is a modern distribution company of international level, focused on the pharmaceutical market. Working in the international and Azerbaijani market for more than 15 years, we have successfully combined the scientific potential and experience of domestic and foreign companies, providing high-tech modern production to patients across the region.',
                    pillars: [
                        { title: 'Quality Standards', description: 'We work only with innovative producers capable of meeting international quality standards.', icon: 'quality' },
                        { title: 'Scientific Activity', description: 'We actively participate in scientific and practical conferences around the world.', icon: 'experience' },
                        { title: 'Medical Marketing', description: 'Our marketing department includes specialists with higher medical education for accurate promotion.', icon: 'personal' },
                        { title: 'Logistics Network', description: 'Own warehouses, depots, pharmacy chain and aesthetic centers across Azerbaijan.', icon: 'unique' },
                    ],
                },
                {
                    type: 'insights',
                    eyebrow: 'Our Scale',
                    headline: 'Silk Bridge by the Numbers',
                    subheadline: 'Trusted across borders — from Baku to the wider CIS region.',
                    stats: [
                        { value: '15+', label: 'Years on Market', note: 'International & Azerbaijan' },
                        { value: '~100', label: 'Team Members', note: 'Including Medical Graduates' },
                        { value: '4+', label: 'CIS Countries', note: 'Ukraine, Georgia, Uzbekistan & more' },
                        { value: '100%', label: 'Quality Commitment', note: 'International Standards' },
                    ],
                    ctaText: 'Explore Our Services',
                    ctaHref: '/services',
                },
                {
                    type: 'contact',
                    eyebrow: 'Get in Touch',
                    headline: "Let's Work Together",
                    description: 'Contact us to discuss pharmaceutical distribution, partnerships, or market entry opportunities in Azerbaijan and the CIS.',
                    showForm: true,
                    showMap: true,
                },
            ],
            az: [
                {
                    type: 'hero',
                    tagline: 'Silk Bridge\nEtibarlılıq, Keyfiyyət və İnnovasiya',
                    subtagline: 'Əczaçılıq bazarına yönəlmiş müasir beynəlxalq səviyyəli distribusiya şirkəti — 15 ildən çox Azərbaycan və MDB üzrə qlobal istehsalçıları xəstələrlə birləşdirir.',
                    ctaPrimary: { text: 'Xidmətlərimiz', href: '/services' },
                    ctaSecondary: { text: 'Haqqımızda', href: '/about' },
                },
                {
                    type: 'about',
                    eyebrow: 'Biz Kimik',
                    headline: 'Farmada 15+ İl',
                    headlineAccent: 'Mükəmməllik',
                    mission: 'Silk Bridge əczaçılıq bazarına yönəlmiş müasir beynəlxalq səviyyəli distribusiya şirkətidir. Beynəlxalq və Azərbaycan bazarında 15 ildən çox fəaliyyət göstərərək biz elmi potensialı yerli və xarici şirkətlərin təcrübəsi ilə uğurla birləşdirmişik, regiondakı xəstələrə yüksək texnolojili müasir istehsal təqdim edirik.',
                    pillars: [
                        { title: 'Keyfiyyət Standartları', description: 'Biz yalnız beynəlxalq keyfiyyət standartlarına cavab verən innovativ istehsalçılarla işləyirik.', icon: 'quality' },
                        { title: 'Elmi Fəaliyyət', description: 'Dünya üzrə elmi-praktiki konfranslarda fəal iştirak edirik.', icon: 'experience' },
                        { title: 'Tibbi Marketinq', description: 'Marketinq şöbəmiz tibbi ali təhsilli mütəxəssisləri əhatə edir.', icon: 'personal' },
                        { title: 'Logistika Şəbəkəsi', description: 'Azərbaycan üzrə öz anbarları, depoları, aptek şəbəkəsi və estetik mərkəzləri.', icon: 'unique' },
                    ],
                },
                {
                    type: 'insights',
                    eyebrow: 'Miqyasımız',
                    headline: 'Rəqəmlərlə Silk Bridge',
                    subheadline: 'Bakıdan geniş MDB regionuna qədər etibarlı.',
                    stats: [
                        { value: '15+', label: 'İl Bazarda', note: 'Beynəlxalq və Azərbaycan' },
                        { value: '~100', label: 'Komanda Üzvü', note: 'Tibb Məzunları Daxil olmaqla' },
                        { value: '4+', label: 'MDB Ölkəsi', note: 'Ukrayna, Gürcüstan, Özbəkistan' },
                        { value: '100%', label: 'Keyfiyyət', note: 'Beynəlxalq Standartlar' },
                    ],
                    ctaText: 'Xidmətlərimizi Kəşf Edin',
                    ctaHref: '/services',
                },
                {
                    type: 'contact',
                    eyebrow: 'Əlaqə',
                    headline: 'Birgə Çalışaq',
                    description: 'Əczaçılıq distribusiyası, tərəfdaşlıqlar və ya Azərbaycan və MDB-də bazara giriş imkanlarını müzakirə etmək üçün bizimlə əlaqə saxlayın.',
                    showForm: true,
                    showMap: true,
                },
            ],
            ru: [
                {
                    type: 'hero',
                    tagline: 'Silk Bridge\nНадёжность, Качество и Инновации',
                    subtagline: 'Современная дистрибьюторская компания международного уровня, ориентированная на фармацевтический рынок — 15+ лет соединяем мировых производителей с пациентами Азербайджана и СНГ.',
                    ctaPrimary: { text: 'Наши Услуги', href: '/services' },
                    ctaSecondary: { text: 'О нас', href: '/about' },
                },
                {
                    type: 'about',
                    eyebrow: 'Кто Мы',
                    headline: '15+ лет Фарма',
                    headlineAccent: 'Совершенства',
                    mission: '«Silk Bridge» — современная дистрибьюторская компания международного уровня, ориентированная на фармацевтический рынок. Более 15 лет работы на международном и азербайджанском рынках — мы успешно объединили научный потенциал и опыт отечественных и зарубежных компаний, обеспечивая высокотехнологичное современное производство для пациентов региона.',
                    pillars: [
                        { title: 'Стандарты Качества', description: 'Мы работаем только с инновационными производителями, отвечающими международным стандартам качества.', icon: 'quality' },
                        { title: 'Научная Деятельность', description: 'Мы активно участвуем в научно-практических конференциях по всему миру.', icon: 'experience' },
                        { title: 'Медицинский Маркетинг', description: 'Наш отдел маркетинга включает специалистов с высшим медицинским образованием.', icon: 'personal' },
                        { title: 'Логистическая Сеть', description: 'Собственные склады, депо, аптечная сеть и эстетические центры по всему Азербайджану.', icon: 'unique' },
                    ],
                },
                {
                    type: 'insights',
                    eyebrow: 'Наш Масштаб',
                    headline: 'Silk Bridge в Цифрах',
                    subheadline: 'Доверие от Баку до стран СНГ.',
                    stats: [
                        { value: '15+', label: 'Лет на Рынке', note: 'Международный и Азербайджан' },
                        { value: '~100', label: 'Сотрудников', note: 'Включая Медицинских Специалистов' },
                        { value: '4+', label: 'Страны СНГ', note: 'Украина, Грузия, Узбекистан и др.' },
                        { value: '100%', label: 'Приверженность', note: 'Международным Стандартам' },
                    ],
                    ctaText: 'Наши Услуги',
                    ctaHref: '/services',
                },
                {
                    type: 'contact',
                    eyebrow: 'Связаться',
                    headline: 'Работаем Вместе',
                    description: 'Свяжитесь с нами для обсуждения фармацевтической дистрибуции, партнёрства или выхода на рынок в Азербайджане и СНГ.',
                    showForm: true,
                    showMap: true,
                },
            ],
        },
    },

    // ══════════════════════════════════════════════════════════
    // ABOUT
    // ══════════════════════════════════════════════════════════
    {
        slug: 'about',
        locales: {
            en: [
                {
                    type: 'intro',
                    eyebrow: 'About Us',
                    headline: 'International Pharma',
                    headlineAccent: 'Distribution',
                    text: 'Silk Bridge is a modern distribution company of international level, focused on the pharmaceutical market. Working in the international and Azerbaijani market for more than 15 years, our company has successfully combined the scientific potential and experience of domestic and foreign companies working with modern pharmaceutical plants, providing high-tech modern production.',
                },
                {
                    type: 'values',
                    title: 'Our Principles',
                    subtitle: 'The values that guide everything we do',
                    values: [
                        {
                            title: 'International Quality',
                            description: 'We work with production throughout the world, capable of producing innovative products to international quality standards. Today\'s modern companies constantly improve, develop original products and introduce advanced production technology.',
                        },
                        {
                            title: 'Scientific Excellence',
                            description: 'We take an active part in scientific and practical conferences around the world. We operate in Ukraine, Georgia, Uzbekistan and other countries of the former Soviet Union.',
                        },
                        {
                            title: 'Balanced Portfolio',
                            description: 'Silk Bridge has a balanced product potential — medicines, dietary/nutritional supplements, a wide range of preventive, curative and cosmetic products across different price groups.',
                        },
                        {
                            title: 'Ethical Representation',
                            description: 'Our purpose is to honestly, competently and professionally represent the production of world companies — from manufacturers to end users, with full guarantee for the entire process.',
                        },
                        {
                            title: 'Logistics & Infrastructure',
                            description: 'With own warehouses and advanced depots across the country, we ensure proper storage, good inventory management, efficient order management and timely logistics.',
                        },
                        {
                            title: 'Medical Marketing',
                            description: 'Our marketing department is composed not just of professional marketers but also employees with higher medical education, guaranteeing efficient and medically accurate product promotion.',
                        },
                    ],
                },
                {
                    type: 'storyline',
                    title: 'Our Journey',
                    text: 'From a pioneer in Azerbaijani pharma distribution to a trusted international bridge — connecting global innovation with patients across the CIS.',
                    beats: [
                        { id: '1', year: '2008', kicker: 'FOUNDING', title: 'Established in Baku', description: 'Silk Bridge was founded with the mission to bring international pharmaceutical innovation and quality to the Azerbaijani market.' },
                        { id: '2', year: '2012', kicker: 'CIS EXPANSION', title: 'Regional Presence', description: 'Extended operations to Ukraine, Georgia, Uzbekistan and other former Soviet states, building a trusted pan-CIS distribution network.' },
                        { id: '3', year: '2015', kicker: 'PARTNERSHIPS', title: 'Global Manufacturers', description: 'Secured long-term distribution agreements with Worwag (Germany), Ipsen (France), Denk (Germany) and Bago (Argentina).' },
                        { id: '4', year: '2018', kicker: 'INFRASTRUCTURE', 'title': 'Logistics Network', description: 'Launched advanced nationwide logistics infrastructure with temperature-controlled warehouses and distribution depots.' },
                        { id: '5', year: '2021', kicker: 'RETAIL', title: 'Pharmacy & Aesthetic Chain', description: 'Opened own pharmacy network providing a complete drugs range across Azerbaijan, plus cosmetic/aesthetic centers in Baku.' },
                        { id: '6', year: 'TODAY', kicker: 'LEADERSHIP', title: '~100 Strong', description: 'Today Silk Bridge employs about 100 staff and remains the trusted bridge between global pharma innovation and CIS healthcare.' },
                    ],
                },
                {
                    type: 'cta',
                    headline: 'Silk Bridge — Reliability, Quality and Innovation',
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
                    text: '«Silk Bridge» əczaçılıq bazarına yönəlmiş müasir beynəlxalq səviyyəli distribusiya şirkətidir. Beynəlxalq və Azərbaycan bazarında 15 ildən çox fəaliyyət göstərərək şirkətimiz elmi potensialı müasir əczaçılıq zavodları ilə işləyən yerli və xarici şirkətlərin təcrübəsi ilə uğurla birləşdirmiş, yüksək texnolojili müasir istehsal təqdim etmişdir.',
                },
                {
                    type: 'values',
                    title: 'Prinsiplərimiz',
                    subtitle: 'Etdiyimiz hər şeyi istiqamətləndirən dəyərlər',
                    values: [
                        { title: 'Beynəlxalq Keyfiyyət', description: 'Dünya üzrə beynəlxalq keyfiyyət standartlarına cavab verən innovativ məhsullar istehsal edə bilən istehsalçılarla işləyirik.' },
                        { title: 'Elmi Mükəmməllik', description: 'Dünya üzrə elmi-praktiki konfranslarda fəal iştirak edirik. Ukrayna, Gürcüstan, Özbəkistan və digər MDB ölkələrində fəaliyyət göstəririk.' },
                        { title: 'Balanslaşdırılmış Portfel', 'description': 'Dərmanlar, dietik/qida əlavələri, geniş çeşidli profilaktik, müalicəvi və kosmetik məhsullar.' },
                        { title: 'Etik Təmsil', description: 'Məqsədimiz dünya şirkətlərinin istehsalını dürüst, bacarıqlı və peşəkar şəkildə istehsalçıdan son istehlakçıya çatdırmaqdır.' },
                        { title: 'Logistika', description: 'Ölkə üzrə öz anbarları və inkişaf etmiş depolarla düzgün saxlama, yaxşı inventar idarəetməsi, səmərəli sifariş idarəetməsi.' },
                        { title: 'Tibbi Marketinq', description: 'Marketinq şöbəmiz ali tibbi təhsilli işçilərdən ibarətdir — bu effektiv və tibbi cəhətdən dəqiq tanıtımı zəmanətləyir.' },
                    ],
                },
                {
                    type: 'storyline',
                    title: 'Yolumuz',
                    text: 'Azərbaycan farma distribusiyasında öncülden etibarlı beynəlxalq körpüyə — MDB üzrə qlobal innovasiyaları xəstələrlə birləşdiririk.',
                    beats: [
                        { id: '1', year: '2008', kicker: 'QURULUŞ', title: 'Bakıda Yaradıldı', description: 'Silk Bridge beynəlxalq əczaçılıq innovasiyasını Azərbaycan bazarına gətirmək missiyası ilə yaradıldı.' },
                        { id: '2', year: '2012', kicker: 'GENİŞLƏNMƏ', title: 'Regional İştirak', description: 'Ukrayna, Gürcüstan, Özbəkistan və digər keçmiş SSRİ dövlətlərə genişləndi.' },
                        { id: '3', year: '2015', kicker: 'TƏRƏFDAŞLIQ', 'title': 'Qlobal İstehsalçılar', description: 'Worwag (Almaniya), Ipsen (Fransa), Denk (Almaniya) və Bago (Argentina) ilə müqavilələr imzalandı.' },
                        { id: '4', year: '2018', kicker: 'İNFRASTRUKTUR', 'title': 'Logistika Şəbəkəsi', description: 'Temperatur nəzarətli anbarlar və distribusiya depoları ilə ölkəmiqyaslı infrastruktur.' },
                        { id: '5', year: '2021', kicker: 'PƏRAKƏNDƏ', title: 'Aptek və Estetik Mərkəzlər', description: 'Azərbaycan üzrə aptek şəbəkəsi və Bakıda kosmetik/estetik mərkəzlər.' },
                        { id: '6', year: 'BU GÜN', kicker: 'LİDERLİK', title: '~100 Nəfər Komanda', description: 'Bu gün Silk Bridge ~100 işçi ilə qlobal farma innovasiyası ilə MDB səhiyyəsi arasında etibarlı körpüdür.' },
                    ],
                },
                {
                    type: 'cta',
                    headline: 'Silk Bridge — Etibarlılıq, Keyfiyyət və İnnovasiya',
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
                    text: '«Silk Bridge» — современная дистрибьюторская компания международного уровня, ориентированная на фармацевтический рынок. Работая на международном и азербайджанском рынке более 15 лет, наша компания успешно объединила научный потенциал и опыт отечественных и зарубежных компаний, предоставляя высокотехнологичное современное производство.',
                },
                {
                    type: 'values',
                    title: 'Наши Принципы',
                    subtitle: 'Ценности, которые направляют всё, что мы делаем',
                    values: [
                        { title: 'Международное Качество', description: 'Мы работаем с производителями по всему миру, способными выпускать инновационную продукцию в соответствии с международными стандартами качества.' },
                        { title: 'Научная Деятельность', description: 'Мы активно участвуем в научно-практических конференциях по всему миру. Работаем на Украине, в Грузии, Узбекистане и других странах СНГ.' },
                        { title: 'Сбалансированный Портфель', description: 'Лекарственные средства, диетические/пищевые добавки, широкий ассортимент профилактических, лечебных и косметических продуктов.' },
                        { title: 'Этичное Представительство', description: 'Наша цель — честно, компетентно и профессионально представлять продукцию мировых компаний от производителя до конечного потребителя.' },
                        { title: 'Логистика', description: 'Собственные склады и передовые депо по всей стране обеспечивают надлежащее хранение, управление запасами и доставку.' },
                        { title: 'Медицинский Маркетинг', description: 'Наш отдел маркетинга состоит не только из профессиональных маркетологов, но и сотрудников с высшим медицинским образованием.' },
                    ],
                },
                {
                    type: 'storyline',
                    title: 'Наш Путь',
                    text: 'От пионера фармацевтической дистрибуции в Азербайджане до надёжного международного моста — соединяем инновации с пациентами СНГ.',
                    beats: [
                        { id: '1', year: '2008', kicker: 'ОСНОВАНИЕ', title: 'Основана в Баку', description: 'Silk Bridge была основана с миссией привнести международные фармацевтические инновации на азербайджанский рынок.' },
                        { id: '2', year: '2012', kicker: 'РАСШИРЕНИЕ', title: 'Региональное Присутствие', description: 'Расширение на Украину, Грузию, Узбекистан и другие страны бывшего СССР.' },
                        { id: '3', year: '2015', kicker: 'ПАРТНЁРСТВА', title: 'Мировые Производители', description: 'Заключены соглашения с Worwag (Германия), Ipsen (Франция), Denk (Германия) и Bago (Аргентина).' },
                        { id: '4', year: '2018', kicker: 'ИНФРАСТРУКТУРА', 'title': 'Логистическая Сеть', description: 'Общенациональная логистическая инфраструктура с температурными складами и депо.' },
                        { id: '5', year: '2021', kicker: 'РОЗНИЦА', title: 'Аптеки и Эстетические Центры', description: 'Собственная аптечная сеть по всему Азербайджану и косметические/эстетические центры в Баку.' },
                        { id: '6', year: 'СЕГОДНЯ', kicker: 'ЛИДЕРСТВО', title: '~100 Сотрудников', description: 'Сегодня Silk Bridge объединяет ~100 сотрудников и остаётся надёжным мостом между мировой фарминновацией и здравоохранением СНГ.' },
                    ],
                },
                {
                    type: 'cta',
                    headline: 'Silk Bridge — Надёжность, Качество и Инновации',
                    description: 'Изучите возможности дистрибуции, копродвижения и выхода на рынок в Азербайджане и СНГ.',
                    primaryButton: { text: 'Связаться', href: '/contact' },
                    secondaryButton: { text: 'Наши Услуги', href: '/services' },
                },
            ],
        },
    },

    // ══════════════════════════════════════════════════════════
    // SERVICES
    // ══════════════════════════════════════════════════════════
    {
        slug: 'services',
        locales: {
            en: [
                {
                    type: 'intro',
                    eyebrow: 'Our Services',
                    headline: 'Full-Spectrum Pharma',
                    headlineAccent: 'Distribution',
                    text: 'Silk Bridge sells a wide range of therapeutic, preventive and cosmetic products, working with leading plants worldwide. We provide end-to-end pharmaceutical distribution across Azerbaijan and the CIS — from manufacturer to end user.',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'pharmaDistribution',
                    title: 'Pharmaceutical Distribution',
                    description: 'End-to-end distribution of medicines, dietary supplements, preventive and cosmetic products from leading global manufacturers across Azerbaijan and CIS markets.',
                    features: [
                        'Therapeutic product distribution',
                        'Dietary & nutritional supplements',
                        'Preventive & cosmetic product lines',
                        'Multiple price-segment coverage',
                        'Socially-oriented pricing policy',
                    ],
                    ctaText: 'Partner with Us',
                    ctaHref: '/contact',
                    details: [
                        { title: 'Global Partners', description: 'Worwag (Germany), Ipsen (France), Denk (Germany), Bago (Argentina) and other innovative manufacturers.', tags: ['Worwag', 'Ipsen', 'Denk', 'Bago'] },
                        { title: 'Product Range', description: 'Balanced portfolio of medicines, dietary supplements, and cosmetic/preventive products across all price segments.', tags: ['Medicines', 'Supplements', 'Cosmetics', 'Preventive'] },
                    ],
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'pharmacyChain',
                    title: 'Pharmacy Chain',
                    description: 'Own network of modern pharmacies providing a complete range of drugs on the territory of Azerbaijan — enabling fast and professional distribution of new products.',
                    features: [
                        'Complete drug range coverage',
                        'Rapid new product rollout',
                        'Professional pharmaceutical advice',
                        'Accessibility across Azerbaijan',
                        'Direct end-consumer access',
                    ],
                    ctaText: 'Find a Pharmacy',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'aestheticCenters',
                    title: 'Cosmetic & Aesthetic Centers',
                    description: 'Own network of cosmetic and aesthetic centers in Baku, presenting advanced technologies in cosmetology and aesthetic medicine to the Azerbaijani market.',
                    features: [
                        'Advanced cosmetology technologies',
                        'Aesthetic medicine services',
                        'Baku city locations',
                        'International product lines',
                        'Professional medical staff',
                    ],
                    ctaText: 'Book a Consultation',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'logistics',
                    title: 'Logistics & Warehousing',
                    description: 'With own warehouses and advanced depots across the country, we organize logical operations, operational transport, proper storage, good inventory management and faster cargo handling.',
                    features: [
                        'Temperature-controlled warehouses',
                        'Distribution depots nationwide',
                        'Efficient inventory management',
                        'Operational transport fleet',
                        'Timely logistics cost analysis',
                    ],
                    ctaText: 'Logistics Enquiry',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'medicalMarketing',
                    title: 'Medical Marketing & Promotion',
                    description: 'Our marketing department is composed not just of professional marketers but also employees with higher medical education — guaranteeing efficient marketing and medically accurate product presentation.',
                    features: [
                        'Medically qualified field team',
                        'Scientific conference participation',
                        'Trade marketing (trade-events)',
                        'Sales force management',
                        'Consumer product information',
                    ],
                    ctaText: 'Marketing Partnership',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'marketEntry',
                    title: 'CIS Market Entry',
                    description: 'We represent international manufacturers in Ukraine, Georgia, Uzbekistan and other former Soviet states — providing local market intelligence, regulatory navigation and full distribution support.',
                    features: [
                        'Product registration support',
                        'Regulatory compliance guidance',
                        'CIS market intelligence',
                        'Distribution network access',
                        'Scientific representation',
                    ],
                    ctaText: 'Enter the CIS Market',
                    ctaHref: '/contact',
                },
                {
                    type: 'process',
                    title: 'How We Work',
                    subtitle: 'A streamlined, compliant process — from manufacturer to end user',
                    steps: [
                        { title: 'Registration', description: 'We handle product registration and regulatory compliance in every target market.' },
                        { title: 'Import & Storage', description: 'Products are imported and stored in certified temperature-controlled warehouses.' },
                        { title: 'Distribution', description: 'Our nationwide network delivers to pharmacies, hospitals and clinics on time.' },
                        { title: 'Promotion', description: 'Our medical field team conducts ethical, evidence-based promotion to healthcare professionals.' },
                    ],
                },
                {
                    type: 'cta',
                    headline: 'Silk Bridge — Reliability, Quality and Innovation',
                    description: 'Ready to bring your pharmaceutical products to Azerbaijan and the CIS? Let\'s talk.',
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
                    text: '«Silk Bridge» dünya üzrə aparıcı zavodlarla işləyərək geniş çeşidli müalicəvi, profilaktik və kosmetik məhsullar satır. Azərbaycan və MDB üzrə istehsalçıdan son istehlakçıya qədər hərtərəfli əczaçılıq distribusiyası təqdim edirik.',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'pharmaDistribution',
                    title: 'Əczaçılıq Distribusiyası',
                    description: 'Azərbaycan və MDB bazarlarında aparıcı qlobal istehsalçılardan dərmanlar, dietik əlavələr, profilaktik və kosmetik məhsulların tam distribusiyası.',
                    features: [
                        'Müalicəvi məhsul distribusiyası',
                        'Dietik və qida əlavələri',
                        'Profilaktik və kosmetik xətlər',
                        'Müxtəlif qiymət seqmentləri',
                        'Sosial yönümlü qiymət siyasəti',
                    ],
                    ctaText: 'Tərəfdaş Olun',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'pharmacyChain',
                    title: 'Aptek Şəbəkəsi',
                    description: 'Azərbaycan ərazisində tam dərman çeşidi təqdim edən müasir aptek şəbəkəsi — yeni məhsulların sürətli və peşəkar distribusiyasına imkan verir.',
                    features: ['Tam dərman çeşidi', 'Yeni məhsulların sürətli tətbiqi', 'Peşəkar əczaçılıq məşvərəti', 'Azərbaycan üzrə əlçatanlıq', 'Birbaşa son istehlakçı çıxışı'],
                    ctaText: 'Aptek Tapın',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'aestheticCenters',
                    title: 'Kosmetik və Estetik Mərkəzlər',
                    description: 'Bakıda kosmetologiya və estetik tibbdə qabaqcıl texnologiyaları Azərbaycan bazarına təqdim edən öz kosmetik/estetik mərkəzlər şəbəkəmiz.',
                    features: ['Qabaqcıl kosmetologiya texnologiyaları', 'Estetik tibb xidmətləri', 'Bakı şəhər yerləşmələri', 'Beynəlxalq məhsul xətləri', 'Peşəkar tibbi personal'],
                    ctaText: 'Konsultasiya Sifariş Edin',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'logistics',
                    title: 'Logistika və Anbar',
                    description: 'Ölkə üzrə öz anbarları və inkişaf etmiş depolarla məntiqi əməliyyatları, əməliyyat nəqliyyatını, düzgün saxlamanı, yaxşı inventar idarəetməsini təşkil edirik.',
                    features: ['Temperatur nəzarətli anbarlar', 'Ölkəmiqyaslı distribusiya depoları', 'Səmərəli inventar idarəetməsi', 'Əməliyyat nəqliyyat parkı', 'Vaxtında logistika təhlili'],
                    ctaText: 'Logistika Sorğusu',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'medicalMarketing',
                    title: 'Tibbi Marketinq və Tanıtım',
                    description: 'Marketinq şöbəmiz yalnız peşəkar marketoloqlardan deyil, həm də ali tibbi təhsilli işçilərdən ibarətdir — bu effektiv marketinqi və tibbi cəhətdən dəqiq məhsul təqdimatını zəmanət verir.',
                    features: ['Tibbi ixtisaslı sahə komandası', 'Elmi konfranslarda iştirak', 'Ticarət marketinqi', 'Satış qüvvəsinin idarəsi', 'İstehlakçı məlumatlandırması'],
                    ctaText: 'Marketinq Tərəfdaşlığı',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'marketEntry',
                    title: 'MDB Bazarına Giriş',
                    description: 'Ukrayna, Gürcüstan, Özbəkistan və digər keçmiş Sovet dövlətlərindəki beynəlxalq istehsalçıları təmsil edirik — yerli bazar məlumatı, tənzimləmə naviqasiyası və tam distribusiya dəstəyi.',
                    features: ['Məhsul qeydiyyatı dəstəyi', 'Tənzimləmə uyğunluğu', 'MDB bazar məlumatı', 'Distribusiya şəbəkəsinə çıxış', 'Elmi təmsil'],
                    ctaText: 'MDB Bazarına Daxil Olun',
                    ctaHref: '/contact',
                },
                {
                    type: 'process',
                    title: 'Necə İşləyirik',
                    subtitle: 'İstehsalçıdan son istehlakçıya — sadələşdirilmiş, uyğun proses',
                    steps: [
                        { title: 'Qeydiyyat', description: 'Hər hədəf bazarda məhsul qeydiyyatı və tənzimləmə uyğunluğunu həll edirik.' },
                        { title: 'İdxal və Saxlama', description: 'Məhsullar idxal edilir, sertifikatlı temperatur nəzarətli anbarl arda saxlanılır.' },
                        { title: 'Distribusiya', description: 'Ölkəmiqyaslı şəbəkəmiz vaxtında apteklərə, xəstəxanalara və klinikalara çatdırır.' },
                        { title: 'Tanıtım', description: 'Tibbi komandamız səhiyyə mütəxəssislərinə etik, sübutlara əsaslanan tanıtım aparır.' },
                    ],
                },
                {
                    type: 'cta',
                    headline: 'Silk Bridge — Etibarlılıq, Keyfiyyət və İnnovasiya',
                    description: 'Əczaçılıq məhsullarınızı Azərbaycan və MDB-yə gətirməyə hazırsınız? Danışaq.',
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
                    text: '«Silk Bridge» реализует широкий ассортимент терапевтических, профилактических и косметических продуктов, работая с ведущими заводами мира. Мы обеспечиваем полный цикл фармацевтической дистрибуции по Азербайджану и СНГ — от производителя до конечного потребителя.',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'pharmaDistribution',
                    title: 'Фармацевтическая Дистрибуция',
                    description: 'Комплексная дистрибуция лекарств, пищевых добавок, профилактических и косметических продуктов от ведущих мировых производителей по Азербайджану и рынкам СНГ.',
                    features: ['Дистрибуция терапевтических продуктов', 'Диетические и пищевые добавки', 'Профилактические и косметические линейки', 'Охват разных ценовых сегментов', 'Социально ориентированная ценовая политика'],
                    ctaText: 'Стать Партнёром',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'pharmacyChain',
                    title: 'Аптечная Сеть',
                    description: 'Собственная сеть современных аптек, предоставляющая полный ассортимент лекарств на территории Азербайджана — обеспечивает быстрое и профессиональное распространение новых продуктов.',
                    features: ['Полный ассортимент лекарств', 'Быстрый вывод новых продуктов', 'Профессиональные консультации', 'Доступность по всему Азербайджану', 'Прямой доступ к потребителю'],
                    ctaText: 'Найти Аптеку',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'aestheticCenters',
                    title: 'Косметические и Эстетические Центры',
                    description: 'Собственная сеть косметических/эстетических центров в Баку, представляющая передовые технологии косметологии и эстетической медицины на азербайджанском рынке.',
                    features: ['Передовые технологии косметологии', 'Услуги эстетической медицины', 'Локации в Баку', 'Международные продуктовые линейки', 'Профессиональный медицинский персонал'],
                    ctaText: 'Записаться на Консультацию',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'logistics',
                    title: 'Логистика и Складирование',
                    description: 'Собственные склады и передовые депо по всей стране обеспечивают надлежащее хранение, эффективное управление запасами, оперативный транспорт и своевременную доставку.',
                    features: ['Склады с температурным контролем', 'Распределительные депо по стране', 'Управление запасами', 'Оперативный транспортный парк', 'Своевременный анализ логистических затрат'],
                    ctaText: 'Запрос по Логистике',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'medicalMarketing',
                    title: 'Медицинский Маркетинг и Продвижение',
                    description: 'Наш отдел маркетинга состоит не только из профессиональных маркетологов, но и сотрудников с высшим медицинским образованием — что гарантирует эффективный маркетинг и медицински точное представление продуктов.',
                    features: ['Медицински квалифицированная полевая команда', 'Участие в научных конференциях', 'Трейд-маркетинг', 'Управление торговой командой', 'Информирование потребителей'],
                    ctaText: 'Маркетинговое Партнёрство',
                    ctaHref: '/contact',
                },
                {
                    type: 'serviceDetails',
                    serviceId: 'marketEntry',
                    title: 'Выход на Рынок СНГ',
                    description: 'Мы представляем международных производителей на Украине, в Грузии, Узбекистане и других бывших советских государствах — обеспечиваем аналитику рынка, навигацию по регулированию и полную дистрибуционную поддержку.',
                    features: ['Поддержка регистрации продуктов', 'Регуляторное соответствие', 'Аналитика рынков СНГ', 'Доступ к сети дистрибуции', 'Научное представительство'],
                    ctaText: 'Выйти на Рынок СНГ',
                    ctaHref: '/contact',
                },
                {
                    type: 'process',
                    title: 'Как Мы Работаем',
                    subtitle: 'Упорядоченный, соответствующий нормам процесс — от производителя до потребителя',
                    steps: [
                        { title: 'Регистрация', description: 'Занимаемся регистрацией продуктов и регуляторным соответствием на каждом рынке.' },
                        { title: 'Импорт и Хранение', description: 'Продукты импортируются и хранятся в сертифицированных температурных помещениях.' },
                        { title: 'Дистрибуция', description: 'Наша общенациональная сеть доставляет в аптеки, больницы и клиники вовремя.' },
                        { title: 'Продвижение', description: 'Наша медицинская полевая команда проводит этичное продвижение для медицинских специалистов.' },
                    ],
                },
                {
                    type: 'cta',
                    headline: 'Silk Bridge — Надёжность, Качество и Инновации',
                    description: 'Готовы вывести фармацевтические продукты на рынок Азербайджана и СНГ? Давайте поговорим.',
                    primaryButton: { text: 'Связаться', href: '/contact' },
                    secondaryButton: { text: 'Наши Партнёры', href: '/partners' },
                },
            ],
        },
    },
];

// ── main ─────────────────────────────────────────────────────

async function main() {
    console.log('📝 Seeding real Silk Bridge company content...\n');

    let updated = 0;
    let unchanged = 0;

    for (const pageConfig of PAGES) {
        const page = await prisma.page.findUnique({
            where: { slug: pageConfig.slug },
            include: { translations: true },
        });
        if (!page) { console.warn(`  ⚠️  Page "${pageConfig.slug}" not found.`); continue; }
        console.log(`\n📄 ${pageConfig.slug}`);

        for (const [locale, incoming] of Object.entries(pageConfig.locales)) {
            const tr = page.translations.find(t => t.localeCode === locale);
            if (!tr) { console.log(`  ⏭  [${locale}] no translation`); unchanged++; continue; }

            const existing: any[] = Array.isArray(tr.blocks) ? (tr.blocks as any[]) : [];
            const merged = mergeBlocks(existing, incoming);

            if (JSON.stringify(existing) === JSON.stringify(merged)) {
                console.log(`  ✓  [${locale}] no changes`);
                unchanged++;
                continue;
            }

            await prisma.pageTranslation.update({
                where: { id: tr.id },
                data: { blocks: merged as any },
            });
            console.log(`  ✓  [${locale}] updated (${existing.length} → ${merged.length} blocks)`);
            updated++;
        }
    }

    console.log(`\n✅ Done. Updated: ${updated}, Unchanged: ${unchanged}`);
    console.log('  ✅ No schema changes | ✅ Idempotent | ✅ Images remain null');
}

main()
    .catch(e => { console.error('❌', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
