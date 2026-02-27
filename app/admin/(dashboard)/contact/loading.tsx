export default function ContactLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-surface" />
                <div className="space-y-2">
                    <div className="h-5 w-44 rounded-lg bg-surface" />
                    <div className="h-3.5 w-64 rounded bg-surface" />
                </div>
            </div>
            {/* Tab bar */}
            <div className="h-11 w-80 rounded-xl bg-surface" />
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-card border border-border-light bg-white p-4 shadow-card">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-surface flex-shrink-0" />
                            <div className="space-y-1.5">
                                <div className="h-6 w-8 rounded bg-surface" />
                                <div className="h-3 w-12 rounded bg-surface" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Table */}
            <div className="rounded-card border border-border-light bg-white shadow-card overflow-hidden">
                <div className="border-b border-border-light px-4 py-3 bg-surface/40 flex gap-8">
                    {[40, 28, 20, 16, 12].map((w, i) => <div key={i} className={`h-3.5 w-${w} rounded bg-surface`} />)}
                </div>
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border-light last:border-0">
                        <div className="h-3.5 w-24 rounded bg-surface" />
                        <div className="flex items-center gap-3 flex-1">
                            <div className="h-8 w-8 rounded-full bg-surface" />
                            <div className="space-y-1.5">
                                <div className="h-3.5 w-28 rounded bg-surface" />
                                <div className="h-3 w-36 rounded bg-surface" />
                            </div>
                        </div>
                        <div className="h-6 w-20 rounded-full bg-surface" />
                        <div className="h-6 w-16 rounded-full bg-surface" />
                        <div className="flex gap-1">
                            {[0, 1, 2].map(j => <div key={j} className="h-7 w-7 rounded-lg bg-surface" />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
