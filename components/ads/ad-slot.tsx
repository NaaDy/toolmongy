import { cn } from '@/lib/utils'

/**
 * Reusable, network-agnostic advertising slot.
 *
 * This component renders a neutral placeholder today. To go live with an ad
 * network (Google AdSense, Monetag, etc.), replace the placeholder markup in
 * ONE place here — every position across the site updates automatically. No
 * ad credentials or scripts are hard-coded anywhere in the app.
 *
 * Recommended: gate rendering behind an env flag and inject the network script
 * from app/layout.tsx or a dedicated <AdProvider> when you are ready.
 */
export type AdSlotFormat = 'leaderboard' | 'rectangle' | 'inline' | 'sidebar'

const formatStyles: Record<AdSlotFormat, string> = {
  leaderboard: 'min-h-[90px] w-full',
  rectangle: 'min-h-[250px] w-full max-w-[336px] mx-auto',
  inline: 'min-h-[120px] w-full',
  sidebar: 'min-h-[600px] w-full',
}

export function AdSlot({
  format = 'inline',
  slotId,
  className,
  label = 'Advertisement',
}: {
  format?: AdSlotFormat
  /** Stable identifier passed to the ad network when integrated. */
  slotId?: string
  className?: string
  label?: string
}) {
  const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true'

  // When ads are disabled (default), render nothing so layout stays clean in
  // development and previews. Flip NEXT_PUBLIC_ADS_ENABLED to show slots.
  if (!enabled) return null

  return (
    <aside
      aria-label={label}
      data-ad-slot={slotId}
      data-ad-format={format}
      className={cn(
        'flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase',
        formatStyles[format],
        className,
      )}
    >
      {label}
    </aside>
  )
}
