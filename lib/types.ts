export interface ToolFAQ {
  question: string
  answer: string
}

export interface ToolContent {
  /** "What is [Tool]?" */
  what: string
  /** "How does it work?" */
  how: string
  /** Step-by-step usage instructions */
  steps: string[]
  /** Concrete examples */
  examples?: string[]
  /** Common use cases */
  uses?: string[]
  /** Helpful tips */
  tips?: string[]
}

export interface Tool {
  slug: string
  name: string
  /** H1 shown on the tool page */
  title: string
  /** Longer human description shown under the H1 */
  description: string
  /** One-line description used in cards and lists */
  shortDescription: string
  /** Category slug this tool belongs to */
  category: string
  keywords: string[]
  /** Lucide icon name */
  icon: string
  featured?: boolean
  popular?: boolean
  new?: boolean
  /** Explicit related tool slugs. When omitted, related tools are auto-derived. */
  relatedTools?: string[]
  metaTitle: string
  metaDescription: string
  faq: ToolFAQ[]
  content: ToolContent
}

export interface Category {
  slug: string
  name: string
  description: string
  /** Lucide icon name */
  icon: string
  /** Longer intro shown on the category page */
  intro?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: string
  author: string
  /** Tool slugs referenced by this post */
  relatedTools?: string[]
  /** Markdown-ish body rendered as paragraphs and headings */
  body: string
}
