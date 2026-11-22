# Meta ad #02: Real estate, "The 1 AM lead"

26-second 9:16 Reel for builders and real estate agencies. Omni footage (6 shots) + ElevenLabs voiceover ("Ronav M", take 1, -14 LUFS) + text animation.

- `script.md`: voiceover and overlay plan · `omni-prompts-ready.json`: Omni prompts
- `voiceover-take1.mp3`, `voiceover-take2.mp3`: raw takes
- `media/`: voiceover.mp3, fonts/, shot1–6.mp4 (clips not in git)
- Animation: `src/remotion/ads/RealEstateLead.tsx` (shared pieces in `src/remotion/ads/kit.tsx`)

```
npx remotion render src/remotion/Root.tsx AdRealEstateLead ads/video-02-real-estate/aireplo-ad-02-real-estate.mp4 \
  --public-dir ads/video-02-real-estate/media --codec h264 --crf 18
```
