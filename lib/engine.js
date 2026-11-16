/* Browser-side behaviour of the royal invitation: the peacock doors, Theatre.js entrances as each section
   scrolls into view, the wedding song (or the composed score), scratch-to-reveal hearts, the countdown,
   hashtag copy, share and calendar. Returns a cleanup function. */
import { SHEETS, SECTIONS, MUSIC, CUES, buildState } from './timeline.js';
import { createScore } from './score.js';

const CONFETTI = ['#c62a4b', '#f7a21b', '#e9bb52', '#1d63b0', '#12a1a6', '#f48fb1'];

export function initInvitation(root, C) {
  const $ = s => root.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(window.location.search);
  const film = params.get('film') === '1';
  const html = document.documentElement, page = $('#page'), gate = $('#gate'), toast = $('#toast'), sndBtn = $('#snd');
  const cleanups = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); cleanups.push(() => t.removeEventListener(ev, fn, o)); };
  let destroyed = false, ready = false, opened = false, wantOpen = false, u = 4;
  const sheets = {}, binds = [], played = new Set();
  const score = createScore({ src: C.music && C.music.src, start: C.music && C.music.start, onSong: () => C.music.title && say('♪ Now playing · ' + C.music.title) });
  html.classList.add('locked');
  if (film) html.classList.add('film');
  window.scrollTo(0, 0);

  /* ---------- personal greeting: ?to=Name ---------- */
  const to = (params.get('to') || '').trim().slice(0, 60);
  if (to) { $('#dear').textContent = `Dear ${to}, `; $('#toguest').textContent = `We can't wait to celebrate with you, ${to}.`; }

  const measure = () => { u = page.clientWidth / 100; binds.forEach(b => b.v && b.apply(b.v)); };

  /* ---------- Theatre.js → DOM ---------- */
  function applyEl(el, v) {
    const s = el.style;
    if (v.o !== undefined) s.opacity = v.o < .002 ? 0 : v.o;
    if (v.x !== undefined || v.y !== undefined || v.s !== undefined || v.r !== undefined || v.ry !== undefined) {
      let t = `translate3d(${((v.x || 0) * u).toFixed(2)}px,${((v.y || 0) * u).toFixed(2)}px,0)`;
      if (v.r) t += ` rotate(${v.r.toFixed(2)}deg)`;
      if (v.ry !== undefined) t += ` rotateY(${v.ry.toFixed(2)}deg)`;
      if (v.s !== undefined) t += ` scale(${Math.max(0, v.s).toFixed(4)})`;
      s.transform = t;
    }
    if (v.w !== undefined) s.webkitMaskPosition = s.maskPosition = `${(1 - v.w) * 100}% 0`;
  }
  const same = (a, b) => { for (const k in a) if (a[k] !== b[k]) return false; return true; };

  async function boot() {
    const { getProject } = await import('@theatre/core');
    if (destroyed) return;
    const project = getProject('Akarsh & Lavanya', { state: buildState() });
    await project.ready;
    if (destroyed) return;
    for (const id in SHEETS) sheets[id] = project.sheet(id);
    const groups = new Map();
    root.querySelectorAll('[data-t]').forEach(el => { const k = el.dataset.t; groups.has(k) ? groups.get(k).push(el) : groups.set(k, [el]); });
    groups.forEach((els, key) => {
      const [sid, ok] = key.split('.');
      if (!SHEETS[sid] || !SHEETS[sid][ok]) return;
      const props = {}; for (const p in SHEETS[sid][ok]) props[p] = 0;
      const b = { v: null, apply: v => els.forEach(el => applyEl(el, v)) };
      binds.push(b);
      cleanups.push(sheets[sid].object(ok, props).onValuesChange(v => { if (b.v && same(v, b.v)) return; b.v = { ...v }; b.apply(v); }));
    });
    ready = true;
    html.classList.add('ready');
    if (wantOpen || film) setTimeout(open, film ? 1200 : 0);
  }

  /* each section plays its entrance once, when it first scrolls into view */
  let cueTimers = [];
  function play(id) {
    if (played.has(id) || !sheets[id]) return;
    played.add(id);
    const seq = sheets[id].sequence;
    if (reduce) { seq.position = 99; return; }
    seq.position = 0; seq.play();
    (CUES[id] || []).forEach(([t, name]) => cueTimers.push(setTimeout(() => score.sfx(name), t * 1000)));
  }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting || !opened) return;
    const id = e.target.dataset.sec;
    play(id);
    score.setSection(MUSIC[id]);
  }), { threshold: .22 });
  root.querySelectorAll('[data-sec]').forEach(s => io.observe(s));

  /* ---------- the peacock doors ---------- */
  function onTap() {
    if (opened) return;
    score.unlock();                                    // inside the tap, or phones stay silent
    open();
  }
  async function open() {
    if (opened || destroyed) return;
    if (!ready) { wantOpen = true; return; }
    opened = true;
    html.classList.add('opened');
    score.start(.05);
    score.sfx('open');
    setTimeout(() => !destroyed && play('hero'), reduce ? 0 : 900);
    const intro = sheets.intro.sequence;
    if (reduce) intro.position = 3; else await intro.play();
    if (destroyed) return;
    gate.hidden = true;
    html.classList.remove('locked');
    // sections already on screen (the IntersectionObserver ignored them while the doors were shut)
    root.querySelectorAll('[data-sec]').forEach(s => { const r = s.getBoundingClientRect(); if (r.top < innerHeight * .8 && r.bottom > 0) play(s.dataset.sec); });
    if (film) autoScroll();
  }
  on(gate, 'click', onTap);

  /* ---------- scroll: the mandalas turn as you scroll ---------- */
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; html.style.setProperty('--rot', `${(window.scrollY * .08).toFixed(1)}deg`); }); };
  on(window, 'scroll', onScroll, { passive: true });

  /* ---------- scratch the hearts to reveal the date ---------- */
  const HEART = 'M50,90 C20,70 2,52 2,30 C2,14 14,4 28,4 C38,4 46,10 50,18 C54,10 62,4 72,4 C86,4 98,14 98,30 C98,52 80,70 50,90Z';
  let revealed = 0;
  root.querySelectorAll('.heart').forEach(btn => {
    const cv = btn.querySelector('canvas'), cx = cv.getContext('2d'), path = new Path2D(HEART);
    let w = 0, h = 0, done = false, down = false;
    const paint = () => {
      const r = btn.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      w = r.width; h = r.height; cv.width = w * d; cv.height = h * d;
      cx.setTransform(d * w / 100, 0, 0, d * h / 94, 0, 0);
      const gr = cx.createLinearGradient(0, 0, 100, 94); gr.addColorStop(0, '#e0324f'); gr.addColorStop(1, '#9e0f2e');
      cx.fillStyle = gr; cx.fill(path);
      cx.save(); cx.clip(path); cx.strokeStyle = 'rgba(255,255,255,.18)'; cx.lineWidth = 3;
      for (let i = -100; i < 200; i += 9) { cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i + 94, 94); cx.stroke(); }
      cx.restore(); cx.strokeStyle = '#e9bb52'; cx.lineWidth = 2.4; cx.stroke(path);
    };
    const finish = () => {
      if (done) return; done = true;
      btn.classList.add('open'); cv.style.opacity = 0;
      score.sfx('chime');
      const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2);
      if (++revealed === 3) setTimeout(() => score.sfx('shimmer'), 300);
    };
    const scratch = e => {
      if (done) return;
      const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 94;
      cx.globalCompositeOperation = 'destination-out';
      cx.beginPath(); cx.arc(x, y, 13, 0, 6.283); cx.fill();
      cx.globalCompositeOperation = 'source-over';
      // shortcut: samples 100 pixels to judge how much is scratched, plenty for a 3-heart toy
      const data = cx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0, n = 0;
      for (let i = 0; i < 100; i++) { const px = ((Math.random() * cv.width) | 0) + ((Math.random() * cv.height) | 0) * cv.width; n++; if (data[px * 4 + 3] < 40) clear++; }
      if (clear / n > .62) finish();
    };
    paint();
    on(window, 'resize', () => { if (!done) paint(); });
    on(cv, 'pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); scratch(e); });
    on(cv, 'pointermove', e => { if (down) scratch(e); });
    on(cv, 'pointerup', () => { down = false; });
    on(btn, 'click', e => { if (e.detail === 0) finish(); });  // keyboard: Enter / Space reveals
  });

  /* confetti burst, drawn on a throwaway canvas over the page */
  function burst(x, y) {
    if (reduce) return;
    const c = document.createElement('canvas'), d = Math.min(2, devicePixelRatio || 1);
    c.className = 'burst'; c.width = innerWidth * d; c.height = innerHeight * d; document.body.appendChild(c);
    const k = c.getContext('2d'), P = Array.from({ length: 46 }, () => { const a = Math.random() * Math.PI * 2, v = 160 + Math.random() * 260; return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 140, r: Math.random() * 6, vr: (Math.random() - .5) * 10, c: CONFETTI[(Math.random() * CONFETTI.length) | 0], w: 4 + Math.random() * 5 }; });
    let t0 = 0;
    const step = now => {
      const dt = Math.min(.04, t0 ? (now - t0) / 1000 : 0); t0 = now;
      k.setTransform(d, 0, 0, d, 0, 0); k.clearRect(0, 0, innerWidth, innerHeight);
      let live = 0;
      for (const p of P) { p.vy += 520 * dt; p.vx *= 1 - 1.2 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; if (p.y < innerHeight + 20) { live++; k.save(); k.translate(p.x, p.y); k.rotate(p.r); k.fillStyle = p.c; k.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); k.restore(); } }
      if (live && !destroyed) requestAnimationFrame(step); else c.remove();
    };
    requestAnimationFrame(step);
  }

  /* ---------- countdown ---------- */
  const target = new Date(C.weddingIso).getTime();
  const cd = $('#cd'), ch = $('#ch'), cm = $('#cm'), cs = $('#cs'), count = $('#count');
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const d = target - Date.now();
    if (isNaN(d) || d <= 0) { count.classList.add('done'); return; }
    const s = Math.floor(d / 1000);
    cd.textContent = Math.floor(s / 86400); ch.textContent = pad(Math.floor(s % 86400 / 3600));
    cm.textContent = pad(Math.floor(s % 3600 / 60)); cs.textContent = pad(s % 60);
  }
  tick(); const cdTimer = setInterval(tick, 1000);

  /* ---------- hashtag, share, calendar (iPhone gets a real .ics; others open Google Calendar) ---------- */
  let tt;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400); };
  on($('#hash'), 'click', async () => {
    try { await navigator.clipboard.writeText(C.hashtag); say('Copied ' + C.hashtag); score.sfx('pop'); } catch { say(C.hashtag); }
  });
  on($('#share'), 'click', async () => {
    const data = { title: C.title, text: C.shareText || C.title, url: window.location.href.split('?')[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); say('Link copied'); score.sfx('chime'); }
    } catch (e) { if (e && e.name !== 'AbortError') say('Copy the link from your browser'); }
  });
  const iOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  on(root, 'click', e => {
    const a = e.target.closest && e.target.closest('.cal');
    if (!a || !iOS) return;
    e.preventDefault();
    window.location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics(C, C.events[+a.dataset.ev]));
  });

  /* ---------- music button ---------- */
  on(sndBtn, 'click', () => {
    const m = !score.muted; score.mute(m);
    html.classList.toggle('muted', m);
    sndBtn.setAttribute('aria-pressed', String(m));
    sndBtn.setAttribute('aria-label', m ? 'Play music' : 'Mute music');
  });
  on(document, 'visibilitychange', () => { document.hidden ? score.suspend() : score.resume(); });

  /* ---------- film mode (?film=1): glide down the whole page for a screen recording ---------- */
  function autoScroll() {
    root.querySelectorAll('.heart').forEach((b, i) => setTimeout(() => b.dispatchEvent(new MouseEvent('click', { detail: 0, bubbles: true })), 9000 + i * 600));
    let last = 0;
    const step = now => {
      const dt = last ? (now - last) / 1000 : 0; last = now;
      window.scrollBy({ top: dt * innerHeight * .16, behavior: 'instant' });   // not smooth: a new smooth scroll each frame would stall
      if (window.scrollY + innerHeight < document.documentElement.scrollHeight - 2 && !destroyed) requestAnimationFrame(step);
      else setTimeout(() => { document.body.dataset.filmDone = '1'; }, 4000);
    };
    setTimeout(() => requestAnimationFrame(step), 4000);
  }

  /* ---------- boot ---------- */
  measure();
  const ro = new ResizeObserver(measure); ro.observe(page);
  boot().catch(e => { console.error(e); html.classList.add('ready'); });

  return () => {
    destroyed = true;
    cleanups.forEach(f => f());
    io.disconnect(); ro.disconnect();
    clearInterval(cdTimer); clearTimeout(tt); cueTimers.forEach(clearTimeout);
    Object.values(sheets).forEach(s => s.sequence.pause());
    score.stop();
    html.classList.remove('film', 'locked', 'opened', 'muted');
  };
}

/* one calendar event, times converted from India time to UTC */
export function ics(C, e) {
  const utc = s => new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(9, 11), +s.slice(11, 13)) - 330 * 60000).toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const esc = s => String(s).replace(/([,;\\])/g, '\\$1');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding-invite//EN', 'BEGIN:VEVENT',
    `UID:${e.cal[0]}-${C.names[0].en}-${C.names[1].en}@invite`.replace(/\s/g, ''),
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${utc(e.cal[0])}`, `DTEND:${utc(e.cal[1])}`,
    `SUMMARY:${esc(`${C.names[0].en} & ${C.names[1].en} · ${e.calTitle}`)}`,
    `LOCATION:${esc(`${C.venue.name}, ${C.venue.address}`)}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
