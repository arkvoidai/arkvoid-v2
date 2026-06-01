import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '../../web/app/globals.css'
import { ToastProvider } from '../components/ui/toast'

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Arkvoid',
    template: '%s — Arkvoid'
  },
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#000000] text-white antialiased font-sans overflow-hidden">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
