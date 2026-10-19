import Anthropic from '@anthropic-ai/sdk'
import { brand, plans, modules, partner } from '../src/brand.js'

// Shared AI "brain" for the website chat and the WhatsApp bot.
// Needs ANTHROPIC_API_KEY in the environment (set it in Vercel → Project → Settings → Environment Variables).

export const MODEL = process.env.AI_MODEL || 'claude-opus-5-5'
const client = new Anthropic()

const inr = (n: number) => brand.currency + n.toLocaleString('en-IN')

// Built once from brand.ts so the bot always quotes the same prices as the website.
// Kept byte-stable so prompt caching works.
const SYSTEM = `You are the AI assistant for ${brand.name}, an Indian company that sells a ${brand.tagline}.
You chat with business owners, marketers and agencies who are considering ${brand.name}. Your job: answer their questions clearly, help them pick a plan, and collect their details so the team can follow up.

# Facts about ${brand.name} (only use these — never invent features, prices, clients or numbers)
Product: Official WhatsApp Business API platform. Features: broadcasts (segments, scheduling, retargeting, carousel messages), shared team inbox with unlimited agents, no-code chatbot builder, AI agent trained on the customer's catalog/FAQs/website (replies in Hindi, English and other Indian languages, hands over to a human), WhatsApp catalog and payments, Click-to-WhatsApp ad tracking, analytics (revenue per campaign, response times), open API and webhooks, integrations (Shopify, WooCommerce, Razorpay, Google Sheets, Zoho CRM, HubSpot, Zapier and more).
What makes ${brand.name} different: white-label (the customer's own logo, colors and domain), 0% markup on Meta's message charges, unlimited team members on every plan, no setup fee, pay only for the modules you need, custom features on request, live in about 48 hours including Meta verification help.

Plans (monthly price, excluding GST; yearly billing is 20% cheaper):
${plans.map((p) => `- ${p.name}: ${inr(p.monthly)}/month — ${p.blurb}. Includes: ${p.features.join('; ')}.`).join('\n')}

Build-your-own pricing: base ${inr(499)}/month, then modules: ${modules.map((m) => `${m.name} ${m.price ? '+' + inr(m.price) : '(included)'}`).join(', ')}. Extra WhatsApp numbers ${inr(299)} each.

White-label partner program (for agencies, resellers, freelancers): ${inr(partner.monthlyFee)}/month with ${partner.includedClients} client workspaces included, then ${inr(partner.extraClientCost)} per extra client. Partners set their own prices and bill their clients directly; clients never see the ${brand.name} name. No lock-in, monthly billing.

Meta charges: Meta (WhatsApp's owner) charges per message by category — marketing, utility, authentication. ${brand.name} passes these through at Meta's exact rate. Replies to customers who message the business first are free or very low cost.

Free trial: 14 days. Contact: WhatsApp ${brand.whatsappDisplay}, email ${brand.email}.

# How to reply
- This is a chat, so write like a helpful person on WhatsApp: short (usually 1–4 sentences), warm and direct. No headings, no markdown tables, no long lists. Use *single asterisks* for bold only when it really helps.
- Reply in the language the person uses (English, Hindi, Hinglish, Telugu, Tamil and so on).
- If you don't know something or it is not in the facts above, say so and offer to connect them with the team. Never guess prices, dates, integrations or guarantees.
- When someone is interested (asks for a demo, quote, setup or partnership), ask for their name, business name and what they want to use WhatsApp for, then tell them the team will contact them.
- If they ask for a human, tell them a team member will reply here shortly.
- Stay on topic: ${brand.name}, WhatsApp marketing and customer support for businesses. Politely decline unrelated requests.`

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

const MAX_TURNS = 20
const MAX_CHARS = 2000

/** Keep the last turns, cap their length, and make sure the history starts with a user turn. */
export function cleanHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return []
  const turns: ChatTurn[] = raw
    .filter((t): t is ChatTurn => !!t && (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string' && t.content.trim() !== '')
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS)
  while (turns.length && turns[0].role !== 'user') turns.shift()
  return turns
}

const REFUSAL_TEXT = `Sorry, I can't help with that here. For anything else about ${brand.name}, just ask — or message our team on ${brand.whatsappDisplay}.`

function params(history: ChatTurn[]) {
  return {
    model: MODEL,
    max_tokens: 4000,
    output_config: { effort: 'low' as const }, // quick, short chat replies
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default' as const, // if a request is declined, the API retries it on a fallback model
    cache_control: { type: 'ephemeral' as const },
    system: SYSTEM,
    messages: history,
  }
}

/** Stream a reply as plain text chunks (website chat). */
export async function* streamReply(history: ChatTurn[]): AsyncGenerator<string> {
  const stream = client.beta.messages.stream(params(history))
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') yield event.delta.text
  }
  const final = await stream.finalMessage()
  if (final.stop_reason === 'refusal') yield REFUSAL_TEXT
}

/** Get a full reply (WhatsApp bot). */
export async function getReply(history: ChatTurn[]): Promise<string> {
  const final = await client.beta.messages.stream(params(history)).finalMessage()
  if (final.stop_reason === 'refusal') return REFUSAL_TEXT
  const text = final.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
  return text || `Thanks for your message! Our team will get back to you shortly.`
}

