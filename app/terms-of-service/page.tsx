import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE.name}`,
  description: `The terms that govern your use of ${SITE.name}.`,
  alternates: { canonical: absoluteUrl('/terms-of-service') },
  openGraph: {
    title: `Terms of Service — ${SITE.name}`,
    description: `The terms that govern your use of ${SITE.name}.`,
    url: absoluteUrl('/terms-of-service'),
    siteName: SITE.name,
  },
}

// TODO: review with a lawyer before launch, and update the "Last updated" date on every edit.
const LAST_UPDATED = 'January 2026'

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-balance">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
        <p>
          By using {SITE.url} ("the Site"), you agree to these Terms of Service. If you do not
          agree, please do not use the Site.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-foreground">1. Use of the Site</h2>
          <p className="mt-2">
            {SITE.name} provides free online tools for personal and professional use. You agree
            not to misuse the Site, including attempting to disrupt its operation, scrape it at
            abusive volume, or use it for unlawful purposes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">2. No warranty</h2>
          <p className="mt-2">
            Tools are provided "as is" without warranties of any kind. We do our best to keep
            results accurate, but you are responsible for verifying output before relying on it
            for anything important (financial, medical, legal, or otherwise).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">3. Limitation of liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, {SITE.name} and its operators are not
            liable for any indirect, incidental, or consequential damages arising from your use
            of the Site or its tools.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">4. Advertising</h2>
          <p className="mt-2">
            The Site is supported by advertising. We are not responsible for the content of
            third-party ads served through our advertising partners.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">5. Changes to the Site</h2>
          <p className="mt-2">
            We may add, remove, or modify tools and features at any time without notice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">6. Changes to these terms</h2>
          <p className="mt-2">
            We may update these Terms from time to time. Continued use of the Site after
            changes means you accept the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
          <p className="mt-2">
            Questions about these Terms? Visit our{' '}
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