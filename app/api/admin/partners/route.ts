import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { getPartnersCacheTag, getAllPartnersCacheTag } from '@/lib/content';

const partnerGalleryItemSchema = z.object({
    url: z.string().url(),
    alt: z.string().optional().default(''),
});

const partnerCreateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    logoUrl: z.string().url().optional().nullable(),
    galleryImages: z.array(partnerGalleryItemSchema).max(8).optional().default([]),
    coverPhotoUrl: z.string().url().optional().nullable(),
    coverPhotoAlt: z.string().optional().nullable(),
    websiteUrl: z.string().url().optional().nullable(),
    category: z.enum(['GOVERNMENT', 'HOSPITAL', 'PHARMA', 'INVESTOR', 'ASSOCIATION', 'HOTEL', 'AIRLINE', 'TRANSPORT', 'TOURISM', 'TECHNOLOGY']),
    location: z.string().optional().nullable(),
    specialties: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true),
    descriptions: z.record(z.string(), z.string()).optional(), // { en: "...", az: "..." }
});

// GET all partners (admin — includes inactive)
export async function GET() {
    try {
        await requireAuth();

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
        await requireAuth();

        const body = await request.json();
        const parsed = partnerCreateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues.map(e => e.message).join(', ') },
                { status: 400 }
            );
        }

        const { name, logoUrl, galleryImages, coverPhotoUrl, coverPhotoAlt, websiteUrl, category, location, specialties, isActive, descriptions } = parsed.data;

        // Get highest order value
        const lastPartner = await prisma.partner.findFirst({
            orderBy: { order: 'desc' },
        });
        const newOrder = (lastPartner?.order ?? -1) + 1;

        // Create partner with translations
        const partner = await prisma.partner.create({
            data: {
                name,
                logoUrl: logoUrl || null,
                galleryImages: galleryImages.length > 0 ? galleryImages : Prisma.DbNull,
                coverPhotoUrl: coverPhotoUrl || null,
                coverPhotoAlt: coverPhotoAlt || null,
                websiteUrl: websiteUrl || null,
                category,
                location: location || null,
                specialties: specialties || [],
                isActive,
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

        // Revalidate partners cache for all locales
        revalidateTag(getAllPartnersCacheTag());
        const locales = await prisma.locale.findMany({ where: { isEnabled: true }, select: { code: true } });
        for (const loc of locales) {
            revalidateTag(getPartnersCacheTag(loc.code));
        }

        return NextResponse.json(partner, { status: 201 });
    } catch (error) {
        console.error('Failed to create partner:', error);
        return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
    }
}
