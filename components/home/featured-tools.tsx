import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ToolCardGrid } from '@/components/tools/tool-card'
import { getFeaturedTools } from '@/lib/tools'

export function FeaturedTools() {
  const tools = getFeaturedTools(8)

  if (tools.length === 0) return null

  return (
    <section className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              Featured Tools
            </h2>
            <p className="mt-2 text-muted-foreground text-pretty">
              Hand-picked tools worth trying this week.
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Browse all tools
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ToolCardGrid tools={tools} className="mt-8" />
      </div>
    </section>
  )
}