# Content Brain

The **content layer** of the Sandbox Brain. Where the GitNexus code brain knows how the
software is wired, this knows the *business* — companies, customers, industries, and voice —
so Claude sessions can generate content (site copy, pitch briefs, decks, outbound) that
already sounds like us and knows who we're selling to.

It's just **markdown**. No app, no service, no database. It lives in the Pitch-Box repo,
which is already indexed into the Sandbox Brain, so everything here is brain-searchable for
free — and any Claude session can also just read the files directly.

## ⛔ The one hard rule: NO PII, NO CONFIDENTIAL

Everything in here gets **indexed into the brain and read by agents.** So it is **public-safe
business knowledge only.**

- ✅ Public company facts, disclosed funding/clients, industry context, our positioning and voice, named *public* executives, anonymized patterns.
- ❌ Unannounced people (e.g. an incoming exec not yet public), private contact details, deal economics, customer secrets, anything covered by an NDA.

**Confidential / PII lives in Pitch-Box's database** (the private working surface) — never here,
never in the brain. If you're unsure, it doesn't go in the Content Brain.

## Structure

```
companies/      our companies — who they are, what they do, how they're positioned
customers/      target & active accounts — public-safe profiles and angles
industries/     reusable market context (a buyer's world, deadlines, dynamics)
voice/          brand voice, tone rules, do/don't — the "sound like us" layer
case-studies/   our proven work, framed for reuse as proof
INDEX.md        this file — the map agents read first
```

## How to use it

- **Writing content with Claude?** Point the session at the relevant files first:
  `voice/brand-voice.md` + the `customers/<account>.md` + the `industries/<topic>.md`.
  That's the context pack — it grounds the output so you stop rewriting.
- **Via the brain:** ask the GitNexus brain for the topic; these docs are indexed and
  semantically searchable alongside the code.

## How to add knowledge

Drop a markdown file in the right folder (or have an agent draft one). Keep it dense,
sourced where it matters, and public-safe. One file per company / customer / industry topic;
update in place as you learn more.
