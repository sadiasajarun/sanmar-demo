# Sanmar Lead Intelligence & Sales CRM — demo prototype

Clickable HTML prototype built for **Sanmar Properties Ltd** ([mysanmar.com](https://mysanmar.com)),
a Chattogram real-estate developer, covering client requirement items **#4 (AI-Based Lead
Qualification Engine)** and **#5 (Sales & Marketing CRM interface)**.

Requirement items #1–#3 (website click-to-call, voice routing, omnichannel chatbot + IVR) have
separate demos and appear here only as upstream lead sources.

> **Internal / client-confidential.** Keep this repository private.

---

## What the product does

Sanmar's marketing campaigns generate far more phone enquiries than the sales floor can work, and
most of that volume is noise. This platform sits between the campaign and the salesperson:

**call → AI summary → scored → qualified or binned → routed → automated follow-up**

Four decisions shape it:

- **Call data arrives by signed webhook from Riseup Labs' own conversational-AI and voice platform**,
  already in production. Items #1–#3 and #4–#5 are therefore one
  system from one vendor, not an integration between two. The payload contract is in the PRD.
- **Scoring is hybrid and explainable** — AI conversation signals (45 pts) + business-fit rules (45)
  + behavioural (10), weights summing to a visible 100 that the *sales manager* edits, with a live
  simulator showing the qualified/garbage split move before saving.
- **Garbage goes to a Review Queue with one-click restore**, never deleted, and restores are logged
  as feedback against the scoring model.
- **Red is reserved for SLA breaches and failures only** — never for a bad lead. Garbage is calm grey.

---

## Viewing it

No build step. Either open the file directly:

```
.claude-project/design/html/index.html
```

or serve it locally, which avoids browser caching while iterating:

```bash
python -m http.server 8420 --directory .claude-project/design/html
# then open http://localhost:8420/
```

### Suggested demo route (about 90 seconds)

| # | Screen | Point to make |
|:-:|---|---|
| 1 | Manager → **Dashboard** | 1,284 leads in, 704 filtered as garbage, ৳3,590 cost per *qualified* lead |
| 2 | Manager → **Scoring Rules** | The control panel. Weights the client owns, and the simulator moving the split live |
| 3 | Manager → **Review Queue** | Nothing deleted, every bin has a reason and a one-click restore |
| 4 | Agent → **My Leads → Nusrat Jahan** | The hero. Score ring, factor breakdown, seven reasons, the call that produced +14 |

The prototype is interactive: filter chips and dropdowns filter, the action rail opens working
modals, and the scoring sliders recompute the total and the simulator live.

---

## Layout

```
.claude-project/
├── docs/PRD.md                      canonical PRD (v1.1) — read this first
├── prd/                             PRD archive + version history with hashes
├── design/
│   ├── MYSANMAR_DomainResearch.md   client, users, sector conventions
│   ├── MYSANMAR_DesignGuide.md      page briefs, components, checklist
│   ├── DESIGN_SYSTEM_{A,B,C}.md     three design directions (C was chosen)
│   ├── variations/                  A/B/C comparison screens + showcase-ALL.html
│   └── html/                        ← THE DELIVERABLE
│       ├── index.html               portal picker
│       ├── signal.css               shared design system
│       ├── app.js                   shared behaviour (no dependencies)
│       ├── manager/                 7 pages — Sales Manager / Admin
│       └── agent/                   4 pages — Sales Agent / Tele-sales
└── status/mysanmar/
    ├── seed-mysanmar.yaml           requirements seed: decisions, ontology, ACs
    ├── PIPELINE_STATUS.md           phase log and acceptance criteria
    ├── DESIGN_STATUS.md             variation choice, snapshot hashes, handoff state
    └── DESIGN_QA_STATUS.md          16-point QA report
```

---

## Open before this goes in front of the client

1. **Unit price bands.** Sanmar publishes "call for price", so figures are modelled on prevailing
   Khulshi and Nasirabad per-sqft levels. Every screen showing a unit price says so. Replace with
   real bands — business fit is 45% of the score. *(PRD open question #2)*
2. ~~Call-analysis vendor.~~ **Resolved** — our own conversational-AI and voice platform. Shown in a
   live walkthrough rather than by link.
3. **Brand assets.** No Sanmar logo file was available; the mark is a typographic "S" on the gradient.

Project names, locations and unit mixes **are** real, sourced from Sanmar's published material:
Orchard Garden (Yakub Future Park, West Khulshi — G+19, 260 units, 2/3/4-bed, 1,400–3,500 sqft),
Ocean City, Sardinia, Hyde Park, Avenue Tower, Sky Tower, Residence & Sky Club.

---

## Building the real thing

The PM track (spec → PRD → design) is complete and all handoff gates pass. To scaffold the
implementation:

```
/fullstack-dev mysanmar --path D:\mysanmar-demo --run
```

Proposed stack: NestJS + TypeORM + PostgreSQL + BullMQ on the back end, React Router 7 + Redux
Toolkit + Tailwind v4 on the front. Full rationale in `docs/PRD.md` §5.

---

Produced by **Riseup Labs**.
