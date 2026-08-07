import type { Metadata } from 'next'
import { CategoryCard } from '@/components/category-card'
import { getCategoriesWithCounts } from '@/lib/tools'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `All Categories — ${SITE.name}`,
  description: `Browse every tool category on ${SITE.name}. ${SITE.tagline}.`,
  alternates: { canonical: absoluteUrl('/categories') },
  openGraph: {
    title: `All Categories — ${SITE.name}`,
    description: SITE.description,
    url: absoluteUrl('/categories'),
    siteName: SITE.name,
  },
}

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts()

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/*
        NOTE: swap this header block for your <SectionHeading /> component
        if its prop names differ from title/description — didn't have that
        file's contents to match it exactly.
      */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Browse by Category
        </h1>
        <p className="mt-2 text-muted-foreground text-pretty">
          Explore all {categories.length} categories and find the right tool fast.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </main>
  )
}