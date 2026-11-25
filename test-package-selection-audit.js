// test-package-selection-audit.js
// Exhaustive test suite for interactive package selection, cart synchronization, lightbox, and room selection

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Package Selection & Interactive Audit Tests...\n');

const DIR = __dirname;
const appJs = fs.readFileSync(path.join(DIR, 'js', 'app.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(DIR, 'js', 'data.js'), 'utf8');
const css = fs.readFileSync(path.join(DIR, 'css', 'styles.css'), 'utf8');

// 1. Static code & CSS checks
console.log('1. Checking CSS rules for package selection, lightbox, and room cards...');
assert.ok(css.includes('.pkg-tier-grid'), 'Must include .pkg-tier-grid');
assert.ok(css.includes('.pkg-tier-card.on'), 'Must include .pkg-tier-card.on');
assert.ok(css.includes('.lightbox-wrap'), 'Must include .lightbox-wrap');
assert.ok(css.includes('.rm-types div.on'), 'Must include .rm-types div.on');
console.log('   ✔ CSS rules confirmed for all interactive components.');

// 2. Setup mock browser environment
let modalContent = '', layerContent = '', appContent = '';

function createMockEl(tag = 'div') {
  const el = {
    tagName: tag.toUpperCase(),
    className: '',
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) { this._innerHTML = val; },
    textContent: '',
    dataset: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) this._classes.add(c);
        else this._classes.delete(c);
      },
      contains(c) { return this._classes.has(c); }
    },
    style: {},
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k]; },
    appendChild(child) { return child; },
    prepend(child) { return child; },
    remove() {},
    focus() {},
    querySelector(sel) { return createMockEl('div'); },
    querySelectorAll(sel) { return [createMockEl('div')]; },
    closest(sel) { return this; }
  };
  return el;
}

const modalRoot = createMockEl('div');
Object.defineProperty(modalRoot, 'innerHTML', {
  get() { return modalContent; },
  set(v) { modalContent = v; }
});

const layerRoot = createMockEl('div');
Object.defineProperty(layerRoot, 'innerHTML', {
  get() { return layerContent; },
  set(v) { layerContent = v; }
});

const appRoot = createMockEl('main');
Object.defineProperty(appRoot, 'innerHTML', {
  get() { return appContent; },
  set(v) { appContent = v; }
});

const toastRoot = createMockEl('div');

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
    if (sel === '#modal-root') return modalRoot;
    if (sel === '#layer-root') return layerRoot;
    if (sel === '#toast-root') return toastRoot;
    if (sel === '#app') return appRoot;
    return createMockEl('div');
  },
  querySelectorAll: sel => [createMockEl('div')],
  getElementById: id => {
    if (id === 'modal-root') return modalRoot;
    if (id === 'layer-root') return layerRoot;
    if (id === 'toast-root') return toastRoot;
    if (id === 'app') return appRoot;
    return createMockEl('div');
  },
  createElement: tag => createMockEl(tag),
  body: {
    appendChild: el => el,
    classList: { toggle: () => {} },
    insertAdjacentHTML: () => {}
  }
};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

eval(dataJs);
eval(appJs);

const D_GLOBAL = global.window.SK_DATA;
const S_GLOBAL = global.window.SK_APP.S;
const ACT = global.window.SK_APP.ACT;
const openLayer = global.window.SK_APP.openLayer;

console.log('2. Auditing all 15 categories for partner package structures...');
assert.strictEqual(D_GLOBAL.CATEGORIES.length, 15, 'Must have 15 categories');
D_GLOBAL.CATEGORIES.forEach(c => {
  const partners = D_GLOBAL.PARTNERS.filter(p => p.cat === c.id);
  assert.ok(partners.length > 0, `Category ${c.id} must have partners`);
  partners.forEach(p => {
    assert.ok(Array.isArray(p.packages) && p.packages.length > 0, `Partner ${p.id} must have packages array`);
    p.packages.forEach(pkg => {
      assert.ok(pkg.id && pkg.name && pkg.price != null, `Partner ${p.id} package ${pkg.id} must have id, name, price`);
      assert.ok(Array.isArray(pkg.includes), `Partner ${p.id} package ${pkg.id} must have includes array`);
    });
  });
});
console.log('   ✔ All 15 categories and their partners have valid package definitions.');

// 3. Test pagePartner markup generation
console.log('3. Testing pagePartner markup across diverse categories...');
const testPartners = [
  'royal-banquet',   // venues (menu, perPlate)
  'phoolwari',       // decor (fixed packages)
  'wedding-stories', // photo (fixed packages)
  'annapurna',       // catering (menu, perPlate)
  'glam-neha',       // beauty (fixed packages)
  'haldi-rang',      // haldi (fixed packages)
  'kitty-lounge',    // kitty
  'pandit-sharma'    // spiritual
];

testPartners.forEach(vid => {
  const v = D_GLOBAL.PARTNERS.find(x => x.id === vid);
  assert.ok(v, `Partner ${vid} must exist in data`);
  location.hash = `#/partner/${vid}`;
  global.window.SK_APP.render();
  const html = appContent;

  assert.ok(html.includes('class="pkg-tier-grid"'), `Partner ${vid} must include .pkg-tier-grid`);
  assert.ok(html.includes('data-act="select-pkg"'), `Partner ${vid} must have data-act="select-pkg" on package cards`);
  assert.ok(html.includes('data-act="v-lightbox"'), `Partner ${vid} gallery must have data-act="v-lightbox"`);
  assert.ok(html.includes('id="add-to-cart-btn"'), `Partner ${vid} must have id="add-to-cart-btn"`);
  assert.ok(html.includes('id="pp-total"'), `Partner ${vid} must have id="pp-total"`);

  // Verify all packages are rendered in the tier grid
  v.packages.forEach(pkg => {
    assert.ok(html.includes(pkg.name), `Partner ${vid} must render package name ${pkg.name}`);
  });

  if (v.cat === 'venues') {
    assert.ok(html.includes('data-act="toggle-room"'), `Venue ${vid} must have data-act="toggle-room"`);
  }
  if (v.menu && v.menuNV) {
    assert.ok(html.includes('data-act="pg-diet"'), `Menu partner ${vid} must have data-act="pg-diet"`);
  }
});
console.log('   ✔ Verified pagePartner renders interactive tier grid, gallery lightbox triggers, and dynamic CTA buttons.');

// 4. Test Planner Layer (Step 2/3 popup) non-menu package interaction
console.log('4. Testing Planner Step 2/3 partner popup (openLayer) tier selection...');
// Test non-menu partner popup (e.g. decor / photo / haldi)
openLayer('decor', 'phoolwari');
assert.ok(layerContent.includes('class="lv-pk tiers"'), 'openLayer for non-menu partner must render .lv-pk.tiers');
assert.ok(layerContent.includes('data-act="lv-tier"'), 'openLayer must render data-act="lv-tier" buttons');
assert.ok(layerContent.includes('data-t="gold"'), 'openLayer must render gold tier button');

// Test lv-tier action
ACT['lv-tier']({ dataset: { t: 'gold' } });
const currentLV = global.window.SK_APP.getLV();
assert.strictEqual(currentLV.tier, 'gold', 'LV.tier must update to gold');

// Test lv-choose action
ACT['lv-choose']();
const currentPL = global.window.SK_APP.getPL();
assert.ok(currentPL.pkgs && currentPL.pkgs['decor'] === 'gold', 'PL.pkgs["decor"] must be stored as gold');
console.log('   ✔ Planner Step 2/3 popup enables interactive tier switching and stores selected package.');

// 5. Test Lightbox ACT handler
console.log('5. Testing Photo Gallery Lightbox handler...');
ACT['v-lightbox']({ dataset: { vid: 'royal-banquet', i: '1' } });
assert.ok(modalContent.includes('class="lightbox-wrap"'), 'Modal must render lightbox-wrap');
assert.ok(modalContent.includes('Photo 2 of'), 'Modal must show current photo index 2');
assert.ok(modalContent.includes('data-act="lb-nav"'), 'Modal must have navigation buttons');

ACT['lb-nav']({ dataset: { dir: '1' } });
assert.ok(modalContent.includes('Photo 3 of'), 'Next button must advance to photo 3');
console.log('   ✔ Photo Gallery Lightbox displays photos with prev/next navigation.');

// 6. Test Room Toggle ACT handler
console.log('6. Testing Room Toggle handler...');
const mockRoomEl = createMockEl('div');
mockRoomEl.dataset.room = 'Deluxe Suite';
ACT['toggle-room'](mockRoomEl);
assert.ok(mockRoomEl.classList.contains('on'), 'toggle-room must toggle .on class');
console.log('   ✔ Room toggle works smoothly.');

console.log('\n🎉 ALL PACKAGE SELECTION & INTERACTIVE AUDIT TESTS PASSED CLEANLY (0 ERRORS)!');
process.exit(0);
