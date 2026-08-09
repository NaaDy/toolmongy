import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SITE } from '@/lib/site'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SiteFooter } from '@/components/layout/site-footer'
import { WebsiteJsonLd } from '@/components/seo/json-ld'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Free Online Tools for Everyday Tasks`,
    template: `%s | ${SITE.name}`,
  },
  other: {
    'monetag': 'af842e13236d4f2527f7638dea7ea7e9',
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'free online tools',
    'online calculators',
    'text tools',
    'developer tools',
    'pdf tools',
    'image tools',
    'converters',
    'generators',
  ],
  generator: "ToolNova",
  alternates: {
    canonical: '/',
  },
  openGraph: {
  type: "website",
  siteName: SITE.name,
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  url: SITE.url,
  locale: "en_US",
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: SITE.name,
    },
  ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Free Online Tools`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#12121a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
      <head>
        <meta name="monetag" content="af842e13236d4f2527f7638dea7ea7e9" />
      </head>
      <body className="min-h-screen font-sans antialiased flex flex-col lg:flex-row bg-background">
        <WebsiteJsonLd />
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
            <SiteFooter />
          </main>
        </div>
        
        {/* Google Translate Widget Script */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
