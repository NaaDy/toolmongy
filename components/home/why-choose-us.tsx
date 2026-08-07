import { Zap, ShieldCheck, Gift, Infinity as InfinityIcon } from 'lucide-react'
import { SITE } from '@/lib/site'

const points = [
  {
    icon: Zap,
    title: 'Instant, no waiting',
    description: 'Every tool runs the moment you open it — no loading screens, no queues.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by default',
    description:
      'Most tools process everything in your browser. Nothing you type gets uploaded.',
  },
  {
    icon: Gift,
    title: 'Actually free',
    description: 'No paywalls, no premium tier, no credit card. Just free tools.',
  },
  {
    icon: InfinityIcon,
    title: 'Always growing',
    description: "New tools are added regularly — request one you're missing anytime.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Why {SITE.name}?
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <div key={point.title} className="flex flex-col gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <point.icon className="size-5" />
              </span>
              <h3 className="font-semibold">{point.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}