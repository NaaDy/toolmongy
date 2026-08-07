import type { PasswordOptions } from "./types"

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWER = "abcdefghijklmnopqrstuvwxyz"
const NUMBERS = "0123456789"
const SYMBOLS = "!@#$%^&*()_-+=<>?/{}[]"

const SIMILAR = "O0Il1"

export function generatePassword(options: PasswordOptions): string {
  let chars = ""

  if (options.uppercase) chars += UPPER
  if (options.lowercase) chars += LOWER
  if (options.numbers) chars += NUMBERS
  if (options.symbols) chars += SYMBOLS

  if (options.excludeSimilar) {
    chars = chars
      .split("")
      .filter((c) => !SIMILAR.includes(c))
      .join("")
  }

  if (!chars) return ""

  const randomValues = new Uint32Array(options.length)
  crypto.getRandomValues(randomValues)

  return Array.from(randomValues)
    .map((n) => chars[n % chars.length])
    .join("")
}