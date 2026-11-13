# ShaadiKart Demo Website — Phase 1 (customer side)

A clickable concept demo built from `01_References/ShadiKart.jpeg`, `Printout 1.pdf` and the two venue-marketplace blueprints.
Requirements and decisions: `02_Plans/ShaadiKart_Demo_Phase1_Requirements.md`.

All partners, prices, ratings and payments are illustrative. Nothing is sent anywhere; demo state is saved in the viewer's browser only.

## Run it

From the project folder:

```bash
python3 -m http.server 5173 --directory 04_Website/shaadikart-demo
```

Open http://localhost:5173. Photos (Unsplash, free licence) are bundled in `img/`; only the fonts load from Google Fonts.

## Shareable link

Private Claude artifact (share it from the page's Share menu): https://claude.ai/artifact/PQtpiQLTWSDtHj2xNoGrnC
It is published from `artifact-page.html` plus `css/`, `js/` and `img/`. Republish after any change so the link stays current.

## 3-minute demo script

1. **Home** (layout follows the founder's reference image, 9 Nov 2026) — header with Categories ▾ / Our Partners / Offers / Help ▾ / search / wishlist / cart / Login, "Dream Wedding Made Easy" hero with search + location + date, then the 4 Easy Steps band, Popular Categories, Featured Partners, Special Offer, Why Choose ShaadiKart.
   - **Start Planning Now** (or any of the 4 steps) opens a 4-step planner popup: event and details → services → one suggested partner per service (with budget meter) → review, then send booking requests or add to cart.
   - **Login / Sign Up** popup has two tabs: Customer and Partner (OTP 1234). Partner login opens a demo Partner dashboard showing that partner's booking requests.
   - Extra pages: All categories, Our Partners, Offers (10–20% partner offers applied in the cart), Wishlist.
2. **Cart** → "Fill sample wedding cart" (same six services as the JPG; ₹4,13,000 before GST and partner offers).
3. **Send booking requests** → log in with any 10-digit number, OTP **1234**.
4. **Checkout summary** — partners confirm one by one; DJ Beat Factory is "Not available" on purpose, and the rest of the cart still goes ahead.
5. **Proceed to Pay** (demo) → **Booking Confirmed!**
6. **My Bookings** → on Candid Frames press **Cancel this service** → only photography is cancelled; the venue, decor, catering and makeup stay booked.
7. Open the **Refund tracker**, **Cancellation history**, **Payment history**, **Receipts**, **Order history**, **Reschedule** and **Support** tabs.

Footer → "Reset demo data" restores the starting state (includes a pre-booked sample wedding).

## Phase 1.1 (10 Nov 2026)

- **Per-plate pricing** for venues (hall + in-house food) and caterers: veg / non-veg rate × guests, hall capacity and rating shown on cards, partner pages, planner, cart and checkout.
- **Pandit Ji & Spiritual** category (Pandit Ji, Kundli matching, Astrology call, Muhurat, Havan) with a **Mandir weddings** page listing real Arya Samaj Mandirs (public info, sources and date checked; not bookable, not ShaadiKart Verified). Research: `03_Research/Arya_Samaj_Mandirs_DelhiNCR_2026-11-10.md`.
- **Start Planning** step 2: five large photo cards plus an "Others" section.
- **ShaadiKart platform fee**: 0.5% of the cart's total value + 18% GST on the fee, charged once with the first payment, non-refundable.
- **Payment methods**: UPI, Card, Net banking and Cash, each with its own logo-style mark.
- **ShaadiKart Care** (free priority medical help on the wedding day) in Why ShaadiKart, the planner, checkout and My Bookings.
- Every verification badge reads **ShaadiKart Verified**.

## Phase 1.2 (10 Nov 2026)

- Hero: search bar removed; the "4 Easy Steps" and Start Planning Now sit in its place.
- Planner: nothing pre-selected; selecting a service shows its partners with rate and rating; green tick when selected, saffron + when not; "Others" is a card and a tab; no blinking (selections update in place).
- Planner step 3: best-rated partner pre-picked; + or the photo opens a popup with all partners, artists and portfolios.
- About Us page and a colourful menu tab.
- Payment options adapt to the amount (UPI split above ₹1 lakh, bank transfer for large payments). Research: `03_Research/ShaadiKart_Payment_Model_Research_2026-11-10.md`.

## Phase 1.3 (10 Nov 2026)

- Chat assistant (Help menu + floating button): rule-based demo, no AI service connected.
- New categories: Haldi & Mehendi, Kitty Party Packages (and a Kitty Party event type), both under Others in the planner.
- Per-plate partners (venues, caterers) use Standard / Premium / Premium Plus with the food types in each (veg and non-veg).
- Venue rooms (display only), past work for every partner, and a work preview on every partner row in planner step 2.
- Query step: customers add questions, partners reply, and payment opens only after the customer confirms the replies.
- 4 Easy Steps box in the hero is narrower.

## Swapping in the final logo

All logo spots read one setting, `BRAND` in `js/data.js`, plus the files in `img/brand/`. To rebrand, replace `img/brand/logo-mark.svg` (icon), optionally add `logo-full.svg` and set `fullLogo` in `BRAND`, then republish. Details: `img/brand/README.md`.

## Files

- `index.html` — page shell for local use
- `artifact-page.html` — the same shell in the format the Claude artifact viewer expects
- `img/` — bundled Unsplash photos; `img/brand/` — logo files (single place to change the logo)
- `css/styles.css` — visual system (purple + gold from the JPG), responsive down to 375 px
- `js/data.js` — 12 categories, 43 illustrative partners, 10 partner offers, packages, cancellation policy
- `js/app.js` — routing, cart, request-to-book, payments, per-service cancellation, refunds, reschedule, support

## Phase 1 boundaries

- Customer side, plus a small demo Partner dashboard (booking requests only). No admin panel.
- Mock OTP and mock payment. No real card or UPI input.
- Time-simulated partner replies, refunds and reschedule approvals (seconds, not days).

## Guest ranges (11 Nov 2026)

Guests is a dropdown of ranges per event type (e.g. Wedding 50–100 … 500–1000, Birthday 10–25 … 100–150) plus "Custom number…", in the cart's Event details and Start Planning step 1. A range is priced at its upper end. See `GUEST_RANGES` in `js/app.js`.
Budget is suggested from the event type and guest count (`BUDGET_PER_GUEST`, rounded to ₹5,000); a manual edit is kept until the event type changes.
Budget also uses a locality multiplier (Delhi 1.0, Gurugram 1.1, Noida 0.95, Ghaziabad/Faridabad 0.85). Full logic: `02_Plans/ShaadiKart_Budget_and_Guest_Logic.md`.

## Phase 1.4 (12 Nov 2026) — secure pre-payment flow

Order: partners confirm → customer reviews replies → **mandatory meeting** with ShaadiKart staff (reschedulable). In parallel, ShaadiKart calls within 2 hours **of the enquiry** (max 2 attempts, back to back). If the call is answered, no verification call is needed; if both are missed the customer calls **5432112345**. After the meeting is held and the customer is verified, a ShaadiKart executive unlocks the first payment (balance payments are never locked).
- **Concierge console** (`#concierge`, footer / account → Staff login, demo code 1234): queue, meeting held, outbound call log, customer call, notes, Unlock payment, WhatsApp send.
- **Demo route:** customer sends a request (OTP 1234) → partners confirm → Confirm replies → Schedule meeting → Staff login → open the customer → Start outbound calls (answered, or No answer twice then "I have called 5432112345" on the customer side) → Mark meeting completed → Unlock payment → customer pays. Two browser windows on the same browser stay in sync.
- **Verified photo sets** (Raw / After decoration / With guests) on Venue, Decor, Haldi & Mehendi and Kitty partner pages and in the partner popup.
- **WhatsApp catalog** (simulated) from the cart and checkout: "Get my cart on WhatsApp".

## Planner step 2 (13 Nov 2026)
Selecting a service expands its photo in place with the top 5 partners (rating and rate) and a "More" link to the full catalog; nothing is added below the cards.

## Choose vs. details (14 Nov 2026)
In the planner, **+** chooses a partner and the **›** arrow opens the details popup; nothing opens automatically. Work and past-work photos come from the tagged `LIB` in `js/data.js` so each photo matches its caption (7 haldi and mehendi photos added).
