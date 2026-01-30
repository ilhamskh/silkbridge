import { put, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Maximum file size: 4.5MB (Vercel Blob free tier limit)
const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        const uploadedUrls: string[] = [];
        const errors: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`${file.name}: Invalid file type. Allowed: JPEG, PNG, WebP, GIF`);
                continue;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: File too large. Max size: 4.5MB`);
                continue;
            }

            try {
                // Generate unique filename
                const timestamp = Date.now();
                const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `partners/${timestamp}-${sanitizedName}`;

                // Upload to Vercel Blob
                const blob = await put(filename, file, {
                    access: 'public',
                    addRandomSuffix: true,
                });

                uploadedUrls.push(blob.url);
            } catch (uploadError) {
                console.error(`Failed to upload ${file.name}:`, uploadError);
                errors.push(`${file.name}: Upload failed`);
            }
        }

        return NextResponse.json({
            urls: uploadedUrls,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}

// DELETE endpoint to remove images from Blob storage
export async function DELETE(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'No URL provided' },
                { status: 400 }
            );
        }

        await del(url);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Delete failed' },
            { status: 500 }
        );
    }
}
