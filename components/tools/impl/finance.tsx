"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToolPanel, StatGrid, Stat } from "@/components/tools/tool-ui"

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "SAR", symbol: "﷼" },
  { code: "AED", symbol: "د.إ" },
  { code: "EGP", symbol: "ج.م" },
]

export function SalaryCalculator() {
  const [amount, setAmount] = useState("")
  const [from, setFrom] = useState<"hourly" | "daily" | "weekly" | "monthly" | "annual">("hourly")
  const [hoursPerDay, setHoursPerDay] = useState("8")
  const [daysPerWeek, setDaysPerWeek] = useState("5")
  const [currency, setCurrency] = useState("USD")

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? "$"

  const results = useMemo(() => {
    const val = parseFloat(amount)
    if (isNaN(val) || val < 0) return null

    const hpd = parseFloat(hoursPerDay) || 8
    const dpw = parseFloat(daysPerWeek) || 5

    const hourly =
      from === "hourly"  ? val :
      from === "daily"   ? val / hpd :
      from === "weekly"  ? val / (dpw * hpd) :
      from === "monthly" ? val / (4.333 * dpw * hpd) :
      /* annual */         val / (52 * dpw * hpd)

    return {
      hourly,
      daily:   hourly * hpd,
      weekly:  hourly * hpd * dpw,
      monthly: hourly * hpd * dpw * 4.333,
      annual:  hourly * hpd * dpw * 52,
    }
  }, [amount, from, hoursPerDay, daysPerWeek])

  const fmt = (n: number) =>
    `${currencySymbol}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salary-amount">Amount</Label>
            <div className="flex gap-2">
              <Select value={currency} onValueChange={v => v && setCurrency(v)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="salary-amount"
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 25"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pay Period</Label>
            <Select value={from} onValueChange={v => v && setFrom(v as typeof from)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours-per-day">Hours / Day</Label>
              <Input
                id="hours-per-day"
                type="number"
                min="1"
                max="24"
                value={hoursPerDay}
                onChange={e => setHoursPerDay(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days-per-week">Days / Week</Label>
              <Input
                id="days-per-week"
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={e => setDaysPerWeek(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Equivalent Salaries</Label>
          {results ? (
          <StatGrid>
              {(["hourly","daily","weekly","monthly","annual"] as const).map(period => (
                <div key={period} className={period === from ? "ring-2 ring-primary rounded-lg" : ""}>
                  <Stat
                    label={period.charAt(0).toUpperCase() + period.slice(1)}
                    value={fmt(results[period])}
                  />
                </div>
              ))}
            </StatGrid>
          ) : (
            <p className="text-sm text-muted-foreground pt-4">
              Enter an amount above to see the equivalent salary for each pay period.
            </p>
          )}
        </div>
      </div>
    </ToolPanel>
  )
}
