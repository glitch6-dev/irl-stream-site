# IRL Stream Site — Full Image Audit + Regeneration Plan

- **Date:** 2026-07-03
- **Author:** tg6-architect (plan only — read-only survey, no builds run)
- **Repo:** `/home/kali/Desktop/TG6/Repos/irl-stream-site`
- **Directive:** Founder — "a lot of placeholders or images that are not up to standard, especially the images of the actual backpacks — plan a full image audit and plan to execute it with our new gemini skill."
- **Tool of record:** `image-gen` skill (Google Gemini "nano banana", ~$0.04/image), invoked via the Skill tool.
- **Scope of survey:** LIVE pages only — `index.html`, `about.html`, `contact.html`, `faq.html`, `terms.html`, `privacy.html`, `404.html`, `products/{metro,roamer,nomad}.html`, plus `css/style.css` and `js/*`. Legacy leftovers (`discover.html`, `products.html`, `pre-orders.html`, `inStock-pages/`, `pre-orders-pages/`, `vender/`) are excluded and slated for separate deletion.

---

## 0. Headline findings (the "why it looks cheap")

1. **The three backpack PNGs have OPAQUE flat backgrounds.** Verified via alpha channel: `tg6-metro.png`, `tg6-roamer.png`, `tg6-nomad.png` all have `alpha_range=(255,255)` — no transparency. The CSS applies `filter: drop-shadow(...)` to these images (`.pcard img`, `.product-art img`, `.hero-art img`), so the shadow is wrapping a **rectangle**, not the bag silhouette. On the dark card background this reads as a floating box. This single defect explains much of the "not up to standard" feel. The brand `tg6-wolf.png` by contrast IS correctly transparent (`alpha_range=(0,255)`) — proof the intended look is a knocked-out subject with a silhouette shadow.
2. **One product image does double/triple duty.** `tg6-metro.png` is used on the homepage lineup card, the Metro product hero, AND the Metro loadout sticky art. Any regen fixes all three slots at once.
3. **Gear photos are real third-party branded hardware.** Regenerating them via Gemini would fabricate branded products (a fake "Sony ZV-1 II", a fake Peplink) — trademark/accuracy hazard. These should stay REAL and be OPTIMIZED, not regenerated. (See §5.)
4. **13 unused image assets** are dead old-template leftovers (clothing icons, spare logos, unused bg SVGs, `na.png`, `insta-1.png`), including a **597 KB** unused `logo-01.svg`. Pure cleanup, no regen.
5. **One 929 KB gear PNG** (`dell-latitude-7420.png`) renders at 58px — absurd weight for a thumbnail.

---

## 1. Full inventory of every image referenced by LIVE pages

Grade key: **KEEP** (up to standard, leave alone) · **REGEN** (regenerate via Gemini) · **OPTIMIZE** (real asset, keep content, resize/compress/standardize — not Gemini) · **DELETE** (unused by any live page).

### 1a. Backpack / product imagery — the priority

| File | Dims | Size | Used by | Render slot | Grade |
|---|---|---|---|---|---|
| `img/in-stock/tg6-metro.png` | 720×936 | 52 KB | index card, `products/metro.html` hero + loadout-art | `max-height:230px` (card), ~340px (art), drop-shadow | **REGEN** (opaque bg defect + quality) |
| `img/pre-orders/tg6-roamer.png` | 720×936 | 62 KB | index card, `products/roamer.html` hero + loadout-art | same | **REGEN** |
| `img/pre-orders/tg6-nomad.png` | 720×936 | 65 KB | index card, `products/nomad.html` hero + loadout-art | same | **REGEN** |

> Note: the `img/in-stock/` and `img/pre-orders/` **directory names** are legacy (every tier is now uniformly "◆ PRE-ORDER"). The regen keeps the existing paths to avoid touching HTML in this pass; a future cleanup can move them to `img/products/`. **Path rename is out of scope here.**

### 1b. Brand assets (logo-derived — the founder's supplied foundation)

| File | Dims | Size | Used by | Grade |
|---|---|---|---|---|
| `img/brand/tg6-wordmark.png` | — | 570 KB | nav logo on ALL live pages | **KEEP** (founder-supplied logo foundation — never regenerate; optionally OPTIMIZE weight only) |
| `img/brand/tg6-wolf.png` | 635×652 | 512 KB | index hero mark, 404 | **KEEP** (already transparent, on-brand; OPTIMIZE weight optional) |
| `img/brand/tg6-og.jpg` | 1376×768 | 269 KB | OG/social `<meta>` on 6 pages | **KEEP** (functional social card; revisit only after backpacks land) |
| `img/brand/tg6-circuit.jpg` | — | 350 KB | CSS bg texture (opacity .2–.28) | **KEEP** (decorative, low-opacity — quality not visible) |
| `img/brand/tg6-emblem.jpg` | 1024×1024 | 219 KB | `contact.html` decorative | **KEEP** (candidate REGEN only if §4 consistency pass is greenlit) |
| `img/brand/tg6-rig.jpg` | 1024×1024 | 259 KB | `about.html` decorative | **KEEP** (same — optional consistency REGEN) |

### 1c. Gear / loadout thumbnails (real third-party components — render at 58px on WHITE tiles)

Rendered by `.load-row img { width:58px; height:58px; background:#fff; object-fit:contain; }`. All grade **OPTIMIZE** (keep real content; do NOT Gemini-fabricate branded hardware — see §5).

| File | Size | Note |
|---|---|---|
| `img/gear/dell-latitude-7420.png` | **929 KB** | Grossly oversized for 58px — highest-value compress |
| `img/gear/rode-videomic-go-ii.png` | 219 KB | Resize/compress |
| `img/gear/sony-zv1-ii.jpg` | 173 KB | **CC-BY Wikimedia — attribution required.** Credit link present on all 3 product pages. KEEP attribution intact through any optimization. |
| `img/gear/tmobile-5g-gateway.png` | 148 KB | Metro only |
| `img/gear/ulanzi-vl49-led.png` | 135 KB | |
| `img/gear/peplink-max-transit.png` | 126 KB | Roamer only |
| `img/gear/elgato-cam-link-4k.jpg` | 125 KB | |
| `img/gear/np-f970-battery.jpg` | 63 KB | |
| `img/gear/sandisk-high-endurance.png` | 54 KB | |
| `img/gear/dji-mic-mini.png` | 34 KB | |
| `img/gear/starlink-mini.png` | 22 KB | Nomad only |
| `img/gear/SOURCES.md` | — | Provenance record — KEEP. |

Target for all gear: 240×240 (retina for 58px+padding), clean white background, ≤40 KB each. This is a `cwebp`/`pngquant`/Pillow batch job — **a build handoff, not image-gen.**

### 1d. Functional / generated (out of regeneration scope)

- `img/fav/*` (favicons, manifest, browserconfig, `tg6-mark-512.png`, `gen_favicon.py`) — **KEEP en bloc**, generated from the mark; handled by the `shipping-favicons` skill if ever needed.

### 1e. UNUSED by any live page — **DELETE** (cleanup task, not this regen)

`img/logo.svg`, `img/logo-01.svg` (**597 KB**), `img/404.svg`, `img/done.svg`, `img/about-bg.svg`, `img/contact-bg.svg`, `img/hero-bg.svg`, `img/jacket-icon.svg`, `img/pants-icon.svg`, `img/shirt-icon.svg`, `img/watch-icon.svg`, `img/misc/na.png` (placeholder), `img/insta/insta-1.png` (placeholder). Also `img/.DS_Store`.

> Verify-before-delete caveat: these were checked against the LIVE set + CSS/JS only. Confirm they aren't referenced by the legacy pages you still want to render before the legacy purge, then delete both together.

---

## 2. Prioritized regeneration list (backpacks first)

All three share ONE spec (§3). Per-tier deltas below. Each is generated, then **background-knockout post-processed** to a transparent PNG so the CSS silhouette drop-shadow works.

### Target output spec (all three)
- **Format:** PNG-24 **with alpha** (transparent background). This is the fix for finding #1.
- **Dimensions:** 1200×1500 (portrait 4:5). Retina headroom for the 340px art slot and 230px card; downscales clean.
- **File-size budget:** ≤200 KB each after `pngquant`/`oxipng` (current opaque files are 52–65 KB but visibly flat; the richer render earns the extra weight, still page-safe).
- **Subject framing:** full backpack, upright, centered, straps and front face visible, generous transparent margin so the drop-shadow isn't clipped.

### 2.1 — Metro (TIER_01 · CITY) — accent **cyan `#22d3ee`**
Gemini prompt sketch:
> "High-end industrial product render of a matte-black technical streaming backpack, upright 3/4 front-left view, slight low camera angle. Compact urban form factor, clean MOLLE webbing front panel, a small circular TG6 emblem patch, one short stubby 5G antenna, cable-management detail. Studio softbox key light from upper-left, subtle **cyan** rim light along the right edge, thin cyan telemetry accent lines. Matte finish, octane-style studio product render — clearly a stylized render, not a photograph. Isolated on a plain neutral background for clean cutout. Portrait 4:5."

### 2.2 — Roamer (TIER_02 · BACKCOUNTRY) — accent **purple `#a855f7`**
> Same base spec. Deltas: larger rugged expedition form factor, dual whip antennas (Peplink dual-SIM cue), reinforced weatherproof panels, more MOLLE, a side-mounted battery pod. **Purple** rim light + purple telemetry lines.

### 2.3 — Nomad (TIER_03 · OFF-GRID) — accent **magenta `#e0479e`/tier magenta**
> Same base spec. Deltas: largest off-grid rig, a compact Starlink-style flat dish mounted/stowed on top, heavy-duty frame, extra battery capacity bulges. **Magenta** rim light + magenta telemetry lines.

> **Consistency is enforced by generating all three in one session** so lighting, angle, material and scale-language read as one product family (see §3). Expect 2–3 attempts per tier to lock angle/silhouette parity.

---

## 3. Consistency spec (one product line, three tiers)

Every generated backpack must share:
- **Camera:** 3/4 front-left, slight low angle, subject upright and centered. Same virtual focal length (mild telephoto, minimal distortion).
- **Material:** matte-black technical fabric, MOLLE webbing, TG6 circular emblem patch in the same position on all three.
- **Scale language:** Metro smallest → Roamer mid → Nomad largest; antenna/dish complexity escalates with tier so the lineup reads as a progression.
- **Lighting:** neutral softbox key upper-left + **tier-accent rim light** (cyan / purple / magenta) on the opposite edge. No colored key — only the rim + telemetry lines carry the accent, so the bags still read as the same black product.
- **Background:** generated on plain neutral, then knocked out to **transparent**. The page's existing `.hero-art::before` / `.loadout::before` glows supply ambient tier color in-context — do not bake a heavy glow into the PNG.
- **Style register:** industrial product render, matte, telemetry/glitch accents — deliberately a *render*, never a faked photograph (ties to §5).

---

## 4. (Optional, lower priority) Brand decorative consistency pass

Only if greenlit AFTER backpacks land: `tg6-emblem.jpg` and `tg6-rig.jpg` are 1024² decorative jpgs on about/contact. If they clash with the new render language, REGEN them into the same matte/telemetry register (accent-neutral, since they're not tier-specific). `tg6-wordmark.png` is the founder-supplied logo foundation — **never regenerate**, weight-optimize only. Flagged, not scheduled.

---

## 5. Misrepresentation-risk mitigation (hard constraint)

**The tension:** backpacks are assembled per-order from real components — there is no manufactured SKU sitting in inventory. A photorealistic "photo" of a finished bag would imply stock that doesn't exist.

**The resolution — an honesty architecture, not a disclaimer bolt-on:**
1. **The bag imagery is deliberately a stylized RENDER.** The matte/telemetry/octane-render register (§3) signals "product visualization," not "here is the physical unit in a warehouse." This is standard, honest practice for configure-to-order hardware.
2. **The proof-of-real lives in the loadout manifest.** The gear thumbnails are REAL photos of the REAL third-party components that go into each build. Keeping them real (§1c, §5·3) is what makes the page truthful: stylized hero render of the assembled concept + real photos of the actual parts inside.
3. **Never Gemini-fabricate branded gear.** Generating a fake Sony/Peplink/Starlink is both a trademark hazard and a misrepresentation of the real component. Gear = OPTIMIZE real photos only.
4. **Honest microcopy (recommend to founder, HTML change — separate pass):** a small mono caption near the hero render, e.g. `// PRODUCT RENDER · CONFIGURED PER ORDER`. Consistent with the existing telemetry voice. Flagged for the founder's call; not part of the image work itself.
5. **Preserve the Sony CC-BY attribution** through any gear optimization.

---

## 6. Execution order — discrete tasks (one session each)

| # | Task | Tool | Est. gens | Cost @ $0.04 |
|---|---|---|---|---|
| T1 | Generate + knock-out Metro render → transparent 1200×1500 PNG, compress ≤200 KB, drop into `img/in-stock/tg6-metro.png` | `image-gen` skill + bg-removal + `pngquant` | 3 (retries) | $0.12 |
| T2 | Same for Roamer → `img/pre-orders/tg6-roamer.png` | `image-gen` + post | 3 | $0.12 |
| T3 | Same for Nomad → `img/pre-orders/tg6-nomad.png` | `image-gen` + post | 3 | $0.12 |
| T4 | **Verify** (see §7) — local render, Playwright screenshots of `index.html` + 3 product pages, confirm silhouette shadow + tier parity, **kill chromium** | Playwright | 0 | $0 |
| T5 | Gear optimization batch: resize→240², white bg, compress ≤40 KB each (esp. 929 KB Dell); keep Sony attribution | **build handoff** (Pillow/pngquant), NOT image-gen | 0 | $0 |
| T6 | Delete 13 unused leftovers (§1e) after confirming legacy pages don't need them | **build handoff** | 0 | $0 |
| T7 | (Optional) Brand decorative consistency REGEN — emblem/rig | `image-gen` | ~4 | $0.16 |

**Core cost (T1–T3): ~$0.36.** With optional T7: **~$0.52.** Rounding up for extra retries, **budget < $1.00 total** — trivial.

**Recommended sequence:** T1→T2→T3 in a single session (locks family consistency) → T4 verify → then T5/T6 cleanup as a separate build handoff → T7 only if the founder wants it.

**Gemini/nano-banana caveat:** transparency support is unreliable, so each of T1–T3 includes an explicit background-knockout post-step (rembg or manual matte on a plain-neutral generation) rather than trusting the model to emit clean alpha. The bag must be generated on a plain background specifically to make the cutout clean.

---

## 7. Verification step (T4)
- Serve locally (`python3 -m http.server` in the repo) and open `index.html` + the three product pages.
- **Playwright** screenshots at desktop + mobile widths; confirm for each: (a) drop-shadow now traces the bag **silhouette**, not a rectangle; (b) all three read as one product family; (c) correct tier accent per bag; (d) no layout shift at 230px card / 340px art sizes; (e) transparent edges clean against the dark panel.
- **OOM rule — kill chromium after:** `ps -C chromium -o pid= | xargs -r kill` then `ps -C chrome_crashpad_handler -o pid= | xargs -r kill`, and confirm `ps -C chromium` shows none. Do NOT `pkill -f ms-playwright-mcp` from a shell whose own command line contains that string.
- Evidence before "done": paste the before/after and the alpha re-check (`alpha_range` should now be `(0,255)`) before declaring the backpacks fixed.

---

## 8. Guardrails honored
- **Read-only** on the site except this one plan doc. No image-gen run. No HTML/CSS edited. Nothing outside the repo touched.
- **No push.** When the work is built and verified, commits will be staged and I will STOP and ask before any push (TG6 → glitch6-dev via the `ship` skill).
- Directory path renames, HTML microcopy, and legacy-page purge are called out but deliberately **out of scope** for this image pass.
