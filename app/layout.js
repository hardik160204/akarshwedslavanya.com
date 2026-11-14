import './fonts.css';
import './globals.css';
import { CONFIG } from '../lib/config.js';

/* Fonts are self-hosted from public/fonts (next/font/google crashed Vercel builds when Google's font fetch flaked).
   Preload the ones the envelope shows first. */
const PRELOAD = ['tiro-devanagari', 'cormorant-italic-latin', 'cinzel-latin', 'great-vibes-latin'];

export const metadata = {
  metadataBase: new URL(CONFIG.siteUrl || 'http://localhost:3000'),
  title: CONFIG.title,
  description: CONFIG.shareText,
  openGraph: { title: CONFIG.title, description: CONFIG.shareText, images: ['/og.png'], type: 'website' },
  twitter: { card: 'summary_large_image', title: CONFIG.title, description: CONFIG.shareText, images: ['/og.png'] }
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#e6d8fa' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {PRELOAD.map(f => <link key={f} rel="preload" href={`/fonts/${f}.woff2`} as="font" type="font/woff2" crossOrigin="" />)}
      </head>
      <body>{children}</body>
    </html>
  );
}
