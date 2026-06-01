import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../../web/app/globals.css'

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sign in — Arkvoid',
  description: 'Sign in to your Arkvoid workspace',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#000000] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
