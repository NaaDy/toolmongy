import type { Metadata } from 'next'
import { ToolCardGrid } from '@/components/tools/tool-card'
import { tools } from '@/lib/tools'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `All Tools — ${SITE.name}`,
  description: `Browse every free tool on ${SITE.name}. ${SITE.tagline}.`,
  alternates: { canonical: absoluteUrl('/tools') },
  openGraph: {
    title: `All Tools — ${SITE.name}`,
    description: SITE.description,
    url: absoluteUrl('/tools'),
    siteName: SITE.name,
  },
}

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-balance">All Tools</h1>
        <p className="mt-2 text-muted-foreground text-pretty">
          Browse all {tools.length} free tools on {SITE.name} — no sign-up required.
        </p>
      </div>

      {tools.length > 0 ? (
        <ToolCardGrid tools={tools} className="mt-8" />
      ) : (
        <p className="mt-8 text-muted-foreground">No tools yet — check back soon.</p>
      )}
    </main>
  )
}