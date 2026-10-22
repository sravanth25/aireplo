import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { currentPath, pageFor } from './lib/router'
import { loadPage } from './pages/registry'

// The pre-rendered page stays on screen while this page's code downloads.
loadPage(pageFor(currentPath())).then(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
)
