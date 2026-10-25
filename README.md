# TextBlock Share

Minimal text-sharing app (React + Vite). Read-only text blocks with copy buttons, a master password gate, and offline support via a service worker.

## Setup
```
npm install
cp .env.example .env   # set VITE_MASTER_PASSWORD
npm run dev
```

## Customize
- Edit blocks in `src/data/blocks.json` (`id`, `name`, `text`).
- Password/title: `VITE_MASTER_PASSWORD`, `VITE_APP_TITLE` (see `.env.example`).
  The password is bundled client-side: it only deters spiders, it is not real security.
- `src/blocksService.js` is the single data access point; swap in Firebase later. It also contains a stub for future per-user blocks.

## Deploy (Vercel)
Import the repo in Vercel, add the env vars, deploy. Or `npm run build` then `npm run deploy` (needs Vercel CLI).

## Offline
After first load, `public/sw.js` caches assets so the app works without network.
