'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, GripVertical, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
    className?: string;
}

export function ImageUploader({
    images,
    onChange,
    maxImages = 10,
    className = ''
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            setError(`Maximum ${maxImages} images allowed`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setIsUploading(true);
        setError(null);


        try {
            const formData = new FormData();
            filesToUpload.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            if (result.urls && result.urls.length > 0) {
                onChange([...images, ...result.urls]);
            }

            if (result.errors && result.errors.length > 0) {
                setError(result.errors.join(', '));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);

        }
    }, [images, maxImages, onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const removeImage = useCallback(async (index: number) => {
        const imageUrl = images[index];
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);

        // Optionally delete from Vercel Blob (fire and forget)
        try {
            await fetch('/api/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imageUrl }),
            });
        } catch (err) {
            console.error('Failed to delete from storage:', err);
        }
    }, [images, onChange]);

    // Drag to reorder handlers
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOverItem = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);
        onChange(newImages);
        setDraggedIndex(index);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Partner Images
                <span className="text-gray-400 font-normal ml-2">
                    ({images.length}/{maxImages})
                </span>
            </label>

            {/* Upload Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                    transition-all duration-200
                    ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    ${isUploading ? 'pointer-events-none opacity-60' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-blue-600">Click to upload</span>
                            <span className="text-sm text-gray-500"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-400">
                            JPEG, PNG, WebP, GIF (max 4.5MB each)
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((url, index) => (
                        <div
                            key={url}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOverItem(e, index)}
                            className={`
                                relative group aspect-square rounded-lg overflow-hidden
                                border-2 transition-all duration-200
                                ${draggedIndex === index
                                    ? 'border-blue-500 opacity-50'
                                    : 'border-transparent hover:border-gray-300'
                                }
                                ${index === 0 ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                            `}
                        >
                            <img
                                src={url}
                                alt={`Partner image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Cover Badge */}
                            {index === 0 && (
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-medium rounded">
                                    Cover
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    className="p-1.5 bg-white rounded-lg text-gray-700 hover:text-gray-900 cursor-grab active:cursor-grabbing"
                                    title="Drag to reorder"
                                >
                                    <GripVertical className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="p-1.5 bg-white rounded-lg text-red-600 hover:text-red-700"
                                    title="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Helper Text */}
            {images.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                    Drag images to reorder. First image is the cover image.
                </p>
            )}
        </div>
    );
}
