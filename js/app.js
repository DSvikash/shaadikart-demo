/* ShaadiKart concept demo — customer app. Vanilla JS, hash routing, state in localStorage. */
(function () {
  'use strict';
  const D = window.SK_DATA;
  const GST = 0.18, ADV = 0.25, DAY = 864e5, KEY = 'shaadikart-demo-v2';

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
  const isoPlus = days => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);

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
    ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>'
  };
  const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  let logoN = 0;
  const logoMark = () => {
    const g = 'lg' + (++logoN);
    return `<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd76e"/><stop offset="1" stop-color="#e8952c"/></linearGradient></defs><circle cx="18.5" cy="29" r="11" fill="none" stroke="url(#${g})" stroke-width="3.2"/><circle cx="29.5" cy="29" r="11" fill="none" stroke="url(#${g})" stroke-width="3.2"/><path d="M24 12.6c-1.5-2.7-6.2-2.2-6.2 1.6 0 2.7 3.3 4.7 6.2 7.1 2.9-2.4 6.2-4.4 6.2-7.1 0-3.8-4.7-4.3-6.2-1.6z" fill="url(#${g})"/></svg>`;
  };
  const logo = (light = false) => `<span class="logo${light ? ' light' : ''}">${logoMark()}<span>Shaadi<span class="k">Kart</span></span></span>`;

  /* ---------- state ---------- */
  function seed() {
    const now = Date.now();
    const ev = {
      id: 'SK-EV-24871', name: 'Priya & Arjun Wedding', type: 'Wedding', date: '2027-02-14', guests: 300, locality: 'Delhi',
      createdAt: now - 20 * DAY, services: [], payments: [], refunds: [], cancellations: [], reschedules: [], tickets: []
    };
    const picks = [['royal-banquet', 'silver'], ['phoolwari', 'silver'], ['candid-frames', 'silver'], ['swaad-caterers', 'silver'], ['glam-neha', 'silver'], ['sound-wave', 'silver']];
    picks.forEach(([vid, pid], i) => {
      const v = partner(vid);
      ev.services.push({ id: 'SV-' + (101 + i), partnerId: vid, pkg: pid, price: pkgOf(v, pid).price, requestedAt: now - 20 * DAY, respondAt: now - 20 * DAY + (2 + i) * 3600e3, response: 'confirmed', confirmId: 'CNF-' + (5521 + i * 7), paid: 0 });
    });
    const pay = { id: 'PAY-70412', t: now - 19 * DAY, method: 'UPI', kind: 'Advance (25%)', items: [] };
    ev.services.forEach(s => { const a = Math.round(svcTotal(s) * ADV); s.paid = a; pay.items.push({ svcId: s.id, amount: a }); });
    pay.amount = pay.items.reduce((a, b) => a + b.amount, 0);
    ev.payments.push(pay);
    // Earlier cancellation of the DJ only — venue, catering etc. remain booked.
    const dj = ev.services[5];
    dj.cancelledAt = now - 9 * DAY;
    const rf = { id: 'RF-31877', t: now - 9 * DAY, svcIds: [dj.id], amount: Math.round(dj.paid * 0.9), method: 'UPI' };
    ev.refunds.push(rf);
    ev.cancellations.push({ id: 'CN-20931', t: now - 9 * DAY, scope: 'service', svcIds: [dj.id], reason: 'Changed plans — booking a live band instead', paid: dj.paid, pct: 90, refundAmount: rf.amount, refundId: rf.id });
    ev.tickets.push({ id: 'TK-1042', t: now - 15 * DAY, type: 'Question', svcId: ev.services[1].id, subject: 'Can the mandap colours be changed to peach?', desc: 'We would like peach and ivory instead of red.', resolved: true, reply: 'Phoolwari confirmed the colour change at no extra cost.' });
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
    if (Date.now() < s.respondAt) return 'awaiting';
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
  const refundStage = rf => { const el = Date.now() - rf.t; let k = 0; REFUND_AT.forEach((a, i) => { if (el >= a) k = i; }); return k; };
  const ticketStatus = tk => tk.resolved ? ['tag-green', 'Resolved'] : (Date.now() - tk.t > 20e3 ? ['tag-plum', 'In review'] : ['tag-amber', 'Open']);
  function policyFor(s, ev) {
    const v = partner(s.partnerId);
    const tiers = D.POLICY[v.cat] || D.POLICY.default;
    const days = Math.max(0, Math.floor((new Date(svcDate(ev, s)) - Date.now()) / DAY));
    const tier = tiers.find(t => days >= t.minDays);
    return { days, pct: tier.pct, tiers };
  }
  const policyText = cat => (D.POLICY[cat] || D.POLICY.default).map(t => t.minDays ? `${t.pct}% refund if cancelled ${t.minDays}+ days before` : `${t.pct}% refund within the last window`).join(' · ');

  // Applies reschedules once every partner has accepted (time-simulated).
  function tick() {
    let changed = false;
    S.events.forEach(ev => ev.reschedules.forEach(r => {
      if (!r.applied && Object.values(r.responses).every(t => Date.now() >= t)) {
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
    ev.reschedules.map(r => Object.values(r.responses).filter(t => Date.now() >= t).length).join(),
    ev.tickets.map(t => ticketStatus(t)[1]).join()
  ].join('|')).join('#');

  /* ---------- cart ---------- */
  const inCart = vid => S.cart.items.find(i => i.partnerId === vid);
  const cartCount = () => S.cart.items.length;
  const offerPrice = (v, p) => v.offer ? Math.round(p.price * (1 - v.offer / 100) / 100) * 100 : p.price;
  const fromPrice = v => offerPrice(v, v.packages[0]);
  const priceTag = (v, p) => v.offer ? `<s style="color:var(--muted);font-weight:400;margin-right:6px">${inr(p.price)}</s>${inr(offerPrice(v, p))}` : inr(p.price);
  const offerTag = v => v.offer ? `<span class="tag tag-gold">${ic('sparkles')}${v.offer}% off</span>` : '';
  const isWished = vid => S.cart.saved.some(s => s.partnerId === vid);
  const cartLines = () => S.cart.items.map(i => { const v = partner(i.partnerId); const p = pkgOf(v, i.pkg); return { ...i, v, p, price: offerPrice(v, p) }; });
  function cartTotals() {
    const sub = cartLines().reduce((a, l) => a + l.price, 0);
    const gst = Math.round(sub * GST);
    return { sub, gst, total: sub + gst, advance: Math.round((sub + gst) * ADV) };
  }

  /* ---------- UI primitives ---------- */
  function toast(msg, icon = 'check') {
    const t = document.createElement('div');
    t.className = 'toast'; t.innerHTML = ic(icon) + '<span>' + esc(msg) + '</span>';
    $('#toast-root').appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
  function openModal(title, body, opts = {}) {
    $('#modal-root').innerHTML = `<div class="modal-bg" data-act="modal-bg"><div class="modal${opts.wide ? ' modal-wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-h"><h3>${esc(title)}</h3>${opts.noClose ? '' : `<button class="x-btn" data-act="close-modal" aria-label="Close">${ic('x')}</button>`}</div>
      <div class="modal-b">${body}</div></div></div>`;
    const f = $('#modal-root input, #modal-root select, #modal-root button.btn');
    if (f) f.focus();
  }
  const closeModal = () => { $('#modal-root').innerHTML = ''; };

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
    const who = S.user ? esc(S.user.name.split(' ')[0]) : S.partner ? esc(partner(S.partner.id).name) : 'Login / Sign Up';
    const navA = (h, l, on) => `<a href="${h}" class="${on ? 'on' : ''}">${l}</a>`;
    $('#site-header').className = p0 === '' ? 'over' : '';
    $('#site-header').innerHTML = `<div class="wrap hdr">
      <a href="#/" class="brand" aria-label="ShaadiKart home">${logo(true)}<small>Plan Everything. Book Everything. Celebrate Everything.</small></a>
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
        <div class="dd"><button data-act="dd" aria-haspopup="true">Help ${ic('chevronDown')}</button>
          <div class="dd-menu dd-right" hidden>
            <button data-act="journey">${ic('list')}How it works</button>
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
      <div>${logo(true)}<p style="margin:10px 0 0;font-size:13.5px">Plan Everything. Book Everything. Celebrate Everything.</p><div class="script">One Platform. Every Event. One Cart.</div></div>
      <div><h4>Explore</h4>${D.CATEGORIES.slice(0, 5).map(c => `<a href="#/category/${c.id}">${esc(c.name)}</a>`).join('')}<a href="#/categories">All categories</a></div>
      <div><h4>Your event</h4><a href="#/cart">My Cart</a><a href="#/wishlist">Wishlist</a><a href="#/bookings">My Bookings</a><a href="#/bookings/_/refunds">Refund tracker</a><a href="#/bookings/_/support">Help &amp; support</a></div>
      <div><h4>ShaadiKart</h4><a href="#/partners">Our Partners</a><a href="#/offers">Offers</a><button data-act="partner-login">Partner login</button><button data-act="reset">Reset demo data</button></div>
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
      <div class="ph-wrap"><a href="#/partner/${v.id}" class="ph" ${bg(v.photos[0], 600)} aria-label="${esc(v.name)}"><span class="tag tag-green">${ic('shield')}Verified</span></a>${heartBtn(v.id)}</div>
      <div class="body">
        <div class="meta"><span>${esc(c.short)}</span>·<span>${esc(v.area)}, ${esc(v.locality)}</span></div>
        <h3><a href="#/partner/${v.id}" style="color:inherit">${esc(v.name)}</a></h3>
        <div class="meta"><span class="stars">${ic('star')}${v.rating}</span><span>(${v.reviews} verified reviews)</span></div>
        <div class="price">${inr(fromPrice(v))} <small>onwards · ${esc(v.unit)}</small> ${offerTag(v)}</div>
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
          <form class="hsearch" data-form="search" role="search">
            <label class="hs-q">${ic('search')}<input id="hero-q" name="q" placeholder="Search venues, photographers, decorators…" aria-label="Search"></label>
            <label class="hs-f">${ic('pin')}<select name="loc" aria-label="Location"><option value="">All Delhi NCR</option>${D.LOCALITIES.map(l => `<option value="${l}" ${S.locality === l ? 'selected' : ''}>${l === 'Delhi' ? 'New Delhi' : l}</option>`).join('')}</select></label>
            <label class="hs-f">${ic('calendar')}<input type="date" name="date" min="${isoPlus(1)}" aria-label="Event date"></label>
            <button class="btn btn-primary" type="submit">${ic('search')}Search</button>
          </form>
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
            <a class="fp-b" href="#/partner/${v.id}"><b>${esc(v.name)}</b><span class="stars">${ic('star')}${v.rating} <small>(${v.reviews} reviews)</small></span><span class="fp-p">${inr(fromPrice(v))} onwards</span></a></article>`).join('')}</div>
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
            <div>${ic('shield')}<b>Trusted Partners</b><span>&amp; Verified Reviews</span></div>
            <div>${ic('receipt')}<b>Transparent Pricing</b><span>No Hidden Charges</span></div>
            <a href="#/cart">${ic('cart')}<b>One Cart for</b><span>All Services</span></a>
            <a href="#/bookings/_/support">${ic('headset')}<b>24x7 Support</b><span>Always Here</span></a>
          </div>
        </div>
      </div>
    </div></section>

    <section class="steps-band"><div class="wrap steps-in">
      <h2>Plan Your Event in <span class="script">4 Easy Steps</span></h2>
      <div class="steps4">
        ${[['start-planning', '', 'Choose Event', 'Wedding / Birthday / More'], ['', '#/partners', 'Explore Partners', 'Compare &amp; Select'], ['', '#/cart', 'Add to Cart', 'One Cart for All'], ['', '#/bookings', 'Book &amp; Celebrate', 'Make it Memorable']]
          .map(([act, h, t, s], i) => `${i ? `<span class="s4-arrow">${ic('arrowRight')}</span>` : ''}${act ? `<button class="s4" data-act="${act}">` : `<a class="s4" href="${h}">`}<span class="n">${i + 1}</span><span><b>${t}</b><small>${s}</small></span>${act ? '</button>' : '</a>'}`).join('')}
      </div>
      <button class="btn btn-primary" data-act="start-planning">Start Planning Now ${ic('arrowRight')}</button>
    </div></section>

`;
  }

  function pageCategories() {
    return `<div class="wrap"><div class="page-h"><h1>${ic('menu')} All categories</h1><p>12 categories · verified partners in Delhi NCR</p></div>
      <div class="cat-grid cat-grid-lg">${D.CATEGORIES.map(c => `<a class="cat-tile" href="#/category/${c.id}"><div class="ph" ${bg(c.img, 500)}></div><span>${esc(c.name)}<small>${D.PARTNERS.filter(v => v.cat === c.id).length} partners · ${esc(c.subs.slice(0, 2).join(', '))}</small></span></a>`).join('')}</div></div>`;
  }

  function pagePartners(q) {
    const cat = q.get('cat') || '';
    const list = D.PARTNERS.filter(v => !cat || v.cat === cat).sort((a, b) => b.rating - a.rating);
    return `<div class="wrap"><div class="page-h"><h1>${ic('store')} Our Partners</h1><p>${list.length} verified partners across Delhi NCR · illustrative profiles</p></div>
      <div class="filters"><div class="cat-strip"><a class="chip ${cat ? '' : 'on'}" href="#/partners">All</a>${D.CATEGORIES.map(c => `<a class="chip ${cat === c.id ? 'on' : ''}" href="#/partners?cat=${c.id}">${ic(c.icon)}${esc(c.short)}</a>`).join('')}</div></div>
      <div class="partner-grid" style="margin-bottom:40px">${list.map(vcard).join('')}</div></div>${cmpBar()}`;
  }

  function pageOffers() {
    const list = D.PARTNERS.filter(v => v.offer).sort((a, b) => b.offer - a.offer);
    return `<div class="wrap"><div class="page-h"><h1>${ic('sparkles')} Offers</h1><p>Launch offers from partners in Delhi NCR. The discount is applied automatically in your cart.</p></div>
      <div class="callout gold" style="margin:14px 0 20px">${ic('gift')}<span><b>₹0 booking fee</b> on every event during our Delhi NCR launch (usually ₹999). Offers are illustrative for this demo.</span></div>
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
      <div>Planning: <b>${esc(S.cart.event.type)}</b> · ${list.length} verified partners in Delhi NCR</div>
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

  function pagePartner(id) {
    const v = partner(id);
    if (!v) return notFound();
    const c = catOf(v.cat);
    const item = inCart(v.id);
    const sel = item ? item.pkg : 'silver';
    const tiers = D.POLICY[v.cat] || D.POLICY.default;
    return `<div class="wrap">
      <div class="crumbs" style="margin-top:18px;color:var(--muted)"><a href="#/">Home</a>${ic('chevronRight')}<a href="#/category/${c.id}">${esc(c.name)}</a>${ic('chevronRight')}<span>${esc(v.name)}</span></div>
      <div class="v-gallery">${v.photos.map(p => `<div ${bg(p, 1000)} role="img" aria-label="${esc(v.name)} photo"></div>`).join('')}</div>
      <div class="v-layout">
        <div>
          <div class="v-head">
            <span class="tag tag-plum">${ic(c.icon)}${esc(c.name)}</span>
            <h1>${esc(v.name)}</h1>
            <div class="meta"><span>${ic('pin')} ${esc(v.area)}, ${esc(v.locality)}</span><span class="stars">${ic('star')}${v.rating}</span><span>${v.reviews} verified reviews</span><span class="tag tag-green">${ic('shield')}Verified partner</span></div>
          </div>
          <div class="box" style="margin-top:18px"><h2>About</h2>
            <p style="margin:0;color:#3c3358">${esc(v.name)} is a ${esc(c.name.toLowerCase())} partner in ${esc(v.area)}, ${esc(v.locality)}. Typical response time is about ${v.responseHrs} hours. Prices below are starting packages (${esc(v.unit)}); the final quote is confirmed by the partner for your date and guest count.</p>
            ${v.cat === 'venues' ? `<div class="soon" style="margin-top:14px">${ic('rotate3d')}<span><b>360° venue tour</b> — coming soon</span></div>` : ''}
          </div>
          <div class="box"><h2>Cancellation policy</h2>
            <div class="tbl-wrap"><table class="tbl"><thead><tr><th>When you cancel</th><th class="r">Refund of amount paid</th></tr></thead><tbody>
            ${tiers.map((t, i) => `<tr><td>${t.minDays ? `${t.minDays}+ days before the event` : `Less than ${tiers[i - 1].minDays} days before`}</td><td class="r"><b>${t.pct}%</b></td></tr>`).join('')}
            </tbody></table></div>
            <p class="note" style="margin-top:10px">${ic('info')}<span>Cancelling this service never cancels the other services in your event.</span></p>
          </div>
          <div class="box"><h2>Verified reviews</h2>
            ${v.reviewList.map(r => `<div class="review"><div class="who">${esc(r.name)} <span class="stars">${ic('star')}${r.stars}.0</span><span class="tag tag-green">${ic('check')}Completed booking</span></div><p>${esc(r.text)}</p></div>`).join('')}
          </div>
        </div>
        <aside class="sticky">
          <form class="box" data-form="add-to-cart" data-vid="${v.id}">
            <div class="avail">${ic('calendarCheck')}<span><b>Owner-confirmed availability.</b> Calendar last updated ${v.confirmedAgo}h ago. Your date is confirmed by the partner after you send the request.</span></div>
            <h3>Choose a package</h3>
            ${v.packages.map(p => `<label class="pkg"><div class="row"><span><input type="radio" name="pkg" value="${p.id}" ${p.id === sel ? 'checked' : ''}> ${p.name}</span><span>${priceTag(v, p)}</span></div><ul>${p.includes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></label>`).join('')}
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
              <label class="field">Guests<input type="number" name="guests" min="10" step="10" value="${ev.guests}"></label>
              <label class="field">Locality<select name="locality">${D.LOCALITIES.map(x => `<option ${ev.locality === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
              <label class="field">Budget (₹)<input type="number" name="budget" min="0" step="10000" value="${ev.budget}"></label>
            </div>
          </form>
          <div class="box">
            <h2>Services in your cart</h2>
            ${lines.length ? groups.map(([c, ls]) => ls.map(l => `<div class="cart-item">
                <a class="ph" href="#/partner/${l.v.id}" ${bg(l.v.photos[0], 300)} aria-label="${esc(l.v.name)}"></a>
                <div><span class="tag tag-plum">${ic(c.icon)}${esc(c.short)}</span><h4>${esc(l.v.name)}</h4><div class="sub">${l.p.name} package · ${esc(l.v.unit)} · ★ ${l.v.rating}</div>
                  <div style="display:flex;gap:14px;margin-top:4px"><a class="link-btn" href="#/partner/${l.v.id}">Change package</a><button class="link-btn" data-act="move-saved" data-vid="${l.v.id}">Save for later</button><button class="link-btn danger" data-act="remove-cart" data-vid="${l.v.id}">Remove</button></div></div>
                <div class="amt">${priceTag(l.v, l.p)}${l.v.offer ? `<div>${offerTag(l.v)}</div>` : ''}</div></div>`).join('')).join('')
              : `<div class="empty">${ic('cart')}<p>Your event cart is empty.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="#/category/venues">Browse venues</a><button class="btn btn-ghost" data-act="demo-cart">Fill sample wedding cart</button></div></div>`}
          </div>
          ${S.cart.saved.length ? `<div class="box"><h2>${ic('bookmark')} Saved for later</h2>${S.cart.saved.map(sv => { const v = partner(sv.partnerId); return `<div class="cart-item"><a class="ph" href="#/partner/${v.id}" ${bg(v.photos[0], 300)}></a><div><h4>${esc(v.name)}</h4><div class="sub">${esc(catOf(v.cat).short)} · from ${inr(fromPrice(v))}</div><div style="display:flex;gap:14px;margin-top:4px"><button class="link-btn" data-act="saved-to-cart" data-vid="${v.id}">Move to cart</button><button class="link-btn danger" data-act="remove-saved" data-vid="${v.id}">Remove</button></div></div></div>`; }).join('')}</div>` : ''}
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
            <div class="sum-row"><span>GST (18%, illustrative)</span><span>${inr(t.gst)}</span></div>
            <div class="sum-row"><span>ShaadiKart booking fee</span><span><s>₹999</s>₹0</span></div>
            <div class="sum-row total"><span>Estimated total</span><span>${inr(t.total)}</span></div>
            <div class="sum-row" style="color:var(--muted)"><span>Advance after confirmation (25%)</span><span>${inr(t.advance)}</span></div>
            <button class="btn btn-primary btn-block" style="margin-top:12px" data-act="send-requests" ${lines.length ? '' : 'disabled'}>Send booking requests (${lines.length}) ${ic('arrowRight')}</button>
            <p class="note" style="margin-top:12px">${ic('shield')}<span>No payment now. Each partner confirms your date separately; if one can't, the rest of your booking still goes ahead.</span></p>
          </div>
        </aside>
      </div></div>`;
  }

  function pageCheckout(id) {
    const ev = S.events.find(e => e.id === id);
    if (!ev) return notFound();
    const svcs = liveSvcs(ev);
    const st = svcs.map(svcStatus);
    const pending = st.includes('awaiting');
    const payable = svcs.filter(s => svcStatus(s) === 'confirmed');
    const totalDue = payable.reduce((a, s) => a + svcTotal(s), 0);
    const adv = Math.round(totalDue * ADV);
    return `<div class="wrap">
      <div class="page-h"><h1>${ic('receipt')} Checkout summary</h1><p>${esc(ev.name)} · ${fmtDate(ev.date)} · ${ev.guests} guests · ${esc(ev.locality)} · Booking ID ${ev.id}</p></div>
      <div class="two-col">
        <div>
          <div class="box"><h2>Partner confirmations</h2>
            <p class="note" style="margin:-4px 0 10px">${ic('info')}<span>Each partner checks its own calendar. An unavailable partner does not cancel the rest of your cart.</span></p>
            ${svcs.map(s => { const v = partner(s.partnerId), ss = svcStatus(s); return `<div class="status-row">
              <div class="ph" ${bg(v.photos[0], 200)}></div>
              <div><h4>${esc(v.name)}</h4><div class="sub">${esc(catOf(v.cat).short)} · ${pkgOf(v, s.pkg).name} · ${inr(svcTotal(s))} incl. GST${ss === 'awaiting' ? '' : ss === 'unavailable' ? ' · fully booked on your date' : ` · ${s.confirmId}`}</div>
              ${ss === 'unavailable' ? `<div style="display:flex;gap:12px;margin-top:4px"><a class="link-btn" href="#/category/${v.cat}">Find an alternative</a><button class="link-btn danger" data-act="remove-svc" data-ev="${ev.id}" data-svc="${s.id}">Remove from booking</button></div>` : ''}</div>
              <div>${ss === 'awaiting' ? `<span class="tag tag-amber"><span class="spin"></span>Checking date…</span>` : statusTag(ss)}</div></div>`; }).join('')}
          </div>
        </div>
        <aside class="sticky">
          <form class="box" data-form="pay" data-ev="${ev.id}">
            <h3>${ic('wallet')} Payment</h3>
            ${pending ? `<div class="avail warn">${ic('clock')}<span>Waiting for every partner to confirm. Payment opens once they respond.</span></div>` : ''}
            ${!pending && !payable.length ? `<div class="avail">${ic('check')}<span>Nothing to pay right now.</span></div><a class="btn btn-ghost btn-block" href="#/bookings/${ev.id}/services">Go to My Bookings</a>` : ''}
            ${!pending && payable.length ? `
              ${payable.map(s => `<div class="sum-row"><span>${esc(partner(s.partnerId).name)}</span><span>${inr(svcTotal(s))}</span></div>`).join('')}
              <div class="sum-row total"><span>Confirmed total</span><span>${inr(totalDue)}</span></div>
              <div class="pay-opts" style="margin-top:10px">
                <label class="pay-opt"><input type="radio" name="amt" value="adv" checked> Pay 25% advance<span class="r">${inr(adv)}</span></label>
                <label class="pay-opt"><input type="radio" name="amt" value="full"> Pay in full<span class="r">${inr(totalDue)}</span></label>
              </div>
              <h3 style="margin-top:16px">Method</h3>
              <div class="pay-opts">${['UPI', 'Card', 'Net banking'].map((m, i) => `<label class="pay-opt"><input type="radio" name="method" value="${m}" ${i ? '' : 'checked'}> ${m} <span class="r" style="font-weight:400;color:var(--muted);font-size:12px">demo</span></label>`).join('')}</div>
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
      const now = Date.now();
      steps = [
        ['Requested', fmtDate(s.requestedAt), 'done'],
        ['Partner confirmed', ss === 'awaiting' ? 'Pending' : fmtDate(s.respondAt), ss === 'awaiting' ? 'cur' : 'done'],
        ['Advance paid', pay ? fmtDate(pay.t) : 'Due now', pay ? 'done' : (ss === 'confirmed' ? 'cur' : '')],
        ['Balance', ss === 'paid' ? 'Paid' : 'Due ' + fmtDate(new Date(d - 30 * DAY)), ss === 'paid' ? 'done' : (ss === 'booked' ? 'cur' : '')],
        ['Event day', fmtDate(d), now > d ? 'done' : '']
      ];
    }
    return `<div class="timeline">${steps.map(([l, sub, cls], i) => `<div class="tl ${cls}">${i ? '<span class="bar"></span>' : ''}<span class="d">${cls === 'done' ? ic('check') : cls === 'bad' ? ic('x') : ''}</span><span class="lb"><b>${l}</b>${esc(sub)}</span></div>`).join('')}</div>`;
  }

  const TAB_RENDER = {
    services(ev) {
      const live = liveSvcs(ev);
      return `<div class="callout gold" style="margin-bottom:14px">${ic('info')}<span>Each service is tracked and can be cancelled or rescheduled on its own. Cancelling photography will <b>not</b> cancel your venue, catering or decoration.</span></div>
      ${live.map(s => {
        const v = partner(s.partnerId), ss = svcStatus(s), tot = svcTotal(s);
        const active = ['confirmed', 'booked', 'paid'].includes(ss);
        return `<div class="svc ${ss === 'cancelled' || ss === 'unavailable' ? 'cancelled' : ''}">
          <div class="ph" ${bg(v.photos[0], 200)}></div>
          <div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><h4>${esc(v.name)}</h4>${statusTag(ss)}</div>
            <div class="sub">${esc(catOf(v.cat).name)} · ${pkgOf(v, s.pkg).name} package${s.confirmId && ss !== 'unavailable' ? ' · ' + s.confirmId : ''}${s.date ? ` · <b>new date ${fmtDate(s.date)}</b>` : ''}</div>
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
            ${Object.entries(r.responses).map(([sid, t]) => `<div class="sum-row"><span>${esc(partner(ev.services.find(s => s.id === sid).partnerId).name)}</span>${Date.now() >= t ? `<span class="tag tag-green">${ic('check')}Accepted</span>` : `<span class="tag tag-amber"><span class="spin"></span>Pending</span>`}</div>`).join('')}</div>`).join('') : `<div class="empty" style="padding:30px">${ic('calendar')}<p>No reschedule requests.</p></div>`}
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
    else if (p0 === 'confirmed') html = pageConfirmed(p1);
    else if (p0 === 'bookings') html = pageBookings(r.parts, r.q);
    else if (p0 === 'categories') html = pageCategories();
    else if (p0 === 'partners') html = pagePartners(r.q);
    else if (p0 === 'offers') html = pageOffers();
    else if (p0 === 'wishlist') html = pageWishlist();
    else if (p0 === 'partner-dashboard') html = pagePartnerDashboard();
    else html = notFound();
    header();
    $('#app').innerHTML = html;
    if (r.path !== lastPath) { window.scrollTo(0, 0); lastPath = r.path; }
  }
  // Refresh time-simulated states (partner replies, refunds, reschedules) without disturbing typing.
  setInterval(() => {
    const p0 = route().parts[0];
    if (!['checkout', 'bookings'].includes(p0) || liveSignature() === lastSig) return;
    const a = document.activeElement;
    if (a && $('#app').contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return;
    const y = window.scrollY; render(); window.scrollTo(0, y);
  }, 1000);

  /* ---------- auth (demo OTP) ---------- */
  let afterLogin = null;
  function loginModal(then, tab = 'customer') {
    if (then !== undefined) afterLogin = then || null;
    const seg = `<div class="seg" role="tablist"><button role="tab" aria-selected="${tab === 'customer'}" class="${tab === 'customer' ? 'on' : ''}" data-act="login-tab" data-tab="customer">${ic('user')}Customer</button><button role="tab" aria-selected="${tab === 'partner'}" class="${tab === 'partner' ? 'on' : ''}" data-act="login-tab" data-tab="partner">${ic('store')}Partner</button></div>`;
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
      id: code('SV'), partnerId: l.v.id, pkg: l.p.id, price: l.price, requestedAt: base,
      respondAt: base + 1600 * (i + 1) + (l.v.busy ? 900 : 0), response: l.v.busy ? 'unavailable' : 'confirmed', confirmId: 'CNF-' + Math.floor(1000 + Math.random() * 9000), paid: 0
    }));
  }
  function sendRequests() {
    const lines = cartLines();
    if (!lines.length) return;
    const ce = S.cart.event;
    const ev = { id: 'SK-EV-' + Math.floor(10000 + Math.random() * 89999), name: ce.name || `My ${ce.type}`, type: ce.type, date: ce.date, guests: ce.guests, locality: ce.locality, createdAt: Date.now(), services: [], payments: [], refunds: [], cancellations: [], reschedules: [], tickets: [] };
    addSvcsToEvent(ev, lines, Date.now());
    S.events.push(ev);
    S.cart.items = [];
    save();
    go('#/checkout/' + ev.id);
    toast(`Requests sent to ${lines.length} partners`, 'arrowRight');
  }

  const ACT = {
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
    'event-type'(el) { closeModal(); S.cart.event.type = el.dataset.type; save(); toast(`Planning a ${el.dataset.type}. Start with a venue.`, 'sparkles'); go('#/category/venues'); },
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
      S.cart.items = [['royal-banquet', 'silver'], ['phoolwari', 'silver'], ['candid-frames', 'silver'], ['swaad-caterers', 'silver'], ['beat-factory', 'silver'], ['glam-neha', 'silver']].map(([partnerId, pkg]) => ({ partnerId, pkg }));
      S.cart.event.type = 'Wedding'; save(); render(); toast('Sample wedding cart added');
    },
    'send-requests'() { if (!S.user) loginModal(sendRequests); else sendRequests(); },
    'remove-svc'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), s = ev.services.find(x => x.id === el.dataset.svc);
      s.removed = true; save(); render(); toast('Removed. Your other services are unaffected.');
    },
    login() { loginModal(() => render()); },
    'partner-login'() { loginModal(null, 'partner'); },
    'login-tab'(el) { loginModal(undefined, el.dataset.tab); },
    account() {
      if (!S.user && !S.partner) return loginModal(() => render());
      const mask = ph => '+91 ' + esc(ph.replace(/^(\d{2})\d{6}/, '$1••••••'));
      openModal('Your account', `${S.user ? `<h4 style="margin:0">${ic('user')} Customer</h4><dl class="kv"><dt>Name</dt><dd>${esc(S.user.name)}</dd><dt>Mobile</dt><dd>${mask(S.user.phone)}</dd><dt>City</dt><dd>${esc(S.user.city)}</dd></dl>
          <div class="modal-f" style="justify-content:flex-start"><a class="btn btn-ghost btn-sm" href="#/bookings">My Bookings</a><button class="btn btn-ghost btn-sm" data-act="logout">Log out customer</button></div>`
        : `<button class="btn btn-ghost" data-act="login">${ic('user')}Customer login</button>`}
        <hr style="border:0;border-top:1px solid var(--line);width:100%">
        ${S.partner ? `<h4 style="margin:0">${ic('store')} Partner</h4><dl class="kv"><dt>Business</dt><dd>${esc(partner(S.partner.id).name)}</dd><dt>Mobile</dt><dd>${mask(S.partner.phone)}</dd></dl>
          <div class="modal-f" style="justify-content:flex-start"><a class="btn btn-primary btn-sm" href="#/partner-dashboard">Partner dashboard</a><button class="btn btn-ghost btn-sm" data-act="partner-logout">Log out partner</button></div>`
        : `<button class="btn btn-ghost" data-act="partner-login">${ic('store')}Partner login</button>`}
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
        <a href="#/">${ic('home')}Home</a><a href="#/categories">${ic('menu')}All categories</a><a href="#/partners">${ic('store')}Our Partners</a><a href="#/offers">${ic('sparkles')}Offers</a>
        <a href="#/wishlist">${ic('heart')}Wishlist</a><a href="#/cart">${ic('cart')}Cart</a><a href="#/bookings">${ic('calendarCheck')}My Bookings</a>
        <button data-act="journey">${ic('list')}How it works</button><button data-act="policy">${ic('undo')}Cancellation &amp; refunds</button><button data-act="contact">${ic('phone')}Contact us</button>
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
    'start-planning'() {
      openModal('What are you planning?', `<p style="margin:0;color:var(--muted)">Pick your event. Everything you add goes into one event cart.</p>
        <div class="event-types">${D.EVENT_TYPES.map(t => `<button class="event-type ${S.cart.event.type === t ? 'on' : ''}" data-act="event-type" data-type="${t}" ${bg(D.PHOTOS.events[t], 500)}><span>${t}</span></button>`).join('')}</div>`, { wide: true });
    },
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
        <p class="note">${ic('info')}<span>Refund goes back to the original payment method in 5–7 working days (illustrative).</span></p>
        <div class="modal-f"><button type="button" class="btn btn-ghost" data-act="close-modal">Keep booking</button><button class="btn btn-danger" type="submit">Confirm cancellation</button></div></form>`);
    },
    'pay-balance'(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), s = ev.services.find(x => x.id === el.dataset.svc);
      const due = svcTotal(s) - s.paid;
      openModal('Pay balance', `<form data-form="pay-balance" data-ev="${ev.id}" data-svc="${s.id}" class="modal-b" style="padding:0">
        <div class="sum-row"><span>${esc(partner(s.partnerId).name)}</span><span>${inr(svcTotal(s))}</span></div>
        <div class="sum-row"><span>Already paid</span><span>−${inr(s.paid)}</span></div>
        <div class="sum-row total"><span>Balance</span><span>${inr(due)}</span></div>
        <div class="pay-opts">${['UPI', 'Card', 'Net banking'].map((m, i) => `<label class="pay-opt"><input type="radio" name="method" value="${m}" ${i ? '' : 'checked'}> ${m} <span class="r" style="font-weight:400;color:var(--muted);font-size:12px">demo</span></label>`).join('')}</div>
        <button class="btn btn-gold" type="submit">Pay ${inr(due)}</button></form>`);
    },
    receipt(el) {
      const ev = S.events.find(e => e.id === el.dataset.ev), p = ev.payments.find(x => x.id === el.dataset.pay);
      openModal('Payment receipt', `<div class="receipt">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">${logo()}<span class="tag tag-green">${ic('check')}Paid</span></div>
        <dl class="kv" style="margin-top:12px"><dt>Receipt no.</dt><dd>${p.id.replace('PAY', 'RCPT')}</dd><dt>Transaction</dt><dd>${p.id}</dd><dt>Date</dt><dd>${fmtDT(p.t)}</dd><dt>Billed to</dt><dd>${esc(S.user ? S.user.name : 'Customer')}</dd><dt>Event</dt><dd>${esc(ev.name)} · ${fmtDate(ev.date)}</dd><dt>Method</dt><dd>${esc(p.method)} · ${esc(p.kind)}</dd></dl>
        <div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>Service</th><th class="r">Amount</th></tr></thead><tbody>
          ${p.items.map(i => { const s = ev.services.find(x => x.id === i.svcId), v = partner(s.partnerId); return `<tr><td>${esc(v.name)}<br><small>${esc(catOf(v.cat).short)} · ${s.confirmId}</small></td><td class="r">${inr(i.amount)}</td></tr>`; }).join('')}
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
    search(f) {
      const q = f.q.value.trim(), loc = f.loc ? f.loc.value : '', date = f.date ? f.date.value : '';
      if (date) { S.cart.event.date = date; save(); }
      closeModal();
      go('#/search?q=' + encodeURIComponent(q) + (loc ? '&loc=' + encodeURIComponent(loc) : ''));
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
      const vid = f.dataset.vid, pkg = f.pkg.value;
      if (f.date.value) S.cart.event.date = f.date.value;
      const ex = inCart(vid);
      if (ex) ex.pkg = pkg; else S.cart.items.push({ partnerId: vid, pkg });
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
      const full = f.amt.value === 'full', method = f.method.value;
      simulatePayment(() => {
        const svcs = liveSvcs(ev).filter(s => svcStatus(s) === 'confirmed');
        const pay = { id: 'PAY-' + Math.floor(10000 + Math.random() * 89999), t: Date.now(), method, kind: full ? 'Full payment' : 'Advance (25%)', items: [] };
        svcs.forEach(s => { const a = full ? svcTotal(s) : Math.round(svcTotal(s) * ADV); s.paid += a; pay.items.push({ svcId: s.id, amount: a }); });
        pay.amount = pay.items.reduce((a, b) => a + b.amount, 0);
        ev.payments.push(pay); save();
        go('#/confirmed/' + ev.id);
      });
    },
    'pay-balance'(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev), s = ev.services.find(x => x.id === f.dataset.svc), method = f.method.value;
      simulatePayment(() => {
        const a = svcTotal(s) - s.paid; s.paid += a;
        ev.payments.push({ id: 'PAY-' + Math.floor(10000 + Math.random() * 89999), t: Date.now(), method, kind: 'Balance', items: [{ svcId: s.id, amount: a }], amount: a });
        save(); render(); toast(`Balance paid for ${partner(s.partnerId).name}`, 'wallet');
      });
    },
    cancel(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev), scope = f.dataset.scope, ids = f.dataset.svcs.split(',');
      const now = Date.now(); let paid = 0, refund = 0, pct = 0, refundId = null;
      ids.forEach(id => {
        const s = ev.services.find(x => x.id === id); const p = policyFor(s, ev); const r = Math.round(s.paid * p.pct / 100);
        s.cancelledAt = now; paid += s.paid; refund += r; pct = p.pct;
        if (r > 0) {
          const pay = ev.payments.find(x => x.items.some(i => i.svcId === id));
          const rf = { id: code('RF'), t: now, svcIds: [id], amount: r, method: pay ? pay.method : 'UPI' };
          ev.refunds.push(rf); refundId = refundId || rf.id;
        }
      });
      ev.cancellations.push({ id: code('CN'), t: now, scope, svcIds: ids, reason: f.reason.value, paid, pct, refundAmount: refund, refundId: scope === 'service' ? refundId : null });
      save(); closeModal();
      toast(scope === 'event' ? 'Event cancelled. Refunds initiated.' : `${partner(ev.services.find(x => x.id === ids[0]).partnerId).name} cancelled. Other services stay confirmed.`, 'undo');
      go(`#/bookings/${ev.id}/${refund > 0 ? 'refunds' : 'cancellations'}`);
    },
    reschedule(f) {
      const ev = S.events.find(e => e.id === f.dataset.ev);
      const scope = f.scope.value, to = f.to.value;
      const svcs = scope === 'event' ? activeSvcs(ev).filter(s => svcStatus(s) !== 'awaiting') : [ev.services.find(s => s.id === scope)];
      const now = Date.now(), responses = {};
      svcs.forEach((s, i) => { responses[s.id] = now + 4000 * (i + 1); });
      ev.reschedules.push({ id: code('RS'), t: now, from: scope === 'event' ? ev.date : svcDate(ev, svcs[0]), to, scope: scope === 'event' ? 'event' : 'service', svcIds: svcs.map(s => s.id), reason: f.reason.value.trim(), responses, applied: false });
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
    locality(el) { S.locality = el.value; S.cart.event.locality = el.value; save(); toast(`Showing partners near ${el.value}`, 'pin'); },
    compare(el) { toggleCompare(el.value); render(); },
    nav(el) { go(el.value); }
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
  document.addEventListener('change', e => {
    const el = e.target.closest('[data-change]');
    if (el && CHANGE[el.dataset.change]) { CHANGE[el.dataset.change](el); return; }
    const f = e.target.closest('form[data-form="event-details"]');
    if (f) {
      const ev = S.cart.event;
      ev.type = f.type.value; ev.name = f.name.value.trim(); ev.date = f.date.value || ev.date;
      ev.guests = Math.max(10, +f.guests.value || ev.guests); ev.locality = f.locality.value; ev.budget = Math.max(0, +f.budget.value || 0);
      save(); render();
    }
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    FORMS[f.dataset.form](f);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal-root .x-btn')) closeModal(); });
  window.addEventListener('scroll', () => { $('#site-header').classList.toggle('solid', window.scrollY > 30); }, { passive: true });
  window.addEventListener('hashchange', () => { curQ = nextQ || new URLSearchParams(); nextQ = null; render(); });

  footer();
  render();
})();
