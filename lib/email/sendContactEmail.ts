/**
 * Contact Email Sender
 * Sends email notifications for new contact form submissions
 * Uses Resend as the email provider
 */

import { InquiryType } from '@prisma/client';

// Email payload interface
export interface ContactEmailPayload {
    recipientEmail: string;
    senderName: string;
    senderEmail: string;
    phone?: string | null;
    inquiryType: InquiryType;
    message: string;
    locale: string;
    pagePath?: string | null;
    submittedAt: Date;
}

// Email result interface
export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

// Format inquiry type for display
function formatInquiryType(type: InquiryType): string {
    const labels: Record<InquiryType, string> = {
        BUSINESS: 'Pharmaceutical Services',
        PATIENT: 'Health & Wellness',
        TOUR: 'Tourism & Travel',
    };
    return labels[type] || type;
}

// Format date for email
function formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });
}

// Build plain text email body (no HTML to avoid injection)
function buildEmailBody(payload: ContactEmailPayload): string {
    const lines = [
        '═══════════════════════════════════════════════════════════════',
        '                 NEW CONTACT FORM SUBMISSION',
        '═══════════════════════════════════════════════════════════════',
        '',
        `📋 INQUIRY TYPE: ${formatInquiryType(payload.inquiryType)}`,
        '',
        '───────────────────────────────────────────────────────────────',
        '  CONTACT DETAILS',
        '───────────────────────────────────────────────────────────────',
        '',
        `  Name:    ${payload.senderName}`,
        `  Email:   ${payload.senderEmail}`,
    ];

    if (payload.phone) {
        lines.push(`  Phone:   ${payload.phone}`);
    }

    lines.push(
        '',
        '───────────────────────────────────────────────────────────────',
        '  MESSAGE',
        '───────────────────────────────────────────────────────────────',
        '',
        payload.message,
        '',
        '───────────────────────────────────────────────────────────────',
        '  METADATA',
        '───────────────────────────────────────────────────────────────',
        '',
        `  Submitted: ${formatDate(payload.submittedAt)}`,
        `  Locale:    ${payload.locale.toUpperCase()}`,
        `  Page:      ${payload.pagePath || '/contact'}`,
        '',
        '═══════════════════════════════════════════════════════════════',
        '',
        'Reply directly to this email to respond to the sender.',
        '',
        '— SILKBRIDGE International Contact System'
    );

    return lines.join('\n');
}

/**
 * Send contact notification email using Resend
 */
export async function sendContactEmail(payload: ContactEmailPayload): Promise<EmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'noreply@silkbridge.com';

    // Check if email sending is configured
    if (!apiKey) {
        console.warn('[Email] RESEND_API_KEY not configured. Email not sent.');
        // Return success=true so the submission still saves (dev environment)
        return {
            success: true,
            error: 'Email not configured (development mode)',
        };
    }

    const subject = `New Contact Request — ${formatInquiryType(payload.inquiryType)} — ${payload.senderName}`;
    const body = buildEmailBody(payload);

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: `SILKBRIDGE Contact <${fromEmail}>`,
                to: [payload.recipientEmail],
                reply_to: payload.senderEmail,
                subject,
                text: body,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Email] Resend API error:', errorData);
            return {
                success: false,
                error: `Email API error: ${response.status}`,
            };
        }

        const data = await response.json();
        console.log('[Email] Sent successfully:', data.id);

        return {
            success: true,
            messageId: data.id,
        };
    } catch (error) {
        console.error('[Email] Failed to send:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Get recipient email for a given inquiry type
 * Falls back to default recipient if routing rule is inactive or missing
 */
export async function getRecipientForType(
    type: InquiryType,
    prismaClient: {
        contactRoutingRule: {
            findUnique: (args: {
                where: { type: InquiryType };
                include: { recipient: true };
            }) => Promise<{ isActive: boolean; recipient: { isActive: boolean; email: string } | null } | null>;
        };
        contactRecipient: {
            findFirst: (args: {
                where: { isActive: boolean };
                orderBy: { createdAt: 'asc' | 'desc' };
            }) => Promise<{ email: string } | null>;
        };
    }
): Promise<string | null> {
    try {
        // Try to find routing rule for this type
        const rule = await prismaClient.contactRoutingRule.findUnique({
            where: { type },
            include: { recipient: true },
        });

        // Check if rule and recipient are active
        if (rule?.isActive && rule.recipient?.isActive) {
            return rule.recipient.email;
        }

        // Fallback to first active recipient (General)
        const fallback = await prismaClient.contactRecipient.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
        });

        if (fallback) {
            return fallback.email;
        }

        // Ultimate fallback: environment variable
        return process.env.CONTACT_DEFAULT_RECIPIENT || null;
    } catch (error) {
        console.error('[Email] Failed to get recipient:', error);
        return process.env.CONTACT_DEFAULT_RECIPIENT || null;
    }
}
