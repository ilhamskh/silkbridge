'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { InquiryType, SubmissionStatus } from '@prisma/client';

// ============================================
// Validation Schemas
// ============================================

const recipientSchema = z.object({
    label: z.string().min(1, 'Label is required').max(100),
    email: z.string().email('Invalid email address'),
});

const routingSchema = z.object({
    type: z.enum(['PHARMA', 'PATIENT', 'WELLNESS']),
    recipientId: z.string().min(1, 'Please select a recipient'),
});

// ============================================
// Recipients
// ============================================

export async function getRecipients() {
    try {
        const recipients = await prisma.contactRecipient.findMany({
            orderBy: { createdAt: 'asc' },
            include: {
                _count: {
                    select: { routingRules: true },
                },
            },
        });
        return { success: true, data: recipients };
    } catch (error) {
        console.error('[Admin] Failed to fetch recipients:', error);
        return { success: false, error: 'Failed to fetch recipients' };
    }
}

export async function createRecipient(formData: { label: string; email: string }) {
    try {
        const validated = recipientSchema.parse(formData);

        const recipient = await prisma.contactRecipient.create({
            data: {
                label: validated.label,
                email: validated.email.toLowerCase(),
            },
        });

        revalidatePath('/admin/contact');
        return { success: true, data: recipient };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || 'Validation error' };
        }
        console.error('[Admin] Failed to create recipient:', error);
        return { success: false, error: 'Failed to create recipient' };
    }
}

export async function updateRecipient(id: string, formData: { label: string; email: string }) {
    try {
        const validated = recipientSchema.parse(formData);

        const recipient = await prisma.contactRecipient.update({
            where: { id },
            data: {
                label: validated.label,
                email: validated.email.toLowerCase(),
            },
        });

        revalidatePath('/admin/contact');
        return { success: true, data: recipient };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || 'Validation error' };
        }
        console.error('[Admin] Failed to update recipient:', error);
        return { success: false, error: 'Failed to update recipient' };
    }
}

export async function toggleRecipientActive(id: string, isActive: boolean) {
    try {
        const recipient = await prisma.contactRecipient.update({
            where: { id },
            data: { isActive },
        });

        revalidatePath('/admin/contact');
        return { success: true, data: recipient };
    } catch (error) {
        console.error('[Admin] Failed to toggle recipient:', error);
        return { success: false, error: 'Failed to update recipient status' };
    }
}

// ============================================
// Routing Rules
// ============================================

export async function getRoutingRules() {
    try {
        const rules = await prisma.contactRoutingRule.findMany({
            include: { recipient: true },
            orderBy: { type: 'asc' },
        });
        return { success: true, data: rules };
    } catch (error) {
        console.error('[Admin] Failed to fetch routing rules:', error);
        return { success: false, error: 'Failed to fetch routing rules' };
    }
}

export async function updateRoutingRule(type: InquiryType, recipientId: string) {
    try {
        // Upsert the routing rule
        const rule = await prisma.contactRoutingRule.upsert({
            where: { type },
            update: {
                recipientId,
                isActive: true,
            },
            create: {
                type,
                recipientId,
                isActive: true,
            },
            include: { recipient: true },
        });

        revalidatePath('/admin/contact');
        return { success: true, data: rule };
    } catch (error) {
        console.error('[Admin] Failed to update routing rule:', error);
        return { success: false, error: 'Failed to update routing rule' };
    }
}

// ============================================
// Submissions
// ============================================

export async function getSubmissions(filters?: {
    type?: InquiryType;
    status?: SubmissionStatus;
    page?: number;
    limit?: number;
}) {
    try {
        const { type, status, page = 1, limit = 20 } = filters || {};

        const where: {
            type?: InquiryType;
            status?: SubmissionStatus;
        } = {};

        if (type) where.type = type;
        if (status) where.status = status;

        const [submissions, total] = await Promise.all([
            prisma.contactSubmission.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.contactSubmission.count({ where }),
        ]);

        return {
            success: true,
            data: submissions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('[Admin] Failed to fetch submissions:', error);
        return { success: false, error: 'Failed to fetch submissions' };
    }
}

export async function getSubmission(id: string) {
    try {
        const submission = await prisma.contactSubmission.findUnique({
            where: { id },
        });

        if (!submission) {
            return { success: false, error: 'Submission not found' };
        }

        return { success: true, data: submission };
    } catch (error) {
        console.error('[Admin] Failed to fetch submission:', error);
        return { success: false, error: 'Failed to fetch submission' };
    }
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
    try {
        const submission = await prisma.contactSubmission.update({
            where: { id },
            data: { status },
        });

        revalidatePath('/admin/contact');
        return { success: true, data: submission };
    } catch (error) {
        console.error('[Admin] Failed to update submission status:', error);
        return { success: false, error: 'Failed to update submission status' };
    }
}

export async function getSubmissionStats() {
    try {
        const [newCount, archivedCount, spamCount, total] = await Promise.all([
            prisma.contactSubmission.count({ where: { status: 'NEW' } }),
            prisma.contactSubmission.count({ where: { status: 'ARCHIVED' } }),
            prisma.contactSubmission.count({ where: { status: 'SPAM' } }),
            prisma.contactSubmission.count(),
        ]);

        return {
            success: true,
            data: {
                new: newCount,
                archived: archivedCount,
                spam: spamCount,
                total,
            },
        };
    } catch (error) {
        console.error('[Admin] Failed to fetch submission stats:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}
