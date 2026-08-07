'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@/components/icon'
import { searchTools } from '@/lib/tools'
import { getCategory } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function ToolSearch({
  variant = 'default',
  placeholder = 'Search 1,000+ tools…',
  autoFocus = false,
  className,
  onNavigate,
}: {
  variant?: 'hero' | 'default'
  placeholder?: string
  autoFocus?: boolean
  className?: string
  onNavigate?: () => void
}) {
  const router = useRouter()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => (query ? searchTools(query, 6) : []), [query])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function goTo(href: string) {
    setOpen(false)
    setQuery('')
    onNavigate?.()
    router.push(href)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        goTo(`/tools/${results[activeIndex].slug}`)
      } else if (query.trim()) {
        goTo(`/tools?q=${encodeURIComponent(query.trim())}`)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const isHero = variant === 'hero'

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative">
        <Icon
          name="Search"
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground',
            isHero ? 'size-5' : 'size-4',
          )}
        />
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search tools"
          autoFocus={autoFocus}
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-full border border-border bg-card text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 [&::-webkit-search-cancel-button]:appearance-none',
            isHero ? 'h-14 pl-12 pr-4 text-base' : 'h-10 pl-10 pr-4 text-sm',
          )}
        />
      </div>

      {open && query.trim() ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl"
        >
          {results.length > 0 ? (
            <ul className="flex flex-col">
              {results.map((tool, index) => {
                const category = getCategory(tool.category)
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => goTo(`/tools/${tool.slug}`)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                        index === activeIndex ? 'bg-accent text-accent-foreground' : '',
                      )}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon name={tool.icon} className="size-4" />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{tool.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {category?.name}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
              <li className="mt-1 border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => goTo(`/tools?q=${encodeURIComponent(query.trim())}`)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon name="Search" className="size-4" />
                  See all results for “{query.trim()}”
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-3 py-6 text-center">
              <p className="text-sm font-medium">No tools found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different keyword or browse categories.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
