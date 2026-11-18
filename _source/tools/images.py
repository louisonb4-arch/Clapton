from PIL import Image, ImageOps
import os
OUT = '../../img'
os.makedirs(OUT, exist_ok=True)
pick = {
    'devanture': 'm48', 'facade': 'm47', 'salle': 'm06', 'canape': 'm20', 'verriere': 'm27',
    'comptoir': 'm04', 'vitrine': 'm22', 'cookies': 'm35', 'burrata': 'm34', 'legumes': 'm11',
    'latte': 'm38', 'cappuccino': 'm09', 'the': 'm16', 'gateau': 'm25', 'tartine': 'm19',
    'epicerie': 'm32', 'etageres': 'm30', 'plantes': 'm17', 'salades': 'm26', 'cake': 'm02',
    'coin': 'm24', 'mur': 'm21', 'ardoise': 'm18',
}
for name, src in pick.items():
    im = ImageOps.exif_transpose(Image.open(f'../maps/{src}.jpg')).convert('RGB')
    for w, suf, q in ((1400, '', 74), (720, '-720', 72)):
        c = im.copy()
        if c.width > w:
            c = c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
        c.save(f'{OUT}/{name}{suf}.webp', 'WEBP', quality=q, method=6)
    print(name, im.size)
