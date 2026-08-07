import type { Tool } from '../types'
import { categories, getCategory } from '../categories'
import { tools, toolMap } from './data'

export { tools, toolMap }

export function getTool(slug: string): Tool | undefined {
  return toolMap[slug]
}

export function getAllToolSlugs(): string[] {
  return tools.map((t) => t.slug)
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter((t) => t.category === categorySlug)
}

export function getFeaturedTools(limit = 6): Tool[] {
  return tools.filter((t) => t.featured).slice(0, limit)
}

export function getPopularTools(limit = 8): Tool[] {
  return tools.filter((t) => t.popular).slice(0, limit)
}

export function getNewTools(limit = 6): Tool[] {
  const flagged = tools.filter((t) => t.new)
  // Fall back to the most recently registered tools when none are flagged.
  const base = flagged.length > 0 ? flagged : [...tools].slice(-limit)
  return base.slice(0, limit)
}

export function getTrendingTools(limit = 6): Tool[] {
  // Trending = popular tools that are also featured, then other popular ones.
  const ranked = [...tools].sort((a, b) => {
    const score = (t: Tool) => (t.featured ? 2 : 0) + (t.popular ? 1 : 0)
    return score(b) - score(a)
  })
  return ranked.slice(0, limit)
}

/**
 * Resolve related tools for a tool. Uses explicit relatedTools when present,
 * then automatically fills remaining slots with other tools in the same
 * category. This scales without hand-maintaining every relationship.
 */
export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  const result: Tool[] = []
  const seen = new Set<string>([tool.slug])

  for (const slug of tool.relatedTools ?? []) {
    const related = toolMap[slug]
    if (related && !seen.has(slug)) {
      result.push(related)
      seen.add(slug)
    }
  }

  if (result.length < limit) {
    for (const candidate of getToolsByCategory(tool.category)) {
      if (result.length >= limit) break
      if (!seen.has(candidate.slug)) {
        result.push(candidate)
        seen.add(candidate.slug)
      }
    }
  }

  if (result.length < limit) {
    for (const candidate of getPopularTools(20)) {
      if (result.length >= limit) break
      if (!seen.has(candidate.slug)) {
        result.push(candidate)
        seen.add(candidate.slug)
      }
    }
  }

  return result.slice(0, limit)
}

export interface CategoryWithCount {
  slug: string
  name: string
  description: string
  icon: string
  intro?: string
  count: number
}

export function getCategoriesWithCounts(): CategoryWithCount[] {
  return categories.map((c) => ({
    ...c,
    count: getToolsByCategory(c.slug).length,
  }))
}

/**
 * Lightweight relevance search across name, description, keywords and category.
 * Runs on the client for instant results and on the server for /tools listing.
 */
export function searchTools(query: string, limit?: number): Tool[] {
  const q = query.trim().toLowerCase()
  if (!q) return limit ? tools.slice(0, limit) : tools

  const terms = q.split(/\s+/)

  const scored = tools
    .map((tool) => {
      const category = getCategory(tool.category)
      const haystackName = tool.name.toLowerCase()
      const haystackDesc = `${tool.shortDescription} ${tool.description}`.toLowerCase()
      const haystackKeywords = tool.keywords.join(' ').toLowerCase()
      const haystackCategory = (category?.name ?? '').toLowerCase()

      let score = 0
      for (const term of terms) {
        if (haystackName.startsWith(term)) score += 10
        if (haystackName.includes(term)) score += 6
        if (haystackKeywords.includes(term)) score += 4
        if (haystackCategory.includes(term)) score += 3
        if (haystackDesc.includes(term)) score += 2
      }
      return { tool, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.tool)

  return limit ? scored.slice(0, limit) : scored
}
