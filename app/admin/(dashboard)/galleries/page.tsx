import prisma from '@/lib/db';
import GalleryManager from '@/components/admin/GalleryManager';

export const dynamic = 'force-dynamic';

export default async function GalleriesPage() {
    const galleryGroups = await prisma.galleryGroup.findMany({
        orderBy: { updatedAt: 'desc' },
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gallery Management</h1>
            <p className="mb-6 text-gray-600">
                Manage image galleries for different sections of the website. Select a group to edit its images.
            </p>
            <GalleryManager groups={galleryGroups} />
        </div>
    );
}
