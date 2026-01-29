import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// UPDATE a partner
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, logoUrl, location, specialties, websiteUrl, status, descriptions } = body;

        // Update partner
        const partner = await prisma.partner.update({
            where: { id },
            data: {
                name,
                logoUrl,
                location,
                specialties: specialties || [],
                websiteUrl,
                status,
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

        // Revalidate public pages
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/partners', 'page');

        return NextResponse.json(partner);
    } catch (error) {
        console.error('Failed to update partner:', error);
        return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
    }
}

// DELETE a partner
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.partner.delete({
            where: { id },
        });

        // Revalidate public pages
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/partners', 'page');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete partner:', error);
        return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
    }
}
