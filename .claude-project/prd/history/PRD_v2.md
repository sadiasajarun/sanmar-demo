# Sanmar Lead Intelligence & Sales CRM — Product Requirements Document

**Version:** 1.1
**Date:** 2026-09-08
**Status:** Draft — for client demo
**Client:** Sanmar Properties Ltd (mysanmar.com)
**Prepared by:** Riseup Labs
**Covers:** Client requirement items **#4 (AI-Based Lead Qualification Engine)** and **#5 (Sales & Marketing CRM/ERP Interface Solution)**

---

## 0. Project Overview

### Product

**Name:** Sanmar Lead Intelligence & Sales CRM
**Type:** Web application (internal sales platform, two role portals)
**Deliverable in this phase:** Clickable HTML demo prototype — 11 screens across 2 portals
**Status:** Draft

### Description

Sanmar Properties runs high-volume marketing campaigns that generate far more phone enquiries than the sales floor can meaningfully work. Most of that volume is noise. This platform sits between the campaign and the salesperson: it ingests the AI analysis of every sales call from a third-party call-intelligence provider, scores each lead on conversation signals plus business fit, separates garbage from sales-ready, routes only qualified leads to agents, and then gives the floor one place to run the pipeline, see every past touch, and automate follow-up.

It is deliberately **not** a website-lead product. Sanmar's leads arrive as **calls**, and the conversation itself is the richest qualification signal available — this system's core idea is to turn that conversation into a number a sales manager can act on and argue with.

### The Problem, in the Client's Words

> "They do not get website leads. They get many leads from marketing campaigns... their leads basically come from calls. From the call, we will get the data like engagement, what has been talked, how much he is interested. That product will give us the summary of conversation. From there the system will get the lead scoring parameters, and from there the system will mark the garbage leads and qualified leads for the next step."

### Goals

1. **Cut wasted sales time.** Prevent low-intent and junk leads from ever reaching an agent's queue, while keeping every rejection reversible and explained.
2. **Make qualification explainable.** Every score is broken down by factor with plain-language reasons, and the manager owns the weights — not the vendor.
3. **Give agents call-ready context.** An agent picks up the phone already knowing what was said last time, what the buyer wants, and what to say next.
4. **Close the marketing loop.** Show which campaigns produce buyers and which produce noise, measured as cost per *qualified* lead, not cost per lead.
5. **Automate the follow-through.** Email sequences and agent tasks fire on lead state, not on someone remembering.

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | Sanmar's tele-sales and field sales agents — high call volume, need prioritisation and instant recall of prior conversations |
| **Secondary** | Sales Manager / Sales Admin — owns pipeline health, lead routing, the scoring model, and campaign accountability |
| **Tertiary** | Marketing (read-only consumer of campaign quality metrics in v1; a dedicated portal is deferred) |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Sales Agent** | `0` | Tele-sales or field sales rep who owns qualified leads | Work assigned queue, log calls and notes, send follow-ups, book site visits, advance pipeline stage |
| **Sales Manager** | `10` | Owns the floor and the funnel | Oversee all leads, review garbage queue, tune scoring rules, configure automation and routing, review campaign performance |
| **Admin** | `99` | Platform administrator | Everything a Manager can do, plus user management and integration configuration |

> In v1 **Manager** and **Admin** share a single portal (`manager`). Admin-only controls are shown but access-gated. A separate Marketing portal is deferred to v2.

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access, eligible for lead routing |
| **On Leave** | `1` | Retains access; excluded from round-robin lead assignment |
| **Suspended** | `2` | Cannot log in — shows "Your account has been suspended. Contact your sales administrator." |
| **Withdrawn** | `3` | Access revoked; owned leads reassigned; record retained 90 days for audit then anonymised |

### MVP Scope

**Included (this PRD):**
- Call-intelligence webhook ingestion and call record storage
- Hybrid lead scoring engine (AI conversation signals + rule-based business fit) with manager-tunable weights
- Qualification verdicts, score bands, and hard disqualifiers
- Garbage Review Queue with one-click restore and correction logging
- Lead pipeline with 8 stages, filtering, and bulk assignment
- Lead routing rules (round-robin, project affinity, capacity)
- Unified communication timeline (calls, emails, notes, stage changes, score changes)
- Email follow-up automation (trigger → condition → action) with templates and sequences
- Campaign performance reporting including cost per qualified lead
- Sales Agent portal: prioritised queue, lead detail, call log, tasks

**Excluded (deferred):**
- Requirement #1/#2 — website click-to-call popup and voice routing to tele-sales / AI agent *(separate existing demo)*
- Requirement #3 — omnichannel LLM chatbot and smart IVR across Website / Messenger / WhatsApp / LinkedIn *(separate existing demo)*
- WhatsApp, Messenger and LinkedIn message threads inside the CRM (v2 — arrives with requirement #3 integration)
- In-house call transcription and speech-to-text — **we consume a third-party provider's analysis; we do not transcribe**
- Bangla UI localisation (sample *data* is Bangladeshi; the *interface* is English in v1)
- Booking, payment schedule, unit inventory management and handover — Sanmar's existing ERP retains these
- Mobile native app

### Integration Boundary with Requirements #1–#3

This platform is the **destination**, not the capture layer. Its relationship to the other three requirement items:

| Upstream item | What it sends here | Shown in this system as |
|---|---|---|
| #1/#2 Click-to-call & voice routing | A call record once the conversation ends | A call in the timeline with source `web-click-to-call` |
| #3 Omnichannel bot & IVR | A qualified-or-not conversation handoff | A lead with source `chatbot` / `ivr` and a handoff marker *(v2)* |
| **Call-intelligence provider** | Transcript + summary + signals per call | The AI summary card and the conversation half of the score |

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **Lead** | A prospective property buyer captured from a marketing campaign, carrying contact details, source campaign, a requirement profile, a current score, a qualification verdict and a pipeline stage |
| **Call** | One telephone conversation with a lead, enriched by the call-intelligence provider with duration, transcript, summary and signals |
| **Call Summary** | The provider-generated narrative of what was discussed, plus the structured signals derived from it. The primary raw material for scoring |
| **Lead Score** | A 0–100 composite of weighted AI conversation signals, business-fit rules and behavioural signals. Recomputed after every call and every profile change; always accompanied by a factor breakdown |
| **Score Delta** | The change a single event (usually a call) produced in a lead's score — shown against the event in the timeline |
| **Scoring Rule** | A manager-editable factor: its input field, its bands or thresholds, and its weight in the composite. The active rule set *is* the scoring model |
| **Qualification Verdict** | `Qualified`, `Nurture` or `Garbage`. Derived from the score band, but overridden to `Garbage` by any hard disqualifier |
| **Hard Disqualifier** | A binary condition (wrong number, outside service area, job seeker…) that sends a lead to the Review Queue regardless of score |
| **Review Queue** | Where garbage leads go. Nothing is deleted; every entry shows its disqualification reason and can be restored in one click |
| **Correction** | A manager restoring or re-binning a lead. Logged against the scoring model as training feedback |
| **Requirement Profile** | What the buyer wants: budget range, purchase timeline, preferred locations, unit type, bedrooms, financing method |
| **Campaign** | The marketing source that produced a lead — channel, name, spend, period. The unit of lead-quality accounting |
| **Pipeline Stage** | Where a qualified lead sits in the sales process |
| **Communication Timeline** | The unified reverse-chronological record of every touch on a lead |
| **Automation Rule** | A trigger → condition → action definition that runs without human initiation |
| **Routing Rule** | How a newly qualified lead is assigned to an agent |
| **Project** | A Sanmar development containing units that a lead's preferences are matched against |

### User Roles

| Role | Description |
|------|-------------|
| **Sales Agent** | Sees only leads assigned to them. Can log activity, send templated emails, schedule site visits, advance stage, and request re-scoring. Cannot change scoring rules or reassign leads |
| **Sales Manager** | Sees all leads and all agents. Owns the Review Queue, scoring rules, automation rules, routing rules and campaign reporting |
| **Admin** | Manager rights plus user management and integration/webhook configuration |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **PipelineStage** | `NEW`, `CONTACTED`, `QUALIFIED`, `SITE_VISIT_SCHEDULED`, `SITE_VISIT_DONE`, `NEGOTIATION`, `BOOKED`, `LOST` | Position in the sales process. Garbage leads sit outside the pipeline entirely |
| **QualificationVerdict** | `QUALIFIED`, `NURTURE`, `GARBAGE`, `UNSCORED` | Output of the qualification engine |
| **ScoreBand** | `HOT` (75–100), `WARM` (55–74), `NURTURE` (35–54), `COLD` (0–34) | Human-readable banding of the composite score |
| **EngagementLevel** | `HIGH`, `MEDIUM`, `LOW` | Provider signal describing how involved the caller was |
| **Sentiment** | `POSITIVE`, `NEUTRAL`, `NEGATIVE` | Provider tone assessment |
| **CallDirection** | `INBOUND`, `OUTBOUND` | Who initiated |
| **CallOutcome** | `CONNECTED`, `NO_ANSWER`, `BUSY`, `WRONG_NUMBER`, `CALLBACK_REQUESTED` | How the attempt resolved |
| **TimelineEventType** | `CALL`, `EMAIL_SENT`, `EMAIL_OPENED`, `EMAIL_CLICKED`, `NOTE`, `STAGE_CHANGE`, `SCORE_CHANGE`, `ASSIGNMENT`, `AUTOMATION`, `CORRECTION` | What a timeline row represents |
| **DisqualificationReason** | `WRONG_NUMBER`, `OUT_OF_SERVICE_AREA`, `BUDGET_BELOW_MINIMUM`, `NO_PURCHASE_INTENT`, `JOB_SEEKER`, `VENDOR_OR_COMPETITOR`, `DUPLICATE`, `SPAM_OR_TEST` | Why a lead was binned |
| **TaskStatus** | `OPEN`, `DUE_TODAY`, `OVERDUE`, `DONE`, `CANCELLED` | Follow-up task state |

### Technical Terms

| Term | Definition |
|------|------------|
| **Call-intelligence provider** | The third-party product that records, transcribes and analyses Sanmar's sales calls. It pushes results to us over a signed webhook. We never transcribe audio ourselves |
| **Webhook idempotency key** | The provider's `external_id` for a call. Re-delivery of the same id must not create a duplicate call or re-apply a score delta |
| **Score simulator** | A live preview on the Scoring Rules page that re-scores a sample of real leads against unsaved weight changes, so a manager can see the qualified/garbage split move before committing |
| **Cost per qualified lead (CPQL)** | Campaign spend ÷ number of leads from that campaign that reached `QUALIFIED`. The headline campaign metric — distinct from cost per lead |
| **Round-robin with capacity** | Assignment cycles through active agents but skips any agent already at their configured open-lead ceiling |

---

## 2. System Modules

### Module 1 — Call Intelligence Ingestion

Receives analysed calls from the third-party provider and attaches them to leads. This module is the system's only inbound dependency and is deliberately thin: validate, deduplicate, attach, emit.

#### Main Features

1. **Signed webhook endpoint** — accepts `call.analyzed` events, verifies an HMAC-SHA256 signature, rejects unsigned or replayed payloads
2. **Idempotent call creation** — duplicate `external_id` returns 200 without side effects
3. **Lead matching** — matches the caller's number to an existing lead; creates a new lead if none exists, tagged with the campaign that owns the dialled number
4. **Entity extraction mapping** — maps provider-extracted entities (budget, timeline, locations, unit type, financing) onto the lead's requirement profile, never silently overwriting a value a human has confirmed
5. **Provider attribution** — every call record shows which provider produced its analysis and when
6. **Re-score trigger** — a successfully ingested call emits an event that re-runs scoring for its lead
7. **Failure visibility** — malformed or unmatched payloads land in a dead-letter view for an admin, they are never dropped silently

#### Webhook Contract

`POST /api/v1/webhooks/call-intelligence`
Headers: `X-Provider-Signature: sha256=<hmac>`, `X-Provider-Id: <provider slug>`

```json
{
  "event": "call.analyzed",
  "delivered_at": "2026-09-08T11:42:07Z",
  "call": {
    "external_id": "ci_9f2a11c4",
    "direction": "INBOUND",
    "started_at": "2026-09-08T11:31:55Z",
    "duration_sec": 412,
    "caller_msisdn": "+8801711xxxxxx",
    "dialled_msisdn": "+8809612xxxxxx",
    "agent_extension": "204",
    "outcome": "CONNECTED",
    "recording_url": "https://provider.example/rec/9f2a11c4"
  },
  "analysis": {
    "language": "bn-BD",
    "summary": "Caller enquired about 3-bed apartments in Khulshi...",
    "transcript_url": "https://provider.example/tx/9f2a11c4",
    "intent_score": 82,
    "engagement_level": "HIGH",
    "sentiment": "POSITIVE",
    "talk_ratio_caller": 0.46,
    "questions_asked": 7,
    "objections": ["price", "handover_timeline"],
    "entities": {
      "budget_bdt_min": 8500000,
      "budget_bdt_max": 11000000,
      "purchase_timeline": "3_TO_6_MONTHS",
      "preferred_locations": ["Khulshi", "Nasirabad"],
      "unit_type": "APARTMENT",
      "bedrooms": 3,
      "min_size_sqft": 1600,
      "financing": "BANK_LOAN"
    }
  }
}
```

#### Technical Flow

1. Provider POSTs `call.analyzed` to the webhook endpoint
2. System verifies the HMAC signature against the provider's shared secret
   - On failure: respond `401`, log to the integration audit trail, do not process
3. System checks `call.external_id` against existing call records
   - Already present: respond `200 {"status":"duplicate_ignored"}` and stop
4. System matches `caller_msisdn` to a lead
   - Match found: attach the call to that lead
   - No match: create a new lead in `NEW` stage, attribute the campaign from `dialled_msisdn`, attach the call
5. System writes the call record with the full analysis payload and the provider attribution
6. System merges extracted entities into the lead's requirement profile — fields a human has confirmed are preserved and the conflict is surfaced on the lead detail page
7. System emits `lead.rescore_requested`
8. On success: call appears in the timeline within seconds, with its score delta filled in once scoring completes
9. On failure at step 4–7: the payload is stored in the dead-letter view with the error; the provider still receives `200` so it does not retry indefinitely

---

### Module 2 — Lead Scoring & Qualification Engine

The core of requirement #4. Converts conversation signals and profile fit into a defensible 0–100 score and a verdict.

#### Scoring Model

The composite score is the weighted sum of three factor groups. **Default weights sum to exactly 100** and every one is manager-editable.

**Group A — AI Conversation Signals (default 45)** *(sourced from the call-intelligence provider)*

| Factor | Default weight | Input | Scoring |
|---|:--:|---|---|
| Purchase intent | 20 | `analysis.intent_score` (0–100) | Linear |
| Engagement level | 12 | `engagement_level` + talk ratio + questions asked | HIGH = 100, MEDIUM = 60, LOW = 20; ±10 adjustment from talk ratio |
| Objection severity *(inverse)* | 7 | `analysis.objections[]` | 100 minus 25 per hard objection (price, location, handover), floored at 0 |
| Sentiment | 6 | `analysis.sentiment` | POSITIVE = 100, NEUTRAL = 55, NEGATIVE = 10 |

**Group B — Business Fit (default 45)** *(rule-based on the requirement profile)*

| Factor | Default weight | Input | Scoring |
|---|:--:|---|---|
| Budget band | 18 | `budget_bdt_max` vs live inventory price bands | Full marks when the range overlaps available inventory; scaled down by distance below the entry price; 0 below the hard minimum |
| Purchase timeline | 12 | `purchase_timeline` | ≤3 months = 100, 3–6 = 80, 6–12 = 50, >12 = 25, undecided = 15 |
| Location match | 8 | `preferred_locations[]` vs active project locations | Exact project-area match = 100, same city = 60, Dhaka-only interest = 30, elsewhere = 0 |
| Unit type & size availability | 7 | `unit_type`, `bedrooms`, `min_size_sqft` | Full marks when matching stock exists now; reduced when only upcoming stock matches |

**Group C — Behavioural Signals (default 10)**

| Factor | Default weight | Input | Scoring |
|---|:--:|---|---|
| Responsiveness | 6 | Connected calls ÷ attempts, callback requests honoured | Linear |
| Repeat engagement | 4 | Number of connected conversations, site-visit request | 1 call = 40, 2 = 70, 3+ = 100; +20 if a site visit was requested, capped at 100 |

**Composite** = Σ (factor_score ÷ 100 × factor_weight), rounded to a whole number.

#### Score Bands and Verdicts

| Band | Range | Verdict | System action |
|---|:--:|---|---|
| **Hot** | 75–100 | `QUALIFIED` | Route to an agent immediately, flagged priority; SLA — first contact within 2 hours |
| **Warm** | 55–74 | `QUALIFIED` | Route to an agent in normal round-robin; SLA — first contact within 24 hours |
| **Nurture** | 35–54 | `NURTURE` | No agent assignment. Enters the automated nurture email sequence; re-evaluated on any new call |
| **Cold** | 0–34 | `GARBAGE` | Sent to the Review Queue with the reason `NO_PURCHASE_INTENT` |

#### Hard Disqualifiers

Any of these forces `GARBAGE` regardless of the computed score. The score is still recorded and displayed, so a manager can see exactly what was overridden.

| Reason | Detected from |
|---|---|
| `WRONG_NUMBER` | Call outcome, or provider summary indicating the person did not make the enquiry |
| `OUT_OF_SERVICE_AREA` | Preferred location outside Chittagong and Dhaka |
| `BUDGET_BELOW_MINIMUM` | `budget_bdt_max` below the configured inventory floor |
| `JOB_SEEKER` | Provider intent classification |
| `VENDOR_OR_COMPETITOR` | Provider intent classification, or number on the suppression list |
| `DUPLICATE` | Same MSISDN as an existing open lead |
| `SPAM_OR_TEST` | Sub-15-second call with no speech, or number on the block list |

#### Main Features

1. **Deterministic recompute** — the same inputs and the same rule version always produce the same score; every score stores the rule-set version that produced it
2. **Factor breakdown** — every score exposes per-factor contribution, so the total is always reconstructable
3. **Plain-language reasons** — the engine emits at least four human-readable statements per lead ("Budget of ৳85–110 lakh matches Ocean City 3-bed inventory", "Wants to buy within 3–6 months", "Asked 7 questions and stayed on the call for 6m 52s", "Raised a price objection")
4. **Manager-tunable weights** — the Scoring Rules page edits weights, bands and thresholds without a deployment
5. **Live score simulator** — unsaved weight changes are previewed against a sample of real leads showing the resulting qualified/nurture/garbage split
6. **Correction feedback** — every manager restore or manual re-bin is stored against the rule version as training signal for future model tuning
7. **Score history** — each lead keeps its score over time, and each timeline event carries its score delta

#### Technical Flow

##### Score a lead

1. Trigger fires (`lead.rescore_requested`, profile edit, or manual "Re-score" from lead detail)
2. Engine loads the active rule set and the lead's full state — profile, all calls, all behavioural counters
3. Engine evaluates hard disqualifiers first
   - Any match: verdict = `GARBAGE`, reason recorded, lead moved to the Review Queue, composite still computed and stored for transparency
4. Engine computes each factor score, multiplies by its weight, sums to the composite
5. Engine maps the composite to a band and derives the verdict
6. Engine generates the reason statements from the highest- and lowest-contributing factors
7. On verdict change:
   - To `QUALIFIED`: emit `lead.qualified` → routing engine assigns an agent
   - To `GARBAGE`: emit `lead.disqualified` → lead leaves any agent's queue and enters the Review Queue
   - To `NURTURE`: emit `lead.nurture` → automation enrols the lead in the nurture sequence
8. Engine writes a `SCORE_CHANGE` timeline event with the old score, new score and delta
9. On failure: the previous score is retained, the lead is flagged `scoring_stale`, and an alert appears on the manager dashboard — a lead is never silently left unscored

---

### Module 3 — Lead Pipeline & Routing

#### Main Features

1. **Eight-stage pipeline** with drag-free stage advancement from lead detail and inline from the list
2. **Master lead list** with filters on score band, verdict, stage, campaign, assigned agent, preferred project, date range, and free-text search on name/phone
3. **Saved views** — a manager can save a filter combination ("Hot & unassigned", "No contact in 3 days")
4. **Bulk assignment** — select multiple leads and assign to an agent or trigger re-routing
5. **Routing rules** — round-robin with capacity ceiling, project affinity (agent specialises in a development), or territory
6. **SLA tracking** — first-contact clock per band, with breach highlighting on both portals
7. **Reassignment with reason** — moving a lead between agents requires a reason and writes an `ASSIGNMENT` timeline event
8. **Stage-change guards** — advancing to `SITE_VISIT_SCHEDULED` requires a date; `BOOKED` and `LOST` require a reason

#### Technical Flow

##### Route a newly qualified lead

1. `lead.qualified` event received with band and preferred project
2. Routing engine loads active routing rules in priority order
3. Project affinity: if a rule matches the lead's preferred project and an eligible agent is under capacity → assign
4. Otherwise round-robin: next active agent under their open-lead ceiling, skipping agents on leave
5. If every agent is at capacity → lead is placed in the unassigned pool and the manager dashboard raises a capacity warning
6. On assignment: write `ASSIGNMENT` timeline event, notify the agent in-app, create a first-contact task with a due time derived from the band SLA
7. On failure: the lead stays unassigned and appears in the "Needs routing" dashboard tile — it is never lost

---

### Module 4 — Garbage Review Queue

Requirement #4's safety valve. The client's fear is real leads being thrown away; this module exists to make that fear checkable.

#### Main Features

1. **Nothing is deleted** — disqualified leads are moved, not removed, and remain fully searchable
2. **Reason chips** — every entry shows its `DisqualificationReason` and, where the score drove it, the score with its weakest factors
3. **One-click restore** — returns the lead to the pipeline; the manager picks the target verdict (`QUALIFIED` or `NURTURE`) and the lead routes normally
4. **Correction logging** — restores are recorded against the active rule version and surfaced on the Scoring Rules page as "N corrections against these weights in the last 30 days", which is the signal that the model needs tuning
5. **Bulk actions** — bulk restore and bulk confirm-as-garbage for reviewing a campaign's worth of noise quickly
6. **Filter by reason and campaign** — so a manager can spot a campaign producing a specific kind of junk
7. **Audit trail** — who restored what, when, and why

#### Technical Flow

1. Manager opens the Review Queue, filtered by default to the last 7 days
2. Manager opens an entry, reads the disqualification reason, the score breakdown and the call summary that produced it
3. Manager clicks **Restore** and selects the corrected verdict and an optional note
4. System writes a `CORRECTION` timeline event and a correction record against the active rule version
5. System sets the new verdict, and if `QUALIFIED`, emits `lead.qualified` → routing assigns an agent
6. Lead reappears in the pipeline with a "restored" marker visible to the receiving agent, so they know the history
7. On failure: the lead remains in the queue and the action is reported — a restore never half-applies

---

### Module 5 — Communication Timeline

#### Main Features

1. **One reverse-chronological stream per lead** interleaving calls, emails, notes, stage changes, score changes, assignments, automation runs and corrections
2. **Call entries** show duration, direction, outcome, the provider AI summary, engagement and sentiment badges, the extracted entities, a recording player, a link to the full transcript, and the score delta that call produced
3. **Email entries** show subject, template used, whether it was sent by automation or a person, and open/click state
4. **Filterable** by event type, so an agent can read only the calls
5. **Inline note capture** without leaving the page
6. **Score-delta annotations** on the events that moved the number, which is what makes the scoring feel causal rather than magical
7. **Conflict surfacing** — when a provider-extracted entity disagrees with a human-confirmed value, the timeline shows both and asks for a resolution

---

### Module 6 — Follow-up Automation

#### Main Features

1. **Trigger → Condition → Action rules**
   - Triggers: lead qualified, score band changed, stage changed, no contact for N days, email opened, site visit completed, call outcome = no-answer
   - Conditions: score band, campaign, preferred project, assigned agent, stage, time of day
   - Actions: send email template, enrol in sequence, create agent task, raise priority, notify manager, re-route
2. **Email sequences** — ordered multi-step templates with per-step delays (e.g. nurture: day 0 brochure, day 3 project video, day 10 offer, day 21 check-in)
3. **Template library** with merge fields (lead name, preferred project, budget range, agent name and direct line)
4. **Off-hours handling** — actions scheduled outside 09:00–20:00 Asia/Dhaka are queued to the next working window, matching the client's stated post-8 PM concern
5. **Quiet rules** — a lead never receives more than one automated email per 48 hours, and automation pauses entirely once an agent logs a live conversation
6. **Rule simulation** — "how many leads would this rule have fired on last week"
7. **Run log** — every automated action is visible in the lead timeline and in a global automation run log

#### Technical Flow

1. A domain event fires (`lead.qualified`, `stage.changed`, nightly `no_contact_scan`)
2. Automation engine loads active rules subscribed to that trigger, in priority order
3. For each rule, conditions are evaluated against the lead's current state
4. Quiet rules are checked — recent automated contact, or an active human conversation, suppresses the action
5. Working-hours check — actions outside the window are queued, not dropped
6. Action executes: email queued for delivery, or a task created and assigned
7. An `AUTOMATION` timeline event is written with the rule name and the action taken
8. On delivery failure: the action is retried three times with backoff, then flagged in the run log for a human — silent failure is not permitted

---

### Module 7 — Campaign Performance

#### Main Features

1. **Per-campaign table**: leads generated, qualified count and rate, nurture count, garbage count and rate, site visits, bookings, spend, cost per lead, **cost per qualified lead**, cost per booking
2. **Channel rollup** — Facebook, Google, billboard, property fair, referral, print
3. **Quality trend** — qualified rate per campaign over time, which exposes a campaign whose targeting has degraded
4. **Garbage reason mix per campaign** — a campaign producing mostly `WRONG_NUMBER` is a data problem; one producing mostly `BUDGET_BELOW_MINIMUM` is a targeting problem, and they need different fixes
5. **Drill-through** — any number opens the filtered lead list behind it
6. **Export to CSV** for the marketing agency

---

### Module 8 — Team, Users & Integrations *(Admin)*

#### Main Features

1. **Agent roster** — status, open-lead count vs capacity ceiling, SLA compliance, calls today, conversion rate
2. **Capacity configuration** per agent
3. **Routing rule configuration** with priority ordering
4. **User management** — invite, role assignment, suspend, reassign a departing agent's leads in bulk
5. **Integration configuration** — call-intelligence provider webhook URL, shared secret rotation, dead-letter inspection and replay
6. **Working hours and holiday calendar** — feeds automation scheduling and SLA clocks

---

## 3. Sales Agent Portal

### 3.1 Page Architecture

**Prototype stack:** Static HTML5 + CSS3 + minimal vanilla JS (tabs, modals, filter chips). No build step; every page opens directly from `file://`.
**Proposed production stack:** React Router 7 + Redux Toolkit + Tailwind CSS v4 (see §5).

**Access:** authenticated users with role `Sales Agent`. Agents see only leads assigned to them.

#### Page Map

| Route | Page | Prototype file |
|-------|------|----------------|
| `/agent` | My Leads | `design/html/agent/my-leads.page.html` |
| `/agent/leads/:id` | Lead Detail | `design/html/agent/lead-detail.page.html` |
| `/agent/calls` | Call Log | `design/html/agent/call-log.page.html` |
| `/agent/followups` | Follow-ups & Tasks | `design/html/agent/followups.page.html` |

#### Shared Shell

Left sidebar with the Sanmar mark, four nav items, the agent's name, avatar, availability toggle and open-lead count vs capacity. Top bar carries global search (name or phone), an SLA-breach indicator, and notifications.

### 3.2 Feature List by Page

#### `/agent` — My Leads

- Prioritised queue, default sort: score descending, then SLA urgency
- Score pill per row with band colour; stage chip; last-contact age; next task due
- Filter chips: All / Hot / Warm / Needs first contact / Overdue follow-up / Site visit this week
- Row shows: name, phone, budget range, preferred location, source campaign, score, stage, last touch
- SLA breach rows are visually flagged
- Row actions: call, open detail, log activity, snooze
- Summary strip: assigned leads, hot leads, first contacts due today, overdue tasks
- Empty state: "No leads assigned yet — qualified leads route here automatically."

---

#### `/agent/leads/:id` — Lead Detail **(hero screen)**

The single most important screen in the demo. It has to answer, without explanation, *why does this system know more than the salesperson did yesterday.*

- **Header:** name, phone, email, source campaign badge, current stage, assigned agent, restored-lead marker if applicable
- **Score panel:**
  - Large composite score 0–100 with band label and trend arrow vs previous score
  - Stacked horizontal bar showing each factor's contribution, grouped AI / Business fit / Behavioural
  - Per-factor rows: factor name, raw signal, weight, points contributed
  - **"Why this score"** — at least four plain-language reason statements, best contributors and worst
  - Rule-set version stamp and "Re-score" action
- **Requirement profile:** budget range, purchase timeline, preferred locations, unit type, bedrooms, minimum size, financing method — each tagged as AI-extracted or human-confirmed, with a confirm control and conflict indicator
- **Recommended units:** matching Sanmar inventory with project, unit, size, price and availability
- **Call summaries:** at least two call cards, each with direction, date, duration, outcome, provider badge, the AI summary paragraph, engagement / sentiment / intent badges, objections raised, extracted entities, recording player, transcript link, and **the score delta that call produced**
- **Communication timeline:** unified stream with type filter, inline note box
- **Action rail:** Call, Send Email (template picker), Schedule Site Visit, Add Note, Change Stage, Create Task, Mark as Garbage (with reason)
- **Next best action** suggestion derived from stage, score and last touch

---

#### `/agent/calls` — Call Log

- Chronological list of the agent's recent calls with AI summaries
- Columns: time, lead name, direction, duration, outcome, engagement, sentiment, score delta, provider
- Filter by outcome, engagement level, date, and "produced a positive score delta"
- Expandable rows revealing the full AI summary and extracted entities
- "Awaiting analysis" state for calls whose provider result has not yet arrived
- Bulk action: create follow-up tasks from selected calls
- Empty state: "No calls logged today."

---

#### `/agent/followups` — Follow-ups & Tasks

- Three columns or grouped sections: Overdue, Due today, Upcoming
- Task rows: lead name, task type (call back / send email / site visit / document), due time, score pill, one-click complete
- Scheduled automated emails visible as read-only entries so the agent knows what the system is about to send in their name
- Site visit calendar strip for the coming week
- Filter: task type, lead score band
- Empty state: "Nothing due — your queue is clear."

---

## 4. Sales Manager / Admin Console

### 4.1 Page Architecture

**Access:** roles `Sales Manager` and `Admin`. Admin-only controls (user management, integration secrets) are visible but gated for Managers.

| Route | Page | Prototype file |
|-------|------|----------------|
| `/manager` | Pipeline Dashboard | `design/html/manager/dashboard.page.html` |
| `/manager/leads` | All Leads | `design/html/manager/leads.page.html` |
| `/manager/review-queue` | Garbage Review Queue | `design/html/manager/review-queue.page.html` |
| `/manager/scoring-rules` | Scoring Rules | `design/html/manager/scoring-rules.page.html` |
| `/manager/automation` | Follow-up Automation | `design/html/manager/automation.page.html` |
| `/manager/campaigns` | Campaign Performance | `design/html/manager/campaigns.page.html` |
| `/manager/team` | Team & Routing | `design/html/manager/team.page.html` |

#### Shared Shell

Sidebar with the Sanmar mark and seven nav items grouped Pipeline / Intelligence / Configuration. Top bar carries a date-range selector, global search and the manager's profile menu. The shell is visually distinct from the agent portal so the two roles are never confused in a demo.

### 4.2 Feature List by Page

#### `/manager` — Pipeline Dashboard

- KPI tiles: leads this period, qualified rate, garbage rate, average score, first-contact SLA compliance, site visits booked, bookings, cost per qualified lead
- **Qualification funnel:** Total leads → Scored → Qualified → Contacted → Site visit → Booked, with drop-off percentages
- **Score distribution** histogram across the four bands
- **Garbage reason mix** breakdown
- Campaign quality snapshot — top and bottom campaigns by qualified rate
- Team leaderboard — leads worked, contact SLA, conversions
- **Attention tiles:** leads needing routing, SLA breaches, stale scores, dead-letter webhook payloads
- Recent activity feed
- Date range selector applying across the page

---

#### `/manager/leads` — All Leads

- Master table across all agents and all verdicts
- Filters: score band, verdict, stage, campaign, channel, assigned agent, preferred project, date range, SLA status
- Free-text search on name and phone
- Saved views with a default set ("Hot & unassigned", "No contact 3+ days", "Restored leads")
- Columns: name, phone, score with band pill, verdict, stage, campaign, agent, budget, preferred location, last touch, SLA state
- Row selection with bulk assign, bulk re-route, bulk re-score, bulk export
- Column sorting; sticky header; pagination with a total count
- Row click opens lead detail (manager view of the same hero screen)
- Empty state and loading skeleton

---

#### `/manager/review-queue` — Garbage Review Queue

- Queue of disqualified leads, default filter last 7 days
- Each row: name, phone, campaign, score, **disqualification reason chip**, the call summary excerpt that drove it, disqualified-at timestamp
- Filters by reason, campaign, score range, date
- **Restore** action per row, opening a small dialog to choose the corrected verdict and add a note
- Bulk restore and bulk confirm-as-garbage
- Header strip: total in queue, restored this month, **restore rate** — the honest measure of how often the engine is wrong
- Side panel on row click: full score breakdown and call summary, so the decision is made with evidence
- Empty state: "No leads awaiting review."

---

#### `/manager/scoring-rules` — Scoring Rules

- Three factor groups (AI Conversation Signals, Business Fit, Behavioural) each listing its factors
- Per factor: name, description of the input, current weight slider or numeric input, and its banding/threshold configuration
- **Weight total indicator** that visibly sums to 100 and blocks saving when it does not
- Band threshold editor for Hot / Warm / Nurture / Cold cut-offs
- Hard disqualifier list with per-reason enable toggles and configurable values (inventory price floor, service-area list, suppression list)
- **Live score simulator:** a sample of real leads re-scored against unsaved changes, showing the before/after qualified / nurture / garbage split and which specific leads would flip
- Rule-set version history with "revert to version N"
- **Correction signal callout:** "N leads restored from the Review Queue against these weights in the last 30 days" linking to those leads
- Save / discard actions with a confirmation that states how many live leads will be re-scored

---

#### `/manager/automation` — Follow-up Automation

- Rule list: name, trigger, condition summary, action, enabled toggle, runs in the last 30 days, last run
- Rule builder panel: trigger picker → condition rows → action picker, in plain language ("When a lead becomes Qualified and score band is Hot and no contact within 2 hours → notify the manager and raise priority")
- **Email sequence builder:** ordered steps with per-step delay, template and exit conditions
- Template library with subject, preview, merge-field list and last-edited stamp
- Global settings: working hours (09:00–20:00 Asia/Dhaka), off-hours queueing, maximum automated emails per lead per 48 hours, automation pause on live human contact
- Run log with rule, lead, action, result and timestamp; failures visibly flagged
- Rule simulation: "this rule would have fired on N leads last week"

---

#### `/manager/campaigns` — Campaign Performance

- Table per campaign: channel, period, spend, leads, qualified count and rate, nurture, garbage count and rate, site visits, bookings, cost per lead, **cost per qualified lead**, cost per booking
- Channel rollup summary tiles
- Qualified-rate trend chart across campaigns over the selected range
- Garbage reason mix per campaign, so a targeting problem is distinguishable from a data-quality problem
- Sort by any metric; highlight the best and worst CPQL
- Drill-through from any number into the filtered lead list
- Export to CSV
- Date range selector

---

#### `/manager/team` — Team & Routing

- Agent roster: name, role, status, open leads vs capacity ceiling with a utilisation bar, calls today, first-contact SLA compliance, conversions this month
- Capacity editor per agent
- Availability toggle (Active / On Leave) with the routing consequence stated
- **Routing rules** section: ordered rule list (project affinity, territory, round-robin fallback) with drag-free priority controls and an enabled toggle
- Bulk lead reassignment tool for an agent going on leave or leaving
- Admin-only block: invite user, change role, suspend, and the call-intelligence integration panel (webhook URL, secret last rotated, recent deliveries, dead-letter count with a replay action)

---

## 5. Tech Stack

### Architecture

The deliverable for this phase is a static HTML prototype. The production stack below is what Riseup Labs proposes to build it on and is what `/fullstack-dev` would scaffold.

```
mysanmar-demo/
└── .claude-project/design/html/    ← THIS PHASE: static clickable prototype
    ├── manager/                    ← 7 pages
    └── agent/                      ← 4 pages

sanmar-crm/                         ← proposed production build
├── backend/                        ← NestJS API
└── frontend/                       ← React Router 7 app
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Prototype** | HTML5 + CSS3 | — | Static clickable screens, no build step |
| **Prototype JS** | Vanilla JS | — | Tabs, modals, filter chips only |
| Backend | NestJS | 10.x | API server |
| Language | TypeScript | 5.x | — |
| ORM | TypeORM | 0.3.x | Database access |
| Database | PostgreSQL | 16 | Primary data store |
| Queue | BullMQ + Redis | 7 | Webhook processing, scoring jobs, automation scheduling |
| Frontend | React Router 7 | 7.x | UI, framework mode |
| State | Redux Toolkit | 2.x | Global state, async thunks for reads |
| CSS | Tailwind CSS | 4.x | Styling |
| Charts | Recharts | 2.x | Funnel, distribution, trend charts |
| Build | Vite | 5.x | Bundler |

### Third-Party Integrations

| Service | Purpose | Direction |
|---------|---------|-----------|
| **Call-intelligence provider** *(TBD — client to name)* | Call recording, transcription, summary, engagement and intent signals | **Inbound** webhook to us |
| Transactional email (SES / SendGrid / Postmark) | Follow-up sequences, one-off agent emails, open and click tracking | Outbound |
| Sanmar ERP *(TBD)* | Unit inventory, price bands, availability for business-fit scoring | Read |
| Requirement #1/#2 voice platform | Call records from website click-to-call | Inbound |
| Requirement #3 chatbot platform | Conversation handoffs from Messenger / WhatsApp / website *(v2)* | Inbound |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Consume a third-party call-analysis product rather than transcribe in-house | The client already has this capability. Building STT and Bangla conversation analysis is a separate, much larger project — we should not silently absorb it into this scope |
| Hybrid scoring — AI signals plus manager-owned rule weights | A pure LLM score is unarguable and therefore untrusted by a sales floor. Explicit weights let the manager defend, tune and take ownership of the model |
| Garbage goes to a review queue, never to deletion | The client's real risk is discarding a genuine buyer. A reversible, reasoned queue makes that risk auditable, and restores become the training signal |
| Calls and email only in v1 | WhatsApp and Messenger belong with requirement #3's omnichannel bot. Duplicating them here would create two sources of truth |
| Two portals, not one role-switched view | Managers and agents have genuinely different jobs. A shared view optimised for both serves neither, and a demo with two shells reads far more clearly |
| Off-hours queueing rather than off-hours sending | Matches the client's stated post-8 PM concern and avoids emailing buyers at 2 AM |
| Weights must sum to 100 | A weighted score whose weights do not sum to a known total cannot be explained in a sales meeting |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection for queues and scheduling |
| `JWT_SECRET` | Auth token signing secret — no fallback permitted |
| `CALL_INTELLIGENCE_WEBHOOK_SECRET` | HMAC shared secret for verifying provider payloads |
| `CALL_INTELLIGENCE_PROVIDER_ID` | Provider slug shown as the attribution badge |
| `MAIL_PROVIDER_API_KEY` | Transactional email service key |
| `MAIL_FROM_ADDRESS` | Sender identity for automated follow-ups |
| `SANMAR_ERP_BASE_URL` | Inventory and price-band source for business-fit scoring |
| `SANMAR_ERP_API_KEY` | ERP access credential |
| `BUSINESS_TIMEZONE` | `Asia/Dhaka` — drives working hours, SLA clocks and automation scheduling |
| `WORKING_HOURS_START` / `WORKING_HOURS_END` | Default `09:00` / `20:00` |
| `INVENTORY_PRICE_FLOOR_BDT` | Hard disqualifier threshold for `BUDGET_BELOW_MINIMUM` |
| `FRONTEND_URL` | Frontend base URL for CORS and email links |

---

## 6. Sample Data Conventions (prototype)

The prototype must feel like Sanmar's own floor, not a generic CRM screenshot.

| Element | Convention |
|---|---|
| Contact names | Bangladeshi — e.g. Nusrat Jahan, Md. Rafiqul Islam, Tanvir Ahmed, Shahnaz Parvin, Abdul Karim Chowdhury |
| Phone numbers | `+8801XXXXXXXXX` with the subscriber digits masked in screenshots |
| Locations | Nasirabad, CDA Avenue, Khulshi, Agrabad, GEC Circle, Panchlaish, Halishahar (Chittagong); Bashundhara, Dhanmondi (Dhaka) |
| Currency | BDT written in lakh and crore — "৳85 lakh", "৳1.35 crore" |
| Unit sizes | 1,400–3,500 sqft per Orchard Garden's published range; 2–4 bedrooms; 160 sqft garage |
| Unit prices | **Illustrative.** Sanmar publishes "call for price", so figures are modelled on prevailing Khulshi and Nasirabad per-sqft levels (roughly ৳8,000–9,000/sqft premium Khulshi). Every screen that shows a unit price carries a visible "prices illustrative" marker. **Must be replaced with Sanmar's real price bands before the client meeting** |
| Project names | Sanmar's **real portfolio**, sourced from the company's own published material: **Sanmar Orchard Garden** (Yakub Future Park, West Khulshi — G+19, 14,000 sqft site, 222 apartments + 16 duplex + 22 penthouse = 260 units, 2/3/4-bed, 1,400–3,500 sqft, 1 garage per unit at 160 sqft), Sanmar Ocean City (East Nasirabad, CDA Avenue — HQ), Sanmar Sardinia, Sanmar Hyde Park, Sanmar Avenue Tower, Sanmar Sky Tower, Sanmar Residence &amp; Sky Club |
| Campaigns | "FB — Orchard Garden 3BR Sep", "Google Search — Apartment Chattogram", "Orchard Garden Launch Event", "Billboard — GEC Circle", "Referral — Existing Owners" |
| Agents | Farhana Akter, Imran Hossain, Sadia Rahman, Mahbub Alam |
| Dates | Early September 2026, consistent across every screen |

---

## 7. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | Which call-intelligence product does Sanmar use or intend to buy? | Determines the real webhook contract, whether Bangla transcription quality is adequate, and whether intent scoring is provided or must be derived. The prototype assumes a generic signed webhook and shows the provider as **"VoiceIQ"**, a placeholder name to be swapped for the real vendor | Client | ⏳ Open |
| 2 | What are Sanmar's **price bands** per project and unit type? | Project names, locations and unit mixes are now sourced from Sanmar's published material and used throughout the prototype. Prices are not published anywhere, and business-fit scoring is 45% of the composite, so real bands are still required | Client | 🟡 Partially resolved — names confirmed, prices outstanding |
| 3 | Does an ERP or inventory system exist that can expose availability by API? | If not, price bands must be maintained manually in this platform, which adds an inventory-config screen | Client | ⏳ Open |
| 4 | How many sales and tele-sales agents, and what is a realistic open-lead capacity per agent? | Drives routing defaults and the capacity ceilings shown on the Team page | Client | ⏳ Open |
| 5 | What is the current monthly lead volume and the client's own estimate of the garbage share? | Needed to size the queues and to state a credible time-saved figure in the proposal | Client | ⏳ Open |
| 6 | Are call recordings and transcripts lawful to store and for how long? Any consent script in place? | Affects retention policy and whether recordings can be replayed inside the CRM | Client / Legal | ⏳ Open |
| 7 | Which email domain and sending identity will automated follow-ups use? | SPF/DKIM setup and deliverability; also whether emails appear to come from the agent or from Sanmar centrally | Client | ⏳ Open |
| 8 | Should Marketing get their own portal, or is manager-level campaign reporting sufficient for v1? | A third role folder and a further set of screens if yes. Currently deferred | Riseup / Client | ⏳ Open |
| 9 | When requirement #3's chatbot ships, do its conversations become leads here directly? | Determines whether the CRM needs a unified inbox in v2 or only a handoff marker | Riseup | ⏳ Open |
| 10 | Is Bangla UI localisation required for the tele-sales floor? | v1 is English-only by decision. Retrofitting i18n later is cheap if planned now, expensive if not | Client | ⏳ Open |
