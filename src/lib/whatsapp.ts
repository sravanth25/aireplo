import { brand } from '@/brand'

/** Build a wa.me click-to-chat link. */
export function waLink(text?: string, number: string = brand.whatsapp) {
  const n = number.replace(/\D/g, '')
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
