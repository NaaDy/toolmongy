"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import QRCode from "qrcode"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToolPanel, ToolField, ResultBox } from "@/components/tools/tool-ui"
import { CopyButton } from "@/components/tools/copy-button"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

function secureRandomInt(max: number) {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return arr[0] % max
}

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: true })
  const [password, setPassword] = useState("")

  const generate = useCallback(() => {
    const pool = Object.entries(opts)
      .filter(([, on]) => on)
      .map(([k]) => SETS[k as keyof typeof SETS])
      .join("")
    if (!pool) {
      setPassword("")
      return
    }
    let out = ""
    for (let i = 0; i < length; i++) out += pool[secureRandomInt(pool.length)]
    setPassword(out)
  }, [length, opts])

  useEffect(() => {
    generate()
  }, [generate])

  const strength = useMemo(() => {
    const variety = Object.values(opts).filter(Boolean).length
    const score = Math.min(4, Math.floor(length / 8) + variety - 1)
    return ["Weak", "Fair", "Good", "Strong", "Very strong"][Math.max(0, score)]
  }, [length, opts])

  return (
    <ToolPanel>
      <ResultBox label="Generated password">
        <div className="flex flex-wrap items-center gap-3">
          <code className="min-w-0 flex-1 break-all font-mono text-base text-foreground">
            {password || "Select at least one character type"}
          </code>
          <div className="flex gap-2">
            <CopyButton value={password} label="Copy" />
            <Button type="button" variant="outline" size="sm" onClick={generate} aria-label="Regenerate">
              <Icon name="rotate-ccw" className="size-4" />
            </Button>
          </div>
        </div>
      </ResultBox>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="pglen" className="text-sm font-medium">
            Length: {length}
          </label>
          <span className="text-xs font-medium text-primary">{strength}</span>
        </div>
        <input
          id="pglen"
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="mt-2 w-full accent-primary"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(SETS) as (keyof typeof SETS)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setOpts((o) => ({ ...o, [k]: !o[k] }))}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors",
              opts[k]
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary text-secondary-foreground hover:bg-muted",
            )}
          >
            {k}
          </button>
        ))}
      </div>
    </ToolPanel>
  )
}

export function RandomNumberGenerator() {
  const [min, setMin] = useState("1")
  const [max, setMax] = useState("100")
  const [qty, setQty] = useState("1")
  const [unique, setUnique] = useState(false)
  const [results, setResults] = useState<number[]>([])

  const generate = useCallback(() => {
    const lo = Math.ceil(Number.parseFloat(min))
    const hi = Math.floor(Number.parseFloat(max))
    const n = Math.max(1, Math.min(1000, Number.parseInt(qty, 10) || 1))
    if (Number.isNaN(lo) || Number.isNaN(hi) || hi < lo) {
      setResults([])
      return
    }
    const range = hi - lo + 1
    if (unique && n > range) {
      setResults([])
      return
    }
    const out: number[] = []
    const used = new Set<number>()
    while (out.length < n) {
      const v = lo + secureRandomInt(range)
      if (unique) {
        if (used.has(v)) continue
        used.add(v)
      }
      out.push(v)
    }
    setResults(out)
  }, [min, max, qty, unique])

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-3">
        <ToolField label="Minimum" htmlFor="rmin">
          <Input id="rmin" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} />
        </ToolField>
        <ToolField label="Maximum" htmlFor="rmax">
          <Input id="rmax" inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} />
        </ToolField>
        <ToolField label="How many" htmlFor="rqty">
          <Input id="rqty" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
        </ToolField>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-primary" />
        No repeats (unique numbers)
      </label>
      <div className="mt-4 flex items-center gap-3">
        <Button type="button" onClick={generate}>
          <Icon name="dices" className="size-4" />
          Generate
        </Button>
        {results.length > 0 ? <CopyButton value={results.join(", ")} label="Copy" /> : null}
      </div>
      {results.length > 0 ? (
        <ResultBox className="mt-4" label="Result">
          <div className="flex flex-wrap gap-2">
            {results.map((r, i) => (
              <span key={i} className="rounded-md bg-card px-2.5 py-1 font-mono text-sm font-medium tabular-nums">
                {r}
              </span>
            ))}
          </div>
        </ResultBox>
      ) : null}
    </ToolPanel>
  )
}

function uuidv4() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0"))
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex
    .slice(8, 10)
    .join("")}-${hex.slice(10, 16).join("")}`
}

export function UuidGenerator() {
  const [qty, setQty] = useState("5")
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback(() => {
    const n = Math.max(1, Math.min(100, Number.parseInt(qty, 10) || 1))
    setUuids(Array.from({ length: n }, () => uuidv4()))
  }, [qty])

  useEffect(() => {
    generate()
  }, [generate])

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-end gap-3">
        <div className="max-w-32">
          <ToolField label="How many" htmlFor="uq">
            <Input id="uq" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
          </ToolField>
        </div>
        <Button type="button" onClick={generate}>
          <Icon name="rotate-ccw" className="size-4" />
          Regenerate
        </Button>
        <CopyButton value={uuids.join("\n")} label="Copy all" />
      </div>
      <ResultBox className="mt-4" label="UUID v4">
        <div className="flex flex-col gap-1.5">
          {uuids.map((u, i) => (
            <code key={i} className="font-mono text-sm text-foreground">
              {u}
            </code>
          ))}
        </div>
      </ResultBox>
    </ToolPanel>
  )
}

export function QrCodeGenerator() {
  const [text, setText] = useState("https://")
  const [dataUrl, setDataUrl] = useState("")

  useEffect(() => {
    let active = true
    if (!text.trim()) {
      setDataUrl("")
      return
    }
    QRCode.toDataURL(text, { width: 512, margin: 2, errorCorrectionLevel: "M" })
      .then((url) => {
        if (active) setDataUrl(url)
      })
      .catch(() => {
        if (active) setDataUrl("")
      })
    return () => {
      active = false
    }
  }, [text])

  return (
    <ToolPanel>
      <ToolField label="Text or URL" htmlFor="qr" hint="Encode a link, text, Wi-Fi credentials, or contact details.">
        <Input id="qr" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" />
      </ToolField>
      {dataUrl ? (
        <div className="mt-5 flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl || "/placeholder.svg"}
            alt="Generated QR code"
            className="size-56 rounded-lg border border-border bg-card p-3"
          />
          <a
            href={dataUrl}
            download="qr-code.png"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Icon name="download" className="size-4" />
            Download PNG
          </a>
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Enter text or a URL to generate a QR code.</p>
      )}
    </ToolPanel>
  )
}

// ─── Fake Data Generator ─────────────────────────────────────────────────────

const FIRST_NAMES = ["Alice","Bob","Carol","David","Emma","Frank","Grace","Henry","Iris","Jack","Kate","Liam","Mia","Noah","Olivia","Paul","Quinn","Rose","Sam","Tina","Uma","Victor","Wendy","Xander","Yara","Zoe"]
const LAST_NAMES  = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Taylor","Anderson","Thomas","Martin","White","Harris","Jackson","Thompson","Moore","Lee","Clark"]
const DOMAINS     = ["gmail.com","yahoo.com","outlook.com","icloud.com","hotmail.com","proton.me","example.com"]
const STREETS     = ["Main St","Oak Ave","Maple Dr","Park Blvd","Elm Rd","Cedar Ln","Pine Way","River Rd","Hill St","Lake Dr"]
const CITIES      = ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","Austin"]
const STATES      = ["NY","CA","IL","TX","AZ","PA","FL","GA","OH","NC"]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function generatePerson() {
  const first = pick(FIRST_NAMES)
  const last  = pick(LAST_NAMES)
  const domain = pick(DOMAINS)
  const email  = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1,99)}@${domain}`
  const phone  = `+1 (${randInt(200,999)}) ${randInt(100,999)}-${randInt(1000,9999)}`
  const street = `${randInt(1,9999)} ${pick(STREETS)}`
  const city   = pick(CITIES)
  const state  = pick(STATES)
  const zip    = String(randInt(10000,99999))
  return { name: `${first} ${last}`, email, phone, address: `${street}, ${city}, ${state} ${zip}` }
}

type Person = ReturnType<typeof generatePerson>

export function FakeDataGenerator() {
  const [count, setCount] = useState(5)
  const [people, setPeople] = useState<Person[]>(() =>
    Array.from({ length: 5 }, generatePerson)
  )
  const [format, setFormat] = useState<"table" | "json">("table")

  const generate = () => setPeople(Array.from({ length: count }, generatePerson))

  const json = JSON.stringify(people, null, 2)

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">Count:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={e => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
            className="w-20 rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex rounded-md border overflow-hidden">
          {(["table","json"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn("px-4 py-2 text-sm font-medium transition-colors",
                format === f ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
              )}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <Button onClick={generate}>Regenerate</Button>
        <CopyButton value={json} label="Copy JSON" />
      </div>

      {format === "table" ? (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {["Name","Email","Phone","Address"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {people.map((p, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <textarea
          readOnly
          value={json}
          className="w-full min-h-96 rounded-md border bg-secondary p-4 font-mono text-sm resize-y"
        />
      )}
    </ToolPanel>
  )
}
