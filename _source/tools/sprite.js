// Génère img/brand.svg (sprite : lettres du logotype + monogramme C) et favicon.svg
const fs = require('fs');
const { VW, VH, letters } = JSON.parse(fs.readFileSync('letters.json', 'utf8'));
const E = 'style="fill:var(--edge,#E8573A)"', F = 'style="fill:var(--face,#F7B5A9)"';
let s = '<svg xmlns="http://www.w3.org/2000/svg">';
letters.forEach((l, i) => {
  s += `<symbol id="wm${i}" viewBox="0 0 ${VW} ${VH}"><path fill-rule="evenodd" ${E} d="${l.full}"/><path fill-rule="evenodd" ${F} d="${l.face}"/></symbol>`;
});
const c = letters[0];
const pad = 2, cx0 = Math.floor(c.x0) - pad, cw = Math.ceil(c.x1 - c.x0) + pad * 2;
s += `<symbol id="cmark" viewBox="${cx0} -2 ${cw} ${VH + 4}"><path fill-rule="evenodd" ${E} d="${c.full}"/><path fill-rule="evenodd" ${F} d="${c.face}"/></symbol>`;
s += '</svg>';
fs.writeFileSync('../../img/brand.svg', s);
// favicon : pastille menthe + C bleu canard / jaune
const S = 120, scale = 70 / VH;
const tx = 60 - (cx0 + cw / 2) * scale, ty = 60 - (VH / 2) * scale;
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><circle cx="60" cy="60" r="60" fill="#93CDBF"/><g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(4)})"><path fill-rule="evenodd" fill="#1F5E6B" d="${c.full}"/><path fill-rule="evenodd" fill="#F2D35B" d="${c.face}"/></g></svg>`;
fs.writeFileSync('../../favicon.svg', fav);
// logotype complet autonome (og / réseaux)
fs.writeFileSync('wordmark-full.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}">` + letters.map(l => `<path fill-rule="evenodd" fill="#E8573A" d="${l.full}"/><path fill-rule="evenodd" fill="#F7B5A9" d="${l.face}"/>`).join('') + '</svg>');
console.log('sprite', s.length, 'fav', fav.length, 'VW', VW, 'VH', VH, 'cmark', cx0, cw);
