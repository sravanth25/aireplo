# Aireplo landing page

White-label WhatsApp Business SaaS landing page. React + Vite + Tailwind v4, Remotion for the product video, 21st.dev-style components (marquee, border beam, spotlight, shimmer button, number ticker).

## Run
npm install
npm run dev        # site at http://localhost:5173
npm run build      # static site in dist/ (deploy to Vercel/Netlify/any host)
npm run video      # open the product video in Remotion Studio
npm run render     # export the video to out/demo.mp4

## AI chat + WhatsApp agent
See **SETUP.md** for going live. Server code: `api/chat.ts` (website chat), `api/whatsapp.ts` (Meta webhook), `server/` (AI brain, WhatsApp client, memory). `npm run test:api` tests them offline.

## Rebrand / change prices
Edit `src/brand.ts`: name, WhatsApp number for leads, email, plan prices, module prices.
The video lives in `src/remotion/ProductDemo.tsx` and takes `brandName` and `color` as props.

## Pages
- Home (default), Partner program (`#partners`), Free tools (`#tools`) — see `src/lib/router.ts`

## Sections (src/sections)
Navbar · Hero (Remotion player) · Integrations marquee · How it works · Features bento ·
White-label studio (live rebrand) · Plan builder · Pricing · Comparison · FAQ · Requirements form → WhatsApp · Footer
