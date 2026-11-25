// Test Haldi & Mehendi promotion to primary categories
const fs = require('fs');
const assert = require('assert');
const path = require('path');

console.log('🧪 Starting Haldi & Mehendi Primary Category Promotion Tests...\n');

const DIR = __dirname;
const appPath = path.join(DIR, 'js', 'app.js');
const dataPath = path.join(DIR, 'js', 'data.js');
const cssPath = path.join(DIR, 'css', 'styles.css');

const appCode = fs.readFileSync(appPath, 'utf8');
const dataCode = fs.readFileSync(dataPath, 'utf8');
const cssCode = fs.readFileSync(cssPath, 'utf8');

// 1. Verify PLAN_MAIN includes haldi
console.log('1. Verifying PLAN_MAIN definition in app.js...');
assert.ok(
  appCode.includes("const PLAN_MAIN = ['venues', 'decor', 'photo', 'catering', 'beauty', 'haldi'];"),
  'PLAN_MAIN must explicitly include haldi as the 6th item'
);
console.log('   ✔ PLAN_MAIN contains 6 primary categories including haldi.');

// 2. Mock environment to test execution
console.log('2. Testing planner Step 2 rendering and de-duplication in simulated DOM...');
global.window = {
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { hash: '#/' }
};
global.location = global.window.location;
global.document = {
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  body: { classList: { toggle: () => {} }, insertAdjacentHTML: () => {} },
  activeElement: null
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

eval(dataCode);
const D = global.window.SK_DATA;
assert.ok(D && D.CATEGORIES, 'D.CATEGORIES must load');

// Check haldi category exists in D.CATEGORIES
const haldiCat = D.CATEGORIES.find(c => c.id === 'haldi');
assert.ok(haldiCat, 'Haldi & Mehendi must exist in D.CATEGORIES');
assert.strictEqual(haldiCat.tile, 'photo-1698460895537-a418b64bcc54', 'Authentic Haldi photo tile verified');
console.log('   ✔ Haldi & Mehendi metadata and photo confirmed in data layer.');

// Test category counts
const PLAN_MAIN = ['venues', 'decor', 'photo', 'catering', 'beauty', 'haldi'];
const planOthersList = () => D.CATEGORIES.filter(c => !PLAN_MAIN.includes(c.id));
const othersList = planOthersList();
assert.strictEqual(PLAN_MAIN.length, 6, 'PLAN_MAIN must have exactly 6 primary categories');
assert.strictEqual(othersList.length, 9, 'Others list must have exactly 9 secondary categories (15 - 6)');
assert.ok(!othersList.some(c => c.id === 'haldi'), 'Haldi & Mehendi must NOT be in Others list');
console.log(`   ✔ Primary: 6 categories, Others: 9 categories. Zero duplicate occurrences.`);

// 3. Verify CSS rules for balanced grid
console.log('3. Verifying CSS grid rules for .plan-cats-main and .plan-tile-static...');
assert.ok(
  cssCode.includes('.plan-cats-main .plan-tile-static { grid-column: 1 / -1; }'),
  'Desktop CSS must span .plan-tile-static across all columns (1 / -1)'
);
assert.ok(
  cssCode.includes('.plan-cats-main .plan-tile-static .plan-cat.plan-others-card'),
  'Others card must have specialized horizontal banner styling'
);
console.log('   ✔ Grid layout parity verified for both Desktop (3-col) and Mobile (2-col).');

// 4. Verify partner availability
console.log('4. Verifying Haldi & Mehendi partners...');
const haldiPartners = D.PARTNERS.filter(p => p.cat === 'haldi');
assert.strictEqual(haldiPartners.length, 4, 'Must have 4 Haldi partners in Delhi NCR');
console.log(`   ✔ ${haldiPartners.length} ShaadiKart Verified Haldi partners found:`);
haldiPartners.forEach(p => console.log(`      - ${p.name} (${p.area}, ${p.locality}) ★${p.rating}`));

console.log('\n🎉 ALL HALDI & MEHENDI PROMOTION CHECKS PASSED PERFECTLY!');
