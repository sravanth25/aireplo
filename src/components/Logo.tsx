import { brand } from '@/brand'
import { AireploIcon, AireploWordmark } from '@/components/AireploIcon'

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2" aria-label={`${brand.name} home`}>
      <AireploIcon className="h-9 w-auto" />
      <AireploWordmark className="font-display text-[1.55rem] leading-none font-extrabold text-white" />
    </a>
  )
}
