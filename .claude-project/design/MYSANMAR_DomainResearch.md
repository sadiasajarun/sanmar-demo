# Domain Research — Sanmar Lead Intelligence & Sales CRM

**Date:** 2026-09-08
**For:** P3a design foundation
**Client:** Sanmar Properties Ltd, Chittagong, Bangladesh

---

## 1. The Client

| Fact | Detail |
|---|---|
| Company | Sanmar Properties Ltd |
| Founded | 1999 — over 25 years in market |
| Sector | Real estate development |
| Products | Residential apartments, retail shops, commercial office space |
| Geography | Chittagong (primary) and Dhaka |
| Key areas | Nasirabad, CDA Avenue, Khulshi, Agrabad, GEC Circle, Panchlaish |
| HQ | Sanmar Ocean City (7th Floor), 997 CDA Avenue, East Nasirabad, Chittagong-4000 |
| Web | mysanmar.com |
| Positioning | "Smart design, comfort and timely delivery" — an established, trust-led developer, not a disruptor |

**Design implication:** this is a 25-year-old company with a reputation to protect, selling the largest purchase most of their customers will ever make. The software should read as *credible and sober*, not startup-playful. But it is an **internal tool** used all day by a sales floor, so it must also be fast, dense and unfussy. Those two pulls — institutional credibility vs daily-driver density — are the central design tension, and the three variations resolve it differently.

---

## 2. The Users, Realistically

### Sales Agent / Tele-sales
- Works a phone queue for most of the day. Screen is open continuously alongside a dialler.
- Reads in short bursts between calls. Needs to absorb "who is this and what did we say last time" in under ten seconds.
- Likely on a modest office desktop, 1366×768 or 1920×1080, Chrome, possibly a smaller laptop.
- Bilingual: speaks Bangla on calls, reads English in software. **English UI with Bangladeshi data is the normal, comfortable arrangement** — not a compromise.

**Design implication:** density over whitespace on lists. Scannable rows, not cards. Score must be legible at a glance from across a desk. The lead-detail page must front-load the recap.

### Sales Manager
- Reviews rather than operates. Wants aggregate truth and exceptions.
- Will be the person who challenges the scoring model in a meeting. Needs to be able to point at a number and say why.

**Design implication:** the manager surfaces earn charts, funnels and comparison tables. The scoring page must look like a control panel they own, not a vendor's black box.

### The Demo Audience (a third, temporary user)
- Sanmar's decision-makers, seeing this in a meeting on a projector or a shared screen.
- They will judge the whole proposal on whether the lead-detail screen makes the idea obvious in about fifteen seconds.

**Design implication:** the hero screen needs one unmistakable focal point — the score with its breakdown — and everything else arranged around it.

---

## 3. Domain Conventions That Must Be Respected

| Convention | Why it matters | How it shows up |
|---|---|---|
| **BDT in lakh and crore** | Bangladeshi buyers and agents do not think in millions. "৳85 lakh" is instantly legible; "BDT 8,500,000" is not | Every price, budget and spend figure |
| **Phone number is the primary identity** | Leads arrive as calls. Email is often absent. The MSISDN is the join key | Phone shown beside every name, always searchable |
| **Area names carry price expectations** | Khulshi and Nasirabad read as premium; Halishahar reads as value. An agent infers budget fit from the area alone | Location always shown next to budget |
| **Size in square feet, not square metres** | Universal in BD property | Unit sizes as "1,650 sqft" |
| **Bedrooms as "3-bed" / "3BR"** | Standard shorthand in listings and conversation | Unit type chips |
| **Bank loan vs cash is a real qualifier** | Financing readiness meaningfully changes close probability and timeline | A first-class field in the requirement profile |
| **Site visit is the pivotal event** | In BD property sales, the site visit is the conversion moment, more than any digital signal | Its own pipeline stage and its own scheduling affordance |
| **Working day ends around 8 PM** | The client explicitly raised post-8 PM handling | Working-hours indicator in automation UI |

---

## 4. Comparable Products Worth Learning From

| Product | What to take | What to avoid |
|---|---|---|
| **HubSpot CRM** | Clear pipeline stage chips; the activity timeline pattern; readable empty states | Its lead score is a mystery number with no breakdown — the exact failure we are designing against |
| **Salesforce Sales Cloud** | Comprehensive record page with a persistent action rail | Overwhelming density, thirty tabs, unusable without training |
| **Pipedrive** | Excellent scannable list density; honest, simple metrics | Visually light to the point of feeling insubstantial for a large-ticket sale |
| **Gong / Chorus** (call intelligence) | The call-summary card pattern: summary paragraph, signal badges, key moments, jump-to-transcript | Their scoring is opaque |
| **Freshsales** | Score with contributing-factor list — closest existing analogue to our hero panel | Weights are not user-editable, which is our differentiator |

**The gap we are designing into:** every mainstream CRM gives a lead score, and almost none of them lets the sales manager see the factors, change the weights, and watch the qualified/garbage split move. That control panel is the product's argument. It should be visually prominent, not buried in settings.

---

## 5. Visual Vocabulary of the Sector

Bangladeshi real estate developer branding clusters around:
- **Deep greens and teals** — land, growth, permanence
- **Gold and brass accents** — premium, established
- **Navy and slate** — corporate trust
- **Serif or high-contrast display type** on marketing; plain sans in operations
- Photography of building elevations and skylines

Sanmar's own presentation is conservative and corporate rather than fashion-forward.

**Conclusion for the design systems:** one variation should lean into that sector vocabulary (deep green + gold, serif display), because it will feel like *Sanmar's* software. One should reject it entirely in favour of operational density, because that is what the floor actually needs. One should show what a modern SaaS treatment looks like, because it demos best. Let the client choose which trade-off they want.

---

## 6. Colour Semantics — Fixed Across All Three Variations

Score bands must mean the same thing regardless of which visual direction is chosen, and the meaning must be obvious to someone who has never seen the product.

| Band | Colour family | Reasoning |
|---|---|---|
| **Hot (75–100)** | Green / emerald | Green is money and "go". Using red for hot leads, as some CRMs do, reads as danger to an untrained viewer |
| **Warm (55–74)** | Amber / gold | Positive but not urgent |
| **Nurture (35–54)** | Blue / cyan | Neutral, cool, "later" |
| **Cold / Garbage (0–34)** | Slate grey | Deliberately unalarming. Garbage leads are not an error, they are noise being correctly filtered |
| **SLA breach / failure** | Red | Red is reserved exclusively for things a human must fix |

This is a deliberate constraint: **red never means "bad lead", only "you are late" or "something broke".**

---

## 7. Accessibility and Environment Constraints

- Office lighting, mid-range monitors, occasional projector. Contrast must be generous — target 4.5:1 minimum, and above 7:1 for the score numerals.
- Colour must never be the sole carrier of meaning: every band pill carries its label, every status carries text.
- 1366×768 must work without horizontal scroll; 375px must remain usable for a manager checking the dashboard on a phone.
- Prototype opens from `file://` — no build step, no external JS dependency beyond an optional web-font link with a full fallback stack.

---

## 8. Risks This Research Surfaces

1. **We do not have Sanmar's actual brand assets** — no logo file, no official hex values. Variation A approximates the sector palette; the client must supply real brand values before any build. *(Open question #2 territory.)*
2. **Real project names are unknown.** Sample data uses Sanmar Ocean City, which is verifiably theirs, plus clearly illustrative siblings that must be swapped before the meeting.
3. **Call-intelligence provider is unnamed**, so the summary card is designed around a generic contract. If the eventual provider returns a different signal set, the score panel's factor rows change — the layout is built to tolerate that.
