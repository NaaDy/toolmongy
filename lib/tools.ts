import { categories, getCategory } from './categories'
import { tools, toolMap } from './tools/data'
import type { Category, Tool } from './types'

/**
 * A category enriched with how many tools currently belong to it.
 * Used by CategoryCard and the /categories index page.
 */
export interface CategoryWithCount extends Category {
  count: number
}

export function getToolCount(categorySlug: string): number {
  return tools.filter((tool) => tool.category === categorySlug).length
}

export function getCategoriesWithCounts(): CategoryWithCount[] {
  return categories.map((category) => ({
    ...category,
    count: getToolCount(category.slug),
  }))
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter((tool) => tool.category === categorySlug)
}

/**
 * Tools flagged `popular: true` in the registry, optionally capped to `limit`.
 * Used by SiteFooter, the /popular page, and the homepage Popular Tools section.
 */
export function getPopularTools(limit?: number): Tool[] {
  const popular = tools.filter((tool) => tool.popular)
  return typeof limit === 'number' ? popular.slice(0, limit) : popular
}

/**
 * Tools flagged `featured: true` in the registry, optionally capped to `limit`.
 * Used by the homepage Featured Tools section.
 */
export function getFeaturedTools(limit?: number): Tool[] {
  const featured = tools.filter((tool) => tool.featured)
  return typeof limit === 'number' ? featured.slice(0, limit) : featured
}

/**
 * Ranked search across tool name, keywords, and short description.
 * Used by the header search combobox (ToolSearch).
 */
export function searchTools(query: string, limit?: number): Tool[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored = tools
    .map((tool) => {
      const name = tool.name.toLowerCase()
      const keywords = tool.keywords.map((k) => k.toLowerCase())
      let score = 0

      if (name === q) score = 100
      else if (name.startsWith(q)) score = 80
      else if (name.includes(q)) score = 60
      else if (keywords.some((k) => k.startsWith(q))) score = 40
      else if (keywords.some((k) => k.includes(q))) score = 30
      else if (tool.shortDescription.toLowerCase().includes(q)) score = 10

      return { tool, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.tool)

  return typeof limit === 'number' ? scored.slice(0, limit) : scored
}

// Re-exported so pages/components that import the tool registry directly
// from '@/lib/tools' (this facade module) keep working, e.g. app/tools/[slug]/page.tsx
export { tools, toolMap, categories, getCategory }