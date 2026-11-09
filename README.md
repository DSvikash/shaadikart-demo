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

1. **Home** (layout follows the founder's reference image, 9 Nov 2026) — header with Categories ▾ / Our Partners / Offers / Help ▾ / search / wishlist / cart / Login, "Dream Wedding Made Easy" hero with search + location + date, Popular Categories, Featured Partners, Special Offer, Why Choose ShaadiKart, 4 Easy Steps.
   - **Login / Sign Up** popup has two tabs: Customer and Partner (OTP 1234). Partner login opens a demo Partner dashboard showing that partner's booking requests.
   - Extra pages: All categories, Our Partners, Offers (10–20% partner offers applied in the cart), Wishlist.
2. **Cart** → "Fill sample wedding cart" (same six services as the JPG; ₹4,13,000 before GST and partner offers).
3. **Send booking requests** → log in with any 10-digit number, OTP **1234**.
4. **Checkout summary** — partners confirm one by one; DJ Beat Factory is "Not available" on purpose, and the rest of the cart still goes ahead.
5. **Proceed to Pay** (demo) → **Booking Confirmed!**
6. **My Bookings** → on Candid Frames press **Cancel this service** → only photography is cancelled; the venue, decor, catering and makeup stay booked.
7. Open the **Refund tracker**, **Cancellation history**, **Payment history**, **Receipts**, **Order history**, **Reschedule** and **Support** tabs.

Footer → "Reset demo data" restores the starting state (includes a pre-booked sample wedding).

## Files

- `index.html` — page shell for local use
- `artifact-page.html` — the same shell in the format the Claude artifact viewer expects
- `img/` — 67 bundled Unsplash photos
- `css/styles.css` — visual system (purple + gold from the JPG), responsive down to 375 px
- `js/data.js` — 12 categories, 43 illustrative partners, 10 partner offers, packages, cancellation policy
- `js/app.js` — routing, cart, request-to-book, payments, per-service cancellation, refunds, reschedule, support

## Phase 1 boundaries

- Customer side, plus a small demo Partner dashboard (booking requests only). No admin panel.
- Mock OTP and mock payment. No real card or UPI input.
- Time-simulated partner replies, refunds and reschedule approvals (seconds, not days).
