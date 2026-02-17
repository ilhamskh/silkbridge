'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from './PartnerGalleryCard';

interface PartnerLightboxProps {
    isOpen: boolean;
    partnerName: string;
    galleryAriaLabel: string;
    imageLabel: string;
    images: GalleryImage[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    closeLabel: string;
    previousLabel: string;
    nextLabel: string;
    returnFocusRef?: HTMLElement | null;
}

export function PartnerLightbox({
    isOpen,
    partnerName,
    galleryAriaLabel,
    imageLabel,
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
    closeLabel,
    previousLabel,
    nextLabel,
    returnFocusRef,
}: PartnerLightboxProps) {
    const [mounted, setMounted] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const scrollYRef = useRef(0);
    const onCloseRef = useRef(onClose);
    const onPrevRef = useRef(onPrev);
    const onNextRef = useRef(onNext);

    useEffect(() => {
        onCloseRef.current = onClose;
        onPrevRef.current = onPrev;
        onNextRef.current = onNext;
    }, [onClose, onPrev, onNext]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen || !mounted) return;

        const previousStyles = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            top: document.body.style.top,
            left: document.body.style.left,
            right: document.body.style.right,
            width: document.body.style.width,
        };

        scrollYRef.current = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollYRef.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';

        const previousActive = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key === 'ArrowRight' && images.length > 1) {
                event.preventDefault();
                onNextRef.current();
                return;
            }

            if (event.key === 'ArrowLeft' && images.length > 1) {
                event.preventDefault();
                onPrevRef.current();
                return;
            }

            if (event.key === 'Tab' && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                    'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousStyles.overflow;
            document.body.style.position = previousStyles.position;
            document.body.style.top = previousStyles.top;
            document.body.style.left = previousStyles.left;
            document.body.style.right = previousStyles.right;
            document.body.style.width = previousStyles.width;

            window.scrollTo({ top: scrollYRef.current, behavior: 'auto' });
            (returnFocusRef ?? previousActive)?.focus?.();
        };
    }, [images.length, isOpen, mounted, returnFocusRef]);

    if (!mounted || !isOpen || images.length === 0) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={galleryAriaLabel}
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                className="relative w-full max-w-5xl"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white"
                    aria-label={closeLabel}
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative aspect-[16/10] bg-black rounded-xl overflow-hidden">
                    <Image
                        src={images[currentIndex].url}
                        alt={images[currentIndex].alt || `${partnerName} ${imageLabel} ${currentIndex + 1}`}
                        fill
                        sizes="90vw"
                        className="object-contain"
                        priority
                    />
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={onPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white"
                            aria-label={previousLabel}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={onNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white"
                            aria-label={nextLabel}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}
