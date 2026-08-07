import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategoryCard } from '@/components/category-card'
import { getCategoriesWithCounts } from '@/lib/tools'

export function CategoriesSection() {
  const categories = getCategoriesWithCounts()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Browse by Category
          </h2>
          <p className="mt-2 text-muted-foreground text-pretty">
            {categories.length} categories covering everyday tasks.
          </p>
        </div>
        <Link
          href="/categories"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 9).map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all categories
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}