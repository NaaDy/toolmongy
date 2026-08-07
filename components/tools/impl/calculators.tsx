"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { ToolPanel, ToolField, StatGrid, Stat, ResultBox } from "@/components/tools/tool-ui"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function AgeCalculator() {
  const [dob, setDob] = useState("")
  const [at, setAt] = useState(todayISO())

  const result = useMemo(() => {
    if (!dob) return null
    const birth = new Date(dob)
    const target = new Date(at)
    if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime()) || target < birth) return null

    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months -= 1
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / 86_400_000)
    return { years, months, days, totalDays }
  }, [dob, at])

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField label="Date of birth" htmlFor="dob">
          <Input id="dob" type="date" value={dob} max={at} onChange={(e) => setDob(e.target.value)} />
        </ToolField>
        <ToolField label="Age at date" htmlFor="at">
          <Input id="at" type="date" value={at} onChange={(e) => setAt(e.target.value)} />
        </ToolField>
      </div>

      {result ? (
        <div className="mt-5 flex flex-col gap-4">
          <StatGrid>
            <Stat value={result.years} label="Years" />
            <Stat value={result.months} label="Months" />
            <Stat value={result.days} label="Days" />
          </StatGrid>
          <ResultBox label="Total">
            You are <span className="font-semibold">{result.totalDays.toLocaleString()}</span> days old.
          </ResultBox>
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Enter your date of birth to see your exact age.</p>
      )}
    </ToolPanel>
  )
}

export function PercentageCalculator() {
  const [x, setX] = useState("15")
  const [y, setY] = useState("200")

  const percentOf = useMemo(() => {
    const a = Number.parseFloat(x)
    const b = Number.parseFloat(y)
    if (Number.isNaN(a) || Number.isNaN(b)) return null
    return (a / 100) * b
  }, [x, y])

  const isWhatPercent = useMemo(() => {
    const a = Number.parseFloat(x)
    const b = Number.parseFloat(y)
    if (Number.isNaN(a) || Number.isNaN(b) || b === 0) return null
    return (a / b) * 100
  }, [x, y])

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField label="Value A" htmlFor="pa">
          <Input id="pa" inputMode="decimal" value={x} onChange={(e) => setX(e.target.value)} />
        </ToolField>
        <ToolField label="Value B" htmlFor="pb">
          <Input id="pb" inputMode="decimal" value={y} onChange={(e) => setY(e.target.value)} />
        </ToolField>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <ResultBox label={`${x || "A"}% of ${y || "B"}`}>
          <span className="text-lg font-semibold tabular-nums">{percentOf === null ? "—" : round(percentOf)}</span>
        </ResultBox>
        <ResultBox label={`${x || "A"} is what percent of ${y || "B"}`}>
          <span className="text-lg font-semibold tabular-nums">
            {isWhatPercent === null ? "—" : `${round(isWhatPercent)}%`}
          </span>
        </ResultBox>
      </div>
    </ToolPanel>
  )
}

export function LoanCalculator() {
  const [amount, setAmount] = useState("25000")
  const [rate, setRate] = useState("6.5")
  const [years, setYears] = useState("5")

  const result = useMemo(() => {
    const P = Number.parseFloat(amount)
    const annual = Number.parseFloat(rate)
    const n = Number.parseFloat(years) * 12
    if ([P, annual, n].some((v) => Number.isNaN(v)) || P <= 0 || n <= 0) return null
    const r = annual / 100 / 12
    const monthly = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n))
    const total = monthly * n
    return { monthly, total, interest: total - P }
  }, [amount, rate, years])

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-3">
        <ToolField label="Loan amount" htmlFor="la">
          <Input id="la" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </ToolField>
        <ToolField label="Interest rate (%)" htmlFor="lr">
          <Input id="lr" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
        </ToolField>
        <ToolField label="Term (years)" htmlFor="ly">
          <Input id="ly" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} />
        </ToolField>
      </div>
      {result ? (
        <div className="mt-5 flex flex-col gap-4">
          <StatGrid>
            <Stat value={money(result.monthly)} label="Monthly payment" />
            <Stat value={money(result.total)} label="Total paid" />
            <Stat value={money(result.interest)} label="Total interest" />
          </StatGrid>
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Enter loan details to estimate your payments.</p>
      )}
    </ToolPanel>
  )
}

function round(n: number) {
  return Math.round(n * 100) / 100
}
function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 })
}
