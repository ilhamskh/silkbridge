/**
 * Content Access Layer
 * ====================
 * 
 * Single source of truth for all public-facing content.
 * All marketing/website content MUST be fetched through these functions.
 * 
 * RULES:
 * 1. All public page content comes from DB (PageTranslation)
 * 2. Site settings (nav labels, footer, contact info) come from DB (SiteSettings + SiteSettingsTranslation)
 * 3. Partners come from DB (Partner + PartnerTranslation)
 * 4. Fallback: requested locale -> default locale -> safe placeholder
 * 5. Never mix DB content with messages JSON in public components
 * 
 * Cache tags:
 * - page:{slug}:{locale} — per page per locale
 * - pages:all — all pages
 * - settings:{locale} — site settings per locale
 * - partners:{locale} — partners per locale
 * - partners:all — all partners
 * - locales — locale list
 * 
 * For UI chrome/system labels (admin panel, generic buttons), use next-intl messages.
 */

export { getPageContent, type PageContent } from './getPage';
export { getSiteSettings, getEnabledLocales, type PublicSiteSettings } from './getSettings';
export { getNavigationItems, getFooterSectionLabels, type NavigationItem, type NavigationConfig } from './getNavigation';
export { getFaqItems, type FaqItem } from './getFaq';
export { getPartners, type PublicPartner } from './getPartners';

// Cache tag helpers — re-export for use in admin actions
export { getPageCacheTag, getAllPagesCacheTag } from './getPage';
export { getSettingsCacheTag } from './getSettings';
export { getPartnersCacheTag, getAllPartnersCacheTag } from './getPartners';
