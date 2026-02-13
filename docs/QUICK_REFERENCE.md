# Enhanced Services & Partners - Quick Reference

## ✨ Services Section

### Basic Usage (Default - Cards Layout)
```tsx
import { InteractiveServices } from '@/components/sections/InteractiveServices';

<InteractiveServices 
  block={servicesBlock} 
  // variant="cards" is default - premium card layout
/>
```

### With Gallery
```tsx
<InteractiveServices 
  block={servicesBlock}
  gallery={{
    images: [
      { url: '/img/service1.jpg', alt: 'Description', caption: 'Optional caption' },
      { url: '/img/service2.jpg', alt: 'Description' },
      // ... up to 8 images shown
    ]
  }}
/>
```

### Original Tabs Layout (If Needed)
```tsx
<InteractiveServices 
  block={servicesBlock}
  variant="tabs"  // Use original tab/accordion layout
/>
```

### Features
- ✅ Capability highlights (auto-derived from first 3 services)
- ✅ Responsive grid: 1/2/3 columns
- ✅ Premium card design with hover states
- ✅ Optional gallery integration
- ✅ Full accessibility support

---

## 👥 Partners Section

### Usage
```tsx
import { PartnersEnhanced } from '@/components/sections/PartnersEnhanced';

<PartnersEnhanced
  partners={partners}  // Array from getPartners(locale)
  eyebrow="Trusted Network"  // Optional
  headline="Our Partners"
  description="Custom description"  // Optional (uses trust statement by default)
  locale={locale}
/>
```

### Features
- ✅ Auto-grouped by category (GOVERNMENT, HOSPITAL, PHARMA, INVESTOR, ASSOCIATION)
- ✅ Mobile: Collapsible accordion (first category open by default)
- ✅ Desktop: Stacked category blocks with headers & counts
- ✅ Category legend chips with icons
- ✅ Responsive grid: 2/3/4/5 columns
- ✅ Premium empty state (no partners)
- ✅ Full localization (EN/AZ/RU)

---

## 📱 Responsive Breakpoints

| Device | Services Cols | Partners Cols |
|--------|--------------|---------------|
| Mobile (320-767px) | 1 | 2 |
| Tablet (768-1023px) | 2 | 3 |
| Desktop (1024-1279px) | 3 | 4 |
| Large (1280px+) | 3 | 5 |

---

## 🎨 Design System

### Colors
- Primary: `primary-600` (#2F68BB)
- Surface: `surface` (#F7FAFF)
- Text: `ink`, `muted`, `subtle`

### Components
- Card radius: `rounded-card-lg` (20px)
- Shadows: `shadow-card`, `shadow-card-hover`
- Pills: `rounded-pill` (full round)

---

## 🔧 Customization

### Services Gallery
Fetch from database gallery system:
```tsx
import { getGalleryImages } from '@/lib/data/gallery';

const gallery = await getGalleryImages('services');
<InteractiveServices block={block} gallery={gallery} />
```

### Partner Categories
Edit labels in `PartnersEnhanced.tsx`:
```tsx
const CATEGORY_CONFIG = {
  HOSPITAL: {
    label: { en: 'Healthcare', az: 'Səhiyyə', ru: 'Здравоохранение' }
    // ...
  }
}
```

---

## ✅ QA Checklist

### Visual
- [ ] Cards render correctly at all breakpoints
- [ ] Hover effects work smoothly
- [ ] Category grouping displays properly
- [ ] Gallery images lazy-load
- [ ] Empty states show when needed

### Functional
- [ ] Links navigate correctly
- [ ] Accordions expand/collapse (mobile)
- [ ] Capability highlights show correct services
- [ ] Category counts are accurate

### Performance
- [ ] No layout shift during load
- [ ] Animations smooth (60fps)
- [ ] Images optimized with Next.js Image
- [ ] Lighthouse score >90

### Accessibility
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Alt text on all images
- [ ] Color contrast WCAG AA compliant
- [ ] Screen reader friendly

---

## 📚 Files Changed

### New Components
- `/components/sections/ServicesEnhanced.tsx` ⭐ NEW
- `/components/sections/PartnersEnhanced.tsx` ⭐ NEW

### Modified Files
- `/components/sections/InteractiveServices.tsx` - Added variant prop
- `/app/[locale]/partners/PartnersPageClient.tsx` - Uses PartnersEnhanced

### Documentation
- `/docs/UI_ENHANCEMENT_SUMMARY.md` - Full implementation guide
- `/docs/QUICK_REFERENCE.md` - This file

---

## 🚀 Deployment

No special steps needed:
1. Changes are backward compatible
2. No database migrations required
3. No environment variables needed
4. Build passes: `npm run build`

---

## 💡 Tips

1. **Gallery Performance**: Limit to 8-10 images max
2. **Category Order**: Partners auto-sort by ENUM order in database
3. **Localization**: All text supports EN/AZ/RU
4. **Empty States**: Handled automatically based on data
5. **Accessibility**: Focus states work out of the box

---

**Last Updated**: February 2026  
**Compatibility**: Next.js 14+, React 18+
