/* Paper-cut illustrations, drawn in code (no image files).
   Every scene is a stack of paper layers. Each layer is its own <svg> (same viewBox), so the pop-up
   animation moves whole layers cheaply, and a soft shadow under each layer gives the paper depth.
   Scenes are 400 × 420 and sit on the bottom edge of the screen; keep important things below y≈120. */
export const VB = '0 0 400 420';

export const C = {
  ivory: '#fdf6e9', cream: '#f5e6c8', sand: '#ead2a8', pink: '#e8578a', rani: '#c2185b', blush: '#f7bfd0', rose: '#f39bb5', peach: '#f9cfa8',
  marigold: '#f7a21b', saffron: '#ec7614', yellow: '#ffc93c', butter: '#ffe39a', emerald: '#1f7a5a', leaf: '#3c8d4f', mint: '#8cc8a0', teal: '#14797b',
  peacock: '#0f5b73', maroon: '#7b1838', wine: '#5a1230', plum: '#3b1236', indigo: '#26285f', night: '#363a86', lav: '#9d7fd6', lavL: '#c8b3f0', lavD: '#6f52b5',
  gold: '#d8a33a', brass: '#c88a26', terra: '#b5532f', brown: '#6e4527', skin: '#c98d66', white: '#ffffff'
};

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

/* ---------------- landscape ---------------- */
export function hills(y, amp, n, seed, fill) {
  const r = rng(seed), w = 420 / n;
  let d = `M-10,430 L-10,${f(y)}`;
  for (let i = 0; i < n; i++) { const x = -10 + w * i; d += ` Q${f(x + w / 2)},${f(y - amp * (.5 + r() * .9))} ${f(x + w)},${f(y + (r() - .5) * amp * .25)}`; }
  return `<path d="${d} L410,430 Z" fill="${fill}"/>`;
}
export const ground = (y, fill) => `<rect x="-10" y="${y}" width="420" height="${430 - y}" fill="${fill}"/>`;
export function cloud(x, y, s, fill = C.ivory) {
  return g(`<circle cx="0" cy="0" r="14" fill="${fill}"/><circle cx="16" cy="-6" r="18" fill="${fill}"/><circle cx="36" cy="0" r="13" fill="${fill}"/><rect x="0" y="0" width="36" height="13" fill="${fill}"/>`, `translate(${x},${y}) scale(${s})`);
}
export function stars(n, seed, top, bottom, fill = C.butter) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * 400, y = top + r() * (bottom - top), z = 1.2 + r() * 2.4;
    s += r() > .45 ? `<path d="M${f(x)},${f(y - z * 2)} L${f(x + z * .5)},${f(y - z * .5)} L${f(x + z * 2)},${f(y)} L${f(x + z * .5)},${f(y + z * .5)} L${f(x)},${f(y + z * 2)} L${f(x - z * .5)},${f(y + z * .5)} L${f(x - z * 2)},${f(y)} L${f(x - z * .5)},${f(y - z * .5)}Z" fill="${fill}"/>`
      : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(z * .5)}" fill="${fill}"/>`;
  }
  return s;
}
export function moon(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff1c9"/><circle cx="${x - r * .35}" cy="${y - r * .2}" r="${r * .18}" fill="#f6e1a8"/><circle cx="${x + r * .3}" cy="${y + r * .3}" r="${r * .12}" fill="#f6e1a8"/><circle cx="${x + r * .1}" cy="${y - r * .45}" r="${r * .08}" fill="#f6e1a8"/>`;
}
export function sun(x, y, r) {
  let s = '';
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2, a1 = a - .1, a2 = a + .1, R = r * (i % 2 ? 1.45 : 1.7);
    s += `<path d="M${f(x + Math.cos(a1) * r * 1.08)},${f(y + Math.sin(a1) * r * 1.08)} L${f(x + Math.cos(a) * R)},${f(y + Math.sin(a) * R)} L${f(x + Math.cos(a2) * r * 1.08)},${f(y + Math.sin(a2) * r * 1.08)}Z" fill="${C.yellow}"/>`;
  }
  return g(s, '', 'spin') + `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}"/><circle cx="${x}" cy="${y}" r="${r * .78}" fill="#ffd862"/>`;
}
export function tree(x, y, r, fill, trunk = C.brown) {
  return `<rect x="${f(x - r * .12)}" y="${f(y - r * 1.3)}" width="${f(r * .24)}" height="${f(r * 1.3)}" fill="${trunk}"/><circle cx="${x}" cy="${f(y - r * 1.75)}" r="${r}" fill="${fill}"/><circle cx="${f(x - r * .62)}" cy="${f(y - r * 1.25)}" r="${f(r * .68)}" fill="${fill}"/><circle cx="${f(x + r * .62)}" cy="${f(y - r * 1.3)}" r="${f(r * .7)}" fill="${fill}"/>`;
}
export const cypress = (x, y, h, fill) => `<path d="M${x},${y - h} C${f(x + h * .2)},${f(y - h * .6)} ${f(x + h * .17)},${y} ${x},${y} C${f(x - h * .17)},${y} ${f(x - h * .2)},${f(y - h * .6)} ${x},${y - h}Z" fill="${fill}"/>`;

/* ---------------- architecture ---------------- */
export const dome = (cx, y, r, fill) =>
  `<path d="M${f(cx - r)},${f(y)} C${f(cx - r)},${f(y - r * 1.05)} ${f(cx - r * .2)},${f(y - r * 1.2)} ${f(cx)},${f(y - r * 1.95)} C${f(cx + r * .2)},${f(y - r * 1.2)} ${f(cx + r)},${f(y - r * 1.05)} ${f(cx + r)},${f(y)} Z" fill="${fill}"/>` +
  `<rect x="${f(cx - r * .06)}" y="${f(y - r * 2.4)}" width="${f(r * .12)}" height="${f(r * .5)}" fill="${fill}"/><circle cx="${f(cx)}" cy="${f(y - r * 2.45)}" r="${f(r * .13)}" fill="${fill}"/>`;
export const archWin = (x, y, w, h, fill) => `<path d="M${f(x)},${f(y + h)} V${f(y + w / 2)} A${f(w / 2)},${f(w / 2)} 0 0 1 ${f(x + w)},${f(y + w / 2)} V${f(y + h)} Z" fill="${fill}"/>`;
export function chhatri(cx, y, r, fill) {
  return `<rect x="${f(cx - r * 1.1)}" y="${f(y - r * 1.3)}" width="${f(r * 2.2)}" height="${f(r * .3)}" fill="${fill}"/><rect x="${f(cx - r * .95)}" y="${f(y - r * 1.05)}" width="${f(r * .32)}" height="${f(r * 1.05)}" fill="${fill}"/><rect x="${f(cx + r * .63)}" y="${f(y - r * 1.05)}" width="${f(r * .32)}" height="${f(r * 1.05)}" fill="${fill}"/>` + dome(cx, y - r * 1.3, r * .85, fill);
}
export function palace(cx, base, w, fill, cut) {
  const h = w * .32, x0 = cx - w / 2, w2 = w * .5, h2 = w * .15;
  let s = `<rect x="${f(x0)}" y="${f(base - h)}" width="${f(w)}" height="${f(h + 40)}" fill="${fill}"/>`;
  const n = 7, aw = w / n * .52;
  for (let i = 0; i < n; i++) s += archWin(x0 + (i + .5) * w / n - aw / 2, base - h * .8, aw, h * .62, cut);
  s += `<rect x="${f(cx - w2 / 2)}" y="${f(base - h - h2)}" width="${f(w2)}" height="${f(h2)}" fill="${fill}"/>`;
  for (let i = 0; i < 3; i++) s += archWin(cx - w2 / 2 + (i + .5) * w2 / 3 - aw * .4, base - h - h2 * .82, aw * .8, h2 * .64, cut);
  s += dome(cx, base - h - h2, w * .13, fill);
  s += chhatri(x0 + w * .12, base - h, w * .06, fill) + chhatri(x0 + w * .88, base - h, w * .06, fill);
  s += chhatri(cx - w2 / 2 + w * .02, base - h - h2, w * .045, fill) + chhatri(cx + w2 / 2 - w * .02, base - h - h2, w * .045, fill);
  [x0 - w * .03, x0 + w + w * .03].forEach(mx => { s += `<rect x="${f(mx - w * .022)}" y="${f(base - h * 1.85)}" width="${f(w * .044)}" height="${f(h * 1.85 + 40)}" fill="${fill}"/>` + dome(mx, base - h * 1.85, w * .035, fill); });
  return s;
}
/* a scalloped Mughal arch frame on two pillars; the opening is left empty so the scene shows through */
export function archFrame(cx, base, w, h, fill, trim) {
  const x0 = cx - w / 2, x1 = cx + w / 2, pw = w * .1, top = base - h, sp = top + w * .32;
  const outer = `M${f(x0 - pw)},${base} V${f(sp)} C${f(x0 - pw)},${f(top - w * .02)} ${f(cx - w * .2)},${f(top - w * .06)} ${cx},${f(top - w * .2)} C${f(cx + w * .2)},${f(top - w * .06)} ${f(x1 + pw)},${f(top - w * .02)} ${f(x1 + pw)},${f(sp)} V${base} Z`;
  // inner multifoil opening: lobes along the arch
  let inner = `M${f(x1)},${base} V${f(sp)}`;
  const lobes = 7;
  for (let i = 0; i < lobes; i++) {
    const a0 = i / lobes * Math.PI, a1 = (i + 1) / lobes * Math.PI, R = w / 2, cy = sp;
    const px = cx + Math.cos(a1) * R, py = cy - Math.sin(a1) * R * .95 - (i === 3 ? 0 : 0);
    inner += ` A${f(R * .26)},${f(R * .26)} 0 0 0 ${f(px)},${f(py)}`;
  }
  inner += ` V${base} Z`;
  return `<path d="${outer} ${inner}" fill="${fill}" fill-rule="evenodd"/>` +
    `<rect x="${f(x0 - pw * 1.25)}" y="${f(base - 14)}" width="${f(pw * 1.5)}" height="14" fill="${trim}"/><rect x="${f(x1 - pw * .25)}" y="${f(base - 14)}" width="${f(pw * 1.5)}" height="14" fill="${trim}"/>` +
    `<rect x="${f(x0 - pw * 1.1)}" y="${f(sp - 6)}" width="${f(pw * 1.2)}" height="6" fill="${trim}"/><rect x="${f(x1 - pw * .1)}" y="${f(sp - 6)}" width="${f(pw * 1.2)}" height="6" fill="${trim}"/>` +
    `<circle cx="${cx}" cy="${f(top - w * .2 - 8)}" r="6" fill="${trim}"/>`;
}
export function haveli(x, base, w, h, body, trim, glass, figure) {
  const top = base - h;
  let s = `<rect x="${x}" y="${top}" width="${w}" height="${h + 40}" fill="${body}"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${f(x + i * w / 6)},${top} q${f(w / 12)},-9 ${f(w / 6)},0Z" fill="${body}"/>`;
  s += chhatri(x + w * .5, top - 2, w * .12, body);
  // jharokha balcony with a lit window and someone inside, looking at the moon
  const jx = x + w * .22, jw = w * .56, jy = top + h * .2, jh = h * .36;
  s += `<rect x="${f(jx - 4)}" y="${f(jy + jh)}" width="${f(jw + 8)}" height="7" fill="${trim}"/>` + archWin(jx - 3, jy - 3, jw + 6, jh + 3, trim) + archWin(jx, jy, jw, jh, glass);
  if (figure) s += `<circle cx="${f(jx + jw / 2)}" cy="${f(jy + jh * .52)}" r="${f(jw * .13)}" fill="${C.plum}"/><path d="M${f(jx + jw * .24)},${f(jy + jh)} C${f(jx + jw * .26)},${f(jy + jh * .7)} ${f(jx + jw * .74)},${f(jy + jh * .7)} ${f(jx + jw * .76)},${f(jy + jh)} Z" fill="${C.plum}"/>`;
  s += archWin(x + w * .12, top + h * .66, w * .2, h * .22, glass) + archWin(x + w * .68, top + h * .66, w * .2, h * .22, trim);
  s += archWin(x + w * .38, base - h * .2, w * .24, h * .2, trim);
  return s;
}

/* ---------------- festive things ---------------- */
export function marigold(x, y, r) {
  let s = '';
  [[1, 12, '#e07b00'], [.72, 10, C.marigold], [.45, 8, C.yellow]].forEach(([k, n, c], j) => {
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + j * .3; s += `<circle cx="${f(x + Math.cos(a) * r * k * .62)}" cy="${f(y + Math.sin(a) * r * k * .62)}" r="${f(r * k * .42)}" fill="${c}"/>`; }
  });
  return s + `<circle cx="${x}" cy="${y}" r="${f(r * .2)}" fill="#b25600"/>`;
}
export function garland(x1, y1, x2, y2, sag, n, r = 4.2, cols = ['#e07b00', C.yellow, C.marigold]) {
  let s = '';
  for (let i = 0; i <= n; i++) { const t = i / n; s += `<circle cx="${f(x1 + (x2 - x1) * t)}" cy="${f(y1 + (y2 - y1) * t + sag * 4 * t * (1 - t))}" r="${r}" fill="${cols[i % cols.length]}"/>`; }
  return s;
}
/* a toran: marigold swags with mango leaves, hung across the top */
export function toran(x1, x2, y, swags, sag) {
  let s = '';
  const w = (x2 - x1) / swags;
  for (let i = 0; i < swags; i++) s += garland(x1 + i * w, y, x1 + (i + 1) * w, y, sag, 9, 4);
  for (let i = 0; i <= swags * 2; i++) {
    const x = x1 + i * w / 2, yy = y + (i % 2 ? sag : 0) + 3;
    s += `<path d="M${f(x)},${f(yy)} q5,10 0,22 q-5,-12 0,-22Z" fill="${i % 2 ? C.leaf : C.emerald}"/>`;
  }
  return s;
}
export function bunting(x1, x2, y, sag, n, cols) {
  let s = `<path d="M${x1},${y} Q${(x1 + x2) / 2},${y + sag * 2} ${x2},${y}" stroke="${C.brown}" stroke-width="1.2" fill="none"/>`;
  const w = (x2 - x1) / n;
  for (let i = 0; i < n; i++) {
    const t = (i + .5) / n, x = x1 + (x2 - x1) * t, yy = y + sag * 4 * t * (1 - t);
    s += `<path d="M${f(x - w * .42)},${f(yy - 1)} L${f(x + w * .42)},${f(yy - 1)} L${f(x)},${f(yy + w * .95)}Z" fill="${cols[i % cols.length]}"/>`;
  }
  return s;
}
export function lights(x1, x2, y, sag, n, cols = [C.butter, C.blush, C.white, C.yellow]) {
  let s = `<path d="M${x1},${y} Q${(x1 + x2) / 2},${y + sag * 2} ${x2},${y}" stroke="#2a1638" stroke-width="1" fill="none"/>`;
  for (let i = 1; i < n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, yy = y + sag * 4 * t * (1 - t); s += `<rect x="${f(x - 1.5)}" y="${f(yy)}" width="3" height="3" fill="#2a1638"/><ellipse cx="${f(x)}" cy="${f(yy + 7)}" rx="3.6" ry="5" fill="${cols[i % cols.length]}" class="bulb" style="--i:${i % 5}"/>`; }
  return s;
}
export function diya(x, y, s = 1) {
  return g(`<path d="M-11,0 C-9,7 9,7 11,0 Z" fill="${C.terra}"/><path d="M-11,0 H11" stroke="${C.gold}" stroke-width="1.6"/><path d="M0,-2 C-4,-6 -2,-11 0,-15 C2,-11 4,-6 0,-2Z" fill="${C.saffron}" class="flick"/><path d="M0,-3 C-2,-6 -1,-9 0,-11 C1,-9 2,-6 0,-3Z" fill="${C.yellow}" class="flick"/>`, `translate(${x},${y}) scale(${s})`);
}
export function urli(x, y, s = 1) {
  let m = '';
  [[-22, -4, 7], [-6, -6, 8], [11, -4, 7], [26, -1, 5.5], [-30, 1, 5]].forEach(([dx, dy, r]) => { m += marigold(dx, dy, r); });
  return g(`<ellipse cx="0" cy="6" rx="52" ry="7" fill="rgba(80,40,10,.18)"/><path d="M-50,-4 C-46,20 46,20 50,-4 Z" fill="${C.brass}"/><path d="M-44,8 C-30,14 30,14 44,8" stroke="#e6b24f" stroke-width="2" fill="none"/>
    <ellipse cx="0" cy="-4" rx="50" ry="8" fill="#e2b04f"/><ellipse cx="0" cy="-4" rx="44" ry="6" fill="${C.yellow}"/>${m}
    <path d="M36,-6 q14,-12 26,-4 q-14,10 -26,4Z" fill="${C.leaf}"/><path d="M-36,-5 q-14,-12 -26,-3 q14,9 26,3Z" fill="${C.emerald}"/>`, `translate(${x},${y}) scale(${s})`);
}
export function dhol(x, y, s = 1, body = C.rani) {
  return g(`<ellipse cx="0" cy="22" rx="30" ry="5" fill="rgba(40,10,30,.25)"/><rect x="-26" y="-14" width="52" height="34" rx="6" fill="${body}"/><path d="M-26,-6 L-13,20 L0,-6 L13,20 L26,-6" stroke="${C.gold}" stroke-width="2" fill="none"/>
    <ellipse cx="-26" cy="3" rx="6" ry="17" fill="${C.cream}"/><ellipse cx="26" cy="3" rx="6" ry="17" fill="${C.sand}"/>`, `translate(${x},${y}) scale(${s})`);
}
export function note(x, y, s = 1, fill = C.butter) {
  return g(g(`<ellipse cx="0" cy="0" rx="5" ry="3.6" transform="rotate(-20)" fill="${fill}"/><rect x="3.6" y="-20" width="1.8" height="20" fill="${fill}"/><path d="M5.4,-20 q8,4 6,12 q-1,-6 -6,-7Z" fill="${fill}"/>`, '', 'float'), `translate(${x},${y}) scale(${s})`);
}
export function heart(x, y, s = 1, fill = C.pink) {
  return g(`<path d="M0,10 C-14,0 -16,-10 -9,-14 C-5,-16 -1,-13 0,-9 C1,-13 5,-16 9,-14 C16,-10 14,0 0,10Z" fill="${fill}"/>`, `translate(${x},${y}) scale(${s})`);
}
export function rings(x, y, s = 1) {
  return g(`<circle cx="-11" cy="0" r="15" fill="none" stroke="${C.gold}" stroke-width="5"/><circle cx="11" cy="0" r="15" fill="none" stroke="#e8b84a" stroke-width="5"/>
    <path d="M-1,-11 A15,15 0 0 1 3,-14" stroke="${C.gold}" stroke-width="5" fill="none"/><path d="M-11,-15 l-5,-7 h10z" fill="#eaf6ff"/><path d="M-16,-22 h10 l-5,7z" fill="#cfe8fb"/>`, `translate(${x},${y}) scale(${s})`);
}
export function kund(x, y, s = 1) {
  return g(`<path d="M-30,0 L30,0 L24,20 L-24,20 Z" fill="${C.terra}"/><path d="M-30,0 H30" stroke="#d8774a" stroke-width="3"/><path d="M-27,8 H27 M-25,14 H25 M-14,0 V20 M0,0 V20 M14,0 V20" stroke="#8f3d22" stroke-width="1" opacity=".5"/>
    <g class="flick"><path d="M0,-2 C-20,-6 -18,-28 -8,-40 C-8,-30 -2,-28 0,-32 C-2,-42 6,-52 10,-60 C10,-46 22,-36 20,-18 C19,-8 10,-2 0,-2Z" fill="#e8461c"/>
    <path d="M0,-2 C-13,-6 -12,-22 -4,-30 C-4,-22 2,-22 3,-26 C2,-34 8,-40 10,-46 C11,-34 17,-26 15,-14 C14,-6 8,-2 0,-2Z" fill="${C.marigold}"/>
    <path d="M1,-2 C-6,-5 -6,-14 -1,-19 C0,-14 3,-14 4,-17 C4,-22 6,-25 7,-28 C9,-20 11,-14 9,-8 C8,-4 5,-2 1,-2Z" fill="${C.yellow}"/></g>`, `translate(${x},${y}) scale(${s})`);
}

/* ---------------- people and elephants ---------------- */
/* the groom: safa, sherwani, a stole; faceless paper silhouette. hand = where his front hand goes (local coords) */
export function groom(x, y, s = 1, hand = [60, 92], c = {}) {
  const k = { coat: C.peacock, safa: C.saffron, stole: C.rani, skin: C.skin, leg: C.cream, shoe: C.wine, ...c };
  return g(`<path d="M24,128 L23,190 M42,128 L44,190" stroke="${k.leg}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M17,191 h12 l2,5 h-16z M38,191 h12 l3,5 h-16z" fill="${k.shoe}"/>
    <path d="M27,50 C21,70 20,90 22,106" stroke="${k.coat}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M24,46 C28,42 40,42 46,47 L51,130 C40,133 28,133 17,130 Z" fill="${k.coat}"/>
    <path d="M30,44 L44,130 L50,129 L36,44 Z" fill="${k.stole}"/>
    <path d="M31,48 V128" stroke="${C.gold}" stroke-width="1.4" stroke-dasharray="1.5 5"/>
    <path d="M43,50 Q${f((43 + hand[0]) / 2 + 4)},${f((50 + hand[1]) / 2)} ${hand[0]},${hand[1]}" stroke="${k.coat}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <circle cx="${hand[0]}" cy="${hand[1]}" r="4" fill="${k.skin}"/>
    <rect x="31" y="34" width="7" height="10" fill="${k.skin}"/>
    <circle cx="35" cy="28" r="9.5" fill="${k.skin}"/>
    <path d="M25,27 C23,14 32,9 39,10 C47,11 48,20 45,26 C40,24 30,24 25,27Z" fill="${k.safa}"/>
    <path d="M26,24 C21,28 20,35 22,41 L26,40 C25,35 27,30 30,27Z" fill="${k.safa}"/>
    <path d="M26,18 C32,16 40,17 46,21 M25,23 C32,20 40,21 45,25" stroke="#c95f0c" stroke-width="1.2" fill="none"/>
    <path d="M42,12 C42,5 47,2 49,0 C48,5 47,9 44,13Z" fill="${C.gold}"/>`, `translate(${x},${y}) scale(${s}) translate(-34,-196)`);
}
/* the bride: lehenga with a gold border, a veil over her head; facing left */
export function bride(x, y, s = 1, hand = [62, 93], c = {}) {
  const k = { skirt: C.rani, border: C.gold, choli: C.maroon, veil: C.rose, skin: C.skin, ...c };
  return g(`<path d="M79,70 L93,70 C100,110 110,160 117,196 L55,196 C62,160 72,110 79,70 Z" fill="${k.skirt}"/>
    <path d="M58,184 L114,184 L117,196 L55,196 Z" fill="${k.border}"/>
    <path d="M70,120 L102,120" stroke="${k.border}" stroke-width="1.6" stroke-dasharray="2 4"/>
    <path d="M78,46 C82,43 90,43 94,47 L93,72 L79,72 Z" fill="${k.choli}"/>
    <path d="M81,52 Q${f((81 + hand[0]) / 2 - 4)},${f((52 + hand[1]) / 2)} ${hand[0] + 3},${hand[1] + 1}" stroke="${k.skin}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <rect x="81" y="36" width="6" height="10" fill="${k.skin}"/>
    <circle cx="83" cy="31" r="9" fill="${k.skin}"/>
    <circle cx="92" cy="32" r="5" fill="${C.plum}"/>
    <path d="M73,30 C74,17 92,15 97,27 C103,44 106,72 108,100 L99,102 C97,78 93,56 88,44 C85,38 78,36 73,30Z" fill="${k.veil}" opacity=".95"/>
    <circle cx="76" cy="27" r="1.6" fill="${C.gold}"/>`, `translate(${x},${y}) scale(${s}) translate(-84,-196)`);
}
/* together, holding hands (or raising them for the dance) */
export function couple(x, y, s = 1, raised = false) {
  const h = raised ? [62, 56] : [61, 94];
  return g(groom(34, 196, 1, raised ? [60, 58] : [58, 94]) + bride(84, 196, 1, raised ? [57, 56] : h), `translate(${x},${y}) scale(${s}) translate(-60,-196)`);
}
/* a decorated elephant, facing right, trunk raised */
export function elephant(x, y, s = 1, flip = false, cloth = C.rani) {
  const body = '#8b8fa3', dark = '#6f7389', light = '#a8acbe';
  return g(`<path d="M30,80 L30,116 L41,116 L41,82Z M88,82 L88,116 L99,116 L99,84Z" fill="${dark}"/>
    <path d="M14,52 C10,30 30,14 62,14 C86,14 104,17 116,20 C128,14 142,20 145,34 C147,44 143,54 138,58 L131,62 C125,70 119,74 117,78 L117,118 L103,118 L101,84 C88,88 70,88 54,86 L52,118 L38,118 L36,84 C24,80 16,68 14,52Z" fill="${body}"/>
    <path d="M136,40 C152,32 160,14 156,-2 C155,-8 148,-10 145,-5 C143,-1 147,2 149,0 C152,12 144,26 132,32Z" fill="${body}"/>
    <path d="M14,46 C6,52 4,64 6,72" stroke="${body}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M4,70 l2,8 l3,-7z" fill="${dark}"/>
    <path d="M104,26 C92,30 89,52 97,64 C103,72 114,66 116,56 C118,44 114,30 104,26Z" fill="${dark}"/>
    <path d="M134,52 C140,56 146,58 151,56" stroke="${C.ivory}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <circle cx="125" cy="31" r="2" fill="${C.plum}"/>
    <path d="M34,20 C50,15 80,15 98,20 L100,58 C92,62 86,58 80,62 C74,58 66,62 60,58 C54,62 46,58 40,62 C34,58 30,60 28,56 Z" fill="${cloth}"/>
    <path d="M30,52 C34,58 40,58 40,62 C46,58 54,62 60,58 C66,62 74,58 80,62 C86,58 92,62 100,58" stroke="${C.gold}" stroke-width="2.4" fill="none"/>
    <path d="M44,26 h46 M50,36 h34" stroke="${C.gold}" stroke-width="1.6" stroke-dasharray="3 3"/>
    ${[40, 60, 80, 100].map(t => `<circle cx="${t}" cy="66" r="2.6" fill="${C.marigold}"/>`).join('')}
    <path d="M118,16 C126,12 136,14 140,22 L136,38 C130,36 124,34 120,30Z" fill="${cloth}"/><path d="M120,30 C124,34 130,36 136,38" stroke="${C.gold}" stroke-width="2" fill="none"/><circle cx="130" cy="22" r="3" fill="${C.gold}"/>
    <path d="M38,108 h14 M102,108 h15" stroke="${C.gold}" stroke-width="3"/>
    <path d="M40,116 a3,3 0 0 1 6,0 M104,116 a3,3 0 0 1 6,0" stroke="${light}" stroke-width="1.5" fill="none"/>`,
    `translate(${x},${y}) scale(${flip ? -s : s},${s}) translate(-80,-118)`);
}
export function car(x, y, s = 1) {
  return g(`<ellipse cx="0" cy="3" rx="40" ry="4" fill="rgba(30,30,30,.2)"/>
    <path d="M-38,-4 C-38,-14 -30,-16 -22,-17 L-14,-30 C-12,-33 10,-33 13,-30 L22,-17 C32,-16 38,-12 38,-4 L38,0 L-38,0Z" fill="${C.rani}"/>
    <path d="M-10,-27 L-16,-17 H-1 V-27Z M3,-27 V-17 H18 L12,-27Z" fill="${C.butter}"/>
    <path d="M-38,-6 H38" stroke="${C.ivory}" stroke-width="1.5"/>
    ${heart(-4, -9, .35, C.ivory)}
    <circle cx="-22" cy="0" r="7.5" fill="${C.plum}"/><circle cx="-22" cy="0" r="3" fill="${C.cream}"/><circle cx="22" cy="0" r="7.5" fill="${C.plum}"/><circle cx="22" cy="0" r="3" fill="${C.cream}"/>
    <path d="M-38,-10 C-48,-12 -52,-6 -58,-8" stroke="${C.brown}" stroke-width="1" fill="none"/><rect x="-63" y="-12" width="5" height="7" rx="1" fill="${C.cream}"/><rect x="-56" y="-9" width="4" height="6" rx="1" fill="${C.sand}"/>`, `translate(${x},${y}) scale(${s})`);
}
export function pin(x, y, s = 1) {
  return g(`<ellipse cx="0" cy="2" rx="8" ry="2.5" fill="rgba(40,10,30,.3)"/><path d="M0,0 C-6,-12 -14,-18 -14,-27 a14,14 0 1 1 28,0 c0,9 -8,15 -14,27z" fill="${C.rani}"/><circle cy="-27" r="6" fill="${C.ivory}"/>${heart(0, -27.5, .3, C.rani)}`, `translate(${x},${y}) scale(${s})`);
}
export function lavender(x, y, s, seed) {
  const r = rng(seed), cols = [C.lav, C.lavL, C.lavD, '#b49be6'];
  let out = '';
  for (let k = 0; k < 7; k++) {
    const dx = (k - 3) * 4 + (r() - .5) * 3, h = 46 + r() * 22, lean = (k - 3) * 2.2;
    out += `<path d="M${f(dx * .3)},0 Q${f(dx + lean * .2)},${f(-h * .5)} ${f(dx + lean)},${f(-h)}" stroke="${C.leaf}" stroke-width="1.4" fill="none"/>`;
    for (let j = 0; j < 9; j++) { const t = .55 + j * .05, side = j % 2 ? 1 : -1; out += `<ellipse cx="${f(dx + lean * t + side * 1.6)}" cy="${f(-h * t)}" rx="2" ry="3.3" fill="${cols[(r() * 4) | 0]}" transform="rotate(${side * 28} ${f(dx + lean * t + side * 1.6)} ${f(-h * t)})"/>`; }
  }
  return g(g(out, '', 'sway'), `translate(${x},${y}) scale(${s})`);   // a CSS animation would override the transform attribute, so it goes on an inner group
}
/* rows of lavender running to the horizon */
export function lavRows(y0, rows, seed) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < rows; i++) {
    const y = y0 + i * (14 + i * 5), amp = 3 + i * 1.6, n = 30 - i * 3, fill = [C.lavL, '#b49be6', C.lav, '#8a6bcc', C.lavD][i % 5];
    let d = `M-10,${f(y + 40)} L-10,${f(y)}`; const w = 420 / n;
    for (let j = 0; j < n; j++) d += ` Q${f(-10 + w * j + w / 2)},${f(y - amp * (.8 + r() * .5))} ${f(-10 + w * (j + 1))},${f(y)}`;
    s += `<path d="${d} L410,${f(y + 40)} Z" fill="${fill}"/><path d="M-10,${f(y + 3)} H410" stroke="${C.leaf}" stroke-width="${f(1 + i * .5)}" opacity=".55"/>`;
  }
  return s;
}

/* ---------------- the scenes: each is a list of paper layers, back to front ----------------
   data-t marks a piece Theatre.js animates on its own (data-o is its pivot in scene units). */
const drape = flip => g(`<path d="M0,128 C70,126 92,150 96,176 C98,196 84,214 70,226 C82,262 70,320 44,420 L0,420Z" fill="${C.rani}"/>
  <path d="M0,128 C40,128 60,140 70,156 C60,190 40,250 18,420 L0,420Z" fill="#a3134c"/>
  <path d="M66,218 C76,214 86,220 84,232 C80,240 66,238 64,228Z" fill="${C.gold}"/>
  <path d="M0,124 H120" stroke="${C.gold}" stroke-width="5"/>`, flip ? 'translate(400,0) scale(-1,1)' : '');
const bush = (x, y, s, seed) => {
  const r = rng(seed);
  let o = `<circle cx="0" cy="-14" r="18" fill="${C.leaf}"/><circle cx="-16" cy="-6" r="13" fill="${C.emerald}"/><circle cx="16" cy="-7" r="14" fill="${C.emerald}"/>`;
  for (let i = 0; i < 6; i++) o += marigold((r() - .5) * 36, -10 - r() * 18, 4.5 + r() * 2);
  return g(o, `translate(${x},${y}) scale(${s})`);
};
const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');

export const SCENE_ART = {
  cover: () => [
    cloud(30, 128, 1) + cloud(300, 104, .8) + hills(300, 34, 4, 1, '#f5bfd0') + palace(200, 302, 232, '#ee8fb0', '#fbd5e1'),
    hills(338, 12, 9, 3, C.mint) + cypress(44, 344, 128, C.emerald) + cypress(356, 344, 128, C.emerald) + cypress(84, 344, 92, C.leaf) + cypress(316, 344, 92, C.leaf),
    archFrame(200, 404, 172, 252, C.ivory, C.gold) + garland(110, 196, 110, 400, 0, 26) + garland(290, 196, 290, 400, 0, 26) + toran(108, 292, 168, 3, 12),
    couple(200, 396, 1.02),
    ground(398, '#e9c99a') + bush(28, 412, 1.1, 1) + bush(372, 412, 1.1, 2) + diya(140, 410, 1.1) + diya(260, 410, 1.1)
  ],
  story: () => [
    stars(46, 5, 6, 250) + moon(200, 156, 30),
    hills(296, 24, 4, 7, '#33357a') + hills(320, 14, 6, 8, '#2a2c69'),
    haveli(14, 346, 124, 160, '#e590ad', '#b2507a', C.butter, true) + haveli(262, 346, 124, 146, '#86abd0', '#4f729c', C.butter, true),
    `<path d="M-10,348 Q50,340 100,348 T200,348 T300,348 T410,348 V430 H-10Z" fill="#4a55a6"/><path d="M-10,368 Q50,360 100,368 T200,368 T300,368 T410,368 V430 H-10Z" fill="#3b4594"/>` +
      `<path d="M180,356 h40 M172,372 h56 M186,388 h28" stroke="#fff1c9" stroke-width="3" stroke-linecap="round" opacity=".8"/>` +
      g(diya(180, 380, 1.7), '', 'bob') + g(diya(222, 386, 1.7), '', 'bob2'),
    `<path d="M-10,420 V404 Q20,396 40,404 Q60,394 80,404 L80,420Z M320,420 V404 Q345,394 365,404 Q390,396 410,404 V420Z" fill="#1c1d4d"/>`
  ],
  families: () => [
    sun(320, 112, 28) + cloud(40, 120, .9) + hills(312, 28, 3, 11, '#fbd2b0'),
    `<rect x="-10" y="236" width="420" height="200" fill="#f3a9c0"/>` + range(6, i => archWin(-6 + i * 70, 256, 44, 84, '#fbd6e2')) +
      range(21, i => `<path d="M${-10 + i * 20},236 q10,-10 20,0Z" fill="#f3a9c0"/>`) + bunting(-10, 410, 170, 16, 15, [C.marigold, C.rani, C.yellow, C.teal, C.pink]),
    ground(360, '#e7c08e') + elephant(108, 378, .98, false, C.rani) + elephant(292, 378, .98, true, C.peacock),
    `<g data-t="families.heart" data-o="200 232">${heart(200, 232, 2.2, C.pink)}${heart(200, 232, 1.3, C.blush)}</g>`,
    bush(30, 414, 1.05, 3) + bush(370, 414, 1.05, 4) + range(9, i => marigold(80 + i * 30, 412 - (i % 2) * 4, 6))
  ],
  haldi: () => [
    `<g class="spin-slow">${sun(200, 150, 42)}</g>` + cloud(30, 168, .8) + cloud(318, 150, .9),
    lavRows(250, 5, 3),
    bunting(-10, 410, 196, 18, 15, [C.yellow, C.lav, C.pink, C.marigold, C.lavL]),
    lavender(30, 424, 1.6, 1) + lavender(370, 424, 1.6, 2) + lavender(70, 426, 1.1, 3) + lavender(330, 426, 1.1, 4),
    `<g data-t="haldi.urli" data-o="200 366">${urli(200, 366, 1.75)}</g>`
  ],
  sangeet: () => [
    stars(36, 9, 6, 210) + lights(-10, 410, 128, 26, 16) + lights(-10, 410, 162, 18, 14, [C.blush, C.yellow, C.lavL, C.white]),
    `<rect x="-10" y="238" width="420" height="120" fill="#4a2477"/><rect x="-10" y="340" width="420" height="90" fill="#33185a"/><path d="M-10,340 H410" stroke="${C.gold}" stroke-width="3"/>` +
      `<g data-t="sangeet.rings" data-o="200 150"><path d="M186,150 L190,196 M214,150 L210,196" stroke="${C.gold}" stroke-width="1.2"/>${rings(200, 206, 1.6)}</g>`,
    drape(false) + drape(true),
    couple(200, 384, .94, true) + note(78, 262, 1.3) + note(326, 244, 1.4, C.blush) + note(112, 214, 1, C.lavL) + note(290, 298, 1, C.butter),
    dhol(86, 394, 1.15) + dhol(314, 394, 1.15, C.marigold)
  ],
  vivah: () => [
    stars(30, 13, 6, 190) + moon(330, 96, 18),
    `<rect x="78" y="196" width="14" height="190" fill="#c98aa0"/><rect x="308" y="196" width="14" height="190" fill="#c98aa0"/>` + dome(200, 176, 60, '#a3134c') +
      `<rect x="60" y="170" width="280" height="12" fill="${C.gold}"/>` + range(14, i => `<path d="M${60 + i * 20},182 q10,14 20,0Z" fill="${C.rani}"/>`),
    `<path d="M60,190 Q130,250 200,196 Q270,250 340,190 V206 Q270,268 200,214 Q130,268 60,206Z" fill="${C.blush}"/>` +
      `<rect x="48" y="176" width="20" height="230" fill="${C.ivory}"/><rect x="332" y="176" width="20" height="230" fill="${C.ivory}"/>` +
      [212, 260, 330, 380].map(y => `<rect x="46" y="${y}" width="24" height="6" fill="${C.gold}"/><rect x="330" y="${y}" width="24" height="6" fill="${C.gold}"/>`).join('') +
      garland(76, 186, 76, 400, 0, 26) + garland(324, 186, 324, 400, 0, 26) + toran(60, 340, 168, 4, 10),
    `<path d="M132,300 C150,350 250,350 268,300" stroke="${C.marigold}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      groom(132, 396, .92, [50, 104]) + bride(268, 396, .92, [70, 104]) + `<g data-t="vivah.fire" data-o="200 390">${kund(200, 376, 1.35)}</g>`,
    ground(402, '#5a1230') + [40, 100, 300, 360].map(x => diya(x, 412, 1.1)).join('') + range(8, i => `<circle cx="${130 + i * 20}" cy="${414 - (i % 2) * 3}" r="3.4" fill="${i % 2 ? C.marigold : C.rani}"/>`)
  ],
  venue: () => [
    cloud(40, 150, .9) + cloud(300, 136, .75) + hills(284, 22, 3, 17, '#b5dcae'),
    palace(272, 282, 104, '#fff8ec', '#ecd2a6') + `<g data-t="venue.pin" data-o="272 204">${pin(272, 204, 1.4)}</g>`,
    hills(318, 18, 4, 18, '#86c48f') + tree(70, 318, 18, C.leaf) + tree(120, 314, 14, '#5aa86e') + tree(360, 316, 16, C.leaf),
    `<path d="M10,440 C90,394 270,390 228,346 C204,320 228,300 262,286" stroke="#e3d2ae" stroke-width="24" fill="none" stroke-linecap="round"/>` +
      `<path d="M10,440 C90,394 270,390 228,346 C204,320 228,300 262,286" stroke="${C.ivory}" stroke-width="1.6" stroke-dasharray="6 7" fill="none"/>` +
      hills(372, 18, 5, 19, '#5aa86e') + tree(40, 380, 20, C.emerald) + tree(372, 384, 22, C.emerald) +
      `<g transform="translate(296,352)"><rect x="-1.5" y="0" width="3" height="20" fill="${C.brown}"/><rect x="-34" y="-14" width="68" height="18" rx="3" fill="${C.ivory}"/><text x="0" y="-2" text-anchor="middle" font-family="Cinzel, serif" font-size="7.4" font-weight="600" fill="${C.emerald}">GREEN VIEW</text></g>`,
    `<g data-t="venue.car">${car(0, 0, 1)}</g>`
  ],
  finale: () => [
    cloud(26, 150, .9) + cloud(310, 128, .8) + hills(326, 26, 4, 21, '#f6bfd0'),
    archFrame(200, 404, 176, 240, C.ivory, C.gold) + garland(108, 208, 108, 400, 0, 25) + garland(292, 208, 292, 400, 0, 25) + toran(106, 294, 180, 3, 12),
    couple(200, 396, 1),
    ground(398, '#f2d2a6') + bush(30, 414, 1.1, 5) + bush(370, 414, 1.1, 6) + diya(136, 410, 1.1) + diya(264, 410, 1.1)
  ]
};

/* the palace doors on the opening page (each door is 50 × 160) */
export function door(side) {
  let s = `<rect width="50" height="160" fill="${C.teal}"/><rect x="3" y="3" width="44" height="154" fill="none" stroke="${C.gold}" stroke-width="1.4"/>`;
  [[7, 22, 36, 44], [7, 72, 36, 36], [7, 114, 36, 38]].forEach(([x, y, w, h]) => { s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#0f6264"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="2" fill="none" stroke="${C.gold}" stroke-width=".8"/>`; });
  for (let y = 12; y < 158; y += 12) for (const x of [5, 45]) s += `<circle cx="${x}" cy="${y}" r="1.4" fill="${C.gold}"/>`;
  s += marigold(25, 44, 6);
  const kx = side === 'l' ? 44 : 6;
  s += `<circle cx="${kx}" cy="96" r="5" fill="none" stroke="${C.gold}" stroke-width="1.6"/><circle cx="${kx}" cy="91" r="1.8" fill="${C.gold}"/>`;
  return `<svg viewBox="0 0 50 160" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
}
export const DOOR_FRAME = `<svg viewBox="0 0 120 180" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0,180 V58 C0,20 40,4 60,0 C80,4 120,20 120,58 V180 Z M10,180 V63.6 A50,49.6 0 0 1 110,63.6 V180 Z" fill="${C.maroon}" fill-rule="evenodd"/>
  <path d="M5,180 V60 C5,24 42,9 60,5 C78,9 115,24 115,60 V180" fill="none" stroke="${C.gold}" stroke-width="1.6"/>
  ${garland(14, 26, 106, 26, 16, 18, 3.2)}
</svg>`;
