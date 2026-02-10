import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { getPartnersCacheTag, getAllPartnersCacheTag } from '@/lib/content';

const partnerUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    logoUrl: z.string().url().optional().nullable(),
    websiteUrl: z.string().url().optional().nullable(),
    category: z.enum(['GOVERNMENT', 'HOSPITAL', 'PHARMA', 'INVESTOR', 'ASSOCIATION']).optional(),
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

        const { name, logoUrl, websiteUrl, category, isActive, order, descriptions } = parsed.data;

        // Update partner
        const partner = await prisma.partner.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(logoUrl !== undefined && { logoUrl }),
                ...(websiteUrl !== undefined && { websiteUrl }),
                ...(category !== undefined && { category }),
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

        await revalidatePartners();
        return NextResponse.json(partner);
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
