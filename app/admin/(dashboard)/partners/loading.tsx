export default function PartnersLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="h-6 w-28 rounded-lg bg-surface" />
                    <div className="h-3.5 w-60 rounded bg-surface" />
                </div>
                <div className="h-9 w-32 rounded-xl bg-surface" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="rounded-card border border-border-light bg-white p-5 shadow-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-xl bg-surface" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-4 w-28 rounded bg-surface" />
                                <div className="h-3 w-20 rounded bg-surface" />
                            </div>
                        </div>
                        <div className="h-3 w-full rounded bg-surface" />
                    </div>
                ))}
            </div>
        </div>
    );
}
