/* Self-check: the choreography loads into Theatre.js and interpolates as intended, every animated object
   has an element on the page, every section asks for music that exists, and calendar times convert correctly.
   Run: npm run check */
import assert from 'node:assert/strict';
import core from '@theatre/core';
import { SHEETS, SECTIONS, MUSIC, CUES, buildState } from '../lib/timeline.js';
import { sceneHtml } from '../lib/scenes.js';
import { SECTIONS as MUSIC_SECTIONS } from '../lib/score.js';
import { ics } from '../lib/engine.js';
import { CONFIG } from '../lib/config.js';

const project = core.getProject('check', { state: buildState() });
await project.ready;
const objOf = (sid, ok) => { const props = {}; for (const p in SHEETS[sid][ok]) props[p] = 0; return project.sheet(sid).object(ok, props); };
const near = (a, b, msg, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${msg}: ${a} != ${b}`);

/* the doors swing inward, in opposite directions, then the gate fades */
const intro = project.sheet('intro'), dl = objOf('intro', 'dl'), dr = objOf('intro', 'dr'), gate = objOf('intro', 'gate');
intro.sequence.position = 0; near(dl.value.ry, 0, 'doors closed'); near(gate.value.o, 1, 'gate shown');
intro.sequence.position = 1.3; near(dl.value.ry, 104, 'left door open'); near(dr.value.ry, -104, 'right door open');
intro.sequence.position = 2; near(gate.value.o, 0, 'gate gone');

/* a banner drops in from above and settles */
const fest = project.sheet('fest'), b0 = objOf('fest', 'b0');
fest.sequence.position = .3; near(b0.value.y, -40, 'banner starts above');
fest.sequence.position = 3; near(b0.value.y, 0, 'banner hangs'); near(b0.value.r, 0, 'banner settles');

/* sections, sheets, music and elements line up */
const html = sceneHtml(CONFIG), onPage = new Set([...html.matchAll(/data-t="([^"]+)"/g)].map(m => m[1]));
const secs = new Set([...html.matchAll(/data-sec="([^"]+)"/g)].map(m => m[1]));
for (const id of SECTIONS) {
  assert.ok(secs.has(id), `section ${id} is on the page`);
  assert.ok(SHEETS[id], `section ${id} has a sheet`);
  assert.ok(MUSIC_SECTIONS[MUSIC[id]], `section ${id} asks for music that exists (${MUSIC[id]})`);
}
for (const id in CUES) assert.ok(SHEETS[id], `cues for a real sheet: ${id}`);
for (const [sid, objs] of Object.entries(SHEETS)) for (const ok of Object.keys(objs)) assert.ok(onPage.has(`${sid}.${ok}`), `element for ${sid}.${ok}`);
assert.equal((html.match(/class="heart"/g) || []).length, 3, 'three scratch hearts');
assert.equal((html.match(/class="banner"/g) || []).length, CONFIG.events.length, 'a banner per celebration');

/* calendar: India time → UTC */
const cal = ics(CONFIG, CONFIG.events[0]);
assert.ok(cal.includes('DTSTART:20261209T053000Z'), '11 AM IST is 05:30 UTC');
assert.ok(cal.includes('LOCATION:Green View Resort\\, Agra Road\\, Aligarh'), 'commas escaped in .ics');

console.log('invitation ok:', SECTIONS.length, 'sections ·', onPage.size, 'animated elements · calendar ok');
process.exit(0);
