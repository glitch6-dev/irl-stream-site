#!/usr/bin/env python3
"""Product-image contrast checker (TG6 rule, 2026-07-03).

Flags images whose product blends into the image background —
dark-on-dark is the canonical fail (see img/gear/sony-zv1-ii.jpg in
img/gear/_originals/). Flagged images go to tg6-marketing for background
replacement or removal + offset color.

Run from repo root:  python3 docs/img-contrast-check.py
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "img")
EXT = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}
SKIP_DIRS = {"fav", "_originals"}


def luminance(px):
    r, g, b = px[:3]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def analyze(path):
    im = Image.open(path)
    w, h = im.size
    has_alpha = im.mode in ("RGBA", "LA", "PA") and im.getextrema()[-1][0] < 255
    small = im.convert("RGB").resize((min(w, 200), min(h, 200)))
    sw, sh = small.size
    px = small.load()
    border, center = [], []
    m = max(2, min(sw, sh) // 10)
    for x in range(sw):
        for y in range(sh):
            L = luminance(px[x, y])
            if x < m or x >= sw - m or y < m or y >= sh - m:
                border.append(L)
            elif sw * 0.3 < x < sw * 0.7 and sh * 0.3 < y < sh * 0.7:
                center.append(L)
    bg = sum(border) / len(border)
    fg = sum(center) / len(center) if center else bg
    contrast = abs(fg - bg)
    kb = os.path.getsize(path) / 1024
    flags = []
    if not has_alpha:
        if bg < 60 and contrast < 45:
            flags.append("DARK-ON-DARK")
        elif contrast < 30:
            flags.append("LOW-CONTRAST")
    if kb > 300:
        flags.append("HEAVY")
    return w, h, im.format, kb, has_alpha, bg, fg, contrast, flags


def main():
    print(f"{'file':<40}{'dims':<12}{'fmt':<6}{'KB':>7}  {'alpha':<6}{'bgLum':>6}{'fgLum':>6}{'ctr':>5}  flags")
    failures = 0
    for dirpath, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in sorted(files):
            if os.path.splitext(f)[1].lower() not in EXT:
                continue
            p = os.path.join(dirpath, f)
            rel = os.path.relpath(p, ROOT)
            try:
                w, h, fmt, kb, a, bg, fg, c, flags = analyze(p)
                print(f"{rel:<40}{f'{w}x{h}':<12}{fmt:<6}{kb:>7.0f}  {str(a):<6}{bg:>6.0f}{fg:>6.0f}{c:>5.0f}  {','.join(flags)}")
                if any(fl in ("DARK-ON-DARK", "LOW-CONTRAST") for fl in flags):
                    failures += 1
            except Exception as e:
                print(f"{rel:<40}ERROR: {e}")
    print(f"\n{failures} contrast failure(s)." + (" Hand to tg6-marketing per the product-image-contrast rule." if failures else ""))


if __name__ == "__main__":
    main()
