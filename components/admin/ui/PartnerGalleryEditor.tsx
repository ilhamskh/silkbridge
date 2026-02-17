'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, ChevronUp, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

export interface PartnerGalleryImage {
    url: string;
    alt: string;
}

interface PartnerGalleryEditorProps {
    value: PartnerGalleryImage[];
    onChange: (items: PartnerGalleryImage[]) => void;
    disabled?: boolean;
    maxImages?: number;
}

export function PartnerGalleryEditor({
    value,
    onChange,
    disabled,
    maxImages = 8,
}: PartnerGalleryEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0 || disabled) return;

        const slots = maxImages - value.length;
        if (slots <= 0) {
            setError(`Maximum ${maxImages} images allowed`);
            return;
        }

        const uploadFiles = Array.from(files).slice(0, slots);

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            uploadFiles.forEach((file) => formData.append('files', file));

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            const newItems = Array.isArray(result.urls)
                ? result.urls.map((url: string) => ({ url, alt: '' }))
                : [];

            if (newItems.length > 0) {
                onChange([...value, ...newItems]);
            }

            if (Array.isArray(result.errors) && result.errors.length > 0) {
                setError(result.errors.join(', '));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [disabled, maxImages, onChange, value]);

    const removeAt = useCallback(async (index: number) => {
        const item = value[index];
        const next = value.filter((_, i) => i !== index);
        onChange(next);

        if (item?.url?.startsWith('http')) {
            try {
                await fetch('/api/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: item.url }),
                });
            } catch {
                // Ignore storage deletion failure; state already updated.
            }
        }
    }, [onChange, value]);

    const updateAlt = useCallback((index: number, alt: string) => {
        const next = [...value];
        next[index] = { ...next[index], alt };
        onChange(next);
    }, [onChange, value]);

    const move = useCallback((index: number, direction: 'up' | 'down') => {
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= value.length) return;
        const next = [...value];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    }, [onChange, value]);

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700">Partner Gallery (optional)</label>
                <p className="mt-1 text-xs text-gray-400">Add 3-8 images for best results. First image is featured.</p>
            </div>

            <div
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                }}
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                    ${disabled ? 'pointer-events-none opacity-60' : ''}
                    ${isUploading ? 'pointer-events-none opacity-70' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Uploading...
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                        <Upload className="w-4 h-4" /> Click or drag to upload gallery images ({value.length}/{maxImages})
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {value.length > 0 && (
                <div className="space-y-3">
                    {value.map((item, index) => (
                        <div key={`${item.url}-${index}`} className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="flex items-start gap-3">
                                <div className="relative w-20 h-16 rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                    <img src={item.url} alt={item.alt || `Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <p className="text-xs text-gray-500 truncate">{item.url}</p>
                                    <input
                                        type="text"
                                        value={item.alt}
                                        onChange={(e) => updateAlt(index, e.target.value)}
                                        placeholder="Alt text (recommended)"
                                        disabled={disabled}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => move(index, 'up')}
                                        disabled={disabled || index === 0}
                                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                        aria-label="Move image up"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => move(index, 'down')}
                                        disabled={disabled || index === value.length - 1}
                                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                        aria-label="Move image down"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeAt(index)}
                                        disabled={disabled}
                                        className="p-1 text-red-500 hover:text-red-700"
                                        aria-label="Remove image"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
