import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `Disclaimer — ${SITE.name}`,
  description: `Important disclaimers about the tools and content on ${SITE.name}.`,
  alternates: { canonical: absoluteUrl('/disclaimer') },
  openGraph: {
    title: `Disclaimer — ${SITE.name}`,
    description: `Important disclaimers about the tools and content on ${SITE.name}.`,
    url: absoluteUrl('/disclaimer'),
    siteName: SITE.name,
  },
}

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-balance">Disclaimer</h1>

      <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-foreground">General information only</h2>
          <p className="mt-2">
            Tools and content on {SITE.name} (calculators, converters, and generators included)
            are provided for general informational purposes only and do not constitute
            financial, medical, legal, or professional advice of any kind.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">Accuracy</h2>
          <p className="mt-2">
            While we aim for accurate calculations, we make no guarantee that results are free
            of errors. Always double-check important figures (loan payments, health metrics,
            etc.) with a qualified professional before making decisions based on them.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">No liability</h2>
          <p className="mt-2">
            {SITE.name} and its operators are not liable for any loss or damage arising from
            reliance on information or results produced by tools on this Site.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">External links</h2>
          <p className="mt-2">
            Any external links are provided for convenience. We do not endorse and are not
            responsible for the content of external sites.
          </p>
        </div>
      </div>
    </main>
  )
}