import { notFound } from 'next/navigation';
import { getPageConfig } from '@/lib/admin/page-config';
import { getPageContentForAdmin } from '@/lib/blocks/content';
import { getEnabledLocales } from '@/lib/actions';
import PageEditorNew from '@/components/admin/PageEditorNew';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ locale?: string }>;
}

export default async function EditPagePage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { locale } = await searchParams;

    // Validate page exists in config (locked structure)
    const pageConfig = getPageConfig(slug);
    if (!pageConfig) {
        notFound();
    }

    const locales = await getEnabledLocales();
    const currentLocale = locale || locales[0]?.code || 'en';

    // Fetch content for admin (includes drafts, auto-creates missing translations)
    const { page, translation, allTranslations } = await getPageContentForAdmin(slug, currentLocale);

    if (!page || !translation) {
        notFound();
    }

    return (
        <div className="px-6 py-6">
            {/* Key forces remount on locale change — resets all form state */}
            <PageEditorNew
                key={`${slug}:${currentLocale}`}
                pageConfig={pageConfig}
                pageId={page.id}
                translation={{
                    id: translation.id,
                    title: translation.title,
                    seoTitle: translation.seoTitle,
                    seoDescription: translation.seoDescription,
                    ogImage: translation.ogImage,
                    blocks: translation.blocks,
                    status: translation.status,
                    updatedAt: translation.updatedAt,
                    updatedBy: translation.updatedBy,
                }}
                locales={locales as Array<{
                    code: string;
                    name: string;
                    nativeName: string;
                    flag: string | null;
                    isDefault: boolean;
                }>}
                currentLocale={currentLocale}
                allTranslations={allTranslations}
            />
        </div>
    );
}
