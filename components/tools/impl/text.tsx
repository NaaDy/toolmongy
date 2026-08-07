"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ToolPanel, ToolField, StatGrid, Stat } from "@/components/tools/tool-ui"
import { CopyButton } from "@/components/tools/copy-button"
import { cn } from "@/lib/utils"

function textStats(text: string) {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, "").length
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0
  const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter(Boolean).length : 0
  const readingTime = Math.max(1, Math.round(words / 200))
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime }
}

export function WordCounter() {
  const [text, setText] = useState("")
  const s = useMemo(() => textStats(text), [text])
  return (
    <ToolPanel>
      <ToolField label="Your text" htmlFor="wc">
        <Textarea
          id="wc"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here…"
          className="min-h-40 resize-y"
        />
      </ToolField>
      <StatGrid className="mt-4 grid-cols-2 sm:grid-cols-3">
        <Stat value={s.words} label="Words" />
        <Stat value={s.characters} label="Characters" />
        <Stat value={s.sentences} label="Sentences" />
        <Stat value={s.paragraphs} label="Paragraphs" />
        <Stat value={s.charactersNoSpaces} label="No spaces" />
        <Stat value={`${s.readingTime} min`} label="Reading time" />
      </StatGrid>
    </ToolPanel>
  )
}

export function CharacterCounter() {
  const [text, setText] = useState("")
  const [limit, setLimit] = useState("280")
  const count = text.length
  const max = Number.parseInt(limit, 10)
  const over = !Number.isNaN(max) && count > max
  return (
    <ToolPanel>
      <div className="mb-4 max-w-40">
        <ToolField label="Character limit" htmlFor="cl">
          <Input id="cl" inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value)} />
        </ToolField>
      </div>
      <ToolField label="Your text" htmlFor="cc">
        <Textarea
          id="cc"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type to count characters…"
          className="min-h-40 resize-y"
        />
      </ToolField>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-secondary p-4">
        <span className="text-sm text-muted-foreground">Characters used</span>
        <span className={cn("text-lg font-semibold tabular-nums", over ? "text-destructive" : "text-foreground")}>
          {count}
          {!Number.isNaN(max) ? ` / ${max}` : ""}
        </span>
      </div>
    </ToolPanel>
  )
}

const CASES: { key: string; label: string; fn: (s: string) => string }[] = [
  { key: "upper", label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { key: "lower", label: "lowercase", fn: (s) => s.toLowerCase() },
  {
    key: "title",
    label: "Title Case",
    fn: (s) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
  },
  {
    key: "sentence",
    label: "Sentence case",
    fn: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  { key: "camel", label: "camelCase", fn: (s) => toDelimited(s).map((w, i) => (i === 0 ? w : cap(w))).join("") },
  { key: "snake", label: "snake_case", fn: (s) => toDelimited(s).join("_") },
  { key: "kebab", label: "kebab-case", fn: (s) => toDelimited(s).join("-") },
]

export function TextCaseConverter() {
  const [text, setText] = useState("")
  const [active, setActive] = useState("upper")
  const output = useMemo(() => {
    const c = CASES.find((x) => x.key === active)
    return c ? c.fn(text) : text
  }, [text, active])

  return (
    <ToolPanel>
      <ToolField label="Input text" htmlFor="tcc">
        <Textarea
          id="tcc"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert…"
          className="min-h-28 resize-y"
        />
      </ToolField>
      <div className="mt-4 flex flex-wrap gap-2">
        {CASES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActive(c.key)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              active === c.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary text-secondary-foreground hover:bg-muted",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <ToolField label="Result" htmlFor="tco">
          <Textarea id="tco" readOnly value={output} className="min-h-28 resize-y bg-secondary" />
        </ToolField>
        <div className="mt-3">
          <CopyButton value={output} label="Copy result" />
        </div>
      </div>
    </ToolPanel>
  )
}

const LOREM =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  )

export function LoremIpsumGenerator() {
  const [count, setCount] = useState("3")
  const output = useMemo(() => {
    const n = Math.min(50, Math.max(1, Number.parseInt(count, 10) || 1))
    const paragraphs: string[] = []
    for (let i = 0; i < n; i++) {
      const len = 40 + Math.floor(Math.random() * 30)
      const words: string[] = []
      for (let j = 0; j < len; j++) words.push(LOREM[Math.floor(Math.random() * LOREM.length)])
      let text = words.join(" ")
      text = text.charAt(0).toUpperCase() + text.slice(1) + "."
      paragraphs.push(i === 0 ? "Lorem ipsum dolor sit amet, " + text : text)
    }
    return paragraphs.join("\n\n")
    // Regenerate when count changes; deterministic enough for placeholder text.
  }, [count])

  return (
    <ToolPanel>
      <div className="max-w-40">
        <ToolField label="Paragraphs" htmlFor="lp">
          <Input id="lp" inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value)} />
        </ToolField>
      </div>
      <div className="mt-4">
        <ToolField label="Generated text" htmlFor="lo">
          <Textarea id="lo" readOnly value={output} className="min-h-48 resize-y bg-secondary" />
        </ToolField>
        <div className="mt-3">
          <CopyButton value={output} label="Copy text" />
        </div>
      </div>
    </ToolPanel>
  )
}

function toDelimited(s: string): string[] {
  return (
    s
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean) || []
  )
}
function cap(w: string) {
  return w.charAt(0).toUpperCase() + w.slice(1)
}

export function SlugGenerator() {
  const [text, setText] = useState("")
  const [separator, setSeparator] = useState("-")

  const slug = useMemo(() => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, separator)
      .replace(/^-+|-+$/g, "")
  }, [text, separator])

  return (
    <ToolPanel>
      <ToolField label="Title / Text" htmlFor="slug-text">
        <Textarea
          id="slug-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your title here..."
          className="min-h-32 resize-y"
        />
      </ToolField>
      
      <div className="mt-4 flex items-center space-x-4">
        <label className="text-sm font-medium">Separator:</label>
        <div className="flex space-x-2">
          <button
            onClick={() => setSeparator("-")}
            className={cn("px-3 py-1 rounded-md border text-sm", separator === "-" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted")}
          >
            Dash (-)
          </button>
          <button
            onClick={() => setSeparator("_")}
            className={cn("px-3 py-1 rounded-md border text-sm", separator === "_" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted")}
          >
            Underscore (_)
          </button>
        </div>
      </div>

      <div className="mt-4">
        <ToolField label="Generated Slug" htmlFor="slug-out">
          <Input id="slug-out" readOnly value={slug} className="bg-secondary font-mono" />
        </ToolField>
        <div className="mt-3">
          <CopyButton value={slug} label="Copy Slug" />
        </div>
      </div>
    </ToolPanel>
  )
}

export function DiffChecker() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")

  const diff = useMemo(() => {
    const lines1 = text1.split('\\n')
    const lines2 = text2.split('\\n')
    const max = Math.max(lines1.length, lines2.length)
    const result = []

    for (let i = 0; i < max; i++) {
      const l1 = lines1[i]
      const l2 = lines2[i]
      if (l1 === l2) {
        result.push({ type: 'equal', text: l1, num: i + 1 })
      } else if (l1 !== undefined && l2 === undefined) {
        result.push({ type: 'removed', text: l1, num: i + 1 })
      } else if (l1 === undefined && l2 !== undefined) {
        result.push({ type: 'added', text: l2, num: i + 1 })
      } else {
        result.push({ type: 'removed', text: l1, num: i + 1 })
        result.push({ type: 'added', text: l2, num: i + 1 })
      }
    }
    return result
  }, [text1, text2])

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-2">
        <ToolField label="Original Text" htmlFor="t1">
          <Textarea
            id="t1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="min-h-64 resize-y font-mono text-sm leading-tight"
            placeholder="Paste original text here..."
          />
        </ToolField>
        <ToolField label="Changed Text" htmlFor="t2">
          <Textarea
            id="t2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            className="min-h-64 resize-y font-mono text-sm leading-tight"
            placeholder="Paste changed text here..."
          />
        </ToolField>
      </div>
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">Differences</label>
        <div className="bg-background border rounded-md p-4 min-h-32 overflow-x-auto text-sm font-mono leading-tight space-y-1">
          {(!text1 && !text2) ? (
            <div className="text-muted-foreground text-center pt-8">Paste text in both boxes to see differences.</div>
          ) : diff.map((line, i) => (
            <div 
              key={i} 
              className={cn(
                "flex px-2 py-0.5 rounded-sm",
                line.type === 'added' ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                line.type === 'removed' ? "bg-red-500/20 text-red-700 dark:text-red-400" : "text-muted-foreground"
              )}
            >
              <span className="w-8 select-none opacity-50 shrink-0">{line.num}</span>
              <span className="w-4 select-none shrink-0">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
              </span>
              <span className="whitespace-pre-wrap break-all">{line.text || ' '}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolPanel>
  )
}
