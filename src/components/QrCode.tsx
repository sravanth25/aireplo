import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export function useQrDataUrl(text: string, color = '#07090c') {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let alive = true
    QRCode.toDataURL(text, { margin: 1, width: 512, color: { dark: color, light: '#ffffff' } })
      .then((u) => alive && setUrl(u))
      .catch(() => alive && setUrl(''))
    return () => {
      alive = false
    }
  }, [text, color])
  return url
}

export function QrCode({ text, className, alt }: { text: string; className?: string; alt: string }) {
  const url = useQrDataUrl(text)
  return url ? <img src={url} alt={alt} className={className} /> : <div className={className} />
}
