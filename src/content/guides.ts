import { inr, packages, setupOnly } from '../brand'
import type { ContentPage, Hub } from './types'

const DATE = '2026-10-22'
const [launch] = packages

const META_PRICING = { label: 'Meta: WhatsApp Business Platform pricing and INR rate card', url: 'https://developers.facebook.com/docs/whatsapp/pricing/' }
const META_LIMITS = { label: 'Meta: Messaging limits', url: 'https://developers.facebook.com/docs/whatsapp/messaging-limits' }
const META_START = { label: 'Meta: Get started with the WhatsApp Cloud API', url: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started' }

export const guidesHub: Hub = {
  path: '/blog',
  kind: 'guide',
  name: 'Guides',
  title: 'WhatsApp Business API Guides for India | Aireplo',
  description: 'Guides to the WhatsApp Business API in India: setup step by step, Meta’s 2026 message pricing in rupees, and when to move from the WhatsApp Business app.',
  eyebrow: 'Guides',
  h1: 'WhatsApp Business API guides',
  intro: 'Clear, up-to-date answers to the questions Indian businesses ask before they start with the WhatsApp Business API. Every number is checked against Meta’s official documentation.',
}

export const guidePages: ContentPage[] = [
  {
    path: '/blog/whatsapp-business-api-setup-india',
    kind: 'guide',
    name: 'WhatsApp Business API setup in India',
    title: 'How to Set Up WhatsApp Business API in India (2026)',
    description: 'Step-by-step guide to setting up the official WhatsApp Business API in India: what you need, Meta verification, phone numbers, templates and messaging limits.',
    eyebrow: 'Guide · Setup',
    h1: 'How to set up the WhatsApp Business API in India (2026 guide)',
    intro: 'The WhatsApp Business API (now called the WhatsApp Business Platform, using the Cloud API hosted by Meta) lets your business message thousands of customers, automate replies and connect WhatsApp to your systems. This guide walks through exactly what you need and every step, in the order Meta asks for it.',
    published: DATE,
    updated: DATE,
    blocks: [
      { type: 'h2', text: 'What you need before you start' },
      {
        type: 'ul',
        items: [
          '**A Facebook account** (or a managed Meta account) for the person setting it up.',
          '**A Meta business portfolio** (formerly Business Manager) in your business’s legal name.',
          '**Business documents** for Meta business verification, such as a GST certificate, certificate of incorporation, or Udyam/shop registration that shows your legal name and address.',
          '**A website** on your own domain that shows the same business name, ideally with a privacy policy.',
          '**A phone number** that can receive an SMS or voice call for verification. Numbers already active on the regular WhatsApp app must be removed from it first, unless you use Meta’s option for WhatsApp Business app users to connect their existing number.',
          '**A payment method** in your WhatsApp account, because Meta charges per message.',
        ],
      },
      { type: 'h2', text: 'Step-by-step setup' },
      {
        type: 'ol',
        items: [
          '**Create your business portfolio** at business.facebook.com and fill in your legal business name, address and website.',
          '**Register as a Meta developer** and create an app in the Meta App Dashboard with the “Connect with customers through WhatsApp” use case, linked to your business portfolio.',
          '**Create or connect your WhatsApp Business account** (Meta calls it a messaging account) from the app’s WhatsApp setup page.',
          '**Send a test message** using the free test number Meta provides, to check everything works.',
          '**Add your real phone number**, verify it with the code Meta sends, and choose a **display name** that matches your business. Meta reviews the display name.',
          '**Add a payment method** in WhatsApp Manager so charged messages are delivered.',
          '**Create a system user** in Business Settings and generate a **permanent access token** with the whatsapp_business_messaging and whatsapp_business_management permissions. The token on the setup page is temporary and expires quickly.',
          '**Set up a webhook** so incoming messages and delivery updates reach your platform or server.',
          '**Create message templates** (Marketing, Utility or Authentication) and submit them for Meta’s approval. You need approved templates to start conversations.',
          '**Start business verification** in Security Center to raise your messaging limit.',
        ],
      },
      { type: 'h2', text: 'Messaging limits: how many customers you can message' },
      {
        type: 'p',
        text: 'Messaging limits control how many different customers you can start conversations with (outside the 24-hour customer service window) in a moving 24-hour period. They apply to your whole **business portfolio**, shared by all its phone numbers.',
      },
      {
        type: 'table',
        head: ['Stage', 'Unique customers per 24 hours', 'How you get there'],
        rows: [
          ['New business portfolio', '250', 'Default'],
          ['Step 1', '2,000', 'Verify your business, or send 2,000 high-quality messages to unique numbers within 30 days'],
          ['Step 2', '10,000', 'Automatic, if quality stays high and you used half your limit in the last 7 days'],
          ['Step 3', '100,000', 'Same automatic rules'],
          ['Step 4', 'Unlimited', 'Same automatic rules'],
        ],
      },
      { type: 'h2', text: 'Common problems and how to avoid them' },
      {
        type: 'ul',
        items: [
          '**Verification rejected:** the legal name on your documents, website and business portfolio must match exactly.',
          '**Display name rejected:** it must clearly relate to your business name or brand, without generic words only.',
          '**Template rejected or re-categorised:** promotional wording in a Utility template gets it marked as Marketing. Keep order updates purely transactional.',
          '**Number already on WhatsApp:** delete the account from the WhatsApp app first, or use Meta’s option for WhatsApp Business app users to connect the existing number.',
          '**Messages not delivered after 1 October 2026:** service messages beyond the free 1,000 per month are now charged, so a payment method must be on file.',
        ],
      },
      { type: 'h2', text: 'Do it yourself, use a platform, or get it done for you' },
      {
        type: 'table',
        head: ['Option', 'Good for', 'What to expect'],
        rows: [
          ['Do it yourself on the Cloud API', 'Teams with developers', 'Free to start; you build the inbox, automations and hosting yourself'],
          ['Subscription platform (Wati, AiSensy, Interakt…)', 'Self-serve marketers', 'Quick start, monthly fees that grow with seats and add-ons'],
          [`Done-for-you with Aireplo`, 'Businesses that want it handled and owned', `One-time fee from ${inr(launch.price)}; your own Meta app and branded dashboard`],
        ],
      },
      {
        type: 'callout',
        title: 'Skip the setup work',
        text: `Aireplo does every step above for you: business portfolio, verification follow-up, your own Meta app, number connection, display name and templates. Setup only (no dashboard) is ${inr(setupOnly.price)} one-time; full packages start at ${inr(launch.price)}.`,
      },
    ],
    faqs: [
      ['How long does WhatsApp Business API setup take?', 'You can send test messages the same day. Business verification and display-name approval depend on Meta’s review and usually take from a few days to a couple of weeks. Most Aireplo clients are live within 5 working days.'],
      ['Is the WhatsApp Business API free?', 'Setting up the Cloud API is free, but Meta charges per message (in India from 1 October 2026: ₹0.8631 per marketing message and ₹0.115 per utility, authentication or service message, plus GST), and you need a platform or developer work to use it.'],
      ['Do I need business verification?', 'Not to start, but without it you are limited to 250 unique customers per 24 hours. Verification is one way to move to 2,000.'],
      ['Can I keep using my number on the WhatsApp Business app?', 'Meta offers an option for WhatsApp Business app users to connect their existing account and number to the platform. Otherwise the number must be removed from the app before it is registered on the API.'],
    ],
    sources: [META_START, META_LIMITS, META_PRICING],
    related: ['/blog/whatsapp-business-api-pricing-india', '/blog/whatsapp-business-app-vs-api', '/compare/wati-alternative'],
    cta: { title: 'Want it done for you?', text: 'We set up your Meta app, number, templates and dashboard. You pay once.', button: 'Get a one-time quote', href: '/#contact' },
  },
  {
    path: '/blog/whatsapp-business-api-pricing-india',
    kind: 'guide',
    name: 'WhatsApp Business API pricing in India',
    title: 'WhatsApp Business API Pricing in India (2026, in ₹)',
    description: 'Meta’s official WhatsApp message rates for India from 1 October 2026, what is free, how GST and INR billing work, and what platforms like Wati and AiSensy add.',
    eyebrow: 'Guide · Pricing',
    h1: 'WhatsApp Business API pricing in India (2026)',
    intro: 'WhatsApp Business API costs have two parts: what Meta charges for each message, and what your platform or provider charges. Here are Meta’s official rates for India, what is free, and how platform fees compare.',
    published: DATE,
    updated: DATE,
    blocks: [
      { type: 'h2', text: 'Meta’s message rates for India' },
      {
        type: 'table',
        caption: 'Per delivered message to Indian numbers, from Meta’s INR rate card effective 1 October 2026. GST is added on your invoice.',
        head: ['Message category', 'What it is for', 'Rate (₹)'],
        rows: [
          ['Marketing', 'Offers, new arrivals, cart reminders, re-engagement', '₹0.8631'],
          ['Utility', 'Order updates, payment reminders, appointment confirmations', '₹0.115'],
          ['Authentication', 'One-time passwords (OTPs) and login codes', '₹0.115'],
          ['Service', 'Free-form replies inside the 24-hour customer service window', '₹0.115 after 1,000 free per month'],
        ],
      },
      { type: 'h2', text: 'What is free' },
      {
        type: 'ul',
        items: [
          '**Messages customers send you** are free.',
          '**1,000 service messages per month** per business phone number are free from 1 October 2026. The count resets monthly and does not roll over.',
          '**Click-to-WhatsApp ads:** messages in the free entry window after a customer messages you from a Click-to-WhatsApp ad on Facebook or Instagram are free.',
        ],
      },
      { type: 'h2', text: '2026 changes to know' },
      {
        type: 'ul',
        items: [
          '**Utility messages inside the customer service window are charged** from 1 October 2026 (they were free since July 2025).',
          '**Service messages are charged** beyond 1,000 a month per number from 1 October 2026, so keep a payment method on file.',
          '**INR billing is required:** eligible Indian businesses must move their messaging accounts to INR by 31 December 2026. From 1 January 2027 Meta stops delivering messages from non-INR accounts.',
        ],
      },
      { type: 'h2', text: 'Example monthly message costs' },
      {
        type: 'table',
        caption: 'Meta charges only, before GST. Your platform’s fees are separate.',
        head: ['What you send in a month', 'Meta charges'],
        rows: [
          ['5,000 marketing messages', '₹4,315.50'],
          ['10,000 order updates (utility)', '₹1,150'],
          ['3,000 OTPs (authentication)', '₹345'],
          ['3,000 support replies (service, 1,000 free)', '₹230'],
        ],
      },
      { type: 'h2', text: 'What platforms add on top' },
      {
        type: 'table',
        caption: 'From each company’s own pricing page on 22 October 2026. Taxes and message charges are extra.',
        head: ['Platform', 'Platform fee', 'Message charges'],
        rows: [
          ['Wati', 'From $59/month (billed annually); Pro $119/month', 'Per Wati’s rate card'],
          ['AiSensy', 'From ₹1,500/month; Pro ₹3,200/month', '₹1.09 marketing, ₹0.145 utility/authentication/service'],
          ['Interakt', 'From $55/month for WhatsApp', 'Template charges as listed on its rates page'],
          ['Aireplo', `One-time, from ${inr(launch.price)} (maintenance billed separately)`, 'Billed by Meta directly to you, at Meta’s rates'],
        ],
      },
      { type: 'h2', text: 'How to keep your WhatsApp bill low' },
      {
        type: 'ol',
        items: [
          'Use the right template category: real order and payment updates are Utility, which costs a fraction of Marketing.',
          'Answer customers inside the 24-hour window, where replies are service messages (1,000 free a month).',
          'Send marketing only to segments likely to buy, instead of your whole list.',
          'Use Click-to-WhatsApp ads, where the follow-up conversation is free during the entry window.',
          'Choose a provider that passes on Meta’s rates without a markup.',
        ],
      },
    ],
    faqs: [
      ['How much does one WhatsApp marketing message cost in India?', 'From 1 October 2026, Meta charges ₹0.8631 per delivered marketing message to an Indian number, plus GST.'],
      ['Are WhatsApp Business API replies free?', 'Customer messages to you are free. Your free-form replies inside the 24-hour window are service messages: the first 1,000 a month per number are free, then ₹0.115 each.'],
      ['Do I pay GST on WhatsApp messages?', 'Yes. GST is added to Meta’s per-message charges on your invoice.'],
      ['Why do some platforms charge more per message than Meta?', 'Some providers resell messages at their own rates. For example, AiSensy lists ₹1.09 per marketing message for India, while Meta’s own rate is ₹0.8631. With Aireplo, Meta bills you directly.'],
    ],
    sources: [
      META_PRICING,
      { label: 'Wati pricing', url: 'https://www.wati.io/pricing/' },
      { label: 'AiSensy pricing', url: 'https://aisensy.com/pricing' },
      { label: 'Interakt pricing', url: 'https://www.interakt.shop/pricing/' },
    ],
    related: ['/compare/aisensy-alternative', '/blog/whatsapp-business-api-setup-india', '/industries/ecommerce'],
    cta: { title: 'Pay Meta’s rates, not a markup', text: 'Get the WhatsApp Business API on your own account, set up for you, with one payment.', button: 'See packages', href: '/#pricing' },
  },
  {
    path: '/blog/whatsapp-business-app-vs-api',
    kind: 'guide',
    name: 'WhatsApp Business app vs API',
    title: 'WhatsApp Business App vs API: Which Do You Need? (2026)',
    description: 'The free WhatsApp Business app vs the WhatsApp Business API: broadcasts, team access, automation, AI, costs and when to switch. For Indian businesses.',
    eyebrow: 'Guide · Basics',
    h1: 'WhatsApp Business app vs WhatsApp Business API',
    intro: 'Both come from Meta, but they are built for different stages of a business. The free app is perfect for one person replying from a phone. The API is for teams, automation and messaging at scale.',
    published: DATE,
    updated: DATE,
    blocks: [
      { type: 'h2', text: 'The difference at a glance' },
      {
        type: 'table',
        head: ['', 'WhatsApp Business app', 'WhatsApp Business API'],
        rows: [
          ['Cost', 'Free', 'Per-message charges from Meta, plus a platform or setup cost'],
          ['Who replies', 'You, on your phone and a few linked devices', 'Your whole team from a shared inbox'],
          ['Messaging many customers', 'Broadcast lists that reach only people who saved your number', 'Approved templates to thousands of opted-in customers'],
          ['Automation', 'Greeting, away and quick replies', 'Chatbot flows, AI agents and triggers from your store or CRM'],
          ['Integrations', 'None', 'Shopify, CRMs, payments, your own systems through the API'],
          ['Setup', 'Download the app', 'Meta business portfolio, app, number and templates'],
        ],
      },
      { type: 'h2', text: 'Stay on the app if…' },
      {
        type: 'ul',
        items: ['You handle a few dozen chats a day yourself.', 'You do not need automation or reports.', 'Your customers mostly message you first.'],
      },
      { type: 'h2', text: 'Move to the API when…' },
      {
        type: 'ul',
        items: [
          'More than one person needs to reply from the same number.',
          'You want to send order updates, reminders or offers to hundreds or thousands of customers.',
          'Customers message outside business hours and you want an AI agent to answer.',
          'You want WhatsApp connected to your store, CRM or payment gateway.',
          'You want to know which campaigns and ads bring in sales.',
        ],
      },
      { type: 'h2', text: 'Can I keep my existing number?' },
      {
        type: 'p',
        text: 'Yes. Meta offers WhatsApp Business app users a way to connect their existing account and number to the WhatsApp Business Platform. Otherwise, the number is removed from the app and registered on the API. Either way, your customers keep messaging the same number.',
      },
      {
        type: 'callout',
        title: 'Moving from the app to the API',
        text: `Aireplo handles the move for you, from Meta setup to your branded dashboard, for a one-time fee from ${inr(launch.price)}. Read the full [setup guide](/blog/whatsapp-business-api-setup-india) to see every step.`,
      },
    ],
    faqs: [
      ['Is the WhatsApp Business API better than the app?', 'Not always. The app is free and fine for one person. The API is better once you have a team, need automation or message customers at scale.'],
      ['Does the WhatsApp Business API have a mobile app?', 'The API itself has no app. You use it through a platform or dashboard, which can work on phones in a browser.'],
      ['Will my customers notice the switch?', 'They keep messaging the same number. With the API they can also get faster replies, order updates and instant answers from an AI agent.'],
    ],
    sources: [META_START, META_PRICING],
    related: ['/blog/whatsapp-business-api-setup-india', '/blog/whatsapp-business-api-pricing-india', '/industries/education'],
    cta: { title: 'Ready to move to the API?', text: 'We set it up on your own Meta app and train your team. One payment, no subscription.', button: 'Get a one-time quote', href: '/#contact' },
  },
]
