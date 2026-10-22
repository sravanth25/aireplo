// Content pages (comparisons, industries, guides) are plain data, so the same source renders
// the web page, its structured data, its markdown copy for AI agents and its sitemap entry.
// Inline text supports **bold** and [links](/path or https://…).

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'callout'; title?: string; text: string }

export type ContentKind = 'compare' | 'industry' | 'guide'

export type ContentPage = {
  path: string
  kind: ContentKind
  /** <title> (≤ 60 characters) */
  title: string
  /** meta description (≤ 160 characters) */
  description: string
  eyebrow: string
  h1: string
  intro: string
  /** ISO date the facts were last checked */
  updated: string
  published: string
  /** short name for cards, breadcrumbs and links */
  name: string
  blocks: Block[]
  faqs?: [string, string][]
  sources?: { label: string; url: string }[]
  related?: string[]
  /** call to action at the end */
  cta?: { title: string; text: string; button: string; href: string }
}

export type Hub = {
  path: string
  kind: ContentKind
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  name: string
}

/** Strip inline markup for plain-text uses (meta tags, JSON-LD). */
export const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[(.+?)\]\((.+?)\)/g, '$1')
