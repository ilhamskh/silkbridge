import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { Inter, Sora } from 'next/font/google';
import AdminSidebar from '@/components/admin/AdminSidebarNew';
import AdminHeader from '@/components/admin/AdminHeaderNew';
import { ToastProvider } from '@/components/admin/ui/AdminToast';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const sora = Sora({
    subsets: ['latin'],
    variable: '--font-sora',
    display: 'swap',
});

export const metadata = {
    title: {
        default: 'Admin Panel | Silkbridge',
        template: '%s | Admin Panel',
    },
};

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session) {
        redirect('/admin/login');
    }

    return (
        <SessionProvider session={session}>
            <ToastProvider>
                <div className={`min-h-screen bg-[#F7FAFF] ${inter.variable} ${sora.variable} font-sans antialiased`}>
                    {/* Sidebar */}
                    <AdminSidebar user={session.user} />

                    {/* Main Area */}
                    <div className="lg:pl-64 min-h-screen flex flex-col">
                        {/* Header */}
                        <AdminHeader user={session.user} />

                        {/* Main Content */}
                        <main className="flex-1 p-4 lg:p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </ToastProvider>
        </SessionProvider>
    );
}
