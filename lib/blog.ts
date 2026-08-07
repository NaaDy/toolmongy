export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string // Markdown content
  date: string
  author: string
  imageUrl?: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'welcome-to-toolmongy',
    title: 'Welcome to Toolmongy!',
    description: 'Discover how Toolmongy can supercharge your workflow with our suite of free online tools.',
    date: '2023-10-01',
    author: 'Toolmongy Team',
    tags: ['Announcement', 'General'],
    content: `
# Welcome to Toolmongy

We are thrilled to announce the launch of **Toolmongy**, your new go-to destination for free, fast, and private online tools!

Whether you are a developer looking to decode a JWT, a designer needing a quick color palette, or just someone looking to merge some PDFs, Toolmongy has you covered.

## Why Toolmongy?

1. **Privacy First:** The vast majority of our tools run entirely in your browser. This means your data never leaves your device.
2. **Speed:** By leveraging modern web technologies, our tools load instantly and process your tasks blazingly fast.
3. **Free to Use:** We believe essential utility tools should be accessible to everyone without paywalls or annoying subscriptions.

## What's Next?

We are constantly building and adding new tools based on user feedback. Have a tool request? Feel free to reach out to us!

Stay tuned for more updates and tutorials on how to make the most out of our toolkit.
    `
  },
  {
    slug: 'how-to-optimize-svgs',
    title: 'How to Optimize SVGs for Faster Web Performance',
    description: 'Learn why SVG optimization is crucial for web performance and how to easily compress them using our free tool.',
    date: '2023-10-15',
    author: 'Toolmongy Team',
    tags: ['Tutorial', 'Image Tools', 'Web Dev'],
    content: `
# How to Optimize SVGs for Faster Web Performance

Scalable Vector Graphics (SVGs) are fantastic for web design. They scale infinitely without losing quality and usually have smaller file sizes than traditional image formats like PNG or JPEG. However, straight out of design software like Figma or Adobe Illustrator, SVGs often contain a lot of unnecessary code.

## The Problem with Raw SVGs

Design tools tend to export SVGs with:
- XML comments
- Editor-specific metadata (e.g., Sketch or Illustrator tags)
- Unnecessary empty groups (\`<g>\`)
- Excessive decimal places in path coordinates

All of this extra data increases the file size of the SVG, which can slow down your website's load time if you have many icons or illustrations.

## How to Fix It

You can use our free [SVG Optimizer](/tools/svg-optimizer) to instantly strip out all this unnecessary bloat.

### Steps:
1. Copy the raw SVG code from your file or design tool.
2. Paste it into the **SVG Optimizer**.
3. Watch the tool instantly minify the code.
4. Copy the optimized result and use it in your website!

By optimizing your SVGs, you ensure your website remains fast and lightweight. Try it out today!
    `
  }
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllPosts(): BlogPost[] {
  // Sort by date descending
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
