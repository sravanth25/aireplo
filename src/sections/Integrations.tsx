import { Marquee } from '@/components/ui/marquee'

const items = ['Shopify', 'WooCommerce', 'Razorpay', 'Google Sheets', 'Zoho CRM', 'HubSpot', 'Meta Ads', 'Instagram DM', 'Zapier', 'Calendly', 'Stripe', 'Webhooks']

export function Integrations() {
  return (
    <section className="py-10">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/40">Plugs into the tools you already use</p>
      <Marquee>
        {items.map((i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-line bg-white/[0.03] px-5 py-2 text-sm font-medium text-white/70">{i}</span>
        ))}
      </Marquee>
    </section>
  )
}
