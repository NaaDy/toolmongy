"use client"

import { useState, useRef } from "react"
import { ToolPanel } from "../tool-ui"
import { Button } from "@/components/ui/button"
import { Upload, Image as ImageIcon, Download, Loader2 } from "lucide-react"

export function ImageConverter({ slug }: { slug: string }) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<"image/webp" | "image/png" | "image/jpeg">("image/webp")
  const [quality, setQuality] = useState<number>(0.8)
  const [isConverting, setIsConverting] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const convertImage = () => {
    if (!previewUrl || !canvasRef.current) return
    setIsConverting(true)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = previewUrl
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      
      // Fill background with white for JPEGs (which don't support transparency)
      if (outputFormat === "image/jpeg") {
        ctx!.fillStyle = "#ffffff"
        ctx!.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx?.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const ext = outputFormat.split("/")[1]
            const originalName = imageFile?.name.split(".")[0] || "image"
            const fileName = `${originalName}-toolmongy.${ext}`
            
            const downloadUrl = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = downloadUrl
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(downloadUrl)
          }
          setIsConverting(false)
        },
        outputFormat,
        quality
      )
    }
  }

  return (
    <ToolPanel>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-card hover:bg-muted/50 transition-colors relative"
        >
          {previewUrl ? (
            <div className="flex flex-col items-center gap-4">
              <img src={previewUrl} alt="Preview" className="max-h-64 object-contain rounded-lg" />
              <p className="text-sm text-muted-foreground">{imageFile?.name}</p>
              <Button variant="outline" onClick={() => { setPreviewUrl(null); setImageFile(null); }}>
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <p className="font-medium text-foreground">Click or drag image to upload</p>
                <p className="text-sm text-muted-foreground mt-1">Supports PNG, JPG, WEBP</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Output Format</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                >
                  <option value="image/webp">WebP (Recommended)</option>
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG / JPEG</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Quality: {Math.round(quality * 100)}%</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  disabled={outputFormat === "image/png"}
                  className="w-full h-10 accent-primary"
                />
              </div>
            </div>

            <Button onClick={convertImage} disabled={isConverting} className="w-full h-12 text-lg">
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Converting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" /> Convert & Download
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </ToolPanel>
  )
}
