import { prisma } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export interface FaqItem {
    id: string;
    order: number;
    isActive: boolean;
    question: string;
    answer: string;
}

/**
 * Fetch FAQs for a specific group and locale
 * Implements caching and automatic fallback to default locale
 */
export async function getFaqsByGroup(
    groupKey: string,
    locale: string
): Promise<FaqItem[]> {
    return unstable_cache(
        async () => {
            // Get the FAQ group
            const group = await prisma.faqGroup.findUnique({
                where: { key: groupKey },
                include: {
                    items: {
                        where: { isActive: true },
                        orderBy: { order: 'asc' },
                        include: {
                            translations: {
                                where: {
                                    localeCode: {
                                        in: [locale, 'en'], // Try requested locale, fallback to en
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!group) {
                return [];
            }

            // Map to FaqItem interface with fallback logic
            return group.items.map((item) => {
                // Try to find translation in requested locale
                let translation = item.translations.find(
                    (t) => t.localeCode === locale
                );

                // Fallback to English if not found
                if (!translation) {
                    translation = item.translations.find((t) => t.localeCode === 'en');
                }

                // If still no translation, skip this item (shouldn't happen with proper seeding)
                if (!translation) {
                    return null;
                }

                return {
                    id: item.id,
                    order: item.order,
                    isActive: item.isActive,
                    question: translation.question,
                    answer: translation.answer,
                };
            }).filter((item): item is FaqItem => item !== null);
        },
        [`faqs:${groupKey}:${locale}`],
        {
            tags: [`faqs:${groupKey}:${locale}`],
            revalidate: 3600, // 1 hour
        }
    )();
}

/**
 * Get all FAQ groups
 */
export async function getFaqGroups() {
    return prisma.faqGroup.findMany({
        orderBy: { key: 'asc' },
    });
}
