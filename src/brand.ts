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
  // GST added on top of package prices: 0 while not GST-registered (set to 0.18 once registered)
  gstRate: 0,
}

// Shown next to every price
export const pricingNote = {
  short: 'One-time payment',
  full: 'All prices are one-time charges. Maintenance after handover (hosting, updates and support) is not included and is billed separately.',
  meta: 'WhatsApp message charges are billed by Meta directly to your own account, at Meta’s rates.',
}

// One package for everyone, plus extra features at a flat price each.
export const plan = {
  id: 'package',
  name: 'Aireplo Package',
  price: 15000,
  for: 'Any business: shops, D2C brands, clinics, institutes, real estate',
  features: [
    'Facebook Business & Meta verification help',
    'Your own Meta app, built for you',
    '1 WhatsApp number connected',
    'Branded dashboard: team inbox & broadcasts',
    '5 message templates approved',
    'Team training call',
    '30 days of support',
  ],
}

// Price of each extra feature a client asks for (per unit for features with a unit)
export const featurePrice = 499

// Extra features, each ₹499 (per unit where there is one)
export const extras: { id: string; name: string; unit?: string }[] = [
  { id: 'ai', name: 'AI agent (Hindi & English)' },
  { id: 'flow', name: 'Chatbot flow', unit: 'flow' },
  { id: 'integration', name: 'Integration (Shopify, WooCommerce, Sheets or CRM)', unit: 'integration' },
  { id: 'templates', name: '5 more message templates', unit: 'pack' },
  { id: 'domain', name: 'Your own domain (app.yourbrand.com)' },
  { id: 'catalog', name: 'Catalog & in-chat payments' },
  { id: 'ads', name: 'Click-to-WhatsApp ads tracking' },
  { id: 'number', name: 'Extra WhatsApp number', unit: 'number' },
  { id: 'support', name: 'Extra month of support', unit: 'month' },
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
  perClientSetup: 9999,
}
