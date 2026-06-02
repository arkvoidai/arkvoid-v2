import type { Metadata } from 'next'
import '../../web/app/globals.css'
import { ToastProvider } from '../components/ui/toast'

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
    <html lang="en" className="antialiased">
      <body className="bg-[#000000] text-white antialiased font-sans overflow-hidden">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
