# Performance Testing Guide

This document provides step-by-step instructions for testing and validating the performance optimizations implemented in the Silkbridge website.

## Quick Performance Checklist

Use this checklist before any deployment:

### Desktop Testing
- [ ] Lighthouse score > 90 (Performance)
- [ ] No console errors or warnings
- [ ] Parallax effects work smoothly on mouse move
- [ ] Scroll animations are smooth (60fps)
- [ ] All images load properly
- [ ] Navigation menu works correctly
- [ ] Language switcher functions properly

### Mobile Testing
- [ ] Lighthouse mobile score > 85
- [ ] Touch interactions feel instant (< 100ms)
- [ ] No janky scrolling
- [ ] Parallax effects are reduced/disabled
- [ ] Hamburger menu opens smoothly
- [ ] CTA pill is easily tappable
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling

### Core Web Vitals
- [ ] LCP < 2.5s on 4G throttled
- [ ] CLS < 0.1 (no layout shifts)
- [ ] INP < 200ms (interactions responsive)
- [ ] FCP < 1.8s (first paint is fast)

## Detailed Testing Procedures

### 1. Desktop Performance Testing

#### Using Chrome DevTools

1. **Open Chrome DevTools** (F12 or Cmd+Option+I)
2. **Go to Performance Tab**
3. **Record while performing these actions**:
   - Scroll through the entire homepage
   - Move mouse over the hero section (parallax)
   - Open/close the language dropdown
   - Navigate between pages
4. **Analyze Results**:
   - Look for long tasks (> 50ms)
   - Check FPS (should be steady 60fps)
   - Verify no forced reflows/layouts during scroll
   - Check for memory leaks

#### Expected Results
- Main thread idle most of the time
- GPU process handles animations
- No warnings about forced layouts
- JavaScript execution < 2s total

### 2. Mobile Performance Testing

#### Using Chrome DevTools Mobile Emulation

1. **Open DevTools** → **Toggle Device Toolbar** (Cmd+Shift+M)
2. **Select Device**: iPhone 12 Pro or Samsung Galaxy S20
3. **Enable CPU Throttling**: 4x slowdown
4. **Enable Network Throttling**: Fast 3G or 4G
5. **Record Performance**:
   - Load homepage
   - Scroll through content
   - Open hamburger menu
   - Close menu
   - Navigate to another page

#### Expected Results Mobile
- Page loads in < 4s on throttled connection
- Scroll maintains 50+ fps (accounting for throttling)
- Menu animations are smooth
- Touch targets are easily tappable (> 44x44px)

### 3. Lighthouse Audit

#### Desktop Audit

```bash
# Install Lighthouse CLI (optional)
npm install -g lighthouse

# Run audit
lighthouse https://your-site.com \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-desktop.html
```

#### Mobile Audit

```bash
lighthouse https://your-site.com \
  --preset=mobile \
  --throttling-method=simulate \
  --output=html \
  --output-path=./lighthouse-mobile.html
```

#### Target Scores
- **Performance**: > 90 (desktop), > 85 (mobile)
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

### 4. Real Device Testing

#### iOS Testing (iPhone)

1. **Open in Safari**
2. **Connect to Mac** → **Safari Inspector**
3. **Test These Scenarios**:
   - Scroll performance
   - Menu opening/closing
   - Touch target sizes
   - Safe area insets (notch compatibility)
   - Orientation changes

#### Android Testing

1. **Open in Chrome**
2. **Enable USB Debugging**
3. **Connect to Desktop** → **chrome://inspect**
4. **Remote DevTools** → Record performance
5. **Test**:
   - Scroll smoothness
   - Menu animations
   - Touch responsiveness
   - Back button behavior

### 5. Device Detection Verification

Test that the site correctly detects device capabilities:

#### Desktop (Non-Touch)
```javascript
// In browser console
console.log('Touch:', 'ontouchstart' in window); // Should be false
console.log('Coarse Pointer:', window.matchMedia('(pointer: coarse)').matches); // false
```

**Expected Behavior**:
- Pointer parallax: ✅ ENABLED
- Scroll parallax range: 0-40px
- Blur effects: Full strength

#### Mobile (Touch)
```javascript
// In browser console on mobile
console.log('Touch:', 'ontouchstart' in window); // Should be true
console.log('Coarse Pointer:', window.matchMedia('(pointer: coarse)').matches); // true
```

**Expected Behavior**:
- Pointer parallax: ❌ DISABLED
- Scroll parallax range: 0-12px
- Blur effects: Reduced

#### Reduced Motion
```javascript
// In browser console
console.log('Prefers Reduced Motion:', 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
);
```

**Expected Behavior** (if user enables reduced motion):
- All parallax: ❌ DISABLED
- Scroll animations: Simplified
- Transitions: Faster/simpler

### 6. Animation Performance Testing

#### FPS Monitoring

1. **Open Chrome DevTools**
2. **Cmd/Ctrl + Shift + P** → "Show Rendering"
3. **Enable "FPS Meter"**
4. **Test These Actions**:
   - Scroll homepage
   - Hover over hero section (desktop)
   - Open/close menu
   - Page transitions

**Target**: Maintain 60 FPS (green bar)

#### Paint Flashing

1. **DevTools** → **Rendering** → **Paint Flashing**
2. **Scroll and interact**
3. **Check for excessive repaints**

**Expected**:
- Minimal flashing during scroll
- Only menu area flashes when opening/closing
- No full-page repaints

### 7. Network Performance

#### First Load
1. **DevTools** → **Network Tab**
2. **Disable Cache**
3. **Throttle to "Fast 3G"**
4. **Reload Page**

**Monitor**:
- Total size: < 1MB for initial load
- Number of requests: < 50
- Critical rendering path: < 3s

#### Image Loading
- All images should use WebP/AVIF
- Hero image loads with priority
- Below-fold images lazy load
- Correct `sizes` attribute set

### 8. Memory Leak Testing

#### Procedure
1. **DevTools** → **Memory Tab**
2. **Take Heap Snapshot** (baseline)
3. **Navigate through 5-10 pages**
4. **Return to homepage**
5. **Force Garbage Collection** (trash icon)
6. **Take Another Heap Snapshot**
7. **Compare**

**Expected**:
- Memory should return close to baseline
- No detached DOM nodes
- No event listeners piling up

### 9. Battery Usage Testing (Mobile)

#### iOS
1. **Settings** → **Battery**
2. **Note current percentage**
3. **Use site for 5 minutes** (scroll, navigate)
4. **Check battery usage**

**Expected**: < 2% battery drain in 5 minutes

#### Android
1. **Settings** → **Battery** → **Battery Usage**
2. **Use Chrome/site for 5 minutes**
3. **Check app battery consumption**

**Expected**: Chrome should be < 5% of battery usage

### 10. Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Press Enter to activate buttons/links
- [ ] ESC closes mobile menu
- [ ] Focus visible on all elements
- [ ] No keyboard traps

#### Screen Reader Testing
- [ ] VoiceOver (Mac): Cmd+F5
- [ ] NVDA (Windows): Free download
- [ ] TalkBack (Android): Settings → Accessibility

**Test**:
- Navigation structure makes sense
- All images have alt text
- Form fields have labels
- ARIA labels are descriptive

## Performance Regression Monitoring

### Automated Testing Setup

Create a performance budget in `lighthouse-ci` config:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}],
        "max-potential-fid": ["error", {"maxNumericValue": 200}]
      }
    }
  }
}
```

### CI/CD Integration

Add to your build pipeline:

```yaml
# Example GitHub Actions
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

## Common Performance Issues & Solutions

### Issue: Slow LCP
**Symptoms**: Hero image loads slowly  
**Solutions**:
- Add `priority` to hero image
- Optimize image size
- Use `fetchPriority="high"`
- Preload critical assets

### Issue: High CLS
**Symptoms**: Layout shifts during load  
**Solutions**:
- Set explicit image dimensions
- Reserve space for dynamic content
- Load fonts with `font-display: swap`

### Issue: Janky Scrolling
**Symptoms**: Stuttering during scroll  
**Solutions**:
- Remove heavy scroll listeners
- Use passive event listeners
- Reduce animation complexity
- Check for forced layouts

### Issue: Slow INP
**Symptoms**: Delayed interactions  
**Solutions**:
- Reduce JavaScript execution
- Debounce/throttle event handlers
- Use web workers for heavy computation
- Split large tasks

### Issue: High Memory Usage
**Symptoms**: Browser becomes sluggish  
**Solutions**:
- Remove event listeners properly
- Avoid creating too many objects
- Clear intervals/timeouts
- Dispose of Framer Motion components

## Performance Optimization Workflow

1. **Measure** → Run Lighthouse & DevTools
2. **Identify** → Find bottlenecks
3. **Optimize** → Apply specific fixes
4. **Test** → Verify improvements
5. **Monitor** → Track in production
6. **Repeat** → Continuous improvement

## Tools & Resources

### Testing Tools
- **Chrome DevTools**: Built-in performance analysis
- **Lighthouse**: Automated audits
- **WebPageTest**: Detailed waterfall analysis
- **GTmetrix**: Performance monitoring
- **PageSpeed Insights**: Real-world CrUX data

### Mobile Testing
- **BrowserStack**: Real device cloud testing
- **Chrome Remote Debugging**: Android devices
- **Safari Inspector**: iOS devices
- **Responsively App**: Multi-device preview

### Monitoring (Production)
- **Vercel Analytics**: Core Web Vitals
- **Google Analytics 4**: User metrics
- **Sentry**: Error tracking
- **LogRocket**: Session replay

---

**Remember**: Performance is not a one-time task. Continuously monitor, test, and optimize! 🚀
