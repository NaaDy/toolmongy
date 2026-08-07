"use client"

import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToolPanel, ToolField, ResultBox, StatGrid, Stat } from "@/components/tools/tool-ui"
import { Icon } from "@/components/icon"

const downloadLinkClass =
  "inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  // pdf-lib's Uint8Array<ArrayBufferLike> doesn't satisfy BlobPart under
  // strict TS lib.dom typings — this cast is safe, the bytes are unchanged.
  return new Blob([bytes as unknown as BlobPart], { type })
}

function FileInput({
  id,
  accept,
  onFile,
}: {
  id: string
  accept: string
  onFile: (file: File) => void
}) {
  return (
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) onFile(file)
      }}
      className="block w-full cursor-pointer rounded-md border border-border bg-secondary text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
    />
  )
}

function MultiFileInput({
  id,
  accept,
  files,
  onChange,
}: {
  id: string
  accept: string
  files: File[]
  onChange: (files: File[]) => void
}) {
  return (
    <div>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => {
          const list = Array.from(e.target.files ?? [])
          if (list.length) onChange([...files, ...list])
          e.target.value = ""
        }}
        className="block w-full cursor-pointer rounded-md border border-border bg-secondary text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
      />
      {files.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <span className="truncate">
                {i + 1}. {f.name}
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...files]
                    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
                    onChange(next)
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label="Move up"
                >
                  <Icon name="chevron-up" className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={i === files.length - 1}
                  onClick={() => {
                    const next = [...files]
                    ;[next[i + 1], next[i]] = [next[i], next[i + 1]]
                    onChange(next)
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label="Move down"
                >
                  <Icon name="chevron-down" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                  className="rounded p-1 text-muted-foreground hover:text-destructive"
                  aria-label="Remove"
                >
                  <Icon name="x" className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function MergePdf() {
  const [files, setFiles] = useState<File[]>([])
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const merge = useCallback(async () => {
    if (files.length < 2) {
      setError("Add at least two PDF files to merge.")
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach((p) => merged.addPage(p))
      }
      const saved = await merged.save()
      const blob = bytesToBlob(saved, "application/pdf")
      setResult({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not merge these PDFs.")
    } finally {
      setBusy(false)
    }
  }, [files])

  return (
    <ToolPanel>
      <ToolField label="Choose PDF files" htmlFor="mpf" hint="Files are merged in the order shown below.">
        <MultiFileInput id="mpf" accept="application/pdf" files={files} onChange={setFiles} />
      </ToolField>

      <div className="mt-4">
        <Button type="button" onClick={merge} disabled={busy || files.length < 2}>
          <Icon name="layers" className="size-4" />
          {busy ? "Merging…" : "Merge PDFs"}
        </Button>
      </div>

      {error ? (
        <ResultBox className="mt-4" label="Error">
          <span className="text-destructive">{error}</span>
        </ResultBox>
      ) : result ? (
        <div className="mt-5 flex flex-col gap-3">
          <StatGrid className="sm:grid-cols-2">
            <Stat value={files.length} label="Files merged" />
            <Stat value={formatBytes(result.size)} label="Output size" />
          </StatGrid>
          <a href={result.url} download="merged.pdf" className={downloadLinkClass}>
            <Icon name="download" className="size-4" />
            Download merged PDF
          </a>
        </div>
      ) : null}
    </ToolPanel>
  )
}

function parsePageRanges(input: string, pageCount: number): number[] | null {
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
  if (!parts.length) return null
  const indices: number[] = []
  for (const part of parts) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/)
    if (!m) return null
    const start = Number.parseInt(m[1], 10)
    const end = m[2] ? Number.parseInt(m[2], 10) : start
    if (start < 1 || end > pageCount || start > end) return null
    for (let i = start; i <= end; i++) indices.push(i - 1)
  }
  return indices
}

export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [range, setRange] = useState("")
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [singlePages, setSinglePages] = useState<{ page: number; url: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (f: File) => {
    setFile(f)
    setResult(null)
    setSinglePages([])
    setError(null)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const bytes = await f.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageCount(doc.getPageCount())
      setRange(`1-${doc.getPageCount()}`)
    } catch {
      setError("Could not read this PDF.")
    }
  }

  const extractRange = useCallback(async () => {
    if (!file) return
    const indices = parsePageRanges(range, pageCount)
    if (!indices) {
      setError("Enter a valid page range, e.g. 1-3,5.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, indices)
      pages.forEach((p) => out.addPage(p))
      const saved = await out.save()
      const blob = bytesToBlob(saved, "application/pdf")
      setResult({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not split this PDF.")
    } finally {
      setBusy(false)
    }
  }, [file, range, pageCount])

  const splitAll = useCallback(async () => {
    if (!file) return
    setBusy(true)
    setError(null)
    setSinglePages([])
    setResult(null)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const count = src.getPageCount()
      const out: { page: number; url: string }[] = []
      for (let i = 0; i < count; i++) {
        const doc = await PDFDocument.create()
        const [page] = await doc.copyPages(src, [i])
        doc.addPage(page)
        const saved = await doc.save()
        const blob = bytesToBlob(saved, "application/pdf")
        out.push({ page: i + 1, url: URL.createObjectURL(blob) })
      }
      setSinglePages(out)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not split this PDF.")
    } finally {
      setBusy(false)
    }
  }, [file])

  return (
    <ToolPanel>
      <ToolField label="Choose a PDF file" htmlFor="spf">
        <FileInput id="spf" accept="application/pdf" onFile={handleFile} />
      </ToolField>

      {file ? (
        <>
          <p className="mt-3 text-sm text-muted-foreground">{pageCount} pages</p>

          <div className="mt-4">
            <ToolField label="Page range to extract" htmlFor="spr" hint="e.g. 1-3,5,7-9">
              <Input id="spr" value={range} onChange={(e) => setRange(e.target.value)} />
            </ToolField>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={extractRange} disabled={busy}>
              <Icon name="scissors" className="size-4" />
              Extract range
            </Button>
            <Button type="button" variant="outline" onClick={splitAll} disabled={busy}>
              <Icon name="layers" className="size-4" />
              Split into single pages
            </Button>
          </div>

          {error ? (
            <ResultBox className="mt-4" label="Error">
              <span className="text-destructive">{error}</span>
            </ResultBox>
          ) : result ? (
            <div className="mt-5 flex flex-col gap-3">
              <StatGrid className="sm:grid-cols-1">
                <Stat value={formatBytes(result.size)} label="Output size" />
              </StatGrid>
              <a href={result.url} download="extracted.pdf" className={downloadLinkClass}>
                <Icon name="download" className="size-4" />
                Download extracted PDF
              </a>
            </div>
          ) : null}

          {singlePages.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {singlePages.map((p) => (
                <a
                  key={p.page}
                  href={p.url}
                  download={`page-${p.page}.pdf`}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-center text-xs font-medium text-primary hover:underline"
                >
                  <Icon name="file-text" className="size-5 text-muted-foreground" />
                  Page {p.page}
                </a>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Upload a PDF to extract or split its pages.</p>
      )}
    </ToolPanel>
  )
}

export function PdfToImages() {
  const [images, setImages] = useState<{ page: number; url: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (f: File) => {
    setError(null)
    setImages([])
    setBusy(true)
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

      const bytes = await f.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      const out: { page: number; url: string }[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement("canvas")
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Canvas not supported in this browser.")
        await page.render({ canvasContext: ctx, viewport, canvas }).promise
        const blob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not export this page."))), "image/png")
        })
        out.push({ page: i, url: URL.createObjectURL(blob) })
      }
      setImages(out)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert this PDF.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <ToolPanel>
      <ToolField label="Choose a PDF file" htmlFor="p2if">
        <FileInput id="p2if" accept="application/pdf" onFile={handleFile} />
      </ToolField>

      {error ? (
        <ResultBox className="mt-4" label="Error">
          <span className="text-destructive">{error}</span>
        </ResultBox>
      ) : busy ? (
        <p className="mt-4 text-sm text-muted-foreground">Converting pages…</p>
      ) : images.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.page}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url || "/placeholder.svg"}
                alt={`Page ${img.page}`}
                className="max-h-40 w-full rounded object-contain"
              />
              <span className="text-xs text-muted-foreground">Page {img.page}</span>
              <a
                href={img.url}
                download={`page-${img.page}.png`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Icon name="download" className="size-3.5" />
                Download
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Upload a PDF to convert each page into a PNG image.</p>
      )}
    </ToolPanel>
  )
}

export function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([])
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const build = useCallback(async () => {
    if (files.length === 0) {
      setError("Add at least one image.")
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const isPng = file.type === "image/png"
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes)
        const page = doc.addPage([image.width, image.height])
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
      }
      const saved = await doc.save()
      const blob = bytesToBlob(saved, "application/pdf")
      setResult({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build a PDF from these images. Use JPEG or PNG files.")
    } finally {
      setBusy(false)
    }
  }, [files])

  return (
    <ToolPanel>
      <ToolField label="Choose images" htmlFor="i2pf" hint="JPEG or PNG. Pages are added in the order shown below.">
        <MultiFileInput id="i2pf" accept="image/png,image/jpeg" files={files} onChange={setFiles} />
      </ToolField>

      <div className="mt-4">
        <Button type="button" onClick={build} disabled={busy || files.length === 0}>
          <Icon name="file-plus" className="size-4" />
          {busy ? "Building PDF…" : "Create PDF"}
        </Button>
      </div>

      {error ? (
        <ResultBox className="mt-4" label="Error">
          <span className="text-destructive">{error}</span>
        </ResultBox>
      ) : result ? (
        <div className="mt-5 flex flex-col gap-3">
          <StatGrid className="sm:grid-cols-2">
            <Stat value={files.length} label="Pages" />
            <Stat value={formatBytes(result.size)} label="Output size" />
          </StatGrid>
          <a href={result.url} download="images.pdf" className={downloadLinkClass}>
            <Icon name="download" className="size-4" />
            Download PDF
          </a>
        </div>
      ) : null}
    </ToolPanel>
  )
}

export function RotatePdf() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    setRotation(0)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const bytes = await f.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageCount(doc.getPageCount())
    } catch {
      setError("Could not read this PDF.")
    }
  }

  const rotate = useCallback(
    async (deg: number) => {
      if (!file) return
      const nextRotation = ((((rotation + deg) % 360) + 360) % 360)
      setBusy(true)
      setError(null)
      try {
        const { PDFDocument, degrees } = await import("pdf-lib")
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        doc.getPages().forEach((page) => {
          const base = page.getRotation().angle
          page.setRotation(degrees((base + nextRotation) % 360))
        })
        const saved = await doc.save()
        const blob = bytesToBlob(saved, "application/pdf")
        setResult({ url: URL.createObjectURL(blob), size: blob.size })
        setRotation(nextRotation)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not rotate this PDF.")
      } finally {
        setBusy(false)
      }
    },
    [file, rotation],
  )

  return (
    <ToolPanel>
      <ToolField label="Choose a PDF file" htmlFor="rpf">
        <FileInput id="rpf" accept="application/pdf" onFile={handleFile} />
      </ToolField>

      {file ? (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            {pageCount} pages · current rotation: {rotation}°
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => rotate(-90)} disabled={busy}>
              <Icon name="rotate-ccw" className="size-4" />
              Rotate left
            </Button>
            <Button type="button" variant="outline" onClick={() => rotate(90)} disabled={busy}>
              <Icon name="rotate-cw" className="size-4" />
              Rotate right
            </Button>
            <Button type="button" variant="outline" onClick={() => rotate(180)} disabled={busy}>
              <Icon name="refresh-cw" className="size-4" />
              Rotate 180°
            </Button>
          </div>

          {error ? (
            <ResultBox className="mt-4" label="Error">
              <span className="text-destructive">{error}</span>
            </ResultBox>
          ) : result ? (
            <div className="mt-5 flex flex-col gap-3">
              <StatGrid className="sm:grid-cols-2">
                <Stat value={`${rotation}°`} label="Applied rotation" />
                <Stat value={formatBytes(result.size)} label="Output size" />
              </StatGrid>
              <a href={result.url} download="rotated.pdf" className={downloadLinkClass}>
                <Icon name="download" className="size-4" />
                Download rotated PDF
              </a>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Upload a PDF to rotate its pages.</p>
      )}
    </ToolPanel>
  )
}