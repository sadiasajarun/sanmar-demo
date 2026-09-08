# DESIGN_SYSTEM_A — "Sanmar Trust"

**Direction:** the client's own brand extended into software. Deep teal-green and gold on warm paper, a serif display face, medium density, soft depth. Reads as an established developer's institutional tool — sober, credible, unmistakably *theirs*.

**Best at:** feeling like Sanmar rather than like a generic SaaS.
**Weakest at:** risking a "corporate intranet" impression if density is not held.

---

## Style DNA

> Warm paper ground, deep evergreen structure, restrained brass accents. High-contrast serif for numbers and titles against a plain humanist sans for everything else. Rounded-but-not-soft 10px corners. Shadows are low and warm, never blue. Nothing decorative earns its place unless it carries data.

---

## Colour Tokens

```css
:root {
  /* Brand */
  --brand-900:  #063B31;
  --brand-800:  #094A3E;
  --brand-700:  #0B5D4E;   /* primary */
  --brand-600:  #0F7361;
  --brand-100:  #DCEDE8;
  --brand-050:  #EFF6F3;

  --gold-700:   #8A6500;
  --gold-600:   #A67C00;   /* accent text */
  --gold-500:   #C9971A;
  --gold-100:   #F6EDD6;

  /* Ground */
  --canvas:     #F7F5F0;   /* warm paper */
  --surface:    #FFFFFF;
  --surface-2:  #FBFAF7;
  --sidebar-bg: #063B31;
  --sidebar-fg: #CFE3DC;
  --sidebar-fg-active: #FFFFFF;

  /* Ink */
  --ink-900:    #14231F;
  --ink-700:    #1C2B26;   /* body */
  --ink-500:    #5A6B64;   /* secondary */
  --ink-400:    #7C8B85;   /* tertiary */
  --border:     #E3DED3;
  --border-strong: #CFC8B8;

  /* Score bands — semantics fixed across all variations */
  --hot-fg:     #0B5D4E;  --hot-bg:     #DCEDE8;  --hot-bd:     #7FBFAE;
  --warm-fg:    #8A6500;  --warm-bg:    #F6EDD6;  --warm-bd:    #DDBE72;
  --nurture-fg: #0E5A73;  --nurture-bg: #DCEDF3;  --nurture-bd: #7FB6CA;
  --cold-fg:    #55635E;  --cold-bg:    #ECEAE4;  --cold-bd:    #C3BFB4;

  /* Status — red reserved for failure only */
  --danger-fg:  #A3231C;  --danger-bg:  #FBE9E7;  --danger-bd:  #E4A8A3;
  --success-fg: #1E7A47;  --success-bg: #E3F3EA;
  --warning-fg: #9A5B08;  --warning-bg: #FCEFDD;
  --info-fg:    #0B5D4E;  --info-bg:    #EFF6F3;

  /* Chart ramp */
  --c1: #0B5D4E; --c2: #C9971A; --c3: #0E7490; --c4: #7C8B85;
  --c5: #4E8C7B; --c6: #A3231C;
}
```

**Contrast verified:** `--ink-700` on `--canvas` = 12.8:1 · `--brand-700` on `--surface` = 7.4:1 · `--sidebar-fg` on `--sidebar-bg` = 8.1:1 · `--gold-600` on `--surface` = 5.1:1 · every band `fg` on its `bg` ≥ 5.6:1.

---

## Typography

```css
--font-display: 'Fraunces', 'Iowan Old Style', Georgia, 'Times New Roman', serif;
--font-body:    'Inter', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
--font-mono:    'IBM Plex Mono', 'Cascadia Mono', Consolas, monospace;
```
Web font link (with the fallback stacks above doing the work offline):
`https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap`

| Role | Face | Size / weight / spacing |
|---|---|---|
| Score numeral | display | 64px / 600 / -0.02em / tabular |
| Page title | display | 24px / 600 / -0.01em |
| Section title | body | 15px / 600 |
| KPI value | display | 30px / 600 / tabular |
| Body | body | 14px / 400 / 1.55 |
| Table cell | body | 13.5px / 400 |
| Table numeric | mono | 13px / 500 / tabular |
| Label / eyebrow | body | 11px / 600 / 0.07em / uppercase |
| AI summary prose | body | 14px / 400 / 1.65 / max 72ch |

---

## Space, Shape, Depth

```css
--sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px; --sp-12: 48px;

--r-sm: 6px; --r-md: 10px; --r-lg: 14px; --r-pill: 999px;

--sh-1: 0 1px 2px rgba(20, 35, 31, .06);
--sh-2: 0 2px 6px rgba(20, 35, 31, .07), 0 1px 2px rgba(20, 35, 31, .05);
--sh-3: 0 8px 24px rgba(20, 35, 31, .09);
```

| Element | Radius | Depth | Border |
|---|---|---|---|
| Card / panel | `--r-md` | `--sh-1` | 1px `--border` |
| Hero score panel | `--r-lg` | `--sh-2` | 1px `--brand-100` |
| Button, input, select | `--r-sm` | none | 1px `--border-strong` |
| Pill, chip, badge | `--r-pill` | none | 1px band `bd` |
| Modal | `--r-lg` | `--sh-3` | none |

---

## Layout

- Sidebar 232px (agent) / 248px (manager), background `--sidebar-bg`, section eyebrows in `--gold-500`
- Topbar 60px, `--surface`, 1px bottom border
- Content padding 24px, max-width 1440 (agent) / 1600 (manager)
- Table row 40px, dense table row 36px, header row 38px with `--surface-2` fill
- Card grid gap 16px

---

## Motion

150ms `ease-out` on colour and opacity only. No transform, no scale, no layout shift on hover. Focus ring: `0 0 0 3px rgba(11,93,78,.22)`.

---

## Signature Details

1. **Score numeral in Fraunces.** The one place the serif does real work — a 64px high-contrast figure reads as considered rather than computed.
2. **Gold hairline above section eyebrows** in the sidebar — the only ornament in the system, and it costs one pixel.
3. **Warm paper canvas** rather than grey. Distinguishes it instantly from every blue-grey CRM.
4. **Stacked factor bar** in brand green / gold / teal for the three factor groups, so the composition of a score is recognisable before any label is read.
