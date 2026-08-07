"use client"

import { useState } from "react"
import { ToolPanel, ToolField } from "../tool-ui"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/tools/copy-button"
import { Button } from "@/components/ui/button"

function formatBasicSql(sql: string) {
  let formatted = sql.replace(/\\s+/g, " ").trim()
  
  // Uppercase keywords
  const keywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING", 
    "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
    "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", "ON", "AS", "CREATE TABLE",
    "ALTER TABLE", "DROP TABLE", "ASC", "DESC"
  ]
  
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi")
    formatted = formatted.replace(regex, kw)
  })

  // Add newlines before major clauses
  const newlines = [
    "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "LEFT JOIN", 
    "RIGHT JOIN", "INNER JOIN", "JOIN", "VALUES", "SET"
  ]
  
  newlines.forEach(kw => {
    formatted = formatted.replace(new RegExp(`\\s+${kw}\\b`, "g"), `\n${kw}`)
  })

  // Format AND / OR
  formatted = formatted.replace(/\\s+AND\\b/g, "\\n  AND")
  formatted = formatted.replace(/\\s+OR\\b/g, "\\n  OR")

  // Split multiple columns in SELECT on newlines
  if (formatted.startsWith("SELECT")) {
    const parts = formatted.split("\\n")
    if (parts.length > 0) {
      parts[0] = parts[0].replace(/,\\s*/g, ",\\n  ")
    }
    formatted = parts.join("\\n")
  }

  return formatted
}

export function SqlFormatter({ slug }: { slug: string }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const handleFormat = () => {
    if (!input) return
    setOutput(formatBasicSql(input))
  }

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <ToolField label="Raw SQL Query" htmlFor="raw-sql">
            <Textarea
              id="raw-sql"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="select id, name, email from users where active = 1"
              className="min-h-[400px] resize-none font-mono text-sm"
              spellCheck={false}
            />
          </ToolField>
          <Button onClick={handleFormat} className="w-full">Format SQL</Button>
        </div>

        <div className="flex flex-col gap-4">
          <ToolField label="Formatted SQL" htmlFor="formatted-sql">
            <Textarea 
              id="formatted-sql"
              readOnly 
              value={output} 
              className="min-h-[400px] resize-none bg-secondary font-mono text-sm" 
              placeholder="Formatted output will appear here..."
              spellCheck={false}
            />
          </ToolField>
          <CopyButton value={output} label="Copy SQL" disabled={!output} />
        </div>
      </div>
    </ToolPanel>
  )
}
