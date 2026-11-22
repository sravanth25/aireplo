# Meta ad #01: The 2 AM sale

25-second 9:16 Reel. Omni footage + ElevenLabs voiceover ("Ronav M", take 1, loudness -14 LUFS) + text animation in Remotion.

- `omni-prompts-ready.json`: paste-ready Omni prompts, one per shot
- `omni-prompts.json`: the same, with purpose, timing and overlay notes
- `voiceover-take1.mp3`, `voiceover-take2.mp3`: raw ElevenLabs takes
- `media/`: what the render uses: `voiceover.mp3`, `fonts/`, and `shot1.mp4`–`shot5.mp4` (not in git; put the Omni clips here)
- Animation code: `src/remotion/ads/TwoAmSale.tsx` (timings in seconds match the voiceover)

Render:

```
npx remotion render src/remotion/Root.tsx AdTwoAmSale ads/video-01-2am-sale/aireplo-ad-01-2am-sale.mp4 \
  --public-dir ads/video-01-2am-sale/media --codec h264 --crf 18
```
