# Meta ad #03: Real estate (Hinglish), "Raat 1 baje lead aaya… subah tak buyer gaya 😬"

27-second 9:16 Reel. Same Omni clips as ad #02, Hinglish voiceover (ElevenLabs "Prayan", take 1) and Hinglish text. The hook appears word by word in sync with the voice.

Voiceover script:
> Raat ek baje lead aaya… subah tak buyer gaya! Aapki sales team so rahi thi… par aapka WhatsApp nahi. Seconds mein reply, brochure bheja, budget aur BHK poocha, aur site visit book kar di. Subah team ke paas hot, qualified leads… thande numbers nahi. Har lead track. Har follow-up automatic. Sirf pandrah hazaar rupaye, one time. Free demo ke liye neeche tap karein!

- `media/`: voiceover.mp3, fonts/, shot1–6.mp4 (copies of ad #02's clips; not in git)
- Animation: `src/remotion/ads/RealEstateHinglish.tsx`

```
npx remotion render src/remotion/Root.tsx AdRealEstateHinglish ads/video-03-real-estate-hinglish/aireplo-ad-03-real-estate-hinglish.mp4 \
  --public-dir ads/video-03-real-estate-hinglish/media --codec h264 --crf 18
```
