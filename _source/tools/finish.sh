#!/bin/zsh
# Fichiers annexes : SEO, déploiement, icônes, image de partage
set -e
cd ~/Developer/clients/clapton-site
cp ../maimo-site/vercel.json vercel.json
cp ../maimo-site/set-domain.sh set-domain.sh && chmod +x set-domain.sh
sed -i '' 's#www.maimo-nantes.fr#www.clapton-nantes.fr#' set-domain.sh
printf 'User-agent: *\nAllow: /\n\nSitemap: __SITE_URL__/sitemap.xml\n' > robots.txt
cat > sitemap.xml <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>__SITE_URL__/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>
EOF
cat > llms.txt <<'EOF'
# Clapton Café & Ateliers

> Coffee shop et lieu d'ateliers créatifs à Nantes (quartier Copernic, près de la place Aristide-Briand). Cuisine maison, de saison, locale & bio ; café de spécialité ; pâtisseries maison ; télétravail bienvenu.

- Adresse : 1 bis rue Camille-Berruyer, 44000 Nantes
- Horaires : du lundi au vendredi, 8h45–18h. Certains ateliers le samedi, sur inscription.
- Téléphone : 06 13 19 46 36
- Carte : salades, tartines, quiches, soupes, plats chauds, buns (plats de 9,80 € à 13,50 €), cakes, cookies et gâteaux maison. Sur place et à emporter.
- Boissons : expresso, cappuccino, latte, chaï latte, thés, boissons maison (kéfir, ginger beer, kombucha, thé glacé), jus bio, bière, vin.
- Ateliers : aquarelle, linogravure, tufting, ateliers parent-enfant, yoga & book club. Inscription par message Instagram.
- Note Google : 4,9/5 (114 avis)
- Instagram : https://www.instagram.com/clapton.nantes/
- Site : __SITE_URL__/
EOF
printf '.vercel\n.DS_Store\n.env*.local\nnode_modules\n' > .gitignore
printf 'set-domain.sh\nREADME.md\n_source\n_preview.html\n' > .vercelignore
cat > README.md <<'EOF'
# Clapton Café & Ateliers — site vitrine

Site statique (HTML/CSS/JS, aucune dépendance) du Clapton, café & ateliers, 1 bis rue Camille-Berruyer, Nantes. Mobile d'abord.

- `index.html` · `style.css` · `main.js` : page d'accueil (ouverture « porte bleue », chapitres Manger / Siroter / Créer, carte, ateliers, lieu, avis, infos)
- `img/brand.svg` : logotype CLAPTON vectorisé (lettres séparées) + monogramme C — couleurs via `--edge` / `--face`
- `mentions-legales.html`, `404.html`, `vercel.json` (sécurité, cache, URLs propres)
- `./set-domain.sh https://domaine.fr` : renseigne le domaine (canonical, Open Graph, sitemap, robots, llms.txt)
- `_source/` (non déployé) : photos sources, scripts de vectorisation / conversion. `node _source/tools/inject.js` réinjecte le monogramme dans index.html.
- Agenda des ateliers : à mettre à jour dans `index.html` (section `.agenda`).

Conception : VOKUM.
EOF
cd _source/tools
python3 - <<'EOF'
import subprocess
from PIL import Image, ImageDraw, ImageOps
subprocess.run(['qlmanage','-t','-s','512','-o','.','../../favicon.svg'],capture_output=True)
ic=Image.open('favicon.svg.png').convert('RGBA')
bg=Image.new('RGBA',ic.size,(251,246,238,255)); bg.alpha_composite(ic)
bg.convert('RGB').resize((180,180),Image.LANCZOS).save('../../apple-touch-icon.png')
ic.resize((32,32),Image.LANCZOS).save('../../favicon.png')
# og.jpg 1200x630 : devanture à droite, logotype à gauche
subprocess.run(['qlmanage','-t','-s','1400','-o','.','wordmark-full.svg'],capture_output=True)
W,H=1200,630
og=Image.new('RGB',(W,H),(251,246,238))
ph=ImageOps.exif_transpose(Image.open('../maps/m48.jpg')).convert('RGB')
ph=ImageOps.fit(ph,(470,H),centering=(.5,.45)); og.paste(ph,(W-470,0))
wm=Image.open('wordmark-full.svg.png').convert('RGB')
inv=Image.eval(wm,lambda v:255-v); wm=wm.crop(inv.getbbox())
wm=wm.resize((620,round(620*wm.height/wm.width)),Image.LANCZOS)
og.paste(wm,(50,(H-wm.height)//2))
d=ImageDraw.Draw(og)
d.rectangle((W-470+18,18,W-18,H-18),outline=(242,211,91),width=3)
og.save('../../og.jpg',quality=86)
print('icons+og ok')
EOF
ls -la ~/Developer/clients/clapton-site
