const potrace = require('potrace');
const fs = require('fs');
const opts = { threshold: 128, turdSize: 40, optTolerance: 0.4, alphaMax: 0.9 };
function trace(f) {
  return new Promise((res, rej) => potrace.trace(f, opts, (err, svg) => err ? rej(err) : res(svg)));
}
(async () => {
  const a = await trace('full.png');
  const b = await trace('face.png');
  const pa = a.match(/ d="([^"]+)"/)[1];
  const pb = b.match(/ d="([^"]+)"/)[1];
  const vb = a.match(/width="(\d+)" height="(\d+)"/);
  fs.writeFileSync('paths.json', JSON.stringify({ w: +vb[1], h: +vb[2], full: pa, face: pb }));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb[1]} ${vb[2]}"><path fill-rule="evenodd" fill="#E8573A" d="${pa}"/><path fill-rule="evenodd" fill="#F7B5A9" d="${pb}"/></svg>`;
  fs.writeFileSync('wordmark-test.svg', svg);
  console.log('full', pa.length, 'face', pb.length, vb[1], vb[2]);
})();
