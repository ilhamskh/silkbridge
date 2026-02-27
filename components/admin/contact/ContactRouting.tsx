'use client';

import { useState, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import {
    GitBranch,
    Briefcase,
    Heart,
    Sparkles,
    ChevronDown,
    Check,
    AlertCircle,
    Save,
} from 'lucide-react';
import { getRecipients, getRoutingRules, updateRoutingRule } from '@/lib/admin/contact-actions';
import type { InquiryType } from '@prisma/client';

interface Recipient {
    id: string;
    label: string;
    email: string;
    isActive: boolean;
}

interface RoutingRule {
    id: string;
    type: InquiryType;
    recipientId: string;
    isActive: boolean;
    recipient: Recipient;
}

const inquiryTypeConfig: {
    type: InquiryType;
    translationKey: string;
    icon: typeof Briefcase;
    color: string;
}[] = [
        {
            type: 'BUSINESS',
            translationKey: 'business',
            icon: Briefcase,
            color: 'blue',
        },
        {
            type: 'PATIENT',
            translationKey: 'patient',
            icon: Heart,
            color: 'rose',
        },
        {
            type: 'TOUR',
            translationKey: 'tour',
            icon: Sparkles,
            color: 'emerald',
        },
    ];

export default function ContactRouting() {
    const [isPending, startTransition] = useTransition();
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const t = useTranslations('Admin');

    const [selectedRecipients, setSelectedRecipients] = useState<Record<InquiryType, string>>({
        BUSINESS: '',
        PATIENT: '',
        TOUR: '',
    });
    const [openDropdown, setOpenDropdown] = useState<InquiryType | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // Load data
    const loadData = async () => {
        const [recipientsResult, rulesResult] = await Promise.all([
            getRecipients(),
            getRoutingRules(),
        ]);

        if (recipientsResult.success && recipientsResult.data) {
            setRecipients(recipientsResult.data.filter((r) => r.isActive) as Recipient[]);
        }

        if (rulesResult.success && rulesResult.data) {
            const initial: Record<InquiryType, string> = {
                BUSINESS: '',
                PATIENT: '',
                TOUR: '',
            };
            rulesResult.data.forEach((rule: RoutingRule) => {
                initial[rule.type] = rule.recipientId;
            });
            setSelectedRecipients(initial);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSelectRecipient = (type: InquiryType, recipientId: string) => {
        setSelectedRecipients((prev) => ({ ...prev, [type]: recipientId }));
        setOpenDropdown(null);
        setHasChanges(true);
        setSaveStatus('idle');
    };

    const handleSaveAll = async () => {
        setSaveStatus('saving');

        startTransition(async () => {
            try {
                const promises = Object.entries(selectedRecipients)
                    .filter(([, recipientId]) => recipientId)
                    .map(([type, recipientId]) =>
                        updateRoutingRule(type as InquiryType, recipientId)
                    );

                const results = await Promise.all(promises);
                const allSuccess = results.every((r) => r.success);

                if (allSuccess) {
                    setSaveStatus('saved');
                    setHasChanges(false);
                    loadData();
                    setTimeout(() => setSaveStatus('idle'), 2000);
                } else {
                    setSaveStatus('error');
                }
            } catch {
                setSaveStatus('error');
            }
        });
    };

    const activeRecipients = recipients.filter((r) => r.isActive);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading font-semibold text-ink">
                        {t('contact.routing.title')}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        {t('contact.routing.subtitle')}
                    </p>
                </div>

                {hasChanges && (
                    <button
                        onClick={handleSaveAll}
                        disabled={isPending}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors ${saveStatus === 'saved'
                            ? 'bg-emerald-600 text-white'
                            : saveStatus === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                    >
                        {saveStatus === 'saving' ? (
                            <>{t('contact.routing.saving')}</>
                        ) : saveStatus === 'saved' ? (
                            <>
                                <Check className="h-4 w-4" />
                                {t('contact.routing.saved')}
                            </>
                        ) : saveStatus === 'error' ? (
                            <>
                                <AlertCircle className="h-4 w-4" />
                                {t('contact.routing.error')}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {t('contact.routing.saveChanges')}
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* No recipients warning */}
            {activeRecipients.length === 0 && (
                <div className="rounded-card border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <div>
                            <p className="font-medium text-amber-800">
                                {t('contact.routing.noRecipients')}
                            </p>
                            <p className="text-sm text-amber-600">
                                {t('contact.routing.noRecipientsHelp')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Routing Rules */}
            <div className="space-y-4">
                {inquiryTypeConfig.map((config) => {
                    const Icon = config.icon;
                    const selectedId = selectedRecipients[config.type];
                    const selectedRecipient = recipients.find((r) => r.id === selectedId);
                    const isOpen = openDropdown === config.type;

                    const colorClasses = {
                        blue: 'bg-primary-100 text-primary-600',
                        rose: 'bg-rose-100 text-rose-600',
                        emerald: 'bg-emerald-100 text-emerald-600',
                    };

                    return (
                        <div
                            key={config.type}
                            className="rounded-card border border-border-light bg-white p-5 shadow-card"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                {/* Type Info */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[config.color as keyof typeof colorClasses]}`}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-ink">
                                            {t(`contact.routing.types.${config.translationKey}.label`)}
                                        </h3>
                                        <p className="text-sm text-muted">
                                            {t(`contact.routing.types.${config.translationKey}.description`)}
                                        </p>
                                    </div>
                                </div>

                                {/* Recipient Dropdown */}
                                <div className="relative min-w-[280px]">
                                    <button
                                        onClick={() =>
                                            setOpenDropdown(isOpen ? null : config.type)
                                        }
                                        className="flex w-full items-center justify-between rounded-xl border border-border-light bg-white px-4 py-2.5 text-left transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        disabled={activeRecipients.length === 0}
                                    >
                                        {selectedRecipient ? (
                                            <div>
                                                <p className="font-medium text-ink">
                                                    {selectedRecipient.label}
                                                </p>
                                                <p className="text-sm text-muted">
                                                    {selectedRecipient.email}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-muted">{t('contact.routing.selectRecipient')}</span>
                                        )}
                                        <ChevronDown
                                            className={`h-5 w-5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isOpen && activeRecipients.length > 0 && (
                                        <div className="absolute z-10 mt-2 w-full rounded-card border border-border-light bg-white shadow-card">
                                            {activeRecipients.map((recipient) => (
                                                <button
                                                    key={recipient.id}
                                                    onClick={() =>
                                                        handleSelectRecipient(
                                                            config.type,
                                                            recipient.id
                                                        )
                                                    }
                                                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-surface ${selectedId === recipient.id
                                                        ? 'bg-primary-50'
                                                        : ''
                                                        }`}
                                                >
                                                    <div>
                                                        <p
                                                            className={`font-medium ${selectedId === recipient.id
                                                                ? 'text-primary-600'
                                                                : 'text-ink'
                                                                }`}
                                                        >
                                                            {recipient.label}
                                                        </p>
                                                        <p className="text-sm text-muted">
                                                            {recipient.email}
                                                        </p>
                                                    </div>
                                                    {selectedId === recipient.id && (
                                                        <Check className="h-5 w-5 text-primary-600" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Help Text */}
            <div className="rounded-card border border-border-light bg-surface p-4">
                <div className="flex items-start gap-3">
                    <GitBranch className="mt-0.5 h-5 w-5 text-muted" />
                    <div className="text-sm text-muted">
                        <p className="font-medium text-ink">
                            {t('contact.routing.howItWorks')}
                        </p>
                        <p className="mt-1">
                            {t('contact.routing.howItWorksDetail')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
