/* Builds the HTML for the envelope, the sky and every scene from CONFIG.
   Pure functions (no browser APIs), so the page arrives as ready-made HTML.
   data-t="sheet.object" ties an element to its Theatre.js object (lib/timeline.js). */
import { SCENES } from './timeline.js';

export const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const U = encodeURIComponent;
const glow = s => E(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

/* deterministic random, so build-time HTML and the browser agree */
function rng(seed) {
  return () => {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const f1 = n => n.toFixed(1);

/* ---------------- artwork ---------------- */

function lavender(seed) {
  const r = rng(seed), C = ['#7b5abd', '#8f6fcf', '#a587dc', '#b9a0ea', '#cbb6f2', '#9677d6'];
  const stems = [[-14, 150, -22], [-6, 184, -9], [2, 198, 1], [10, 174, 12], [17, 140, 25], [-1, 118, -3]];
  let s = '<path d="M38,206 Q24,180 14,170 Q30,177 41,206Z" fill="#7fa36b"/><path d="M42,206 Q57,182 66,173 Q52,183 40,206Z" fill="#6c935a"/>';
  for (const [bx, h, lean] of stems) {
    const x0 = 40 + bx * .4, y0 = 206, x1 = 40 + bx + lean * .25, y1 = 206 - h * .55, x2 = 40 + bx + lean, y2 = 206 - h;
    s += `<path d="M${f1(x0)},${y0} Q${f1(x1)},${f1(y1)} ${f1(x2)},${f1(y2)}" stroke="#6f8f5e" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    for (let j = 0; j < 18; j++) {
      const t = .5 + j * .028, u = 1 - t, z = 1 - j * .03, side = j % 2 ? 1 : -1;
      const px = u * u * x0 + 2 * u * t * x1 + t * t * x2 + side * 1.7 * z, py = u * u * y0 + 2 * u * t * y1 + t * t * y2;
      s += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${(1.9 * z).toFixed(2)}" ry="${(3.4 * z).toFixed(2)}" transform="rotate(${side * 30} ${f1(px)} ${f1(py)})" fill="${C[r() * C.length | 0]}"/>`;
    }
  }
  return `<svg viewBox="0 0 80 210" aria-hidden="true">${s}</svg>`;
}

function marigold() {
  let s = '';
  [[16, 14, '#e07b00'], [12, 12, '#f59f00'], [8, 10, '#ffb627'], [4.5, 8, '#ffcd4d']].forEach(([rr, n, c], k) => {
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + k * .3;
      s += `<circle cx="${f1(Math.cos(a) * rr * .62)}" cy="${f1(Math.sin(a) * rr * .62)}" r="${f1(rr * .42)}" fill="${c}"/>`;
    }
  });
  return `<svg viewBox="-20 -20 40 40" aria-hidden="true">${s}<circle r="3" fill="#b25600"/></svg>`;
}

function mandala() {
  let s = '';
  [[10, 8, 9], [20, 12, 11], [32, 16, 13], [45, 24, 10], [56, 32, 8]].forEach(([r, n, l]) => {
    for (let i = 0; i < n; i++) {
      s += `<path transform="rotate(${f1(360 / n * i)})" d="M0,${-r} C${f1(l * .48)},${f1(-r - l * .5)} ${f1(l * .3)},${f1(-r - l)} 0,${f1(-r - l * 1.15)} C${f1(-l * .3)},${f1(-r - l)} ${f1(-l * .48)},${f1(-r - l * .5)} 0,${-r}Z"/>`;
    }
    s += `<circle r="${r}"/>`;
  });
  return `<svg viewBox="-70 -70 140 140" aria-hidden="true">${s}<circle r="4"/></svg>`;
}

const SPARK = 'M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10Z';

function stars() {
  const r = rng(7);
  return [0, 1, 2].map(layer => {
    let s = '';
    for (let i = 0; i < 26; i++) {
      const x = r() * 100, y = r() * 150, big = r() > .88;
      s += big ? `<path transform="translate(${f1(x)} ${f1(y)}) scale(.09)" d="${SPARK}"/>` : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${(.18 + r() * .35).toFixed(2)}"/>`;
    }
    return `<div class="tw t${layer}"><svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMin slice">${s}</svg></div>`;
  }).join('');
}

function ring(gem) {
  return `<svg viewBox="-50 -50 100 100" aria-hidden="true">
  <circle r="34" fill="none" stroke="url(#gGold)" stroke-width="7"/>
  <circle r="37.6" fill="none" stroke="rgba(255,248,220,.45)" stroke-width=".8"/>
  ${gem ? `<g transform="translate(0,-41)"><path d="M-8,0 L-4,-7 H4 L8,0 L0,10Z" fill="#eef8ff" stroke="#bfe3ff" stroke-width=".8"/><path d="M-8,0 H8 M-4,-7 L-2,0 L0,10 L2,0 L4,-7" stroke="#a9d4f5" stroke-width=".6" fill="none"/></g>` : ''}
</svg>`;
}
/* the slice of ring 2 that passes OVER ring 1, so the rings look interlocked */
const ringFront = `<svg viewBox="-50 -50 100 100" aria-hidden="true"><path d="M-30.8,-14.4 A34,34 0 0 1 -11.6,-31.9" fill="none" stroke="url(#gGold)" stroke-width="7"/></svg>`;

function burst() {
  const r = rng(11);
  let s = '';
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2, d = 16 + r() * 22, z = .5 + r() * .9;
    s += `<path transform="translate(${f1(Math.cos(a) * d)} ${f1(Math.sin(a) * d * .8)}) scale(${z.toFixed(2)})" d="${SPARK}"/>`;
  }
  return `<svg viewBox="-50 -50 100 100" aria-hidden="true"><path transform="scale(1.6)" d="${SPARK}"/>${s}</svg>`;
}

function fairyLights() {
  const pts = [], q = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  [[0, 3, 25, 26, 50, 6], [50, 6, 75, 26, 100, 3]].forEach(([ax, ay, bx, by, cx, cy]) => {
    for (let i = 1; i < 7; i++) { const t = i / 7; pts.push([q(t, ax, bx, cx), q(t, ay, by, cy)]); }
  });
  const bulbs = pts.map((p, i) => `<i style="left:${f1(p[0])}%;top:${f1(p[1] / 30 * 100)}%;--l:${(i * .37 % 2).toFixed(2)}s"></i>`).join('');
  return `<svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path class="d" pathLength="100" d="M0,3 Q25,26 50,6 Q75,26 100,3"/></svg>
  <div class="bulbs" data-t="sangeet.bulbs">${bulbs}</div>`;
}

function equalizer() {
  const r = rng(5);
  return Array.from({ length: 22 }, () =>
    `<i style="--h:${(.45 + r() * .55).toFixed(2)};--d:${(.35 + r() * .5).toFixed(2)}s;--l:-${(r()).toFixed(2)}s"></i>`).join('');
}

function toran() {
  let s = '<path d="M0,1 Q35,7 70,1" stroke="#e2bd6a" stroke-width=".35" fill="none"/>';
  for (let i = 0; i <= 14; i++) {
    const x = i * 5, y = 1 + 3 * (1 - ((x - 35) / 35) ** 2);
    s += i % 2
      ? `<path d="M${x},${f1(y)} q1.7,3 0,6.6 q-1.7,-3 0,-6.6Z" fill="#3f7d3a"/>`
      : `<circle cx="${x}" cy="${f1(y + 1.8)}" r="1.8" fill="#ff9f1c"/><circle cx="${x}" cy="${f1(y + 1.8)}" r=".9" fill="#ffcd4d"/>`;
  }
  return `<svg viewBox="0 -1 70 11" aria-hidden="true">${s}</svg>`;
}

const MANDAP = `<svg class="mandap" data-t="vivah.mandap" data-fx="draw" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">
  <path class="d" pathLength="100" d="M7,200 V44 M12,200 V44 M88,200 V44 M93,200 V44"/>
  <path class="d" pathLength="100" d="M3,44 C3,22 30,11 50,5 C70,11 97,22 97,44 Z"/>
  <path class="d thin" pathLength="100" d="M11,44 C11,28 33,18 50,13 C67,18 89,28 89,44"/>
  <path class="d thin" pathLength="100" d="M15,44 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0"/>
  <path class="d" pathLength="100" d="M50,5 V0 M2,191 H98 M0,197 H100"/>
</svg>`;

const FLAME = 'M0,0 C-11,-1 -14,-12 -9,-21 C-7,-15 -4,-14 -3,-17 C-5,-26 0,-32 2,-41 C4,-30 12,-24 13,-14 C14,-5 9,0 0,0Z';

const PIN =`<svg viewBox="-16 -42 32 44" aria-hidden="true"><path d="M0,0 C-6,-12 -14,-18 -14,-27 a14,14 0 1 1 28,0 c0,9 -8,15 -14,27z" fill="#5b3b94"/><circle cy="-27" r="5.5" fill="#f6dc94"/></svg>`;

function mapArt() {
  return `<svg viewBox="0 0 100 64" aria-hidden="true">
  <rect x=".5" y=".5" width="99" height="63" rx="5" fill="#f5effd" stroke="#cdb8f0" stroke-width=".6"/>
  <g fill="#d5e8c8"><path d="M5,9 C13,3 25,7 23,16 C21,25 8,23 5,16Z"/><circle cx="88" cy="52" r="8"/><circle cx="60" cy="10" r="5"/><path d="M40,52 C46,46 56,50 54,58 C50,64 40,62 40,52Z"/></g>
  <g fill="#9cc58a"><circle cx="66" cy="20" r="3"/><circle cx="81" cy="22" r="3.4"/><circle cx="70" cy="15" r="2.4"/><circle cx="84" cy="31" r="2.6"/><circle cx="64" cy="31" r="2.2"/></g>
  <path id="rdAgra" d="M-2,52 C22,48 34,37 52,35 S82,27 102,15" stroke="#e3d7f6" stroke-width="7" fill="none"/>
  <path d="M-2,52 C22,48 34,37 52,35 S82,27 102,15" stroke="#fff" stroke-width="5" fill="none"/>
  <path d="M30,-2 C33,18 26,40 32,66 M76,66 C72,54 80,44 74,29" stroke="#fff" stroke-width="2.6" fill="none"/>
  <text font-size="2.7" letter-spacing=".8" fill="#8e6cc9" font-family="serif"><textPath href="#rdAgra" startOffset="6%">AGRA ROAD</textPath></text>
  <text x="5" y="60" font-size="2.6" letter-spacing=".8" fill="#a48ad6" font-family="serif">ALIGARH</text>
  <g data-t="venue.route" data-fx="draw"><path class="d" pathLength="100" d="M3,58 C12,55 20,51 28,47 C38,41 50,37 60,35 C68,33 74,33 74,29" fill="none" stroke="#5b3b94" stroke-width="1.5" stroke-linecap="round"/></g>
</svg>`;
}

const ORNAMENT = `<svg viewBox="0 0 140 24" aria-hidden="true">
  <path class="d" pathLength="100" d="M4,12 H52 M88,12 H136"/>
  <path class="d" pathLength="100" d="M70,20 C60,13 56,8 60,4.5 C63,2 67,3 70,7 C73,3 77,2 80,4.5 C84,8 80,13 70,20Z"/>
  <path class="d" pathLength="100" d="M52,12 l4,-3 l4,3 l-4,3z M80,12 l4,-3 l4,3 l-4,3z"/>
</svg>`;

const SEAL = (() => {
  let d = '';
  for (let i = 0; i <= 72; i++) {
    const a = i / 72 * Math.PI * 2, rr = 44 + 2.6 * Math.sin(a * 9) + 1.4 * Math.sin(a * 5 + 1);
    d += `${i ? 'L' : 'M'}${f1(Math.cos(a) * rr)},${f1(Math.sin(a) * rr)}`;
  }
  return `<svg viewBox="-50 -50 100 100" aria-hidden="true"><path d="${d}Z" fill="url(#gWax)"/><circle r="31" fill="none" stroke="rgba(246,220,148,.55)" stroke-width="1.4"/><circle r="27" fill="none" stroke="rgba(246,220,148,.25)" stroke-width=".8"/></svg>`;
})();

const DEFS = `<svg class="defs" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".3" stop-color="#e7bf62"/><stop offset=".55" stop-color="#a8761f"/><stop offset=".8" stop-color="#f4d68a"/><stop offset="1" stop-color="#b8862b"/></linearGradient>
  <linearGradient id="gFl0" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a00"/><stop offset=".55" stop-color="#e63a12"/><stop offset="1" stop-color="#c8140a" stop-opacity="0"/></linearGradient>
  <linearGradient id="gFl1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd23f"/><stop offset=".55" stop-color="#ff9f1c"/><stop offset="1" stop-color="#ff7814" stop-opacity="0"/></linearGradient>
  <linearGradient id="gFl2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fffbe6"/><stop offset=".6" stop-color="#ffe27a"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></linearGradient>
  <radialGradient id="gWax"cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#8d5cc8"/><stop offset=".55" stop-color="#5d2f8e"/><stop offset="1" stop-color="#3a1764"/></radialGradient>
</defs></svg>`;

/* ---------------- links ---------------- */

const calUrl = (C, e) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${U(`${C.names[0].en} & ${C.names[1].en} · ${e.calTitle}`)}&dates=${e.cal[0]}/${e.cal[1]}&ctz=Asia/Kolkata&location=${U(`${C.venue.name}, ${C.venue.address}`)}`;
const mapsUrl = C => `https://www.google.com/maps/search/?api=1&query=${U(C.venue.mapsQuery)}`;

/* ---------------- scenes ---------------- */

function envelope(C) {
  const [a, b] = C.names;
  return `
<div class="env" id="env" data-t="intro.env">
  <div class="env-md" aria-hidden="true">${mandala()}</div>
  <p class="env-top hi" data-t="intro.top">${E(C.blessing)}</p>
  <p class="env-to" data-t="intro.top">${E(C.envelopeLine)}</p>
  <div class="envelope">
    <div class="env-back" data-t="intro.body"></div>
    <div class="env-card" data-t="intro.card">
      <p class="script gold">${E(a.en)} <span>&amp;</span> ${E(b.en)}</p>
      <p class="cz">${E(C.dates)}</p>
    </div>
    <svg class="env-front" data-t="intro.body" viewBox="0 0 100 66" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,0 L50,37 L100,0 V66 H0Z" fill="url(#gPocket)"/>
      <linearGradient id="gPocket" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4c1f5"/><stop offset="1" stop-color="#bba1ea"/></linearGradient>
      <path d="M0,66 L50,37 L100,66" fill="none" stroke="rgba(91,59,148,.18)" stroke-width=".6"/>
    </svg>
    <div class="env-flap" data-t="intro.flap"><svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 H100 L50,40Z" fill="url(#gFlap)"/><linearGradient id="gFlap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b79de8"/><stop offset="1" stop-color="#cdb8f2"/></linearGradient><path d="M1,.6 L50,39 L99,.6" fill="none" stroke="#d9ae52" stroke-width=".7"/></svg></div>
    <button class="seal" id="seal" type="button" data-t="intro.seal" aria-label="Open the invitation">${SEAL}<span class="script">${E(a.en[0])}<i>&amp;</i>${E(b.en[0])}</span></button>
  </div>
  <p class="env-hint" data-t="intro.hint">Tap the seal to open</p>
</div>`;
}

function cover(C) {
  const [a, b] = C.names;
  return `
<section class="scene light cover" data-t="world.s0" aria-label="Akarsh and Lavanya">
  <div class="md" data-t="cover.md" aria-hidden="true">${mandala()}</div>
  <svg class="arch" data-t="cover.arch" data-fx="draw" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">
    <path class="d" pathLength="100" d="M6,200 V62 C6,40 22,31 34,25 C42,21 48,15 50,6 C52,15 58,21 66,25 C78,31 94,40 94,62 V200"/>
    <path class="d thin" pathLength="100" d="M10,200 V64 C10,44 25,36 36,30 C43,26 48,21 50,13 C52,21 57,26 64,30 C75,36 90,44 90,64 V200"/>
  </svg>
  <div class="lav lav-l" data-t="cover.fl1">${lavender(1)}</div>
  <div class="lav lav-r" data-t="cover.fl2">${lavender(2)}</div>
  <div class="col">
    <p class="bless hi" data-t="cover.g">${E(C.blessing)}</p>
    <p class="kick" data-t="cover.k">${E(C.kicker)}</p>
    <h1 class="names">
      <span class="nm gold shine" data-t="cover.n1" data-fx="wipe" style="--n:${a.en.length}">${E(a.en)}</span>
      <span class="weds" data-t="cover.amp">weds</span>
      <span class="nm gold shine" data-t="cover.n2" data-fx="wiper" style="--n:${b.en.length}">${E(b.en)}</span>
    </h1>
    <p class="hinames hi" data-t="cover.hn">${E(a.hi)} <span>❤</span> ${E(b.hi)}</p>
    <div class="cvdate" data-t="cover.dt"><b>${E(C.dates)}</b><span>${E(C.city)}</span></div>
  </div>
  <div class="hint" data-t="cover.hint"><i></i><span>Swipe up to begin our story</span></div>
</section>`;
}

function story(C) {
  const [a, b] = C.names;
  return `
<section class="scene dark story" data-t="world.s1" aria-label="Prologue">
  <div class="meet" aria-hidden="true">
    <div class="shoot" data-t="story.shoot"></div>
    <div class="hglow" data-t="story.glow"></div>
    <svg class="heart" data-t="story.heart" data-fx="draw" viewBox="-50 -45 100 90"><path class="d" pathLength="100" d="M0,32 C-30,14 -44,-4 -44,-18 C-44,-34 -24,-40 -12,-30 C-6,-25 -2,-20 0,-15 C2,-20 6,-25 12,-30 C24,-40 44,-34 44,-18 C44,-4 30,14 0,32Z"/></svg>
    <div class="orb" data-t="story.oa"><i></i><span class="script">${E(a.en[0])}</span></div>
    <div class="orb" data-t="story.ob"><i></i><span class="script">${E(b.en[0])}</span></div>
  </div>
  <div class="col">
    <p class="chap" data-t="story.c">Prologue</p>
    ${C.story.map((t, i) => `<p class="ln l${i + 1}" data-t="story.l${i + 1}">${glow(t)}</p>`).join('')}
  </div>
</section>`;
}

/* the text column every chapter shares */
function chapterText(id, C, e, titleHtml) {
  return `<div class="col">
    <p class="chap" data-t="${id}.c">${E(e.chapter)} <span class="emo">${E(e.emoji)}</span></p>
    <p class="when" data-t="${id}.d">${E(e.date)}</p>
    ${titleHtml}
    ${e.sub ? `<p class="sub" data-t="${id}.s">${E(e.sub)}</p>` : ''}
    <div class="pill" data-t="${id}.i"><b>${E(e.time)}</b><span>${E(C.venue.name)}</span></div>
    <p class="note" data-t="${id}.n">${E(e.note)}</p>
    <a class="cal" data-t="${id}.a" href="${calUrl(C, e)}" target="_blank" rel="noopener">＋ Add to calendar</a>
  </div>`;
}

function haldi(C, e) {
  return `
<section class="scene light haldi" data-t="world.s2" aria-label="${E(e.title)}">
  <div class="wm hi" data-t="haldi.wm" aria-hidden="true">${E(e.hi)}</div>
  <i class="splash sp1" data-t="haldi.sp1"></i><i class="splash sp2" data-t="haldi.sp2"></i><i class="splash sp3" data-t="haldi.sp3"></i>
  <div class="lav lav-l big" data-t="haldi.lv1">${lavender(3)}</div>
  <div class="lav lav-r big" data-t="haldi.lv2">${lavender(4)}</div>
  <div class="mg m1" data-t="haldi.mg1">${marigold()}</div>
  <div class="mg m2" data-t="haldi.mg2">${marigold()}</div>
  ${chapterText('haldi', C, e, `<h2 class="ttl" data-t="haldi.t" data-fx="wipe">${E(e.title)}</h2>`)}
</section>`;
}

function sangeet(C, e) {
  return `
<section class="scene dark sangeet" data-t="world.s3" aria-label="${E(e.title)} and ${E(e.title2)}">
  <div class="beams" data-t="sangeet.beams" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="lights" data-t="sangeet.lights" data-fx="draw" aria-hidden="true">${fairyLights()}</div>
  <div class="wm hi" data-t="sangeet.wm" aria-hidden="true">${E(e.hi)}</div>
  <div class="rings" aria-hidden="true">
    <div class="ring" data-t="sangeet.r2">${ring(false)}</div>
    <div class="ring" data-t="sangeet.r1">${ring(true)}</div>
    <div class="ring" data-t="sangeet.r2">${ringFront}</div>
    <div class="burst" data-t="sangeet.burst">${burst()}</div>
  </div>
  ${chapterText('sangeet', C, e, `<h2 class="ttl" data-t="sangeet.t" data-fx="wipe">${E(e.title)}</h2>
    <p class="amp script" data-t="sangeet.amp">&amp;</p>
    <h2 class="ttl gold t2" data-t="sangeet.t2" data-fx="wiper">${E(e.title2)}</h2>`)}
  <div class="eq" data-t="sangeet.eq" aria-hidden="true">${equalizer()}</div>
</section>`;
}

function vivah(C, e) {
  const dots = Array.from({ length: 7 }, (_, i) => {
    const a = Math.PI * (.08 + i / 6 * .84);   // along the front of the circle around the fire
    return `<i style="left:${f1(50 + 46 * Math.cos(a))}%;top:${f1((12 + 10 * Math.sin(a)) / 24 * 100)}%" data-t="vivah.p${i}"></i>`;
  }).join('');
  return `
<section class="scene maroon vivah" data-t="world.s4" aria-label="${E(e.title2)}">
  ${MANDAP}
  <div class="toran" data-t="vivah.toran">${toran()}</div>
  <i class="gar g1" data-t="vivah.gar"></i><i class="gar g2" data-t="vivah.gar"></i>
  ${chapterText('vivah', C, e, `<h2 class="ttl hi gold" data-t="vivah.t" data-fx="wipe">${E(e.title)}</h2><p class="sub cz" data-t="vivah.s">${E(e.title2)}</p>`)}
  <div class="agni" aria-hidden="true">
    <svg class="orbit" data-t="vivah.ring" data-fx="draw" viewBox="-50 -12 100 24"><path class="d" pathLength="100" d="M-46,0 A46,10 0 0 1 46,0"/></svg>
    <div class="fire" data-t="vivah.fire"><i class="fglow"></i>${['f1', 'f2', 'f3'].map((c, i) => `<i class="fl ${c}"><svg viewBox="-16 -42 32 43" preserveAspectRatio="none"><path d="${FLAME}" fill="url(#gFl${i})"/></svg></i>`).join('')}<i class="kund"></i></div>
    <svg class="orbit" data-t="vivah.ring" data-fx="draw" viewBox="-50 -12 100 24"><path class="d" pathLength="100" d="M46,0 A46,10 0 0 1 -46,0"/></svg>
    <div class="diyas">${dots}</div>
  </div>
</section>`;
}

function venue(C) {
  return `
<section class="scene light venue" data-t="world.s5" aria-label="The venue">
  <div class="col">
    <p class="chap" data-t="venue.c">The Venue</p>
    <p class="when" data-t="venue.d">${E(C.venue.line)}</p>
    <h2 class="ttl" data-t="venue.t" data-fx="wipe">${E(C.venue.name)}</h2>
    <p class="addr" data-t="venue.ad">${E(C.venue.address)}</p>
    <div class="map" data-t="venue.map">
      ${mapArt()}
      <i class="pulse" data-t="venue.pul"></i>
      <div class="pin" data-t="venue.pin">${PIN}</div>
    </div>
    <div class="btns" data-t="venue.b"><a class="btn solid" href="${mapsUrl(C)}" target="_blank" rel="noopener">Open in Google Maps</a></div>
  </div>
</section>`;
}

function finale(C) {
  const [a, b] = C.names;
  const wa = C.rsvp.whatsapp ? `<a class="btn solid" href="https://wa.me/${E(C.rsvp.whatsapp)}?text=${U(C.rsvp.message)}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : '';
  return `
<section class="scene dark finale" data-t="world.s6" aria-label="With love">
  <div class="md" data-t="finale.md" aria-hidden="true">${mandala()}</div>
  <div class="col">
    <div class="orn" data-t="finale.orn" data-fx="draw">${ORNAMENT}</div>
    <p class="fhi hi" data-t="finale.hi">${E(C.closingHi)}</p>
    <h2 class="ftl" data-t="finale.t">${E(C.closingEn)}</h2>
    <div class="count" id="count" data-t="finale.cnt" role="timer" aria-label="Countdown to the wedding">
      <div><b id="cd">0</b><small>days</small></div><div><b id="ch">0</b><small>hours</small></div>
      <div><b id="cm">0</b><small>minutes</small></div><div><b id="cs">0</b><small>seconds</small></div>
      <p>until the pheras begin</p>
    </div>
    <p class="sign" data-t="finale.sg">${E(C.signoff)}</p>
    <p class="nm gold shine sm" data-t="finale.nm" data-fx="wipe">${E(a.en)} &amp; ${E(b.en)}</p>
    <div class="btns" data-t="finale.b">${wa}<button class="btn ${wa ? '' : 'solid'}" id="share" type="button">Share the invitation</button><button class="btn ghost" id="replay" type="button">↺ Watch again</button></div>
  </div>
</section>`;
}

/* everything inside the sticky stage, as one HTML string */
export function sceneHtml(C) {
  const [h, s, v] = C.events;
  return `${DEFS}
<div class="sky" data-t="world.sky" aria-hidden="true"></div>
<div class="stars" data-t="world.stars" aria-hidden="true">${stars()}</div>
<div class="sun" data-t="world.sun" aria-hidden="true"><i></i></div>
<div class="moon" data-t="world.moon" aria-hidden="true"><i></i></div>
<canvas class="fx" id="fx" aria-hidden="true"></canvas>
${cover(C)}${story(C)}${haldi(C, h)}${sangeet(C, s)}${vivah(C, v)}${venue(C)}${finale(C)}
<div class="hud">
  <div class="bars" id="bars" aria-hidden="true">${'<i><b></b></i>'.repeat(SCENES.length)}</div>
  <button class="play" id="play" type="button" aria-label="Play the story">
    <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>
    <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/></svg>
  </button>
</div>
${envelope(C)}
<div class="toast" id="toast" role="status"></div>`;
}
