'use client';
import { useEffect, useMemo, useRef } from 'react';
import { CONFIG } from '../lib/config.js';
import { sceneHtml } from '../lib/scenes.js';
import { initInvitation } from '../lib/engine.js';

export default function Invitation() {
  const ref = useRef(null);
  const html = useMemo(() => sceneHtml(CONFIG), []);

  useEffect(() => {
    const destroy = initInvitation(ref.current, CONFIG);
    return destroy;
  }, []);

  const [a, b] = CONFIG.names;
  return (
    <div className="app" ref={ref}>
      <div className="ambient" aria-hidden="true" />
      <div className="amb l disp" aria-hidden="true">{a.hi || a.en}</div>
      <div className="amb r disp" aria-hidden="true">{b.hi || b.en}</div>

      <div className="phone" id="phone">
        <div className="hud"><button className="pill" id="play" type="button">Play as a film</button></div>
        <nav className="dots" id="dots" aria-label="Invitation scenes" />
        <div className="toast" id="toast" role="status" />
        <main className="stage" id="stage">
          {/* Scenes are plain HTML built from lib/config.js, delivered pre-rendered. */}
          <div className="track" id="track" dangerouslySetInnerHTML={{ __html: html }} />
        </main>
      </div>
    </div>
  );
}
