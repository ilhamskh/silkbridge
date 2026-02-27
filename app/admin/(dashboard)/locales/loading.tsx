export default function LocalesLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-1.5">
                <div className="h-6 w-32 rounded-lg bg-surface" />
                <div className="h-3.5 w-72 rounded bg-surface" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map(i => (
                    <div key={i} className="rounded-card border border-border-light bg-white p-5 shadow-card">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-surface" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-4 w-24 rounded bg-surface" />
                                <div className="h-3 w-16 rounded bg-surface" />
                            </div>
                            <div className="h-6 w-12 rounded-full bg-surface" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
