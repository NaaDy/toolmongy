"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { ToolPanel, ToolField, ResultBox, Stat, StatGrid } from "@/components/tools/tool-ui"
import { cn } from "@/lib/utils"

type Unit = "metric" | "imperial"

export function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric")
  const [height, setHeight] = useState("175")
  const [weight, setWeight] = useState("70")

  const result = useMemo(() => {
    const h = Number.parseFloat(height)
    const w = Number.parseFloat(weight)
    if (Number.isNaN(h) || Number.isNaN(w) || h <= 0 || w <= 0) return null
    const bmi = unit === "metric" ? w / Math.pow(h / 100, 2) : (703 * w) / Math.pow(h, 2)
    let category = "Normal weight"
    if (bmi < 18.5) category = "Underweight"
    else if (bmi < 25) category = "Normal weight"
    else if (bmi < 30) category = "Overweight"
    else category = "Obese"
    return { bmi: Math.round(bmi * 10) / 10, category }
  }, [unit, height, weight])

  return (
    <ToolPanel>
      <div className="mb-4 inline-flex rounded-lg border border-border bg-secondary p-1 text-sm">
        {(["metric", "imperial"] as Unit[]).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium capitalize transition-colors",
              unit === u ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {u}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField label={unit === "metric" ? "Height (cm)" : "Height (inches)"} htmlFor="bh">
          <Input id="bh" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
        </ToolField>
        <ToolField label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"} htmlFor="bw">
          <Input id="bw" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </ToolField>
      </div>
      {result ? (
        <div className="mt-5">
          <StatGrid className="sm:grid-cols-2">
            <Stat value={result.bmi} label="Your BMI" />
            <Stat value={result.category} label="Category" />
          </StatGrid>
          <ResultBox className="mt-3" label="Healthy range">
            A BMI between 18.5 and 24.9 is considered a healthy weight for most adults.
          </ResultBox>
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Enter your height and weight to calculate BMI.</p>
      )}
    </ToolPanel>
  )
}
