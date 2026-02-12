# Logo Upload - Quick Reference

## Admin Panel Usage

### Upload Logo
1. Go to **Admin Panel** → **Settings** → **Branding** tab
2. Click **"Upload Logo"** button
3. Select file (PNG, JPEG, WebP, or SVG - max 2MB)
4. Logo preview appears instantly
5. Click **"Save Settings"** at top to publish
6. Logo now appears in public header

### Remove Logo
1. In Branding tab, click **"Remove"** button next to logo
2. Click **"Save Settings"** 
3. Header reverts to default SVG logo

### Favicon Upload
- Same process as logo
- Recommended: 32×32px or 64×64px ICO/PNG
- Independent of logo settings

---

## Technical Reference

### Files Modified

| File | Purpose |
|------|---------|
| `components/layout/header.tsx` | Conditionally renders custom logo or fallback |
| `app/[locale]/layout.tsx` | Fetches settings and passes to header |
| `app/api/admin/uploads/blob/route.ts` | Handles file uploads to Vercel Blob |
| `components/admin/SettingsEditorNew.tsx` | Admin UI for logo upload |
| `lib/actions.ts` | Cache revalidation on settings save |

### API Endpoint

**POST** `/api/admin/uploads/blob`

**Request:**
```typescript
FormData {
  file: File,
  folder: 'brand' | 'insights'
}
```

**Response:**
```typescript
{
  url: string,
  success: boolean
}
```

**Validation:**
- Logo uploads: SVG, PNG, JPEG, WebP | Max 2MB
- Insights uploads: PNG, JPEG, WebP, GIF | Max 10MB
- Auth: Requires admin session

### Database Schema

**Already exists** (no migration needed):
```prisma
model SiteSettings {
  logoUrl    String?
  faviconUrl String?
  // ... other fields
}
```

### Cache Tags

Settings cached with tag: `settings:{locale}`

**Revalidation triggers:**
- When `updateSiteSettings()` called
- Invalidates all locale caches
- Revalidates layout path: `/, 'layout'`

---

## UI Components Used

- `AdminButton` (variant: secondary, ghost)
- `AdminIcon` (names: image, trash)
- `AdminCard`, `AdminCardHeader`, `AdminCardContent`
- Hidden `<input type="file">` with ref

---

## Format Support

### Logo
- ✅ SVG (recommended for scalability)
- ✅ PNG (with transparency)
- ✅ JPEG
- ✅ WebP

### Favicon
- ✅ ICO
- ✅ PNG
- ✅ SVG

---

## Image Specs

### Logo
- **Ideal size:** 200×40px (width×height)
- **Max file size:** 2MB
- **Rendered height:** 32px (h-8 in Tailwind)
- **Background:** Transparent recommended
- **Aspect ratio:** Preserved via `object-contain`

### Favicon
- **Ideal size:** 32×32px or 64×64px
- **Max file size:** 2MB
- **Format:** Square aspect ratio

---

## Error Handling

### Upload Errors
- **File too large:** Toast error with size limit
- **Invalid format:** Toast error with allowed types
- **Network failure:** Logged to console, toast error shown
- **Unauthorized:** 401 response from API

### Fallback Behavior
- No logo uploaded → Default SVG logo
- Broken image URL → Hidden via `onError` handler
- Missing settings → Null-safe rendering

---

## Testing Steps

```bash
# 1. Start dev server
npm run dev

# 2. Login to admin
open http://localhost:3000/admin/login

# 3. Navigate to Settings
open http://localhost:3000/admin/settings

# 4. Click "Branding" tab

# 5. Test logo upload
# - Click "Upload Logo"
# - Select PNG/SVG file under 2MB
# - Verify preview appears
# - Click "Save Settings"

# 6. Check public header
open http://localhost:3000
# Should show custom logo

# 7. Test logo removal
# - Return to Settings → Branding
# - Click "Remove"
# - Click "Save Settings"
# - Verify header shows default SVG logo
```

---

## Production Deployment

### Vercel Blob Setup

1. **Enable Vercel Blob** in project dashboard
2. **Environment Variables** (auto-configured by Vercel):
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```
3. No additional configuration needed

### Database

No migration required - uses existing `logoUrl` and `faviconUrl` fields.

### Cache Warming

After deploy:
- First visitor to each locale triggers cache
- Subsequent requests served from cache
- Settings changes invalidate cache automatically

---

## Troubleshooting

### Logo not appearing in header

**Check:**
1. Settings saved in admin (`logoUrl` field in DB)
2. Layout fetching settings: `const settings = await getSiteSettings(locale)`
3. Header receiving props: `<Header logoUrl={...} siteName={...} />`
4. No console errors on image load

**Debug:**
```typescript
// In header.tsx, add:
console.log('Logo URL:', logoUrl);

// In layout.tsx, add:
console.log('Settings:', settings);
```

### Upload fails

**Check:**
1. User is logged in as admin
2. File size under 2MB
3. File format in allowed list
4. `BLOB_READ_WRITE_TOKEN` env var set
5. Network tab in DevTools for error details

**Debug:**
```typescript
// In SettingsEditorNew.tsx, handleLogoUpload:
console.log('Uploading file:', file.name, file.size, file.type);
```

### Cache not invalidating

**Check:**
1. `updateSiteSettings` calls `revalidateTag(getSettingsCacheTag(loc.code))`
2. Production environment (cache disabled in dev)
3. Verify cache headers in Network tab

**Force refresh:**
```bash
curl -X POST https://your-domain.com/api/revalidate?path=/
```

---

## Future Enhancements

### Already implemented ✅
- Logo upload with preview
- Favicon upload
- Remove functionality
- Vercel Blob storage
- Cache revalidation
- Fallback to default logo

### Potential additions 🎯
- [ ] Drag-and-drop upload
- [ ] Image cropping tool
- [ ] Multiple logo variants (light/dark mode)
- [ ] Logo alt text per locale
- [ ] Logo link customization
- [ ] Favicon auto-generation
- [ ] Logo dimensions validation
- [ ] Upload progress bar
- [ ] Image optimization settings

---

## Support

If issues persist:
1. Check [docs/LOGO_UPLOAD_FEATURE.md](./LOGO_UPLOAD_FEATURE.md) for full implementation details
2. Review Vercel Blob logs in dashboard
3. Check Prisma Studio for `SiteSettings` table data
4. Verify environment variables in Vercel dashboard
