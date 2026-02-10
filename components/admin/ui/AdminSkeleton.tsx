interface AdminSkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'shimmer' | 'none';
}

export function AdminSkeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
}: AdminSkeletonProps) {
    const baseStyles = 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]';

    const variantStyles = {
        text: 'rounded-md h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    const animationStyles = {
        pulse: 'animate-pulse',
        shimmer: 'animate-[shimmer_1.5s_ease-in-out_infinite]',
        none: '',
    };

    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div
            className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${animationStyles[animation]}
                ${className}
            `}
            style={style}
            aria-hidden="true"
        />
    );
}

// Pre-built skeleton patterns for common UI elements
export function AdminSkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-border-light p-6 space-y-4">
            <div className="flex items-center gap-4">
                <AdminSkeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <AdminSkeleton variant="text" width="60%" />
                    <AdminSkeleton variant="text" width="40%" className="h-3" />
                </div>
            </div>
            <AdminSkeleton height={100} />
            <div className="flex gap-2">
                <AdminSkeleton width={80} height={32} className="rounded-lg" />
                <AdminSkeleton width={80} height={32} className="rounded-lg" />
            </div>
        </div>
    );
}

export function AdminSkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 px-4 py-3 bg-surface rounded-xl">
                <AdminSkeleton variant="text" width="25%" />
                <AdminSkeleton variant="text" width="20%" />
                <AdminSkeleton variant="text" width="15%" />
                <AdminSkeleton variant="text" width="15%" />
                <AdminSkeleton variant="text" width="10%" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 px-4 py-4 bg-white rounded-xl border border-border-light">
                    <AdminSkeleton variant="text" width="25%" />
                    <AdminSkeleton variant="text" width="20%" />
                    <AdminSkeleton variant="text" width="15%" />
                    <AdminSkeleton variant="text" width="15%" />
                    <AdminSkeleton variant="text" width="10%" />
                </div>
            ))}
        </div>
    );
}

export function AdminSkeletonEditor() {
    return (
        <div className="flex gap-6">
            {/* Left panel */}
            <div className="flex-1 space-y-4">
                <AdminSkeleton height={56} />
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <AdminSkeleton key={i} height={120} />
                    ))}
                </div>
            </div>
            {/* Right panel (preview) */}
            <div className="w-[400px] space-y-4">
                <div className="flex gap-2">
                    <AdminSkeleton width={60} height={32} className="rounded-lg" />
                    <AdminSkeleton width={60} height={32} className="rounded-lg" />
                    <AdminSkeleton width={60} height={32} className="rounded-lg" />
                </div>
                <AdminSkeleton height={600} />
            </div>
        </div>
    );
}
