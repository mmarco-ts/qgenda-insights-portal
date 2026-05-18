# QGenda Insights Portal — 4-minute Loom Walkthrough

**Target audience**: Amber, Ricky, Chad, Steve, Jonathan + the wider eval team.
**Anchor message** (what Amber said on 4/1): *"Replace the dashboard first, AI is the upsell."*
**Tone**: confident, pacey, talk to *them* not to a generic audience.

> **Setup before you hit record**
> 1. Open Chrome incognito, sign in to `qgenda.thoughtspot.cloud` so the embed session is alive.
> 2. Visit the deployed Vercel URL of the portal.
> 3. Reset state: switch to **All Organizations · VP, Clinical Ops** in the tenant pill.
> 4. Have `/dashboard`, `/ai-analytics`, and `/my-reports` pre-loaded in 3 tabs.
> 5. Quit Slack notifications.

---

## 0:00 – 0:25 · Cold open & hook

**Screen**: Home page of the portal, hovering the hero.

> "Hey QGenda team — quick follow-up to our session on April 1st. A couple of you, especially Chad, asked the right question: 'this is cool, but where does it actually live and how do our customers use it?' So I packaged everything you saw — Spotter, the workforce liveboard, the semantic model — inside what your Insights product could feel like end-to-end. This is exactly the kind of whitelabel shell your dev team would build *once* and reuse for every QGenda customer."

**Callout**: Stay <25s here. Don't read the hero copy aloud. Move on.

---

## 0:25 – 1:05 · The dashboard — your #1 ask

**Screen**: Click sidebar → **Workforce Dashboard**.

> "Starting with what Amber said matters most: the dashboard. This is the same liveboard from the last demo — Total Shifts, Open Shifts, Published Rate, Coverage trends — but embedded inside the portal with zero ThoughtSpot branding visible. Header's clean, footer's gone, fonts and colors are your Red Hat Display / navy / teal."

**Pause on the AI Highlights pill — point at it with your cursor**:

> "And we kept the AI Highlights here on purpose — this is the 'what changed and why' button that Ricky asked about. One click, the agent scans every metric on the board and tells your CS team where the anomalies are. *This* is what GoodData can't do."

---

## 1:05 – 1:55 · Tenant + Persona switcher — governance + per-customer

**Screen**: Click the tenant pill top-right.

> "Now — the customization question Amber raised. We've got 4,500+ QGenda customers; every one needs their own scoped view. Here's what that looks like."

**Click → Northwell Health.** Watch the embed re-render.

> "Same dashboard, but a `runtimeFilter` got pushed into the iframe — Organization IN Northwell. Numbers update live. No new dashboard built, no per-customer code. This is your governance boundary."

**Click the pill again → switch persona to Operations Lead.**

> "Same idea on the persona axis. A VP gets year-to-date. Operations Lead gets the last 30 days. Subtitle on the header tracks it — `Northwell Health · Operations Lead · Last 30 days`. This is the per-role customization you and Ricky were asking about — and it's all driven by one config object in the portal, not by spinning up new TS objects."

**Callout**: If the data doesn't visibly change when you switch persona, briefly say *"this filter is applied as Shift Date ≥ today minus 30 — if your column expects a different format we'd switch operators"*. Don't dwell.

---

## 1:55 – 2:50 · Insights AI — persona-tuned prompts injected live

**Screen**: Click sidebar → **Insights AI**. Right panel has the starter questions for the active persona.

> "Now the AI — what your team is calling the upsell. Two things to notice here. First, the right-side panel: those prompts aren't generic — they're tuned for whichever persona is selected. The VP sees 'Top 10 organizations by scheduled hours.' Operations Lead sees 'Daily shift volume over the last 30 days.' Same data, different decision."

**Click any one prompt** (e.g. "Daily shift volume over the last 30 days").

> "Click and the question goes straight into the live Spotter conversation — no remount, no copy-paste. Under the hood the portal is firing `HostEvent.SpotterSearch` into the iframe — your devs can wire any button in your app to ask Spotter a question with one method call."

**While Spotter answers, narrate the thinking panel briefly**:

> "And same as before — token-by-token reasoning, you can see exactly which columns and filters the agent chose, so your data team can audit and trust the answer. That auditability is what makes this safe to put in front of clinical leadership."

---

## 2:50 – 3:30 · My Reports — API-driven, dev-friendly

**Screen**: Click sidebar → **My Reports**.

> "Last page — and this is for Steve, Jonathan, and the dev team. My Reports isn't a static list. The portal hits `/api/rest/2.0/metadata/search` on load and renders every Insights Board the signed-in user has access to — title, description, last-modified, author. Anything your team publishes inside ThoughtSpot shows up here automatically. No deploy needed."

**Click any card to demonstrate the deep-link**:

> "Click any card — it routes to `/dashboard/{liveboardId}`, same embed, same whitelabel. This is the pattern your team can extend: every TS object can be surfaced inside QGenda Insights via REST, with your own UI on top."

---

## 3:30 – 4:00 · Close

**Screen**: Back to Home page.

> "Quick recap of what we're showing today:
>
> - **Dashboard-first** — exactly what Amber and Ricky said you need to replace GoodData on
> - **Per-customer and per-persona** filtering driven by `runtimeFilters`, not by duplicating objects
> - **AI Insights** layered on top — opt-in upsell that builds on the same semantic model
> - **API-driven** — your team can reuse the patterns inside the QGenda app
>
> Code is already on GitHub at `mmarco-ts/qgenda-insights-portal` and deployed on Vercel — Steve and Jonathan, feel free to fork it. Jack and I will be on the office hours Monday at 4pm Eastern to walk through embedding it inside the real QGenda app. Talk soon."

---

## Optional B-roll (only if you have 5 min, not 4)

Slot before the close (around 3:20):

- Open the **Help popover** with the `?` button → show the Slack channel handoff (`#ext-qgenda-thoughtspot`). One sentence: *"And one polish detail — every page has a help button that drops customers into a Slack channel with us. Standard support pattern your CS team can reuse."*
- Click the **small TS logo** in the header → tab opens to `qgenda.thoughtspot.cloud`. One sentence: *"Power users can jump straight into the full ThoughtSpot app from anywhere in the portal."*

---

## Recording tips

- **Camera on** in the bottom-right bubble — Amber and Chad respond to face time.
- **Speak briskly** — they're senior and busy; aim for ~140 wpm.
- **Don't apologize for anything** — if you switch persona and data doesn't move, sell the *what it does* not the *what's broken*.
- **End on a verb** — "Talk soon", "Fork it", "See you Monday". Never trail off with "yeah, so that's it…"
- **Record in 1920×1080**, use Loom's "studio" enhancement to crop neatly. Keep the sidebar visible the whole time — it's the brand frame.

---

## Two-sentence Slack post to drop the Loom link in `#ext-qgenda-thoughtspot`

> Hey team — quick 4-min Loom of the QGenda Insights portal we built off the back of the 4/1 session. Hits Amber's "dashboard first, AI second" framing, shows per-customer + per-persona scoping in action, and the codebase is at github.com/mmarco-ts/qgenda-insights-portal if anyone on Steve's team wants to fork. Office hours Monday 4pm ET as planned.
