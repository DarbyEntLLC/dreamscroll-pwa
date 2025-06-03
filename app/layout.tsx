import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Add this temporary inline style for testing
const testStyle = `
  body { background: red !important; color: white !important; }
`;

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DreamScroll - Biblical Dream Interpretation',
  description: 'Discover the spiritual meaning behind your dreams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
