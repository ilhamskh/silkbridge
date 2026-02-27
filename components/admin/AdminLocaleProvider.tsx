import { cache } from 'react';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { AdminLayoutContextProvider } from './AdminLayoutContext';

interface Props {
    children: React.ReactNode;
}

const validLocales = ['en', 'az', 'ru'] as const;
type ValidLocale = typeof validLocales[number];

// cache() deduplicates this across the request lifecycle —
// no matter how many Server Components call it, it only runs once per request.
const getAdminMessages = cache(async (locale: ValidLocale) => {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return {
        Admin: messages.Admin,
        common: messages.common,
    };
});

export default async function AdminLocaleProvider({ children }: Props) {
    const cookieStore = await cookies();
    const rawLocale = cookieStore.get('admin-locale')?.value || 'en';
    const safeLocale: ValidLocale = (validLocales as readonly string[]).includes(rawLocale)
        ? (rawLocale as ValidLocale)
        : 'en';

    // Uses react cache() — runs at most once per request even if called from multiple components
    const adminMessages = await getAdminMessages(safeLocale);

    return (
        <NextIntlClientProvider locale={safeLocale} messages={adminMessages}>
            <AdminLayoutContextProvider initialLocale={safeLocale}>
                {children}
            </AdminLayoutContextProvider>
        </NextIntlClientProvider>
    );
}
