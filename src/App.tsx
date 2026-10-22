import { Navbar } from '@/sections/Navbar'
import { Footer } from '@/sections/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { currentPath, usePage } from '@/lib/router'
import { pageComponent } from '@/pages/registry'

export default function App() {
  const page = usePage()
  // loaded before the app starts (main.tsx / entry-server.tsx)
  const Page = pageComponent(page)!
  // the team inbox is a private full-screen app, without the website around it
  if (page === 'inbox') return <Page path={currentPath()} />
  return (
    <>
      <Navbar page={page} />
      <main key={page}>
        <Page path={currentPath()} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
