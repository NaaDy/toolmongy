"use client"

import { useState } from "react"
import { ToolPanel } from "../tool-ui"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { AlertCircle, CheckCircle2, Copy, Trash } from "lucide-react"

export function JsonFormatter({ slug }: { slug: string }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const formatJson = (spaces: number = 2) => {
    try {
      if (!input.trim()) {
        setError("Please enter some JSON to format.")
        return
      }
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, spaces)
      setOutput(formatted)
      setError(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax.")
      setSuccess(false)
    }
  }

  const minifyJson = () => {
    formatJson(0)
  }

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
    }
  }

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-2 h-[600px]">
        {/* Input Side */}
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Input JSON</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput("")
                setOutput("")
                setError(null)
              }}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Trash className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"hello": "world"}'
            className="flex-1 font-mono text-sm resize-none focus-visible:ring-primary/50"
            spellCheck={false}
          />
          <div className="flex items-center gap-2 mt-2">
            <Button onClick={() => formatJson(2)} className="flex-1">Format (2 Spaces)</Button>
            <Button onClick={() => formatJson(4)} variant="secondary" className="flex-1">Format (4 Spaces)</Button>
            <Button onClick={minifyJson} variant="outline" className="flex-1">Minify</Button>
          </div>
        </div>

        {/* Output Side */}
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Output JSON</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!output}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
          
          <div className="flex-1 relative overflow-hidden rounded-md border border-input bg-muted/50">
            {error ? (
              <div className="absolute inset-0 flex p-4 items-start bg-destructive/10">
                <div className="flex border border-destructive/50 bg-destructive/10 text-destructive w-full rounded-md p-3">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="font-mono text-sm break-words">
                    {error}
                  </div>
                </div>
              </div>
            ) : success ? (
              <div className="absolute top-4 right-4 z-10 animate-in fade-in slide-in-from-top-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 className="mr-1.5 h-3 w-3" /> Valid JSON
                </Badge>
              </div>
            ) : null}
            
            <Textarea
              value={output}
              readOnly
              className="w-full h-full font-mono text-sm resize-none border-0 bg-transparent focus-visible:ring-0 p-3"
              placeholder="Formatted output will appear here..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </ToolPanel>
  )
}

function Badge({ children, className, variant }: any) {
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
      {children}
    </div>
  )
}
