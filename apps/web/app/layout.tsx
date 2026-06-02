import { MarketingNav } from '../components/nav/marketing-nav';
import type { Metadata } from 'next';
import { siteConfig } from '../lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Arkvoid — AI Trust Infrastructure',
    template: '%s | Arkvoid',
  },
  description: 'The trust infrastructure for the AI economy. Log, explain, govern, and verify every AI decision your company makes — in one line of code.',
  keywords: ['AI governance', 'AI compliance', 'AI audit trail', 'explainable AI', 'EU AI Act', 'causal attribution'],
  openGraph: {
    type: 'website',
    url: siteConfig.marketingUrl,
    siteName: 'Arkvoid',
    title: 'Arkvoid — AI Trust Infrastructure',
    description: 'Make every AI decision trustworthy.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@arkvoid',
    title: 'Arkvoid — AI Trust Infrastructure',
  },
  metadataBase: new URL(siteConfig.marketingUrl),
  alternates: {
    canonical: siteConfig.marketingUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-black text-white font-sans antialiased overflow-x-hidden min-h-[100dvh]">
        <MarketingNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
