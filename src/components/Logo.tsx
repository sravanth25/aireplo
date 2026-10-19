import { brand } from '@/brand'
import logo from '@/assets/aireplo-logo.png'

export function Logo() {
  return (
    <a href="#top" className="flex items-center" aria-label={`${brand.name} home`}>
      <img src={logo} alt={brand.name} className="h-8 w-auto sm:h-9" />
    </a>
  )
}
