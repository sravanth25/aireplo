import Anthropic from '@anthropic-ai/sdk'
import { cleanHistory, streamReply } from '../server/agent.js'

// POST /api/chat  { messages: [{ role: 'user' | 'assistant', content: string }] }
// Streams the AI reply back as plain text.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response('Send JSON like { "messages": [...] }', { status: 400 })
  }
  const history = cleanHistory((body as { messages?: unknown })?.messages)
  if (!history.length || history[history.length - 1].role !== 'user') {
    return new Response('The last message must be from the user.', { status: 400 })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('AI is not configured yet (missing ANTHROPIC_API_KEY).', { status: 503 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamReply(history)) controller.enqueue(encoder.encode(chunk))
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          controller.enqueue(encoder.encode('\n\nWe’re getting a lot of messages right now. Please try again in a minute.'))
        } else {
          console.error('chat error', err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err)
          controller.enqueue(encoder.encode('\n\nSorry, something went wrong. Please try again, or message us on WhatsApp.'))
        }
      } finally {
        controller.close()
      }
    },
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
