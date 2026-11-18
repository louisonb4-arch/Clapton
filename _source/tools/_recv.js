addEventListener('message', async (e) => {
  if (e.origin !== 'https://chatgpt.com' || !e.data || !e.data.blob) return;
  const r = await fetch('http://127.0.0.1:4391/save?name=' + encodeURIComponent(e.data.name), { method: 'POST', body: e.data.blob });
  document.getElementById('l').textContent += e.data.name + ' ' + e.data.blob.size + ' ' + r.status + '\n';
  e.source.postMessage({ ok: e.data.name }, e.origin);
});
if (opener) opener.postMessage({ ready: 1 }, 'https://chatgpt.com');
