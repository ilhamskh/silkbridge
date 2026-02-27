#!/usr/bin/env tsx
/**
 * seed-services.ts
 * ==========================================
 * Seeds the Services page with real Silk Bridge content
 * for all three locales (en, az, ru).
 *
 * Strategy: REPLACE — incoming blocks fully replace the
 * services-page blocks. Idempotent: safe to run multiple times.
 *
 * Usage:
 *   set -a && source .env && set +a && npx tsx scripts/seed-services.ts
 *   DATABASE_URL='...' npx tsx scripts/seed-services.ts
 */

import { prisma } from '../lib/db';

// ── helpers ──────────────────────────────────────────────────

function blockKey(b: any): string {
    const p = [b.type ?? 'unknown'];
    if (b.serviceId) p.push(b.serviceId);
    if (b.groupKey) p.push(b.groupKey);
    return p.join('::');
}

/**
 * Deep merge: incoming text/array values win, preserving DB-only fields
 * (e.g. image, imageAlt uploaded via CMS but not in seed data).
 */
function mergeIncomingWins(existing: any, incoming: any): any {
    if (incoming == null) return existing;
    if (existing == null) return incoming;
    if (Array.isArray(incoming)) return incoming;
    if (typeof incoming === 'object' && typeof existing === 'object') {
        const result: any = { ...existing };
        for (const k of Object.keys(incoming)) {
            result[k] = mergeIncomingWins(existing[k], incoming[k]);
        }
        return result;
    }
    return incoming;
}

/**
 * Replace strategy: output is in exactly the order of `incoming`.
 * If an existing block matches by key it is merged (preserving CMS-uploaded fields).
 * Extra blocks in DB that don't appear in incoming are DROPPED.
 */
function replaceBlocks(existing: any[], incoming: any[]): any[] {
    return incoming.map(inB => {
        const key = blockKey(inB);
        const match = existing.find(b => blockKey(b) === key);
        return match ? mergeIncomingWins(match, inB) : inB;
    });
}

// ── services content ──────────────────────────────────────────

const SERVICES_CONTENT: Record<string, any[]> = {

    // ══════════════════════════════════════════════════════════
    // ENGLISH
    // ══════════════════════════════════════════════════════════
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
                {
                    title: 'Global Partners',
                    description: 'Worwag (Germany), Ipsen (France), Denk (Germany), Bago (Argentina) and other innovative manufacturers.',
                    tags: ['Worwag', 'Ipsen', 'Denk', 'Bago'],
                },
                {
                    title: 'Product Range',
                    description: 'Balanced portfolio of medicines, dietary supplements, and cosmetic/preventive products across all price segments.',
                    tags: ['Medicines', 'Supplements', 'Cosmetics', 'Preventive'],
                },
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
            description: "Ready to bring your pharmaceutical products to Azerbaijan and the CIS? Let's talk.",
            primaryButton: { text: 'Contact Us', href: '/contact' },
            secondaryButton: { text: 'Our Partners', href: '/partners' },
        },
    ],

    // ══════════════════════════════════════════════════════════
    // AZERBAIJANI
    // ══════════════════════════════════════════════════════════
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
            details: [
                {
                    title: 'Qlobal Tərəfdaşlar',
                    description: 'Worwag (Almaniya), Ipsen (Fransa), Denk (Almaniya), Bago (Argentina) və digər innovativ istehsalçılar.',
                    tags: ['Worwag', 'Ipsen', 'Denk', 'Bago'],
                },
                {
                    title: 'Məhsul Çeşidi',
                    description: 'Dərmanlar, dietik əlavələr, kosmetik/profilaktik məhsullardan ibarət balanslaşdırılmış portfel.',
                    tags: ['Dərmanlar', 'Əlavələr', 'Kosmetika', 'Profilaktika'],
                },
            ],
        },
        {
            type: 'serviceDetails',
            serviceId: 'pharmacyChain',
            title: 'Aptek Şəbəkəsi',
            description: 'Azərbaycan ərazisində tam dərman çeşidi təqdim edən müasir aptek şəbəkəsi — yeni məhsulların sürətli və peşəkar distribusiyasına imkan verir.',
            features: [
                'Tam dərman çeşidi',
                'Yeni məhsulların sürətli tətbiqi',
                'Peşəkar əczaçılıq məşvərəti',
                'Azərbaycan üzrə əlçatanlıq',
                'Birbaşa son istehlakçı çıxışı',
            ],
            ctaText: 'Aptek Tapın',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'aestheticCenters',
            title: 'Kosmetik və Estetik Mərkəzlər',
            description: 'Bakıda kosmetologiya və estetik tibbdə qabaqcıl texnologiyaları Azərbaycan bazarına təqdim edən öz kosmetik/estetik mərkəzlər şəbəkəmiz.',
            features: [
                'Qabaqcıl kosmetologiya texnologiyaları',
                'Estetik tibb xidmətləri',
                'Bakı şəhər yerləşmələri',
                'Beynəlxalq məhsul xətləri',
                'Peşəkar tibbi personal',
            ],
            ctaText: 'Konsultasiya Sifariş Edin',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'logistics',
            title: 'Logistika və Anbar',
            description: 'Ölkə üzrə öz anbarları və inkişaf etmiş depolarla məntiqi əməliyyatları, əməliyyat nəqliyyatını, düzgün saxlamanı, yaxşı inventar idarəetməsini təşkil edirik.',
            features: [
                'Temperatur nəzarətli anbarlar',
                'Ölkəmiqyaslı distribusiya depoları',
                'Səmərəli inventar idarəetməsi',
                'Əməliyyat nəqliyyat parkı',
                'Vaxtında logistika təhlili',
            ],
            ctaText: 'Logistika Sorğusu',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'medicalMarketing',
            title: 'Tibbi Marketinq və Tanıtım',
            description: 'Marketinq şöbəmiz yalnız peşəkar marketoloqlardan deyil, həm də ali tibbi təhsilli işçilərdən ibarətdir — bu effektiv marketinqi və tibbi cəhətdən dəqiq məhsul təqdimatını zəmanət verir.',
            features: [
                'Tibbi ixtisaslı sahə komandası',
                'Elmi konfranslarda iştirak',
                'Ticarət marketinqi',
                'Satış qüvvəsinin idarəsi',
                'İstehlakçı məlumatlandırması',
            ],
            ctaText: 'Marketinq Tərəfdaşlığı',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'marketEntry',
            title: 'MDB Bazarına Giriş',
            description: 'Ukrayna, Gürcüstan, Özbəkistan və digər keçmiş Sovet dövlətlərindəki beynəlxalq istehsalçıları təmsil edirik — yerli bazar məlumatı, tənzimləmə naviqasiyası və tam distribusiya dəstəyi.',
            features: [
                'Məhsul qeydiyyatı dəstəyi',
                'Tənzimləmə uyğunluğu',
                'MDB bazar məlumatı',
                'Distribusiya şəbəkəsinə çıxış',
                'Elmi təmsil',
            ],
            ctaText: 'MDB Bazarına Daxil Olun',
            ctaHref: '/contact',
        },
        {
            type: 'process',
            title: 'Necə İşləyirik',
            subtitle: 'İstehsalçıdan son istehlakçıya — sadələşdirilmiş, uyğun proses',
            steps: [
                { title: 'Qeydiyyat', description: 'Hər hədəf bazarda məhsul qeydiyyatı və tənzimləmə uyğunluğunu həll edirik.' },
                { title: 'İdxal və Saxlama', description: 'Məhsullar idxal edilir, sertifikatlı temperatur nəzarətli anbarlarda saxlanılır.' },
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

    // ══════════════════════════════════════════════════════════
    // RUSSIAN
    // ══════════════════════════════════════════════════════════
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
            features: [
                'Дистрибуция терапевтических продуктов',
                'Диетические и пищевые добавки',
                'Профилактические и косметические линейки',
                'Охват разных ценовых сегментов',
                'Социально ориентированная ценовая политика',
            ],
            ctaText: 'Стать Партнёром',
            ctaHref: '/contact',
            details: [
                {
                    title: 'Глобальные Партнёры',
                    description: 'Worwag (Германия), Ipsen (Франция), Denk (Германия), Bago (Аргентина) и другие инновационные производители.',
                    tags: ['Worwag', 'Ipsen', 'Denk', 'Bago'],
                },
                {
                    title: 'Ассортимент Продуктов',
                    description: 'Сбалансированный портфель лекарств, пищевых добавок, косметических/профилактических продуктов по всем ценовым сегментам.',
                    tags: ['Лекарства', 'Добавки', 'Косметика', 'Профилактика'],
                },
            ],
        },
        {
            type: 'serviceDetails',
            serviceId: 'pharmacyChain',
            title: 'Аптечная Сеть',
            description: 'Собственная сеть современных аптек, предоставляющая полный ассортимент лекарств на территории Азербайджана — обеспечивает быстрое и профессиональное распространение новых продуктов.',
            features: [
                'Полный ассортимент лекарств',
                'Быстрый вывод новых продуктов',
                'Профессиональные консультации',
                'Доступность по всему Азербайджану',
                'Прямой доступ к потребителю',
            ],
            ctaText: 'Найти Аптеку',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'aestheticCenters',
            title: 'Косметические и Эстетические Центры',
            description: 'Собственная сеть косметических/эстетических центров в Баку, представляющая передовые технологии косметологии и эстетической медицины на азербайджанском рынке.',
            features: [
                'Передовые технологии косметологии',
                'Услуги эстетической медицины',
                'Локации в Баку',
                'Международные продуктовые линейки',
                'Профессиональный медицинский персонал',
            ],
            ctaText: 'Записаться на Консультацию',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'logistics',
            title: 'Логистика и Складирование',
            description: 'Собственные склады и передовые депо по всей стране обеспечивают надлежащее хранение, эффективное управление запасами, оперативный транспорт и своевременную доставку.',
            features: [
                'Склады с температурным контролем',
                'Распределительные депо по стране',
                'Управление запасами',
                'Оперативный транспортный парк',
                'Своевременный анализ логистических затрат',
            ],
            ctaText: 'Запрос по Логистике',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'medicalMarketing',
            title: 'Медицинский Маркетинг и Продвижение',
            description: 'Наш отдел маркетинга состоит не только из профессиональных маркетологов, но и сотрудников с высшим медицинским образованием — что гарантирует эффективный маркетинг и медицински точное представление продуктов.',
            features: [
                'Медицински квалифицированная полевая команда',
                'Участие в научных конференциях',
                'Трейд-маркетинг',
                'Управление торговой командой',
                'Информирование потребителей',
            ],
            ctaText: 'Маркетинговое Партнёрство',
            ctaHref: '/contact',
        },
        {
            type: 'serviceDetails',
            serviceId: 'marketEntry',
            title: 'Выход на Рынок СНГ',
            description: 'Мы представляем международных производителей на Украине, в Грузии, Узбекистане и других бывших советских государствах — обеспечиваем аналитику рынка, навигацию по регулированию и полную дистрибуционную поддержку.',
            features: [
                'Поддержка регистрации продуктов',
                'Регуляторное соответствие',
                'Аналитика рынков СНГ',
                'Доступ к сети дистрибуции',
                'Научное представительство',
            ],
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
};

// ── main ─────────────────────────────────────────────────────

async function main() {
    console.log('📝 Seeding Services page content...\n');

    const page = await prisma.page.findUnique({
        where: { slug: 'services' },
        include: { translations: true },
    });

    if (!page) {
        console.error('❌  "services" page not found in DB. Run the base seed first.');
        process.exit(1);
    }

    let updated = 0;
    let unchanged = 0;

    for (const [locale, incoming] of Object.entries(SERVICES_CONTENT)) {
        const tr = page.translations.find(t => t.localeCode === locale);
        if (!tr) {
            console.log(`  ⏭  [${locale}] no translation found — skipping`);
            unchanged++;
            continue;
        }

        const existing: any[] = Array.isArray(tr.blocks) ? (tr.blocks as any[]) : [];
        const merged = replaceBlocks(existing, incoming);

        if (JSON.stringify(existing) === JSON.stringify(merged)) {
            console.log(`  ✓  [${locale}] already up to date`);
            unchanged++;
            continue;
        }

        await prisma.pageTranslation.update({
            where: { id: tr.id },
            data: { blocks: merged as any },
        });

        console.log(`  ✅ [${locale}] updated  (${existing.length} → ${merged.length} blocks)`);
        updated++;
    }

    console.log(`\n✅ Done. Updated: ${updated}, Unchanged: ${unchanged}`);
    console.log('   No schema changes | Idempotent | Images preserved if set');
}

main()
    .catch(e => { console.error('❌', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
