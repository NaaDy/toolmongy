import Link from 'next/link'
import type { Tool } from '@/lib/types'
import { getCategory } from '@/lib/categories'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function ToolCard({ tool, className }: { tool: Tool; className?: string }) {
  const category = getCategory(tool.category)

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        'group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-5 text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:ring-primary/50">
          <Icon name={tool.icon} className="size-6" />
        </span>
        {tool.new ? (
          <Badge variant="secondary" className="text-[0.65rem]">
            New
          </Badge>
        ) : tool.popular ? (
          <Badge variant="secondary" className="text-[0.65rem]">
            Popular
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5 mt-2">
        <h3 className="text-lg font-bold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">{tool.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>
      {category ? (
        <span className="mt-auto text-xs font-medium text-muted-foreground/80">
          {category.name}
        </span>
      ) : null}
    </Link>
  )
}

export function ToolCardGrid({ tools, className }: { tools: Tool[]; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  )
}
