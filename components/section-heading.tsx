import Link from 'next/link'
import { Icon } from '@/components/icon'

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = 'View all',
}: {
  title: string
  description?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl text-balance">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {linkLabel}
          <Icon
            name="ArrowRight"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  )
}
