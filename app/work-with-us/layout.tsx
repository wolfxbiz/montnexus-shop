import type { Metadata } from 'next'
import { EB_Garamond } from 'next/font/google'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Work With Us · Digital Products Built Fast | Montnexus',
  description:
    'Websites, web apps, mobile apps and desktop software — built by a specialist studio, powered by AI, delivered fast, priced fairly.',
  robots: { index: false, follow: false },
}

export default function WorkWithUsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${ebGaramond.variable} ${ebGaramond.className}`}>
      {children}
    </div>
  )
}
