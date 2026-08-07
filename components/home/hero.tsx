import Link from 'next/link'
import { ToolSearch } from '@/components/search/tool-search'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { getPopularTools } from '@/lib/tools'

export function Hero() {
  const quickLinks = getPopularTools(5)

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Subtle background grid — decorative, purposeful framing for the hero */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          <span className="flex size-1.5 rounded-full bg-primary animate-pulse" />
          Toolmongy is now live in Beta!
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 drop-shadow-sm">
          Ultimate Developer & Creator Tools
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Fast, private, and simple tools you can use instantly — calculators, converters,
          text utilities, developer helpers, and more. No registration required.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <ToolSearch variant="hero" placeholder="Search 1,000+ tools…" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
<Button size="lg" nativeButton={false} render={<Link href="/tools" />}>            Explore All Tools
            <Icon name="ArrowRight" className="size-4" />
          </Button>
<Button size="lg" variant="outline" nativeButton={false} render={<Link href="/categories" />}>            Browse Categories
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="text-xs uppercase tracking-wide">Popular:</span>
          {quickLinks.map((tool, i) => (
            <span key={tool.slug} className="inline-flex items-center gap-2">
              <Link
                href={`/tools/${tool.slug}`}
                className="font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {tool.name}
              </Link>
              {i < quickLinks.length - 1 ? (
                <span className="text-border" aria-hidden="true">
                  •
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
