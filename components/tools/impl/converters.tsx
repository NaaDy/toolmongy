"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { ToolPanel, ToolField, ResultBox, StatGrid, Stat } from "@/components/tools/tool-ui"
import { CopyButton } from "@/components/tools/copy-button"

function normalizeHex(hex: string): string | null {
  let h = hex.trim().replace(/^#/, "")
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return h.toLowerCase()
}

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      default:
        h = (rn - gn) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function ColorConverter() {
  const [hex, setHex] = useState("#6366f1")

  const parsed = useMemo(() => normalizeHex(hex), [hex])
  const rgb = useMemo(() => (parsed ? hexToRgb(parsed) : null), [parsed])
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb])

  const hexString = parsed ? `#${parsed}` : ""
  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ""
  const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ""

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-end gap-4">
        <ToolField label="Pick a color" htmlFor="ccpicker">
          <input
            id="ccpicker"
            type="color"
            value={parsed ? `#${parsed}` : "#000000"}
            onChange={(e) => setHex(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded-md border border-border bg-transparent p-1"
          />
        </ToolField>
        <div className="max-w-48 flex-1">
          <ToolField label="Hex value" htmlFor="cchex">
            <Input id="cchex" value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#6366f1" />
          </ToolField>
        </div>
      </div>

      {parsed && rgb && hsl ? (
        <div className="mt-5 flex flex-col gap-4">
          <div className="h-20 w-full rounded-xl border border-border" style={{ backgroundColor: hexString }} />
          <StatGrid className="sm:grid-cols-3">
            <Stat value={hexString} label="HEX" />
            <Stat value={rgbString} label="RGB" />
            <Stat value={hslString} label="HSL" />
          </StatGrid>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={hexString} label="Copy HEX" />
            <CopyButton value={rgbString} label="Copy RGB" />
            <CopyButton value={hslString} label="Copy HSL" />
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Enter a valid hex color like #6366f1.</p>
      )}
    </ToolPanel>
  )
}

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(() => String(Math.floor(Date.now() / 1000)))
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 16))

  const fromTimestamp = useMemo(() => {
    const n = Number.parseInt(timestamp.trim(), 10)
    if (Number.isNaN(n)) return null
    const ms = timestamp.trim().length > 10 ? n : n * 1000
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? null : d
  }, [timestamp])

  const toTimestamp = useMemo(() => {
    const d = new Date(dateInput)
    return Number.isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000)
  }, [dateInput])

  return (
    <ToolPanel>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <ToolField label="Unix timestamp" htmlFor="tcin" hint="Seconds or milliseconds since 1970-01-01 UTC.">
            <Input id="tcin" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} inputMode="numeric" />
          </ToolField>
          {fromTimestamp ? (
            <ResultBox className="mt-3" label="Date">
              <div className="flex flex-col gap-1 text-sm">
                <span>Local: {fromTimestamp.toLocaleString()}</span>
                <span>UTC: {fromTimestamp.toUTCString()}</span>
              </div>
            </ResultBox>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Enter a valid timestamp.</p>
          )}
        </div>

        <div>
          <ToolField label="Date and time" htmlFor="tcdate">
            <Input
              id="tcdate"
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </ToolField>
          {toTimestamp !== null ? (
            <ResultBox className="mt-3" label="Unix timestamp">
              <span className="font-mono text-lg font-semibold tabular-nums">{toTimestamp}</span>
            </ResultBox>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Pick a valid date.</p>
          )}
        </div>
      </div>
    </ToolPanel>
  )
}