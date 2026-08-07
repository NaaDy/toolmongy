"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"
import { Home, LayoutGrid, Star, FileText, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tools", label: "All Tools", icon: LayoutGrid },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/popular", label: "Popular", icon: Star },
  { href: "/blog", label: "Blog", icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
        <Logo />
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/50">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="grid gap-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-border/50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div id="google_translate_element" className="w-full overflow-hidden rounded-md border border-border [&>div]:w-full"></div>
          </div>
          <div className="rounded-lg bg-primary/10 p-4">
            <h4 className="font-semibold text-sm text-primary mb-1">Toolmongy Pro</h4>
            <p className="text-xs text-muted-foreground mb-3">Upgrade for unlimited usage and ad-free experience.</p>
            <Button size="sm" className="w-full text-xs h-8">Upgrade Now</Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
