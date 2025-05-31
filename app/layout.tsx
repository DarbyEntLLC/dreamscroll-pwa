import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DreamScroll - Biblical Dream Interpretation',
  description: 'AI-powered biblical dream interpretation with voice recording',
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DreamScroll'
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DreamScroll" />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
