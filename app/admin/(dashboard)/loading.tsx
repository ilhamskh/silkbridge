// Layout-level loading — shown instantly on ANY admin page navigation
// The sidebar and header are already rendered via layout.tsx,
// so only the main content area shows this skeleton.
export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Page header skeleton */}
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-surface" />
                <div className="space-y-2">
                    <div className="h-5 w-48 rounded-lg bg-surface" />
                    <div className="h-3.5 w-72 rounded bg-surface" />
                </div>
            </div>

            {/* Card row skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-card border border-border-light bg-white p-6 shadow-card">
                        <div className="h-4 w-24 rounded bg-surface mb-4" />
                        <div className="h-8 w-16 rounded-lg bg-surface" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="rounded-card border border-border-light bg-white shadow-card overflow-hidden">
                <div className="border-b border-border-light px-6 py-4 bg-surface/40">
                    <div className="h-4 w-32 rounded bg-surface" />
                </div>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border-light last:border-0">
                        <div className="h-10 w-10 rounded-full bg-surface flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-40 rounded bg-surface" />
                            <div className="h-3 w-56 rounded bg-surface" />
                        </div>
                        <div className="h-6 w-16 rounded-full bg-surface" />
                    </div>
                ))}
            </div>
        </div>
    );
}
