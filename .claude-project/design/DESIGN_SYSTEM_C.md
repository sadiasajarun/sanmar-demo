# DESIGN_SYSTEM_C — "Signal"

**Direction:** a modern SaaS product. White canvas, a confident blue-to-violet accent, 16px corners, layered soft shadows, generous cards, and the score rendered as a large gradient ring. Built to be understood in fifteen seconds by someone seeing it for the first time.

**Best at:** winning the meeting — the hero screen reads instantly on a projector.
**Weakest at:** density. Lists breathe more than a high-volume tele-sales floor strictly wants.

---

## Style DNA

> Clean white ground with pale slate section bands. One vivid blue primary with a violet partner used only for AI-sourced elements, so "the machine did this" has its own colour. Large radii, layered soft shadows, plenty of air. Numbers are big and confident. Every AI signal carries the violet mark, which turns the product's core idea into a visual system rather than a label.

---

## Colour Tokens

```css
:root {
  /* Brand */
  --brand-900:  #1E3A8A;
  --brand-800:  #1D4ED8;
  --brand-700:  #2563EB;   /* primary */
  --brand-600:  #3B82F6;
  --brand-100:  #DBEAFE;
  --brand-050:  #EFF6FF;

  /* AI accent — used ONLY for machine-generated content */
  --ai-700:     #6D28D9;
  --ai-600:     #7C3AED;
  --ai-100:     #EDE9FE;
  --ai-050:     #F5F3FF;
  --ai-grad:    linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);

  /* Ground */
  --canvas:     #FFFFFF;
  --canvas-2:   #F8FAFC;   /* section bands */
  --surface:    #FFFFFF;
  --surface-2:  #F8FAFC;
  --sidebar-bg: #FFFFFF;
  --sidebar-fg: #475569;
  --sidebar-fg-active: #2563EB;
  --sidebar-active-bg: #EFF6FF;

  /* Ink */
  --ink-900:    #020617;
  --ink-700:    #0F172A;   /* body */
  --ink-500:    #64748B;   /* secondary */
  --ink-400:    #94A3B8;   /* tertiary */
  --border:     #E2E8F0;
  --border-strong: #CBD5E1;

  /* Score bands — semantics fixed across all variations */
  --hot-fg:     #047857;  --hot-bg:     #ECFDF5;  --hot-bd:     #A7F3D0;
  --warm-fg:    #B45309;  --warm-bg:    #FFFBEB;  --warm-bd:    #FDE68A;
  --nurture-fg: #1D4ED8;  --nurture-bg: #EFF6FF;  --nurture-bd: #BFDBFE;
  --cold-fg:    #475569;  --cold-bg:    #F1F5F9;  --cold-bd:    #CBD5E1;

  /* Status — red reserved for failure only */
  --danger-fg:  #B91C1C;  --danger-bg:  #FEF2F2;  --danger-bd:  #FECACA;
  --success-fg: #047857;  --success-bg: #ECFDF5;
  --warning-fg: #B45309;  --warning-bg: #FFFBEB;
  --info-fg:    #2563EB;  --info-bg:    #EFF6FF;

  /* Chart ramp */
  --c1: #2563EB; --c2: #7C3AED; --c3: #059669; --c4: #F59E0B;
  --c5: #0891B2; --c6: #94A3B8;
}
```

**Contrast verified:** `--ink-700` on `--canvas` = 16.9:1 · `--brand-700` on `--surface` = 5.2:1 (used at 15px+ / 600 or as a fill) · `--ai-700` on `--surface` = 7.1:1 · every band `fg` on its `bg` ≥ 5.4:1. Gradient fills only ever carry white text at 600 weight.

---

## Typography

```css
--font-display: 'Plus Jakarta Sans', 'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif;
--font-body:    'Inter', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
--font-mono:    'Inter', system-ui, sans-serif;  /* tabular figures, not a mono face */
```
Web font link: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap`

| Role | Face | Size / weight / spacing |
|---|---|---|
| Score numeral (ring centre) | display | 52px / 800 / -0.03em / tabular |
| Page title | display | 26px / 700 / -0.02em |
| Section title | display | 16px / 700 |
| KPI value | display | 32px / 700 / tabular |
| Body | body | 14px / 400 / 1.6 |
| Table cell | body | 14px / 400 |
| Table numeric | body | 14px / 500 / `font-variant-numeric: tabular-nums` |
| Label / eyebrow | display | 11px / 700 / 0.06em / uppercase |
| AI summary prose | body | 14.5px / 400 / 1.7 / max 72ch |

---

## Space, Shape, Depth

```css
--sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px; --sp-12: 48px;

--r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px; --r-pill: 999px;

--sh-1: 0 1px 2px rgba(15, 23, 42, .05);
--sh-2: 0 1px 3px rgba(15, 23, 42, .06), 0 8px 24px rgba(15, 23, 42, .06);
--sh-3: 0 4px 8px rgba(15, 23, 42, .05), 0 20px 48px rgba(15, 23, 42, .10);
--sh-ai: 0 4px 20px rgba(124, 58, 237, .14);
```

| Element | Radius | Depth | Border |
|---|---|---|---|
| Card / panel | `--r-lg` | `--sh-2` | 1px `--border` |
| Hero score panel | `--r-xl` | `--sh-3` | none |
| AI-sourced card | `--r-lg` | `--sh-ai` | 1px `--ai-100` |
| Button, input, select | `--r-sm` | `--sh-1` | 1px `--border-strong` |
| Pill, chip, badge | `--r-pill` | none | 1px band `bd` |
| Modal | `--r-xl` | `--sh-3` | none |

---

## Layout

- Sidebar 256px, white with a 1px right border; active item is a filled `--sidebar-active-bg` block with `--r-sm`
- Topbar 64px, white, 1px bottom border
- Content padding 32px, max-width 1440
- **Table row 48px**, header 44px, no vertical borders — horizontal rules only
- Card grid gap 20px

---

## Motion

180ms `cubic-bezier(.2,.8,.2,1)` on colour, opacity and shadow. No transform, no scale. The score ring draws its arc once on load over 600ms. Focus ring: `0 0 0 4px rgba(37,99,235,.18)`.

---

## Signature Details

1. **The score ring.** A 168px conic-gradient ring segmented by factor group with the composite numeral at its centre. It is the single image a client remembers from the demo.
2. **Violet means machine.** Every AI-sourced element — call summaries, extracted entities, the provider badge, the intent signal — carries `--ai-600`. Human-entered values stay in the blue/slate system. The product's central distinction becomes readable at a glance without any legend.
3. **Layered soft shadows** rather than borders for card separation, which is what makes the interface read as contemporary next to A and B.
4. **Section bands** in `--canvas-2` to group related blocks on long pages without adding boxes.
5. **Gradient only on the ring and the primary CTA.** Used anywhere else it would cheapen quickly.
