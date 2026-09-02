"""Convert trade photos to responsive WebP assets and update their markup."""

from pathlib import Path
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TRADES = (ROOT / "assets" / "trades").resolve()
HTML = ROOT / "index.html"

if ROOT not in TRADES.parents:
    raise RuntimeError("Refusing to modify images outside the repository")

dimensions: dict[str, tuple[int, int]] = {}
for source in sorted(TRADES.glob("*.jpg")):
    destination = source.with_suffix(".webp")
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        dimensions[source.name] = image.size
        image.save(destination, "WEBP", quality=82, method=6)
    source.unlink()

unused = (TRADES / "IMAGES TO CLAUDE").resolve()
if unused.exists() and TRADES in unused.parents:
    for file in unused.iterdir():
        if file.is_file():
            file.unlink()
    unused.rmdir()

html = HTML.read_text(encoding="utf-8")
for filename, (width, height) in dimensions.items():
    old_src = f"assets/trades/{filename}"
    new_src = f"assets/trades/{Path(filename).stem}.webp"
    html = html.replace(f'src="{old_src}"', f'src="{new_src}" width="{width}" height="{height}"')

HTML.write_text(html, encoding="utf-8")
