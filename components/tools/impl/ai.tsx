"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, Sparkles } from "lucide-react"

const USE_CASES = [
  { id: "coding", label: "Coding / Programming" },
  { id: "writing", label: "Writing / Content Creation" },
  { id: "analysis", label: "Data Analysis" },
  { id: "marketing", label: "Marketing / SEO" },
  { id: "image", label: "Image Generation (Midjourney/DALL-E)" }
]

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual & Friendly" },
  { id: "academic", label: "Academic / Formal" },
  { id: "creative", label: "Creative / Playful" },
  { id: "direct", label: "Direct / Concise" }
]

export function PromptGenerator() {
  const [useCase, setUseCase] = useState("coding")
  const [topic, setTopic] = useState("")
  const [context, setContext] = useState("")
  const [tone, setTone] = useState("professional")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    let prompt = ""

    const safeTopic = topic || "[Insert Topic Here]"
    const safeContext = context ? `\n\nContext/Background:\n${context}` : ""

    switch (useCase) {
      case "coding":
        prompt = `Act as an expert software engineer. I need help with the following task: ${safeTopic}.${safeContext}\n\nPlease provide a clean, well-documented, and optimal solution. Ensure you explain your thought process and any trade-offs you considered.`
        break
      case "writing":
        prompt = `Act as a professional copywriter. Please write a comprehensive piece about: ${safeTopic}.${safeContext}\n\nThe tone of the writing should be ${tone}. Make it engaging, well-structured with clear headings, and easy to read.`
        break
      case "analysis":
        prompt = `Act as a senior data analyst. I have the following scenario/data constraint: ${safeTopic}.${safeContext}\n\nPlease analyze this situation. Provide actionable insights, highlight any anomalies or trends, and suggest the next steps I should take.`
        break
      case "marketing":
        prompt = `Act as a digital marketing expert. I need a marketing strategy/copy for: ${safeTopic}.${safeContext}\n\nPlease provide a detailed approach, focusing on target audience engagement, high conversion rates, and a ${tone} tone.`
        break
      case "image":
        prompt = `A highly detailed, professional digital art of ${safeTopic}. ${context ? `${context}.` : ""} Cinematic lighting, 8k resolution, photorealistic, intricate details, highly stylized, trending on artstation.`
        break
      default:
        prompt = `I need help with ${safeTopic}.${safeContext}\n\nPlease use a ${tone} tone.`
    }

    setGeneratedPrompt(prompt)
    setCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Build Your Prompt</CardTitle>
            <CardDescription>Fill in the details to generate an optimized prompt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label>Use Case</Label>
              <Select value={useCase} onValueChange={(val) => val && setUseCase(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USE_CASES.map((uc) => (
                    <SelectItem key={uc.id} value={uc.id}>{uc.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Topic / Goal</Label>
              <Input
                placeholder="What do you want to achieve?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Context (Optional)</Label>
              <Textarea
                placeholder="Provide any constraints, background info, or specific requirements..."
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            {useCase !== "image" && (
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button className="w-full" onClick={handleGenerate}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Prompt
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Result</CardTitle>
              <CardDescription>Copy this and paste it into ChatGPT, Claude, etc.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              className="flex-1 min-h-[250px] resize-none mb-4"
              readOnly
              value={generatedPrompt}
              placeholder="Your optimized prompt will appear here..."
            />
            <Button
              variant={generatedPrompt ? "default" : "outline"}
              className="w-full"
              onClick={handleCopy}
              disabled={!generatedPrompt}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied to Clipboard!" : "Copy Prompt"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
