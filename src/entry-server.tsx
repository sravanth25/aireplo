// Build-time pre-rendering entry: turns each page into HTML so search engines and AI crawlers can read it.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { setServerPath } from './lib/router'
import { registerPages } from './pages/registry'
import { Home } from './pages/Home'
import { Partners } from './pages/Partners'
import { Tools } from './pages/Tools'
import { Inbox } from './pages/Inbox'
import { Content } from './pages/Content'
import { NotFound } from './pages/NotFound'
import { Pay } from './pages/Pay'

registerPages({ home: Home, partners: Partners, tools: Tools, inbox: Inbox, content: Content, notfound: NotFound, pay: Pay })

export function render(path: string) {
  setServerPath(path)
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export { routes, headFor, extraFiles, ogImagePath } from './seo'
export { pageFor } from './lib/router'
export { pageSources } from './pages/registry'
export { brand, packages, inr } from './brand'
