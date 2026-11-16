/* Royal illustrations, drawn entirely in code (no image files): the peacock palace door, a golden palace at
   sunset with the couple walking up a flower path, hanging bells, kalash, lanterns, banners, a lotus frame,
   a peacock mandala and an elephant in a lotus pond. Gradients live in DEFS (one copy per page). */

const f = n => Math.round(n * 10) / 10;
export function rng(seed) {
  return () => {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const g = (inner, tf = '', cls = '') => `<g${tf ? ` transform="${tf}"` : ''}${cls ? ` class="${cls}"` : ''}>${inner}</g>`;
const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;

export const DEFS = `<svg class="defs" aria-hidden="true" focusable="false"><defs>
  ${lin('gGold', [[0, '#fff3c0'], [.45, '#e9bb52'], [1, '#a8741c']])}
  ${lin('gGoldH', [[0, '#a8741c'], [.25, '#f6dc8a'], [.5, '#c9962e'], [.75, '#fff0b5'], [1, '#a97418']], 1, 0)}
  ${lin('gSand', [[0, '#f8d6a0'], [1, '#d9985a']])}
  ${lin('gSandD', [[0, '#e6aa6a'], [1, '#b8743d']])}
  ${rad('gDome', [[0, '#fff6cf'], [.45, '#f2c463'], [1, '#b98023']], .35, .3, .75)}
  ${lin('gSky', [[0, '#f2bccb'], [.45, '#f8d3c1'], [1, '#fde8c4']])}
  ${rad('gSun', [[0, '#fffaf0', 1], [.35, '#ffe9bf', .85], [1, '#ffe2b0', 0]])}
  ${lin('gWin', [[0, '#ffe7a8'], [1, '#e79a4c']])}
  ${lin('gArch', [[0, '#7a3a1c'], [1, '#c26a2c']])}
  ${lin('gMarble', [[0, '#f4e3cf'], [1, '#fffaf2']])}
  ${lin('gCarpet', [[0, '#c4345a'], [1, '#e2507a']])}
  ${rad('gRose', [[0, '#ffe0e8'], [.5, '#f48fb1'], [1, '#c8456f']], .4, .35, .7)}
  ${rad('gRoseW', [[0, '#ffffff'], [.6, '#fbeef0'], [1, '#e8c7cf']], .4, .35, .7)}
  ${rad('gMari', [[0, '#ffd45e'], [.6, '#f7a21b'], [1, '#d86f00']], .4, .35, .7)}
  ${lin('gLeaf', [[0, '#6fae63'], [1, '#2f6b3e']])}
  ${lin('gPea', [[0, '#2a7fd4'], [1, '#0b2f6b']])}
  ${lin('gTrain', [[0, '#1f6b4c'], [.6, '#3e8f5a'], [1, '#c5b04c']], 1, 0)}
  ${lin('gWater', [[0, '#a7d8de'], [1, '#2f7f98']])}
  ${lin('gWood', [[0, '#8f4f24'], [1, '#562a10']])}
  ${lin('gLotus', [[0, '#ffe0eb'], [1, '#ec6f99']])}
  ${lin('gEle', [[0, '#b2b4c2'], [1, '#7a7d90']])}
  ${lin('gRed', [[0, '#c62a4b'], [1, '#850c2a']])}
  ${lin('gHaze', [[0, '#eab4c4'], [1, '#f3cfc9']])}
  ${lin('gLehenga', [[0, '#d42a43'], [1, '#8f0f26']])}
  ${lin('gIvory', [[0, '#fffaf0'], [1, '#ecd9b8']])}
  ${lin('gSafa', [[0, '#f0663a'], [1, '#b3172d']])}
  <pattern id="pMosaic" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#0d3a80"/><path d="M5,0.8 L9.2,5 L5,9.2 L0.8,5Z" fill="#1c69c0"/><path d="M5,3 L7,5 L5,7 L3,5Z" fill="#17a6a4"/><circle cx="5" cy="5" r=".9" fill="#f0c24e"/><circle cx="0" cy="0" r="1.1" fill="#f0c24e"/><circle cx="10" cy="0" r="1.1" fill="#f0c24e"/><circle cx="0" cy="10" r="1.1" fill="#f0c24e"/><circle cx="10" cy="10" r="1.1" fill="#f0c24e"/></pattern>
  <pattern id="pJaali" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#c98a4c"/><circle cx="4" cy="4" r="2.6" fill="#7a3a1c"/><circle cx="0" cy="0" r="1.2" fill="#7a3a1c"/><circle cx="8" cy="0" r="1.2" fill="#7a3a1c"/><circle cx="0" cy="8" r="1.2" fill="#7a3a1c"/><circle cx="8" cy="8" r="1.2" fill="#7a3a1c"/></pattern>
</defs></svg>`;

/* ---------------- small pieces ---------------- */
export const dome = (cx, y, r, fill = 'url(#gDome)') =>
  `<path d="M${f(cx - r)},${f(y)} C${f(cx - r)},${f(y - r * 1.05)} ${f(cx - r * .2)},${f(y - r * 1.2)} ${f(cx)},${f(y - r * 1.95)} C${f(cx + r * .2)},${f(y - r * 1.2)} ${f(cx + r)},${f(y - r * 1.05)} ${f(cx + r)},${f(y)} Z" fill="${fill}"/>` +
  `<rect x="${f(cx - r * 1.08)}" y="${f(y - r * .08)}" width="${f(r * 2.16)}" height="${f(r * .16)}" fill="#b98023"/>` +
  `<rect x="${f(cx - r * .05)}" y="${f(y - r * 2.45)}" width="${f(r * .1)}" height="${f(r * .55)}" fill="#c9962e"/><circle cx="${f(cx)}" cy="${f(y - r * 2.5)}" r="${f(r * .12)}" fill="#e9bb52"/>`;
export const archWin = (x, y, w, h, fill) => `<path d="M${f(x)},${f(y + h)} V${f(y + w / 2)} A${f(w / 2)},${f(w / 2)} 0 0 1 ${f(x + w)},${f(y + w / 2)} V${f(y + h)} Z" fill="${fill}"/>`;
export function chhatri(cx, y, r, body = 'url(#gSand)', top = 'url(#gDome)') {
  return `<rect x="${f(cx - r * 1.15)}" y="${f(y - r * 1.3)}" width="${f(r * 2.3)}" height="${f(r * .3)}" fill="${body}"/><rect x="${f(cx - r * .95)}" y="${f(y - r * 1.05)}" width="${f(r * .3)}" height="${f(r * 1.05)}" fill="${body}"/><rect x="${f(cx + r * .65)}" y="${f(y - r * 1.05)}" width="${f(r * .3)}" height="${f(r * 1.05)}" fill="${body}"/>` + dome(cx, y - r * 1.3, r * .85, top);
}
export function marigold(x, y, r) {
  let s = '';
  [[1, 12, '#e07b00'], [.72, 10, '#f7a21b'], [.45, 8, '#ffc93c']].forEach(([k, n, c], j) => {
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + j * .3; s += `<circle cx="${f(x + Math.cos(a) * r * k * .62)}" cy="${f(y + Math.sin(a) * r * k * .62)}" r="${f(r * k * .42)}" fill="${c}"/>`; }
  });
  return s;
}
export const rose = (x, y, r, fill = 'url(#gRose)') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/><path d="M${f(x - r * .5)},${f(y)} a${f(r * .5)},${f(r * .45)} 0 1 1 ${f(r)},0" stroke="rgba(150,30,70,.35)" stroke-width="${f(r * .15)}" fill="none"/>`;
export function bush(x, y, s, seed, flowers = 'rose') {
  const r = rng(seed);
  let o = `<ellipse cx="0" cy="-10" rx="26" ry="16" fill="url(#gLeaf)"/><circle cx="-16" cy="-12" r="11" fill="#3f8a4a"/><circle cx="15" cy="-14" r="12" fill="#4a9a52"/>`;
  for (let i = 0; i < 9; i++) {
    const px = (r() - .5) * 46, py = -8 - r() * 18, k = 3 + r() * 2.6;
    o += flowers === 'mari' ? marigold(px, py, k * 1.2) : rose(px, py, k, r() > .7 ? 'url(#gRoseW)' : 'url(#gRose)');
  }
  return g(o, `translate(${x},${y}) scale(${s})`);
}
export const eye = (x, y, s = 1, rot = 0) => g(`<ellipse rx="6.4" ry="9.2" fill="#c9b04c"/><ellipse rx="5.2" ry="7.6" fill="#2e8b57"/><ellipse rx="3.7" ry="5.5" fill="#12a1a6"/><ellipse rx="2.4" ry="3.7" cy=".4" fill="#1d4fa3"/><ellipse rx="1.2" ry="2" cy=".6" fill="#0b1f4a"/>`, `translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${s})`);
export function peacockFan(cx, cy, r, n = 13) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.08 + i / (n - 1) * .84), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, deg = a * 180 / Math.PI + 90;
    s += `<path d="M${cx},${cy} L${f(x)},${f(y)}" stroke="#2f7d4f" stroke-width="1.2"/><ellipse cx="${f(cx + Math.cos(a) * r * .78)}" cy="${f(cy + Math.sin(a) * r * .78)}" rx="${f(r * .1)}" ry="${f(r * .26)}" transform="rotate(${f(deg)} ${f(cx + Math.cos(a) * r * .78)} ${f(cy + Math.sin(a) * r * .78)})" fill="#3e8f5a" opacity=".7"/>` + eye(x, y, r / 48, deg);
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${f(r * .2)}" fill="url(#gPea)"/><circle cx="${cx}" cy="${cy}" r="${f(r * .1)}" fill="#e9bb52"/>`;
}
/* a peacock in profile, facing right, standing at (0,0); its train flows back and down */
export function peacock(x, y, s = 1, flip = false) {
  const eyes = [[-30, -22, .55, -70], [-48, -14, .6, -75], [-66, -6, .62, -80], [-82, 1, .6, -84], [-40, -6, .5, -78], [-60, 2, .5, -82]];
  return g(`<path d="M-6,-34 C-40,-32 -82,-12 -100,6 C-72,10 -30,4 -2,-18 Z" fill="url(#gTrain)"/>${eyes.map(([ex, ey, k, r]) => eye(ex, ey, k, r)).join('')}
    <path d="M2,-20 L0,0 M6,-20 L7,0" stroke="#8a7a6a" stroke-width="1.6"/>
    <path d="M-8,-30 C-10,-44 0,-52 8,-46 C14,-40 12,-26 4,-20 C-2,-16 -8,-20 -8,-30 Z" fill="url(#gPea)"/>
    <path d="M-6,-32 C-2,-40 6,-40 8,-34 C4,-30 -2,-28 -6,-32Z" fill="#b8925a" opacity=".85"/>
    <path d="M4,-46 C6,-58 4,-66 9,-72 C12,-75 16,-73 15,-69 C11,-64 12,-56 10,-46 Z" fill="url(#gPea)"/>
    <circle cx="13" cy="-71" r="3.6" fill="#1f5fb0"/><path d="M16,-72 L21,-70 L16,-68.6 Z" fill="#e9bb52"/><circle cx="13.6" cy="-72" r=".9" fill="#fff"/>
    <path d="M12,-74 L9,-82 M13,-74 L13,-84 M14,-74 L17,-82" stroke="#1f5fb0" stroke-width=".8"/><circle cx="9" cy="-82" r="1.1" fill="#12a1a6"/><circle cx="13" cy="-84" r="1.1" fill="#12a1a6"/><circle cx="17" cy="-82" r="1.1" fill="#12a1a6"/>`,
    `translate(${x},${y}) scale(${flip ? -s : s},${s})`);
}
/* the couple from behind, walking hand in hand up the path; feet at (0,0) */
export function coupleBack(x, y, s = 1) {
  return g(`<path d="M-20,-34 L-21,-3 M-10,-34 L-9,-3" stroke="#f6ead2" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="-21" cy="-1.5" rx="3.6" ry="2" fill="#7a1230"/><ellipse cx="-9" cy="-1.5" rx="3.6" ry="2" fill="#7a1230"/>
    <path d="M-27,-68 C-29,-58 -31,-50 -30,-44" stroke="url(#gIvory)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-26,-71 C-24,-77 -6,-77 -4,-71 L-1,-31 C-10,-28 -22,-28 -30,-31 Z" fill="url(#gIvory)"/>
    <path d="M-29,-33 C-20,-30 -10,-30 -2,-33 M-15,-75 V-30" stroke="#c9962e" stroke-width="1.2" fill="none"/>
    <path d="M-6,-68 Q-1,-60 2,-52" stroke="url(#gIvory)" stroke-width="5.5" stroke-linecap="round" fill="none"/>
    <rect x="-17.5" y="-81" width="6" height="7" fill="#c98d66"/><circle cx="-14.5" cy="-85" r="6.5" fill="#3a2418"/>
    <path d="M-22,-86 C-23,-97 -6,-98 -7,-86 C-12,-84 -17,-84 -22,-86Z" fill="url(#gSafa)"/><path d="M-12,-85 L-9,-60 L-15,-61 Z" fill="url(#gSafa)"/><path d="M-22,-87 C-17,-89 -11,-89 -7,-87" stroke="#e9bb52" stroke-width="1.4" fill="none"/>
    <path d="M8,-50 L20,-50 C26,-34 32,-14 36,0 L-6,0 C0,-14 4,-34 8,-50 Z" fill="url(#gLehenga)"/>
    <path d="M-5,-5 L35,-5 L36,0 L-6,0 Z" fill="url(#gGoldH)"/>${range(9, i => `<circle cx="${f(2 + i * 3.6)}" cy="${f(-14 - (i % 3) * 9)}" r=".8" fill="#f6dc8a"/>`)}
    <path d="M7,-72 C10,-76 18,-76 21,-72 L20,-50 L8,-50 Z" fill="#8f0f26"/>
    <path d="M9,-68 Q5,-60 3,-52" stroke="#c98d66" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <circle cx="14" cy="-80" r="6" fill="#2a1810"/>
    <path d="M7,-82 C8,-92 20,-93 22,-82 C26,-60 30,-30 35,3 L22,3 C20,-26 16,-56 10,-72 Z" fill="#c8243f" opacity=".88"/>
    <path d="M7,-82 C8,-92 20,-93 22,-82 C26,-60 30,-30 35,3" stroke="#e9bb52" stroke-width="1.2" fill="none"/>
    <circle cx="2.5" cy="-51.5" r="2.6" fill="#c98d66"/>`, `translate(${x},${y}) scale(${s})`);
}
export function bell(x, len, s = 1) {
  return g(`${range(Math.round(len / 6), i => `<circle cx="0" cy="${i * 6 + 3}" r="2" fill="url(#gGold)"/>`)}
    <g transform="translate(0,${len})"><circle cy="0" r="3" fill="#b98023"/><path d="M-9,14 C-9,3 -6,1 0,1 C6,1 9,3 9,14 L11,18 H-11 Z" fill="url(#gGold)"/><rect x="-11.5" y="17" width="23" height="3" rx="1.5" fill="#b98023"/><circle cy="22" r="2.4" fill="#a8741c"/>
    <path d="M-5,6 C-5,10 -5,12 -6,15" stroke="#fff3c0" stroke-width="1.4" opacity=".8" fill="none"/></g>`, `translate(${x},0) scale(${s})`);
}
/* golden bells and flower strings hanging from a carved arch across the top of the page */
export function bellsToran() {
  const cusps = range(8, i => `<path d="M${i * 50},0 Q${i * 50 + 25},26 ${i * 50 + 50},0" fill="none" stroke="url(#gGoldH)" stroke-width="3.5"/>`);
  const strings = range(8, i => range(8, j => { const t = (j + .5) / 8, x = i * 50 + t * 50, y = 2 + 4 * 13 * t * (1 - t); return `<circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="${j % 2 ? '#f48fb1' : '#fffaf0'}"/>`; }));
  const bells = [[25, 38, .9], [100, 58, 1], [200, 72, 1.1], [300, 58, 1], [375, 38, .9]].map(([x, l, s]) => `<g class="ring" style="--d:${(x % 7) * .17}s">${bell(x, l, s)}</g>`).join('');
  return `<svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMin meet" aria-hidden="true"><rect width="400" height="7" fill="url(#gGoldH)"/>${cusps}${strings}${bells}</svg>`;
}
export function kalash(s = 1) {
  return `<svg viewBox="-40 -64 80 84" aria-hidden="true" style="width:${s}em">${range(5, i => { const a = -150 + i * 30; return `<path d="M0,-30 q${f(Math.cos(a * Math.PI / 180) * 10 + 4)},${f(Math.sin(a * Math.PI / 180) * 16)} ${f(Math.cos(a * Math.PI / 180) * 26)},${f(Math.sin(a * Math.PI / 180) * 26)} q${f(-Math.cos(a * Math.PI / 180) * 4)},${f(Math.sin(a * Math.PI / 180) * 4 + 8)} ${f(-Math.cos(a * Math.PI / 180) * 26)},${f(-Math.sin(a * Math.PI / 180) * 26)}Z" fill="url(#gLeaf)"/>`; })}
    <ellipse cx="0" cy="-40" rx="10" ry="12" fill="#8a5a2b"/><path d="M-6,-48 q6,-6 12,0" stroke="#5a3a1a" stroke-width="1.2" fill="none"/>
    <path d="M-12,-30 h24 l-3,6 h-18z" fill="url(#gGold)"/><path d="M-9,-24 C-30,-20 -30,14 0,16 C30,14 30,-20 9,-24Z" fill="url(#gGold)"/>
    <path d="M-20,-8 H20" stroke="#c62a4b" stroke-width="2.4"/><path d="M-19,-3 H19" stroke="#f7a21b" stroke-width="1.6"/>${range(5, i => `<circle cx="${-12 + i * 6}" cy="6" r="1.4" fill="#c62a4b"/>`)}</svg>`;
}
export function lantern(len = 40) {
  return `<svg viewBox="-20 0 40 ${len + 66}" aria-hidden="true"><path d="M0,0 V${len}" stroke="url(#gGoldH)" stroke-width="1.4"/>
    <g transform="translate(0,${len})">${dome(0, 12, 9)}<rect x="-11" y="12" width="22" height="3" fill="#b98023"/>
    <path d="M-10,15 L10,15 L12,40 L-12,40 Z" fill="#ffd98a"/><path d="M-10,15 L10,15 L12,40 L-12,40 Z M0,15 V40 M-11,27 H11" stroke="#b98023" stroke-width="1.6" fill="none"/>
    <path d="M-12,40 H12 L6,47 H-6Z" fill="url(#gGold)"/><path d="M0,47 V56" stroke="#c62a4b" stroke-width="2"/><path d="M-3,56 h6 l-1,8 h-4z" fill="#c62a4b"/></g></svg>`;
}

/* ---------------- the big pictures ---------------- */
function palace(cx, base, w, body, cut, top) {
  const h = w * .34, x0 = cx - w / 2, w2 = w * .52, h2 = w * .16;
  let s = `<rect x="${f(x0)}" y="${f(base - h)}" width="${f(w)}" height="${f(h + 30)}" fill="${body}"/>`;
  const n = 7, aw = w / n * .55;
  for (let i = 0; i < n; i++) s += archWin(x0 + (i + .5) * w / n - aw / 2, base - h * .82, aw, h * .62, cut);
  s += `<rect x="${f(x0 - 3)}" y="${f(base - h - 3)}" width="${f(w + 6)}" height="5" fill="${top === 'url(#gDome)' ? '#c98a4c' : body}"/>`;
  s += `<rect x="${f(cx - w2 / 2)}" y="${f(base - h - h2)}" width="${f(w2)}" height="${f(h2)}" fill="${body}"/>`;
  for (let i = 0; i < 4; i++) s += archWin(cx - w2 / 2 + (i + .5) * w2 / 4 - aw * .38, base - h - h2 * .85, aw * .76, h2 * .66, cut);
  s += dome(cx, base - h - h2, w * .15, top) + dome(cx - w * .2, base - h - h2 * .1, w * .06, top) + dome(cx + w * .2, base - h - h2 * .1, w * .06, top);
  s += chhatri(x0 + w * .1, base - h, w * .055, body, top) + chhatri(x0 + w * .9, base - h, w * .055, body, top);
  [x0 - w * .04, x0 + w + w * .04].forEach(mx => { s += `<rect x="${f(mx - w * .022)}" y="${f(base - h * 1.9)}" width="${f(w * .044)}" height="${f(h * 1.9 + 30)}" fill="${body}"/>` + dome(mx, base - h * 1.9, w * .036, top); });
  return s;
}
const flag = (x, y, s = 1) => `<path d="M${x},${y} V${y - 22 * s}" stroke="#8a5a2b" stroke-width="1.2"/><path d="M${x},${y - 22 * s} l${14 * s},${4 * s} l${-14 * s},${5 * s}Z" fill="#f07a1a" class="flutter"/>`;
const cloud = (x, y, s) => g(`<ellipse cx="0" cy="0" rx="30" ry="11" fill="#fff6ea"/><circle cx="-8" cy="-7" r="11" fill="#fff6ea"/><circle cx="9" cy="-9" r="13" fill="#fff9f1"/><ellipse cx="2" cy="3" rx="26" ry="5" fill="#f8d9c8" opacity=".7"/>`, `translate(${x},${y}) scale(${s})`);
const birds = (x, y) => range(3, i => `<path d="M${x + i * 12},${y + (i % 2) * 5} q4,-4 8,0 q4,-4 8,0" stroke="#a6566c" stroke-width="1.1" fill="none"/>`);

/* the golden palace at sunset; three layers so the page can move them separately (viewBox 400 × 520) */
export const PALACE_VB = '0 -290 400 810';                 // extra sky on top for the names
export function palaceScene() {
  const sky = `<rect y="-290" width="400" height="810" fill="url(#gSky)"/><circle cx="200" cy="215" r="170" fill="url(#gSun)"/>` +
    cloud(50, 40, 1) + cloud(340, 10, .8) + cloud(310, 150, .6) + birds(70, 150) + birds(262, 118) +
    `<g opacity=".75">${palace(54, 318, 120, 'url(#gHaze)', '#f7d9d4', '#e8a9bd')}${palace(350, 318, 110, 'url(#gHaze)', '#f7d9d4', '#e8a9bd')}</g>` +
    `<rect x="-10" y="316" width="420" height="30" fill="#f1c9b8"/>`;
  const mid = palace(200, 330, 214, 'url(#gSand)', 'url(#gArch)', 'url(#gDome)') +
    range(7, i => { const aw = 214 / 7 * .55, x = 93 + (i + .5) * 214 / 7 - aw / 2; return archWin(x + 2, 330 - 214 * .34 * .82 + 3, aw - 4, 214 * .34 * .62 - 3, 'url(#gWin)'); }) +
    archWin(182, 286, 36, 44, '#6d3015') + archWin(185, 290, 30, 40, 'url(#gWin)') +
    flag(200, 140) + flag(83, 182, .8) + flag(317, 182, .8) +
    `<rect x="70" y="328" width="260" height="6" fill="#e9c08a"/><rect x="60" y="333" width="280" height="6" fill="#f3d6ab"/><rect x="50" y="338" width="300" height="7" fill="#f8e4c4"/>`;
  const pathL = y => 200 - (14 + (y - 345) * .62), pathR = y => 200 + (14 + (y - 345) * .62);
  let beds = '';
  for (let i = 0; i < 6; i++) {
    const y = 360 + i * (18 + i * 7), k = .42 + i * .16;
    beds += bush(pathL(y) - 22 * k - 6, y, k, 30 + i, i % 2 ? 'mari' : 'rose') + bush(pathR(y) + 22 * k + 6, y, k, 60 + i, i % 2 ? 'rose' : 'mari');
  }
  const front = `<path d="M186,345 L214,345 L${f(pathR(520))},520 L${f(pathL(520))},520 Z" fill="url(#gMarble)"/>` +
    range(9, i => { const y = 352 + i * i * 2.1 + i * 3; return `<path d="M${f(pathL(y))},${f(y)} H${f(pathR(y))}" stroke="#e8cfb4" stroke-width="${f(.6 + i * .12)}"/>`; }) +
    `<path d="M196,345 L204,345 L${f(200 + (5 + 175 * .28))},520 L${f(200 - (5 + 175 * .28))},520 Z" fill="url(#gCarpet)" opacity=".9"/>` +
    `<rect x="-10" y="345" width="${f(pathL(345) + 10)}" height="190" fill="#9ccf8f"/><path d="M-10,345 H${f(pathL(345))} L${f(pathL(520))},520 H-10Z" fill="#8cc47f"/>` +
    `<path d="M410,345 H${f(pathR(345))} L${f(pathR(520))},520 H410Z" fill="#8cc47f"/>` + beds +
    peacock(78, 468, 1.05) + peacock(322, 468, 1.05, true) +
    coupleBack(200, 470, 1.05) +
    bush(18, 522, 1.25, 91) + bush(382, 522, 1.25, 92, 'mari') + bush(60, 530, .95, 93, 'mari') + bush(340, 530, .95, 94);
  return [sky, mid, front];
}

/* the peacock door: mosaic surround, a fan of feathers, peacocks in the spandrels (viewBox 300 × 440) */
export function doorFrame() {
  const ax = 70, aw = 160, ay = 120, ah = 300;      // the arch opening (round top)
  const hole = `M${ax},${ay + ah} V${ay + aw / 2} A${aw / 2},${aw / 2} 0 0 1 ${ax + aw},${ay + aw / 2} V${ay + ah} Z`;
  return `<svg viewBox="0 0 300 440" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path d="M0,440 V96 C0,40 90,10 150,0 C210,10 300,40 300,96 V440 Z ${hole}" fill="url(#pMosaic)" fill-rule="evenodd"/>
    <path d="M6,440 V98 C6,46 92,17 150,7 C208,17 294,46 294,98 V440" fill="none" stroke="url(#gGoldH)" stroke-width="4"/>
    <path d="M${ax - 10},${ay + ah} V${ay + aw / 2} A${aw / 2 + 10},${aw / 2 + 10} 0 0 1 ${ax + aw + 10},${ay + aw / 2} V${ay + ah}" fill="none" stroke="url(#gGoldH)" stroke-width="6"/>
    <path d="M${ax - 4},${ay + ah} V${ay + aw / 2} A${aw / 2 + 4},${aw / 2 + 4} 0 0 1 ${ax + aw + 4},${ay + aw / 2} V${ay + ah}" fill="none" stroke="#7a1230" stroke-width="3"/>
    ${peacockFan(150, 118, 70, 15)}
    ${peacock(46, 196, .62)}${peacock(254, 196, .62, true)}
    ${range(6, i => `<circle cx="${ax - 18}" cy="${230 + i * 34}" r="6" fill="url(#gRose)"/><circle cx="${ax + aw + 18}" cy="${230 + i * 34}" r="6" fill="url(#gRose)"/>`)}
    <rect x="0" y="426" width="300" height="14" fill="url(#gGoldH)"/></svg>`;
}
export function doorLeaf(side) {
  let s = `<rect width="80" height="300" fill="url(#gWood)"/><rect x="4" y="4" width="72" height="292" fill="none" stroke="url(#gGoldH)" stroke-width="2"/>`;
  [[10, 26, 60, 70], [10, 108, 60, 80], [10, 200, 60, 86]].forEach(([x, y, w, h]) => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#4a2410"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="3" fill="url(#gWood)" stroke="#c9962e" stroke-width="1"/>`;
    s += `<path d="M${x + w / 2},${y + 12} l8,${h / 2 - 12} l-8,${h / 2 - 12} l-8,${-(h / 2 - 12)}Z" fill="none" stroke="#c9962e" stroke-width="1"/>`;
  });
  for (let y = 16; y < 296; y += 18) for (const x of [8, 72]) s += `<circle cx="${x}" cy="${y}" r="2.2" fill="url(#gGold)"/>`;
  const kx = side === 'l' ? 70 : 10;
  s += `<circle cx="${kx}" cy="170" r="9" fill="none" stroke="url(#gGold)" stroke-width="3"/><circle cx="${kx}" cy="160" r="3.4" fill="url(#gGold)"/>`;
  return `<svg viewBox="0 0 80 300" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
}

/* a big peacock mandala for the page edges (viewBox -100 -100 200 200) */
export function mandala() {
  let s = '<circle r="98" fill="#0b2a64"/>';
  [[90, 22, 16, '#123c86'], [70, 18, 14, '#1b55a8'], [50, 14, 12, '#2a73c4']].forEach(([r, n, w, c], k) => {
    for (let i = 0; i < n; i++) {
      const a = (i + k * .5) / n * 360;
      s += `<g transform="rotate(${f(a)})"><path d="M0,${-r + 22} C${w * .6},${-r + 14} ${w * .45},${-r - 2} 0,${-r - 8} C${-w * .45},${-r - 2} ${-w * .6},${-r + 14} 0,${-r + 22}Z" fill="${c}"/>${eye(0, -r + 4, .55 - k * .08)}</g>`;
    }
  });
  return `<svg viewBox="-100 -100 200 200" aria-hidden="true">${s}<circle r="30" fill="#0d3a80"/><circle r="26" fill="none" stroke="#e9bb52" stroke-width="1.5" stroke-dasharray="2 3"/>${peacockFan(0, 8, 22, 9)}</svg>`;
}

/* an elephant in a lotus pond, with a pavilion and palms on the far bank (viewBox 400 × 330) */
export const POND_VB = '0 0 400 330';
function palm(x, y, h, s = 1) {
  let fr = '';
  for (let i = 0; i < 7; i++) { const a = -160 + i * 23, r = 34 * s; fr += `<path d="M${x},${y - h} q${f(Math.cos(a * Math.PI / 180) * r * .5)},${f(Math.sin(a * Math.PI / 180) * r * .5 - 10)} ${f(Math.cos(a * Math.PI / 180) * r)},${f(Math.sin(a * Math.PI / 180) * r + 8)}" stroke="#3f8a4a" stroke-width="${f(4 * s)}" fill="none" stroke-linecap="round"/>`; }
  return `<path d="M${x},${y} q${f(6 * s)},${f(-h / 2)} 0,${-h}" stroke="#8a5a2b" stroke-width="${f(4 * s)}" fill="none"/>` + fr;
}
export function lotus(x, y, s = 1) {
  return g(`${range(5, i => `<path d="M0,0 C-7,-6 -6,-18 0,-26 C6,-18 7,-6 0,0Z" fill="url(#gLotus)" transform="rotate(${-56 + i * 28})"/>`)}<path d="M0,0 C-6,-6 -5,-16 0,-22 C5,-16 6,-6 0,0Z" fill="#ffe7f0"/><ellipse cx="0" cy="-1" rx="5" ry="2" fill="#ffc93c"/>`, `translate(${x},${y}) scale(${s})`);
}
const pad = (x, y, s = 1) => `<path d="M${x},${y} m-${18 * s},0 a${18 * s},${6 * s} 0 1 0 ${36 * s},0 a${18 * s},${6 * s} 0 1 0 ${-36 * s},0 M${x},${y} L${x + 14 * s},${y - 3 * s}" fill="#4f9a5a" stroke="#2f6b3e" stroke-width="1"/>`;
export function elephant(x, y, s = 1) {
  return g(`<path d="M30,80 L30,116 L41,116 L41,82Z M88,82 L88,116 L99,116 L99,84Z" fill="#6f7389"/>
    <path d="M14,52 C10,30 30,14 62,14 C86,14 104,17 116,20 C128,14 142,20 145,34 C147,44 143,54 138,58 L131,62 C125,70 119,74 117,78 L117,118 L103,118 L101,84 C88,88 70,88 54,86 L52,118 L38,118 L36,84 C24,80 16,68 14,52Z" fill="url(#gEle)"/>
    <path d="M136,40 C152,32 160,14 156,-2 C155,-8 148,-10 145,-5 C143,-1 147,2 149,0 C152,12 144,26 132,32Z" fill="url(#gEle)"/>
    <path d="M104,26 C92,30 89,52 97,64 C103,72 114,66 116,56 C118,44 114,30 104,26Z" fill="#8a8da0"/>
    <path d="M134,52 C140,56 146,58 151,56" stroke="#fffaf0" stroke-width="3.2" stroke-linecap="round" fill="none"/><circle cx="125" cy="31" r="2" fill="#2a1810"/>
    <path d="M34,20 C50,15 80,15 98,20 L100,58 C92,62 86,58 80,62 C74,58 66,62 60,58 C54,62 46,58 40,62 C34,58 30,60 28,56 Z" fill="url(#gRed)"/>
    <path d="M30,52 C34,58 40,58 40,62 C46,58 54,62 60,58 C66,62 74,58 80,62 C86,58 92,62 100,58" stroke="url(#gGoldH)" stroke-width="2.4" fill="none"/>
    ${range(4, i => `<circle cx="${40 + i * 20}" cy="66" r="2.6" fill="#f7a21b"/>`)}
    <path d="M118,16 C126,12 136,14 140,22 L136,38 C130,36 124,34 120,30Z" fill="url(#gRed)"/><circle cx="130" cy="22" r="3" fill="url(#gGold)"/>
    ${lotus(152, -6, .55)}`, `translate(${x},${y}) scale(${s}) translate(-80,-118)`);
}
export function pondScene() {
  const back = `<rect width="400" height="330" fill="url(#gSky)"/><circle cx="200" cy="120" r="120" fill="url(#gSun)"/>` + cloud(70, 60, .9) + cloud(320, 46, .7) +
    `<g opacity=".7">${palace(200, 168, 150, 'url(#gHaze)', '#f7d9d4', '#e8a9bd')}</g>` +
    `<path d="M-10,160 C60,150 120,170 200,164 C280,158 340,170 410,160 V200 H-10Z" fill="#7fbf86"/>` +
    chhatri(70, 172, 22) + palm(30, 176, 70, 1) + palm(350, 176, 80, 1.1) + palm(380, 180, 56, .8);
  const water = `<rect x="-10" y="178" width="420" height="160" fill="url(#gWater)"/>` + range(8, i => `<path d="M${20 + (i * 53) % 360},${200 + i * 15} q10,-3 20,0 t20,0" stroke="#e8f6f8" stroke-width="1.2" fill="none" opacity=".7"/>`) +
    pad(60, 300, 1.2) + pad(320, 290) + pad(250, 318, 1.3) + pad(110, 250, .8) + pad(300, 236, .7);
  const front = elephant(206, 286, 1.05) + `<path d="M-10,276 Q60,268 130,276 T270,276 T410,276 V340 H-10Z" fill="url(#gWater)" opacity=".82"/><path d="M110,278 q20,-4 40,0 t40,0 t40,0 t40,0" stroke="#e8f6f8" stroke-width="1.4" fill="none" opacity=".8"/>` +
    lotus(60, 296, 1.1) + lotus(318, 286, .9) + lotus(250, 314, 1.2) + lotus(110, 246, .7) + lotus(30, 320, 1) + lotus(380, 316, 1.1);
  return [back, water, front];
}

/* an ornate lotus frame for the bride & groom (viewBox 300 × 380) */
export function lotusFrame() {
  const lobes = (y, dir) => range(5, i => `<path d="M${30 + i * 48},${y} q24,${dir * 26} 48,0" fill="none" stroke="url(#gGoldH)" stroke-width="3"/>`);
  return `<svg viewBox="0 0 300 380" preserveAspectRatio="none" aria-hidden="true">
    <rect x="12" y="30" width="276" height="320" rx="18" fill="#fffaf2" opacity=".86"/>
    <rect x="12" y="30" width="276" height="320" rx="18" fill="none" stroke="url(#gGoldH)" stroke-width="3"/>
    <rect x="22" y="40" width="256" height="300" rx="12" fill="none" stroke="#e8a3b8" stroke-width="1.5"/>
    ${lobes(30, -1)}${lobes(350, 1)}
    ${lotus(150, 30, 1.3)}${lotus(150, 350, .9)}
    ${[[22, 40], [278, 40], [22, 340], [278, 340]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="url(#gRose)"/>`).join('')}
  </svg>`;
}
/* the resort gate for the venue card (viewBox 300 × 190) */
export function venueGate() {
  return `<svg viewBox="0 0 300 190" aria-hidden="true"><rect width="300" height="190" rx="16" fill="url(#gSky)"/><circle cx="150" cy="96" r="80" fill="url(#gSun)"/>
    <path d="M-10,150 C60,140 120,156 200,148 C260,142 290,150 310,146 V190 H-10Z" fill="#8cc47f"/>
    ${palm(30, 160, 64, .9)}${palm(272, 160, 70, 1)}
    <rect x="70" y="80" width="160" height="80" fill="url(#gSand)"/>${archWin(118, 96, 64, 64, 'url(#gArch)')}${archWin(124, 104, 52, 56, 'url(#gWin)')}
    ${archWin(80, 104, 26, 40, 'url(#gArch)')}${archWin(194, 104, 26, 40, 'url(#gArch)')}
    <rect x="64" y="76" width="172" height="6" fill="#c98a4c"/>${dome(150, 76, 26)}${chhatri(84, 76, 11)}${chhatri(216, 76, 11)}
    <rect x="96" y="58" width="108" height="0" />
    ${bush(40, 178, .7, 7)}${bush(260, 178, .7, 8, 'mari')}
    <rect x="104" y="164" width="92" height="18" rx="4" fill="#fffaf0" stroke="#c9962e"/><text x="150" y="177" text-anchor="middle" font-family="Cinzel, serif" font-size="9" font-weight="600" fill="#2f6b3e">GREEN VIEW</text></svg>`;
}
