'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/button';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';

interface ContactFormProps {
    locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
    const t = useTranslations('contactPage.form');
    const tSuccess = useTranslations('contactPage.success');
    const tError = useTranslations('contactPage.error');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'PHARMA' as 'PHARMA' | 'PATIENT' | 'WELLNESS',
        message: '',
    });
    const [formTimestamp] = useState(Date.now());
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    type: formData.type,
                    message: formData.message,
                    locale,
                    pagePath: window.location.pathname,
                    _timestamp: formTimestamp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error(tError('rateLimit'));
                }
                throw new Error(data.error || tError('description'));
            }

            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                type: 'PHARMA',
                message: '',
            });

            // Show success toast
            toast.success(tSuccess('title'), {
                description: tSuccess('description'),
                duration: 5000,
            });

            // Reset success message after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            const errorMsg = error instanceof Error ? error.message : tError('description');
            setErrorMessage(errorMsg);

            // Show error toast
            toast.error(tError('title'), {
                description: errorMsg,
                duration: 5000,
            });
        }
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {status === 'success' && (
                <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-800">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        {t('successMessage') || 'Thank you! Your message has been sent successfully.'}
                    </p>
                </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-800">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        {errorMessage || t('errorMessage') || 'Something went wrong. Please try again.'}
                    </p>
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                        {t('nameLabel') || 'Full Name'} <span className="text-red-500">*</span>
                    </label>
                    <AdminInput
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder={t('namePlaceholder') || 'John Doe'}
                        required
                        disabled={status === 'loading'}
                        className="w-full"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                        {t('emailLabel') || 'Email Address'} <span className="text-red-500">*</span>
                    </label>
                    <AdminInput
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder={t('emailPlaceholder') || 'john@example.com'}
                        required
                        disabled={status === 'loading'}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                        {t('phoneLabel') || 'Phone Number'}
                    </label>
                    <AdminInput
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder={t('phonePlaceholder') || '+994 50 123 45 67'}
                        disabled={status === 'loading'}
                        className="w-full"
                    />
                </div>

                {/* Inquiry Type */}
                <div>
                    <label htmlFor="type" className="mb-2 block text-sm font-medium text-slate-700">
                        {t('typeLabel') || 'Inquiry Type'} <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        required
                        disabled={status === 'loading'}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="PHARMA">{t('typePharma') || 'Pharmaceutical Services'}</option>
                        <option value="PATIENT">{t('typePatient') || 'Patient / Health Tourism'}</option>
                        <option value="WELLNESS">{t('typeWellness') || 'Wellness & Spa'}</option>
                    </select>
                    <p className="mt-1 text-xs text-slate-500">
                        {formData.type === 'PHARMA' && (t('typePharmaDesc') || 'Market entry, regulatory, distribution')}
                        {formData.type === 'PATIENT' && (t('typePatientDesc') || 'Medical treatments, hospital coordination')}
                        {formData.type === 'WELLNESS' && (t('typeWellnessDesc') || 'Spa resorts, wellness packages')}
                    </p>
                </div>
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                    {t('messageLabel') || 'Message'} <span className="text-red-500">*</span>
                </label>
                <AdminTextarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder={t('messagePlaceholder') || 'Tell us more about your inquiry...'}
                    rows={6}
                    required
                    disabled={status === 'loading'}
                    className="w-full"
                />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={status === 'loading'}
                    className="min-w-[200px] gap-2"
                >
                    {status === 'loading' ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            {t('sendingButton') || 'Sending...'}
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            {t('sendButton') || 'Send Message'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
