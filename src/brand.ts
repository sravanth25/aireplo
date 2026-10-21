// Edit this file to rebrand the whole site: name, contact, prices.
export const brand = {
  name: 'Aireplo',
  tagline: 'AI-powered WhatsApp Business platform, under your brand',
  // WhatsApp number (country code, digits only) that receives requirement forms
  whatsapp: '17112330377',
  email: 'hello@aireplo.com',
  slogan: 'Sell. Support. Reply on WhatsApp.',
  // How the number is shown on the site
  whatsappDisplay: '+1 711-233-0377',
  currency: '₹',
}

// White-label partner program (placeholder numbers — set your own)
export const partner = {
  monthlyFee: 5999, // partner plan fee
  includedClients: 10, // client workspaces included in the fee
  extraClientCost: 299, // your cost per client beyond the included ones
}

export type Plan = {
  id: string
  name: string
  monthly: number
  blurb: string
  features: string[]
  highlight?: boolean
  cta: string
}

// Placeholder prices — set your own. Yearly = 20% off.
export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 799,
    blurb: 'For shops starting on WhatsApp',
    cta: 'Start free trial',
    features: [
      'Official WhatsApp Business API',
      'Unlimited team members',
      'Shared team inbox',
      'Broadcasts & scheduling',
      '2 chatbot flows',
      '0% markup on Meta charges',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 1799,
    blurb: 'For growing teams that automate',
    cta: 'Start free trial',
    highlight: true,
    features: [
      'Everything in Starter',
      'Unlimited chatbot flows',
      'AI agent (1,000 replies/mo)',
      'Shopify, WooCommerce, Razorpay',
      'Click-to-WhatsApp ad tracking',
      'Retargeting & analytics',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 2999,
    blurb: 'For high-volume brands',
    cta: 'Start free trial',
    features: [
      'Everything in Growth',
      'AI agent (5,000 replies/mo)',
      '3 WhatsApp numbers',
      'API & webhooks',
      'Role permissions & audit log',
      'Priority support',
    ],
  },
  {
    id: 'partner',
    name: 'White-label Partner',
    monthly: 5999,
    blurb: 'Resell under your own brand',
    cta: 'Talk to us',
    features: [
      'Your logo, colors & domain',
      'Unlimited client workspaces',
      'Set your own client prices',
      'Branded login & emails',
      'Custom modules on request',
      'Dedicated launch manager',
    ],
  },
]

// Modules for the "build your own plan" calculator
export const modules = [
  { id: 'inbox', name: 'Team inbox', price: 0, required: true },
  { id: 'broadcast', name: 'Broadcasts', price: 0, required: true },
  { id: 'bot', name: 'Chatbot builder', price: 399 },
  { id: 'ai', name: 'AI agent', price: 599 },
  { id: 'commerce', name: 'Catalog & payments', price: 299 },
  { id: 'ads', name: 'Click-to-WhatsApp ads', price: 199 },
  { id: 'crm', name: 'CRM & integrations', price: 299 },
  { id: 'api', name: 'API & webhooks', price: 399 },
  { id: 'whitelabel', name: 'White-label branding', price: 1499 },
] as const
