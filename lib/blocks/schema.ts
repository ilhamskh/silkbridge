import { z } from 'zod';

// ============================================
// Shared Block Schema - used by BOTH admin validation AND public rendering
// ============================================

// Hero Block
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
});

// About Block
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

// Services Block
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

// Partners Block
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

// Contact Block
export const contactBlockSchema = z.object({
    type: z.literal('contact'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    showForm: z.boolean().default(true),
    showMap: z.boolean().default(true),
});

// Insights/Stats Block
export const statsItemSchema = z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    note: z.string().optional(),
});

export const insightsBlockSchema = z.object({
    type: z.literal('insights'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    subheadline: z.string().optional(),
    stats: z.array(statsItemSchema).optional(),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
});

// Intro Block (for page headers)
export const introBlockSchema = z.object({
    type: z.literal('intro'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    headlineAccent: z.string().optional(),
    text: z.string().optional(),
});

// Story Block (for about page)
export const storyBlockSchema = z.object({
    type: z.literal('story'),
    title: z.string().optional(),
    paragraphs: z.array(z.string()).min(1),
});

// Milestones Block
export const milestoneSchema = z.object({
    year: z.string().min(1),
    event: z.string().min(1),
});

export const milestonesBlockSchema = z.object({
    type: z.literal('milestones'),
    milestones: z.array(milestoneSchema).min(1),
});

// Values Block
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

// Team Block
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

// CTA Block
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

// Service Details Block (for services page)
export const serviceDetailSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()).optional(),
});

export const serviceDetailsBlockSchema = z.object({
    type: z.literal('serviceDetails'),
    serviceId: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    features: z.array(z.string()),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
    details: z.array(serviceDetailSchema).optional(),
});

// Process Block
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

// Stats Row Block
export const statsRowBlockSchema = z.object({
    type: z.literal('statsRow'),
    stats: z.array(z.object({
        value: z.string().min(1),
        label: z.string().min(1),
    })).min(1),
});

// Why Us Block (Value Propositions)
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
    items: z.array(whyUsItemSchema).min(1).max(5),
});

// How It Works Block (Process Steps)
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
    steps: z.array(howItWorksStepSchema).min(2).max(5),
});

// Areas We Cover Block
export const areaSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.string().optional(),
});

export const areasBlockSchema = z.object({
    type: z.literal('areas'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    areas: z.array(areaSchema).min(1),
});

// FAQ Block
export const faqItemSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
});

export const faqBlockSchema = z.object({
    type: z.literal('faq'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().optional(),
    items: z.array(faqItemSchema).min(1),
});

// Interactive Services Block (for tabs/accordion)
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

// Partners Empty State Block
export const partnersEmptyBlockSchema = z.object({
    type: z.literal('partnersEmpty'),
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    description: z.string().min(1),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
});

// Basic content blocks
export const headingBlockSchema = z.object({
    type: z.literal('heading'),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    text: z.string().min(1, 'Heading text is required'),
});

export const paragraphBlockSchema = z.object({
    type: z.literal('paragraph'),
    text: z.string().min(1, 'Paragraph text is required'),
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

// Combined content block schema - THE SINGLE SOURCE OF TRUTH
export const contentBlockSchema = z.discriminatedUnion('type', [
    heroBlockSchema,
    aboutBlockSchema,
    servicesBlockSchema,
    partnersBlockSchema,
    contactBlockSchema,
    insightsBlockSchema,
    introBlockSchema,
    storyBlockSchema,
    milestonesBlockSchema,
    valuesBlockSchema,
    teamBlockSchema,
    ctaBlockSchema,
    serviceDetailsBlockSchema,
    processBlockSchema,
    statsRowBlockSchema,
    whyUsBlockSchema,
    howItWorksBlockSchema,
    areasBlockSchema,
    faqBlockSchema,
    interactiveServicesBlockSchema,
    partnersEmptyBlockSchema,
    headingBlockSchema,
    paragraphBlockSchema,
    imageBlockSchema,
    dividerBlockSchema,
]);

export const blocksArraySchema = z.array(contentBlockSchema);

// Type exports
export type HeroBlock = z.infer<typeof heroBlockSchema>;
export type AboutBlock = z.infer<typeof aboutBlockSchema>;
export type ServicesBlock = z.infer<typeof servicesBlockSchema>;
export type PartnersBlock = z.infer<typeof partnersBlockSchema>;
export type ContactBlock = z.infer<typeof contactBlockSchema>;
export type InsightsBlock = z.infer<typeof insightsBlockSchema>;
export type IntroBlock = z.infer<typeof introBlockSchema>;
export type StoryBlock = z.infer<typeof storyBlockSchema>;
export type MilestonesBlock = z.infer<typeof milestonesBlockSchema>;
export type ValuesBlock = z.infer<typeof valuesBlockSchema>;
export type TeamBlock = z.infer<typeof teamBlockSchema>;
export type CtaBlock = z.infer<typeof ctaBlockSchema>;
export type ServiceDetailsBlock = z.infer<typeof serviceDetailsBlockSchema>;
export type ProcessBlock = z.infer<typeof processBlockSchema>;
export type StatsRowBlock = z.infer<typeof statsRowBlockSchema>;
export type WhyUsBlock = z.infer<typeof whyUsBlockSchema>;
export type HowItWorksBlock = z.infer<typeof howItWorksBlockSchema>;
export type AreasBlock = z.infer<typeof areasBlockSchema>;
export type FaqBlock = z.infer<typeof faqBlockSchema>;
export type InteractiveServicesBlock = z.infer<typeof interactiveServicesBlockSchema>;
export type PartnersEmptyBlock = z.infer<typeof partnersEmptyBlockSchema>;
export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type DividerBlock = z.infer<typeof dividerBlockSchema>;

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type BlocksArray = z.infer<typeof blocksArraySchema>;
