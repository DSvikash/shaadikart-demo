# "My Event" Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static gate/WhatsApp/meeting flow with a living "My Event" journey hub, See My Event composites, a Welcome Conversation with perk, Blueprint approval, live WhatsApp thread, and a split-screen Demo mode dock — per the approved design spec.

**Architecture:** Single-page static demo (one IIFE in `js/app.js`, data in `js/data.js`, styles in `css/styles.css`, shell `index.html`). Hash routing (`#page--id`). State in `localStorage` key `shaadikart-demo-v3`. All 28 `Date.now()` calls replaced with `now()` that reads a demo-clock offset, enabling a 3-minute compressed walkthrough. New routes: `#my-event--{id}`, `#blueprint--{id}`. New dock overlay for Demo mode. No external dependencies, no build step, no npm.

**Tech Stack:** Vanilla JS (ES2017+), CSS custom properties, Unsplash photos in `img/`. Node.js (v26) for data-integrity scripts only. Python `http.server` for local preview. Artifact publishing for the live link.

**Spec:** `02_Plans/ShaadiKart_My_Event_Journey_Design_Spec.md`

## Global Constraints

- **No partner phone number or contact detail may appear anywhere.** Only "Your ShaadiKart host" and ShaadiKart's number 5432112345.
- **Only the first payment is gated.** Balance payments are never locked.
- **2-hour call clock starts at the enquiry** (event `createdAt`), not the meeting.
- **If the outbound call is answered, no verification call is needed.** The customer calls 5432112345 only when both outbound attempts are missed.
- **"Artist's impression, not a photograph of the booked setup"** label on every See My Event screen.
- **WhatsApp messages: calm, confident, no urgency, no third-party links.** Safety line on every thread: "We never ask for OTP, card number or UPI PIN on WhatsApp."
- **Visit perk wording: a gift, not a question.** "Your hall hosts a private walk-through and tasting this Saturday, hosted by ShaadiKart. Reserve a seat, no obligation."
- **Demo clock offset** via `now()` replacing every `Date.now()` call. Default speed 1×; Demo mode offers 60× and 180× for partner demos.
- **Cache-bust** `?v=N` in `index.html` incremented on every publish.
- **Mobile-first:** all new UI must work at 375 px width.
- **Existing flows preserved:** cart, checkout summary, bookings, refunds, reschedules, partner dashboard, planner — all must keep working.

## Review Focus

1. **Partner number leak:** A grep for phone-number patterns (`\d{10}`, `+91`) in rendered HTML must find only the customer's own number and 5432112345. Any partner phone number displayed is a Critical defect.
2. **Gate bypass:** Navigating directly to `#my-event--{id}` with a crafted URL, or calling `pay()` from the console, must not skip the unlock rule (conversation held AND verified AND Blueprint approved AND executive unlock). A payment that goes through without all four is a Critical defect.
3. **Demo clock drift:** Fast-forwarding the demo clock must not corrupt timestamps stored in state (payments, refunds). Stored timestamps use real `Date.now()`; only display and SLA checks use `now()`.
4. **Capacity overflow in Act 3:** Guest count exceeding venue `cap[1]` must show crowding and the gentle note — never silently render an impossible layout.
5. **WhatsApp thread ordering:** Messages must appear in chronological order and never duplicate when the dock is toggled or the page re-renders.

---

### Task 1: Baseline commit, feature branch, demo clock, journey state model, My Event hub shell

**Files:**
- Modify: `js/app.js` (lines 1–22: add `now()` and `CLOCK`; lines 188–215: evolve gate model into journey model; lines 1421–1448: add route; ~line 1504: add actions)
- Modify: `index.html` (bump `?v=45`)
- Modify: `css/styles.css` (add `.my-event`, `.me-timeline`, `.me-stage` classes)
- Test: Node script `test-clock.js` (verify `now()` returns offset time)

**Interfaces:**
- Produces: `now()` → `number` (replaces every `Date.now()` call site); `CLOCK` object `{ offset: 0, speed: 1 }` on `window` for dock to read; `journeyOf(ev)` → journey state object; `journeyStage(ev)` → stage string; `pageMyEvent(id)` → HTML string; route `#my-event--{id}`.
- Produces: journey state shape: `ev.journey = { stage: 'requests-sent'|'partners-confirm'|'see-my-event'|'conversation'|'blueprint'|'payment'|'booked', host: {name, role, years, languages}, visitRequested: null|timestamp, blueprintApproved: null|timestamp, waThread: [{t, type, text, status}] }`. The existing `ev.gate` fields are preserved and wired into the journey; `gateStage()` still works for the Concierge.

- [ ] **Step 1: Commit all uncommitted work as a baseline**

```bash
cd /Users/vikashroy/Desktop/ShaadiKart_Project/04_Website/shaadikart-demo
git add -A
git commit -m "chore: baseline — Phase 1.3 + 1.4 additions before My Event Journey"
```

- [ ] **Step 2: Create feature branch**

```bash
git checkout -b feature/my-event-journey
```

- [ ] **Step 3: Add `now()` and `CLOCK` at the top of `app.js` (after line 5)**

```js
const CLOCK = { offset: 0, speed: 1 };
const now = () => Date.now() + CLOCK.offset;
```

- [ ] **Step 4: Replace every `Date.now()` call in `app.js` with `now()`**

There are 28 occurrences. Replace all with `now()` EXCEPT the two in `save()` and the `storage` listener (those must stay real time). Run a grep to confirm no `Date.now()` remains outside those two.

- [ ] **Step 5: Run verification**

```bash
grep -n 'Date\.now()' js/app.js
```

Expected: exactly 0–2 occurrences (only in save/storage if kept).

- [ ] **Step 6: Add `journeyOf(ev)` and `journeyStage(ev)` near the existing gate functions**

`journeyOf(ev)` initialises `ev.journey` if missing (host defaults to `{name:'Priya Kapoor', role:'Customer Success', years:4, languages:'Hindi, English'}`; `waThread` starts empty; other fields null). `journeyStage(ev)` returns the current stage string based on: if booked → 'booked'; if payment made → 'payment'; if blueprintApproved → 'blueprint'; if gate.held (conversation happened) → 'conversation'; always available → 'see-my-event'; if any service confirmed → 'partners-confirm'; else → 'requests-sent'.

- [ ] **Step 7: Add `pageMyEvent(id)` returning the hub shell**

A `.my-event` wrapper containing:
- `.me-timeline` — horizontal progress bar with 7 stage dots/labels from spec section 3.
- `.me-stage` — content area. For now, each stage shows a placeholder card: stage name, status, and a "Coming in Task N" note for See My Event, Conversation, Blueprint. The Payment and Booked stages link to existing `pageCheckout` and `pageConfirmed`.
- The Requests Sent stage shows the existing service-status list (reuse from `pageCheckout`).

- [ ] **Step 8: Wire the route in `render()`**

Add `else if (p0 === 'my-event') html = pageMyEvent(p1);` and `else if (p0 === 'blueprint') html = pageBlueprint(p1);` in the route switch. After `sendRequests()` (line ~1500), change `go('#/checkout/' + ev.id)` to `go('#/my-event/' + ev.id)`. Keep the existing `#checkout/{id}` route working — it must still render `pageCheckout` for direct links and existing events without journey data.

- [ ] **Step 9: Add CSS for `.my-event`, `.me-timeline`, `.me-stage`**

Timeline: horizontal flex, overflow-x auto on mobile, each dot 24px with connecting line, current stage highlighted in `--gold`, completed in `--green`. Stage cards: `.box` style with heading and content area.

- [ ] **Step 10: Bump `?v=45` in `index.html`**

- [ ] **Step 11: Verify in browser**

Start `python3 -m http.server 5173`. Add demo cart, send requests. Confirm `#my-event/{id}` loads with the timeline and placeholder stages. Confirm existing checkout, bookings, and refund flows still work. Confirm no console errors.

- [ ] **Step 12: Commit**

```bash
git add js/app.js css/styles.css index.html
git commit -m "feat: demo clock, journey state model, My Event hub shell with timeline"
```

---

### Task 2: WhatsApp live thread in dock + Demo mode dock + demo clock UI

**Files:**
- Modify: `js/app.js` (add `waThreadPush()`, `dockHtml()`, `dockRender()`, demo-clock controls; modify `sendRequests` to push first WA message; modify service-status change to push WA messages)
- Modify: `css/styles.css` (add `.demo-dock`, `.dock-tabs`, `.wa-thread`, `.wa-msg`, `.demo-clock`, `.dock-toggle`)
- Modify: `index.html` (bump `?v=46`; add dock container div before `</body>`)

**Interfaces:**
- Consumes: `now()`, `CLOCK`, `journeyOf(ev)`, `journeyStage(ev)` from Task 1; `liveSvcs(ev)`, `svcStatus(s)`, `partner(id)`, `catOf(id)` from existing code.
- Produces: `waThreadPush(ev, type, text)` — appends to `ev.journey.waThread[]`; `dockHtml(ev)` → dock HTML; `dockRender()` re-renders dock without re-rendering main page; `ACT['dock-toggle']`, `ACT['dock-tab']`, `ACT['clock-speed']` actions.

- [ ] **Step 1: Add dock HTML container in `index.html`**

Before `</body>`, add `<div id="demo-dock"></div>`.

- [ ] **Step 2: Add `waThreadPush(ev, type, text)` in `app.js`**

Pushes `{ t: now(), type, text, status: 'sent' }` to `journeyOf(ev).waThread`. Deduplicates by type+text within 2 seconds.

- [ ] **Step 3: Wire WA messages to stage events**

In `sendRequests()`: after creating the event, push the "Your catalog" message (each item with ⏳/✔ status and summary "0 of N confirmed"). In the `tick()` or `setInterval` that checks service status changes: when a service flips to 'confirmed', push "✔ {Partner} has confirmed your date." and a refreshed catalog count. Define the full message table from spec section 7 as a lookup, and push each message at the appropriate moment.

- [ ] **Step 4: Implement `dockHtml(ev)` and `dockRender()`**

The dock is a fixed-position right panel (320 px wide on desktop, full-width sheet on mobile). Two tabs: WhatsApp and Concierge. A toggle button (WhatsApp icon + unread count badge) floats at bottom-right when dock is closed. The WhatsApp tab renders `ev.journey.waThread` as chat bubbles (`.wa-msg`), newest at bottom, auto-scrolls. Quick-reply chips at the bottom: Reschedule, Ask a question, Speak to my host. The Concierge tab shows a compact version of the existing `cgDetail()` for the current event.

- [ ] **Step 5: Add demo-clock UI at the top of the dock**

A labelled "Demo clock" bar with: current simulated time (formatted), speed buttons (1×, 60×, 180×), and a "Reset" button. Changing speed sets `CLOCK.speed` and starts a `setInterval` that increments `CLOCK.offset` by `(speed - 1) * 1000` every second. The existing `setInterval` in render (line ~1450) picks up the changes via `now()`.

- [ ] **Step 6: Add dock actions to `ACT`**

`dock-toggle` (show/hide), `dock-tab` (switch WhatsApp/Concierge), `clock-speed` (set speed), `clock-reset` (reset offset to 0, speed to 1).

- [ ] **Step 7: Add CSS for the dock**

`.demo-dock`: fixed right, top 0, height 100vh, width 320px, z-index above modal backdrop. `.dock-toggle`: fixed bottom-right floating button. When dock is open, `body` gets `padding-right: 320px` on desktop. Mobile: dock is a bottom sheet at 100% width. WhatsApp thread: green-tinted bubbles for ShaadiKart, white for customer. Demo clock bar: amber background strip.

- [ ] **Step 8: Ensure dock state survives `render()` and localStorage sync**

Dock open/closed and active tab stored in a non-persisted variable (not localStorage — dock state is session-only). The `storage` event listener calls `dockRender()` after `render()` so the second window's dock updates.

- [ ] **Step 9: Verify in browser**

Send requests → dock toggle appears → open dock → WhatsApp tab shows the catalog message → wait for partner confirmations → new messages appear. Switch to Concierge tab → shows the event queue. Test clock speed 60× → partner replies arrive faster. Test 375 px width.

- [ ] **Step 10: Commit**

```bash
git add js/app.js css/styles.css index.html
git commit -m "feat: WhatsApp live thread, Demo mode dock with clock controls"
```

---

### Task 3: See My Event — Act 1 (The Space) and Act 2 (Dressed for you)

**Files:**
- Modify: `js/data.js` (add `VENUE_ANCHORS` per venue and `DECOR_PROFILES` per decor partner)
- Modify: `js/app.js` (add `seeMyEvent(ev)`, `actOne(ev)`, `actTwo(ev)` functions; wire into `pageMyEvent` stage 3)
- Modify: `css/styles.css` (add `.sme-stage`, `.sme-act1`, `.sme-act2`, `.sweep-slider`, `.hotspot`, `.decor-layer` classes)
- Modify: `index.html` (bump `?v=47`)

**Interfaces:**
- Consumes: `journeyOf(ev)`, venue partner object with `photos[]` and `cap[]`, `D.VENUE_ANCHORS`, `D.DECOR_PROFILES`, decor partner object from cart, guest count from event.
- Produces: `seeMyEvent(ev)` → HTML for the three-act tabbed view; `actOne(ev)` → full-width venue photo with hotspots; `actTwo(ev)` → sweep slider with decor layers.

- [ ] **Step 1: Add `VENUE_ANCHORS` to `data.js`**

One entry per venue (5 venues: royal-banquet, grandeur-palace, urban-terrace, green-meadows, skyline-heights). Each has: `{ id, stageX, stageY, tableZone: {x,y,w,h}, rooms: [{name, x, y}], photo: <raw venue photo id> }`. Use approximate percentages for the positions.

- [ ] **Step 2: Add `DECOR_PROFILES` to `data.js`**

One entry per decor partner (phoolwari, bloom-studio, plus any others). Each has: `{ id, partnerId, palette: [3 hex colours], elements: ['mandap','floral arch','aisle florals','drapes','lighting glow'], overlayPhoto: <decorated venue photo id> }`.

- [ ] **Step 3: Implement `actOne(ev)` in `app.js`**

Full-width photo (the venue's raw photo from `VENUE_ANCHORS`), with CSS `position:relative`. Hotspot buttons at the anchor positions showing capacity, hall/lawn, and room names on tap (tooltip or small popup). "Artist's impression" label in the top-right corner.

- [ ] **Step 4: Implement `actTwo(ev)` with sweep slider**

A `<input type="range">` slider (0–100). At 0, show the raw venue photo. At 100, show the decorated photo from the decor partner's profile. CSS `clip-path` or `width` on an overlaid `<div>` reveals the decorated layer left-to-right as the slider moves. Tapping a decor element (mandap, florals, etc.) shows a tooltip: element name, partner name, element detail. The palette colours from the decor profile tint overlay accents.

- [ ] **Step 5: Wire `seeMyEvent(ev)` into `pageMyEvent`**

In the See My Event stage (always available), show three tabs: "The Space", "Dressed for you", "Your celebration" (placeholder for Task 4). Default to Act 1. Tab switching via `data-act="sme-tab"`.

- [ ] **Step 6: Add CSS for acts**

`.sme-act1`: full-width photo container, relative positioning for hotspots. `.hotspot`: absolute-positioned pulsing dot buttons. `.sme-act2`: stacked photos with clip-path reveal. `.sweep-slider`: range input styled as a vertical divider line. Mobile: full-width, hotspot touch targets at least 44px.

- [ ] **Step 7: Verify in browser**

Go to My Event → See My Event tab → Act 1 shows the venue photo with hotspots → tap a hotspot → tooltip shows capacity. Switch to Act 2 → drag slider → decoration reveals. Test with all 5 venues. Test 375 px.

- [ ] **Step 8: Commit**

```bash
git add js/app.js js/data.js css/styles.css index.html
git commit -m "feat: See My Event Acts 1-2 — venue photo with hotspots, sweep slider for decor"
```

---

### Task 4: See My Event — Act 3 (Your celebration) + perk card

**Files:**
- Modify: `js/app.js` (add `actThree(ev)`, `birdEyeLayout(guests, venue)`, `silhouetteStrip()`, `perkCard(ev)`)
- Modify: `css/styles.css` (add `.sme-act3`, `.floor-plan`, `.fp-table`, `.fp-guests`, `.time-slider`, `.silhouette-strip`, `.perk-card`)
- Modify: `index.html` (bump `?v=48`)

**Interfaces:**
- Consumes: `D.VENUE_ANCHORS[].tableZone`, event guest count, venue `cap[]`, menu tier, `journeyOf(ev)`, `now()`.
- Produces: `actThree(ev)` → HTML; `perkCard(ev)` → HTML; `ACT['reserve-perk']` action that sets `journeyOf(ev).visitRequested = now()` and pushes a WA message.

- [ ] **Step 1: Implement `birdEyeLayout(guests, venueAnchor)`**

Given guest count and venue anchor's `tableZone`, calculate table positions. Tables of 10 guests each (round tables). Layout as a grid within the tableZone area. If guests > venue capacity, flag `overcrowded = true`. Return `{ tables: [{cx, cy, seats}], overcrowded, note }`.

- [ ] **Step 2: Implement `actThree(ev)`**

SVG-based bird's-eye view of the venue floor plan (simplified rectangle with stage area from anchor). Tables rendered as circles with seat dots around them. Animated tiny guest silhouettes at tables (CSS animation, subtle movement). A time slider (range input): arrival (tables filling) → ceremony (guests at stage) → dinner (guests at tables, food counters active). A `.fp-counter` shows "300 guests · 30 tables of 10" live. If overcrowded, show `<p class="note">` with the gentle crowding message.

- [ ] **Step 3: Add eye-level silhouette strip**

A horizontal strip below the bird's-eye view: CSS silhouette figures (simple SVG people shapes) against a gradient sky. Time slider changes the gradient: day (light blue) → dusk (orange-pink) → night (dark blue with star dots). Adds atmosphere without trying to be photorealistic.

- [ ] **Step 4: Implement `perkCard(ev)`**

At the end of Act 3, a gift-styled card: golden border, gift icon, text "Your hall hosts a private walk-through and tasting this Saturday, hosted by ShaadiKart. Reserve a seat, no obligation." Button: "Reserve a seat". Tapping sets `journeyOf(ev).visitRequested = now()`, pushes WA message "Walk-through confirmed", updates the card to show "Reserved ✔".

- [ ] **Step 5: Wire Act 3 and perk card into See My Event**

Replace the placeholder tab with `actThree(ev)` + `perkCard(ev)`. The perk card also appears on the My Event hub after the See My Event stage card.

- [ ] **Step 6: Add CSS for Act 3**

`.floor-plan`: SVG container with aspect-ratio. `.fp-table`: circle with hover effect. `.silhouette-strip`: 120px tall strip with gradient background. `.perk-card`: golden-bordered card with gift icon. `.time-slider`: styled range input. Responsive: SVG scales, strip stacks below.

- [ ] **Step 7: Verify in browser**

Act 3 tab → bird's-eye shows tables for the guest count → drag time slider → lighting changes → silhouette strip animates. Test with 10 guests (1 table), 300 guests (30 tables), 1000+ guests (overcrowded note). Tap "Reserve a seat" → card updates → WA thread shows walk-through message. Test 375 px.

- [ ] **Step 8: Commit**

```bash
git add js/app.js css/styles.css index.html
git commit -m "feat: See My Event Act 3 — bird's-eye floor plan, time slider, perk card"
```

---

### Task 5: Welcome Conversation + Blueprint + updated unlock rule

**Files:**
- Modify: `js/app.js` (evolve `gateBox` into conversation UI; add `pageBlueprint(id)`, `blueprintHtml(ev)`; update unlock condition; update `pageMyEvent` stages 4-6)
- Modify: `css/styles.css` (add `.host-card`, `.blueprint`, `.bp-section`, `.bp-approve`)
- Modify: `index.html` (bump `?v=49`)

**Interfaces:**
- Consumes: `journeyOf(ev)`, `gateOf(ev)`, `gateStage(ev)`, `verified(g)`, existing meeting modal, existing gate/call logic, `liveSvcs(ev)`, `svcTotal(s)`, `suggestBudget()`, cart event data.
- Produces: `pageBlueprint(id)` → HTML; `ACT['approve-blueprint']` sets `journeyOf(ev).blueprintApproved = now()` and pushes WA "blueprint ready" + "payment opened" messages; updated `gateOf(ev).unlocked` condition now also requires `blueprintApproved`; route `#blueprint--{id}`.

- [ ] **Step 1: Add host card to the Conversation stage in My Event hub**

Warm copy: "{Host name} will call you within 2 hours to hear about your {event type}." Show host photo placeholder (silhouette icon), name, role, years, languages from `journeyOf(ev).host`. Below: the existing meeting scheduling and call status from `gateBox()`, but with updated copy — no "payment is locked" framing, instead "Your ShaadiKart host".

- [ ] **Step 2: Refactor `gateBox` copy for warmth**

Replace "Payment is locked for now" with "Your booking journey". Replace step labels: "Meeting with ShaadiKart" → "Meet your host, {name}". "ShaadiKart calls you" → "{name} calls you". Keep the functional gate logic unchanged.

- [ ] **Step 3: Implement `pageBlueprint(id)` and `blueprintHtml(ev)`**

A one-page summary: See My Event preview on top (the venue photo with decor overlay, small), then sections: Selections (each service with partner, package, price), Guests (count, ranges), Menu (tier, diet), Budget (total with GST), Timeline (event date, milestones), Special requests (from cart query). At the bottom: "Approve" button and "Request a change" button (goes to WA thread with a prefilled message).

- [ ] **Step 4: Wire Blueprint stage into My Event hub**

After the Conversation stage shows "completed" (gate.held is set), the Blueprint stage becomes active. It links to `#blueprint/{id}`. Approving sets `journeyOf(ev).blueprintApproved = now()` and pushes WA messages.

- [ ] **Step 5: Update unlock rule**

The `pay` form handler (line ~1820) checks: `gateOn(ev) && !gateOf(ev).unlocked` stays, but `cg-unlock` action now also requires `journeyOf(ev).blueprintApproved`. The Concierge unlock checklist adds "Blueprint approved" as a condition.

- [ ] **Step 6: Push WA messages at conversation milestones**

Host assigned → "{Host}, your ShaadiKart host, will call you within 2 hours." Call missed → "We tried to reach you. You can call us any time on 5432112345." Blueprint ready → "Your blueprint is ready to approve." Payment opened → "You can now pay on the ShaadiKart website." + safety line. Booked → confirmation.

- [ ] **Step 7: Add CSS for host card and blueprint**

`.host-card`: avatar circle, name/role/years, warm background. `.blueprint`: clean one-page layout, sections with headings, approve button is `--gold`. Mobile: sections stack, approve button full-width.

- [ ] **Step 8: Verify in browser**

Full journey: send requests → My Event hub → See My Event → Conversation stage shows host card → schedule meeting → (Concierge) mark held → calls → Blueprint stage activates → open Blueprint → approve → Payment stage activates → (Concierge) unlock → pay. Verify WA thread has all messages in order. Verify the unlock rule: try paying before Blueprint approval (should be blocked). Test 375 px.

- [ ] **Step 9: Commit**

```bash
git add js/app.js css/styles.css index.html
git commit -m "feat: Welcome Conversation, Blueprint approval, updated unlock rule"
```

---

### Task 6: Concierge console additions + warm-signal panel

**Files:**
- Modify: `js/app.js` (`pageConcierge` and `cgDetail` — add warm-signal panel, suggested next move, conversation prompts, notes→Blueprint draft, Blueprint approved check in unlock)
- Modify: `css/styles.css` (add `.cg-signals`, `.cg-suggest`, `.cg-prompts`)
- Modify: `index.html` (bump `?v=50`)

**Interfaces:**
- Consumes: `journeyOf(ev)`, `gateOf(ev)`, `gateStage(ev)`, `verified(g)`, `blueprintHtml(ev)` from Task 5, WA thread from Task 2.
- Produces: Updated `cgDetail(ev)` with warm-signal panel and suggested next move; `ACT['cg-draft-blueprint']` pre-fills Blueprint from notes.

- [ ] **Step 1: Add warm-signal panel to `cgDetail`**

A new `.cg-signals` box in the sidebar showing what the customer did: "Viewed See My Event" (if any act was opened), "Compared halls" (if compare was used), "Asked about rooms" (if room hotspot tapped), "Tapped the perk" (if visitRequested). Each is a tag with icon and timestamp. Data comes from a new `ev.journey.signals[]` array that `pageMyEvent` and `actOne`/`actThree` append to when the customer interacts.

- [ ] **Step 2: Add suggested next move**

Below the warm-signal panel, a `.cg-suggest` card with context-aware text: if the customer tapped the perk → "Offer the walk-through."; if they spent time on Act 3 → "They're imagining their event. Ask what they'd change."; if Blueprint is pending → "Blueprint is ready for the customer to approve."; default → "Ask about their vision for the day."

- [ ] **Step 3: Add conversation prompts**

A collapsible section with open-ended prompts for the host to use during the call: "What's most important to you about the venue?", "Is there a colour theme or style you're drawn to?", "Any dietary requirements we should know?", "Would you like to walk through the venue before deciding?" (offered only when relevant signals exist). Each prompt has a checkbox to mark "asked".

- [ ] **Step 4: Update the unlock checklist**

Add "Blueprint approved" to the `cg-chk` list. The unlock button is disabled unless `journeyOf(ev).blueprintApproved` is truthy, in addition to the existing conditions.

- [ ] **Step 5: Wire notes into Blueprint draft**

A "Draft Blueprint" button that pre-populates the Blueprint page with the concierge notes, using `journeyOf(ev).conciergeNotes` (renamed from `gateOf(ev).notes`). The Blueprint page reads these notes into a "Host notes" section.

- [ ] **Step 6: Add CSS**

`.cg-signals`: flex-wrap tags. `.cg-suggest`: amber-bordered callout. `.cg-prompts`: collapsible list with checkboxes.

- [ ] **Step 7: Verify in browser**

As customer: view See My Event, tap perk. As staff (Concierge): open the event → warm-signal panel shows "Viewed See My Event", "Tapped the perk". Suggested next move says "Offer the walk-through." Prompts are present. Add notes → Draft Blueprint → Blueprint page shows notes. Unlock checklist includes Blueprint approved. Test 375 px.

- [ ] **Step 8: Commit**

```bash
git add js/app.js css/styles.css index.html
git commit -m "feat: Concierge warm signals, suggested moves, conversation prompts, Blueprint draft"
```

---

### Task 7: Polish, no-partner-number audit, full regression, republish

**Files:**
- Modify: `js/app.js` (copy pass, edge-case fixes)
- Modify: `js/data.js` (if any data corrections needed)
- Modify: `css/styles.css` (mobile fixes, copy pass)
- Modify: `index.html` (bump final `?v=51`)
- Create: `test-audit.js` (Node script for partner-number grep and data integrity)

**Interfaces:**
- Consumes: all from Tasks 1–6.
- Produces: clean, tested, publishable demo.

- [ ] **Step 1: Run partner-number audit**

Write and run a Node.js script that:
- Reads `js/app.js` and `js/data.js` as strings
- Finds every 10-digit number pattern in rendered HTML template literals
- Confirms only `5432112345` and customer phone placeholders appear
- Flags any partner phone number from `D.PARTNERS`

- [ ] **Step 2: Copy pass**

Review all user-facing strings added in Tasks 1–6 for: spelling, grammar, tone (warm, confident, no urgency), consistency with spec section 7 message table. Fix any issues.

- [ ] **Step 3: Mobile layout pass at 375 px**

Test every new screen at 375 px width:
- My Event hub timeline: horizontal scroll, dots not clipped
- See My Event acts: photos full-width, slider touch-friendly, hotspots 44px+
- Blueprint: sections stack, approve button full-width
- Dock: bottom sheet mode, not fixed right panel
- WhatsApp thread: readable, bubbles not clipped

- [ ] **Step 4: Full regression test**

Walk through these flows and confirm no breakage:
1. Browse → add to cart → send requests → My Event hub loads
2. Planner: step 1 (event type) → step 2 (choose partners) → step 3 (review) → send
3. Existing checkout summary with gate steps (for events created before this build)
4. Partner dashboard login and view
5. Concierge: full journey through meeting → call → unlock
6. Bookings: refund flow, reschedule flow, support ticket
7. Search, compare, wishlist, offers pages

- [ ] **Step 5: Fix any issues found**

- [ ] **Step 6: Bump `?v=51` in `index.html`**

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: polish, partner-number audit, mobile fixes, regression pass"
```

- [ ] **Step 8: Republish artifact**

Read the live artifact files (app.js, data.js, styles.css) to check for conflicts, then publish `artifact-page.html` with root = demo folder and files list. Update `?v=` in published index.html.

- [ ] **Step 9: Verify published link**

Open the published artifact URL and walk through the full journey once more.
