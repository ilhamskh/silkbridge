# Silkbridge International Website

A premium, high-performance Next.js static website for Silkbridge International, featuring advanced performance optimizations, multilingual support, and elegant animations.

## 🚀 Performance Optimizations

This website has been extensively optimized for mobile performance with a focus on delivering a smooth 60fps experience while minimizing battery usage.

### Performance Targets

| Metric | Target | Purpose |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | Fast visual feedback |
| CLS (Cumulative Layout Shift) | < 0.1 | Stable layout |
| INP (Interaction to Next Paint) | < 200ms | Responsive interactions |
| FPS | 60fps | Smooth animations |

### Mobile-First Optimizations

#### 1. **Intelligent Animation Scaling**
- **Touch Device Detection**: Automatically detects touch devices and reduces animation complexity
- **Pointer Parallax**: Completely disabled on mobile/touch devices
- **Scroll Parallax**: Reduced range on mobile (0-12px vs 0-40px on desktop)
- **Reduced Motion Support**: Respects `prefers-reduced-motion` system preference
- **Performance Logic**:
  ```typescript
  if (prefersReducedMotion || isTouchDevice) {
    // Disable intensive effects
  }
  ```

#### 2. **Optimized Parallax Implementation**
- **Desktop**:
  - Pointer parallax with RAF (Request Animation Frame) throttling
  - Quantized updates (only when delta > 0.05 to reduce re-renders)
  - Max translate: 8px, rotate: 1.5deg
  - Smooth interpolation with motion values
- **Mobile**:
  - Pointer parallax: OFF
  - Scroll parallax: Limited to 12px max
  - Reduced glow intensity
  - Simplified blur effects (blur-2xl vs blur-3xl)
- **Reduced Motion**:
  - All parallax effects: OFF
  - Static positioning with simple fade-ins

#### 3. **Efficient Event Handling**
- **Passive Scroll Listeners**: All scroll events use `{ passive: true }` flag
- **RAF Throttling**: Mouse move events throttled via requestAnimationFrame
- **Direct Style Updates**: Parallax uses refs and direct style manipulation (no React state updates on every frame)
- **Single Scroll Handler**: One centralized scroll listener vs multiple competing listeners

#### 4. **Reduced Paint & Compositing Cost**
- **Mobile Blur Reduction**: `blur-2xl` on mobile vs `blur-3xl` on desktop
- **Backdrop Filter Fallback**: Solid backgrounds on mobile when appropriate
- **Selective will-change**: Only applied to actively animating elements, removed when idle
- **Transform-Only Animations**: All animations use `transform` and `opacity` only
- **Composite Layers**: Hero parallax element uses a single composite layer

#### 5. **Bundle Size Optimization**
- **Framer Motion**: Used strategically only where needed
- **No Heavy Dependencies**: Minimal third-party packages
- **Tree Shaking**: Next.js automatic tree shaking for unused code
- **Code Splitting**: Dynamic imports for heavy components (ready for implementation)

#### 6. **Image Optimization**
- **next/image**: All images use Next.js Image component
- **Priority Loading**: LCP image marked with `priority` flag
- **Proper Sizing**: All images have explicit width/height or fill with stable containers
- **Modern Formats**: AVIF/WebP support via Next.js (ready for image assets)
- **Responsive Images**: Correct `sizes` attribute for each breakpoint

#### 7. **Layout Stability**
- **Font Loading**: `next/font` with `display: swap` to prevent FOIT
- **Reserved Space**: All images have dimensions or stable containers
- **Fixed Header Height**: Header height reserved to prevent layout shift
- **No Layout Animations**: Width/height/top/left never animated

### Premium Mobile Navigation

The site features a premium website-style navigation instead of app-like tab bars:

#### Header Design
- **Sticky Top Header**: Always accessible, minimal and elegant
- **Compact CTA Pill**: "Contact" button visible on mobile
- **Hamburger Menu**: Clean slide-in drawer with focus trap
- **Smooth Transitions**: CSS transforms for 60fps animations
- **ESC Key Support**: Close menu with Escape key
- **Body Scroll Lock**: Prevents background scrolling when menu open

#### Mobile Menu Features
- **Slide-in Animation**: 300ms ease-out transform
- **Backdrop Blur**: Elegant overlay with backdrop-blur-sm
- **Staggered Items**: Sequential fade-in for nav items
- **Language Switcher**: Integrated within menu
- **Accessibility**: Proper ARIA labels, focus management, keyboard navigation

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (optimized usage)
- **i18n**: next-intl
- **Deployment**: Static export ready

## 📁 Project Structure

```
silkbridge/
├── app/
│   ├── [locale]/          # Localized routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/
│   │   ├── Header.tsx     # Main header with navigation
│   │   ├── MobileMenu.tsx # Premium mobile menu
│   │   └── Footer.tsx     # Footer component
│   ├── sections/          # Page sections
│   └── ui/                # Reusable UI components
├── lib/
│   └── device-detection.ts # Performance utilities
├── messages/              # i18n translations
├── content/               # Site content & config
└── i18n/                  # Internationalization config
```

## 🌐 Internationalization

Supports multiple languages with next-intl:
- English (en)
- Azerbaijani (az)

All strings are externalized in JSON files under `/messages/`.

## 🎨 Design Philosophy

- **Premium Feel**: Website, not app - elegant and professional
- **Subtle Animations**: Enhance, don't distract
- **Performance First**: Smooth on all devices, especially mobile
- **Accessibility**: WCAG compliant, keyboard navigable
- **Responsive**: Mobile-first, tablet, desktop optimized

## 🚦 Performance Checklist

Before deployment, verify:

- [ ] LCP < 2.5s on mobile (test with throttled 4G)
- [ ] CLS < 0.1 (no layout shifts during load)
- [ ] INP < 200ms (interactions feel instant)
- [ ] No continuous animations running off-screen
- [ ] All images have proper dimensions/containers
- [ ] Fonts loaded with swap strategy
- [ ] No unnecessary JavaScript on mobile
- [ ] Passive scroll listeners everywhere
- [ ] Touch devices have reduced animations
- [ ] Hamburger menu works smoothly on low-end devices

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Performance Monitoring

### Lighthouse Audit
Run regular Lighthouse audits:
```bash
# Desktop
lighthouse https://your-site.com --preset=desktop

# Mobile (simulated)
lighthouse https://your-site.com --preset=mobile --throttling-method=simulate
```

### Core Web Vitals
Monitor in production:
- Use Chrome DevTools Performance tab
- Check Web Vitals extension
- Monitor Real User Metrics (RUM) if available

### Testing on Real Devices
- Test on actual iPhone/Android devices
- Check battery drain during scroll
- Verify 60fps with Chrome DevTools FPS meter
- Test with "Enable paint flashing" to identify repaints

## 🎯 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari iOS 14+
- Chrome Android (latest)

## 📝 Key Performance Decisions

### Why No Bottom Tab Bar?
- Premium website feel vs app-like interface
- Better use of screen real estate
- Standard web navigation patterns
- Reduced complexity and state management
- Better for SEO and accessibility

### Why Reduce Animations on Mobile?
- Battery efficiency
- Smoother scrolling experience
- Lower CPU/GPU usage
- Better on low-end devices
- Respects user preferences (reduced motion)

### Why Direct Style Manipulation?
- Avoids React re-renders on every frame
- Smoother 60fps animations
- Lower memory usage
- Better for continuous animations like parallax

### Why Passive Scroll Listeners?
- Prevents blocking main thread
- Browser can optimize scrolling
- 60fps scroll on mobile
- Better touch response

## 🔍 Debugging Performance Issues

If you notice performance problems:

1. **Check Device Detection**: Verify `isTouchDevice()` returns correct value
2. **Verify Reduced Motion**: Check if animations are properly disabled
3. **Monitor RAF Calls**: Ensure no infinite RAF loops
4. **Check Will-Change**: Remove from idle elements
5. **Verify Passive Listeners**: All scroll listeners should be passive
6. **Inspect Layers**: Use Chrome DevTools Layers panel
7. **Profile with Performance Tab**: Record and analyze

## 📄 License

Proprietary - Silkbridge International

## 🤝 Contributing

This is a private project. For changes, please contact the development team.

---

**Built with performance and premium design in mind** 🚀
