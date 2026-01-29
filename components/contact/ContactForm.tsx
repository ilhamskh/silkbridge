'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';

interface ContactFormProps {
    locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
    const t = useTranslations('contactPage.form');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
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
                    ...formData,
                    locale,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }

            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });

            // Reset success message after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
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

                {/* Subject */}
                <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                        {t('subjectLabel') || 'Subject'} <span className="text-red-500">*</span>
                    </label>
                    <AdminInput
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder={t('subjectPlaceholder') || 'How can we help?'}
                        required
                        disabled={status === 'loading'}
                        className="w-full"
                    />
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
