"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, PlusCircle, Calculator } from "lucide-react"

type Course = {
  id: string
  name: string
  credits: number
  grade: string
}

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0,
}

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", credits: 3, grade: "A" },
    { id: "2", name: "", credits: 3, grade: "B" },
    { id: "3", name: "", credits: 4, grade: "A" }
  ])

  const [gpa, setGpa] = useState<number | null>(null)

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: "", credits: 3, grade: "A" }])
  }

  const removeCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id))
    setGpa(null)
  }

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map((c) => c.id === id ? { ...c, [field]: value } : c))
    setGpa(null)
  }

  const calculateGpa = () => {
    let totalPoints = 0
    let totalCredits = 0

    courses.forEach((course) => {
      const credits = Number(course.credits)
      if (!isNaN(credits) && credits > 0) {
        totalCredits += credits
        totalPoints += credits * GRADE_POINTS[course.grade]
      }
    })

    if (totalCredits > 0) {
      setGpa(Number((totalPoints / totalCredits).toFixed(2)))
    } else {
      setGpa(0)
    }
  }

  const resetForm = () => {
    setCourses([
      { id: "1", name: "", credits: 3, grade: "A" },
    ])
    setGpa(null)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>GPA Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-12 gap-2 md:gap-4 font-medium text-sm text-muted-foreground pb-2 border-b">
            <div className="col-span-5 md:col-span-6">Course Name</div>
            <div className="col-span-3 md:col-span-2">Credits</div>
            <div className="col-span-3 md:col-span-3">Grade</div>
            <div className="col-span-1 md:col-span-1"></div>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="col-span-5 md:col-span-6">
                  <Input
                    placeholder="Course (Optional)"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                  />
                </div>
                <div className="col-span-3 md:col-span-3">
                  <Select
                    value={course.grade}
                    onValueChange={(val) => updateCourse(course.id, "grade", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GRADE_POINTS).map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 md:col-span-1 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full border-dashed" onClick={addCourse}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Course
          </Button>

        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button variant="ghost" onClick={resetForm}>Reset</Button>
          <div className="flex items-center space-x-4">
            {gpa !== null && (
              <div className="text-xl font-bold px-4 py-2 bg-primary/10 text-primary rounded-lg">
                GPA: {gpa}
              </div>
            )}
            <Button onClick={calculateGpa}>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
