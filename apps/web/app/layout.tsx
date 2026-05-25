import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://smartbookpublishing.com'),
  title: {
    default:  'Smart Book Publishing — Where Authors Thrive',
    template: '%s | Smart Book Publishing',
  },
  description:
    'Professional book publishing services for authors. Expert editing, stunning cover design, global distribution, and targeted marketing — all under one roof.',
  keywords: ['book publishing', 'self publishing', 'book editing', 'cover design', 'book distribution', 'author services'],
  authors:  [{ name: 'Smart Book Publishing' }],
  creator:  'Smart Book Publishing',
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://smartbookpublishing.com',
    siteName:    'Smart Book Publishing',
    title:       'Smart Book Publishing — Where Authors Thrive',
    description: 'Professional book publishing services for authors.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Smart Book Publishing',
    description: 'Professional book publishing services for authors.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased" style={{ background: 'var(--canvas)', color: 'var(--ink)' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
