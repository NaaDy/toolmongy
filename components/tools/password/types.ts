export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
}

export type PasswordStrength =
  | "Very Weak"
  | "Weak"
  | "Medium"
  | "Strong"
  | "Very Strong"