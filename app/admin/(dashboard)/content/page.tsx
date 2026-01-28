import { prisma } from '@/lib/db';
import ContentHub from '@/components/admin/ContentHub';

// Revalidate this page data every 30 seconds
export const revalidate = 30;

export const metadata = {
    title: 'Content Hub',
};

// Define types locally to avoid Prisma client issues before generation
interface Locale {
    code: string;
    name: string;
    flag: string | null;
    isDefault: boolean;
    isEnabled: boolean;
}

interface PageTranslation {
    localeCode: string;
    title: string;
    status: 'DRAFT' | 'PUBLISHED';
    updatedAt: Date;
}

interface Page {
    id: string;
    slug: string;
    updatedAt: Date;
    translations: PageTranslation[];
}

async function getContentData() {
    try {
        const [pages, locales] = await Promise.all([
            prisma.page.findMany({
                include: {
                    translations: {
                        select: {
                            localeCode: true,
                            title: true,
                            status: true,
                            updatedAt: true,
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
            }),
            prisma.locale.findMany({
                where: { isEnabled: true },
                orderBy: { isDefault: 'desc' },
            }),
        ]);

        return { pages: pages as Page[], locales: locales as Locale[] };
    } catch (error) {
        console.error('Error fetching content data:', error);
        return { pages: [], locales: [] };
    }
}

// Page icons and descriptions
const pageInfo: Record<string, { icon: string; description: string; color: string }> = {
    home: {
        icon: '🏠',
        description: 'Main landing page with hero, services overview, and CTAs',
        color: 'from-blue-500 to-blue-600',
    },
    about: {
        icon: '👥',
        description: 'Company story, mission, values, and team information',
        color: 'from-indigo-500 to-indigo-600',
    },
    services: {
        icon: '🛠️',
        description: 'Detailed service offerings and capabilities',
        color: 'from-purple-500 to-purple-600',
    },
    partners: {
        icon: '🤝',
        description: 'Partner network and collaboration information',
        color: 'from-teal-500 to-teal-600',
    },
    contact: {
        icon: '📧',
        description: 'Contact form, office locations, and inquiry handling',
        color: 'from-emerald-500 to-emerald-600',
    },
};

export default async function ContentPage() {
    const { pages, locales } = await getContentData();

    // Enrich pages with display info
    const enrichedPages = pages.map((page) => ({
        ...page,
        displayInfo: pageInfo[page.slug] || {
            icon: '📄',
            description: 'Page content',
            color: 'from-slate-500 to-slate-600',
        },
    }));

    return (
        <ContentHub
            pages={enrichedPages}
            locales={locales}
        />
    );
}
