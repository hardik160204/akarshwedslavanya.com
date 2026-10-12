/* Builds the HTML for every scene from CONFIG. Pure functions (no browser APIs),
   so it runs at build time and the page arrives as ready-made HTML. */

export const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* colour of the thread in each world */
export const TC = { paper: '#b3121f', haldi: '#b3121f', mehendi: '#9c1b1b', sangeet: '#f2a33a', wedding: '#e9b44c', date: '#e9b44c', venue: '#e9b44c', rsvp: '#e9b44c' };

const KNOT = `<svg class="knot" viewBox="0 0 200 100" aria-hidden="true">
  <path class="draw" pathLength="1" d="M100,50 C130,8 192,8 192,50 C192,92 130,92 100,50 C70,8 8,8 8,50 C8,92 70,92 100,50"/>
  <path class="draw thin" pathLength="1" style="--d:1.1" d="M100,56 C130,14 186,14 186,56 C186,98 130,98 100,56 C70,14 14,14 14,56 C14,98 70,98 100,56"/></svg>`;

function sNames(C) {
  return { world: 'paper', html: `
<section class="sec paper" data-world="paper"><div class="c names">
  <p class="lbl r" style="--d:.1">${E(C.kicker)}</p>
  <div class="nmblk"><h1 class="nm disp mask" style="--d:.2">${E(C.names[0].en)}</h1><p class="hi nmhi r" style="--d:.9">${E(C.names[0].hi)}</p></div>
  <div class="knotwrap" style="--d:.9">${KNOT}</div>
  <div class="nmblk right"><h2 class="nm disp mask fr" style="--d:.5">${E(C.names[1].en)}</h2><p class="hi nmhi r" style="--d:1.2">${E(C.names[1].hi)}</p></div>
  <p class="tagline r" style="--d:2.6">${E(C.tagline)}</p>
</div><div class="hint" aria-hidden="true"><span>scroll</span><i></i></div></section>` };
}

function sInvite(C) {
  const en = E(C.inviteEn).replace(/\*(.+?)\*/g, '<span class="u">$1</span>');
  return { world: 'paper', html: `
<section class="sec paper" data-world="paper"><div class="c pad invite">
  <p class="hi r" style="--d:.1">${E(C.inviteHi)}</p>
  <p class="en r" style="--d:.45">${en}</p>
  <p class="fam r" style="--d:1.1">${E(C.families)}</p>
</div></section>` };
}

function vine() {
  let h = `<path class="draw" pathLength="1" d="M50,-2 C66,18 34,38 50,58 S66,98 50,118 S34,158 50,178 S66,198 50,202"/>`;
  for (let k = 0; k < 9; k++) {
    const y = 12 + k * 21, x = 50 + 8 * Math.sin(2 * Math.PI * (y + 2) / 120), s = k % 2 ? 1 : -1, d = (.5 + k * .18).toFixed(2);
    h += `<path class="draw" pathLength="1" style="--d:${d}" d="M${x.toFixed(1)},${y} c${s * 10},-3 ${s * 17},-11 ${s * 18},-22 c${-s * 11},3 ${-s * 17},11 ${-s * 18},22z"/>`;
    h += `<path class="draw" pathLength="1" style="--d:${(+d + .2).toFixed(2)}" d="M${x.toFixed(1)},${y} q${s * 8},-4 ${s * 13},-14"/>`;
    h += `<circle class="fill pop" style="--d:${(+d + .6).toFixed(2)}" cx="${(x - s * 5).toFixed(1)}" cy="${y + 8}" r="1.5"/>`;
  }
  return `<svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${h}</svg>`;
}
function wave() {
  let d = 'M0,50 Q25,8 50,50';
  for (let i = 1; i <= 7; i++) d += ` T${50 + i * 50},50`;
  return `<svg viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>`;
}
function arch() {
  const pts = [];
  const P = (t, a, b, c, d) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([P(t, 8, 8, 92, 92), P(t, 52, 12, 12, 52)]); }
  for (let y = 60; y <= 118; y += 9) { pts.push([8, y]); pts.push([92, y]); }
  const dots = pts.map((p, i) => `<circle class="pop" style="--d:${(1 + i * .07).toFixed(2)}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="1.9"/>`).join('');
  return `<svg viewBox="0 0 100 120" aria-hidden="true">
   <path class="draw" pathLength="1" style="--d:.3" d="M8,120 V52 C8,12 92,12 92,52 V120"/>
   <path class="draw" pathLength="1" style="--d:.7" d="M17,120 V54 C17,24 83,24 83,54 V120"/>${dots}</svg>`;
}
const dotPos = [[8, 10, 9], [84, 7, 6], [91, 30, 12], [5, 70, 7], [86, 80, 10], [20, 93, 6], [60, 95, 8], [42, 5, 5]];
function decor(w) {
  if (w === 'haldi') return `<div class="bg"><div class="stain"></div>${dotPos.map((d, i) => `<i class="dot" style="left:${d[0]}%;top:${d[1]}%;width:${d[2]}cqw;height:${d[2]}cqw;--d:${(.7 + i * .12).toFixed(2)}"></i>`).join('')}</div>`;
  if (w === 'mehendi') return `<div class="bg"><div class="vine">${vine()}</div><div class="vine rt">${vine()}</div></div>`;
  if (w === 'sangeet') return `<div class="bg"><div class="spot"></div><div class="waves"><div class="w1">${wave()}</div><div class="w2">${wave()}</div><div class="w3">${wave()}</div></div></div>`;
  if (w === 'wedding') return `<div class="bg"><div class="arch">${arch()}</div></div>`;
  return '';
}
function sEvent(e) {
  const w = ['haldi', 'mehendi', 'sangeet', 'wedding'].includes(e.world) ? e.world : 'haldi';
  const cls = w === 'wedding' ? 'wedding red' : w;
  return { world: w, html: `
<section class="sec ev ${cls}" data-world="${w}">${decor(w)}<div class="c">
  <p class="when r" style="--d:.2">${E(e.day)}</p>
  <h2 class="title disp mask" style="--d:.3">${E(e.hi)}</h2>
  <p class="sub r" style="--d:.9">${E(e.en)}</p>
  <div class="meta r" style="--d:1.2"><div>${E(e.time)}</div><span>${E(e.place)}</span></div>
  <p class="note r" style="--d:1.5">${E(e.note)}</p>
</div></section>` };
}

function sDate(C) {
  return { world: 'date', html: `
<section class="sec date red" data-world="date"><div class="c">
  <p class="lbl r" style="--d:.1">Save the date</p>
  <div class="big disp mask" style="--d:.2">${E(C.date.day)}</div>
  <p class="mon r" style="--d:.9">${E(C.date.month)}</p>
  <p class="wk r" style="--d:1.1">${E(C.date.weekday)}</p>
  <svg class="uline" viewBox="0 0 200 16" aria-hidden="true"><path class="draw" pathLength="1" style="--d:1.2" d="M4,9 C40,2 60,14 100,8 S160,3 196,9"/></svg>
  <div class="count r" id="count" style="--d:1.6" aria-label="Countdown to the wedding">
    <div><b id="cd">0</b><small>days</small></div><div><b id="ch">0</b><small>hours</small></div>
    <div><b id="cm">0</b><small>minutes</small></div><div><b id="cs">0</b><small>seconds</small></div>
  </div>
</div></section>` };
}

function sVenue(C) {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.venue.mapsQuery)}`;
  const cal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(C.calendar.title)}&dates=${C.calendar.start}/${C.calendar.end}&location=${encodeURIComponent(C.venue.name + ', ' + C.venue.address)}`;
  return { world: 'venue', html: `
<section class="sec venue red" data-world="venue"><div class="c">
  <p class="lbl r" style="--d:.1">Find your way to</p>
  <h2 class="disp mask" style="--d:.2">${E(C.venue.name)}</h2>
  <div class="road" aria-hidden="true">
    <svg viewBox="0 0 100 60"><path class="draw" pathLength="1" style="--d:.6" d="M-4,56 C22,56 18,38 42,40 S70,46 66,26 S62,12 80,8"/>
    <path class="dash" d="M-4,56 C22,56 18,38 42,40 S70,46 66,26 S62,12 80,8"/></svg>
    <div class="pin"><svg viewBox="-16 -32 32 36"><path fill="#e9b44c" d="M0,2 C-8,-12 -14,-18 -14,-25 a14,14 0 1 1 28,0 c0,7 -6,13 -14,27z"/><circle cx="0" cy="-25" r="5.5" fill="#5a0910"/></svg></div>
  </div>
  <p class="addr r" style="--d:1.6">${E(C.venue.address)}</p>
  <div class="btns r" style="--d:1.9"><a class="btn solid" href="${maps}" target="_blank" rel="noopener">Open in Maps</a><a class="btn" href="${cal}" target="_blank" rel="noopener">Add to calendar</a></div>
</div></section>` };
}

function sRsvp(C) {
  const wa = `https://wa.me/${E(C.rsvp.whatsapp)}?text=${encodeURIComponent(C.rsvp.message)}`;
  return { world: 'rsvp', html: `
<section class="sec rsvp red" data-world="rsvp"><div class="c">
  <div class="knotwrap" style="--d:.3">${KNOT}</div>
  <p class="hi r" style="--d:1.2">${E(C.closingHi)}</p>
  <h2 class="r" style="--d:1.4">${E(C.closingEn)}</h2>
  <p class="by r" style="--d:1.6">${E(C.rsvp.by)}</p>
  <div class="btns r" style="--d:1.8"><a class="btn solid" href="${wa}" target="_blank" rel="noopener">RSVP on WhatsApp</a><button class="btn" id="share" type="button">Share this invitation</button></div>
  <p class="fam r" style="--d:2.1">With love, ${E(C.families)}</p>
</div></section>` };
}

/* all sections + the thread overlay, as one HTML string */
export function sceneHtml(C) {
  const scenes = [sNames(C), sInvite(C), ...C.events.map(sEvent), sDate(C), sVenue(C), sRsvp(C)];
  return scenes.map(s => s.html).join('') +
    `<svg class="thread" id="thread" aria-hidden="true"><defs><linearGradient id="tg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1"></linearGradient></defs>
  <path id="ghost" fill="none" stroke="url(#tg)" stroke-opacity=".22" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/>
  <path id="tp" fill="none" stroke="url(#tg)" stroke-width="3.4" stroke-linecap="round"/>
  <circle id="head" r="6" fill="url(#tg)"/></svg>`;
}
