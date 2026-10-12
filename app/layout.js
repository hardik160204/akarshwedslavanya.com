import './globals.css';
import { Rozha_One, Cormorant_Garamond, Tiro_Devanagari_Hindi } from 'next/font/google';
import { CONFIG } from '../lib/config.js';

/* Fonts are downloaded at build time and served from your own site (fast, no flash). */
const disp = Rozha_One({ weight: '400', subsets: ['latin', 'devanagari'], display: 'swap', variable: '--f-disp' });
const body = Cormorant_Garamond({ weight: ['500', '600'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', variable: '--f-body' });
const hi = Tiro_Devanagari_Hindi({ weight: '400', style: ['normal', 'italic'], subsets: ['devanagari', 'latin'], display: 'swap', variable: '--f-hi' });

export const metadata = {
  metadataBase: new URL(CONFIG.siteUrl || 'http://localhost:3000'),
  title: CONFIG.title,
  description: CONFIG.shareText,
  openGraph: { title: CONFIG.title, description: CONFIG.shareText, images: ['/og.png'], type: 'website' },
  twitter: { card: 'summary_large_image', title: CONFIG.title, description: CONFIG.shareText, images: ['/og.png'] }
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#e9e2d6' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${disp.variable} ${body.variable} ${hi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
