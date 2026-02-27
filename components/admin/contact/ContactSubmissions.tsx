'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import {
    Inbox,
    Mail,
    Phone,
    User,
    Calendar,
    Archive,
    AlertTriangle,
    X,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Heart,
    Sparkles,
    Filter,
    RefreshCw,
    Clock,
} from 'lucide-react';
import {
    getSubmissions,
    getSubmissionStats,
    updateSubmissionStatus,
} from '@/lib/admin/contact-actions';
import type { InquiryType, SubmissionStatus, ContactSubmission } from '@prisma/client';

// Type badge colors
const typeBadgeColors: Record<InquiryType, string> = {
    BUSINESS: 'bg-primary-100 text-primary-700',
    PATIENT: 'bg-rose-100 text-rose-700',
    TOUR: 'bg-emerald-100 text-emerald-700',
};

const typeIcons: Record<InquiryType, typeof Briefcase> = {
    BUSINESS: Briefcase,
    PATIENT: Heart,
    TOUR: Sparkles,
};

// Status badge colors
const statusBadgeColors: Record<SubmissionStatus, string> = {
    NEW: 'bg-primary-100 text-primary-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    ARCHIVED: 'bg-surface text-muted',
    SPAM: 'bg-red-100 text-red-700',
};

export default function ContactSubmissions() {
    const [isPending, startTransition] = useTransition();
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [stats, setStats] = useState({ new: 0, inProgress: 0, archived: 0, spam: 0, total: 0 });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
    const [filters, setFilters] = useState<{
        type?: InquiryType;
        status?: SubmissionStatus;
    }>({});
    const t = useTranslations('Admin');

    // Load submissions
    const loadSubmissions = useCallback(async (page = 1) => {
        startTransition(async () => {
            const result = await getSubmissions({ ...filters, page, limit: 10 });
            if (result.success && result.data) {
                setSubmissions(result.data);
                if (result.pagination) {
                    setPagination({
                        page: result.pagination.page,
                        totalPages: result.pagination.totalPages,
                        total: result.pagination.total,
                    });
                }
            }
        });
    }, [filters]);

    // Load stats
    const loadStats = useCallback(async () => {
        const result = await getSubmissionStats();
        if (result.success && result.data) {
            setStats(result.data);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadSubmissions();
        loadStats();
    }, [loadSubmissions, loadStats]);

    // Handle status change
    const handleStatusChange = async (id: string, status: SubmissionStatus) => {
        startTransition(async () => {
            const result = await updateSubmissionStatus(id, status);
            if (result.success) {
                loadSubmissions(pagination.page);
                loadStats();
                if (selectedSubmission?.id === id) {
                    setSelectedSubmission({ ...selectedSubmission, status });
                }
            }
        });
    };

    // Status key map
    const statusKeyMap: Record<SubmissionStatus, string> = {
        NEW: 'new',
        IN_PROGRESS: 'inProgress',
        ARCHIVED: 'archived',
        SPAM: 'spam',
    };

    // Type key map
    const typeKeyMap: Record<InquiryType, string> = {
        BUSINESS: 'business',
        PATIENT: 'patient',
        TOUR: 'tour',
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div
                    onClick={() => setFilters({})}
                    className={`cursor-pointer rounded-card border p-4 transition-all hover:shadow-card ${!filters.status
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-border-light bg-white'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                            <Inbox className="h-5 w-5 text-muted" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{stats.total}</p>
                            <p className="text-sm text-muted">{t('contact.submissions.stats.total')}</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilters({ status: 'NEW' })}
                    className={`cursor-pointer rounded-card border p-4 transition-all hover:shadow-card ${filters.status === 'NEW'
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-border-light bg-white'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                            <Mail className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{stats.new}</p>
                            <p className="text-sm text-muted">{t('contact.submissions.stats.newCount')}</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilters({ status: 'IN_PROGRESS' })}
                    className={`cursor-pointer rounded-card border p-4 transition-all hover:shadow-card ${filters.status === 'IN_PROGRESS'
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-border-light bg-white'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{stats.inProgress}</p>
                            <p className="text-sm text-muted">{t('contact.submissions.stats.inProgress')}</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilters({ status: 'ARCHIVED' })}
                    className={`cursor-pointer rounded-card border p-4 transition-all hover:shadow-card ${filters.status === 'ARCHIVED'
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-border-light bg-white'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                            <Archive className="h-5 w-5 text-muted" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{stats.archived}</p>
                            <p className="text-sm text-muted">{t('contact.submissions.stats.archived')}</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilters({ status: 'SPAM' })}
                    className={`cursor-pointer rounded-card border p-4 transition-all hover:shadow-card ${filters.status === 'SPAM'
                        ? 'border-red-300 bg-red-50'
                        : 'border-border-light bg-white'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{stats.spam}</p>
                            <p className="text-sm text-muted">Spam</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter by Type */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-2 text-sm text-muted">
                    <Filter className="h-4 w-4" />
                    {t('contact.submissions.columns.type')}:
                </span>
                <button
                    onClick={() => setFilters((f) => ({ ...f, type: undefined }))}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!filters.type
                        ? 'bg-ink text-white'
                        : 'bg-surface text-muted hover:bg-surface/80'
                        }`}
                >
                    {t('contact.submissions.filters.all')}
                </button>
                {(['BUSINESS', 'PATIENT', 'TOUR'] as InquiryType[]).map((type) => {
                    const Icon = typeIcons[type];
                    return (
                        <button
                            key={type}
                            onClick={() => setFilters((f) => ({ ...f, type }))}
                            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${filters.type === type
                                ? 'bg-ink text-white'
                                : 'bg-surface text-muted hover:bg-surface/80'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {t(`contact.routing.types.${typeKeyMap[type]}.label`)}
                        </button>
                    );
                })}
                <button
                    onClick={() => loadSubmissions(pagination.page)}
                    className="ml-auto flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface/80"
                >
                    <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Submissions Table */}
            <div className="overflow-hidden rounded-card border border-border-light bg-white shadow-card">
                {submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="h-16 w-16 rounded-full bg-surface flex items-center justify-center">
                            <Inbox className="h-8 w-8 text-muted" />
                        </div>
                        <p className="mt-4 font-medium text-ink">{t('contact.submissions.empty')}</p>
                        <p className="mt-1 text-sm text-muted">{t('contact.submissions.emptyDesc')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border-light bg-surface/50">
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                                        {t('contact.submissions.columns.date')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                                        {t('contact.submissions.columns.name')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                                        {t('contact.submissions.columns.type')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                                        {t('contact.submissions.columns.status')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {submissions.map((submission) => {
                                    const TypeIcon = typeIcons[submission.type];
                                    return (
                                        <tr
                                            key={submission.id}
                                            onClick={() => setSelectedSubmission(submission)}
                                            className="cursor-pointer transition-colors hover:bg-surface/50"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                                                {formatDistanceToNow(new Date(submission.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600">
                                                        <span className="text-white text-xs font-semibold">
                                                            {submission.name[0]?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-ink">
                                                            {submission.name}
                                                        </p>
                                                        <p className="text-sm text-muted">
                                                            {submission.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${typeBadgeColors[submission.type]}`}
                                                >
                                                    <TypeIcon className="h-3 w-3" />
                                                    {t(`contact.routing.types.${typeKeyMap[submission.type]}.label`)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeColors[submission.status]}`}
                                                >
                                                    {t(`contact.submissions.status.${statusKeyMap[submission.status]}`)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    {submission.status !== 'IN_PROGRESS' && submission.status !== 'ARCHIVED' && submission.status !== 'SPAM' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(submission.id, 'IN_PROGRESS'); }}
                                                            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-amber-100 hover:text-amber-600"
                                                            title={t('contact.submissions.actions.markInProgress')}
                                                        >
                                                            <Clock className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {submission.status !== 'ARCHIVED' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(submission.id, 'ARCHIVED'); }}
                                                            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
                                                            title={t('contact.submissions.actions.archive')}
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {submission.status !== 'SPAM' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(submission.id, 'SPAM'); }}
                                                            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-100 hover:text-red-600"
                                                            title={t('contact.submissions.actions.markSpam')}
                                                        >
                                                            <AlertTriangle className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {submission.status !== 'NEW' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(submission.id, 'NEW'); }}
                                                            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-primary-100 hover:text-primary-600"
                                                            title={t('contact.submissions.status.new')}
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border-light px-4 py-3">
                        <p className="text-sm text-muted">
                            {(pagination.page - 1) * 10 + 1}–{Math.min(pagination.page * 10, pagination.total)} / {pagination.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => loadSubmissions(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-muted">
                                {pagination.page} / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => loadSubmissions(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Submission Detail Drawer */}
            {selectedSubmission && (
                <div
                    className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
                    onClick={() => setSelectedSubmission(null)}
                >
                    <div
                        className="absolute bottom-0 right-0 top-0 w-full max-w-lg overflow-y-auto bg-white shadow-xl sm:max-w-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light bg-white/90 backdrop-blur-xl p-4">
                            <h3 className="text-lg font-heading font-semibold text-ink">
                                {t('contact.submissions.detail.message')}
                            </h3>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status + Type Badges */}
                            <div className="flex items-center justify-between">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusBadgeColors[selectedSubmission.status]}`}
                                >
                                    {t(`contact.submissions.status.${statusKeyMap[selectedSubmission.status]}`)}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${typeBadgeColors[selectedSubmission.type]}`}
                                >
                                    {t(`contact.routing.types.${typeKeyMap[selectedSubmission.type]}.label`)}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted" />
                                    <div>
                                        <p className="text-sm text-muted">{t('contact.submissions.columns.name')}</p>
                                        <p className="font-medium text-ink">{selectedSubmission.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted" />
                                    <div>
                                        <p className="text-sm text-muted">{t('contact.submissions.columns.email')}</p>
                                        <a href={`mailto:${selectedSubmission.email}`} className="font-medium text-primary-600 hover:underline">
                                            {selectedSubmission.email}
                                        </a>
                                    </div>
                                </div>

                                {selectedSubmission.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-muted" />
                                        <div>
                                            <p className="text-sm text-muted">{t('contact.submissions.detail.phone')}</p>
                                            <a href={`tel:${selectedSubmission.phone}`} className="font-medium text-ink">
                                                {selectedSubmission.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted" />
                                    <div>
                                        <p className="text-sm text-muted">{t('contact.submissions.detail.submitted')}</p>
                                        <p className="font-medium text-ink">
                                            {new Date(selectedSubmission.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted">{t('contact.submissions.detail.message')}</p>
                                <div className="rounded-xl bg-surface p-4">
                                    <p className="whitespace-pre-wrap text-ink">
                                        {selectedSubmission.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 border-t border-border-light pt-6">
                                <a
                                    href={`mailto:${selectedSubmission.email}?subject=Re: Your inquiry to SILKBRIDGE`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-700"
                                >
                                    <Mail className="h-4 w-4" />
                                    {t('contact.submissions.actions.reply')}
                                </a>

                                {selectedSubmission.status === 'NEW' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedSubmission.id, 'IN_PROGRESS')}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 px-4 py-2.5 font-medium text-amber-700 transition-colors hover:bg-amber-50"
                                    >
                                        <Clock className="h-4 w-4" />
                                        {t('contact.submissions.actions.markInProgress')}
                                    </button>
                                )}

                                {selectedSubmission.status !== 'ARCHIVED' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedSubmission.id, 'ARCHIVED')}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-border-light px-4 py-2.5 font-medium text-muted transition-colors hover:bg-surface"
                                    >
                                        <Archive className="h-4 w-4" />
                                        {t('contact.submissions.actions.archive')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
