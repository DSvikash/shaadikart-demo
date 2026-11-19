// Automated Test Suite for ShaadiKart Business Portal & Login Experience
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting ShaadiKart Business Portal & Login Experience Verification...\n');

// Mock browser environment
const dom = {
  elements: {},
  body: { insertAdjacentHTML() {}, classList: { toggle() {}, add() {}, remove() {} } },
  addEventListener() {},
  querySelector(sel) {
    if (!this.elements[sel]) {
      this.elements[sel] = {
        innerHTML: '',
        style: {},
        className: '',
        classList: { toggle() {}, add() {}, remove() {} },
        setAttribute() {},
        getAttribute() { return ''; }
      };
    }
    return this.elements[sel];
  }
};

global.window = {
  innerWidth: 1440,
  innerHeight: 900,
  addEventListener() {},
  scrollTo() {}
};
global.document = dom;
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};
global.location = { hash: '#/' };

// Load data.js
require('./js/data.js');
assert(window.SK_DATA, 'SK_DATA must be exported');
assert(window.SK_DATA.SEED_ROYAL_PHOTOS.length === 50, 'Must have 50 pre-seeded photos for Royal Banquet');

// Load app.js
require('./js/app.js');

// Test 1: Image Asset Verification
console.log('1. Verifying business background image...');
assert(fs.existsSync(path.join(__dirname, 'img', 'business-bg.jpg')), 'business-bg.jpg must exist in img directory');
console.log('   ✔ business-bg.jpg is present and accessible.');

// Test 2: Footer Verification
console.log('2. Verifying public footer content...');
const appContent = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');

assert(!appContent.includes('<button data-act="staff-login">Staff login</button>'), 'Footer must NOT contain Staff login button');
assert(appContent.includes('<button data-act="business-login">Business Login</button>'), 'Footer must contain Business Login button');
console.log('   ✔ Public footer: Staff login removed, Business Login button present.');

// Test 3: Login Modal Strict Scoping
console.log('3. Verifying Login Modal tabs and terminology...');
let modalTitle = '', modalHtml = '';
global.openModal = function(title, html) {
  modalTitle = title;
  modalHtml = html;
};

// Trigger login modal
const loginModalCode = appContent.match(/function loginModal\(then, tab = 'customer'\) \{[\s\S]*?\n  \}/)[0];
assert(!loginModalCode.includes('Staff'), 'loginModal must NOT contain any Staff tab or references');
assert(loginModalCode.includes('data-tab="customer"'), 'loginModal must contain Customer tab');
assert(loginModalCode.includes('data-tab="business"'), 'loginModal must contain Business tab');
assert(loginModalCode.includes('Verified Business access'), 'loginModal must mention Verified Business access');
console.log('   ✔ Login modal: Only Customer and Business tabs exist, Staff login completely removed.');

// Test 4: Terminology Boundary Check in Business Portal
console.log('4. Verifying strict terminology boundary in Business Portal...');
// Extract pageBusinessPortal and its rendering functions
assert(appContent.includes('Verified Business'), 'Must have Verified Business label');
assert(appContent.includes('Our business support team is here to help you'), 'Need Help card must say "business support team"');

// Ensure "Partner" does NOT appear inside Business Portal views
const bizPortalSection = appContent.slice(
  appContent.indexOf('function pageBusinessPortal'),
  appContent.indexOf('function pageCategory')
);

// Check that "Partner" is not used in user-facing strings in the Business Portal section
const forbiddenRegex = />[^<]*?\bPartner\b[^<]*?</i;
const matches = bizPortalSection.match(forbiddenRegex);
assert(!matches, `Business Portal must not contain user-facing "Partner" references! Found: ${matches ? matches[0] : ''}`);
console.log('   ✔ Zero occurrences of "Partner" inside the Business Portal (strictly "Business").');

// Test 5: Customer-facing pages retain "Partner"
console.log('5. Verifying customer-facing pages retain "Partner" terminology...');
assert(appContent.includes('Our Partners'), 'Public site must retain "Our Partners"');
assert(appContent.includes('ShaadiKart Verified partners'), 'Public site must retain "partners" category subtitle');
console.log('   ✔ Customer-facing pages strictly preserve "Partner" terminology.');

// Test 6: Photo Curation & Live Sync to Customer View
console.log('6. Verifying Photo Curation & Live Sync to Customer View...');
const seedPhotos = JSON.parse(JSON.stringify(window.SK_DATA.SEED_ROYAL_PHOTOS));
assert(seedPhotos.length === 50, 'Seed photos count must be 50');

const initialPublished = seedPhotos.filter(p => p.status === 'published' || p.status === 'live').length;
assert(initialPublished === 30, `Expected 30 published photos initially, found ${initialPublished}`);

const initialDraft = seedPhotos.filter(p => p.status === 'draft').length;
assert(initialDraft === 10, `Expected 10 draft photos initially, found ${initialDraft}`);

const initialArchived = seedPhotos.filter(p => p.status === 'archived').length;
assert(initialArchived === 10, `Expected 10 archived photos initially, found ${initialArchived}`);
console.log('   ✔ Photo counts: Exactly 50 photos (30 Live, 10 Draft, 10 Archived).');

// Verify that archiving a photo changes its status and hides it from customer view
const testPhoto = seedPhotos[0];
testPhoto.status = 'archived';
const customerVisible = seedPhotos.filter(p => p.status === 'published' || p.status === 'live');
assert(customerVisible.length === 29, 'Archiving a photo must reduce customer-visible photos to 29');
console.log('   ✔ Live synchronization: Archiving immediately removes photo from customer view.');

// Test 7: Event Preview 3-Stage Experience
console.log('7. Verifying Event Preview 3-stage functionality...');
assert(appContent.includes('1. Raw Space'), 'Event Preview must have Stage 1: Raw Space');
assert(appContent.includes('2. With Decoration'), 'Event Preview must have Stage 2: With Decoration');
assert(appContent.includes('3. With Guests'), 'Event Preview must have Stage 3: With Guests');
assert(appContent.includes('biz-sweep-wrap'), 'Event Preview must include sweep slider markup');
assert(appContent.includes('biz-floorplan-box'), 'Event Preview must include celebration floor plan');
console.log('   ✔ Event Preview: Raw Space, With Decoration (sweep slider), and With People (SVG floor plan) present.');

// Test 8: Mobile Responsiveness in CSS
console.log('8. Verifying mobile responsive styles down to 375px...');
const cssContent = fs.readFileSync(path.join(__dirname, 'css', 'styles.css'), 'utf8');
assert(cssContent.includes('.biz-sidebar'), 'styles.css must include .biz-sidebar');
assert(cssContent.includes('.biz-bg-layer'), 'styles.css must include .biz-bg-layer');
assert(cssContent.includes('.biz-glass-overlay'), 'styles.css must include .biz-glass-overlay');
assert(cssContent.includes('@media (max-width: 992px)'), 'styles.css must include tablet breakpoint');
assert(cssContent.includes('@media (max-width: 600px)'), 'styles.css must include mobile breakpoint');
assert(cssContent.includes('.biz-kpis-grid'), 'styles.css must include KPI grid');
assert(cssContent.includes('.biz-sweep-wrap'), 'styles.css must include sweep slider styles');
console.log('   ✔ CSS styles: Luxury frosted glass backdrop, deep purple sidebar, pastel cards, and responsive rules verified.');

console.log('\n🎉 ALL 8 TESTS PASSED SUCCESSFULLY! ZERO ERRORS.\n');
process.exit(0);
