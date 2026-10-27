import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, IndianRupee, MessageCircle, ShieldCheck, Smartphone } from 'lucide-react'
import { brand, inr, packages, setupOnly, upi } from '@/brand'
import { waLink } from '@/lib/whatsapp'
import { useQrDataUrl } from '@/components/QrCode'
import { CopyButton } from '@/components/CopyButton'
import { Spotlight } from '@/components/ui/spotlight'
import { cn } from '@/lib/utils'

// Pay page: the client picks a package or types an amount, and gets a UPI QR code for that exact amount.
// Shareable links: /pay?plan=growth  or  /pay?amount=12000&for=Extra%20integration

const plans = [
  { id: 'setup', name: setupOnly.name, price: setupOnly.price },
  ...packages.map((p) => ({ id: p.id as string, name: `${p.name} package`, price: p.price })),
]
const UPI_LIMIT = 100000
const field = 'w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/60'

const rupees = (n: number) => brand.currency + n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })
const round2 = (n: number) => Math.round(n * 100) / 100
// UPI notes should be short and plain
const cleanNote = (s: string) => s.replace(/[^A-Za-z0-9 .,\-/]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60)
const newRef = () => 'AIR-' + Math.random().toString(36).slice(2, 8).toUpperCase()

function readUrl() {
  if (typeof window === 'undefined') return { plan: 'growth', amount: '', what: '' }
  const q = new URLSearchParams(window.location.search)
  const amount = q.get('amount') ?? ''
  const plan = q.get('plan') ?? (amount ? 'custom' : 'growth')
  return { plan: plans.some((p) => p.id === plan) ? plan : 'custom', amount, what: q.get('for') ?? '' }
}

export function Pay() {
  const initial = useMemo(readUrl, [])
  const [plan, setPlan] = useState(initial.plan)
  const [custom, setCustom] = useState(initial.amount)
  const [what, setWhat] = useState(initial.what)
  const [gst, setGst] = useState(upi.gstRate > 0)
  const [payer, setPayer] = useState('')
  const [ref] = useState(newRef)

  const chosen = plans.find((p) => p.id === plan)
  const base = chosen ? chosen.price : Number(custom.replace(/[^0-9.]/g, '')) || 0
  const tax = chosen && gst ? round2(base * upi.gstRate) : 0
  const total = round2(base + tax)
  const label = chosen ? chosen.name : what.trim() || 'Payment'
  const note = cleanNote(`${brand.name} ${label} ${ref}`)
  const ready = upi.id !== '' && total >= 1 && total <= UPI_LIMIT

  // the UPI ID stays as written (some UPI apps reject an encoded @)
  const upiUrl = `upi://pay?pa=${upi.id}&pn=${encodeURIComponent(upi.payeeName)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`
  const qr = useQrDataUrl(ready ? upiUrl : 'about:blank')

  // keep the address bar shareable
  useEffect(() => {
    const q = new URLSearchParams()
    if (chosen) q.set('plan', chosen.id)
    else {
      if (custom) q.set('amount', custom)
      if (what) q.set('for', what)
    }
    window.history.replaceState(null, '', `/pay${q.size ? '?' + q : ''}`)
  }, [chosen, custom, what])

  const paidMessage = `Hi ${brand.name}! I've paid ${rupees(total)} by UPI for ${label}.\nReference: ${ref}${payer.trim() ? `\nName / business: ${payer.trim()}` : ''}\nI'll attach the payment screenshot.`

  return (
    <section className="relative overflow-hidden pt-28 pb-24 sm:pt-36">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand">
            <IndianRupee className="size-3.5" aria-hidden="true" /> Pay by UPI
          </p>
          <h1 className="font-display mt-5 text-4xl font-extrabold text-balance text-white sm:text-5xl">Pay {brand.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/60">Choose what you’re paying for and scan the QR code with any UPI app: Google Pay, PhonePe, Paytm or your bank’s app.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          {/* 1. what are you paying for */}
          <div className="rounded-3xl border border-line bg-panel p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white">1. What are you paying for?</h2>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[...plans, { id: 'custom', name: 'Other amount', price: 0 }].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  aria-pressed={plan === p.id}
                  className={cn('rounded-2xl border p-4 text-left transition-colors', plan === p.id ? 'border-brand bg-brand/10' : 'border-line hover:border-white/25')}
                >
                  <span className="block text-sm font-semibold text-white">{p.name}</span>
                  <span className="mt-0.5 block text-sm text-white/55">{p.id === 'custom' ? 'Add-ons, balance or maintenance' : `${inr(p.price)} one-time`}</span>
                </button>
              ))}
            </div>

            {plan === 'custom' && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-white/60">Amount (₹)</span>
                  <input className={cn(field, 'mt-1.5')} inputMode="decimal" placeholder="e.g. 6000" value={custom} onChange={(e) => setCustom(e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-white/60">For</span>
                  <input className={cn(field, 'mt-1.5')} placeholder="e.g. Extra integration" maxLength={40} value={what} onChange={(e) => setWhat(e.target.value)} />
                </label>
                <p className="text-xs text-white/40 sm:col-span-2">Enter the amount from your quote.</p>
              </div>
            )}

            {chosen && upi.gstRate > 0 && (
              <label className="mt-5 flex items-center gap-3 text-sm text-white/70">
                <input type="checkbox" className="size-4 accent-[#22c55e]" checked={gst} onChange={(e) => setGst(e.target.checked)} />
                Add GST ({Math.round(upi.gstRate * 100)}%)
              </label>
            )}

            <label className="mt-5 block">
              <span className="text-xs font-medium text-white/60">Your name or business (optional)</span>
              <input className={cn(field, 'mt-1.5')} placeholder="So we can match your payment" maxLength={60} value={payer} onChange={(e) => setPayer(e.target.value)} />
            </label>

            <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between text-white/60"><dt>{label}</dt><dd className="tabular-nums">{rupees(base)}</dd></div>
              {tax > 0 && <div className="flex justify-between text-white/60"><dt>GST {Math.round(upi.gstRate * 100)}%</dt><dd className="tabular-nums">{rupees(tax)}</dd></div>}
              <div className="flex justify-between text-lg font-bold text-white"><dt>Total</dt><dd className="tabular-nums">{rupees(total)}</dd></div>
            </dl>
          </div>

          {/* 2. scan and pay */}
          <div className="rounded-3xl border border-brand/30 bg-gradient-to-b from-brand/[0.10] to-panel p-6 text-center sm:p-8">
            <h2 className="text-lg font-semibold text-white">2. Scan and pay</h2>
            {!upi.id ? (
              <div className="mt-6 rounded-2xl border border-line bg-ink/60 p-6 text-sm text-white/65">
                Online payment is being set up. Message us on WhatsApp and we’ll send payment details.
                <a href={waLink(`Hi ${brand.name}! I'd like to pay ${rupees(total)} for ${label}.`)} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand py-3 font-semibold text-ink">
                  <MessageCircle className="size-4" /> Message on WhatsApp
                </a>
              </div>
            ) : total < 1 ? (
              <p className="mt-6 rounded-2xl border border-line bg-ink/60 p-6 text-sm text-white/55">Enter an amount to see your QR code.</p>
            ) : total > UPI_LIMIT ? (
              <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-sm text-amber-100/90">
                UPI allows up to {inr(UPI_LIMIT)} per payment. Pay in parts (use “Other amount”), or{' '}
                <a className="underline" href={waLink(`Hi ${brand.name}! I need bank details to pay ${rupees(total)} for ${label}.`)} target="_blank" rel="noreferrer">ask us for bank transfer details</a>.
              </div>
            ) : (
              <>
                <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3 shadow-xl shadow-black/40">
                  {qr ? <img src={qr} alt={`UPI QR code to pay ${rupees(total)} to ${upi.payeeName}`} className="size-56 sm:size-64" /> : <div className="size-56 sm:size-64" />}
                </div>
                <p className="mt-4 font-display text-3xl font-extrabold text-white tabular-nums">{rupees(total)}</p>
                <p className="mt-1 text-sm text-white/55">to <b className="text-white/85">{upi.payeeName}</b> · {upi.id}</p>
                <p className="mt-1 text-xs text-white/40">Reference {ref}</p>

                <a href={upiUrl} className="mt-5 flex items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-ink hover:brightness-110 sm:hidden">
                  <Smartphone className="size-4" /> Pay with a UPI app
                </a>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <CopyButton text={upi.id} label="Copy UPI ID" />
                  <CopyButton text={total.toFixed(2)} label="Copy amount" />
                </div>
              </>
            )}

            {ready && (
              <div className="mt-6 border-t border-line pt-5 text-left">
                <p className="flex items-center gap-2 text-sm font-semibold text-white"><CheckCircle2 className="size-4 text-brand" /> 3. After paying</p>
                <p className="mt-1 text-sm text-white/55">Send us the confirmation with your payment screenshot. We’ll reply with your receipt.</p>
                <a href={waLink(paidMessage)} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-semibold text-white hover:bg-white/5">
                  <MessageCircle className="size-4" /> I’ve paid: send confirmation
                </a>
              </div>
            )}
            <p className="mt-5 flex items-start gap-2 text-left text-xs text-white/40">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
              <span>Before you pay, check that the UPI ID in your app is <b className="font-semibold break-all text-white/60">{upi.id}</b>. We never ask for your UPI PIN.</span>
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-white/35">
          All prices are one-time charges. See our <a href="/refund-policy" className="underline hover:text-white/60">refund policy</a> and <a href="/terms" className="underline hover:text-white/60">terms</a>.
        </p>
      </div>
    </section>
  )
}
