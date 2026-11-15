'use client';
import { useEffect, useMemo, useRef } from 'react';
import { CONFIG } from '../lib/config.js';
import { sceneHtml } from '../lib/scenes.js';
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
        {/* The storybook: pages are plain HTML built from lib/config.js, delivered pre-rendered. */}
        <main className="stage" id="stage" data-tone="day" aria-label="Wedding invitation" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
