# ROKI – Design System (Development)

> **Authority:** This file is the in-repo design reference for implementation.  
> **Code tokens:** [`app/brand-tokens.css`](../app/brand-tokens.css) (colors, spacing, type scale — single source of truth for CSS).  
> **External:** The official **Design Document** (corporate PDF/Figma — not in this repo) remains the brand owner. When it conflicts with this file, update tokens here after aligning with design.

---

## 0. Art direction (north star)

**The feeling to aim for:** modern and trustworthy, but **approachable — not high-tech**. Think **Apple-like restraint**: calm, confident, and human. The platform helps regional SMEs feel that AI and robotics are *for them*, not intimidating.

### Principles

- **Restraint over density.** Generous whitespace, few elements per view, one clear focus per section. Let content breathe.
- **Large, calm typography** and strong hierarchy do the heavy lifting — not borders, boxes, or ornament.
- **Immersive but calm storytelling.** On the Orientierungsebene, motion and scroll *tell the story*; on the Wissensebene, everything stays quiet and readable. Motion always **serves the narrative, never decorates**.
- **Warm and regional, not corporate-sterile.** Real photography of regional workplaces; approachable copy in formal “Sie”.
- **Consistency through tokens.** Reuse `brand-tokens.css` values and `globals.css` classes before inventing new patterns.

### Do / don't

| Do | Don't |
|----|-------|
| Spacious sections, clear single message | Dense dashboards or feature walls |
| Subtle, purposeful motion with reduced-motion fallback | Gratuitous or attention-grabbing animation |
| Real, regional photography (Variante C) | Generic AI-stock / “glowing brain” imagery |
| Soft, human visual tone | Cold, hyper-technical “sci-fi” styling |
| Progressive reveal of depth (orientation → knowledge) | Overwhelming first-time visitors with everything at once |

---

## Status

| Area | Status |
|------|--------|
| Art direction (north star) | **Defined** — approachable, Apple-like, immersive-but-calm (see §0) |
| Colors | Implemented in `brand-tokens.css` (baseline from Phase 0) |
| Typography (Rubik) | Implemented via `next/font` in layout |
| Spacing / layout | Partially tokenized; see open items below |
| Logo usage rules | Partial — asset on disk, rules TBD |
| Component library | Minimal (globals.css utilities only) |
| Two-layer UI model | **Defined** — Orientierungsebene vs Wissensebene (see §7) |
| Imagery strategy | **Defined** — Variante C: photos + icons/illustrations (see §7) |
| Motion / interaction | **Approach decided** — zero-dependency first; baseline hovers; scroll/motion policy in §8 |
| Role filter | **Hub facet** (`zielgruppe` / Rolle) — peer to Branche; Regler switch deferred as optional future UX (§5) |

---

## 1. Brand colors

Implemented in code — do not duplicate hex in components; use `var(--brand-*)` or semantic aliases in `globals.css`.

| Token | Hex / value | Usage |
|-------|-------------|--------|
| `--brand-bg` | `#f6f8fa` | Page background |
| `--brand-surface` | `#ffffff` | Cards, header/footer surfaces |
| `--brand-text` | `#15263e` | Primary text |
| `--brand-muted` | `#15263e` | Aligned with primary text to avoid mixed dark text shades |
| `--brand-primary` | `#f08119` | CTAs, accents |
| `--brand-primary-dark` | `#c86711` | CTA hover — genuinely darker orange (decided 2026-08-06, phase-3 remediation) |
| `--brand-on-primary` | `#15263e` | Button text on orange fills — navy for AA contrast (5.7:1), not white |
| `--brand-link` | `#0f4e8a` | In-text links on light backgrounds |
| `--brand-link-hover` | `#15263e` | Link hover state |
| `--brand-hero-text-muted` | `#e6edf8` | Hero subtitle |
| `--brand-highlight` | `#2fb9cb` | Hero gradient accent, hero CTA |
| `--brand-highlight-dark` | `#1f8c9a` | Turquoise CTA hover — genuinely darker (decided 2026-08-06) |
| `--brand-on-highlight` | `#15263e` | Button text on turquoise fills — navy for AA contrast (6.5:1), not white |
| `--brand-hero-overlay` | `rgba(21, 38, 62, 0.62)` | Hero image overlay |
| `--brand-hero-gradient-mid` | `#1c4d7a` | Hero fallback gradient (mid) |
| `--brand-hero-gradient-deep` | `#15263e` | Hero fallback gradient (deep) |
| `--brand-header-surface` | `rgba(255, 255, 255, 0.96)` | Sticky header background (with backdrop blur) |
| `--brand-section-tint` | `#eaf2fa` | Tinted section background base |
| `--brand-focus` | `#2a7dd1` | Keyboard focus ring color |
| `--brand-ai-label-text` | `#15263e` | AI-generated image label — brand-blue text (frosted chip) |
| `--brand-ai-label-bg` | `rgba(255, 255, 255, 0.85)` | AI label — frosted chip background over imagery |
| `--brand-ai-label-text-on-dark` | `#ffffff` | AI label — text for a dark chip variant |
| `--brand-ai-label-scrim` | `rgba(21, 38, 62, 0.72)` | Scrim behind a light-on-dark AI label (AA contrast) |

### ⚠️ OPEN – Colors

- [ ] **Confirm all hex values** against the official Design Document (names may differ there).
- [ ] **Semantic states:** error, success, warning, info — colors not defined yet.
- [ ] **Link color** — implemented as `#0f4e8a` / hover `#15263e`; contact/header use orange instead (see [`PUBLIC-TEXT-COLORS.md`](PUBLIC-TEXT-COLORS.md)).
- [x] **Dark mode:** decided out of scope — no dark palette planned.

---

## 2. Typography

| Item | Current implementation |
|------|-------------------------|
| Font family | **Rubik** (Google Fonts), weights 400, 500, 600, 700 |
| Loading | `next/font/google` on `[locale]/layout.tsx` |
| Body | Browser default size on `body`; footer uses `0.95rem` |

### Type scale (CSS variables in `brand-tokens.css`)

| Token | Value | Intended use |
|-------|--------|----------------|
| `--font-size-hero-title` | `clamp(2rem, 5vw, 3.4rem)` | Hero H1 |
| `--font-size-hero-lead` | `clamp(1.05rem, 2vw, 1.3rem)` | Hero intro |
| `--font-size-h1` | `clamp(1.7rem, 3.8vw, 2.65rem)` | Page H1 (outside hero) |
| `--font-size-h2` | `clamp(1.35rem, 2.4vw, 1.95rem)` | Section / article H2 |
| `--font-size-h3` | `clamp(1.15rem, 1.8vw, 1.45rem)` | Sub-section H3 |
| `--font-size-eyebrow` | `0.78rem` | Eyebrow labels above headings |
| `--font-size-body` | `1rem` | Body copy |
| `--font-size-small` | `0.95rem` | Footer, captions |
| `--font-weight-normal` / `-medium` / `-semibold` / `-bold` | `400` / `500` / `600` / `700` | Match the four loaded Rubik weights |
| `--line-height-tight` | `1.2` | Headings |
| `--line-height-body` | `1.5` | Body copy |
| `--line-height-relaxed` | `1.6` | Hero lead, longer-form intros |

### ⚠️ OPEN – Typography

- [ ] **Official type scale** from Design Document (H1–H6, body, caption) — map each level to token names. *(The table above reflects what's implemented in code today; it still needs sign-off against the external corporate Design Document.)*
- [ ] **Line heights** per level — tokens exist as defaults (see table above); confirm with design.
- [ ] **Letter-spacing** for headings / uppercase labels (if any).
- [x] **Maximum line length** for article body — **updated 2026-09-23:** Wissensplattform article rich text and the answer line (`.article-blocks .payload-richtext`, `.article-blocks .abschnitt-antwort`) use the content column, the same width as the section headings and the three overview boxes. Landkreis and Partner `.payload-richtext` stay at `72ch`. Hero lead stays at `60ch`. Checklists stay in their narrower card.
- [x] **German hyphenation** — **decided (2026-09-02):** `hyphens: auto` + `overflow-wrap: break-word` on `.prose-page`, relying on the correct `<html lang="de">` (browser-native, no JS library). **Quotes „ “ remain open** — currently only hand-typed per instance (e.g. the Zitat block); no automatic smart-quote conversion for editor-typed rich text yet.
- [x] **Hero heading line breaks / widow prevention** — **decided (2026-09-22):** `text-wrap: balance` on `.hero h1`; `max-width` widened from `16ch` to `20ch`. Art-directed `<br>` tags suppressed below 480 px. Hero lead split into two paragraphs inside `.hero-lead`; `text-wrap: pretty` + `hyphens: auto` per `<p>`; em-based inter-paragraph gap (`1em`) tracks fluid type size. **Robotik** and **Kunstliche Intelligenz** marked `<strong>` (`font-weight: semibold; color: #fff`).

---

## 3. Spacing & layout

| Token | Value | Usage |
|-------|--------|--------|
| `--layout-max-width` | `1100px` | `.container` max width |
| `--layout-gutter` | `92%` | Horizontal width on small viewports |
| `--space-section-y` | `3.8rem` | `.section` vertical padding |
| `--breakpoint-md` | `760px` | Mobile nav / grid stack (used in media queries) |

Spacing scale: `--space-1` … `--space-10` in `brand-tokens.css` (rem-based). Prefer these over arbitrary `padding` values.

### ⚠️ OPEN – Layout

- [ ] **Grid system** for knowledge hub (columns, gutters) — not defined.
- [ ] **Breakpoints** beyond `760px` (tablet, desktop, wide) — list from Design Document.
- [ ] **Vertical rhythm** between sections on multi-page layouts (Phase 4+).
- [x] **Event** layout — 2026-11-03. List and detail reuse existing sections, cards, and buttons. ROKI events: navy edge (`--brand-text`), label „ROKI“, solid button. Partner events: light border (same as entry cards), partner logo, label „Veranstaltung eines Partners“, text link. Same card size in a row. No new colours. Partner profiles and the map stay as already shipped.

---

## 4. Radius, elevation, borders

| Token | Value (current in code) | Usage |
|-------|--------|--------|
| `--radius-button` | `10px` | `.button` |
| `--radius-card` | `14px` | `.card` |
| `--border-width` | `1px` | Cards, header |
| `--shadow-soft` | `0 10px 26px rgba(21, 38, 62, 0.08)` | Resting elevation |
| `--shadow-card-hover` | `0 16px 35px rgba(21, 38, 62, 0.14)` | Hover-lift elevation |
| `--focus-ring-width` | `3px` | Focus outline width |
| `--focus-ring-offset` | `2px` | Focus outline offset |

> **Decided (2026-08-05), implemented (2026-08-06):** softened the corner radius to **10px / 14px** to match the approachable, Apple-like north star (§0). `--radius-button` / `--radius-card` in `brand-tokens.css` now carry these values.

### ⚠️ OPEN

- [x] **Box shadows** — implemented (`--shadow-soft`, `--shadow-card-hover`); confirm elevation levels with design.
- [x] **Focus ring** style — implemented (`--brand-focus`, `--focus-ring-width`, `--focus-ring-offset`, plus `:focus-visible` in `globals.css`); confirm color/contrast with design.

---

## 5. Components (baseline)

Reuse classes in [`app/globals.css`](../app/globals.css) before adding new patterns.

| Class | Purpose |
|-------|---------|
| `.container` | Centered max-width wrapper |
| `.section` | Vertical section spacing |
| `.section--tint` | Section with subtle blue-tinted gradient background |
| `.section--surface` | Section on the white surface color |
| `.card` | Transparent, borderless content block (spacing only — **not** a bordered panel) |
| `.feature-card` / `.feature-stack` | Stacked feature blocks (single-column grid with gap) |
| `.audience-columns` | Two-column copy + map layout (stacks at `--breakpoint-md`) |
| `.section-heading` / `.section-intro` | Standard section title + intro spacing |
| `.button` | Primary CTA |
| `.hero` | Full-width hero with overlay |
| `.grid-two` | Two-column grid (stacks at `--breakpoint-md`) |
| `.muted` | Same color as primary text (reserved utility for future tone changes) |

### CTA color rule (decided 2026-08-06, phase-3 remediation)

There are no `.button--primary` / `.button--highlight` classes — orange is the plain `.button` default, and turquoise is a context override (`.hero .button`, `.newsletter-form .button`), not a modifier you add by hand.

- **Orange (plain `.button`)** = default CTA on light pages (contact, forms, general "do this next").
- **Turquoise (`.hero .button` / `.newsletter-form .button` — automatic in those contexts)** = hero and newsletter CTAs only — the Orientierungsebene accent color.
- **Ghost (`.button.button--ghost`)** = bordered secondary action; has its own `:hover` (subtle tint, not the orange fill it used to inherit).
- **Blue (`--brand-link`)** = in-text prose links only, never a button fill.
- Both fills use **navy button text** (`--brand-on-primary` / `--brand-on-highlight`), not white — orange/navy is 5.7:1, turquoise/navy 6.5:1, both passing WCAG AA (≥ 4.5:1). Hover states darken the fill (`--brand-primary-dark` / `--brand-highlight-dark`) rather than changing text color. See §11 and [PUBLIC-TEXT-COLORS.md](PUBLIC-TEXT-COLORS.md).
- **Modifier convention (fixed 2026-08-11):** always write button modifiers as compound selectors chained with the base class — `.button.button--ghost`, never a bare `.button--ghost`. A bare single-class modifier ties in specificity with `.button` itself, so whichever rule sits later in `globals.css` silently wins; that exact bug once made every ghost button render as a solid orange `.button` at rest, only revealing its real style on `:hover` (where the two rules happened to be ordered the other way).

### ⚠️ OPEN – Components

- [x] **Secondary / ghost / text buttons** — `.button.button--ghost` implemented with its own `:hover` (2026-08-06, cascade-order bug fixed 2026-08-11). `.button.button--ghost-on-hero` rebuilt as **frosted glass** (2026-09-22): navy scrim `rgba(21,38,62,0.45)` + `backdrop-filter: blur(8px)` + near-full-white 1px border; hover fills solid white with navy text. Tokens `--brand-hero-ghost-bg/border/bg-hover` in `brand-tokens.css`. Rest contrast ≥ 4.5:1 AA; hover 12.6:1.
- [ ] **Form fields** (input, textarea, select, validation) — Phase 2 contact form.
- [x] **Unified content badge set** — implemented as `ContentBadges` ([`components/ContentBadges.tsx`](../components/ContentBadges.tsx)), driven by `praxisbeispielTyp`, `vonRokiBegleitet`, `reifegrad`, `unternehmensbesuch` per [METADATA_MODEL.md](METADATA_MODEL.md) §6.2a. Built on tokens (no bespoke colors), so it is trivially restyled once the design colleague delivers final visuals.
- [x] **AI-generated label** (compliance, EU AI Act Art. 50) — **decided and implemented** as a reusable `AiImageLabel` component ([`components/AiImageLabel.tsx`](../components/AiImageLabel.tsx)), rendered as `.ai-image-label` in [`globals.css`](../app/globals.css) (renamed from the earlier hero-only `.hero-ai-badge`). Used on every CMS image surface: homepage hero, article `titelbild`, in-body `medien` figures, `bildergalerie`, video poster.
  - **Style — frosted-glass chip:** brand-blue text `var(--brand-ai-label-text)` on a semi-transparent white, blurred background `var(--brand-ai-label-bg)` (60% white — lowered from 85% on 2026-08-12 to sit closer to the underlying image; still ≥4.5:1 AA text contrast even over a worst-case black photo) + `backdrop-filter: blur(6px)`, pill radius, `--shadow-soft`, positioned bottom-right of the image via the `corner` prop. Matches the Apple-like north star (§0) and the blurred sticky header. Degrades gracefully to a plain 60% white chip where `backdrop-filter` is unsupported.
  - **Dark-chip variant** (`variant="dark"`, for light imagery — used on the video poster): `var(--brand-ai-label-text-on-dark)` on `var(--brand-ai-label-scrim)`.
  - Real HTML text, **never baked into the image**; also mirrored in the image `alt` text via the `aiAwareAlt()` helper, which appends the disclosure if an editor omits it from `alt` (see §7). Present at first exposure. No motion (reduced-motion safe).
  - **Contrast:** WCAG AA — ≥ 4.5:1 normal / ≥ 3:1 large text — verify against the surface it sits on.
  - Wording **"KI-generiert"** per [`german-public-copy.mdc`](../../.cursor/rules/german-public-copy.mdc); policy + scope in [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md) §4–§5. Distinct from credibility badges — it is mandatory, not decorative.
- [ ] **Navigation** expanded (mega menu, mobile drawer) — Phase 4+.
- [x] **Event cards** — two variants, decided 2026-11-03 (navy ROKI card, quieter partner card with logo). Article and partner card variants otherwise remain open.
- [ ] **Related-content cards („Mehr zum Thema“)** — unified card grid on knowledge pages; eyebrow = content type, title, teaser; optional cover only when a CMS image already exists (else type-tinted placeholder). No mandatory thumbnail production. Spec sketched in [CONTENT_STYLEGUIDE.md](CONTENT_STYLEGUIDE.md) §3.5 and the content-styleguide wireframe. **Not built in Phase 3** — `verknuepfteInhalte` is an Auto/Phase-4 field ([METADATA_MODEL.md](METADATA_MODEL.md) §4); pages currently end at Partner + Kontakt.
- [ ] **Content-type page tints** — optional subtle background/accent per `contentTyp` within brand tokens (blue / teal / warm washes). Proposal in wireframe; confirm intensity with design before locking tokens in `brand-tokens.css`.
- [x] **Content-area entry cards** — four homepage entry points (Grundlagen, Praxisbeispiele, Umsetzung, Netzwerk) as light bordered cards: line icon, hook, short text, always-visible action. Updated 2026-09-23. This replaces the earlier “icon row, not bordered cards” decision for this homepage section only. See §7.
- [ ] **Problem chips** — need-based entry inside the hero (“Was beschäftigt Sie?”); deep-link to Knowledge Hub with `problem` facet (Phase 3+).
- [x] **Rolle hub facet** — Knowledge Hub toolbar filter on metadata `zielgruppe` (same control pattern as Branche / Problem / Typ). URL-reflected. **Done 2026-09-23** together with Typ, Problem, and Branche. Spec: [knowledge-hub-wireframe.html](knowledge-hub-wireframe.html).
- [ ] **Role “Regler” (deferred)** — optional future segmented control *if* the team prefers it over the Rolle facet; not the default. Must be keyboard-operable with `prefers-reduced-motion` respected if animated.

---

## 6. Logo & brand assets

**Path:** `web/public/assets/` — folder roles documented in [`README.md`](../README.md). Art for the 14 October 2026 review sits in `review/` and is not on the site yet. Session questions: [DESIGN_REVIEW.md](DESIGN_REVIEW.md). `icons/` and `map/` stay empty until chosen files move there.

| File | Status |
|------|--------|
| `branding/Hauptlogo_ROKI_blau_türkis.svg` | In use (header) |
| `branding/Favicon_ROKI_blau.png` | In use (app icon) |

### Usage (current code)

- Header: main logo, height `64px` (`.logo-image`), max-width responsive cap.
- Alt text: from i18n `Layout.logoAlt`.

### ⚠️ OPEN – Logo

- [ ] **Minimum clear space** around logo (× height of icon?).
- [ ] **When to use negative / white logo** (dark hero vs light header).
- [ ] **Minimum size** in print vs digital from Design Document.
- [x] **Co-branding** (funding logos) — **footer light band:** heading "Gefoerdert durch:" plus three groups (oerderer_EU_SAG, oerderer_LK, oerderer_FBK) in one row on desktop, stacked on small viewports. Transparent PNGs on `--brand-surface`. **Optical-weight correction (2026-09-22):** district strip (oerderer_LK) scaled to 0.85 via `--footer-funding-scale` + `object-fit: contain` inside its reserved grid cell — measured ink mass 123 030 (62 % of total) and bbox height 195/200 px vs 167/200 for EU/SAG. EU group stays at 1.0 per ESF/EU emblem visibility rules. Re-derive with `node scripts/measure-logo-weight.mjs` after any logo re-export.
- [ ] **Favicon / app icon** set — fuller size set beyond the current blue PNG.
- [ ] Rename/consolidate logo files if the Design Document mandates shorter names.

---

## 7. Imagery, layers & hero

### Two-layer design principle

| Layer | Where | Effect | Means |
|-------|--------|--------|--------|
| **Orientierungsebene** | Homepage, problem entry points, overviews | Welcome visitors, tell the story, spark curiosity | Motion, animation, large type, interactive entry (chips, entry cards) |
| **Wissensebene** | Practice examples, articles, checklists, partner profiles | Trust, readability, SEO | Calm, structured, mostly static layouts |

Homepage is the stage; deep content pages are the archive. Both layers share brand tokens but differ in density and motion.

### Imagery strategy (Variante C — decided)

- **Photography** where available: real workplaces, regional credibility (practice examples, partners, success stories).
- **Icons / light illustration** for explanations, navigation tiles, and gaps without photo assets.
- **Abstract elements** (color fields, lines) as connective tissue — use sparingly for consistency.
- Avoid generic AI-stock illustration look.
- **In-body article figures (decided 2026-10-13):** inset, centered, narrower than the text column (`.media--inset`), height-capped, `object-fit: contain` — no forced 16:9 crop. Soft credit line under the image from Media `bildunterschrift` (smaller/lighter than body). Hero `titelbild` stays full-bleed. Editorial detail: [CONTENT_STYLEGUIDE.md](CONTENT_STYLEGUIDE.md) §3.9.

| Item | Current |
|------|---------|
| Hero background | Photo + CSS gradient overlay (`--brand-highlight`, mid/deep blues) |
| Hero min-height | `58vh` (`--hero-min-height`) |
| Team / sponsor images | In use on homepage |

### Hero structure (target)

1. **Hook** — shared emotional entry (all roles in voice, not as columns).
2. **Promise** — short regional lead (Süderelbe-Region).
3. **CTA group** — primary **Kontakt** (`#kontakt`); secondary **Newsletter** (`#newsletter`).
4. **Need chips** — horizontal row at the bottom of the hero (“Was beschäftigt Sie?”) → Knowledge Hub with `problem` pre-filtered. Not a separate boxed section.

Role perspectives (Unternehmer/GF, Personaler/HR, Betriebsräte) inform **copy tone** only — **not** a homepage section. Rolle reaches visitors via the Knowledge Hub facet (`zielgruppe`).

### Content-area entry cards (homepage)

Functional labels (Direction B — decided). The section eyebrow is **„Wo möchten Sie starten?“** — never “Vier Wege in die Inhalte”. The headline and intro sit above four light bordered cards. Updated 2026-09-23: this homepage section uses cards (hook, short text, always-visible action), not the earlier icon row. Article pages, the knowledge list, and the map do not use this card style.

Each card: line icon in a pale circle, title, short turquoise rule, bold hook, body, action pinned to the bottom (navy circle, white arrow, label). The whole card is the link. Hover lifts the card slightly; the action stays visible (no hover-to-reveal). Radius, shadow, and type stay on existing tokens. No orange.

Cards are kept low (no inline artwork). The earlier inline cutouts and the reduced district silhouette on the Netzwerk card were removed (2026-09-23); replacement graphics will sit **behind** the card via the `--entry-bg` CSS custom property (background, `right bottom`, `auto 60%`), so they add no vertical height. Until a graphic is supplied the hook resolves to `none`.

| Entry | Card title | Destination |
|------|------------|-------------|
| 1 | Grundlagen | `/de/wissen?bereich=orientierung` |
| 2 | Praxisbeispiele | `/de/wissen?bereich=beispiele` |
| 3 | Umsetzung | `/de/wissen?bereich=werkzeuge` |
| 4 | Netzwerk | `/de/netzwerk` |

The third card is titled **Umsetzung**. The menu label **Umsetzungshilfen** is unchanged.

**Structural sketches:** [homepage-wireframe.html](homepage-wireframe.html), [knowledge-hub-wireframe.html](knowledge-hub-wireframe.html), [netzwerk-map-wireframe.html](netzwerk-map-wireframe.html). The wireframe still shows the earlier icon row. See [PROJECT_PLAN.md](PROJECT_PLAN.md) Homepage evolution.

### Netzwerk map (implemented 2026-08-13; redesign 2026-09-22)

`/de/netzwerk` shows a **server-rendered inline SVG built from real district boundaries** — no tile layer, no map library, and deliberately nothing that looks like Google Maps. Boundaries come from BKG VG250 (Open Data, dl-de/by-2-0), simplified and projected by `scripts/build-region-geometry.mjs` into the committed module `lib/map/regionGeometry.ts`. Attribution for BKG and OpenStreetMap lives in the Impressum under „Kartendaten“.

**Art direction.** Quiet geography + prominent network + playful exploration. Network points are the primary information layer; district fills and labels are orientation only. No relief, no roads, no grid, no zoom controls, **no legend**.

The map spans the **full container width**. Landkreise are reached from the district shape/label; every partner is also listed as text below the map. **ROKI is not a map point** — the collection of network points *is* the network; the project story stays on `/de/roki` (nav/footer).

| Layer | Treatment |
|---|---|
| Three districts | Very similar light blue fills (`--brand-map-district-*`), drawn as **two passes**: fills first, then thin muted outlines. Harburg, Lüneburg und Stade are **Förderer** conceptually but have **no funder pin** — the shape/name is the link. |
| District borders | Thin muted blue-grey (`--brand-map-district-line`, 1.5 units). |
| Hamburg | Even paler (`#F2F5F7`) context shape with a very quiet uppercase label. Orientation only — not interactive. |
| Umland ring | Dashed ellipse carrying partners outside the three districts, shown only when there are any. |
| Labels | Uppercase, medium weight, muted blue-grey, ~55–70% opacity, **no** white outline. Labels **nudge out of the way of pins**. |

**Colour tokens** (`--brand-map-*` in `brand-tokens.css`): Stade and Lüneburg are pale sky blues; Harburg is a medium blue, darker than those two and lighter than the funder pins. Hamburg stays paler than every district. Pin hierarchy: Förderer in brand navy (`--brand-text`, largest) → Kooperationspartner in turquoise (`--brand-highlight`) → Praxispartner & Expertinnen as a white circle with a navy outline (smallest). Decorative district drawings are optional artwork, not primitives drawn in code: `public/assets/map/stade.svg` (tower and trees), `harburg.svg` (bridge), `lueneburg.svg` (church and houses); PNG is acceptable. They sit in the open part of each district, ignore pointer events, and carry no labels. Colours inside those pictures (including greens) stay in the artwork and are not new interface colours. The map does not label the Elbe. A role filter sits above the map; there is still no legend.

| Kind | Public card kind | Marker |
|------|------------------|--------|
| District | **Förderer** | No pin — tinted shape + label is the link. Unpublished profiles look identical; only the card says the page is being prepared. |
| Partner | `netzwerkRolle` label (Förderer / Kooperationspartner / Praxispartner & Expertinnen) | Three sizes/colours from `Partners.netzwerkRolle`. Partners without a role stay off the map. |

**No legend.** Hierarchy is discoverable through interaction; an understated hint sits above the map („Tippen oder zeigen Sie auf die Punkte…“). A partner we could not geocode gets a normal tiered dot at the district anchor and the note „ungefähre Lage im Landkreis“; one outside the region sits on the ring at its **true compass bearing** with **no distance encoded**.

**Deliberately not shown:** exact-address versus municipality-centre precision. At this scale the difference is a couple of pixels ([METADATA_MODEL.md](METADATA_MODEL.md) §6.8b).

**Hover and tap cards.** Pointing at a district or marker opens a small card (category, name, optional teaser/placement). The card is a **real link**, not a tooltip — on touch the **first tap only opens the card and the card carries the navigation**. An invisible hit circle enlarges each marker; an invisible bridge spans the gap between card and marker. Active pins scale slightly with a soft outer ring; other partner pins dim lightly while exploring.

**Where the code lives.** The SVG stays a **server** component (`components/NetzwerkMap.tsx`); the cards are a thin client wrapper (`components/NetzwerkMapCards.tsx`) that finds markers by `data-map-id` (`lib/map/mapTargets.ts`).

**Accessibility and small screens.** The map is a shortcut: every district and partner also appears as normal text below it. Districts and markers are focusable links with accessible names (name + category + placement); the card is `aria-hidden` and not a second tab stop. Focus opens the card, `Escape` closes it, and motion respects `prefers-reduced-motion`. Label and pin sizes bump below `--breakpoint-md`.

**Whole-card links.** Partner cards in the list below the map use `.card-link`.

**ROKI** is not a Partnerprofil — longer project story on `/de/roki`. The map aggregates Landkreis pages + Partner collection only.

**Replaces:** the `Landkarte_Blau_3-03.png` graphic and the CSS mock in [netzwerk-map-wireframe.html](netzwerk-map-wireframe.html).

### ⚠️ OPEN

- [ ] **Hero photography** guidelines (subjects, overlay, cropping) - refine beyond current asset (`Herobild_1C-retusche.png` in use as of 2026-09-22; retouched to remove AI artefacts).
- [x] **Icon style** (line vs filled) — **decided (2026-08-06):** line icons, stroke-width `1.75`, `currentColor` (so they inherit text color / hover state without extra tokens). Implemented as `EntryIcon` ([`components/EntryIcon.tsx`](../components/EntryIcon.tsx)) for the homepage entry row, lifted from [homepage-wireframe.html](homepage-wireframe.html).
- [ ] **Partner logos** display rules (grayscale, max height).
- [ ] **Alt text** standards for editorial images (CMS workflow) — for AI-generated images the `alt`/caption must **also state the image is AI-generated** (EU AI Act Art. 50 disclosure reaches non-sighted users), see [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md) §5.2.
- [ ] **Practice-example cards** — photo + hover overlay (industry, problem, short outcome) on Orientierungsebene.

---

## 8. Motion & interaction

### Implementation approach (decided)

- **Zero-dependency first:** use CSS scroll-driven animations (`animation-timeline: scroll()` / `view()`) and `IntersectionObserver` for section reveals and light parallax. This keeps the bundle small, is EU/performance-friendly, and covers most of the calm Orientierungsebene storytelling.
- **Adopt Motion (Framer Motion) in Phase 4 *only if needed*** — when scroll storytelling outgrows what CSS can do cleanly (orchestrated reveals, richer transitions).
- **Reserve GSAP + ScrollTrigger** exclusively for specific Apple-style *pinned/scrubbed* scenes, if any are commissioned. Do not add it for basic effects.
- All animation lives in **client components** (`"use client"`); RSC pages stay server-rendered for SEO/GEO.
- Motion must match the north star (§0): subtle, purposeful, and calm — never decorative.

### Policy (team meeting — baseline)

| Technique | Use on ROKI | Phase | Notes |
|-----------|-------------|-------|--------|
| Fade-in / slide-in on scroll | Yes | Start (Orientierungsebene) | Section reveals on homepage |
| Sticky + changing images | Yes | When industry content exists | Branchen block |
| Hover overlays on photos | Yes | Practice-example cards | Informative, not cluttered |
| Hover lift on tiles | Yes | Content-area tiles, cards | Subtle shadow/scale |
| Parallax | Sparingly | Hero only | Test on mobile; disable if janky |
| Sequential scroll storytelling | Later | Story circle, deep dives | Higher effort |
| Full client-side content filter | Later | Knowledge hub | Evolves from problem chips + hub facets (incl. Rolle); Regler optional later |

### Accessibility

- **Always** honor `prefers-reduced-motion: reduce` — skip or replace scroll animations and parallax.
- Hub **Rolle** facet and any future Regler must be keyboard-operable with visible focus; announce state changes to assistive tech.
- Hover-only information needs a touch/non-hover fallback. Entry-card hooks, body text, and actions stay visible; they are not revealed on hover.

### ⚠️ OPEN

- [ ] **Motion tokens** to add in `brand-tokens.css`: `--motion-duration-fast/base/slow` and `--motion-ease-standard/emphasized` — define before building scroll reveals so timing stays consistent.
- [ ] **Scroll-progress** bar on long articles (Wissensebene).

**Default-safe:** always honor `prefers-reduced-motion: reduce` — reveals/parallax degrade to static, no scrubbing.

Current: simple color hovers on nav and buttons only.

---

## 9. Text colors on public pages

**Designer handoff:** [`PUBLIC-TEXT-COLORS.md`](PUBLIC-TEXT-COLORS.md) — full table by page/section, hex values, and open review items.

**Implemented highlights:** primary `#15263e`, `.muted` currently aligned to primary, prose links `#0f4e8a`, contact/header accents `#f08119`, hero white / `#e6edf8`, footer `#dfe7f3`. Impressum and Datenschutz share the same list styling (same dark text via `.legal-card ul`).

---

## 10. Content & tone (UI copy)

Public copy is **German**. Tone is defined in the external Design Document / Strategic Concept.

### Documented (see `.cursor/rules/german-public-copy.mdc`)

- Districts: **Harburg, Lüneburg und Stade** — always alphabetical when listed together
- Technology: **Künstliche Intelligenz** (capital K) when spelled out; **KI** only in official project name, short job titles, and non-product credits (e.g. image credits)
- Official project name style: `ROKI – Robotik und KI für die Fachkräftesicherung nutzen` with en dash; usually no quotation marks in running text

### ⚠️ OPEN

- [ ] **Voice principles** — formal “Sie” and further tone (partially covered by `german-public-copy.mdc`)
- [ ] **Capitalization** rules for headings and UI labels.
- [ ] **Error / empty state** message tone.

---

## 11. Accessibility (minimum bar)

Target: WCAG 2.1 AA for public pages unless the Design Document specifies otherwise.

| Requirement | Status |
|-------------|--------|
| Semantic HTML (`header`, `main`, `nav`, `footer`) | In layout |
| Logo `alt` via i18n | Yes |
| Nav `aria-label` | Yes |
| Focus visible styles | **Implemented** — `:focus-visible` in `globals.css` using `--brand-focus` + focus-ring tokens |
| Button color contrast (CTA text on orange/turquoise fills) | **Resolved (2026-08-06)** — switched to navy button text (`--brand-on-primary` / `--brand-on-highlight`): orange/navy 5.7:1, turquoise/navy 6.5:1, both pass AA (≥ 4.5:1). White-on-orange (2.67:1) and white-on-turquoise (2.35:1) both failed; re-verify hex pairing with a contrast checker after any future token change. |
| Color contrast (primary text on white, hero white on overlay) | **⚠️ OPEN — verify with contrast checker** |
| Skip link | **⚠️ OPEN** — beyond the button-contrast fix; full accessibility audit remains Phase 4+ ([PROJECT_PLAN.md](PROJECT_PLAN.md) Phase 3 follow-up slice). |

---

## 12. i18n & design

- Layout must support **longer German strings** without breaking (flex, wrap, no fixed narrow buttons).
- When English locale is enabled later, verify heading line breaks and nav width.

---

## 13. Open decisions checklist (summary)

Copy into issues or Phase 2 planning as items are resolved.

1. Sync color hex values with official Design Document.
2. Complete type scale (H1–H6) and map to CSS variables.
3. Define breakpoints and grid for knowledge hub.
4. Logo rules + asset pack (negative, favicon, funding marks).
5. Form and secondary button styles (contact form, **newsletter signup**). Ghost button hover implemented 2026-08-06. `.button--ghost-on-hero` frosted glass implemented 2026-09-22.
6. ~~Button contrast~~ — **resolved 2026-08-06** (navy text on orange/turquoise). Skip link + full contrast audit remain open before public launch (focus ring already implemented).
7. ~~Imagery and illustration guidelines~~ — Variante C decided; icon style decided (line, stroke-width 1.75).
8. ~~Motion / reduced-motion policy~~ — approach decided in §8 (zero-dep first); still **tokenize durations/easing**.
9. Error/success state colors.
10. ~~**Dark mode**~~ — **decided out of scope**; no dark palette planned.
11. ~~**Role Regler as default**~~ — **superseded:** Rolle is a normal Knowledge Hub facet (`zielgruppe`); Regler remains an optional future UX only.
12. **Newsletter signup UI (Rapidmail)** — embed or API route; GDPR/AV copy in Datenschutz when live. *(Homepage signup shipped Phase 2.1.)*
13. ~~**Corner radius / softness**~~ — **decided:** soften to ~10–16px (§0); implement in `brand-tokens.css` before broad component build.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-27 | Initial DESIGN.md + expanded `brand-tokens.css` + Cursor rule |
| 2026-07-14 | Two-layer model, imagery Variante C, content tiles, Regler option, motion policy (team meeting) |
| 2026-07-14 | Review pass: added §0 art-direction north star; reconciled doc with `brand-tokens.css`/`globals.css` (radius, shadows, `.card`, focus ring, missing tokens/utilities); decided zero-dependency-first motion approach; flagged corner-radius softness and dark mode as open decisions |
| 2026-07-28 | Added AI-generated label spec (EU AI Act Art. 50, §5 components + §7 alt-text): accessible brand-blue label with light-on-dark/scrim variant, WCAG AA contrast, `alt`-text disclosure; proposed tokens `--brand-ai-label-*` in `brand-tokens.css`. Policy in [AI_TRANSPARENCY.md](AI_TRANSPARENCY.md). |
| 2026-07-28 | AI label decided and implemented: **frosted-glass chip** ("KI-generiert") on the hero image as `.hero-ai-badge`; added `--brand-ai-label-bg` token; §5 item closed. |
| 2026-08-05 | Homepage IA: need-chips in hero; icon entry row (no “Vier Wege”); Rolle as hub facet (Regler deferred); funding logos in footer; Netzwerk map pins (ROKI + Landkreise + Partner). Wireframes: homepage, knowledge-hub, netzwerk-map. |
| 2026-08-05 | **Corner radius** decided: soften to ~10–16px (implementation pending). **Dark mode** decided: out of scope. |
| 2026-08-06 | Phase-3 remediation: corner radius implemented (10px/14px); CTA button contrast fixed (navy text on orange/turquoise, both AA); `.button--ghost` own hover; AI-generated label promoted from hero-only `.hero-ai-badge` to a reusable `AiImageLabel` component with `alt`-text fallback, used across all CMS image surfaces; icon style decided (line, stroke-width 1.75) and implemented as `EntryIcon`; unified content badge set built as `ContentBadges`. |
| 2026-08-13 | **Netzwerk map built for real** (§7): inline SVG from BKG VG250 district boundaries, replacing both the CSS mock and `Landkarte_Blau_3-03.png`. Districts drawn as separated tinted shapes so the borders are visible; Hamburg added as a muted orientation shape; partners pinned from geocoded coordinates with a located/approximate distinction; out-of-region partners on an Umland ring at true bearing without distance. New `--brand-map-*` tokens (Lüneburg's sand deliberately desaturated to stay clear of the CTA orange). Map attribution added to the Impressum. |
| 2026-08-13 | **Netzwerk map redesign** (§7), after review of the first build. Cartography: the separated shapes are replaced by geographically exact districts with one **grey border line** (`--brand-map-district-line`) drawn in a second pass — the offset gap varied with the border angle and overlapped on concave stretches. Dashed outlines for unpublished districts dropped (dashes read as "approximate"). Interaction: **hover/tap cards** that are real links, so touch gets a confirm step instead of a 10px blind target; the **legend and side panel are gone** (one uniform partner pin, the card carries the wording) and the map now spans the full container width. Hero arrow links removed; partner cards in the list became whole-card links (`.card-link`). |
| 2026-09-03 | Footer funding strip: three logo groups + “Gefördert durch:” (desktop row / mobile stack). Compact article Kontakt card: distinct Ulla/Jette blocks with tighter greeting-to-email spacing. |
| 2026-09-22 | Hero image updated to `Herobild_1C-retusche.png` (retouched, AI artefacts removed). Nav labels renamed: Wissensplattform / Grundlagen / Praxisbeispiele / Umsetzungshilfen. Hero lead split into two paragraphs; `text-wrap: balance/pretty`; bold Robotik/KI terms. Secondary hero CTA rebuilt as frosted-glass button (`--brand-hero-ghost-*` tokens). Footer district logos at 0.85 optical scale (`measure-logo-weight.mjs`). **Netzwerk map redesign** (§7): quiet blue geography, no ROKI pin, three `netzwerkRolle` pin tiers, quieter uppercase district labels, explore hint — no legend. |
| 2026-09-23 | Homepage entry section (§7) is four bordered cards (Grundlagen, Praxisbeispiele, Umsetzung, Netzwerk) with always-visible actions. Replaces the icon-row rule for this section only. Netzwerk map: Elbe label and hand-drawn landmarks removed; district artwork waits on `public/assets/map/*.svg`. |
| 2026-09-23 | Wissensplattform article body uses the content column (same width as headings and the three overview boxes). Landkreis and Partner rich text stay at `72ch`. |
| 2026-09-03 | Footer funding strip: three logo groups + “Gefördert durch:” (desktop row / mobile stack). Compact article Kontakt card: distinct Ulla/Jette blocks with tighter greeting-to-email spacing. |
| 2026-09-23 | Design & language review pass. **Typography:** deduped conflicting `.section-heading`/`.section-intro` rules (`.section-intro` now a single canonical `65ch`); eyebrows standardized to the plain `.eyebrow` (bespoke `.entry-section__eyebrow` line/navy variant removed). **Über uns (§ /roki):** rebuilt as a single-column **zig-zag** (`.roki-block` alternating left/right), each section with eyebrow + H2 + bridging lead; the old side-by-side `.roki-split`/`.roki-stack` removed; the "Sprechen Sie uns an" contact block removed and its CTAs point to the homepage `#kontakt`. Banner (`.roki-banner-hero`) re-cropped `object-position: left center` for the new `Header_ROKI.png` (network left / clean blue right, no wordmark), copy stays left over the scrim. **Offer cards** ("Was im Rahmen von ROKI entsteht") gained a numbered accent + turquoise top rule and are reordered to match the homepage box order (Wissen, Praxis, Nächste Schritte, Netzwerk). **Homepage entry cards (§7):** inline artwork + district silhouette removed (`EntryMapSilhouette` deleted), height reduced, background-graphic hook `--entry-bg` added for future art. Homepage "Mehr über das Projekt ROKI" is now an `.arrow-link` (arrow is markup, not copy). **Newsletter social links** rebuilt as a navy `.social-card`. **Wissensplattform filter** rebuilt as a compact single-line toolbar. **Language:** bare "KI" spelled out to "Künstliche Intelligenz" in running text (incl. the `KI-Arbeitsabläufe` typo fix), reduced "entdecken" repetition, neutral wording for contacts, "niedrigschwellig" → "verständlich"; unused Home copy keys removed. |
| 2026-09-23 | Netzwerk map: `build-region-geometry.mjs` now drops small outlying island rings (North Sea / Elbe islets, `ISLAND_MIN_FRACTION`) and `PADDING` reduced 132 → 72 so the districts fill the canvas (viewBox height 732 → 688). Map text, labels and colours unchanged; `npm run check:map` passes. |
| 2026-10-13 | In-body Wissen figures: inset contain frame (`.media--inset`) instead of full-width 16:9 crop; softer Bildnachweis figcaption; Payload Media labels clarify Alt vs visible Quelle (§7). |
| 2026-10-13 | `public/assets/` cleanup for design review: removed unused hero/map/team variants; added empty `icons/`, `illustrations/`, `map/` drop folders; moved loose root illustrations into `illustrations/`; README folder table updated (§6). |
| 2026-10-14 | Design-review inbox: new art moved to `public/assets/review/` (mockups, icons, landmarks, shapes, cutouts, scenes). Page sketches moved out of `illustrations/`; that folder is removed. Live graphics stay in place. Session questions in [DESIGN_REVIEW.md](DESIGN_REVIEW.md). |
