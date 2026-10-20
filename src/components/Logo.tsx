import { brand } from '@/brand'
import { AireploMark, AireploWordmark } from '@/components/AireploMark'

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2" aria-label={`${brand.name} home`}>
      <AireploMark className="size-8 sm:size-9" />
      <AireploWordmark className="text-[1.6rem] sm:text-[1.75rem]" color="#FFFFFF" />
    </a>
  )
}
