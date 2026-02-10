import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Dashboard',
};

interface Translation {
    id: string;
    localeCode: string;
    status: 'DRAFT' | 'PUBLISHED';
    updatedAt: Date;
    page: {
        slug: string;
    };
    locale: {
        name: string;
        flag: string | null;
    };
}

async function getStats() {
    const [pagesCount, localesCount, usersCount] = await Promise.all([
        prisma.page.count(),
        prisma.locale.count({ where: { isEnabled: true } }),
        prisma.user.count(),
    ]);

    const recentTranslations = await prisma.pageTranslation.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
            page: true,
            locale: true,
        },
    }) as Translation[];

    return { pagesCount, localesCount, usersCount, recentTranslations };
}

export default async function AdminDashboard() {
    const session = await auth();
    const stats = await getStats();

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-semibold text-ink">
                    Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0]}
                </h1>
                <p className="text-muted mt-1">
                    Here&apos;s an overview of your website content
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Pages"
                    value={stats.pagesCount}
                    href="/admin/pages"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2v6h6" />
                        </svg>
                    }
                />
                <StatCard
                    title="Active Locales"
                    value={stats.localesCount}
                    href="/admin/locales"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Users"
                    value={stats.usersCount}
                    href="/admin/users"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="9" cy="7" r="4" strokeWidth={1.5} />
                        </svg>
                    }
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-border-light shadow-sm">
                <div className="px-6 py-4 border-b border-border-light">
                    <h2 className="font-semibold text-ink">Recent Updates</h2>
                </div>
                <div className="divide-y divide-border-light">
                    {stats.recentTranslations.map((translation) => (
                        <Link
                            key={translation.id}
                            href={`/admin/pages/${translation.page.slug}?locale=${translation.localeCode}`}
                            className="flex items-center justify-between px-6 py-4 hover:bg-surface transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                    <span className="text-lg">{translation.locale.flag}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-ink">
                                        {translation.page.slug.charAt(0).toUpperCase() + translation.page.slug.slice(1)}
                                    </p>
                                    <p className="text-sm text-muted">
                                        {translation.locale.name} · {translation.status.toLowerCase()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-muted">
                                {new Date(translation.updatedAt).toLocaleDateString()}
                            </div>
                        </Link>
                    ))}
                    {stats.recentTranslations.length === 0 && (
                        <div className="px-6 py-8 text-center text-muted">
                            No recent activity
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionCard
                    title="Edit Pages"
                    description="Update your website page content"
                    href="/admin/pages"
                />
                <QuickActionCard
                    title="Site Settings"
                    description="Manage contact info and social links"
                    href="/admin/settings"
                />
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    href,
    icon,
}: {
    title: string;
    value: number;
    href: string;
    icon: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="bg-white rounded-2xl border border-border-light shadow-sm p-6 hover:shadow-md hover:border-primary-200 transition-all group"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted">{title}</p>
                    <p className="text-3xl font-semibold text-ink mt-1">{value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    {icon}
                </div>
            </div>
        </Link>
    );
}

function QuickActionCard({
    title,
    description,
    href,
}: {
    title: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="bg-white rounded-2xl border border-border-light shadow-sm p-6 hover:shadow-md hover:border-primary-200 transition-all group"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-ink group-hover:text-primary-600 transition-colors">
                        {title}
                    </p>
                    <p className="text-sm text-muted mt-1">{description}</p>
                </div>
                <svg
                    className="w-5 h-5 text-muted group-hover:text-primary-600 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}
