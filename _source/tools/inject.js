// Injecte le symbole #cmark (monogramme C) en ligne dans index.html, entre <!--CMARK--> et <!--/CMARK-->
const fs = require('fs');
const sprite = fs.readFileSync('../../img/brand.svg', 'utf8');
const sym = sprite.match(/<symbol id="cmark"[\s\S]*?<\/symbol>/)[0];
const p = '../../index.html';
let h = fs.readFileSync(p, 'utf8');
h = h.replace(/<!--CMARK-->[\s\S]*?<!--\/CMARK-->/, `<!--CMARK--><svg width="0" height="0" style="position:absolute" aria-hidden="true">${sym}</svg><!--/CMARK-->`);
fs.writeFileSync(p, h);
console.log('cmark injecté', sym.length);
