'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/icon'
import { ToolSearch } from '@/components/search/tool-search'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/tools', label: 'Tools' },
  { href: '/categories', label: 'Categories' },
  { href: '/popular', label: 'Popular' },
  { href: '/blog', label: 'Blog' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0" aria-label="Go to homepage">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs lg:block">
          <ToolSearch variant="default" placeholder="Search tools…" />
        </div>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-1 lg:ml-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Icon name="Menu" className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[85%] max-w-sm gap-0 p-0">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="flex items-center">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <ToolSearch
                  variant="default"
                  placeholder="Search tools…"
                  onNavigate={() => setMobileOpen(false)}
                />
                <nav className="flex flex-col" aria-label="Mobile">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
