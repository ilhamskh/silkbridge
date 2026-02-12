# Insights Module Updates

## Overview
Complete implementation of 4 targeted improvements to the Insights blog module:
1. ✅ Responsive hero alignment (320px-1280px+)
2. ✅ Working search (DB-level, debounced)
3. ✅ Vercel Blob image upload (cover + inline)
4. ✅ Improved editor (selection formatting + keyboard shortcuts)

## 1. Hero Alignment & Layout

### Changes Made
- **Moved search INTO hero section** for better visual hierarchy
- **Responsive container**: `max-w-7xl` with proper padding
- **Title/subtitle max-width**: `max-w-3xl` for optimal readability
- **Responsive padding**: `px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20`
- **Category chips redesign**: White text on transparent backdrop-blur in hero

### Files Modified
- `/app/[locale]/insights/InsightsPageContent.tsx`

### Testing Checklist
- [ ] 320px (iPhone SE) - Search bar not cramped
- [ ] 375px (iPhone 13 mini) - Category pills wrap correctly
- [ ] 768px (iPad) - Hero padding looks balanced
- [ ] 1024px (desktop) - Title max-width limits line length
- [ ] 1280px+ (large desktop) - Content properly centered

---

## 2. Working Search

### Changes Made
- **DB-level filtering**: Prisma `contains` mode (case-insensitive)
- **Search fields**: `translations.title` and `translations.excerpt`
- **Debounced input**: 300ms delay with useRef timer cleanup
- **URL query param**: Changed from `search` to `q` for consistency
- **Clear button**: X icon to reset search
- **Router method**: Changed from `push` to `replace` to avoid history pollution
- **Pre-pagination**: Search applied BEFORE limit/offset for accurate totals

### Files Modified
- `/app/[locale]/insights/page.tsx` - Changed searchParams interface
- `/app/[locale]/insights/InsightsPageContent.tsx` - Debounce + clear button
- `/lib/content/getInsights.ts` - Prisma where clause

### Testing Checklist
- [ ] Type search query → results filter after 300ms
- [ ] URL updates with `?q=searchterm`
- [ ] Click X button → search clears
- [ ] Search with no results → proper empty state
- [ ] Pagination resets to page 1 on new search

---

## 3. Vercel Blob Upload

### Backend API
**Endpoint**: `/app/api/admin/uploads/blob/route.ts`

**Features**:
- ✅ Admin-only auth (`requireAdmin()`)
- ✅ File validation:
  - Types: jpg, jpeg, png, webp, gif
  - Max size: 10MB
- ✅ Upload path: `insights/${timestamp}-${filename}`
- ✅ Random suffix for uniqueness
- ✅ Error responses: 401 (unauthed), 400 (invalid), 500 (upload fail)

### Frontend Integration
**File**: `/components/admin/insights/InsightEditor.tsx`

**Helper Functions**:
```typescript
uploadImage(file: File) → Promise<string> // Returns Blob URL
handleCoverUpload(e) → void // File input handler with toast
handleInlineImageUpload() → void // Dynamic picker with cursor insert
```

**UI Components** (both create & edit modes):
- Hidden file input + visible "Upload Cover Image" button (blue, full-width)
- Image preview thumbnail
- "Replace Image" / "Remove Image" actions
- Toast notifications (success/error)

**Toolbar Integration**:
- 📷 button triggers `handleInlineImageUpload()`
- Disabled state during upload (`isUploading`)
- Cursor position preserved for markdown insertion

### Testing Checklist
- [ ] Navigate to `/admin/insights/new`
- [ ] Click "Upload Cover Image" → file picker opens
- [ ] Select image → toast shows success → URL field populated
- [ ] Preview thumbnail appears
- [ ] Click "Replace Image" → can change cover
- [ ] Click "Remove Image" → clears URL and thumbnail
- [ ] Click 📷 toolbar button → file picker opens
- [ ] Select image → markdown `![alt](url)` inserted at cursor
- [ ] Test in edit mode (`/admin/insights/[id]`)
- [ ] Test error cases:
  - [ ] Upload without auth → 401
  - [ ] Upload 11MB file → validation error
  - [ ] Upload .pdf file → type error

---

## 4. Editor Improvements

### Selection-Based Formatting
**Helper Function**: `formatSelection(wrapper, current, setter, textareaRef)`
- Wraps selected text with markers (e.g., `**bold**`)
- If no selection, inserts opening/closing markers with cursor between
- Maintains cursor position using `setSelectionRange()`

### Keyboard Shortcuts
**Handler**: `handleKeyDown(e)`
- **Cmd/Ctrl + B**: Apply bold formatting
- **Cmd/Ctrl + I**: Apply italic formatting
- Prevents default browser behavior
- Uses React refs instead of `getElementById`

### Refactored Functions
**`insertMarkdown(action, current, setter, textareaRef)`**:
- Now accepts `textareaRef` parameter (not DOM query)
- Handles toolbar actions (H1-3, link, list, code, quote)
- Maintains cursor position correctly

**`MarkdownToolbar` updates**:
- Added `isUploading` prop
- Disabled state for image button during upload
- Updated button titles to show shortcuts (e.g., "Bold (Cmd+B)")

### Files Modified
- `/components/admin/insights/InsightEditor.tsx`
  - InsightEditorNew mode (create)
  - InsightEditorEdit mode (edit)
  - EditorField component (added `subtext` prop)
  - MarkdownToolbar component

### Testing Checklist
- [ ] Select text + click Bold → wraps with `**`
- [ ] Select text + click Italic → wraps with `_`
- [ ] No selection + Bold → inserts `****` with cursor between
- [ ] Cmd+B on selected text → applies bold
- [ ] Cmd+I on selected text → applies italic
- [ ] Keyboard shortcuts work in both create & edit modes
- [ ] Toolbar buttons maintain focus after action

---

## QA Summary

### TypeScript Compilation
```bash
npx tsc --noEmit
```
**Result**: ✅ **0 errors** - Clean build

### Dev Server Testing
```bash
npm run dev
```
**Navigate to**:
- `/insights` - Test search + hero layout
- `/admin/insights/new` - Test cover/inline upload
- `/admin/insights/[id]` - Test edit mode

### Production Build
```bash
npm run build
```
**Expected**: Successful build with no type errors

---

## Dependencies Used
- `@vercel/blob` - Image storage
- `sonner` - Toast notifications  
- `prisma` - Database queries
- `next-intl` - Internationalization
- React refs (`useRef<HTMLTextAreaElement>`) - Cursor management
- Debouncing (`useRef<NodeJS.Timeout>`) - Search delay

---

## Migration Notes
No database migrations required. Existing schema supports all new features.

---

## Rollback Plan
If issues arise:
1. Revert `/app/api/admin/uploads/blob/route.ts` (delete file)
2. Revert InsightEditor.tsx upload logic
3. Keep hero/search improvements (low risk)

---

## Future Enhancements
- [ ] Add drag-and-drop upload
- [ ] Image optimization (automatic resize/compress)
- [ ] Markdown preview pane (side-by-side)
- [ ] Auto-save drafts (every 30s)
- [ ] Bulk image delete from Vercel Blob
- [ ] Search autocomplete suggestions
- [ ] Advanced search (by category, date range)
