import Link from 'next/link';
import { getPages, getEnabledLocales } from '@/lib/actions';

interface Locale {
    code: string;
    name: string;
    nativeName: string;
    flag: string | null;
    isEnabled: boolean;
}

interface Translation {
    localeCode: string;
    status: 'DRAFT' | 'PUBLISHED';
}

interface Page {
    id: string;
    slug: string;
    translations: Translation[];
}

export const metadata = {
    title: 'Pages',
};

export default async function PagesListPage() {
    const [pages, locales] = await Promise.all([
        getPages() as Promise<Page[]>,
        getEnabledLocales() as Promise<Locale[]>,
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-ink">Pages</h1>
                <p className="text-muted mt-1">
                    Manage your website pages and their translations
                </p>
            </div>

            {/* Pages List */}
            <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light bg-slate-50">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-ink">
                                    Page
                                </th>
                                {locales.map((locale) => (
                                    <th key={locale.code} className="text-center px-4 py-4 text-sm font-semibold text-ink">
                                        <span className="inline-flex items-center gap-2">
                                            <span>{locale.flag}</span>
                                            <span>{locale.code.toUpperCase()}</span>
                                        </span>
                                    </th>
                                ))}
                                <th className="text-right px-6 py-4 text-sm font-semibold text-ink">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {pages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-ink capitalize">
                                                {page.slug}
                                            </p>
                                            <p className="text-sm text-muted">
                                                /{page.slug === 'home' ? '' : page.slug}
                                            </p>
                                        </div>
                                    </td>
                                    {locales.map((locale) => {
                                        const translation = page.translations.find(
                                            (t) => t.localeCode === locale.code
                                        );
                                        return (
                                            <td key={locale.code} className="text-center px-4 py-4">
                                                <Link
                                                    href={`/admin/pages/${page.slug}?locale=${locale.code}`}
                                                    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${translation?.status === 'PUBLISHED'
                                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                            : translation
                                                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {translation?.status === 'PUBLISHED'
                                                        ? 'Published'
                                                        : translation
                                                            ? 'Draft'
                                                            : 'Missing'}
                                                </Link>
                                            </td>
                                        );
                                    })}
                                    <td className="text-right px-6 py-4">
                                        <Link
                                            href={`/admin/pages/${page.slug}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
