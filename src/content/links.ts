import type { ContentKind } from './types'

// Names and paths only, for the footer, so the full articles aren't loaded on every page.
// The build checks this list against the real pages (see seo.ts), so it can't drift.
export const contentLinks: { kind: ContentKind; title: string; all: [string, string]; pages: [string, string][] }[] = [
  {
    kind: 'compare',
    title: 'Compare',
    all: ['All comparisons', '/compare'],
    pages: [
      ['Wati alternative', '/compare/wati-alternative'],
      ['AiSensy alternative', '/compare/aisensy-alternative'],
      ['Interakt alternative', '/compare/interakt-alternative'],
    ],
  },
  {
    kind: 'industry',
    title: 'Industries',
    all: ['All industries', '/industries'],
    pages: [
      ['E-commerce & D2C', '/industries/ecommerce'],
      ['Clinics & healthcare', '/industries/healthcare'],
      ['Education & coaching', '/industries/education'],
      ['Real estate', '/industries/real-estate'],
    ],
  },
  {
    kind: 'guide',
    title: 'Guides',
    all: ['All guides', '/blog'],
    pages: [
      ['WhatsApp Business API setup in India', '/blog/whatsapp-business-api-setup-india'],
      ['WhatsApp Business API pricing in India', '/blog/whatsapp-business-api-pricing-india'],
      ['WhatsApp Business app vs API', '/blog/whatsapp-business-app-vs-api'],
    ],
  },
]
