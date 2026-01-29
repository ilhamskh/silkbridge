'use client';

import { useState, useEffect, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns';
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
} from 'lucide-react';
import {
    getSubmissions,
    getSubmissionStats,
    updateSubmissionStatus,
} from '@/lib/admin/contact-actions';
import type { InquiryType, SubmissionStatus, ContactSubmission } from '@prisma/client';

// Type badge colors
const typeBadgeColors: Record<InquiryType, string> = {
    PHARMA: 'bg-primary-100 text-primary-700
    PATIENT: 'bg-rose-100 text-rose-700
    WELLNESS: 'bg-emerald-100 text-emerald-700
};

const typeIcons: Record<InquiryType, typeof Briefcase> = {
    PHARMA: Briefcase,
    PATIENT: Heart,
    WELLNESS: Sparkles,
};

const typeLabels: Record<InquiryType, string> = {
    PHARMA: 'Pharmaceutical',
    PATIENT: 'Patient / Health',
    WELLNESS: 'Wellness & Spa',
};

// Status badge colors
const statusBadgeColors: Record<SubmissionStatus, string> = {
    NEW: 'bg-primary-100 text-primary-700
    ARCHIVED: 'bg-slate-100 text-slate-600
    SPAM: 'bg-red-100 text-red-700
};

export default function ContactSubmissions() {
    const [isPending, startTransition] = useTransition();
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [stats, setStats] = useState({ new: 0, archived: 0, spam: 0, total: 0 });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
    const [filters, setFilters] = useState<{
        type?: InquiryType;
        status?: SubmissionStatus;
    }>({});

    // Load submissions
    const loadSubmissions = async (page = 1) => {
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
    };

    // Load stats
    const loadStats = async () => {
        const result = await getSubmissionStats();
        if (result.success && result.data) {
            setStats(result.data);
        }
    };

    // Initial load
    useEffect(() => {
        loadSubmissions();
        loadStats();
    }, [filters]);

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

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    onClick={() => setFilters({})}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${!filters.status
                            ? 'border-primary-300 bg-primary-50
                            : 'border-slate-200 bg-white
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100
                            <Inbox className="h-5 w-5 text-slate-600 />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900
                                {stats.total}
                            </p>
                            <p className="text-sm text-slate-500">All</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilters({ status: 'NEW' })}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${filters.status === 'NEW'
                            ? 'border-primary-300 bg-primary-50
                            : 'border-slate-200 bg-white
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100
                            <Mail className="h-5 w-5 text-primary-600 />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900
                                {stats.new}
                            </p>
                            <p className="text-sm text-slate-500">New</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilters({ status: 'ARCHIVED' })}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${filters.status === 'ARCHIVED'
                            ? 'border-primary-300 bg-primary-50
                            : 'border-slate-200 bg-white
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100
                            <Archive className="h-5 w-5 text-slate-600 />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900
                                {stats.archived}
                            </p>
                            <p className="text-sm text-slate-500">Archived</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilters({ status: 'SPAM' })}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${filters.status === 'SPAM'
                            ? 'border-primary-300 bg-primary-50
                            : 'border-slate-200 bg-white
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100
                            <AlertTriangle className="h-5 w-5 text-red-600 />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900
                                {stats.spam}
                            </p>
                            <p className="text-sm text-slate-500">Spam</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter by Type */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                    <Filter className="h-4 w-4" />
                    Filter by type:
                </span>
                <button
                    onClick={() => setFilters((f) => ({ ...f, type: undefined }))}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!filters.type
                            ? 'bg-slate-900 text-white
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200
                        }`}
                >
                    All Types
                </button>
                {(['PHARMA', 'PATIENT', 'WELLNESS'] as InquiryType[]).map((type) => {
                    const Icon = typeIcons[type];
                    return (
                        <button
                            key={type}
                            onClick={() => setFilters((f) => ({ ...f, type }))}
                            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${filters.type === type
                                    ? 'bg-slate-900 text-white
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {typeLabels[type]}
                        </button>
                    );
                })}
                <button
                    onClick={() => loadSubmissions(pagination.page)}
                    className="ml-auto flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200
                >
                    <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Submissions Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white
                {submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Inbox className="h-12 w-12 text-slate-300 />
                        <p className="mt-4 text-slate-500">No submissions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200
                                {submissions.map((submission) => {
                                    const TypeIcon = typeIcons[submission.type];
                                    return (
                                        <tr
                                            key={submission.id}
                                            onClick={() => setSelectedSubmission(submission)}
                                            className="cursor-pointer transition-colors hover:bg-slate-50
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                {formatDistanceToNow(new Date(submission.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100
                                                        <User className="h-4 w-4 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900
                                                            {submission.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
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
                                                    {typeLabels[submission.type]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeColors[submission.status]}`}
                                                >
                                                    {submission.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {submission.status !== 'ARCHIVED' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(
                                                                    submission.id,
                                                                    'ARCHIVED'
                                                                );
                                                            }}
                                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600
                                                            title="Archive"
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {submission.status !== 'SPAM' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(
                                                                    submission.id,
                                                                    'SPAM'
                                                                );
                                                            }}
                                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600
                                                            title="Mark as spam"
                                                        >
                                                            <AlertTriangle className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {submission.status !== 'NEW' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(submission.id, 'NEW');
                                                            }}
                                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary-100 hover:text-primary-600
                                                            title="Mark as new"
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
                    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3
                        <p className="text-sm text-slate-500">
                            Showing {(pagination.page - 1) * 10 + 1} to{' '}
                            {Math.min(pagination.page * 10, pagination.total)} of {pagination.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => loadSubmissions(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-50
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-slate-600
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => loadSubmissions(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-50
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
                    className="fixed inset-0 z-50 bg-black/50"
                    onClick={() => setSelectedSubmission(null)}
                >
                    <div
                        className="absolute bottom-0 right-0 top-0 w-full max-w-lg overflow-y-auto bg-white shadow-xl sm:max-w-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-4
                            <h3 className="text-lg font-semibold text-slate-900
                                Submission Details
                            </h3>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusBadgeColors[selectedSubmission.status]}`}
                                >
                                    {selectedSubmission.status}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${typeBadgeColors[selectedSubmission.type]}`}
                                >
                                    {typeLabels[selectedSubmission.type]}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-500">Name</p>
                                        <p className="font-medium text-slate-900
                                            {selectedSubmission.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-500">Email</p>
                                        <a
                                            href={`mailto:${selectedSubmission.email}`}
                                            className="font-medium text-primary-600 hover:underline"
                                        >
                                            {selectedSubmission.email}
                                        </a>
                                    </div>
                                </div>

                                {selectedSubmission.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <p className="text-sm text-slate-500">Phone</p>
                                            <a
                                                href={`tel:${selectedSubmission.phone}`}
                                                className="font-medium text-slate-900
                                            >
                                                {selectedSubmission.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-500">Submitted</p>
                                        <p className="font-medium text-slate-900
                                            {new Date(selectedSubmission.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-500">Message</p>
                                <div className="rounded-lg bg-slate-50 p-4
                                    <p className="whitespace-pre-wrap text-slate-900
                                        {selectedSubmission.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 border-t border-slate-200 pt-6
                                <a
                                    href={`mailto:${selectedSubmission.email}?subject=Re: Your inquiry to SILKBRIDGE`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-700"
                                >
                                    <Mail className="h-4 w-4" />
                                    Reply via Email
                                </a>

                                {selectedSubmission.status !== 'ARCHIVED' && (
                                    <button
                                        onClick={() =>
                                            handleStatusChange(selectedSubmission.id, 'ARCHIVED')
                                        }
                                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50
                                    >
                                        <Archive className="h-4 w-4" />
                                        Archive
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
