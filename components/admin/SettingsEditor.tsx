'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteSettings, updateSiteSettingsTranslation } from '@/lib/actions';

interface Locale {
    code: string;
    name: string;
    nativeName: string;
    isEnabled: boolean;
}

interface SiteSettingsTranslation {
    localeCode: string;
    tagline: string | null;
    footerText: string | null;
}

interface SiteSettings {
    id: string;
    siteName: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    defaultLocale: string;
    contactEmail: string | null;
    contactPhone: string | null;
    contactAddress: string | null;
    socialLinks: Record<string, string>;
    translations: SiteSettingsTranslation[];
}

interface SettingsEditorProps {
    settings: SiteSettings | null;
    locales: Locale[];
}

export default function SettingsEditor({ settings, locales }: SettingsEditorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'translations'>('general');
    const [selectedLocale, setSelectedLocale] = useState(locales[0]?.code || 'en');

    // General settings state
    const [siteName, setSiteName] = useState(settings?.siteName || '');
    const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || '');
    const [faviconUrl, setFaviconUrl] = useState(settings?.faviconUrl || '');
    const [defaultLocale, setDefaultLocale] = useState(settings?.defaultLocale || 'en');
    const [contactEmail, setContactEmail] = useState(settings?.contactEmail || '');
    const [contactPhone, setContactPhone] = useState(settings?.contactPhone || '');
    const [contactAddress, setContactAddress] = useState(settings?.contactAddress || '');

    // Social links state
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>(
        settings?.socialLinks || {}
    );

    // Translation state
    const currentTranslation = settings?.translations?.find((t: SiteSettingsTranslation) => t.localeCode === selectedLocale);
    const [tagline, setTagline] = useState(currentTranslation?.tagline || '');
    const [footerText, setFooterText] = useState(currentTranslation?.footerText || '');

    const handleLocaleChange = (newLocale: string) => {
        setSelectedLocale(newLocale);
        const translation = settings?.translations?.find((t: SiteSettingsTranslation) => t.localeCode === newLocale);
        setTagline(translation?.tagline || '');
        setFooterText(translation?.footerText || '');
    };

    const handleSaveGeneral = () => {
        startTransition(async () => {
            await updateSiteSettings({
                siteName,
                logoUrl: logoUrl || null,
                faviconUrl: faviconUrl || null,
                defaultLocale,
                contactEmail: contactEmail || null,
                contactPhone: contactPhone || null,
                contactAddress: contactAddress || null,
                socialLinks,
            });
            router.refresh();
        });
    };

    const handleSaveTranslation = () => {
        if (!settings?.id) return;
        startTransition(async () => {
            await updateSiteSettingsTranslation(settings.id, selectedLocale, { tagline, footerText });
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-surface rounded-xl">
                {[
                    { id: 'general', label: 'General' },
                    { id: 'contact', label: 'Contact Info' },
                    { id: 'social', label: 'Social Links' },
                    { id: 'translations', label: 'Translations' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-white text-ink shadow-sm'
                                : 'text-muted hover:text-ink'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="bg-white rounded-2xl border border-border-light p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Site Name</label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Your Site Name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">Logo URL</label>
                                <input
                                    type="text"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/logo.svg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">Favicon URL</label>
                                <input
                                    type="text"
                                    value={faviconUrl}
                                    onChange={(e) => setFaviconUrl(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/favicon.ico"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Default Locale</label>
                            <select
                                value={defaultLocale}
                                onChange={(e) => setDefaultLocale(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {locales.map((locale) => (
                                    <option key={locale.code} value={locale.code}>
                                        {locale.name} ({locale.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSaveGeneral}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <div className="bg-white rounded-2xl border border-border-light p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Email Address</label>
                            <input
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="info@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">Address</label>
                            <textarea
                                value={contactAddress}
                                onChange={(e) => setContactAddress(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                placeholder="123 Business Street, City, Country"
                            />
                        </div>
                        <button
                            onClick={handleSaveGeneral}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
                <div className="bg-white rounded-2xl border border-border-light p-6">
                    <div className="space-y-6">
                        {['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'].map((platform) => (
                            <div key={platform}>
                                <label className="block text-sm font-medium text-ink mb-2 capitalize">
                                    {platform}
                                </label>
                                <input
                                    type="url"
                                    value={socialLinks[platform] || ''}
                                    onChange={(e) =>
                                        setSocialLinks({ ...socialLinks, [platform]: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder={`https://${platform}.com/yourprofile`}
                                />
                            </div>
                        ))}
                        <button
                            onClick={handleSaveGeneral}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Translations Tab */}
            {activeTab === 'translations' && (
                <div className="space-y-6">
                    {/* Locale Selector */}
                    <div className="flex gap-2">
                        {locales.map((locale) => (
                            <button
                                key={locale.code}
                                onClick={() => handleLocaleChange(locale.code)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedLocale === locale.code
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-surface text-muted hover:text-ink'
                                    }`}
                            >
                                {locale.name}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-border-light p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Tagline ({selectedLocale.toUpperCase()})
                                </label>
                                <input
                                    type="text"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Your site tagline"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">
                                    Footer Text ({selectedLocale.toUpperCase()})
                                </label>
                                <textarea
                                    value={footerText}
                                    onChange={(e) => setFooterText(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    placeholder="Footer copyright and additional text"
                                />
                            </div>
                            <button
                                onClick={handleSaveTranslation}
                                disabled={isPending}
                                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Saving...' : 'Save Translation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
