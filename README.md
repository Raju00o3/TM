# 🤍 For Misri — The Polaroid Explosion

A deeply personal, physics-based interactive experience built with love.

## 🚀 Quick Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📸 Replacing Placeholder Photos

All placeholder images go in `public/media/`. Replace each file with the real photo/video keeping the **exact same filename**.

### Folder Structure

```
public/
├── media/
│   ├── childhood/
│   │   ├── childhood_01.jpg    ← Her childhood photo #1
│   │   ├── childhood_02.jpg    ← Her childhood photo #2
│   │   ├── childhood_03.jpg    ← Her childhood photo #3
│   │   ├── childhood_04.jpg    ← Her childhood photo #4 (Tirth's baby photo)
│   │   └── childhood_05.jpg    ← Her childhood photo #5
│   ├── traditional/
│   │   ├── traditional_01.jpg  ← Traditional outfit #1
│   │   ├── traditional_02.jpg  ← Traditional outfit #2
│   │   ├── traditional_03.jpg  ← Traditional outfit #3
│   │   └── traditional_04.jpg  ← Traditional outfit #4
│   ├── western/
│   │   ├── western_01.jpg      ← Western outfit #1
│   │   ├── western_02.jpg      ← Western outfit #2
│   │   ├── western_03.jpg      ← Western outfit #3
│   │   └── western_04.jpg      ← Western outfit #4
│   ├── formal/
│   │   └── formal_01.jpg       ← Formal outfit photo
│   ├── casual/
│   │   ├── casual_01.jpg       ← Candid/casual photo #1
│   │   ├── casual_02.jpg       ← Candid/casual photo #2
│   │   ├── casual_video_01.mp4 ← Candid video #1
│   │   └── casual_video_02.mp4 ← Candid video #2
│   ├── together/
│   │   ├── together_01.jpg     ← Photo together #1
│   │   ├── together_02.jpg     ← Photo together #2
│   │   ├── together_03.jpg     ← Photo together #3
│   │   └── together_video_01.mp4 ← Video together
│   └── placeholder.jpg         ← Default placeholder (auto-generated)
└── audio/
    └── ambient.mp3             ← Your lo-fi piano track (ADD THIS)
```

### Photo Slot Reference (26 total)

| # | Filename | Type | Label | Border Color |
|---|----------|------|-------|-------------|
| 1 | childhood_01.jpg | Childhood (her) | "2006 🌸" | Gold |
| 2 | childhood_02.jpg | Childhood (her) | "cutest ever" | Gold |
| 3 | childhood_03.jpg | Childhood (her) | "always her 🤍" | Gold |
| 4 | childhood_04.jpg | Childhood (Tirth) | "baby pegu 😅" | Gold |
| 5 | childhood_05.jpg | Childhood (her) | "this girl 🌸" | Gold |
| 6 | traditional_01.jpg | Traditional | "my panda 😮‍💨" | Rose |
| 7 | traditional_02.jpg | Traditional | "flat every time" | Rose |
| 8 | traditional_03.jpg | Traditional | "timeless 🤍" | Rose |
| 9 | traditional_04.jpg | Traditional | "I melt." | Rose |
| 10 | western_01.jpg | Western | "🔥 literally" | Blue |
| 11 | western_02.jpg | Western | "mine." | Blue |
| 12 | western_03.jpg | Western | "HOW" | Blue |
| 13 | western_04.jpg | Western | "unreal 🔥" | Blue |
| 14 | formal_01.jpg | Formal | "stop it." | Sharp Gold |
| 15 | casual_01.jpg | Casual | "this one 😭" | White |
| 16 | casual_02.jpg | Casual | "my fav you" | White |
| 17 | casual_video_01.mp4 | Casual Video | "natkhat 🤍" | White (film-strip) |
| 18 | casual_video_02.mp4 | Casual Video | "always this" | White (film-strip) |
| 19 | together_01.jpg | Together | "us 🤍" | Pink |
| 20 | together_02.jpg | Together | "this day" | Pink |
| 21 | together_03.jpg | Together | "ours 🤍" | Pink |
| 22 | together_video_01.mp4 | Together Video | "remember? 🤍" | Pink (film-strip) |
| 23 | — | SPECIAL: Sorry | "read this." | Gold (glow) |
| 24 | — | SPECIAL: Magnificent | "all of you." | Pink (glow) |
| 25 | — | SPECIAL: Lady Luck | [blank] | Black (glow) |
| 26 | childhood_05.jpg (duplicate) | Childhood | "forever 🌸" | Gold |

> **Note:** Slots 23-25 are special polaroids that don't need photos. Slot 26 uses an additional childhood photo.

### 🎵 Adding Ambient Music

1. Find a soft lo-fi piano track (MP3 format)
2. Save it as `public/audio/ambient.mp3`
3. It will auto-play at very low volume (barely audible) after the user's first click

### 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts — it will auto-detect Next.js
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for auto-deploys.

### 💡 Tips

- Use high-quality photos (at least 600x600px) for best polaroid appearance
- Videos should be short clips (under 30 seconds) in MP4 format
- The site works best on desktop/laptop for the full drag experience
- Mobile users get a tap-friendly version automatically

---

*Built with love by Tirth, for Misri. 🤍*
