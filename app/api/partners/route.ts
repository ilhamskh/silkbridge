import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

export async function GET() {
    try {
        // Get locale from headers or default to 'en'
        const headersList = await headers();
        const acceptLanguage = headersList.get('accept-language') || '';
        const locale = acceptLanguage.split(',')[0]?.split('-')[0] || 'en';

        const partners = await prisma.partner.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { order: 'asc' },
            include: {
                translations: {
                    where: { localeCode: locale },
                },
            },
        });

        const formattedPartners = partners.map(partner => ({
            id: partner.id,
            name: partner.name,
            logoUrl: partner.logoUrl || undefined,
            images: partner.images,
            location: partner.location || undefined,
            specialties: partner.specialties,
            websiteUrl: partner.websiteUrl || undefined,
            description: partner.translations[0]?.description || undefined,
        }));

        return NextResponse.json(formattedPartners);
    } catch (error) {
        console.error('Failed to fetch partners:', error);
        return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
    }
}
