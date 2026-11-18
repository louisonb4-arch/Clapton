# Clapton Café & Ateliers — site vitrine

Site statique (HTML/CSS/JS, aucune dépendance) du Clapton, café & ateliers, 1 bis rue Camille-Berruyer, Nantes. Mobile d'abord.

- `index.html` · `style.css` · `main.js` : page d'accueil (ouverture « porte bleue », chapitres Manger / Siroter / Créer, carte, ateliers, lieu, avis, infos)
- `img/brand.svg` : logotype CLAPTON vectorisé (lettres séparées) + monogramme C — couleurs via `--edge` / `--face`
- `mentions-legales.html`, `404.html`, `vercel.json` (sécurité, cache, URLs propres)
- `./set-domain.sh https://domaine.fr` : renseigne le domaine (canonical, Open Graph, sitemap, robots, llms.txt)
- `_source/` (non déployé) : photos sources, scripts de vectorisation / conversion. `node _source/tools/inject.js` réinjecte le monogramme dans index.html.
- Agenda des ateliers : à mettre à jour dans `index.html` (section `.agenda`).

Conception : VOKUM.
