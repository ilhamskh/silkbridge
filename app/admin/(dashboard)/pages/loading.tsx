export default function PagesLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-1">
                <div className="h-7 w-24 rounded-lg bg-surface" />
                <div className="h-4 w-80 rounded bg-surface" />
            </div>
            <div className="rounded-card border border-border-light bg-white shadow-card overflow-hidden">
                <div className="border-b border-border-light px-6 py-4 bg-surface/40 flex gap-4">
                    <div className="h-4 w-24 rounded bg-surface" />
                    <div className="h-4 w-12 rounded bg-surface" />
                    <div className="h-4 w-12 rounded bg-surface" />
                </div>
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border-light last:border-0">
                        <div className="flex-1 space-y-1.5">
                            <div className="h-4 w-32 rounded bg-surface" />
                            <div className="h-3 w-20 rounded bg-surface" />
                        </div>
                        <div className="h-6 w-20 rounded-full bg-surface" />
                        <div className="h-6 w-20 rounded-full bg-surface" />
                        <div className="h-8 w-16 rounded-xl bg-surface" />
                    </div>
                ))}
            </div>
        </div>
    );
}
