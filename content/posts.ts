export type ContentBlock =
    | { type: 'heading'; level: 2 | 3; text: string }
    | { type: 'paragraph'; text: string }
    | { type: 'quote'; text: string; by?: string }
    | { type: 'bullets'; items: string[] }
    | { type: 'callout'; title: string; text: string }
    | { type: 'stats'; items: { label: string; value: string; note?: string }[] }
    | { type: 'image'; src: string; alt: string; caption?: string }
    | { type: 'divider' };

export type Post = {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: 'Pharma' | 'Market Entry' | 'Health Tourism' | 'Wellness';
    tags: string[];
    author: { name: string; role: string; avatar: string };
    publishedAt: string;
    readingTime: string;
    featured?: boolean;
    content: ContentBlock[];
};

export const posts: Post[] = [
    {
        slug: 'navigating-biosimilar-approvals-in-southeast-asia',
        title: 'Navigating Biosimilar Approvals in Southeast Asia: A Strategic Roadmap',
        excerpt:
            'As patent cliffs approach for major biologics, Southeast Asian markets present unprecedented opportunities for biosimilar manufacturers. Understanding the regulatory nuances across ASEAN nations is critical for successful market entry.',
        coverImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop&q=80',
        category: 'Pharma',
        tags: ['Biosimilars', 'ASEAN', 'Regulatory', 'Market Entry'],
        author: {
            name: 'Dr. Sarah Chen',
            role: 'Director, Regulatory Strategy',
            avatar: '/team/sarah-chen.jpg',
        },
        publishedAt: '2026-01-20T09:00:00Z',
        readingTime: '8 min read',
        featured: true,
        content: [
            {
                type: 'callout',
                title: 'Key Takeaways',
                text: 'Biosimilar approvals in ASEAN require market-specific strategies. Early engagement with local regulatory bodies and strategic partnership selection can reduce time-to-market by up to 40%.',
            },
            {
                type: 'paragraph',
                text: 'The global biosimilars market is projected to reach $74 billion by 2028, with Asia-Pacific emerging as the fastest-growing region. For pharmaceutical companies seeking market expansion, Southeast Asia represents a compelling blend of regulatory accessibility, growing healthcare expenditure, and increasing demand for affordable biologics.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Understanding the ASEAN Regulatory Landscape',
            },
            {
                type: 'paragraph',
                text: 'Unlike the harmonized EMA framework in Europe, ASEAN\'s regulatory environment remains fragmented. Each member state maintains sovereign authority over pharmaceutical approvals, creating a complex matrix of requirements that demands careful navigation.',
            },
            {
                type: 'stats',
                items: [
                    { label: 'Average Approval Timeline', value: '18-24 months', note: 'Varies by country' },
                    { label: 'Market Growth CAGR', value: '15.3%', note: '2024-2030' },
                    { label: 'Cost Savings vs Originator', value: '30-40%', note: 'Average across markets' },
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Country-Specific Considerations',
            },
            {
                type: 'heading',
                level: 3,
                text: 'Singapore: The Gateway Market',
            },
            {
                type: 'paragraph',
                text: 'Singapore\'s Health Sciences Authority (HSA) is often considered the gold standard in ASEAN. A favorable HSA decision can facilitate subsequent approvals in neighboring markets through the ASEAN Reference System.',
            },
            {
                type: 'heading',
                level: 3,
                text: 'Thailand: Volume and Value',
            },
            {
                type: 'paragraph',
                text: 'With its robust healthcare infrastructure and government-backed universal coverage scheme, Thailand offers significant volume potential. The Thai FDA\'s biosimilar pathway aligns closely with WHO guidelines, providing a familiar framework for international manufacturers.',
            },
            {
                type: 'bullets',
                items: [
                    'Comprehensive comparability studies required (analytical, functional, clinical)',
                    'Local clinical data may be requested for certain therapeutic areas',
                    'Pharmacovigilance infrastructure must be established pre-approval',
                    'Pricing negotiations with NHSO critical for market access',
                ],
            },
            {
                type: 'quote',
                text: 'The companies that succeed in ASEAN biosimilars are those that treat regulatory strategy as a competitive advantage, not an afterthought.',
                by: 'Regional Pharma Executive',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Strategic Recommendations',
            },
            {
                type: 'paragraph',
                text: 'Success in ASEAN biosimilar markets requires a multi-pronged approach that balances speed-to-market with sustainable compliance frameworks. We recommend the following strategic priorities:',
            },
            {
                type: 'bullets',
                items: [
                    'Prioritize Singapore HSA approval as a regional reference',
                    'Invest in local partnerships with established distribution networks',
                    'Build relationships with key opinion leaders in each target market',
                    'Develop market-specific pricing and access strategies',
                    'Establish robust post-market surveillance capabilities',
                ],
            },
            {
                type: 'divider',
            },
            {
                type: 'paragraph',
                text: 'As the biosimilar landscape continues to evolve, first-mover advantages remain significant. Companies that invest in understanding the regulatory nuances today will be best positioned to capture market share as biological patent expirations accelerate through the decade.',
            },
        ],
    },
    {
        slug: 'rise-of-integrated-wellness-medical-tourism',
        title: 'The Rise of Integrated Wellness-Medical Tourism: Beyond Treatment',
        excerpt:
            'Modern medical tourists are no longer satisfied with clinical outcomes alone. They seek holistic experiences that combine world-class treatment with wellness, recovery, and transformative care journeys.',
        coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&h=800&fit=crop&q=80',
        category: 'Health Tourism',
        tags: ['Medical Tourism', 'Wellness', 'Patient Experience', 'Asia-Pacific'],
        author: {
            name: 'James Park',
            role: 'Head of Health Tourism',
            avatar: '/team/james-park.jpg',
        },
        publishedAt: '2026-01-15T09:00:00Z',
        readingTime: '6 min read',
        featured: true,
        content: [
            {
                type: 'callout',
                title: 'Key Takeaways',
                text: 'Integrated wellness-medical programs show 40% higher patient satisfaction scores and 2.3x greater likelihood of return visits. The future of medical tourism is holistic.',
            },
            {
                type: 'paragraph',
                text: 'The post-pandemic medical tourism landscape has undergone a fundamental transformation. Today\'s international patients arrive with expectations shaped by the wellness economy, seeking not just excellent clinical outcomes but comprehensive care experiences that address mind, body, and spirit.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Defining the Integrated Model',
            },
            {
                type: 'paragraph',
                text: 'Integrated wellness-medical tourism represents the convergence of three traditionally separate industries: acute medical care, preventive health services, and hospitality-driven wellness experiences. This model recognizes that healing extends beyond the procedure room.',
            },
            {
                type: 'stats',
                items: [
                    { label: 'Global Market Value', value: '$128B', note: 'By 2028' },
                    { label: 'Patient Satisfaction Lift', value: '+40%', note: 'vs traditional model' },
                    { label: 'Average Length of Stay', value: '12 days', note: 'Integrated programs' },
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Key Components of Success',
            },
            {
                type: 'bullets',
                items: [
                    'Pre-arrival digital concierge and care planning',
                    'Airport-to-recovery seamless logistics coordination',
                    'Clinical care delivered in hospitality-grade environments',
                    'Curated recovery programs combining therapy and wellness',
                    'Post-return virtual follow-up and community support',
                ],
            },
            {
                type: 'quote',
                text: 'We don\'t just treat patients. We guide them through a transformation. The surgery is one chapter in a longer story of renewal.',
                by: 'Dr. Mei Lin, Bangkok International Hospital',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Destination Spotlight: Thailand',
            },
            {
                type: 'paragraph',
                text: 'Thailand has emerged as the global leader in integrated wellness-medical tourism, leveraging its established medical tourism infrastructure, world-renowned hospitality culture, and deep traditions in wellness practices.',
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=675&fit=crop&q=80',
                alt: 'Luxury wellness resort in Thailand',
                caption: 'Leading Thai hospitals now offer recovery programs in partnership with luxury wellness resorts.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Implications for Healthcare Providers',
            },
            {
                type: 'paragraph',
                text: 'For hospitals and clinics seeking to capture this growing segment, the integrated model requires new capabilities: partnership development with wellness providers, investment in patient experience infrastructure, and training staff to deliver hospitality-grade service.',
            },
            {
                type: 'divider',
            },
            {
                type: 'paragraph',
                text: 'The boundaries between medical tourism and wellness travel are blurring rapidly. Providers who embrace this convergence will define the next era of international healthcare.',
            },
        ],
    },
    {
        slug: 'generic-drug-distribution-emerging-markets',
        title: 'Building Resilient Generic Drug Distribution Networks in Emerging Markets',
        excerpt:
            'Supply chain disruptions have exposed vulnerabilities in pharmaceutical distribution. Smart manufacturers are redesigning their emerging market networks with resilience as a core principle.',
        coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop&q=80',
        category: 'Market Entry',
        tags: ['Distribution', 'Supply Chain', 'Generics', 'Emerging Markets'],
        author: {
            name: 'Michelle Wong',
            role: 'Director of Operations',
            avatar: '/team/michelle-wong.jpg',
        },
        publishedAt: '2026-01-10T09:00:00Z',
        readingTime: '7 min read',
        featured: false,
        content: [
            {
                type: 'callout',
                title: 'Key Takeaways',
                text: 'Resilient distribution networks require multi-hub strategies, digital visibility tools, and deep local partnerships. Investment in infrastructure pays dividends in market reliability.',
            },
            {
                type: 'paragraph',
                text: 'The COVID-19 pandemic and subsequent global supply chain disruptions fundamentally changed how pharmaceutical companies think about distribution. In emerging markets, where infrastructure gaps amplify vulnerabilities, building resilient networks has become a strategic imperative.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Case for Redundancy',
            },
            {
                type: 'paragraph',
                text: 'Traditional distribution models optimized for cost efficiency often created single points of failure. A hub-and-spoke network centered on one regional warehouse might minimize logistics costs in normal times, but a single disruption—port closure, natural disaster, political instability—can halt supply to entire markets.',
            },
            {
                type: 'stats',
                items: [
                    { label: 'Supply Disruption Events', value: '+340%', note: 'Since 2019' },
                    { label: 'Avg. Recovery Time', value: '6-8 weeks', note: 'Single-hub networks' },
                    { label: 'Multi-Hub Premium', value: '12-15%', note: 'Additional logistics cost' },
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Digital Visibility as Foundation',
            },
            {
                type: 'paragraph',
                text: 'Resilience requires visibility. Real-time tracking of inventory positions, shipment status, and demand signals across the network enables proactive response to emerging disruptions before they cascade into stock-outs.',
            },
            {
                type: 'bullets',
                items: [
                    'IoT-enabled cold chain monitoring for temperature-sensitive products',
                    'Predictive analytics for demand sensing and inventory optimization',
                    'Blockchain-based serialization for authentication and traceability',
                    'Cloud-based control towers for end-to-end visibility',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Local Partnership Models',
            },
            {
                type: 'paragraph',
                text: 'The most resilient networks blend global scale with local expertise. Strategic partnerships with regional distributors provide market knowledge, regulatory relationships, and last-mile capabilities that would take years to build organically.',
            },
            {
                type: 'quote',
                text: 'Your distribution partner isn\'t just moving boxes. They\'re your eyes and ears in the market, your first responders when challenges arise.',
            },
            {
                type: 'divider',
            },
            {
                type: 'paragraph',
                text: 'Building resilient distribution is an investment, not an expense. Companies that build robust networks today will capture market share when competitors face supply disruptions tomorrow.',
            },
        ],
    },
    {
        slug: 'patient-facilitation-digital-transformation',
        title: 'Digital Transformation in Patient Facilitation: From Inquiry to Aftercare',
        excerpt:
            'Technology is reshaping how medical tourism facilitators engage patients across the care journey. Digital-first approaches are setting new standards for convenience, transparency, and outcomes.',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop&q=80',
        category: 'Health Tourism',
        tags: ['Digital Health', 'Patient Experience', 'Technology', 'Facilitation'],
        author: {
            name: 'David Mueller',
            role: 'Chief Strategy Officer',
            avatar: '/team/david-mueller.jpg',
        },
        publishedAt: '2026-01-05T09:00:00Z',
        readingTime: '5 min read',
        featured: false,
        content: [
            {
                type: 'callout',
                title: 'Key Takeaways',
                text: 'Digital patient facilitation platforms reduce coordination overhead by 60% while improving patient satisfaction. The ROI case for technology investment is compelling.',
            },
            {
                type: 'paragraph',
                text: 'The patient facilitation industry has historically relied on high-touch, manual processes. Coordinators juggling spreadsheets, email threads, and phone calls to orchestrate complex international care journeys. Digital transformation is changing everything.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Modern Patient Journey',
            },
            {
                type: 'paragraph',
                text: 'Today\'s medical tourists expect the same digital convenience they experience in travel and hospitality. They want to research options, compare providers, manage documents, and track their journey through intuitive digital interfaces.',
            },
            {
                type: 'bullets',
                items: [
                    'AI-powered treatment matching based on medical history and preferences',
                    'Virtual consultations with specialists before travel commitment',
                    'Digital document management for medical records and visas',
                    'Real-time care journey tracking for patients and families',
                    'Integrated payment platforms with transparent pricing',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Platform Capabilities',
            },
            {
                type: 'stats',
                items: [
                    { label: 'Coordination Time Saved', value: '60%', note: 'Per patient journey' },
                    { label: 'Document Processing', value: '4x faster', note: 'vs manual handling' },
                    { label: 'Patient Satisfaction', value: '+35%', note: 'Digital-first approach' },
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Implementation Considerations',
            },
            {
                type: 'paragraph',
                text: 'Digital transformation requires more than technology procurement. Success depends on process redesign, staff training, and change management. The human element remains critical—technology should augment, not replace, the personal care that defines excellent facilitation.',
            },
            {
                type: 'divider',
            },
            {
                type: 'paragraph',
                text: 'Facilitators who embrace digital transformation will scale efficiently while maintaining service quality. Those who resist will find themselves outpaced by more agile competitors.',
            },
        ],
    },
    {
        slug: 'regulatory-harmonization-gcc-pharmaceutical',
        title: 'GCC Pharmaceutical Regulatory Harmonization: Progress and Opportunities',
        excerpt:
            'The Gulf Cooperation Council is accelerating efforts to harmonize pharmaceutical regulations across member states. For manufacturers, this creates new pathways to regional market access.',
        coverImage: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&h=800&fit=crop&q=80',
        category: 'Pharma',
        tags: ['GCC', 'Regulatory', 'Middle East', 'Harmonization'],
        author: {
            name: 'Dr. Sarah Chen',
            role: 'Director, Regulatory Strategy',
            avatar: '/team/sarah-chen.jpg',
        },
        publishedAt: '2025-12-28T09:00:00Z',
        readingTime: '6 min read',
        featured: false,
        content: [
            {
                type: 'callout',
                title: 'Key Takeaways',
                text: 'GCC centralized registration can reduce approval timelines by 50% across member states. Early adoption of the pathway offers significant competitive advantage.',
            },
            {
                type: 'paragraph',
                text: 'The Gulf Cooperation Council pharmaceutical market represents over $15 billion in annual sales, with growth rates consistently outpacing global averages. Historically, manufacturers faced the burden of separate registration processes in each member state. That\'s changing.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Centralized Registration Pathway',
            },
            {
                type: 'paragraph',
                text: 'The GCC Centralized Registration procedure, administered through Saudi Arabia\'s SFDA, allows manufacturers to submit a single dossier for review. Approved products gain marketing authorization across all six member states: Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Oman.',
            },
            {
                type: 'stats',
                items: [
                    { label: 'Timeline Reduction', value: '50%', note: 'vs individual submissions' },
                    { label: 'GCC Pharma Market', value: '$15.2B', note: 'Annual sales' },
                    { label: 'Growth Rate', value: '7.8%', note: 'CAGR 2024-2030' },
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Eligibility and Requirements',
            },
            {
                type: 'bullets',
                items: [
                    'Products must be approved in a recognized reference authority (FDA, EMA, PMDA, etc.)',
                    'GMP compliance with acceptable inspection history required',
                    'Complete CTD dossier in eCTD format',
                    'Local authorized representative in Saudi Arabia',
                    'Arabic labeling and patient information materials',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Strategic Implications',
            },
            {
                type: 'paragraph',
                text: 'For pharmaceutical companies with global portfolios, the GCC centralized pathway offers an efficient route to a high-value regional market. Early adopters are building regulatory precedent and establishing commercial presence before competitors.',
            },
            {
                type: 'quote',
                text: 'The GCC harmonization initiative represents one of the most significant regulatory developments in the Middle East pharmaceutical sector in decades.',
            },
            {
                type: 'divider',
            },
            {
                type: 'paragraph',
                text: 'As the GCC continues to refine its centralized procedures, we expect adoption to accelerate. Manufacturers should evaluate their portfolios for pathway eligibility and develop regional strategies accordingly.',
            },
        ],
    },
    {
        slug: 'preventive-health-screening-packages-asia',
        title: 'Designing Preventive Health Screening Packages for International Wellness Travelers',
        excerpt:
            'Preventive health screening has become a cornerstone of wellness tourism. Leading destinations are developing sophisticated packages that combine diagnostic excellence with resort-style experiences.',
        coverImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=800&fit=crop&q=80',
        category: 'Wellness',
        tags: ['Preventive Care', 'Wellness Tourism', 'Health Screening', 'Asia'],
        author: {
            name: 'James Park',
            role: 'Head of Health Tourism',
            avatar: '/team/james-park.jpg',
        },
        publishedAt: '2025-12-20T09:00:00Z',
        readingTime: '5 min read',
        featured: false,
        content: [
            {
                type: 'callout',
                title: 'Key Takeaways',
                text: 'Premium health screening packages that combine clinical rigor with hospitality experiences command 3-4x pricing premiums and show strong repeat booking rates.',
            },
            {
                type: 'paragraph',
                text: 'The global preventive care market is projected to exceed $432 billion by 2028, driven by aging populations, rising chronic disease prevalence, and growing health consciousness among affluent consumers. For wellness destinations, executive health screening packages represent a high-margin opportunity.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Components of Premium Packages',
            },
            {
                type: 'paragraph',
                text: 'The most successful screening packages go far beyond a checklist of diagnostic tests. They create a holistic experience that addresses the emotional and practical needs of international health travelers.',
            },
            {
                type: 'bullets',
                items: [
                    'Comprehensive diagnostic panel with advanced imaging (MRI, CT, PET)',
                    'Genetic and biomarker testing for personalized risk assessment',
                    'Same-day results with physician consultation',
                    'Lifestyle and nutrition counseling',
                    'Spa and wellness treatments during the screening process',
                    'Detailed health report with actionable recommendations',
                ],
            },
            {
                type: 'stats',
                items: [
                    { label: 'Average Package Value', value: '$3,500-8,000', note: 'Premium tier' },
                    { label: 'Repeat Booking Rate', value: '45%', note: 'Annual returnees' },
                    { label: 'Satisfaction Score', value: '94%', note: 'Very satisfied' },
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Destination Differentiation',
            },
            {
                type: 'paragraph',
                text: 'Competition among wellness destinations is intensifying. Differentiation comes from clinical reputation, technology access, hospitality quality, and the ability to create seamless end-to-end experiences.',
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=675&fit=crop&q=80',
                alt: 'Modern health screening center',
                caption: 'Leading screening centers blend clinical functionality with resort-style design.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Marketing to the Right Audience',
            },
            {
                type: 'paragraph',
                text: 'Premium health screening packages appeal to time-pressed executives, health-conscious high-net-worth individuals, and proactive retirees. Marketing strategies should emphasize convenience, exclusivity, and the integration of health with travel.',
            },
            {
                type: 'divider',
            },
            {
                type: 'paragraph',
                text: 'As preventive health awareness grows globally, wellness destinations that invest in screening capabilities and experiences will capture a growing share of health-motivated travel.',
            },
        ],
    },
];

export const categories = ['Pharma', 'Market Entry', 'Health Tourism', 'Wellness'] as const;

export const popularTags = [
    'Regulatory',
    'ASEAN',
    'Biosimilars',
    'Medical Tourism',
    'Wellness',
    'Market Entry',
    'Digital Health',
    'GCC',
    'Supply Chain',
    'Patient Experience',
];

export function getPostBySlug(slug: string): Post | undefined {
    return posts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): Post[] {
    return posts.filter((post) => post.featured);
}

export function getPostsByCategory(category: Post['category']): Post[] {
    return posts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): Post[] {
    return posts.filter((post) => post.tags.includes(tag));
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
    const currentPost = getPostBySlug(currentSlug);
    if (!currentPost) return [];

    return posts
        .filter((post) => post.slug !== currentSlug)
        .filter(
            (post) =>
                post.category === currentPost.category ||
                post.tags.some((tag) => currentPost.tags.includes(tag))
        )
        .slice(0, limit);
}
