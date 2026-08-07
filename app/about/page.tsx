import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description: `Learn about ${SITE.name} and why it exists: ${SITE.description}`,
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: `About — ${SITE.name}`,
    description: SITE.description,
    url: absoluteUrl('/about'),
    siteName: SITE.name,
  },
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-balance">About {SITE.name}</h1>
      <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">{SITE.description}</p>

      <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
        <p>
          {SITE.name} is a growing collection of free, fast, browser-based tools for everyday
          tasks — from generating passwords and QR codes to formatting JSON and converting
          colors. No sign-up, no installs, and no data sent to a server unless a tool
          specifically says otherwise.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-foreground">Why we built this</h2>
          <p className="mt-2">
            Most "free tool" sites bury a simple task behind ads, pop-ups, or an account wall.
            We wanted the opposite: open a tool, use it instantly, and get back to what you were
            doing.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">How it works</h2>
          <p className="mt-2">
            Wherever possible, our tools run entirely in your browser — nothing you type or
            upload is stored on our servers. Some tools may call a server-side API when the
            task truly requires it; those are labeled clearly on the tool page.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">Support</h2>
          <p className="mt-2">
            {SITE.name} is free to use and supported by advertising. If a tool you rely on is
            missing, let us know — see the Contact page.
          </p>
        </div>
      </div>
    </main>
  )
}