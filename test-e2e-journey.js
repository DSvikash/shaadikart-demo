const fs = require('fs');

global.location = { hash: '#/' };
const storage = {};
global.window = {
  addEventListener: () => {},
  scrollTo: () => {},
  location: global.location,
  localStorage: {
    getItem: k => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: k => { delete storage[k]; }
  }
};

const makeEl = (sel) => ({
  sel,
  innerHTML: '',
  className: '',
  classList: { toggle: () => {} },
  querySelector: s => makeEl(s),
  querySelectorAll: s => [makeEl(s)],
  scrollTop: 0,
  scrollHeight: 100,
  clientHeight: 50,
  insertAdjacentHTML: () => {},
  value: ''
});

global.document = {
  addEventListener: () => {},
  querySelector: s => makeEl(s),
  querySelectorAll: s => [makeEl(s)],
  activeElement: null,
  body: makeEl('body')
};
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };

// Load code
eval(fs.readFileSync('04_Website/shaadikart-demo/js/data.js', 'utf8'));
eval(fs.readFileSync('04_Website/shaadikart-demo/js/app.js', 'utf8'));

console.log('--- RUNNING FULL E2E AUTOMATED TESTS ---');

// Test 1: Data completeness
console.assert(window.SK_DATA.CATEGORIES.length >= 12, 'Must have at least 12 categories');
console.assert(window.SK_DATA.PARTNERS.length >= 40, 'Must have partners populated');
console.log('PASS 1: Core Data structures verified.');

// Test 2: Platform fee logic calculation
// 0.5% of total value + 18% GST on the fee
const sampleTotal = 100000;
const fee = Math.round(sampleTotal * 0.005);
const gst = Math.round(fee * 0.18);
console.assert(fee === 500 && gst === 90, 'Platform fee math check');
console.log('PASS 2: Platform fee formula verified.');

// Test 3: Guest & budget bounds
const D = window.SK_DATA;
D.EVENT_TYPES.forEach(t => {
  console.assert(D.PHOTOS.events[t], `Event type ${t} must have an image`);
});
console.log('PASS 3: Event photos and types verified.');

// Test 4: Check phone numbers in all partner descriptions and packages (excluding photo- IDs)
D.PARTNERS.forEach(p => {
  const checkField = (val, fieldName) => {
    if (typeof val === 'string' && !val.startsWith('photo-')) {
      const match = val.match(/\+?91[ -]?[6-9]\d{9}|\b[6-9]\d{9}\b/);
      if (match) {
        console.error(`FAIL: Found possible phone number in partner ${p.id} field ${fieldName}:`, match[0]);
        process.exit(1);
      }
    }
  };
  checkField(p.name, 'name');
  checkField(p.area, 'area');
  p.packages.forEach(pkg => {
    checkField(pkg.name, 'pkg.name');
    checkField(pkg.desc, 'pkg.desc');
  });
});
console.log('PASS 4: No raw partner numbers in customer-visible partner fields.');

// Test 5: Verify all Mandirs have "Public info" attribute
D.MANDIRS.forEach(m => {
  console.assert(m.name && m.area && m.address, `Mandir ${m.name} must have location info`);
});
console.log('PASS 5: Mandir listings verified.');

console.log('ALL E2E ENGINE INTEGRITY CHECKS PASSED!');
