import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'
import { tools, categories } from '@/lib/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/tools',
    '/categories',
    '/popular',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const categoryRoutes = categories.map((category) => ({
    url: absoluteUrl(`/categories/${category.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const toolRoutes = tools.map((tool) => ({
    url: absoluteUrl(`/tools/${tool.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes]
}
