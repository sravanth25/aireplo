# Aireplo brand files

Logo: concept 04, "Spark-dot ai". A green app tile with a lowercase "ai" where the dot on the i is an AI spark; the wordmark "aireplo" repeats the spark as its i-dot.

| File | Use |
|---|---|
| `icon.svg` | Master icon (vector). Use anywhere, any size |
| `icon-mono-black.svg` / `icon-mono-white.svg` | One-color icon (letters cut out) for print, stamps, single-color use |
| `icon-512.png`, `icon-1024.png` | App icon PNGs (rounded tile, transparent corners) |
| `profile-photo-512.png` | Small profile photo (full-bleed, circle-crop safe) |
| `profile/profile-green-*.png` | **Main profile photo** for WhatsApp Business, Instagram, Facebook, LinkedIn, X (1080 and 640 px) |
| `profile/profile-dark-*.png` | Alternative: app tile on dark with a soft glow |
| `profile/profile-light-*.png` | Alternative: green "ai" on white, for light pages and print |
| `logo-dark.png` / `logo-light.png` | Full logo on dark / white |
| `logo-transparent-white-text.png` / `logo-transparent-dark-text.png` | Full logo, transparent background |
| `og-image.png` | Link preview when the site is shared (1200×630) |
| `previous-logo/` | The earlier logo and brand sheet, kept for reference |

In code: `src/components/AireploMark.tsx` (`AireploMark`, `AireploWordmark`).

Colors: tile gradient `#4ADE80` → `#16A34A` → `#0F766E`; spark `#D9F99D` on the tile, `#A3E635` on dark, `#16A34A` on light; background `#07090C`, light `#F8FAFC`.
Wordmark: Bricolage Grotesque ExtraBold, lowercase, letter-spacing -0.035em, spark replaces the i-dot.
Slogan: "Sell. Support. Reply on WhatsApp."

## Favicon set (in `public/`)

| File | Used by |
|---|---|
| `favicon.svg` | Modern browsers (sharp at any size) |
| `favicon.ico` (16, 32, 48) | Older browsers, Windows |
| `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png` | Browser tabs and bookmarks |
| `apple-touch-icon.png` (180) | iPhone/iPad home screen |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | Android home screen and install |
| `site.webmanifest` | Icons and colors for Android/Chrome |

## Share images for each page

Every page except the home page has its own share image in `public/og/` (title on a branded card).
After changing a page heading, or adding a page, run `node scripts/og-images.mjs` and commit the new images.
It needs Playwright with Chromium (`npm i -D --no-save playwright`).
