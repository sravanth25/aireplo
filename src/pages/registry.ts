import type { ComponentType } from 'react'
import type { Page } from '@/lib/router'

// Each page is its own download, so a guide doesn't load the home page's video player or the inbox.
// The browser loads the current page's file before the app starts (see main.tsx);
// the build-time pre-render registers every page up front (see entry-server.tsx).
export type PageComponent = ComponentType<{ path: string }>

export const pageSources: Record<Page, string> = {
  home: 'src/pages/Home.tsx',
  partners: 'src/pages/Partners.tsx',
  tools: 'src/pages/Tools.tsx',
  inbox: 'src/pages/Inbox.tsx',
  content: 'src/pages/Content.tsx',
  pay: 'src/pages/Pay.tsx',
  notfound: 'src/pages/NotFound.tsx',
}

const loaders: Record<Page, () => Promise<PageComponent>> = {
  home: () => import('./Home').then((m) => m.Home),
  partners: () => import('./Partners').then((m) => m.Partners),
  tools: () => import('./Tools').then((m) => m.Tools),
  inbox: () => import('./Inbox').then((m) => m.Inbox),
  content: () => import('./Content').then((m) => m.Content),
  pay: () => import('./Pay').then((m) => m.Pay),
  notfound: () => import('./NotFound').then((m) => m.NotFound),
}

const loaded: Partial<Record<Page, PageComponent>> = {}

export async function loadPage(page: Page) {
  loaded[page] ??= await loaders[page]()
  return loaded[page]
}

export const registerPages = (pages: Record<Page, PageComponent>) => Object.assign(loaded, pages)

export const pageComponent = (page: Page) => loaded[page]
