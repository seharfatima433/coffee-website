"""Shrink every image in ../images so the website loads fast.
Run once:   pip install pillow     then     python optimize-images.py
Originals are kept in images/originals/ in case you need them."""
from pathlib import Path
from PIL import Image

IMAGES = Path(__file__).resolve().parent.parent / "images"
BACKUP = IMAGES / "originals"
MAX_SIDE = 900          # longest side in pixels, plenty for this site
BACKUP.mkdir(exist_ok=True)

for f in sorted(IMAGES.iterdir()):
    if f.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue
    before = f.stat().st_size
    with Image.open(f) as im:
        im.load()
        (BACKUP / f.name).write_bytes(f.read_bytes()) if not (BACKUP / f.name).exists() else None
        im.thumbnail((MAX_SIDE, MAX_SIDE))
        if f.suffix.lower() == ".png":
            im.save(f, optimize=True)
        else:
            im.convert("RGB").save(f, quality=82, optimize=True, progressive=True)
    print(f"{f.name}: {before // 1024} KB -> {f.stat().st_size // 1024} KB")
print("Done.")
