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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png'
  }
}

import type { Metadata } from 'next'

// ADD THIS ENTIRE BLOCK ⬇️
export const metadata: Metadata = {
  title: 'DreamScroll - Biblical Dream Interpretation',
  description: 'AI-powered biblical dream interpretation with voice recording',
  keywords: 'dreams, biblical interpretation, voice recording, spiritual, AI, PWA',
  authors: [{ name: 'DreamScroll Team' }],
  creator: 'DreamScroll',
  publisher: 'DreamScroll',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dreamscroll-pwa.vercel.app'), // ⚠️ CHANGE THIS to your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DreamScroll - Biblical Dream Interpretation',
    description: 'AI-powered biblical dream interpretation with voice recording',
    url: 'https://dreamscroll-pwa.vercel.app', // ⚠️ CHANGE THIS to your actual domain
    siteName: 'DreamScroll',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DreamScroll App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DreamScroll - Biblical Dream Interpretation',
    description: 'AI-powered biblical dream interpretation with voice recording',
    creator: '@dreamscroll',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json', // ← This is the key PWA line!
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DreamScroll',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'DreamScroll',
    'msapplication-TileColor': '#8b5cf6',
    'theme-color': '#8b5cf6',
  },
};

// Your existing RootLayout function stays the same ⬇️
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DreamScroll" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
