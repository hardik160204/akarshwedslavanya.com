import './globals.css';
import { Great_Vibes, Cinzel, Cormorant_Garamond, Tiro_Devanagari_Hindi } from 'next/font/google';
import { CONFIG } from '../lib/config.js';

/* Fonts are downloaded at build time and served from your own site (fast, no flash). */
const script = Great_Vibes({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--f-script' });
const caps = Cinzel({ weight: ['500', '600'], subsets: ['latin'], display: 'swap', variable: '--f-caps' });
const body = Cormorant_Garamond({ weight: ['500', '600', '700'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', variable: '--f-body' });
const hi = Tiro_Devanagari_Hindi({ weight: '400', subsets: ['devanagari', 'latin'], display: 'swap', variable: '--f-hi' });

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
    <html lang="en" className={`${script.variable} ${caps.variable} ${body.variable} ${hi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
