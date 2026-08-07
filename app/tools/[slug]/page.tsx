import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { tools, getCategory } from "@/lib/tools"
import { getToolComponent } from "@/components/tools/registry"
import { SITE, absoluteUrl } from "@/lib/site"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = tools.find((t) => t.slug === slug)
  if (!tool) return {}

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: absoluteUrl(`/tools/${tool.slug}`) },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: absoluteUrl(`/tools/${tool.slug}`),
      siteName: SITE.name,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params

  const tool = tools.find((t) => t.slug === slug)
  if (!tool) {
    notFound()
  }

  const category = getCategory(tool.category)
  const ToolComponent = getToolComponent(slug)

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="text-sm font-medium text-primary">
        {category?.name ?? tool.category}
      </span>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {tool.title}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
        {tool.description}
      </p>

      <div className="mt-10">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            This tool is coming soon — check back shortly.
          </div>
        )}
      </div>
    </main>
  )
}