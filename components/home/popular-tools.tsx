import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ToolCardGrid } from '@/components/tools/tool-card'
import { getPopularTools } from '@/lib/tools'

export function PopularTools() {
  const tools = getPopularTools(8)

  if (tools.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Popular Tools
          </h2>
          <p className="mt-2 text-muted-foreground text-pretty">
            The tools people reach for most.
          </p>
        </div>
        <Link
          href="/popular"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <ToolCardGrid tools={tools} className="mt-8" />

      <div className="mt-6 sm:hidden">
        <Link
          href="/popular"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all popular tools
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}