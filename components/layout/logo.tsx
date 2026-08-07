import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" opacity="0.55" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor" />
          <rect
            x="13.5"
            y="13.5"
            width="7.5"
            height="7.5"
            rx="3.75"
            fill="currentColor"
            opacity="0.55"
          />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">{SITE.name}</span>
    </span>
  )
}
