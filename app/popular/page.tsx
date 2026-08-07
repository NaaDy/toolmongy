import type { Metadata } from 'next'
import { ToolCardGrid } from '@/components/tools/tool-card'
import { getPopularTools } from '@/lib/tools'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `Popular Tools — ${SITE.name}`,
  description: `The most-used free tools on ${SITE.name}. ${SITE.tagline}.`,
  alternates: { canonical: absoluteUrl('/popular') },
  openGraph: {
    title: `Popular Tools — ${SITE.name}`,
    description: SITE.description,
    url: absoluteUrl('/popular'),
    siteName: SITE.name,
  },
}

export default function PopularToolsPage() {
  const tools = getPopularTools()

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Popular Tools</h1>
        <p className="mt-2 text-muted-foreground text-pretty">
          The tools people reach for most on {SITE.name} — {tools.length}{' '}
          {tools.length === 1 ? 'tool' : 'tools'} and counting.
        </p>
      </div>

      {tools.length > 0 ? (
        <ToolCardGrid tools={tools} className="mt-8" />
      ) : (
        <p className="mt-8 text-muted-foreground">No popular tools flagged yet.</p>
      )}
    </main>
  )
}