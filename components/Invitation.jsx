'use client';
import { useEffect, useMemo, useRef } from 'react';
import { CONFIG } from '../lib/config.js';
import { sceneHtml } from '../lib/scenes.js';
import { SCENES } from '../lib/timeline.js';
import { initInvitation } from '../lib/engine.js';

export default function Invitation() {
  const ref = useRef(null);
  const html = useMemo(() => sceneHtml(CONFIG), []);

  useEffect(() => initInvitation(ref.current, CONFIG), []);

  const [a, b] = CONFIG.names;
  return (
    <div className="app" ref={ref}>
      <div className="ambient" aria-hidden="true" />
      <div className="amb l hi" aria-hidden="true">{a.hi || a.en}</div>
      <div className="amb r hi" aria-hidden="true">{b.hi || b.en}</div>

      <div className="phone">
        {/* The page itself never scrolls (so mobile toolbars stay put); this inner scroller does.
            Each swipe snaps to the next scene and scrubs the Theatre.js "world" timeline. */}
        <main className="scroller locked" id="scroller" tabIndex={0} aria-label="Wedding invitation">
          <div className="track" style={{ height: `calc(var(--H, 100svh) * ${SCENES.length})` }}>
            <div className="stage" id="stage" dangerouslySetInnerHTML={{ __html: html }} />
            {SCENES.map((s, i) => <i key={s} className="snap" style={{ top: `calc(var(--H, 100svh) * ${i})` }} aria-hidden="true" />)}
          </div>
        </main>
      </div>
    </div>
  );
}
