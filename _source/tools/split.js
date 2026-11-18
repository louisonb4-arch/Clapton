// Split traced wordmark into letters, scale /4, crop to bbox, round.
const fs = require('fs');
const { w, h, full, face } = JSON.parse(fs.readFileSync('paths.json', 'utf8'));
const K = 4;
function sub(d) { return d.trim().split(/(?=M)/).map(s => s.trim()).filter(Boolean); }
function nums(s) { return s.match(/-?\d*\.?\d+/g).map(Number); }
function bbox(s) {
  const n = nums(s); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (let i = 0; i < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
  return { x0, x1, y0, y1 };
}
const fullSubs = sub(full).map(s => ({ s, b: bbox(s) }));
const faceSubs = sub(face).map(s => ({ s, b: bbox(s) }));
// letters = outer full subpaths (largest), sorted by x
const outers = fullSubs.filter(o => (o.b.x1 - o.b.x0) > 150 && (o.b.y1 - o.b.y0) > 300).sort((a, b) => a.b.x0 - b.b.x0);
const merged = [];
for (const o of outers) {
  const last = merged[merged.length - 1];
  if (last && o.b.x0 < last.x1 && o.b.x1 <= last.x1 + 5) continue; // contained
  merged.push({ x0: o.b.x0, x1: o.b.x1 });
}
const gy0 = Math.min(...outers.map(o => o.b.y0)), gy1 = Math.max(...outers.map(o => o.b.y1));
const gx0 = merged[0].x0, gx1 = merged[merged.length - 1].x1;
const tx = (s) => s.replace(/-?\d*\.?\d+/g, (m, off, str) => m);
function scale(s) {
  let i = 0;
  return s.replace(/-?\d*\.?\d+/g, (m) => { const v = Number(m); const r = (i++ % 2 === 0) ? (v - gx0) / K : (v - gy0) / K; return (Math.round(r * 10) / 10).toString(); });
}
const inL = (b, L) => b.x0 >= L.x0 - 4 && b.x1 <= L.x1 + 4;
const letters = merged.map(L => ({
  full: fullSubs.filter(o => inL(o.b, L)).map(o => scale(o.s)).join(''),
  face: faceSubs.filter(o => inL(o.b, L) && (o.b.x1 - o.b.x0) > 8).map(o => scale(o.s)).join(''),
  x0: (L.x0 - gx0) / K, x1: (L.x1 - gx0) / K
}));
const VW = Math.ceil((gx1 - gx0) / K), VH = Math.ceil((gy1 - gy0) / K);
fs.writeFileSync('letters.json', JSON.stringify({ VW, VH, letters }));
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}">`;
for (const l of letters) svg += `<g><path fill-rule="evenodd" fill="#E8573A" d="${l.full}"/><path fill-rule="evenodd" fill="#F7B5A9" d="${l.face}"/></g>`;
svg += '</svg>';
fs.writeFileSync('wordmark.svg', svg);
console.log(letters.length, 'letters', VW, VH, svg.length, 'bytes');
