'use client';

import { useState, useEffect, useTransition } from 'react';
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
    label: string;
    description: string;
    icon: typeof Briefcase;
    color: string;
}[] = [
        {
            type: 'PHARMA',
            label: 'Pharmaceutical Services',
            description: 'Market entry, regulatory, distribution inquiries',
            icon: Briefcase,
            color: 'blue',
        },
        {
            type: 'PATIENT',
            label: 'Patient / Health Tourism',
            description: 'Medical treatments, hospital coordination',
            icon: Heart,
            color: 'rose',
        },
        {
            type: 'WELLNESS',
            label: 'Wellness & Spa',
            description: 'Spa resorts, wellness packages',
            icon: Sparkles,
            color: 'emerald',
        },
    ];

export default function ContactRouting() {
    const [isPending, startTransition] = useTransition();
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
    const [selectedRecipients, setSelectedRecipients] = useState<Record<InquiryType, string>>({
        PHARMA: '',
        PATIENT: '',
        WELLNESS: '',
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
            setRoutingRules(rulesResult.data as RoutingRule[]);

            // Set initial selected recipients
            const initial: Record<InquiryType, string> = {
                PHARMA: '',
                PATIENT: '',
                WELLNESS: '',
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

    // Handle recipient selection
    const handleSelectRecipient = (type: InquiryType, recipientId: string) => {
        setSelectedRecipients((prev) => ({ ...prev, [type]: recipientId }));
        setOpenDropdown(null);
        setHasChanges(true);
        setSaveStatus('idle');
    };

    // Save all routing rules
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
                    <h2 className="text-xl font-semibold text-slate-900
                        Email Routing Rules
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Configure where each inquiry type should be sent
                    </p>
                </div>

                {hasChanges && (
                    <button
                        onClick={handleSaveAll}
                        disabled={isPending}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${saveStatus === 'saved'
                                ? 'bg-emerald-600 text-white'
                                : saveStatus === 'error'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                    >
                        {saveStatus === 'saving' ? (
                            <>Saving...</>
                        ) : saveStatus === 'saved' ? (
                            <>
                                <Check className="h-4 w-4" />
                                Saved
                            </>
                        ) : saveStatus === 'error' ? (
                            <>
                                <AlertCircle className="h-4 w-4" />
                                Error
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* No recipients warning */}
            {activeRecipients.length === 0 && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 />
                        <div>
                            <p className="font-medium text-yellow-800
                                No active recipients
                            </p>
                            <p className="text-sm text-yellow-600
                                Add recipients in the Recipients tab before configuring routing.
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
                        blue: 'bg-primary-100 text-primary-600
                        rose: 'bg-rose-100 text-rose-600
                        emerald:
                            'bg-emerald-100 text-emerald-600
                    };

                    return (
                        <div
                            key={config.type}
                            className="rounded-xl border border-slate-200 bg-white p-5
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
                                        <h3 className="font-medium text-slate-900
                                            {config.label}
                                        </h3>
                                        <p className="text-sm text-slate-500">{config.description}</p>
                                    </div>
                                </div>

                                {/* Recipient Dropdown */}
                                <div className="relative min-w-[280px]">
                                    <button
                                        onClick={() =>
                                            setOpenDropdown(isOpen ? null : config.type)
                                        }
                                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-left transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                                        disabled={activeRecipients.length === 0}
                                    >
                                        {selectedRecipient ? (
                                            <div>
                                                <p className="font-medium text-slate-900
                                                    {selectedRecipient.label}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {selectedRecipient.email}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">Select recipient...</span>
                                        )}
                                        <ChevronDown
                                            className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isOpen && activeRecipients.length > 0 && (
                                        <div className="absolute z-10 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-xl
                                            {activeRecipients.map((recipient) => (
                                                <button
                                                    key={recipient.id}
                                                    onClick={() =>
                                                        handleSelectRecipient(
                                                            config.type,
                                                            recipient.id
                                                        )
                                                    }
                                                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-slate-50 ${selectedId === recipient.id
                                                            ? 'bg-primary-50
                                                            : ''
                                                        }`}
                                                >
                                                    <div>
                                                        <p
                                                            className={`font-medium ${selectedId === recipient.id
                                                                    ? 'text-primary-600'
                                                                    : 'text-slate-900
                                                                }`}
                                                        >
                                                            {recipient.label}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
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
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4
                <div className="flex items-start gap-3">
                    <GitBranch className="mt-0.5 h-5 w-5 text-slate-400" />
                    <div className="text-sm text-slate-600
                        <p className="font-medium text-slate-900
                            How routing works
                        </p>
                        <p className="mt-1">
                            When a visitor submits the contact form, the email notification is sent
                            to the recipient assigned to that inquiry type. If no routing is
                            configured or the assigned recipient is inactive, the email will be
                            sent to the first active recipient as a fallback.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
