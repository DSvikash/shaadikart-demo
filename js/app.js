/* ShaadiKart concept demo — customer app. Vanilla JS, hash routing, state in localStorage. */
(function () {
  'use strict';
  const D = window.SK_DATA;
  const GST = 0.18, ADV = 0.25, DAY = 864e5, KEY = 'shaadikart-demo-v3';
  // Demo clock: the dock can shift CLOCK.offset to time-travel; display, SLA and demo-interaction times use now().
  const CLOCK = window.CLOCK = { offset: 0, speed: 1 };
  const now = () => Date.now() + CLOCK.offset;
  // ShaadiKart platform fee: 0.5% of the cart's total value (services incl. GST) + 18% GST on the fee.
  // Charged once, with the first payment of the booking. Non-refundable.
  const FEE_PCT = 0.005;
  const feeParts = amt => { const fee = Math.round(amt * FEE_PCT), gst = Math.round(fee * 0.18); return { fee, gst, total: fee + gst }; };

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const bg = (id, w = 800) => `style="background-image:url('${D.img(id, w)}')"`;
  const partner = id => D.PARTNERS.find(v => v.id === id);
  const catOf = id => D.CATEGORIES.find(c => c.id === id);
  const pkgOf = (v, pid) => v.packages.find(p => p.id === pid) || v.packages[0];
  const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDT = t => new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const code = p => p + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  const isoPlus = days => new Date(now() + days * DAY).toISOString().slice(0, 10);

  const ICONS = {
    landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    flower: '<circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/><path d="M12 7.5V9"/><path d="M7.5 12H9"/><path d="M16.5 12H15"/><path d="M12 16.5V15"/><path d="m8 8 1.88 1.88"/><path d="M14.12 9.88 16 8"/><path d="m8 16 1.88-1.88"/><path d="M14.12 14.12 16 16"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    calendarCheck: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 11 5 12 8c1-3 2.5-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    armchair: '<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    menu: '<line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="17" y2="17"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
    crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    undo: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    rotate3d: '<path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2"/><path d="m15.194 13.707 3.814 1.86-1.86 3.814"/><path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20v3a2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-2-2Z"/>',
    list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
    ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    medical: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    temple: '<path d="M12 2v3"/><path d="M8 8h8l-4-3z"/><path d="M5 11h14l-3-3H8z"/><path d="M6 11v10"/><path d="M18 11v10"/><path d="M10 21v-5a2 2 0 0 1 4 0v5"/><path d="M3 21h18"/>',
    users2: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'
  };
  const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  // Logo comes only from D.BRAND (js/data.js) + img/brand/. Swap files there to rebrand everywhere.
  const B = D.BRAND;
  const logoMark = () => `<img class="logo-mark" src="${B.mark}" alt="" width="38" height="38">`;
  const logo = (light = false) => {
    const full = light ? (B.fullLogoOnDark || B.fullLogo) : B.fullLogo;
    return full ? `<span class="logo${light ? ' light' : ''}"><img class="logo-full" src="${full}" alt="${esc(B.name)}"></span>`
      : `<span class="logo${light ? ' light' : ''}">${logoMark()}<span>${esc(B.parts[0])}<span class="k">${esc(B.parts[1])}</span></span></span>`;
  };

  /* ---------- state ---------- */
  function seed() {
    const t0 = now();
    const ev = {
      id: 'SK-EV-24871', name: 'Priya & Arjun Wedding', type: 'Wedding', date: '2027-02-14', guests: 300, locality: 'Delhi',
      createdAt: t0 - 20 * DAY, services: [], payments: [], refunds: [], cancellations: [], reschedules: [], tickets: []
    };
    const picks = [['royal-banquet', 'silver'], ['phoolwari', 'silver'], ['candid-frames', 'silver'], ['mithaas', 'silver'], ['glam-neha', 'silver'], ['sound-wave', 'silver']];
    picks.forEach(([vid, pid], i) => {
      const v = partner(vid);
      const p = pkgOf(v, pid);
      ev.services.push({ id: 'SV-' + (101 + i), partnerId: vid, pkg: pid, price: v.perPlate ? p.veg * ev.guests : p.price, rate: v.perPlate ? p.veg : 0, guests: ev.guests, diet: 'veg', requestedAt: t0 - 20 * DAY, respondAt: t0 - 20 * DAY + (2 + i) * 3600e3, response: 'confirmed', confirmId: 'CNF-' + (5521 + i * 7), paid: 0, query: '', reply: '', qConfirmed: true });
    });
    const pay = { id: 'PAY-70412', t: t0 - 19 * DAY, method: 'UPI', kind: 'Advance (25%)', items: [] };
    ev.services.forEach(s => { const a = Math.round(svcTotal(s) * ADV); s.paid = a; pay.items.push({ svcId: s.id, amount: a }); });
    pay.fee = feeParts(ev.services.reduce((a, x) => a + svcTotal(x), 0)).total; ev.feePaid = true;
    pay.amount = pay.items.reduce((a, b) => a + b.amount, 0) + pay.fee;
    ev.payments.push(pay);
    // Earlier cancellation of the DJ only — venue, catering etc. remain booked.
    const dj = ev.services[5];
    dj.cancelledAt = t0 - 9 * DAY;
    const rf = { id: 'RF-31877', t: t0 - 9 * DAY, svcIds: [dj.id], amount: Math.round(dj.paid * 0.9), method: 'UPI' };
    ev.refunds.push(rf);
    ev.cancellations.push({ id: 'CN-20931', t: t0 - 9 * DAY, scope: 'service', svcIds: [dj.id], reason: 'Changed plans — booking a live band instead', paid: dj.paid, pct: 90, refundAmount: rf.amount, refundId: rf.id });
    ev.tickets.push({ id: 'TK-1042', t: t0 - 15 * DAY, type: 'Question', svcId: ev.services[1].id, subject: 'Can the mandap colours be changed to peach?', desc: 'We would like peach and ivory instead of red.', resolved: true, reply: 'Phoolwari confirmed the colour change at no extra cost.' });
    return {
      v: 1, user: null, locality: 'Delhi',
      cart: { event: { type: 'Wedding', name: '', date: isoPlus(120), guests: 300, locality: 'Delhi', budget: 500000 }, items: [], saved: [] },
      compare: [], events: [ev]
    };
  }
  function svcTotal(s) { return Math.round(s.price * (1 + GST)); }
  let S;
  try { const raw = JSON.parse(localStorage.getItem(KEY)); S = raw && raw.v === 1 ? raw : seed(); } catch (e) { S = seed(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable: demo still works in memory */ } };

  /* ---------- derived status ---------- */
  function svcStatus(s) {
    if (s.removed) return 'removed';
    if (s.cancelledAt) return 'cancelled';
    if (now() < s.respondAt) return 'awaiting';
    if (s.response === 'unavailable') return 'unavailable';
    if (s.paid >= svcTotal(s) - 1) return 'paid';
    if (s.paid > 0) return 'booked';
    return 'confirmed';
  }
  const STATUS_TAG = {
    awaiting: ['tag-amber', 'clock', 'Awaiting partner'],
    confirmed: ['tag-plum', 'check', 'Confirmed · payment due'],
    booked: ['tag-green', 'check', 'Booked · advance paid'],
    paid: ['tag-green', 'check', 'Booked · fully paid'],
    unavailable: ['tag-red', 'ban', 'Not available'],
    cancelled: ['tag-grey', 'x', 'Cancelled'],
    removed: ['tag-grey', 'x', 'Removed']
  };
  const statusTag = st => { const [c, i, l] = STATUS_TAG[st]; return `<span class="tag ${c}">${ic(i)}${l}</span>`; };
  const liveSvcs = ev => ev.services.filter(s => !s.removed);
  const activeSvcs = ev => ev.services.filter(s => ['confirmed', 'booked', 'paid', 'awaiting'].includes(svcStatus(s)));
  function eventStatus(ev) {
    const st = liveSvcs(ev).map(svcStatus);
    if (!st.length || st.every(x => x === 'cancelled' || x === 'unavailable')) return ['tag-grey', 'Cancelled'];
    if (st.includes('awaiting')) return ['tag-amber', 'Awaiting partners'];
    if (st.includes('confirmed')) return ['tag-plum', 'Awaiting payment'];
    if (new Date(ev.date) < new Date()) return ['tag-green', 'Completed'];
    return ['tag-green', 'Confirmed'];
  }
  const svcDate = (ev, s) => s.date || ev.date;
  const REFUND_STEPS = ['Refund initiated', 'Approved by partner', 'Processing to source', 'Credited'];
  const REFUND_AT = [0, 8e3, 20e3, 40e3];
  const refundStage = rf => { const el = now() - rf.t; let k = 0; REFUND_AT.forEach((a, i) => { if (el >= a) k = i; }); return k; };
  const ticketStatus = tk => tk.resolved ? ['tag-green', 'Resolved'] : (now() - tk.t > 20e3 ? ['tag-plum', 'In review'] : ['tag-amber', 'Open']);
  function policyFor(s, ev) {
    const v = partner(s.partnerId);
    const tiers = D.POLICY[v.cat] || D.POLICY.default;
    const days = Math.max(0, Math.floor((new Date(svcDate(ev, s)) - now()) / DAY));
    const tier = tiers.find(t => days >= t.minDays);
    return { days, pct: tier.pct, tiers };
  }
  const policyText = cat => (D.POLICY[cat] || D.POLICY.default).map(t => t.minDays ? `${t.pct}% refund if cancelled ${t.minDays}+ days before` : `${t.pct}% refund within the last window`).join(' · ');

  // Applies reschedules once every partner has accepted (time-simulated).
  function tick() {
    let changed = false;
    S.events.forEach(ev => ev.reschedules.forEach(r => {
      if (!r.applied && Object.values(r.responses).every(t => now() >= t)) {
        r.applied = true; changed = true;
        if (r.scope === 'event') ev.date = r.to;
        else r.svcIds.forEach(id => { const s = ev.services.find(x => x.id === id); if (s) s.date = r.to; });
      }
    }));
    if (changed) save();
  }
  // Snapshot of every time-simulated status; the page re-renders whenever it changes.
  const liveSignature = () => S.events.map(ev => [
    ev.services.map(svcStatus).join(), ev.refunds.map(refundStage).join(),
    ev.reschedules.map(r => Object.values(r.responses).filter(t => now() >= t).length).join(),
    ev.tickets.map(t => ticketStatus(t)[1]).join(), gateSig(ev)
  ].join('|')).join('#');

  /* ---------- Pre-payment gate: meeting, ShaadiKart call, verification call, executive unlock ---------- */
  // Order: partners confirm -> customer reviews replies -> mandatory meeting with ShaadiKart staff -> ShaadiKart calls
  // (max 2 attempts, back to back, within 2 hours of the customer's enquiry; if answered no verification call is needed,
  // otherwise the customer calls 5432112345) -> after the meeting is held a ShaadiKart executive unlocks payment ->
  // a ShaadiKart executive unlocks payment. Only the first payment is gated.
  const CALL_NO = '5432112345', SLA_MS = 2 * 3600e3;
  const SLOTS = ['10:00 am', '11:00 am', '12:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm'];
  const MODES = ['Video call', 'Phone call', 'Visit our Delhi NCR office'];
  const EXECS = ['Neha Kapoor', 'Rohit Mehra', 'Anjali Verma'];
  const gateOf = ev => ev.gate || (ev.gate = { meeting: null, held: null, deadline: null, calls: [], inbound: null, unlocked: null, notes: '', waRequested: null, waSent: null });
  const gateOn = ev => !ev.payments.length;
  const callsDone = g => g.calls.length >= 2 ? g.calls.every(c => c.result) : g.calls.some(c => c.result === 'Answered');
  const answered = g => g.calls.some(c => c.result === 'Answered');
  const verified = g => answered(g) || !!g.inbound;
  const dueBy = ev => ev.createdAt + SLA_MS; // the 2-hour call clock starts when the customer sends the enquiry
  function gateStage(ev) {
    const g = gateOf(ev);
    if (g.unlocked) return 'open';
    if (!g.meeting) return 'meeting';
    if (!g.held) return 'meeting-wait';
    if (!verified(g)) return 'call';
    return 'unlock';
  }
  const GATE_TAG = { meeting: ['tag-amber', 'Meeting to schedule'], 'meeting-wait': ['tag-plum', 'Meeting scheduled'], call: ['tag-plum', 'Calls and verification'], unlock: ['tag-gold', 'Ready to unlock'], open: ['tag-green', 'Payment unlocked'] };
  const gateTag = ev => { const [c, l] = GATE_TAG[gateStage(ev)]; return `<span class="tag ${c}">${l}</span>`; };
  const hhmm = t => new Date(t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const custName = ev => (ev.customer && ev.customer.name) || 'Customer';
  const gateSig = ev => { const g = ev.gate; return g ? [gateStage(ev), g.calls.map(c => c.result || 'r').join(), g.waSent ? 1 : 0, g.waRequested ? 1 : 0, g.meeting ? g.meeting.date + g.meeting.time : ''].join('/') : '-'; };

  function gateBox(ev) {
    const g = gateOf(ev), st = gateStage(ev), m = g.meeting, hn = journeyOf(ev).host.name.split(' ')[0];
    const callOk = callsDone(g), ans = answered(g);
    const flags = [true, !!g.held, callOk, verified(g), !!g.unlocked];
    const cur = flags.indexOf(false);
    const labels = [
      ['Partners confirmed', 'Dates confirmed and replies reviewed'],
      [`Meet your host, ${hn}`, m ? `${fmtDate(m.date)} · ${m.time} · ${m.mode}` : 'Required before payment'],
      [`${hn} calls you`, ans ? 'We spoke at ' + hhmm(g.calls.find(c => c.result === 'Answered').t) : callOk ? 'We could not reach you' : 'By ' + hhmm(dueBy(ev)) + ', within 2 hours of your enquiry'],
      ['Verification', ans ? 'Done on our call' : g.inbound ? 'Verified ' + hhmm(g.inbound.t) : `Only if we miss you: call ${CALL_NO}`],
      ['Payment opens', 'After you approve your Blueprint']
    ];
    const steps = `<ol class="gate-steps">${labels.map(([a, b], i) => `<li class="${flags[i] ? 'done' : i === cur ? 'cur' : ''}"><span class="gs-n">${flags[i] ? ic('check') : i + 1}</span><span><b>${a}</b><small>${esc(b)}</small></span></li>`).join('')}</ol>`;
    const log = g.calls.length ? `<div class="gate-log">${g.calls.map(c => `<div><span>${ic('phone')}ShaadiKart call ${c.n} of 2 · ${hhmm(c.t)}</span><b class="${c.result === 'Answered' ? 'ok' : 'miss'}">${c.result ? (c.result === 'Answered' ? 'Answered' : 'Missed') : 'Ringing…'}</b></div>`).join('')}</div>` : `<p class="gate-p">Our executive will call you by <b>${hhmm(dueBy(ev))}</b>, within 2 hours of your enquiry. We try twice, back to back, so please keep your phone nearby.</p>`;
    let main = '';
    if (st === 'meeting') main = `<p class="gate-p">To keep every booking safe and personal, each customer meets a ShaadiKart executive before paying. It takes about 20 minutes.</p><button type="button" class="btn btn-gold btn-block" data-act="meet-open" data-ev="${ev.id}">${ic('calendar')}Schedule your meeting</button>`;
    else if (st === 'meeting-wait') main = `<div class="gate-card">${ic('calendarCheck')}<div><b>${fmtDate(m.date)} · ${esc(m.time)}</b><span>${esc(m.mode)} with a ShaadiKart executive${m.changes ? ` · rescheduled ${m.changes}×` : ''}</span></div></div>
      <p class="gate-p">We have sent the details to your mobile. You can change the slot any time before the meeting.</p>
      <button type="button" class="btn btn-ghost btn-block" data-act="meet-open" data-ev="${ev.id}">Reschedule meeting</button>`;
    else if (st !== 'open') main = `<div class="gate-card ok">${ic('calendarCheck')}<div><b>Meeting completed</b><span>${fmtDate(m.date)} · ${esc(m.mode)}</span></div></div>`;
    let callPart;
    if (st === 'unlock') callPart = `${log}<div class="gate-card ok">${ic('shield')}<div><b>Thank you, you are verified</b><span>${ans ? 'We spoke on our call, so you do not need to call us.' : `We received your call at ${hhmm(g.inbound.t)}.`} ${journeyOf(ev).blueprintApproved ? 'A ShaadiKart executive is opening payment now.' : 'Next, review and approve your Blueprint.'}</span></div></div>`;
    else if (ans) callPart = `${log}<div class="gate-card ok">${ic('shield')}<div><b>Thank you for speaking with us</b><span>You do not need to call us back. After your meeting, a ShaadiKart executive unlocks payment.</span></div></div>`;
    else callPart = `${log}<p class="gate-p">${callOk ? 'We could not reach you on our two calls. ' : ''}${callOk ? 'Please call us' : 'If you would rather not wait, you can call us'} from your registered mobile. This is how we confirm it is really you.</p>
          <a class="callno" href="tel:${CALL_NO}">${ic('phone')}<span><small>Call ShaadiKart</small><b>${CALL_NO}</b></span></a>
          <button type="button" class="btn btn-gold btn-block" data-act="call-us" data-ev="${ev.id}">I have called ${CALL_NO} <small style="opacity:.8">(demo)</small></button>`;
    const act = main + callPart;
    return `<div class="gate"><div class="gate-h">${ic('shield')}<div><b>Your booking journey</b><small>A few quick steps keep your booking safe</small></div></div>${steps}<div class="gate-act">${act}</div>
      <button type="button" class="btn btn-ghost btn-block" style="margin-top:10px" data-act="wa-open" data-ev="${ev.id}"><span class="wa-dot"></span>Get my cart on WhatsApp</button></div>`;
  }

  function meetingModal(ev) {
    const g = gateOf(ev), m = g.meeting, min = isoPlus(1), max = new Date(ev.date) > new Date(min) ? ev.date : '';
    openModal(m ? 'Reschedule your meeting' : 'Schedule your meeting', `<form data-form="meeting" data-ev="${ev.id}" class="modal-b" style="padding:0">
      <p style="margin:0;color:var(--muted)">A short meeting with a ShaadiKart executive about your ${esc(ev.type.toLowerCase())}. This step is required before payment.</p>
      <label class="field">Date<input type="date" name="date" required min="${min}" ${max ? `max="${max}"` : ''} value="${m ? esc(m.date) : min}"></label>
      <label class="field">Time<select name="time">${SLOTS.map(x => `<option ${m && m.time === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label class="field">How would you like to meet?<select name="mode">${MODES.map(x => `<option ${m && m.mode === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <button class="btn btn-primary" type="submit">${m ? 'Save new time' : 'Confirm meeting'}</button></form>`);
  }

  /* ---------- My Event journey: wraps the gate; ev.gate stays the source of truth for meeting/calls/unlock ---------- */
  const JOURNEY = [
    ['requests-sent', 'Requests sent'], ['partners-confirm', 'Partners confirm'], ['see-my-event', 'See My Event'],
    ['conversation', 'Conversation'], ['blueprint', 'Blueprint'], ['payment', 'Payment'], ['booked', 'Booked']
  ];
  const journeyOf = ev => ev.journey || (ev.journey = { host: { name: 'Priya Kapoor', role: 'Customer Success', years: 4, languages: 'Hindi, English' }, visitRequested: null, blueprintApproved: null, waThread: [] });
  // The stage is derived from event state each time, never stored.
  function journeyStage(ev) {
    const j = journeyOf(ev), svcs = liveSvcs(ev), st = svcs.map(svcStatus);
    if (ev.payments.length && st.length && st.every(x => x === 'paid' || x === 'unavailable')) return 'booked';
    if (ev.payments.length) return 'payment';
    if (j.blueprintApproved) return 'blueprint';
    if (gateOf(ev).held) return 'conversation';
    if (st.length && !st.includes('awaiting')) return 'see-my-event';
    if (st.some(x => x !== 'awaiting')) return 'partners-confirm';
    return 'requests-sent';
  }

  /* ---------- cart ---------- */
  const inCart = vid => S.cart.items.find(i => i.partnerId === vid);
  const cartCount = () => S.cart.items.length;
  // Pricing (single source of truth). Venues and caterers: per plate (veg / non-veg) × guests. Everyone else: package price.
  const dietLabel = d => d === 'nonveg' ? 'Non-veg' : 'Veg';
  const dietDot = d => `<span class="diet ${d === 'nonveg' ? 'nv' : 'v'}" aria-hidden="true"></span>`;
  const rawUnit = (v, p, diet = 'veg') => v.perPlate ? (diet === 'nonveg' ? p.nonveg : p.veg) : p.price;
  const unitPrice = (v, p, diet = 'veg') => {
    const raw = rawUnit(v, p, diet); if (!v.offer) return raw;
    const step = v.perPlate ? 10 : 100;
    return Math.round(raw * (1 - v.offer / 100) / step) * step;
  };
  const offerPrice = (v, p, diet = 'veg', guests = S.cart.event.guests) => v.perPlate ? unitPrice(v, p, diet) * guests : unitPrice(v, p, diet);
  const fromPrice = v => unitPrice(v, v.packages[0], 'veg');
  const fromLabel = v => v.perPlate ? `${inr(fromPrice(v))} <small>per plate · veg</small>` : `${inr(fromPrice(v))} <small>onwards · ${esc(v.unit)}</small>`;
  const priceTag = (v, p, diet = 'veg') => (v.offer ? `<s style="color:var(--muted);font-weight:400;margin-right:6px">${inr(rawUnit(v, p, diet))}</s>` : '') + inr(unitPrice(v, p, diet)) + (v.perPlate ? ' <small>/ plate</small>' : '');
  const capLabel = v => v.cap ? `${v.cap[0]}–${v.cap[1]} guests` : '';
  const capFits = (v, g) => !v.cap || g <= v.cap[1];
  const dietTags = v => v.perPlate ? `<span class="tag tag-grey">${dietDot('veg')}Veg ${inr(unitPrice(v, v.packages[0], 'veg'))}</span><span class="tag tag-grey">${dietDot('nonveg')}Non-veg ${inr(unitPrice(v, v.packages[0], 'nonveg'))}</span>` : v.vegOnly ? `<span class="tag tag-grey">${dietDot('veg')}Pure veg</span>` : '';
  const ppTotal = (v, pkg, diet, g) => { const p = pkgOf(v, pkg); return `<span>${dietLabel(diet)} · ${inr(unitPrice(v, p, diet))} × ${g} guests</span><b>${inr(offerPrice(v, p, diet, g))}</b>`; };
  // Payment methods with original logo-style marks (not official trademarks).
  const PAY_LOGOS = {
    UPI: '<svg viewBox="0 0 56 34" aria-hidden="true"><rect x=".5" y=".5" width="55" height="33" rx="7" fill="#fff" stroke="#ddd6f3"/><text x="8" y="22.5" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-style="italic" font-size="14" fill="#4b4f56">UPI</text><path d="M38 9l6.5 8-6.5 8z" fill="#f7931e"/><path d="M42.5 9l6.5 8-6.5 8z" fill="#138808"/></svg>',
    Card: '<svg viewBox="0 0 56 34" aria-hidden="true"><rect width="56" height="34" rx="7" fill="#3b1a92"/><rect y="7" width="56" height="5" fill="#22105a"/><rect x="7" y="16" width="10" height="8" rx="1.5" fill="#f7c548"/><rect x="21" y="24" width="18" height="2.5" rx="1.2" fill="#c9b8fb"/><circle cx="42" cy="22" r="5" fill="#eea73a" opacity=".9"/><circle cx="48" cy="22" r="5" fill="#f7c548" opacity=".85"/></svg>',
    'Net banking': '<svg viewBox="0 0 56 34" aria-hidden="true"><rect x=".5" y=".5" width="55" height="33" rx="7" fill="#e9f6ef" stroke="#bfe3cd"/><path d="M28 6l13 6H15z" fill="#1f7a4c"/><rect x="17" y="13" width="22" height="2" fill="#1f7a4c"/><rect x="19" y="16" width="3" height="9" fill="#1f7a4c"/><rect x="26.5" y="16" width="3" height="9" fill="#1f7a4c"/><rect x="34" y="16" width="3" height="9" fill="#1f7a4c"/><rect x="15" y="26" width="26" height="2.5" rx="1" fill="#1f7a4c"/></svg>',
    'Bank transfer': '<svg viewBox="0 0 56 34" aria-hidden="true"><rect x=".5" y=".5" width="55" height="33" rx="7" fill="#eef2ff" stroke="#c7d2fe"/><path d="M10 17h26" stroke="#3b1a92" stroke-width="2.4" stroke-linecap="round"/><path d="M31 11l6 6-6 6" fill="none" stroke="#3b1a92" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><text x="10" y="29" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="7.5" fill="#3b1a92">NEFT · RTGS</text><rect x="40" y="9" width="9" height="12" rx="1.5" fill="#f7c548"/></svg>',
    'Card EMI': '<svg viewBox="0 0 56 34" aria-hidden="true"><rect width="56" height="34" rx="7" fill="#22105a"/><rect x="7" y="9" width="12" height="9" rx="1.5" fill="#f7c548"/><text x="24" y="17" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="10" fill="#fff">EMI</text><path d="M8 25h40" stroke="#c9b8fb" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4"/></svg>',
    Cash: '<svg viewBox="0 0 56 34" aria-hidden="true"><rect x=".5" y=".5" width="55" height="33" rx="7" fill="#fff6dc" stroke="#f6dc9a"/><rect x="8" y="8" width="40" height="18" rx="3" fill="#7cc79a" stroke="#2f8a57"/><circle cx="28" cy="17" r="6" fill="#e9f6ef" stroke="#2f8a57"/><text x="28" y="20.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="9" fill="#1f5f3c">₹</text></svg>'
  };
  // Researched limits (see 03_Research/ShaadiKart_Payment_Model_Research_2026-11-10.md): UPI ₹1 lakh per payment,
  // cards and net banking ₹5 lakh per payment, NEFT no cap, RTGS from ₹2 lakh. Treat as guidance; the bank decides.
  const UPI_LIMIT = 100000, CARD_LIMIT = 500000, RTGS_MIN = 200000;
  const payOptions = amt => {
    const parts = Math.ceil(amt / UPI_LIMIT), within = amt <= CARD_LIMIT;
    return [
      { id: 'UPI', sub: 'Google Pay, PhonePe, Paytm or any UPI app', ok: true, note: amt <= UPI_LIMIT ? `Up to ${inr(UPI_LIMIT)} per payment` : `Above the ${inr(UPI_LIMIT)} UPI limit, so we split it into ${parts} payments of about ${inr(Math.ceil(amt / parts))}` },
      { id: 'Net banking', sub: 'All major Indian banks', ok: within, note: within ? `Up to ${inr(CARD_LIMIT)} per payment` : `Above ${inr(CARD_LIMIT)}. Please use bank transfer` },
      { id: 'Card', sub: 'Credit or debit · Visa, Mastercard, RuPay', ok: within, note: within ? `Up to ${inr(CARD_LIMIT)} per payment, subject to your card limit` : `Above ${inr(CARD_LIMIT)}. Please use bank transfer` },
      { id: 'Card EMI', sub: 'Spread over 3 to 12 months with your card issuer', ok: within && amt >= 10000, note: 'Interest and fees as per your card issuer' },
      { id: 'Bank transfer', sub: 'NEFT or RTGS to your ShaadiKart payment account', ok: true, note: amt >= RTGS_MIN ? `RTGS works from ${inr(RTGS_MIN)}, with no upper limit` : `NEFT has no limit. RTGS starts at ${inr(RTGS_MIN)}` },
      { id: 'Cash', sub: 'Pay the partner in cash and get their receipt', ok: true, note: 'Paid directly to the partner' }
    ];
  };
  const payBest = amt => amt <= UPI_LIMIT ? 'UPI' : amt <= CARD_LIMIT ? 'Net banking' : 'Bank transfer';
  const payMethods = (amt, sel) => {
    const opts = payOptions(amt), best = payBest(amt), cur = opts.find(o => o.id === sel && o.ok) ? sel : best;
    return `<div class="pay-opts pay-methods">${opts.map(o => `<label class="pay-opt pm${o.ok ? '' : ' off'}"><input type="radio" name="method" value="${o.id}" ${o.id === cur ? 'checked' : ''} ${o.ok ? '' : 'disabled'}><span class="pm-logo">${PAY_LOGOS[o.id]}</span><span class="pm-t"><b>${o.id}${o.id === best ? ' <span class="tag tag-green">Recommended</span>' : ''}</b><small>${o.sub}</small><small class="pm-note">${o.note}</small></span></label>`).join('')}</div>`;
  };
  const svcMeta = s => s.rate ? ` · ${dietLabel(s.diet)} · ${inr(s.rate)} × ${s.guests} guests` : '';
  const offerTag = v => v.offer ? `<span class="tag tag-gold">${ic('sparkles')}${v.offer}% off</span>` : '';
  const isWished = vid => S.cart.saved.some(s => s.partnerId === vid);
  const cartLines = () => S.cart.items.map(i => { const v = partner(i.partnerId); const p = pkgOf(v, i.pkg); const diet = i.diet || 'veg'; return { ...i, v, p, diet, unit: unitPrice(v, p, diet), price: offerPrice(v, p, diet) }; });
  function cartTotals() {
    const sub = cartLines().reduce((a, l) => a + l.price, 0);
    const gst = Math.round(sub * GST);
    const svc = sub + gst, fp = feeParts(svc), adv = Math.round(svc * ADV);
    return { sub, gst, fee: fp.fee, feeGst: fp.gst, total: svc + fp.total, advance: adv + fp.total };
  }

  /* ---------- Work history, menus, rooms, replies (shared by the popup and partner pages) ---------- */
  const MENU_ORDER = ['Welcome drinks', 'Starters', 'Main course', 'Breads', 'Desserts', 'Live counters', 'Mithai boxes', 'Cakes', 'Chaat & namkeen'];
  const menuOf = (v, id, diet) => {
    const base = v.menu && v.menu[id]; if (!base) return null;
    const out = {}; Object.keys(base).forEach(k => { out[k] = base[k].map(n => ({ n, nv: false })); });
    if (diet === 'nonveg' && v.menuNV && v.menuNV[id]) Object.keys(v.menuNV[id]).forEach(k => { out[k] = [...(out[k] || []), ...v.menuNV[id][k].map(n => ({ n, nv: true }))]; });
    return out;
  };
  const menuCount = (v, id, diet) => { const m = menuOf(v, id, diet); return m ? Object.values(m).reduce((a, l) => a + l.length, 0) : 0; };
  const menuHtml = (v, tier, diet) => {
    const m = menuOf(v, tier, diet); if (!m) return '';
    return `<div class="menu-grid">${Object.keys(m).sort((a, b) => MENU_ORDER.indexOf(a) - MENU_ORDER.indexOf(b)).map(k => `<div class="menu-sec"><h6>${esc(k)} <small>${m[k].length}</small></h6><ul>${m[k].map(x => `<li>${dietDot(x.nv ? 'nonveg' : 'veg')}${esc(x.n)}</li>`).join('')}</ul></div>`).join('')}</div>`;
  };
  const tierPick = (v, tier, diet, act) => `<div class="lv-pk tiers">${v.packages.map(p => `<button class="${p.id === tier ? 'on' : ''}" data-act="${act}" data-t="${p.id}"><b>${esc(p.name)}</b><span>${v.perPlate ? `${inr(unitPrice(v, p, diet))} <small>/ plate</small>` : inr(unitPrice(v, p))}</span><small>${menuCount(v, p.id, diet)} food types</small></button>`).join('')}</div>`;
  const roomsHtml = v => {
    const r = v.rooms; if (!r) return `<p class="note">${ic('info')}<span>No rooms on site. Ask in your query and we will suggest nearby stays.</span></p>`;
    return `<div class="rooms"><div class="rm-top"><b>${r.total} rooms</b><span>${r.comp} complimentary for the families · Check-in ${r.checkin} · Check-out ${r.checkout}</span></div>
      <div class="rm-types">${r.types.map(([n, c, rate, s]) => `<div><b>${esc(n)}</b><small>${c} rooms · sleeps ${s}</small><span>${inr(rate)} <small>/ night</small></span></div>`).join('')}</div>
      <div class="rm-am">${r.amenities.map(a => `<span class="chip">${esc(a)}</span>`).join('')}</div>
      <p class="note">${ic('info')}<span>Room rates are per night and illustrative. Ask for rooms in the questions box before you pay.</span></p></div>`;
  };
  const historyHtml = v => `<div class="hist">${v.history.map(h => `<article><span class="hi" ${bg(h.img, 400)} role="img" aria-label="${esc(h.title)}"></span><div><b>${esc(h.title)}</b><small>${esc(h.client)} · ${esc(h.place)} · ${esc(h.date)}</small><p>${esc(h.note)}</p><q>${esc(h.quote)}</q></div></article>`).join('')}</div>`;
  function makeReply(v, q) {
    const t = (q || '').toLowerCase(); if (!t.trim()) return 'Your date is confirmed. We have noted no special requests.';
    const r = [], food = v.cat === 'venues' || v.cat === 'catering';
    if (/room|stay|check.?in|accommodat/.test(t)) r.push(v.rooms ? `We have ${v.rooms.total} rooms (${v.rooms.comp} complimentary for the families), charged per night as listed on our page.` : v.cat === 'venues' ? 'We do not have rooms on site, but we can suggest nearby stays.' : 'Rooms are handled by your venue, so please check that with them.');
    if (food && /jain|onion|garlic/.test(t)) r.push('A Jain menu without onion and garlic can be arranged.');
    if (food && /taste|tasting|menu/.test(t)) r.push('We can arrange a menu tasting about a week before your date.');
    if (/decor/.test(t)) r.push(v.cat === 'decor' || v.cat === 'haldi' ? 'Yes, we can match or work alongside your preferred theme.' : 'Outside decorators are welcome with a small coordination fee.');
    if (/music|dj|sound/.test(t)) r.push('Music and sound are allowed until 10:30 pm as per local rules.');
    return (r.length ? r.join(' ') + ' ' : '') + 'Noted, and we will take care of the rest.';
  }
  const QUERY_CHIPS = ['Need rooms for family', 'Jain food counter', 'Menu tasting before booking', 'Outside decorator allowed?', 'Early check-in'];
  let PGTIER = 'silver';
  const queryField = (val, kind) => `<div class="qfield"><label class="field">Questions or special requests for your partners (optional)<textarea ${kind === 'pl' ? 'id="pl-query" data-change="pl-query"' : 'data-change="cart-query"'} placeholder="For example: rooms for 10 family members, Jain food counter, menu tasting">${esc(val || '')}</textarea></label><div class="q-chips">${QUERY_CHIPS.map(c => `<button type="button" class="chip" data-act="q-chip" data-q="${esc(c)}">+ ${esc(c)}</button>`).join('')}</div><p class="note">${ic('info')}<span>Each partner replies before you pay, and you confirm their replies first.</span></p></div>`;

  /* ---------- Start Planning: 4-step popup (mirrors the "4 Easy Steps" band) ---------- */
  /* ---------- Guest ranges per event type (dropdown + custom) ---------- */
  // A range is priced at its upper end, so quotes never under-count the plates.
  const GUEST_RANGES = {
    Wedding: [[50, 100], [100, 200], [200, 300], [300, 500], [500, 1000]],
    Engagement: [[50, 100], [100, 200], [200, 300], [300, 500]],
    Anniversary: [[20, 50], [50, 100], [100, 200], [200, 300]],
    Corporate: [[20, 50], [50, 100], [100, 250], [250, 500]],
    Birthday: [[10, 25], [25, 50], [50, 100], [100, 150]],
    'Baby Shower': [[10, 25], [25, 50], [50, 100]],
    'Kitty Party': [[10, 15], [15, 25], [25, 40], [40, 60]]
  };
  const GUEST_DEFAULT = { Wedding: 300, Engagement: 200, Anniversary: 100, Corporate: 100, Birthday: 50, 'Baby Shower': 25, 'Kitty Party': 25 };
  // Suggested budget = guests x a realistic per-guest spend for the event type, rounded to the nearest Rs 5,000.
  const BUDGET_PER_GUEST = { Wedding: 1700, Engagement: 1200, Anniversary: 900, Corporate: 1000, Birthday: 700, 'Baby Shower': 700, 'Kitty Party': 800 };
  const BUDGET_LOCALITY = { Delhi: 1, Gurugram: 1.1, Noida: 0.95, Ghaziabad: 0.85, Faridabad: 0.85 }; // illustrative cost-level multiplier
  const suggestBudget = (t, g, loc) => Math.max(5000, Math.round(g * (BUDGET_PER_GUEST[t] || 1000) * (BUDGET_LOCALITY[loc] || 1) / 5000) * 5000);
  const guestRanges = t => GUEST_RANGES[t] || GUEST_RANGES.Wedding;
  const guestSelected = (t, g, custom) => custom ? 'custom' : (guestRanges(t).some(r => r[1] === g) ? String(g) : 'custom');
  const guestField = (t, g, custom, sid, nid, nameAttr) => {
    const sel = guestSelected(t, g, custom);
    return `<label class="field">Guests<select ${sid} ${nameAttr ? 'name="guestsSel"' : 'data-change="pl-gsel"'} aria-label="Number of guests">${guestRanges(t).map(r => `<option value="${r[1]}" ${sel === String(r[1]) ? 'selected' : ''}>${r[0]}–${r[1]} guests</option>`).join('')}<option value="custom" ${sel === 'custom' ? 'selected' : ''}>Custom number…</option></select>
      <input ${nid} type="number" min="1" step="1" value="${g}" aria-label="Custom number of guests" style="margin-top:8px" ${sel === 'custom' ? '' : 'hidden'}></label>`;
  };
  const PLAN_STEPS = [['Choose Event', 'Wedding / Birthday / More'], ['Explore Partners', 'Compare &amp; Select'], ['Add to Cart', 'One Cart for All'], ['Book &amp; Celebrate', 'Make it Memorable']];
  const PLAN_MAIN = ['venues', 'decor', 'photo', 'catering', 'beauty']; // large cards; every other category sits under "Others"
  let PL = null, LV = null;
  const planDraft = () => PL || (PL = { ...S.cart.event, diet: 'veg', cats: [], picks: {}, view: 'main' });
  const planSuggest = cat => D.PARTNERS.filter(v => v.cat === cat)
    .sort((a, b) => capFits(b, PL.guests) - capFits(a, PL.guests) || (b.locality === PL.locality) - (a.locality === PL.locality) || b.rating - a.rating).slice(0, 3);
  const planOptions = cat => { const top = planSuggest(cat), pick = PL.picks[cat]; if (pick && !top.some(v => v.id === pick)) top[top.length - 1] = partner(pick); return top; };
  // Kitty packages are sized "up to N guests": pick the smallest one that fits, else the largest.
  const planPkg = v => {
    if (v.cat !== 'kitty') return v.packages[0];
    const cap = k => +((k.name.match(/up to (\d+)/) || [])[1] || 0);
    return v.packages.find(k => cap(k) >= PL.guests) || v.packages[v.packages.length - 1];
  };
  const planLines = () => PL.cats.filter(c => PL.picks[c]).map(c => {
    const v = partner(PL.picks[c]), p = planPkg(v);
    return { c, v, unit: unitPrice(v, p, PL.diet), price: offerPrice(v, p, PL.diet, PL.guests) };
  });
  function readPlanInputs() {
    const m = $('#modal-root');
    const val = id => { const el = m.querySelector('#' + id); return el ? el.value : null; };
    if (!PL || !m.querySelector('#pl-date')) return;
    PL.date = val('pl-date') || PL.date;
    const gs = val('pl-gsel');
    if (gs === 'custom') { PL.gc = true; PL.guests = Math.max(1, +val('pl-guests') || PL.guests); }
    else if (gs) { PL.gc = false; PL.guests = +gs; }
    PL.locality = val('pl-loc') || PL.locality;
    PL.budget = Math.max(0, +val('pl-budget') || 0);
  }
  function syncPlanBudget() { PL.budget = suggestBudget(PL.type, PL.guests, PL.locality); const b = $('#pl-budget'); if (b) b.value = PL.budget; }
  const planMark = on => `<i class="ck ${on ? 'on' : ''}">${ic(on ? 'check' : 'plus')}</i>`;
  const planOthersList = () => D.CATEGORIES.filter(c => !PLAN_MAIN.includes(c.id));
  const planOthersSel = () => PL.cats.filter(id => !PLAN_MAIN.includes(id)).length;
  // A service card. Selecting it expands the photo in place: its top 5 partners (photo, name, rating, rate) appear on the
  // photo itself, followed by a "More" link that opens that service's full catalog. Nothing is added below the cards.
  function planTile(c) {
    const on = PL.cats.includes(c.id), list = D.PARTNERS.filter(v => v.cat === c.id);
    const cheap = list.reduce((a, v) => fromPrice(v) < fromPrice(a) ? v : a, list[0]);
    const top = [...list].sort((a, b) => b.rating - a.rating).slice(0, 5);
    return `<div class="plan-tile ${on ? 'on' : ''}"><button class="plan-cat ${on ? 'on' : ''}" data-act="plan-cat" data-cat="${c.id}" aria-pressed="${on}" ${bg(c.tile || c.img, 1200)}>
      <span class="pc-ic">${ic(c.icon)}</span><span class="pc-nm">${esc(c.name)}<small>${list.length} partners · from ${inr(fromPrice(cheap))}${cheap.perPlate ? ' / plate' : ''}</small></span>${planMark(on)}</button>
      <div class="pt-info"><div class="pt-h"><span>Top ${top.length} partners · tap <b>+</b> to choose · tap <b>›</b> to see details</span></div>
        <ul class="pt-list">${top.map(v => { const sel = PL.picks[c.id] === v.id; return `<li class="pt-item"><button type="button" class="pt-p ${sel ? 'sel' : ''}" data-act="plan-choose" data-cat="${c.id}" data-vid="${v.id}" aria-pressed="${sel}" aria-label="Choose ${esc(v.name)}"><span class="pt-ph" ${bg(v.photos[0], 400)}><i class="pt-mark">${ic(sel ? 'check' : 'plus')}</i></span><span class="pt-t"><span class="pt-n">${esc(v.name)}</span><span class="stars">${ic('star')}${v.rating}</span><span class="pt-r">${v.perPlate ? 'from ' : ''}${inr(fromPrice(v))}${v.perPlate ? ' <small>/ plate</small>' : ''}</span></span></button><button type="button" class="pt-go" data-act="plan-view" data-cat="${c.id}" data-vid="${v.id}" aria-label="See details of ${esc(v.name)}">${ic('chevronRight')}</button></li>`; }).join('')}</ul>
        <button type="button" class="pt-more" data-act="plan-view" data-cat="${c.id}">More ${esc(c.short)} partners ${ic('chevronRight')}</button></div></div>`;
  }
  const planOthersTileText = () => `Others<small>${planOthersList().length} more services${planOthersSel() ? ` · ${planOthersSel()} selected` : ''}</small>`;
  const planOthersTile = () => `<div class="plan-tile plan-tile-static"><button class="plan-cat plan-others-card" data-act="plan-tab" data-v="others" ${bg('photo-1744804298431-57953e4eaba0', 600)}><span class="pc-ic">${ic('dots')}</span><span class="pc-nm">${planOthersTileText()}</span><i class="ck go">${ic('chevronRight')}</i></button></div>`;
  const planTabs = () => `<button role="tab" aria-selected="${PL.view === 'main'}" class="${PL.view === 'main' ? 'on' : ''}" data-act="plan-tab" data-v="main">Main services</button><button role="tab" aria-selected="${PL.view === 'others'}" class="${PL.view === 'others' ? 'on' : ''}" data-act="plan-tab" data-v="others">Others <i>${planOthersList().length}</i>${planOthersSel() ? `<b>${planOthersSel()}</b>` : ''}</button>`;
  const planCount = () => `${ic('sparkles')}<b>${PL.cats.length}</b> service${PL.cats.length === 1 ? '' : 's'} selected`;
  // Partners (rate + rating only) for every selected service, shown under the cards.
  const ppPreview = v => v.menu
    ? `<span class="pp-menu">${ic('utensils')}${v.packages.map(p => `${esc(p.name)} ${menuCount(v, p.id, 'veg')}`).join(' · ')} food types</span>`
    : `<span class="pp-thumbs">${v.history.map(h => `<span ${bg(h.img, 160)}></span>`).join('')}</span>`;
  const ppRow = (v, cat) => `<li class="pp-row"><div class="pp-top"><span class="pp-n">${esc(v.name)}${PL.picks[cat] === v.id ? ' <span class="tag tag-green">Your pick</span>' : ''}</span><span class="stars">${ic('star')}${v.rating}</span><span class="pp-r">${inr(fromPrice(v))}${v.perPlate ? ' <small>/ plate</small>' : ''}</span></div>
    <div class="pp-prev">${ppPreview(v)}<button class="link-btn" data-act="plan-view" data-cat="${cat}" data-vid="${v.id}">See work ${ic('chevronRight')}</button></div></li>`;
  function planPanel() {
    return PL.cats.length ? '' : `<p class="plan-hint">${ic('info')}<span>Tap a service to open it. Its top partners, with rating and rate, appear on the photo itself.</span></p>`;
  }
  function openPlan(step) {
    const d = planDraft();
    if (step >= 3) d.cats.forEach(c => { if (!d.picks[c] || partner(d.picks[c]).cat !== c) d.picks[c] = planSuggest(c)[0].id; });
    const still = !!$('#modal-root .modal');
    const keepScroll = still && PL.step === step ? $('#modal-root .modal').scrollTop : 0;
    d.step = step;
    const head = `<ol class="plan-steps">${PLAN_STEPS.map(([t, sub], i) => `<li class="${i + 1 === step ? 'cur' : i + 1 < step ? 'done' : ''}"><button data-act="plan" data-step="${i + 1}"><span class="n">${i + 1 < step ? ic('check') : i + 1}</span><span><b>${t}</b><small>${sub}</small></span></button></li>`).join('')}</ol>`;
    const perPlateCats = d.cats.filter(c => D.PARTNERS.some(v => v.cat === c && v.perPlate));
    let body = '';
    if (step === 1) {
      body = `<h4 class="plan-h">What are you planning?</h4>
        <div class="event-types">${D.EVENT_TYPES.map(t => `<button class="event-type ${d.type === t ? 'on' : ''}" data-act="plan-type" data-type="${t}" ${bg(D.PHOTOS.events[t], 500)}><span>${t}</span></button>`).join('')}</div>
        <div class="form-grid" style="margin-top:6px">
          <label class="field">Event date<input id="pl-date" type="date" min="${isoPlus(1)}" value="${esc(d.date)}"></label>
          ${guestField(d.type, d.guests, d.gc, 'id="pl-gsel"', 'id="pl-guests" data-change="pl-guests"', false)}
          <label class="field">Location<select id="pl-loc" data-change="pl-loc">${D.LOCALITIES.map(l => `<option value="${l}" ${d.locality === l ? 'selected' : ''}>${l === 'Delhi' ? 'New Delhi' : l}</option>`).join('')}</select></label>
          <label class="field">Budget (₹)<input id="pl-budget" type="number" min="0" step="5000" data-change="pl-budget" value="${d.budget}"></label>
        </div>`;
    } else if (step === 2) {
      body = `<h4 class="plan-h">Which services do you need for your ${esc(d.type.toLowerCase())}?</h4>
        <p class="note" style="margin:-6px 0 0">${ic('info')}<span>Tap a service to open it and pick as many as you like. Next, we suggest ShaadiKart Verified partners near ${esc(d.locality === 'Delhi' ? 'New Delhi' : d.locality)} for each one.</span></p>
        <div class="plan-tabs" id="plan-tabs" role="tablist">${planTabs()}</div>
        ${d.view === 'main'
          ? `<div class="plan-cats plan-cats-main">${PLAN_MAIN.map(id => planTile(catOf(id))).join('')}${planOthersTile()}</div>`
          : `<div class="plan-cats plan-cats-oth">${planOthersList().map(planTile).join('')}</div>`}
        <div id="plan-panel" class="plan-panel">${planPanel()}</div>
        ${d.cats.includes('venues') ? `<p class="note">${ic('utensils')}<span>Venue prices are <b>per plate and include food</b>. Add Food &amp; Catering only for an outside caterer or extra live counters.</span></p>` : ''}
        <p class="plan-count" id="plan-count">${planCount()}</p>`;
    } else if (step === 3) {
      const lines = planLines(), sub = lines.reduce((a, l) => a + l.price, 0), svcT = Math.round(sub * (1 + GST)), tot = svcT + feeParts(svcT).total;
      const pct = d.budget ? Math.round(tot / d.budget * 100) : 0;
      body = `<div class="plan-3h"><h4 class="plan-h">Choose one partner for each service</h4>
        ${perPlateCats.length ? `<div class="diet-switch" role="group" aria-label="Food preference"><span>Food for ${d.guests} guests:</span>${['veg', 'nonveg'].map(x => `<button class="${d.diet === x ? 'on' : ''}" data-act="plan-diet" data-diet="${x}" aria-pressed="${d.diet === x}">${dietDot(x)}${dietLabel(x)}</button>`).join('')}</div>` : ''}</div>
        <p class="note" style="margin:-4px 0 0">${ic('info')}<span>We have picked the best-rated partner for you. Tap <b class="sf">+</b> to choose a partner. Tap the <b class="sf">›</b> arrow only if you want to see their artists and work.</span></p>
        ${d.cats.map(c => { const cat = catOf(c); return `<div class="plan-cat-block"><h5>${ic(cat.icon)}${esc(cat.name)}<button class="link-btn" data-act="plan-view" data-cat="${c}">See all ${D.PARTNERS.filter(v => v.cat === c).length} partners ${ic('chevronRight')}</button></h5><div class="plan-opts">${planOptions(c).map(v => { const p = v.packages[0], fits = capFits(v, d.guests), on = d.picks[c] === v.id; return `<div class="plan-opt ${on ? 'on' : ''}">
            <button class="po-photo" data-act="plan-pick" data-cat="${c}" data-vid="${v.id}" aria-label="Choose ${esc(v.name)}"><span class="ph" ${bg(v.photos[0], 300)}></span><i class="po-plus ${on ? 'on' : ''}">${ic(on ? 'check' : 'plus')}</i></button>
            <button class="po-body" data-act="plan-pick" data-cat="${c}" data-vid="${v.id}" aria-pressed="${on}"><b>${esc(v.name)}</b><small>${esc(v.area)}, ${esc(v.locality)} · <span class="stars">${ic('star')}${v.rating}</span></small>
              ${v.perPlate ? `<span class="po-p">${dietDot(d.diet)}${inr(unitPrice(v, p, d.diet))} <small>/ plate</small>${v.offer ? ` <span class="tag tag-gold">${v.offer}% off</span>` : ''}</span>
                <small class="po-x">× ${d.guests} = <b>${inr(offerPrice(v, p, d.diet, d.guests))}</b></small>
                ${v.cap ? `<small class="po-cap ${fits ? '' : 'bad'}">${ic('users2')}${v.kind} · ${capLabel(v)}${fits ? '' : ' · too small'}</small>` : ''}`
              : `<span class="po-p">${inr(unitPrice(v, p))}${v.offer ? ` <span class="tag tag-gold">${v.offer}% off</span>` : ''}</span>${v.vegOnly ? `<small class="po-cap">${dietDot('veg')}Pure veg</small>` : ''}`}</button>
            <button class="po-more" data-act="plan-view" data-cat="${c}" data-vid="${v.id}" aria-label="See details of ${esc(v.name)}">${ic('chevronRight')}</button>
            ${on ? `<i class="ck on">${ic('check')}</i>` : ''}</div>`; }).join('')}</div></div>`; }).join('')}
        <div class="plan-budget"><div class="sum-row"><span>Estimated total incl. GST and platform fee</span><b>${inr(tot)}</b></div><div class="meter ${pct > 100 ? 'over' : ''}"><i style="width:${Math.min(pct, 100)}%"></i></div><div class="note">${ic(pct > 100 ? 'alert' : 'info')}<span>${pct}% of your ${inr(d.budget)} budget${pct > 100 ? '. Try another partner or a veg menu to bring it down.' : '.'}</span></div></div>`;
    } else {
      const lines = planLines(), sub = lines.reduce((a, l) => a + l.price, 0), gst = Math.round(sub * GST), fp = feeParts(sub + gst), total = sub + gst + fp.total, adv = Math.round((sub + gst) * ADV);
      body = `<h4 class="plan-h">Review and book</h4>
        <div class="callout"><span>${ic('calendarCheck')}</span><span><b>${esc(d.type)}</b> · ${fmtDate(d.date)} · ${d.guests} guests · ${esc(d.locality === 'Delhi' ? 'New Delhi' : d.locality)}${perPlateCats.length ? ` · ${dietLabel(d.diet)} menu` : ''}</span></div>
        <div class="tbl-wrap"><table class="tbl plan-rv"><thead><tr><th>Service</th><th>Partner</th><th class="r">Amount</th></tr></thead><tbody>
          ${lines.map(l => `<tr><td><span class="rv-svc"><span class="rv-ph" ${bg(catOf(l.c).tile || catOf(l.c).img, 200)}></span>${esc(catOf(l.c).short)}</span></td><td><span class="rv-svc"><span class="rv-ph" ${bg(l.v.photos[0], 200)}></span><span><b>${esc(l.v.name)}</b><br><small>${esc(planPkg(l.v).name)} · ★ ${l.v.rating}${l.v.offer ? ` · ${l.v.offer}% off` : ''}</small>${l.v.perPlate ? `<br><small>${dietDot(d.diet)}${inr(l.unit)} per plate × ${d.guests} guests</small>` : ''}</span></span></td><td class="r">${inr(l.price)}</td></tr>`).join('')}
          <tr><td colspan="2">GST on services (18%, illustrative)</td><td class="r">${inr(gst)}</td></tr>
          <tr><td colspan="2">ShaadiKart platform fee (0.5%)</td><td class="r">${inr(fp.fee)}</td></tr>
          <tr><td colspan="2">GST on platform fee (18%)</td><td class="r">${inr(fp.gst)}</td></tr>
          <tr><td colspan="2"><b>Estimated total</b></td><td class="r"><b>${inr(total)}</b></td></tr></tbody></table></div>
        <div class="care-line">${ic('medical')}<span><b>ShaadiKart Care included:</b> free priority medical help on your ${PL.type === 'Wedding' ? 'wedding' : 'event'} day (demo promise).</span></div>
        ${queryField(d.query != null ? d.query : S.cart.query, 'pl')}
        <div class="soft-note">${ic('heart')}<div><b>Nothing to pay right now.</b><p>We will first check your date with each partner and bring you their confirmations. Once they have said yes, you can secure your booking with a 25% advance (${inr(adv + fp.total)}, including the ShaadiKart platform fee). If a partner is not free on your date, we will help you find another one, and the rest of your booking carries on as planned.${cartCount() ? ' Services already in your cart are included too.' : ''}</p><small>The platform fee is 0.5% of your total cart value plus GST. It is collected once, with your first payment.</small></div></div>`;
    }
    const nextOk = step !== 2 || d.cats.length > 0;
    const foot = `<div class="plan-f">
      ${step > 1 ? `<button class="btn btn-ghost" data-act="plan" data-step="${step - 1}">← Back</button>` : '<span></span>'}
      ${step < 4 ? `<button class="btn btn-primary" data-act="plan" data-step="${step + 1}" ${nextOk ? '' : 'disabled'}>Next: ${PLAN_STEPS[step][0]} ${ic('arrowRight')}</button>`
        : `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><button class="btn btn-ghost" data-act="plan-cart">Add to cart &amp; review</button><button class="btn btn-gold" data-act="plan-book">Send booking requests ${ic('arrowRight')}</button></div>`}
    </div>`;
    openModal('Start Planning', head + body + foot, { wide: true, still });
    if (keepScroll) $('#modal-root .modal').scrollTop = keepScroll;
  }
  function planToCart() {
    if (PL.query != null) S.cart.query = PL.query;
    S.cart.event = { ...S.cart.event, type: PL.type, date: PL.date, guests: PL.guests, gc: PL.gc, locality: PL.locality, budget: PL.budget, name: S.cart.event.name || '' };
    planLines().forEach(l => { if (!inCart(l.v.id)) S.cart.items.push({ partnerId: l.v.id, pkg: planPkg(l.v).id, diet: PL.diet }); });
    const n = planLines().length;
    PL = null; save();
    return n;
  }

  /* ---------- Partner popup (second layer above the planner) ---------- */
  const layerRoot = () => { let r = $('#layer-root'); if (!r) { r = document.createElement('div'); r.id = 'layer-root'; document.body.appendChild(r); } return r; };
  const closeLayer = () => { const r = $('#layer-root'); if (r) r.innerHTML = ''; LV = null; };
  function renderLayer(animate) {
    const c = catOf(LV.cat), list = D.PARTNERS.filter(v => v.cat === LV.cat).sort((a, b) => b.rating - a.rating);
    const v = partner(LV.vid), a = v.artists[LV.artist] || v.artists[0], diet = PL.diet, tier = LV.tier || 'silver', pk = v.packages.find(p => p.id === tier) || v.packages[0];
    const rate = x => x.perPlate ? `${inr(fromPrice(x))} <small>/ plate</small>` : inr(fromPrice(x));
    const tabs = PL.cats.length > 1 ? `<div class="lv-tabs">${PL.cats.map(id => `<button class="${id === LV.cat ? 'on' : ''}" data-act="lv-cat" data-cat="${id}">${ic(catOf(id).icon)}${esc(catOf(id).short)}</button>`).join('')}</div>` : '';
    layerRoot().innerHTML = `<div class="modal-bg layer-bg${animate ? '' : ' still'}" data-act="layer-bg"><div class="modal layer" role="dialog" aria-modal="true" aria-label="${esc(c.name)} partners">
      <div class="modal-h"><h3>${ic(c.icon)} ${esc(c.name)}</h3><button class="x-btn" data-act="close-layer" aria-label="Close">${ic('x')}</button></div>
      <div class="modal-b lv-b">
        ${tabs}
        <div class="lv-subs">${c.subs.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
        <div class="lv-grid">
          <div class="lv-list" role="list">${list.map(x => `<button class="lv-card ${x.id === LV.vid ? 'on' : ''}" data-act="lv-partner" data-vid="${x.id}" aria-pressed="${x.id === LV.vid}">
              <span class="ph" ${bg(x.photos[0], 300)}></span>
              <span class="lv-t"><b>${esc(x.name)}</b><small>${esc(x.area)}, ${esc(x.locality)}</small><span class="lv-m"><span class="stars">${ic('star')}${x.rating}</span><span class="lv-rate">${rate(x)}</span>${x.offer ? `<span class="tag tag-gold">${x.offer}% off</span>` : ''}</span></span>
              ${PL.picks[LV.cat] === x.id ? `<i class="ck on">${ic('check')}</i>` : ''}</button>`).join('')}</div>
          <div class="lv-detail" id="lv-detail">
            <div class="lv-dh"><h4>${esc(v.name)}</h4><div class="lv-dm"><span class="tag tag-green">${ic('shield')}ShaadiKart Verified</span><span class="stars">${ic('star')}${v.rating} <small>(${v.reviews} reviews)</small></span><span>${ic('pin')} ${esc(v.area)}, ${esc(v.locality)}</span></div></div>
            ${v.menu
              ? `${tierPick(v, tier, diet, 'lv-tier')}<h5 class="lv-h">${ic('utensils')}What is in the ${esc(pk.name)} package ${v.menuNV ? `<span class="diet-switch mini">${['veg', 'nonveg'].map(x => `<button class="${diet === x ? 'on' : ''}" data-act="lv-diet" data-diet="${x}">${dietDot(x)}${dietLabel(x)}</button>`).join('')}</span>` : `<span class="diet-switch mini"><span class="tag tag-grey">${dietDot('veg')}Pure veg</span></span>`}</h5>${menuHtml(v, tier, diet)}`
              : `<div class="lv-pk">${v.packages.map(p => `<div><b>${esc(p.name)}</b><span>${inr(unitPrice(v, p))}</span><ul class="lv-inc">${p.includes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>`}
            ${v.cap ? `<p class="note">${ic('users2')}<span>${esc(v.kind)} · ${capLabel(v)} · hall and food included</span></p>` : ''}
            ${v.cat === 'venues' ? `<h5 class="lv-h">${ic('home')}Rooms &amp; stay</h5>${roomsHtml(v)}` : ''}
            <h5 class="lv-h">${ic('users2')}Artists &amp; team</h5>
            <div class="lv-artists">${v.artists.map((x, i) => `<button class="lv-ar ${i === LV.artist ? 'on' : ''}" data-act="lv-artist" data-i="${i}"><span class="av" ${bg(x.photo, 160)}></span><b>${esc(x.name)}</b><small>${esc(x.role)}</small></button>`).join('')}</div>
            <div class="lv-art"><div class="lv-ah"><b>${esc(a.name)}</b><span>${esc(a.role)} · ${a.years} yrs · <span class="stars">${ic('star')}${a.rating}</span></span></div>
              <div class="lv-works">${a.works.map(w => `<figure><span ${bg(w.img, 500)} role="img" aria-label="${esc(w.caption)}"></span><figcaption>${esc(w.caption)}</figcaption></figure>`).join('')}</div></div>
            ${v.sets ? `<h5 class="lv-h">${ic('camera')}Verified photo sets</h5>${setsHtml(v)}` : ''}
            <h5 class="lv-h">${ic('calendarCheck')}Past work <small>Illustrative examples for this concept demo</small></h5>${historyHtml(v)}
            <div class="lv-act"><button class="btn btn-ghost" data-act="close-layer">Back to planner</button><button class="btn btn-gold" data-act="lv-choose">${PL.picks[LV.cat] === v.id ? 'Keep ' : 'Choose '}${esc(v.name)}</button></div>
          </div></div></div></div></div>`;
  }
  function renderLayerKeep(toDetail) {
    const m = $('#layer-root .modal'), st = m ? m.scrollTop : 0;
    renderLayer(false);
    const nm = $('#layer-root .modal');
    if (toDetail && window.innerWidth <= 860) nm.scrollTop = $('#lv-detail').offsetTop - 70; else nm.scrollTop = st;
  }
  function openLayer(cat, vid) {
    LV = { cat, vid: vid || PL.picks[cat] || planOptions(cat)[0].id, artist: 0, tier: 'silver' };
    renderLayer(true);
  }

  /* ---------- Chat assistant (demo, rule-based: no AI service is connected) ---------- */
  const CHAT_KB = [
    [/book|how.*work|process|start/, 'Add partners to one event cart (or use Start Planning), add any questions, and send your requests. Each partner confirms your date and replies to your questions. Once you confirm their replies, you pay a 25% advance, and every service is booked separately.'],
    [/fee|commission|platform/, 'The ShaadiKart platform fee is 0.5% of your total cart value plus 18% GST. It is charged once, with your first payment, and is not refundable.'],
    [/pay|upi|card|emi|net ?bank|neft|rtgs|cash/, 'You can pay by UPI (up to ₹1,00,000 per payment; larger amounts are split), net banking or card (up to ₹5,00,000), card EMI, or bank transfer (NEFT or RTGS) for big amounts. Cash is for small balances paid to the partner.'],
    [/cancel|refund/, 'You can cancel one service without cancelling the others. Refunds follow each partner\'s policy and return to your original payment method in 5 to 7 working days. Track them under My Bookings, Refund tracker.'],
    [/resched|new date|change.*date/, 'Open My Bookings, then Reschedule. Each partner accepts the new date separately, and your current date stays until they all do.'],
    [/care|medical|emergency|doctor|ambulance/, 'ShaadiKart Care gives you free priority medical help on your wedding day for every booking: an on-call doctor and ambulance coordination to your venue.'],
    [/plate|veg|menu|food|cater|standard|premium/, 'Venues and caterers are priced per plate, with separate veg and non-veg rates. Packages come as Standard, Premium and Premium Plus. Open a partner to see every food type in each package.'],
    [/room|stay|hotel|accommodat/, 'Venue pages list their rooms, room types, rate per night and check-in and check-out times. Add your room needs in the questions box before you send your request.'],
    [/pandit|kundli|astro|muhurat|mandir|temple|arya/, 'Find Pandit Ji, Kundli matching, astrology and muhurat under Pandit Ji & Spiritual. The Mandir page lists real Arya Samaj Mandirs with their sources. They are public information and cannot be booked here yet.'],
    [/kitty/, 'Kitty Party Packages are priced per package for a stated number of guests (for example up to 15, 25 or 40) and include the lounge, snacks, games and decor.'],
    [/haldi|mehendi|mehndi|henna/, 'Haldi & Mehendi has haldi decor and setups plus mehendi artists. Open any partner to see their past work.'],
    [/verified/, 'ShaadiKart Verified marks partners we check before they appear on ShaadiKart (demo wording for this concept).'],
    [/human|agent|support|complain|dispute|help|talk/, 'Of course. You can raise a ticket under My Bookings, Support, or use Help, Contact us, and our team will get back to you.']
  ];
  const CHAT_CHIPS = ['How booking works', 'Platform fee', 'Payment options', 'Cancel one service', 'ShaadiKart Care', 'Menus and per plate', 'Talk to support'];
  let CHAT = null;
  const chatReply = t => { const hit = CHAT_KB.find(([re]) => re.test(t.toLowerCase())); return hit ? hit[1] : 'I am a demo assistant, so I may not know that one yet. I can help with booking, fees, payments, cancellations, menus, rooms and ShaadiKart Care, or you can raise a ticket for the team.'; };
  function chatRender() {
    const root = $('#chat-root'), fab = $('#chat-fab');
    if (!CHAT || !CHAT.open) { root.innerHTML = ''; fab.hidden = false; return; }
    fab.hidden = true;
    const last = CHAT.msgs[CHAT.msgs.length - 1];
    root.innerHTML = `<div class="chat" role="dialog" aria-label="ShaadiKart Assistant">
      <div class="chat-h"><span class="chat-av">${ic('message')}</span><div><b>ShaadiKart Assistant</b><small>Demo assistant · replies instantly</small></div><button class="x-btn" data-act="chat-close" aria-label="Close chat">${ic('x')}</button></div>
      <div class="chat-b" id="chat-b">${CHAT.msgs.map(m => `<div class="cm ${m.f}">${esc(m.t)}</div>`).join('')}</div>
      <div class="chat-chips">${CHAT_CHIPS.map(c => `<button class="chip" data-act="chat-q" data-q="${esc(c)}">${esc(c)}</button>`).join('')}${last && last.f === 'bot' && /ticket/.test(last.t) ? `<a class="chip on" href="#/bookings/_/support">Go to Support</a>` : ''}</div>
      <form class="chat-f" data-form="chat"><input name="m" placeholder="Ask about booking, fees, payments…" autocomplete="off" aria-label="Your message"><button class="btn btn-primary btn-sm" type="submit">Send</button></form></div>`;
    const b = $('#chat-b'); b.scrollTop = b.scrollHeight;
  }
  function chatOpen() {
    if (!CHAT) CHAT = { open: true, msgs: [{ f: 'bot', t: 'Namaste! I am the ShaadiKart assistant. Ask me about booking, fees, payments, menus, rooms or cancellations, or pick a topic below.' }] };
    CHAT.open = true; chatRender(); const i = $('#chat-root input'); if (i) i.focus();
  }
  function chatSend(t) {
    if (!t.trim()) return;
    CHAT.msgs.push({ f: 'me', t: t.trim() }); chatRender();
    setTimeout(() => { CHAT.msgs.push({ f: 'bot', t: chatReply(t) }); chatRender(); const i = $('#chat-root input'); if (i) i.focus(); }, 350);
  }

  /* ---------- UI primitives ---------- */
  function toast(msg, icon = 'check') {
    const t = document.createElement('div');
    t.className = 'toast'; t.innerHTML = ic(icon) + '<span>' + esc(msg) + '</span>';
    $('#toast-root').appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
  function openModal(title, body, opts = {}) {
    $('#modal-root').innerHTML = `<div class="modal-bg${opts.still ? ' still' : ''}" data-act="modal-bg"><div class="modal${opts.wide ? ' modal-wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-h"><h3>${esc(title)}</h3>${opts.noClose ? '' : `<button class="x-btn" data-act="close-modal" aria-label="Close">${ic('x')}</button>`}</div>
      <div class="modal-b">${body}</div></div></div>`;
    const f = $('#modal-root input, #modal-root select, #modal-root button.btn');
    if (f && !opts.still) f.focus();
  }
  const closeModal = () => { $('#modal-root').innerHTML = ''; closeLayer(); };

  /* ---------- routing ---------- */
  // Routes are plain hash names ("#cart", "#partner--royal-banquet") so links survive the artifact viewer.
  // Templates still write "#/a/b?x=1"; go() converts it and keeps the query in memory.
  let curQ = new URLSearchParams(), nextQ = null;
  function toHash(h) {
    const [p, qs] = h.replace(/^#\/?/, '').split('?');
    return ['#' + (p.split('/').filter(Boolean).join('--') || 'home'), new URLSearchParams(qs || '')];
  }
  function route() {
    const h = location.hash.replace(/^#/, '');
    const parts = h === 'home' ? [] : h.split('--').filter(Boolean);
    return { parts, q: curQ, path: h };
  }
  const go = h => {
    const [hash, q] = toHash(h);
    if (location.hash === hash) { curQ = q; render(); } else { nextQ = q; location.hash = hash; }
  };

  /* ---------- header / footer / tabbar ---------- */
  function header() {
    const r = route(); const p0 = r.parts[0] || '';
    const wish = S.cart.saved.length;
    const who = S.user ? esc(S.user.name.split(' ')[0]) : S.partner ? esc(partner(S.partner.id).name) : S.staff ? 'Concierge' : 'Login / Sign Up';
    const navA = (h, l, on) => `<a href="${h}" class="${on ? 'on' : ''}">${l}</a>`;
    $('#site-header').className = p0 === '' ? 'over' : '';
    $('#site-header').innerHTML = `<div class="wrap hdr">
      <a href="#/" class="brand" aria-label="ShaadiKart home">${logo(true)}<small>${esc(B.tagline)}</small></a>
      <label class="loc">${ic('pin')}<span class="sr-only">Location</span>
        <select data-change="locality" aria-label="Location">
          ${D.LOCALITIES.map(l => `<option ${S.locality === l ? 'selected' : ''}>${l === 'Delhi' ? 'New Delhi' : l}</option>`).join('')}
          <option disabled>Mumbai · coming soon</option><option disabled>Jaipur · coming soon</option>
        </select></label>
      <nav class="nav" aria-label="Main">
        ${navA('#/', 'Home', p0 === '')}
        <div class="dd"><button class="${['category', 'categories'].includes(p0) ? 'on' : ''}" data-act="dd" aria-haspopup="true">Categories ${ic('chevronDown')}</button>
          <div class="dd-menu" hidden>${D.CATEGORIES.map(c => `<a href="#/category/${c.id}">${ic(c.icon)}${esc(c.name)}</a>`).join('')}<a href="#/categories" class="dd-all">View all categories ${ic('arrowRight')}</a></div></div>
        ${navA('#/partners', 'Our Partners', p0 === 'partners' || p0 === 'partner')}
        ${navA('#/offers', 'Offers', p0 === 'offers')}
        <a href="#/about" class="about-pill ${p0 === 'about' ? 'on' : ''}">About Us</a>
        <div class="dd"><button data-act="dd" aria-haspopup="true">Help ${ic('chevronDown')}</button>
          <div class="dd-menu dd-right" hidden>
            <button data-act="chat">${ic('message')}Chat with us</button><button data-act="journey">${ic('list')}How it works</button>
            <button data-act="policy">${ic('undo')}Cancellation &amp; refunds</button>
            <a href="#/bookings/_/support">${ic('message')}Raise a complaint</a>
            <button data-act="contact">${ic('phone')}Contact us</button>
          </div></div>
      </nav>
      <div class="hicons">
        <button class="hic" data-act="search-modal" aria-label="Search">${ic('search')}</button>
        <a class="hic" href="#/wishlist" aria-label="Wishlist, ${wish} items">${ic('heart')}${wish ? `<span class="badge-count">${wish}</span>` : ''}</a>
        <a class="hic" href="#/cart" aria-label="Cart, ${cartCount()} items">${ic('cart')}${cartCount() ? `<span class="badge-count">${cartCount()}</span>` : ''}</a>
        <button class="login-btn" data-act="account"><span class="av">${ic('user')}</span><span class="lbl">${who}</span></button>
        <button class="hic burger" data-act="menu" aria-label="Menu">${ic('menu')}</button>
      </div></div>`;
    $('#tabbar').innerHTML = [['#/', 'home', 'Home', p0 === ''], ['#/cart', 'cart', 'Cart', p0 === 'cart'], ['#/bookings', 'calendarCheck', 'Bookings', p0 === 'bookings' || p0 === 'checkout'], ['', 'user', S.user || S.partner ? 'Profile' : 'Login', false]]
      .map(([h, i, l, on]) => h ? `<a href="${h}" class="${on ? 'on' : ''}">${ic(i)}${l}${i === 'cart' && cartCount() ? `<span class="badge-count">${cartCount()}</span>` : ''}</a>` : `<a href="#" data-act="account">${ic(i)}${l}</a>`).join('');
  }
  function footer() {
    $('#site-footer').innerHTML = `<div class="wrap foot">
      <div>${logo(true)}<p style="margin:10px 0 0;font-size:13.5px">${esc(B.tagline)}</p><div class="script">One Platform. Every Event. One Cart.</div></div>
      <div><h4>Explore</h4>${D.CATEGORIES.slice(0, 5).map(c => `<a href="#/category/${c.id}">${esc(c.name)}</a>`).join('')}<a href="#/categories">All categories</a></div>
      <div><h4>Your event</h4><a href="#/cart">My Cart</a><a href="#/wishlist">Wishlist</a><a href="#/bookings">My Bookings</a><a href="#/bookings/_/refunds">Refund tracker</a><a href="#/bookings/_/support">Help &amp; support</a></div>
      <div><h4>ShaadiKart</h4><a href="#/about">About Us</a><a href="#/partners">Our Partners</a><a href="#/offers">Offers</a><button data-act="partner-login">Partner login</button><button data-act="staff-login">Staff login</button><button data-act="reset">Reset demo data</button></div>
    </div><div class="foot-bottom">© 2026 ShaadiKart (working name) · Concept demo with illustrative partners, prices and payments · Photos from Unsplash</div>`;
  }

  /* ---------- phone mockups ---------- */
  const scrTabs = on => `<div class="scr-tabs">${[['home', 'Home'], ['cart', 'Cart'], ['calendarCheck', 'Bookings'], ['user', 'Profile']].map(([i, l], k) => `<div class="${k === on ? 'on' : ''}">${ic(i)}${l}</div>`).join('')}</div>`;
  const phoneHome = () => `<div class="screen"><div class="scr-body">
      <div class="scr-top">${logo()}<div class="scr-loc">${ic('pin')} New Delhi</div></div>
      <div class="scr-search">${ic('search')} Search venues, decorators…</div>
      <div class="scr-banner" ${bg(D.PHOTOS.hero, 500)}><span>Dream Wedding<br>Made Easy</span><span class="mini-btn">Book Now →</span></div>
      <div class="scr-h">What are you planning?</div>
      <div class="scr-events">${['Wedding', 'Birthday', 'Corporate'].map(e => `<div><span ${bg(D.PHOTOS.events[e], 200)}></span>${e}</div>`).join('')}</div>
      <div class="scr-h">Popular Categories</div>
      <div class="scr-cats">${D.CATEGORIES.slice(0, 4).map(c => `<div>${ic(c.icon)}${esc(c.short.split(' ')[0])}</div>`).join('')}</div>
    </div>${scrTabs(0)}</div>`;
  const phoneCart = () => `<div class="screen"><div class="scr-body">
      <div class="scr-h" style="font-size:12px">← My Wedding Cart <span style="color:var(--muted);font-weight:400">· 6 items</span></div>
      ${[['Marriage Hall', 150000, 1], ['Decoration', 65000, 1], ['Photography', 45000, 1], ['Catering (300 Guests)', 120000, 1], ['DJ & Sound', 18000, 0], ['Bridal Makeup', 15000, 0]].map(([n, p, ok]) => `<div class="scr-cart-row"><span class="ck ${ok ? '' : 'off'}">${ok ? ic('check') : ''}</span><div><b>${n}</b>${inr(p)}</div></div>`).join('')}
      <div class="scr-total"><span>Estimated Total</span><span>${inr(413000)}</span></div>
      <div class="scr-pay">Send Requests</div>
    </div>${scrTabs(1)}</div>`;
  const phoneDone = () => `<div class="screen"><div class="scr-body"><div class="scr-done">
      <div class="big-ck">${ic('check')}</div><h4>Booking Confirmed!</h4><div style="color:var(--muted)">Your event is all set</div>
      <div class="chip" style="font-size:10px;padding:4px 10px">View Details</div>
      <div style="font-size:34px;margin-top:6px" aria-hidden="true">🥂</div>
    </div></div>${scrTabs(2)}</div>`;

  /* ---------- partner card ---------- */
  const heartBtn = vid => `<button class="heart ${isWished(vid) ? 'on' : ''}" data-act="wish" data-vid="${vid}" aria-label="${isWished(vid) ? 'Remove from wishlist' : 'Add to wishlist'}" aria-pressed="${isWished(vid)}">${ic('heart')}</button>`;

  function vcard(v) {
    const c = catOf(v.cat);
    return `<article class="vcard">
      <div class="ph-wrap"><a href="#/partner/${v.id}" class="ph" ${bg(v.photos[0], 600)} aria-label="${esc(v.name)}"><span class="tag tag-green">${ic('shield')}ShaadiKart Verified</span></a>${heartBtn(v.id)}</div>
      <div class="body">
        <div class="meta"><span>${esc(c.short)}</span>·<span>${esc(v.area)}, ${esc(v.locality)}</span></div>
        <h3><a href="#/partner/${v.id}" style="color:inherit">${esc(v.name)}</a></h3>
        <div class="meta"><span class="stars">${ic('star')}${v.rating}</span><span>(${v.reviews} reviews)</span>${v.cap ? `<span>· ${ic('users2')} ${capLabel(v)}</span>` : ''}</div>
        <div class="price">${fromLabel(v)} ${offerTag(v)}</div>
        ${v.perPlate || v.vegOnly ? `<div class="meta">${dietTags(v)}</div>` : ''}
        <div class="vfoot">
          <label class="cmp-check"><input type="checkbox" data-change="compare" value="${v.id}" ${S.compare.includes(v.id) ? 'checked' : ''}> Compare</label>
          ${inCart(v.id) ? `<a class="btn btn-ghost btn-sm" href="#/cart">${ic('check')}In cart</a>` : `<a class="btn btn-primary btn-sm" href="#/partner/${v.id}">View</a>`}
        </div>
      </div></article>`;
  }
  const cmpBar = () => S.compare.length ? `<div class="cmp-bar no-print"><span>${S.compare.length} to compare</span><button class="link-btn" style="color:#cfc4ef" data-act="clear-compare">Clear</button><a class="btn btn-gold btn-sm" href="#/compare">${ic('scale')}Compare</a></div>` : '';

  /* ---------- pages ---------- */
  function pageHome() {
    const featured = ['royal-banquet', 'wedding-stories', 'phoolwari'].map(partner);
    const maxOff = Math.max(...D.PARTNERS.map(v => v.offer));
    return `
    <section class="hero2" ${bg(D.PHOTOS.hero, 1800)}>
      <div class="wrap hero2-in">
        <div class="hero2-copy">
          <h1>Dream Wedding<br>Made <span class="easy script">Easy</span><svg class="swash" viewBox="0 0 120 20" aria-hidden="true"><path d="M2 14 C 40 4, 80 4, 118 8" /></svg></h1>
          <p>Book Venues, Decor, Photographers, Catering &amp; More – <br>All in One Place!</p>
          <div class="hero-steps">
            <h2>Plan Your Event in <span class="script">4 Easy Steps</span></h2>
            <div class="hs-row">${PLAN_STEPS.map(([t, sub], i) => `<button class="s4" data-act="plan" data-step="${i + 1}"><span class="n">${i + 1}</span><span><b>${t}</b><small>${sub}</small></span></button>`).join('')}</div>
            <button class="btn btn-gold hs-cta" data-act="plan" data-step="1">Start Planning Now ${ic('arrowRight')}</button>
          </div>
        </div>
        <div class="hero2-script script">One Platform.<br>Every Event.<br>One Cart.</div>
      </div>
    </section>

    <section class="sheet"><div class="wrap">
      <div class="sec-h"><h2 class="pill-h">Popular Categories</h2><a class="view-all" href="#/categories">View All ${ic('arrowRight')}</a></div>
      <div class="pop-strip">${D.CATEGORIES.slice(0, 10).map(c => `<a class="pop" href="#/category/${c.id}"><span class="ph" ${bg(c.img, 400)}></span><span class="nm">${esc(c.name.replace('Food & Catering', 'Food & Catering'))}</span></a>`).join('')}</div>

      <div class="trio">
        <div class="tcard featp">
          <div class="tc-h"><h3>${ic('crown')}Featured Partners</h3><a class="view-all" href="#/partners">View All ${ic('arrowRight')}</a></div>
          <div class="fp-row">${featured.map(v => `<article class="fp">
            <div class="ph-wrap"><a class="ph" href="#/partner/${v.id}" ${bg(v.photos[0], 500)} aria-label="${esc(v.name)}"></a>${heartBtn(v.id)}</div>
            <a class="fp-b" href="#/partner/${v.id}"><b>${esc(v.name)}</b><span class="stars">${ic('star')}${v.rating} <small>(${v.reviews} reviews)</small></span><span class="fp-p">${inr(fromPrice(v))} ${v.perPlate ? 'per plate' : 'onwards'}</span></a></article>`).join('')}</div>
        </div>
        <div class="offer-card" ${bg(D.PHOTOS.couple, 900)}>
          <div class="oc-in">
            <div class="script oc-s">Special Offer</div>
            <div class="oc-t">Get Up to</div>
            <div class="oc-big">${maxOff}% OFF</div>
            <div class="oc-t">on Wedding Bookings</div>
            <a class="btn btn-gold" href="#/offers">Book Now ${ic('arrowRight')}</a>
          </div>
        </div>
        <div class="tcard whyc" id="why">
          <div class="tc-h"><h3>${ic('gem')}Why Choose ShaadiKart?</h3></div>
          <div class="why4">
            <div>${ic('shield')}<b>ShaadiKart Verified</b><span>Partners &amp; Reviews</span></div>
            <div>${ic('receipt')}<b>Transparent Pricing</b><span>No Hidden Charges</span></div>
            <a href="#/cart">${ic('cart')}<b>One Cart for</b><span>All Services</span></a>
            <a href="#/bookings/_/support">${ic('headset')}<b>24x7 Support</b><span>Always Here</span></a>
            <button class="why-care" data-act="care">${ic('medical')}<span><b>ShaadiKart Care</b> Free priority medical help on your wedding day</span></button>
          </div>
        </div>
      </div>
    </div></section>


`;
  }

  function pageAbout() {
    const mandala = `<svg class="mandala" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="60" cy="60" r="56"/><circle cx="60" cy="60" r="40"/><circle cx="60" cy="60" r="22"/>${Array.from({ length: 12 }, (_, i) => `<ellipse cx="60" cy="20" rx="7" ry="18" transform="rotate(${i * 30} 60 60)"/>`).join('')}</g></svg>`;
    const what = [
      ['cart', 'One Event, One Cart', 'Add a venue, décor, photographer, caterer, music, makeup and more to a single event cart and see one clear total.', 'saf'],
      ['receipt', 'Prices you can read', 'Venues and caterers are priced per plate, with veg and non-veg rates, so you can see the cost for your guest count at a glance. GST and our platform fee are shown up front.', 'ros'],
      ['shield', 'ShaadiKart Verified partners', 'Every partner you see carries the ShaadiKart Verified badge, so you know exactly who you are booking.', 'pur'],
      ['flame', 'Rituals and tradition', 'From Pandit Ji and Kundli matching to muhurat and mandir weddings, spiritual services sit right beside the rest of your plan.', 'gold'],
      ['medical', 'ShaadiKart Care', 'Free priority medical help on your wedding day for every booking, so the celebration stays a celebration.', 'ros'],
      ['calendarCheck', 'Booked partner by partner', 'Each partner confirms your date on their own. If one cannot make it, the rest of your booking carries on, and you can cancel or reschedule one service without touching the others.', 'saf']
    ];
    const steps = [['Tell us about your event', 'Date, guests, city and budget.'], ['Compare partners', 'See rates, ratings, artists and their work.'], ['Book partner by partner', 'Each one confirms your date before you pay.'], ['Celebrate', 'Track everything in one place, with support when you need it.']];
    const values = [['Clarity', 'No hidden charges and no jargon.'], ['Care', 'We look after the details, and after you.'], ['Respect for tradition', 'Every family does it differently, and we make room for that.'], ['Fair to partners', 'Clear terms and timely payments, so good partners grow with us.']];
    return `<section class="about-hero" ${bg('hero-mandap', 1800)}><div class="wrap about-hero-in">
        <span class="tag tag-gold">${ic('heart')}About ShaadiKart</span>
        <h1>Every shaadi is a story.<br><span class="script">We help you plan it in one place.</span></h1>
        <p>ShaadiKart brings venues, décor, photographers, caterers, Pandit Ji and more together in one cart, with clear prices and partners we stand behind.</p>
        <div class="about-cta"><button class="btn btn-gold" data-act="plan" data-step="1">Start Planning Now ${ic('arrowRight')}</button><a class="btn btn-ghost" href="#/partners">Meet our partners</a></div>
      </div></section>

      <section class="about-why"><div class="wrap about-two">
        <div><h2 class="about-h">Why we exist</h2>
          <p>Planning a wedding in India usually means dozens of phone calls, scattered Instagram pages and quotes that never quite match. Families spend weeks chasing dates, comparing prices that cannot be compared, and worrying about deposits.</p>
          <p>We started ShaadiKart to take that weight off. One place to discover, compare and book everything a celebration needs, with the warmth of a family planner and the clarity of a good app.</p>
          <p>We begin with weddings and grow to every milestone around them: engagements, birthdays, anniversaries and the rituals that make each one meaningful.</p></div>
        <div class="about-photo" ${bg(D.PHOTOS.couple, 900)} role="img" aria-label="A couple in wedding attire"><span class="script">One Platform. Every Event. One Cart.</span></div>
      </div></section>

      <section class="about-what"><div class="wrap"><h2 class="about-h center">What ShaadiKart gives you</h2>
        <div class="about-cards">${what.map(([i, t, x, tone]) => `<article class="about-card ${tone}"><span class="ac-ic">${ic(i)}</span><h3>${t}</h3><p>${x}</p>${mandala}</article>`).join('')}</div></div></section>

      <section class="about-how"><div class="wrap"><h2 class="about-h center">How it works</h2>
        <ol class="about-steps">${steps.map(([t, x], i) => `<li><span class="n">${i + 1}</span><b>${t}</b><small>${x}</small></li>`).join('')}</ol></div></section>

      <section class="about-values"><div class="wrap"><h2 class="about-h center light">What we stand for</h2>
        <div class="about-vals">${values.map(([t, x]) => `<div><b>${t}</b><span>${x}</span></div>`).join('')}</div></div></section>

      <section class="about-where"><div class="wrap about-two">
        <div><h2 class="about-h">Where we are</h2>
          <p>We are starting in Delhi NCR: New Delhi, Gurugram, Noida, Ghaziabad and Faridabad. After that, city by city, only as fast as we can keep quality high.</p>
          <div class="about-cities">${['New Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'].map(c => `<span class="chip on">${ic('pin')}${c}</span>`).join('')}${['Jaipur', 'Mumbai', 'Pune'].map(c => `<span class="chip">${c} · soon</span>`).join('')}</div></div>
        <div class="about-partner"><h3>Run a venue, studio, kitchen or mandap?</h3><p>ShaadiKart brings you customers who are ready to book, simple tools to manage requests, and clear terms.</p><button class="btn btn-gold" data-act="partner-login">${ic('store')}Partner login</button></div>
      </div></section>

      <div class="wrap"><p class="note about-note">${ic('info')}<span>ShaadiKart is a concept demo. Partners, prices and ratings shown on this site are illustrative.</span></p></div>`;
  }

  function pageMandir() {
    const M = D.MANDIRS, C = D.MANDIR_COST;
    const src = list => list.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)} ${ic('external')}</a>`).join(' · ');
    return `<section class="cat-banner" ${bg('photo-1774024051976-7b5a15542a05', 1600)}><div class="wrap">
      <div class="crumbs"><a href="#/">Home</a>${ic('chevronRight')}<a href="#/category/spiritual">Pandit Ji &amp; Spiritual</a>${ic('chevronRight')}<span>Mandir weddings</span></div>
      <h1>Arya Samaj Mandir weddings</h1>
      <div>Simple Vedic weddings at real temples in Delhi · public information, checked ${esc(D.MANDIR_CHECKED)}</div>
    </div></section>
    <div class="wrap">
      <div class="mandir-top">
        <div class="box mandir-cost"><span class="tag tag-gold">${ic('receipt')}Typical cost</span><b>${esc(C.range)}</b><p>${esc(C.note)}</p><small>Sources: ${src(C.sources)}</small></div>
        <div class="box mandir-cta"><b>Need a Pandit Ji, samagri or a photographer for the mandir wedding?</b><p>Book ShaadiKart Verified partners and keep everything in one cart.</p><a class="btn btn-primary btn-sm" href="#/category/spiritual">Pandit Ji &amp; Spiritual ${ic('arrowRight')}</a></div>
      </div>
      <div class="callout gold" style="margin:4px 0 16px">${ic('info')}<span><b>Public info, not a ShaadiKart partner.</b> These temples are not yet onboarded, so they are not ShaadiKart Verified and cannot be booked here. Contact the temple directly, confirm the fee, the documents needed and government marriage registration (separate from the mandir certificate).</span></div>
      <div class="mandir-grid">${M.map(m => `<article class="mandir">
        <div class="mandir-h">${ic('temple')}<div><h3>${esc(m.name)}</h3><span>${esc(m.area)}</span><div>${m.weddings === 'yes' ? `<span class="tag tag-green">${ic('check')}Listed for weddings</span>` : `<span class="tag tag-amber">${ic('info')}Ask about weddings</span>`}</div></div></div>
        <p class="mandir-addr">${ic('pin')}<span>${esc(m.address)}</span></p>
        <ul>${m.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        <small class="mandir-src">Source: ${src(m.sources)} · checked ${esc(D.MANDIR_CHECKED)}</small>
      </article>`).join('')}</div>
      <p class="note" style="margin:16px 0 40px">${ic('alert')}<span>Not listed yet: Gurugram, Noida, Ghaziabad and Faridabad. We found no reliable public source for these, so we left them out rather than guess. Many websites named "Arya Samaj Mandir" are marriage agents, not the temples themselves.</span></p>
    </div>`;
  }

  function pageCategories() {
    return `<div class="wrap"><div class="page-h"><h1>${ic('menu')} All categories</h1><p>${D.CATEGORIES.length} categories · ShaadiKart Verified partners in Delhi NCR</p></div>
      <div class="cat-grid cat-grid-lg">${D.CATEGORIES.map(c => `<a class="cat-tile" href="#/category/${c.id}"><div class="ph" ${bg(c.img, 500)}></div><span>${esc(c.name)}<small>${D.PARTNERS.filter(v => v.cat === c.id).length} partners · ${esc(c.subs.slice(0, 2).join(', '))}</small></span></a>`).join('')}</div></div>`;
  }

  function pagePartners(q) {
    const cat = q.get('cat') || '';
    const list = D.PARTNERS.filter(v => !cat || v.cat === cat).sort((a, b) => b.rating - a.rating);
    return `<div class="wrap"><div class="page-h"><h1>${ic('store')} Our Partners</h1><p>${list.length} ShaadiKart Verified partners across Delhi NCR · illustrative profiles</p></div>
      <div class="filters"><div class="cat-strip"><a class="chip ${cat ? '' : 'on'}" href="#/partners">All</a>${D.CATEGORIES.map(c => `<a class="chip ${cat === c.id ? 'on' : ''}" href="#/partners?cat=${c.id}">${ic(c.icon)}${esc(c.short)}</a>`).join('')}</div></div>
      <div class="partner-grid" style="margin-bottom:40px">${list.map(vcard).join('')}</div></div>${cmpBar()}`;
  }

  function pageOffers() {
    const list = D.PARTNERS.filter(v => v.offer).sort((a, b) => b.offer - a.offer);
    return `<div class="wrap"><div class="page-h"><h1>${ic('sparkles')} Offers</h1><p>Launch offers from partners in Delhi NCR. The discount is applied automatically in your cart.</p></div>
      <div class="callout gold" style="margin:14px 0 20px">${ic('gift')}<span>Partner discounts apply automatically in your cart. A ShaadiKart platform fee of <b>0.5% of your total cart value + 18% GST</b> is charged once per booking. Offers are illustrative for this demo.</span></div>
      <div class="partner-grid" style="margin-bottom:40px">${list.map(vcard).join('')}</div></div>${cmpBar()}`;
  }

  function pageWishlist() {
    const list = S.cart.saved.map(s => partner(s.partnerId)).filter(Boolean);
    return `<div class="wrap"><div class="page-h"><h1>${ic('heart')} Wishlist</h1><p>Partners you saved. Tap the heart on any partner to add or remove it.</p></div>
      ${list.length ? `<div class="partner-grid" style="margin-bottom:40px">${list.map(vcard).join('')}</div>` : `<div class="empty">${ic('heart')}<p>Your wishlist is empty.</p><a class="btn btn-primary" href="#/partners">Browse partners</a></div>`}</div>`;
  }

  function pagePartnerDashboard() {
    if (!S.partner) return `<div class="wrap"><div class="empty" style="padding:70px 20px">${ic('store')}<h2 style="color:var(--plum-900);margin:0 0 6px">Partner login</h2><p>Log in as a partner to see booking requests for your business.</p><button class="btn btn-primary" data-act="partner-login">Partner login</button></div></div>`;
    const v = partner(S.partner.id), c = catOf(v.cat);
    const rows = [];
    S.events.forEach(ev => ev.services.filter(s => s.partnerId === v.id && !s.removed).forEach(s => rows.push({ ev, s, st: svcStatus(s) })));
    const booked = rows.filter(r => ['booked', 'paid', 'confirmed'].includes(r.st));
    const earned = rows.reduce((a, r) => a + r.s.paid, 0);
    return `<div class="wrap">
      <div class="page-h"><h1>${ic('store')} Partner dashboard</h1><p>${esc(v.name)} · ${esc(c.name)} · ${esc(v.area)}, ${esc(v.locality)} <span class="tag tag-amber">Demo</span></p></div>
      <div class="ev-stats pd-stats">
        <div><small>Enquiries this month</small><b>${48 + rows.length}</b></div>
        <div><small>Confirmed bookings</small><b>${12 + booked.length}</b></div>
        <div><small>Received via ShaadiKart</small><b>${inr(380000 + earned)}</b></div>
        <div><small>Profile rating</small><b>★ ${v.rating}</b></div>
      </div>
      <div class="box" style="margin-top:18px"><h2>Booking requests from ShaadiKart customers</h2>
        ${rows.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Event</th><th>Date</th><th>Package</th><th class="r">Amount</th><th class="r">Paid</th><th>Status</th></tr></thead><tbody>
          ${rows.map(({ ev, s, st }) => `<tr><td><b>${esc(ev.name)}</b><br><small>${ev.guests} guests · ${esc(ev.locality)}</small></td><td>${fmtDate(svcDate(ev, s))}</td><td>${pkgOf(v, s.pkg).name}</td><td class="r">${inr(svcTotal(s))}</td><td class="r">${inr(s.paid)}</td><td>${statusTag(st)}</td></tr>`).join('')}
        </tbody></table></div>` : `<div class="empty" style="padding:26px">${ic('calendarCheck')}<p>No requests yet. Book ${esc(v.name)} as a customer to see one arrive here.</p></div>`}
      </div>
      <div class="box"><h2>Partner tools</h2><div class="filters" style="margin:0">${['Calendar & availability', 'Quotations', 'Payouts', 'Promotions', 'KYC documents', 'Reviews'].map(t => `<span class="chip">${esc(t)} <span class="tag tag-gold">Phase 2</span></span>`).join('')}</div></div>
      <div style="margin:0 0 40px"><a class="btn btn-ghost" href="#/partner/${v.id}">View my public profile</a></div>
    </div>`;
  }

  function pageCategory(id, q) {
    const c = catOf(id);
    if (!c) return notFound();
    const loc = q.get('loc') || '';
    const sort = q.get('sort') || 'rating';
    let list = D.PARTNERS.filter(v => v.cat === id && (!loc || v.locality === loc));
    list.sort(sort === 'low' ? (a, b) => a.base - b.base : sort === 'high' ? (a, b) => b.base - a.base : (a, b) => b.rating - a.rating);
    const link = (k, val) => { const p = new URLSearchParams(q); val ? p.set(k, val) : p.delete(k); return `#/category/${id}?${p}`; };
    return `
    <section class="cat-banner" ${bg(c.img, 1600)}><div class="wrap">
      <div class="crumbs"><a href="#/">Home</a>${ic('chevronRight')}<span>${esc(c.name)}</span></div>
      <h1>${esc(c.name)}</h1>
      <div>Planning: <b>${esc(S.cart.event.type)}</b> · ${list.length} ShaadiKart Verified partners in Delhi NCR</div>
      <div class="chips">${c.subs.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    </div></section>
    <div class="wrap">
      <div class="filters">
        <div class="cat-strip">${D.CATEGORIES.map(x => `<a class="chip ${x.id === id ? 'on' : ''}" href="#/category/${x.id}">${ic(x.icon)}${esc(x.short)}</a>`).join('')}</div>
      </div>
      <div class="filters">
        <select class="select" data-change="nav" aria-label="Locality"><option value="${link('loc', '')}">All of Delhi NCR</option>${D.LOCALITIES.map(l => `<option value="${link('loc', l)}" ${loc === l ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <select class="select" data-change="nav" aria-label="Sort"><option value="${link('sort', 'rating')}">Top rated</option><option value="${link('sort', 'low')}" ${sort === 'low' ? 'selected' : ''}>Price: low to high</option><option value="${link('sort', 'high')}" ${sort === 'high' ? 'selected' : ''}>Price: high to low</option></select>
      </div>
      ${id === 'spiritual' ? `<a class="mandir-banner" href="#/mandir" ${bg('photo-1774024050561-4ee0148c8526', 900)}><span class="mb-in"><span class="tag tag-gold">${ic('temple')}Mandir weddings</span><b>Arya Samaj Mandirs near you</b><span>Real temples in Delhi · typical fee ${D.MANDIR_COST.range}</span><span class="btn btn-gold btn-sm">View temples ${ic('arrowRight')}</span></span></a>` : ''}
      ${list.length ? `<div class="partner-grid">${list.map(vcard).join('')}</div>` : `<div class="empty">${ic('search')}<p>No partners in ${esc(loc)} yet for this category.</p><a class="btn btn-ghost" href="#/category/${id}">Show all Delhi NCR</a></div>`}
    </div>${cmpBar()}`;
  }

  function pageSearch(q) {
    const term = (q.get('q') || '').trim().toLowerCase(), loc = q.get('loc') || '';
    const list = D.PARTNERS.filter(v => (!loc || v.locality === loc) && (!term || [v.name, catOf(v.cat).name, catOf(v.cat).subs.join(' '), v.area, v.locality].join(' ').toLowerCase().includes(term)));
    return `<div class="wrap"><div class="page-h"><h1>${ic('search')} ${term ? `Results for “${esc(term)}”` : 'All partners'}</h1><p>${list.length} partners found${loc ? ` in ${esc(loc)}` : ' in Delhi NCR'} · event date ${fmtDate(S.cart.event.date)}</p></div>
      ${list.length ? `<div class="partner-grid" style="margin-bottom:40px">${list.map(vcard).join('')}</div>` : `<div class="empty">${ic('search')}<p>Nothing matched. Try “banquet”, “mehendi” or “Gurugram”.</p></div>`}
    </div>${cmpBar()}`;
  }

  const setsHtml = v => !v.sets ? '' : `<div class="psets" data-sets>
    <div class="ps-tabs" role="tablist">${v.sets.map((x, i) => `<button type="button" role="tab" class="${i ? '' : 'on'}" data-act="pset" data-i="${i}">${esc(x.label)}</button>`).join('')}</div>
    ${v.sets.map((x, i) => `<div class="ps-panel" data-p="${i}" ${i ? 'hidden' : ''}><p class="ps-note"><b>${esc(x.title)}.</b> ${esc(x.note)}</p><div class="ps-grid">${x.photos.map(p => `<figure ${bg(p, 600)} role="img" aria-label="${esc(v.name + ', ' + x.title)}"><span class="ps-badge">${ic('shield')}ShaadiKart Verified</span></figure>`).join('')}</div></div>`).join('')}
    <p class="note">${ic('info')}<span>Photos supplied by the partner and verified by ShaadiKart (${esc(v.setsVerified)}). Stock images stand in for them in this concept demo.</span></p></div>`;
  function pagePartner(id) {
    const v = partner(id);
    if (!v) return notFound();
    const c = catOf(v.cat);
    const item = inCart(v.id);
    const sel = item ? item.pkg : 'silver', diet = item && item.diet ? item.diet : 'veg';
    const tiers = D.POLICY[v.cat] || D.POLICY.default;
    const g = S.cart.event.guests;
    return `<div class="wrap">
      <div class="crumbs" style="margin-top:18px;color:var(--muted)"><a href="#/">Home</a>${ic('chevronRight')}<a href="#/category/${c.id}">${esc(c.name)}</a>${ic('chevronRight')}<span>${esc(v.name)}</span></div>
      <div class="v-gallery">${v.photos.map(p => `<div ${bg(p, 1000)} role="img" aria-label="${esc(v.name)} photo"></div>`).join('')}</div>
      <div class="v-layout">
        <div>
          <div class="v-head">
            <span class="tag tag-plum">${ic(c.icon)}${esc(c.name)}</span>
            <h1>${esc(v.name)}</h1>
            <div class="meta"><span>${ic('pin')} ${esc(v.area)}, ${esc(v.locality)}</span><span class="stars">${ic('star')}${v.rating}</span><span>${v.reviews} reviews</span><span class="tag tag-green">${ic('shield')}ShaadiKart Verified</span></div>
            ${v.perPlate || v.vegOnly ? `<div class="meta" style="margin-top:8px">${v.cap ? `<span class="tag tag-plum">${ic('users2')}${v.kind} · ${capLabel(v)}</span>` : ''}${dietTags(v)}</div>` : ''}
          </div>
          <div class="box" style="margin-top:18px"><h2>About</h2>
            <p style="margin:0;color:#3c3358">${esc(v.name)} is a ${esc(c.name.toLowerCase())} partner in ${esc(v.area)}, ${esc(v.locality)}. Typical response time is about ${v.responseHrs} hours. ${v.perPlate ? `Prices are <b>per plate</b>${v.cat === 'venues' ? ' and include the hall and in-house food' : ''}; your total is the per-plate rate × your guest count.` : `Prices below are starting packages (${esc(v.unit)}).`} The final quote is confirmed by the partner for your date and guest count.</p>
            ${v.cat === 'venues' ? `<div class="soon" style="margin-top:14px">${ic('rotate3d')}<span><b>360° venue tour</b> — coming soon</span></div>` : ''}
          </div>
          ${v.menu ? `<div class="box"><h2>${ic('utensils')} What is in each package</h2>${tierPick(v, PGTIER, diet, 'pg-tier')}${menuHtml(v, PGTIER, diet)}</div>` : ''}
          ${v.cat === 'venues' ? `<div class="box"><h2>${ic('home')} Rooms &amp; stay</h2>${roomsHtml(v)}</div>` : ''}
          ${v.sets ? `<div class="box"><h2>${ic('camera')} Verified photo sets</h2>${setsHtml(v)}</div>` : ''}
          <div class="box"><h2>Past work <small style="color:var(--muted);font-weight:400;font-size:13px">illustrative</small></h2>${historyHtml(v)}</div>
          <div class="box"><h2>Cancellation policy</h2>
            <div class="tbl-wrap"><table class="tbl"><thead><tr><th>When you cancel</th><th class="r">Refund of amount paid</th></tr></thead><tbody>
            ${tiers.map((t, i) => `<tr><td>${t.minDays ? `${t.minDays}+ days before the event` : `Less than ${tiers[i - 1].minDays} days before`}</td><td class="r"><b>${t.pct}%</b></td></tr>`).join('')}
            </tbody></table></div>
            <p class="note" style="margin-top:10px">${ic('info')}<span>Cancelling this service never cancels the other services in your event.</span></p>
          </div>
          <div class="box"><h2>ShaadiKart Verified reviews</h2>
            ${v.reviewList.map(r => `<div class="review"><div class="who">${esc(r.name)} <span class="stars">${ic('star')}${r.stars}.0</span><span class="tag tag-green">${ic('check')}Completed booking</span></div><p>${esc(r.text)}</p></div>`).join('')}
          </div>
        </div>
        <aside class="sticky">
          <form class="box" data-form="add-to-cart" data-vid="${v.id}">
            <div class="avail">${ic('calendarCheck')}<span><b>Owner-confirmed availability.</b> Calendar last updated ${v.confirmedAgo}h ago. Your date is confirmed by the partner after you send the request.</span></div>
            ${v.perPlate ? `<h3>Menu</h3><div class="diet-switch diet-form">${['veg', 'nonveg'].map(x => `<label class="${diet === x ? 'on' : ''}"><input type="radio" name="diet" value="${x}" ${diet === x ? 'checked' : ''} data-change="pp-calc">${dietDot(x)}${dietLabel(x)}</label>`).join('')}</div>` : ''}
            <h3>Choose a package</h3>
            ${v.packages.map(p => `<label class="pkg"><div class="row"><span><input type="radio" name="pkg" value="${p.id}" ${p.id === sel ? 'checked' : ''} data-change="pp-calc"> ${p.name}</span><span>${v.perPlate ? `<span class="pp-veg">${priceTag(v, p, 'veg')}</span>` : priceTag(v, p)}</span></div>${v.perPlate ? `<div class="pp-sub">${dietDot('nonveg')}Non-veg ${inr(unitPrice(v, p, 'nonveg'))} / plate</div>` : ''}<ul>${p.includes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></label>`).join('')}
            ${v.perPlate ? `<div class="pp-total" id="pp-total">${ppTotal(v, sel, diet, g)}</div>${capFits(v, g) ? '' : `<p class="note">${ic('alert')}<span>This ${esc(v.kind.toLowerCase())} fits up to ${v.cap[1]} guests; your event has ${g}.</span></p>`}` : ''}
            <div class="field" style="margin-top:14px">Event date<input type="date" name="date" value="${esc(S.cart.event.date)}" min="${isoPlus(1)}" required></div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:14px">
              <button class="btn btn-primary btn-block" type="submit">${ic('cart')}${item ? 'Update package in cart' : 'Add to event cart'}</button>
              <div style="display:flex;gap:8px">
                <button class="btn btn-ghost btn-sm" style="flex:1" type="button" data-act="toggle-compare" data-vid="${v.id}">${ic('scale')}${S.compare.includes(v.id) ? 'Remove compare' : 'Compare'}</button>
                <button class="btn btn-ghost btn-sm" style="flex:1" type="button" data-act="save-later" data-vid="${v.id}">${ic('bookmark')}Save for later</button>
              </div>
            </div>
            <p class="note" style="margin-top:12px">${ic('info')}<span>Request to book: you pay only after the partner confirms your date.</span></p>
          </form>
        </aside>
      </div></div>${cmpBar()}`;
  }

  function pageCompare() {
    const list = S.compare.map(partner).filter(Boolean);
    if (list.length < 2) return `<div class="wrap"><div class="page-h"><h1>${ic('scale')} Compare partners</h1></div><div class="empty">${ic('scale')}<p>Select at least 2 partners (up to 3) using the Compare checkbox.</p><a class="btn btn-primary" href="#/category/${list[0] ? list[0].cat : 'venues'}">Browse partners</a></div></div>`;
    const bestR = Math.max(...list.map(v => v.rating)), low = Math.min(...list.map(fromPrice)), fast = Math.min(...list.map(v => v.responseHrs));
    const row = (label, fn) => `<tr><th>${label}</th>${list.map(v => `<td>${fn(v)}</td>`).join('')}</tr>`;
    return `<div class="wrap"><div class="page-h"><h1>${ic('scale')} Compare partners</h1><p>Side by side. Highlights show the best value in each row.</p></div>
      <div class="tbl-wrap" style="border:0;margin:16px 0 40px"><table class="cmp-table">
        ${row('', v => `<div class="ph" ${bg(v.photos[0], 500)}></div><b>${esc(v.name)}</b><br><button class="link-btn danger" data-act="toggle-compare" data-vid="${v.id}">Remove</button>`)}
        ${row('Category', v => esc(catOf(v.cat).short))}
        ${row('Location', v => `${esc(v.area)}, ${esc(v.locality)}`)}
        ${row('Rating', v => `<span class="${v.rating === bestR ? 'best' : ''}">★ ${v.rating}</span> <small>(${v.reviews})</small>`)}
        ${row('Starting price', v => `<span class="${fromPrice(v) === low ? 'best' : ''}">${inr(fromPrice(v))}</span> <small>${esc(v.unit)}</small> ${offerTag(v)}`)}
        ${row('Packages', v => v.packages.map(p => `${p.name}: ${inr(offerPrice(v, p))}`).join('<br>'))}
        ${row('Response time', v => `<span class="${v.responseHrs === fast ? 'best' : ''}">~${v.responseHrs} hours</span>`)}
        ${row('Cancellation', v => `<small>${policyText(v.cat)}</small>`)}
        ${row('', v => inCart(v.id) ? `<span class="tag tag-green">${ic('check')}In cart</span>` : `<a class="btn btn-primary btn-sm" href="#/partner/${v.id}">Choose package</a>`)}
      </table></div></div>`;
  }

  function pageCart() {
    const ev = S.cart.event, lines = cartLines(), t = cartTotals();
    const pct = ev.budget ? Math.round(t.total / ev.budget * 100) : 0;
    const groups = D.CATEGORIES.map(c => [c, lines.filter(l => l.v.cat === c.id)]).filter(([, ls]) => ls.length);
    return `<div class="wrap">
      <div class="page-h"><h1>${ic('cart')} My ${esc(ev.type)} Cart</h1><p>${lines.length} item${lines.length === 1 ? '' : 's'} · one cart, each partner confirms separately</p></div>
      <div class="two-col">
        <div>
          <form class="box" data-form="event-details">
            <h2>Event details</h2>
            <div class="form-grid">
              <label class="field">Event type<select name="type">${D.EVENT_TYPES.map(x => `<option ${ev.type === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
              <label class="field">Event name<input name="name" value="${esc(ev.name)}" placeholder="e.g. Riya & Kabir Wedding"></label>
              <label class="field">Date<input type="date" name="date" value="${esc(ev.date)}" min="${isoPlus(1)}"></label>
              ${guestField(ev.type, ev.guests, ev.gc, '', 'name="guests"', true)}
              <label class="field">Locality<select name="locality">${D.LOCALITIES.map(x => `<option ${ev.locality === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
              <label class="field">Budget (₹)<input type="number" name="budget" min="0" step="5000" value="${ev.budget}"></label>
            </div>
          </form>
          <div class="box">
            <h2>Services in your cart</h2>
            ${lines.length ? groups.map(([c, ls]) => ls.map(l => `<div class="cart-item">
                <a class="ph" href="#/partner/${l.v.id}" ${bg(l.v.photos[0], 300)} aria-label="${esc(l.v.name)}"></a>
                <div><span class="tag tag-plum">${ic(c.icon)}${esc(c.short)}</span><h4>${esc(l.v.name)}</h4><div class="sub">${l.p.name} package · ${l.v.perPlate ? `${inr(l.unit)} per plate × ${S.cart.event.guests} guests` : esc(l.v.unit)} · ★ ${l.v.rating}</div>
                  ${l.v.perPlate ? `<label class="diet-pick">${dietDot(l.diet)}<select data-change="diet" data-vid="${l.v.id}" aria-label="Menu for ${esc(l.v.name)}"><option value="veg" ${l.diet === 'veg' ? 'selected' : ''}>Veg menu</option><option value="nonveg" ${l.diet === 'nonveg' ? 'selected' : ''}>Non-veg menu</option></select></label>${capFits(l.v, S.cart.event.guests) ? '' : `<span class="tag tag-red">${ic('alert')}Fits up to ${l.v.cap[1]} guests</span>`}` : ''}
                  <div style="display:flex;gap:14px;margin-top:4px"><a class="link-btn" href="#/partner/${l.v.id}">Change package</a><button class="link-btn" data-act="move-saved" data-vid="${l.v.id}">Save for later</button><button class="link-btn danger" data-act="remove-cart" data-vid="${l.v.id}">Remove</button></div></div>
                <div class="amt">${inr(l.price)}${l.v.offer ? `<div>${offerTag(l.v)}</div>` : ''}</div></div>`).join('')).join('')
              : `<div class="empty">${ic('cart')}<p>Your event cart is empty.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="#/category/venues">Browse venues</a><button class="btn btn-ghost" data-act="demo-cart">Fill sample wedding cart</button></div></div>`}
          </div>
          ${S.cart.saved.length ? `<div class="box"><h2>${ic('bookmark')} Saved for later</h2>${S.cart.saved.map(sv => { const v = partner(sv.partnerId); return `<div class="cart-item"><a class="ph" href="#/partner/${v.id}" ${bg(v.photos[0], 300)}></a><div><h4>${esc(v.name)}</h4><div class="sub">${esc(catOf(v.cat).short)} · from ${fromLabel(v)}</div><div style="display:flex;gap:14px;margin-top:4px"><button class="link-btn" data-act="saved-to-cart" data-vid="${v.id}">Move to cart</button><button class="link-btn danger" data-act="remove-saved" data-vid="${v.id}">Remove</button></div></div></div>`; }).join('')}</div>` : ''}
        </div>
        <aside class="sticky">
          <div class="box">
            <h3>${ic('wallet')} Smart budget</h3>
            <div class="sum-row"><span>Budget</span><b>${inr(ev.budget)}</b></div>
            <div class="meter ${pct > 100 ? 'over' : ''}"><i style="width:${Math.min(pct, 100)}%"></i></div>
            <div class="note">${pct > 100 ? `${ic('alert')}<span>${inr(t.total - ev.budget)} over budget. Try a Silver package or compare partners.</span>` : `${ic('info')}<span>${pct}% used · ${inr(Math.max(ev.budget - t.total, 0))} left for other services.</span>`}</div>
          </div>
          <div class="box">
            <h3>Price summary</h3>
            ${lines.map(l => `<div class="sum-row"><span>${esc(catOf(l.v.cat).short)} · ${esc(l.v.name)}</span><span>${inr(l.price)}</span></div>`).join('')}
            <div class="sum-row" style="border-top:1px solid var(--line);margin-top:6px;padding-top:10px"><span>Services subtotal</span><span>${inr(t.sub)}</span></div>
            <div class="sum-row"><span>GST on services (18%, illustrative)</span><span>${inr(t.gst)}</span></div>
            <div class="sum-row"><span>ShaadiKart platform fee (0.5%)</span><span>${lines.length ? inr(t.fee) : '—'}</span></div>
            <div class="sum-row"><span>GST on platform fee (18%)</span><span>${lines.length ? inr(t.feeGst) : '—'}</span></div>
            <div class="sum-row total"><span>Estimated total</span><span>${inr(lines.length ? t.total : 0)}</span></div>
            <div class="sum-row" style="color:var(--muted)"><span>Due after confirmation (25% advance + platform fee)</span><span>${inr(lines.length ? t.advance : 0)}</span></div>
            ${lines.length ? queryField(S.cart.query, 'cart') : ''}
            <button class="btn btn-primary btn-block" style="margin-top:12px" data-act="send-requests" ${lines.length ? '' : 'disabled'}>Send booking requests (${lines.length}) ${ic('arrowRight')}</button>
            ${lines.length ? `<button class="btn btn-ghost btn-block" style="margin-top:8px" data-act="wa-open"><span class="wa-dot"></span>Get my cart on WhatsApp</button>` : ''}
            <p class="note" style="margin-top:12px">${ic('shield')}<span>No payment now. Each partner confirms your date separately; if one can't, the rest of your booking still goes ahead.</span></p>
          </div>
        </aside>
      </div></div>`;
  }

  /* ---------- See My Event: Act 1 (The Space), Act 2 (Dressed for you) ---------- */
  const SME = { act: 1, tip: null, sweep: 0, dtip: null, time: 0 };
  const SME_LABEL = '<span class="sme-imp">Artist\u2019s impression, not a photograph of the booked setup</span>';
  const SME_ELEM = {
    'mandap': ['Mandap', 'The sacred centrepiece for the pheras, framed to the stage position.', 50, 42],
    'floral arch': ['Floral arch', 'A flower-framed entrance for the couple\u2019s walk in.', 50, 22],
    'aisle florals': ['Aisle florals', 'Petals and floral borders lining the walkway.', 50, 72],
    'drapes': ['Drapes', 'Soft fabric drapes on the side walls and stage backdrop.', 15, 40],
    'lighting glow': ['Lighting glow', 'Warm fairy lights and uplighting for the evening.', 85, 24]
  };
  const smeSvc = (ev, cat) => liveSvcs(ev).map(s => partner(s.partnerId)).find(p => p && p.cat === cat);
  const smeVenue = ev => smeSvc(ev, 'venues');
  const smeDecor = ev => smeSvc(ev, 'decor');
  function actOne(ev) {
    const v = smeVenue(ev);
    if (!v) return `<div class="sme-empty">${ic('info')}<p>Add a venue to your event to see the space.</p></div>`;
    const a = D.VENUE_ANCHORS[v.id], tz = a.tableZone, c = v.cap || [0, 0];
    const fits = ev.guests >= c[0] && ev.guests <= c[1];
    const spots = [
      { k: 'stage', x: a.stageX, y: a.stageY, t: 'Stage and mandap area', d: `${esc(a.kind)}. Your ceremony stage sits here.` },
      { k: 'seat', x: tz.x + tz.w / 2, y: tz.y + tz.h / 2, t: `Seating for ${ev.guests} guests`, d: `Capacity ${c[0]} to ${c[1]} guests. ${fits ? 'Your guest count fits comfortably.' : 'Your guest count is outside this range, so your host will suggest a layout.'}` },
      ...a.rooms.map((r, i) => ({ k: 'room' + i, x: r.x, y: r.y, t: r.name, d: 'Included with the venue for getting ready.' }))
    ];
    const tip = spots.find(s => s.k === SME.tip);
    return `<div class="sme-act1"><div class="sme-photo" ${bg(a.photo, 1200)} role="img" aria-label="${esc(v.name)}">${SME_LABEL}
      <span class="tz" style="left:${tz.x}%;top:${tz.y}%;width:${tz.w}%;height:${tz.h}%"></span>
      ${spots.map(s => `<button type="button" class="hotspot${s.k === SME.tip ? ' on' : ''}" style="left:${s.x}%;top:${s.y}%" data-act="sme-spot" data-k="${s.k}" aria-label="${esc(s.t)}"><i></i></button>`).join('')}</div>
      <div class="sme-tip" aria-live="polite">${tip ? `<b>${tip.t}</b><span>${tip.d}</span>` : `<span>Tap a dot to explore ${esc(v.name)}.</span>`}</div>
      <div class="sme-facts"><span class="tag tag-plum">${esc(a.kind)}</span><span class="tag tag-grey">Capacity ${c[0]} to ${c[1]}</span><span class="tag tag-grey">${ev.guests} guests</span></div></div>`;
  }
  function actTwo(ev) {
    const v = smeVenue(ev), dp = smeDecor(ev);
    if (!v) return `<div class="sme-empty">${ic('info')}<p>Add a venue to your event to see it dressed.</p></div>`;
    if (!dp) return `<div class="sme-empty">${ic('flower')}<p>Add a decor partner to see your venue dressed.</p><a class="btn btn-ghost btn-sm" href="#/category/decor">Browse decor</a></div>`;
    const a = D.VENUE_ANCHORS[v.id], pr = D.DECOR_PROFILES[dp.id], pal = pr.palette;
    const w = SME.sweep, tip = SME_ELEM[SME.dtip];
    return `<div class="sme-act2" style="--pa:${pal[0]};--pb:${pal[1]};--pc:${pal[2]}"><div class="sme-photo" ${bg(a.photo, 1200)} role="img" aria-label="${esc(v.name)} dressed by ${esc(dp.name)}">${SME_LABEL}
      <div class="decor-layer" id="sme-layer" style="background-image:url('${D.img(pr.overlayPhoto, 1200)}');clip-path:inset(0 ${100 - w}% 0 0)"></div>
      <span class="sweep-line" id="sme-line" style="left:${w}%"></span>
      <div class="decor-hs" id="sme-hs"${w < 55 ? ' hidden' : ''}>${pr.elements.map(k => `<button type="button" class="hotspot${k === SME.dtip ? ' on' : ''}" style="left:${SME_ELEM[k][2]}%;top:${SME_ELEM[k][3]}%" data-act="sme-elem" data-k="${k}" aria-label="${esc(SME_ELEM[k][0])}"><i></i></button>`).join('')}</div>
      <input type="range" class="sweep-slider" min="0" max="100" value="${w}" data-input="sme-sweep" aria-label="Reveal decoration"></div>
      <div class="sme-sweep-cap"><span>Your venue</span><span>With ${esc(dp.name)}</span></div>
      <div class="sme-tip" id="sme-dtip" aria-live="polite">${tip ? `<b>${tip[0]} by ${esc(dp.name)}</b><span>${tip[1]}</span>` : `<span>Drag the line to dress the space, then tap a dot for details.</span>`}</div>
      <div class="sme-pal">${pal.map(c => `<i style="background:${c}" title="${c}"></i>`).join('')}<span>${esc(dp.name)} palette</span></div></div>`;
  }
  /* Act 3: bird's-eye floor plan. Coordinates are in a 100 x 75 viewBox (4:3); tableZone is in photo percent. */
  function birdEyeLayout(guests, venue) {
    const a = D.VENUE_ANCHORS[venue.id], tz = a.tableZone, cap = venue.cap || [0, 0];
    const n = Math.max(1, Math.ceil(guests / 10));
    const zx = tz.x, zy = tz.y * 0.75, zw = tz.w, zh = tz.h * 0.75;
    const cols = Math.max(1, Math.ceil(Math.sqrt(n * zw / zh))), rows = Math.ceil(n / cols);
    const cw = zw / cols, ch = zh / rows, r = Math.min(cw, ch) * 0.3;
    const tables = [];
    for (let i = 0; i < n; i++) {
      const c = i % cols, rw = Math.floor(i / cols);
      tables.push({ cx: zx + cw * (c + 0.5), cy: zy + ch * (rw + 0.5), r, seats: Math.min(10, guests - i * 10) });
    }
    const overcrowded = !!cap[1] && guests > cap[1];
    return { tables, overcrowded, stage: { x: a.stageX, y: a.stageY * 0.75 }, zone: { x: zx, y: zy, w: zw, h: zh },
      note: overcrowded ? `${esc(venue.name)} comfortably seats up to ${cap[1]} guests. For ${guests}, your host will suggest a layout, a second hall or a staggered seating plan.` : '' };
  }
  const smePhase = t => t <= 33 ? 0 : t <= 66 ? 1 : 2;
  const SME_PHASE = ['Guests arriving', 'Ceremony', 'Dinner and celebration'];
  const hexMix = (a, b, f) => { const g = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)); const x = g(a), y = g(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * f).toString(16).padStart(2, '0')).join(''); };
  const skyAt = t => {
    const K = [['#8ec9f5', '#e3f3fc'], ['#f08a5d', '#fbd0a8'], ['#0f1b4d', '#34478a']];
    const seg = t < 50 ? 0 : 1, f = seg ? (t - 50) / 50 : t / 50;
    return [hexMix(K[seg][0], K[seg + 1][0], f), hexMix(K[seg][1], K[seg + 1][1], f)];
  };
  const smeSeated = (ev, t) => { const ph = smePhase(t); return ph === 0 ? Math.round(ev.guests * t / 33) : ph === 2 ? ev.guests : 0; };
  function silhouetteStrip(t) {
    const [top, bot] = skyAt(t), ph = smePhase(t);
    const stars = ph === 2 ? Array.from({ length: 18 }, (_, i) => `<i class="star" style="left:${(i * 37 + 11) % 97}%;top:${(i * 23 + 7) % 55}%;animation-delay:${(i % 6) * 0.4}s"></i>`).join('') : '';
    const fig = Array.from({ length: 14 }, (_, i) => `<svg class="sil" viewBox="0 0 20 44" style="left:${3 + i * 7}%;animation-delay:${(i % 5) * 0.35}s;height:${ph === 1 ? 62 : 54 + (i % 3) * 5}%"><circle cx="10" cy="7" r="5"/><path d="M3 44V24a7 7 0 0 1 7-7a7 7 0 0 1 7 7v20z"/></svg>`).join('');
    return `<div class="silhouette-strip" id="sme-strip" style="background:linear-gradient(${top},${bot})" role="img" aria-label="Eye-level view of guests, ${SME_PHASE[ph]}">${stars}${fig}</div>`;
  }
  function floorVis(ev, v, t) {
    const L = birdEyeLayout(ev.guests, v), ph = smePhase(t);
    let left = smeSeated(ev, t);
    const tbl = L.tables.map(tb => {
      const fill = Math.min(tb.seats, left); left -= fill;
      const dots = Array.from({ length: tb.seats }, (_, k) => { const an = k / tb.seats * Math.PI * 2 - Math.PI / 2, d = tb.r + Math.max(0.55, tb.r * 0.28);
        return `<circle class="fp-guest${k < fill ? ' on' : ''}" cx="${(tb.cx + Math.cos(an) * d).toFixed(2)}" cy="${(tb.cy + Math.sin(an) * d).toFixed(2)}" r="${Math.max(0.45, tb.r * 0.22).toFixed(2)}" style="animation-delay:${((k * 7 + Math.round(tb.cx)) % 10) * 0.2}s"/>`; }).join('');
      return `<g class="fp-table${L.overcrowded ? ' crowded' : ''}"><circle cx="${tb.cx.toFixed(2)}" cy="${tb.cy.toFixed(2)}" r="${tb.r.toFixed(2)}"/>${dots}</g>`;
    }).join('');
    let crowd = '';
    if (ph === 1) { const n = Math.min(ev.guests, 80), cols = 16; crowd = Array.from({ length: n }, (_, i) => `<circle class="fp-guest on" cx="${(L.stage.x - 24 + (i % cols) * 3.2).toFixed(1)}" cy="${(L.stage.y + 9 + Math.floor(i / cols) * 3).toFixed(1)}" r="0.9" style="animation-delay:${(i % 8) * 0.25}s"/>`).join(''); }
    const ctr = [8, 92].map(x => `<rect class="fp-food${ph === 2 ? ' on' : ''}" x="${x - 5}" y="${(L.zone.y + L.zone.h / 2 - 3).toFixed(1)}" width="10" height="6" rx="1.2"/>`).join('');
    return `<svg class="fp-svg" viewBox="0 0 100 75" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bird's-eye floor plan, ${L.tables.length} tables"><rect class="fp-floor" x="1" y="1" width="98" height="73" rx="3" style="fill:${skyAt(t)[1]}"/>
      <rect class="fp-zone" x="${L.zone.x}" y="${L.zone.y}" width="${L.zone.w}" height="${L.zone.h}" rx="2"/>
      <rect class="fp-stage${ph === 1 ? ' on' : ''}" x="${L.stage.x - 14}" y="${L.stage.y - 7}" width="28" height="12" rx="2"/><text class="fp-lbl" x="${L.stage.x}" y="${L.stage.y - 0.5}" text-anchor="middle">Stage</text>
      ${ctr}${tbl}${crowd}</svg>`;
  }
  function counterText(ev, t) {
    const n = Math.ceil(ev.guests / 10), ph = smePhase(t);
    return `<b>${ev.guests} guests</b> · ${n} table${n === 1 ? '' : 's'} of 10${ph === 1 ? ' · everyone at the stage' : ` · ${smeSeated(ev, t)} seated`}`;
  }
  function actThree(ev) {
    const v = smeVenue(ev);
    if (!v) return `<div class="sme-empty">${ic('info')}<p>Add a venue to your event to see your celebration.</p></div>`;
    const t = SME.time, L = birdEyeLayout(ev.guests, v);
    return `<div class="sme-act3"><div class="floor-plan" id="sme-fp">${SME_LABEL}<div id="sme-fpvis">${floorVis(ev, v, t)}</div></div>
      <div class="fp-counter" id="sme-fpc" aria-live="polite">${counterText(ev, t)}</div>
      ${L.overcrowded ? `<p class="note crowd-note">${ic('info')}<span>${L.note}</span></p>` : ''}
      <div class="time-slider"><label for="sme-time"><b id="sme-phase">${SME_PHASE[smePhase(t)]}</b></label>
        <input type="range" id="sme-time" min="0" max="100" value="${t}" data-input="sme-time" aria-label="Time of the celebration">
        <div class="sme-sweep-cap"><span>Arrival</span><span>Ceremony</span><span>Dinner</span></div></div>
      ${silhouetteStrip(t)}
      ${perkCard(ev)}</div>`;
  }
  function perkCard(ev) {
    const done = !!journeyOf(ev).visitRequested;
    return `<div class="perk-card${done ? ' done' : ''}" data-ev="${ev.id}"><span class="perk-ic">${ic('gift')}</span>
      <div><b>A gift from ShaadiKart</b><p>Your hall hosts a private walk-through and tasting this Saturday, hosted by ShaadiKart. Reserve a seat, no obligation.</p></div>
      ${done ? `<span class="perk-done">Reserved ${ic('check')}</span>` : `<button type="button" class="btn btn-gold" data-act="reserve-perk">Reserve a seat</button>`}</div>`;
  }
  function seeMyEvent(ev) {
    const tabs = [[1, 'The Space'], [2, 'Dressed for you'], [3, 'Your celebration']];
    return `<div class="sme-stage" data-ev="${ev.id}"><div class="sme-tabs" role="tablist">${tabs.map(([n, l]) => `<button type="button" role="tab" aria-selected="${SME.act === n}" class="${SME.act === n ? 'on' : ''}" data-act="sme-tab" data-n="${n}">${l}</button>`).join('')}</div>
      <div class="sme-body">${SME.act === 1 ? actOne(ev) : SME.act === 2 ? actTwo(ev) : actThree(ev)}</div></div>`;
  }
  const smeRefresh = el => { const st = el.closest('.sme-stage'), ev = S.events.find(e => e.id === st.dataset.ev); if (ev) st.outerHTML = seeMyEvent(ev); };

  function pageMyEvent(id) {
    const ev = S.events.find(e => e.id === id);
    if (!ev) return notFound();
    const svcs = liveSvcs(ev), n = svcs.length, ok = svcs.filter(s => ['confirmed', 'booked', 'paid'].includes(svcStatus(s))).length;
    const cur = journeyStage(ev), ci = JOURNEY.findIndex(x => x[0] === cur);
    const timeline = `<ol class="me-timeline">${JOURNEY.map(([k, l], i) => `<li class="${i < ci ? 'done' : i === ci ? 'cur' : ''}"><span class="me-dot">${i < ci ? ic('check') : i + 1}</span><span class="me-lbl">${l}</span></li>`).join('')}</ol>`;
    const status = {
      'requests-sent': `Requests sent to ${n} partner${n === 1 ? '' : 's'}`,
      'partners-confirm': `${ok} of ${n} confirmed`,
      'see-my-event': `${ok} of ${n} confirmed. Your event preview is ready`,
      conversation: 'Meeting with ShaadiKart completed',
      blueprint: 'Blueprint approved',
      payment: 'Payment in progress',
      booked: 'All services booked'
    }[cur];
    const list = svcs.map(s => { const v = partner(s.partnerId), ss = svcStatus(s); return `<div class="status-row">
        <div class="ph" ${bg(v.photos[0], 200)}></div>
        <div><h4>${esc(v.name)}</h4><div class="sub">${esc(catOf(v.cat).short)} · ${pkgOf(v, s.pkg).name} · ${inr(svcTotal(s))} incl. GST</div></div>
        <div>${ss === 'awaiting' ? `<span class="tag tag-amber"><span class="spin"></span>Checking date…</span>` : statusTag(ss)}</div></div>`; }).join('');
    const card = (k, title, body) => `<div class="box me-stage${k === cur ? ' cur' : ''}"><h2>${title}</h2>${body}</div>`;
    const stages = [
      card('requests-sent', 'Requests sent', `<p class="gate-p">Requests sent to ${n} partner${n === 1 ? '' : 's'}. Each partner checks its own calendar.</p>${list}`),
      card('partners-confirm', 'Partners confirm', `<p class="gate-p">${ok} of ${n} confirmed.</p>`),
      card('see-my-event', 'See My Event', seeMyEvent(ev)),
      journeyStage(ev) === 'see-my-event' || journeyOf(ev).visitRequested ? perkCard(ev) : '',
      card('conversation', 'Conversation', hostCard(ev) + (gateOn(ev) ? gateBox(ev) : `<p class="gate-p">Your meeting with ShaadiKart is complete.</p>`)),
      card('blueprint', 'Blueprint', blueprintCard(ev)),
      card('payment', 'Payment', `<p class="gate-p">Pay your advance once the steps above are complete.</p><a class="btn btn-gold" href="#/checkout/${ev.id}">${ic('receipt')}Go to payment</a>`),
      card('booked', 'Booked', ev.payments.length ? `<a class="btn btn-ghost" href="#/confirmed/${ev.id}">View confirmation</a>` : `<p class="gate-p">Your confirmation appears here after payment.</p>`)
    ].join('');
    return `<div class="wrap my-event">
      <div class="page-h"><h1>${ic('heart')} My Event</h1><p>${esc(ev.name)} · ${fmtDate(ev.date)} · ${ev.guests} guests · ${esc(ev.locality)} · Booking ID ${ev.id}</p></div>
      ${timeline}<p class="me-status"><b>${esc(status)}</b></p>${stages}</div>`;
  }
  function hostCard(ev) {
    const h = journeyOf(ev).host;
    return `<div class="host-card"><span class="host-av" aria-hidden="true">${ic('user')}</span>
      <div><b>${esc(h.name)}</b><small>${esc(h.role)} · ${h.years} years with ShaadiKart · ${esc(h.languages)}</small>
      <p>${esc(h.name.split(' ')[0])} will call you within 2 hours to hear about your ${esc(String(ev.type || 'event').toLowerCase())}.</p></div></div>`;
  }
  function blueprintCard(ev) {
    const j = journeyOf(ev), held = !!gateOf(ev).held;
    if (j.blueprintApproved) return `<p class="gate-p"><span class="tag tag-green">${ic('check')}Approved ${fmtDT(j.blueprintApproved)}</span></p><a class="btn btn-ghost" href="#/blueprint/${ev.id}">View your Blueprint</a>`;
    if (!held) return `<p class="gate-p">Your Blueprint is prepared after your meeting with ${esc(j.host.name.split(' ')[0])}. You approve it before paying.</p>`;
    return `<p class="gate-p">Your Blueprint is ready. Please review it and approve it to go to payment.</p><a class="btn btn-gold" href="#/blueprint/${ev.id}">${ic('receipt')}Review your Blueprint</a>`;
  }
  // Pure content (no actions) so the Concierge panel can embed it as a draft.
  function blueprintHtml(ev) {
    const j = journeyOf(ev), g = gateOf(ev), svcs = liveSvcs(ev).filter(s => ['confirmed', 'booked', 'paid'].includes(svcStatus(s)));
    const v = smeVenue(ev), a = v && D.VENUE_ANCHORS[v.id], dec = smeDecor(ev);
    const total = svcs.reduce((x, s) => x + svcTotal(s), 0), pre = svcs.reduce((x, s) => x + s.price, 0);
    const caters = svcs.filter(s => s.rate), qs = [...new Set(svcs.map(s => s.query).filter(Boolean))];
    const m = g.meeting, cap = v && v.cap;
    const sec = (t, body) => `<section class="bp-section"><h3>${t}</h3>${body}</section>`;
    const preview = a ? `<div class="bp-preview" ${bg(a.photo, 800)} role="img" aria-label="${esc(v.name)}"><span class="bp-pv-lbl">${esc(v.name)}${dec ? ' · styled by ' + esc(dec.name) : ''}</span></div>` : '';
    const ms = [['Event date', fmtDate(ev.date)], m ? ['Meeting with your host', `${fmtDate(m.date)} · ${m.time}`] : null, g.held ? ['Meeting held', fmtDT(g.held)] : null, j.blueprintApproved ? ['Blueprint approved', fmtDT(j.blueprintApproved)] : null].filter(Boolean);
    return `<div class="blueprint">${preview}
      ${sec('Selections', svcs.map(s => { const p = partner(s.partnerId); return `<div class="bp-row"><span><b>${esc(p.name)}</b><small>${esc(catOf(p.cat).short)} · ${esc(pkgOf(p, s.pkg).name)}</small></span><b>${inr(svcTotal(s))}</b></div>`; }).join('') || '<p class="gate-p">No confirmed services yet.</p>')}
      ${sec('Guests', `<div class="bp-row"><span><b>${ev.guests} guests</b><small>${cap ? `${esc(v.name)} seats ${cap[0]} to ${cap[1]}` : 'Layout planned with your host'}</small></span><b>${Math.ceil(ev.guests / 10)} tables of 10</b></div>`)}
      ${sec('Menu', caters.length ? caters.map(s => `<div class="bp-row"><span><b>${esc(partner(s.partnerId).name)}</b><small>${esc(pkgOf(partner(s.partnerId), s.pkg).name)} · ${dietLabel(s.diet)}</small></span><b>${inr(s.rate)} × ${s.guests}</b></div>`).join('') : '<p class="gate-p">No catering in this event yet.</p>')}
      ${sec('Budget', `<div class="bp-row"><span><b>Services</b><small>Before GST</small></span><b>${inr(pre)}</b></div><div class="bp-row"><span><b>GST</b></span><b>${inr(total - pre)}</b></div><div class="bp-row bp-total"><span><b>Total</b><small>Incl. GST</small></span><b>${inr(total)}</b></div>`)}
      ${sec('Timeline', ms.map(([l, d]) => `<div class="bp-row"><span><b>${l}</b></span><span>${d}</span></div>`).join(''))}
      ${sec('Special requests', qs.length ? qs.map(q => `<p class="bp-q">${esc(q)}</p>`).join('') : '<p class="gate-p">None added. Tell your host anything you would like changed.</p>')}</div>`;
  }
  window.blueprintHtml = blueprintHtml;
  function pageBlueprint(id) {
    const ev = S.events.find(e => e.id === id);
    if (!ev) return notFound();
    const j = journeyOf(ev), held = !!gateOf(ev).held;
    const act = j.blueprintApproved ? `<div class="bp-approve"><span class="tag tag-green">${ic('check')}Approved ${fmtDT(j.blueprintApproved)}</span></div>`
      : held ? `<div class="bp-approve"><button type="button" class="btn btn-gold" data-act="approve-blueprint" data-ev="${ev.id}">${ic('check')}Approve my Blueprint</button><button type="button" class="btn btn-ghost" data-act="bp-change" data-ev="${ev.id}">Request a change</button></div>`
      : `<p class="note">${ic('info')}<span>Your Blueprint is ready to approve once your meeting with ${esc(j.host.name.split(' ')[0])} is complete.</span></p>`;
    return `<div class="wrap my-event"><div class="crumbs" style="margin-bottom:10px"><a href="#/my-event/${ev.id}">My Event</a>${ic('chevronRight')}<span>Blueprint</span></div>
      <div class="page-h"><h1>${ic('receipt')} Your Blueprint</h1><p>${esc(ev.name)} · ${fmtDate(ev.date)} · ${ev.guests} guests · Booking ID ${ev.id}</p></div>
      <div class="box">${blueprintHtml(ev)}${act}</div></div>`;
  }

  function pageCheckout(id) {
    const ev = S.events.find(e => e.id === id);
    if (!ev) return notFound();
    const svcs = liveSvcs(ev);
    const st = svcs.map(svcStatus);
    const pending = st.includes('awaiting');
    const payable = svcs.filter(s => svcStatus(s) === 'confirmed');
    const needQ = payable.some(x => !x.qConfirmed);
    const gated = gateOn(ev) && !gateOf(ev).unlocked;
    const totalDue = payable.reduce((a, s) => a + svcTotal(s), 0);
    const advBase = payable.reduce((a, x) => a + Math.round(svcTotal(x) * ADV), 0), fp = ev.feePaid ? { fee: 0, gst: 0, total: 0 } : feeParts(totalDue);
    return `<div class="wrap">
      <div class="page-h"><h1>${ic('receipt')} Checkout summary</h1><p>${esc(ev.name)} · ${fmtDate(ev.date)} · ${ev.guests} guests · ${esc(ev.locality)} · Booking ID ${ev.id}</p></div>
      <div class="two-col${gated && !pending && payable.length && !needQ ? ' gated' : ''}">
        <div>
          <div class="box"><h2>Partner confirmations</h2>
            <p class="note" style="margin:-4px 0 10px">${ic('info')}<span>Each partner checks its own calendar. An unavailable partner does not cancel the rest of your cart.</span></p>
            ${svcs.map(s => { const v = partner(s.partnerId), ss = svcStatus(s); return `<div class="status-row">
              <div class="ph" ${bg(v.photos[0], 200)}></div>
              <div><h4>${esc(v.name)}</h4><div class="sub">${esc(catOf(v.cat).short)} · ${pkgOf(v, s.pkg).name}${svcMeta(s)} · ${inr(svcTotal(s))} incl. GST${ss === 'awaiting' ? '' : ss === 'unavailable' ? ' · fully booked on your date' : ` · ${s.confirmId}`}</div>
              ${s.query && ss !== 'awaiting' && ss !== 'unavailable' ? `<div class="qa"><small>You asked: ${esc(s.query)}</small></div>` : ''}${s.reply && ss !== 'awaiting' && ss !== 'unavailable' ? `<div class="qa reply">${ic('message')}<span>${esc(s.reply)}</span></div>` : ''}
              ${ss === 'unavailable' ? `<div style="display:flex;gap:12px;margin-top:4px"><a class="link-btn" href="#/category/${v.cat}">Find an alternative</a><button class="link-btn danger" data-act="remove-svc" data-ev="${ev.id}" data-svc="${s.id}">Remove from booking</button></div>` : ''}</div>
              <div>${ss === 'awaiting' ? `<span class="tag tag-amber"><span class="spin"></span>Checking date…</span>` : statusTag(ss)}</div></div>`; }).join('')}
          </div>
        </div>
        <aside class="sticky">
          <form class="box" data-form="pay" data-ev="${ev.id}">
            <h3>${ic('wallet')} Payment</h3>
            ${pending ? `<div class="avail warn">${ic('clock')}<span>Waiting for every partner to confirm. Payment opens once they respond.</span></div>` : ''}
            ${!pending && !payable.length ? `<div class="avail">${ic('check')}<span>Nothing to pay right now.</span></div><a class="btn btn-ghost btn-block" href="#/bookings/${ev.id}/services">Go to My Bookings</a>` : ''}
            ${!pending && payable.length && needQ ? `<div class="qgate">${ic('message')}<div><b>Please review your partners' replies</b><p>Your dates are confirmed. Read each reply on the left, and when you are happy, confirm to open payment.</p>${payable.map(x => `<div class="qg-row"><b>${esc(partner(x.partnerId).name)}</b><span>${esc(x.reply || 'Your date is confirmed.')}</span></div>`).join('')}</div></div><button type="button" class="btn btn-gold btn-block" data-act="confirm-queries" data-ev="${ev.id}">Confirm and continue to payment ${ic('arrowRight')}</button>` : ''}
            ${!pending && payable.length && !needQ && gated ? gateBox(ev) : ''}
            ${!pending && payable.length && !needQ && !gated ? `
              ${payable.map(s => `<div class="sum-row"><span>${esc(partner(s.partnerId).name)}</span><span>${inr(svcTotal(s))}</span></div>`).join('')}
              <div class="sum-row" style="border-top:1px solid var(--line);margin-top:6px;padding-top:10px"><span>Cart total value</span><span>${inr(totalDue)}</span></div>
              ${fp.total ? `<div class="sum-row"><span>ShaadiKart platform fee (0.5%)</span><span>${inr(fp.fee)}</span></div><div class="sum-row"><span>GST on platform fee (18%)</span><span>${inr(fp.gst)}</span></div>` : ''}
              <div class="sum-row total"><span>Total</span><span>${inr(totalDue + fp.total)}</span></div>
              <div class="pay-opts" style="margin-top:10px">
                <label class="pay-opt pay-amt"><input type="radio" name="amt" value="adv" checked data-change="pay-amt" data-amount="${advBase + fp.total}"><span class="pm-t"><b>Pay 25% advance</b><small>${inr(advBase)}${fp.total ? ` + platform fee &amp; GST ${inr(fp.total)}` : ''}</small></span><span class="r">${inr(advBase + fp.total)}</span></label>
                <label class="pay-opt pay-amt"><input type="radio" name="amt" value="full" data-change="pay-amt" data-amount="${totalDue + fp.total}"><span class="pm-t"><b>Pay in full</b><small>${inr(totalDue)}${fp.total ? ` + platform fee &amp; GST ${inr(fp.total)}` : ''}</small></span><span class="r">${inr(totalDue + fp.total)}</span></label>
              </div>
              <p class="note" style="margin-top:6px">${ic('info')}<span>ShaadiKart platform fee: 0.5% of the total cart value + 18% GST, charged once with this payment. Non-refundable.</span></p>
              <div class="care-line" style="margin-top:12px">${ic('medical')}<span><b>ShaadiKart Care included</b>: free priority medical help on your ${S.cart.event.type === 'Wedding' ? 'wedding' : 'event'} day.</span></div>
              <h3 style="margin-top:16px">Method</h3>
              <div id="pay-methods">${payMethods(advBase + fp.total)}</div>
              <button class="btn btn-gold btn-block" style="margin-top:14px" type="submit">Proceed to Pay ${ic('arrowRight')}</button>
              <p class="note" style="margin-top:10px">${ic('info')}<span>Demo only. No card or UPI details are collected and no money moves.</span></p>` : ''}
          </form>
        </aside>
      </div></div>`;
  }

  function pageConfirmed(id) {
    const ev = S.events.find(e => e.id === id);
    if (!ev) return notFound();
    const colors = ['#f7c548', '#4a22b0', '#1f9d55', '#e8638c', '#eea73a'];
    const conf = Array.from({ length: 46 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${colors[i % 5]};animation-delay:${(i % 10) * .12}s"></i>`).join('');
    const booked = liveSvcs(ev).filter(s => ['booked', 'paid'].includes(svcStatus(s)));
    const lastPay = ev.payments[ev.payments.length - 1];
    return `<div class="wrap">
      <div class="confirm-hero"><div class="confetti" aria-hidden="true">${conf}</div>
        <div class="big-ck">${ic('check')}</div><h1>Booking Confirmed!</h1>
        <p style="color:var(--muted);margin:6px 0 0">Your event is all set · ${esc(ev.name)} · ${fmtDate(ev.date)}</p>
        <p style="margin:6px 0 0"><span class="tag tag-plum">Booking ID ${ev.id}</span></p>
      </div>
      <div class="two-col" style="margin-top:10px">
        <div class="box"><h2>Confirmation from every partner</h2>
          ${booked.map(s => { const v = partner(s.partnerId); return `<div class="status-row"><div class="ph" ${bg(v.photos[0], 200)}></div><div><h4>${esc(v.name)}</h4><div class="sub">${esc(catOf(v.cat).short)} · ${s.confirmId} · paid ${inr(s.paid)} of ${inr(svcTotal(s))}</div></div>${statusTag(svcStatus(s))}</div>`; }).join('')}
        </div>
        <aside class="box">
          <h3>What happens next</h3>
          <div class="side-list">
            <div class="callout">${ic('calendarCheck')}<span>Track each service separately in <b>My Bookings</b>.</span></div>
            <div class="callout">${ic('wallet')}<span>Balance is due by <b>${fmtDate(new Date(new Date(ev.date) - 30 * DAY))}</b>.</span></div>
            <div class="callout">${ic('undo')}<span>Need to change plans? Cancel or reschedule one partner without touching the others.</span></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:14px">
            <a class="btn btn-primary btn-block" href="#/bookings/${ev.id}/services">View my bookings</a>
            ${lastPay ? `<button class="btn btn-ghost btn-block" data-act="receipt" data-ev="${ev.id}" data-pay="${lastPay.id}">${ic('receipt')}View receipt</button>` : ''}
          </div>
        </aside>
      </div></div>`;
  }

  const TABS = [['services', 'Services', 'list'], ['payments', 'Payment history', 'wallet'], ['receipts', 'Receipts', 'receipt'], ['orders', 'Order history', 'cart'], ['cancellations', 'Cancellation history', 'x'], ['refunds', 'Refund tracker', 'undo'], ['reschedule', 'Reschedule', 'calendar'], ['support', 'Support', 'message']];

  function pageBookings(parts, q) {
    if (!S.user) return `<div class="wrap"><div class="empty" style="padding:70px 20px">${ic('user')}<h2 style="color:var(--plum-900);margin:0 0 6px">Log in to see your bookings</h2><p>Use any 10-digit number. Demo OTP is shown on screen.</p><button class="btn btn-primary" data-act="login">Log in with mobile OTP</button></div></div>`;
    if (!S.events.length) return `<div class="wrap"><div class="empty" style="padding:70px 20px">${ic('calendarCheck')}<p>No bookings yet.</p><a class="btn btn-primary" href="#/cart">Go to cart</a></div></div>`;
    let ev = S.events.find(e => e.id === parts[1]);
    if (!ev) ev = S.events[S.events.length - 1];
    const tab = TABS.some(t => t[0] === parts[2]) ? parts[2] : 'services';
    const [stc, stl] = eventStatus(ev);
    const live = liveSvcs(ev);
    const paid = ev.payments.reduce((a, p) => a + p.amount, 0);
    const refunded = ev.refunds.reduce((a, r) => a + r.amount, 0);
    const due = activeSvcs(ev).reduce((a, s) => a + svcTotal(s) - s.paid, 0);
    const counts = { cancellations: ev.cancellations.length, refunds: ev.refunds.length, support: ev.tickets.length, payments: ev.payments.length + ev.refunds.length, receipts: ev.payments.length, orders: live.length, services: live.length, reschedule: ev.reschedules.length };
    const canCancelAll = activeSvcs(ev).length > 0;
    return `<div class="wrap">
      <div class="page-h"><h1>${ic('calendarCheck')} My Bookings</h1><p>Track every service, payment, cancellation and refund for your events.</p></div>
      ${S.events.length > 1 ? `<div class="filters">${S.events.map(e => `<a class="chip ${e.id === ev.id ? 'on' : ''}" href="#/bookings/${e.id}/${tab}">${esc(e.name)}</a>`).join('')}</div>` : ''}
      <div class="ev-card" style="margin:14px 0 40px">
        <div class="ev-head">
          <div><h2>${esc(ev.name)}</h2><div class="meta"><span>${ic('calendar')} ${fmtDate(ev.date)}</span><span>${ic('pin')} ${esc(ev.locality)}</span><span>${ic('users')} ${ev.guests} guests</span><span>ID ${ev.id}</span></div></div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="tag ${stc}">${stl}</span>
            ${eventStatus(ev)[1] === 'Awaiting payment' || eventStatus(ev)[1] === 'Awaiting partners' ? `<a class="btn btn-gold btn-sm" href="#/checkout/${ev.id}">Complete checkout</a>` : ''}
            ${canCancelAll ? `<a class="btn btn-ghost btn-sm" href="#/bookings/${ev.id}/reschedule">${ic('calendar')}Reschedule event</a>` : ''}
            ${canCancelAll ? `<button class="btn btn-danger btn-sm" data-act="cancel" data-ev="${ev.id}" data-scope="event">${ic('x')}Cancel entire event</button>` : ''}
          </div>
        </div>
        <div class="ev-stats">
          <div><small>Active services</small><b>${activeSvcs(ev).length} / ${live.length}</b></div>
          <div><small>Paid so far</small><b>${inr(paid)}</b></div>
          <div><small>Balance due</small><b>${inr(due)}</b></div>
          <div><small>Refunds</small><b>${inr(refunded)}</b></div>
        </div>
        <nav class="tabs" aria-label="Booking sections">${TABS.map(([k, l, i]) => `<a href="#/bookings/${ev.id}/${k}" class="${k === tab ? 'on' : ''}">${ic(i)}${l}${counts[k] ? `<span class="n">${counts[k]}</span>` : ''}</a>`).join('')}</nav>
        <div class="tab-body">${TAB_RENDER[tab](ev, q)}</div>
      </div></div>`;
  }

  function timeline(ev, s) {
    const ss = svcStatus(s);
    const pay = ev.payments.find(p => p.items.some(i => i.svcId === s.id));
    const d = new Date(svcDate(ev, s));
    let steps;
    if (ss === 'unavailable') steps = [['Requested', fmtDT(s.requestedAt), 'done'], ['Not available', 'Partner declined date', 'bad']];
    else if (ss === 'cancelled') {
      const rf = ev.refunds.find(r => r.svcIds.includes(s.id));
      steps = [['Requested', fmtDate(s.requestedAt), 'done'], ['Confirmed', fmtDate(s.respondAt), 'done']];
      if (pay) steps.push(['Advance paid', fmtDate(pay.t), 'done']);
      steps.push(['Cancelled', fmtDate(s.cancelledAt), 'bad']);
      steps.push(rf ? [REFUND_STEPS[refundStage(rf)], inr(rf.amount), refundStage(rf) === 3 ? 'done' : 'cur'] : ['No refund due', '', 'done']);
    } else {
      const t0 = now();
      steps = [
        ['Requested', fmtDate(s.requestedAt), 'done'],
        ['Partner confirmed', ss === 'awaiting' ? 'Pending' : fmtDate(s.respondAt), ss === 'awaiting' ? 'cur' : 'done'],
        ['Advance paid', pay ? fmtDate(pay.t) : 'Due now', pay ? 'done' : (ss === 'confirmed' ? 'cur' : '')],
        ['Balance', ss === 'paid' ? 'Paid' : 'Due ' + fmtDate(new Date(d - 30 * DAY)), ss === 'paid' ? 'done' : (ss === 'booked' ? 'cur' : '')],
        ['Event day', fmtDate(d), t0 > d ? 'done' : '']
      ];
    }
    return `<div class="timeline">${steps.map(([l, sub, cls], i) => `<div class="tl ${cls}">${i ? '<span class="bar"></span>' : ''}<span class="d">${cls === 'done' ? ic('check') : cls === 'bad' ? ic('x') : ''}</span><span class="lb"><b>${l}</b>${esc(sub)}</span></div>`).join('')}</div>`;
  }

  const TAB_RENDER = {
    services(ev) {
      const live = liveSvcs(ev);
      return `${activeSvcs(ev).length ? `<div class="care-card">${ic('medical')}<div><b>ShaadiKart Care is active for ${fmtDate(ev.date)}</b><span>Free priority medical help at your venue on the wedding day: on-call doctor and ambulance coordination. Emergency line (demo): +91 00000 00000.</span></div></div>` : ''}
      <div class="callout gold" style="margin-bottom:14px">${ic('info')}<span>Each service is tracked and can be cancelled or rescheduled on its own. Cancelling photography will <b>not</b> cancel your venue, catering or decoration.</span></div>
      ${live.map(s => {
        const v = partner(s.partnerId), ss = svcStatus(s), tot = svcTotal(s);
        const active = ['confirmed', 'booked', 'paid'].includes(ss);
        return `<div class="svc ${ss === 'cancelled' || ss === 'unavailable' ? 'cancelled' : ''}">
          <div class="ph" ${bg(v.photos[0], 200)}></div>
          <div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><h4>${esc(v.name)}</h4>${statusTag(ss)}</div>
            <div class="sub">${esc(catOf(v.cat).name)} · ${pkgOf(v, s.pkg).name} package${svcMeta(s)}${s.confirmId && ss !== 'unavailable' ? ' · ' + s.confirmId : ''}${s.date ? ` · <b>new date ${fmtDate(s.date)}</b>` : ''}</div>
            <div class="sub">Total ${inr(tot)} · Paid ${inr(s.paid)}${active ? ' · Due ' + inr(tot - s.paid) : ''}</div>
            ${timeline(ev, s)}
          </div>
          <div class="acts">
            ${ss === 'confirmed' ? `<a class="btn btn-gold btn-sm" href="#/checkout/${ev.id}">Pay advance</a>` : ''}
            ${ss === 'booked' ? `<button class="btn btn-primary btn-sm" data-act="pay-balance" data-ev="${ev.id}" data-svc="${s.id}">Pay balance</button>` : ''}
            ${active ? `<a class="btn btn-ghost btn-sm" href="#/bookings/${ev.id}/reschedule?svc=${s.id}">${ic('calendar')}Reschedule</a>
              <button class="btn btn-danger btn-sm" data-act="cancel" data-ev="${ev.id}" data-scope="service" data-svc="${s.id}">${ic('x')}Cancel this service</button>` : ''}
            ${ss === 'unavailable' ? `<a class="btn btn-ghost btn-sm" href="#/category/${v.cat}">Find alternative</a>` : ''}
            ${ss !== 'awaiting' ? `<a class="btn btn-ghost btn-sm" href="#/bookings/${ev.id}/support?svc=${s.id}">${ic('message')}Raise issue</a>` : ''}
          </div></div>`;
      }).join('')}
      <div style="margin-top:16px"><a class="btn btn-ghost btn-sm" href="#/category/venues">${ic('plus')}Add another service</a></div>`;
    },
    payments(ev) {
      const rows = [...ev.payments.map(p => ({ t: p.t, id: p.id, what: p.items.map(i => partner(ev.services.find(s => s.id === i.svcId).partnerId).name).join(', '), type: p.kind, method: p.method, amt: p.amount, sign: '' })),
        ...ev.refunds.map(r => ({ t: r.t, id: r.id, what: r.svcIds.map(id => partner(ev.services.find(s => s.id === id).partnerId).name).join(', '), type: 'Refund · ' + REFUND_STEPS[refundStage(r)], method: r.method, amt: r.amount, sign: '−' }))].sort((a, b) => b.t - a.t);
      if (!rows.length) return `<div class="empty">${ic('wallet')}<p>No payments yet.</p></div>`;
      return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Transaction</th><th>For</th><th>Type</th><th>Method</th><th class="r">Amount</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td>${fmtDT(r.t)}</td><td>${r.id}</td><td>${esc(r.what)}</td><td>${r.sign ? `<span class="tag tag-green">${esc(r.type)}</span>` : esc(r.type)}</td><td>${esc(r.method)}</td><td class="r"><b style="color:${r.sign ? 'var(--green)' : 'inherit'}">${r.sign}${inr(r.amt)}</b></td></tr>`).join('')}
      </tbody></table></div>`;
    },
    receipts(ev) {
      if (!ev.payments.length) return `<div class="empty">${ic('receipt')}<p>Receipts appear after your first payment.</p></div>`;
      return ev.payments.slice().reverse().map(p => `<div class="ticket" style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
        <div><b>Receipt ${p.id.replace('PAY', 'RCPT')}</b><div class="sub" style="color:var(--muted);font-size:13px">${fmtDT(p.t)} · ${esc(p.kind)} · ${esc(p.method)} · ${p.items.length} service${p.items.length > 1 ? 's' : ''}</div></div>
        <div style="display:flex;gap:12px;align-items:center"><b>${inr(p.amount)}</b><button class="btn btn-ghost btn-sm" data-act="receipt" data-ev="${ev.id}" data-pay="${p.id}">${ic('receipt')}View</button></div></div>`).join('');
    },
    orders(ev) {
      return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Category</th><th>Partner &amp; package</th><th>Ordered on</th><th class="r">Amount</th><th>Status</th></tr></thead><tbody>
        ${liveSvcs(ev).map(s => { const v = partner(s.partnerId); return `<tr><td>${s.confirmId && svcStatus(s) !== 'unavailable' ? s.confirmId : s.id}</td><td>${esc(catOf(v.cat).short)}</td><td><b>${esc(v.name)}</b><br><small>${pkgOf(v, s.pkg).name}</small></td><td>${fmtDate(s.requestedAt)}</td><td class="r">${inr(svcTotal(s))}</td><td>${statusTag(svcStatus(s))}</td></tr>`; }).join('')}
      </tbody></table></div>`;
    },
    cancellations(ev) {
      if (!ev.cancellations.length) return `<div class="empty">${ic('x')}<p>No cancellations. Every service is still on.</p></div>`;
      return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Cancellation</th><th>Date</th><th>What was cancelled</th><th>Reason</th><th class="r">Paid</th><th class="r">Refund</th><th>Refund status</th></tr></thead><tbody>
        ${ev.cancellations.slice().reverse().map(c => { const rf = ev.refunds.find(r => r.id === c.refundId) || ev.refunds.find(r => c.svcIds.includes(r.svcIds[0])); return `<tr><td>${c.id}</td><td>${fmtDate(c.t)}</td><td>${c.scope === 'event' ? '<span class="tag tag-red">Entire event</span><br>' : ''}${c.svcIds.map(id => esc(partner(ev.services.find(s => s.id === id).partnerId).name)).join(', ')}</td><td>${esc(c.reason)}</td><td class="r">${inr(c.paid)}</td><td class="r"><b>${inr(c.refundAmount)}</b><br><small>${c.scope === 'event' ? 'per policy' : c.pct + '%'}</small></td><td>${rf ? `<a href="#/bookings/${ev.id}/refunds">${REFUND_STEPS[refundStage(rf)]}</a>` : 'No refund due'}</td></tr>`; }).join('')}
      </tbody></table></div>`;
    },
    refunds(ev) {
      if (!ev.refunds.length) return `<div class="empty">${ic('undo')}<p>No refunds yet.</p></div>`;
      return ev.refunds.slice().reverse().map(r => {
        const k = refundStage(r);
        return `<div class="refund"><div class="refund-top">
          <div><b>${r.svcIds.map(id => esc(partner(ev.services.find(s => s.id === id).partnerId).name)).join(', ')}</b><div style="color:var(--muted);font-size:13px">${r.id} · to original ${esc(r.method)} · initiated ${fmtDT(r.t)}</div></div>
          <div style="text-align:right"><div class="refund-amt">${inr(r.amount)}</div><span class="tag ${k === 3 ? 'tag-green' : 'tag-amber'}">${REFUND_STEPS[k]}</span></div></div>
          <div class="steps">${REFUND_STEPS.map((l, i) => `<div class="st ${i <= k ? 'done' : ''}"><span class="d">${i <= k ? ic('check') : ''}</span><b>${l}</b>${i <= k ? (i === 3 ? 'Done' : '') : i === 3 ? '5–7 working days' : ''}</div>`).join('')}</div></div>`;
      }).join('');
    },
    reschedule(ev, q) {
      const act = activeSvcs(ev).filter(s => svcStatus(s) !== 'awaiting');
      const pre = q.get('svc');
      const scopeEvent = !pre;
      return `<div class="two-col" style="margin:0">
        <form class="box" data-form="reschedule" data-ev="${ev.id}" style="box-shadow:none">
          <h2>Request a new date</h2>
          <p class="note" style="margin:-4px 0 12px">${ic('info')}<span>Each partner accepts the new date separately. Your current date stays until they all accept.</span></p>
          <label class="field">Current date<input value="${fmtDate(ev.date)}" disabled></label>
          <label class="field" style="margin-top:10px">New date<input type="date" name="to" min="${isoPlus(7)}" required></label>
          <div class="field" style="margin-top:10px">Apply to
            <label class="pay-opt"><input type="radio" name="scope" value="event" ${scopeEvent ? 'checked' : ''}> Entire event (all ${act.length} active services)</label>
            ${act.map(s => `<label class="pay-opt"><input type="radio" name="scope" value="${s.id}" ${pre === s.id ? 'checked' : ''}> Only ${esc(partner(s.partnerId).name)}</label>`).join('')}
          </div>
          <label class="field" style="margin-top:10px">Reason<input name="reason" placeholder="e.g. Muhurat changed"></label>
          <button class="btn btn-primary" style="margin-top:14px" type="submit" ${act.length ? '' : 'disabled'}>Send reschedule request</button>
        </form>
        <div>
          <h3 style="margin:0 0 10px;color:var(--plum-900)">Requests</h3>
          ${ev.reschedules.length ? ev.reschedules.slice().reverse().map(r => `<div class="ticket"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${fmtDate(r.from)} → ${fmtDate(r.to)}</b><span class="tag ${r.applied ? 'tag-green' : 'tag-amber'}">${r.applied ? 'New date confirmed' : 'Waiting for partners'}</span></div>
            <div style="color:var(--muted);font-size:12.5px;margin:2px 0 8px">${r.id} · ${r.scope === 'event' ? 'Entire event' : 'Single service'} · ${esc(r.reason || 'No reason given')}</div>
            ${Object.entries(r.responses).map(([sid, t]) => `<div class="sum-row"><span>${esc(partner(ev.services.find(s => s.id === sid).partnerId).name)}</span>${now() >= t ? `<span class="tag tag-green">${ic('check')}Accepted</span>` : `<span class="tag tag-amber"><span class="spin"></span>Pending</span>`}</div>`).join('')}</div>`).join('') : `<div class="empty" style="padding:30px">${ic('calendar')}<p>No reschedule requests.</p></div>`}
        </div></div>`;
    },
    support(ev, q) {
      const pre = q.get('svc');
      return `<div class="two-col" style="margin:0">
        <form class="box" data-form="ticket" data-ev="${ev.id}" style="box-shadow:none">
          <h2>Raise a complaint or dispute</h2>
          <div class="form-grid">
            <label class="field">Type<select name="type">${['Complaint', 'Dispute', 'Payment issue', 'Refund delay', 'Partner no-show', 'Question'].map(x => `<option>${x}</option>`).join('')}</select></label>
            <label class="field">Related service<select name="svc"><option value="">Whole event</option>${liveSvcs(ev).map(s => `<option value="${s.id}" ${pre === s.id ? 'selected' : ''}>${esc(partner(s.partnerId).name)}</option>`).join('')}</select></label>
          </div>
          <label class="field" style="margin-top:10px">Subject<input name="subject" required maxlength="90" placeholder="Short summary"></label>
          <label class="field" style="margin-top:10px">Details<textarea name="desc" required placeholder="What happened? Add dates and amounts if relevant."></textarea></label>
          <button class="btn btn-primary" style="margin-top:14px" type="submit">Submit ticket</button>
          <p class="note" style="margin-top:12px">${ic('shield')}<span>We reply within 24 hours (illustrative SLA). Disputes are reviewed with the partner's records and your booking history.</span></p>
        </form>
        <div>
          <h3 style="margin:0 0 10px;color:var(--plum-900)">Your tickets</h3>
          ${ev.tickets.length ? ev.tickets.slice().reverse().map(tk => { const [c, l] = ticketStatus(tk); const s = ev.services.find(x => x.id === tk.svcId); return `<div class="ticket"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${esc(tk.subject)}</b><span class="tag ${c}">${l}</span></div>
            <div style="color:var(--muted);font-size:12.5px;margin-top:2px">${tk.id} · ${esc(tk.type)} · ${s ? esc(partner(s.partnerId).name) : 'Whole event'} · ${fmtDT(tk.t)}</div>
            <p style="margin:8px 0 0;font-size:14px">${esc(tk.desc)}</p>${tk.reply ? `<div class="callout" style="margin-top:8px">${ic('message')}<span>${esc(tk.reply)}</span></div>` : ''}</div>`; }).join('') : `<div class="empty" style="padding:30px">${ic('message')}<p>No tickets yet.</p></div>`}
        </div></div>`;
    }
  };

  const notFound = () => `<div class="wrap"><div class="empty" style="padding:80px 20px">${ic('alert')}<p>That page doesn't exist.</p><a class="btn btn-primary" href="#/">Go home</a></div></div>`;

  /* ---------- WhatsApp catalog (demo: simulated chat, no WhatsApp account is connected) ---------- */
  function waLines(ev) {
    if (ev) return liveSvcs(ev).filter(s => ['confirmed', 'booked', 'paid', 'awaiting'].includes(svcStatus(s))).map(s => { const v = partner(s.partnerId), p = pkgOf(v, s.pkg); return { v, tier: p.name, detail: s.rate ? `${dietLabel(s.diet)} · ${inr(s.rate)} × ${s.guests} guests` : '', amount: svcTotal(s) }; });
    return cartLines().map(l => ({ v: l.v, tier: l.p.name, detail: l.v.perPlate ? `${dietLabel(l.diet)} · ${inr(l.unit)} × ${S.cart.event.guests} guests` : '', amount: Math.round(l.price * (1 + GST)) }));
  }
  function waModal(ev) {
    const e = ev || { ...S.cart.event, customer: S.user }, lines = waLines(ev), g = ev ? gateOf(ev) : null;
    const first = ((e.customer && e.customer.name) || (S.user && S.user.name) || '').split(' ')[0];
    const total = lines.reduce((a, l) => a + l.amount, 0), m = g && g.meeting;
    const when = m ? `${fmtDate(m.date)} at ${m.time}` : 'a time that suits you';
    const label = e.type ? `${e.type.toLowerCase()}` : 'event';
    if (!lines.length) return openModal('WhatsApp catalog', `<p style="margin:0">Add services to your cart first. Your WhatsApp catalog is built from the cart.</p>`);
    const cards = lines.map(l => `<div class="wa-card"><span class="wa-ph" ${bg(l.v.photos[0], 400)}></span><div><b>${esc(l.v.name)}</b><small>${esc(catOf(l.v.cat).short)} · ${esc(l.tier)}</small>${l.detail ? `<small>${esc(l.detail)}</small>` : ''}<span class="wa-pr">${inr(l.amount)}</span><span class="wa-vf">${ic('shield')}ShaadiKart Verified</span></div></div>`).join('');
    const body = `<div class="wa-demo">
      <div class="wa-phone" aria-label="WhatsApp preview">
        <div class="wa-top"><span class="wa-av">${ic('shield')}</span><div><b>ShaadiKart Customer Service</b><small>Business account · demo</small></div></div>
        <div class="wa-chat" id="wa-chat">
          <div class="wa-b" id="wa-1"><p>Namaste${first ? ' ' + esc(first) : ''},</p><p>This is ShaadiKart Customer Service. You asked about your ${esc(label)} on ${fmtDate(e.date)} for ${e.guests} guests in ${esc(e.locality)}. Here is your selection:</p>
            <ol>${lines.map(l => `<li>${esc(l.v.name)}, ${esc(l.tier)}: <b>${inr(l.amount)}</b></li>`).join('')}</ol><p><b>Total: ${inr(total)}</b> (incl. GST)</p><i>${hhmm(now())}</i></div>
          <div class="wa-cat" id="wa-2"><div class="wa-cat-h">Your catalog · ${lines.length} ${lines.length === 1 ? 'service' : 'services'}</div>${cards}</div>
          <div class="wa-b" id="wa-3"><p><b>What happens next</b></p><ol><li>We call you within 2 hours of your enquiry</li><li>Meeting with a ShaadiKart executive: ${esc(when)}</li><li>Payment then opens on the ShaadiKart website. If we miss you, please call ${CALL_NO}</li></ol>
            <p id="wa-safe" class="wa-safe">${ic('shield')}For your safety, we never ask for your OTP, card number or UPI PIN on WhatsApp.</p><i>${hhmm(now())}</i></div>
        </div>
        <div class="wa-chips"><button type="button" data-act="wa-chip" data-q="Reschedule my meeting">Reschedule meeting</button><button type="button" data-act="wa-chip" data-q="I have a question">Ask a question</button><button type="button" data-act="wa-chip" data-q="Please call me">Speak to us</button></div>
      </div>
      <div class="wa-notes"><h4>How to read this</h4>
        <ol class="wa-key"><li><b>One clear opening.</b> Who we are, which event, how many guests. No forwards, no links.</li><li><b>Your cart, line by line.</b> Names, tier and price with GST, so nothing is a surprise.</li><li><b>A catalog card per service,</b> with the partner photo and the ShaadiKart Verified mark.</li><li><b>Plain next steps.</b> Our call, the meeting, then payment. Call us only if we miss you.</li><li><b>A safety line.</b> We never ask for OTP, card number or UPI PIN here.</li></ol>
        <p class="note">${ic('info')}<span>This is a demo screen. In the live product our customer service sends this from the official ShaadiKart business number and guides the customer step by step.</span></p>
        <button type="button" class="btn btn-ghost btn-sm" data-act="wa-copy">Copy message text</button></div></div>`;
    window.__waText = `Namaste${first ? ' ' + first : ''},\nThis is ShaadiKart Customer Service. You asked about your ${label} on ${fmtDate(e.date)} for ${e.guests} guests in ${e.locality}. Here is your selection:\n` + lines.map((l, i) => `${i + 1}. ${l.v.name}, ${l.tier}: ${inr(l.amount)}`).join('\n') + `\nTotal: ${inr(total)} (incl. GST)\n\nWhat happens next:\n1. We call you within 2 hours of your enquiry\n2. Meeting with a ShaadiKart executive: ${when}\n3. Payment then opens on the ShaadiKart website. If we miss you, please call ${CALL_NO}\n\nFor your safety, we never ask for your OTP, card number or UPI PIN on WhatsApp.`;
    openModal('WhatsApp catalog (demo)', body, { wide: true, still: true });
  }

  /* ---------- Concierge console (ShaadiKart staff, demo) ---------- */
  function pageConcierge(id) {
    if (!S.staff) return `<div class="wrap"><div class="empty" style="padding:70px 20px">${ic('headset')}<h2 style="color:var(--plum-900);margin:0 0 6px">ShaadiKart Concierge</h2><p>For ShaadiKart staff. Log in to manage customer meetings, calls and payment unlocks.</p><button class="btn btn-primary" data-act="staff-login">Staff login</button></div></div>`;
    const evs = S.events.filter(ev => gateOn(ev) || gateOf(ev).unlocked).sort((a, b) => b.createdAt - a.createdAt);
    const count = k => evs.filter(ev => gateStage(ev) === k).length;
    const open = id && id !== '_' ? S.events.find(e => e.id === id) : null;
    const queue = `<div class="box"><h2>Customer queue</h2>${evs.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Customer</th><th>Event</th><th>Stage</th><th class="r"></th></tr></thead><tbody>
      ${evs.map(ev => { const m = gateOf(ev).meeting; return `<tr><td><b>${esc(custName(ev))}</b><br><small>${ev.customer ? '+91 ' + esc(ev.customer.phone) : ''}</small></td><td>${esc(ev.name)}<br><small>${fmtDate(ev.date)} · ${ev.guests} guests${m ? ` · meeting ${fmtDate(m.date)} ${esc(m.time)}` : ''}</small></td><td>${gateTag(ev)}</td><td class="r"><a class="btn btn-primary btn-sm" href="#/concierge/${ev.id}">Open</a></td></tr>`; }).join('')}</tbody></table></div>` : `<div class="empty" style="padding:26px">${ic('headset')}<p>No customers in the queue. Send a booking request from the customer side and it appears here.</p></div>`}</div>`;
    return `<div class="wrap">
      <div class="page-h"><h1>${ic('headset')} ShaadiKart Concierge</h1><p>${esc(S.staff.name)} · Customer Success <span class="tag tag-amber">Demo</span></p></div>
      <div class="ev-stats pd-stats">
        <div><small>Meetings to schedule</small><b>${count('meeting')}</b></div><div><small>Meetings booked</small><b>${count('meeting-wait')}</b></div>
        <div><small>Calls and verification</small><b>${count('call')}</b></div><div><small>Ready to unlock</small><b>${count('unlock')}</b></div>
      </div>
      <div style="margin-top:18px">${open ? cgDetail(open) : queue}</div></div>`;
  }
  function cgDetail(ev) {
    const g = gateOf(ev), st = gateStage(ev), m = g.meeting, svcs = liveSvcs(ev), pend = svcs.some(s => svcStatus(s) === 'awaiting');
    const total = svcs.filter(s => ['confirmed', 'booked', 'paid'].includes(svcStatus(s))).reduce((a, s) => a + svcTotal(s), 0);
    const qs = svcs.filter(s => s.query);
    const canUnlock = !!g.held && verified(g) && !!journeyOf(ev).blueprintApproved && !g.unlocked;
    const lastOpen = g.calls.find(c => !c.result);
    const chk = (ok, t) => `<li class="${ok ? 'ok' : ''}">${ic(ok ? 'check' : 'clock')}${t}</li>`;
    const late = !g.calls.length && now() > dueBy(ev);
    return `<div class="crumbs" style="margin-bottom:10px"><a href="#/concierge">Queue</a>${ic('chevronRight')}<span>${esc(ev.id)}</span></div>
    <div class="two-col"><div>
      <div class="box"><h2>${esc(custName(ev))} · ${esc(ev.name)} ${gateTag(ev)}</h2>
        <dl class="kv"><dt>Mobile</dt><dd>${ev.customer ? '+91 ' + esc(ev.customer.phone) : 'Not on file'}</dd><dt>Event</dt><dd>${esc(ev.type)} · ${fmtDate(ev.date)} · ${ev.guests} guests · ${esc(ev.locality)}</dd><dt>Booking ID</dt><dd>${ev.id}</dd><dt>Cart value</dt><dd>${inr(total)} incl. GST</dd></dl></div>
      <div class="box"><h2>Cart and partner replies</h2>${svcs.map(s => { const v = partner(s.partnerId), ss = svcStatus(s); return `<div class="status-row"><div class="ph" ${bg(v.photos[0], 200)}></div><div><h4>${esc(v.name)}</h4><div class="sub">${esc(catOf(v.cat).short)} · ${pkgOf(v, s.pkg).name}${svcMeta(s)} · ${inr(svcTotal(s))}</div>${s.query && ss !== 'awaiting' ? `<div class="qa"><small>Customer asked: ${esc(s.query)}</small></div><div class="qa reply">${ic('message')}<span>${esc(s.reply)}</span></div>` : ''}</div><div>${statusTag(ss)}</div></div>`; }).join('')}
        ${qs.length ? '' : `<p class="note" style="margin-top:8px">${ic('info')}<span>The customer did not add special questions.</span></p>`}</div>
      <div class="box"><h2>Notes from calls</h2><label class="field"><span class="sr-only">Notes</span><textarea data-change="cg-notes" data-ev="${ev.id}" rows="4" placeholder="Requirements, budget, family preferences, anything the partners should know…">${esc(g.notes)}</textarea></label></div>
    </div><aside class="sticky">
      <div class="box cg-steps"><h3>${ic('headset')} Verification steps</h3>
        ${pend ? `<div class="avail warn">${ic('clock')}<span>Waiting for partners to confirm.</span></div>` : ''}
        <div class="cg-step"><h4><span class="cg-n">1</span>Meeting with the customer</h4>
          ${m ? `<p>${fmtDate(m.date)} · ${esc(m.time)} · ${esc(m.mode)}${m.changes ? ` <small>(rescheduled ${m.changes}×, was ${esc(m.history[m.history.length - 1])})</small>` : ''}</p>${g.held ? `<span class="tag tag-green">${ic('check')}Held ${fmtDT(g.held)}</span>` : `<button class="btn btn-primary btn-sm" data-act="cg-held" data-ev="${ev.id}">Mark meeting completed</button>`}` : `<p class="muted">The customer has not scheduled yet. Payment stays locked.</p>`}</div>
        <div class="cg-step"><h4><span class="cg-n">2</span>Outbound call (2 attempts, back to back)</h4>
          <p>${late ? '<span class="tag tag-red">Overdue</span> ' : ''}Call due by <b>${hhmm(dueBy(ev))}</b> (within 2 hours of the customer's enquiry).</p>
          ${g.calls.map(c => `<div class="gate-log"><div><span>${ic('phone')}Attempt ${c.n} of 2 · ${hhmm(c.t)}</span><b class="${c.result === 'Answered' ? 'ok' : c.result ? 'miss' : ''}">${c.result || 'Ringing…'}</b></div></div>`).join('')}
          ${!g.calls.length ? `<button class="btn btn-primary btn-sm" data-act="cg-dial" data-ev="${ev.id}">Start outbound calls</button>` : ''}
          ${lastOpen ? `<div class="cg-res"><button class="btn btn-ghost btn-sm" data-act="cg-result" data-ev="${ev.id}" data-res="Answered">Customer answered</button><button class="btn btn-ghost btn-sm" data-act="cg-result" data-ev="${ev.id}" data-res="No answer">No answer</button></div>` : ''}
          ${answered(g) ? `<p class="note">${ic('info')}<span>Customer answered, so no verification call is needed.</span></p>` : ''}${g.calls.length >= 2 && callsDone(g) && !answered(g) ? `<p class="note">${ic('info')}<span>Both attempts used. No more outbound calls. The customer must call ${CALL_NO}.</span></p>` : ''}</div>
        <div class="cg-step ${answered(g) ? 'off' : ''}"><h4><span class="cg-n">3</span>Customer calls ${CALL_NO} <small style="font-weight:500;color:var(--muted)">(only if our call is missed)</small></h4>
          ${answered(g) ? '<p class="muted">Not needed. The customer answered our call.</p>' : g.inbound ? `<span class="tag tag-green">${ic('check')}Call received ${fmtDT(g.inbound.t)}</span>` : `<p class="muted">Waiting for the customer's call.</p><button class="btn btn-ghost btn-sm" data-act="cg-inbound" data-ev="${ev.id}">Log customer's call (demo)</button>`}</div>
        <div class="cg-step"><h4><span class="cg-n">4</span>Unlock payment</h4>
          <ul class="cg-chk">${chk(!pend, 'Partners confirmed')}${chk(!!m, 'Meeting scheduled')}${chk(!!g.held, 'Meeting held')}${chk(g.calls.length > 0, 'Outbound call attempted')}${chk(verified(g), 'Verified: customer answered our call, or called ' + CALL_NO)}${chk(!!journeyOf(ev).blueprintApproved, 'Blueprint approved by the customer')}</ul>
          ${g.unlocked ? `<span class="tag tag-green">${ic('check')}Unlocked ${fmtDT(g.unlocked.t)} by ${esc(g.unlocked.by)}</span>` : `<button class="btn btn-gold btn-block" data-act="cg-unlock" data-ev="${ev.id}" ${canUnlock ? '' : 'disabled'}>Unlock payment for customer</button>${canUnlock ? '' : '<p class="note" style="margin-top:8px">' + ic('info') + '<span>Needs the meeting held, verification (answered call, or the customer\'s call) and the customer\'s Blueprint approval.</span></p>'}`}</div>
      </div>
      <div class="box"><h3><span class="wa-dot"></span> WhatsApp catalog</h3>
        <p class="gate-p">${g.waRequested ? 'The customer opened the WhatsApp catalog. ' : ''}${g.waSent ? `Sent ${fmtDT(g.waSent)}.` : 'Not sent yet.'}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-act="cg-wa-preview" data-ev="${ev.id}">Preview message</button><button class="btn btn-primary btn-sm" data-act="cg-wa-send" data-ev="${ev.id}">${g.waSent ? 'Send again' : 'Send to customer'}</button></div></div>
    </aside></div>`;
  }


  /* ---------- render ---------- */
  let lastPath = null, lastSig = '';
  function render() {
    tick();
    lastSig = liveSignature();
    const r = route();
    const [p0, p1] = r.parts;
    let html;
    if (!p0) html = pageHome();
    else if (p0 === 'category') html = pageCategory(p1, r.q);
    else if (p0 === 'partner') html = pagePartner(p1);
    else if (p0 === 'compare') html = pageCompare();
    else if (p0 === 'search') html = pageSearch(r.q);
    else if (p0 === 'cart') html = pageCart();
    else if (p0 === 'checkout') html = pageCheckout(p1);
    else if (p0 === 'my-event') html = pageMyEvent(p1);
    else if (p0 === 'blueprint') html = pageBlueprint(p1);
    else if (p0 === 'confirmed') html = pageConfirmed(p1);
    else if (p0 === 'bookings') html = pageBookings(r.parts, r.q);
    else if (p0 === 'categories') html = pageCategories();
    else if (p0 === 'mandir') html = pageMandir();
    else if (p0 === 'about') html = pageAbout();
    else if (p0 === 'partners') html = pagePartners(r.q);
    else if (p0 === 'offers') html = pageOffers();
    else if (p0 === 'wishlist') html = pageWishlist();
    else if (p0 === 'partner-dashboard') html = pagePartnerDashboard();
    else if (p0 === 'concierge') html = pageConcierge(p1);
    else html = notFound();
    header();
    $('#app').innerHTML = html;
    if (r.path !== lastPath) { window.scrollTo(0, 0); lastPath = r.path; }
    dockRender();
  }
  // Refresh time-simulated states (partner replies, refunds, reschedules) without disturbing typing.
  setInterval(() => {
    const p0 = route().parts[0];
    if (!['checkout', 'my-event', 'bookings', 'concierge'].includes(p0) || liveSignature() === lastSig) return;
    const a = document.activeElement;
    if (a && $('#app').contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return;
    const y = window.scrollY; render(); window.scrollTo(0, y);
  }, 1000);

  /* ---------- Demo dock: WhatsApp live thread, Concierge tab, demo clock (session-only state, never persisted) ---------- */
  const WA_SAFE = 'We never ask for OTP, card number or UPI PIN on WhatsApp.';
  // Spec section 7 message table. Moments not yet wired (perk, blueprint) are ready for later tasks to push.
  const WA_MSG = {
    preview: () => 'Your event is ready to see.',
    host: h => `${h.name}, your ShaadiKart host, will call you within 2 hours.`,
    miss: () => `We tried to reach you. You can call us any time on ${CALL_NO}.`,
    perk: () => 'Your walk-through is confirmed. We look forward to meeting you.',
    blueprint: () => 'Your event blueprint is ready to review and approve.',
    payment: () => 'You can now pay on the ShaadiKart website.\n' + WA_SAFE,
    booked: () => 'Congratulations! Your booking is confirmed. You will receive a detailed confirmation shortly.',
    confirm: n => `✔ ${n} has confirmed your date.`,
    unavailable: n => `${n} is not available on your date. Your host will suggest alternatives.`
  };
  function waThreadPush(ev, type, text, from) {
    const th = journeyOf(ev).waThread, t = now();
    if (th.some(m => m.type === type && m.text === text && t - m.t < 2000)) return false;
    th.push({ t, type, text, status: 'sent', from: from || 'sk' });
    return true;
  }
  const waOnce = (ev, type, text) => journeyOf(ev).waThread.some(m => m.type === type) ? false : waThreadPush(ev, type, text);
  function waCatalog(ev, head) {
    const sv = liveSvcs(ev), st = sv.map(svcStatus), done = st.filter(x => x !== 'awaiting').length;
    const lines = sv.map((s, i) => `${st[i] === 'awaiting' ? '⏳' : '✔'} ${partner(s.partnerId).name} · ${catOf(partner(s.partnerId).cat).short}`);
    return `${head}\n${lines.join('\n')}\n${done === 0 ? `0 of ${sv.length} confirmed` : `${done} completed · ${sv.length - done} pending`}`;
  }
  // Pushes messages as each moment is reached. Only events that already have a thread (created via Send requests) take part.
  function waWatch() {
    let ch = false;
    S.events.forEach(ev => {
      if (!ev.journey || !ev.journey.waThread.length) return;
      const j = ev.journey, g = gateOf(ev), sv = liveSvcs(ev);
      let fresh = false;
      sv.forEach(s => {
        const ss = svcStatus(s), v = partner(s.partnerId);
        if (ss === 'awaiting' || ss === 'cancelled') return;
        if (waOnce(ev, 'confirm:' + s.id, (ss === 'unavailable' ? WA_MSG.unavailable : WA_MSG.confirm)(v.name))) { ch = true; fresh = true; }
      });
      // One catalog refresh per tick, after every confirm message, carrying the final count.
      if (fresh) waOnce(ev, 'catalog:' + sv.filter(x => svcStatus(x) !== 'awaiting').length, waCatalog(ev, 'Your catalog'));
      const stg = JOURNEY.findIndex(x => x[0] === journeyStage(ev));
      if (stg >= 2 && waOnce(ev, 'preview', WA_MSG.preview())) { ch = true; waOnce(ev, 'host', WA_MSG.host(j.host)); }
      g.calls.forEach(c => { if (c.result === 'No answer' && waOnce(ev, 'miss:' + c.n, WA_MSG.miss())) ch = true; });
      if (g.held && waOnce(ev, 'blueprint', WA_MSG.blueprint())) ch = true;
      if (j.blueprintApproved && waOnce(ev, 'payment', WA_MSG.payment())) ch = true;
      if (stg === 6 && waOnce(ev, 'booked', WA_MSG.booked())) ch = true;
    });
    if (ch) save();
    return ch;
  }

  const DOCK = { open: false, tab: 'wa', seen: {} };
  let dockHtmlLast = '';
  function dockEvent() {
    const r = route(), id = ['my-event', 'blueprint', 'confirmed'].includes(r.parts[0]) ? r.parts[1] : null;
    return S.events.find(e => e.id === id) || [...S.events].reverse().find(e => e.journey && e.journey.waThread.length) || S.events[S.events.length - 1];
  }
  const clockText = () => new Date(now()).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const waUnread = ev => ev ? Math.max(0, journeyOf(ev).waThread.length - (DOCK.seen[ev.id] || 0)) : 0;
  function dockHtml(ev) {
    const th = ev ? journeyOf(ev).waThread : [];
    if (DOCK.open && DOCK.tab === 'wa' && ev) DOCK.seen[ev.id] = th.length;
    const clock = `<div class="demo-clock"><div class="dc-h"><b>Demo clock</b><span id="dock-time">${clockText()}</span></div>
      <div class="dc-b">${[1, 60, 180].map(n => `<button type="button" class="${CLOCK.speed === n ? 'on' : ''}" data-act="clock-speed" data-speed="${n}" aria-pressed="${CLOCK.speed === n}">${n}×</button>`).join('')}<button type="button" class="dc-reset" data-act="clock-reset">Reset</button></div></div>`;
    const wa = !ev ? '<p class="dock-empty">No event yet.</p>' : `<div class="wa-thread" id="wa-thread" role="log" aria-live="polite">
        ${th.length ? th.map(m => `<div class="wa-msg ${m.from === 'me' ? 'me' : 'sk'}"><span class="wa-t">${esc(m.text)}</span><small>${hhmm(m.t)}</small></div>`).join('') : '<p class="dock-empty">Messages appear here after you send your requests.</p>'}
      </div>
      <div class="wa-foot"><p class="wa-safe">${ic('info')}<span>${WA_SAFE}</span></p>
        <div class="wa-chips">${['Reschedule', 'Ask a question', 'Speak to my host'].map(c => `<button type="button" data-act="dock-chip" data-chip="${c}">${c}</button>`).join('')}</div></div>`;
    const cg = !ev ? '<p class="dock-empty">No event yet.</p>' : `<div class="dock-cg">${cgDetail(ev)}</div>`;
    return `<div class="dock-h"><b>${ic('message')} Demo mode</b><button type="button" class="x-btn" data-act="dock-toggle" aria-label="Close demo dock">${ic('x')}</button></div>
      ${clock}
      <div class="dock-tabs" role="tablist"><button role="tab" aria-selected="${DOCK.tab === 'wa'}" class="${DOCK.tab === 'wa' ? 'on' : ''}" data-act="dock-tab" data-tab="wa">WhatsApp</button><button role="tab" aria-selected="${DOCK.tab === 'cg'}" class="${DOCK.tab === 'cg' ? 'on' : ''}" data-act="dock-tab" data-tab="cg">Concierge</button></div>
      <div class="dock-body ${DOCK.tab === 'wa' ? 'wa' : 'cg'}">${DOCK.tab === 'wa' ? wa : cg}</div>`;
  }
  // Re-renders only the dock (not the page). Skips the DOM write when nothing but the ticking clock changed.
  function dockRender() {
    let root = $('#demo-dock'); if (!root) return;
    const ev = dockEvent();
    document.body.classList.toggle('dock-open', DOCK.open);
    if (!DOCK.open) {
      const n = waUnread(ev);
      root.className = 'dock-closed';
      const h = ev ? `<button type="button" class="dock-toggle" data-act="dock-toggle" aria-label="Open demo dock${n ? ', ' + n + ' new messages' : ''}">${ic('message')}${n ? `<span class="dock-badge">${n}</span>` : ''}</button>` : '';
      if (h !== dockHtmlLast) { root.innerHTML = h; dockHtmlLast = h; }
      return;
    }
    root.className = 'demo-dock';
    const h = dockHtml(ev), key = h.replace(/(<span id="dock-time">)[^<]*/, '$1');
    const fa = document.activeElement;
    if (key !== dockHtmlLast && fa && root.contains(fa) && /INPUT|TEXTAREA|SELECT/.test(fa.tagName)) return; // keep typing and focus
    if (key !== dockHtmlLast) {
      const old = $('.dock-body', root), top = old ? old.scrollTop : 0, wasEnd = !old || old.scrollHeight - old.scrollTop - old.clientHeight < 40;
      root.innerHTML = h; dockHtmlLast = key;
      const nb = $('.dock-body', root);
      if (nb) nb.scrollTop = DOCK.tab === 'wa' && wasEnd ? nb.scrollHeight : top;
    } else { const t = $('#dock-time', root); if (t) t.textContent = clockText(); }
  }
  // Demo clock: at speed N, every real second adds (N - 1) seconds so now() runs N times faster.
  let clockTimer = null;
  function clockSet(speed) {
    CLOCK.speed = speed;
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    if (speed !== 1) clockTimer = setInterval(() => { CLOCK.offset += (CLOCK.speed - 1) * 1000; }, 1000);
  }
  setInterval(() => { waWatch(); dockRender(); }, 1000);

  /* ---------- auth (demo OTP) ---------- */
  let afterLogin = null;
  function loginModal(then, tab = 'customer') {
    if (then !== undefined) afterLogin = then || null;
    const seg = `<div class="seg seg3" role="tablist"><button role="tab" aria-selected="${tab === 'customer'}" class="${tab === 'customer' ? 'on' : ''}" data-act="login-tab" data-tab="customer">${ic('user')}Customer</button><button role="tab" aria-selected="${tab === 'partner'}" class="${tab === 'partner' ? 'on' : ''}" data-act="login-tab" data-tab="partner">${ic('store')}Partner</button><button role="tab" aria-selected="${tab === 'staff'}" class="${tab === 'staff' ? 'on' : ''}" data-act="login-tab" data-tab="staff">${ic('headset')}Staff</button></div>`;
    if (tab === 'staff') return openModal('Login / Sign Up', `${seg}<form data-form="staff-login" class="modal-b" style="padding:0">
      <p style="margin:0;color:var(--muted)">ShaadiKart staff only. Opens the Concierge console for meetings, calls and payment unlocks.</p>
      <label class="field">Executive<select name="who">${EXECS.map(x => `<option>${x}</option>`).join('')}</select></label>
      <label class="field">Access code<input name="code" required inputmode="numeric" maxlength="4" autocomplete="off" placeholder="Demo code: 1234"></label>
      <button class="btn btn-primary" type="submit">Open Concierge</button>
      <p class="note">${ic('info')}<span>Demo only. Real staff log in with their own credentials in the live product.</span></p></form>`);
    if (tab === 'partner') return openModal('Login / Sign Up', `${seg}<form data-form="partner-login" class="modal-b" style="padding:0">
      <p style="margin:0;color:var(--muted)">For venues, decorators, photographers and other ShaadiKart partners.</p>
      <label class="field">Your business<select name="pid">${D.CATEGORIES.map(c => `<optgroup label="${esc(c.name)}">${D.PARTNERS.filter(v => v.cat === c.id).map(v => `<option value="${v.id}">${esc(v.name)}</option>`).join('')}</optgroup>`).join('')}</select></label>
      <label class="field">Registered mobile<input name="phone" required inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10-digit number" autocomplete="off"></label>
      <button class="btn btn-primary" type="submit">Send OTP</button>
      <p class="note">${ic('info')}<span>New partner? Partner sign-up and KYC open in Phase 2. Demo only: nothing leaves this browser.</span></p></form>`);
    openModal('Login / Sign Up', `${seg}<form data-form="login-phone" class="modal-b" style="padding:0">
      <p style="margin:0;color:var(--muted)">Mobile number, OTP, name and city. Demo only: nothing leaves this browser.</p>
      <label class="field">Your name<input name="name" required placeholder="e.g. Priya Sharma" autocomplete="off"></label>
      <label class="field">Mobile number<input name="phone" required inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10-digit number" autocomplete="off"></label>
      <label class="field">City<select name="city">${D.LOCALITIES.map(l => `<option>${l}</option>`).join('')}</select></label>
      <button class="btn btn-primary" type="submit">Send OTP</button></form>`);
  }

  /* ---------- actions ---------- */
  function addSvcsToEvent(ev, lines, base) {
    lines.forEach((l, i) => ev.services.push({
      id: code('SV'), partnerId: l.v.id, pkg: l.p.id, price: l.price, rate: l.v.perPlate ? l.unit : 0, guests: ev.guests, diet: l.diet, requestedAt: base,
      respondAt: base + 1600 * (i + 1) + (l.v.busy ? 900 : 0), response: l.v.busy ? 'unavailable' : 'confirmed', confirmId: 'CNF-' + Math.floor(1000 + Math.random() * 9000), paid: 0, query: S.cart.query || '', reply: makeReply(l.v, S.cart.query || ''), qConfirmed: false
    }));
  }
  function sendRequests() {
    const lines = cartLines();
    if (!lines.length) return;
    const ce = S.cart.event;
    const ev = { id: 'SK-EV-' + Math.floor(10000 + Math.random() * 89999), name: ce.name || `My ${ce.type}`, type: ce.type, date: ce.date, guests: ce.guests, locality: ce.locality, createdAt: now(), services: [], payments: [], refunds: [], cancellations: [], reschedules: [], tickets: [], customer: S.user ? { name: S.user.name, phone: S.user.phone } : null };
    addSvcsToEvent(ev, lines, now());
    S.events.push(ev);
    waThreadPush(ev, 'catalog', waCatalog(ev, 'Your catalog'));
    S.cart.query = '';
    S.cart.items = [];
    save();
    go('#/my-event/' + ev.id);
    toast(`Requests sent to ${lines.length} partners`, 'arrowRight');
  }

  const ACT = {
    'sme-tab'(el) { SME.act = +el.dataset.n; smeRefresh(el); },
    'sme-spot'(el) { SME.tip = SME.tip === el.dataset.k ? null : el.dataset.k; smeRefresh(el); },
    'reserve-perk'(el) {
      const box = el.closest('.perk-card'), ev = S.events.find(e => e.id === box.dataset.ev);
      if (!ev) return;
      journeyOf(ev).visitRequested = now();
      waOnce(ev, 'visit', 'Walk-through confirmed \u2714 Your private walk-through and tasting this Saturday is reserved. Your host will share the time and gate details here.');
      save();
      document.querySelectorAll('.perk-card[data-ev="' + ev.id + '"]').forEach(c => { c.outerHTML = perkCard(ev); });
    },
    'sme-elem'(el) { SME.dtip = SME.dtip === el.dataset.k ? null : el.dataset.k; smeRefresh(el); },
    'approve-blueprint'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), j = ev && journeyOf(ev);
      if (!ev || j.blueprintApproved || !gateOf(ev).held) return;
      j.blueprintApproved = now();
      waThreadPush(ev, 'blueprint-approved', 'Your event blueprint has been approved');
      waOnce(ev, 'payment', WA_MSG.payment());
      save(); go('#/my-event/' + ev.id); toast('Blueprint approved', 'check');
    },
    'bp-change'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev); if (!ev) return;
      waThreadPush(ev, 'bp-change', 'I would like to change something in my Blueprint.', 'me');
      waThreadPush(ev, 'bp-change-r', `${journeyOf(ev).host.name.split(' ')[0]} will get back to you shortly to make the change.`);
      save(); DOCK.open = true; DOCK.tab = 'wa'; dockRender();
    },
    'dock-toggle'() { DOCK.open = !DOCK.open; dockRender(); },
    'dock-tab'(el) { DOCK.tab = el.dataset.tab; dockRender(); },
    'clock-speed'(el) { clockSet(+el.dataset.speed || 1); dockRender(); },
    'clock-reset'() { CLOCK.offset = 0; clockSet(1); render(); },
    'dock-chip'(el) {
      const ev = dockEvent(); if (!ev) return;
      const c = el.dataset.chip, h = journeyOf(ev).host;
      const rep = { 'Reschedule': 'No problem. You can change your walk-through time from My Event, or tell your host on the call.', 'Ask a question': 'Of course. Your host will answer every question on your call.', 'Speak to my host': `${h.name} will call you within 2 hours.` }[c];
      if (waThreadPush(ev, 'q:' + c, c, 'me')) waThreadPush(ev, 'qr:' + c, rep);
      save(); dockRender();
    },
    'close-modal': closeModal,
    'modal-bg': (el, e) => { if (e.target === el) closeModal(); },
    scroll(el) {
      const id = el.dataset.target;
      closeModal();
      const doScroll = () => { const t = document.getElementById(id); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      if (route().parts.length) { go('#/'); setTimeout(doScroll, 60); } else doScroll();
    },
    journey() {
      openModal('Customer Journey', `<div class="journey">
          <a class="phone" href="#/" data-act="scroll" data-target="categories" aria-label="Browse categories">${phoneHome()}</a>
          <span class="journey-arrow">${ic('arrowRight')}</span>
          <a class="phone" href="#/cart" aria-label="Open my cart">${phoneCart()}</a>
          <span class="journey-arrow">${ic('arrowRight')}</span>
          <a class="phone" href="#/bookings" aria-label="Open my bookings">${phoneDone()}</a>
        </div>
        <div class="journey-caps"><div><b>1 · Discover</b>Browse 12 categories</div><div><b>2 · One cart</b>Each partner confirms</div><div><b>3 · Booked</b>Track every service</div></div>
        <div class="modal-f"><a class="btn btn-gold" href="#/category/venues">Start planning ${ic('arrowRight')}</a></div>`, { wide: true });
    },
    'toggle-compare'(el) { toggleCompare(el.dataset.vid); render(); },
    'clear-compare'() { S.compare = []; save(); render(); },
    'save-later'(el) {
      const vid = el.dataset.vid;
      if (!S.cart.saved.some(s => s.partnerId === vid)) S.cart.saved.push({ partnerId: vid, pkg: 'silver' });
      S.cart.items = S.cart.items.filter(i => i.partnerId !== vid);
      save(); render(); toast('Saved for later', 'bookmark');
    },
    'move-saved'(el) { ACT['save-later'](el); },
    'saved-to-cart'(el) {
      const vid = el.dataset.vid, sv = S.cart.saved.find(s => s.partnerId === vid);
      S.cart.saved = S.cart.saved.filter(s => s.partnerId !== vid);
      if (!inCart(vid)) S.cart.items.push({ partnerId: vid, pkg: sv ? sv.pkg : 'silver' });
      save(); render(); toast('Moved to cart', 'cart');
    },
    'remove-saved'(el) { S.cart.saved = S.cart.saved.filter(s => s.partnerId !== el.dataset.vid); save(); render(); },
    'remove-cart'(el) { S.cart.items = S.cart.items.filter(i => i.partnerId !== el.dataset.vid); save(); render(); toast('Removed from cart', 'trash'); },
    'demo-cart'() {
      S.cart.items = [['royal-banquet', 'silver'], ['phoolwari', 'silver'], ['candid-frames', 'silver'], ['mithaas', 'silver'], ['beat-factory', 'silver'], ['glam-neha', 'silver']].map(([partnerId, pkg]) => ({ partnerId, pkg, diet: 'veg' }));
      S.cart.event.type = 'Wedding'; save(); render(); toast('Sample wedding cart added');
    },
    'send-requests'() { if (!S.user) loginModal(sendRequests); else sendRequests(); },
    'remove-svc'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), s = ev.services.find(x => x.id === el.dataset.svc);
      s.removed = true; save(); render(); toast('Removed. Your other services are unaffected.');
    },
    login() { loginModal(() => render()); },
    'partner-login'() { loginModal(null, 'partner'); },
    'staff-login'() { loginModal(null, 'staff'); },
    'staff-logout'() { S.staff = null; save(); closeModal(); go('#/'); toast('Staff logged out', 'headset'); },
    'meet-open'(el) { const ev = S.events.find(e => e.id === el.dataset.ev); if (ev) meetingModal(ev); },
    'call-us'(el) { const ev = S.events.find(e => e.id === el.dataset.ev), g = gateOf(ev); if (g.inbound || answered(g)) return; g.inbound = { t: now() }; save(); render(); toast(`Thank you. We received your call to ${CALL_NO}.`, 'phone'); },
    'wa-open'(el) { const ev = el.dataset.ev ? S.events.find(e => e.id === el.dataset.ev) : null; if (ev) { gateOf(ev).waRequested = now(); save(); } waModal(ev); },
    'wa-chip'(el) {
      const q = el.dataset.q, rep = { 'Reschedule my meeting': 'Of course. Please tell us a date and time that suits you and we will confirm it here.', 'I have a question': 'Please type your question here. Our team replies during working hours, 10 am to 7 pm.', 'Please call me': `You can call us any day from 10 am to 7 pm on ${CALL_NO}. We will be happy to help.` }[q];
      const c = $('#wa-chat'); if (!c) return;
      c.insertAdjacentHTML('beforeend', `<div class="wa-b me"><p>${esc(q)}</p></div><div class="wa-b"><p>${esc(rep)}</p></div>`); c.scrollTop = c.scrollHeight;
    },
    'wa-copy'(el) { try { navigator.clipboard.writeText(window.__waText || ''); toast('Message copied', 'check'); } catch (e) { toast('Copy is not available here', 'alert'); } },
    pset(el) {
      const box = el.closest('[data-sets]'), i = el.dataset.i;
      box.querySelectorAll('.ps-tabs button').forEach(b => b.classList.toggle('on', b === el));
      box.querySelectorAll('.ps-panel').forEach(p => { p.hidden = p.dataset.p !== i; });
    },
    'cg-held'(el) { const g = gateOf(S.events.find(e => e.id === el.dataset.ev)); g.held = now(); save(); render(); toast('Meeting marked completed', 'check'); },
    'cg-dial'(el) { const g = gateOf(S.events.find(e => e.id === el.dataset.ev)); if (g.calls.length) return; g.calls.push({ n: 1, t: now(), result: null }); save(); render(); },
    'cg-result'(el) {
      const g = gateOf(S.events.find(e => e.id === el.dataset.ev)), c = g.calls.find(x => !x.result); if (!c) return;
      c.result = el.dataset.res;
      if (c.result === 'No answer' && g.calls.length < 2) g.calls.push({ n: 2, t: now(), result: null }); // second attempt, back to back
      save(); render();
    },
    'cg-inbound'(el) { const g = gateOf(S.events.find(e => e.id === el.dataset.ev)); if (!g.inbound) g.inbound = { t: now() }; save(); render(); toast('Customer call logged', 'phone'); },
    'cg-unlock'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), g = gateOf(ev);
      if (!g.held || !verified(g) || !journeyOf(ev).blueprintApproved) return; g.unlocked = { t: now(), by: S.staff ? S.staff.name : 'ShaadiKart executive' }; save(); render(); toast('Payment unlocked for the customer', 'check');
    },
    'cg-wa-preview'(el) { waModal(S.events.find(e => e.id === el.dataset.ev)); },
    'cg-wa-send'(el) { const g = gateOf(S.events.find(e => e.id === el.dataset.ev)); g.waSent = now(); save(); render(); toast('WhatsApp catalog sent to the customer (demo)', 'message'); },
    'login-tab'(el) { loginModal(undefined, el.dataset.tab); },
    account() {
      if (!S.user && !S.partner && !S.staff) return loginModal(() => render());
      const mask = ph => '+91 ' + esc(ph.replace(/^(\d{2})\d{6}/, '$1••••••'));
      openModal('Your account', `${S.user ? `<h4 style="margin:0">${ic('user')} Customer</h4><dl class="kv"><dt>Name</dt><dd>${esc(S.user.name)}</dd><dt>Mobile</dt><dd>${mask(S.user.phone)}</dd><dt>City</dt><dd>${esc(S.user.city)}</dd></dl>
          <div class="modal-f" style="justify-content:flex-start"><a class="btn btn-ghost btn-sm" href="#/bookings">My Bookings</a><button class="btn btn-ghost btn-sm" data-act="logout">Log out customer</button></div>`
        : `<button class="btn btn-ghost" data-act="login">${ic('user')}Customer login</button>`}
        <hr style="border:0;border-top:1px solid var(--line);width:100%">
        ${S.partner ? `<h4 style="margin:0">${ic('store')} Partner</h4><dl class="kv"><dt>Business</dt><dd>${esc(partner(S.partner.id).name)}</dd><dt>Mobile</dt><dd>${mask(S.partner.phone)}</dd></dl>
          <div class="modal-f" style="justify-content:flex-start"><a class="btn btn-primary btn-sm" href="#/partner-dashboard">Partner dashboard</a><button class="btn btn-ghost btn-sm" data-act="partner-logout">Log out partner</button></div>`
        : `<button class="btn btn-ghost" data-act="partner-login">${ic('store')}Partner login</button>`}
        <hr style="border:0;border-top:1px solid var(--line);width:100%">
        ${S.staff ? `<h4 style="margin:0">${ic('headset')} ShaadiKart staff</h4><dl class="kv"><dt>Executive</dt><dd>${esc(S.staff.name)}</dd></dl>
          <div class="modal-f" style="justify-content:flex-start"><a class="btn btn-primary btn-sm" href="#/concierge">Concierge console</a><button class="btn btn-ghost btn-sm" data-act="staff-logout">Log out staff</button></div>`
        : `<button class="btn btn-ghost" data-act="staff-login">${ic('headset')}Staff login</button>`}
        <div class="modal-f"><button class="btn btn-ghost btn-sm" data-act="reset">Reset demo data</button></div>`);
    },
    logout() { S.user = null; save(); closeModal(); render(); toast('Customer logged out', 'user'); },
    'partner-logout'() { S.partner = null; save(); closeModal(); go('#/'); toast('Partner logged out', 'store'); },
    dd(el) {
      const m = el.nextElementSibling, open = m.hidden;
      document.querySelectorAll('.dd-menu').forEach(x => { x.hidden = true; });
      m.hidden = !open;
      el.setAttribute('aria-expanded', String(open));
    },
    menu() {
      openModal('Menu', `<nav class="mmenu">
        <a href="#/">${ic('home')}Home</a><a href="#/categories">${ic('menu')}All categories</a><a href="#/partners">${ic('store')}Our Partners</a><a href="#/offers">${ic('sparkles')}Offers</a><a href="#/about">${ic('heart')}About Us</a>
        <a href="#/wishlist">${ic('heart')}Wishlist</a><a href="#/cart">${ic('cart')}Cart</a><a href="#/bookings">${ic('calendarCheck')}My Bookings</a>
        <button data-act="chat">${ic('message')}Chat with us</button><button data-act="journey">${ic('list')}How it works</button><button data-act="policy">${ic('undo')}Cancellation &amp; refunds</button><button data-act="contact">${ic('phone')}Contact us</button>
        <button data-act="account">${ic('user')}${S.user || S.partner ? 'My account' : 'Login / Sign Up'}</button></nav>
        <label class="field">Location<select data-change="locality">${D.LOCALITIES.map(l => `<option ${S.locality === l ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`);
    },
    'search-modal'() {
      openModal('Search', `<form data-form="search" class="modal-b" style="padding:0">
        <label class="field">What are you looking for?<input name="q" placeholder="Venues, photographers, decorators…"></label>
        <label class="field">Location<select name="loc"><option value="">All Delhi NCR</option>${D.LOCALITIES.map(l => `<option ${S.locality === l ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label class="field">Event date<input type="date" name="date" min="${isoPlus(1)}"></label>
        <button class="btn btn-primary" type="submit">${ic('search')}Search</button></form>`);
    },
    plan(el) {
      readPlanInputs();
      const step = +el.dataset.step;
      if (step > 2 && !planDraft().cats.length) { toast('Pick at least one service first', 'alert'); return openPlan(2); }
      openPlan(step);
    },
    'plan-tab'(el) { PL.view = el.dataset.v; openPlan(2); },
    'plan-type'(el) { readPlanInputs(); const was = PL.type; PL.type = el.dataset.type; if (PL.type !== was) { PL.guests = GUEST_DEFAULT[PL.type] || 100; PL.gc = false; PL.budget = suggestBudget(PL.type, PL.guests, PL.locality); PL.bm = false; } openPlan(1); },
    // Selecting a service updates the page in place (no re-render), so nothing blinks.
    'plan-cat'(el) {
      const c = el.dataset.cat, on = !PL.cats.includes(c);
      PL.cats = on ? [...PL.cats, c] : PL.cats.filter(x => x !== c);
      el.classList.toggle('on', on); el.setAttribute('aria-pressed', String(on));
      const tile = el.closest('.plan-tile'); if (tile) { tile.classList.toggle('on', on); if (on) setTimeout(() => tile.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 60); }
      const ck = el.querySelector('.ck'); ck.classList.toggle('on', on); ck.innerHTML = ic(on ? 'check' : 'plus');
      const m = $('#modal-root');
      $('#plan-panel').innerHTML = planPanel();
      $('#plan-count').innerHTML = planCount();
      $('#plan-tabs').innerHTML = planTabs();
      const oc = m.querySelector('.plan-others-card .pc-nm'); if (oc) oc.innerHTML = planOthersTileText();
      const nb = m.querySelector('.plan-f .btn-primary'); if (nb) nb.disabled = !PL.cats.length;
    },
    // Step 2: + chooses a partner in place (no popup). The arrow beside it opens the details.
    'plan-choose'(el) {
      const c = el.dataset.cat, vid = el.dataset.vid;
      if (PL.picks[c] === vid) delete PL.picks[c]; else PL.picks[c] = vid;
      el.closest('.pt-list').querySelectorAll('.pt-p').forEach(b => { const on = PL.picks[c] === b.dataset.vid; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); b.querySelector('.pt-mark').innerHTML = ic(on ? 'check' : 'plus'); });
    },
    'plan-pick'(el) { PL.picks[el.dataset.cat] = el.dataset.vid; openPlan(3); },
    'plan-view'(el) { openLayer(el.dataset.cat, el.dataset.vid); },
    'close-layer'() { closeLayer(); },
    'layer-bg'(el, e) { if (e.target === el) closeLayer(); },
    'lv-cat'(el) { LV.cat = el.dataset.cat; LV.vid = PL.picks[LV.cat] || planOptions(LV.cat)[0].id; LV.artist = 0; renderLayerKeep(); },
    'lv-partner'(el) { LV.vid = el.dataset.vid; LV.artist = 0; LV.tier = 'silver'; renderLayerKeep(true); },
    'lv-artist'(el) { LV.artist = +el.dataset.i; renderLayerKeep(); },
    'lv-tier'(el) { LV.tier = el.dataset.t; renderLayerKeep(); },
    'lv-diet'(el) { PL.diet = el.dataset.diet; renderLayerKeep(); },
    'lv-choose'() { const v = partner(LV.vid), st = PL.step; PL.picks[LV.cat] = LV.vid; if (!PL.cats.includes(LV.cat)) PL.cats.push(LV.cat); closeLayer(); openPlan(st === 2 ? 2 : 3); toast(`${v.name} selected`, 'check'); },
    care() {
      openModal('ShaadiKart Care', `<div class="care-card">${ic('medical')}<div><b>Free with every ShaadiKart booking</b><span>If a medical emergency happens at your wedding, ShaadiKart arranges priority medical help: an on-call doctor and ambulance coordination to your venue.</span></div></div>
        <ul class="care-list"><li>Activated automatically when your first booking is confirmed</li><li>Covers the wedding day at your booked venue</li><li>Shown with an emergency line in My Bookings</li></ul>
        <p class="note">${ic('info')}<span>Demo promise for this concept website. Medical partners and service terms are to be finalised before launch.</span></p>`);
    },
    chat() { document.querySelectorAll('.dd-menu').forEach(m => { m.hidden = true; }); closeModal(); chatOpen(); },
    'chat-close'() { CHAT.open = false; chatRender(); },
    'chat-q'(el) { chatSend(el.dataset.q); },
    'pg-tier'(el) { PGTIER = el.dataset.t; render(); },
    'q-chip'(el) {
      const box = el.closest('.qfield'), ta = box.querySelector('textarea'), q = el.dataset.q;
      if (!ta.value.includes(q)) ta.value = (ta.value.trim() ? ta.value.trim() + '. ' : '') + q;
      if (ta.id === 'pl-query') PL.query = ta.value; else { S.cart.query = ta.value; save(); }
    },
    'confirm-queries'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev);
      ev.services.forEach(x => { if (svcStatus(x) === 'confirmed') x.qConfirmed = true; });
      save(); render(); toast(gateOn(ev) && !gateOf(ev).unlocked ? 'Thank you. Next, please schedule your meeting.' : 'Thank you. Payment is now open.', 'check');
    },
    'plan-diet'(el) { PL.diet = el.dataset.diet; openPlan(3); },
    'plan-cart'() { const n = planToCart(); closeModal(); toast(`${n} services added to your event cart`, 'cart'); go('#/cart'); },
    'plan-book'() { planToCart(); closeModal(); ACT['send-requests'](); },
    wish(el) {
      const vid = el.dataset.vid;
      if (isWished(vid)) { S.cart.saved = S.cart.saved.filter(s => s.partnerId !== vid); toast('Removed from wishlist', 'heart'); }
      else { S.cart.saved.push({ partnerId: vid, pkg: 'silver' }); toast(`${partner(vid).name} added to wishlist`, 'heart'); }
      save(); render();
    },
    policy() {
      openModal('Cancellation & refunds', `<p style="margin:0">Every service is booked and cancelled on its own. Cancelling one partner never cancels the others.</p>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>When you cancel</th><th class="r">Venues</th><th class="r">Other partners</th></tr></thead><tbody>
        <tr><td>90+ days before</td><td class="r">75%</td><td class="r">90%</td></tr><tr><td>30–89 days before</td><td class="r">50%</td><td class="r">90%</td></tr><tr><td>7–29 days before</td><td class="r">0%</td><td class="r">50%</td></tr><tr><td>Under 7 days</td><td class="r">0%</td><td class="r">0%</td></tr></tbody></table></div>
        <p class="note">${ic('info')}<span>% of the amount paid. Refunds go to the original payment method in 5–7 working days. Illustrative policy.</span></p>`);
    },
    contact() {
      openModal('Contact us', `<div class="side-list">
        <div class="callout">${ic('phone')}<span><b>Phone (demo)</b><br>+91 00000 00000 · 9 am – 9 pm</span></div>
        <div class="callout">${ic('message')}<span><b>Email (demo)</b><br>help@shaadikart.example</span></div>
        <div class="callout gold">${ic('info')}<span>Have a booking? Raise a ticket from My Bookings → Support so we can see your order.</span></div></div>
        <div class="modal-f"><a class="btn btn-primary" href="#/bookings/_/support">Go to Support</a></div>`);
    },
    reset() {
      openModal('Reset demo data?', `<p style="margin:0">This clears your cart, bookings and login on this browser and restores the sample wedding booking.</p>
        <div class="modal-f"><button class="btn btn-ghost" data-act="close-modal">Keep my data</button><button class="btn btn-danger" data-act="do-reset">Reset</button></div>`);
    },
    'do-reset'() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } S = seed(); closeModal(); go('#/'); toast('Demo data reset'); },
    cancel(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev);
      const scope = el.dataset.scope;
      const svcs = scope === 'event' ? activeSvcs(ev).filter(s => svcStatus(s) !== 'awaiting') : [ev.services.find(s => s.id === el.dataset.svc)];
      const rows = svcs.map(s => { const p = policyFor(s, ev); return { s, p, refund: Math.round(s.paid * p.pct / 100) }; });
      const paid = rows.reduce((a, r) => a + r.s.paid, 0), refund = rows.reduce((a, r) => a + r.refund, 0);
      const others = activeSvcs(ev).filter(s => !svcs.includes(s));
      openModal(scope === 'event' ? 'Cancel entire event' : `Cancel ${partner(svcs[0].partnerId).name}?`, `<form data-form="cancel" data-ev="${ev.id}" data-scope="${scope}" data-svcs="${svcs.map(s => s.id).join(',')}" class="modal-b" style="padding:0">
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Service</th><th class="r">Paid</th><th class="r">Refund</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td><b>${esc(partner(r.s.partnerId).name)}</b><br><small>${r.p.days} days before event · ${r.p.pct}% policy</small></td><td class="r">${inr(r.s.paid)}</td><td class="r"><b>${inr(r.refund)}</b></td></tr>`).join('')}
        <tr><td><b>Total</b></td><td class="r">${inr(paid)}</td><td class="r"><b style="color:var(--green)">${inr(refund)}</b></td></tr></tbody></table></div>
        ${scope === 'service' && others.length ? `<div class="callout gold">${ic('shield')}<span><b>Only this service is cancelled.</b> These stay confirmed: ${others.map(s => esc(partner(s.partnerId).name)).join(', ')}.</span></div>` : ''}
        <label class="field">Reason<select name="reason">${['Changed plans', 'Found a better option', 'Budget changed', 'Event postponed', 'Partner issue', 'Other'].map(x => `<option>${x}</option>`).join('')}</select></label>
        <p class="note">${ic('info')}<span>Refund goes back to the original payment method in 5–7 working days (illustrative). The ShaadiKart platform fee is non-refundable.</span></p>
        <div class="modal-f"><button type="button" class="btn btn-ghost" data-act="close-modal">Keep booking</button><button class="btn btn-danger" type="submit">Confirm cancellation</button></div></form>`);
    },
    'pay-balance'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), s = ev.services.find(x => x.id === el.dataset.svc);
      const due = svcTotal(s) - s.paid;
      openModal('Pay balance', `<form data-form="pay-balance" data-ev="${ev.id}" data-svc="${s.id}" class="modal-b" style="padding:0">
        <div class="sum-row"><span>${esc(partner(s.partnerId).name)}</span><span>${inr(svcTotal(s))}</span></div>
        <div class="sum-row"><span>Already paid</span><span>−${inr(s.paid)}</span></div>
        <div class="sum-row total"><span>Balance to pay</span><span>${inr(due)}</span></div>
        <p class="note">${ic('info')}<span>No platform fee on the balance: it was charged once with your first payment.</span></p>
        <h3 style="margin:4px 0 0">Payment method</h3>
        ${payMethods(due)}
        <button class="btn btn-gold" type="submit">Pay ${inr(due)}</button></form>`);
    },
    receipt(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), p = ev.payments.find(x => x.id === el.dataset.pay);
      openModal('Payment receipt', `<div class="receipt">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">${logo()}<span class="tag tag-green">${ic('check')}Paid</span></div>
        <dl class="kv" style="margin-top:12px"><dt>Receipt no.</dt><dd>${p.id.replace('PAY', 'RCPT')}</dd><dt>Transaction</dt><dd>${p.id}</dd><dt>Date</dt><dd>${fmtDT(p.t)}</dd><dt>Billed to</dt><dd>${esc(S.user ? S.user.name : 'Customer')}</dd><dt>Event</dt><dd>${esc(ev.name)} · ${fmtDate(ev.date)}</dd><dt>Method</dt><dd>${esc(p.method)} · ${esc(p.kind)}</dd></dl>
        <div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>Service</th><th class="r">Amount</th></tr></thead><tbody>
          ${p.items.map(i => { const s = ev.services.find(x => x.id === i.svcId), v = partner(s.partnerId); return `<tr><td>${esc(v.name)}<br><small>${esc(catOf(v.cat).short)} · ${s.confirmId}</small></td><td class="r">${inr(i.amount)}</td></tr>`; }).join('')}
          ${p.fee ? `<tr><td>ShaadiKart platform fee (0.5% of cart value) + 18% GST</td><td class="r">${inr(p.fee)}</td></tr>` : ''}
          <tr><td><b>Total paid</b></td><td class="r"><b>${inr(p.amount)}</b></td></tr></tbody></table></div>
        <p class="note" style="margin-top:10px">${ic('info')}<span>Demo receipt. Not a tax invoice. Partner GST invoices would be issued by each partner.</span></p></div>
        `);
    }
  };

  function toggleCompare(vid) {
    if (S.compare.includes(vid)) S.compare = S.compare.filter(x => x !== vid);
    else if (S.compare.length >= 3) { toast('You can compare up to 3 partners', 'alert'); return; }
    else S.compare.push(vid);
    save();
  }

  function simulatePayment(then) {
    openModal('Processing payment', `<div style="text-align:center;padding:16px 0"><span class="spin" style="width:34px;height:34px;color:var(--primary);border-width:3px"></span><p style="margin:12px 0 0;color:var(--muted)">Confirming with the payment partner (demo)…</p></div>`, { noClose: true });
    setTimeout(() => { closeModal(); then(); }, 1500);
  }

  const FORMS = {
    chat(f) { const m = f.m.value; f.m.value = ''; chatSend(m); },
    search(f) {
      const q = f.q.value.trim(), loc = f.loc ? f.loc.value : '', date = f.date ? f.date.value : '';
      if (date) { S.cart.event.date = date; save(); }
      closeModal();
      go('#/search?q=' + encodeURIComponent(q) + (loc ? '&loc=' + encodeURIComponent(loc) : ''));
    },
    'staff-login'(f) {
      if (f.code.value.trim() !== '1234') { toast('Incorrect code. Use 1234 in this demo.', 'alert'); return; }
      S.staff = { name: f.who.value }; save(); closeModal(); toast(`Welcome, ${S.staff.name}`, 'headset'); go('#/concierge');
    },
    meeting(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev), g = gateOf(ev), d = f.date.value;
      if (!d || d < isoPlus(1)) { toast('Please pick a date from tomorrow onwards', 'alert'); return; }
      const m = g.meeting, next = { date: d, time: f.time.value, mode: f.mode.value };
      if (m) { if (m.date === next.date && m.time === next.time && m.mode === next.mode) { closeModal(); return; } g.meeting = { ...next, status: 'scheduled', changes: (m.changes || 0) + 1, history: [...(m.history || []), `${fmtDate(m.date)} ${m.time}`] }; }
      else g.meeting = { ...next, status: 'scheduled', changes: 0, history: [] };
      save(); closeModal(); render(); toast(m ? 'Meeting rescheduled' : 'Meeting confirmed', 'calendarCheck');
    },
    'partner-login'(f) {
      const pid = f.pid.value, phone = f.phone.value.trim();
      if (!/^\d{10}$/.test(phone)) { toast('Enter a 10-digit mobile number', 'alert'); return; }
      openModal('Verify OTP', `<form data-form="partner-otp" data-pid="${esc(pid)}" data-phone="${esc(phone)}" class="modal-b" style="padding:0">
        <p style="margin:0;color:var(--muted)">Partner login for <b>${esc(partner(pid).name)}</b>. OTP sent to +91 ${esc(phone.slice(0, 2))}••••••${esc(phone.slice(-2))}.</p>
        <div class="callout gold">${ic('info')}<span>Demo OTP: <b>1234</b></span></div>
        <label class="field">OTP<input name="otp" inputmode="numeric" maxlength="4" required autocomplete="one-time-code"></label>
        <button class="btn btn-primary" type="submit">Verify &amp; open dashboard</button></form>`);
    },
    'partner-otp'(f) {
      if (f.otp.value !== '1234') { toast('Incorrect OTP. Use 1234 in this demo.', 'alert'); return; }
      S.partner = { id: f.dataset.pid, phone: f.dataset.phone };
      save(); closeModal(); toast(`Welcome, ${partner(S.partner.id).name}!`, 'store');
      go('#/partner-dashboard');
    },
    'add-to-cart'(f) {
      const vid = f.dataset.vid, pkg = f.pkg.value, diet = f.diet ? f.diet.value : 'veg';
      if (f.date.value) S.cart.event.date = f.date.value;
      const ex = inCart(vid);
      if (ex) { ex.pkg = pkg; ex.diet = diet; } else S.cart.items.push({ partnerId: vid, pkg, diet });
      S.cart.saved = S.cart.saved.filter(s => s.partnerId !== vid);
      save(); render(); toast(ex ? 'Package updated' : `${partner(vid).name} added to your cart`, 'cart');
    },
    'login-phone'(f) {
      const name = f.name.value.trim(), phone = f.phone.value.trim(), city = f.city.value;
      if (!/^\d{10}$/.test(phone)) { toast('Enter a 10-digit mobile number', 'alert'); return; }
      openModal('Verify OTP', `<form data-form="login-otp" data-name="${esc(name)}" data-phone="${esc(phone)}" data-city="${esc(city)}" class="modal-b" style="padding:0">
        <p style="margin:0;color:var(--muted)">Enter the OTP sent to +91 ${esc(phone.slice(0, 2))}••••••${esc(phone.slice(-2))}.</p>
        <div class="callout gold">${ic('info')}<span>Demo OTP: <b>1234</b></span></div>
        <label class="field">OTP<input name="otp" inputmode="numeric" maxlength="4" required autocomplete="one-time-code"></label>
        <button class="btn btn-primary" type="submit">Verify &amp; continue</button></form>`);
    },
    'login-otp'(f) {
      if (f.otp.value !== '1234') { toast('Incorrect OTP. Use 1234 in this demo.', 'alert'); return; }
      S.user = { name: f.dataset.name, phone: f.dataset.phone, city: f.dataset.city };
      save(); closeModal(); toast(`Welcome, ${S.user.name.split(' ')[0]}!`, 'heart');
      const fn = afterLogin; afterLogin = null;
      if (fn) fn(); else render();
    },
    pay(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev);
      if (gateOn(ev) && !gateOf(ev).unlocked) { toast('Payment opens after your meeting, verification call and Blueprint approval', 'alert'); return; }
      const full = f.amt.value === 'full', method = f.method.value;
      simulatePayment(() => {
        const svcs = liveSvcs(ev).filter(s => svcStatus(s) === 'confirmed');
        const pay = { id: 'PAY-' + Math.floor(10000 + Math.random() * 89999), t: Date.now(), method, kind: full ? 'Full payment' : 'Advance (25%)', items: [] };
        svcs.forEach(s => { const a = full ? svcTotal(s) : Math.round(svcTotal(s) * ADV); s.paid += a; pay.items.push({ svcId: s.id, amount: a }); });
        if (!ev.feePaid) { pay.fee = feeParts(svcs.reduce((a, x) => a + svcTotal(x), 0)).total; ev.feePaid = true; }
        pay.amount = pay.items.reduce((a, b) => a + b.amount, 0) + (pay.fee || 0);
        if (pay.method === 'UPI' && pay.amount > UPI_LIMIT) pay.method = 'UPI × ' + Math.ceil(pay.amount / UPI_LIMIT);
        ev.payments.push(pay); save();
        go('#/confirmed/' + ev.id);
      });
    },
    'pay-balance'(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev), s = ev.services.find(x => x.id === f.dataset.svc), method = f.method.value;
      simulatePayment(() => {
        const a = svcTotal(s) - s.paid; s.paid += a;
        ev.payments.push({ id: 'PAY-' + Math.floor(10000 + Math.random() * 89999), t: Date.now(), method: method === 'UPI' && a > UPI_LIMIT ? 'UPI × ' + Math.ceil(a / UPI_LIMIT) : method, kind: 'Balance', items: [{ svcId: s.id, amount: a }], amount: a });
        save(); render(); toast(`Balance paid for ${partner(s.partnerId).name}`, 'wallet');
      });
    },
    cancel(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev), scope = f.dataset.scope, ids = f.dataset.svcs.split(',');
      const t0 = Date.now(); let paid = 0, refund = 0, pct = 0, refundId = null;
      ids.forEach(id => {
        const s = ev.services.find(x => x.id === id); const p = policyFor(s, ev); const r = Math.round(s.paid * p.pct / 100);
        s.cancelledAt = t0; paid += s.paid; refund += r; pct = p.pct;
        if (r > 0) {
          const pay = ev.payments.find(x => x.items.some(i => i.svcId === id));
          const rf = { id: code('RF'), t: t0, svcIds: [id], amount: r, method: pay ? pay.method : 'UPI' };
          ev.refunds.push(rf); refundId = refundId || rf.id;
        }
      });
      ev.cancellations.push({ id: code('CN'), t: t0, scope, svcIds: ids, reason: f.reason.value, paid, pct, refundAmount: refund, refundId: scope === 'service' ? refundId : null });
      save(); closeModal();
      toast(scope === 'event' ? 'Event cancelled. Refunds initiated.' : `${partner(ev.services.find(x => x.id === ids[0]).partnerId).name} cancelled. Other services stay confirmed.`, 'undo');
      go(`#/bookings/${ev.id}/${refund > 0 ? 'refunds' : 'cancellations'}`);
    },
    reschedule(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev);
      const scope = f.scope.value, to = f.to.value;
      const svcs = scope === 'event' ? activeSvcs(ev).filter(s => svcStatus(s) !== 'awaiting') : [ev.services.find(s => s.id === scope)];
      const t0 = now(), responses = {};
      svcs.forEach((s, i) => { responses[s.id] = t0 + 4000 * (i + 1); });
      ev.reschedules.push({ id: code('RS'), t: t0, from: scope === 'event' ? ev.date : svcDate(ev, svcs[0]), to, scope: scope === 'event' ? 'event' : 'service', svcIds: svcs.map(s => s.id), reason: f.reason.value.trim(), responses, applied: false });
      save(); go(`#/bookings/${ev.id}/reschedule`); render(); toast('Reschedule request sent to ' + svcs.length + ' partner' + (svcs.length > 1 ? 's' : ''), 'calendar');
    },
    ticket(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev);
      ev.tickets.push({ id: 'TK-' + Math.floor(1000 + Math.random() * 8999), t: Date.now(), type: f.type.value, svcId: f.svc.value || null, subject: f.subject.value.trim(), desc: f.desc.value.trim() });
      save(); go(`#/bookings/${ev.id}/support`); render(); toast('Ticket raised. We reply within 24 hours.', 'message');
    },
    'event-details'() { /* saved on change */ }
  };

  const CHANGE = {
    locality(el) { S.locality = el.value; const ev = S.cart.event; ev.locality = el.value; if (!ev.bm) ev.budget = suggestBudget(ev.type, ev.guests, ev.locality); save(); toast(`Showing partners near ${el.value}`, 'pin'); },
    compare(el) { toggleCompare(el.value); render(); },
    nav(el) { go(el.value); },
    'pl-gsel'(el) {
      const n = el.parentElement.querySelector('input'); const custom = el.value === 'custom';
      n.hidden = !custom; PL.gc = custom; PL.guests = custom ? Math.max(1, +n.value || PL.guests) : +el.value;
      if (!PL.bm) syncPlanBudget();
      if (custom) n.focus();
    },
    'cg-notes'(el) { gateOf(S.events.find(e => e.id === el.dataset.ev)).notes = el.value; save(); },
    'pl-loc'(el) { PL.locality = el.value; if (!PL.bm) syncPlanBudget(); },
    'pl-guests'(el) { PL.gc = true; PL.guests = Math.max(1, +el.value || PL.guests); if (!PL.bm) syncPlanBudget(); },
    'pl-budget'(el) { PL.bm = true; PL.budget = Math.max(0, +el.value || 0); },
    'pl-query'(el) { PL.query = el.value; },
    'cart-query'(el) { S.cart.query = el.value; save(); },
    'pay-amt'(el) { const f = el.closest('form'); $('#pay-methods').innerHTML = payMethods(+el.dataset.amount, f.method ? f.method.value : ''); },
    'pp-calc'(el) {
      const f = el.closest('form'), v = partner(f.dataset.vid), diet = f.diet ? f.diet.value : 'veg';
      f.querySelectorAll('.diet-form label').forEach(l => l.classList.toggle('on', l.querySelector('input').checked));
      $('#pp-total').innerHTML = ppTotal(v, f.pkg.value, diet, S.cart.event.guests);
    },
    diet(el) { const it = inCart(el.dataset.vid); if (it) { it.diet = el.value; save(); render(); } }
  };

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    document.querySelectorAll('.dd-menu:not([hidden])').forEach(m => { if (!m.parentElement.contains(e.target)) m.hidden = true; });
    const a = e.target.closest('a[href^="#/"]');
    if (a && !a.dataset.act && !e.metaKey && !e.ctrlKey) { e.preventDefault(); closeModal(); go(a.getAttribute('href')); return; }
    const el = e.target.closest('[data-act]');
    if (!el || !ACT[el.dataset.act]) return;
    if (el.dataset.act !== 'modal-bg') e.preventDefault();
    ACT[el.dataset.act](el, e);
  });
  document.addEventListener('input', e => {
    const tm = e.target.closest('[data-input="sme-time"]');
    if (tm) {
      const st = tm.closest('.sme-stage'), ev = S.events.find(x => x.id === st.dataset.ev), v = ev && smeVenue(ev);
      if (!v) return;
      const t = SME.time = +tm.value;
      st.querySelector('#sme-fpvis').innerHTML = floorVis(ev, v, t);
      st.querySelector('#sme-fpc').innerHTML = counterText(ev, t);
      st.querySelector('#sme-phase').textContent = SME_PHASE[smePhase(t)];
      st.querySelector('#sme-strip').outerHTML = silhouetteStrip(t);
      return;
    }
    const el = e.target.closest('[data-input="sme-sweep"]');
    if (!el) return;
    const w = SME.sweep = +el.value, st = el.closest('.sme-act2');
    st.querySelector('#sme-layer').style.clipPath = `inset(0 ${100 - w}% 0 0)`;
    st.querySelector('#sme-line').style.left = w + '%';
    st.querySelector('#sme-hs').hidden = w < 55;
  });
  document.addEventListener('change', e => {
    const el = e.target.closest('[data-change]');
    if (el && CHANGE[el.dataset.change]) { CHANGE[el.dataset.change](el); return; }
    const f = e.target.closest('form[data-form="event-details"]');
    if (f) {
      const ev = S.cart.event;
      const g0 = ev.guests, l0 = ev.locality, typeChanged = f.type.value !== ev.type;
      if (typeChanged) { ev.type = f.type.value; ev.guests = GUEST_DEFAULT[ev.type] || 100; ev.gc = false; f.guestsSel.value = String(ev.guests); ev.bm = false; }
      else if (f.guestsSel.value === 'custom') { ev.gc = true; ev.guests = Math.max(1, +f.guests.value || ev.guests); }
      else { ev.gc = false; ev.guests = +f.guestsSel.value; }
      ev.type = f.type.value; ev.name = f.name.value.trim(); ev.date = f.date.value || ev.date;
      ev.locality = f.locality.value;
      if (e.target.name === 'budget') { ev.bm = true; ev.budget = Math.max(0, +f.budget.value || 0); }
      else if (typeChanged || ((ev.guests !== g0 || ev.locality !== l0) && !ev.bm)) ev.budget = suggestBudget(ev.type, ev.guests, ev.locality);
      save(); render();
    }
  });
  // Two windows on the same browser (customer and Concierge) stay in sync.
  window.addEventListener('storage', e => {
    if (e.key !== KEY || !e.newValue) return;
    try { const n = JSON.parse(e.newValue); if (n && n.v === 1) { S = n; render(); dockRender(); } } catch (err) { /* ignore */ }
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    FORMS[f.dataset.form](f);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if ($('#layer-root .modal')) closeLayer(); else if ($('#modal-root .x-btn')) closeModal(); } });
  window.addEventListener('scroll', () => { $('#site-header').classList.toggle('solid', window.scrollY > 30); }, { passive: true });
  window.addEventListener('hashchange', () => { curQ = nextQ || new URLSearchParams(); nextQ = null; render(); });

  document.body.insertAdjacentHTML('beforeend', `<button id="chat-fab" class="chat-fab" data-act="chat" aria-label="Chat with ShaadiKart Assistant">${ic('message')}<span>Chat</span></button><div id="chat-root"></div>`);
  footer();
  render();
})();
