'use client';
import { useEffect, useMemo, useRef } from 'react';
import { CONFIG } from '../lib/config.js';
import { sceneHtml } from '../lib/scenes.js';
import { initInvitation } from '../lib/engine.js';

export default function Invitation() {
  const ref = useRef(null);
  const html = useMemo(() => sceneHtml(CONFIG), []);

  useEffect(() => initInvitation(ref.current, CONFIG), []);

  /* The whole invitation is plain HTML built from lib/config.js, delivered pre-rendered. */
  return <div className="app" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
