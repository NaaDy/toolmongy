"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { ToolPanel, ToolField, ResultBox } from "@/components/tools/tool-ui"
import { CopyButton } from "@/components/tools/copy-button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { marked } from "marked"
function utf8ToBase64(str: string) {
  return btoa(unescape(encodeURIComponent(str)))
}
function base64ToUtf8(str: string) {
  return decodeURIComponent(escape(atob(str)))
}

export function Base64Encoder() {
  const [text, setText] = useState("")
  const output = useMemo(() => {
    try {
      return text ? utf8ToBase64(text) : ""
    } catch {
      return ""
    }
  }, [text])

  return (
    <ToolPanel>
      <ToolField label="Text to encode" htmlFor="b64e">
        <Textarea
          id="b64e"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encode to Base64…"
          className="min-h-32 resize-y"
        />
      </ToolField>
      <div className="mt-4">
        <ToolField label="Base64 output" htmlFor="b64eo">
          <Textarea id="b64eo" readOnly value={output} className="min-h-32 resize-y bg-secondary font-mono" />
        </ToolField>
        <div className="mt-3">
          <CopyButton value={output} label="Copy" />
        </div>
      </div>
    </ToolPanel>
  )
}

export function Base64Decoder() {
  const [text, setText] = useState("")
  const result = useMemo(() => {
    if (!text.trim()) return { value: "", error: null as string | null }
    try {
      return { value: base64ToUtf8(text.trim()), error: null as string | null }
    } catch {
      return { value: "", error: "This doesn't look like valid Base64." }
    }
  }, [text])

  return (
    <ToolPanel>
      <ToolField label="Base64 to decode" htmlFor="b64d">
        <Textarea
          id="b64d"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a Base64 string…"
          className="min-h-32 resize-y font-mono"
        />
      </ToolField>
      <div className="mt-4">
        {result.error ? (
          <ResultBox label="Error">
            <span className="text-destructive">{result.error}</span>
          </ResultBox>
        ) : (
          <>
            <ToolField label="Decoded text" htmlFor="b64do">
              <Textarea id="b64do" readOnly value={result.value} className="min-h-32 resize-y bg-secondary" />
            </ToolField>
            <div className="mt-3">
              <CopyButton value={result.value} label="Copy" />
            </div>
          </>
        )}
      </div>
    </ToolPanel>
  )
}

export function UrlEncoder() {
  const [text, setText] = useState("")
  const output = useMemo(() => {
    try {
      return encodeURIComponent(text)
    } catch {
      return ""
    }
  }, [text])

  return (
    <ToolPanel>
      <ToolField label="Text to encode" htmlFor="urle">
        <Textarea
          id="urle"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or a query value to percent-encode…"
          className="min-h-28 resize-y"
        />
      </ToolField>
      <div className="mt-4">
        <ToolField label="Encoded output" htmlFor="urleo">
          <Textarea id="urleo" readOnly value={output} className="min-h-28 resize-y bg-secondary font-mono" />
        </ToolField>
        <div className="mt-3">
          <CopyButton value={output} label="Copy" />
        </div>
      </div>
    </ToolPanel>
  )
}

export function UrlDecoder() {
  const [text, setText] = useState("")
  const result = useMemo(() => {
    if (!text.trim()) return { value: "", error: null as string | null }
    try {
      return { value: decodeURIComponent(text), error: null as string | null }
    } catch {
      return { value: "", error: "This doesn't look like a valid percent-encoded string." }
    }
  }, [text])

  return (
    <ToolPanel>
      <ToolField label="Text to decode" htmlFor="urld">
        <Textarea
          id="urld"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a percent-encoded URL or value…"
          className="min-h-28 resize-y font-mono"
        />
      </ToolField>
      <div className="mt-4">
        {result.error ? (
          <ResultBox label="Error">
            <span className="text-destructive">{result.error}</span>
          </ResultBox>
        ) : (
          <>
            <ToolField label="Decoded output" htmlFor="urldo">
              <Textarea id="urldo" readOnly value={result.value} className="min-h-28 resize-y bg-secondary" />
            </ToolField>
            <div className="mt-3">
              <CopyButton value={result.value} label="Copy" />
            </div>
          </>
        )}
      </div>
    </ToolPanel>
  )
}

const JSON_MODES = [
  { key: "beautify", label: "Beautify" },
  { key: "minify", label: "Minify" },
] as const

export function JsonFormatter() {
  const [text, setText] = useState("")
  const [mode, setMode] = useState<(typeof JSON_MODES)[number]["key"]>("beautify")

  const result = useMemo(() => {
    if (!text.trim()) return { value: "", error: null as string | null }
    try {
      const parsed = JSON.parse(text)
      const value = mode === "beautify" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
      return { value, error: null as string | null }
    } catch (e) {
      return { value: "", error: e instanceof Error ? e.message : "Invalid JSON." }
    }
  }, [text, mode])

  return (
    <ToolPanel>
      <ToolField label="Your JSON" htmlFor="jf">
        <Textarea
          id="jf"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='{"example": true}'
          className="min-h-40 resize-y font-mono"
        />
      </ToolField>
      <div className="mt-4 flex flex-wrap gap-2">
        {JSON_MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              mode === m.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary text-secondary-foreground hover:bg-muted",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {result.error ? (
          <ResultBox label="Error">
            <span className="text-destructive">{result.error}</span>
          </ResultBox>
        ) : (
          <>
            <ToolField label="Result" htmlFor="jfo">
              <Textarea id="jfo" readOnly value={result.value} className="min-h-40 resize-y bg-secondary font-mono" />
            </ToolField>
            <div className="mt-3">
              <CopyButton value={result.value} label="Copy" />
            </div>
          </>
        )}
      </div>
    </ToolPanel>
  )
}

export function JsonValidator() {
  const [text, setText] = useState("")
  const result = useMemo(() => {
    if (!text.trim()) return { valid: null as boolean | null, error: null as string | null }
    try {
      JSON.parse(text)
      return { valid: true, error: null as string | null }
    } catch (e) {
      return { valid: false, error: e instanceof Error ? e.message : "Invalid JSON." }
    }
  }, [text])

  return (
    <ToolPanel>
      <ToolField label="Your JSON" htmlFor="jv">
        <Textarea
          id="jv"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='{"example": true}'
          className="min-h-40 resize-y font-mono"
        />
      </ToolField>
      {result.valid !== null ? (
        <ResultBox className="mt-4" label="Result">
          {result.valid ? (
            <span className="font-medium text-primary">Valid JSON ✓</span>
          ) : (
            <span className="text-destructive">{result.error}</span>
          )}
        </ResultBox>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Paste JSON to check whether it&apos;s valid.</p>
      )}
    </ToolPanel>
  )
}

export function JwtDecoder() {
  const [token, setToken] = useState("")
  
  const result = useMemo(() => {
    if (!token.trim()) return { header: "", payload: "", error: null }
    try {
      const parts = token.split('.')
      if (parts.length !== 3) throw new Error("Invalid JWT format. Must have 3 parts separated by dots.")
      
      const header = JSON.stringify(JSON.parse(base64ToUtf8(parts[0])), null, 2)
      const payload = JSON.stringify(JSON.parse(base64ToUtf8(parts[1])), null, 2)
      
      return { header, payload, error: null }
    } catch (e) {
      return { header: "", payload: "", error: e instanceof Error ? e.message : "Invalid JWT." }
    }
  }, [token])

  return (
    <ToolPanel>
      <ToolField label="JWT Token" htmlFor="jwt">
        <Textarea
          id="jwt"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="min-h-32 resize-y font-mono"
        />
      </ToolField>
      <div className="mt-4">
        {result.error ? (
          <ResultBox label="Error">
            <span className="text-destructive">{result.error}</span>
          </ResultBox>
        ) : result.header ? (
          <div className="space-y-4">
            <ToolField label="Header (Algorithm & Token Type)" htmlFor="jwth">
              <Textarea id="jwth" readOnly value={result.header} className="min-h-24 resize-y bg-secondary font-mono" />
            </ToolField>
            <ToolField label="Payload (Data)" htmlFor="jwtp">
              <Textarea id="jwtp" readOnly value={result.payload} className="min-h-40 resize-y bg-secondary font-mono" />
            </ToolField>
          </div>
        ) : null}
      </div>
    </ToolPanel>
  )
}

export function CssGradientGenerator() {
  const [color1, setColor1] = useState("#4f46e5")
  const [color2, setColor2] = useState("#ec4899")
  const [direction, setDirection] = useState("to right")
  const [type, setType] = useState("linear-gradient")

  const css = `${type}(${type === "linear-gradient" ? direction + ", " : ""}${color1}, ${color2})`

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(val) => val && setType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear-gradient">Linear</SelectItem>
                <SelectItem value="radial-gradient">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "linear-gradient" && (
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select value={direction} onValueChange={(val) => val && setDirection(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to right">To Right</SelectItem>
                  <SelectItem value="to left">To Left</SelectItem>
                  <SelectItem value="to bottom">To Bottom</SelectItem>
                  <SelectItem value="to top">To Top</SelectItem>
                  <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                  <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                  <SelectItem value="to top right">To Top Right</SelectItem>
                  <SelectItem value="to top left">To Top Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color 1</Label>
              <div className="flex space-x-2">
                <Input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-12 p-1 h-10" />
                <Input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="font-mono uppercase" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color 2</Label>
              <div className="flex space-x-2">
                <Input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-12 p-1 h-10" />
                <Input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="font-mono uppercase" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Preview</Label>
          <div 
            className="w-full h-48 rounded-lg shadow-inner border"
            style={{ background: css }}
          />
          
          <ToolField label="CSS Code" htmlFor="css-code">
            <Textarea 
              id="css-code" 
              readOnly 
              value={`background: ${css};`} 
              className="min-h-20 resize-y bg-secondary font-mono" 
            />
          </ToolField>
          <CopyButton value={`background: ${css};`} label="Copy CSS" />
        </div>
      </div>
    </ToolPanel>
  )
}

export function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.")

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null, parts: [{ text, isMatch: false }] }
    try {
      const regex = new RegExp(pattern, flags)
      const matches = Array.from(text.matchAll(regex))
      
      const parts = []
      let lastIndex = 0
      
      // Re-evaluate to get parts for highlighting
      const splitRegex = new RegExp(pattern, flags)
      let match
      while ((match = splitRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ text: text.slice(lastIndex, match.index), isMatch: false })
        }
        parts.push({ text: match[0], isMatch: true })
        lastIndex = match.index + match[0].length
        if (!splitRegex.global) break
      }
      
      if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), isMatch: false })
      }

      return { matches: matches.map(m => m[0]), error: null, parts: parts.length ? parts : [{ text, isMatch: false }] }
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : "Invalid Regex", parts: [{ text, isMatch: false }] }
    }
  }, [pattern, flags, text])

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="space-y-2 flex-1">
            <Label htmlFor="regex">Regular Expression</Label>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-mono text-muted-foreground">/</span>
              <Input
                id="regex"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+"
                className="font-mono"
              />
              <span className="text-xl font-mono text-muted-foreground">/</span>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="g"
                className="w-16 font-mono"
                maxLength={6}
              />
            </div>
          </div>
        </div>

        <ToolField label="Test String" htmlFor="testStr">
          <Textarea
            id="testStr"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32 resize-y"
          />
        </ToolField>

        <div>
          <Label className="mb-2 block">Match Result</Label>
          {result.error ? (
            <ResultBox>
              <span className="text-destructive">{result.error}</span>
            </ResultBox>
          ) : (
            <div className="bg-secondary p-4 rounded-md border min-h-32 whitespace-pre-wrap break-words">
              {result.parts.map((p, i) => (
                <span key={i} className={p.isMatch ? "bg-primary/30 text-primary-foreground rounded-sm px-0.5 font-bold" : ""}>
                  {p.text}
                </span>
              ))}
            </div>
          )}
          {!result.error && result.matches.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2 text-right">
              Found {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
            </p>
          )}
        </div>
      </div>
    </ToolPanel>
  )
}

export function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState("# Hello World\n\nWrite some **markdown** here.\n\n- It is fast\n- It is client-side\n\n```js\nconsole.log('Awesome!');\n```")
  
  const html = useMemo(() => {
    try {
      return marked.parse(markdown) as string
    } catch {
      return ""
    }
  }, [markdown])

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-2">
        <ToolField label="Markdown" htmlFor="md">
          <Textarea
            id="md"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-[400px] resize-none font-mono"
          />
        </ToolField>

        <ToolField label="HTML Preview" htmlFor="html">
          <div 
            className="min-h-[400px] prose dark:prose-invert max-w-none border rounded-md p-4 overflow-y-auto bg-background"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </ToolField>
      </div>

      <div className="mt-4">
        <ToolField label="Raw HTML Code" htmlFor="raw-html">
          <Textarea id="raw-html" readOnly value={html} className="min-h-32 resize-y bg-secondary font-mono" />
        </ToolField>
        <div className="mt-3">
          <CopyButton value={html} label="Copy HTML" />
        </div>
      </div>
    </ToolPanel>
  )
}