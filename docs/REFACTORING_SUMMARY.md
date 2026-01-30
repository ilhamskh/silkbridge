# Content Refactoring Summary

## Overview

This refactoring establishes a **Single Source of Truth** for content in the Silkbridge project:

- **Database (DB)**: All marketing/public content that admins may edit
- **Messages JSON**: Only UI chrome/system labels (form labels, buttons, error messages)

## Changes Made

### 1. Content Access Layer Created (`/lib/content/`)

New centralized content fetchers:

- **getPage.ts**: Fetches page content with locale fallback (requested → default → null)
- **getSettings.ts**: Fetches site settings with localized fields  
- **getNavigation.ts**: Provides navigation items with inline localized labels
- **getFaq.ts**: Extracts FAQ items from page content blocks
- **index.ts**: Main exports with JSDoc documentation

### 2. Layout Components Migrated

#### header.tsx
- ❌ Removed: `useTranslations('nav')`, `navigationConfig`
- ✅ Added: `getNavigationItems(locale)`, inline `uiLabels` object
- Changed `{t(item.labelKey)}` → `{item.label}`

#### footer.tsx
- ❌ Removed: `useTranslations('nav')`, `useTranslations('footer')`, `navigationConfig`
- ✅ Added: `getNavigationItems(locale)`, `getFooterSectionLabels(locale)`, inline `footerUiLabels`, `taglines`
- Changed all `t()` calls to direct property access

#### MobileMenu.tsx
- ❌ Removed: `useTranslations('nav')`, `navigationConfig`
- ✅ Added: `getNavigationItems(locale)`, inline `mobileMenuLabels`
- Changed all `t()` calls to direct property access

### 3. Legacy Components Removed

Deleted 5 unused section components that still used `useTranslations`:

- `components/sections/About.tsx`
- `components/sections/Contact.tsx`
- `components/sections/Services.tsx`
- `components/sections/Partners.tsx`
- `components/sections/InsightsSnapshot.tsx`

These were not imported anywhere and are replaced by DB-driven block renderers.

### 4. Messages Files Cleaned

Removed 9 unused translation namespaces from all locale files (`en.json`, `az.json`, `ru.json`):

| Namespace | Reason |
|-----------|--------|
| `nav` | Migrated to `getNavigation.ts` |
| `footer` | Migrated to `footer.tsx` inline |
| `hero` | Legacy, unused |
| `heroFramed` | Legacy, unused |
| `about` | Legacy section removed |
| `services` | Legacy section removed |
| `insights` | Legacy section removed |
| `partners` | Legacy section removed |
| `contact` | Legacy section removed |

**Result**: Messages files reduced from 567 → 436 lines each (~23% reduction)

### 5. Bug Fixes

- **getFaq.ts**: Fixed type error by removing non-existent `'faq-item'` block type check
- **Icons.tsx**: Added missing `facebook` icon that was causing "Element type is invalid" error
- **footer.tsx**: Added guard `if (!Icon) return null` to prevent crashes from missing icons

### 6. Documentation Created

- `/docs/content-ownership.md`: Comprehensive rules and migration guide
- `/scripts/clean-messages.js`: Reusable script to remove unused namespaces

## Namespaces Still In Use

The following translation namespaces remain in use:

| Namespace | Used By |
|-----------|---------|
| `common` | Shared UI strings |
| `aboutPage` | AboutPageContent |
| `contactPage` | ContactForm, ContactPageContent |
| `partnersPage` | PartnersPageContent |
| `servicesPage` | ServicesPageContent |
| `blog` | MarketInsightsIndex, BlogArticleContent |
| `seo` | Page metadata |
| `errors` | Error messages |
| `stats` | Statistics display |
| `accessibility` | A11y labels |

## Verification

- ✅ Build passes successfully
- ✅ All 3 locales (en, az, ru) render correctly
- ✅ Navigation displays proper localized labels
- ✅ Footer displays proper localized content
- ✅ Mobile menu works with localized content

## Future Work

1. **Migrate page content components**: `AboutPageContent`, `ServicesPageContent`, `PartnersPageContent` still use `useTranslations` for marketing content
2. **Create admin-editable settings**: Move taglines and footer text to SiteSettings in DB
3. **Clean up remaining legacy code**: Check for any other unused components/utilities
