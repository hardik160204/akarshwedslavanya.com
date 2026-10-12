/* Browser-side behaviour: the scroll-drawn thread, scene reveals, nav dots,
   "Play as a film", countdown and share. Returns a cleanup function. */
import { TC } from './scenes.js';

export function initInvitation(root, C) {
  const q = s => root.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const film = new URLSearchParams(window.location.search).get('film') === '1';

  const stage = q('#stage'), track = q('#track'), phone = q('#phone'), dots = q('#dots');
  const playBtn = q('#play'), toast = q('#toast');
  const thread = q('#thread'), tp = q('#tp'), ghost = q('#ghost'), head = q('#head'), grad = q('#tg');
  const secs = [...track.querySelectorAll('.sec')];

  const cleanups = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); cleanups.push(() => t.removeEventListener(ev, fn, o)); };
  let destroyed = false;
  if (film) document.documentElement.classList.add('film');

  /* ---------- nav dots ---------- */
  dots.innerHTML = secs.map((_, i) => `<button type="button" aria-label="Go to scene ${i + 1}" data-i="${i}"></button>`).join('');
  on(dots, 'click', e => {
    const b = e.target.closest('button'); if (!b) return;
    stopFilm();
    stage.scrollTo({ top: secs[+b.dataset.i].offsetTop, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- thread geometry ---------- */
  const XS = [[.5, .86, .2], [.16, .1, .88], [.9, .14, .82], [.2, .9, .12], [.86, .1, .9], [.14, .9, .5], [.5, .12, .88], [.88, .5, .14], [.14, .86, .5], [.8, .2, .84], [.2, .8, .5]];
  const YS = [.06, .52, .94];
  let L = 0, samples = [], total = 1, H = 1, ticking = false;

  function spline(p) {
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function layout() {
    if (destroyed) return;
    H = stage.clientHeight; phone.style.setProperty('--H', H + 'px');
    const W = stage.clientWidth; total = track.scrollHeight;
    thread.setAttribute('width', W); thread.setAttribute('height', total); thread.setAttribute('viewBox', `0 0 ${W} ${total}`);
    const pts = [];
    secs.forEach((s, i) => { XS[i % XS.length].forEach((x, k) => pts.push([x * W, s.offsetTop + s.offsetHeight * YS[k]])); });
    const d = spline(pts); tp.setAttribute('d', d); ghost.setAttribute('d', d);
    L = tp.getTotalLength(); tp.style.strokeDasharray = L;
    samples = []; const N = 500;
    for (let i = 0; i <= N; i++) { const l = L * i / N; samples.push([l, tp.getPointAtLength(l).y]); }
    grad.setAttribute('y2', total);
    grad.innerHTML = secs.map(s => `<stop offset="${((s.offsetTop + s.offsetHeight / 2) / total).toFixed(4)}" stop-color="${TC[s.dataset.world] || TC.paper}"/>`).join('');
    update();
  }
  function update() {
    ticking = false;
    const st = stage.scrollTop, target = st + H * .78, atEnd = st >= stage.scrollHeight - stage.clientHeight - 3;
    let drawn = L;
    if (!atEnd) { drawn = 0; for (let i = 0; i < samples.length; i++) { if (samples[i][1] >= target) { drawn = samples[i][0]; break; } drawn = samples[i][0]; } }
    tp.style.strokeDashoffset = L - drawn;
    const pt = tp.getPointAtLength(Math.max(0.01, drawn)); head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y);
  }
  on(stage, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });

  /* ---------- reveal + active dot ---------- */
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      e.target.classList.toggle('in', e.isIntersecting);
      if (e.isIntersecting) { const i = secs.indexOf(e.target); [...dots.children].forEach((b, k) => b.classList.toggle('on', k === i)); }
    });
  }, { root: stage, threshold: .45 });
  secs.forEach(s => io.observe(s));

  /* ---------- fit long names ---------- */
  function fit() {
    const max = phone.clientWidth * .86;
    track.querySelectorAll('.nm').forEach(n => {
      n.style.fontSize = ''; let fs = parseFloat(getComputedStyle(n).fontSize), g = 0;
      while (n.offsetWidth > max && fs > 24 && g++ < 40) { fs -= 2; n.style.fontSize = fs + 'px'; }
    });
  }

  /* ---------- film mode ---------- */
  let playing = false, timer = null;
  const DUR = [6200, 6000, 5000, 5000, 5200, 5200, 5200, 5600, 5200];
  function stopFilm() { playing = false; clearTimeout(timer); playBtn.textContent = 'Play as a film'; }
  function go(i) {
    if (!playing) return;
    if (i >= secs.length) { document.body.dataset.filmDone = '1'; stopFilm(); return; }
    stage.scrollTo({ top: secs[i].offsetTop, behavior: reduce ? 'auto' : 'smooth' });
    timer = setTimeout(() => go(i + 1), DUR[i] || 5000);
  }
  function startFilm() { stage.scrollTo({ top: 0, behavior: 'auto' }); playing = true; playBtn.textContent = 'Pause'; timer = setTimeout(() => go(1), DUR[0]); }
  on(playBtn, 'click', () => playing ? stopFilm() : startFilm());
  ['wheel', 'touchstart'].forEach(ev => on(stage, ev, () => { if (playing) stopFilm(); }, { passive: true }));
  on(window, 'keydown', e => { if (playing && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) stopFilm(); });

  /* ---------- countdown ---------- */
  const target = new Date(C.date.iso).getTime();
  function tick() {
    const box = q('#count'); if (!box) return;
    const d = target - Date.now();
    if (isNaN(d) || d <= 0) { box.classList.add('done'); return; }
    const s = Math.floor(d / 1000);
    q('#cd').textContent = Math.floor(s / 86400); q('#ch').textContent = Math.floor(s % 86400 / 3600);
    q('#cm').textContent = Math.floor(s % 3600 / 60); q('#cs').textContent = s % 60;
  }
  tick(); const cdTimer = setInterval(tick, 1000);

  /* ---------- share ---------- */
  let tt;
  function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400); }
  const shareBtn = q('#share');
  if (shareBtn) on(shareBtn, 'click', async () => {
    const data = { title: C.title, text: C.shareText || C.title, url: window.location.href.split('?')[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); say('Link copied'); }
    } catch (err) { if (err && err.name !== 'AbortError') say('Copy the link from your browser'); }
  });

  /* ---------- boot ---------- */
  function boot() { fit(); layout(); }
  boot();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!destroyed) { boot(); if (film) setTimeout(() => { if (!destroyed && !playing) startFilm(); }, 700); } });
  else if (film) setTimeout(startFilm, 1200);
  const ro = new ResizeObserver(() => { fit(); layout(); });
  ro.observe(stage);

  return () => {
    destroyed = true;
    cleanups.forEach(f => f());
    io.disconnect(); ro.disconnect();
    clearInterval(cdTimer); clearTimeout(timer); clearTimeout(tt);
    document.documentElement.classList.remove('film');
  };
}
