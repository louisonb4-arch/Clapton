/* Clapton Café & Ateliers — interactions (vanilla, sans dépendance) */
(() => {
  const html = document.documentElement, body = document.body;
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  html.classList.add('js');

  /* ---------- Ouverture : la porte s'ouvre ---------- */
  const intro = $('#intro');
  let seen = false;
  try { seen = sessionStorage.getItem('clapton-intro') === '1'; } catch (e) {}
  const ready = () => { body.classList.remove('is-loading'); body.classList.add('is-ready'); body.classList.remove('is-locked'); };
  if (!intro || seen || reduced) {
    html.classList.add('no-intro');
    requestAnimationFrame(ready);
  } else {
    body.classList.add('is-locked');
    let opened = false, t;
    const open = () => {
      if (opened) return; opened = true; clearTimeout(t);
      body.classList.add('intro-open');
      setTimeout(ready, 380);
      setTimeout(() => intro.classList.add('is-gone'), 1300);
      try { sessionStorage.setItem('clapton-intro', '1'); } catch (e) {}
    };
    const start = () => { body.classList.add('intro-run'); t = setTimeout(open, 1850); };
    Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 700))]).then(start);
    intro.addEventListener('click', open);
  }

  /* ---------- Ouvert / fermé (heure de Nantes) ---------- */
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const day = now.getDay(), min = now.getHours() * 60 + now.getMinutes();
  const weekday = day >= 1 && day <= 5, OPEN = 8 * 60 + 45, CLOSE = 18 * 60;
  const status = $('#status');
  if (status) {
    const txt = $('.status__txt', status);
    if (weekday && min >= OPEN && min < CLOSE) { status.classList.add('is-open'); txt.textContent = "Ouvert · jusqu'à 18h"; }
    else {
      status.classList.add('is-closed');
      let when = 'lundi 8h45';
      if (weekday && min < OPEN) when = '8h45';
      else if (day >= 1 && day <= 4) when = 'demain 8h45';
      txt.textContent = 'Fermé · ouvre ' + when;
    }
  }
  const today = $(`#hours li[data-d="${day}"]`);
  if (today) today.classList.add('is-today');

  /* ---------- Menu ---------- */
  const burger = $('#burger'), lbl = $('.burger__lbl');
  $$('.nav__list li').forEach((li, i) => li.style.setProperty('--i', i));
  const setNav = (open) => {
    html.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open);
    lbl.textContent = open ? 'Fermer' : 'Menu';
    body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setNav(!html.classList.contains('nav-open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && html.classList.contains('nav-open')) { setNav(false); burger.focus(); } });

  /* ---------- Onglets de la carte ---------- */
  const tabs = $$('[role="tab"]'), tabWrap = $('.tabs');
  const select = (tab, focus) => {
    tabs.forEach((t, i) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
      if (on) tabWrap.classList.toggle('is-2', i === 1);
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
    });
  });
  $$('[data-tab]').forEach(a => a.addEventListener('click', () => select($('#tab-' + a.dataset.tab))));

  /* ---------- Apparitions au scroll ---------- */
  const groups = ['.sec-head > *', '.panel__intro', '.dishes li', '.sweet > div', '.price-note', '.slate', '.agenda', '.date', '.craft', '.host', '.perks li', '.score', '.quotes li', '.venir__card', '.hours li', '.chap__txt', '.foot__tag'];
  groups.forEach(sel => $$(sel).forEach((el, i) => { el.dataset.r = ''; el.style.setProperty('--d', (Math.min(i, 6) * 0.07) + 's'); }));
  $$('.frame').forEach(el => { if (!el.closest('.hero')) el.dataset.r = ''; });
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in'); io.unobserve(en.target);
    if (en.target.classList.contains('score')) countUp();
  }), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  $$('[data-r]').forEach(el => io.observe(el));
  // les éléments déjà rendus « hidden » (onglet) : on les révèle quand ils apparaissent
  tabs.forEach(t => t.addEventListener('click', () => $$('#' + t.getAttribute('aria-controls') + ' [data-r]').forEach(el => el.classList.add('is-in'))));

  /* ---------- Note 4,9 ---------- */
  let counted = false;
  function countUp() {
    const el = $('#score'); if (!el || counted) return; counted = true;
    const to = parseFloat(el.dataset.to), t0 = performance.now(), dur = reduced ? 0 : 1400;
    const step = t => {
      const p = dur ? Math.min((t - t0) / dur, 1) : 1, e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(1).replace('.', ',');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Scroll : en-tête, pastilles qui tournent, cartes empilées ---------- */
  const top = $('#top'), heroImg = $('.hero__photo img'), chaps = $$('[data-chap]');
  chaps.forEach((c, i) => c.style.setProperty('--n', i));
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY;
    top.classList.toggle('is-scrolled', y > 12);
    if (!reduced) {
      html.style.setProperty('--rot', (y * 0.12).toFixed(1) + 'deg');
      if (heroImg) heroImg.style.setProperty('--zoom', (1.06 + Math.min(y / 2400, 0.08)).toFixed(4));
      const vh = innerHeight;
      chaps.forEach((c, i) => {
        const next = chaps[i + 1];
        if (!next) return;
        const stick = parseFloat(getComputedStyle(next).top) || 0;
        const p = Math.min(Math.max(1 - (next.getBoundingClientRect().top - stick) / (vh * 0.85), 0), 1);
        c.style.setProperty('--p', p.toFixed(3));
      });
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Nav desktop : section en cours ---------- */
  const navLinks = $$('.topnav a[href^="#"]');
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('is-cur', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => { const t = $(a.getAttribute('href')); if (t) spy.observe(t); });
  const hero = $('.hero');
  if (hero) new IntersectionObserver(([en]) => { if (en.isIntersecting) navLinks.forEach(a => a.classList.remove('is-cur')); }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);

  /* ---------- Galerie : barre de progression + glisser à la souris ---------- */
  const rail = $('#rail'), bar = $('#railBar');
  if (rail) {
    const upd = () => bar.style.setProperty('--s', ((rail.scrollLeft + rail.clientWidth) / rail.scrollWidth).toFixed(3));
    rail.addEventListener('scroll', upd, { passive: true }); upd();
    let down = false, x0 = 0, s0 = 0;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; x0 = e.clientX; s0 = rail.scrollLeft; rail.classList.add('is-drag'); });
    addEventListener('pointermove', e => { if (down) rail.scrollLeft = s0 - (e.clientX - x0); });
    addEventListener('pointerup', () => { if (!down) return; down = false; rail.classList.remove('is-drag'); });
  }
})();
