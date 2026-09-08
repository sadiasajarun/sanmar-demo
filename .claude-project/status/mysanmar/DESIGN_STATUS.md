# DESIGN_STATUS — mysanmar

project: mysanmar
client: Sanmar Properties Ltd
phase: P3-design
selected_variation: C
selected_variation_name: "Signal"
approved: true
approved_at: "2026-09-08T05:20:00Z"
approved_by: "Riseup Labs PM (on behalf of the delivery team)"
phase_complete: true
roles: [agent, manager]
prd_hash_at_generation: "355c9b53f00728d4a04113d1c02bd0ee62673042f40636ca094007d25bb0f9b0"
prd_version: "v2"
html_bundle_hash: "9e68615fc35bf1157a77614dffe2ba7e75df38e8ef94b62cea74e18309ffb65c"
generated_at: "2026-09-08T06:13:56Z"

## Selection

**Variation C — "Signal"** was chosen over A (Sanmar Trust) and B (Operations Console).

White canvas, blue primary with **violet reserved exclusively for machine-generated content**, 16px corners,
layered soft shadows, and the composite score drawn as a 168px conic-gradient ring segmented by factor group.
Chosen because the lead-detail hero screen has to make the product's argument legible in about fifteen seconds
in a client meeting, and the ring plus the violet-means-AI convention does that without a legend.

Trade-off accepted: C is the roomiest of the three, so the high-volume queues fit fewer rows per screen than
variation B would have. Mitigated by keeping table rows at 48px and wrapping every table in its own
`overflow-x` container.

Rejected variations and their token sets are retained in `design/DESIGN_SYSTEM_{A,B}.md` and
`design/variations/{A,B}-*.html` in case the client wants to revisit.

## Adjustment applied at approval

The approval carried one instruction: **swap in real Sanmar projects** rather than illustrative names.

Resolved without blocking. Sanmar's real portfolio was sourced from the company's own published material and
now runs through every screen:

| Project | Detail used |
|---|---|
| **Sanmar Orchard Garden** | Yakub Future Park, West Khulshi, adjacent Zakir Hossain Road · G+19 · 14,000 sqft site · 222 apartments + 16 duplex + 22 penthouse = 260 units · 2/3/4-bed · 1,400–3,500 sqft · 1 garage per unit (160 sqft) |
| **Sanmar Ocean City** | East Nasirabad, 997 CDA Avenue — the company's own HQ building |
| Sanmar Sardinia · Sanmar Hyde Park · Sanmar Avenue Tower · Sanmar Sky Tower · Sanmar Residence & Sky Club | Named in the completed portfolio |

Orchard Garden is the flagship throughout the demo, which also fixes the lead story: the sample lead is a
3-bed West Khulshi buyer, which is exactly what that project sells.

**Still outstanding:** unit **prices**. Sanmar publishes "call for price" everywhere, so figures are modelled on
prevailing Khulshi and Nasirabad per-sqft levels and every screen showing a unit price carries a visible
"prices illustrative" marker. PRD open question #2 is downgraded from Open to Partially resolved.

## Interactivity pass (added 2026-09-08, after first client review)

The first build shipped the markup without behaviour — filter chips, the action rail and the task
filters were inert. That is the worst kind of gap in a live meeting, because those are exactly the
controls people reach for. A shared `app.js` (no dependencies, works from `file://`) now drives:

| Behaviour | Where |
|---|---|
| **Dropdown filters combine** | The seven selects on All Leads (band, stage, campaign, agent, project, budget, SLA) filter as an AND across each other, across the saved-view chips and across the search box. A "N filters active" badge and a Clear filters button appear as soon as anything is set |
| **Filter chips actually filter** | 8 groups, 78 tagged rows — my-leads, call-log, follow-ups, all-leads, review queue, automation rules, campaigns, and the lead-detail timeline. Chip counts match the rows they select exactly, and an empty state appears when a filter matches nothing |
| **Action rail opens real modals** | Call (dialer + outcome), Send email (template + live preview), Schedule site visit, Add note, Change stage, Create task, Mark as garbage (reason picker), Restore (verdict + feedback), Assign, Re-score |
| **Scoring weights are live** | 10 real range sliders. Group subtotals and the grand total recompute as you drag, the total turns red and **blocks saving** when it is not 100, and the simulator re-splits all 1,284 leads against the unsaved values. A "Try the suggested change" button sets budget weight 14 / floor ৳40 lakh in one click |
| **Selection, toggles, tasks** | Table checkboxes with select-all and a live "N selected" badge; automation and disqualifier toggles flip and pause their rule; task **Done** and scheduled-email **Skip** both resolve |
| **Honest fallbacks** | Anything genuinely out of prototype scope says so in a toast rather than doing nothing silently. No control is dead |

Search on the All Leads page filters the table live. The topbar search says plainly that it is not indexed
in a static prototype rather than pretending.

## Sub-step progress

| Step | Status | Output |
|---|---|---|
| P3a — domain research + design guide + 3 design systems | ✅ Complete | `design/MYSANMAR_DomainResearch.md`, `design/MYSANMAR_DesignGuide.md`, `design/DESIGN_SYSTEM_{A,B,C}.md` |
| P3b — variation prompts | ✅ Complete | Style DNA sections inside each design system |
| P3c — representative HTML × 3 variations | ✅ Complete | `design/variations/{A,B,C}-{lead-detail,dashboard}.html` + `showcase-ALL.html` |
| P3d — client confirmation | ✅ Complete | Variation **C** selected |
| P3e — full role-folder HTML | ✅ Complete | 11 pages + portal index + shared stylesheet |
| P3f — design QA | ✅ Complete | `status/mysanmar/DESIGN_QA_STATUS.md` — 12/12 checks pass |
| P3g — snapshot + phase complete | ✅ Complete | this file |

## Delivered HTML

```
design/html/
├── signal.css                          shared design system (variation C tokens)
├── app.js                              shared behaviour — filters, modals, sliders, toasts
├── index.html                          portal picker + demo notes
├── manager/                            Sales Manager / Admin — 7 pages
│   ├── dashboard.page.html             KPIs, funnel, score distribution, attention, campaign snapshot
│   ├── leads.page.html                 master pipeline table, 8 filters, saved views, bulk assign
│   ├── review-queue.page.html          garbage queue, reason chips, evidence panel, restore dialog
│   ├── scoring-rules.page.html         weight editor (sums to 100), bands, disqualifiers, live simulator
│   ├── automation.page.html            rule list + builder, email sequence, templates, run log
│   ├── campaigns.page.html             CPQL table, quality by campaign, garbage reason mix, budget model
│   └── team.page.html                  roster, capacity, routing rules, integration panel, dead letters
└── agent/                              Sales Agent / Tele-sales — 4 pages
    ├── my-leads.page.html              prioritised queue, filter chips, SLA flagging
    ├── lead-detail.page.html           HERO — score ring, factor table, why-this-score, calls, timeline
    ├── call-log.page.html              calls with AI summaries, signals, score deltas, awaiting-analysis
    └── followups.page.html             overdue / due today / upcoming, scheduled emails, visit calendar
```

## Fixed semantics carried into the build

Hot 75–100 green · Warm 55–74 amber · Nurture 35–54 blue · Cold/Garbage 0–34 slate grey.
**Red is used only for SLA breach, automation failure, over-capacity and dead-letter webhooks — never for lead quality.**
Violet (`--ai-600`) marks machine-generated content and nothing else.

## Known placeholders to resolve before the client meeting

1. **Unit prices** — illustrative; Sanmar to supply real price bands per project and unit type (PRD open question #2)
2. ~~Call-analysis provider~~ — **resolved**: Riseup Labs' own conversational-AI and voice platform, already in production. Shown neutrally as "Call AI" in the prototype
3. **Brand assets** — no Sanmar logo file was available, so the mark is a typographic "S" in the gradient. Drop in the real logo when supplied

## Handoff

`/fullstack-dev mysanmar --path D:\mysanmar-demo` is now runnable:

- Tier 1 — PRD at `docs/PRD.md`, HTML under `design/html/`, `approved: true` ✅
- Tier 2 — `prd_hash_at_generation` matches the current PRD ✅
- Tier 3 — role folders `agent/` and `manager/` both populated ✅
