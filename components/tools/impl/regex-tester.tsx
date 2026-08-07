"use client"

import { useState, useMemo } from "react"
import { ToolPanel } from "../tool-ui"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { AlertCircle, FileText, CheckCircle2 } from "lucide-react"

const cheatsheet = [
  { pattern: ".", desc: "Any character except newline" },
  { pattern: "\\w", desc: "Word character (a-z, A-Z, 0-9, _)" },
  { pattern: "\\d", desc: "Digit (0-9)" },
  { pattern: "\\s", desc: "Whitespace (space, tab, newline)" },
  { pattern: "[abc]", desc: "Any of a, b, or c" },
  { pattern: "[^abc]", desc: "Not a, b, or c" },
  { pattern: "^", desc: "Start of string" },
  { pattern: "$", desc: "End of string" },
  { pattern: "*", desc: "0 or more" },
  { pattern: "+", desc: "1 or more" },
  { pattern: "?", desc: "0 or 1" },
  { pattern: "{3}", desc: "Exactly 3" },
]

export function RegexTester({ slug }: { slug: string }) {
  const [pattern, setPattern] = useState("\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b")
  const [flags, setFlags] = useState("gi")
  const [testString, setTestString] = useState("Contact us at support@toolmongy.com or hello@example.com.")
  const [error, setError] = useState<string | null>(null)

  const matches = useMemo(() => {
    if (!pattern) return []
    try {
      const regex = new RegExp(pattern, flags)
      setError(null)
      
      const results = []
      let match
      
      // If global flag is not set, we can only find one match to prevent infinite loops
      if (!flags.includes("g")) {
        match = regex.exec(testString)
        if (match) results.push({ text: match[0], index: match.index })
        return results
      }

      // Safeguard against zero-length matches causing infinite loops
      let lastIndex = -1
      while ((match = regex.exec(testString)) !== null) {
        if (match.index === lastIndex) {
          regex.lastIndex++
        } else {
          results.push({ text: match[0], index: match.index })
          lastIndex = match.index
        }
      }
      return results
    } catch (e: any) {
      setError(e.message)
      return []
    }
  }, [pattern, flags, testString])

  const renderHighlightedText = () => {
    if (!pattern || error || matches.length === 0) {
      return <span>{testString}</span>
    }

    let lastIndex = 0
    const nodes = []

    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        nodes.push(<span key={`text-${i}`}>{testString.substring(lastIndex, match.index)}</span>)
      }
      // Add highlighted match
      nodes.push(
        <mark key={`match-${i}`} className="bg-primary/30 text-primary-foreground rounded-sm px-0.5 border border-primary/40">
          {testString.substring(match.index, match.index + match.text.length)}
        </mark>
      )
      lastIndex = match.index + match.text.length
    })

    // Add remaining text
    if (lastIndex < testString.length) {
      nodes.push(<span key="text-end">{testString.substring(lastIndex)}</span>)
    }

    return nodes
  }

  return (
    <ToolPanel>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Regex Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Regular Expression</label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground text-lg">
                /
              </span>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="rounded-none font-mono text-base focus-visible:z-10 focus-visible:ring-primary/50 border-x-0"
                placeholder="pattern"
              />
              <span className="inline-flex items-center border border-x-0 border-input bg-muted px-2 text-muted-foreground text-lg">
                /
              </span>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-20 rounded-l-none font-mono text-base focus-visible:z-10 focus-visible:ring-primary/50"
                placeholder="flags"
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            )}
          </div>

          {/* Test String */}
          <div className="flex flex-col gap-2 flex-1 min-h-[300px]">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Test String</label>
              <div className="text-sm text-muted-foreground">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </div>
            </div>
            <div className="relative flex-1 group">
              <Textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="absolute inset-0 w-full h-full font-mono text-base resize-none text-transparent caret-foreground bg-transparent p-4 focus-visible:ring-primary/50 z-10"
                spellCheck={false}
              />
              <div 
                aria-hidden="true" 
                className="absolute inset-0 w-full h-full font-mono text-base p-4 whitespace-pre-wrap break-words border border-input rounded-md bg-card overflow-hidden"
              >
                {renderHighlightedText()}
              </div>
            </div>
          </div>
        </div>

        {/* Cheatsheet */}
        <div className="flex flex-col gap-4 border border-border rounded-xl p-5 bg-card/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Regex Cheatsheet</h3>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-2">
            {cheatsheet.map((item, i) => (
              <div key={i} className="flex flex-col gap-1 text-sm border-b border-border/50 pb-2 last:border-0 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors" onClick={() => setPattern(pattern + item.pattern)}>
                <code className="text-primary font-mono bg-primary/10 w-fit px-1.5 py-0.5 rounded">{item.pattern}</code>
                <span className="text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPanel>
  )
}
