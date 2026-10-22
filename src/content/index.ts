import { comparePages, compareHub } from './compare'
import { industryPages, industriesHub } from './industries'
import { guidePages, guidesHub } from './guides'
import type { ContentKind, ContentPage, Hub } from './types'

export const contentPages: ContentPage[] = [...comparePages, ...industryPages, ...guidePages]
export const hubs: Hub[] = [compareHub, industriesHub, guidesHub]

export const pagesOfKind = (kind: ContentKind) => contentPages.filter((p) => p.kind === kind)
export const hubOfKind = (kind: ContentKind) => hubs.find((h) => h.kind === kind)!

/** The content page or hub at a path, if any. */
export function contentAt(path: string): { page?: ContentPage; hub?: Hub } | null {
  const p = path.replace(/\/+$/, '') || '/'
  const page = contentPages.find((c) => c.path === p)
  if (page) return { page }
  const hub = hubs.find((h) => h.path === p)
  return hub ? { hub } : null
}

export const linkName = (path: string) => contentPages.find((c) => c.path === path)?.name ?? hubs.find((h) => h.path === path)?.name ?? path

export type { ContentPage, Hub, Block, ContentKind } from './types'
export { plain } from './types'
