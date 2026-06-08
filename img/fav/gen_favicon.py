#!/usr/bin/env python3
"""Generate the TG6 wordmark favicon set.

Design: bold white "TG6" (Lato Black) centred on a black rounded-square tile.
Rendered supersampled then downscaled (LANCZOS) so small icons stay crisp.
"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_PATH = "/usr/share/fonts/truetype/lato/Lato-Black.ttf"
TEXT = "TG6"
BG = (0, 0, 0, 255)        # brand black
FG = (255, 255, 255, 255)  # brand white
CORNER = 0.18              # corner radius as fraction of size
TEXT_W = 0.80             # target text width as fraction of tile

def _fit_font(draw, target_w):
    lo, hi = 4, 4000
    while lo < hi:
        mid = (lo + hi + 1) // 2
        f = ImageFont.truetype(FONT_PATH, mid)
        b = draw.textbbox((0, 0), TEXT, font=f)
        if (b[2] - b[0]) <= target_w:
            lo = mid
        else:
            hi = mid - 1
    return ImageFont.truetype(FONT_PATH, lo)

def render(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * CORNER), fill=BG)
    font = _fit_font(d, size * TEXT_W)
    b = d.textbbox((0, 0), TEXT, font=font)
    w, h = b[2] - b[0], b[3] - b[1]
    x = (size - w) / 2 - b[0]
    y = (size - h) / 2 - b[1]
    d.text((x, y), TEXT, font=font, fill=FG)
    return img

def make(size):
    ss = max(size * 8, 512)
    return render(ss).resize((size, size), Image.LANCZOS)

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
