# irl-stream-site Refresh — Design Spec

- **Date:** 2026-06-09
- **Status:** Approved (brainstorming) → ready for implementation plan
- **Repo:** `Repos/irl-stream-site` (GitHub: glitch6-dev)

## 1. Context

The IRL streaming-backpack storefront is currently a lightly-customized dark Bootstrap "Luxuay" e-commerce template (Figtree, monochrome black/white). It sells three backpacks — Metro ($2,100), Roamer ($3,000), Nomad ($5,000) — as pre-orders. The sister site `DigitalServices` (brand: **TG6·dev**, live at `glitch6-dev.github.io/DigitalServices`) is a separate, bespoke dark-green/lime design.

Two goals:
1. **Redesign so visitors engage with the backpacks** (not just a static catalog).
2. **Integrate TG6·dev** as a visible option for visitors who need web/software work instead of a backpack.

## 2. Goals & non-goals

**Goals**
- Refined-minimal redesign that keeps the black/white identity and reuses the existing dark hero backgrounds.
- Two engagement features: **A) "What's inside"** interactive hotspots + **B) "Find your backpack"** tier finder.
- Cross-sell integration to TG6·dev (nav + band + footer, links out).
- Consistent refined pass across the whole customer-facing site.
- Replace all emoji with a clean white SVG line-icon set.

**Non-goals (this pass)**
- No Stripe/payment work — buy buttons keep their current links; real links wired separately once the live Stripe account activates (tracked elsewhere).
- inStock-pages (`stock1–4`) and GlitchBars pages — **out of scope**.
- No new product photography required now (hotspots annotate existing renders; richer component shots come later).
- No backend/framework change — stays static HTML + Bootstrap.

## 3. Design system (refined minimal)

- **Palette:** black / near-black (`#020304`, `#000`, `#0a0a0a`) + white, greys for secondary text. No new brand color.
- **Type:** keep Figtree (existing import). Tighten the heading scale and letter-spacing on labels/kickers.
- **Backgrounds:** reuse `img/hero-bg.svg`, `img/about-bg.svg`, `img/contact-bg.svg` over `#020304`.
- **Framework:** keep Bootstrap + Remix Icon where already used.
- **Icon set:** one small set of inline white SVG line icons (24×24, stroke ~1.5, round caps). **Zero emoji anywhere on the site.** Icons needed: city skyline, mountains/backcountry, globe/off-grid, plus component icons for the hotspots (camera, modem/signal, battery, encoder/chip) and a small external-link mark for TG6·dev.
- **Components:** refine the product card (cleaner hover/overlay), shared nav + footer partials kept consistent across pages.

## 4. Homepage flow (`index.html`)

Order: **Hero → What's inside (A) → Shop grid → Find your backpack (B) → TG6·dev band → Subscribe → Footer.**

### Hero
Existing `tg6-hero` (reuses `hero-bg.svg`), refined spacing/type. Headline "Stream Anywhere.", eyebrow "Built for IRL streamers", primary CTA "Shop now" → `#shop`.

### A — "What's inside" (new)
- Features the **Metro** on the homepage (lead product, ships first); Roamer/Nomad get the same treatment on their own product pages.
- A featured backpack image with **clickable hotspot dots** positioned over it.
- Clicking a dot reveals that component's name + short blurb (slide-in panel or inline callout): e.g. **Sony ZV-1 II camera, 5G modem/gateway, hot-swap battery, encoder**.
- **Data-driven:** hotspots defined as a JS array of objects `{ x, y, iconId, label, blurb }` per backpack, rendered from data — so flat-photo hotspots can be swapped for real component imagery later **without a rebuild**.
- Keyboard-accessible (dots are buttons; panel readable by screen readers).

### Shop grid
The three backpack cards (Metro/Roamer/Nomad), refined. Each links to its product page. Prices and pre-order labels retained.

### B — "Find your backpack" (new; absorbs old "Choose Your Tier")
- Prompt: **"Where do you stream?"** Three choices, each an SVG-icon tile:
  - **City → Metro** (icon: city skyline)
  - **Backcountry → Roamer** (icon: mountains/trail) — framed as outdoors/adventure; dual-SIM bonding keeps you live where single-carrier coverage is patchy. Distinct from Off-grid.
  - **Off-grid → Nomad** (icon: globe meridians) — truly remote/satellite, no cell.
- Selecting a tile highlights the recommended backpack and links to its product page. The existing tier-explainer copy folds in here.

### TG6·dev band (integration)
- Cross-sell band: heading "Need a website or app, not a backpack?", subcopy "The same team builds sites, e-commerce, software & SEO — **TG6·dev**.", CTA "Explore TG6·dev ↗".
- Links to `https://glitch6-dev.github.io/DigitalServices/` in a **new tab** (`target="_blank" rel="noopener"`), with a small external-link SVG mark.

### Subscribe + Footer
Keep the existing subscribe form (Apps Script endpoint, honeypot) unchanged in behavior; refine styling. Footer gains a **TG6·dev** link alongside About/FAQ/Terms/Privacy.

### Nav
Add a **TG6·dev ↗** link to the primary nav (links out, new tab). Existing Shop/About/Contact + social icons (as SVGs) retained.

## 5. Product pages (`products/metro.html`, `roamer.html`, `nomad.html`)

- Apply the **"what's inside" hotspot** treatment to the product image (same data-driven system).
- Keep/refine the spec list and pre-order CTA.
- ⚠️ **Buy button keeps its current link** (`test_…` for now). Real live Stripe payment link wired in a separate task once the account activates. No Stripe dependency in this redesign.

## 6. Whole-site consistency pass

`about.html`, `contact.html`, `faq.html`, `terms.html`, `privacy.html`, `404.html`: apply the refined-minimal pass — shared nav/footer, consistent type/spacing, the SVG icon set, and reuse of the existing header backgrounds. **No structural redesign** of these pages, just consistency + de-emoji + the new nav/footer (incl. TG6·dev link).

## 7. Dependencies & future work

- **Stripe payment links** — blocked on live-account activation; buy buttons keep current links until then (tracked in memory `tg6_stripe_setup`).
- **Component photography** — hotspot system is built to accept richer internal/exploded shots later; flat-photo annotation ships now.
- **inStock-pages + GlitchBars** — deferred; their stale Stripe links and product catalog handled separately.

## 8. File-level change summary

- `index.html` — restructured per §4.
- `css/style.css` — refined-minimal tokens, hotspot + finder + TG6·dev band styles, card hover.
- `js/script.js` (and/or a new `js/hotspots.js`, `js/finder.js`) — hotspot data + render/interaction; finder selection logic.
- `products/{metro,roamer,nomad}.html` — hotspot treatment + refined layout.
- `about/contact/faq/terms/privacy/404.html` — consistency pass + shared nav/footer + TG6·dev link.
- New SVG icons (inline or `img/icons/`).
- `.gitignore` — add `.superpowers/`.
