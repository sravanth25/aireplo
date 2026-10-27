import Anthropic from '@anthropic-ai/sdk'
import { addOns, brand, enterprise, inr, packages, partner, pricingNote, setupOnly } from '../src/brand.js'

// Shared AI "brain" for the website chat and the WhatsApp bot.
// Needs ANTHROPIC_API_KEY in the environment (set it in Vercel → Project → Settings → Environment Variables).

export const MODEL = process.env.AI_MODEL || 'claude-opus-5-5'
const client = new Anthropic()


// Built once from brand.ts so the bot always quotes the same prices as the website.
// Kept byte-stable so prompt caching works.
const SYSTEM = `You are the AI assistant for ${brand.name}, an Indian company that sells a ${brand.tagline}.
You chat with business owners, marketers and agencies who are considering ${brand.name}. Your job: answer their questions clearly, help them pick a package, and collect their details so the team can follow up.

# Facts about ${brand.name} (only use these — never invent features, prices, clients or numbers)
Business model: ${brand.name} is NOT a monthly subscription. Brands pay a one-time project fee and we set everything up for them: Facebook Business setup, help with Meta business verification, building the brand's own Meta app for WhatsApp, connecting their WhatsApp number, getting templates approved, and a branded dashboard with their logo, colors and domain. The brand owns its Meta app, WhatsApp account, contacts and chats; if they stop working with us, they keep all of it.
Product features: broadcasts (segments, scheduling, retargeting), shared team inbox with unlimited team members, no-code chatbot flows, AI agent trained on the brand's catalog/FAQs (Hindi, English and other Indian languages, hands over to a human), WhatsApp catalog and in-chat payments, Click-to-WhatsApp ads tracking, analytics, integrations (Shopify, WooCommerce, Razorpay, Google Sheets, Zoho, HubSpot and more), custom features on request. Most brands are live within 5 working days.

Packages (one-time price, no GST added):
${packages.map((p) => `- ${p.name}: ${inr(p.price)} one-time, for ${p.for.toLowerCase()}. Includes: ${p.features.join('; ')}.`).join('\n')}
- ${enterprise.name}: custom one-time pricing after a discovery call, for ${enterprise.for.toLowerCase()}. Includes: ${enterprise.features.join('; ')}.
- Setup only (${setupOnly.name}): ${inr(setupOnly.price)} one-time: ${setupOnly.features.join('; ')}. No dashboard.

Add-ons (one-time): ${addOns.map((a) => `${a.name} ${inr(a.price)}${a.unit ? ' per ' + a.unit : ''}`).join(', ')}. Anything custom is quoted after a call.

Maintenance: ${pricingNote.full} If asked for the maintenance price, say the team will share it with the quote.
Meta charges: ${pricingNote.meta} Meta charges per message by category (marketing, utility, authentication); replies to customers who message first are free or very low cost.

White-label partner program (agencies, resellers, freelancers): ${inr(partner.perClientSetup)} one-time per client setup. No monthly partner fee. Partners set their own price, bill their clients directly, and clients never see the ${brand.name} name. Maintenance per client is billed separately.

Contact: WhatsApp ${brand.whatsappDisplay}, email ${brand.email}.

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

