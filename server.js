var express = require('express');
var path = require('path');
var { neon } = require('@neondatabase/serverless');

var app = express();
var PORT = process.env.PORT || 3000;
var DB_URL = process.env.DATABASE_URL || process.env.PITCHBOX_DATABASE_URL;

app.use(express.json({ limit: '2mb' }));

var sql = null;
if (DB_URL) {
  sql = neon(DB_URL);
  console.log('[pitchbox] Neon connected');
} else {
  console.log('[pitchbox] No DB URL — running in read-only seed mode');
}

// ---- Seed content: Sandbox-XM positioning + starter board data (real GTM data) ----
var SEED_PERSONAS = [
  { title: 'VP of Marketing / CMO', company_type: 'Mid-market B2B SaaS ($50M–$500M revenue, Series B–D)', pain: 'User conferences and customer summits underperform — they feel like product demos in a ballroom, not industry-defining moments. Marketing team is stretched thin.', trigger: 'Annual conference on the roadmap, Series C/D raise, category positioning shift, new CMO setting brand agenda.', value_prop: 'A strategic experience partner who treats the flagship event as a brand moment, not a production job. Audience-first thinking tied to pipeline outcomes.' },
  { title: 'Head of Brand / Brand Marketing Lead', company_type: 'Design-led B2B SaaS — fintech, devtools, GTM, compliance', pain: 'Brand lives beautifully on the site and in product, but goes generic the moment it enters a physical room. No experiential partner who gets the aesthetic bar.', trigger: 'User conference, customer advisory board, executive dinners series, category launch, field marketing expansion.', value_prop: 'We match the design maturity of modern B2B brands — the room feels like the brand, not like a trade show. Every choice is deliberate.' },
  { title: 'Director of Events / Field Marketing', company_type: 'Growth-stage B2B tech with 5–20 person marketing team', pain: 'Running 20+ events a year with a tiny team. Needs a creative+strategic partner who can own flagship moments end-to-end, not a vendor to manage.', trigger: 'Hiring freeze + growth targets, flagship event underperformed, new VP demanding measurable brand lift from events budget.', value_prop: 'Embedded partnership model. We operate like an extension of the team — concept, design, production, narrative — so internal team can focus on the rest of the calendar.' },
  { title: 'Founder / Category-Creator CEO', company_type: 'Founder-led B2B (~$20M–$200M ARR) where the founder IS the brand', pain: 'The founder is the story but there\'s no signature moment that scales their POV. Keynotes feel like marketing, not movement.', trigger: 'Category definition push, book launch, executive visibility strategy, IPO prep, competitive narrative shift.', value_prop: 'We design signature founder-led moments — the kind that get written about and remembered. Part thought leadership, part theater, part manifesto.' }
];

var SEED_CHANNELS = [
  { name: 'LinkedIn Thought Leadership', motion: 'Founder-led posts 3x/week on experiential strategy, audience psychology, brand storytelling. Less promo, more point-of-view.', priority: 'HIGH', status: 'active', next_action: 'Draft content pillars: (1) experience design critique, (2) behind-the-scenes builds, (3) industry trend POVs, (4) client wins.' },
  { name: 'Strategic Partnerships', motion: 'Co-sell with adjacent agencies (brand strategy, PR, venue designers) where we fill the experiential gap.', priority: 'HIGH', status: 'planning', next_action: 'Map 15 target agency partners. Open with 3 warm intros to pilot referral flow.' },
  { name: 'Targeted Outbound', motion: 'Highly researched, 1:1 outreach to named accounts — never volume blasts. Reference specific activations they have run or should run.', priority: 'MED', status: 'planning', next_action: 'Build ICP list of 50 accounts. Write 5 hyper-personalized opens as templates.' },
  { name: 'Earned Press & Case Studies', motion: 'Publish long-form case studies on site; pitch trade press (Event Marketer, AdAge, Campaign US) when we ship a notable project.', priority: 'MED', status: 'planning', next_action: 'Identify 2 existing projects ready for case study treatment. Commission photography/film if needed.' },
  { name: 'Industry Events & Speaking', motion: 'Apply to speak at EventMB, BizBash, SXSW, Cannes fringe — not to attend, to lead a track.', priority: 'LOW', status: 'planning', next_action: 'Identify 3 speaking applications for next cycle. Build signature talk: "Experience as Operating System."' },
  { name: 'Portfolio & Website', motion: 'Ensure the Sandbox-XM public site shows work with depth — process, intent, outcomes. Not a gallery, a point of view.', priority: 'HIGH', status: 'active', next_action: 'Audit current case studies for depth. Add 2 new project breakdowns with real metrics.' }
];

var SEED_ACCOUNTS = [
  { company: 'Vanta', category: 'B2B SaaS — Compliance', stage: 'prospect', notes: 'Series C, rebranded 2024, runs customer summits (VantaCon). Marketing team visibly investing in brand. Fit: user conference elevation + customer dinners series.' },
  { company: 'Ramp', category: 'B2B SaaS — Fintech', stage: 'prospect', notes: 'Founder-led brand (Eric Glyman), strong design taste, runs Ramp-hosted events. Already respects design-led partners. Fit: founder visibility moments, customer advisory dinners.' },
  { company: 'Gusto', category: 'B2B SaaS — HR/Payroll', stage: 'prospect', notes: 'Mid-market, SMB-focused, plays in partner + accountant events. Warm to creative partners. Fit: channel partner summit redesign.' },
  { company: 'Webflow', category: 'B2B SaaS — Design tools', stage: 'prospect', notes: 'Design-forward brand, Webflow Conf is growing. Conference is their annual moment — ripe for creative elevation. Fit: Webflow Conf content + staging partnership.' },
  { company: 'Retool', category: 'B2B SaaS — Internal tools', stage: 'prospect', notes: 'Developer-first brand with a growing marketing arm. RetoolCon is young. Fit: shape the conference identity while it\'s still forming.' },
  { company: 'Linear', category: 'B2B SaaS — Project mgmt', stage: 'prospect', notes: 'Design-obsessed, small team, founder-visible (Karri Saarinen). Hosts launches and curated meetups. Fit: launch events + founder-led signature moment.' },
  { company: 'Attio', category: 'B2B SaaS — CRM', stage: 'prospect', notes: 'Series B, design-first, European aesthetic, expanding U.S. presence. No established event presence in U.S. yet. Fit: U.S. launch moment + founder intro dinners.' },
  { company: 'Clay', category: 'B2B SaaS — GTM data', stage: 'prospect', notes: 'On fire right now, runs community/creator events (Clay Labs), tiny marketing team that outsources creative. Fit: flagship community summit + GTM thought leadership theater.' },
  { company: 'Mercury', category: 'B2B SaaS — Business banking', stage: 'prospect', notes: 'Beautiful brand, founder-led (Immad Akhund), runs founder dinners and events. Growth mode. Fit: founder-to-founder dinner series, flagship customer moment.' }
];

var SEED_PLAYBOOKS = [
  { title: 'The Signature Activation Pitch', summary: 'Lead with a single, concept-led pitch for one flagship moment per brand — a hero experience that anchors their year.', steps: '1. Identify the brand\'s unanswered audience question. 2. Design one activation that makes the brand feel inevitable. 3. Show the story architecture before the build. 4. Quote scope tied to narrative outcome, not just deliverables.' },
  { title: 'The Discovery Workshop Wedge', summary: 'Offer a paid half-day brand experience workshop as a low-friction first engagement that leads to scoped work.', steps: '1. Package a 4-hour working session (audience mapping + experience opportunity audit). 2. Price as a discrete deliverable ($7.5K–$15K). 3. Deliverable = a one-page "Experience Thesis." 4. 60%+ should convert to larger project.' },
  { title: 'The Founder-to-Founder Channel', summary: 'When Brian connects directly with founders/CMOs through LinkedIn, warm intros, or event rooms — never hand off too early.', steps: '1. Keep Brian in the loop through first meeting. 2. Bring creative lead to second meeting with early thinking. 3. Send a sharp one-pager within 48 hours of first call. 4. Never pitch credentials; pitch a perspective on their business.' },
  { title: 'Case Study Flywheel', summary: 'Every project ships with a case study asset set — long-form, film, social cutdowns — that feeds every channel.', steps: '1. Scope documentation into every SOW from day one. 2. Capture process photo/video throughout. 3. Publish within 30 days of wrap. 4. Pitch to 3 trade publications on publish day.' }
];

// ---- First pitch: Oatly — Signature Activation ----
var OATLY_CONCEPT = [
  'THE OAT REPORT — Oatly\'s first annual cultural moment.',
  '',
  'A one-day, invite-only summit in NYC or LA where Oatly publishes its annual "State of the Oat" — part cultural report, part tasting experience, part provocation.',
  '',
  'Guests: food press, chefs, cultural critics, longtime fans, dissenting voices. Deliverable: a printed editorial report + a live experience that IS the launch of the report. It recurs annually. It becomes the thing they own.',
  '',
  'WHY IT WINS',
  '— Ladders to their brand voice (opinionated, literate, funny)',
  '— Creates owned media (the report) + earned media (the event) in one motion',
  '— Scales: year two is bigger than year one, by design',
  '— Pitch-sized: one hero moment, not a retainer ask',
  '',
  'THE AUDIENCE QUESTION WE\'RE ANSWERING',
  'How does a challenger dairy-alt brand stay culturally sharp once it\'s mainstream? The Oat Report is their answer — a platform to keep provoking, observing, and leading the conversation rather than defending share.'
].join('\n');

var OATLY_ONELINER = 'An invite-only annual summit where Oatly publishes "The Oat Report" — the cultural document the plant-based movement has been waiting for, delivered as a hero experience.';

var OATLY_EMAIL = [
  'Subject: An annual moment for Oatly — a concept, not a pitch deck',
  '',
  'Hi [First name],',
  '',
  'I run Sandbox-XM — we design brand experiences for teams who believe the room is strategy, not staging.',
  '',
  'I\'m writing because Oatly is one of maybe five brands in the world whose voice could carry a full-scale owned cultural moment, and as far as I can tell you haven\'t built one yet. You do sampling brilliantly. You do stunts. You do packaging as manifesto. But there isn\'t a single day of the year the industry waits for from Oatly — and there should be.',
  '',
  'The rough idea: an invite-only annual summit where Oatly publishes "The Oat Report" — part cultural audit of the plant-based movement, part tasting experience, part provocation. Food press, chefs, critics, superfans. A printed editorial report as the artifact. An evening that IS the launch. Year one sets the franchise. Year two is bigger by design.',
  '',
  'It answers a real tension: how does Oatly stay the loudest challenger now that the category caught up? The Oat Report keeps you leading the conversation instead of defending share.',
  '',
  'I\'m not looking to send a deck or get on a procurement list. I\'d like 25 minutes to walk you through the concept — if it\'s not for you, you\'ll at least have a framework to hand to whoever does build it.',
  '',
  'Worth a conversation?',
  '',
  'Brian',
  'Sandbox-XM',
  '[phone] · [site]'
].join('\n');

var SEED_PITCHES = [
  {
    target_company: 'Oatly',
    play: 'Signature Activation Pitch',
    concept_title: 'The Oat Report',
    one_liner: OATLY_ONELINER,
    concept: OATLY_CONCEPT,
    contact_name: '',
    contact_role: 'Head of Brand / CMO / Global Creative Director',
    outbound_draft: OATLY_EMAIL,
    status: 'drafting',
    next_action: 'Identify the right contact at Oatly (LinkedIn: Head of Brand, Creative Director, or CMO). Finalize subject line A/B. Send within 5 business days.'
  }
];

async function ensureSchema() {
  if (!sql) return;
  await sql('CREATE TABLE IF NOT EXISTS personas (id SERIAL PRIMARY KEY, title TEXT, company_type TEXT, pain TEXT, trigger TEXT, value_prop TEXT, updated_at TIMESTAMPTZ DEFAULT NOW())');
  await sql('CREATE TABLE IF NOT EXISTS channels (id SERIAL PRIMARY KEY, name TEXT, motion TEXT, priority TEXT, status TEXT, next_action TEXT, updated_at TIMESTAMPTZ DEFAULT NOW())');
  await sql('CREATE TABLE IF NOT EXISTS accounts (id SERIAL PRIMARY KEY, company TEXT, category TEXT, stage TEXT, notes TEXT, updated_at TIMESTAMPTZ DEFAULT NOW())');
  await sql('CREATE TABLE IF NOT EXISTS playbooks (id SERIAL PRIMARY KEY, title TEXT, summary TEXT, steps TEXT, updated_at TIMESTAMPTZ DEFAULT NOW())');
  await sql('CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, body TEXT, author TEXT, created_at TIMESTAMPTZ DEFAULT NOW())');
  await sql('CREATE TABLE IF NOT EXISTS pitches (id SERIAL PRIMARY KEY, target_company TEXT, play TEXT, concept_title TEXT, one_liner TEXT, concept TEXT, contact_name TEXT, contact_role TEXT, outbound_draft TEXT, status TEXT, next_action TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())');
  // Add pitch_deck_url column for tracking online slide decks (HTML decks, Pitch.com links, etc).
  // Idempotent — Postgres ADD COLUMN IF NOT EXISTS is safe to re-run on every boot.
  await sql("ALTER TABLE pitches ADD COLUMN IF NOT EXISTS pitch_deck_url TEXT");
  // Quick Ideas — lightweight pitch sketches hung off an account. Top-level tab in the UI.
  // Status values: 'sketch' (default), 'refining', 'promoted' (kept as history after promote-to-pitch).
  await sql('CREATE TABLE IF NOT EXISTS quick_ideas (id SERIAL PRIMARY KEY, account_id INTEGER, title TEXT, one_liner TEXT, summary TEXT, status TEXT DEFAULT \'sketch\', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())');

  var counts = await sql('SELECT (SELECT COUNT(*) FROM personas) AS p, (SELECT COUNT(*) FROM channels) AS c, (SELECT COUNT(*) FROM accounts) AS a, (SELECT COUNT(*) FROM playbooks) AS b, (SELECT COUNT(*) FROM pitches) AS pt');
  var row = counts[0];
  if (Number(row.p) === 0) {
    for (var i = 0; i < SEED_PERSONAS.length; i++) {
      var p = SEED_PERSONAS[i];
      await sql('INSERT INTO personas (title, company_type, pain, trigger, value_prop) VALUES ($1,$2,$3,$4,$5)', [p.title, p.company_type, p.pain, p.trigger, p.value_prop]);
    }
  }
  if (Number(row.c) === 0) {
    for (var j = 0; j < SEED_CHANNELS.length; j++) {
      var c = SEED_CHANNELS[j];
      await sql('INSERT INTO channels (name, motion, priority, status, next_action) VALUES ($1,$2,$3,$4,$5)', [c.name, c.motion, c.priority, c.status, c.next_action]);
    }
  }
  if (Number(row.a) === 0) {
    for (var k = 0; k < SEED_ACCOUNTS.length; k++) {
      var a = SEED_ACCOUNTS[k];
      await sql('INSERT INTO accounts (company, category, stage, notes) VALUES ($1,$2,$3,$4)', [a.company, a.category, a.stage, a.notes]);
    }
  }
  if (Number(row.b) === 0) {
    for (var m = 0; m < SEED_PLAYBOOKS.length; m++) {
      var pb = SEED_PLAYBOOKS[m];
      await sql('INSERT INTO playbooks (title, summary, steps) VALUES ($1,$2,$3)', [pb.title, pb.summary, pb.steps]);
    }
  }
  if (Number(row.pt) === 0) {
    for (var n = 0; n < SEED_PITCHES.length; n++) {
      var pt = SEED_PITCHES[n];
      await sql(
        'INSERT INTO pitches (target_company, play, concept_title, one_liner, concept, contact_name, contact_role, outbound_draft, status, next_action) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [pt.target_company, pt.play, pt.concept_title, pt.one_liner, pt.concept, pt.contact_name, pt.contact_role, pt.outbound_draft, pt.status, pt.next_action]
      );
    }
  }

  // One-time refocus migration: clear the old consumer-leaning account list and reseed with mid-market B2B targets.
  // Guarded by a marker row so it only runs once.
  var marker = await sql("SELECT 1 FROM accounts WHERE company = 'Vanta' LIMIT 1");
  if (marker.length === 0) {
    console.log('[pitchbox] Running B2B refocus migration: clearing old accounts, reseeding');
    await sql('DELETE FROM accounts');
    for (var kk = 0; kk < SEED_ACCOUNTS.length; kk++) {
      var aa = SEED_ACCOUNTS[kk];
      await sql('INSERT INTO accounts (company, category, stage, notes) VALUES ($1,$2,$3,$4)', [aa.company, aa.category, aa.stage, aa.notes]);
    }
    // Also retire the Oatly pitch — it's off-strategy now. Keep it archived by marking passed so we don't lose the writing.
    await sql("UPDATE pitches SET status = 'passed', next_action = 'ARCHIVED: Off-strategy after B2B refocus. Concept preserved as reference for future consumer-brand opportunities.' WHERE target_company = 'Oatly'");
  }

  // Attio activation: move to researching + seed the Signature Activation pitch. Idempotent.
  var attioPitch = await sql("SELECT 1 FROM pitches WHERE target_company = 'Attio' LIMIT 1");
  if (attioPitch.length === 0) {
    console.log('[pitchbox] Activating Attio pitch');
    await sql("UPDATE accounts SET stage = 'researching', notes = $1 WHERE company = 'Attio'", [
      'ACTIVE PITCH: Signature Activation — "Ask More" — an invite-only NYC salon + annual GTM field guide. See Pitches tab for full concept + outbound draft. Why Attio wins: design-led positioning, no owned US moment yet, Series B/C inflection, ~80-person team = no agency gatekeepers, founder (Nicolas Sharp) is design-obsessed and publicly vocal.'
    ]);

    var ATTIO_CONCEPT = [
      'ASK MORE — Attio\'s first owned cultural moment.',
      '',
      'A one-night, invitation-only salon in New York for ~120 of the sharpest GTM operators, founders, and RevOps leaders in the ecosystem. Not a conference. Not a user summit. A salon — dinner, a curated conversation on the record, and a printed artifact attendees take home: "The Ask More Report" — an annual field guide to how the best GTM teams actually run.',
      '',
      'Every Attio value, made physical:',
      '— TASTE: the room, the food, the design, the print piece',
      '— DATA-DRIVEN: the report is original research (survey Attio\'s customer base + friends-of)',
      '— OPINIONATED: a stated POV about what\'s broken in modern GTM',
      '— BUILT FOR THE BEST TEAMS: the guest list IS the marketing',
      '',
      'THE ARC',
      'Year 1 — 120 people, one night, one report. Proof of concept.',
      'Year 2 — the report pre-sells the room. Waitlist forms.',
      'Year 3 — "Ask More" is a franchise. The thing Attio owns that Salesforce can never make.',
      '',
      'WHY IT WINS',
      '— Anti-scale, pro-signal. Opposite of Dreamforce/INBOUND — which is exactly the Attio brand argument.',
      '— Creates owned media (the report circulates for 12 months) + earned media (the room is the story) in one motion.',
      '— Costs a fraction of a single conference booth. 10x the reach and residual.',
      '— Fully on-brand: reading the concept IS the demo of why Sandbox-XM is the right partner.',
      '',
      'THE AUDIENCE QUESTION WE\'RE ANSWERING',
      'How does Attio — the opinionated, design-led challenger to Salesforce — make its POV physical in the U.S. market without imitating the incumbents? "Ask More" is the answer: a small room, a sharp report, and a franchise that rewards taste over scale.'
    ].join('\n');

    var ATTIO_ONELINER = 'A one-night NYC salon + annual printed field guide — "The Ask More Report" — that turns Attio\'s design-led, opinionated POV into an owned cultural moment the best GTM teams will want on their calendar.';

    var ATTIO_EMAIL = [
      'Subject: The moment Attio doesn\'t have yet',
      '',
      'Hi [First name],',
      '',
      'I run Sandbox-XM. We design brand experiences for teams who believe the room is strategy, not staging. I\'m writing with a concept, not a pitch deck.',
      '',
      'Attio is one of the few B2B brands whose voice could carry an owned cultural moment in the U.S. — and as far as I can tell, you haven\'t built one. Salesforce has Dreamforce. HubSpot has INBOUND. Attio has a beautiful product page and very good taste, and that\'s a gap worth closing on your own terms.',
      '',
      'The idea: one night in New York. 120 people — the sharpest GTM operators, founders, and RevOps leaders in the ecosystem. A curated dinner conversation on the record. A printed artifact everyone takes home: "The Ask More Report" — an annual field guide to how the best GTM teams actually run, built from original research across your customer base and friends-of.',
      '',
      'Every Attio value, made physical. Taste in the room. Data in the report. A stated POV about what\'s broken in modern GTM. And a guest list that IS the marketing.',
      '',
      'It\'s the opposite of a conference: anti-scale, pro-signal. Year one proves it. Year two the report pre-sells the room. Year three it\'s a franchise — something Salesforce structurally cannot copy.',
      '',
      'I\'m not looking to send a deck or get on a procurement list. I\'d like 25 minutes to walk you through the concept. If it\'s not for you, you\'ll at least have a framework to hand to whoever does build it.',
      '',
      'Worth a conversation?',
      '',
      'Brian',
      'Sandbox-XM',
      '[phone] · [site]'
    ].join('\n');

    await sql(
      'INSERT INTO pitches (target_company, play, concept_title, one_liner, concept, contact_name, contact_role, outbound_draft, status, next_action) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      ['Attio', 'Signature Activation Pitch', 'Ask More', ATTIO_ONELINER, ATTIO_CONCEPT, '', 'Head of Brand / Head of Marketing / CMO (US) — or direct to Nicolas Sharp (Founder/CEO) if warm intro possible', ATTIO_EMAIL, 'drafting', 'Identify right US contact — Head of Marketing or Head of Brand (LinkedIn search: "Attio marketing" + NY/SF filter). Consider direct-to-founder path via mutual connection. A/B test subject line. Send within 5 business days.']
    );
  }

  // Attio language upgrade v2: mirror their own tagline ("Ask more from CRM.") as the subject line,
  // and lead the email with a sentence that reflects it back at them. Research-backed patch.
  // Idempotent — guarded by subject-line marker.
  var attioV2 = await sql("SELECT 1 FROM pitches WHERE target_company = 'Attio' AND outbound_draft LIKE 'Subject: Ask more from Attio%' LIMIT 1");
  if (attioV2.length === 0) {
    var attioRows = await sql("SELECT id FROM pitches WHERE target_company = 'Attio' LIMIT 1");
    if (attioRows.length > 0) {
      console.log('[pitchbox] Applying Attio language upgrade v2');
      var ATTIO_EMAIL_V2 = [
        'Subject: Ask more from Attio',
        '',
        'Hi [First name],',
        '',
        'You tell your customers to ask more from CRM. This is a concept for the room where the best GTM teams actually do.',
        '',
        'I run Sandbox-XM. We design brand experiences for teams who believe the room is strategy, not staging. I\'m writing with a concept, not a pitch deck.',
        '',
        'Attio is one of the few B2B brands whose voice could carry an owned cultural moment in the U.S. — and as far as I can tell, you haven\'t built one. Salesforce has Dreamforce. HubSpot has INBOUND. Attio has a beautiful product page and very good taste, and that\'s a gap worth closing on your own terms. It\'s the moment Attio doesn\'t have yet.',
        '',
        'The idea: one night in New York. 120 people — the sharpest GTM operators, founders, and RevOps leaders in the ecosystem. A curated dinner conversation on the record. A printed artifact everyone takes home: "The Ask More Report" — an annual field guide to how the best GTM teams actually run, built from original research across your customer base and friends-of.',
        '',
        'Every Attio value, made physical. Taste in the room. Data in the report. A stated POV about what\'s broken in modern GTM. And a guest list that IS the marketing.',
        '',
        'It\'s the opposite of a conference: anti-scale, pro-signal. Year one proves it. Year two the report pre-sells the room. Year three it\'s a franchise — something Salesforce structurally cannot copy.',
        '',
        'I\'m not looking to send a deck or get on a procurement list. I\'d like 25 minutes to walk you through the concept. If it\'s not for you, you\'ll at least have a framework to hand to whoever does build it.',
        '',
        'Worth a conversation?',
        '',
        'Brian',
        'Sandbox-XM',
        '[phone] · [site]'
      ].join('\n');
      await sql("UPDATE pitches SET outbound_draft = $1, updated_at = NOW() WHERE target_company = 'Attio'", [ATTIO_EMAIL_V2]);
    }
  }

  // Attio contact v3: identified target — Alex Vale, Attio (UK). His LinkedIn post pattern shows he's the
  // public voice celebrating Attio customers (Granola unicorn, Seapoint, Astral, etc) — founding-team /
  // senior GTM profile. Sharpen email to speak slightly more to GTM/ecosystem outcomes while keeping
  // the design-led voice. Idempotent — guarded by contact_name marker.
  var attioV3 = await sql("SELECT 1 FROM pitches WHERE target_company = 'Attio' AND contact_name = 'Alex Vale' LIMIT 1");
  if (attioV3.length === 0) {
    var attioV3Rows = await sql("SELECT id FROM pitches WHERE target_company = 'Attio' LIMIT 1");
    if (attioV3Rows.length > 0) {
      console.log('[pitchbox] Applying Attio contact v3 — Alex Vale');
      var ATTIO_EMAIL_V3 = [
        'Subject: Ask more from Attio',
        '',
        'Hi Alex,',
        '',
        'You tell your customers to ask more from CRM. This is a concept for the room where the best GTM teams actually do.',
        '',
        'I\'ve been watching how you talk about Attio publicly — the Granola unicorn post, the Seapoint shout-out, the steady drumbeat of "another awesome Attio customer." You\'re already trying to build a room in LinkedIn posts. I\'m writing with a concept for the physical version.',
        '',
        'I run Sandbox-XM. We design brand experiences for teams who believe the room is strategy, not staging. This isn\'t a pitch deck — it\'s a concept.',
        '',
        'One night in New York. 120 people — the sharpest GTM operators, founders, and RevOps leaders in the Attio ecosystem. A curated dinner conversation on the record. A printed artifact everyone takes home: "The Ask More Report" — an annual field guide to how the best GTM teams actually run, built from original research across your customer base and friends-of.',
        '',
        'Every Attio value, made physical. Taste in the room. Data in the report. A stated POV about what\'s broken in modern GTM. And a guest list that IS the marketing.',
        '',
        'Salesforce has Dreamforce. HubSpot has INBOUND. Attio has a beautiful product page and very good taste — and a U.S. moment worth closing on your own terms. "Ask More" is the opposite of a conference: anti-scale, pro-signal. Year one proves it. Year two the report pre-sells the room. Year three it\'s a franchise Salesforce structurally cannot copy.',
        '',
        'It also does something tactical: every customer you\'re already celebrating on LinkedIn gets a physical reason to rally around Attio — and a report they circulate for 12 months after.',
        '',
        'I\'d like 25 minutes to walk you through it. If it\'s not for you, you\'ll at least have a framework to hand to whoever does build it.',
        '',
        'Worth a conversation?',
        '',
        'Brian',
        'Sandbox-XM',
        '[phone] · [site]'
      ].join('\n');
      await sql(
        "UPDATE pitches SET contact_name = $1, contact_role = $2, outbound_draft = $3, next_action = $4, updated_at = NOW() WHERE target_company = 'Attio'",
        [
          'Alex Vale',
          'Attio — founding-team / senior GTM. UK-based. Public voice for Attio customer wins on LinkedIn (linkedin.com/in/alexjvale).',
          ATTIO_EMAIL_V3,
          'Warm-intro scan first: any one hop to Alex Vale, a Redpoint partner, or an Attio customer (Granola, Seapoint, Astral, Replicate, ElevenLabs, Flatfile, Hex, Vercel). If warm path = send via intro. If cold = LinkedIn DM + email parallel within 48 hours. Keep the GTM/ecosystem angle — he responds to customer-success stories.'
        ]
      );
    }
  }

  // Mercury House — touring residency. Two times a year, Mercury takes over a real house at Cannes,
  // SXSW, Miami Art Week, NY Tech Week. Not a booth. A home. Idempotent.
  var mercuryPitch = await sql("SELECT 1 FROM pitches WHERE target_company = 'Mercury' LIMIT 1");
  if (mercuryPitch.length === 0) {
    console.log('[pitchbox] Activating Mercury pitch — Mercury House');
    await sql("UPDATE accounts SET stage = 'researching', notes = $1 WHERE company = 'Mercury'", [
      'ACTIVE PITCH: Signature Activation — "Mercury House" — a touring residency. Twice a year, Mercury takes over a real house at the cultural moments their customers already attend (Cannes, SXSW, Miami Art Week, NY Tech Week). Not a booth. A home. See Pitches tab for full concept + outbound draft. Why Mercury wins: founder-visible (Immad), already runs dinners + Mercury Raise, has the design taste, no current annual cultural anchor, sits on the most valuable behavioral dataset in startup land.'
    ]);

    var MERCURY_CONCEPT = [
      'MERCURY HOUSE — a touring residency, not a conference.',
      '',
      'Twice a year, Mercury takes over a house — a real residence, not a venue — at the cultural moments their customers already attend. Cannes Lions in June. SXSW in March. Miami Art Week in December. NY Tech Week in spring. Three to five days, invite-only, ~40 guests at a time, programmed like a private salon: founder office hours with Immad, operator dinners, late-night fireside chats with portfolio CEOs, morning runs, a working library, a film room.',
      '',
      'It is the opposite of a booth. The brand becomes a place, not a banner.',
      '',
      'WHY A RESIDENCY (NOT AN EVENT)',
      '— A house implies belonging. A booth implies transaction.',
      '— Multi-day immersion creates relationships a 90-min dinner cannot.',
      '— It is a *format*, not a one-off — the same architecture redeploys anywhere.',
      '— It is photogenic in a way ballrooms are not. Press writes about Mercury House the way they wrote about The Wing or Soho House launches.',
      '',
      'THE FRANCHISE LOGIC',
      'Stop 1 — NY Tech Week (spring). Soft launch. Brownstone in the Village. ~40 guests. Press preview at the end.',
      'Stop 2 — Cannes (June). Villa in Cap d\'Antibes. Mercury\'s answer to the Cannes "yacht" cliche — taste, not flash. Founder-stage talks on creator economy + ambition.',
      'Stop 3 — SXSW (March, year two). Austin compound. Programming leans into builders + AI.',
      'Stop 4 — Miami Art Week (December, year two). Wynwood loft. The most design-forward stop. Mercury x art world crossover.',
      '',
      'EVERY MERCURY VALUE, MADE PHYSICAL',
      '— TASTE: the house, the food, the programming, the print piece guests leave with',
      '— AMBITION: the guest list IS the thesis — only the most ambitious operators are in the room',
      '— OPERATING LAYER: programming reflects how Mercury thinks — capital efficiency, hiring, runway, AI adoption',
      '— FOUNDER-LED: Immad in the room, on the record, in conversation — not on stage',
      '',
      'THE ARTIFACT',
      'Each Mercury House publishes a printed dispatch — "Notes from Mercury House: Cannes 2026" — capturing the conversations, frameworks, and unscripted moments. The dispatch travels for 12 months. The room is exclusive; the dispatch is the marketing.',
      '',
      'WHY IT WINS FOR MERCURY',
      '— Anti-Brex/Ramp. They run booths and conference parties. Mercury runs a house. Different category.',
      '— Repeatable: same format, four cities, two years to franchise.',
      '— Pressable: every stop generates its own story arc.',
      '— Costs less than a single Cannes activation done the old way. 10x the cultural residual.',
      '— Fully on-brand: a house is the most Mercury-feeling format imaginable.',
      '',
      'THE AUDIENCE QUESTION WE ARE ANSWERING',
      'How does Mercury — already founder-loved, already design-respected — graduate from "banking that does more" to a *cultural operating layer* the most ambitious companies orbit around? Mercury House is the answer: the brand becomes a place, the place becomes a franchise, and the franchise becomes something Brex and Ramp structurally cannot copy.'
    ].join('\n');

    var MERCURY_ONELINER = 'A touring residency — not a conference — that takes Mercury to Cannes, SXSW, Miami Art Week, and NY Tech Week. Twice a year, a real house. ~40 guests. Founder-led programming. A printed dispatch the industry circulates for 12 months after.';

    var MERCURY_EMAIL = [
      'Subject: A house, not a booth — a concept for Mercury',
      '',
      'Hi [First name],',
      '',
      'I run Sandbox-XM. We design brand experiences for teams who believe the room is strategy, not staging. Writing with a concept, not a pitch deck.',
      '',
      'Mercury already runs the best founder dinners in the category. Mercury Raise is real IP. Immad shows up where it matters. So this is not a "you do not have a moment" pitch — you have several. It is a "the moments could be a franchise" pitch.',
      '',
      'The idea: Mercury House. Twice a year, Mercury takes over a real house — not a venue, a residence — at the cultural moments your customers already attend. Cannes in June. NY Tech Week in spring. Miami Art Week in December. SXSW in March. Three to five days, invite-only, ~40 guests, programmed like a private salon. Founder office hours with Immad. Operator dinners. Late-night fireside chats. Morning runs. A working library. A film room.',
      '',
      'Not a booth. A home. The brand becomes a place, not a banner.',
      '',
      'Every Mercury value, made physical. Taste in the house. Ambition in the guest list. Operating-layer thinking in the programming. Immad in the room, in conversation, not on stage. And every stop publishes a printed dispatch — "Notes from Mercury House: Cannes 2026" — that travels for 12 months. The room is exclusive; the dispatch is the marketing.',
      '',
      'It is anti-Brex, anti-Ramp by design. They run booths. You run a house. Different category. Same architecture redeploys anywhere — same format, four cities, two years to franchise. Costs less than a single Cannes activation done the conventional way, and 10x the cultural residual.',
      '',
      'I would like 25 minutes to walk you through it. If it is not for you, you will at least have a framework to hand to whoever does build it.',
      '',
      'Worth a conversation?',
      '',
      'Brian',
      'Sandbox-XM',
      '[phone] · [site]'
    ].join('\n');

    await sql(
      'INSERT INTO pitches (target_company, play, concept_title, one_liner, concept, contact_name, contact_role, outbound_draft, status, next_action) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      ['Mercury', 'Signature Activation Pitch', 'Mercury House', MERCURY_ONELINER, MERCURY_CONCEPT, '', 'Head of Brand / VP Marketing — or direct to Immad Akhund (Founder/CEO) if warm intro possible. Mercury HQ is SF. Marketing team is small and design-led; founder is publicly accessible on Twitter.', MERCURY_EMAIL, 'drafting', 'Identify right contact: (1) Mercury VP Marketing or Head of Brand via LinkedIn — Mercury HQ is SF. (2) Direct-to-founder via Immad on Twitter/LinkedIn if warm path exists. (3) YC network is the most likely warm-intro vector. Send within 5 business days. Cannes 2026 (June) is the pressable anchor stop — lead with it in any follow-up.']
    );
  }

  // Attio contact v4: email confirmed via Apollo — alex@attio.com. Append to contact_role, bump next_action
  // to reflect ready-to-send state. Idempotent — guarded by email-in-contact-role marker.
  var attioV4 = await sql("SELECT 1 FROM pitches WHERE target_company = 'Attio' AND contact_role LIKE '%alex@attio.com%' LIMIT 1");
  if (attioV4.length === 0) {
    var attioV4Rows = await sql("SELECT id FROM pitches WHERE target_company = 'Attio' LIMIT 1");
    if (attioV4Rows.length > 0) {
      console.log('[pitchbox] Applying Attio contact v4 — email confirmed');
      await sql(
        "UPDATE pitches SET contact_role = $1, next_action = $2, updated_at = NOW() WHERE target_company = 'Attio'",
        [
          'Alex Vale · alex@attio.com (confirmed via Apollo) · Attio — founding-team / senior GTM. UK-based. Public voice for Attio customer wins on LinkedIn (linkedin.com/in/alexjvale).',
          'READY TO SEND. Two-channel play: (1) LinkedIn connection request with short note — "Have a concept for Attio\'s first owned U.S. moment. Sent the full thing by email. Would love 25 min." (2) Full email to alex@attio.com within same hour. Final check before send: personalize [phone] · [site] footer, confirm subject line "Ask more from Attio". Log send date + any reply in this card.'
        ]
      );
    }
  }

  // Intel Forum — current client, Vision retired, SMG sales group desperate for replacement.
  // Brian produced Intel Vision Las Vegas 2024 = unique credential. Buyer: Greg Ernst (SVP/GM, SMG).
  // Champion: Deidre Rippy (Director of Events, Intel — 10-year working relationship with Brian).
  // Idempotent — guarded by intel-pitch existence check.
  var intelPitch = await sql("SELECT 1 FROM pitches WHERE target_company = 'Intel' LIMIT 1");
  if (intelPitch.length === 0) {
    console.log('[pitchbox] Activating Intel pitch — Intel Forum');

    // Ensure Intel account row exists
    var intelAccount = await sql("SELECT 1 FROM accounts WHERE company = 'Intel' LIMIT 1");
    if (intelAccount.length === 0) {
      await sql('INSERT INTO accounts (company, category, stage, notes) VALUES ($1,$2,$3,$4)', [
        'Intel',
        'Enterprise — Semiconductors / AI Infrastructure',
        'researching',
        'CURRENT CLIENT (Federal BU — Sandbox-XM produced Intel Federal Summit + Intel Event Content Review). ACTIVE PITCH: "Intel Forum" — closed-door, customer-led AI infrastructure summit replacing the retired Intel Vision. Buyer: Greg Ernst (SVP/GM, Sales Management Group). Warm-intro champion: Deidre Rippy (Director of Events, Intel — 10-year Brian relationship). Brian produced Intel Vision Las Vegas 2024 — unique credential. Tan turnaround thesis (engineering excellence, customer trust, financial discipline) maps directly to the format. See Pitches tab for full concept + outbound draft.'
      ]);
    } else {
      await sql("UPDATE accounts SET stage = 'researching', category = 'Enterprise — Semiconductors / AI Infrastructure', notes = $1, updated_at = NOW() WHERE company = 'Intel'", [
        'CURRENT CLIENT (Federal BU — Sandbox-XM produced Intel Federal Summit + Intel Event Content Review). ACTIVE PITCH: "Intel Forum" — closed-door, customer-led AI infrastructure summit replacing the retired Intel Vision. Buyer: Greg Ernst (SVP/GM, Sales Management Group). Warm-intro champion: Deidre Rippy (Director of Events, Intel — 10-year Brian relationship). Brian produced Intel Vision Las Vegas 2024 — unique credential. Tan turnaround thesis (engineering excellence, customer trust, financial discipline) maps directly to the format. See Pitches tab for full concept + outbound draft.'
      ]);
    }

    var INTEL_CONCEPT = [
      'INTEL FORUM — the room where AI infrastructure gets decided.',
      '',
      'Not a conference. A closed-door, customer-led, decision-grade summit. ~300 people. Two days. In a city that signals seriousness, not Vegas. Built for the exact buyer Intel needs back: hyperscaler infra leads, AI-native CTOs, sovereign-AI program leaders, federal/defense AI buyers.',
      '',
      'Vision was a 4,000-person showcase. 80% of Intel\'s pipeline came from 5% of the room. Intel Forum is just that 5% — same pipeline yield, fraction of the cost, ten times the deal velocity per attendee.',
      '',
      'WHY THIS, WHY NOW',
      '— Vision is permanently retired. SMG is bleeding without their #1 pipeline-generation moment.',
      '— The replacement cannot be Vision-with-AI-bolted-on. It has to be AI-native in DNA, designed for the next decade of infrastructure decisions.',
      '— Lip-Bu Tan\'s turnaround thesis (engineering excellence, customer trust, financial discipline) demands a smaller, sharper, customer-led format. Intel Forum is the most Tan-shaped event possible.',
      '',
      'EVERY SESSION IS CUSTOMER-LED, NOT INTEL-LED',
      '— On-the-record customer conversations replace Intel keynotes',
      '— A live "Infrastructure Decisions Index" — anonymized data from the room about how AI workloads are actually being deployed',
      '— AI-native attendee matching: every guest meets the 6 people who advance their roadmap',
      '— Outputs are decision artifacts, not swag',
      '',
      'THE FRANCHISE LOGIC',
      'Year 1, Stop 1 — Intel Forum: Americas (Q2). Flagship.',
      'Year 1, Stop 2 — Intel Forum: EMEA (Q3, Brussels — the sovereign AI capital).',
      'Year 1, Stop 3 — Intel Forum: APAC (Q4, Singapore).',
      'Three rooms a year, same brand grammar, every region\'s pipeline served. Same architecture as Mercury House — different industry, different stakes, same repeatability logic.',
      '',
      'THE ARTIFACT',
      '"The Forum Report: State of AI Infrastructure 2026" — printed, distributed to every Intel sales rep globally, becomes the leave-behind for every enterprise AI conversation Intel has for the next 12 months. One event, 12 months of sales air cover.',
      '',
      'WHY SANDBOX-XM IS THE ONLY AGENCY THAT CAN PITCH THIS',
      'Brian produced Intel Vision Las Vegas 2024. He knows what Intel\'s sales org actually needed from Vision and didn\'t get. No competitor has that lived intelligence. We\'re not pitching a concept — we\'re pitching the answer to a problem we watched up close.',
      '',
      'THE AUDIENCE QUESTION WE ARE ANSWERING',
      'How does Intel rebuild pipeline gravity in the AI era — without resurrecting a tentpole that no longer fits the brand or the budget? Intel Forum is the answer: smaller room, sharper buyers, customer-led narrative, three regions, one printed artifact that travels for a year. The format is the strategy.'
    ].join('\n');

    var INTEL_ONELINER = 'Vision is gone. Intel needs a Forum. A closed-door, customer-led AI infrastructure summit — ~300 buyers, three regions a year, one printed artifact that travels for 12 months. The pipeline-grade replacement Intel\'s sales org has been waiting for.';

    var INTEL_EMAIL = [
      'Subject: Vision is gone. Intel needs a Forum.',
      '',
      'Greg — Deidre Rippy suggested I send this to you directly. She and I have worked together for ten years across Intel events, and when she heard the concept I\'m about to walk you through, her first reaction was: this is exactly what SMG needs right now.',
      '',
      'Quick context: I\'m Brian Morgan — I run Sandbox-XM. I produced Intel Vision in Las Vegas in 2024. I know what your sales org actually needed from that room and what it didn\'t deliver. I also know Vision is permanently retired, and I know the gap that left in your pipeline.',
      '',
      'This is a concept, not a pitch deck.',
      '',
      'Intel Forum. Closed-door. Customer-led. Decision-grade. About 300 people — hyperscaler infrastructure leads, AI-native CTOs, sovereign-AI program leaders, federal/defense AI buyers. Two days. Held somewhere that signals seriousness, not Vegas.',
      '',
      'Vision was a 4,000-person showcase where 80% of your pipeline came from 5% of the room. Intel Forum is just that 5% — same pipeline yield, fraction of the cost, ten times the deal velocity per attendee.',
      '',
      'Three things make it the right format for the moment:',
      '',
      'First, every session is customer-led, not Intel-led. On-the-record conversations replace keynotes. A live "Infrastructure Decisions Index" pulls anonymized data from the room about how AI workloads are actually being deployed. AI-native attendee matching ensures every guest meets the six people who advance their roadmap. The output is decision artifacts, not swag.',
      '',
      'Second, it franchises. Year one: Forum Americas (Q2), Forum EMEA in Brussels (Q3), Forum APAC in Singapore (Q4). Three rooms a year, same brand grammar, every region\'s pipeline served.',
      '',
      'Third, it produces the leave-behind your team has been asking for: "The Forum Report: State of AI Infrastructure 2026" — printed, distributed to every Intel sales rep globally, the artifact every enterprise AI conversation gets opened with for the next 12 months. One event. Twelve months of sales air cover.',
      '',
      'It also maps cleanly to Lip-Bu\'s thesis. Engineering excellence (the room is the proof). Customer trust (they\'re the keynote, not us). Financial discipline (smaller, sharper, decision-grade). It\'s the most Tan-shaped event possible.',
      '',
      'I\'d like 25 minutes to walk you through it. Deidre is cc\'d. If the concept lands, the path forward is fast — we\'ve already done the hardest part of any Intel event together.',
      '',
      'Worth a conversation?',
      '',
      'Brian Morgan',
      'Sandbox-XM',
      '[phone] · [site]'
    ].join('\n');

    await sql(
      'INSERT INTO pitches (target_company, play, concept_title, one_liner, concept, contact_name, contact_role, outbound_draft, status, next_action) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [
        'Intel',
        'Signature Activation Pitch',
        'Intel Forum',
        INTEL_ONELINER,
        INTEL_CONCEPT,
        'Greg Ernst',
        'SVP & GM, Sales Management Group (SMG), Intel. Buyer of record. WARM-INTRO CHAMPION: Deidre Rippy, Director of Events at Intel — 10-year Brian relationship, longtime friend. Send sequence runs through Deidre first.',
        INTEL_EMAIL,
        'drafting',
        'WARM-INTRO PATH UNLOCKED via Deidre Rippy. Send sequence: (1) Brian texts/calls Deidre first — walks her through Intel Forum concept verbally, asks if she will forward to Greg with her endorsement. (2) Once Deidre greenlights, send Greg the full email — opener already references her by name. (3) Cc Deidre on the Greg email so she can reinforce in-thread. (4) Source Greg\'s email (likely greg.ernst@intel.com — verify via Apollo or ask Deidre). (5) LinkedIn connect with Greg in parallel. Deidre\'s endorsement converts this from cold pitch to internal recommendation — time-to-yes drops from weeks to days. Brian\'s Vision Las Vegas 2024 production credit is the closing argument.'
      ]
    );
  }

  // Viktor — added manually by Brian via dashboard on Nov 22 2025; manual add didn't persist
  // (UX bug — prompt-based flow has no error surfacing; fixed in this same commit on client side).
  // Seeding the row here so the board reflects what Brian actually decided. Idempotent.
  var viktorAccount = await sql("SELECT 1 FROM accounts WHERE company = 'Viktor' LIMIT 1");
  if (viktorAccount.length === 0) {
    console.log('[pitchbox] Seeding Viktor account (manual add recovery)');
    await sql('INSERT INTO accounts (company, category, stage, notes) VALUES ($1,$2,$3,$4)', [
      'Viktor',
      'AI / Workforce Automation (Pre-Series A)',
      'prospect',
      'getviktor.com — "The AI employee for everyone else." Backed by Daniel Gross, Nat Friedman, swyx, Bek, Inovo, KAYA, Leonis, Oxford Science Enterprises. ~15-20 people. Positioned against ChatGPT/Claude/Tasklet as the non-technical, non-AI-native version — built for ops, COOs, chiefs of staff at companies who aren\'t building agents themselves. Culture: "Compress the timeline. Bet on the upside. Delete and move on." Events posture: near zero — Creator Program + Referral Program hint at distribution-by-people thinking. PITCH SHAPE: different from rest of board — Viktor has no brand budget, no flagship to elevate. Pitch must be category-creation, not brand-moment. Working concept: hybrid of "Day One" salons (live onboarding-as-dinner) + "Viktor at Work" documentary content (operators in their own workflow). Self-feeding loop — salon produces next film subject, film produces next salon invite list. Stage: prospect — direction not chosen yet (A: Workforce Report / B: Day One salons / C: Viktor at Work films / D: hybrid). Warm-intro vectors: Daniel Gross, Nat Friedman, swyx via shared network.'
    ]);
  }

  // Viktor v2 — Brian confirmed (1) Sandbox-XM is an enterprise customer of Viktor (~2 months in),
  // (2) email history exists with founder Fryd Wiatrowski, (3) Viktor reported $15M revenue in 10 weeks
  // and is raising $75M Series A led by Accel. Upgrades account to 'researching' and activates the
  // hybrid "Viktor House" pitch: Day One salons (in-person engine) + Viktor at Work films (content engine).
  // Idempotent — guarded by pitch existence.
  var viktorPitch = await sql("SELECT 1 FROM pitches WHERE target_company = 'Viktor' LIMIT 1");
  if (viktorPitch.length === 0) {
    console.log('[pitchbox] Activating Viktor pitch — Viktor House (hybrid)');

    await sql("UPDATE accounts SET stage = 'researching', category = 'AI / Workforce Automation (Series A, Accel-led)', notes = $1, updated_at = NOW() WHERE company = 'Viktor'", [
      'CURRENT CUSTOMER (Sandbox-XM has used Viktor enterprise for ~2 months) + WARM FOUNDER THREAD (Brian has email history with founder Fryd Wiatrowski). MOMENTUM SIGNAL: $15M revenue in 10 weeks, raising $75M Series A led by Accel. ACTIVE PITCH: "Viktor House" — hybrid of "Day One" salons (live onboarding-as-dinner) + "Viktor at Work" documentary films. Self-feeding loop: salons produce next film subjects; films produce next salon invite lists. Pitch shape is category-creation, not brand-moment — Viktor needs to defend its "AI employee for everyone else" claim before Microsoft/Google/Salesforce copy it. Buyer: Fryd Wiatrowski (Founder/CEO). The unique-to-Sandbox-XM credential: we ARE a Viktor customer — we can pitch this from inside the product, not outside it. See Pitches tab for full concept + outbound draft.'
    ]);

    var VIKTOR_CONCEPT = [
      'VIKTOR HOUSE — a category-creation engine, not an event.',
      '',
      'Two formats, one self-feeding loop. Built for the exact moment Viktor is in: $15M in 10 weeks, $75M Series A led by Accel, a category claim ("the AI employee for everyone else") that Microsoft, Google, and Salesforce will copy the second it scales. Viktor needs to defend the category before the incumbents arrive — and the defense is not a conference. It is a body of work the operators they want to win cannot stop encountering.',
      '',
      'FORMAT 1 — DAY ONE (THE IN-PERSON ENGINE)',
      'A traveling salon series. 3-4 cities a year. Each evening is 25 invite-only operators — ops leaders, COOs, chiefs of staff at non-tech-native companies (manufacturing, logistics, hospitality, professional services, healthcare ops). These are the buyers Viktor needs to convert, and the buyers most underserved by current AI marketing.',
      '',
      'The format is the proof: during dinner, every attendee onboards their first Viktor AI coworker live. Not a demo. Not a sandbox. They ship one real workflow before dessert. They leave having actually hired their first AI employee — and Viktor is the brand that made that happen, witnessed by 24 of their peers.',
      '',
      'The artifact: "Day One — The First Hire\'s First Week." A printed playbook, given to every guest at the end of dinner, capturing every workflow shipped that night, anonymized. It becomes the document operators forward to their CFOs and CEOs to explain what they just did.',
      '',
      'FORMAT 2 — VIKTOR AT WORK (THE CONTENT ENGINE)',
      'Long-form documentary films, ~12 minutes each, embedded inside real Viktor customers. The procurement manager at a Midwest manufacturer. The ops lead at a regional logistics company. The GM of a hospitality chain. Each film shows exactly how one human plus one Viktor changes a real workweek — the boring, granular, transformational truth that AI Twitter never captures because AI Twitter has never met these operators.',
      '',
      'Released monthly. Distributed everywhere the buyer actually lives (LinkedIn, ops podcasts, trade press, YouTube). Once a year, a live screening night in NYC where every featured operator is in the room with prospects. The screening becomes its own Day One.',
      '',
      'THE LOOP (THIS IS WHY THE TWO FORMATS BECOME ONE PROGRAM)',
      'Day One salon produces the next Viktor at Work film subject. The most striking workflow shipped at dinner becomes the next documentary. The film, once published, produces the next salon invite list — every operator who shares it, comments on it, or appears in it gets invited to the next Day One in their city. The salon makes the film. The film fills the salon. The brand compounds.',
      '',
      'WHY THIS IS THE RIGHT PITCH FOR VIKTOR\'S STAGE',
      '— Viktor is too early for a flagship conference. Day One starts at 25 people, costs a fraction of an event, and is more proof-dense per attendee than any conference will ever be.',
      '— Viktor is also too early to wait for a content team to scale. Viktor at Work films are produced by Sandbox-XM end-to-end — concept, casting, direction, post — so Viktor\'s in-house marketing team stays focused on growth.',
      '— Viktor\'s positioning ("AI for everyone else") requires showing, not telling. Both formats are showing-not-telling, made physical.',
      '— Viktor\'s culture ("compress the timeline, bet on the upside, delete and move on") matches the program\'s velocity: ship the first salon in 60 days, the first film in 90.',
      '',
      'EVERY VIKTOR VALUE, MADE PHYSICAL',
      '— FOR EVERYONE ELSE: every attendee and every film subject is a non-AI-native operator, not a tech influencer.',
      '— SHIP, DO NOT TALK: every dinner ships a real workflow. Every film documents a real workweek.',
      '— THE TIMELINE IS COMPRESSED: salon-to-shipped is one evening. Film cadence is monthly.',
      '— BET ON THE UPSIDE: the upside of operators-as-evangelists is structurally larger than paid acquisition can ever be.',
      '',
      'WHY SANDBOX-XM IS THE ONLY AGENCY THAT CAN PITCH THIS',
      'Sandbox-XM has used Viktor enterprise for ~2 months. We are not pitching from the outside — we are pitching from inside the product. We know what the first hour with Viktor actually feels like. We know which workflows ship in 20 minutes and which break. That is the lived intelligence behind the dinner format — and no competitor agency can claim it.',
      '',
      'THE AUDIENCE QUESTION WE ARE ANSWERING',
      'How does Viktor defend the "AI for everyone else" category before Microsoft, Google, and Salesforce arrive with budgets 1,000x ours? Viktor House is the answer: a brand built on operators-as-evidence, distributed through dinners and documentaries instead of demos and decks. By the time the incumbents copy the category, Viktor will be the only brand the operators actually trust — because Viktor is the only brand they have already shipped real work with, on the record, in their own kitchen.'
    ].join('\n');

    var VIKTOR_ONELINER = 'A category-creation engine — not an event. Day One salons (25 operators onboard a Viktor AI coworker live, during dinner) plus Viktor at Work documentary films (long-form embeds inside real customers). Self-feeding loop: salons produce the next film, films fill the next salon. Built to defend the "AI for everyone else" category before the incumbents arrive.';

    var VIKTOR_EMAIL = [
      'Subject: A category-defense engine for Viktor — from a customer',
      '',
      'Fryd,',
      '',
      'Brian Morgan, Sandbox-XM. We have traded emails before — and Sandbox-XM has been using Viktor enterprise for the last two months, so this email is coming from a customer first and an agency second. The $15M-in-10-weeks number and the Accel-led Series A are the reason I am writing now instead of in six months. Congratulations.',
      '',
      'I run an experiential brand studio. We design programs for brands that believe the room is strategy, not staging. This is a concept, not a pitch deck.',
      '',
      'Here is the premise. The category you are creating — "the AI employee for everyone else" — is real, and it is yours right now. It will not be yours in 18 months unless you defend it. Microsoft will ship Copilot for Operations. Google will ship something with Gemini in the name. Salesforce will buy a competitor and rebrand. They will all spend ten figures telling the same operators you are trying to win that they invented the category. The defense is not a bigger marketing budget. The defense is a body of work the incumbents structurally cannot replicate.',
      '',
      'The concept: Viktor House. Two formats, one self-feeding loop.',
      '',
      'Format one — Day One. A traveling salon series. 3-4 cities a year. 25 invite-only operators at each dinner — ops leaders, COOs, chiefs of staff at non-tech-native companies. During dinner, every attendee onboards their first Viktor AI coworker live and ships one real workflow before dessert. They leave having hired their first AI employee, witnessed by 24 peers. The artifact is a printed playbook — "Day One: The First Hire\'s First Week" — that they forward to their CFOs the next morning.',
      '',
      'Format two — Viktor at Work. Long-form documentary films, ~12 minutes each, embedded inside real Viktor customers. The procurement manager at a manufacturer. The ops lead at a logistics company. The GM of a hospitality chain. Each one shows exactly how one human plus one Viktor changes a real workweek — the granular, boring, transformational truth that AI Twitter has never captured because AI Twitter has never met these operators. Released monthly. Distributed where the buyer actually lives (LinkedIn, ops podcasts, trade press). Once a year, a live screening night in NYC where every featured operator is in the room with prospects.',
      '',
      'The loop is the point. Day One salons produce the next Viktor at Work film subject — the most striking workflow shipped at dinner becomes the next documentary. The film, once published, produces the next salon invite list. The salon makes the film. The film fills the salon. The brand compounds at zero marginal CAC.',
      '',
      'It matches Viktor\'s culture too. Compress the timeline: salon-to-shipped is one evening. Film cadence is monthly. The first salon ships in 60 days, the first film in 90. Bet on the upside: operators-as-evangelists is a structurally larger surface than any paid channel will ever be. Delete and move on: if a city does not work, kill it and try the next one. No tentpole risk.',
      '',
      'One last thing — Sandbox-XM has been using Viktor enterprise for the last two months. We know exactly what the first hour with the product feels like. We know which workflows ship in 20 minutes and which need patience. That lived intelligence is built into the dinner format. We can pitch this from inside the product, not outside it.',
      '',
      'I would like 30 minutes to walk you through it. Cannes 2026 and SXSW 2026 are both pressable anchor cities — I can frame either as the year-one launch. If the concept is not for Viktor, you will at least have a framework to hand to whoever does build it.',
      '',
      'Worth a conversation?',
      '',
      'Brian Morgan',
      'Sandbox-XM',
      '[phone] · [site]'
    ].join('\n');

    await sql(
      'INSERT INTO pitches (target_company, play, concept_title, one_liner, concept, contact_name, contact_role, outbound_draft, status, next_action) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [
        'Viktor',
        'Signature Activation Pitch',
        'Viktor House',
        VIKTOR_ONELINER,
        VIKTOR_CONCEPT,
        'Fryd Wiatrowski',
        'Founder/CEO, Viktor. WARM THREAD: Brian has existing email history with Fryd. CUSTOMER CREDENTIAL: Sandbox-XM has used Viktor enterprise for ~2 months — pitching from inside the product. STAGE: Series A in progress, $75M led by Accel, $15M revenue in 10 weeks. Backers include Daniel Gross, Nat Friedman, swyx — operator-investor network that responds to category-defense thinking.',
        VIKTOR_EMAIL,
        'drafting',
        'WARM PATH: send direct to Fryd via existing email thread. Open with the customer credential ("we have been using Viktor enterprise for the last two months") + congrats on the $15M/$75M news — that is the permission slip to pitch right now instead of in six months. Send sequence: (1) Reply-bump on the most recent existing thread with Fryd, OR send fresh with subject "A category-defense engine for Viktor — from a customer." (2) LinkedIn connection request in parallel if not already connected. (3) Reference Day One as the salon format and Viktor at Work as the content layer — give him both formats up front so he can pick his entry point. (4) Anchor city options: Cannes 2026 (June, founder-tech crossover) or SXSW 2026 (March, operator/builder audience). (5) Backup warm-intro vectors if cold-send underperforms: Daniel Gross, Nat Friedman, swyx — all named investors, all in Brian-reachable orbit. Time-to-yes target: 14 days.'
      ]
    );
  }

  // Viktor account backfill — the prior Viktor v2 migration only UPDATEs the accounts row,
  // assuming a manual UI add had created one. Brian confirmed manual UI adds silently fail,
  // so the Viktor account never landed. This backfill inserts the row if it's missing,
  // then re-applies the same stage/category/notes payload. Idempotent — guarded by existence check.
  var viktorAcct = await sql("SELECT 1 FROM accounts WHERE company = 'Viktor' LIMIT 1");
  if (viktorAcct.length === 0) {
    console.log('[pitchbox] Backfilling missing Viktor account row');
    await sql(
      'INSERT INTO accounts (company, category, stage, notes) VALUES ($1,$2,$3,$4)',
      [
        'Viktor',
        'AI / Workforce Automation (Series A, Accel-led)',
        'researching',
        'CURRENT CUSTOMER (Sandbox-XM has used Viktor enterprise for ~2 months) + WARM FOUNDER THREAD (Brian has email history with founder Fryd Wiatrowski). MOMENTUM SIGNAL: $15M revenue in 10 weeks, raising $75M Series A led by Accel. ACTIVE PITCH: "Viktor House" — hybrid of "Day One" salons (live onboarding-as-dinner) + "Viktor at Work" documentary films. Self-feeding loop: salons produce next film subjects; films produce next salon invite lists. Pitch shape is category-creation, not brand-moment — Viktor needs to defend its "AI employee for everyone else" claim before Microsoft/Google/Salesforce copy it. Buyer: Fryd Wiatrowski (Founder/CEO). The unique-to-Sandbox-XM credential: we ARE a Viktor customer — we can pitch this from inside the product, not outside it. See Pitches tab for full concept + outbound draft.'
      ]
    );
  }

  // Nova Intelligence — new lead added by Brian. novaintelligence.com. Agentic AI platform for SAP
  // custom code modernization and S/4HANA transformation. Positioning: "Triple your SAP team's
  // productivity." Buyer surface = SAP architects, S/4HANA program leads, enterprise CIOs at SAP shops.
  // Adding as prospect with full research note. Pitch development pending Brian's read on direction.
  // Idempotent — guarded by company name.
  var novaAcct = await sql("SELECT 1 FROM accounts WHERE company = 'Nova Intelligence' LIMIT 1");
  if (novaAcct.length === 0) {
    console.log('[pitchbox] Adding Nova Intelligence account');
    await sql(
      'INSERT INTO accounts (company, category, stage, notes) VALUES ($1,$2,$3,$4)',
      [
        'Nova Intelligence',
        'Enterprise AI — SAP / S/4HANA Modernization',
        'prospect',
        'NEW LEAD (added by Brian). Site: novaintelligence.com. Category: agentic AI platform for SAP custom code modernization and S/4HANA transformation. Tagline: "Triple your SAP team\'s productivity." Claim: map SAP landscape, eliminate redundant customizations, ship clean-core extensions 3x faster. Keywords surface: SAP, S/4HANA, ABAP, ECC migration, clean core, agentic AI, enterprise AI. BUYER SURFACE: SAP architects, S/4HANA program leads, enterprise CIOs at large SAP shops mid-migration. Very specific enterprise wedge — closer to Intel than to Mercury/Attio in buyer shape. PITCH OPPORTUNITY (open question): the natural Sandbox-XM angle for a category like this is a closed-door SAP modernization summit — a "Clean Core Council" or "S/4HANA Forum" format that gathers ~50 CIOs mid-migration, with live customer teardowns of real ABAP-to-clean-core projects. Same DNA as Intel Enterprise Forum but for the SAP buyer. Awaiting Brian\'s direction: develop full pitch, or hold as research-only while we learn more about the company stage/team/funding?'
      ]
    );
  }

  // Nova Intelligence — main pitch: The 2027 Room.
  // Champion: Lauren Sommers (incoming CMO, not yet public — keep in next_action only, not in notes).
  // Buyer: Emma Qian (CEO). Lauren asked Brian to build a pitch she will carry into Emma.
  // Pattern A with a sharp pipeline tail: category-defining program with a Marcus/Stefan two-track
  // structure. Outbound is a Lauren→Emma framing doc Lauren can paste into an internal email/slide,
  // not a cold outbound email. Idempotent — guarded by pitch existence.
  var novaPitch = await sql("SELECT 1 FROM pitches WHERE target_company = 'Nova Intelligence' LIMIT 1");
  if (novaPitch.length === 0) {
    console.log('[pitchbox] Activating Nova Intelligence pitch — The 2027 Room');

    // Upgrade Nova account: prospect → active. Public-safe notes (no Lauren name yet — not announced).
    await sql("UPDATE accounts SET stage = 'active', notes = $1, updated_at = NOW() WHERE company = 'Nova Intelligence'", [
      'ACTIVE PITCH (champion-confirmed, inside path). Buyer: Emma Qian, CEO, Nova Intelligence. Champion: incoming CMO (name held internal until public — see Pitches tab next_action). Champion specifically requested a pitch she can carry into Emma. Pattern A with a sharp pipeline tail: category-defining program that ALSO fills the F500 funnel. ACTIVE PITCH: "The 2027 Room" — closed-door council for the 200 CIOs and architects landing their S/4HANA migration before the 2027 ECC maintenance deadline. Two-track format (Marcus Track for Program Directors / VP IT; Stefan Track for Enterprise Architects). Annual artifact: The 2027 Migration Index. The Nova credential moment is a fireside between Nova\'s SAP HANA co-inventor and a customer CIO — a peer conversation about what HANA was originally for and what migration was supposed to look like. Structural moat: a hard external deadline (SAP\'s 2027 ECC cutoff) is doing the marketing for them. See Pitches tab for full concept + Lauren→Emma framing doc.'
    ]);

    var NOVA_CONCEPT = [
      'THE 2027 ROOM — the closed-door council for the CIOs and architects landing their S/4HANA migration before the clock runs out.',
      '',
      'Not a conference. Not a user group. A council — ~150 invite-only Fortune 500 CIOs, VPs of IT, SAP Program Directors, and Enterprise Architects, gathered twice a year, off the record, around a single shared problem: SAP\'s 2027 ECC maintenance deadline is 18 months away, every one of them is mid-migration, and none of them want to be the cautionary tale.',
      '',
      'Nova convenes the room. Nova is not the speaker. Nova is the operating layer beneath the room.',
      '',
      'WHY THIS FORMAT, WHY NOW',
      'The 2027 deadline is the rarest thing in enterprise software: a board-level, externally-enforced clock. Every CIO on the invite list is already under pressure to attend a room exactly like this. We are not building demand — we are catching it. The competitive frame is also clean: no SI, no consulting firm, and no other AI vendor can convene this room, because none of them have the credential stack Nova does. Co-inventor of SAP HANA. Google DeepMind. SAP venture-backed. The 2027 Room is the only room where the people who BUILT HANA convene the people who have to LIVE WITH it.',
      '',
      'THE TWO-TRACK STRUCTURE',
      'The room serves two named personas. They are different humans with different jobs.',
      '',
      '— THE MARCUS TRACK (SAP Program Directors / VPs of IT). The strategic frame. Budget defense. Vendor selection methodology. Board reporting templates. Anonymized peer benchmarks: "here is where the F500 actually is on the migration curve, six months ahead of the public narrative." Marcus walks out of the room with a deck he can present to his CEO on Monday.',
      '',
      '— THE STEFAN TRACK (SAP Enterprise Architects). Architect-grade technical sessions. Live custom-code teardowns on attendees\' own ABAP repositories — Nova\'s AI runs the POC live, in the room, on real code. Clean Core governance workshops. CDS view migration patterns. Module interdependency mapping. Stefan walks out having seen Nova handle his actual codebase, not a demo dataset.',
      '',
      'Both tracks run parallel for two days. Joint plenary opens day one; joint dinner closes day two. The point of the design: Marcus shows up for the strategic frame, Stefan shows up for the technical proof, and they go home aligned for the first time — because they were aligned in the same building.',
      '',
      'THE ARTIFACT — THE 2027 MIGRATION INDEX',
      'The single most defensible piece of IP Nova can own. An annual, anonymized aggregate dataset built from every attendee\'s pre-event codebase scan (Nova runs the scans; attendees opt in to inclusion in the aggregate). The Index becomes the authoritative answer to the question every SAP-shop CIO is asking right now and no one has answered: how far along is the F500, actually? Published as a paid report; excerpts go to The Wall Street Journal and CIO Magazine; the underlying methodology lives at Nova.',
      '',
      'In year one, the Index is the room. In year two, the room joins because of the Index.',
      '',
      'THE CREDENTIAL MOMENT',
      'Not a product demo. A fireside conversation between Nova\'s SAP HANA co-inventor and a customer CIO mid-migration, on stage, on the record. Title: "What HANA was for, and what migration was supposed to be." This is the moment press writes about. This is the moment that gets clipped and circulated for 12 months after the event. Nova\'s competitive moat is its credential stack; the 2027 Room makes that stack physical, in front of the buyer, with no Salesforce-style spin around it.',
      '',
      'THE PIPELINE TAIL',
      'Pattern A is the strategy. Pipeline is the receipt. Every attendee gets a pre-event codebase scan from Nova — that is the invite mechanism. Every Marcus walks out with a board-ready migration narrative; every Stefan walks out having seen Nova handle his code. Six tracks of structured follow-up, owned by the Nova GTM team, mapped to deal stages. Two rooms a year, each one capable of seeding 12-18 months of named enterprise pipeline. The 2027 Room is the room, the brand, and the funnel — in one architecture.',
      '',
      'WHY IT WINS FOR NOVA',
      '— Hard external deadline pulls the buyer to the room. Lowest CAC enterprise marketing motion possible.',
      '— Two-track format serves both buying personas simultaneously — the deal-shape Nova actually closes (technical sponsor + executive sponsor) is mirrored in the room itself.',
      '— The Index is a structural moat. By year two, no competitor can publish a credible alternative.',
      '— The credential moment (SAP HANA co-inventor on stage with a customer) is something Microsoft, Salesforce, Deloitte, Accenture STRUCTURALLY cannot replicate. They do not have the human.',
      '— Anti-conference, pro-signal. Opposite of SAPPHIRE NOW. Exactly the brand Nova should want.',
      '— The category Nova is creating — "agentic AI for SAP" — gets named, defined, and authority-tagged in the room before Microsoft or a consulting giant tries to rename it.',
      '',
      'THE AUDIENCE QUESTION WE ARE ANSWERING',
      'How does Nova — a Series-stage company with a category claim no incumbent has yet contested — own "agentic AI for SAP" as a category before the 2027 deadline becomes someone else\'s marketing? The 2027 Room is the answer: convene the people who have to land the migration, give them the only credible artifact in the category, put Nova\'s credential stack on stage in front of them, and turn the room into the funnel.'
    ].join('\n');

    var NOVA_ONELINER = 'A closed-door council — not a conference — for the F500 CIOs and architects landing their S/4HANA migration before SAP\'s 2027 ECC deadline. Two parallel tracks (Marcus / strategic + Stefan / technical), an annual peer-benchmark artifact (The 2027 Migration Index), and a credential moment only Nova can stage (HANA co-inventor in conversation with a customer CIO). The category-creation room AND the F500 pipeline funnel, fused in one architecture.';

    var NOVA_FRAMING_DOC = [
      'INTERNAL FRAMING DOC — Lauren → Emma',
      'For Lauren to paste into an internal email or first-90-days slide. Not a cold outbound. Written in the register of "the program your incoming CMO wants to land in her first quarter."',
      '',
      '———',
      '',
      'Emma —',
      '',
      'Walking in, the question I keep coming back to is: how does Nova own "agentic AI for SAP" as a category before Microsoft or one of the SIs tries to rename it? The 2027 deadline gives us a window. It will not stay open.',
      '',
      'Brian Morgan (Sandbox-XM) and I have been sketching a program I want to bring to you formally. Working title: The 2027 Room.',
      '',
      'The shape, in one paragraph: a closed-door council, ~150 F500 CIOs and SAP architects, twice a year, two days, off the record. Two parallel tracks — one for Program Directors / VP IT (Marcus), one for Enterprise Architects (Stefan). They show up because they are 18 months out from the ECC cutoff and they do not want to be the cautionary tale. Nova convenes the room. Nova is not the speaker.',
      '',
      'Three reasons I think this is the right first big swing:',
      '',
      '1. The 2027 deadline is doing the marketing. Every CIO on the invite list is already under board pressure to attend a room exactly like this. We are catching demand, not building it. That is the rarest CAC profile in enterprise marketing.',
      '',
      '2. The artifact is a structural moat. The 2027 Migration Index — anonymized aggregate codebase data from every attendee — becomes the authoritative number on a category no one else can credibly publish. By year two, the Index is the reason CIOs join the room. By year three, no SI or competitor can publish a credible alternative.',
      '',
      '3. The credential moment is something only we can stage. A fireside between our SAP HANA co-inventor and a customer CIO. Not a demo. A peer conversation about what HANA was originally for and what migration was supposed to look like. Microsoft cannot put that human on stage. Neither can Deloitte. We can.',
      '',
      'The pipeline math works too. Every attendee gets a pre-event codebase scan from us — that is the invite mechanism, and it is also a qualified-opportunity generator. Two rooms a year, structured GTM follow-up, mapped to deal stages. The 2027 Room is the room, the brand AND the funnel, in one architecture.',
      '',
      'What I would like from you: 30 minutes to walk you through the full concept with Brian on the call. If you are aligned on the shape, I want to land the first room inside my first 90 days. Cannes-adjacent timing is possible; my preference is a November launch in NYC or Half Moon Bay.',
      '',
      'I also have 3-4 lighter-weight alternative shapes Brian and I have sketched in case you want a smaller first swing instead of the full Room. Happy to walk you through any of them.',
      '',
      'Lauren',
      '',
      '———',
      '',
      'PITCH-DECK CONTEXT (for Brian + Lauren shared use):',
      '',
      'This is the doc Lauren walks into Emma\'s office with. The lighter-weight alternatives mentioned at the end are the four Quick Ideas living on the board: The 2027 Index (artifact-only, no room), Stefan\'s Lab (tighter, architect-only quarterly salon), The Co-Inventor Series (content-only documentary play), and The Migration Room (single-customer on-site engagement, monetizable as a service offering). Lauren has optionality — the big Room as the headline ask, four smaller shapes as the negotiation tail.'
    ].join('\n');

    await sql(
      'INSERT INTO pitches (target_company, play, concept_title, one_liner, concept, contact_name, contact_role, outbound_draft, status, next_action) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [
        'Nova Intelligence',
        'Signature Activation Pitch',
        'The 2027 Room',
        NOVA_ONELINER,
        NOVA_CONCEPT,
        'Emma Qian',
        'CEO, Nova Intelligence. PITCH PATH IS INSIDE-OUT: not a cold outbound to Emma. The incoming CMO (Lauren Sommers — NOT YET PUBLIC, keep internal) specifically asked Brian to build a pitch she will carry into Emma in her first quarter. Outbound field below is the Lauren→Emma framing doc, not a Brian→Emma email. Champion-led, not seller-led.',
        NOVA_FRAMING_DOC,
        'drafting',
        'CHAMPION-LED PATH (not cold outbound). Champion: Lauren Sommers (incoming CMO, not yet public — hold name off any external surface until announced). Send sequence: (1) Brian sends Lauren the full concept doc + the four Quick Idea sketches as the pre-read, framed as "the program I want to see you walk into Day 1 with." (2) 30-min call between Brian + Lauren to align on shape, sharpen language, identify which of the four lighter shapes (if any) Lauren wants in the back pocket for Emma. (3) Lauren carries the Lauren→Emma framing doc (saved in outbound_draft field) into her first formal Emma meeting in her first 30 days. (4) Brian joins the second Emma meeting if Lauren wants the concept architect in the room. (5) Time-to-yes target: 60 days from Lauren\'s start. Anchor launch window: November first-room in NYC or Half Moon Bay, OR May 2026 Cannes-adjacent if Emma prefers a global signal launch. Backstop: if Emma pushes back on the full Room, Lauren has four pre-sketched lighter alternatives in the Quick Ideas tab — negotiation leverage, not B-tier ideas.'
      ]
    );
  }

  // Nova Intelligence — four Quick Ideas seed.
  // These are the lighter-weight alternative shapes Lauren can carry into Emma as negotiation
  // leverage if the full 2027 Room concept hits friction. Each one maps to a different objection
  // Emma is likely to raise ("too expensive," "need architect wins," "need brand not events,"
  // "show me revenue"). Per Brian's plan-tab answer: graduated ideas are kept and marked
  // status='promoted' (history record), not deleted.
  // Idempotent — guarded by existence of any quick_idea attached to the Nova account.
  var novaAcctRow = await sql("SELECT id FROM accounts WHERE company = 'Nova Intelligence' LIMIT 1");
  if (novaAcctRow.length > 0) {
    var novaAccountId = novaAcctRow[0].id;
    var existingNovaIdeas = await sql('SELECT 1 FROM quick_ideas WHERE account_id = $1 LIMIT 1', [novaAccountId]);
    if (existingNovaIdeas.length === 0) {
      console.log('[pitchbox] Seeding four Nova Intelligence Quick Ideas');

      var NOVA_QUICK_IDEAS = [
        {
          title: 'The 2027 Index',
          one_liner: 'Artifact-only — no room, no event. An annual published benchmark on F500 S/4HANA migration progress that becomes the authoritative number in a category no one else owns.',
          summary: [
            'USE WHEN EMMA SAYS: "the full Room is too expensive for our stage."',
            '',
            'A standalone version of the 2027 Migration Index without the convened room. Nova runs anonymized codebase scans for ~75-100 F500 SAP shops over the year, aggregates the data, and publishes an annual report — "The 2027 Migration Index: Where the Fortune 500 Actually Is." Excerpts go to The Wall Street Journal and CIO Magazine. Methodology lives at Nova. The Index becomes the citation every analyst, every competitor, and every prospect reaches for when discussing S/4HANA migration progress.',
            '',
            'WHY THIS IS THE RIGHT FALLBACK',
            '— Cost profile is dramatically lower than the full Room (no venue, no travel, no production).',
            '— Still captures the structural moat: by year two, no competitor can publish a credible alternative.',
            '— Still positions Nova as the category-defining authority on "agentic AI for SAP."',
            '— Builds the invite list for a future 2027 Room when Nova is ready — every participating CIO becomes a warm contact.',
            '',
            'WHAT NOVA OWNS BY YEAR TWO',
            'The number every analyst, banker, and competitor cites when they discuss SAP modernization. That is a category-creation moat with a fraction of the operational lift.'
          ].join('\n')
        },
        {
          title: "Stefan's Lab",
          one_liner: 'A quarterly architect-only salon — 30 SAP Enterprise Architects in a closed room running Nova on their own ABAP code. Pure technical credibility, zero CIO theater.',
          summary: [
            'USE WHEN EMMA SAYS: "we need wins with architects, not CIOs."',
            '',
            'Quarterly closed-door technical salon. ~30 SAP Enterprise Architects. Off-the-record. Single venue (NYC or Bay Area), single day. The entire format is one thing: Nova\'s AI running live on attendees\' actual ABAP repositories, in the room, with the architects who wrote that code in the seats. Clean Core governance workshops between sessions. CDS view migration teardowns. Module interdependency mapping. No keynotes. No marketing.',
            '',
            'WHY THIS IS THE RIGHT FALLBACK',
            '— Stefan persona only — drops Marcus entirely, which cuts venue cost, run-of-show complexity, and follow-up effort roughly in half.',
            '— The deepest technical credibility moment possible. Architect-to-architect peer validation is the hardest currency to fake and the hardest for Microsoft or Deloitte to replicate.',
            '— Quarterly cadence builds a year-round drumbeat of in-product POCs — every Lab session generates 30 named technical evaluations, which is the early-stage deal-shape Nova actually closes on.',
            '',
            'WHAT NOVA OWNS BY YEAR TWO',
            'A standing community of the ~120 most influential SAP Enterprise Architects in the F500 — all of whom have personally seen Nova run on their own code. That is the technical buying committee for every Nova deal for the next decade.'
          ].join('\n')
        },
        {
          title: 'The Co-Inventor Series',
          one_liner: 'A long-form documentary content play — five short films a year with Nova\'s SAP HANA co-inventor in conversation with the original HANA team and customer CIOs. Brand play, not pipeline play.',
          summary: [
            'USE WHEN EMMA SAYS: "we need brand, not events."',
            '',
            'A documentary-grade content series. Five 15-20 minute films a year. Each one is a long-form conversation between Nova\'s SAP HANA co-inventor and either (a) a member of the original SAP HANA team, or (b) a customer CIO mid-migration. Festival-circuit-quality production. Distributed where the SAP buyer actually lives — LinkedIn, CIO Magazine\'s video channel, the SAPInsider community, YouTube. One annual screening event in NYC (or Half Moon Bay) that doubles as a press moment.',
            '',
            'WHY THIS IS THE RIGHT FALLBACK',
            '— Pure brand-building play. No venue, no two-day event production. Sandbox-XM owns the producing relationship end-to-end so Nova\'s in-house marketing team stays focused on growth.',
            '— The credential is the format. No one else in the category has a SAP HANA co-inventor available for long-form, on-the-record conversation. The competitive moat is structural, not just earned.',
            '— Compounds. Year-one films are evergreen — they continue distributing and educating buyers for years.',
            '',
            'WHAT NOVA OWNS BY YEAR TWO',
            'The definitive video record of SAP modernization, told from the inside, distributed where the buyer lives. "Watch the Co-Inventor series" becomes the sales-enablement opener for every enterprise Nova deal.'
          ].join('\n')
        },
        {
          title: 'The Migration Room',
          one_liner: 'A monetizable single-customer service offering — Nova goes on-site to a F500 customer mid-migration for a one-day teardown of their actual codebase with 15-20 of their internal stakeholders.',
          summary: [
            'USE WHEN EMMA SAYS: "show me how this drives revenue, not brand."',
            '',
            'A single-customer closed-door working session. Nova ships an architect team on-site to a Fortune 500 customer mid-migration. One day. 15-20 of the customer\'s internal stakeholders in the room (CIO, SAP Program Director, lead Enterprise Architects, the integration partner). Nova runs a live teardown of the customer\'s actual ABAP codebase using the platform, generates a custom Migration Map artifact for that specific customer, and walks out with both a deeper deal and a sales tool for the next prospect.',
            '',
            'WHY THIS IS THE RIGHT FALLBACK',
            '— Directly monetizable. Each Migration Room is a packaged $75-150K engagement. Pays for itself the day it ships.',
            '— Repeatable Nova service offering, not a one-time event. Becomes a productized sales motion the GTM team can sell into every active enterprise opportunity.',
            '— Each engagement produces a Migration Map — an anonymizable sales asset that arms every subsequent prospect conversation.',
            '— Builds reference customers fast. Every Migration Room is a co-authored case study, which is the artifact every other SAP-shop CIO will ask for in their evaluation.',
            '',
            'WHAT NOVA OWNS BY YEAR TWO',
            'A repeatable, monetizable, customer-validated motion that produces both revenue and reference assets in the same engagement. The most pipeline-tail-shaped of the four sketches — the version Marcus persona buys directly.'
          ].join('\n')
        }
      ];

      for (var qi = 0; qi < NOVA_QUICK_IDEAS.length; qi++) {
        var idea = NOVA_QUICK_IDEAS[qi];
        await sql(
          'INSERT INTO quick_ideas (account_id, title, one_liner, summary, status) VALUES ($1,$2,$3,$4,$5)',
          [novaAccountId, idea.title, idea.one_liner, idea.summary, 'sketch']
        );
      }
    }
  }

  console.log('[pitchbox] Schema ready, seed verified');
}

ensureSchema().catch(function(e) { console.error('[pitchbox] Schema error:', e.message); });

// ---- Static ----
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---- API ----
function requireDb(res) {
  if (!sql) {
    res.status(503).json({ ok: false, error: 'Database not configured. Set DATABASE_URL.' });
    return false;
  }
  return true;
}

// GET all data
app.get('/api/state', function(req, res) {
  if (!requireDb(res)) return;
  Promise.all([
    sql('SELECT * FROM personas ORDER BY id'),
    sql('SELECT * FROM channels ORDER BY CASE priority WHEN \'HIGH\' THEN 1 WHEN \'MED\' THEN 2 ELSE 3 END, id'),
    sql('SELECT * FROM accounts ORDER BY id'),
    sql('SELECT * FROM playbooks ORDER BY id'),
    sql('SELECT * FROM notes ORDER BY created_at DESC LIMIT 50'),
    sql('SELECT * FROM pitches ORDER BY created_at DESC'),
    sql('SELECT * FROM quick_ideas ORDER BY created_at DESC')
  ]).then(function(r) {
    res.json({ ok: true, personas: r[0], channels: r[1], accounts: r[2], playbooks: r[3], notes: r[4], pitches: r[5], quick_ideas: r[6] });
  }).catch(function(e) {
    console.error('[state]', e.message);
    res.status(500).json({ ok: false, error: e.message });
  });
});

// Generic update handler
function updateRow(table, allowed, req, res) {
  if (!requireDb(res)) return;
  var id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ ok: false, error: 'Bad id' });
  var fields = [];
  var values = [];
  var idx = 1;
  for (var key in req.body) {
    if (allowed.indexOf(key) !== -1) {
      fields.push(key + ' = $' + idx);
      values.push(req.body[key]);
      idx++;
    }
  }
  if (!fields.length) return res.status(400).json({ ok: false, error: 'No valid fields' });
  fields.push('updated_at = NOW()');
  values.push(id);
  var q = 'UPDATE ' + table + ' SET ' + fields.join(', ') + ' WHERE id = $' + idx + ' RETURNING *';
  sql(q, values).then(function(r) {
    res.json({ ok: true, row: r[0] });
  }).catch(function(e) {
    console.error('[update ' + table + ']', e.message);
    res.status(500).json({ ok: false, error: e.message });
  });
}

app.patch('/api/personas/:id', function(req, res) {
  updateRow('personas', ['title', 'company_type', 'pain', 'trigger', 'value_prop'], req, res);
});
app.patch('/api/channels/:id', function(req, res) {
  updateRow('channels', ['name', 'motion', 'priority', 'status', 'next_action'], req, res);
});
app.patch('/api/accounts/:id', function(req, res) {
  updateRow('accounts', ['company', 'category', 'stage', 'notes'], req, res);
});
app.patch('/api/playbooks/:id', function(req, res) {
  updateRow('playbooks', ['title', 'summary', 'steps'], req, res);
});
app.patch('/api/pitches/:id', function(req, res) {
  updateRow('pitches', ['target_company', 'play', 'concept_title', 'one_liner', 'concept', 'contact_name', 'contact_role', 'outbound_draft', 'status', 'next_action', 'pitch_deck_url'], req, res);
});
app.patch('/api/quick-ideas/:id', function(req, res) {
  updateRow('quick_ideas', ['account_id', 'title', 'one_liner', 'summary', 'status'], req, res);
});

// Create account
app.post('/api/accounts', function(req, res) {
  if (!requireDb(res)) return;
  var b = req.body || {};
  sql('INSERT INTO accounts (company, category, stage, notes) VALUES ($1,$2,$3,$4) RETURNING *', [b.company || 'New Account', b.category || '', b.stage || 'prospect', b.notes || '']).then(function(r) {
    res.json({ ok: true, row: r[0] });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

// Delete account
app.delete('/api/accounts/:id', function(req, res) {
  if (!requireDb(res)) return;
  var id = parseInt(req.params.id, 10);
  sql('DELETE FROM accounts WHERE id = $1', [id]).then(function() {
    res.json({ ok: true });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

// Create pitch
app.post('/api/pitches', function(req, res) {
  if (!requireDb(res)) return;
  var b = req.body || {};
  sql(
    'INSERT INTO pitches (target_company, play, concept_title, one_liner, concept, contact_name, contact_role, outbound_draft, status, next_action, pitch_deck_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
    [b.target_company || 'New Target', b.play || 'Signature Activation Pitch', b.concept_title || '', b.one_liner || '', b.concept || '', b.contact_name || '', b.contact_role || '', b.outbound_draft || '', b.status || 'drafting', b.next_action || '', b.pitch_deck_url || '']
  ).then(function(r) {
    res.json({ ok: true, row: r[0] });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

// Delete pitch
app.delete('/api/pitches/:id', function(req, res) {
  if (!requireDb(res)) return;
  var id = parseInt(req.params.id, 10);
  sql('DELETE FROM pitches WHERE id = $1', [id]).then(function() {
    res.json({ ok: true });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

// Create quick idea
app.post('/api/quick-ideas', function(req, res) {
  if (!requireDb(res)) return;
  var b = req.body || {};
  var accountId = b.account_id ? parseInt(b.account_id, 10) : null;
  sql(
    'INSERT INTO quick_ideas (account_id, title, one_liner, summary, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [accountId, b.title || 'New Idea', b.one_liner || '', b.summary || '', b.status || 'sketch']
  ).then(function(r) {
    res.json({ ok: true, row: r[0] });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

// Delete quick idea
app.delete('/api/quick-ideas/:id', function(req, res) {
  if (!requireDb(res)) return;
  var id = parseInt(req.params.id, 10);
  sql('DELETE FROM quick_ideas WHERE id = $1', [id]).then(function() {
    res.json({ ok: true });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

// Notes — append-only strategy notes
app.post('/api/notes', function(req, res) {
  if (!requireDb(res)) return;
  var b = req.body || {};
  if (!b.body || !b.body.trim()) return res.status(400).json({ ok: false, error: 'Note body required' });
  sql('INSERT INTO notes (body, author) VALUES ($1,$2) RETURNING *', [b.body.trim(), (b.author || 'Brian').trim()]).then(function(r) {
    res.json({ ok: true, row: r[0] });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

app.delete('/api/notes/:id', function(req, res) {
  if (!requireDb(res)) return;
  var id = parseInt(req.params.id, 10);
  sql('DELETE FROM notes WHERE id = $1', [id]).then(function() {
    res.json({ ok: true });
  }).catch(function(e) { res.status(500).json({ ok: false, error: e.message }); });
});

app.listen(PORT, '0.0.0.0', function() {
  console.log('[pitchbox] listening on 0.0.0.0:' + PORT);
});
