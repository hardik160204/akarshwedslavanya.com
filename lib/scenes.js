/* Builds the whole invitation page from CONFIG: the peacock doors, then a royal scroll of sections.
   Pure functions (no browser APIs), so the page arrives as ready-made HTML.
   data-t="sheet.object" binds an element to its Theatre.js object (lib/timeline.js). */
import { DEFS, PALACE_VB, POND_VB, palaceScene, pondScene, doorFrame, doorLeaf, bellsToran, kalash, lantern, mandala, lotusFrame, venueGate } from './art.js';

export const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const U = encodeURIComponent;
const calUrl = (C, e) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${U(`${C.names[0].en} & ${C.names[1].en} · ${e.calTitle}`)}&dates=${e.cal[0]}/${e.cal[1]}&ctz=Asia/Kolkata&location=${U(`${C.venue.name}, ${C.venue.address}`)}`;
const mapsUrl = C => `https://www.google.com/maps/search/?api=1&query=${U(C.venue.mapsQuery)}`;
const layers = (list, vb, sheet, cls) => list.map((l, i) => `<svg class="${cls}" data-t="${sheet}.l${i}" viewBox="${vb}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${l}</svg>`).join('');
const ROD = `<svg class="rod" viewBox="0 0 320 44" preserveAspectRatio="none" aria-hidden="true"><path d="M60,6 L28,44 M260,6 L292,44" stroke="#b98023" stroke-width="2"/><circle cx="160" cy="6" r="5" fill="url(#gGold)"/><path d="M160,6 L60,6 M160,6 L260,6" stroke="#b98023" stroke-width="1.6"/><rect x="40" y="2" width="240" height="8" rx="4" fill="url(#gGoldH)"/><circle cx="38" cy="6" r="6" fill="url(#gGold)"/><circle cx="282" cy="6" r="6" fill="url(#gGold)"/></svg>`;

function gate(C) {
  return `
<div class="gate" id="gate" data-t="intro.gate">
  <div class="g-txt" data-t="intro.txt">
    <p class="g-bless hi">${E(C.blessing)}</p>
    <p class="g-dear"><span id="dear"></span>${E(C.gateLine)}</p>
  </div>
  <div class="g-door" data-t="intro.door">
    <div class="g-way"><i class="g-in"></i><div class="g-leaf dl" data-t="intro.dl">${doorLeaf('l')}</div><div class="g-leaf dr" data-t="intro.dr">${doorLeaf('r')}</div></div>
    <div class="g-frame">${doorFrame()}</div>
  </div>
  <button class="g-cta" id="open" type="button" data-t="intro.txt">Tap to open the doors</button>
  <p class="g-sound" data-t="intro.txt"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>Best with sound on</p>
</div>`;
}

function page(C) {
  const [a, b] = C.names, wd = C.weddingDay, vivah = C.events[2];
  const banner = (e, i) => `
    <article class="banner" data-t="fest.b${i}"><div class="swing" style="--d:${i * .7}s">${ROD}
      <div class="bn">
        <p class="bn-ch">${E(e.chapter)} <span class="emo">${E(e.emoji)}</span></p>
        ${e.hi ? `<p class="bn-hi hi">${E(e.hi)}</p>` : ''}
        <h3 class="bn-t">${E(e.title)}</h3>
        <p class="bn-s">${E(e.sub)}</p>
        <div class="bn-when"><span>${E(e.date)}</span><b>${E(e.time)}</b></div>
        <p class="bn-v">${E(C.venue.name)}, ${E(C.city)}</p>
        ${e.note ? `<p class="bn-n">${E(e.note)}</p>` : ''}
        <a class="bn-cal cal" data-ev="${i}" href="${calUrl(C, e)}" target="_blank" rel="noopener">＋ Add to calendar</a>
      </div><i class="tassel" aria-hidden="true"></i></div>
    </article>`;
  return `
<section class="hero" data-sec="hero" aria-label="${E(a.en)} and ${E(b.en)}">
  <div class="h-art">${layers(palaceScene(), PALACE_VB, 'hero', 'hl')}</div>
  <div class="h-bells" data-t="hero.bells">${bellsToran()}</div>
  <div class="h-txt">
    <p class="bless hi" data-t="hero.g">${E(C.blessing)}</p>
    <p class="kick" data-t="hero.k">${E(C.kicker)}</p>
    <h1 class="names"><span class="nm" data-t="hero.n1" data-fx="wipe">${E(a.en)}</span><span class="amp" data-t="hero.amp">&amp;</span><span class="nm" data-t="hero.n2" data-fx="wipe">${E(b.en)}</span></h1>
    <p class="hinames hi" data-t="hero.hn">${E(a.hi)} <span>❤</span> ${E(b.hi)}</p>
    <p class="hdate" data-t="hero.dt">${E(C.dates)} · ${E(C.city)}</p>
  </div>
  <p class="cue" data-t="hero.cue" aria-hidden="true"><span>Scroll</span><i></i></p>
</section>

<section class="sec invite" data-sec="invite" aria-label="Invitation">
  <div class="mandala m-r" aria-hidden="true">${mandala()}</div>
  <div class="arch-panel" data-t="invite.panel">
    <div class="kalash" data-t="invite.i0">${kalash(1)}</div>
    <p class="shloka hi" data-t="invite.i1">${E(C.shloka).replace('\n', '<br>')}</p>
    <i class="divider" data-t="invite.i2" aria-hidden="true"></i>
    <p class="body" data-t="invite.i3">${E(C.inviteLine)}</p>
    <p class="nm2" data-t="invite.i4">${E(a.en)}</p>
    <p class="amp2" data-t="invite.i5">&amp;</p>
    <p class="nm2" data-t="invite.i6">${E(b.en)}</p>
  </div>
</section>

<section class="sec date" data-sec="date" aria-label="A date to remember">
  <h2 class="cap" data-t="date.t">A Date to Remember</h2>
  <div class="hearts">
    ${[['Day', wd.day], ['Month', wd.month], ['Year', wd.year]].map(([l, v], i) => `<button class="heart" type="button" data-t="date.h${i}" aria-label="Scratch to reveal the ${l.toLowerCase()}: ${E(v)}"><span class="hv"><small>${l}</small><b>${E(v)}</b></span><canvas aria-hidden="true"></canvas></button>`).join('')}
  </div>
  <p class="hint" data-t="date.i0">Scratch the hearts to reveal</p>
  <p class="body" data-t="date.i1">${E(C.dateLine)}</p>
  <a class="pill cal" data-t="date.i2" data-ev="2" href="${calUrl(C, vivah)}" target="_blank" rel="noopener">＋ Add to calendar</a>
</section>

<section class="sec count" data-sec="count" aria-label="Countdown">
  <h2 class="script-t" data-t="count.t">Counting the moments</h2>
  <div class="tiles" id="count" role="timer" aria-label="Countdown to the wedding">
    ${['days', 'hours', 'minutes', 'seconds'].map((l, i) => `<div class="tile t${i}" data-t="count.c${i}"><b id="c${l[0]}">0</b><small>${l}</small></div>`).join('')}
  </div>
</section>

<section class="sec fest" data-sec="fest" aria-label="The celebrations">
  <div class="lanterns" data-t="fest.ln" aria-hidden="true"><span>${lantern(70)}</span><span>${lantern(110)}</span></div>
  <p class="script-sub" data-t="fest.t0">Stages of celebration</p>
  <h2 class="cap big" data-t="fest.t1">The Royal Festivities</h2>
  ${C.events.map(banner).join('')}
</section>

<section class="sec meet" data-sec="meet" aria-label="Meet the bride and groom">
  <h2 class="script-t" data-t="meet.t">Meet the Bride &amp; Groom</h2>
  <div class="frame" data-t="meet.fr">${lotusFrame()}
    <div class="fr-in">
      <div class="pair">
        <div class="who" data-t="meet.i0"><span class="medal">${E(a.en[0])}</span><b>${E(a.en)}</b><span class="hi">${E(a.hi)}</span><em>The Groom</em></div>
        <div class="who" data-t="meet.i1"><span class="medal">${E(b.en[0])}</span><b>${E(b.en)}</b><span class="hi">${E(b.hi)}</span><em>The Bride</em></div>
      </div>
      <p class="body" data-t="meet.i2">${E(C.meetLine)}</p>
      <p class="sig" data-t="meet.i3">${E(a.en)} &amp; ${E(b.en)}</p>
    </div>
  </div>
</section>

<section class="sec venue" data-sec="venue" aria-label="The venue">
  <p class="script-sub" data-t="venue.t0">${E(C.venue.line)}</p>
  <h2 class="cap big" data-t="venue.t1">The Venue</h2>
  <div class="v-art" data-t="venue.art">${venueGate()}</div>
  <h3 class="v-name" data-t="venue.i0">${E(C.venue.name)}</h3>
  <p class="body" data-t="venue.i1">${E(C.venue.address)}</p>
  <a class="btn" data-t="venue.i2" href="${mapsUrl(C)}" target="_blank" rel="noopener">Get Directions</a>
</section>

<section class="sec rsvp" data-sec="rsvp" aria-label="RSVP">
  <div class="mandala m-l" aria-hidden="true">${mandala()}</div>
  <form class="card" id="rsvp" data-t="rsvp.card" novalidate>
    <p class="r-title" data-t="rsvp.t">Will you join us?</p>
    <p class="r-sub">Kindly let us know, with all your love</p>
    <label class="fld">Your name<input name="name" required autocomplete="name" maxlength="60"></label>
    <label class="fld">Phone<span class="ph"><span>+91</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="14"></span></label>
    <fieldset class="fld"><legend>Which celebrations will you attend?</legend><div class="chips">${C.events.map(e => `<label class="chip"><input type="checkbox" name="ev" value="${E(e.short)}" checked><span>${E(e.short)}</span></label>`).join('')}</div></fieldset>
    <fieldset class="fld"><legend>Team Bride or Team Groom?</legend><div class="chips">${[`Team ${b.en}`, `Team ${a.en}`, 'Team Both'].map((t, i) => `<label class="chip"><input type="radio" name="team" value="${E(t)}"${i === 2 ? ' checked' : ''}><span>${E(t)}</span></label>`).join('')}</div></fieldset>
    <div class="fld"><span class="lbl">How many of you?</span><span class="stepper"><button type="button" data-d="-1" aria-label="Fewer guests">−</button><output id="guests" aria-live="polite">1</output><button type="button" data-d="1" aria-label="More guests">+</button></span></div>
    <label class="fld">A little note for us<textarea name="note" rows="3" maxlength="400" placeholder="Share a wish, a memory, or just say hi!"></textarea></label>
    <p class="err" id="rsvp-err" role="alert"></p>
    <button class="btn gold" type="submit">Send your wishes</button>
  </form>
</section>

<section class="sec tag" data-sec="tag" aria-label="Our hashtag">
  <h2 class="cap" data-t="tag.t">Our Hashtag</h2>
  <button class="hash" id="hash" type="button" data-t="tag.h">${E(C.hashtag)}</button>
  <p class="hint">Tap to copy &amp; use it in all your posts</p>
</section>

<footer class="sec end" data-sec="end" aria-label="With love">
  <p class="fhi hi" data-t="end.i0">${E(C.closingHi)}</p>
  <h2 class="script-t" data-t="end.i1">${E(C.closingEn)}</h2>
  <p class="toguest" id="toguest"></p>
  <p class="sign" data-t="end.i2">${E(C.signoff)}<span class="nmf">${E(a.en)} &amp; ${E(b.en)}</span></p>
  <div class="btns" data-t="end.i3"><button class="btn" id="share" type="button">Share the invitation</button></div>
  <div class="e-art" data-t="end.art">${layers(pondScene(), POND_VB, 'end', 'el')}</div>
</footer>`;
}

/* the doors, the page, the music button and the toast, as one HTML string */
export function sceneHtml(C) {
  return `${DEFS}${gate(C)}<main class="page" id="page">${page(C)}</main>
<button class="fab" id="snd" type="button" aria-label="Mute music" aria-pressed="false"><span class="eqi" aria-hidden="true"><i></i><i></i><i></i><i></i></span><svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.6 3 2.7-2.7-1.1-1.1-2.7 2.7-2.7-2.7-1.1 1.1 2.7 2.7-2.7 2.7 1.1 1.1 2.7-2.7 2.7 2.7 1.1-1.1z"/></svg></button>
<div class="toast" id="toast" role="status"></div>`;
}
