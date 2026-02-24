'use client';

import { useState, useCallback, useRef } from 'react';
import { saveSiteSettings } from '@/lib/actions';
import { useToast } from './ui/AdminToast';
import { AdminCard, AdminCardHeader, AdminCardContent } from './ui/AdminCard';
import { AdminButton } from './ui/AdminButton';
import { AdminIcon } from './ui/AdminIcon';
import { AdminInput } from './ui/AdminInput';
import { AdminTextarea } from './ui/AdminTextarea';
import { AdminTabs } from './ui/AdminTabs';
import { AdminBadge } from './ui/AdminBadge';

interface SettingsEditorNewProps {
    settings: {
        id: string;
        siteName: string | null;
        logoUrl: string | null;
        faviconUrl: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        contactAddress: string | null;
        socialLinks: unknown;
        translations: Array<{
            localeCode: string;
            tagline: string | null;
            footerText: string | null;
            locale: {
                code: string;
                name: string;
                flag: string | null;
            };
        }>;
    } | null;
    locales: Array<{
        code: string;
        name: string;
        flag: string | null;
        isDefault: boolean;
    }>;
}

interface SocialLinks {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
}

export default function SettingsEditorNew({ settings, locales }: SettingsEditorNewProps) {

    const toast = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [activeLocale, setActiveLocale] = useState(
        locales.find(l => l.isDefault)?.code || locales[0]?.code || 'en'
    );

    // Form state
    const [siteName, setSiteName] = useState(settings?.siteName || '');
    const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || '');
    const [faviconUrl, setFaviconUrl] = useState(settings?.faviconUrl || '');
    const [contactEmail, setContactEmail] = useState(settings?.contactEmail || '');
    const [contactPhone, setContactPhone] = useState(settings?.contactPhone || '');
    const [address, setAddress] = useState(settings?.contactAddress || '');
    const [socialLinks, setSocialLinks] = useState<SocialLinks>(
        (settings?.socialLinks as SocialLinks) || {}
    );

    // Upload state
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    // Translations state
    const [translations, setTranslations] = useState<Record<string, { tagline: string; footerText: string }>>(
        settings?.translations.reduce((acc, t) => ({
            ...acc,
            [t.localeCode]: {
                tagline: t.tagline || '',
                footerText: t.footerText || '',
            }
        }), {}) || {}
    );

    const getCurrentTranslation = () => translations[activeLocale] || { tagline: '', footerText: '' };

    const updateTranslation = (field: 'tagline' | 'footerText', value: string) => {
        setTranslations(prev => ({
            ...prev,
            [activeLocale]: {
                ...prev[activeLocale],
                [field]: value,
            }
        }));
    };

    // Logo upload handler
    const handleLogoUpload = async (file: File) => {
        setIsUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'brand');

            const response = await fetch('/api/admin/uploads/blob', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            setLogoUrl(data.url);
            toast.success('Logo uploaded successfully');
        } catch (error) {
            console.error('Logo upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to upload logo');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    // Favicon upload handler
    const handleFaviconUpload = async (file: File) => {
        setIsUploadingFavicon(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'brand');

            const response = await fetch('/api/admin/uploads/blob', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            setFaviconUrl(data.url);
            toast.success('Favicon uploaded successfully');
        } catch (error) {
            console.error('Favicon upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to upload favicon');
        } finally {
            setIsUploadingFavicon(false);
        }
    };

    const handleSave = useCallback(async () => {
        if (!siteName.trim()) {
            toast.error('Site name is required');
            return;
        }

        setIsSaving(true);
        try {
            const result = await saveSiteSettings({
                siteName: siteName.trim(),
                logoUrl: logoUrl.trim() || null,
                faviconUrl: faviconUrl.trim() || null,
                contactEmail: contactEmail.trim() || null,
                contactPhone: contactPhone.trim() || null,
                address: address.trim() || null,
                socialLinks: socialLinks as Record<string, string | undefined>,
                translations: Object.entries(translations).map(([localeCode, data]) => ({
                    localeCode,
                    tagline: data.tagline.trim() || null,
                    footerText: data.footerText.trim() || null,
                })),
            });

            if (result.success) {
                toast.success('Settings saved successfully');
            } else {
                toast.error(result.error || 'Failed to save settings');
            }
        } catch (error) {
            toast.error('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    }, [siteName, logoUrl, faviconUrl, contactEmail, contactPhone, address, socialLinks, translations, toast]);

    const currentTranslation = getCurrentTranslation();

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-heading font-semibold text-2xl text-ink">Site Settings</h1>
                    <p className="text-muted mt-1">Manage global configuration and branding</p>
                </div>
                <AdminButton
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isSaving}
                    leftIcon={<AdminIcon name="save" className="w-4 h-4" />}
                >
                    Save Settings
                </AdminButton>
            </div>

            {/* Tabs */}
            <AdminTabs
                tabs={[
                    { id: 'general', label: 'General', icon: <AdminIcon name="settings" className="w-4 h-4" /> },
                    { id: 'branding', label: 'Branding', icon: <AdminIcon name="image" className="w-4 h-4" /> },
                    { id: 'contact', label: 'Contact', icon: <AdminIcon name="email" className="w-4 h-4" /> },
                    { id: 'social', label: 'Social', icon: <AdminIcon name="globe" className="w-4 h-4" /> },
                    { id: 'localized', label: 'Localized Content', icon: <AdminIcon name="globe" className="w-4 h-4" /> },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'general' && (
                    <AdminCard padding="lg">
                        <AdminCardHeader
                            title="General Settings"
                            description="Basic site configuration"
                        />
                        <AdminCardContent className="space-y-6">
                            <AdminInput
                                label="Site Name"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="Silkbridge"
                                helperText="The name of your website"
                                required
                            />
                        </AdminCardContent>
                    </AdminCard>
                )}

                {activeTab === 'branding' && (
                    <AdminCard padding="lg">
                        <AdminCardHeader
                            title="Branding"
                            description="Logo and favicon settings"
                        />
                        <AdminCardContent className="space-y-8">
                            {/* Logo Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-ink">
                                    Site Logo
                                </label>

                                {/* Logo Preview */}
                                {logoUrl && (
                                    <div className="p-6 bg-surface rounded-xl border-2 border-border-light">
                                        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                                            Current Logo
                                        </p>
                                        <div className="flex items-center justify-center bg-white p-6 rounded-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={logoUrl}
                                                alt="Logo preview"
                                                className="h-16 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Upload Controls */}
                                <div className="flex flex-wrap gap-3">
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleLogoUpload(file);
                                        }}
                                        className="hidden"
                                    />
                                    <AdminButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={isUploadingLogo}
                                        leftIcon={<AdminIcon name="image" />}
                                    >
                                        {isUploadingLogo ? 'Uploading...' : (logoUrl ? 'Change Logo' : 'Upload Logo')}
                                    </AdminButton>
                                    {logoUrl && (
                                        <AdminButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setLogoUrl('')}
                                            leftIcon={<AdminIcon name="trash" />}
                                        >
                                            Remove
                                        </AdminButton>
                                    )}
                                </div>
                                <p className="text-xs text-muted">
                                    Recommended: SVG or PNG with transparent background. Max 2MB. Ideal size: 200×40px.
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border-light" />

                            {/* Favicon Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-ink">
                                    Favicon
                                </label>

                                {/* Favicon Preview */}
                                {faviconUrl && (
                                    <div className="p-6 bg-surface rounded-xl border-2 border-border-light">
                                        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                                            Current Favicon
                                        </p>
                                        <div className="flex items-center justify-center bg-white p-6 rounded-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={faviconUrl}
                                                alt="Favicon preview"
                                                className="h-8 w-8 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Upload Controls */}
                                <div className="flex flex-wrap gap-3">
                                    <input
                                        ref={faviconInputRef}
                                        type="file"
                                        accept="image/png,image/x-icon,image/svg+xml"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFaviconUpload(file);
                                        }}
                                        className="hidden"
                                    />
                                    <AdminButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => faviconInputRef.current?.click()}
                                        disabled={isUploadingFavicon}
                                        leftIcon={<AdminIcon name="image" />}
                                    >
                                        {isUploadingFavicon ? 'Uploading...' : (faviconUrl ? 'Change Favicon' : 'Upload Favicon')}
                                    </AdminButton>
                                    {faviconUrl && (
                                        <AdminButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setFaviconUrl('')}
                                            leftIcon={<AdminIcon name="trash" />}
                                        >
                                            Remove
                                        </AdminButton>
                                    )}
                                </div>
                                <p className="text-xs text-muted">
                                    Recommended: ICO or PNG format. Ideal size: 32×32px or 64×64px.
                                </p>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                )}

                {activeTab === 'contact' && (
                    <AdminCard padding="lg">
                        <AdminCardHeader
                            title="Contact Information"
                            description="Business contact details"
                        />
                        <AdminCardContent className="space-y-6">
                            <AdminInput
                                label="Contact Email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="hello@silkbridge.com"
                                helperText="Primary contact email"
                            />

                            <AdminInput
                                label="Phone Number"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="+1 234 567 8900"
                                helperText="Business phone number"
                            />

                            <AdminTextarea
                                label="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="123 Business Street&#10;City, Country 12345"
                                helperText="Business address"
                                rows={3}
                            />
                        </AdminCardContent>
                    </AdminCard>
                )}

                {activeTab === 'social' && (
                    <AdminCard padding="lg">
                        <AdminCardHeader
                            title="Social Links"
                            description="Social media profiles"
                        />
                        <AdminCardContent className="space-y-6">
                            <AdminInput
                                label="Facebook"
                                value={socialLinks.facebook || ''}
                                onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                                placeholder="https://facebook.com/silkbridge"
                            />

                            <AdminInput
                                label="Instagram"
                                value={socialLinks.instagram || ''}
                                onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                                placeholder="https://instagram.com/silkbridge"
                            />

                            <AdminInput
                                label="LinkedIn"
                                value={socialLinks.linkedin || ''}
                                onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                                placeholder="https://linkedin.com/company/silkbridge"
                            />

                            <AdminInput
                                label="Twitter/X"
                                value={socialLinks.twitter || ''}
                                onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                                placeholder="https://twitter.com/silkbridge"
                            />

                            <AdminInput
                                label="YouTube"
                                value={socialLinks.youtube || ''}
                                onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                                placeholder="https://youtube.com/@silkbridge"
                            />
                        </AdminCardContent>
                    </AdminCard>
                )}

                {activeTab === 'localized' && (
                    <AdminCard padding="lg">
                        <AdminCardHeader
                            title="Localized Content"
                            description="Translatable text content"
                            action={
                                <div className="flex items-center gap-2">
                                    {locales.map((locale) => (
                                        <button
                                            key={locale.code}
                                            onClick={() => setActiveLocale(locale.code)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeLocale === locale.code
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-muted hover:text-ink hover:bg-surface'
                                                }`}
                                        >
                                            {locale.flag && <span>{locale.flag}</span>}
                                            {locale.name}
                                            {locale.isDefault && (
                                                <AdminBadge variant="default" size="sm">Default</AdminBadge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            }
                        />
                        <AdminCardContent className="space-y-6">
                            <AdminInput
                                label="Tagline"
                                value={currentTranslation.tagline}
                                onChange={(e) => updateTranslation('tagline', e.target.value)}
                                placeholder="Bridging Markets, Building Futures"
                                helperText={`Tagline in ${locales.find(l => l.code === activeLocale)?.name || activeLocale}`}
                            />

                            <AdminTextarea
                                label="Footer Text"
                                value={currentTranslation.footerText}
                                onChange={(e) => updateTranslation('footerText', e.target.value)}
                                placeholder="© 2024 Silkbridge. All rights reserved."
                                helperText={`Footer copyright text in ${locales.find(l => l.code === activeLocale)?.name || activeLocale}`}
                                rows={2}
                            />
                        </AdminCardContent>
                    </AdminCard>
                )}
            </div>
        </div>
    );
}
