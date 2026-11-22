const { chromium } = require('playwright')
const fs = require('fs')
const out = process.argv[2]
const fontDir = '/home/user/aireplo/ads/video-01-2am-sale/media/fonts/'
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(fontDir + f).toString('base64')
const icon = fs.readFileSync('/home/user/aireplo/brand/icon.svg', 'utf8').replace(/id="g"/, 'id="lg"').replace('url(#g)', 'url(#lg)')
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Bricolage Grotesque';font-weight:800;src:url(${font('BricolageGrotesque-800.woff2')})}
@font-face{font-family:Inter;font-weight:500;src:url(${font('Inter-500.woff2')})}
@font-face{font-family:Inter;font-weight:600;src:url(${font('Inter-600.woff2')})}
@font-face{font-family:Inter;font-weight:700;src:url(${font('Inter-700.woff2')})}
@font-face{font-family:Inter;font-weight:800;src:url(${font('Inter-800.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1640px;height:924px;overflow:hidden;background:#07090c;font-family:Inter,sans-serif;color:#fff;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at 70% 40%,#000 25%,transparent 75%)}
.glow{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(34,197,94,.33),transparent)}
.d{font-family:'Bricolage Grotesque';font-weight:800;letter-spacing:-.04em;line-height:1}
.g{background:linear-gradient(90deg,#4ade80,#22c55e 55%,#a3e635);-webkit-background-clip:text;background-clip:text;color:transparent}
.left{position:absolute;left:140px;top:238px;width:920px}
.logo{display:flex;align-items:center;gap:14px;font-family:'Bricolage Grotesque';font-weight:800;font-size:40px;letter-spacing:-.03em}
.logo svg{width:56px;height:56px}
.chips{display:flex;gap:12px;flex-wrap:nowrap;margin-top:28px}
.chip{display:flex;align-items:center;gap:8px;font-size:21px;font-weight:600;padding:10px 18px;white-space:nowrap;border-radius:999px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.12)}
.price{display:inline-flex;align-items:center;gap:16px;margin-top:24px;padding:12px 26px;border-radius:20px;background:rgba(34,197,94,.14);border:2px solid rgba(34,197,94,.55);font-size:28px;font-weight:700}
.price b{font-family:'Bricolage Grotesque';font-size:40px;letter-spacing:-.03em}
.phone{position:absolute;right:250px;top:96px;width:400px;height:760px;border-radius:58px;background:#0b141a;border:12px solid #1d232b;box-shadow:0 50px 100px rgba(0,0,0,.65),0 0 120px rgba(34,197,94,.2);overflow:hidden}
.head{background:#1f2c34;padding:40px 20px 16px;display:flex;align-items:center;gap:12px}
.head svg{width:48px;height:48px;flex-shrink:0}
.name{font-weight:700;font-size:21px}.sub{font-size:15px;color:#8ea2ad}
.body{padding:18px 14px;display:flex;flex-direction:column;gap:12px;background-image:radial-gradient(rgba(255,255,255,.035) 1.5px,transparent 1.5px);background-size:22px 22px;height:100%}
.b{max-width:86%;padding:10px 14px;border-radius:16px;font-size:17px;line-height:1.38}
.in{background:#1f2c34;align-self:flex-start;border-top-left-radius:5px}
.out{background:#005c4b;align-self:flex-end;border-top-right-radius:5px}
.ai{display:inline-block;font-size:11px;font-weight:800;color:#4ade80;background:rgba(34,197,94,.16);border-radius:5px;padding:2px 6px;margin-bottom:4px;letter-spacing:.05em}
.qb{margin-top:8px;text-align:center;background:rgba(255,255,255,.1);color:#53bdeb;border-radius:10px;padding:8px;font-weight:700}
.badge{position:absolute;display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:18px;background:rgba(13,18,24,.94);border:2px solid rgba(255,255,255,.12);box-shadow:0 24px 50px rgba(0,0,0,.5);font-size:20px;font-weight:700}
.badge small{display:block;font-size:15px;font-weight:500;color:rgba(255,255,255,.55)}
.ic{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:rgba(34,197,94,.16);font-size:24px}
.bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#22c55e,#16a34a 60%,#0d9488)}
</style></head><body>
<div class="grid"></div>
<div class="glow" style="width:1100px;height:900px;right:-260px;top:-120px"></div>
<div class="left">
  <div class="logo">${icon}<span>aireplo</span></div>
  <h1 class="d" style="font-size:78px;margin-top:26px;white-space:nowrap">WhatsApp Business API,<br><span class="g">under your brand.</span></h1>
  <div class="chips">
    <span class="chip">🤖 AI replies 24/7</span><span class="chip">📥 Team inbox</span><span class="chip">📣 Broadcasts</span>
  </div>
  <div class="price"><b>₹15,000</b> one-time · no monthly fee</div>
</div>
<div class="phone">
  <div class="head">${icon}<div><div class="name">Your Brand ✅</div><div class="sub">Business account · AI on</div></div></div>
  <div class="body">
    <div class="b in">Hi! 3BHK available hai? Budget ₹90L 🏠</div>
    <div class="b out"><span class="ai">AI REPLY</span><br>Yes! 3BHK in Tower B, ₹88L ✨ Here's the brochure 📄 Site visit this Sunday?</div>
    <div class="b in">Sunday 4 PM 👍</div>
    <div class="b out">Booked ✅ See you Sunday!<div class="qb">📍 Get directions</div></div>
  </div>
</div>
<div class="badge" style="right:60px;top:200px"><span class="ic">⚡</span><span>Replied in 5 sec<small>even at 1 AM</small></span></div>
<div class="badge" style="right:60px;top:610px"><span class="ic">🔥</span><span>Hot lead<small>3BHK · ₹80L–1Cr</small></span></div>
<div class="bar"></div>
</body></html>`
;(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' })
  const p = await b.newPage({ viewport: { width: 1640, height: 924 } })
  await p.setContent(html, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: out + '/cover-1640x924.png' })
  await b.close()
})()
