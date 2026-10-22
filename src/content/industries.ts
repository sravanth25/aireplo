import { inr, packages } from '../brand'
import type { ContentPage, Hub } from './types'

const DATE = '2026-10-22'
const [launch, growth, pro] = packages

export const industriesHub: Hub = {
  path: '/industries',
  kind: 'industry',
  name: 'Industries',
  title: 'WhatsApp Business API by Industry | Aireplo',
  description: 'How e-commerce brands, clinics, schools, coaching institutes and real estate teams use the WhatsApp Business API, with templates and the right Aireplo package.',
  eyebrow: 'Industries',
  h1: 'WhatsApp, set up for your industry',
  intro: 'Every business uses WhatsApp differently. These guides show what works in your industry, which message templates you need, and which one-time Aireplo package fits.',
}

export const industryPages: ContentPage[] = [
  {
    path: '/industries/ecommerce',
    kind: 'industry',
    name: 'E-commerce & D2C',
    title: 'WhatsApp Business API for E-commerce & D2C | Aireplo',
    description: 'Recover abandoned carts, confirm COD orders, send order updates and sell from a WhatsApp catalog. One-time setup with Shopify or WooCommerce integration.',
    eyebrow: 'E-commerce & D2C',
    h1: 'WhatsApp for e-commerce and D2C brands',
    intro: 'Your customers already shop and ask questions on WhatsApp. With the official WhatsApp Business API connected to your store, every order, cart and support question can be handled there, automatically.',
    published: DATE,
    updated: DATE,
    blocks: [
      { type: 'h2', text: 'What you can automate' },
      {
        type: 'ul',
        items: [
          '**Abandoned cart reminders** with a link straight back to checkout.',
          '**COD confirmation** before you ship, so fewer unconfirmed orders go out.',
          '**Order, shipping and delivery updates** sent the moment the status changes in your store.',
          '**Catalog and in-chat payments**, so customers can browse and pay without leaving WhatsApp.',
          '**An AI agent** that answers size, stock, delivery and return questions in Hindi or English, 24/7.',
          '**Broadcasts** for sales, new arrivals and festive offers to customers who opted in.',
        ],
      },
      { type: 'h2', text: 'Templates you will need' },
      {
        type: 'table',
        head: ['Template', 'Meta category', 'When it is sent'],
        rows: [
          ['Order confirmed', 'Utility', 'Right after checkout'],
          ['COD confirmation (Confirm / Cancel buttons)', 'Utility', 'Before dispatch'],
          ['Order shipped with tracking', 'Utility', 'When the courier picks it up'],
          ['Abandoned cart with discount code', 'Marketing', 'A few hours after the cart is left'],
          ['Festive sale or new arrivals', 'Marketing', 'Campaigns to opted-in customers'],
        ],
      },
      { type: 'p', text: 'You can copy ready-made versions from our free [WhatsApp message templates](/tools/whatsapp-message-templates) library.' },
      { type: 'h2', text: 'Which package fits' },
      {
        type: 'ul',
        items: [
          `**Growth (${inr(growth.price)} one-time)** for most D2C brands: AI agent, three chatbot flows and one integration such as Shopify or WooCommerce.`,
          `**Pro (${inr(pro.price)} one-time)** if you want catalog and in-chat payments, Click-to-WhatsApp ads tracking and three integrations.`,
        ],
      },
    ],
    faqs: [
      ['Does Aireplo work with Shopify and WooCommerce?', 'Yes. One integration is included in Growth and three in Pro. Order and cart events from your store trigger WhatsApp messages automatically.'],
      ['Can customers pay inside WhatsApp?', 'Yes, with the catalog and in-chat payments add-on (included in Pro), using Razorpay.'],
      ['What does each WhatsApp message cost?', 'Meta charges per message. In India from 1 October 2026, a marketing message costs ₹0.8631 and a utility message such as an order update ₹0.115, plus GST, billed by Meta directly to you.'],
    ],
    related: ['/tools/whatsapp-message-templates', '/blog/whatsapp-business-api-pricing-india', '/compare/aisensy-alternative'],
    cta: { title: 'Sell more on WhatsApp', text: 'Tell us your store platform and order volume, and we will send a fixed one-time quote.', button: 'Get my e-commerce quote', href: '/#contact' },
  },
  {
    path: '/industries/healthcare',
    kind: 'industry',
    name: 'Clinics & healthcare',
    title: 'WhatsApp Business API for Clinics & Healthcare | Aireplo',
    description: 'Appointment booking and reminders, report-ready alerts and patient FAQs on WhatsApp for clinics, diagnostic centres and hospitals. One-time setup.',
    eyebrow: 'Clinics & healthcare',
    h1: 'WhatsApp for clinics, labs and hospitals',
    intro: 'Patients prefer a quick WhatsApp message to a phone call. The WhatsApp Business API lets your front desk handle bookings, reminders and common questions from one shared inbox, with an AI agent covering after-hours queries.',
    published: DATE,
    updated: DATE,
    blocks: [
      { type: 'h2', text: 'What you can automate' },
      {
        type: 'ul',
        items: [
          '**Appointment booking** through a simple chatbot flow: doctor, date and time slot.',
          '**Reminders** the day before, with Confirm and Reschedule buttons, so fewer patients miss visits.',
          '**Report-ready alerts** telling patients when to collect or download their reports.',
          '**Clinic FAQs** answered by an AI agent: timings, fees, location, parking, insurance accepted.',
          '**A shared inbox** so reception staff can see and answer every chat, and hand over to a doctor’s team.',
        ],
      },
      {
        type: 'callout',
        title: 'Handle health data carefully',
        text: 'Only message patients who have agreed to hear from you, keep medical details out of marketing messages, and send clinical information only with the patient’s consent. India’s DPDP Act, 2023 applies to patient data, and Aireplo processes it only on your instructions.',
      },
      { type: 'h2', text: 'Templates you will need' },
      {
        type: 'table',
        head: ['Template', 'Meta category', 'When it is sent'],
        rows: [
          ['Appointment confirmed', 'Utility', 'After booking'],
          ['Appointment reminder (Confirm / Reschedule)', 'Utility', 'The day before'],
          ['Report ready', 'Utility', 'When results are available'],
          ['Health camp or new service', 'Marketing', 'To patients who opted in'],
        ],
      },
      { type: 'h2', text: 'Which package fits' },
      {
        type: 'ul',
        items: [
          `**Launch (${inr(launch.price)} one-time)** for a single clinic that mainly needs a shared inbox and reminders.`,
          `**Growth (${inr(growth.price)} one-time)** to add an AI agent for after-hours questions and a booking flow.`,
          '**Enterprise** for hospital groups with several branches, numbers and systems to connect.',
        ],
      },
    ],
    faqs: [
      ['Can the AI agent give medical advice?', 'No. Set it up to answer practical questions such as timings, fees and directions, and to hand anything medical to your staff.'],
      ['Can we connect our appointment software?', 'Usually yes, through an integration. Tell us which system you use and we will confirm in your quote.'],
    ],
    related: ['/blog/whatsapp-business-api-setup-india', '/tools/whatsapp-message-templates', '/compare/wati-alternative'],
    cta: { title: 'Fewer missed appointments', text: 'Share your clinic size and booking system, and we will send a one-time quote.', button: 'Get my clinic quote', href: '/#contact' },
  },
  {
    path: '/industries/education',
    kind: 'industry',
    name: 'Education & coaching',
    title: 'WhatsApp Business API for Schools & Coaching | Aireplo',
    description: 'Answer admission enquiries 24/7, send fee reminders, class updates and results to parents and students on WhatsApp. One-time setup for schools and institutes.',
    eyebrow: 'Education & coaching',
    h1: 'WhatsApp for schools, colleges and coaching institutes',
    intro: 'Admission enquiries arrive at all hours and parents expect quick answers. With the WhatsApp Business API, an AI agent answers course and fee questions instantly, and your team follows up from one shared inbox.',
    published: DATE,
    updated: DATE,
    blocks: [
      { type: 'h2', text: 'What you can automate' },
      {
        type: 'ul',
        items: [
          '**Admission enquiries** from ads and your website, answered 24/7 by an AI agent in Hindi or English.',
          '**Counsellor follow-up** with every lead visible in a shared inbox.',
          '**Fee reminders** with a payment link before the due date.',
          '**Class, exam and holiday updates** to parents and students who opted in.',
          '**Webinar and demo-class invites**, with reminders before they start.',
        ],
      },
      { type: 'h2', text: 'Templates you will need' },
      {
        type: 'table',
        head: ['Template', 'Meta category', 'When it is sent'],
        rows: [
          ['Admission enquiry follow-up', 'Utility', 'After a form or ad enquiry'],
          ['Fee payment reminder', 'Utility', 'Before the due date'],
          ['Demo class or webinar invite', 'Marketing', 'To interested leads'],
          ['Login OTP for the student portal', 'Authentication', 'When a student signs in'],
        ],
      },
      { type: 'h2', text: 'Which package fits' },
      {
        type: 'ul',
        items: [
          `**Growth (${inr(growth.price)} one-time)** for most institutes: AI agent for enquiries, chatbot flows and one integration such as Google Sheets or your CRM.`,
          `**Pro (${inr(pro.price)} one-time)** if you run Click-to-WhatsApp ads for admissions and need ads tracking and more integrations.`,
        ],
      },
    ],
    faqs: [
      ['Can we track which ad brought each admission enquiry?', 'Yes. Click-to-WhatsApp ads tracking is included in Pro and available as an add-on on other packages.'],
      ['Can parents and students both get messages?', 'Yes, as long as each person has agreed to receive WhatsApp messages from you.'],
    ],
    related: ['/blog/whatsapp-business-app-vs-api', '/tools/whatsapp-link-generator', '/compare/interakt-alternative'],
    cta: { title: 'Answer every enquiry', text: 'Tell us your courses and enquiry volume, and we will send a one-time quote.', button: 'Get my institute quote', href: '/#contact' },
  },
  {
    path: '/industries/real-estate',
    kind: 'industry',
    name: 'Real estate',
    title: 'WhatsApp Business API for Real Estate | Aireplo',
    description: 'Capture property leads from Click-to-WhatsApp ads, qualify them with an AI agent, share brochures and book site visits on WhatsApp. One-time setup.',
    eyebrow: 'Real estate',
    h1: 'WhatsApp for builders, brokers and real estate teams',
    intro: 'Property buyers want brochures, prices and site-visit slots fast. The WhatsApp Business API turns ad clicks into conversations, qualifies leads automatically and routes serious buyers to your sales team.',
    published: DATE,
    updated: DATE,
    blocks: [
      { type: 'h2', text: 'What you can automate' },
      {
        type: 'ul',
        items: [
          '**Click-to-WhatsApp ads** that open a chat instead of a form, with every lead tracked to its ad.',
          '**Lead qualification** by an AI agent: budget, location, configuration and timeline.',
          '**Brochures, floor plans and price sheets** sent instantly in the chat.',
          '**Site-visit booking and reminders**, with directions on the day.',
          '**A shared inbox** with chats assigned to sales executives, plus a CRM integration.',
        ],
      },
      { type: 'h2', text: 'Templates you will need' },
      {
        type: 'table',
        head: ['Template', 'Meta category', 'When it is sent'],
        rows: [
          ['Site visit confirmed', 'Utility', 'After booking'],
          ['Site visit reminder with location', 'Utility', 'The day before'],
          ['New project launch', 'Marketing', 'To leads who opted in'],
          ['Price or offer update', 'Marketing', 'Campaigns'],
        ],
      },
      { type: 'h2', text: 'Which package fits' },
      {
        type: 'ul',
        items: [
          `**Pro (${inr(pro.price)} one-time)** for most real estate teams: Click-to-WhatsApp ads tracking, three integrations, ten chatbot flows and two numbers.`,
          '**Enterprise** for developers with several projects, sales teams and an existing CRM to connect.',
        ],
      },
    ],
    faqs: [
      ['Can leads go straight into our CRM?', 'Yes. Pro includes three integrations, for example your CRM, Google Sheets and your website forms.'],
      ['Can each sales executive have their own login?', 'Yes. Every package includes unlimited team members, and chats can be assigned to each executive.'],
    ],
    related: ['/blog/whatsapp-business-api-setup-india', '/tools/whatsapp-link-generator', '/compare/wati-alternative'],
    cta: { title: 'Turn ad clicks into site visits', text: 'Share your projects and lead volume, and we will send a one-time quote.', button: 'Get my real estate quote', href: '/#contact' },
  },
]
