export default function SettingsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-1.5">
                <div className="h-6 w-40 rounded-lg bg-surface" />
                <div className="h-3.5 w-64 rounded bg-surface" />
            </div>
            {[0, 1, 2].map(i => (
                <div key={i} className="rounded-card border border-border-light bg-white shadow-card p-6 space-y-4">
                    <div className="h-5 w-36 rounded-lg bg-surface" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[0, 1].map(j => (
                            <div key={j} className="space-y-2">
                                <div className="h-3.5 w-20 rounded bg-surface" />
                                <div className="h-10 rounded-xl bg-surface" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="flex justify-end">
                <div className="h-10 w-28 rounded-xl bg-surface" />
            </div>
        </div>
    );
}
