# QGenda Insights Portal

Whitelabel embedded analytics demo built on ThoughtSpot, tailored for QGenda's healthcare workforce management platform.

**Stack:** Vite + React + TypeScript + `@thoughtspot/visual-embed-sdk`.

## Local dev

```bash
npm install
npm run dev
```

The dev server runs on **http://localhost:8080**.

## Deploy

Push to GitHub and connect to Vercel — no config needed (`vercel.json` rewrites all routes to `index.html`).

## Routes

| Path | What |
|------|------|
| `/` | Home — hero, capability cards |
| `/dashboard` | Default Insights Board (liveboard) |
| `/dashboard/:liveboardId` | Any liveboard, opened by ID |
| `/ai-analytics` | Insights AI (Spotter) with starter prompts |
| `/my-reports` | Live, API-driven list of liveboards |

## ThoughtSpot setup required

In `qgenda.thoughtspot.cloud` → Develop → Customizations → Security settings:

1. **CORS whitelisted domains** — add `http://localhost:8080` (and your Vercel domain when deployed).
2. **CSP visual embed hosts** — add `http://localhost:8080` (and Vercel domain).
3. **CSP img-src domains** — add `https://cdn.jsdelivr.net` (for the Insights AI logo override).

Then make sure you have an active session on `qgenda.thoughtspot.cloud` in the same browser — the embeds + REST calls rely on `AuthType.None` (cookie-based).
