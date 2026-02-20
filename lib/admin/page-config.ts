/**
 * Admin Page Configuration
 * ========================
 *
 * Config-driven admin: defines which pages exist, which sections each page has,
 * and what fields each section supports. This is the SINGLE SOURCE OF TRUTH
 * for admin UI rendering AND server-side validation.
 *
 * RULES:
 * - Admin CANNOT add/delete/reorder pages or sections
 * - Admin CAN edit section content + toggle visibility (isHidden)
 * - All sections are predefined here
 */

// ============================================
// Field Types for Section Editor
// ============================================

export type FieldType =
    | 'text'
    | 'textarea'
    | 'richtext'
    | 'url'
    | 'image'
    | 'boolean'
    | 'select'
    | 'number'
    | 'array';

export interface FieldSchema {
    key: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    hint?: string;
    maxLength?: number;
    options?: { label: string; value: string }[];
    /** For array fields — sub-field definitions */
    itemFields?: FieldSchema[];
    /** For array fields — max items */
    maxItems?: number;
}

// ============================================
// Section Config
// ============================================

export interface SectionConfig {
    sectionId: string;
    /** The block.type value in DB JSON */
    blockType: string;
    label: string;
    description: string;
    icon: string;
    /** Can this section be hidden by admin? */
    canHide: boolean;
    /** Field definitions for the editor form */
    fields: FieldSchema[];
}

// ============================================
// Page Config
// ============================================

export interface PageConfig {
    slug: string;
    label: string;
    description: string;
    route: string;
    sections: SectionConfig[];
}

// ============================================
// Section Definitions (reusable across pages)
// ============================================

const heroSection: SectionConfig = {
    sectionId: 'hero',
    blockType: 'hero',
    label: 'Hero Banner',
    description: 'Main hero section with headline, subtext, and call-to-action buttons.',
    icon: 'layout',
    canHide: false,
    fields: [
        { key: 'tagline', label: 'Main Headline', type: 'text', required: true, maxLength: 100, hint: 'The primary headline visitors see first.' },
        { key: 'subtagline', label: 'Subtitle', type: 'textarea', maxLength: 200, hint: 'Supporting text below the headline.' },
        {
            key: 'ctaPrimary', label: 'Primary Button', type: 'array', maxItems: 1, itemFields: [
                { key: 'text', label: 'Button Text', type: 'text', required: true },
                { key: 'href', label: 'Button Link', type: 'url', required: true },
            ]
        },
        {
            key: 'ctaSecondary', label: 'Secondary Button', type: 'array', maxItems: 1, itemFields: [
                { key: 'text', label: 'Button Text', type: 'text', required: true },
                { key: 'href', label: 'Button Link', type: 'url', required: true },
            ]
        },
    ],
};

const aboutSection: SectionConfig = {
    sectionId: 'about',
    blockType: 'about',
    label: 'About / Who We Are',
    description: 'Company overview with mission and core pillars.',
    icon: 'info',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50, hint: 'Small text above headline (e.g. "About Us").' },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'headlineAccent', label: 'Headline Accent', type: 'text', hint: 'Highlighted word in the headline.' },
        { key: 'mission', label: 'Mission Statement', type: 'textarea', required: true },
        {
            key: 'pillars', label: 'Core Pillars', type: 'array', maxItems: 4, itemFields: [
                { key: 'title', label: 'Pillar Title', type: 'text', required: true },
                { key: 'description', label: 'Pillar Description', type: 'textarea', required: true },
                { key: 'icon', label: 'Icon Name', type: 'text' },
            ]
        },
    ],
};

const servicesSection: SectionConfig = {
    sectionId: 'services',
    blockType: 'services',
    label: 'Services Overview',
    description: 'Core service offerings with descriptions and CTAs.',
    icon: 'briefcase',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        {
            key: 'services', label: 'Services', type: 'array', maxItems: 6, itemFields: [
                { key: 'title', label: 'Service Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                { key: 'features', label: 'Features (one per line)', type: 'textarea' },
            ]
        },
    ],
};

const partnersSection: SectionConfig = {
    sectionId: 'partners',
    blockType: 'partners',
    label: 'Partners Showcase',
    description: 'Partners section with description and CTA.',
    icon: 'handshake',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'ctaText', label: 'CTA Button Text', type: 'text' },
        { key: 'ctaHref', label: 'CTA Button Link', type: 'url' },
    ],
};

const contactSection: SectionConfig = {
    sectionId: 'contact',
    blockType: 'contact',
    label: 'Contact Section',
    description: 'Contact form section with optional map.',
    icon: 'mail',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'showForm', label: 'Show Contact Form', type: 'boolean' },
        { key: 'showMap', label: 'Show Map', type: 'boolean' },
    ],
};

const insightsSection: SectionConfig = {
    sectionId: 'insights',
    blockType: 'insights',
    label: 'Market Insights',
    description: 'Stats and market data section.',
    icon: 'chart',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'subheadline', label: 'Subheadline', type: 'text' },
        {
            key: 'stats', label: 'Statistics', type: 'array', maxItems: 6, itemFields: [
                { key: 'label', label: 'Label', type: 'text', required: true },
                { key: 'value', label: 'Value', type: 'text', required: true },
                { key: 'note', label: 'Note', type: 'text' },
            ]
        },
        { key: 'ctaText', label: 'CTA Text', type: 'text' },
        { key: 'ctaHref', label: 'CTA Link', type: 'url' },
    ],
};

const ctaSection: SectionConfig = {
    sectionId: 'cta',
    blockType: 'cta',
    label: 'Call to Action',
    description: 'Full-width call-to-action banner.',
    icon: 'megaphone',
    canHide: true,
    fields: [
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
            key: 'primaryButton', label: 'Primary Button', type: 'array', maxItems: 1, itemFields: [
                { key: 'text', label: 'Button Text', type: 'text', required: true },
                { key: 'href', label: 'Button Link', type: 'url', required: true },
            ]
        },
        {
            key: 'secondaryButton', label: 'Secondary Button', type: 'array', maxItems: 1, itemFields: [
                { key: 'text', label: 'Button Text', type: 'text', required: true },
                { key: 'href', label: 'Button Link', type: 'url', required: true },
            ]
        },
    ],
};

const insightsListSection: SectionConfig = {
    sectionId: 'insightsList',
    blockType: 'insightsList',
    label: 'Insights List',
    description: 'Featured insight articles list.',
    icon: 'newspaper',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        {
            key: 'items', label: 'Insight Articles', type: 'array', maxItems: 6, itemFields: [
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
                { key: 'date', label: 'Date', type: 'text' },
                { key: 'image', label: 'Article Image', type: 'image' },
                { key: 'href', label: 'Link', type: 'url' },
            ]
        },
        { key: 'viewAllHref', label: 'View All Link', type: 'url' },
    ],
};

const testimonialsSection: SectionConfig = {
    sectionId: 'testimonials',
    blockType: 'testimonials',
    label: 'Testimonials',
    description: 'Client testimonials and reviews.',
    icon: 'quote',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        {
            key: 'testimonials', label: 'Testimonials', type: 'array', maxItems: 9, itemFields: [
                { key: 'quote', label: 'Quote', type: 'textarea', required: true },
                { key: 'author', label: 'Author Name', type: 'text', required: true },
                { key: 'role', label: 'Role / Title', type: 'text' },
                { key: 'company', label: 'Company', type: 'text' },
                { key: 'image', label: 'Author Photo', type: 'image' },
            ]
        },
    ],
};

const logoGridSection: SectionConfig = {
    sectionId: 'logoGrid',
    blockType: 'logoGrid',
    label: 'Logo Grid',
    description: 'Partner/client logo display grid.',
    icon: 'grid',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text' },
        {
            key: 'logos', label: 'Logos', type: 'array', maxItems: 12, itemFields: [
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'logo', label: 'Logo Image', type: 'image', required: true },
                { key: 'href', label: 'Link', type: 'url' },
            ]
        },
    ],
};

const introSection: SectionConfig = {
    sectionId: 'intro',
    blockType: 'intro',
    label: 'Page Intro',
    description: 'Header section with eyebrow, headline, and introductory text.',
    icon: 'type',
    canHide: false,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'headlineAccent', label: 'Headline Accent', type: 'text' },
        { key: 'text', label: 'Introductory Text', type: 'textarea' },
        { key: 'image', label: 'Background Image', type: 'image', hint: 'Optional background or accent image for the hero area.' },
        { key: 'imageAlt', label: 'Image Alt Text', type: 'text', hint: 'Describe the image for accessibility.' },
    ],
};

const storylineSection: SectionConfig = {
    sectionId: 'storyline',
    blockType: 'storyline',
    label: 'Journey / Timeline',
    description: 'Narrative timeline showing company milestones.',
    icon: 'clock',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'title', label: 'Section Title', type: 'text', required: true },
        { key: 'text', label: 'Section Description', type: 'textarea' },
        {
            key: 'beats', label: 'Timeline Entries', type: 'array', maxItems: 8, itemFields: [
                { key: 'id', label: 'ID', type: 'text', required: true },
                { key: 'kicker', label: 'Kicker', type: 'text' },
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                { key: 'year', label: 'Year', type: 'text' },
            ]
        },
    ],
};

const valuesSection: SectionConfig = {
    sectionId: 'values',
    blockType: 'values',
    label: 'Company Values',
    description: 'Core values with icons and descriptions.',
    icon: 'star',
    canHide: true,
    fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
            key: 'values', label: 'Values', type: 'array', maxItems: 6, itemFields: [
                { key: 'title', label: 'Value Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                { key: 'icon', label: 'Icon Name', type: 'text' },
            ]
        },
    ],
};

const teamSection: SectionConfig = {
    sectionId: 'team',
    blockType: 'team',
    label: 'Team Members',
    description: 'Team section with member profiles.',
    icon: 'users',
    canHide: true,
    fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
            key: 'members', label: 'Team Members', type: 'array', maxItems: 12, itemFields: [
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'role', label: 'Role', type: 'text', required: true },
                { key: 'bio', label: 'Bio', type: 'textarea' },
                { key: 'image', label: 'Photo URL', type: 'image' },
            ]
        },
    ],
};

const whyUsSection: SectionConfig = {
    sectionId: 'whyUs',
    blockType: 'whyUs',
    label: 'Why Choose Us',
    description: 'Value proposition cards showing why clients should choose us.',
    icon: 'award',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
            key: 'items', label: 'Value Points', type: 'array', maxItems: 5, itemFields: [
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                { key: 'icon', label: 'Icon Name', type: 'text' },
            ]
        },
    ],
};

const howItWorksSection: SectionConfig = {
    sectionId: 'howItWorks',
    blockType: 'howItWorks',
    label: 'How It Works',
    description: 'Step-by-step process guide.',
    icon: 'list',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
            key: 'steps', label: 'Steps', type: 'array', maxItems: 5, itemFields: [
                { key: 'title', label: 'Step Title', type: 'text', required: true },
                { key: 'description', label: 'Step Description', type: 'textarea', required: true },
                { key: 'icon', label: 'Icon Name', type: 'text' },
            ]
        },
    ],
};

const interactiveServicesSection: SectionConfig = {
    sectionId: 'interactiveServices',
    blockType: 'interactiveServices',
    label: 'Service Details (Tabs)',
    description: 'Interactive service showcase with tabbed navigation.',
    icon: 'layers',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
            key: 'services', label: 'Services', type: 'array', maxItems: 6, itemFields: [
                { key: 'id', label: 'ID', type: 'text', required: true },
                { key: 'title', label: 'Full Title', type: 'text', required: true },
                { key: 'shortTitle', label: 'Short Title (tab)', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                { key: 'features', label: 'Features (one per line)', type: 'textarea' },
                { key: 'icon', label: 'Icon Name', type: 'text' },
            ]
        },
        { key: 'ctaText', label: 'CTA Text', type: 'text' },
        { key: 'ctaHref', label: 'CTA Link', type: 'url' },
    ],
};

const faqSection: SectionConfig = {
    sectionId: 'faq',
    blockType: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions section.',
    icon: 'help',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
            key: 'items', label: 'FAQ Items', type: 'array', maxItems: 20, itemFields: [
                { key: 'question', label: 'Question', type: 'text', required: true },
                { key: 'answer', label: 'Answer', type: 'textarea', required: true },
            ]
        },
    ],
};

const statsRowSection: SectionConfig = {
    sectionId: 'statsRow',
    blockType: 'statsRow',
    label: 'Statistics Strip',
    description: 'Row of key statistics/metrics.',
    icon: 'chart',
    canHide: true,
    fields: [
        {
            key: 'stats', label: 'Statistics', type: 'array', maxItems: 6, itemFields: [
                { key: 'value', label: 'Value', type: 'text', required: true },
                { key: 'label', label: 'Label', type: 'text', required: true },
            ]
        },
    ],
};

const partnersEmptySection: SectionConfig = {
    sectionId: 'partnersEmpty',
    blockType: 'partnersEmpty',
    label: 'Partnership CTA',
    description: 'Call-to-action for potential partners to join.',
    icon: 'handshake',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'ctaText', label: 'CTA Button Text', type: 'text' },
        { key: 'ctaHref', label: 'CTA Button Link', type: 'url' },
    ],
};

const serviceDetailsSection = (serviceId: string, label: string): SectionConfig => ({
    sectionId: `serviceDetails-${serviceId}`,
    blockType: 'serviceDetails',
    label,
    description: `Detailed feature breakdown for ${label.toLowerCase()}.`,
    icon: 'briefcase',
    canHide: true,
    fields: [
        { key: 'title', label: 'Section Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'features', label: 'Key Features (one per line)', type: 'textarea' },
        { key: 'image', label: 'Section Image', type: 'image', hint: 'Upload an image to display alongside this service section.' },
        { key: 'imageAlt', label: 'Image Alt Text', type: 'text', hint: 'Describe the image for accessibility.' },
        { key: 'ctaText', label: 'CTA Text', type: 'text' },
        { key: 'ctaHref', label: 'CTA Link', type: 'url' },
        {
            key: 'details', label: 'Detail Cards', type: 'array', maxItems: 8, itemFields: [
                { key: 'title', label: 'Card Title', type: 'text', required: true },
                { key: 'description', label: 'Card Description', type: 'textarea', required: true },
                { key: 'tags', label: 'Tags (comma-separated)', type: 'text' },
            ]
        },
    ],
});

const processSection: SectionConfig = {
    sectionId: 'process',
    blockType: 'process',
    label: 'Process Steps',
    description: 'Step-by-step process flow.',
    icon: 'list',
    canHide: true,
    fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        {
            key: 'steps', label: 'Steps', type: 'array', maxItems: 8, itemFields: [
                { key: 'title', label: 'Step Title', type: 'text', required: true },
                { key: 'description', label: 'Step Description', type: 'textarea', required: true },
                { key: 'icon', label: 'Icon Name', type: 'text' },
            ]
        },
    ],
};

const areasSection: SectionConfig = {
    sectionId: 'areas',
    blockType: 'areas',
    label: 'Areas / Destinations',
    description: 'Areas or destinations we cover.',
    icon: 'map',
    canHide: true,
    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', maxLength: 50 },
        { key: 'headline', label: 'Headline', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
            key: 'areas', label: 'Areas', type: 'array', maxItems: 12, itemFields: [
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'image', label: 'Image URL', type: 'image' },
            ]
        },
    ],
};

// ============================================
// Page Definitions
// ============================================

export const PAGE_CONFIGS: PageConfig[] = [
    {
        slug: 'home',
        label: 'Home Page',
        description: 'Main landing page with hero, services overview, and CTAs.',
        route: '/',
        sections: [
            heroSection,
            aboutSection,
            servicesSection,
            insightsSection,
            insightsListSection,
            testimonialsSection,
            logoGridSection,
            contactSection,
        ],
    },
    {
        slug: 'about',
        label: 'About Us',
        description: 'Company story, values, team, and milestones.',
        route: '/about',
        sections: [
            introSection,
            { ...aboutSection, sectionId: 'about-story', label: 'Company Story' },
            storylineSection,
            valuesSection,
            teamSection,
            ctaSection,
        ],
    },
    {
        slug: 'services',
        label: 'Services',
        description: 'Overview of all service offerings.',
        route: '/services',
        sections: [
            introSection,
            interactiveServicesSection,
            whyUsSection,
            howItWorksSection,
            faqSection,
            ctaSection,
        ],
    },
    {
        slug: 'contact',
        label: 'Contact',
        description: 'Contact information and inquiry form.',
        route: '/contact',
        sections: [
            introSection,
            contactSection,
            faqSection,
        ],
    },
    {
        slug: 'partners',
        label: 'Partners',
        description: 'Partner organizations and partnership opportunities.',
        route: '/partners',
        sections: [
            introSection,
            statsRowSection,
            partnersSection,
            partnersEmptySection,
            ctaSection,
        ],
    },
    {
        slug: 'health-tourism',
        label: 'Health Tourism',
        description: 'Medical tourism service details.',
        route: '/services/health-tourism',
        sections: [
            heroSection,
            serviceDetailsSection('health-tourism', 'Health Tourism Details'),
            statsRowSection,
            whyUsSection,
            howItWorksSection,
            areasSection,
            faqSection,
            ctaSection,
        ],
    },
    {
        slug: 'pharma-marketing',
        label: 'Pharma Marketing',
        description: 'Pharmaceutical market entry and regulatory services.',
        route: '/services/pharma-marketing',
        sections: [
            heroSection,
            serviceDetailsSection('pharma-marketing', 'Pharma Services Details'),
            statsRowSection,
            processSection,
            whyUsSection,
            faqSection,
            ctaSection,
        ],
    },
    {
        slug: 'tourism',
        label: 'Tourism',
        description: 'Cultural and wellness tourism packages.',
        route: '/services/tourism',
        sections: [
            heroSection,
            serviceDetailsSection('tourism', 'Tourism Details'),
            areasSection,
            statsRowSection,
            whyUsSection,
            faqSection,
            ctaSection,
        ],
    },
];

// ============================================
// Helper Functions
// ============================================

/** Get config for a specific page */
export function getPageConfig(slug: string): PageConfig | undefined {
    return PAGE_CONFIGS.find((p) => p.slug === slug);
}

/** Get all page slugs (for generating admin routes) */
export function getAdminPageSlugs(): string[] {
    return PAGE_CONFIGS.map((p) => p.slug);
}

/** Get section config for a specific page + section */
export function getSectionConfig(
    pageSlug: string,
    sectionId: string
): SectionConfig | undefined {
    const page = getPageConfig(pageSlug);
    return page?.sections.find((s) => s.sectionId === sectionId);
}

/**
 * Extract section data from blocks array.
 * Maps blocks to configured sections, preserving order from config.
 * Unknown blocks are ignored (locked structure).
 *
 * For fields with maxItems=1 (e.g. CTA buttons), the DB stores them as
 * plain objects but the SectionEditor expects arrays. This function wraps
 * those plain objects into single-element arrays for the editor.
 */
export function blocksToSections(
    pageSlug: string,
    blocks: Record<string, unknown>[]
): Array<{ config: SectionConfig; data: Record<string, unknown>; isHidden: boolean }> {
    const pageConfig = getPageConfig(pageSlug);
    if (!pageConfig) return [];

    // Track how many times each block type has been consumed so duplicate
    // section block types (e.g. multiple "about" sections) map deterministically.
    const blockTypeCursor = new Map<string, number>();

    return pageConfig.sections.map((sectionConfig) => {
        const matches = blocks.filter(
            (b) => b.type === sectionConfig.blockType &&
                // For serviceDetails, match by serviceId too
                (sectionConfig.blockType !== 'serviceDetails' ||
                    (b as Record<string, unknown>).serviceId === sectionConfig.sectionId.replace('serviceDetails-', ''))
        );

        const cursor = blockTypeCursor.get(sectionConfig.blockType) ?? 0;
        const block = matches[cursor];
        blockTypeCursor.set(sectionConfig.blockType, cursor + 1);

        const data: Record<string, unknown> = block ? { ...block } : { type: sectionConfig.blockType };

        // Wrap maxItems=1 plain-object fields into arrays for the editor
        for (const field of sectionConfig.fields) {
            if (field.type === 'image') {
                data[field.key] = normalizeImageValue(data[field.key]);
            }

            if (field.type === 'array' && field.maxItems === 1 && data[field.key] != null) {
                if (!Array.isArray(data[field.key])) {
                    data[field.key] = [data[field.key]];
                }
            }

            if (field.type === 'array' && field.itemFields && Array.isArray(data[field.key])) {
                data[field.key] = (data[field.key] as unknown[]).map((item) => {
                    if (!item || typeof item !== 'object') return item;
                    const normalizedItem = { ...(item as Record<string, unknown>) };
                    for (const subField of field.itemFields ?? []) {
                        if (subField.type === 'image') {
                            normalizedItem[subField.key] = normalizeImageValue(normalizedItem[subField.key]);
                        }
                    }
                    return normalizedItem;
                });
            }
        }

        return {
            config: sectionConfig,
            data,
            isHidden: block ? (block as Record<string, unknown>)._isHidden === true : false,
        };
    });
}

/**
 * Convert sections back to blocks array for DB storage.
 * Preserves section order from config.
 *
 * For fields with maxItems=1 (e.g. CTA buttons), the editor stores them
 * as single-element arrays but the Zod schema expects plain objects.
 * This function unwraps those arrays back to plain objects.
 */
export function sectionsToBlocks(
    sections: Array<{ config: SectionConfig; data: Record<string, unknown>; isHidden: boolean }>
): Record<string, unknown>[] {
    return sections.flatMap(({ config, data, isHidden }) => {
        const processedData: Record<string, unknown> = { ...data };

        for (const field of config.fields) {
            if (field.type === 'image') {
                processedData[field.key] = normalizeImageValue(processedData[field.key]);
            }

            if (field.type === 'array' && field.itemFields && Array.isArray(processedData[field.key])) {
                processedData[field.key] = (processedData[field.key] as unknown[]).map((item) => {
                    if (!item || typeof item !== 'object') return item;
                    const normalizedItem = { ...(item as Record<string, unknown>) };
                    for (const subField of field.itemFields ?? []) {
                        if (subField.type === 'image') {
                            normalizedItem[subField.key] = normalizeImageValue(normalizedItem[subField.key]);
                        }
                    }
                    return normalizedItem;
                });
            }
        }

        // Unwrap maxItems=1 array fields to plain objects for Zod validation
        for (const field of config.fields) {
            if (field.type === 'array' && field.maxItems === 1 && processedData[field.key] != null) {
                const arr = processedData[field.key];
                if (Array.isArray(arr)) {
                    if (arr.length > 0) {
                        // Check if the item has any non-empty values
                        const item = arr[0] as Record<string, unknown>;
                        const hasContent = Object.values(item).some(
                            (v) => v !== '' && v !== null && v !== undefined
                        );
                        if (hasContent) {
                            processedData[field.key] = item;
                        } else {
                            // Empty item — remove the field entirely
                            delete processedData[field.key];
                        }
                    } else {
                        delete processedData[field.key];
                    }
                }
            }
        }

        // Skip completely empty optional sections to avoid generating invalid
        // placeholder blocks that fail strict Zod validation.
        if (config.canHide) {
            const hasContent = config.fields.some((field) => hasMeaningfulValue(processedData[field.key]));
            if (!hasContent) {
                return [];
            }
        }

        return [{
            ...processedData,
            type: config.blockType,
            _isHidden: isHidden || undefined,
        }];
    });
}

function hasMeaningfulValue(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    if (typeof value === 'boolean') return true;

    if (Array.isArray(value)) {
        if (value.length === 0) return false;
        return value.some((item) => hasMeaningfulValue(item));
    }

    if (typeof value === 'object') {
        return Object.values(value as Record<string, unknown>).some((nested) => hasMeaningfulValue(nested));
    }

    return false;
}

function normalizeImageValue(value: unknown): unknown {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return value;

    const imageObject = value as { url?: unknown };
    if (typeof imageObject.url === 'string') {
        return imageObject.url;
    }

    return value;
}

/**
 * Zod validation schema builder based on page config.
 * Used server-side to reject edits outside schema.
 */
export function buildPageValidationSchema(pageSlug: string) {
    const pageConfig = getPageConfig(pageSlug);
    if (!pageConfig) return null;

    // We validate against the existing block schema — this function
    // returns the allowed block types for the page
    return {
        allowedBlockTypes: pageConfig.sections.map((s) => s.blockType),
        requiredBlockTypes: pageConfig.sections
            .filter((s) => !s.canHide)
            .map((s) => s.blockType),
    };
}
