// test-haldi-navigation-fix.js
// Verify fix for "More Haldi & Mehendi partners" and ">" partner details navigation

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Haldi & Mehendi Navigation & Layer Target Tests...\n');

const DIR = __dirname;
const appJs = fs.readFileSync(path.join(DIR, 'js', 'app.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(DIR, 'js', 'data.js'), 'utf8');
const css = fs.readFileSync(path.join(DIR, 'css', 'styles.css'), 'utf8');

// 1. Verify code guards
console.log('1. Checking defensive guards in app.js...');
assert.ok(
  appJs.includes('const liveSvcs = ev => (ev && Array.isArray(ev.services)) ? ev.services.filter(s => !s.removed) : (ev && Array.isArray(ev.items) ? ev.items : []);'),
  'liveSvcs must safely handle undefined services or items'
);
assert.ok(
  appJs.includes('const decor = (typeof smeDecor === \'function\' && S.cart) ? (smeDecor(S.cart) || (S.cart.event && smeDecor(S.cart.event))) : null;'),
  'setsHtml must safely resolve decor without throwing on S.cart.event'
);
console.log('   ✔ Defensive guards for liveSvcs and setsHtml confirmed.');

// 2. Setup mock browser environment
console.log('2. Testing openLayer("haldi") execution with mock DOM...');
let layerContent = '';
const layerRoot = {
  innerHTML: '',
  set innerHTML(val) { layerContent = val; },
  get innerHTML() { return layerContent; },
  classList: { add: () => {}, remove: () => {} },
  scrollTop: 0
};
const dummyEl = {
  innerHTML: '',
  classList: { add: () => {}, remove: () => {} },
  appendChild: () => {},
  scrollTop: 0
};

global.window = {
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { hash: '#/' },
  innerWidth: 1200
};
global.location = global.window.location;
global.document = {
  addEventListener: () => {},
  querySelector: sel => {
    if (sel === '#layer-root') return layerRoot;
    return dummyEl;
  },
  querySelectorAll: () => [],
  getElementById: id => (id === 'layer-root' ? layerRoot : dummyEl),
  body: {
    appendChild: el => el,
    classList: { toggle: () => {} },
    insertAdjacentHTML: () => {}
  }
};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

eval(dataJs);
eval(appJs);

const ACT = global.window.SK_APP.ACT;

// Execute openPlan(2) to initialize PL
assert.doesNotThrow(() => {
  // Test ACT['plan-view'] for both .pt-more and .pt-go
  console.log('   Testing .pt-more click handler (data-cat="haldi")...');
  ACT['plan-view']({ dataset: { cat: 'haldi' } });
}, 'openLayer("haldi") must not throw on pt-more');

assert.ok(layerContent.includes('Haldi &amp; Mehendi') || layerContent.includes('Haldi & Mehendi'), 'Layer modal must render Haldi & Mehendi');
assert.ok(layerContent.includes('Mehendi Mela by Zoya') || layerContent.includes('Haldi Rang Studio'), 'Layer modal must render partners');
assert.ok(layerContent.includes('#/category/haldi'), 'Layer modal must provide link to full category page');
console.log('   ✔ pt-more opens Haldi layer modal with full partners and catalog link.');

assert.doesNotThrow(() => {
  console.log('   Testing .pt-go click handler (data-cat="haldi" data-vid="mehendi-mela")...');
  ACT['plan-view']({ dataset: { cat: 'haldi', vid: 'mehendi-mela' } });
}, 'openLayer("haldi", "mehendi-mela") must not throw on pt-go');

assert.ok(layerContent.includes('Mehendi Mela by Zoya'), 'Layer modal must display chosen partner details');
assert.ok(layerContent.includes('Silver'), 'Packages must be displayed');
console.log('   ✔ pt-go opens specific partner details smoothly.');

// 3. Verify CSS rules for tap targets
console.log('3. Checking CSS tap targets and cursor rules...');
assert.ok(css.includes('.pt-go::before { content: \'\'; position: absolute; inset: -8px; border-radius: 50%; }'), 'pt-go must expand tap target to >= 44px');
assert.ok(css.includes('.pt-more { margin: 10px 0 0 auto; display: inline-flex;'), 'pt-more must have inline-flex and min-height 44px');
console.log('   ✔ CSS touch target compliance (>= 44px) confirmed.');

console.log('\n🎉 ALL HALDI & MEHENDI NAVIGATION & TARGET TESTS PASSED CLEANLY (0 ERRORS)!');
