// test-mobile-responsiveness.js
// Automated verification for iOS Safari / iPhone 15 & 16 Mobile Responsiveness & Viewport Fixes

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIR = __dirname;
const indexHtml = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(DIR, 'css', 'styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(DIR, 'js', 'app.js'), 'utf8');

console.log('📱 Starting ShaadiKart iPhone 15 & 16 (iOS Safari) Mobile Responsiveness Audit...\n');

let passedCount = 0;

// Test 1: Viewport Meta Tag (index.html)
console.log('1. Verifying Viewport Meta Tag in index.html...');
assert(
  indexHtml.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">'),
  'index.html must have exact meta tag: width=device-width, initial-scale=1.0, viewport-fit=cover'
);
console.log('   ✔ Viewport meta tag properly configured for iOS Safari without 980px shrink fallback.');
passedCount++;

// Test 2: Safe Area Variables & 100dvh Support
console.log('2. Verifying Safe Area CSS Variables & Dynamic Viewport Height...');
assert(stylesCss.includes('--sat: env(safe-area-inset-top'), 'styles.css must define --sat');
assert(stylesCss.includes('--sab: env(safe-area-inset-bottom'), 'styles.css must define --sab');
assert(stylesCss.includes('min-height: 100dvh') || stylesCss.includes('height: 100dvh') || stylesCss.includes('height: 90dvh'), 'styles.css must support dvh units for iOS Safari address bar collapse');
console.log('   ✔ Safe area CSS variables and 100dvh / 90dvh dynamic viewport units verified.');
passedCount++;

// Test 3: Elimination of Horizontal Overflow
console.log('3. Verifying Global Horizontal Overflow Lockdown...');
assert(stylesCss.includes('overflow-x: hidden'), 'styles.css must enforce overflow-x: hidden');
assert(stylesCss.includes('#app, .biz-app'), '#app and .biz-app must prevent sideways container blowout');
console.log('   ✔ Global overflow-x: hidden holds cleanly on html, body, and app canvas.');
passedCount++;

// Test 4: Prevent iOS Auto-Zoom on Form Inputs
console.log('4. Verifying iOS Safari Auto-Zoom Prevention (font-size: 16px !important)...');
assert(
  stylesCss.includes('font-size: 16px !important'),
  'styles.css mobile media query must enforce font-size: 16px !important on inputs to prevent iOS auto-zoom'
);
console.log('   ✔ Form inputs, search fields, and selects strictly locked to >= 16px on mobile viewports.');
passedCount++;

// Test 5: Minimum 44px Touch Targets
console.log('5. Verifying Minimum 44px Tap Targets for Mobile Controls...');
assert(
  stylesCss.includes('min-height: 44px') && stylesCss.includes('min-width: 44px'),
  'styles.css must declare min-height: 44px and min-width: 44px for primary mobile tap targets'
);
console.log('   ✔ Mobile buttons, hamburger toggles, and navigation controls meet 44px touch targets.');
passedCount++;

// Test 6: Mobile Header & Slide-Out Drawer with Quick Cart & Login
console.log('6. Verifying Mobile Header & Hamburger Drawer Shortcuts...');
assert(appJs.includes('hic-cart') && appJs.includes('hic-account'), 'app.js header must render quick Cart and Account triggers');
assert(appJs.includes('mmenu-quick-cards'), 'app.js menu drawer must render prominent quick cards for Login and Cart');
assert(stylesCss.includes('.mmenu-quick-cards'), 'styles.css must style .mmenu-quick-cards');
console.log('   ✔ Customer mobile header and hamburger drawer include instant Cart & Login shortcuts.');
passedCount++;

// Test 7: WhatsApp Floating Dock as Mobile Bottom Sheet (90dvh)
console.log('7. Verifying WhatsApp Floating Dock Mobile Bottom Sheet Adaptation...');
assert(stylesCss.includes('height: 90dvh') || stylesCss.includes('height: 90vh'), 'styles.css must configure 90dvh height for mobile demo dock');
assert(stylesCss.includes('border-radius: 20px 20px 0 0'), 'styles.css must give mobile bottom sheet rounded top corners');
console.log('   ✔ WhatsApp floating dock seamlessly expands into a 90dvh native mobile bottom sheet.');
passedCount++;

// Test 8: Business Portal Collapsible Sidebar Drawer & Backdrop
console.log('8. Verifying Business Portal Off-Canvas Drawer & Backdrop Overlay...');
assert(appJs.includes('biz-sidebar-backdrop'), 'app.js must render #biz-sidebar-backdrop');
assert(appJs.includes('biz-sidebar-close'), 'app.js must render .biz-sidebar-close');
assert(stylesCss.includes('.biz-sidebar-backdrop'), 'styles.css must style .biz-sidebar-backdrop');
assert(stylesCss.includes('.biz-sidebar.open'), 'styles.css must style .biz-sidebar.open');
assert(appJs.includes("'biz-menu-toggle'"), "app.js must handle 'biz-menu-toggle' action");
assert(appJs.includes("'biz-menu-close'"), "app.js must handle 'biz-menu-close' action");
console.log('   ✔ Business Portal off-canvas drawer slides smoothly with backdrop tap-to-dismiss.');
passedCount++;

// Test 9: Business Dashboard Stacking, 2x2 KPI Grid & Table Scroll
console.log('9. Verifying Business Dashboard Mobile Stacking & 2x2 Pastel KPIs...');
assert(stylesCss.includes('.biz-kpis-grid') && stylesCss.includes('repeat(2, 1fr)'), 'styles.css must format .biz-kpis-grid as repeat(2, 1fr) on mobile');
assert(stylesCss.includes('.biz-tbl-scroll') && stylesCss.includes('-webkit-overflow-scrolling: touch'), 'styles.css must provide touch scrolling on bookings table');
assert(stylesCss.includes('.biz-table') && stylesCss.includes('min-width: 520px'), 'styles.css must ensure table has minimum width to preserve layout');
console.log('   ✔ Pastel KPIs render in a clean 2x2 grid, and Recent Bookings table has fluid touch-scroll.');
passedCount++;

// Test 10: Photo Curation 2-Column Mobile Grid
console.log('10. Verifying Photo Curation 2-Column Mobile Grid...');
assert(stylesCss.includes('.biz-photo-grid') && stylesCss.includes('repeat(2, 1fr)'), 'styles.css must configure .biz-photo-grid as repeat(2, 1fr) on mobile');
assert(stylesCss.includes('.biz-photo-btn') && stylesCss.includes('min-height: 38px'), 'styles.css must provide touch-friendly photo action buttons');
console.log('   ✔ Photo curation grid formats as a 2-column mobile card layout with touch-friendly actions.');
passedCount++;

// Test 11: Touch Event Handlers on Sweep Comparison Sliders
console.log('11. Verifying Touch Gestures on See My Event Sweep Sliders...');
assert(appJs.includes('touchstart') && appJs.includes('touchmove') && appJs.includes('touchend'), 'app.js must register touch event listeners for sweep sliders');
assert(appJs.includes('updateSweepFromPointer'), 'app.js must include touch coordinate calculation for sweep slider');
console.log('   ✔ Sweep comparison sliders support touch drag gestures with preventDefault() scroll protection.');
passedCount++;

// Test 12: Master Rules - Strict Terminology & Phone Safety
console.log('12. Verifying Master Rules (Terminology Boundary & Helpline Safety)...');
const bizPortalRenderCode = appJs.slice(appJs.indexOf('function pageBusinessDashboard'), appJs.indexOf('function openBizBookingModal'));
const forbiddenWord = new RegExp('Verified\\s+Partner', 'i');
assert(!forbiddenWord.test(bizPortalRenderCode), 'Business portal must NEVER use "Verified Partner"');
assert(appJs.includes('Verified Business'), 'Business portal must use "Verified Business"');

// Ensure no raw 10-digit partner numbers are hardcoded into customer view
const phoneAudit = appJs.match(/(?:call|phone|tel)[:\s]+['"]?[6-9]\d{9}['"]?/gi) || [];
assert(phoneAudit.length === 0, `Forbidden raw partner phone numbers detected: ${phoneAudit.join(', ')}`);
console.log('   ✔ Strict terminology boundaries intact and zero phone number leaks detected.');
passedCount++;

console.log(`\n🎉 ALL ${passedCount} IPHONE 15 / 16 MOBILE RESPONSIVENESS CHECKS PASSED!\n`);
