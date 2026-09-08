# DESIGN_SYSTEM_B — "Operations Console"

**Direction:** the tool the sales floor lives in. Dark slate sidebar against a cool light workspace, indigo as the only chromatic accent, monospace for every number, 4px corners, no shadows — borders do all the structural work. Maximum information per screen.

**Best at:** being used for eight hours without fatigue; making the master lead table genuinely fast to scan.
**Weakest at:** looking exciting on a projector — it is deliberately unremarkable.

---

## Style DNA

> Cool grey workspace, near-black navigation, one indigo accent used sparingly enough that it always means "acted upon". Every numeral is monospace and tabular so columns align down the page. Corners are 4px. There are no shadows anywhere; hierarchy comes from borders, fill weight and spacing alone. Density is the feature.

---

## Colour Tokens

```css
:root {
  /* Brand */
  --brand-900:  #312E81;
  --brand-800:  #3730A3;
  --brand-700:  #4338CA;   /* primary */
  --brand-600:  #4F46E5;
  --brand-100:  #E0E7FF;
  --brand-050:  #EEF2FF;

  /* Ground */
  --canvas:     #F1F5F9;
  --surface:    #FFFFFF;
  --surface-2:  #F8FAFC;
  --sidebar-bg: #0F172A;
  --sidebar-bg-2: #1E293B;
  --sidebar-fg: #94A3B8;
  --sidebar-fg-active: #FFFFFF;

  /* Ink */
  --ink-900:    #020617;
  --ink-700:    #0F172A;   /* body */
  --ink-500:    #475569;   /* secondary */
  --ink-400:    #64748B;   /* tertiary */
  --border:     #E2E8F0;
  --border-strong: #CBD5E1;

  /* Score bands — semantics fixed across all variations */
  --hot-fg:     #047857;  --hot-bg:     #D1FAE5;  --hot-bd:     #6EE7B7;
  --warm-fg:    #92400E;  --warm-bg:    #FEF3C7;  --warm-bd:    #FCD34D;
  --nurture-fg: #1D4ED8;  --nurture-bg: #DBEAFE;  --nurture-bd: #93C5FD;
  --cold-fg:    #475569;  --cold-bg:    #E2E8F0;  --cold-bd:    #CBD5E1;

  /* Status — red reserved for failure only */
  --danger-fg:  #B91C1C;  --danger-bg:  #FEE2E2;  --danger-bd:  #FCA5A5;
  --success-fg: #047857;  --success-bg: #D1FAE5;
  --warning-fg: #92400E;  --warning-bg: #FEF3C7;
  --info-fg:    #4338CA;  --info-bg:    #EEF2FF;

  /* Chart ramp */
  --c1: #4338CA; --c2: #0891B2; --c3: #059669; --c4: #D97706;
  --c5: #7C3AED; --c6: #64748B;
}
```

**Contrast verified:** `--ink-700` on `--canvas` = 15.1:1 · `--brand-700` on `--surface` = 6.9:1 · `--sidebar-fg` on `--sidebar-bg` = 6.4:1 · every band `fg` on its `bg` ≥ 5.9:1.

---

## Typography

```css
--font-body: 'Inter', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Cascadia Mono', Consolas, 'Courier New', monospace;
```
Web font link: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap`

There is no display face. The system's character comes from the mono numerals, not from a decorative type choice.

| Role | Face | Size / weight / spacing |
|---|---|---|
| Score numeral | mono | 56px / 700 / -0.03em / tabular |
| Page title | body | 20px / 600 / -0.01em |
| Section title | body | 13px / 600 / 0.02em |
| KPI value | mono | 26px / 700 / tabular |
| Body | body | 13px / 400 / 1.5 |
| Table cell | body | 13px / 400 |
| Table numeric | mono | 12.5px / 500 / tabular |
| Label / eyebrow | body | 10.5px / 600 / 0.08em / uppercase |
| AI summary prose | body | 13.5px / 400 / 1.6 / max 72ch |

---

## Space, Shape, Depth

```css
--sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px;

--r-sm: 3px; --r-md: 4px; --r-lg: 6px; --r-pill: 3px;

/* No shadow tokens. Depth is expressed with borders and fills only. */
--sh-modal: 0 0 0 100vmax rgba(15, 23, 42, .45);  /* scrim, not a shadow */
```

| Element | Radius | Depth | Border |
|---|---|---|---|
| Card / panel | `--r-md` | none | 1px `--border` |
| Hero score panel | `--r-md` | none | 1px `--border-strong`, 3px left rule in band colour |
| Button, input, select | `--r-sm` | none | 1px `--border-strong` |
| Pill, chip, badge | `--r-pill` | none | 1px band `bd` — **square-ish, not rounded** |
| Modal | `--r-md` | scrim only | 1px `--border-strong` |

---

## Layout

- Sidebar 224px (both roles), `--sidebar-bg`, section eyebrows in `--sidebar-fg` at 10.5px
- Topbar 52px, `--surface`, 1px bottom border
- Content padding 20px, max-width none — the table uses the full window
- **Table row 36px**, dense row 32px, header 34px with `--surface-2` fill and a 2px bottom border
- Card grid gap 12px
- Every table is wrapped in an `overflow-x: auto` container

---

## Motion

100ms linear on background and border colour. Nothing else animates. Focus ring: `0 0 0 2px #FFFFFF, 0 0 0 4px var(--brand-700)`.

---

## Signature Details

1. **Dark sidebar, light workspace.** The classic console split. It gives the eye a fixed anchor and makes the data area feel larger than it is.
2. **Everything numeric is JetBrains Mono.** Scores, budgets, deltas, counts, phone numbers. Columns align perfectly down a 200-row table, which is the single biggest scanning win available.
3. **Zero shadows.** Nothing floats. The whole interface sits flat on one plane, which is why 36px rows do not feel cramped.
4. **3px band-coloured left rule** on the score panel and on hot rows — colour as a structural edge rather than a fill, so it survives being scanned at speed.
5. **Square chips.** A small contrarian choice that reads as engineering rather than marketing.
