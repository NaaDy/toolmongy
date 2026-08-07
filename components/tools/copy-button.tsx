"use client"

import { useState, useCallback } from "react"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
  disabled?: boolean
}

export function CopyButton({ value, label = "Copy", className, disabled }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore clipboard failures
    }
  }, [value])

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={disabled || !value}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      aria-label={copied ? "Copied to clipboard" : label}
    >
      <Icon name={copied ? "check" : "copy"} className="size-4" />
      {copied ? "Copied" : label}
    </button>
  )
}
