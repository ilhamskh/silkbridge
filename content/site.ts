export const siteConfig = {
    name: 'Silkbridge International',
    tagline: 'Connecting Markets & Health Tourism Across Borders',
    description: 'Premium pharmaceutical market entry and health & wellness tourism services connecting global markets.',
    url: 'https://silkbridge.com',
    email: 'contact@silkbridge.com',
    phone: '+1 (555) 123-4567',
    address: '350 Fifth Avenue, Suite 7820, New York, NY 10118',
};

export const navigation = {
    main: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Market Insights', href: '/market-insights' },
        { name: 'Partners', href: '/partners' },
        { name: 'Contact', href: '/contact' },
    ],
    mobile: [
        { name: 'Home', href: '/', icon: 'home' },
        { name: 'Services', href: '/services', icon: 'services' },
        { name: 'Insights', href: '/market-insights', icon: 'insights' },
        { name: 'Partners', href: '/partners', icon: 'partners' },
        { name: 'Contact', href: '/contact', icon: 'contact' },
    ],
    footer: [
        {
            title: 'Services',
            links: [
                { name: 'Market Entry', href: '/services#market-entry' },
                { name: 'Regulatory Support', href: '/services#regulatory' },
                { name: 'Health Tourism', href: '/services#health-tourism' },
                { name: 'Wellness Programs', href: '/services#wellness' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Our Partners', href: '/partners' },
                { name: 'Market Insights', href: '/market-insights' },
                { name: 'Contact', href: '/contact' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { name: 'Industry Reports', href: '/market-insights' },
                { name: 'Partner Portal', href: '/partners' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
            ],
        },
    ],
    social: [
        { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
        { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    ],
};

export const hero = {
    tagline: 'Connecting Markets &\nHealth Tourism Across Borders',
    subtagline: 'Pharma, medical care, wellness, and leisure—delivered globally with precision and care.',
    cta: {
        primary: { text: 'Market Entry Services', href: '/services#market-entry' },
        secondary: { text: 'Health & Wellness Tourism', href: '/services#health-tourism' },
    },
};

export const about = {
    mission: 'We bridge the gap between international pharmaceutical companies seeking market expansion and patients seeking world-class healthcare. Our expertise spans regulatory navigation, market strategy, and comprehensive health tourism coordination.',
    pillars: [
        {
            title: 'Regulatory Support',
            description: 'Navigate complex compliance landscapes with confidence.',
            icon: 'regulatory',
        },
        {
            title: 'Market Entry',
            description: 'Strategic positioning for sustainable growth.',
            icon: 'market',
        },
        {
            title: 'Health & Wellness Tourism',
            description: 'Premium care experiences across borders.',
            icon: 'wellness',
        },
    ],
};

export const services = {
    marketEntry: {
        title: 'Market Entry Services',
        description: 'Comprehensive support for pharmaceutical and healthcare companies entering new markets.',
        features: [
            'Regulatory pathway analysis & strategy',
            'Local partner identification & vetting',
            'Market sizing & competitive intelligence',
            'Distribution network establishment',
            'Pricing & reimbursement consulting',
            'Post-market surveillance setup',
        ],
    },
    healthTourism: {
        title: 'Health & Wellness Tourism',
        description: 'End-to-end coordination for patients seeking medical care and wellness experiences abroad.',
        features: [
            'Hospital & specialist matching',
            'Treatment planning & coordination',
            'Travel & accommodation arrangements',
            'Interpreter & concierge services',
            'Post-treatment follow-up care',
            'Wellness retreat curation',
        ],
    },
};

export const insights = {
    stats: [
        { value: '$12.1T', label: 'Global Healthcare Market 2025', source: 'Deloitte' },
        { value: '74M', label: 'Medical Tourists Annually', source: 'MTA' },
        { value: '18.3%', label: 'Emerging Market CAGR', source: 'McKinsey' },
        { value: '$4.5B', label: 'Wellness Tourism Growth', source: 'GWI' },
    ],
    featured: [
        {
            slug: 'emerging-markets-pharma-2025',
            title: 'Emerging Markets Reshape Global Pharma Landscape',
            excerpt: 'How regulatory harmonization and digital health adoption are accelerating pharmaceutical market entry in Southeast Asia and Latin America.',
            category: 'Market Analysis',
            date: '2025-01-15',
            readTime: '8 min read',
            image: '/insights/emerging-markets.jpg',
        },
        {
            slug: 'medical-tourism-trends',
            title: 'The New Era of Medical Tourism',
            excerpt: 'Post-pandemic shifts in patient expectations and the rise of integrated wellness-medical experiences.',
            category: 'Health Tourism',
            date: '2025-01-08',
            readTime: '6 min read',
            image: '/insights/medical-tourism.jpg',
        },
        {
            slug: 'regulatory-pathways-asia',
            title: 'Navigating Regulatory Pathways in Asia-Pacific',
            excerpt: 'A comprehensive guide to pharmaceutical approval processes across key APAC markets.',
            category: 'Regulatory',
            date: '2024-12-20',
            readTime: '12 min read',
            image: '/insights/regulatory.jpg',
        },
    ],
};

export const partners = {
    headline: 'Trusted by Leading Healthcare Institutions',
    description: 'We partner with world-renowned hospitals, wellness centers, and pharmaceutical organizations to deliver exceptional outcomes.',
    items: [
        { name: 'Seoul Medical Center', location: 'Seoul, South Korea', specialty: 'Oncology, Cardiology' },
        { name: 'Bangkok International Hospital', location: 'Bangkok, Thailand', specialty: 'Orthopedics, Wellness' },
        { name: 'Singapore Health Partners', location: 'Singapore', specialty: 'Neurology, Pediatrics' },
        { name: 'Dubai Healthcare City', location: 'Dubai, UAE', specialty: 'Multi-specialty' },
        { name: 'São Paulo Medical', location: 'São Paulo, Brazil', specialty: 'Plastic Surgery, Dentistry' },
        { name: 'Munich Medical Alliance', location: 'Munich, Germany', specialty: 'Rehabilitation, Sports Medicine' },
    ],
    cta: {
        text: 'Partner With Us',
        href: '/contact?type=partner',
    },
};

export const contact = {
    headline: 'Start Your Journey',
    description: 'Whether you\'re a pharmaceutical company exploring new markets or seeking premium healthcare abroad, we\'re here to guide you.',
    form: {
        types: [
            { value: 'pharma', label: 'Pharmaceutical Company' },
            { value: 'patient', label: 'Patient / Individual' },
            { value: 'wellness', label: 'Wellness Provider' },
            { value: 'partner', label: 'Partnership Inquiry' },
        ],
    },
};

export const blogPosts = [
    {
        slug: 'emerging-markets-pharma-2025',
        title: 'Emerging Markets Reshape Global Pharma Landscape',
        excerpt: 'How regulatory harmonization and digital health adoption are accelerating pharmaceutical market entry in Southeast Asia and Latin America.',
        content: `
      <p>The global pharmaceutical industry is witnessing a significant shift as emerging markets in Southeast Asia and Latin America become increasingly attractive destinations for market expansion. This transformation is driven by several key factors that are reshaping the competitive landscape.</p>
      
      <h2>Regulatory Harmonization</h2>
      <p>Regional regulatory bodies are working towards harmonized approval processes, reducing the time and cost of market entry. The ASEAN Pharmaceutical Product Working Group has made significant strides in creating unified standards, while Latin American countries are increasingly aligning with ICH guidelines.</p>
      
      <h2>Digital Health Adoption</h2>
      <p>The rapid adoption of digital health technologies is creating new opportunities for pharmaceutical companies. Telemedicine platforms, digital therapeutics, and AI-powered diagnostics are becoming integral parts of healthcare delivery in these regions.</p>
      
      <h2>Market Potential</h2>
      <p>With a combined population of over 1.5 billion and growing middle-class segments, these regions represent significant untapped potential. Healthcare spending is projected to grow at 8-12% annually through 2030.</p>
      
      <h2>Strategic Considerations</h2>
      <p>Successful market entry requires a nuanced understanding of local dynamics, regulatory landscapes, and distribution networks. Companies must balance speed-to-market pressures with the need for sustainable, compliant operations.</p>
    `,
        category: 'Market Analysis',
        date: '2025-01-15',
        readTime: '8 min read',
        image: '/insights/emerging-markets.jpg',
        author: 'Sarah Chen',
        authorRole: 'Director, Market Strategy',
    },
    {
        slug: 'medical-tourism-trends',
        title: 'The New Era of Medical Tourism',
        excerpt: 'Post-pandemic shifts in patient expectations and the rise of integrated wellness-medical experiences.',
        content: `
      <p>The medical tourism industry has undergone a profound transformation in the post-pandemic era. Patients now seek more than just medical procedures—they're looking for holistic experiences that combine world-class healthcare with wellness and recovery.</p>
      
      <h2>Evolving Patient Expectations</h2>
      <p>Today's medical tourists are more informed, more demanding, and more focused on the complete care journey. They expect seamless coordination, transparent pricing, and personalized attention throughout their experience.</p>
      
      <h2>Integration of Wellness</h2>
      <p>Leading destinations are differentiating themselves by offering integrated wellness programs alongside medical treatments. Recovery retreats, preventive health packages, and holistic healing approaches are becoming standard offerings.</p>
      
      <h2>Technology's Role</h2>
      <p>Virtual consultations, digital health records, and AI-powered matching systems are transforming how patients find and engage with international healthcare providers.</p>
      
      <h2>Looking Ahead</h2>
      <p>The industry is projected to reach $207 billion by 2027, with Asia-Pacific and the Middle East leading growth. Success will depend on providers' ability to deliver exceptional experiences while maintaining clinical excellence.</p>
    `,
        category: 'Health Tourism',
        date: '2025-01-08',
        readTime: '6 min read',
        image: '/insights/medical-tourism.jpg',
        author: 'Dr. James Park',
        authorRole: 'Head of Health Tourism',
    },
    {
        slug: 'regulatory-pathways-asia',
        title: 'Navigating Regulatory Pathways in Asia-Pacific',
        excerpt: 'A comprehensive guide to pharmaceutical approval processes across key APAC markets.',
        content: `
      <p>The Asia-Pacific region presents a complex regulatory landscape for pharmaceutical companies seeking market entry. Understanding the nuances of each market's approval process is critical for successful product launches.</p>
      
      <h2>Japan: PMDA Framework</h2>
      <p>Japan's Pharmaceuticals and Medical Devices Agency (PMDA) maintains rigorous standards with unique data requirements. Early consultation with PMDA is essential for efficient approval timelines.</p>
      
      <h2>China: NMPA Evolution</h2>
      <p>China's National Medical Products Administration has undergone significant reforms, streamlining processes and accepting foreign clinical data under certain conditions. The market's size makes it a priority for most global pharma companies.</p>
      
      <h2>ASEAN Markets</h2>
      <p>The ASEAN harmonization initiative is gradually reducing barriers between member states. However, significant differences remain in local requirements, pricing negotiations, and distribution regulations.</p>
      
      <h2>Strategic Recommendations</h2>
      <p>Companies should develop market-specific strategies while building regional capabilities. Local partnerships, regulatory expertise, and flexible manufacturing arrangements are key success factors.</p>
    `,
        category: 'Regulatory',
        date: '2024-12-20',
        readTime: '12 min read',
        image: '/insights/regulatory.jpg',
        author: 'Michelle Wong',
        authorRole: 'Regulatory Affairs Director',
    },
];
