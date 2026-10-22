import { addOns, inr, packages } from '../brand'
import type { ContentPage, Hub } from './types'

// Competitor facts were read from each company's own pricing page on 22 October 2026.
// Re-check them before changing this file; pricing pages change often.
const CHECKED = '2026-10-22'
const [launch, growth, pro] = packages
const ai = addOns.find((a) => a.id === 'ai')!

const META_RATES = { marketing: '₹0.8631', utility: '₹0.115', authentication: '₹0.115', service: '₹0.115' }
const META_SOURCE = { label: 'Meta: WhatsApp Business Platform pricing and INR rate card (effective 1 October 2026)', url: 'https://developers.facebook.com/docs/whatsapp/pricing/' }

const ownershipRows = (them: string): string[][] => [
  ['How you pay', 'One-time project fee', `Monthly or yearly subscription (${them})`],
  ['Who owns the Meta app and WhatsApp account', 'You (registered to your business)', 'You use the platform’s app; leaving means moving your number'],
  ['Setup', 'Done for you: Facebook Business, Meta verification help, your own Meta app, templates', 'Mostly self-serve, with onboarding help'],
  ['WhatsApp message charges', 'Billed by Meta directly to your account, at Meta’s rates', 'Billed through the platform'],
  ['Team members', 'Unlimited', 'Limited per plan, extra seats cost more'],
  ['Your logo and domain on the dashboard', 'Included (white-label)', 'Not the standard offer'],
  ['Maintenance after launch', 'Optional, billed separately', 'Included while you keep paying'],
]

export const compareHub: Hub = {
  path: '/compare',
  kind: 'compare',
  name: 'Compare',
  title: 'Aireplo vs Wati, AiSensy & Interakt (2026) | Aireplo',
  description: 'Comparisons of Aireplo with Wati, AiSensy and Interakt: pricing models, ownership, setup and WhatsApp message charges, checked against their pricing pages.',
  eyebrow: 'Compare',
  h1: 'Compare Aireplo with other WhatsApp platforms',
  intro: 'Most WhatsApp Business API platforms rent you software for a monthly fee. Aireplo builds your setup for a one-time fee and you own it. These pages compare the two models honestly, with prices taken from each company’s own website.',
}

export const comparePages: ContentPage[] = [
  {
    path: '/compare/wati-alternative',
    kind: 'compare',
    name: 'Wati alternative',
    title: 'Wati Alternative with One-Time Pricing (2026) | Aireplo',
    description: `Looking for a Wati alternative in India? Compare Wati’s monthly plans with Aireplo’s one-time WhatsApp API setup from ${inr(launch.price)}, where you own your Meta app.`,
    eyebrow: 'Aireplo vs Wati',
    h1: 'A Wati alternative you pay for once',
    intro: `Wati is a popular WhatsApp Business API platform with monthly subscriptions in US dollars. Aireplo is different: we set up the official WhatsApp Business API for your business, build your own Meta app and branded dashboard, and charge a one-time fee from ${inr(launch.price)}. Here is how they compare.`,
    published: CHECKED,
    updated: CHECKED,
    blocks: [
      { type: 'h2', text: 'Quick answer' },
      {
        type: 'p',
        text: `Choose **Wati** if you want a self-serve, ready-made platform with a large feature set and you are happy to pay every month. Choose **Aireplo** if you want the setup done for you, want to own your Meta app and WhatsApp account, and prefer a one-time project fee (${inr(launch.price)}–${inr(pro.price)}, plus GST) over a subscription.`,
      },
      { type: 'h2', text: 'Wati pricing (as listed on wati.io)' },
      {
        type: 'table',
        caption: `Wati plans, billed annually, as shown on wati.io/pricing on ${CHECKED}. Message charges are extra.`,
        head: ['Wati plan', 'Price', 'Users', 'Extra users'],
        rows: [
          ['Growth', '$59 / month, billed annually', '3 users', 'Not available'],
          ['Pro', '$119 / month, billed annually', '5 users', '$39 per user per month'],
          ['Business', '$279 / month, billed annually', '5 users', '$89 per user per month'],
        ],
      },
      {
        type: 'ul',
        items: [
          'Additional WhatsApp numbers: **$29 per month per number**.',
          'Shopify integration: **$4.99 per month**.',
          'Astra AI agents on the Pro plan are an add-on **priced separately**.',
          'WhatsApp messages are charged per message based on **Wati’s rate card**.',
          'Wati’s FAQ says it does **not refund** existing subscriptions or credits when you cancel.',
        ],
      },
      { type: 'h2', text: 'Aireplo pricing' },
      {
        type: 'table',
        caption: 'One-time project fees, plus GST. Maintenance after handover is billed separately.',
        head: ['Aireplo package', 'One-time price', 'Highlights'],
        rows: packages.map((p) => [p.name, inr(p.price), p.features.slice(1, 4).join('; ')]),
      },
      { type: 'h2', text: 'Renting vs owning: side by side' },
      { type: 'table', head: ['', 'Aireplo', 'Wati'], rows: ownershipRows('Wati: from $59/month billed annually') },
      { type: 'h2', text: 'What it costs over three years' },
      {
        type: 'p',
        text: `On Wati’s Pro plan billed annually, the platform fee is **$1,428 a year, or $4,284 over three years**, before message charges, extra users or add-ons. Aireplo’s Growth package is **${inr(growth.price)} once** and includes an AI agent, three chatbot flows and one integration. Maintenance after handover is quoted separately, so ask for it with your estimate to compare the full picture.`,
      },
      { type: 'h2', text: 'Where Wati is stronger' },
      {
        type: 'ul',
        items: [
          'A mature, self-serve product you can sign up for and start using the same day.',
          'A large customer base and a wide set of built-in integrations and channels.',
          'Everything (hosting, updates, support) bundled into one subscription.',
        ],
      },
      { type: 'h2', text: 'Where Aireplo is different' },
      {
        type: 'ul',
        items: [
          '**You own it:** your Meta app, WhatsApp Business account, number, contacts and chats stay registered to your business.',
          '**Done-for-you setup:** we handle Facebook Business, Meta verification follow-up, your Meta app, number connection and template approvals.',
          '**No per-seat fees:** unlimited team members on every package.',
          '**Your brand on the dashboard:** your logo, colours and domain.',
          '**Meta bills you directly** at Meta’s published rates, with no markup.',
        ],
      },
      {
        type: 'callout',
        title: 'Switching from Wati',
        text: 'Your WhatsApp number can be moved to your own Meta app. We plan the move with you so templates, contacts and opt-ins carry over, and we tell you about any downtime before we start.',
      },
    ],
    faqs: [
      ['Is Aireplo cheaper than Wati?', `Aireplo charges once (${inr(launch.price)}–${inr(pro.price)} plus GST) instead of every month, so over a few years it usually costs less than a subscription. Maintenance after launch is billed separately, so compare your full quote.`],
      ['Can I move my WhatsApp number from Wati to Aireplo?', 'Yes. A WhatsApp Business API number can be moved to your own Meta app. We plan the migration with you, including templates and contacts.'],
      ['Does Aireplo add a markup on WhatsApp messages?', `No. Meta bills message charges directly to your own WhatsApp Business account at Meta’s rates (for India from 1 October 2026: ${META_RATES.marketing} per marketing message and ${META_RATES.utility} per utility message, plus GST).`],
      ['Does Aireplo have an AI agent like Wati’s?', `Yes. Growth and Pro include an AI agent that replies in Hindi and English. On Launch it is a ${inr(ai.price)} one-time add-on.`],
    ],
    sources: [
      { label: 'Wati pricing page (wati.io/pricing)', url: 'https://www.wati.io/pricing/' },
      META_SOURCE,
    ],
    related: ['/compare/aisensy-alternative', '/compare/interakt-alternative', '/blog/whatsapp-business-api-pricing-india'],
  },
  {
    path: '/compare/aisensy-alternative',
    kind: 'compare',
    name: 'AiSensy alternative',
    title: 'AiSensy Alternative: One-Time Fee, No Markup | Aireplo',
    description: 'Compare AiSensy’s monthly plans and per-message rates with Aireplo’s one-time WhatsApp API setup, where Meta bills you directly at its own rates.',
    eyebrow: 'Aireplo vs AiSensy',
    h1: 'An AiSensy alternative with no monthly fee',
    intro: `AiSensy is one of India’s best-known WhatsApp marketing platforms, with a free plan and monthly paid plans in rupees. Aireplo sets up the WhatsApp Business API for you, on your own Meta app, for a one-time fee from ${inr(launch.price)}. Here is a fair comparison.`,
    published: CHECKED,
    updated: CHECKED,
    blocks: [
      { type: 'h2', text: 'Quick answer' },
      {
        type: 'p',
        text: `Choose **AiSensy** if you want to start free, self-serve, and pay monthly as you grow. Choose **Aireplo** if you want everything set up for you, want to own your Meta app, and would rather pay once than every month, with message charges billed by Meta at its own rates.`,
      },
      { type: 'h2', text: 'AiSensy pricing (as listed on aisensy.com)' },
      {
        type: 'table',
        caption: `AiSensy plans on monthly billing, as shown on aisensy.com/pricing on ${CHECKED}. GST extra.`,
        head: ['AiSensy plan', 'Price', 'Notes'],
        rows: [
          ['Free Forever', '₹0', 'No broadcasting on this plan'],
          ['Basic', '₹1,500 / month', '1 owner + 5 agents'],
          ['Pro (Growth Marketer)', '₹3,200 / month', 'Adds scheduling, click tracking'],
          ['Premium (Expert Marketer)', '₹9,100 / month', '1 owner + 9 agents'],
          ['Unlimited', '₹45,000 / month', 'Up to 200 agents'],
        ],
      },
      {
        type: 'ul',
        items: [
          'Extra agents: **₹750 per seat per month**.',
          'AI Chat Agent: **₹1,350 per month** for 1,000 AI messages, charged separately.',
          'Chatbot Flows: **₹2,500 per month**, charged separately.',
        ],
      },
      { type: 'h2', text: 'WhatsApp message rates: AiSensy vs Meta' },
      {
        type: 'table',
        caption: 'Per message, India, from 1 October 2026. Meta’s rates are from Meta’s official INR rate card; AiSensy’s are from its pricing page.',
        head: ['Message type', 'AiSensy lists', 'Meta’s own rate'],
        rows: [
          ['Marketing', '₹1.09', META_RATES.marketing],
          ['Utility', '₹0.145', META_RATES.utility],
          ['Authentication', '₹0.145', META_RATES.authentication],
          ['Service (after 1,000 free a month)', '₹0.145', META_RATES.service],
        ],
      },
      {
        type: 'p',
        text: 'AiSensy’s listed rates are about **26% higher** than Meta’s published rates for India. With Aireplo, your messages are billed by Meta directly to your own WhatsApp Business account, at Meta’s rates.',
      },
      { type: 'h2', text: 'A like-for-like example' },
      {
        type: 'p',
        text: `AiSensy Pro with the AI Chat Agent and Chatbot Flows add-ons costs **₹7,050 a month** (₹3,200 + ₹1,350 + ₹2,500), or **₹84,600 a year**, plus GST and message charges. Aireplo’s Growth package, which includes an AI agent and three chatbot flows, is **${inr(growth.price)} once**, plus GST. Maintenance after handover is quoted separately.`,
      },
      { type: 'h2', text: 'Renting vs owning: side by side' },
      { type: 'table', head: ['', 'Aireplo', 'AiSensy'], rows: ownershipRows('AiSensy: from ₹1,500/month') },
      { type: 'h2', text: 'Where AiSensy is stronger' },
      {
        type: 'ul',
        items: [
          'A free plan to try the WhatsApp API before paying.',
          'Fully self-serve: sign up and start without talking to anyone.',
          'A large Indian customer base and a built-in Meta ads manager.',
        ],
      },
      { type: 'h2', text: 'Where Aireplo is different' },
      {
        type: 'ul',
        items: [
          '**One payment** instead of a monthly bill that grows with seats and add-ons.',
          '**Meta’s own message rates**, billed by Meta to you.',
          '**Your own Meta app** and WhatsApp account, built and handed over to you.',
          '**Unlimited team members** and your own logo and domain on the dashboard.',
        ],
      },
    ],
    faqs: [
      ['Why are AiSensy’s message rates higher than Meta’s?', `AiSensy lists ₹1.09 per marketing message and ₹0.145 for utility, authentication and service messages in India. Meta’s own INR rates from 1 October 2026 are ${META_RATES.marketing} and ${META_RATES.utility}. With Aireplo, Meta bills you directly at its own rates.`],
      ['Is there a free plan like AiSensy’s?', `No. Aireplo is a done-for-you setup with a one-time fee from ${inr(launch.price)}. If you only need the WhatsApp API connected, the setup-only option is ₹9,999.`],
      ['Can I switch from AiSensy to Aireplo?', 'Yes. We move your WhatsApp number to your own Meta app and help you recreate templates and import contacts.'],
    ],
    sources: [
      { label: 'AiSensy pricing page (aisensy.com/pricing)', url: 'https://aisensy.com/pricing' },
      META_SOURCE,
    ],
    related: ['/compare/wati-alternative', '/compare/interakt-alternative', '/blog/whatsapp-business-api-pricing-india'],
  },
  {
    path: '/compare/interakt-alternative',
    kind: 'compare',
    name: 'Interakt alternative',
    title: 'Interakt Alternative with One-Time Pricing | Aireplo',
    description: 'Compare Interakt’s monthly WhatsApp plans and AI add-ons with Aireplo’s one-time WhatsApp Business API setup, your own Meta app and a branded dashboard.',
    eyebrow: 'Aireplo vs Interakt',
    h1: 'An Interakt alternative you own',
    intro: `Interakt offers WhatsApp and Instagram plans billed in US dollars, plus AI agents and a sales CRM as separate products. Aireplo sets up the WhatsApp Business API on your own Meta app with a branded dashboard for a one-time fee from ${inr(launch.price)}.`,
    published: CHECKED,
    updated: CHECKED,
    blocks: [
      { type: 'h2', text: 'Quick answer' },
      {
        type: 'p',
        text: 'Choose **Interakt** if you want a self-serve platform covering WhatsApp and Instagram with monthly billing. Choose **Aireplo** if you want a done-for-you WhatsApp setup that you own, with a one-time fee and Meta billing your messages directly.',
      },
      { type: 'h2', text: 'Interakt pricing (as listed on interakt.shop)' },
      {
        type: 'table',
        caption: `As shown on interakt.shop/pricing on ${CHECKED}. Taxes extra.`,
        head: ['Interakt product', 'Price', 'Notes'],
        rows: [
          ['Growth (WhatsApp + Instagram)', '$55 / month', 'Campaigns, catalogs, native payments, APIs'],
          ['Advanced', '$69 / month', 'Adds branching chatbots and auto-assignment'],
          ['Enterprise', 'On request', 'Lists “No markup charges”'],
          ['AI Agents', '₹2,499 / month', '100 AI messages included, then $0.011 per message'],
          ['Sales CRM (Starter)', '₹2,499 / month', '5 sales agents, ₹499 per extra agent'],
        ],
      },
      {
        type: 'p',
        text: 'Interakt’s page says your total monthly WhatsApp bill is your subscription plus template charges above the free limit, with country rates on a separate page. Only the Enterprise plan explicitly lists no markup.',
      },
      { type: 'h2', text: 'Renting vs owning: side by side' },
      { type: 'table', head: ['', 'Aireplo', 'Interakt'], rows: ownershipRows('Interakt: from $55/month for WhatsApp') },
      { type: 'h2', text: 'Where Interakt is stronger' },
      {
        type: 'ul',
        items: ['WhatsApp and Instagram in one inbox.', 'A separate sales CRM product for pipelines.', 'Self-serve sign-up with monthly or yearly billing.'],
      },
      { type: 'h2', text: 'Where Aireplo is different' },
      {
        type: 'ul',
        items: [
          `**One-time pricing:** ${inr(launch.price)}–${inr(pro.price)} plus GST, no subscription.`,
          '**AI agent included** in Growth and Pro, without a per-message AI fee on top.',
          '**Your own Meta app** and account, so you are never locked in.',
          '**Meta’s rates for every plan**, billed by Meta to you.',
        ],
      },
    ],
    faqs: [
      ['Does Aireplo support Instagram like Interakt?', 'Aireplo focuses on the WhatsApp Business API. If you need Instagram, tell us in your requirements and we will quote it as a custom add-on.'],
      ['Is the AI agent extra on Aireplo?', `It is included in Growth (${inr(growth.price)}) and Pro (${inr(pro.price)}). On Launch it is a ${inr(ai.price)} one-time add-on.`],
    ],
    sources: [{ label: 'Interakt pricing page (interakt.shop/pricing)', url: 'https://www.interakt.shop/pricing/' }, META_SOURCE],
    related: ['/compare/wati-alternative', '/compare/aisensy-alternative', '/blog/whatsapp-business-app-vs-api'],
  },
]
