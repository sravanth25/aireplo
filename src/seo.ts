// Search and AI visibility for every page: titles, descriptions, structured data (JSON-LD),
// plus the generated robots.txt, sitemap.xml, llms.txt, llms-full.txt and markdown page copies.
// Everything reads from brand.ts, so prices and contact details stay in sync with the site.
import { addOns, brand, enterprise, inr, packages, partner, pricingNote, setupOnly } from './brand'
import { faqs } from './sections/Faq'
import { partnerFaqs } from './pages/Partners'
import { compareRows } from './sections/Compare'
import { steps } from './sections/HowItWorks'
import { templates } from './lib/templates'
import { TOOL_META } from './lib/toolMeta'
import { contentLinks } from './content/links'
import { contentPages, hubOfKind, hubs, pagesOfKind, plain, type Block, type ContentPage, type Hub } from './content'

const site = brand.siteUrl.replace(/\/$/, '')
const abs = (path: string) => site + path
const phone = '+' + brand.whatsapp

type Json = Record<string, unknown>

export type Route = {
  path: string
  /** output file inside dist/ (served without .html thanks to cleanUrls) */
  file: string
  title: string
  description: string
  /** markdown copy of the page for AI agents */
  md?: string
  priority?: number
  noindex?: boolean
  /** false = don't pre-render the page body (pages that only work in the browser) */
  prerender?: boolean
  /** the 404 page: no canonical URL */
  notFound?: boolean
  /** text for this page's own share image (made by scripts/og-images.mjs into public/og/) */
  card?: { eyebrow: string; heading: string }
  breadcrumb?: [string, string][]
  schema?: () => Json[]
}


// ---------- structured data building blocks ----------
const ORG_ID = abs('/#organization')
const WEBSITE_ID = abs('/#website')

const organization = (): Json => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: brand.name,
  url: abs('/'),
  logo: { '@type': 'ImageObject', url: abs('/android-chrome-512x512.png'), width: 512, height: 512 },
  image: abs('/og-image.png'),
  slogan: brand.slogan,
  description: 'Aireplo sets up the official WhatsApp Business API for Indian businesses: their own Meta app, WhatsApp number, AI agent and branded dashboard, for a one-time fee with no monthly subscription.',
  email: brand.email,
  areaServed: { '@type': 'Country', name: 'India' },
  knowsAbout: ['WhatsApp Business API', 'WhatsApp Cloud API', 'WhatsApp marketing', 'WhatsApp chatbots', 'AI customer support agents', 'Meta business verification', 'White-label WhatsApp platforms'],
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'sales', telephone: phone, email: brand.email, areaServed: 'IN', availableLanguage: ['English', 'Hindi'] },
  ],
})

const website = (): Json => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: abs('/'),
  name: brand.name,
  description: brand.tagline,
  inLanguage: 'en-IN',
  publisher: { '@id': ORG_ID },
})

const offer = (name: string, price: number, description: string): Json => ({
  '@type': 'Offer',
  name,
  description,
  price,
  priceCurrency: 'INR',
  // no billing period = one-time charge; GST is added on top
  priceSpecification: { '@type': 'PriceSpecification', price, priceCurrency: 'INR', valueAddedTaxIncluded: false },
  availability: 'https://schema.org/InStock',
  url: abs('/#pricing'),
  seller: { '@id': ORG_ID },
})

const service = (): Json => ({
  '@type': 'Service',
  '@id': abs('/#service'),
  name: 'WhatsApp Business API setup with your own Meta app and branded dashboard',
  serviceType: ['WhatsApp Business API setup', 'WhatsApp marketing platform', 'WhatsApp AI chatbot', 'White-label WhatsApp dashboard'],
  description: `One-time project: ${brand.name} sets up Facebook Business and Meta verification, builds the client’s own Meta app for WhatsApp, connects the number, gets templates approved and delivers a branded dashboard with team inbox, broadcasts, chatbots and an AI agent. ${pricingNote.full}`,
  provider: { '@id': ORG_ID },
  areaServed: { '@type': 'Country', name: 'India' },
  audience: { '@type': 'BusinessAudience', audienceType: 'Small and medium businesses, D2C brands, clinics, institutes, agencies' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: `${brand.name} one-time packages`,
    itemListElement: [
      ...packages.map((p) => offer(`${p.name} package`, p.price, `${p.for}. ${p.features.join('; ')}.`)),
      offer(setupOnly.name, setupOnly.price, setupOnly.features.join('; ') + '. No dashboard.'),
      { '@type': 'Offer', name: `${enterprise.name} package`, description: `Custom one-time pricing. ${enterprise.features.join('; ')}.`, seller: { '@id': ORG_ID } },
    ],
  },
})

const faqPage = (id: string, list: [string, string][]): Json => ({
  '@type': 'FAQPage',
  '@id': id,
  mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})

const webPage = (r: Route): Json => ({
  '@type': 'WebPage',
  '@id': abs(r.path) + '#webpage',
  url: abs(r.path),
  name: r.title,
  description: r.description,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: 'en-IN',
  primaryImageOfPage: { '@type': 'ImageObject', url: imageFor(r.path) },
  ...(r.breadcrumb ? { breadcrumb: { '@id': abs(r.path) + '#breadcrumb' } } : {}),
})

const breadcrumbs = (r: Route): Json[] =>
  r.breadcrumb
    ? [
        {
          '@type': 'BreadcrumbList',
          '@id': abs(r.path) + '#breadcrumb',
          itemListElement: r.breadcrumb.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
        },
      ]
    : []

const tool = (t: (typeof TOOL_META)[number]): Json => ({
  '@type': 'WebApplication',
  '@id': abs(`/tools/${t.slug}`) + '#app',
  name: t.name,
  url: abs(`/tools/${t.slug}`),
  description: t.description,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any (web browser)',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'INR' },
  publisher: { '@id': ORG_ID },
})

// ---------- pages ----------
export const routes: Route[] = [
  {
    path: '/',
    file: 'index.html',
    title: 'WhatsApp Business API Setup, One-Time Fee | Aireplo',
    description: `Official WhatsApp Business API for your brand: your own Meta app, AI agent, team inbox and broadcasts, set up for you. One-time from ${inr(packages[0].price)}, no monthly fee.`,
    md: '/index.md',
    priority: 1,
    schema: () => [service(), faqPage(abs('/#faq'), faqs)],
  },
  {
    path: '/partners',
    file: 'partners.html',
    title: 'White-Label WhatsApp API for Agencies | Aireplo Partners',
    description: `Resell WhatsApp Business API setups under your agency’s brand. ${inr(partner.perClientSetup)} one-time per client, no monthly partner fee. You set the price and keep the profit.`,
    md: '/partners.md',
    card: { eyebrow: 'Partner program', heading: 'Sell white-label WhatsApp under your own brand' },
    priority: 0.8,
    breadcrumb: [['Home', '/'], ['Partner program', '/partners']],
    schema: () => [
      {
        '@type': 'Service',
        '@id': abs('/partners#service'),
        name: 'White-label WhatsApp Business API partner program',
        serviceType: 'White-label WhatsApp reseller program',
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'India' },
        offers: offer('Per-client setup for partners', partner.perClientSetup, 'One-time per client, plus GST. No monthly partner fee. Maintenance billed separately.'),
      },
      faqPage(abs('/partners#faq'), partnerFaqs),
    ],
  },
  {
    path: '/tools',
    file: 'tools.html',
    title: 'Free WhatsApp Tools for Business | Aireplo',
    description: 'Free WhatsApp tools: click-to-chat link and QR code generator, ready-made WhatsApp Business message templates and a text formatter. No sign-up.',
    md: '/tools.md',
    priority: 0.7,
    card: { eyebrow: 'Free tools', heading: 'Free WhatsApp tools for business' },
    breadcrumb: [['Home', '/'], ['Free WhatsApp tools', '/tools']],
    schema: () => [
      {
        '@type': 'ItemList',
        '@id': abs('/tools#list'),
        name: 'Free WhatsApp tools',
        itemListElement: TOOL_META.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/tools/${t.slug}`), name: t.name })),
      },
    ],
  },
  ...TOOL_META.map(
    (t): Route => ({
      path: `/tools/${t.slug}`,
      file: `tools/${t.slug}.html`,
      title: t.title,
      description: t.description,
      md: '/tools.md',
      priority: 0.7,
      breadcrumb: [['Home', '/'], ['Free WhatsApp tools', '/tools'], [t.name, `/tools/${t.slug}`]],
      schema: () => [tool(t)],
      card: { eyebrow: 'Free tool', heading: t.name },
    }),
  ),
  {
    path: '/inbox',
    file: 'inbox.html',
    title: `Team inbox | ${brand.name}`,
    description: 'Private team inbox.',
    noindex: true,
    prerender: false,
  },
  {
    path: '/pay',
    file: 'pay.html',
    title: `Pay ${brand.name} by UPI`,
    description: `Pay for your ${brand.name} package or add-ons by UPI: choose the amount and scan the QR code with Google Pay, PhonePe, Paytm or any UPI app.`,
    noindex: true,
  },
  {
    path: '/404',
    file: '404.html',
    title: `Page not found | ${brand.name}`,
    description: 'This page does not exist. See Aireplo’s WhatsApp Business API packages, comparisons, guides and free tools.',
    noindex: true,
    notFound: true,
  },
]

// ---------- comparisons, industries and guides ----------
const faqSchema = (path: string, list?: [string, string][]): Json[] =>
  list && list.length ? [faqPage(abs(path) + '#faq', list.map(([q, a]) => [plain(q), plain(a)] as [string, string]))] : []

function contentSchema(p: ContentPage): Json[] {
  if (p.kind === 'industry') {
    return [
      {
        '@type': 'Service',
        '@id': abs(p.path) + '#service',
        name: plain(p.h1),
        description: plain(p.description),
        serviceType: 'WhatsApp Business API setup',
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'India' },
        audience: { '@type': 'BusinessAudience', audienceType: p.name },
        offers: packages.map((pk) => offer(`${pk.name} package`, pk.price, pk.for)),
      },
      ...faqSchema(p.path, p.faqs),
    ]
  }
  return [
    {
      '@type': p.kind === 'guide' ? 'Article' : 'WebPage',
      ...(p.kind === 'guide' ? { '@id': abs(p.path) + '#article', mainEntityOfPage: { '@id': abs(p.path) + '#webpage' } } : { '@id': abs(p.path) + '#comparison' }),
      headline: plain(p.h1),
      name: plain(p.h1),
      description: plain(p.description),
      datePublished: p.published,
      dateModified: p.updated,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      image: imageFor(p.path),
      inLanguage: 'en-IN',
      ...(p.sources ? { citation: p.sources.map((s) => s.url) } : {}),
    },
    ...faqSchema(p.path, p.faqs),
  ]
}

const hubSchema = (h: Hub): Json[] => [
  {
    '@type': 'CollectionPage',
    '@id': abs(h.path) + '#collection',
    name: h.h1,
    url: abs(h.path),
    description: h.description,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: pagesOfKind(h.kind).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(p.path), name: plain(p.h1) })),
    },
  },
]

routes.push(
  ...hubs.map(
    (h): Route => ({
      path: h.path,
      file: `${h.path.slice(1)}.html`,
      title: h.title,
      description: h.description,
      md: `${h.path}.md`,
      priority: 0.6,
      breadcrumb: [['Home', '/'], [h.name, h.path]],
      schema: () => hubSchema(h),
      card: { eyebrow: h.eyebrow, heading: plain(h.h1) },
    }),
  ),
  ...contentPages.map(
    (p): Route => ({
      path: p.path,
      file: `${p.path.slice(1)}.html`,
      title: p.title,
      description: p.description,
      md: `${p.path}.md`,
      priority: p.kind === 'guide' ? 0.7 : 0.6,
      breadcrumb: [['Home', '/'], [hubOfKind(p.kind).name, hubOfKind(p.kind).path], [p.name, p.path]],
      schema: () => contentSchema(p),
      card: { eyebrow: p.eyebrow, heading: plain(p.h1) },
    }),
  ),
)

// legal pages are plain HTML files in public/; they only need sitemap entries
const legalPages = ['/privacy', '/terms', '/refund-policy']

export const routeFor = (path: string) => routes.find((r) => r.path === path.replace(/\/+$/, '') || (path === '/' && r.path === '/'))

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Share image for a page: its own card if it has one, else the site-wide image */
export const ogImagePath = (r: Pick<Route, 'path' | 'card'>) => (r.card ? `/og/${r.path.slice(1).replace(/\//g, '-')}.png` : '/og-image.png')
const imageFor = (path: string) => {
  const r = routes.find((x) => x.path === path)
  return abs(r ? ogImagePath(r) : '/og-image.png')
}

/** <head> tags for one page */
export function headFor(r: Route): string {
  const url = abs(r.path === '/' ? '/' : r.path)
  const graph = r.noindex ? [] : [organization(), website(), webPage(r), ...breadcrumbs(r), ...(r.schema?.() ?? [])]
  const tags = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    r.noindex ? `<meta name="robots" content="noindex, nofollow" />` : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    ...(r.notFound
      ? []
      : [`<link rel="canonical" href="${url}" />`, `<link rel="alternate" hreflang="en-IN" href="${url}" />`, `<link rel="alternate" hreflang="x-default" href="${url}" />`]),
    r.md ? `<link rel="alternate" type="text/markdown" href="${abs(r.md)}" title="${esc(r.title)} (markdown)" />` : '',
    `<link rel="describedby" type="text/markdown" href="${abs('/llms.txt')}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${brand.name}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:image" content="${abs(ogImagePath(r))}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(r.card ? `${r.card.heading} | ${brand.name}` : `${brand.name}: WhatsApp marketing, under your brand. One-time from ${inr(packages[0].price)}.`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${abs(ogImagePath(r))}" />`,
    graph.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>` : '',
  ]
  return tags.filter(Boolean).join('\n    ')
}

// ---------- robots.txt ----------
// Every search engine and AI assistant is welcome, so Aireplo can be found and cited.
const AI_AGENTS = [
  ['OpenAI', ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User']],
  ['Anthropic (Claude)', ['ClaudeBot', 'Claude-SearchBot', 'Claude-User']],
  ['Perplexity', ['PerplexityBot', 'Perplexity-User']],
  ['Google (Gemini, AI Overviews)', ['Google-Extended', 'GoogleOther']],
  ['Apple Intelligence', ['Applebot', 'Applebot-Extended']],
  ['Microsoft Copilot / Bing', ['Bingbot']],
  ['Meta AI', ['meta-externalagent', 'meta-externalfetcher']],
  ['Amazon', ['Amazonbot']],
  ['DuckDuckGo', ['DuckAssistBot']],
  ['Mistral', ['MistralAI-User']],
  ['Common Crawl (used by many AI models)', ['CCBot']],
  ['Cohere', ['cohere-ai']],
] as const

export function robotsTxt(): string {
  const blocks = AI_AGENTS.map(([who, agents]) => `# ${who}\n${agents.map((a) => `User-agent: ${a}`).join('\n')}\nAllow: /\nDisallow: /api/\nDisallow: /inbox\n`).join('\n')
  return `# ${brand.name} — ${site}
# Search engines and AI assistants are welcome to read and cite this site.
# AI-friendly summary: ${abs('/llms.txt')} · full details: ${abs('/llms-full.txt')}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /inbox

${blocks}
Sitemap: ${abs('/sitemap.xml')}
`
}

// ---------- sitemap.xml ----------
export function sitemapXml(date = new Date()): string {
  const day = date.toISOString().slice(0, 10)
  const entries = [
    ...routes.filter((r) => !r.noindex).map((r) => [r.path, r.priority ?? 0.5] as const),
    ...legalPages.map((p) => [p, 0.3] as const),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(([p, pr]) => `  <url><loc>${abs(p)}</loc><lastmod>${day}</lastmod><priority>${pr.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`
}

// ---------- markdown for AI agents ----------
const pkgLines = () =>
  packages
    .map((p) => `### ${p.name}: ${inr(p.price)} one-time (+ GST)\nFor ${p.for.toLowerCase()}.\n${p.features.map((f) => `- ${f}`).join('\n')}`)
    .join('\n\n')

export function homeMd(): string {
  return `# ${brand.name}: WhatsApp Business API setup with a one-time fee

> ${brand.name} sets up the official WhatsApp Business API (WhatsApp Cloud API by Meta) for Indian businesses and agencies. We build the brand’s own Meta app, connect its WhatsApp number and deliver a branded dashboard with a team inbox, broadcasts, chatbots and an AI agent. Brands pay a one-time project fee from ${inr(packages[0].price)} instead of a monthly subscription, and they own their Meta app, WhatsApp account and data.

Website: ${abs('/')} · WhatsApp: ${brand.whatsappDisplay} · Email: ${brand.email} · Slogan: “${brand.slogan}”

## What makes ${brand.name} different
- **Pay once, no monthly subscription.** Competitors such as Wati, AiSensy and Interakt charge every month; ${brand.name} charges a one-time project fee.
- **You own it.** The Meta app, WhatsApp Business account, number, contacts and chats are registered to the brand. If they stop working with us, they keep everything.
- **Done-for-you setup.** Facebook Business setup, Meta business verification help, Meta app development, number connection, display-name and template approvals.
- **No markup on WhatsApp charges.** Meta bills message charges directly to the brand’s own account at Meta’s rates.
- **White-label.** Dashboard with the brand’s logo, colors and domain; agencies can resell it under their own name.
- **Unlimited team members**, AI agent in Hindi, English and other Indian languages, and custom features on request.

## How it works
${steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.body}`).join('\n')}

## Features
- Broadcasts: send personalised WhatsApp campaigns to thousands, with segments, scheduling and retargeting.
- Shared team inbox: every customer chat in one place, with unlimited agents, notes and human takeover from the AI.
- No-code chatbot flows: FAQs, lead capture, order tracking and bookings.
- AI agent: trained on the brand’s catalog, FAQs or website; replies 24/7 in the customer’s language and hands over to a person.
- WhatsApp catalog and in-chat payments (Razorpay).
- Click-to-WhatsApp ads tracking, analytics, open API and webhooks.
- Integrations: Shopify, WooCommerce, Razorpay, Google Sheets, Zoho CRM, HubSpot, Zapier and more.

## Pricing (one-time, plus GST)
${pkgLines()}

### ${enterprise.name}: custom pricing (one-time)
For ${enterprise.for.toLowerCase()}.
${enterprise.features.map((f) => `- ${f}`).join('\n')}

### ${setupOnly.name}: ${inr(setupOnly.price)} one-time (+ GST)
${setupOnly.features.map((f) => `- ${f}`).join('\n')}
- No dashboard; upgrade to a package any time.

### Add-ons (one-time, plus GST)
${addOns.map((a) => `- ${a.name}: ${inr(a.price)}${a.unit ? ` per ${a.unit}` : ''}`).join('\n')}
- Anything custom: quoted after a call.

**Important:** ${pricingNote.full} ${pricingNote.meta}

## ${brand.name} vs typical WhatsApp platforms
| Topic | ${brand.name} (you own it) | Typical platforms (you rent) |
|---|---|---|
${compareRows.map(([t, us, them]) => `| ${t} | ${us} | ${them} |`).join('\n')}

## Frequently asked questions
${faqs.map(([q, a]) => `### ${q}\n${a}`).join('\n\n')}

## Contact
- WhatsApp: ${brand.whatsappDisplay} (wa.me/${brand.whatsapp})
- Email: ${brand.email}
- Requirements form and project estimator: ${abs('/#contact')}, ${abs('/#estimator')}
- Enterprise enquiries: ${abs('/#enterprise')}
`
}

export function partnersMd(): string {
  return `# ${brand.name} Partner Program: white-label WhatsApp API for agencies

> Agencies, resellers and freelancers can sell complete WhatsApp Business API setups under their own brand. ${brand.name} builds each client’s Meta app and branded dashboard; the partner sets the price, bills the client directly and keeps the margin.

- Partner cost: ${inr(partner.perClientSetup)} one-time per client setup, plus GST. No monthly partner fee.
- Maintenance for each client is not included and is billed separately.
- Clients never see the ${brand.name} name: their logo, colors, domain, login page, emails and invoices.
- Meta bills WhatsApp messages directly to each client’s own account.
- Who it’s for: digital marketing agencies, software resellers and IT firms, freelancers and consultants, franchises and business groups.
- Example: a partner charging clients ${inr(49999)} keeps ${inr(49999 - partner.perClientSetup)} per client.

## Partner FAQ
${partnerFaqs.map(([q, a]) => `### ${q}\n${a}`).join('\n\n')}

Apply: ${abs('/partners')} or WhatsApp ${brand.whatsappDisplay}.
`
}

export function toolsMd(): string {
  return `# Free WhatsApp tools by ${brand.name}

> Free, no sign-up tools for businesses using WhatsApp.

${TOOL_META.map((t) => `## [${t.name}](${abs(`/tools/${t.slug}`)})\n${t.description}`).join('\n\n')}

## Template library (${templates.length} templates)
${templates.map((t) => `- **${t.name}** (${t.category}, ${t.industry}): ${t.body}`).join('\n')}
`
}

const absLinks = (md: string) => md.replace(/\]\(\//g, `](${site}/`)

const blockMd = (b: Block): string => {
  switch (b.type) {
    case 'h2':
      return `## ${b.text}`
    case 'h3':
      return `### ${b.text}`
    case 'p':
      return b.text
    case 'ul':
      return b.items.map((i) => `- ${i}`).join('\n')
    case 'ol':
      return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n')
    case 'table':
      return [`| ${b.head.join(' | ')} |`, `|${b.head.map(() => '---').join('|')}|`, ...b.rows.map((r) => `| ${r.join(' | ')} |`), b.caption ? `\n_${b.caption}_` : ''].filter(Boolean).join('\n')
    case 'callout':
      return `> ${b.title ? `**${b.title}:** ` : ''}${b.text}`
  }
}

export function contentMd(p: ContentPage): string {
  return absLinks(
    [
      `# ${p.h1}`,
      `> ${p.intro}`,
      `Updated: ${p.updated} · Source: ${abs(p.path)}`,
      ...p.blocks.map(blockMd),
      p.faqs?.length ? `## Frequently asked questions\n\n${p.faqs.map(([q, a]) => `### ${q}\n${a}`).join('\n\n')}` : '',
      p.sources?.length ? `## Sources\n${p.sources.map((s) => `- [${s.label}](${s.url})`).join('\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n') + '\n',
  )
}

export function hubMd(h: Hub): string {
  return absLinks(`# ${h.h1}\n\n> ${h.intro}\n\n${pagesOfKind(h.kind).map((p) => `- [${p.h1}](${abs(p.path)}): ${p.description}`).join('\n')}\n`)
}

/** Every generated text file, keyed by its path inside dist/. */
export function extraFiles(date = new Date()): Record<string, string> {
  return {
    'robots.txt': robotsTxt(),
    'sitemap.xml': sitemapXml(date),
    'llms.txt': llmsTxt(),
    'llms-full.txt': llmsFullTxt(),
    'index.md': homeMd(),
    'partners.md': partnersMd(),
    'tools.md': toolsMd(),
    ...Object.fromEntries(hubs.map((h) => [`${h.path.slice(1)}.md`, hubMd(h)])),
    ...Object.fromEntries(contentPages.map((p) => [`${p.path.slice(1)}.md`, contentMd(p)])),
  }
}

const contentSectionsMd = () =>
  hubs
    .map((h) => {
      const heading = h.kind === 'guide' ? 'Guides' : h.kind === 'compare' ? 'Comparisons' : 'Industries'
      const lines = pagesOfKind(h.kind).map((p) => `- [${plain(p.h1)}](${abs(`${p.path}.md`)}): ${p.description}`)
      return `## ${heading}\n${lines.join('\n')}`
    })
    .join('\n\n')

export function llmsTxt(): string {
  return `# ${brand.name}

> ${brand.name} sets up the official WhatsApp Business API for Indian businesses with a one-time fee instead of a monthly subscription. We build the brand’s own Meta app, connect its WhatsApp number, and deliver a branded dashboard with a team inbox, broadcasts, chatbots and a Hindi/English AI agent. The brand owns its Meta app, number and data. Packages start at ${inr(packages[0].price)} one-time (+ GST); maintenance is billed separately; Meta bills WhatsApp messages directly with no markup.

Key facts:
- Business model: one-time project fee, no monthly subscription (unlike subscription platforms such as Wati, AiSensy and Interakt).
- Packages (one-time, + GST): ${packages.map((p) => `${p.name} ${inr(p.price)}`).join(', ')}; ${enterprise.name}: custom pricing; ${setupOnly.name} only: ${inr(setupOnly.price)}.
- Maintenance after handover (hosting, updates, support) is not included and is billed separately.
- White-label partner program for agencies: ${inr(partner.perClientSetup)} one-time per client, no monthly partner fee.
- Serves India; replies in English, Hindi, Hinglish and other Indian languages.
- Contact: WhatsApp ${brand.whatsappDisplay}, email ${brand.email}.

## Pages
- [Home: features, pricing, comparison, FAQ](${abs('/index.md')}): full product overview in markdown
- [Partner program for agencies](${abs('/partners.md')}): white-label reselling, partner pricing and FAQ
- [Free WhatsApp tools](${abs('/tools.md')}): link and QR generator, message templates, text formatter
- [Everything in one file](${abs('/llms-full.txt')}): all of the above combined

${contentSectionsMd()}

## Policies
- [Privacy Policy](${abs('/privacy')}): data handled, AI processing, India DPDP Act rights
- [Terms of Service](${abs('/terms')}): one-time fees, Meta approvals, ownership, acceptable use
- [Refund Policy](${abs('/refund-policy')}): refunds by project stage

## Optional
- [Website](${abs('/')}): interactive site with project estimator and live AI chat
- [Sitemap](${abs('/sitemap.xml')})
`
}

export function llmsFullTxt(): string {
  return [homeMd(), partnersMd(), toolsMd(), ...contentPages.map(contentMd), `# Policies\n- Privacy Policy: ${abs('/privacy')}\n- Terms of Service: ${abs('/terms')}\n- Refund Policy: ${abs('/refund-policy')}\n`].join('\n---\n\n')
}

// The footer keeps its own short list of content links; stop the build if it no longer matches the pages.
for (const c of contentLinks) {
  const want = JSON.stringify([...pagesOfKind(c.kind).map((p) => [p.name, p.path]), [c.all[0], hubOfKind(c.kind).path]])
  const have = JSON.stringify([...c.pages, c.all])
  if (want !== have) throw new Error(`src/content/links.ts is out of date for "${c.kind}".\nExpected: ${want}`)
}
