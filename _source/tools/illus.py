# Illustrations ateliers (ChatGPT) : recadrage sur le dessin, carré, WebP avec transparence
from PIL import Image
import glob, os
for f in glob.glob('_source/illus/*.png'):
    n = os.path.basename(f)[:-4]
    im = Image.open(f).convert('RGBA')
    bb = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    im = im.crop(bb)
    side = int(max(im.size) * 1.08)
    sq = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    sq.resize((720, 720), Image.LANCZOS).save(f'img/atelier-{n}-720.webp', 'WEBP', quality=82, method=6)
    print(n, 'ok')
