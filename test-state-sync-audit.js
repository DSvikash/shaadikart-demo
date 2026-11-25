// test-state-sync-audit.js
// Exhaustive test suite for package state synchronization, tier selection, multi-vendor cart, and planner flow

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting State-Sync & Customer Journey Audit Tests...\n');

const DIR = __dirname;
const appJs = fs.readFileSync(path.join(DIR, 'js', 'app.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(DIR, 'js', 'data.js'), 'utf8');
const css = fs.readFileSync(path.join(DIR, 'css', 'styles.css'), 'utf8');

// 1. Static CSS checks
console.log('1. Checking CSS rules for package buttons and planner tier switcher...');
assert.ok(css.includes('.ptc-cta'), 'Must include .ptc-cta');
assert.ok(css.includes('.po-tiers'), 'Must include .po-tiers');
assert.ok(css.includes('.po-tier-chip'), 'Must include .po-tier-chip');
assert.ok(css.includes('.po-tier-chip.on'), 'Must include .po-tier-chip.on');
console.log('   ✔ CSS rules confirmed for package CTA and planner tier chips.');

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
    checked: false,
    value: '',
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
    scrollIntoView() {},
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
const FORM = global.window.SK_APP.FORM;

// 3. Test Package State-Sync & Selection Across ALL 15 Categories
console.log('2. Auditing package state-sync and selection across all 15 categories...');

const samplePartnersByCategory = {
  'venues': 'royal-banquet',
  'decor': 'phoolwari',
  'photo': 'wedding-stories',
  'catering': 'swaad-caterers',
  'entertainment': 'beat-factory',
  'beauty': 'glam-neha',
  'spiritual': 'pandit-sharma',
  'haldi': 'haldi-rang',
  'kitty': 'kitty-lounge',
  'planner': 'shaadi-sutra',
  'invites': 'kagaz-invites',
  'transport': 'vintage-wheels',
  'furniture': 'shamiana',
  'essentials': 'shringaar',
  'sports': 'turf-arena'
};

D_GLOBAL.CATEGORIES.forEach(cat => {
  const partnerId = samplePartnersByCategory[cat.id];
  assert.ok(partnerId, `Category ${cat.id} must have a designated sample partner`);
  const v = D_GLOBAL.PARTNERS.find(x => x.id === partnerId);
  assert.ok(v, `Partner ${partnerId} must exist in data for category ${cat.id}`);

  // Render partner page
  location.hash = `#/partner/${v.id}`;
  global.window.SK_APP.render();
  const html = appContent;

  // Verify .ptc-cta buttons exist for every package
  assert.ok(html.includes('class="ptc-cta'), `Partner ${v.id} page must include .ptc-cta buttons`);
  assert.ok(html.includes('data-act="select-pkg-add"'), `Partner ${v.id} page must have data-act="select-pkg-add"`);

  // Clear cart before test
  S_GLOBAL.cart.items = [];

  // Pick the highest tier (Platinum or last tier)
  const highTier = v.packages[v.packages.length - 1];
  const highTierId = highTier.id;

  // 1. Simulate clicking "Select [Tier]" CTA button directly on the tier card
  ACT['select-pkg-add']({
    dataset: { vid: v.id, pkg: highTierId }
  }, { stopPropagation: () => {} });

  // Verify inCart
  const inCartItem = S_GLOBAL.cart.items.find(x => x.partnerId === v.id);
  assert.ok(inCartItem, `Partner ${v.id} must be in cart after select-pkg-add`);
  assert.strictEqual(inCartItem.pkg, highTierId, `Cart item pkg must be ${highTierId}, not fallen back to silver`);

  // Verify cart lines calculate with chosen tier
  const lines = global.window.SK_APP.cartLines();
  const partnerLine = lines.find(l => l.v.id === v.id);
  assert.ok(partnerLine, `Cart line for partner ${v.id} must exist`);
  assert.strictEqual(partnerLine.p.id, highTierId, `Cart line package must match chosen tier ${highTierId}`);
  assert.strictEqual(partnerLine.p.name, highTier.name, `Cart line package name must match ${highTier.name}`);

  // 2. Switch tier to Gold (or second tier if available)
  if (v.packages.length > 1) {
    const goldTier = v.packages[1];
    ACT['select-pkg-add']({
      dataset: { vid: v.id, pkg: goldTier.id }
    }, { stopPropagation: () => {} });

    const updatedItem = S_GLOBAL.cart.items.find(x => x.partnerId === v.id);
    assert.strictEqual(updatedItem.pkg, goldTier.id, `Cart item pkg must update to ${goldTier.id}`);

    const updatedLines = global.window.SK_APP.cartLines();
    const updatedLine = updatedLines.find(l => l.v.id === v.id);
    assert.strictEqual(updatedLine.p.id, goldTier.id, `Cart line package must update to ${goldTier.id}`);
  }

  // Clear cart for next category test
  S_GLOBAL.cart.items = [];
});
console.log('   ✔ All 15 categories correctly select and synchronize Platinum/Gold tiers into Cart without falling back to Silver.');

// 4. Test Multi-Vendor Cart with Mixed Tiers
console.log('3. Testing Multi-Vendor Cart with Mixed Package Tiers...');

S_GLOBAL.cart.items = [
  { partnerId: 'royal-banquet', pkg: 'gold', diet: 'veg' },
  { partnerId: 'haldi-rang', pkg: 'platinum', diet: 'veg' },
  { partnerId: 'wedding-stories', pkg: 'platinum', diet: 'veg' },
  { partnerId: 'swaad-caterers', pkg: 'gold', diet: 'nonveg' },
  { partnerId: 'phoolwari', pkg: 'silver', diet: 'veg' }
];

const lines = global.window.SK_APP.cartLines();
assert.strictEqual(lines.length, 5, 'Cart must have 5 items');

const expectedTiers = {
  'royal-banquet': 'gold',
  'haldi-rang': 'platinum',
  'wedding-stories': 'platinum',
  'swaad-caterers': 'gold',
  'phoolwari': 'silver'
};

lines.forEach(l => {
  const expTier = expectedTiers[l.v.id];
  assert.strictEqual(l.p.id, expTier, `Item ${l.v.id} must preserve tier ${expTier}`);
});

const totals = global.window.SK_APP.cartTotals();
assert.ok(totals.sub > 0, 'sub must be greater than 0');
assert.strictEqual(totals.gst, Math.round(totals.sub * 0.18), 'GST must be 18% of sub total');
const svc = totals.sub + totals.gst;
assert.strictEqual(totals.fee, Math.round(svc * 0.005), 'Platform fee must be 0.5% of total value');
assert.strictEqual(totals.feeGst, Math.round(totals.fee * 0.18), 'Fee GST must be 18% of platform fee');
assert.strictEqual(totals.total, svc + totals.fee + totals.feeGst, 'Grand total must equal sum of services, GST, and platform fee');

location.hash = '#/cart';
global.window.SK_APP.render();
const cartHtml = appContent;

assert.ok(cartHtml.includes('Platinum package'), 'Cart page must display Platinum package');
assert.ok(cartHtml.includes('Premium package'), 'Cart page must display Premium package');
assert.ok(cartHtml.includes('Silver package'), 'Cart page must display Silver package');
console.log('   ✔ Multi-Vendor Cart correctly calculates and displays mixed package tiers and platform fees.');

// 5. Test 4-Step Planner Flow with Inline Tier Switching (Step 3 & 4)
console.log('4. Testing 4-Step Planner inline tier switching (Step 3) and review (Step 4)...');

// Open Planner Step 1
global.window.SK_APP.openPlan(1);
const pl1 = global.window.SK_APP.getPL();
assert.strictEqual(pl1.step, 1, 'Planner must be on Step 1');

// Step 2: Choose categories
pl1.cats = ['haldi', 'photo', 'decor'];
global.window.SK_APP.openPlan(2);
const pl2 = global.window.SK_APP.getPL();
assert.strictEqual(pl2.step, 2, 'Planner must be on Step 2');

// Step 3: Choose partners & tiers
pl2.picks = {
  'haldi': 'haldi-rang',
  'photo': 'wedding-stories',
  'decor': 'phoolwari'
};
global.window.SK_APP.openPlan(3);
const pl3 = global.window.SK_APP.getPL();
assert.strictEqual(pl3.step, 3, 'Planner must be on Step 3');
assert.ok(modalContent.includes('class="po-tiers"'), 'Step 3 must render .po-tiers container');
assert.ok(modalContent.includes('data-act="plan-tier"'), 'Step 3 must render data-act="plan-tier" chips');

// Test inline switching to Platinum for Haldi partner
ACT['plan-tier']({
  dataset: { cat: 'haldi', vid: 'haldi-rang', t: 'platinum' }
}, { stopPropagation: () => {} });

const updatedPL = global.window.SK_APP.getPL();
assert.ok(updatedPL.pkgs && updatedPL.pkgs['haldi'] === 'platinum', 'PL.pkgs["haldi"] must update to platinum');

// Test inline switching to Gold for Photo partner
ACT['plan-tier']({
  dataset: { cat: 'photo', vid: 'wedding-stories', t: 'gold' }
}, { stopPropagation: () => {} });

assert.ok(updatedPL.pkgs && updatedPL.pkgs['photo'] === 'gold', 'PL.pkgs["photo"] must update to gold');

// Step 4: Review and Book
global.window.SK_APP.openPlan(4);
assert.ok(modalContent.includes('Platinum'), 'Step 4 review table must list Platinum package for Haldi partner');
assert.ok(modalContent.includes('Gold'), 'Step 4 review table must list Gold package for Photo partner');

// Test planToCart(): adds selected items with chosen tiers into S.cart
const addedCount = global.window.SK_APP.planToCart();
assert.strictEqual(addedCount, 3, 'planToCart must add 3 items');

const haldiCart = S_GLOBAL.cart.items.find(x => x.partnerId === 'haldi-rang');
const photoCart = S_GLOBAL.cart.items.find(x => x.partnerId === 'wedding-stories');
const decorCart = S_GLOBAL.cart.items.find(x => x.partnerId === 'phoolwari');

assert.strictEqual(haldiCart.pkg, 'platinum', 'Haldi partner in cart must be platinum');
assert.strictEqual(photoCart.pkg, 'gold', 'Photo partner in cart must be gold');
assert.strictEqual(decorCart.pkg, 'silver', 'Decor partner in cart must be silver');
console.log('   ✔ 4-Step Planner allows inline tier switching and transfers exact Platinum/Gold packages to Cart.');

console.log('\n🎉 ALL STATE-SYNC & CUSTOMER JOURNEY AUDIT TESTS PASSED CLEANLY (0 ERRORS)!');
process.exit(0);
