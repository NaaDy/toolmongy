"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, AlertCircle, Link } from "lucide-react"

export function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState("")
  const [videoId, setVideoId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const extractVideoId = (inputUrl: string) => {
    try {
      const parsedUrl = new URL(inputUrl)
      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v")
      } else if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1)
      }
    } catch (e) {
      // Invalid URL
    }
    
    // Fallback regex
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = inputUrl.match(regex)
    return match ? match[1] : null
  }

  const handleFetch = () => {
    setError(null)
    setVideoId(null)
    
    if (!url.trim()) {
      setError("Please enter a YouTube URL.")
      return
    }

    const id = extractVideoId(url)
    if (id) {
      setVideoId(id)
    } else {
      setError("Could not extract a valid YouTube video ID from the URL.")
    }
  }

  const handleDownload = async (imageUrl: string, qualityName: string) => {
    try {
      // We use fetch to download the image to avoid CORS issues if opening in new tab
      // However, YouTube image servers might have CORS restrictions. 
      // If CORS blocks it, we fallback to opening in new tab.
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = `youtube-thumbnail-${videoId}-${qualityName}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(objectUrl)
    } catch (e) {
      window.open(imageUrl, '_blank')
    }
  }

  const qualities = [
    { name: "Max Resolution", url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
    { name: "High Quality (HD)", url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
    { name: "Medium Quality (SD)", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
    { name: "Standard Quality", url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
  ]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Extract YouTube Thumbnail</CardTitle>
          <CardDescription>
            Enter a YouTube video URL to view and download its thumbnail in different resolutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              />
            </div>
            <Button onClick={handleFetch}>Extract</Button>
          </div>
          
          {error && (
            <div className="flex items-center text-sm text-destructive mt-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {videoId && (
        <div className="grid gap-6">
          {qualities.map((q, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{q.name}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(q.url, q.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md overflow-hidden bg-muted border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={q.url}
                    alt={`${q.name} Thumbnail`}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
