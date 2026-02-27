import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { AdminLayoutContextProvider } from './AdminLayoutContext';

interface Props {
    children: React.ReactNode;
}

export default async function AdminLocaleProvider({ children }: Props) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('admin-locale')?.value || 'en';

    // Validate locale
    const validLocales = ['en', 'az', 'ru'];
    const safeLocale = validLocales.includes(locale) ? locale : 'en';

    // Import only the messages we need for the admin panel
    const messages = (await import(`../../messages/${safeLocale}.json`)).default;

    // Only send Admin + common namespaces to keep the client bundle small
    const adminMessages = {
        Admin: messages.Admin,
        common: messages.common,
    };

    return (
        <NextIntlClientProvider locale={safeLocale} messages={adminMessages}>
            <AdminLayoutContextProvider initialLocale={safeLocale}>
                {children}
            </AdminLayoutContextProvider>
        </NextIntlClientProvider>
    );
}
