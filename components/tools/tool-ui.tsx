"use client"

import type React from "react"
import { cn } from "@/lib/utils"

/** Card-like panel that wraps a tool's interactive area. */
export function ToolPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>{children}</div>
  )
}

export function ToolField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

/** A prominent result display block. */
export function ResultBox({
  label,
  children,
  className,
}: {
  label?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-secondary p-4", className)}>
      {label ? <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div> : null}
      <div className="text-secondary-foreground">{children}</div>
    </div>
  )
}

/** Grid of stat cards, used by calculators. */
export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-3 sm:grid-cols-3", className)}>{children}</div>
}

export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary p-4 text-center">
      <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
