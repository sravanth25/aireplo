// Build-time pre-rendering entry: turns each page into HTML so search engines and AI crawlers can read it.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { setServerPath } from './lib/router'

export function render(path: string) {
  setServerPath(path)
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export { routes, headFor, robotsTxt, sitemapXml, llmsTxt, llmsFullTxt, homeMd, partnersMd, toolsMd } from './seo'
