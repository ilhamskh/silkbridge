import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/settings
 * Returns public site settings (contact info, social links).
 * No auth required — data is publicly displayed on the website.
 */
export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst({
            select: {
                contactEmail: true,
                contactPhone: true,
                contactAddress: true,
            },
        });

        return NextResponse.json({
            contactEmail: settings?.contactEmail ?? null,
            contactPhone: settings?.contactPhone ?? null,
            contactAddress: settings?.contactAddress ?? null,
        });
    } catch (error) {
        console.error('[Settings API] Failed to fetch settings:', error);
        return NextResponse.json(
            { contactEmail: null, contactPhone: null, contactAddress: null },
            { status: 500 }
        );
    }
}
