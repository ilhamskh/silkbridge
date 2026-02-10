import { NextRequest, NextResponse } from 'next/server';
import { getPartners } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const locale = request.nextUrl.searchParams.get('locale') || 'en';
        const partners = await getPartners(locale);
        return NextResponse.json(partners);
    } catch (error) {
        console.error('Failed to fetch partners:', error);
        return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
    }
}
