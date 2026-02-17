'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PartnerLightbox } from './PartnerLightbox';

export interface GalleryImage {
    url: string;
    alt: string;
}

interface PartnerGalleryCardProps {
    partner: {
        name: string;
        logoUrl: string | null;
        websiteUrl: string | null;
        description: string | null;
        location: string | null;
        specialties: string[];
        categoryLabel: string;
        galleryImages?: GalleryImage[];
    };
}

export function PartnerGalleryCard({ partner }: PartnerGalleryCardProps) {
    const t = useTranslations('partnersPage.ui');
    const images = useMemo(() => (partner.galleryImages ?? []).filter((item) => !!item.url), [partner.galleryImages]);
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const lastTriggerRef = useRef<HTMLElement | null>(null);

    const openLightboxAt = (index: number) => {
        if (!images.length) return;
        lastTriggerRef.current = triggerRefs.current[index];
        setCurrent(index);
        setOpen(true);
    };

    return (
        <article className="group h-full flex flex-col bg-white rounded-2xl border border-border-light shadow-card hover:shadow-card-hover hover:-translate-y-0.5 motion-reduce:transform-none transition-all duration-200 overflow-hidden">
            <div className="p-4 border-b border-border-light">
                {images.length > 0 ? (
                    <div className="space-y-2">
                        <button
                            ref={(node) => {
                                triggerRefs.current[0] = node;
                            }}
                            type="button"
                            onClick={() => openLightboxAt(0)}
                            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface border border-border-light"
                        >
                            <Image
                                src={images[0].url}
                                alt={images[0].alt || `${partner.name} ${t('image')}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                            />
                        </button>

                        <div className="overflow-x-auto snap-x snap-mandatory pb-1">
                            <div className="flex gap-2 min-w-max">
                                {images.slice(0, 6).map((image, index) => (
                                    <button
                                        key={`${image.url}-${index}`}
                                        ref={(node) => {
                                            triggerRefs.current[index] = node;
                                        }}
                                        type="button"
                                        onClick={() => openLightboxAt(index)}
                                        className={`relative snap-start w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border ${index === current ? 'border-primary-500' : 'border-border-light'} bg-surface`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt || `${partner.name} ${t('image')} ${index + 1}`}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary-50 to-blue-100 border border-blue-100 flex items-center justify-center">
                        {partner.logoUrl ? (
                            <Image
                                src={partner.logoUrl}
                                alt={partner.name}
                                width={140}
                                height={72}
                                sizes="140px"
                                className="object-contain max-h-[4.5rem]"
                            />
                        ) : (
                            <span className="text-primary-700 font-heading text-3xl font-bold">{partner.name.charAt(0)}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="px-5 pt-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border-light flex items-center justify-center overflow-hidden flex-shrink-0">
                        {partner.logoUrl ? (
                            <Image
                                src={partner.logoUrl}
                                alt={partner.name}
                                width={40}
                                height={40}
                                sizes="40px"
                                className="object-contain w-full h-full p-1"
                            />
                        ) : (
                            <span className="text-primary-700 font-semibold">{partner.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-heading text-lg text-ink line-clamp-1">{partner.name}</h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                            {partner.categoryLabel}
                        </span>
                    </div>
                </div>

                {partner.description && (
                    <p className="mt-3 text-sm text-muted line-clamp-2 min-h-[2.75rem]">{partner.description}</p>
                )}
            </div>

            <div className="mt-auto px-5 pb-5 pt-4 border-t border-border-light">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {partner.location && (
                            <p className="text-xs text-muted line-clamp-1">{partner.location}</p>
                        )}
                        {partner.specialties.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {partner.specialties.slice(0, 2).map((item, index) => (
                                    <span key={`${item}-${index}`} className="px-2 py-0.5 rounded-full text-xs bg-primary-50 text-primary-700">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {partner.websiteUrl && (
                        <a
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-primary-700 hover:text-primary-800 whitespace-nowrap"
                        >
                            {t('visitWebsite')} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            </div>

            <PartnerLightbox
                isOpen={open}
                partnerName={partner.name}
                galleryAriaLabel={t('galleryAriaLabel', { name: partner.name })}
                imageLabel={t('image')}
                images={images}
                currentIndex={current}
                onClose={() => setOpen(false)}
                onPrev={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
                onNext={() => setCurrent((prev) => (prev + 1) % images.length)}
                closeLabel={t('closeGallery')}
                previousLabel={t('previousImage')}
                nextLabel={t('nextImage')}
                returnFocusRef={lastTriggerRef.current}
            />
        </article>
    );
}
