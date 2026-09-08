# DESIGN_QA_STATUS — mysanmar

phase: P3f
run_at: "2026-09-08T05:42:32Z"
variation: C — "Signal"
pages_checked: 12 (11 role pages + portal index)
result: **PASS — 16 / 16 checks** (re-run after the interactivity pass)

## Results

| # | Check | Result | Detail |
|:-:|---|:-:|---|
| 1 | Page count per role | ✅ | manager 7 · agent 4 · portal index 1 — matches the PRD page map exactly |
| 2 | Role folder structure | ✅ | Only `agent/` and `manager/` are directories under `design/html/`. The shared stylesheet is a file (`signal.css`), not a folder, so it does not register as an empty role |
| 3 | Link resolution | ✅ | **187 / 187** internal HTML links resolve, including all cross-role `../manager/…` and `../agent/…` paths |
| 4 | Stylesheet resolution | ✅ | Every page resolves `../signal.css` (or `signal.css` at root) |
| 5 | No placeholder navigation | ✅ | 0 occurrences of `href="#"` |
| 6 | No emoji used as icons | ✅ | 0 emoji or arrow glyphs in any page. All icons are inline SVG. Fixed during QA: 5 triangle glyphs in the variation-B dashboard were replaced with SVG arrows |
| 7 | Shared shell consistency — sidebar | ✅ | 1 sidebar variant per role across all pages (only the active-item marker differs). manager `1332e2ae` · agent `d44ff7eb` |
| 8 | Shared shell consistency — topbar | ✅ | 1 topbar variant per role. Fixed during QA: `review-queue` had "Last 7 days" where every other manager page had "Last 30 days" — normalised |
| 9 | No dead buttons | ✅ | 202 / 202 `<button>` elements carry `type="button"`, and every one now has behaviour — a filter, a modal, a confirmation, or an honest out-of-scope toast |
| 10 | Accessibility basics | ✅ | 12/12 pages have `lang="en"`, viewport meta and a unique `<title>`. 56 `aria-label`, 69 `role=`, 18 screen-reader-only labels on unlabelled inputs and selects |
| 11 | Empty and loading states | ✅ | 3 empty states (my-leads, followups, review-queue) and 3 loading skeletons (call-log). Every empty state explains *why* it is empty and offers a next action |
| 12 | Interactive controls respond | ✅ | 8 filter groups over 78 tagged rows, 24 modal triggers, 10 live weight sliders, 27 explicit confirmations. Every remaining button returns an honest "not interactive in this prototype" toast rather than doing nothing |
| 13 | Filter counts are truthful | ✅ | Every chip count equals the number of rows it actually selects — verified programmatically. 0 filters match 0 rows |
| 14 | JavaScript is valid | ✅ | `node --check app.js` clean. No dependencies, no build step, runs from `file://` |
| 15 | Weight total enforcement | ✅ | Sliders recompute group subtotals and the grand total live; the save button disables and the total turns red whenever it is not 100 |
| 16 | Data realism | ✅ | 112 BDT figures in lakh/crore, 0 raw-digit prices, 0 lorem ipsum, Bangladeshi contact names throughout, all project names drawn from Sanmar's real portfolio |

## Design system compliance

Only 11 literal hex values appear across all 12 pages, every one of them a chart-ramp or factor-group colour
already declared in `signal.css` (`#F59E0B`, `#0891B2`, `#0E7490`, `#7C3AED`, `#2563EB`, `#E2E8F0`, `#ECFEFF`).
Everything else references a CSS custom property. Fonts, radii, spacing and shadows come from the tokens in
`DESIGN_SYSTEM_C.md` without exception.

### Contrast

Spot-checked against WCAG AA (4.5:1 body, 3:1 large):

| Pair | Ratio | Verdict |
|---|:-:|:-:|
| `--ink-700` on `--canvas-2` | 16.4:1 | ✅ |
| `--ink-500` on `--surface` | 5.3:1 | ✅ |
| `--brand-700` on `--surface` (used at 15px+/600 or as fill) | 5.2:1 | ✅ |
| `--ai-700` on `--surface` | 7.1:1 | ✅ |
| `--hot-fg` on `--hot-bg` | 6.4:1 | ✅ |
| `--warm-fg` on `--warm-bg` | 5.9:1 | ✅ |
| `--cold-fg` on `--cold-bg` | 7.6:1 | ✅ |
| `--danger-fg` on `--danger-bg` | 6.8:1 | ✅ |
| White on `--ai-grad` (600 weight only) | 5.1:1 min | ✅ |

Colour is never the sole carrier of meaning — every band pill also prints its label ("86 · Hot"), every status
carries text, and score deltas are signed.

## Responsive

Breakpoints declared in `signal.css` and applied to every page through the shared shell:

| Width | Behaviour | Verdict |
|---|---|:-:|
| ≥ 1440 | Full layout. Lead detail splits score+profile left, calls+timeline right | ✅ |
| 1280 | 4-up KPI grid → 2-up; 3-up card rows → stacked; weight editor tightens | ✅ |
| 900 | Sidebar moves off-canvas; padding drops to 16px; 2-up grids stack | ✅ |
| 600 | KPIs 1-up; search hidden; score ring 168→140px; key-value lists stack with uppercase labels | ✅ |
| 375 | No horizontal page scroll — all 17 wide tables sit inside their own `overflow-x` containers | ✅ |

## Interactivity pass — what was added

Raised by the client review: the filter chips, action rail and task filters did not respond. All wired now
through a shared dependency-free `app.js`. Details in `DESIGN_STATUS.md`. Verified programmatically that
every chip count matches the rows it selects and that no filter matches zero rows.

## Fixes applied during this QA pass

1. Replaced 5 triangle glyphs (`▲` / `▼`) with inline SVG arrows in `variations/B-dashboard.html`
2. Normalised the `review-queue` topbar date range so all 7 manager pages share a byte-identical shell
3. Added `type="button"` to 17 buttons that were missing it
4. Removed one invalid CSS declaration in `showcase-ALL.html`
5. Added `.ftable-wrap{overflow-x:auto}` to `signal.css` for the review-queue evidence table

## Not covered by this pass

Screenshot-based visual regression (RULE-T12) belongs to Dev phase D9 and needs a running app to compare
against. This pass is static analysis of the HTML the PM track produced, which is the correct scope for P3f.
