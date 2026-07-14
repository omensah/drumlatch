import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'DrumLatch — Smart Laundromat Security Platform',
  description: 'DrumLatch is a smart locking, anti-theft, and machine-availability platform for modern laundromats.',
  generator: 'DrumLatch',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
