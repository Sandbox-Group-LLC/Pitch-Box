# PLAN — Pitch Box

Long-form retrospective archive. Newest first. The live "where are we now" pointer is
`WORKING-STATE.md`; this file is the durable record — search by date or topic.

---

## 2026-06-05 — Port from ForgeOS + stand up as standalone "Pitch Box"

**Context.** The app began life inside ForgeOS (Brian's vibe-code platform) on branch
`apps/sandbox-xm-demand`. ForgeOS injects platform scaffolding into every `apps/<slug>`
branch, so the branch carried two unrelated codebases. Goal: lift the app out as a
standalone product called **Pitch Box** and drop the platform residue.

**What the app is.** A demand & acquisition planning whiteboard — personas, channels,
accounts, playbooks, named-brand pitches, quick ideas, notes. Self-contained:
`server.js` (Express + `@neondatabase/serverless`) serves `index.html` (vanilla-JS SPA)
and a JSON API. 7 tables, auto-created and seeded on boot. The seed is real Sandbox-XM
GTM data (Attio, Mercury, Intel, Viktor, Nova).

**What got dropped (ForgeOS residue, zero code dependency from the app).**
`server/` (2.1k-line cockpit backend + brands/memory/projects/publish/settings/
integrations/assets managers), `client/` (React/Vite control-panel UI), `ForgeOS.md`,
`attached_assets/`.

**Rebrand — tool name only.** Pitch Box = the tool: page title, brand mark (`PB`),
header product name, `package.json` name (`pitch-box`), `[pitchbox]` log prefix.
`Sandbox-XM` kept wherever it's the agency doing the pitching: hero/persona copy and
every seed pitch/persona/account (real data — not rewritten).

**DB.** Runtime points at `DATABASE_URL` (a fresh, clean Neon project Brian set up on
Render) with a `PITCHBOX_DATABASE_URL` fallback. Dropped the old
`XM_DEMAND_DATABASE_URL` runtime var — that DB is the migration *source*.

**CI.** The template `Typecheck & Test` job ran `npm run typecheck` + `npm test`,
neither of which exists on a plain-JS app — both failed on the first PR. Trimmed to
`npm install` + `node --check server.js`. Job **name kept** (`Typecheck & Test`) because
the branch ruleset matches the required check by name; renaming would deadlock merges.
Removed the template's per-PR Neon preview-branch workflow (`neon_workflow.yml`) — it
failed for missing `NEON_API_KEY`/`NEON_PROJECT_ID` and isn't this app's DB model.

**Admin SQL relay.** Added `POST /api/admin/relay` from `docs/RENDERNEONSQLRELAY.md`:
constant-time auth (`crypto.timingSafeEqual`), disabled-when-unset `503` gate, light
audit line. Adapted to the app's CommonJS + `@neondatabase/serverless` `sql` helper —
no new `pg` dependency. Secret is env-only (`ADMIN_RELAY_PASSWORD`, set in Render).
Verified: `503` unset / `403` bad-auth / `400` no-query / `200`+rows on valid query.

**Merge trail.** PR #1 (`port` → `development`) → PR #2 rollup (`development` → `main`).
PR #3 (CI + relay → `development`) → rollup → `main`. App + relay live on `main`.

**Still open.** CLAUDE.md rewrite (still ForgeOS boilerplate — to do together); data
migration from the old `XM_DEMAND` DB; confirm Render service `srv-d8h5g66q1p3s73fol5b0`
deploys from `main`; review stale `docs/FORGESCRAPE-AS-A-SERVICE.md`.
