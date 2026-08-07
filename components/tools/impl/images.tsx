"use client"

import { useCallback, useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ToolPanel, ToolField, ResultBox, StatGrid, Stat } from "@/components/tools/tool-ui"
import { CopyButton } from "@/components/tools/copy-button"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Could not load this image."))
    img.src = URL.createObjectURL(file)
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Could not export this image."))
      },
      type,
      quality,
    )
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function FileInput({ id, onFile }: { id: string; onFile: (file: File) => void }) {
  return (
    <input
      id={id}
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) onFile(file)
      }}
      className="block w-full cursor-pointer rounded-md border border-border bg-secondary text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
    />
  )
}

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(0.7)
  const [format, setFormat] = useState<"image/jpeg" | "image/webp">("image/jpeg")
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compress = useCallback(async (f: File, q: number, fmt: string) => {
    setBusy(true)
    setError(null)
    try {
      const img = await loadImage(f)
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas not supported in this browser.")
      ctx.drawImage(img, 0, 0)
      const blob = await canvasToBlob(canvas, fmt, q)
      setResult({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setBusy(false)
    }
  }, [])

  const handleFile = (f: File) => {
    setFile(f)
    compress(f, quality, format)
  }
  const handleQuality = (q: number) => {
    setQuality(q)
    if (file) compress(file, q, format)
  }
  const handleFormat = (fmt: "image/jpeg" | "image/webp") => {
    setFormat(fmt)
    if (file) compress(file, quality, fmt)
  }

  const savings = file && result ? Math.round((1 - result.size / file.size) * 100) : null

  return (
    <ToolPanel>
      <ToolField label="Choose an image" htmlFor="icf">
        <FileInput id="icf" onFile={handleFile} />
      </ToolField>

      {file ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["image/jpeg", "image/webp"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFormat(f)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                  format === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-muted",
                )}
              >
                {f === "image/jpeg" ? "JPEG" : "WebP"}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor="icq" className="text-sm font-medium">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              id="icq"
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => handleQuality(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </div>

          {error ? (
            <ResultBox className="mt-4" label="Error">
              <span className="text-destructive">{error}</span>
            </ResultBox>
          ) : result ? (
            <div className="mt-5 flex flex-col gap-4">
              <StatGrid className="sm:grid-cols-3">
                <Stat value={formatBytes(file.size)} label="Original" />
                <Stat value={formatBytes(result.size)} label="Compressed" />
                <Stat value={savings !== null ? `${savings}%` : "—"} label="Smaller by" />
              </StatGrid>
              <a
                href={result.url}
                download={`compressed.${format === "image/jpeg" ? "jpg" : "webp"}`}
                className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Icon name="download" className="size-4" />
                Download compressed image
              </a>
            </div>
          ) : busy ? (
            <p className="mt-5 text-sm text-muted-foreground">Compressing…</p>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Upload a JPEG, PNG, or WebP image to compress it in your browser.
        </p>
      )}
    </ToolPanel>
  )
}

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [lockRatio, setLockRatio] = useState(true)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    try {
      const image = await loadImage(f)
      setImg(image)
      setWidth(String(image.naturalWidth))
      setHeight(String(image.naturalHeight))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load this image.")
    }
  }

  const handleWidth = (v: string) => {
    setWidth(v)
    if (lockRatio && img) {
      const w = Number.parseInt(v, 10)
      if (!Number.isNaN(w) && img.naturalWidth > 0) {
        setHeight(String(Math.round((w * img.naturalHeight) / img.naturalWidth)))
      }
    }
  }
  const handleHeight = (v: string) => {
    setHeight(v)
    if (lockRatio && img) {
      const h = Number.parseInt(v, 10)
      if (!Number.isNaN(h) && img.naturalHeight > 0) {
        setWidth(String(Math.round((h * img.naturalWidth) / img.naturalHeight)))
      }
    }
  }

  const resize = useCallback(async () => {
    if (!img || !file) return
    const w = Number.parseInt(width, 10)
    const h = Number.parseInt(height, 10)
    if (Number.isNaN(w) || Number.isNaN(h) || w <= 0 || h <= 0) {
      setError("Enter a valid width and height.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas not supported in this browser.")
      ctx.drawImage(img, 0, 0, w, h)
      const blob = await canvasToBlob(canvas, file.type || "image/png")
      setResult({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setBusy(false)
    }
  }, [img, file, width, height])

  return (
    <ToolPanel>
      <ToolField label="Choose an image" htmlFor="irf">
        <FileInput id="irf" onFile={handleFile} />
      </ToolField>

      {img ? (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            Original size: {img.naturalWidth} × {img.naturalHeight}px
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ToolField label="Width (px)" htmlFor="irw">
              <Input id="irw" inputMode="numeric" value={width} onChange={(e) => handleWidth(e.target.value)} />
            </ToolField>
            <ToolField label="Height (px)" htmlFor="irh">
              <Input id="irh" inputMode="numeric" value={height} onChange={(e) => handleHeight(e.target.value)} />
            </ToolField>
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="accent-primary"
            />
            Lock aspect ratio
          </label>

          <div className="mt-4">
            <Button type="button" onClick={resize} disabled={busy}>
              <Icon name="scaling" className="size-4" />
              {busy ? "Resizing…" : "Resize"}
            </Button>
          </div>

          {error ? (
            <ResultBox className="mt-4" label="Error">
              <span className="text-destructive">{error}</span>
            </ResultBox>
          ) : result ? (
            <div className="mt-5 flex flex-col gap-3">
              <StatGrid className="sm:grid-cols-2">
                <Stat value={`${width} × ${height}`} label="New size" />
                <Stat value={formatBytes(result.size)} label="File size" />
              </StatGrid>
              <a
                href={result.url}
                download="resized-image"
                className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Icon name="download" className="size-4" />
                Download resized image
              </a>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Upload an image to set a new width and height.</p>
      )}
    </ToolPanel>
  )
}

const FORMATS = [
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/webp", label: "WebP", ext: "webp" },
] as const

export function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [target, setTarget] = useState<(typeof FORMATS)[number]["value"]>("image/webp")
  const [quality, setQuality] = useState(0.9)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const convert = useCallback(async (f: File, fmt: string, q: number) => {
    setBusy(true)
    setError(null)
    try {
      const img = await loadImage(f)
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas not supported in this browser.")
      ctx.drawImage(img, 0, 0)
      const blob = await canvasToBlob(canvas, fmt, fmt === "image/png" ? undefined : q)
      setResult({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setBusy(false)
    }
  }, [])

  const handleFile = (f: File) => {
    setFile(f)
    convert(f, target, quality)
  }
  const handleTarget = (fmt: (typeof FORMATS)[number]["value"]) => {
    setTarget(fmt)
    if (file) convert(file, fmt, quality)
  }
  const handleQuality = (q: number) => {
    setQuality(q)
    if (file) convert(file, target, q)
  }

  const targetInfo = FORMATS.find((f) => f.value === target)!

  return (
    <ToolPanel>
      <ToolField label="Choose an image" htmlFor="ifcf">
        <FileInput id="ifcf" onFile={handleFile} />
      </ToolField>

      {file ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => handleTarget(f.value)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                  target === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {target !== "image/png" ? (
            <div className="mt-4">
              <label htmlFor="ifcq" className="text-sm font-medium">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                id="ifcq"
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => handleQuality(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>
          ) : null}

          {error ? (
            <ResultBox className="mt-4" label="Error">
              <span className="text-destructive">{error}</span>
            </ResultBox>
          ) : result ? (
            <div className="mt-5 flex flex-col gap-3">
              <StatGrid className="sm:grid-cols-2">
                <Stat value={formatBytes(file.size)} label="Original" />
                <Stat value={formatBytes(result.size)} label={`${targetInfo.label} size`} />
              </StatGrid>
              <a
                href={result.url}
                download={`converted.${targetInfo.ext}`}
                className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Icon name="download" className="size-4" />
                Download {targetInfo.label}
              </a>
            </div>
          ) : busy ? (
            <p className="mt-5 text-sm text-muted-foreground">Converting…</p>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Upload an image to convert it to PNG, JPEG, or WebP.</p>
      )}
    </ToolPanel>
  )
}

export function ImageToBase64Converter() {
  const [dataUrl, setDataUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFile = (f: File) => {
    setError(null)
    setFileName(f.name)
    const reader = new FileReader()
    reader.onload = () => setDataUrl(String(reader.result ?? ""))
    reader.onerror = () => setError("Could not read this file.")
    reader.readAsDataURL(f)
  }

  return (
    <ToolPanel>
      <ToolField label="Choose an image" htmlFor="b64if">
        <FileInput id="b64if" onFile={handleFile} />
      </ToolField>

      {error ? (
        <ResultBox className="mt-4" label="Error">
          <span className="text-destructive">{error}</span>
        </ResultBox>
      ) : dataUrl ? (
        <div className="mt-5 flex flex-col gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl || "/placeholder.svg"}
            alt={fileName}
            className="max-h-48 w-fit rounded-lg border border-border bg-card object-contain p-2"
          />
          <ToolField label="Base64 data URL" htmlFor="b64io">
            <Textarea
              id="b64io"
              readOnly
              value={dataUrl}
              className="min-h-32 resize-y bg-secondary font-mono text-xs"
            />
          </ToolField>
          <div>
            <CopyButton value={dataUrl} label="Copy data URL" />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Upload an image to get its Base64-encoded data URL.</p>
      )}
    </ToolPanel>
  )
}

const FAVICON_SIZES = [16, 32, 48, 180, 192, 512]

export function FaviconGenerator() {
  const [icons, setIcons] = useState<{ size: number; url: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (f: File) => {
    setError(null)
    setIcons([])
    setBusy(true)
    try {
      const image = await loadImage(f)
      const generated: { size: number; url: string }[] = []
      for (const size of FAVICON_SIZES) {
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Canvas not supported in this browser.")
        ctx.drawImage(image, 0, 0, size, size)
        const blob = await canvasToBlob(canvas, "image/png")
        generated.push({ size, url: URL.createObjectURL(blob) })
      }
      setIcons(generated)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process this image.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <ToolPanel>
      <ToolField label="Choose an image" htmlFor="fgf" hint="A square image works best (e.g. 512×512).">
        <FileInput id="fgf" onFile={handleFile} />
      </ToolField>

      {error ? (
        <ResultBox className="mt-4" label="Error">
          <span className="text-destructive">{error}</span>
        </ResultBox>
      ) : busy ? (
        <p className="mt-4 text-sm text-muted-foreground">Generating favicons…</p>
      ) : icons.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {icons.map((icon) => (
            <div
              key={icon.size}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={icon.url || "/placeholder.svg"}
                alt={`${icon.size}x${icon.size} favicon`}
                width={48}
                height={48}
                className="rounded"
              />
              <span className="text-xs text-muted-foreground">
                {icon.size}×{icon.size}
              </span>
              <a
                href={icon.url}
                download={`favicon-${icon.size}x${icon.size}.png`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Icon name="download" className="size-3.5" />
                Download
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Upload an image to generate favicon sizes for browsers, iOS, and Android.
        </p>
      )}
    </ToolPanel>
  )
}

// ─── Color Palette Generator ────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

export function ColorPaletteGenerator() {
  const [baseHex, setBaseHex] = useState("#4f46e5")
  const [copied, setCopied] = useState<string | null>(null)

  const [h, s, l] = hexToHsl(baseHex)

  const palettes = {
    Complementary: [
      { label: "Base", hex: baseHex },
      { label: "Complement", hex: hslToHex((h + 180) % 360, s, l) },
    ],
    Analogous: [
      { label: "-30°", hex: hslToHex((h - 30 + 360) % 360, s, l) },
      { label: "Base", hex: baseHex },
      { label: "+30°", hex: hslToHex((h + 30) % 360, s, l) },
    ],
    Triadic: [
      { label: "Base", hex: baseHex },
      { label: "+120°", hex: hslToHex((h + 120) % 360, s, l) },
      { label: "+240°", hex: hslToHex((h + 240) % 360, s, l) },
    ],
    Shades: [90, 75, 60, 45, 30, 15].map(shade => ({
      label: `${shade}%`,
      hex: hslToHex(h, s, shade),
    })),
  }

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolPanel>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Input
            type="color"
            value={baseHex}
            onChange={e => setBaseHex(e.target.value)}
            className="w-14 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={baseHex}
            onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setBaseHex(e.target.value)}
            className="w-32 font-mono uppercase"
            maxLength={7}
          />
        </div>
        <p className="text-sm text-muted-foreground">HSL: {h}°, {s}%, {l}%</p>
      </div>

      <div className="space-y-8">
        {Object.entries(palettes).map(([name, swatches]) => (
          <div key={name}>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">{name}</h3>
            <div className="flex flex-wrap gap-3">
              {swatches.map((swatch) => (
                <button
                  key={swatch.hex}
                  onClick={() => copyHex(swatch.hex)}
                  className="group relative flex flex-col items-center gap-2 transition-transform hover:scale-105"
                  title={`Click to copy ${swatch.hex}`}
                >
                  <div
                    className="w-16 h-16 rounded-xl shadow-md border border-white/20"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {copied === swatch.hex ? "Copied!" : swatch.hex}
                  </span>
                  <span className="text-xs text-muted-foreground/60">{swatch.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolPanel>
  )
}

// ─── SVG Optimizer ───────────────────────────────────────────────────────────

export function SvgOptimizer() {
  const [input, setInput] = useState("")

  const optimized = useMemo(() => {
    if (!input.trim()) return ""
    return input
      .replace(/<!--[\s\S]*?-->/g, "")           // Remove comments
      .replace(/\s+/g, " ")                        // Collapse whitespace
      .replace(/>\s+</g, "><")                     // Remove space between tags
      .replace(/\s*([:;{},>~+])\s*/g, "$1")        // Trim around operators
      .replace(/\s+\/>/g, "/>")                    // Clean self-closing tags
      .trim()
  }, [input])

  const savings = input.length > 0
    ? Math.round(((input.length - optimized.length) / input.length) * 100)
    : 0

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-2">
        <ToolField label="Original SVG" htmlFor="svg-in">
          <Textarea
            id="svg-in"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your SVG code here..."
            className="min-h-64 resize-y font-mono text-sm"
          />
          {input && (
            <p className="text-xs text-muted-foreground mt-1 text-right">{input.length} chars</p>
          )}
        </ToolField>
        <div className="space-y-4">
          <ToolField label="Optimized SVG" htmlFor="svg-out">
            <Textarea
              id="svg-out"
              readOnly
              value={optimized}
              className="min-h-64 resize-y font-mono text-sm bg-secondary"
            />
            {optimized && (
              <p className="text-xs text-muted-foreground mt-1 text-right">{optimized.length} chars</p>
            )}
          </ToolField>
          {savings > 0 && (
            <div className="rounded-lg border bg-primary/10 p-4 text-center">
              <p className="text-2xl font-bold text-primary">{savings}% smaller</p>
              <p className="text-sm text-muted-foreground mt-1">
                Saved {input.length - optimized.length} characters
              </p>
            </div>
          )}
          <CopyButton value={optimized} label="Copy Optimized SVG" />
        </div>
      </div>
    </ToolPanel>
  )
}