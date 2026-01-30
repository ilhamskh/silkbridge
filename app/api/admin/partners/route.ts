import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// GET all partners
export async function GET() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: { order: 'asc' },
            include: {
                translations: true,
            },
        });
        return NextResponse.json(partners);
    } catch (error) {
        console.error('Failed to fetch partners:', error);
        return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
    }
}

// CREATE a new partner
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, logoUrl, images, location, specialties, websiteUrl, status, descriptions } = body;

        // Get highest order value
        const lastPartner = await prisma.partner.findFirst({
            orderBy: { order: 'desc' },
        });
        const newOrder = (lastPartner?.order ?? -1) + 1;

        // Create partner with translations
        const partner = await prisma.partner.create({
            data: {
                name,
                logoUrl,
                images: images || [],
                location,
                specialties: specialties || [],
                websiteUrl,
                status: status || 'ACTIVE',
                order: newOrder,
                translations: {
                    create: Object.entries(descriptions || {}).map(([localeCode, description]) => ({
                        localeCode,
                        description: description as string || null,
                    })),
                },
            },
            include: {
                translations: true,
            },
        });

        // Revalidate public pages
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/partners', 'page');

        return NextResponse.json(partner, { status: 201 });
    } catch (error) {
        console.error('Failed to create partner:', error);
        return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
    }
}
