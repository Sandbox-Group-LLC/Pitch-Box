# Working State

Live pointer for "where are we right now." Keep it short (~100 lines). Long-form
history goes in `PLAN.md`.

_Last updated: 2026-06-05_

## What just shipped

- **Ported the app out of ForgeOS** (`ForgeOS@apps/sandbox-xm-demand`) into this
  standalone repo: `server.js` (Express + Neon) + `index.html` (vanilla-JS SPA) +
  package files. Dropped all ForgeOS platform scaffolding (`server/`, `client/`,
  `ForgeOS.md`, `attached_assets`) — the app had zero code dependency on it.
- **Rebranded tool identity → Pitch Box** (title, `PB` mark, header, package name,
  `[pitchbox]` log prefix). `Sandbox-XM` is kept everywhere it means the agency —
  hero copy, persona subtitles, and **all seed pitches/personas/accounts** (real GTM
  data: Attio, Mercury, Intel, Viktor, Nova).
- **DB:** app points at `DATABASE_URL` (clean Neon project) with a
  `PITCHBOX_DATABASE_URL` fallback. The old `XM_DEMAND_DATABASE_URL` is the migration
  *source*, not the runtime store.
- **CI:** trimmed the `Typecheck & Test` job to `node --check server.js` (no React/TS/
  test suite on this plain-JS app). Job name preserved — the branch ruleset matches the
  required check by name.
- **Removed** the template's broken Neon per-PR preview-branch workflow.
- **Added** the hardened SQL relay (`POST /api/admin/relay`, see
  `docs/RENDERNEONSQLRELAY.md`) — constant-time auth, disabled-when-unset `503` gate.
  Gated by `ADMIN_RELAY_PASSWORD` (set in the Render env).
- **Docs:** populated `README.md`, `WORKING-STATE.md`, `PLAN.md` (were empty stubs).
- **CLAUDE.md de-zombied** — stripped ForgeOS residue (Forge brand IDs, old relay map,
  dead endpoints/lore), corrected repo facts (one Render service from `main`, no linked
  env group, real relay map).
- **GitNexus indexing** — ran `npx gitnexus analyze`; Pitch Box is now indexed as
  `Pitch-Box` (10 files, **176 symbols / 174 edges / 3 clusters / 0 flows**). The
  generated section in `CLAUDE.md` + `AGENTS.md` now carries real stats; canonical
  skills live in `.claude/skills/gitnexus/`. The `.gitnexus/` graph is local-only
  (self-ignored) — rebuilt on demand via `analyze`.

All app/infra/docs above is merged to `main` (PRs #1 → #2 rollup, #3 rollup, #5, #6).

## Next

- **Data migration** — port existing rows from the old `XM_DEMAND` Neon DB into the
  clean `DATABASE_URL` project (can run through the relay).
- **Confirm Render branch binding** — verify `srv-d8h5g66q1p3s73fol5b0` deploys from
  `main` so the `development → main` rollup lands where expected.
- **Stale template docs** — `docs/FORGESCRAPE-AS-A-SERVICE.md` is likely ForgeOS
  residue; review whether it stays.

## Repo shape

- `server.js` — Express monolith: schema + seed, JSON API, admin relay.
- `index.html` — the whole frontend (vanilla JS, no build).
- `docs/` — `RENDERNEONSQLRELAY.md`, `CI-AND-PR-CHECKS.md`, (stale) `FORGESCRAPE-…`.
- `.github/workflows/ci.yml` — `Typecheck & Test` (= `node --check`), the merge gate.
- `CLAUDE.md` / `AGENTS.md` — agent context; bottom GitNexus section is generated.
- `.claude/skills/gitnexus/` — GitNexus skill files (generated, canonical).
- `.gitnexus/` — local code-graph index (git-ignored; regenerate with `analyze`).
