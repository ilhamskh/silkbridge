'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const labels: Record<string, string> = {
    en: 'Copy link',
    az: 'Linki kopyala',
    ru: 'Скопировать',
};

const toastLabels: Record<string, string> = {
    en: 'Link copied to clipboard',
    az: 'Link buferə kopyalandı',
    ru: 'Ссылка скопирована',
};

export function CopyLinkButton({ locale }: { locale: string }) {
    const [copied, setCopied] = useState(false);
    const t = labels[locale] || labels.en;
    const toastText = toastLabels[locale] || toastLabels.en;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success(toastText);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-body-sm text-subtle hover:text-ink hover:bg-surface-elevated rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label={t}
        >
            {copied ? (
                <>
                    <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-primary-600 font-medium">Copied</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>{t}</span>
                </>
            )}
        </button>
    );
}
