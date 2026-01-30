'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ExternalLink, Building2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PartnerCardProps {
    partner: {
        id: string;
        name: string;
        logoUrl?: string;
        images: string[];
        location?: string;
        specialties: string[];
        websiteUrl?: string;
        description?: string;
    };
    index: number;
}

export function PartnerCard({ partner, index }: PartnerCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);

    const images = partner.images?.length > 0 ? partner.images : (partner.logoUrl ? [partner.logoUrl] : []);
    const hasMultipleImages = images.length > 1;

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Auto-advance on hover
    useEffect(() => {
        if (isHovered && hasMultipleImages) {
            const interval = setInterval(nextImage, 3000);
            return () => clearInterval(interval);
        }
    }, [isHovered, hasMultipleImages, nextImage]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!showLightbox) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowLightbox(false);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showLightbox, nextImage, prevImage]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
                {/* Image Gallery Section */}
                <div
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                    onClick={() => images.length > 0 && setShowLightbox(true)}
                >
                    {images.length > 0 ? (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={`${partner.name} - Image ${currentImageIndex + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Navigation Arrows */}
                            {hasMultipleImages && (
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={prevImage}
                                        className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-gray-800" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-800" />
                                    </button>
                                </div>
                            )}

                            {/* Image Indicators */}
                            {hasMultipleImages && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex(i);
                                            }}
                                            className={`
                                                h-1.5 rounded-full transition-all duration-300
                                                ${i === currentImageIndex
                                                    ? 'w-6 bg-white'
                                                    : 'w-1.5 bg-white/50 hover:bg-white/75'
                                                }
                                            `}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Image Count Badge */}
                            {hasMultipleImages && (
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                                    {currentImageIndex + 1}/{images.length}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-primary-300" />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                        {partner.name}
                    </h3>

                    {/* Location */}
                    {partner.location && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            <span>{partner.location}</span>
                        </div>
                    )}

                    {/* Description */}
                    {partner.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {partner.description}
                        </p>
                    )}

                    {/* Specialties */}
                    {partner.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {partner.specialties.slice(0, 3).map((specialty) => (
                                <span
                                    key={specialty}
                                    className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-full"
                                >
                                    {specialty}
                                </span>
                            ))}
                            {partner.specialties.length > 3 && (
                                <span className="px-2.5 py-1 text-xs text-gray-500">
                                    +{partner.specialties.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Website Link */}
                    {partner.websiteUrl && (
                        <Link
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group/link"
                        >
                            <span className="border-b border-transparent group-hover/link:border-primary-600 transition-colors">
                                Visit Website
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                    )}
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                        onClick={() => setShowLightbox(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowLightbox(false)}
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 text-white/70 text-sm">
                            {currentImageIndex + 1} / {images.length}
                        </div>

                        {/* Partner Name */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-medium">
                            {partner.name}
                        </div>

                        {/* Main Image */}
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative max-w-[90vw] max-h-[80vh] aspect-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[currentImageIndex]}
                                alt={`${partner.name} - Image ${currentImageIndex + 1}`}
                                width={1200}
                                height={800}
                                className="object-contain max-h-[80vh] rounded-lg"
                            />
                        </motion.div>

                        {/* Navigation */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Thumbnail Strip */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(i);
                                        }}
                                        className={`
                                            relative w-16 h-12 rounded-lg overflow-hidden transition-all
                                            ${i === currentImageIndex
                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50'
                                                : 'opacity-50 hover:opacity-80'
                                            }
                                        `}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
