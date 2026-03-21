import type { Metadata } from 'next'
import '@/styles/globals.css'
import { RevealObserver } from '@/components/RevealObserver'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Montnexus — Digital Product Marketplace',
  description: 'Curated digital bundles for designers, developers, and indie creators. UI kits, code templates, eBooks, icon sets, and productivity templates.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/the-seasons" rel="stylesheet" />
      </head>
      <body>
        <RevealObserver />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
