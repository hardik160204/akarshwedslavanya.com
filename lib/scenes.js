/* Builds the HTML for the gate, the sky, every scene and the HUD from CONFIG.
   Pure functions (no browser APIs), so the page arrives as ready-made HTML.
   Each scene has two layers: art (under the thread of light) and text (over it), tied to the same
   Theatre.js object. data-t="sheet.object" binds an element to Theatre; data-anchor marks where the
   thread's shape sits in the layout, and data-at pins a piece of art to that same box. */
import { SCENES } from './timeline.js';

export const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const U = encodeURIComponent;
const glow = s => E(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const f1 = n => n.toFixed(1);

/* deterministic random, so build-time HTML and the browser agree */
function rng(seed) {
  return () => {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ---------------- artwork ---------------- */
function lavender(seed) {
  const r = rng(seed), C = ['#8d6bd6', '#a283e6', '#b9a0f2', '#cbb6fa', '#9677e0', '#7a58c6'];
  const stems = [[-14, 150, -22], [-6, 184, -9], [2, 198, 1], [10, 174, 12], [17, 140, 25], [-1, 118, -3]];
  let s = '<path d="M38,206 Q24,180 14,170 Q30,177 41,206Z" fill="#4f7a45"/><path d="M42,206 Q57,182 66,173 Q52,183 40,206Z" fill="#456d3c"/>';
  for (const [bx, h, lean] of stems) {
    const x0 = 40 + bx * .4, y0 = 206, x1 = 40 + bx + lean * .25, y1 = 206 - h * .55, x2 = 40 + bx + lean, y2 = 206 - h;
    s += `<path d="M${f1(x0)},${y0} Q${f1(x1)},${f1(y1)} ${f1(x2)},${f1(y2)}" stroke="#5d7f4e" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
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
    for (let i = 0; i < n; i++) s += `<path transform="rotate(${f1(360 / n * i)})" d="M0,${-r} C${f1(l * .48)},${f1(-r - l * .5)} ${f1(l * .3)},${f1(-r - l)} 0,${f1(-r - l * 1.15)} C${f1(-l * .3)},${f1(-r - l)} ${f1(-l * .48)},${f1(-r - l * .5)} 0,${-r}Z"/>`;
    s += `<circle r="${r}"/>`;
  });
  return `<svg viewBox="-70 -70 140 140" aria-hidden="true">${s}<circle r="4"/></svg>`;
}
const SPARK = 'M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10Z';
function stars() {
  const r = rng(7);
  return [0, 1, 2].map(layer => {
    let s = '';
    for (let i = 0; i < 30; i++) {
      const x = r() * 100, y = r() * 200, big = r() > .9;
      s += big ? `<path transform="translate(${f1(x)} ${f1(y)}) scale(.09)" d="${SPARK}"/>` : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${(.15 + r() * .3).toFixed(2)}"/>`;
    }
    return `<div class="tw t${layer}"><svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMin slice">${s}</svg></div>`;
  }).join('');
}
function fairyLights() {
  const pts = [], q = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  [[0, 3, 25, 26, 50, 6], [50, 6, 75, 26, 100, 3]].forEach(([ax, ay, bx, by, cx, cy]) => {
    for (let i = 1; i < 7; i++) { const t = i / 7; pts.push([q(t, ax, bx, cx), q(t, ay, by, cy)]); }
  });
  return `<svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0,3 Q25,26 50,6 Q75,26 100,3"/></svg>` +
    pts.map((p, i) => `<i style="left:${f1(p[0])}%;top:${f1(p[1] / 30 * 100)}%;--l:${(i * .37 % 2).toFixed(2)}s"></i>`).join('');
}
function toran() {
  let s = '<path d="M0,1 Q35,7 70,1" stroke="#e2bd6a" stroke-width=".35" fill="none"/>';
  for (let i = 0; i <= 14; i++) {
    const x = i * 5, y = 1 + 3 * (1 - ((x - 35) / 35) ** 2);
    s += i % 2 ? `<path d="M${x},${f1(y)} q1.7,3 0,6.6 q-1.7,-3 0,-6.6Z" fill="#2f6b2b"/>`
      : `<circle cx="${x}" cy="${f1(y + 1.8)}" r="1.8" fill="#ff9f1c"/><circle cx="${x}" cy="${f1(y + 1.8)}" r=".9" fill="#ffcd4d"/>`;
  }
  return `<svg viewBox="0 -1 70 11" aria-hidden="true">${s}</svg>`;
}
const FLAME = 'M0,0 C-11,-1 -14,-12 -9,-21 C-7,-15 -4,-14 -3,-17 C-5,-26 0,-32 2,-41 C4,-30 12,-24 13,-14 C14,-5 9,0 0,0Z';
const MANDAP = `<svg class="mandap" data-t="vivah.mandap" data-fx="draw" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">
  <path class="d" pathLength="100" d="M7,200 V44 M12,200 V44 M88,200 V44 M93,200 V44"/>
  <path class="d" pathLength="100" d="M3,44 C3,22 30,11 50,5 C70,11 97,22 97,44 Z"/>
  <path class="d thin" pathLength="100" d="M11,44 C11,28 33,18 50,13 C67,18 89,28 89,44"/>
  <path class="d thin" pathLength="100" d="M15,44 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0 q3.5,4 7,0"/>
  <path class="d" pathLength="100" d="M50,5 V0 M2,191 H98 M0,197 H100"/>
</svg>`;
const ARCH = `<svg class="arch" data-t="cover.arch" data-fx="draw" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">
  <path class="d" pathLength="100" d="M6,200 V62 C6,40 22,31 34,25 C42,21 48,15 50,6 C52,15 58,21 66,25 C78,31 94,40 94,62 V200"/>
  <path class="d thin" pathLength="100" d="M10,200 V64 C10,44 25,36 36,30 C43,26 48,21 50,13 C52,21 57,26 64,30 C75,36 90,44 90,64 V200"/>
</svg>`;
const PIN = `<svg viewBox="-16 -42 32 44" aria-hidden="true"><path d="M0,0 C-6,-12 -14,-18 -14,-27 a14,14 0 1 1 28,0 c0,9 -8,15 -14,27z" fill="url(#gPin)"/><circle cy="-27" r="5.5" fill="#2a0f3e"/></svg>`;
/* a night map of Agra Road, in the same 100 × 64 space as the route shape in thread.js */
const MAP = `<svg viewBox="0 0 100 64" aria-hidden="true">
  <rect x=".5" y=".5" width="99" height="63" rx="5" fill="rgba(14,10,30,.55)" stroke="rgba(201,179,240,.28)" stroke-width=".5"/>
  <g fill="rgba(110,170,120,.16)"><path d="M5,9 C13,3 25,7 23,16 C21,25 8,23 5,16Z"/><circle cx="88" cy="52" r="8"/><circle cx="60" cy="10" r="5"/><path d="M40,52 C46,46 56,50 54,58 C50,64 40,62 40,52Z"/></g>
  <g fill="rgba(130,200,140,.32)"><circle cx="66" cy="18" r="3"/><circle cx="82" cy="20" r="3.4"/><circle cx="70" cy="13" r="2.4"/><circle cx="84" cy="29" r="2.6"/><circle cx="65" cy="27" r="2.2"/></g>
  <g fill="none" stroke="rgba(201,179,240,.2)" stroke-width=".5"><path d="M0,22 H100 M0,40 C30,38 60,44 100,42 M18,0 V64 M46,0 C48,20 44,44 47,64 M90,0 V64"/></g>
  <path id="rdAgra" d="M-2,52 C22,48 34,37 52,35 S82,27 102,15" stroke="rgba(201,179,240,.38)" stroke-width="3.2" fill="none"/>
  <path d="M30,-2 C33,18 26,40 32,66 M76,66 C72,54 80,44 74,29 L74,18" stroke="rgba(201,179,240,.3)" stroke-width="1.6" fill="none"/>
  <text font-size="2.6" letter-spacing=".8" fill="rgba(233,220,255,.7)" font-family="serif"><textPath href="#rdAgra" startOffset="7%">AGRA ROAD</textPath></text>
  <text x="5" y="60" font-size="2.5" letter-spacing=".8" fill="rgba(233,220,255,.5)" font-family="serif">ALIGARH</text>
</svg>`;
const ORNAMENT = `<svg viewBox="0 0 140 24" aria-hidden="true"><path d="M4,12 H52 M88,12 H136" /><path d="M52,12 l4,-3 l4,3 l-4,3z M80,12 l4,-3 l4,3 l-4,3z"/></svg>`;
const DEFS = `<svg class="defs" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="gFl0" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a00"/><stop offset=".55" stop-color="#e63a12"/><stop offset="1" stop-color="#c8140a" stop-opacity="0"/></linearGradient>
  <linearGradient id="gFl1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd23f"/><stop offset=".55" stop-color="#ff9f1c"/><stop offset="1" stop-color="#ff7814" stop-opacity="0"/></linearGradient>
  <linearGradient id="gFl2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fffbe6"/><stop offset=".6" stop-color="#ffe27a"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></linearGradient>
  <linearGradient id="gPin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0c2"/><stop offset=".5" stop-color="#f3c35c"/><stop offset="1" stop-color="#b8862b"/></linearGradient>
</defs></svg>`;

/* ---------------- links ---------------- */
const calUrl = (C, e) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${U(`${C.names[0].en} & ${C.names[1].en} · ${e.calTitle}`)}&dates=${e.cal[0]}/${e.cal[1]}&ctz=Asia/Kolkata&location=${U(`${C.venue.name}, ${C.venue.address}`)}`;
const mapsUrl = C => `https://www.google.com/maps/search/?api=1&query=${U(C.venue.mapsQuery)}`;

/* ---------------- the two layers of each scene ---------------- */
function arts() {
  return `
<div class="art a0" data-t="world.s0">
  <i class="halo" data-t="cover.halo" data-at="knot"></i>
  <div class="md" data-t="cover.md">${mandala()}</div>
  ${ARCH}
</div>
<div class="art a1" data-t="world.s1"><i class="nebula"></i></div>
<div class="art a2" data-t="world.s2">
  <div class="sun" data-t="haldi.sun" data-at="flower"><i></i></div>
  <div class="wm hi" data-t="haldi.wm">हल्दी</div>
  <div class="lav lav-l" data-t="haldi.lv1">${lavender(3)}</div>
  <div class="lav lav-r" data-t="haldi.lv2">${lavender(4)}</div>
  <div class="mg m1" data-t="haldi.mg1">${marigold()}</div>
  <div class="mg m2" data-t="haldi.mg2">${marigold()}</div>
</div>
<div class="art a3" data-t="world.s3">
  <div class="beams" data-t="sangeet.beams"><i></i><i></i><i></i></div>
  <div class="lights" data-t="sangeet.bulbs">${fairyLights()}</div>
  <div class="eq" id="eq" data-t="sangeet.eq">${'<i></i>'.repeat(24)}</div>
</div>
<div class="art a4" data-t="world.s4">
  ${MANDAP}
  <div class="toran" data-t="vivah.toran">${toran()}</div>
  <i class="gar g1" data-t="vivah.gar"></i><i class="gar g2" data-t="vivah.gar"></i>
  <div class="agni" data-at="coil"><div class="fire" data-t="vivah.fire"><i class="fglow"></i>${[0, 1, 2].map(i => `<i class="fl f${i}"><svg viewBox="-16 -42 32 43" preserveAspectRatio="none"><path d="${FLAME}" fill="url(#gFl${i})"/></svg></i>`).join('')}<i class="kund"></i></div></div>
</div>
<div class="art a5" data-t="world.s5">
  <div class="map" data-t="venue.map" data-at="route">${MAP}<i class="pulse" data-t="venue.pul"></i><div class="pin" data-t="venue.pin">${PIN}</div></div>
</div>
<div class="art a6" data-t="world.s6"><div class="md" data-t="finale.md">${mandala()}</div></div>`;
}

function chapterText(id, C, e, titleHtml, anchor) {
  return `${anchor}
    <p class="chap" data-t="${id}.c">${E(e.chapter)} <span class="emo">${E(e.emoji)}</span></p>
    <p class="when" data-t="${id}.d">${E(e.date)}</p>
    ${titleHtml}
    ${e.sub ? `<p class="sub" data-t="${id}.s">${E(e.sub)}</p>` : ''}
    <div class="pill" data-t="${id}.i"><b>${E(e.time)}</b><span>${E(C.venue.name)}</span></div>
    <p class="note" data-t="${id}.n">${E(e.note)}</p>
    <a class="cal" data-t="${id}.a" data-ev="${C.events.indexOf(e)}" href="${calUrl(C, e)}" target="_blank" rel="noopener">＋ Add to calendar</a>`;
}

function texts(C) {
  const [a, b] = C.names, [h, s, v] = C.events;
  const wa = C.rsvp.whatsapp ? `<a class="btn solid" href="https://wa.me/${E(C.rsvp.whatsapp)}?text=${U(C.rsvp.message)}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : '';
  return `
<section class="scene s0" data-t="world.s0" aria-label="${E(a.en)} and ${E(b.en)}">
  <p class="bless hi" data-t="cover.g">${E(C.blessing)}</p>
  <p class="kick" data-t="cover.k">${E(C.kicker)}</p>
  <h1 class="title">
    <span class="nm" data-t="cover.n1" data-fx="wipe" style="--n:${a.en.length}">${E(a.en)}</span>
    <span class="tb tb-knot" data-anchor="knot" aria-hidden="true"></span>
    <span class="nm" data-t="cover.n2" data-fx="wipe" style="--n:${b.en.length}">${E(b.en)}</span>
  </h1>
  <p class="hinames hi" data-t="cover.hn">${E(a.hi)} <span>✦</span> ${E(b.hi)}</p>
  <div class="cvdate" data-t="cover.dt"><b>${E(C.dates)}</b><span>${E(C.venue.name)} · ${E(C.city)}</span></div>
  <div class="hint" data-t="cover.hint"><i></i><span>Swipe up</span></div>
</section>
<section class="scene s1" data-t="world.s1" aria-label="Prologue">
  <div class="tb tb-stars" data-anchor="stars" aria-hidden="true"></div>
  <p class="chap" data-t="story.c">Prologue</p>
  ${C.story.map((t, i) => `<p class="ln l${i + 1}" data-t="story.l${i + 1}">${glow(t)}</p>`).join('')}
</section>
<section class="scene s2" data-t="world.s2" aria-label="${E(h.title)}">
  ${chapterText('haldi', C, h, `<h2 class="ttl" data-t="haldi.t" data-fx="wipe">${E(h.title)}</h2>`, '<div class="tb tb-flower" data-anchor="flower" aria-hidden="true"></div>')}
</section>
<section class="scene s3" data-t="world.s3" aria-label="${E(s.title)} and ${E(s.title2)}">
  ${chapterText('sangeet', C, s, `<h2 class="ttl" data-t="sangeet.t" data-fx="wipe">${E(s.title)}</h2>
    <p class="amp script" data-t="sangeet.amp">&amp;</p>
    <h2 class="ttl gold t2" data-t="sangeet.t2" data-fx="wipe">${E(s.title2)}</h2>`, '<div class="tb tb-rings" data-anchor="rings" aria-hidden="true"></div>')}
  <div class="tb tb-wave" data-anchor="wave" aria-hidden="true"></div>
</section>
<section class="scene s4" data-t="world.s4" aria-label="${E(v.title2)}">
  ${chapterText('vivah', C, v, `<h2 class="ttl hi gold" data-t="vivah.t" data-fx="wipe">${E(v.title)}</h2><p class="sub cz" data-t="vivah.s">${E(v.title2)}</p>`, '')}
  <div class="tb tb-coil" data-anchor="coil" aria-hidden="true"></div>
</section>
<section class="scene s5" data-t="world.s5" aria-label="The venue">
  <p class="chap" data-t="venue.c">The Venue</p>
  <p class="when" data-t="venue.d">${E(C.venue.line)}</p>
  <h2 class="ttl" data-t="venue.t" data-fx="wipe">${E(C.venue.name)}</h2>
  <p class="addr" data-t="venue.ad">${E(C.venue.address)}</p>
  <div class="tb tb-route" data-anchor="route" aria-hidden="true"></div>
  <div class="btns" data-t="venue.b"><a class="btn solid" href="${mapsUrl(C)}" target="_blank" rel="noopener">Open in Google Maps</a></div>
</section>
<section class="scene s6" data-t="world.s6" aria-label="With love">
  <div class="tb tb-knot2" data-anchor="knot2" aria-hidden="true"></div>
  <p class="fhi hi" data-t="finale.hi">${E(C.closingHi)}</p>
  <h2 class="ftl" data-t="finale.t">${E(C.closingEn)}</h2>
  <div class="count" id="count" data-t="finale.cnt" role="timer" aria-label="Countdown to the wedding">
    <div><b id="cd">0</b><small>days</small></div><div><b id="ch">0</b><small>hours</small></div>
    <div><b id="cm">0</b><small>minutes</small></div><div><b id="cs">0</b><small>seconds</small></div>
    <p>until the pheras begin</p>
  </div>
  <p class="sign" data-t="finale.sg">${E(C.signoff)}</p>
  <p class="nm sm gold" data-t="finale.nm" data-fx="wipe">${E(a.en)} <span class="script">&amp;</span> ${E(b.en)}</p>
  <p class="toguest" id="toguest" data-t="finale.g"></p>
  <div class="btns" data-t="finale.b">${wa}<button class="btn ${wa ? '' : 'solid'}" id="share" type="button">Share the invitation</button><button class="btn ghost" id="replay" type="button">↺ Watch again</button></div>
</section>`;
}

function gate(C) {
  return `
<div class="gate" id="gate" data-t="intro.gate">
  <div class="g-md" aria-hidden="true">${mandala()}</div>
  <p class="g-bless hi">${E(C.blessing)}</p>
  <p class="g-dear"><span id="dear"></span>${E(C.gateLine)}</p>
  <button class="g-orb" id="open" type="button" aria-label="Open the invitation"><i></i><i></i><i></i><b></b></button>
  <p class="g-cta">Tap the light to begin</p>
  <p class="g-sound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>Best with sound on</p>
</div>`;
}

/* everything inside the sticky stage, as one HTML string */
export function sceneHtml(C) {
  return `${DEFS}
<div class="bg" aria-hidden="true"><i class="glow ga" data-t="world.g1"></i><i class="glow gb" data-t="world.g2"></i></div>
<div class="stars" data-t="world.stars" aria-hidden="true">${stars()}</div>
<div class="cam" id="cam">
  <div class="layer arts" aria-hidden="true">${arts()}</div>
  <canvas class="fx" id="fx" aria-hidden="true"></canvas>
  <div class="layer texts">${texts(C)}</div>
</div>
<div class="grain" aria-hidden="true"></div>
<div class="vig" aria-hidden="true"></div>
<div class="flash" data-t="intro.flash" aria-hidden="true"></div>
<div class="hud">
  <div class="bars" id="bars" aria-hidden="true">${'<i><b></b></i>'.repeat(SCENES.length)}</div>
  <button class="hbtn snd" id="snd" type="button" aria-label="Mute music" aria-pressed="false"><span class="eqi" aria-hidden="true"><i></i><i></i><i></i><i></i></span><svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.6 3 2.7-2.7-1.1-1.1-2.7 2.7-2.7-2.7-1.1 1.1 2.7 2.7-2.7 2.7 1.1 1.1 2.7-2.7 2.7 2.7 1.1-1.1z"/></svg></button>
  <button class="hbtn play" id="play" type="button" aria-label="Pause the story">
    <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>
    <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/></svg>
  </button>
</div>
${gate(C)}
<div class="toast" id="toast" role="status"></div>`;
}
