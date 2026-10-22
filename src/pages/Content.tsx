import { ArrowRight, BookOpen, Building2, ChevronRight, Info, Scale } from 'lucide-react'
import { brand } from '@/brand'
import { contentAt, hubOfKind, linkName, pagesOfKind, type Block, type ContentKind, type ContentPage, type Hub } from '@/content'
import { RichText } from '@/components/RichText'
import { Spotlight } from '@/components/ui/spotlight'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { cn } from '@/lib/utils'

const KIND_ICON: Record<ContentKind, typeof Scale> = { compare: Scale, industry: Building2, guide: BookOpen }
const formatDate = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function Crumbs({ items }: { items: [string, string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-center gap-1 text-xs text-white/45">
      {items.map(([name, href], i) => (
        <span key={href} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
          {i === items.length - 1 ? <span aria-current="page" className="text-white/70">{name}</span> : <a href={href} className="hover:text-white">{name}</a>}
        </span>
      ))}
    </nav>
  )
}

function Hero({ eyebrow, h1, intro, kind, crumbs, meta }: { eyebrow: string; h1: string; intro: string; kind: ContentKind; crumbs: [string, string][]; meta?: string }) {
  const Icon = KIND_ICON[kind]
  return (
    <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Crumbs items={crumbs} />
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand">
          <Icon className="size-3.5" aria-hidden="true" /> {eyebrow}
        </p>
        <h1 className="font-display mt-5 text-[2.2rem] leading-[1.06] font-extrabold text-balance text-white sm:text-5xl">{h1}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/65 sm:text-lg">
          <RichText text={intro} />
        </p>
        {meta && <p className="mt-4 text-xs text-white/40">{meta}</p>}
      </div>
    </section>
  )
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'h2':
      return <h2 id={slug(b.text)} className="font-display mt-12 scroll-mt-24 text-2xl font-bold text-balance text-white sm:text-3xl">{b.text}</h2>
    case 'h3':
      return <h3 className="mt-8 text-lg font-semibold text-white">{b.text}</h3>
    case 'p':
      return <p className="mt-4 leading-relaxed text-white/70"><RichText text={b.text} /></p>
    case 'ul':
      return (
        <ul className="mt-4 space-y-2.5 text-white/70">
          {b.items.map((t) => (
            <li key={t} className="flex gap-3"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" /><span className="leading-relaxed"><RichText text={t} /></span></li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="mt-4 space-y-3 text-white/70">
          {b.items.map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand/15 text-xs font-bold text-brand">{i + 1}</span>
              <span className="pt-0.5 leading-relaxed"><RichText text={t} /></span>
            </li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <figure className="mt-5">
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white/[0.04] text-white">
                <tr>{b.head.map((h, i) => <th key={i} scope="col" className="p-3.5 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i} className="border-t border-line align-top">
                    {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="p-3.5 font-medium text-white/90"><RichText text={c} /></th> : <td key={j} className="p-3.5 text-white/70"><RichText text={c} /></td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.caption && <figcaption className="mt-2 text-xs text-white/40">{b.caption}</figcaption>}
        </figure>
      )
    case 'callout':
      return (
        <aside className="mt-6 flex gap-3 rounded-2xl border border-brand/30 bg-brand/[0.07] p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
          <div>
            {b.title && <p className="font-semibold text-white">{b.title}</p>}
            <p className="mt-1 text-sm leading-relaxed text-white/70"><RichText text={b.text} /></p>
          </div>
        </aside>
      )
  }
}

function Article({ page }: { page: ContentPage }) {
  const hub = hubOfKind(page.kind)
  const toc = page.blocks.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')
  const cta = page.cta ?? { title: 'Get your WhatsApp setup, owned by you', text: `One-time packages from ${brand.currency}14,999. No monthly subscription.`, button: 'See packages', href: '/#pricing' }
  return (
    <>
      <Hero
        eyebrow={page.eyebrow}
        h1={page.h1}
        intro={page.intro}
        kind={page.kind}
        crumbs={[['Home', '/'], [hub.name, hub.path], [page.name, page.path]]}
        meta={`Updated ${formatDate(page.updated)} · ${brand.name} team`}
      />
      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        {toc.length > 2 && (
          <nav aria-label="On this page" className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/45 uppercase">On this page</p>
            <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              {toc.map((h) => (
                <li key={h.text}><a href={`#${slug(h.text)}`} className="text-white/70 hover:text-brand">{h.text}</a></li>
              ))}
            </ol>
          </nav>
        )}

        <article>
          {page.blocks.map((b, i) => <BlockView key={i} b={b} />)}

          {page.faqs && page.faqs.length > 0 && (
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="font-display mt-14 text-2xl font-bold text-white sm:text-3xl">Frequently asked questions</h2>
              <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-panel">
                {page.faqs.map(([q, a]) => (
                  <div key={q} className="p-5">
                    <h3 className="font-semibold text-white">{q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65"><RichText text={a} /></p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        <section className="mt-14 flex flex-col items-start gap-4 rounded-3xl border border-brand/30 bg-gradient-to-b from-brand/[0.12] to-panel p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{cta.title}</h2>
            <p className="mt-2 text-white/60">{cta.text}</p>
          </div>
          <ShimmerButton href={cta.href} className="shrink-0">{cta.button} <ArrowRight className="size-4" /></ShimmerButton>
        </section>

        {page.sources && page.sources.length > 0 && (
          <section className="mt-12" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-sm font-semibold tracking-[0.12em] text-white/50 uppercase">Sources</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {page.sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener" className="text-white/60 underline underline-offset-4 hover:text-white">{s.label}</a></li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/35">Prices and rates were checked on {formatDate(page.updated)}. Other companies change their prices; check their websites for the latest.</p>
          </section>
        )}

        {page.related && page.related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-sm font-semibold tracking-[0.12em] text-white/50 uppercase">Keep reading</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {page.related.map((href) => (
                <a key={href} href={href} className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-panel p-4 text-sm font-medium text-white transition-colors hover:border-brand/40">
                  {linkName(href)} <ArrowRight className="size-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function HubView({ hub }: { hub: Hub }) {
  const pages = pagesOfKind(hub.kind)
  const Icon = KIND_ICON[hub.kind]
  return (
    <>
      <Hero eyebrow={hub.eyebrow} h1={hub.h1} intro={hub.intro} kind={hub.kind} crumbs={[['Home', '/'], [hub.name, hub.path]]} />
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className={cn('grid gap-4', pages.length === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3')}>
          {pages.map((p) => (
            <a key={p.path} href={p.path} className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-brand/40">
              <Icon className="size-5 text-brand" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-white">{p.h1}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{p.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                Read <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

export function Content({ path }: { path: string }) {
  const found = contentAt(path)
  if (found?.page) return <Article page={found.page} />
  if (found?.hub) return <HubView hub={found.hub} />
  return (
    <section className="mx-auto max-w-xl px-4 pt-40 pb-32 text-center">
      <h1 className="font-display text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-white/60">This page doesn’t exist. Try our <a className="text-brand underline" href="/blog">guides</a> or go <a className="text-brand underline" href="/">home</a>.</p>
    </section>
  )
}
