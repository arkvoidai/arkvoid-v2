import type { Metadata } from 'next'
import '../../web/app/globals.css'

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
    <html lang="en" className="antialiased">
      <body className="bg-[#000000] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
