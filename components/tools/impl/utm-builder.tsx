"use client"

import { useState, useMemo } from "react"
import { ToolPanel, ToolField, ResultBox } from "../tool-ui"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/tools/copy-button"

export function UtmBuilder({ slug }: { slug: string }) {
  const [url, setUrl] = useState("")
  const [source, setSource] = useState("")
  const [medium, setMedium] = useState("")
  const [campaign, setCampaign] = useState("")
  const [term, setTerm] = useState("")
  const [content, setContent] = useState("")

  const result = useMemo(() => {
    if (!url) return { link: "", error: "Website URL is required." }
    
    let base = url
    if (!/^https?:\/\//i.test(base)) {
      base = "https://" + base
    }

    try {
      const urlObj = new URL(base)
      
      if (source) urlObj.searchParams.set("utm_source", source)
      if (medium) urlObj.searchParams.set("utm_medium", medium)
      if (campaign) urlObj.searchParams.set("utm_campaign", campaign)
      if (term) urlObj.searchParams.set("utm_term", term)
      if (content) urlObj.searchParams.set("utm_content", content)

      return { link: urlObj.toString(), error: null }
    } catch {
      return { link: "", error: "Please enter a valid Website URL." }
    }
  }, [url, source, medium, campaign, term, content])

  return (
    <ToolPanel>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ToolField label="Website URL *" htmlFor="url">
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </ToolField>
          
          <ToolField label="Campaign Source *" htmlFor="source">
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="google, newsletter, facebook"
            />
            <p className="text-xs text-muted-foreground mt-1">The referrer (e.g. google, newsletter)</p>
          </ToolField>

          <ToolField label="Campaign Medium" htmlFor="medium">
            <Input
              id="medium"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="cpc, banner, email"
            />
            <p className="text-xs text-muted-foreground mt-1">Marketing medium (e.g. cpc, banner, email)</p>
          </ToolField>

          <ToolField label="Campaign Name" htmlFor="campaign">
            <Input
              id="campaign"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="spring_sale, promo_code"
            />
            <p className="text-xs text-muted-foreground mt-1">Product, promo code, or slogan</p>
          </ToolField>

          <ToolField label="Campaign Term" htmlFor="term">
            <Input
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="running+shoes"
            />
            <p className="text-xs text-muted-foreground mt-1">Identify the paid keywords</p>
          </ToolField>

          <ToolField label="Campaign Content" htmlFor="content">
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="logolink, textlink"
            />
            <p className="text-xs text-muted-foreground mt-1">Use to differentiate ads</p>
          </ToolField>
        </div>

        <div className="flex flex-col h-full space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Generated Campaign URL</label>
            {result.error && url ? (
              <ResultBox>
                <span className="text-destructive">{result.error}</span>
              </ResultBox>
            ) : (
              <div className="flex flex-col gap-3">
                <Textarea 
                  readOnly 
                  value={result.link} 
                  className="min-h-32 resize-none bg-secondary font-mono text-sm" 
                  placeholder="Your generated URL will appear here..."
                />
                <CopyButton value={result.link} label="Copy URL" />
              </div>
            )}
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 border text-sm text-muted-foreground mt-auto">
            <p className="font-semibold text-foreground mb-2">Why use UTM parameters?</p>
            <p>
              UTM parameters are tags you add to a URL — when your link is clicked, the tags are sent back to Google Analytics and tracked. With UTM parameters, you can see exactly where your traffic is coming from and which campaigns are performing best.
            </p>
          </div>
        </div>
      </div>
    </ToolPanel>
  )
}
