import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { SITE } from '@/lib/site'
import { categories } from '@/lib/categories'
import { getPopularTools } from '@/lib/tools'

const columns = [
  {
    title: 'Explore',
    links: [
      { href: '/tools', label: 'All Tools' },
      { href: '/categories', label: 'Categories' },
      { href: '/popular', label: 'Popular Tools' },
      { href: '/blog', label: 'Blog' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
  },
]

export function SiteFooter() {
  const popular = getPopularTools(5)
  const topCategories = categories.slice(0, 6)

  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
              {SITE.description}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">{col.title}</h2>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Popular Tools</h2>
            <ul className="flex flex-col gap-2">
              {popular.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Categories</h2>
            <ul className="flex flex-col gap-2">
              {topCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for speed and privacy. Your data stays in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}
