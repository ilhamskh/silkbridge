export default function UsersLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="h-6 w-20 rounded-lg bg-surface" />
                    <div className="h-3.5 w-56 rounded bg-surface" />
                </div>
                <div className="h-9 w-28 rounded-xl bg-surface" />
            </div>
            <div className="rounded-card border border-border-light bg-white shadow-card overflow-hidden">
                <div className="border-b border-border-light px-6 py-4 bg-surface/40 flex gap-6">
                    {[32, 24, 16].map((w, i) => <div key={i} className={`h-3.5 w-${w} rounded bg-surface`} />)}
                </div>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border-light last:border-0">
                        <div className="h-10 w-10 rounded-full bg-surface" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-4 w-36 rounded bg-surface" />
                            <div className="h-3 w-48 rounded bg-surface" />
                        </div>
                        <div className="h-6 w-16 rounded-full bg-surface" />
                        <div className="h-8 w-8 rounded-lg bg-surface" />
                    </div>
                ))}
            </div>
        </div>
    );
}
