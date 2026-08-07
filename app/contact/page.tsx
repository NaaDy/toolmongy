import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `Contact — ${SITE.name}`,
  description: `Get in touch with the ${SITE.name} team.`,
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: `Contact — ${SITE.name}`,
    description: `Get in touch with the ${SITE.name} team.`,
    url: absoluteUrl('/contact'),
    siteName: SITE.name,
  },
}

// TODO: replace with your real support address once you have a domain mailbox set up
const CONTACT_EMAIL = 'hello@toolnova.com'

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-balance">Contact Us</h1>
      <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">
        Found a bug, have a tool request, or want to report an ad issue? We'd like to hear
        from you.
      </p>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-8 inline-flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-card-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mail className="size-5" />
        </span>
        <span className="flex flex-col">
          <span className="font-semibold">Email us</span>
          <span className="text-sm text-muted-foreground">{CONTACT_EMAIL}</span>
        </span>
      </a>

      <p className="mt-8 text-sm text-muted-foreground">
        We aim to reply within a few business days.
      </p>
    </main>
  )
}