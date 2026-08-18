<!-- gitnexus:start -->
# GitNexus — Code Intelligence

<!-- fleet-invariants:start 2026-08-18 -->
## Fleet invariants (all Sandbox agents — 2026-08-18)

1. **Cortex first.** Fleet retrieval brain is **https://cortex.forge-os.ai** (skill sandbox-cortex). Query before cloning/grepping/re-researching. Auth: op://Openclaw/CORTEX_SERVICE_TOKENS/password. brain.makemysandbox.com is DEAD.
2. **Host plane is not assumed.** Many apps moved Render to Coolify/DO (forge-b/forge-c). Before deploy advice check this repo brief + live Coolify/Render status. Never claim Render from memory alone.
3. **Tools you actually have.** Verify live tool list each session. Do not assume Composio/Claude Desktop connectors. Prefer git/gh, 1Password SA, Coolify CLI, gibson-memory.
4. **PR protocol.** Live on agent/<id> only. Ship via PR. Reconcile to canonical every session.
5. **Daily memory.** End non-trivial work with memory/YYYY-MM-DD.md.
6. **Verify, do not claim.** Cron lastRunStatus=ok is not proof — check duration + artifacts.
7. **Python failing is your escaping, not `python3`.** Verify the interpreter before blaming it — it is almost always fine. Two real modes: (a) the file you wrote holds literal `\n` two-char sequences instead of newlines, so the indented body after `with`/`if`/`for` dies with `SyntaxError: unexpected character after line continuation character`; (b) heredocs via `exec` — `shouldSpawnWithShell()` is hard-coded `false`, so `<<EOF` is an argv token, not shell syntax, and `python3` hangs on stdin until the timeout. Rules: write a real `.py` **inside the workspace, never `/tmp`** (OpenClaw's syntax preflight only inspects files under `workdir` — and skips entirely at `security=full`+`ask=off`, our default, so today it never runs at all); `python3 -m py_compile <file>` before you execute it; one-liners only inside `python3 -c`; scheduled jobs run **committed** scripts, never ones regenerated at runtime. **Never re-run a script that just SyntaxError'd** — `cat` it and fix the escaping. Blind retries are the actual token burn. (Rose+Thyme 08-16 + 08-18 x2; morning-brief 08-14.)
8. **Coolify: one deploy path per commit.** Apps auto-deploy on git push (webhook). Do **not** also run `coolify deploy uuid` for that same SHA — double queue (API + webhook) starves forge-c. After push: wait. Manual deploy only if nothing is queued/in_progress after ~5 minutes. Stuck doubles: cancel queued duplicates; leave one in_progress; do not re-fire.
<!-- fleet-invariants:end -->


This project is indexed by GitNexus as **Pitch-Box** (176 symbols, 174 relationships, 0 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/Pitch-Box/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Pitch-Box/clusters` | All functional areas |
| `gitnexus://repo/Pitch-Box/processes` | All execution flows |
| `gitnexus://repo/Pitch-Box/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->