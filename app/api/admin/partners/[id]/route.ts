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

const partnerUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    logoUrl: z.string().url().optional().nullable(),
    galleryImages: z.array(partnerGalleryItemSchema).max(8).optional(),
    coverPhotoUrl: z.string().url().optional().nullable(),
    coverPhotoAlt: z.string().optional().nullable(),
    websiteUrl: z.string().url().optional().nullable(),
    category: z.enum(['GOVERNMENT', 'HOSPITAL', 'PHARMA', 'INVESTOR', 'ASSOCIATION', 'HOTEL', 'AIRLINE', 'TRANSPORT', 'TOURISM', 'TECHNOLOGY']).optional(),
    location: z.string().optional().nullable(),
    specialties: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    order: z.number().int().optional(),
    descriptions: z.record(z.string(), z.string()).optional(),
});

async function revalidatePartners() {
    revalidateTag(getAllPartnersCacheTag());
    const locales = await prisma.locale.findMany({ where: { isEnabled: true }, select: { code: true } });
    for (const loc of locales) {
        revalidateTag(getPartnersCacheTag(loc.code));
    }
}

// UPDATE a partner
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;

        const body = await request.json();
        const parsed = partnerUpdateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues.map(e => e.message).join(', ') },
                { status: 400 }
            );
        }

        const { name, logoUrl, galleryImages, coverPhotoUrl, coverPhotoAlt, websiteUrl, category, location, specialties, isActive, order, descriptions } = parsed.data;

        // Update partner
        const partner = await prisma.partner.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(logoUrl !== undefined && { logoUrl }),
                ...(galleryImages !== undefined && { galleryImages: galleryImages.length > 0 ? galleryImages : Prisma.DbNull }),
                ...(coverPhotoUrl !== undefined && { coverPhotoUrl }),
                ...(coverPhotoAlt !== undefined && { coverPhotoAlt }),
                ...(websiteUrl !== undefined && { websiteUrl }),
                ...(category !== undefined && { category }),
                ...(location !== undefined && { location }),
                ...(specialties !== undefined && { specialties }),
                ...(isActive !== undefined && { isActive }),
                ...(order !== undefined && { order }),
            },
        });

        // Update translations
        if (descriptions) {
            for (const [localeCode, description] of Object.entries(descriptions)) {
                await prisma.partnerTranslation.upsert({
                    where: {
                        partnerId_localeCode: {
                            partnerId: id,
                            localeCode,
                        },
                    },
                    create: {
                        partnerId: id,
                        localeCode,
                        description: description as string || null,
                    },
                    update: {
                        description: description as string || null,
                    },
                });
            }
        }

        const partnerWithTranslations = await prisma.partner.findUnique({
            where: { id },
            include: { translations: true },
        });

        await revalidatePartners();
        return NextResponse.json(partnerWithTranslations ?? partner);
    } catch (error) {
        console.error('Failed to update partner:', error);
        return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
    }
}

// DELETE a partner
export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;

        await prisma.partner.delete({
            where: { id },
        });

        await revalidatePartners();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete partner:', error);
        return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
    }
}
