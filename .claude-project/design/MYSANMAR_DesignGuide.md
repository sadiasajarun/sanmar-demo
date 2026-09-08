# Design Guide — Sanmar Lead Intelligence & Sales CRM

**Version:** 1.0 · **Date:** 2026-09-08 · **PRD:** v1 (`61a8c3f2…`)
**Phase:** P3a · **Deliverable:** 11 static HTML pages across 2 role portals

---

## 1. Basic Information

| Field | Value |
|---|---|
| Project | Sanmar Lead Intelligence & Sales CRM |
| Type | Internal web application, two role portals |
| Platform | Desktop-first (1440 design width), responsive to 375px |
| User types | Sales Agent (`agent`), Sales Manager / Admin (`manager`) |
| Total pages | 11 — 7 manager, 4 agent |
| Language | English UI, Bangladeshi sample data, BDT lakh/crore |
| Output | Static HTML + CSS + minimal vanilla JS, opens from `file://` |

---

## 2. Design Philosophy

> **The product's whole argument is that a lead score can be explained.** The design's job is to make that argument visible before anyone reads a word of documentation.

Three principles, in priority order:

1. **Explain, don't assert.** Any number the system produces must be accompanied, in the same viewport, by what produced it. A score without a visible breakdown is a design failure, not a space saving.
2. **Density is respect.** These users work a queue for eight hours. Generous whitespace on a list view means more scrolling and fewer leads worked. Reserve air for the hero panel; compress everything else.
3. **Reversible, not destructive.** Every screen that removes something — the Review Queue above all — must show the reason and the way back. This is the client's stated fear and the design should visibly answer it.

### Anti-goals

- No dashboard vanity metrics that nobody acts on
- No score presented as a single mysterious number
- No modal-heavy workflow — agents must not lose context mid-call
- No emoji icons, no decorative illustration, no stock photography of handshakes

---

## 3. Page Inventory & Design Briefs

### Manager portal (`design/html/manager/`)

| # | File | Brief |
|:-:|---|---|
| 1 | `dashboard.page.html` | Eight KPI tiles, a qualification funnel, a score-distribution histogram, garbage-reason mix, campaign snapshot, team leaderboard, and an "attention" cluster (needs routing / SLA breach / stale scores / dead-letter). Answers "is the machine working and where is it stuck" |
| 2 | `leads.page.html` | The master table. Filter rail above, dense sortable rows, bulk selection, saved views. Highest information density in the product |
| 3 | `review-queue.page.html` | Garbage list with reason chips and a right-hand evidence panel showing the score breakdown and the call excerpt that caused the bin. Restore is the primary action and must be visually obvious |
| 4 | `scoring-rules.page.html` | The control panel. Three factor groups with weight inputs, a running total that must equal 100, band thresholds, hard-disqualifier toggles, and a live simulator showing the split moving. This screen sells the product to a sceptical manager |
| 5 | `automation.page.html` | Rule list plus a plain-language builder, an email sequence timeline, template library, working-hours settings, run log |
| 6 | `campaigns.page.html` | Comparison table with CPQL as the headline column, channel rollup tiles, quality trend, garbage reason mix per campaign |
| 7 | `team.page.html` | Agent roster with utilisation bars, capacity editor, ordered routing rules, admin-only integration panel |

### Agent portal (`design/html/agent/`)

| # | File | Brief |
|:-:|---|---|
| 8 | `my-leads.page.html` | Prioritised personal queue. Filter chips, score pill per row, SLA urgency flagging, summary strip |
| 9 | `lead-detail.page.html` | **HERO.** Header, score panel with stacked factor breakdown and four-plus reason statements, requirement profile with AI-extracted / human-confirmed tagging, matching units, two-plus call cards with AI summaries and score deltas, unified timeline, persistent action rail |
| 10 | `call-log.page.html` | Chronological calls with expandable AI summaries, signal badges, score delta column |
| 11 | `followups.page.html` | Overdue / due today / upcoming task groups, scheduled automated emails shown read-only, site-visit calendar strip |

---

## 4. Layout Shells

Two shells, deliberately distinguishable at a glance so nobody in a demo loses track of which portal they are looking at.

### Agent shell
```
┌──────────────────────────────────────────────────────────────┐
│ [sidebar 232px]  │  [topbar 60px: search · SLA · notify · me] │
│  Sanmar mark     ├───────────────────────────────────────────┤
│  ─────────       │                                            │
│  My Leads        │   page content, max-width 1440, 24px pad   │
│  Lead Detail*    │                                            │
│  Call Log        │                                            │
│  Follow-ups      │                                            │
│  ─────────       │                                            │
│  availability    │                                            │
│  12 / 20 open    │                                            │
│  agent identity  │                                            │
└──────────────────┴────────────────────────────────────────────┘
```
*Lead Detail is reached from a row, but appears in the nav as the current context when open.*

### Manager shell
```
┌──────────────────────────────────────────────────────────────┐
│ [sidebar 248px]  │ [topbar 60px: date range · search · me]    │
│  Sanmar mark     ├───────────────────────────────────────────┤
│  PIPELINE        │                                            │
│   Dashboard      │   page content, max-width 1600, 24px pad   │
│   All Leads      │                                            │
│   Review Queue   │                                            │
│  INTELLIGENCE    │                                            │
│   Scoring Rules  │                                            │
│   Campaigns      │                                            │
│  CONFIGURATION   │                                            │
│   Automation     │                                            │
│   Team & Routing │                                            │
└──────────────────┴────────────────────────────────────────────┘
```

Sidebar collapses to icons below 1200px and to a top drawer below 768px. Sidebar must be byte-identical within a role across all its pages, apart from the active-item marker and cross-links.

---

## 5. Component Patterns

| Component | Specification |
|---|---|
| **Score pill** | Rounded pill, band-coloured background at low opacity with the band colour as text and border. Always shows the number *and* the band word: `82 Hot`. Never colour alone |
| **Score panel (hero)** | Large numeral (56–72px, tabular figures), band label, delta vs previous. Below it a single stacked horizontal bar segmented by factor group, then a factor table: name · signal · weight · points. Below that the reason list |
| **Reason statement** | A short sentence with a leading ± marker and the factor name emphasised. Positive and negative reasons visually distinguished by marker, not by red/green fill |
| **Call summary card** | Header row (direction icon, date, duration, outcome, provider badge). Body: summary paragraph. Footer: signal badges (intent / engagement / sentiment), objection chips, extracted-entity chips, recording bar, transcript link, and the score delta produced |
| **Timeline row** | 24px type icon gutter, timestamp column, content column. Score-change rows carry the delta inline. Filterable by type |
| **Reason chip** | Small uppercase-labelled chip for `DisqualificationReason`, neutral slate styling — never red |
| **Data table** | Sticky header, 40px rows (36px on dense views), zebra off, 1px row borders, right-aligned numerics with tabular figures, sortable column headers with a direction caret |
| **Filter chip row** | Horizontally scrollable pill row above tables; active chip filled, inactive outlined |
| **KPI tile** | Label, large tabular value, delta vs previous period with direction marker, optional sparkline. Fixed height so tile rows align |
| **Weight control** | Numeric input plus a range slider on one line, factor name left, current points right. Group subtotals and a grand total that turns into a blocking error state when ≠ 100 |
| **Funnel** | Horizontal stacked bars with count and drop-off percentage between stages |
| **Empty state** | Icon, one-line explanation of *why* it is empty, and where relevant a next action. Never "No data" alone |
| **Utilisation bar** | Thin bar with capacity ceiling marked; over-capacity state marked in red |

---

## 6. Fixed Semantics (all variations)

| Meaning | Treatment |
|---|---|
| Hot 75–100 | Green / emerald family |
| Warm 55–74 | Amber / gold family |
| Nurture 35–54 | Blue / cyan family |
| Cold, Garbage | Slate grey — deliberately calm |
| SLA breach, failure, over-capacity | Red — **reserved, never used for lead quality** |
| AI-sourced value | Marked with a provider badge or an "AI" tag |
| Human-confirmed value | Marked with a check affordance |
| Automated action | Marked distinctly from a human action in the timeline |

---

## 7. Typography Rules

- Body text never below 13px; table numerics use tabular-lining figures so columns align
- Exactly one display face per variation, used only for the score numeral, page titles and KPI values
- Line length capped at 72ch for the AI summary paragraphs — they are the only genuinely prose content in the product
- Currency always rendered as `৳85 lakh` / `৳1.35 crore`, never as raw digits

---

## 8. Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥ 1440px | Full layout. Lead detail runs a two-column split: score + profile left, timeline right |
| 1200–1439px | Sidebar keeps labels; lead detail stacks the timeline below |
| 768–1199px | Sidebar collapses to icons; tables scroll horizontally inside their own container |
| < 768px | Sidebar becomes a top drawer; tables become stacked cards; the score panel remains full-width and first |
| 375px | No horizontal page scroll. Verified on every page |

---

## 9. Pre-Delivery Checklist

- [ ] No emoji used as an icon anywhere — inline SVG only
- [ ] Every clickable element has `cursor: pointer`
- [ ] Hover states change colour or opacity only — never scale or shift layout
- [ ] All text meets 4.5:1; score numerals meet 7:1
- [ ] No horizontal scroll at 375px on any page
- [ ] Every navigation link points at a real file — no placeholder hash links
- [ ] Sidebar and topbar are identical within a role across every page
- [ ] Every currency figure is in lakh/crore
- [ ] No lorem ipsum; every name, place and figure is Sanmar-plausible
- [ ] Icon sizing consistent: 16px inline, 20px nav, 24px standalone

---

## 10. The Three Variations

Each resolves the credibility-vs-density tension differently. They are genuinely different products to look at, not palette swaps.

| | **A — Sanmar Trust** | **B — Operations Console** | **C — Signal** |
|---|---|---|---|
| Idea | Sanmar's brand extended into software | The tool the floor lives in | A modern SaaS product |
| Palette | Deep teal-green + gold on warm paper | Indigo on cool slate, dark sidebar | Vivid blue-violet on white |
| Type | Serif display + Inter | Inter + JetBrains Mono throughout | Plus Jakarta Sans + Inter |
| Density | Medium | High — 36px rows, 13px base | Comfortable — 48px rows, cards |
| Corners | 10px | 4px | 16px |
| Depth | Soft low shadows | None — borders only | Layered soft shadows |
| Best at | Feeling like the client's own | Being used all day | Winning the meeting |
| Weakest at | Reading as generic corporate | Looking unremarkable in a pitch | Feeling substantial for a ৳1cr sale |

Full token sets: `DESIGN_SYSTEM_A.md`, `DESIGN_SYSTEM_B.md`, `DESIGN_SYSTEM_C.md`.
Representative screens for each: `design/variations/` — compare them side by side in `showcase-ALL.html`.
