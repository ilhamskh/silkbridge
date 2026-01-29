import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { PartnersManager } from '@/components/admin/PartnersManager';

async function getPartners() {
    const partners = await prisma.partner.findMany({
        orderBy: { order: 'asc' },
        include: {
            translations: true,
        },
    });
    return partners;
}

async function getLocales() {
    const locales = await prisma.locale.findMany({
        where: { isEnabled: true },
        orderBy: { code: 'asc' },
    });
    return locales;
}

export default async function PartnersPage() {
    const [partners, locales] = await Promise.all([
        getPartners(),
        getLocales(),
    ]);

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
                <p className="mt-1 text-gray-600">
                    Manage your partner organizations. Partners will appear on the public site when active.
                </p>
            </div>

            <Suspense fallback={<div className="animate-pulse bg-gray-100 h-96 rounded-lg" />}>
                <PartnersManager
                    initialPartners={partners}
                    locales={locales}
                />
            </Suspense>
        </div>
    );
}
