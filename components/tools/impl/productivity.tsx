"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"

export function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  
  const [mode, setMode] = useState<"work" | "break">("work")
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60)
  const [isActive, setIsActive] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (mode === "work") {
      setTimeLeft(workMinutes * 60)
    } else {
      setTimeLeft(breakMinutes * 60)
    }
  }, [workMinutes, breakMinutes, mode])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Play a sound or show notification here in a real app
      if (Notification.permission === "granted") {
        new Notification(`Time's up!`, {
          body: mode === "work" ? "Take a break!" : "Back to work!",
        })
      }
      
      const nextMode = mode === "work" ? "break" : "work"
      setMode(nextMode)
      setTimeLeft(nextMode === "work" ? workMinutes * 60 : breakMinutes * 60)
      setIsActive(false)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, timeLeft, mode, workMinutes, breakMinutes])

  const toggleTimer = () => {
    if (!isActive && Notification.permission === "default") {
      Notification.requestPermission()
    }
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMode("work")
    setTimeLeft(workMinutes * 60)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const progress = mode === "work" 
    ? 100 - (timeLeft / (workMinutes * 60)) * 100
    : 100 - (timeLeft / (breakMinutes * 60)) * 100

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="text-center overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-primary/10 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <CardContent className="pt-10 pb-10 relative z-10">
          <div className="flex justify-center mb-6 space-x-2">
            <Button
              variant={mode === "work" ? "default" : "outline"}
              onClick={() => {
                setMode("work")
                setIsActive(false)
              }}
              className="rounded-full px-6"
            >
              Work
            </Button>
            <Button
              variant={mode === "break" ? "default" : "outline"}
              onClick={() => {
                setMode("break")
                setIsActive(false)
              }}
              className="rounded-full px-6"
            >
              Break
            </Button>
          </div>

          <div className="text-8xl font-bold tracking-tighter tabular-nums mb-8">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center items-center space-x-4">
            <Button
              size="lg"
              variant={isActive ? "secondary" : "default"}
              className="w-32 h-14 text-lg rounded-full"
              onClick={toggleTimer}
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-5 w-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5 fill-current" /> Start
                </>
              )}
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className="h-14 w-14 rounded-full"
              onClick={resetTimer}
              title="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-14 w-14 rounded-full"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Work Duration</Label>
                <span className="font-medium">{workMinutes} min</span>
              </div>
              <Slider
                value={[workMinutes]}
                min={5}
                max={60}
                step={5}
                onValueChange={(val) => {
                  if (Array.isArray(val) && val.length > 0) {
                    setWorkMinutes(val[0])
                    if (mode === "work" && !isActive) setTimeLeft(val[0] * 60)
                  } else if (typeof val === 'number') {
                    setWorkMinutes(val)
                    if (mode === "work" && !isActive) setTimeLeft(val * 60)
                  }
                }}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Break Duration</Label>
                <span className="font-medium">{breakMinutes} min</span>
              </div>
              <Slider
                value={[breakMinutes]}
                min={1}
                max={30}
                step={1}
                onValueChange={(val) => {
                  if (Array.isArray(val) && val.length > 0) {
                    setBreakMinutes(val[0])
                    if (mode === "break" && !isActive) setTimeLeft(val[0] * 60)
                  } else if (typeof val === 'number') {
                    setBreakMinutes(val)
                    if (mode === "break" && !isActive) setTimeLeft(val * 60)
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
