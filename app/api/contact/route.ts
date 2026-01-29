/**
 * Contact Form API Route
 * Handles contact form submissions with:
 * - Zod validation
 * - Honeypot spam protection
 * - IP-based rate limiting
 * - Database storage
 * - Email notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendContactEmail, getRecipientForType } from '@/lib/email/sendContactEmail';
import { InquiryType, SubmissionStatus } from '@prisma/client';

// ============================================
// Validation Schema
// ============================================

const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
    phone: z
        .string()
        .max(30, 'Phone number too long')
        .optional()
        .transform((v) => v || null),
    type: z.enum(['PHARMA', 'PATIENT', 'WELLNESS']),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(5000, 'Message must be less than 5000 characters')
        .trim(),
    locale: z.string().default('en'),
    pagePath: z.string().optional(),
    // Honeypot field - should be empty
    website: z.string().optional(),
    // Timestamp check for bots
    _timestamp: z.number().optional(),
});

// ============================================
// Rate Limiter (In-Memory for MVP)
// ============================================

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5; // 5 submissions
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // per hour

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    // Clean up old entries periodically (every 100 checks)
    if (Math.random() < 0.01) {
        for (const [key, val] of rateLimitMap) {
            if (val.resetAt < now) {
                rateLimitMap.delete(key);
            }
        }
    }

    if (!entry || entry.resetAt < now) {
        // New window
        rateLimitMap.set(ip, {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return false;
    }

    entry.count++;
    return true;
}

// ============================================
// Spam Detection
// ============================================

const SPAM_PATTERNS = [
    /\b(viagra|cialis|casino|lottery|winner|prize|click here|buy now)\b/i,
    /\b(crypto|bitcoin|investment opportunity|double your money)\b/i,
    /(http[s]?:\/\/[^\s]+){3,}/i, // 3+ URLs
    /(.)\1{10,}/, // 10+ repeated characters
];

function isSpamContent(message: string): boolean {
    return SPAM_PATTERNS.some((pattern) => pattern.test(message));
}

// ============================================
// Get Client IP
// ============================================

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }
    return '127.0.0.1';
}

// ============================================
// POST Handler
// ============================================

export async function POST(request: NextRequest) {
    try {
        // Parse body
        const body = await request.json();

        // Validate with Zod
        const result = contactSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.flatten();
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: errors.fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = result.data;

        // ========================================
        // Honeypot Check
        // ========================================
        if (data.website && data.website.length > 0) {
            // Bot detected - silently accept but don't process
            console.log('[Contact] Honeypot triggered, ignoring submission');
            // Return success to not reveal the trap
            return NextResponse.json({
                success: true,
                message: 'Thank you for your message.',
            });
        }

        // ========================================
        // Timestamp Check (bot submitted too fast)
        // ========================================
        if (data._timestamp) {
            const submissionTime = Date.now() - data._timestamp;
            if (submissionTime < 2000) {
                // Less than 2 seconds
                console.log('[Contact] Submitted too fast, likely bot');
                return NextResponse.json({
                    success: true,
                    message: 'Thank you for your message.',
                });
            }
        }

        // ========================================
        // Rate Limiting
        // ========================================
        const clientIp = getClientIp(request);

        if (!checkRateLimit(clientIp)) {
            console.log(`[Contact] Rate limit exceeded for IP: ${clientIp}`);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Too many requests. Please try again later.',
                },
                { status: 429 }
            );
        }

        // ========================================
        // Spam Detection
        // ========================================
        const isSpam = isSpamContent(data.message) || isSpamContent(data.name);

        // ========================================
        // Save to Database
        // ========================================
        const submission = await prisma.contactSubmission.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                type: data.type as InquiryType,
                message: data.message,
                locale: data.locale,
                pagePath: data.pagePath,
                status: isSpam ? SubmissionStatus.SPAM : SubmissionStatus.NEW,
                meta: {
                    userAgent: request.headers.get('user-agent') || null,
                    referrer: request.headers.get('referer') || null,
                    ip: clientIp,
                },
            },
        });

        console.log(`[Contact] Submission saved: ${submission.id} (spam: ${isSpam})`);

        // ========================================
        // Send Email (only if not spam)
        // ========================================
        if (!isSpam) {
            const recipientEmail = await getRecipientForType(data.type as InquiryType, prisma);

            if (recipientEmail) {
                const emailResult = await sendContactEmail({
                    recipientEmail,
                    senderName: data.name,
                    senderEmail: data.email,
                    phone: data.phone,
                    inquiryType: data.type as InquiryType,
                    message: data.message,
                    locale: data.locale,
                    pagePath: data.pagePath,
                    submittedAt: submission.createdAt,
                });

                if (!emailResult.success) {
                    console.error('[Contact] Email failed:', emailResult.error);
                    // Don't fail the request - submission is saved
                }
            } else {
                console.warn('[Contact] No recipient email configured');
            }
        }

        // ========================================
        // Return Success
        // ========================================
        return NextResponse.json({
            success: true,
            message: 'Thank you for your message. We will get back to you shortly.',
        });
    } catch (error) {
        console.error('[Contact] Unexpected error:', error);

        // Don't expose error details
        return NextResponse.json(
            {
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            },
            { status: 500 }
        );
    }
}

// ============================================
// Method Not Allowed
// ============================================

export async function GET() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
