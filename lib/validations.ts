import { z } from 'zod';

// ============================================
// Content Block Schemas
// ============================================

export const headingBlockSchema = z.object({
    type: z.literal('heading'),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    text: z.string().min(1, 'Heading text is required'),
});

export const paragraphBlockSchema = z.object({
    type: z.literal('paragraph'),
    text: z.string().min(1, 'Paragraph text is required'),
});

export const quoteBlockSchema = z.object({
    type: z.literal('quote'),
    text: z.string().min(1, 'Quote text is required'),
    by: z.string().optional(),
});

export const bulletsBlockSchema = z.object({
    type: z.literal('bullets'),
    items: z.array(z.string().min(1)).min(1, 'At least one bullet item is required'),
});

export const calloutBlockSchema = z.object({
    type: z.literal('callout'),
    title: z.string().min(1, 'Callout title is required'),
    text: z.string().min(1, 'Callout text is required'),
    variant: z.enum(['info', 'success', 'warning', 'error']).optional(),
});

export const statsItemSchema = z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    note: z.string().optional(),
});

export const statsBlockSchema = z.object({
    type: z.literal('stats'),
    items: z.array(statsItemSchema).min(1, 'At least one stat item is required'),
});

export const imageBlockSchema = z.object({
    type: z.literal('image'),
    src: z.string().url('Must be a valid URL'),
    alt: z.string().min(1, 'Alt text is required'),
    caption: z.string().optional(),
});

export const dividerBlockSchema = z.object({
    type: z.literal('divider'),
});

// Hero-specific blocks
export const heroBlockSchema = z.object({
    type: z.literal('hero'),
    tagline: z.string().min(1, 'Tagline is required'),
    subtagline: z.string().optional(),
    ctaPrimary: z.object({
        text: z.string().min(1),
        href: z.string().min(1),
    }).optional(),
    ctaSecondary: z.object({
        text: z.string().min(1),
        href: z.string().min(1),
    }).optional(),
    quickLinks: z.array(z.object({
        text: z.string().min(1),
        href: z.string().min(1),
    })).optional(),
});

// About section blocks
export const pillarSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
});

export const aboutBlockSchema = z.object({
    type: z.literal('about'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    headlineAccent: z.string().optional(),
    mission: z.string().min(1),
    pillars: z.array(pillarSchema).optional(),
});

// Services block
export const serviceFeatureSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    features: z.array(z.string()).optional(),
    cta: z.object({
        text: z.string().min(1),
        href: z.string().min(1),
    }).optional(),
});

export const servicesBlockSchema = z.object({
    type: z.literal('services'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    services: z.array(serviceFeatureSchema).min(1),
});

// Partners block
export const partnerSchema = z.object({
    name: z.string().min(1),
    location: z.string().optional(),
    specialty: z.string().optional(),
    region: z.string().optional(),
    logo: z.string().optional(),
});

export const partnersBlockSchema = z.object({
    type: z.literal('partners'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    partners: z.array(partnerSchema).optional(),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
});

// Contact block
export const contactBlockSchema = z.object({
    type: z.literal('contact'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    showForm: z.boolean().default(true),
    showMap: z.boolean().default(true),
});

// Stats/Insights snapshot block
export const insightsBlockSchema = z.object({
    type: z.literal('insights'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    subheadline: z.string().optional(),
    stats: z.array(statsItemSchema).optional(),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
});

// Values block (for about page)
export const valueSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
});

export const valuesBlockSchema = z.object({
    type: z.literal('values'),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    values: z.array(valueSchema).min(1),
});

// Team block
export const teamMemberSchema = z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    bio: z.string().optional(),
    image: z.string().optional(),
});

export const teamBlockSchema = z.object({
    type: z.literal('team'),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    members: z.array(teamMemberSchema).min(1),
});

// Milestones/Timeline block
export const milestoneSchema = z.object({
    year: z.string().min(1),
    event: z.string().min(1),
});

export const milestonesBlockSchema = z.object({
    type: z.literal('milestones'),
    milestones: z.array(milestoneSchema).min(1),
});

// CTA block
export const ctaBlockSchema = z.object({
    type: z.literal('cta'),
    headline: z.string().min(1),
    description: z.string().optional(),
    primaryButton: z.object({
        text: z.string().min(1),
        href: z.string().min(1),
    }).optional(),
    secondaryButton: z.object({
        text: z.string().min(1),
        href: z.string().min(1),
    }).optional(),
});

// Service detail block (for services page detailed sections)
export const serviceDetailSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()).optional(),
});

export const serviceDetailsBlockSchema = z.object({
    type: z.literal('serviceDetails'),
    serviceId: z.string().min(1), // 'marketEntry' or 'healthTourism'
    title: z.string().min(1),
    description: z.string().min(1),
    features: z.array(z.string()),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
    details: z.array(serviceDetailSchema).optional(),
});

// Process steps block
export const processStepSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
});

export const processBlockSchema = z.object({
    type: z.literal('process'),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    steps: z.array(processStepSchema).min(1),
});

// Story block (for about page)
export const storyBlockSchema = z.object({
    type: z.literal('story'),
    title: z.string().optional(),
    paragraphs: z.array(z.string()).min(1),
});

// Storyline Block (Narrative Timeline)
export const storylineBeatSchema = z.object({
    id: z.string(),
    kicker: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    year: z.string().optional(),
});

export const storylineBlockSchema = z.object({
    type: z.literal('storyline'),
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    text: z.string().optional(),
    beats: z.array(storylineBeatSchema).min(1),
    cta: z.object({
        text: z.string().min(1),
        href: z.string().min(1),
    }).optional(),
});

// Intro block (generic page intro)
export const introBlockSchema = z.object({
    type: z.literal('intro'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    headlineAccent: z.string().optional(),
    text: z.string().optional(),
});

// Stats row block
export const statsRowBlockSchema = z.object({
    type: z.literal('statsRow'),
    stats: z.array(z.object({
        value: z.string().min(1),
        label: z.string().min(1),
    })).min(1),
});

// ============================================
// NEW EXPANDED BLOCK SCHEMAS
// ============================================

// Testimonials Block
export const testimonialSchema = z.object({
    quote: z.string().min(1),
    author: z.string().min(1),
    role: z.string().optional(),
    company: z.string().optional(),
    image: z.string().optional(),
});

export const testimonialsBlockSchema = z.object({
    type: z.literal('testimonials'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    testimonials: z.array(testimonialSchema).min(1),
});

// Insights List Block
export const insightItemSchema = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    date: z.string().optional(),
    image: z.string().optional(),
    href: z.string().optional(),
});

export const insightsListBlockSchema = z.object({
    type: z.literal('insightsList'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    items: z.array(insightItemSchema).min(1),
    viewAllHref: z.string().optional(),
});

// Logo Grid Block
export const logoItemSchema = z.object({
    name: z.string().min(1),
    logo: z.string().min(1),
    href: z.string().optional(),
});

export const logoGridBlockSchema = z.object({
    type: z.literal('logoGrid'),
    eyebrow: z.string().optional(),
    headline: z.string().optional(),
    logos: z.array(logoItemSchema).min(1),
});

// Gallery Block
export const galleryImageSchema = z.object({
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
});

export const galleryBlockSchema = z.object({
    type: z.literal('gallery'),
    groupKey: z.string(),
    headline: z.string().optional(),
    layout: z.enum(['grid', 'carousel', 'masonry']).default('grid'),
    images: z.array(galleryImageSchema).optional(),
});

// Packages Block
export const packageCardSchema = z.object({
    title: z.string(),
    duration: z.string(),
    price: z.string(),
    includes: z.array(z.string()),
    itinerary: z.array(z.string()).optional(),
});

export const packagesBlockSchema = z.object({
    type: z.literal('packages'),
    eyebrow: z.string().optional(),
    headline: z.string(),
    packages: z.array(packageCardSchema),
});

// Vehicle Fleet
export const vehicleSchema = z.object({
    name: z.string(),
    capacity: z.string(),
    dimensions: z.string().optional(),
    image: z.string().optional(),
});

export const vehicleFleetBlockSchema = z.object({
    type: z.literal('vehicleFleet'),
    headline: z.string(),
    vehicles: z.array(vehicleSchema),
});

// Form Selector
export const formSelectorBlockSchema = z.object({
    type: z.literal('formSelector'),
    headline: z.string(),
    description: z.string().optional(),
    defaultType: z.enum(['patient', 'tour', 'business']).optional(),
});

// Why Us block (value propositions)
export const whyUsItemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
});

export const whyUsBlockSchema = z.object({
    type: z.literal('whyUs'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    items: z.array(whyUsItemSchema).min(1),
});

// How It Works block
export const howItWorksStepSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
});

export const howItWorksBlockSchema = z.object({
    type: z.literal('howItWorks'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    steps: z.array(howItWorksStepSchema).min(1),
});

// Areas block (destinations)
export const areaItemSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.string().optional(),
});

export const areasBlockSchema = z.object({
    type: z.literal('areas'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    areas: z.array(areaItemSchema).min(1),
});

// FAQ block
export const faqItemSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
});

export const faqBlockSchema = z.object({
    type: z.literal('faq'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    items: z.array(faqItemSchema).min(1),
});

// Interactive Services block
export const interactiveServiceSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    shortTitle: z.string().optional(),
    description: z.string().min(1),
    features: z.array(z.string()).optional(),
    icon: z.string().optional(),
});

export const interactiveServicesBlockSchema = z.object({
    type: z.literal('interactiveServices'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    services: z.array(interactiveServiceSchema).min(1),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
});

// Partners Empty block
export const partnersEmptyBlockSchema = z.object({
    type: z.literal('partnersEmpty'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().min(1),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
});

// Combined content block schema
export const contentBlockSchema = z.discriminatedUnion('type', [
    headingBlockSchema,
    paragraphBlockSchema,
    quoteBlockSchema,
    bulletsBlockSchema,
    calloutBlockSchema,
    statsBlockSchema,
    imageBlockSchema,
    dividerBlockSchema,
    heroBlockSchema,
    aboutBlockSchema,
    servicesBlockSchema,
    partnersBlockSchema,
    contactBlockSchema,
    insightsBlockSchema,
    valuesBlockSchema,
    teamBlockSchema,
    milestonesBlockSchema,
    ctaBlockSchema,
    serviceDetailsBlockSchema,
    processBlockSchema,
    storyBlockSchema,
    storylineBlockSchema,
    introBlockSchema,
    statsRowBlockSchema,
    // New expanded blocks
    whyUsBlockSchema,
    howItWorksBlockSchema,
    areasBlockSchema,
    faqBlockSchema,
    interactiveServicesBlockSchema,
    partnersEmptyBlockSchema,
    galleryBlockSchema,
    packagesBlockSchema,
    vehicleFleetBlockSchema,
    formSelectorBlockSchema,
    testimonialsBlockSchema,
    insightsListBlockSchema,
    logoGridBlockSchema,
]);

export const blocksArraySchema = z.array(contentBlockSchema);

// ============================================
// Page Translation Schema
// ============================================

export const pageTranslationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    ogImage: z.string().optional().nullable(),
    blocks: blocksArraySchema,
    status: z.enum(['DRAFT', 'PUBLISHED']),
});

// ============================================
// Site Settings Schemas
// ============================================

export const socialsSchema = z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
});

export const siteSettingsSchema = z.object({
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    socials: socialsSchema.optional(),
    mapEmbedUrl: z.string().url().optional().or(z.literal('')),
});

export const siteSettingsTranslationSchema = z.object({
    tagline: z.string().optional(),
    footerText: z.string().optional(),
});

// ============================================
// Locale Schema
// ============================================

export const localeSchema = z.object({
    code: z.string().min(2).max(5).regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid locale code format'),
    name: z.string().min(1, 'Name is required'),
    nativeName: z.string().min(1, 'Native name is required'),
    flag: z.string().optional(),
    isRTL: z.boolean().default(false),
    isDefault: z.boolean().default(false),
    isEnabled: z.boolean().default(true),
});

export const localeUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    nativeName: z.string().min(1).optional(),
    flag: z.string().optional(),
    isRTL: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    isEnabled: z.boolean().optional(),
});

// ============================================
// User Schema
// ============================================

export const userCreateSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR'),
});

export const userUpdateSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'EDITOR']).optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    isActive: z.boolean().optional(),
});

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Type exports
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type PageTranslationInput = z.infer<typeof pageTranslationSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type SiteSettingsTranslationInput = z.infer<typeof siteSettingsTranslationSchema>;
export type LocaleInput = z.infer<typeof localeSchema>;
export type LocaleUpdateInput = z.infer<typeof localeUpdateSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
