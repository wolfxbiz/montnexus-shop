import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { RevealObserver } from '@/components/RevealObserver'
import { AuthProvider } from '@/context/AuthContext'
import { ScrollThemeProvider } from '@/components/providers/ScrollThemeProvider'
import { SignInToast } from '@/components/ui/SignInToast'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'Montnexus — We Build Digital Products That Grow Your Business',
    template: '%s | Montnexus',
  },
  description: 'We design and build custom websites, web apps, mobile apps and desktop software. AI-assisted workflows, fixed pricing, fast delivery.',
  metadataBase: new URL('https://montnexus.com'),
  openGraph: {
    title: 'Montnexus — We Build Digital Products That Grow Your Business',
    description: 'Custom websites, web apps, mobile apps and desktop software. AI-assisted workflows, fixed pricing, fast delivery.',
    url: 'https://montnexus.com',
    siteName: 'Montnexus',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Montnexus — We Build Digital Products That Grow Your Business',
    description: 'Custom websites, web apps, mobile apps and desktop software. AI-assisted workflows, fixed pricing, fast delivery.',
  },
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
        <ScrollThemeProvider />
        <AuthProvider>
          <SignInToast />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
