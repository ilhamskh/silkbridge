import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

// Maximum file size: 10MB for insights images, 2MB for logos
const MAX_FILE_SIZE_INSIGHTS = 10 * 1024 * 1024;
const MAX_FILE_SIZE_LOGOS = 2 * 1024 * 1024;
const ALLOWED_TYPES_INSIGHTS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_TYPES_LOGOS = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        const user = await requireAdmin();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'insights';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Determine allowed types and max size based on folder
        const isLogoUpload = folder === 'brand';
        const allowedTypes = isLogoUpload ? ALLOWED_TYPES_LOGOS : ALLOWED_TYPES_INSIGHTS;
        const maxFileSize = isLogoUpload ? MAX_FILE_SIZE_LOGOS : MAX_FILE_SIZE_INSIGHTS;

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > maxFileSize) {
            return NextResponse.json(
                { error: `File too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${folder}/${timestamp}-${sanitizedName}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        return NextResponse.json({
            url: blob.url,
            success: true,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
