'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/Tabs';
import { AdminIcon } from '@/components/admin/ui/AdminIcon';
import ContactRecipients from './ContactRecipients';
import ContactRouting from './ContactRouting';
import ContactSubmissions from './ContactSubmissions';

export default function ContactAdminPage() {
    const [activeTab, setActiveTab] = useState('submissions');
    const t = useTranslations('Admin');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100">
                    <AdminIcon name="inbox" className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                    <h1 className="font-heading text-xl font-semibold text-ink">
                        {t('contact.title')}
                    </h1>
                    <p className="text-sm text-muted">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 grid w-full max-w-xl grid-cols-3 bg-surface rounded-xl">
                    <TabsTrigger value="submissions" className="flex items-center gap-2 rounded-lg">
                        <AdminIcon name="inbox" className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('contact.tabs.submissions')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="recipients" className="flex items-center gap-2 rounded-lg">
                        <AdminIcon name="users" className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('contact.tabs.recipients')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="routing" className="flex items-center gap-2 rounded-lg">
                        <AdminIcon name="settings" className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('contact.tabs.routing')}</span>
                    </TabsTrigger>
                </TabsList>

                {/* Only render the active tab content to avoid concurrent data fetches */}
                <TabsContent value="submissions">
                    {activeTab === 'submissions' && <ContactSubmissions />}
                </TabsContent>

                <TabsContent value="recipients">
                    {activeTab === 'recipients' && <ContactRecipients />}
                </TabsContent>

                <TabsContent value="routing">
                    {activeTab === 'routing' && <ContactRouting />}
                </TabsContent>
            </Tabs>
        </div>
    );
}
