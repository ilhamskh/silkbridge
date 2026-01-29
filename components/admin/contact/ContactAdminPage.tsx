'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/Tabs';
import { Inbox, Users, GitBranch, Settings } from 'lucide-react';
import ContactRecipients from './ContactRecipients';
import ContactRouting from './ContactRouting';
import ContactSubmissions from './ContactSubmissions';

export default function ContactAdminPage() {
    const [activeTab, setActiveTab] = useState('submissions');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                            <Inbox className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Contact Management
                            </h1>
                            <p className="text-sm text-slate-500">
                                Manage contact form submissions, recipients, and routing rules
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-8 grid w-full max-w-xl grid-cols-3 bg-slate-100">
                        <TabsTrigger value="submissions" className="flex items-center gap-2">
                            <Inbox className="h-4 w-4" />
                            <span className="hidden sm:inline">Submissions</span>
                        </TabsTrigger>
                        <TabsTrigger value="recipients" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Recipients</span>
                        </TabsTrigger>
                        <TabsTrigger value="routing" className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4" />
                            <span className="hidden sm:inline">Routing</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="submissions">
                        <ContactSubmissions />
                    </TabsContent>

                    <TabsContent value="recipients">
                        <ContactRecipients />
                    </TabsContent>

                    <TabsContent value="routing">
                        <ContactRouting />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
