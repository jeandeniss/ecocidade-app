import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Eco Product Scanner - Sustainable Shopping Assistant',
  description: 'Scan products to get detailed environmental impact information, find eco-friendly stores, and make sustainable shopping choices',
  keywords: 'eco-friendly, sustainability, product scanner, environmental impact, green shopping',
  openGraph: {
    title: 'Eco Product Scanner - Make Sustainable Shopping Choices',
    description: 'Scan products, find eco-friendly stores, and make informed environmental choices',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Eco Product Scanner Preview',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eco Product Scanner',
    description: 'Your sustainable shopping assistant',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://tfhub.dev" />
        <link rel="dns-prefetch" href="https://tfhub.dev" />
      </head>
      <body className={`${inter.className} leaf-pattern`}>
        <div className="min-h-screen bg-gradient-to-b from-white to-eco-sprout/5">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  )
}