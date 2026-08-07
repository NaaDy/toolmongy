import type { Category } from './types'

/**
 * Master category list. Categories are extensible — add a new entry here and
 * any tool referencing its slug is automatically grouped under it.
 */
export const categories: Category[] = [
  {
    slug: 'ai-tools',
    name: 'AI Tools',
    description: 'Smart assistants and AI-powered utilities.',
    icon: 'Sparkles',
    intro:
      'Explore AI-powered tools that help you write, generate, and transform content faster.',
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Work with PDF documents right in your browser.',
    icon: 'FileText',
    intro: 'Merge, split, convert, and edit PDF files privately in your browser.',
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Resize, convert, compress, and edit images.',
    icon: 'Image',
    intro: 'A growing suite of image utilities that run entirely on your device.',
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    description: 'Count, format, and transform text instantly.',
    icon: 'Type',
    intro: 'Fast, private text utilities for writers, students, and professionals.',
  },
  {
    slug: 'seo-tools',
    name: 'SEO Tools',
    description: 'Optimize content and analyze pages for search.',
    icon: 'TrendingUp',
    intro: 'Practical SEO utilities to help your content rank and perform better.',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'Encoders, formatters, and generators for developers.',
    icon: 'Code',
    intro: 'A developer toolbox of encoders, formatters, validators, and generators.',
  },
  {
    slug: 'finance-tools',
    name: 'Finance Tools',
    description: 'Loans, interest, budgeting, and money calculators.',
    icon: 'Wallet',
    intro: 'Plan smarter with clear, accurate financial calculators.',
  },
  {
    slug: 'health-tools',
    name: 'Health Tools',
    description: 'Fitness, body, and wellness calculators.',
    icon: 'HeartPulse',
    intro: 'Understand your health metrics with easy-to-use calculators.',
  },
  {
    slug: 'calculators',
    name: 'Calculators',
    description: 'Everyday math, dates, and percentages.',
    icon: 'Calculator',
    intro: 'A collection of reliable calculators for everyday numbers.',
  },
  {
    slug: 'social-media-tools',
    name: 'Social Media Tools',
    description: 'Create and optimize content for social platforms.',
    icon: 'AtSign',
    intro: 'Tools to help you create, format, and plan social media content.',
  },
  {
    slug: 'converters',
    name: 'Converters',
    description: 'Convert units, formats, and encodings.',
    icon: 'ArrowLeftRight',
    intro: 'Convert between units, formats, and encodings in a click.',
  },
  {
    slug: 'generators',
    name: 'Generators',
    description: 'Generate passwords, IDs, text, and more.',
    icon: 'Wand2',
    intro: 'Instantly generate secure passwords, unique IDs, placeholder text, and more.',
  },
  {
    slug: 'productivity-tools',
    name: 'Productivity Tools',
    description: 'Stay organized and get more done.',
    icon: 'Zap',
    intro: 'Lightweight utilities designed to help you work faster.',
  },
  {
    slug: 'education-tools',
    name: 'Education Tools',
    description: 'Learning aids for students and teachers.',
    icon: 'GraduationCap',
    intro: 'Helpful tools for studying, teaching, and learning.',
  },
]

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
)

export function getCategory(slug: string): Category | undefined {
  return categoryMap[slug]
}
