export const SITE = {
  name: "Toolmongy",
  url: "https://toolmongy.store", // تم تغييره للدومين الجديد
  description:
    "Free online tools for developers, creators, students, marketers, and businesses. Fast, secure, and privacy-friendly.",
  tagline: "100+ Free Online Tools",
  locale: "en-US",
  author: "Toolmongy",

  keywords: [
    "online tools",
    "free tools",
    "developer tools",
    "password generator",
    "qr code generator",
    "json formatter",
    "seo tools",
    "image tools",
    "pdf tools",
    "text tools"
  ],

  ogImage: "/og-image.png",

  twitter: "@toolmongy",

  themeColor: "#020617",
} as const

/**
 * Build an absolute URL for a given path.
 */
export function absoluteUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`
  return `${SITE.url}${clean}`
}