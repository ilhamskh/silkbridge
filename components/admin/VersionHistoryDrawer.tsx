'use client';

import { useState, useEffect } from 'react';
import { AdminIcon } from './ui/AdminIcon';
import { AdminButton } from './ui/AdminButton';
import { AdminBadge } from './ui/AdminBadge';
import { AdminSkeleton } from './ui/AdminSkeleton';

interface VersionHistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    pageId: string;
    localeCode: string;
    onRestore: (version: VersionSnapshot) => void;
}

interface VersionSnapshot {
    id: string;
    createdAt: Date;
    title: string;
    blocksCount: number;
    status: 'DRAFT' | 'PUBLISHED';
    author: string | null;
}

// Mock data for now - in production this would come from an API
const generateMockVersions = (count: number): VersionSnapshot[] => {
    const versions: VersionSnapshot[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const date = new Date(now.getTime() - i * 3600000 * (Math.random() * 24 + 1));
        versions.push({
            id: `version-${i}`,
            createdAt: date,
            title: i === 0 ? 'Current version' : `Version ${count - i}`,
            blocksCount: Math.floor(Math.random() * 10) + 3,
            status: i === 0 || Math.random() > 0.5 ? 'DRAFT' : 'PUBLISHED',
            author: i % 2 === 0 ? 'Admin User' : 'Content Editor',
        });
    }

    return versions;
};

export default function VersionHistoryDrawer({
    isOpen,
    onClose,
    pageId,
    localeCode,
    onRestore,
}: VersionHistoryDrawerProps) {
    const [versions, setVersions] = useState<VersionSnapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setVersions(generateMockVersions(8));
                setIsLoading(false);
            }, 500);
        }
    }, [isOpen, pageId, localeCode]);

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-light">
                    <div>
                        <h2 className="font-heading font-semibold text-lg text-ink">Version History</h2>
                        <p className="text-sm text-muted mt-0.5">
                            Last 10 versions for this locale
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                    >
                        <AdminIcon name="close" className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 rounded-xl border border-border-light">
                                    <AdminSkeleton className="h-4 w-32 mb-2" />
                                    <AdminSkeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mx-auto mb-4">
                                <AdminIcon name="history" className="w-6 h-6 text-muted" />
                            </div>
                            <h4 className="font-medium text-ink mb-1">No version history</h4>
                            <p className="text-sm text-muted">
                                Versions will appear here as you save changes
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {versions.map((version, index) => (
                                <button
                                    key={version.id}
                                    onClick={() => setSelectedVersion(
                                        selectedVersion === version.id ? null : version.id
                                    )}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedVersion === version.id
                                            ? 'border-primary-400 bg-primary-50'
                                            : 'border-border-light hover:border-primary-200 hover:bg-surface'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {index === 0 ? (
                                                <AdminBadge variant="success" size="sm" dot>Current</AdminBadge>
                                            ) : (
                                                <span className="text-sm font-medium text-ink">
                                                    {version.title}
                                                </span>
                                            )}
                                        </div>
                                        <AdminBadge
                                            variant={version.status === 'PUBLISHED' ? 'published' : 'draft'}
                                            size="sm"
                                        >
                                            {version.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                        </AdminBadge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted">
                                        <span className="flex items-center gap-1">
                                            <AdminIcon name="time" className="w-3 h-3" />
                                            {formatDate(version.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <AdminIcon name="layout" className="w-3 h-3" />
                                            {version.blocksCount} blocks
                                        </span>
                                        {version.author && (
                                            <span className="flex items-center gap-1">
                                                <AdminIcon name="user" className="w-3 h-3" />
                                                {version.author}
                                            </span>
                                        )}
                                    </div>

                                    {/* Expanded actions */}
                                    {selectedVersion === version.id && index !== 0 && (
                                        <div className="mt-4 pt-4 border-t border-primary-200 flex gap-2">
                                            <AdminButton
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1"
                                                leftIcon={<AdminIcon name="eye" className="w-4 h-4" />}
                                            >
                                                Preview
                                            </AdminButton>
                                            <AdminButton
                                                variant="primary"
                                                size="sm"
                                                className="flex-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRestore(version);
                                                }}
                                                leftIcon={<AdminIcon name="history" className="w-4 h-4" />}
                                            >
                                                Restore
                                            </AdminButton>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border-light bg-surface">
                    <p className="text-xs text-muted text-center">
                        <AdminIcon name="info" className="w-3 h-3 inline mr-1" />
                        Version history stores up to 10 drafts per locale
                    </p>
                </div>
            </div>
        </>
    );
}
