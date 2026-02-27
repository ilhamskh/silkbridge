export default function InsightsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="h-6 w-24 rounded-lg bg-surface" />
                    <div className="h-3.5 w-64 rounded bg-surface" />
                </div>
                <div className="h-9 w-32 rounded-xl bg-surface" />
            </div>
            {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-card border border-border-light bg-white p-5 shadow-card flex gap-4">
                    <div className="h-14 w-14 rounded-xl bg-surface flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 rounded bg-surface" />
                        <div className="h-3 w-full rounded bg-surface" />
                        <div className="h-3 w-3/4 rounded bg-surface" />
                    </div>
                    <div className="h-8 w-16 rounded-xl bg-surface flex-shrink-0" />
                </div>
            ))}
        </div>
    );
}
