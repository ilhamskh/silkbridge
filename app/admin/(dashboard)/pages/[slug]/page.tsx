import { notFound } from 'next/navigation';
import { getPageBySlug, getEnabledLocales, getPageTranslation } from '@/lib/actions';
import PageEditor from '@/components/admin/PageEditor';

interface Locale {
    code: string;
    name: string;
    nativeName: string;
    flag: string | null;
    isDefault: boolean;
}

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ locale?: string }>;
}

export default async function EditPagePage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { locale } = await searchParams;

    const [page, locales] = await Promise.all([
        getPageBySlug(slug),
        getEnabledLocales() as Promise<Locale[]>,
    ]);

    if (!page) {
        notFound();
    }

    // Default to first locale if not specified
    const currentLocale = locale || locales[0]?.code || 'en';

    // Get the translation for the selected locale
    let translation = await getPageTranslation(slug, currentLocale);

    // If translation doesn't exist, auto-create it from default locale
    if (!translation) {
        const defaultLocale = locales.find(l => l.isDefault) || locales[0];
        const defaultTranslation = await getPageTranslation(slug, defaultLocale.code);

        if (defaultTranslation) {
            // Create a new translation by copying from default
            const { prisma } = await import('@/lib/db');
            translation = await prisma.pageTranslation.create({
                data: {
                    pageId: page.id,
                    localeCode: currentLocale,
                    title: defaultTranslation.title,
                    seoTitle: defaultTranslation.seoTitle,
                    seoDescription: defaultTranslation.seoDescription,
                    ogImage: defaultTranslation.ogImage,
                    blocks: defaultTranslation.blocks as object,
                    status: 'DRAFT', // New translations start as draft
                },
                include: {
                    page: true,
                    locale: true,
                },
            });
        }
    }

    return (
        <div>
            <PageEditor
                page={{ id: page.id, slug: page.slug }}
                translation={translation}
                locales={locales.map((l: Locale) => ({
                    code: l.code,
                    name: l.name,
                    flag: l.flag,
                    isDefault: l.isDefault,
                }))}
                currentLocale={currentLocale}
            />
        </div>
    );
}
