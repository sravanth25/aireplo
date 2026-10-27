// Edit this file to rebrand the whole site: name, contact, prices.
// The website, the AI chat and the WhatsApp bot all read prices from here.
export const brand = {
  name: 'Aireplo',
  tagline: 'AI-powered WhatsApp Business platform, under your brand',
  // WhatsApp number (country code, digits only) that receives requirement forms
  whatsapp: '17112330377',
  email: 'sanasravanth25@gmail.com',
  slogan: 'Sell. Support. Reply on WhatsApp.',
  // How the number is shown on the site
  whatsappDisplay: '+1 711-233-0377',
  currency: '₹',
  // Public address of the website (change to https://aireplo.com once the domain is connected)
  siteUrl: 'https://aireplo.vercel.app',
}

export const inr = (n: number) => brand.currency + n.toLocaleString('en-IN')

// Online payments on /pay: a UPI QR code for the exact amount, paid straight into this UPI ID.
export const upi = {
  // your UPI ID, e.g. yourname@okhdfcbank (leave empty to hide the QR and ask clients to message you)
  id: 'sanasravanth25-1@okhdfcbank',
  // name shown in the customer's UPI app
  payeeName: 'Aireplo',
  // add GST on top of package prices (only if you are GST-registered)
  gstRate: 0.18,
}

// Shown next to every price
export const pricingNote = {
  short: 'One-time · + GST',
  full: 'All prices are one-time charges, plus GST. Maintenance after handover (hosting, updates and support) is not included and is billed separately.',
  meta: 'WhatsApp message charges are billed by Meta directly to your own account, at Meta’s rates.',
}

// Things an add-on can be "included" in
export type IncludeKey = 'ai' | 'domain' | 'catalog' | 'ads'

export type Package = {
  id: 'launch' | 'growth' | 'pro'
  name: string
  price: number
  for: string
  features: string[]
  includes: IncludeKey[]
  highlight?: boolean
}

export const packages: Package[] = [
  {
    id: 'launch',
    name: 'Launch',
    price: 14999,
    for: 'Small shops and new brands',
    includes: [],
    features: [
      'Facebook Business & Meta verification help',
      'Your own Meta app, built for you',
      '1 WhatsApp number connected',
      'Branded dashboard: team inbox & broadcasts',
      '5 message templates approved',
      'Team training call',
      '30 days of support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 34999,
    for: 'Growing D2C brands, clinics, institutes',
    highlight: true,
    includes: ['ai', 'domain'],
    features: [
      'Everything in Launch',
      'AI agent in Hindi & English',
      '3 chatbot flows',
      '1 integration (Shopify, WooCommerce, Sheets or CRM)',
      '15 message templates',
      'Your own domain (app.yourbrand.com)',
      '90 days of support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 64999,
    for: 'Established brands',
    includes: ['ai', 'domain', 'catalog', 'ads'],
    features: [
      'Everything in Growth',
      'WhatsApp catalog & in-chat payments',
      'Click-to-WhatsApp ads tracking',
      '3 integrations',
      '10 chatbot flows',
      '2 WhatsApp numbers',
      '6 months of priority support',
    ],
  },
]

export const enterprise = {
  name: 'Enterprise',
  for: 'Chains, large brands and agencies',
  features: [
    'Multiple brands, numbers and teams in one dashboard',
    'Deployed on your own cloud, data kept in India',
    'ERP, SAP and custom CRM integrations',
    'Single sign-on, roles, approvals and audit logs',
    'Dedicated project manager and developer',
    'Support SLA and security review',
  ],
}

// Entry offer: setup only, no dashboard
export const setupOnly = {
  name: 'WhatsApp API Setup',
  price: 9999,
  features: ['Facebook Business & Meta verification help', 'Your own Meta app & permanent access', 'WhatsApp number connected & display name approved'],
}

// Add-ons for the estimator. `include` = already part of some packages; `qty` = can add more than one.
export const addOns: { id: string; name: string; price: number; include?: IncludeKey; qty?: boolean; unit?: string }[] = [
  { id: 'ai', name: 'AI agent (Hindi & English)', price: 8000, include: 'ai' },
  { id: 'catalog', name: 'Catalog & in-chat payments', price: 6000, include: 'catalog' },
  { id: 'ads', name: 'Click-to-WhatsApp ads tracking', price: 4000, include: 'ads' },
  { id: 'domain', name: 'Your own domain', price: 2000, include: 'domain' },
  { id: 'flow', name: 'Extra chatbot flow', price: 2500, qty: true, unit: 'flow' },
  { id: 'integration', name: 'Extra integration', price: 6000, qty: true, unit: 'integration' },
  { id: 'number', name: 'Extra WhatsApp number', price: 3000, qty: true, unit: 'number' },
  { id: 'templates', name: 'Template pack (10)', price: 2000, qty: true, unit: 'pack' },
]

// What visitors can tick on the requirements form
export const needs = [
  'WhatsApp API setup',
  'Team inbox',
  'Broadcasts',
  'AI agent',
  'Chatbot flows',
  'Shopify / WooCommerce',
  'Catalog & payments',
  'CRM integration',
  'Click-to-WhatsApp ads',
  'White-label branding',
  'Enterprise / custom',
]

// White-label partner program: agencies pay per client setup, then rebrand and resell
export const partner = {
  perClientSetup: 24999,
}
