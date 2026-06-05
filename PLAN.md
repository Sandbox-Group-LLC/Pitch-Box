# PLAN — Pitch Box

Long-form retrospective archive. Newest first. The live "where are we now" pointer is
`WORKING-STATE.md`; this file is the durable record — search by date or topic.

---

## 2026-06-05 — Docs catch-up, CLAUDE.md de-zombie, GitNexus indexing

Follow-on to the port, same day.

**Docs.** Populated the empty template stubs with real content: `README.md` (what
Pitch Box is, stack, run, env, data model, API, deploy), `WORKING-STATE.md` (live
pointer), `PLAN.md` (this archive).

**CLAUDE.md.** Did a flag-driven pass with Brian: stripped ForgeOS zombies (Forge
`brand_profile_id`, the `forgeintelligence.ai`/`ADMIN_PASSWORD` relay map, fake admin
endpoints, PR #102 / 2026-05-07 lore) and corrected the facts (one Render service
deploying from `main` only; `development` is integration-only; no linked env group —
secrets in the service's own env; real hardened relay map → `docs/RENDERNEONSQLRELAY.md`;
"cloud" not "Desktop"; dead doc links → `.claude/skills/gitnexus/`).

**GitNexus indexing.** Ran `npx gitnexus@latest analyze`. Pitch Box is now indexed as
`Pitch-Box` — 10 files, 176 symbols, 174 edges, 3 clusters, 0 flows (it's a 2-file app,
so a flat graph is expected). Artifacts: `analyze` appended a fresh marker-wrapped
GitNexus section to `CLAUDE.md` but left the old frozen Forge-Intelligence block above
it — removed the stale duplicate so only the real generated section remains. Generated
`AGENTS.md` (agent-context mirror) and the canonical nested skills under
`.claude/skills/gitnexus/` (the old flat `GITNEXUS-*-SKILL.md` files were superseded and
removed). The `.gitnexus/` graph DB is local-only — its own `.gitignore` (`*`) keeps the
~24 MB KuzuDB index out of git; rebuild on demand with `analyze`. Per-session note: in
the ephemeral cloud container the index doesn't persist, so a fresh session re-runs
`analyze` to rebuild the local graph; the committed `CLAUDE.md`/`AGENTS.md`/skills are
the portable carryover.

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
