# Content Ownership Rules

## Overview

This document defines the **single source of truth** policy for all content and translations in the Silkbridge application.

---

## Core Rules

### Rule 1: Marketing/Website Content → DATABASE ONLY

All public-facing marketing content MUST come from the database (PageTranslation, SiteSettings):

| Content Type | Source | Table |
|--------------|--------|-------|
| Page headlines, paragraphs | DB | `PageTranslation.blocks` |
| Service descriptions | DB | `PageTranslation.blocks` |
| Hero sections | DB | `PageTranslation.blocks` |
| About page content | DB | `PageTranslation.blocks` |
| Partner information | DB | `PageTranslation.blocks` |
| FAQ questions/answers | DB | `PageTranslation.blocks` |
| Contact section text | DB | `PageTranslation.blocks` |
| Footer tagline | DB | `SiteSettingsTranslation.tagline` |
| SEO titles/descriptions | DB | `PageTranslation.seoTitle/seoDescription` |

**These must NOT exist in `messages/*.json`.**

### Rule 2: UI Chrome/System Labels → MESSAGES JSON ALLOWED

Static UI elements that don't change can use `next-intl` messages:

| Content Type | Source | Example |
|--------------|--------|---------|
| Admin button labels | messages | "Save Draft", "Publish" |
| Form validation errors | messages | "Email is required" |
| Admin panel labels | messages | "SEO Title", "Content Blocks" |
| Error pages | messages | "Page not found" |
| Loading states | messages | "Loading..." |
| Toast notifications | messages | "Changes saved" |

### Rule 3: Navigation Labels → CODE (Structural)

Navigation is structural, not editable content. Use `lib/content/getNavigation.ts`:

```typescript
import { getNavigationItems } from '@/lib/content';

const nav = getNavigationItems(locale);
// Returns: { main: [...], footer: {...}, social: [...] }
```

### Rule 4: Never Mix Sources in Components

A component must be either:

**A) DB-driven content component** (public sections)
```typescript
// ✅ CORRECT - Uses only DB content
export default async function HeroSection({ pageSlug, locale }) {
    const content = await getPageContent(pageSlug, locale);
    return <div>{content.blocks[0].data.headline}</div>;
}
```

**B) UI-only component** (admin/system)
```typescript
// ✅ CORRECT - Uses only messages
export default function SaveButton() {
    const t = useTranslations('admin');
    return <button>{t('saveDraft')}</button>;
}
```

**❌ WRONG - Mixed sources**
```typescript
export default function HeroSection() {
    const t = useTranslations('hero'); // ❌ Marketing content from messages
    const settings = await getSiteSettings(); // ✅ DB
    return <div>{t('headline')}</div>; // ❌ Wrong!
}
```

---

## Content Access Layer

All public pages MUST use the Content Access Layer:

```typescript
import { 
    getPageContent,
    getSiteSettings,
    getNavigationItems,
    getFaqItems 
} from '@/lib/content';

// Page content
const page = await getPageContent('home', locale);

// Site settings (contact info, social links)
const settings = await getSiteSettings(locale);

// Navigation items
const nav = getNavigationItems(locale);

// FAQ items from a page
const faqs = await getFaqItems('services', locale);
```

---

## Fallback Behavior

### Public Pages
1. Try requested locale (published translation)
2. Fallback to default locale (published translation)
3. Show safe placeholder (NOT 404)

### Admin Editor
1. Load translation for selected locale
2. If missing: auto-create draft from default locale
3. Always show selected locale content (draft or published)

---

## Content Map

| Page | Slug | Content Source |
|------|------|----------------|
| Home | `home` | DB: PageTranslation |
| About | `about` | DB: PageTranslation |
| Services | `services` | DB: PageTranslation |
| Partners | `partners` | DB: PageTranslation |
| Contact | `contact` | DB: PageTranslation |
| Market Insights | - | Static TypeScript (to migrate) |

| Site Element | Source |
|--------------|--------|
| Header nav | `getNavigationItems()` |
| Footer links | `getNavigationItems()` |
| Footer tagline | DB: `SiteSettingsTranslation.tagline` |
| Contact info | DB: `SiteSettings.contactEmail/Phone/Address` |
| Social links | DB: `SiteSettings.socialLinks` |

---

## Migration Checklist

When adding new content:

- [ ] Is it marketing/editable content? → Use DB
- [ ] Is it UI chrome/system label? → Use messages
- [ ] Is it navigation structure? → Use `getNavigation.ts`
- [ ] Never duplicate content between DB and messages
- [ ] Remove unused message keys after migration

---

## File Structure

```
lib/content/
├── index.ts          # Exports all content getters
├── getPage.ts        # Page content (blocks, SEO)
├── getSettings.ts    # Site settings (contact, social)
├── getNavigation.ts  # Navigation items
└── getFaq.ts         # FAQ extraction from blocks

messages/
├── en.json           # UI labels only (admin, errors, forms)
├── az.json           # UI labels only
└── ru.json           # UI labels only
```

---

## Why This Matters

1. **Single source of truth** prevents inconsistencies
2. **Admin editable** content can be updated without code changes
3. **Proper locale fallback** prevents 404s
4. **Clean separation** makes maintenance easier
5. **Type safety** through centralized content getters
