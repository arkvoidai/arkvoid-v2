import { MarketingNav } from '../components/nav/marketing-nav';
import type { Metadata } from 'next';
import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'Arkvoid — AI Trust Infrastructure',
    template: '%s | Arkvoid',
  },
  description: 'The trust infrastructure for the AI economy. Log, explain, govern, and verify every AI decision your company makes — in one line of code.',
  keywords: ['AI governance', 'AI compliance', 'AI audit trail', 'explainable AI', 'EU AI Act', 'causal attribution'],
  openGraph: {
    type: 'website',
    url: 'https://arkvoid.com',
    siteName: 'Arkvoid',
    title: 'Arkvoid — AI Trust Infrastructure',
    description: 'Make every AI decision trustworthy.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@arkvoid',
    title: 'Arkvoid — AI Trust Infrastructure',
  },
  metadataBase: new URL('https://arkvoid.com'),
  alternates: {
    canonical: 'https://arkvoid.com',
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
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="bg-black text-white font-sans antialiased overflow-x-hidden min-h-[100dvh]">
        <MarketingNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
