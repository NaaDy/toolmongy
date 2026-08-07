'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SITE } from '@/lib/site'

const faqs = [
  {
    question: `Is ${SITE.name} really free?`,
    answer:
      'Yes. Every tool is free to use with no sign-up, no trial period, and no hidden paywall.',
  },
  {
    question: 'Do you store what I type or upload?',
    answer:
      "Most tools run entirely in your browser, so your input never reaches our servers. Any exception is noted on that specific tool's page.",
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account is required for any tool on the site.',
  },
  {
    question: 'Can I request a new tool?',
    answer: "Yes — reach out through the Contact page and we'll consider it for a future release.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
        Frequently Asked Questions
      </h2>

      <div className="mt-8 flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform',
                    isOpen ? 'rotate-180' : '',
                  )}
                />
              </button>
              {isOpen ? (
                <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}