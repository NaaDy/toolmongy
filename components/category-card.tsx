import Link from 'next/link'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'
import type { CategoryWithCount } from '@/lib/tools'

export function CategoryCard({
  category,
  className,
}: {
  category: CategoryWithCount
  className?: string
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        'group flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon name={category.icon} className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold leading-tight">{category.name}</h3>
          <span className="text-xs text-muted-foreground">{category.count}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {category.description}
        </p>
      </div>
    </Link>
  )
}
