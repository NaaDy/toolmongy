import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { tools, getCategory } from "@/lib/tools"
import { getToolComponent } from "@/components/tools/registry"
import { SITE, absoluteUrl } from "@/lib/site"
import { ToolJsonLd } from "@/components/seo/json-ld"
import { ToolCardGrid } from "@/components/tools/tool-card"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = tools.find((t) => t.slug === slug)
  if (!tool) return {}

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: absoluteUrl(`/tools/${tool.slug}`) },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: absoluteUrl(`/tools/${tool.slug}`),
      siteName: SITE.name,
    },
  }
}

function getRelatedTools(tool: typeof tools[0]) {
  if (tool.relatedTools && tool.relatedTools.length > 0) {
    return tools.filter(t => tool.relatedTools!.includes(t.slug))
  }
  // Fallback to same category, excluding the current tool, capped at 3
  return tools.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0, 3)
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params

  const tool = tools.find((t) => t.slug === slug)
  if (!tool) {
    notFound()
  }

  const category = getCategory(tool.category)
  const ToolComponent = getToolComponent(slug)
  const relatedToolsList = getRelatedTools(tool)

  return (
    <>
      <ToolJsonLd tool={tool} />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <span className="text-sm font-medium text-primary">
          {category?.name ?? tool.category}
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {tool.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
          {tool.description}
        </p>

        <div className="mt-10">
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              This tool is coming soon — check back shortly.
            </div>
          )}
        </div>

        {/* --- SEO Content Section --- */}
        <div className="mt-20 space-y-16">
          
          {/* How to Use & Content */}
          <section className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            {tool.content?.what && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">What is this tool?</h2>
                <p className="text-muted-foreground leading-relaxed">{tool.content.what}</p>
              </div>
            )}

            {tool.content?.how && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">How does it work?</h2>
                <p className="text-muted-foreground leading-relaxed">{tool.content.how}</p>
              </div>
            )}

            {tool.content?.steps && tool.content.steps.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">How to use {tool.name}</h2>
                <ol className="space-y-3 list-decimal list-outside ml-5 text-muted-foreground marker:text-primary marker:font-medium">
                  {tool.content.steps.map((step, idx) => (
                    <li key={idx} className="pl-2 leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {tool.content?.uses && tool.content.uses.length > 0 && (
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-4 text-foreground">Common Use Cases</h3>
                <ul className="space-y-2 list-disc list-outside ml-5 text-muted-foreground marker:text-primary">
                  {tool.content.uses.map((use, idx) => (
                    <li key={idx} className="pl-2 leading-relaxed">{use}</li>
                  ))}
                </ul>
              </div>
            )}

            {tool.content?.examples && tool.content.examples.length > 0 && (
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-4 text-foreground">Examples</h3>
                <ul className="space-y-2 list-disc list-outside ml-5 text-muted-foreground marker:text-primary">
                  {tool.content.examples.map((example, idx) => (
                    <li key={idx} className="pl-2 leading-relaxed">{example}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {tool.content?.tips && tool.content.tips.length > 0 && (
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-4 text-foreground">Pro Tips</h3>
                <ul className="space-y-2 list-disc list-outside ml-5 text-muted-foreground marker:text-primary">
                  {tool.content.tips.map((tip, idx) => (
                    <li key={idx} className="pl-2 leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* FAQ */}
          {tool.faq && tool.faq.length > 0 && (
            <section className="pt-10 border-t border-border">
              <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {tool.faq.map((item, idx) => (
                  <details key={idx} className="group rounded-xl border border-border bg-card px-6 py-5 [&_summary::-webkit-details-marker]:hidden overflow-hidden transition-all duration-300">
                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground outline-none text-lg">
                      {item.question}
                      <span className="ml-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted group-open:bg-primary group-open:text-primary-foreground transition-colors duration-300">
                        <svg className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-5 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools */}
          {relatedToolsList.length > 0 && (
            <section className="pt-10 border-t border-border">
              <h2 className="text-2xl font-bold tracking-tight mb-8 text-foreground">Related Tools</h2>
              <ToolCardGrid tools={relatedToolsList} />
            </section>
          )}
        </div>
      </main>
    </>
  )
}