"""Create a tightly cropped transparent copy of the supplied master logo."""

from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "dar-logo-lockup.png"
DESTINATION = ROOT / "assets" / "dar-logo-transparent.png"

image = Image.open(SOURCE).convert("RGBA")
background_rgb = image.getpixel((0, 0))[:3]
background = Image.new("RGB", image.size, background_rgb)
difference = ImageChops.difference(image.convert("RGB"), background)
bounds = difference.getbbox()
if bounds is None:
    raise RuntimeError("The supplied logo contains no visible artwork")

pixels = image.load()
for y in range(image.height):
    for x in range(image.width):
        red, green, blue, _ = pixels[x, y]
        distance = max(abs(red - background_rgb[0]), abs(green - background_rgb[1]), abs(blue - background_rgb[2]))
        alpha = max(0, min(255, distance * 10))
        pixels[x, y] = (red, green, blue, alpha)

left, top, right, bottom = bounds
padding = 12
box = (max(0, left - padding), max(0, top - padding), min(image.width, right + padding), min(image.height, bottom + padding))
image.crop(box).save(DESTINATION, optimize=True)
print(f"Created {DESTINATION.name}: {box[2] - box[0]}x{box[3] - box[1]}")
