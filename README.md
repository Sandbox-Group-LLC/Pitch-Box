# Pitch Box

Internal demand & acquisition planning whiteboard for Sandbox-XM. A single working
surface to plan, track, and iterate every persona, channel, account, pitch, and play
that moves Sandbox-XM toward a booked roster. Edit anything inline — it saves.

Ported out of the ForgeOS build platform into a standalone app.

## Stack

- **Backend:** Node + Express — a single `server.js` monolith.
- **Frontend:** `index.html` — a vanilla-JS SPA, no build step.
- **Database:** Neon Postgres via `@neondatabase/serverless` (HTTP driver).

No bundler, no framework, no TypeScript. `server.js` serves `index.html` at `/` and
exposes a small JSON API under `/api`.

## Run locally

```bash
npm install
DATABASE_URL="postgres://…-pooler.…neon.tech/db?sslmode=require" npm start
# → listening on 0.0.0.0:3000
```

The app reads `DATABASE_URL` (falls back to `PITCHBOX_DATABASE_URL`). With no DB URL
it boots in read-only seed mode and the data endpoints return `503`. On first connect
`ensureSchema()` creates the tables and seeds the starter board.

## Environment

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Neon **pooled** connection string. Primary DB. |
| `PITCHBOX_DATABASE_URL` | Fallback DB URL if `DATABASE_URL` is unset. |
| `ADMIN_RELAY_PASSWORD` | Secret gating the admin SQL relay. Unset → relay returns `503` (disabled). |
| `PORT` | Listen port (default `3000`). |

## Data model

Schema is created and seeded on boot by `ensureSchema()`:

`personas` · `channels` · `accounts` · `playbooks` · `notes` · `pitches` · `quick_ideas`

`pitches` is the rich entity (target company, concept, one-liner, contact, outbound
draft, status, next action, `pitch_deck_url`). The seed is **real GTM data** — active
Sandbox-XM accounts and pitches (Attio, Mercury, Intel, Viktor, Nova).

## API

| Method | Route | Purpose |
|--------|-------|---------|
| `GET`  | `/` | Serve the app. |
| `GET`  | `/api/state` | All board data in one payload. |
| `PATCH`| `/api/{personas,channels,accounts,playbooks,pitches,quick-ideas}/:id` | Update a row (allow-listed fields). |
| `POST` / `DELETE` | `/api/accounts`, `/api/pitches`, `/api/quick-ideas`, `/api/notes` | Create / delete rows. |
| `POST` | `/api/admin/relay` | Hardened ad-hoc SQL relay (admin only). |

### Admin SQL relay

`POST /api/admin/relay` runs parameterized SQL against the Neon DB. Gated by
`ADMIN_RELAY_PASSWORD` (constant-time compare; disabled with `503` when the secret is
unset). Server-to-server / terminal only — never call it from the browser. See
[`docs/RENDERNEONSQLRELAY.md`](docs/RENDERNEONSQLRELAY.md) for the operating rules
(always parameterize; `SELECT` before any `UPDATE`/`DELETE`).

```bash
curl -sS https://<host>/api/admin/relay \
  -H 'Content-Type: application/json' \
  -d '{"adminPassword":"'"$ADMIN_RELAY_PASSWORD"'","query":"SELECT id, status FROM pitches ORDER BY created_at DESC LIMIT 20"}'
```

## Deploy

Auto-deploys on Render (service `srv-d8h5g66q1p3s73fol5b0`, workspace
`tea-d6gtqoh4tr6s73bgmk1g`, repo bound). `start` runs `node server.js`. Set
`DATABASE_URL` + `ADMIN_RELAY_PASSWORD` in the service environment — never via Render's
bulk env-var `PUT` (it replaces all vars).

## Branch flow

`claude/<cloud-branch>` → PR into `development` (integration) → rollup PR `development`
→ `main` (production). Draft PRs; reviewed and merged by Brian. See `CLAUDE.md`.
