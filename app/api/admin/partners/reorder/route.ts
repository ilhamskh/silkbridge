import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Reorder partners
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { updates } = body; // [{ id: string, order: number }]

        // Update all orders in a transaction
        await prisma.$transaction(
            updates.map((update: { id: string; order: number }) =>
                prisma.partner.update({
                    where: { id: update.id },
                    data: { order: update.order },
                })
            )
        );

        // Revalidate public pages
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/partners', 'page');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to reorder partners:', error);
        return NextResponse.json({ error: 'Failed to reorder partners' }, { status: 500 });
    }
}
