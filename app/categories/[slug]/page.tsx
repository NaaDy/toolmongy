import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ToolCardGrid } from '@/components/tools/tool-card'
import { categories, getCategory } from '@/lib/categories'
import { getToolsByCategory } from '@/lib/tools'
import { SITE, absoluteUrl } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return {}

  const title = `${category.name} — ${SITE.name}`
  const description = category.intro ?? category.description

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/categories/${category.slug}`) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/categories/${category.slug}`),
      siteName: SITE.name,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const tools = getToolsByCategory(slug)

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All Categories
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-balance">{category.name}</h1>
        <p className="mt-2 text-muted-foreground text-pretty">
          {category.intro ?? category.description}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
        </p>
      </div>

      {tools.length > 0 ? (
        <ToolCardGrid tools={tools} className="mt-8" />
      ) : (
        <p className="mt-8 text-muted-foreground">
          No tools in this category yet — check back soon.
        </p>
      )}
    </main>
  )
}