# Going live: website AI chat + WhatsApp AI agent

Two parts:

1. **Website chat** (the phone on the home page) works as soon as the site is on Vercel with an `ANTHROPIC_API_KEY`.
2. **WhatsApp agent** (replies when someone messages your number) also needs a Meta WhatsApp setup.

Until the key is set, the website chat runs in **demo mode** with scripted answers.

---

## Step 1 — Put the site on Vercel (10 minutes)

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New → Project** → import the `aireplo` repository.
2. Leave the settings as they are (Vercel detects Vite). Click **Deploy**.
3. In **Project → Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY`: create one at [console.anthropic.com](https://console.anthropic.com) → API Keys. Add some credit under Billing.
4. Click **Deployments → … → Redeploy**. The website chat now uses the live AI.
5. Later: **Settings → Domains** → add `aireplo.com` once you own it.

## Step 2 — Meta WhatsApp setup (1–2 hours, plus Meta review)

1. **Business portfolio:** [business.facebook.com](https://business.facebook.com) → create a portfolio for Aireplo. Start **Business verification** in Security Center (GST certificate or registration documents). You can test before it is approved.
2. **Developer app:** [developers.facebook.com](https://developers.facebook.com) → **My Apps → Create App** → type **Business** → link your portfolio → add the **WhatsApp** product.
3. **Test number:** WhatsApp → **API Setup** shows a free test number and its **Phone number ID**. Add your own mobile as a test recipient.
4. **Permanent token:** business.facebook.com → **Settings → Users → System users** → add an Admin system user → **Generate token** for your app with `whatsapp_business_messaging` and `whatsapp_business_management` permissions. Copy it (it is shown once).
5. **App secret:** developers.facebook.com → your app → **App settings → Basic → App secret**.

## Step 3 — Connect WhatsApp to the bot (5 minutes)

1. In Vercel → Environment Variables, add:
   - `WHATSAPP_TOKEN`: the permanent token
   - `WHATSAPP_PHONE_NUMBER_ID`: the Phone number ID
   - `WHATSAPP_APP_SECRET`: the App secret
   - `WHATSAPP_VERIFY_TOKEN`: any password you make up, e.g. `aireplo-hook-7391`

   Then redeploy.
2. In Meta → WhatsApp → **Configuration → Webhook → Edit**:
   - Callback URL: `https://<your-vercel-domain>/api/whatsapp`
   - Verify token: the same `WHATSAPP_VERIFY_TOKEN`
   - Click **Verify and save**, then **Manage** → subscribe to **messages**.
3. Send "Hi" from your phone to the test number. The AI should reply within a few seconds.

## Step 4 — Switch to your real number

WhatsApp → **API Setup → Add phone number**. Use a number that is not on the regular WhatsApp app (or use Meta's coexistence option for a WhatsApp Business app number). Set a display name (Meta approves it), then replace `WHATSAPP_PHONE_NUMBER_ID` with the new ID. Update `whatsapp` and `whatsappDisplay` in `src/brand.ts` so the website points to it.

---

## Good to know

- **What the AI knows** comes from `server/agent.ts`, which reads prices and plans from `src/brand.ts`. Change prices there and the website and bot stay in sync.
- **Conversation memory** is kept in server memory for now, so it can reset when the server restarts. Before real traffic, move it to a database (Upstash Redis on Vercel is the easiest). Only `server/memory.ts` needs to change.
- **Human handover:** the bot tells customers a person will reply, but there is no team inbox yet. That inbox is part of the Aireplo dashboard (next build).
- **Costs:** Claude API is billed per use. Replies to customers who message you first are free or very cheap under Meta's pricing.
- **Test without real keys:** `npm run test:api` runs the endpoints against a fake Claude API and a fake WhatsApp API.
