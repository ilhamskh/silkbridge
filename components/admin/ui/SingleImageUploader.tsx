'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';

interface SingleImageUploaderProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
}

/**
 * Single-image uploader for admin section fields.
 * Uploads to /api/upload (Vercel Blob) and returns the URL.
 * Also supports pasting a URL directly.
 */
export function SingleImageUploader({
    label,
    value,
    onChange,
    helperText,
    disabled,
    required,
}: SingleImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('files', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            if (result.urls && result.urls.length > 0) {
                onChange(result.urls[0]);
            }

            if (result.errors && result.errors.length > 0) {
                setError(result.errors.join(', '));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;
        handleFile(files[0]);
    }, [handleFile]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

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

    const removeImage = useCallback(async () => {
        const imageUrl = value;
        onChange('');

        // Fire-and-forget Blob deletion
        if (imageUrl && imageUrl.startsWith('http')) {
            try {
                await fetch('/api/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: imageUrl }),
                });
            } catch (err) {
                console.error('Failed to delete from storage:', err);
            }
        }
    }, [value, onChange]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* If we already have a value, show preview */}
            {value ? (
                <div className="relative group">
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                        <div className="relative aspect-[16/9] max-h-48">
                            <img
                                src={value}
                                alt="Uploaded"
                                className="w-full h-full object-cover"
                            />
                            {/* Remove overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    disabled={disabled}
                                    className="p-2 bg-white rounded-lg text-red-600 hover:text-red-700 shadow-md"
                                    title="Remove image"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        {/* URL display */}
                        <div className="px-3 py-2 text-xs text-gray-500 truncate border-t border-gray-200">
                            {value}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Upload Zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => !disabled && fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer
                            transition-all duration-200
                            ${dragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }
                            ${isUploading ? 'pointer-events-none opacity-60' : ''}
                            ${disabled ? 'pointer-events-none opacity-50' : ''}
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                <span className="text-sm text-gray-600">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-blue-600">Click to upload</span>
                                    <span className="text-sm text-gray-500"> or drag & drop</span>
                                </div>
                                <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF (max 4.5MB)</p>
                            </div>
                        )}
                    </div>

                    {/* Or paste URL toggle */}
                    <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                    >
                        {showUrlInput ? 'Hide URL input' : 'Or paste image URL'}
                    </button>

                    {showUrlInput && (
                        <input
                            type="url"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="https://example.com/image.png"
                            disabled={disabled}
                            className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                </>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Helper Text */}
            {helperText && !error && (
                <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>
            )}
        </div>
    );
}
