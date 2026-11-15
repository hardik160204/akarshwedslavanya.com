/* Builds the HTML for the palace doors, every storybook page, and the story header from CONFIG.
   Pure functions (no browser APIs), so the page arrives as ready-made HTML.
   data-t="sheet.object" binds an element to its Theatre.js object (lib/timeline.js). */
import { SCENES } from './timeline.js';
import { VB, SCENE_ART, door, DOOR_FRAME, diya } from './art.js';

export const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const U = encodeURIComponent;
const mark = s => E(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

const calUrl = (C, e) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${U(`${C.names[0].en} & ${C.names[1].en} · ${e.calTitle}`)}&dates=${e.cal[0]}/${e.cal[1]}&ctz=Asia/Kolkata&location=${U(`${C.venue.name}, ${C.venue.address}`)}`;
const mapsUrl = C => `https://www.google.com/maps/search/?api=1&query=${U(C.venue.mapsQuery)}`;

/* one illustration = a stack of paper layers, each its own <svg> so they pop up independently */
const ill = id => `<div class="ill" aria-hidden="true">${SCENE_ART[id]().map((l, i) =>
  `<svg class="ly" data-t="${id}.l${i}" viewBox="${VB}" preserveAspectRatio="xMidYMax slice">${l}</svg>`).join('')}</div>`;
const page = (i, tone, label, txt) =>
  `<section class="slide sl-${SCENES[i]} ${tone}" data-t="world.s${i}" aria-label="${E(label)}">${ill(SCENES[i])}<div class="txt">${txt}</div></section>`;

function chapter(id, C, e, title) {
  return `<p class="label" data-t="${id}.c">${E(e.chapter)} <span class="emo">${E(e.emoji)}</span></p>
    <p class="when" data-t="${id}.d">${E(e.date)}</p>
    ${title}
    ${e.sub ? `<p class="body" data-t="${id}.s">${E(e.sub)}</p>` : ''}
    <div class="chip" data-t="${id}.i"><b>${E(e.time)}</b><span>${E(C.venue.name)}</span></div>
    <p class="note" data-t="${id}.n">${E(e.note)}</p>
    <a class="cal" data-t="${id}.a" data-ev="${C.events.indexOf(e)}" href="${calUrl(C, e)}" target="_blank" rel="noopener">＋ Add to calendar</a>`;
}

function pages(C) {
  const [a, b] = C.names, [h, s, v] = C.events, [p1, p2] = C.story;
  const wa = C.rsvp.whatsapp ? `<a class="btn solid" href="https://wa.me/${E(C.rsvp.whatsapp)}?text=${U(C.rsvp.message)}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : '';
  return [
    page(0, 'day', `${a.en} and ${b.en}`, `
      <p class="bless hi" data-t="cover.g">${E(C.blessing)}</p>
      <p class="kick" data-t="cover.k">${E(C.kicker)}</p>
      <h1 class="names"><span class="nm" data-t="cover.n1" data-fx="wipe">${E(a.en)}</span><span class="amp" data-t="cover.amp">weds</span><span class="nm" data-t="cover.n2" data-fx="wipe">${E(b.en)}</span></h1>
      <p class="hinames hi" data-t="cover.hn">${E(a.hi)} <span>❤</span> ${E(b.hi)}</p>
      <p class="chip" data-t="cover.dt"><b>${E(C.dates)}</b><span>${E(C.city)}</span></p>`),
    page(1, 'night', 'Once upon a time', `
      <p class="label" data-t="story.c">Our story</p>
      <h2 class="ttl" data-t="story.t" data-fx="wipe">${mark(p1.title)}</h2>
      <p class="body" data-t="story.s">${mark(p1.text)}</p>`),
    page(2, 'day', 'Two families', `
      <p class="label" data-t="families.c">And then…</p>
      <h2 class="ttl" data-t="families.t" data-fx="wipe">${mark(p2.title)}</h2>
      <p class="body" data-t="families.s">${mark(p2.text)}</p>`),
    page(3, 'day', h.title, chapter('haldi', C, h, `<h2 class="ttl" data-t="haldi.t" data-fx="wipe">${E(h.title)}</h2>`)),
    page(4, 'night', `${s.title} and ${s.title2}`, chapter('sangeet', C, s, `<h2 class="ttl" data-t="sangeet.t" data-fx="wipe">${E(s.title)}</h2>
      <p class="amp" data-t="sangeet.amp">&amp;</p><h2 class="ttl t2" data-t="sangeet.t2" data-fx="wipe">${E(s.title2)}</h2>`)),
    page(5, 'night', v.title2, chapter('vivah', C, v, `<h2 class="ttl hi" data-t="vivah.t" data-fx="wipe">${E(v.title)}</h2><p class="body caps" data-t="vivah.s">${E(v.title2)}</p>`)),
    page(6, 'day', 'The venue', `
      <p class="label" data-t="venue.c">The Venue</p>
      <p class="when" data-t="venue.d">${E(C.venue.line)}</p>
      <h2 class="ttl" data-t="venue.t" data-fx="wipe">${E(C.venue.name)}</h2>
      <p class="body" data-t="venue.ad">${E(C.venue.address)}</p>
      <div class="btns" data-t="venue.b"><a class="btn solid" href="${mapsUrl(C)}" target="_blank" rel="noopener">Open in Google Maps</a></div>`),
    page(7, 'day', 'With love', `
      <p class="fhi hi" data-t="finale.hi">${E(C.closingHi)}</p>
      <h2 class="ttl sm" data-t="finale.t">${E(C.closingEn)}</h2>
      <div class="count" id="count" data-t="finale.cnt" role="timer" aria-label="Countdown to the wedding">
        <div><b id="cd">0</b><small>days</small></div><div><b id="ch">0</b><small>hours</small></div>
        <div><b id="cm">0</b><small>mins</small></div><div><b id="cs">0</b><small>secs</small></div>
      </div>
      <p class="sign" data-t="finale.sg">${E(C.signoff)}</p>
      <p class="nm sm" data-t="finale.nm" data-fx="wipe">${E(a.en)} <span class="amp">&amp;</span> ${E(b.en)}</p>
      <p class="toguest" id="toguest" data-t="finale.g"></p>
      <div class="btns" data-t="finale.b">${wa}<button class="btn ${wa ? '' : 'solid'}" id="share" type="button">Share the invitation</button><button class="btn ghost" id="replay" type="button">↺ Read the story again</button></div>`)
  ].join('');
}

function gate(C) {
  return `
<div class="gate" id="gate" data-t="intro.gate">
  <div class="g-txt" data-t="intro.txt">
    <p class="g-bless hi">${E(C.blessing)}</p>
    <p class="g-dear"><span id="dear"></span>${E(C.gateLine)}</p>
  </div>
  <div class="g-door" data-t="intro.door">
    <div class="g-way"><i class="g-in"></i><div class="g-leaf dl" data-t="intro.dl">${door('l')}</div><div class="g-leaf dr" data-t="intro.dr">${door('r')}</div></div>
    <div class="g-frame">${DOOR_FRAME}</div>
  </div>
  <div class="g-diyas" aria-hidden="true"><svg viewBox="-16 -18 32 26">${diya(0, 0, 1.2)}</svg><svg viewBox="-16 -18 32 26">${diya(0, 0, 1.2)}</svg></div>
  <button class="g-cta" id="open" type="button" data-t="intro.txt">Tap to open the doors</button>
  <p class="g-sound" data-t="intro.txt"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>Best with sound on</p>
</div>`;
}

/* everything inside the stage, as one HTML string */
export function sceneHtml(C) {
  const [a, b] = C.names;
  return `
<button class="zone zprev" id="zprev" type="button" aria-label="Previous page"></button>
<button class="zone znext" id="znext" type="button" aria-label="Next page"></button>
${pages(C)}
<canvas class="fx" id="fx" aria-hidden="true"></canvas>
<div class="paper" aria-hidden="true"></div>
<div class="hud">
  <div class="bars" id="bars" aria-hidden="true">${'<i><b></b></i>'.repeat(SCENES.length)}</div>
  <div class="hrow">
    <span class="av" aria-hidden="true"><span>${E(a.en[0])}<i>&amp;</i>${E(b.en[0])}</span></span>
    <span class="who"><b>${E(a.en)} &amp; ${E(b.en)}</b><small>${E(C.dates)}</small></span>
    <button class="hbtn snd" id="snd" type="button" aria-label="Mute music" aria-pressed="false"><span class="eqi" aria-hidden="true"><i></i><i></i><i></i><i></i></span><svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.6 3 2.7-2.7-1.1-1.1-2.7 2.7-2.7-2.7-1.1 1.1 2.7 2.7-2.7 2.7 1.1 1.1 2.7-2.7 2.7 2.7 1.1-1.1z"/></svg></button>
    <button class="hbtn play" id="play" type="button" aria-label="Pause the story">
      <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>
      <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/></svg>
    </button>
  </div>
</div>
${gate(C)}
<div class="toast" id="toast" role="status"></div>`;
}
