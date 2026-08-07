"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function MetaTagsGenerator() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [copied, setCopied] = useState(false)

  const generateMetaTags = () => {
    return `<!-- Primary Meta Tags -->
<title>${title || "Site Title"}</title>
<meta name="title" content="${title || "Site Title"}" />
<meta name="description" content="${description || "Site Description"}" />
${author ? `\n<meta name="author" content="${author}" />` : ""}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url || "https://example.com/"}" />
<meta property="og:title" content="${title || "Site Title"}" />
<meta property="og:description" content="${description || "Site Description"}" />
${image ? `<meta property="og:image" content="${image}" />` : ""}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url || "https://example.com/"}" />
<meta property="twitter:title" content="${title || "Site Title"}" />
<meta property="twitter:description" content="${description || "Site Description"}" />
${image ? `<meta property="twitter:image" content="${image}" />` : ""}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMetaTags())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meta Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Awesome Website"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length} / 60
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your site..."
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length} / 160
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Site URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://yoursite.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author (Optional)</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Generated HTML</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy HTML"}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm text-muted-foreground max-h-[300px] overflow-y-auto">
                <code>{generateMetaTags()}</code>
              </pre>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Google Search Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-[600px] bg-background p-4 rounded-lg border">
                <div className="text-sm text-[#202124] dark:text-[#dadce0] flex items-center mb-1">
                  <span className="truncate">{url || "https://example.com"}</span>
                </div>
                <h3 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1 truncate">
                  {title || "Site Title"}
                </h3>
                <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                  {description || "Site Description goes here. This is a preview of how your page will look in Google search results. Make it compelling to improve click-through rates."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
