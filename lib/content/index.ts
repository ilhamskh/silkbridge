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
 * 3. Fallback: requested locale -> default locale -> safe placeholder
 * 4. Never mix DB content with messages JSON in public components
 * 
 * For UI chrome/system labels (admin panel, generic buttons), use next-intl messages.
 */

export { getPageContent, type PageContent } from './getPage';
export { getSiteSettings, type PublicSiteSettings } from './getSettings';
export { getNavigationItems, type NavigationItem } from './getNavigation';
export { getFaqItems, type FaqItem } from './getFaq';
