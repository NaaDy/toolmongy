import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description: `How ${SITE.name} handles data, cookies, and advertising.`,
  alternates: { canonical: absoluteUrl('/privacy-policy') },
  openGraph: {
    title: `Privacy Policy — ${SITE.name}`,
    description: `How ${SITE.name} handles data, cookies, and advertising.`,
    url: absoluteUrl('/privacy-policy'),
    siteName: SITE.name,
  },
}

// TODO: review with a lawyer before launch, and update the "Last updated" date on every edit.
const LAST_UPDATED = 'January 2026'

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-balance">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
        <p>
          This Privacy Policy explains how {SITE.name} ("we", "us") handles information when
          you use {SITE.url}.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-foreground">1. Tool data</h2>
          <p className="mt-2">
            Most tools on {SITE.name} run entirely in your browser. Text, files, or values you
            enter into a tool are processed on your device and are not transmitted to or stored
            on our servers, unless that specific tool's page states otherwise.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">2. Cookies and similar technologies</h2>
          <p className="mt-2">
            We and our advertising and analytics partners may use cookies, local storage, or
            similar technologies to remember preferences, measure traffic, and serve relevant
            ads.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">3. Advertising</h2>
          <p className="mt-2">
            {SITE.name} is supported by advertising, including Monetag. These partners may use
            cookies or device identifiers to serve ads based on your visits to this and other
            websites. You can manage ad personalization through your browser or device
            settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">4. Analytics</h2>
          <p className="mt-2">
            We use privacy-conscious analytics to understand aggregate traffic patterns (such
            as which pages are visited) and to improve the site. This data is not used to
            identify you personally.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">5. Third-party links</h2>
          <p className="mt-2">
            Some pages may link to third-party sites. We are not responsible for the privacy
            practices of sites we do not operate.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">6. Children's privacy</h2>
          <p className="mt-2">
            {SITE.name} is not directed at children under 13, and we do not knowingly collect
            personal information from children.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">7. Changes to this policy</h2>
          <p className="mt-2">
            We may update this policy from time to time. Changes will be posted on this page
            with an updated date.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
          <p className="mt-2">
            Questions about this policy? Visit our{' '}
            <a href="/contact" className="text-primary underline underline-offset-4">
              Contact page
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}