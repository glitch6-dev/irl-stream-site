# Backpack Stripe Pre-Order Integration — Design

**Date:** 2026-06-08
**Repo:** irl-stream-site
**Goal:** Wire the three TG6 backpacks (Metro, Roamer, Nomad) to Stripe so customers can place **pre-orders** (full price, paid upfront, to fund the build run).

## Decisions (locked with user)

- **Prices (final, one-time, USD):** Metro **$2,100** · Nomad **$3,000** · Roamer **$5,000**.
- **Pre-order only:** full price collected now. Quantity fixed at 1. No deposit/partial.
- **Stripe mode:** MCP is connected to **"Team Glitch 6 sandbox"** (TEST). Build with **test** payment links now; swap to **live** before launch. Real money does not move until the live swap.
- **Button mechanism:** single-SKU → **direct anchor `href`**, no JavaScript (the merch/`sizeLinks` pattern is not used here; backpacks have no size variants).
- **Price display on product pages:** `"$2,100 + shipping"` etc.
- **Pre-order note copy:** `"Pre-order — reserves your build. Ships once assembled."`

## Customer path (the ONLY reachable one)

```
index.html (Shop cards)
   ├─ TG6 Metro  → products/metro.html
   ├─ TG6 Roamer → products/roamer.html
   └─ TG6 Nomad  → products/nomad.html
```

`inStock-pages/` and `pre-orders-pages/` are **orphaned** (nothing links to them) and contain
wrong prices / apparel size selectors / fake URLs. **Out of scope — left untouched**, to be
cleaned up separately.

## Work

### 1. Stripe objects (sandbox, via MCP)
For each backpack create: Product → one-time Price (USD, cents) → qty-1 Payment Link.

| Backpack | Product name | unit_amount | Link (filled at build) |
|---|---|---|---|
| Metro  | TG6 Metro — IRL Streaming Backpack (Pre-Order)  | 210000 | _TBD_ |
| Nomad  | TG6 Nomad — IRL Streaming Backpack (Pre-Order)  | 300000 | _TBD_ |
| Roamer | TG6 Roamer — IRL Streaming Backpack (Pre-Order) | 500000 | _TBD_ |

Product descriptions note pre-order + ships-when-assembled, drawn from each page's specs.

### 2. Product pages (`products/metro.html`, `roamer.html`, `nomad.html`)
- Price `<h2>`: `TBD` → `"$X,XXX + shipping"`.
- `#purchaseBtn`: `href="#"` → payment-link URL; label `PURCHASE NOW` → `PRE-ORDER`; keep `target="_blank"`.
- Replace the "Stripe link coming when prototype is ready" sub-note with the pre-order note.
- Add greppable marker by each button: `<!-- SANDBOX test link — swap to live before launch -->`.

### 3. Homepage cards (`index.html`)
- Footer price: Metro `TBD`→`$2,100`; Roamer `Coming Soon`→`$3,000`; Nomad `Coming Soon`→`$5,000`.
- Add a small muted `Pre-order` tag next to each card price.
- Nomad overlay button: `COMING SOON` → `VIEW` (now orderable); unify icons to shopping-bag.

## Go-live handoff (test → live)
1. Recreate the 3 products/prices/links in the **live** Stripe account (or via MCP once re-auth'd to live).
2. Set each live product's **image** (the MCP `create_product` can't; patch via `PostProductsId` with `images[0]=<public URL>`, or upload in the dashboard). Public image source used in sandbox = GitHub raw on `main` (depends on the repo staying public). Also set `shippable=true`.
3. Enable **shipping-address collection** on each live Payment Link (MCP `create_payment_link` can't set this; do it in dashboard or via raw API).
4. Find-and-replace the 3 test URLs → live URLs across `products/*.html` (markers make them greppable).
5. Remove the SANDBOX markers.

IDs/URLs of the created sandbox objects are appended below at build time.

## Out of scope (YAGNI)
Cart, inventory, shipping-cost calculation, tax config, deposits, editing orphaned page sets.

---

## Build log (sandbox object IDs — built 2026-06-08)

Account: **Team Glitch 6 sandbox** (`acct_1TdQTbEdAskP5mh3`, livemode=false).

| Backpack | Product | Price | Payment Link | Test URL (wired into page) |
|---|---|---|---|---|
| Metro  | `prod_UfCR0XUfSVpZxw` | `price_1Tfs3YEdAskP5mh3vZmUGUKN` ($2,100) | `plink_1Tfs3mEdAskP5mh3eLWvU8He` | https://buy.stripe.com/test_bJe9AT2lzeYSesqfAU04800 |
| Nomad  | `prod_UfCSl0FYJYKSeF` | `price_1Tfs3eEdAskP5mh3N7KLzNeQ` ($3,000) | `plink_1Tfs3pEdAskP5mh3ALflgFik` | https://buy.stripe.com/test_7sY7sL1hv9Ey0BA60k04801 |
| Roamer | `prod_UfCSNCICem2yXZ` | `price_1Tfs3fEdAskP5mh3ulliTN1q` ($5,000) | `plink_1Tfs3sEdAskP5mh3hp3fXyWX` | https://buy.stripe.com/test_fZubJ12lz03Y1FE2O804802 |

Product images set via `PostProductsId` `images[0]` (GitHub raw on `main`, returns 200; repo is public), and `shippable=true`:
- Metro → `…/main/img/in-stock/tg6-metro.png`
- Nomad → `…/main/img/pre-orders/tg6-nomad.png`
- Roamer → `…/main/img/pre-orders/tg6-roamer.png`

Files edited: `products/metro.html`, `products/nomad.html`, `products/roamer.html`, `index.html`.
(Note: `products/*.html` were root-owned; chowned to `kali` so the editor could write them.)

To find the test links for the go-live swap: `grep -rn "buy.stripe.com/test_" products/`.
