/**
 * Seed: Insight Categories + 3 Starter Posts
 * ============================================
 * 
 * Seeds insight categories (5) with en/az/ru translations,
 * then creates 3 professional posts published in all 3 locales.
 * 
 * Run: npx tsx prisma/seed-insights.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
    {
        key: 'medical-tourism',
        order: 1,
        translations: {
            en: 'Medical Tourism',
            az: 'Tibbi Turizm',
            ru: 'Медицинский туризм',
        },
    },
    {
        key: 'wellness',
        order: 2,
        translations: {
            en: 'Wellness',
            az: 'Sağlamlıq',
            ru: 'Велнес',
        },
    },
    {
        key: 'pharmaceuticals',
        order: 3,
        translations: {
            en: 'Pharmaceuticals',
            az: 'Əczaçılıq',
            ru: 'Фармацевтика',
        },
    },
    {
        key: 'market-updates',
        order: 4,
        translations: {
            en: 'Market Updates',
            az: 'Bazar Yenilikləri',
            ru: 'Обзор рынка',
        },
    },
    {
        key: 'partnerships',
        order: 5,
        translations: {
            en: 'Partnerships',
            az: 'Tərəfdaşlıqlar',
            ru: 'Партнёрства',
        },
    },
];

const POSTS = [
    {
        slug: 'azerbaijan-medical-tourism-growth-2026',
        categoryKey: 'medical-tourism',
        featured: true,
        en: {
            title: 'Azerbaijan\'s Medical Tourism Sector: Growth Drivers and Opportunities in 2026',
            excerpt: 'An analysis of the key factors propelling Azerbaijan\'s medical tourism industry, from government investment in healthcare infrastructure to competitive pricing and strategic geographic positioning.',
            bodyMarkdown: `Azerbaijan has emerged as a compelling destination for medical tourism, driven by strategic government investments, a rapidly modernizing healthcare infrastructure, and competitive pricing that undercuts many Western European and Middle Eastern alternatives.

## Current Landscape

The Azerbaijani government has committed significant resources to healthcare modernization as part of its broader economic diversification strategy. Major hospitals in Baku now feature state-of-the-art equipment and internationally trained medical staff, positioning the country as a credible alternative for patients seeking quality care at accessible price points.

### Key Growth Metrics

The medical tourism segment has shown consistent year-over-year growth, with patient volumes from neighboring countries increasing substantially. Turkey, Russia, and the Gulf states represent the largest source markets, attracted by Azerbaijan's combination of medical expertise, cultural familiarity, and competitive costs.

## Competitive Advantages

Azerbaijan offers several distinct advantages in the medical tourism space:

- **Geographic positioning** — situated at the crossroads of Europe and Asia, with direct flight connections to major cities
- **Competitive pricing** — procedures typically cost 40–60% less than equivalent treatments in Western Europe
- **Cultural bridge** — Turkic, Slavic, and Persian cultural connections facilitate patient comfort
- **Visa accessibility** — simplified visa procedures for medical visitors from key source markets
- **Emerging infrastructure** — new hospital complexes designed specifically for international patients

## Specialty Areas

Several medical specialties stand out as particularly strong in Azerbaijan:

1. **Ophthalmology** — advanced laser and surgical procedures
2. **Dental care** — comprehensive cosmetic and restorative dentistry
3. **Orthopedics** — joint replacement and sports medicine
4. **Cardiology** — interventional procedures and cardiac rehabilitation

## Looking Ahead

The convergence of government policy, private sector investment, and growing international recognition suggests that Azerbaijan's medical tourism sector is well-positioned for sustained growth through 2026 and beyond. Success will depend on maintaining quality standards, building international accreditations, and developing seamless patient journey experiences.

> "Azerbaijan's strategic position and healthcare investments create a unique value proposition for international patients seeking quality medical care." — Industry Analysis, 2026

---

*Silkbridge International provides market entry advisory and partnership facilitation services for healthcare organizations looking to establish presence in the Azerbaijan medical tourism market.*`,
            tags: ['medical-tourism', 'azerbaijan', 'healthcare', 'market-analysis'],
            seoTitle: 'Azerbaijan Medical Tourism 2026: Growth Drivers & Opportunities',
            seoDescription: 'Comprehensive analysis of Azerbaijan\'s growing medical tourism sector — competitive advantages, specialty areas, and market outlook for 2026.',
        },
        az: {
            title: 'Azərbaycanın Tibbi Turizm Sektoru: 2026-cı ildə İnkişaf Amilləri və İmkanlar',
            excerpt: 'Hökumətin səhiyyə infrastrukturuna investisiyalarından tutmuş rəqabətqabiliyyətli qiymətlərə və strateji coğrafi mövqeyə qədər Azərbaycanın tibbi turizm sənayesini irəli aparan əsas amillərin təhlili.',
            bodyMarkdown: `Azərbaycan strateji hökumət investisiyaları, sürətlə modernləşən səhiyyə infrastrukturu və bir çox Qərbi Avropa və Yaxın Şərq alternativlərindən aşağı olan rəqabətqabiliyyətli qiymətlər sayəsində tibbi turizm üçün cəlbedici bir istiqamət kimi ortaya çıxmışdır.

## Mövcud Vəziyyət

Azərbaycan hökuməti daha geniş iqtisadi diversifikasiya strategiyasının bir hissəsi olaraq səhiyyənin modernləşdirilməsinə əhəmiyyətli resurslar ayırmışdır. Bakıdakı əsas xəstəxanalar indi müasir avadanlıq və beynəlxalq təhsil almış tibbi heyətlə təchiz olunmuş, bu da ölkəni əlçatan qiymətlərdə keyfiyyətli tibbi xidmət axtaran xəstələr üçün etibarlı alternativ kimi mövqeləndirmişdir.

### Əsas İnkişaf Göstəriciləri

Tibbi turizm seqmenti ardıcıl illik artım nümayiş etdirmişdir. Türkiyə, Rusiya və Körfəz ölkələri Azərbaycanın tibbi ekspertiza, mədəni yaxınlıq və rəqabətqabiliyyətli xərclərin birləşməsinə cəlb olunaraq ən böyük mənbə bazarlarını təmsil edir.

## Rəqabət Üstünlükləri

Azərbaycan tibbi turizm sahəsində bir neçə fərqli üstünlük təklif edir:

- **Coğrafi mövqe** — Avropa və Asiya arasında, əsas şəhərlərə birbaşa uçuş əlaqələri ilə
- **Rəqabətqabiliyyətli qiymətlər** — prosedurlar adətən Qərbi Avropadakı ekvivalent müalicələrdən 40-60% az başa gəlir
- **Mədəni körpü** — türk, slavyan və fars mədəni bağları xəstə rahatlığını asanlaşdırır
- **Viza əlçatanlığı** — əsas mənbə bazarlarından tibbi ziyarətçilər üçün sadələşdirilmiş viza prosedurları

## Gələcəyə Baxış

Hökumət siyasəti, özəl sektor investisiyaları və artan beynəlxalq tanınmanın birləşməsi göstərir ki, Azərbaycanın tibbi turizm sektoru 2026-cı il və ondan sonra da davamlı inkişaf üçün yaxşı mövqedədir.

---

*Silkbridge International, Azərbaycan tibbi turizm bazarında varlıq yaratmaq istəyən səhiyyə təşkilatları üçün bazara giriş məsləhət və tərəfdaşlıq xidmətləri təqdim edir.*`,
            tags: ['tibbi-turizm', 'azərbaycan', 'səhiyyə', 'bazar-təhlili'],
            seoTitle: 'Azərbaycan Tibbi Turizm 2026: İnkişaf Amilləri və İmkanlar',
            seoDescription: 'Azərbaycanın inkişaf edən tibbi turizm sektoru haqqında hərtərəfli təhlil — rəqabət üstünlükləri, ixtisas sahələri və 2026 bazar perspektivi.',
        },
        ru: {
            title: 'Сектор медицинского туризма Азербайджана: драйверы роста и возможности в 2026 году',
            excerpt: 'Анализ ключевых факторов развития индустрии медицинского туризма Азербайджана — от государственных инвестиций в здравоохранение до конкурентного ценообразования и стратегического географического положения.',
            bodyMarkdown: `Азербайджан превратился в привлекательное направление для медицинского туризма благодаря стратегическим государственным инвестициям, быстро модернизирующейся инфраструктуре здравоохранения и конкурентным ценам, которые ниже многих западноевропейских и ближневосточных альтернатив.

## Текущий ландшафт

Правительство Азербайджана выделило значительные ресурсы на модернизацию здравоохранения в рамках более широкой стратегии диверсификации экономики. Крупные больницы Баку оснащены современным оборудованием и медицинским персоналом с международной подготовкой.

### Ключевые показатели роста

Сегмент медицинского туризма демонстрирует стабильный рост. Турция, Россия и страны Персидского залива представляют крупнейшие исходные рынки.

## Конкурентные преимущества

Азербайджан предлагает ряд явных преимуществ:

- **Географическое положение** — на перекрёстке Европы и Азии с прямыми авиарейсами в крупные города
- **Конкурентные цены** — процедуры обычно стоят на 40–60% дешевле аналогичного лечения в Западной Европе
- **Культурный мост** — тюркские, славянские и персидские культурные связи
- **Доступность виз** — упрощённые визовые процедуры для медицинских туристов

## Взгляд в будущее

Совокупность государственной политики, частных инвестиций и растущего международного признания указывает на то, что сектор медицинского туризма Азербайджана хорошо позиционирован для устойчивого роста.

---

*Silkbridge International предоставляет консультационные услуги по выходу на рынок для организаций здравоохранения, стремящихся занять позиции на рынке медицинского туризма Азербайджана.*`,
            tags: ['медицинский-туризм', 'азербайджан', 'здравоохранение', 'анализ-рынка'],
            seoTitle: 'Медицинский туризм Азербайджана 2026: драйверы роста и возможности',
            seoDescription: 'Комплексный анализ растущего сектора медицинского туризма Азербайджана — конкурентные преимущества, специализации и рыночные перспективы.',
        },
    },
    {
        slug: 'pharmaceutical-market-entry-strategies-cis',
        categoryKey: 'pharmaceuticals',
        featured: false,
        en: {
            title: 'Pharmaceutical Market Entry Strategies for the CIS Region',
            excerpt: 'A strategic overview of regulatory pathways, distribution models, and partnership structures for pharmaceutical companies entering CIS markets through Azerbaijan.',
            bodyMarkdown: `The Commonwealth of Independent States (CIS) represents a significant and growing pharmaceutical market, with Azerbaijan offering a strategic gateway for international companies seeking regional presence.

## Regulatory Landscape

Each CIS country maintains distinct regulatory frameworks, but several regional harmonization efforts are underway. Understanding these nuances is critical for efficient market entry.

### Key Regulatory Considerations

- **Registration timelines** vary from 6 months to 2+ years depending on the jurisdiction
- **GMP compliance** requirements increasingly align with EU/PIC/S standards
- **Pharmacovigilance** obligations are becoming more stringent across the region
- **Pricing and reimbursement** mechanisms differ significantly between markets

## Entry Models

### Direct Registration

The most straightforward approach for established pharmaceutical companies with existing international operations. Requires local representation and regulatory expertise.

### Licensing and Distribution

Partnering with established local distributors offers faster market access with lower upfront investment. Key success factors include:

1. Due diligence on distributor capabilities and market coverage
2. Clear territory and exclusivity agreements
3. Aligned incentive structures
4. Regular performance monitoring

### Joint Ventures

For companies seeking deeper market commitment, joint ventures with local pharmaceutical companies can provide:

- Manufacturing capabilities in-country
- Existing regulatory relationships
- Distribution infrastructure
- Local market knowledge

## Azerbaijan as a Regional Hub

Azerbaijan's position provides specific advantages for CIS market entry:

- **Modern regulatory framework** — increasingly aligned with international standards
- **Strategic location** — physical and cultural bridge to Central Asia and the Caucasus
- **Government support** — active trade promotion and investment facilitation
- **Growing domestic market** — population increasingly accessing modern pharmaceuticals

## Success Factors

Successful pharmaceutical market entry in the CIS region requires:

- **Patience and commitment** — regulatory timelines can be lengthy
- **Local partnerships** — indispensable for market navigation
- **Adaptability** — regulatory and market conditions evolve rapidly
- **Quality focus** — meeting and exceeding local quality expectations builds trust

---

*Contact Silkbridge International to discuss your pharmaceutical market entry strategy for Azerbaijan and the broader CIS region.*`,
            tags: ['pharmaceuticals', 'market-entry', 'CIS', 'regulatory'],
            seoTitle: 'Pharmaceutical Market Entry Strategies for CIS Region | Silkbridge',
            seoDescription: 'Strategic guide to pharmaceutical market entry in CIS countries through Azerbaijan — regulatory pathways, distribution models, and partnership structures.',
        },
        az: {
            title: 'MDB Regionu üçün Əczaçılıq Bazarına Giriş Strategiyaları',
            excerpt: 'Azərbaycan vasitəsilə MDB bazarlarına daxil olan əczaçılıq şirkətləri üçün tənzimləyici yollar, paylama modelləri və tərəfdaşlıq strukturları haqqında strateji icmal.',
            bodyMarkdown: `Müstəqil Dövlətlər Birliyi (MDB) əhəmiyyətli və böyüyən əczaçılıq bazarını təmsil edir, Azərbaycan isə regional varlıq axtaran beynəlxalq şirkətlər üçün strateji giriş nöqtəsi təklif edir.

## Tənzimləyici Mühit

Hər bir MDB ölkəsi fərqli tənzimləyici çərçivələrə malikdir, lakin bir neçə regional harmonizasiya səyi davam edir.

### Əsas Tənzimləyici Mülahizələr

- **Qeydiyyat müddətləri** yurisdiksiyadan asılı olaraq 6 aydan 2+ ilə qədər dəyişir
- **GMP uyğunluğu** tələbləri getdikcə Aİ/PIC/S standartlarına uyğunlaşır
- **Farmakovigilans** öhdəlikləri regionda daha ciddi olur
- **Qiymətləndirmə** mexanizmləri bazarlar arasında əhəmiyyətli dərəcədə fərqlənir

## Giriş Modelləri

### Birbaşa Qeydiyyat

Mövcud beynəlxalq əməliyyatlara malik əczaçılıq şirkətləri üçün ən birbaşa yanaşma.

### Lisenziyalaşdırma və Paylama

Yerli distribütorlarla tərəfdaşlıq daha sürətli bazara çıxış təklif edir.

### Birgə Müəssisələr

Daha dərin bazar öhdəliyi axtaran şirkətlər üçün yerli əczaçılıq şirkətləri ilə birgə müəssisələr istehsal imkanları, mövcud tənzimləyici əlaqələr və paylama infrastrukturu təmin edə bilər.

## Azərbaycan Regional Mərkəz kimi

Azərbaycanın mövqeyi MDB bazarına giriş üçün xüsusi üstünlüklər təmin edir.

---

*MDB regionu üçün əczaçılıq bazarına giriş strategiyanızı müzakirə etmək üçün Silkbridge International ilə əlaqə saxlayın.*`,
            tags: ['əczaçılıq', 'bazara-giriş', 'MDB', 'tənzimləyici'],
            seoTitle: 'MDB Regionu üçün Əczaçılıq Bazarına Giriş Strategiyaları',
            seoDescription: 'Azərbaycan vasitəsilə MDB ölkələrində əczaçılıq bazarına giriş üçün strateji bələdçi.',
        },
        ru: {
            title: 'Стратегии выхода на фармацевтический рынок стран СНГ',
            excerpt: 'Стратегический обзор регуляторных путей, моделей дистрибуции и партнёрских структур для фармацевтических компаний, выходящих на рынки СНГ через Азербайджан.',
            bodyMarkdown: `Содружество Независимых Государств (СНГ) представляет значительный и растущий фармацевтический рынок, а Азербайджан предлагает стратегические ворота для международных компаний.

## Регуляторный ландшафт

Каждая страна СНГ имеет свою нормативную базу, но предпринимаются усилия по региональной гармонизации.

### Ключевые регуляторные аспекты

- **Сроки регистрации** варьируются от 6 месяцев до 2+ лет
- **Требования GMP** всё больше соответствуют стандартам ЕС/PIC/S
- **Фармаконадзор** становится более строгим
- **Ценообразование** существенно различается между рынками

## Модели входа

### Прямая регистрация

Наиболее прямой подход для компаний с существующими международными операциями.

### Лицензирование и дистрибуция

Партнёрство с местными дистрибьюторами обеспечивает более быстрый доступ к рынку.

### Совместные предприятия

Для компаний, стремящихся к более глубокой интеграции, совместные предприятия с местными фармацевтическими компаниями предоставляют производственные мощности и инфраструктуру.

## Азербайджан как региональный хаб

Позиция Азербайджана обеспечивает конкретные преимущества для входа на рынок СНГ.

---

*Свяжитесь с Silkbridge International для обсуждения вашей стратегии выхода на фармацевтический рынок.*`,
            tags: ['фармацевтика', 'выход-на-рынок', 'СНГ', 'регуляторика'],
            seoTitle: 'Стратегии выхода на фармрынок СНГ | Silkbridge',
            seoDescription: 'Стратегическое руководство по выходу на фармацевтический рынок стран СНГ через Азербайджан.',
        },
    },
    {
        slug: 'wellness-tourism-naftalan-therapeutic-traditions',
        categoryKey: 'wellness',
        featured: false,
        en: {
            title: 'Naftalan and Beyond: Azerbaijan\'s Unique Therapeutic Wellness Traditions',
            excerpt: 'Exploring Azerbaijan\'s distinctive wellness offerings — from the world-renowned Naftalan oil therapy to mineral springs and traditional healing practices that attract international visitors.',
            bodyMarkdown: `Azerbaijan possesses genuinely unique wellness resources that have attracted visitors for centuries. Chief among these is Naftalan, a therapeutic crude oil found nowhere else on earth, combined with an abundance of mineral springs and time-tested traditional healing practices.

## Naftalan: A One-of-a-Kind Resource

Naftalan oil — a special type of crude oil with proven therapeutic properties — has been used for over 600 years to treat musculoskeletal, dermatological, and neurological conditions. The city of Naftalan, located in western Azerbaijan, is built around this extraordinary resource.

### Therapeutic Applications

Modern Naftalan therapy is administered in clinical settings under medical supervision:

- **Musculoskeletal disorders** — arthritis, joint inflammation, post-injury rehabilitation
- **Dermatological conditions** — psoriasis, eczema, dermatitis
- **Neurological applications** — peripheral nerve disorders
- **General wellness** — stress reduction and immune system support

## Mineral Springs and Spa Culture

Beyond Naftalan, Azerbaijan is rich in therapeutic mineral springs:

- **Istisu** (literally "hot water") — natural thermal springs in the Kalbajar region
- **Galaalti** — combined beach and mountain spa resort near the Caspian
- **Duzdağ** — salt caves with respiratory therapy applications

## Modern Wellness Infrastructure

While traditional, Azerbaijan's wellness sector is actively modernizing:

1. **Luxury spa resorts** — international-standard facilities in Baku and regional locations
2. **Medical wellness clinics** — combining traditional therapies with modern diagnostics
3. **Wellness retreat programs** — structured multi-day programs for international visitors
4. **Integration with tourism** — wellness packages combined with cultural and culinary experiences

## The International Appeal

Azerbaijan's wellness offerings appeal to distinct visitor segments:

- **CIS travelers** — long tradition of therapeutic travel, cultural familiarity
- **Gulf state visitors** — attracted by the combination of wellness and Caspian hospitality
- **European wellness enthusiasts** — seeking authentic and unique therapeutic experiences

## Market Opportunity

The global wellness tourism market continues to grow, and Azerbaijan's combination of unique therapeutic resources, improving infrastructure, and competitive pricing positions it well to capture a meaningful share of this expanding market.

> "Naftalan represents a truly global unique — there is simply no equivalent therapeutic resource anywhere else in the world."

---

*Silkbridge International facilitates wellness tourism partnerships and helps international operators connect with Azerbaijan's unique therapeutic offerings.*`,
            tags: ['wellness', 'naftalan', 'spa', 'therapeutic-tourism', 'azerbaijan'],
            seoTitle: 'Naftalan & Azerbaijan Wellness Tourism: Unique Therapeutic Traditions',
            seoDescription: 'Discover Azerbaijan\'s unique wellness offerings — Naftalan oil therapy, mineral springs, and traditional healing practices attracting international visitors.',
        },
        az: {
            title: 'Naftalan və Ötəsi: Azərbaycanın Unikal Terapevtik Sağlamlıq Ənənələri',
            excerpt: 'Azərbaycanın fərqli sağlamlıq təkliflərini araşdırırıq — dünyaca məşhur Naftalan neft terapiyasından mineral bulaqlar və beynəlxalq ziyarətçiləri cəlb edən ənənəvi müalicə praktikalarına qədər.',
            bodyMarkdown: `Azərbaycan əsrlərdən bəri ziyarətçiləri cəlb edən həqiqətən unikal sağlamlıq resurslarına malikdir. Bunların başında dünyanın heç bir yerində tapılmayan terapevtik xam neft — Naftalan, mineral bulaqlar və zamanla sınaqdan keçmiş ənənəvi müalicə praktikalarının bolluğu gəlir.

## Naftalan: Bənzərsiz Resurs

Naftalan yağı — sübut edilmiş terapevtik xüsusiyyətlərə malik xüsusi bir neft növü — 600 ildən artıqdır muskuloskelet, dermatoloji və nevroloji xəstəliklərin müalicəsində istifadə olunur.

### Terapevtik Tətbiqlər

- **Dayaq-hərəkət sistemi xəstəlikləri** — artrit, oynaq iltihabı, zədədən sonra reabilitasiya
- **Dermatoloji xəstəliklər** — psoriaz, ekzema, dermatit
- **Nevroloji tətbiqlər** — periferik sinir pozğunluqları
- **Ümumi sağlamlıq** — stress azaltma və immunitet dəstəyi

## Mineral Bulaqlar və Spa Mədəniyyəti

Naftalandan başqa, Azərbaycan terapevtik mineral bulaqlarla zəngindir:

- **İstisu** — Kəlbəcər rayonunda təbii termal bulaqlar
- **Qalaaltı** — Xəzər yaxınlığında çimərlik və dağ spa kurortu
- **Duzdağ** — tənəffüs terapiyası tətbiqləri ilə duz mağaraları

## Beynəlxalq Cazibə

Azərbaycanın sağlamlıq təklifləri müxtəlif ziyarətçi seqmentlərini cəlb edir.

---

*Silkbridge International sağlamlıq turizmi tərəfdaşlıqlarını asanlaşdırır və beynəlxalq operatorlara Azərbaycanın unikal terapevtik təklifləri ilə əlaqə yaratmağa kömək edir.*`,
            tags: ['sağlamlıq', 'naftalan', 'spa', 'terapevtik-turizm', 'azərbaycan'],
            seoTitle: 'Naftalan və Azərbaycan Sağlamlıq Turizmi: Unikal Terapevtik Ənənələr',
            seoDescription: 'Azərbaycanın unikal sağlamlıq təkliflərini kəşf edin — Naftalan yağ terapiyası, mineral bulaqlar və beynəlxalq ziyarətçiləri cəlb edən müalicə praktikalaları.',
        },
        ru: {
            title: 'Нафталан и не только: уникальные терапевтические велнес-традиции Азербайджана',
            excerpt: 'Исследуем уникальные оздоровительные предложения Азербайджана — от всемирно известной нафталановой терапии до минеральных источников и традиционных целебных практик.',
            bodyMarkdown: `Азербайджан обладает поистине уникальными велнес-ресурсами, привлекающими посетителей на протяжении веков. Главный среди них — Нафталан, терапевтическая нефть, не встречающаяся больше нигде на Земле.

## Нафталан: Уникальный в своём роде ресурс

Нафталановое масло — особый вид нефти с доказанными терапевтическими свойствами — используется более 600 лет для лечения заболеваний опорно-двигательного аппарата, дерматологических и неврологических состояний.

### Терапевтические применения

- **Заболевания опорно-двигательного аппарата** — артрит, воспаление суставов, реабилитация
- **Дерматологические заболевания** — псориаз, экзема, дерматит
- **Неврологические применения** — заболевания периферической нервной системы
- **Общее оздоровление** — снижение стресса и поддержка иммунной системы

## Минеральные источники и спа-культура

Помимо Нафталана, Азербайджан богат терапевтическими минеральными источниками:

- **Истису** — природные термальные источники в Кельбаджарском районе
- **Галаалты** — пляжный и горный спа-курорт у Каспия
- **Дуздаг** — соляные пещеры для респираторной терапии

## Международная привлекательность

Велнес-предложения Азербайджана привлекают различные сегменты посетителей.

---

*Silkbridge International способствует развитию партнёрств в сфере велнес-туризма и помогает международным операторам подключиться к уникальным терапевтическим предложениям Азербайджана.*`,
            tags: ['велнес', 'нафталан', 'спа', 'терапевтический-туризм', 'азербайджан'],
            seoTitle: 'Нафталан и велнес-туризм Азербайджана: уникальные терапевтические традиции',
            seoDescription: 'Откройте уникальные оздоровительные предложения Азербайджана — нафталановая терапия, минеральные источники и целебные практики.',
        },
    },
];

function estimateReadTime(markdown: string): number {
    const wordCount = markdown.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(wordCount / 200));
}

async function main() {
    console.log('🔄 Seeding insight categories...');

    // Ensure locale records exist
    const localeRecords = await prisma.locale.findMany();
    const localeCodes = localeRecords.map((l) => l.code);
    console.log(`  Found locales: ${localeCodes.join(', ')}`);

    // Seed categories
    for (const cat of CATEGORIES) {
        const existing = await prisma.insightCategory.findUnique({ where: { key: cat.key } });
        if (existing) {
            console.log(`  Category "${cat.key}" already exists, skipping.`);
            continue;
        }

        await prisma.insightCategory.create({
            data: {
                key: cat.key,
                order: cat.order,
                translations: {
                    create: Object.entries(cat.translations).map(([locale, name]) => ({
                        localeCode: locale,
                        name,
                    })),
                },
            },
        });
        console.log(`  ✅ Created category: ${cat.key}`);
    }

    console.log('\n🔄 Seeding insight posts...');

    for (const postData of POSTS) {
        const existing = await prisma.insightPost.findUnique({ where: { slug: postData.slug } });
        if (existing) {
            console.log(`  Post "${postData.slug}" already exists, skipping.`);
            continue;
        }

        // Find category
        const category = await prisma.insightCategory.findUnique({ where: { key: postData.categoryKey } });

        const post = await prisma.insightPost.create({
            data: {
                slug: postData.slug,
                categoryId: category?.id,
                featured: postData.featured,
            },
        });

        // Create translations for each locale
        const localeData: Record<string, typeof postData.en> = {
            en: postData.en,
            az: postData.az,
            ru: postData.ru,
        };

        for (const [locale, data] of Object.entries(localeData)) {
            await prisma.insightPostTranslation.create({
                data: {
                    postId: post.id,
                    locale,
                    status: 'PUBLISHED',
                    publishedAt: new Date(),
                    title: data.title,
                    excerpt: data.excerpt,
                    bodyMarkdown: data.bodyMarkdown,
                    coverImageUrl: null,
                    coverImageAlt: null,
                    tags: data.tags,
                    readTimeMinutes: estimateReadTime(data.bodyMarkdown),
                    seoTitle: data.seoTitle,
                    seoDescription: data.seoDescription,
                },
            });
        }

        console.log(`  ✅ Created post: ${postData.slug} (${Object.keys(localeData).length} locales)`);
    }

    console.log('\n✅ Insights seed complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
