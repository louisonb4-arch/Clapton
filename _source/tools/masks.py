from PIL import Image, ImageFilter
import sys
src = Image.open('../maps/m46.jpg').convert('RGB')
S = 4
# wordmark row only
box = (0, 240, src.width, 390)
im = src.crop(box).resize(((box[2]-box[0])*S, (box[3]-box[1])*S), Image.LANCZOS)
px = im.load()
W, H = im.size
full = Image.new('L', (W, H), 255)
face = Image.new('L', (W, H), 255)
fp, cp = full.load(), face.load()
for y in range(H):
    for x in range(W):
        r, g, b = px[x, y]
        # anything clearly not white = letter
        if r + g + b < 690 and r > 150:
            fp[x, y] = 0
        # light pink face: red high, green mid-high
        if r > 215 and 140 < g < 205 and 125 < b < 195:
            cp[x, y] = 0
full = full.filter(ImageFilter.MedianFilter(5))
face = face.filter(ImageFilter.MedianFilter(5))
full.save('full.png'); face.save('face.png')
print(W, H)
