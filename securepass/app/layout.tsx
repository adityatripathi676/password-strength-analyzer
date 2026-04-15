import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { getCssText } from '@/styles/stitches.config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: 'SecurePass Analyzer — AI-Powered Password Security',
    template: '%s | SecurePass Analyzer',
  },
  description:
    'Enterprise-grade password strength analysis. Measure entropy, detect breach exposure, estimate crack time, and generate secure passwords instantly.',
  keywords: [
    'password strength',
    'password security',
    'entropy calculator',
    'breach detection',
    'HIBP',
    'cybersecurity',
    'password analyzer',
  ],
  authors: [{ name: 'SecurePass' }],
  creator: 'SecurePass Analyzer',
  openGraph: {
    title: 'SecurePass Analyzer — Know Your Password Strength',
    description:
      'Measure entropy, detect breach exposure, estimate crack time. Professional password security analysis.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Stitches SSR — inject critical CSS before paint */}
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
