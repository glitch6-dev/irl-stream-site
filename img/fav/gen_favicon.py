#!/usr/bin/env python3
"""Generate the TG6 logo favicon set.

Design: the "TG6" letters of img/brand/tg6-wordmark.png (cropped above the
"TEAM GLITCH // SIX" tagline, which is unreadable at icon sizes) centred on a
dark rounded-square tile (site background #07060c). Rendered supersampled then
downscaled (LANCZOS) so small icons stay crisp.
"""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(HERE, "..", "brand", "tg6-wordmark.png")
MARK_FRAC = 0.74           # top fraction of the logo: TG6 letters, no tagline
BG = (7, 6, 12, 255)       # site background / theme-color
CORNER = 0.18              # corner radius as fraction of size
MARK_W = 0.88              # mark width as fraction of tile

def _mark():
    img = Image.open(SOURCE).convert("RGBA")
    crop = img.crop((0, 0, img.width, int(img.height * MARK_FRAC)))
    return crop.crop(crop.getbbox())

MARK = _mark()

def render(size, mark_w=MARK_W):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * CORNER), fill=BG)
    target = int(size * mark_w)
    scale = target / MARK.width
    mark = MARK.resize((max(1, int(MARK.width * scale)), max(1, int(MARK.height * scale))), Image.LANCZOS)
    x = (size - mark.width) // 2
    y = (size - mark.height) // 2
    img.alpha_composite(mark, (x, y))
    return img

def make(size):
    ss = max(size * 8, 512)
    # let the mark fill almost the whole tile at small sizes for legibility
    mark_w = 0.96 if size <= 48 else MARK_W
    return render(ss, mark_w).resize((size, size), Image.LANCZOS)

# All filenames referenced by the site / manifest / browserconfig
PNG_SIZES = {
    "favicon-16x16.png": 16, "favicon-32x32.png": 32, "favicon-96x96.png": 96,
    "android-icon-36x36.png": 36, "android-icon-48x48.png": 48,
    "android-icon-72x72.png": 72, "android-icon-96x96.png": 96,
    "android-icon-144x144.png": 144, "android-icon-192x192.png": 192,
    "apple-icon-57x57.png": 57, "apple-icon-60x60.png": 60,
    "apple-icon-72x72.png": 72, "apple-icon-76x76.png": 76,
    "apple-icon-114x114.png": 114, "apple-icon-120x120.png": 120,
    "apple-icon-144x144.png": 144, "apple-icon-152x152.png": 152,
    "apple-icon-180x180.png": 180, "apple-icon.png": 192,
    "apple-icon-precomposed.png": 192,
    "ms-icon-70x70.png": 70, "ms-icon-144x144.png": 144,
    "ms-icon-150x150.png": 150, "ms-icon-310x310.png": 310,
}

def main():
    for name, size in PNG_SIZES.items():
        make(size).save(os.path.join(HERE, name))
    # Multi-resolution .ico from a 256 master
    master = make(256)
    master.save(os.path.join(HERE, "favicon.ico"),
                sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    # High-res brand master for reuse
    make(512).save(os.path.join(HERE, "tg6-mark-512.png"))
    print(f"Generated {len(PNG_SIZES)} PNGs + favicon.ico + tg6-mark-512.png")

if __name__ == "__main__":
    main()
