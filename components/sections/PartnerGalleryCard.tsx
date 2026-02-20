'use client';

import { useRef, useState } from 'react';
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
    const images = (partner.galleryImages ?? []).filter((item) => !!item.url);
    const coverImage = images[0];
    const hasWebsite = Boolean(partner.websiteUrl);
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const suppressWebsiteUntilRef = useRef(0);

    const openLightbox = (index = 0) => {
        if (!images.length) return;
        setCurrentIndex(index);
        setOpen(true);
    };

    const handleCardOpenWebsite = () => {
        if (!partner.websiteUrl) return;
        if (Date.now() < suppressWebsiteUntilRef.current) return;
        window.open(partner.websiteUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCloseLightbox = () => {
        suppressWebsiteUntilRef.current = Date.now() + 400;
        setOpen(false);
    };

    return (
        <article
            className={`group h-full flex flex-col bg-white rounded-2xl border border-border-light shadow-sm hover:shadow-card hover:border-primary-200 hover:-translate-y-0.5 motion-reduce:transform-none transition-all duration-200 overflow-hidden ${hasWebsite ? 'cursor-pointer' : ''}`}
            onClick={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest('[data-no-card-link="true"]')) return;
                handleCardOpenWebsite();
            }}
            onKeyDown={(event) => {
                if (!hasWebsite) return;
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleCardOpenWebsite();
                }
            }}
            role={hasWebsite ? 'link' : undefined}
            tabIndex={hasWebsite ? 0 : undefined}
        >
            <div className="p-4 pb-0">
                {coverImage ? (
                    <button
                        ref={triggerRef}
                        type="button"
                        data-no-card-link="true"
                        onClick={(event) => {
                            event.stopPropagation();
                            openLightbox(0);
                        }}
                        aria-label={t('viewGallery')}
                        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface border border-border-light"
                    >
                        <Image
                            src={coverImage.url}
                            alt={coverImage.alt || `${partner.name} ${t('image')}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                            className="object-cover"
                        />
                        {images.length > 1 && (
                            <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-[0.06em] uppercase bg-black/55 text-white backdrop-blur-sm">
                                {images.length}
                            </span>
                        )}
                    </button>
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

            <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
                <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.08em] bg-surface text-muted border border-border-light">
                    {partner.categoryLabel}
                </span>

                <h3 className="mt-3 font-heading text-xl text-ink leading-snug line-clamp-2">
                    {partner.name}
                </h3>

                {partner.description && (
                    <p className="mt-3 text-sm text-muted line-clamp-3 min-h-[4rem]">{partner.description}</p>
                )}

                {(partner.location || partner.specialties.length > 0) && (
                    <p className="mt-4 text-xs text-muted line-clamp-1">
                        {partner.location}
                        {partner.location && partner.specialties.length > 0 ? ' · ' : ''}
                        {partner.specialties.slice(0, 1).join('')}
                    </p>
                )}

                {partner.websiteUrl && (
                    <a
                        data-no-card-link="true"
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary-700 hover:text-primary-800"
                    >
                        {t('visitWebsite')} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                )}

                <div className="mt-auto" />
            </div>

            {images.length > 1 && (
                <div className="px-5 pb-5 -mt-1">
                    <div className="flex gap-2">
                        {images.slice(0, 3).map((image, index) => (
                            <button
                                key={`${image.url}-${index}`}
                                type="button"
                                data-no-card-link="true"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    openLightbox(index);
                                }}
                                aria-label={t('viewGallery')}
                                className="relative w-12 h-9 rounded-md overflow-hidden border border-border-light"
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt || `${partner.name} ${t('image')} ${index + 1}`}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <PartnerLightbox
                isOpen={open}
                partnerName={partner.name}
                galleryAriaLabel={t('galleryAriaLabel', { name: partner.name })}
                imageLabel={t('image')}
                images={images}
                currentIndex={currentIndex}
                onClose={handleCloseLightbox}
                onPrev={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                onNext={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                closeLabel={t('closeGallery')}
                previousLabel={t('previousImage')}
                nextLabel={t('nextImage')}
                returnFocusRef={triggerRef.current}
            />
        </article>
    );
}
