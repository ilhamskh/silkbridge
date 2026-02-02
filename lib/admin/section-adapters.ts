/**
 * Section Adapters - Convert between DB blocks and editable form models
 * This keeps the DB structure unchanged while providing a friendly editing experience
 */

import type { ContentBlock } from '@/lib/validations';

// ============================================
// Form Models (what the admin UI works with)
// ============================================

export interface ImageField {
    url: string;
    alt: string;
}

export interface CTAField {
    text: string;
    href: string;
}

// HOME PAGE SECTIONS

export interface HeroSectionForm {
    tagline: string;
    subtagline: string;
    ctaPrimary: CTAField;
    ctaSecondary: CTAField;
    quickLinks: CTAField[];
}

export interface WhoWeAreSectionForm {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    mission: string;
    image?: ImageField;
    pillars: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
}

export interface WhyUsSectionForm {
    eyebrow: string;
    headline: string;
    values: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
}

export interface ServicesSectionForm {
    eyebrow: string;
    headline: string;
    services: Array<{
        title: string;
        description: string;
        features: string[];
        image?: ImageField;
        cta?: CTAField;
    }>;
}

export interface ProgramsSectionForm {
    eyebrow: string;
    headline: string;
    description: string;
    programs: Array<{
        title: string;
        description: string;
        features: string[];
        image?: ImageField;
    }>;
}

export interface TourPackagesSectionForm {
    eyebrow: string;
    headline: string;
    packages: Array<{
        title: string;
        duration: string;
        price: string;
        description: string;
        itinerary: string[];
        includes: string[];
        hotelOptions?: Array<{
            stars: string;
            price: string;
        }>;
    }>;
}

export interface WellnessPackagesSectionForm {
    eyebrow: string;
    headline: string;
    description: string;
    regions: Array<{
        name: string;
        description: string;
        hotels: Array<{
            name: string;
            stars: string;
            description: string;
            packages: Array<{
                name: string;
                duration: string;
                price: string;
                includes: string[];
            }>;
        }>;
    }>;
}

export interface VehicleFleetSectionForm {
    eyebrow: string;
    headline: string;
    vehicles: Array<{
        name: string;
        capacity: string;
        dimensions: string;
        image?: ImageField;
    }>;
}

export interface ContactTeaserSectionForm {
    eyebrow: string;
    headline: string;
    description: string;
    cta: CTAField;
}

export interface GallerySectionForm {
    groupKey: string;
    headline: string;
    layout: 'grid' | 'carousel' | 'masonry';
}

export interface TestimonialsSectionForm {
    eyebrow: string;
    headline: string;
    testimonials: Array<{
        quote: string;
        author: string;
        role: string;
        company: string;
        image?: ImageField;
    }>;
}

export interface InsightsListSectionForm {
    eyebrow: string;
    headline: string;
    viewAllHref: string;
    items: Array<{
        title: string;
        excerpt: string;
        date: string;
        image?: ImageField;
        href: string;
    }>;
}

export interface LogoGridSectionForm {
    eyebrow: string;
    headline: string;
    logos: Array<{
        name: string;
        logo: ImageField; // Form uses ImageField for picker
        href: string;
    }>;
}

// ABOUT PAGE SECTIONS

export interface IntroSectionForm {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    text: string;
}

export interface StorySectionForm {
    title: string;
    paragraphs: string[];
}

export interface MilestonesSectionForm {
    milestones: Array<{
        year: string;
        event: string;
    }>;
}

export interface ValuesSectionForm {
    title: string;
    subtitle: string;
    values: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
}

export interface TeamSectionForm {
    title: string;
    subtitle: string;
    members: Array<{
        name: string;
        role: string;
        bio: string;
        image?: ImageField;
    }>;
}

export interface CTASectionForm {
    headline: string;
    description: string;
    primaryButton: CTAField;
    secondaryButton?: CTAField;
}

// SERVICES PAGE SECTIONS

export interface ServiceDetailSectionForm {
    serviceId: string;
    title: string;
    description: string;
    features: string[];
    image?: ImageField;
    ctaText?: string;
    ctaHref?: string;
    details?: Array<{
        title: string;
        description: string;
        tags?: string[];
    }>;
}

export interface ProcessSectionForm {
    title: string;
    subtitle: string;
    steps: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
}

// CONTACT PAGE SECTIONS

export interface ContactFormSectionForm {
    eyebrow: string;
    headline: string;
    description: string;
    showForm: boolean;
    showMap: boolean;
}

// ============================================
// Section Type Definitions per Page
// ============================================

export const HOME_SECTIONS = [
    'hero',
    'whoWeAre',
    'whyUs',
    'services',
    'programs',
    'tourPackages',
    'wellnessPackages',
    'vehicleFleet',
    'testimonials',
    'insightsList',
    'logoGrid',
    'contactTeaser',
] as const;

export const ABOUT_SECTIONS = [
    'intro',
    'story',
    'milestones',
    'values',
    'team',
    'cta',
] as const;

export const SERVICES_SECTIONS = [
    'intro',
    'serviceDetail',
    'process',
    'cta',
] as const;

export const CONTACT_SECTIONS = [
    'contactForm',
] as const;

export const HEALTH_TOURISM_SECTIONS = [
    'intro',
    'packages',
    'gallery',
    'contactTeaser',
] as const;

export const PHARMA_MARKETING_SECTIONS = [
    'intro',
    'services', // Reuse services block structure
    'process',
    'cta',
] as const;

export const TOURISM_SECTIONS = [
    'intro',
    'packages',
    'gallery',
    'contactTeaser',
] as const;

export type HomeSectionType = typeof HOME_SECTIONS[number];
export type AboutSectionType = typeof ABOUT_SECTIONS[number];
export type ServicesSectionType = typeof SERVICES_SECTIONS[number];
export type ContactSectionType = typeof CONTACT_SECTIONS[number];
export type HealthTourismSectionType = typeof HEALTH_TOURISM_SECTIONS[number];
export type PharmaMarketingSectionType = typeof PHARMA_MARKETING_SECTIONS[number];
export type TourismSectionType = typeof TOURISM_SECTIONS[number];

// ============================================
// Adapter Functions: Blocks -> Form Models
// ============================================

export function blocksToHeroForm(blocks: ContentBlock[]): HeroSectionForm | null {
    const heroBlock = blocks.find(b => b.type === 'hero');
    if (!heroBlock || heroBlock.type !== 'hero') return null;

    return {
        tagline: heroBlock.tagline || '',
        subtagline: heroBlock.subtagline || '',
        ctaPrimary: heroBlock.ctaPrimary || { text: '', href: '' },
        ctaSecondary: heroBlock.ctaSecondary || { text: '', href: '' },
        quickLinks: heroBlock.quickLinks || [],
    };
}

export function blocksToWhoWeAreForm(blocks: ContentBlock[]): WhoWeAreSectionForm | null {
    const aboutBlock = blocks.find(b => b.type === 'about');
    if (!aboutBlock || aboutBlock.type !== 'about') return null;

    return {
        eyebrow: aboutBlock.eyebrow || '',
        headline: aboutBlock.headline || '',
        headlineAccent: aboutBlock.headlineAccent || '',
        mission: aboutBlock.mission || '',
        pillars: aboutBlock.pillars || [],
    };
}

export function blocksToServicesForm(blocks: ContentBlock[]): ServicesSectionForm | null {
    const servicesBlock = blocks.find(b => b.type === 'services');
    if (!servicesBlock || servicesBlock.type !== 'services') return null;

    return {
        eyebrow: servicesBlock.eyebrow || '',
        headline: servicesBlock.headline || '',
        services: servicesBlock.services.map(s => ({
            title: s.title,
            description: s.description,
            features: s.features || [],
            cta: s.cta,
        })),
    };
}

export function blocksToContactTeaserForm(blocks: ContentBlock[]): ContactTeaserSectionForm | null {
    const contactBlock = blocks.find(b => b.type === 'contact');
    if (!contactBlock || contactBlock.type !== 'contact') return null;

    return {
        eyebrow: contactBlock.eyebrow || '',
        headline: contactBlock.headline || '',
        description: contactBlock.description || '',
        cta: { text: 'Contact Us', href: '/contact' },
    };
}

export function blocksToIntroForm(blocks: ContentBlock[]): IntroSectionForm | null {
    const introBlock = blocks.find(b => b.type === 'intro');
    if (!introBlock || introBlock.type !== 'intro') return null;

    return {
        eyebrow: introBlock.eyebrow || '',
        headline: introBlock.headline || '',
        headlineAccent: introBlock.headlineAccent || '',
        text: introBlock.text || '',
    };
}

export function blocksToStoryForm(blocks: ContentBlock[]): StorySectionForm | null {
    const storyBlock = blocks.find(b => b.type === 'story');
    if (!storyBlock || storyBlock.type !== 'story') return null;

    return {
        title: storyBlock.title || '',
        paragraphs: storyBlock.paragraphs || [],
    };
}

export function blocksToMilestonesForm(blocks: ContentBlock[]): MilestonesSectionForm | null {
    const milestonesBlock = blocks.find(b => b.type === 'milestones');
    if (!milestonesBlock || milestonesBlock.type !== 'milestones') return null;

    return {
        milestones: milestonesBlock.milestones || [],
    };
}

export function blocksToValuesForm(blocks: ContentBlock[]): ValuesSectionForm | null {
    const valuesBlock = blocks.find(b => b.type === 'values');
    if (!valuesBlock || valuesBlock.type !== 'values') return null;

    return {
        title: valuesBlock.title || '',
        subtitle: valuesBlock.subtitle || '',
        values: valuesBlock.values || [],
    };
}

export function blocksToTeamForm(blocks: ContentBlock[]): TeamSectionForm | null {
    const teamBlock = blocks.find(b => b.type === 'team');
    if (!teamBlock || teamBlock.type !== 'team') return null;

    return {
        title: teamBlock.title || '',
        subtitle: teamBlock.subtitle || '',
        members: teamBlock.members.map(m => ({
            name: m.name,
            role: m.role,
            bio: m.bio || '',
            image: m.image ? { url: m.image, alt: m.name } : undefined,
        })),
    };
}

export function blocksToCTAForm(blocks: ContentBlock[]): CTASectionForm | null {
    const ctaBlock = blocks.find(b => b.type === 'cta');
    if (!ctaBlock || ctaBlock.type !== 'cta') return null;

    return {
        headline: ctaBlock.headline || '',
        description: ctaBlock.description || '',
        primaryButton: ctaBlock.primaryButton || { text: '', href: '' },
        secondaryButton: ctaBlock.secondaryButton,
    };
}

// Adapters for new Blocks

export function blocksToGalleryForm(blocks: ContentBlock[]): GallerySectionForm | null {
    const block = blocks.find(b => b.type === 'gallery');
    if (!block || block.type !== 'gallery') return null;

    return {
        groupKey: block.groupKey,
        headline: block.headline || '',
        layout: block.layout || 'grid',
    };
}

export function blocksToPackagesForm(blocks: ContentBlock[]): TourPackagesSectionForm | null {
    const block = blocks.find(b => b.type === 'packages');
    if (!block || block.type !== 'packages') return null;

    return {
        eyebrow: block.eyebrow || '',
        headline: block.headline,
        packages: block.packages.map(p => ({
            title: p.title,
            duration: p.duration,
            price: p.price,
            description: '', // Schema doesn't have description on card level
            includes: p.includes,
            itinerary: p.itinerary || [],
        })),
    };
}

export function blocksToContactFormForm(blocks: ContentBlock[]): ContactFormSectionForm | null {
    const contactBlock = blocks.find(b => b.type === 'contact');
    if (!contactBlock || contactBlock.type !== 'contact') return null;

    return {
        eyebrow: contactBlock.eyebrow || '',
        headline: contactBlock.headline || '',
        description: contactBlock.description || '',
        showForm: contactBlock.showForm ?? true,
        showMap: contactBlock.showMap ?? true,
    };
}

export function blocksToTestimonialsForm(blocks: ContentBlock[]): TestimonialsSectionForm | null {
    const block = blocks.find(b => b.type === 'testimonials');
    if (!block || block.type !== 'testimonials') return null;

    return {
        eyebrow: block.eyebrow || '',
        headline: block.headline,
        testimonials: block.testimonials.map(t => ({
            quote: t.quote,
            author: t.author,
            role: t.role || '',
            company: t.company || '',
            image: t.image ? { url: t.image, alt: t.author } : undefined,
        })),
    };
}

export function blocksToInsightsListForm(blocks: ContentBlock[]): InsightsListSectionForm | null {
    const block = blocks.find(b => b.type === 'insightsList');
    if (!block || block.type !== 'insightsList') return null;

    return {
        eyebrow: block.eyebrow || '',
        headline: block.headline,
        viewAllHref: block.viewAllHref || '',
        items: block.items.map(i => ({
            title: i.title,
            excerpt: i.excerpt,
            date: i.date || '',
            image: i.image ? { url: i.image, alt: i.title } : undefined,
            href: i.href || '',
        })),
    };
}

export function blocksToLogoGridForm(blocks: ContentBlock[]): LogoGridSectionForm | null {
    const block = blocks.find(b => b.type === 'logoGrid');
    if (!block || block.type !== 'logoGrid') return null;

    return {
        eyebrow: block.eyebrow || '',
        headline: block.headline || '',
        logos: block.logos.map(l => ({
            name: l.name,
            logo: { url: l.logo, alt: l.name },
            href: l.href || '',
        })),
    };
}

// ============================================
// Adapter Functions: Form Models -> Blocks
// ============================================

export function heroFormToBlock(form: HeroSectionForm): ContentBlock {
    return {
        type: 'hero',
        tagline: form.tagline,
        subtagline: form.subtagline,
        ctaPrimary: form.ctaPrimary,
        ctaSecondary: form.ctaSecondary,
        quickLinks: form.quickLinks,
    };
}

export function whoWeAreFormToBlock(form: WhoWeAreSectionForm): ContentBlock {
    return {
        type: 'about',
        eyebrow: form.eyebrow,
        headline: form.headline,
        headlineAccent: form.headlineAccent,
        mission: form.mission,
        pillars: form.pillars,
    };
}

export function servicesFormToBlock(form: ServicesSectionForm): ContentBlock {
    return {
        type: 'services',
        eyebrow: form.eyebrow,
        headline: form.headline,
        services: form.services.map(s => ({
            title: s.title,
            description: s.description,
            features: s.features,
            cta: s.cta,
        })),
    };
}

export function contactTeaserFormToBlock(form: ContactTeaserSectionForm): ContentBlock {
    return {
        type: 'contact',
        eyebrow: form.eyebrow,
        headline: form.headline,
        description: form.description,
        showForm: true,
        showMap: true,
    };
}

export function introFormToBlock(form: IntroSectionForm): ContentBlock {
    return {
        type: 'intro',
        eyebrow: form.eyebrow,
        headline: form.headline,
        headlineAccent: form.headlineAccent,
        text: form.text,
    };
}

export function storyFormToBlock(form: StorySectionForm): ContentBlock {
    return {
        type: 'story',
        title: form.title,
        paragraphs: form.paragraphs,
    };
}

export function milestonesFormToBlock(form: MilestonesSectionForm): ContentBlock {
    return {
        type: 'milestones',
        milestones: form.milestones,
    };
}

export function valuesFormToBlock(form: ValuesSectionForm): ContentBlock {
    return {
        type: 'values',
        title: form.title,
        subtitle: form.subtitle,
        values: form.values,
    };
}

export function teamFormToBlock(form: TeamSectionForm): ContentBlock {
    return {
        type: 'team',
        title: form.title,
        subtitle: form.subtitle,
        members: form.members.map(m => ({
            name: m.name,
            role: m.role,
            bio: m.bio,
            image: m.image?.url,
        })),
    };
}

export function ctaFormToBlock(form: CTASectionForm): ContentBlock {
    return {
        type: 'cta',
        headline: form.headline,
        description: form.description,
        primaryButton: form.primaryButton,
        secondaryButton: form.secondaryButton,
    };
}

export function galleryFormToBlock(form: GallerySectionForm): ContentBlock {
    return {
        type: 'gallery',
        groupKey: form.groupKey,
        headline: form.headline,
        layout: form.layout,
    };
}

export function packagesFormToBlock(form: TourPackagesSectionForm): ContentBlock {
    return {
        type: 'packages',
        eyebrow: form.eyebrow,
        headline: form.headline,
        packages: form.packages.map(p => ({
            title: p.title,
            duration: p.duration,
            price: p.price,
            includes: p.includes,
            itinerary: p.itinerary,
        })),
    };
}

export function contactFormFormToBlock(form: ContactFormSectionForm): ContentBlock {
    return {
        type: 'contact',
        eyebrow: form.eyebrow,
        headline: form.headline,
        description: form.description,
        showForm: form.showForm,
        showMap: form.showMap,
    };
}

export function testimonialsFormToBlock(form: TestimonialsSectionForm): ContentBlock {
    return {
        type: 'testimonials',
        eyebrow: form.eyebrow,
        headline: form.headline,
        testimonials: form.testimonials.map(t => ({
            quote: t.quote,
            author: t.author,
            role: t.role,
            company: t.company,
            image: t.image?.url,
        })),
    };
}

export function insightsListFormToBlock(form: InsightsListSectionForm): ContentBlock {
    return {
        type: 'insightsList',
        eyebrow: form.eyebrow,
        headline: form.headline,
        viewAllHref: form.viewAllHref,
        items: form.items.map(i => ({
            title: i.title,
            excerpt: i.excerpt,
            date: i.date,
            image: i.image?.url,
            href: i.href,
        })),
    };
}

export function logoGridFormToBlock(form: LogoGridSectionForm): ContentBlock {
    return {
        type: 'logoGrid',
        eyebrow: form.eyebrow,
        headline: form.headline,
        logos: form.logos.map(l => ({
            name: l.name,
            logo: l.logo?.url || '',
            href: l.href,
        })),
    };
}

// ============================================
// Page-level Adapters
// ============================================

export interface PageSections {
    [key: string]: any;
}

export function blocksToPageSections(pageSlug: string, blocks: ContentBlock[]): PageSections {
    switch (pageSlug) {
        case 'home':
            return {
                hero: blocksToHeroForm(blocks),
                whoWeAre: blocksToWhoWeAreForm(blocks),
                services: blocksToServicesForm(blocks),
                testimonials: blocksToTestimonialsForm(blocks),
                insightsList: blocksToInsightsListForm(blocks),
                logoGrid: blocksToLogoGridForm(blocks),
                contactTeaser: blocksToContactTeaserForm(blocks),
            };
        case 'about':
            return {
                intro: blocksToIntroForm(blocks),
                story: blocksToStoryForm(blocks),
                milestones: blocksToMilestonesForm(blocks),
                values: blocksToValuesForm(blocks),
                team: blocksToTeamForm(blocks),
                cta: blocksToCTAForm(blocks),
            };
        case 'services':
            return {
                intro: blocksToIntroForm(blocks),
                cta: blocksToCTAForm(blocks),
            };
        case 'contact':
            return {
                contactForm: blocksToContactFormForm(blocks),
            };
        case 'health-tourism':
            return {
                intro: blocksToIntroForm(blocks),
                packages: blocksToPackagesForm(blocks),
                gallery: blocksToGalleryForm(blocks),
                contactTeaser: blocksToContactTeaserForm(blocks),
            };
        case 'pharma-marketing':
            return {
                intro: blocksToIntroForm(blocks),
                services: blocksToServicesForm(blocks),
                process: blocksToPageSections('services', blocks).process, // Reuse process adapter logic via services page? 
                // Ah, 'process' is used in services page. I need blocksToProcessForm.
                // It is missing in exports? I'll check exports.
                cta: blocksToCTAForm(blocks),
            };
        case 'tourism':
            return {
                intro: blocksToIntroForm(blocks),
                packages: blocksToPackagesForm(blocks),
                gallery: blocksToGalleryForm(blocks),
                contactTeaser: blocksToContactTeaserForm(blocks),
            };
        default:
            return {};
    }
}

export function pageSectionsToBlocks(pageSlug: string, sections: PageSections): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    switch (pageSlug) {
        case 'home':
            if (sections.hero) blocks.push(heroFormToBlock(sections.hero));
            if (sections.whoWeAre) blocks.push(whoWeAreFormToBlock(sections.whoWeAre));
            if (sections.services) blocks.push(servicesFormToBlock(sections.services));
            if (sections.testimonials) blocks.push(testimonialsFormToBlock(sections.testimonials));
            if (sections.insightsList) blocks.push(insightsListFormToBlock(sections.insightsList));
            if (sections.logoGrid) blocks.push(logoGridFormToBlock(sections.logoGrid));
            if (sections.contactTeaser) blocks.push(contactTeaserFormToBlock(sections.contactTeaser));
            break;
        case 'about':
            if (sections.intro) blocks.push(introFormToBlock(sections.intro));
            if (sections.story) blocks.push(storyFormToBlock(sections.story));
            if (sections.milestones) blocks.push(milestonesFormToBlock(sections.milestones));
            if (sections.values) blocks.push(valuesFormToBlock(sections.values));
            if (sections.team) blocks.push(teamFormToBlock(sections.team));
            if (sections.cta) blocks.push(ctaFormToBlock(sections.cta));
            break;
        case 'services':
            if (sections.intro) blocks.push(introFormToBlock(sections.intro));
            if (sections.cta) blocks.push(ctaFormToBlock(sections.cta));
            break;
        case 'contact':
            if (sections.contactForm) blocks.push(contactFormFormToBlock(sections.contactForm));
            break;
        case 'health-tourism':
            if (sections.intro) blocks.push(introFormToBlock(sections.intro));
            if (sections.packages) blocks.push(packagesFormToBlock(sections.packages));
            if (sections.gallery) blocks.push(galleryFormToBlock(sections.gallery));
            if (sections.contactTeaser) blocks.push(contactTeaserFormToBlock(sections.contactTeaser));
            break;
        case 'pharma-marketing':
            if (sections.intro) blocks.push(introFormToBlock(sections.intro));
            if (sections.services) blocks.push(servicesFormToBlock(sections.services));
            // process adapter missing for implementation... assume generic
            if (sections.cta) blocks.push(ctaFormToBlock(sections.cta));
            break;
        case 'tourism':
            if (sections.intro) blocks.push(introFormToBlock(sections.intro));
            if (sections.packages) blocks.push(packagesFormToBlock(sections.packages));
            if (sections.gallery) blocks.push(galleryFormToBlock(sections.gallery));
            if (sections.contactTeaser) blocks.push(contactTeaserFormToBlock(sections.contactTeaser));
            break;
    }

    return blocks;
}

// ============================================
// Section Metadata (for UI)
// ============================================

export interface SectionMeta {
    id: string;
    label: string;
    description: string;
    icon: string;
}

export const HOME_SECTION_META: Record<HomeSectionType, SectionMeta> = {
    hero: {
        id: 'hero',
        label: 'Hero Section',
        description: 'Main banner with headline, subheadline, and call-to-action buttons',
        icon: '🎯',
    },
    whoWeAre: {
        id: 'whoWeAre',
        label: 'Who We Are',
        description: 'Company introduction with mission statement and value pillars',
        icon: '🏢',
    },
    whyUs: {
        id: 'whyUs',
        label: 'Why Choose Us',
        description: '4 key value propositions that differentiate your company',
        icon: '⭐',
    },
    services: {
        id: 'services',
        label: 'Our Services',
        description: 'List of services with features and descriptions',
        icon: '🔧',
    },
    programs: {
        id: 'programs',
        label: 'Programs',
        description: 'Tour programs and packages overview',
        icon: '📋',
    },
    tourPackages: {
        id: 'tourPackages',
        label: 'Tour Packages',
        description: 'Detailed Azerbaijan tour packages with itineraries and pricing',
        icon: '🗺️',
    },
    wellnessPackages: {
        id: 'wellnessPackages',
        label: 'Wellness Packages',
        description: 'Wellness and health tourism packages by region',
        icon: '🌿',
    },
    vehicleFleet: {
        id: 'vehicleFleet',
        label: 'Vehicle Fleet',
        description: 'Available vehicles for transportation services',
        icon: '🚐',
    },
    testimonials: {
        id: 'testimonials',
        label: 'Testimonials',
        description: 'Customer reviews and feedback carousel',
        icon: '💬', // Reusing chat icon
    },
    insightsList: {
        id: 'insightsList',
        label: 'Insights List',
        description: 'Latest news and articles list',
        icon: '📰',
    },
    logoGrid: {
        id: 'logoGrid',
        label: 'Logo Grid',
        description: 'Grid of partner or client logos',
        icon: '🧊',
    },
    contactTeaser: {
        id: 'contactTeaser',
        label: 'Contact Teaser',
        description: 'Call-to-action section linking to contact page',
        icon: '📞',
    },
};

export const ABOUT_SECTION_META: Record<AboutSectionType, SectionMeta> = {
    intro: {
        id: 'intro',
        label: 'Introduction',
        description: 'Page header with headline and intro text',
        icon: '📄',
    },
    story: {
        id: 'story',
        label: 'Our Story',
        description: 'Company history and background narrative',
        icon: '📖',
    },
    milestones: {
        id: 'milestones',
        label: 'Milestones',
        description: 'Key achievements and timeline',
        icon: '🏆',
    },
    values: {
        id: 'values',
        label: 'Our Values',
        description: 'Core principles and values',
        icon: '💎',
    },
    team: {
        id: 'team',
        label: 'Team',
        description: 'Leadership team members',
        icon: '👥',
    },
    cta: {
        id: 'cta',
        label: 'Call to Action',
        description: 'Final conversion section',
        icon: '🎯',
    },
};

export const SERVICES_SECTION_META: Record<ServicesSectionType, SectionMeta> = {
    intro: {
        id: 'intro',
        label: 'Introduction',
        description: 'Page header',
        icon: '📄',
    },
    serviceDetail: {
        id: 'serviceDetail',
        label: 'Service Details',
        description: 'Detailed service information',
        icon: '📋',
    },
    process: {
        id: 'process',
        label: 'Process',
        description: 'Step-by-step process',
        icon: '🔄',
    },
    cta: {
        id: 'cta',
        label: 'Call to Action',
        description: 'Conversion section',
        icon: '🎯',
    },
};

export const CONTACT_SECTION_META: Record<ContactSectionType, SectionMeta> = {
    contactForm: {
        id: 'contactForm',
        label: 'Contact Form',
        description: 'Contact form and map',
        icon: '📧',
    },
};

export const HEALTH_TOURISM_SECTION_META: Record<HealthTourismSectionType, SectionMeta> = {
    intro: SERVICES_SECTION_META.intro,
    packages: HOME_SECTION_META.tourPackages, // Reuse meta
    gallery: { id: 'gallery', label: 'Gallery', description: 'Image gallery (Grid/Carousel)', icon: '🖼️' },
    contactTeaser: HOME_SECTION_META.contactTeaser,
};

export const PHARMA_MARKETING_SECTION_META: Record<PharmaMarketingSectionType, SectionMeta> = {
    intro: SERVICES_SECTION_META.intro,
    services: SERVICES_SECTION_META.serviceDetail, // Use serviceDetail logic? Or generic services?
    // Using generic 'services' from HOME might be better structure-wise
    process: SERVICES_SECTION_META.process,
    cta: SERVICES_SECTION_META.cta,
};

export const TOURISM_SECTION_META: Record<TourismSectionType, SectionMeta> = {
    intro: SERVICES_SECTION_META.intro,
    packages: HOME_SECTION_META.tourPackages,
    gallery: { id: 'gallery', label: 'Gallery', description: 'Image gallery', icon: '🖼️' },
    contactTeaser: HOME_SECTION_META.contactTeaser,
};

export function getSectionMetaForPage(pageSlug: string): SectionMeta[] {
    switch (pageSlug) {
        case 'home':
            return HOME_SECTIONS.map(s => HOME_SECTION_META[s]);
        case 'about':
            return ABOUT_SECTIONS.map(s => ABOUT_SECTION_META[s]);
        case 'services':
            return SERVICES_SECTIONS.map(s => SERVICES_SECTION_META[s]);
        case 'contact':
            return CONTACT_SECTIONS.map(s => CONTACT_SECTION_META[s]);
        case 'health-tourism':
            return HEALTH_TOURISM_SECTIONS.map(s => HEALTH_TOURISM_SECTION_META[s]);
        case 'pharma-marketing':
            return PHARMA_MARKETING_SECTIONS.map(s => PHARMA_MARKETING_SECTION_META[s]);
        case 'tourism':
            return TOURISM_SECTIONS.map(s => TOURISM_SECTION_META[s]);
        default:
            return [];
    }
}
