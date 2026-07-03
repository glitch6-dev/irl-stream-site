# Image Audit — 2026-07-03

Full pass over `img/` (favicons skipped). Checker: `docs/img-contrast-check.py`.

## Render contexts (why contrast matters twice)

Gear images render in two places with opposite surfaces:

- `.load-tile` — 58×58 thumbnails on the near-black site background `#07060c` (all three product pages, loadout list)
- `.cam-media` — camera card on a **white** `#fff` tile (product pages, camera section — sony image only)

An image must read on both.

## Contrast failures → sent to tg6-marketing (2026-07-03)

| file | problem |
|---|---|
| `img/gear/sony-zv1-ii.jpg` | Black camera on black studio bg (contrast ≈ 4/255). Invisible on dark tiles, dead black slab in the white card. Canonical fail for the new rule. |
| `img/gear/dji-mic-mini.png` | Black mic kit on solid `#000` bg. Blends into the dark loadout tile. |
| `img/gear/elgato-cam-link-4k.jpg` | Wood-desk lifestyle shot — busy and muddy at 58px, inconsistent with the clean catalog style. |

Treatment: background removed/replaced with a light neutral offset color so the product pops on both surfaces. Originals backed up in `img/gear/_originals/`.

**STATUS: FIXED 2026-07-03** by tg6-marketing — all three re-cut (rembg/PIL, no AI regeneration; product markings intact) onto solid `#eef1f5`. Re-run of the checker confirms all three now pass (contrast 225 / 138 / 91). Only remaining flags are `brand/tg6-rig.jpg` (intentional moody brand shot — accepted) and unused `misc/na.png`.

## Passing product images

`np-f970-battery.jpg`, `sandisk-high-endurance.png`, `starlink-mini.png`, `tmobile-5g-gateway.png`, `ulanzi-vl49-led.png` (white/light bg — good on dark tiles), `dell-latitude-7420.png`, `peplink-max-transit.png` (transparent — good), `tg6-metro.png`, `tg6-nomad.png`, `tg6-roamer.png` (light bg — good).

## Housekeeping findings (not yet actioned)

1. **Wrong extensions** — these are JPEG data named `.png` (browsers cope, tooling won't):
   `img/in-stock/tg6-metro.png`, `img/pre-orders/tg6-nomad.png`, `img/pre-orders/tg6-roamer.png`
2. **Heavy files** (compress or convert to WebP before deploy):
   `img/gear/dell-latitude-7420.png` 907 KB · `img/brand/tg6-wordmark.png` 556 KB · `img/brand/tg6-wolf.png` 500 KB · `img/brand/tg6-circuit.jpg` 341 KB
3. **Unused files** (zero references in HTML/CSS/JS — candidates for deletion):
   `img/gear/rode-videomic-go-ii.png`, `img/insta/insta-1.png`, `img/misc/na.png` (itself dark-on-dark — fix it if it ever becomes the fallback placeholder), `img/404.svg`, `img/done.svg`, `img/hero-bg.svg`, `img/about-bg.svg`, `img/contact-bg.svg`, `img/logo-01.svg`, `img/jacket-icon.svg`, `img/pants-icon.svg`, `img/shirt-icon.svg`, `img/watch-icon.svg`, `img/fav/tg6-mark-512.png`, most of the `img/fav/` pack (only `apple-icon-180x180`, `favicon-16x16`, `favicon-32x32` are referenced)
4. **Leftover junk** — `.superpowers/brainstorm/…` contains duplicate gear images; not part of the site.

## Standing rule (memorized as `feedback_product_image_contrast`)

Every retrieved product image gets a contrast check (product vs. its bg, image vs. destination surface). Dark-on-dark or low contrast → hand to tg6-marketing to replace the background, or remove it and set a solid offset-color background. Heuristic: border luminance < 60 with border/center contrast < 45 = fail.
