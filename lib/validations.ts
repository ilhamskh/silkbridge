import { z } from 'zod';

// ============================================
// Block Schemas — re-export from canonical source
// ============================================
// All block schemas live in @/lib/blocks/schema.ts (single source of truth).
// Re-exported here for backward compatibility with existing imports.

export {
    contentBlockSchema,
    blocksArraySchema,
    type ContentBlock,
    type BlocksArray,
} from '@/lib/blocks/schema';

import { blocksArraySchema } from '@/lib/blocks/schema';

// ============================================
// Page Translation Schema
// ============================================

export const pageTranslationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    ogImage: z.string().optional().nullable(),
    blocks: blocksArraySchema,
    status: z.enum(['DRAFT', 'PUBLISHED']),
});

// ============================================
// Site Settings Schemas
// ============================================

export const socialsSchema = z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
});

export const siteSettingsSchema = z.object({
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    socials: socialsSchema.optional(),
    mapEmbedUrl: z.string().url().optional().or(z.literal('')),
});

export const siteSettingsTranslationSchema = z.object({
    tagline: z.string().optional(),
    footerText: z.string().optional(),
});

// ============================================
// Locale Schema
// ============================================

export const localeSchema = z.object({
    code: z.string().min(2).max(5).regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid locale code format'),
    name: z.string().min(1, 'Name is required'),
    nativeName: z.string().min(1, 'Native name is required'),
    flag: z.string().optional(),
    isRTL: z.boolean().default(false),
    isDefault: z.boolean().default(false),
    isEnabled: z.boolean().default(true),
});

export const localeUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    nativeName: z.string().min(1).optional(),
    flag: z.string().optional(),
    isRTL: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    isEnabled: z.boolean().optional(),
});

// ============================================
// User Schema
// ============================================

export const userCreateSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR'),
});

export const userUpdateSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'EDITOR']).optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    isActive: z.boolean().optional(),
});

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Type exports
export type PageTranslationInput = z.infer<typeof pageTranslationSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type SiteSettingsTranslationInput = z.infer<typeof siteSettingsTranslationSchema>;
export type LocaleInput = z.infer<typeof localeSchema>;
export type LocaleUpdateInput = z.infer<typeof localeUpdateSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
