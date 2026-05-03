# Design — C&C Item Sheets Visual Refresh

This document is the visual + structural spec. The single source of truth for any value not listed here is `item-forms.jsx` in this handoff bundle — read it directly when in doubt.

## 1. Tokens

Reuse the existing Character Sheet tokens. If they're not yet shared, promote them to a system-wide partial.

### 1.1 Colors

| Token | Hex / Value | Usage |
|---|---|---|
| `outerBg` | `#3a2a1a` | Wood-mat background |
| `text` | `#2a2418` | Primary body text |
| `muted` | `#7a6b56` | Secondary text, dashed borders, micro-labels |
| `accent` | `#a02a2a` | Ink red — name underline, type stamp, primary button |
| `parchmentBg` | `#f7efde` | Paper card background (parchment ON) |
| `plainBg` | `#fbf6e8` | Paper card background (parchment OFF) |
| `cardBg` | `#fbf6e8` | Section card fill |
| `cardLine` | `#c8b890` | Ruled-paper rule line, dotted row separator |
| `titleBarBg` | `linear-gradient(#2a1f12, #1f160a)` | Title bar |
| `titleBarText` | `#e0d0a8` | Title bar text |

The wood mat additionally layers two gradients (see §1.4).

### 1.2 Typography

- **Heading / value text:** `"Crimson Text", "Crimson Pro", Georgia, serif`. Italic for the form name and section headers; italic + 600 for the form name.
- **Micro-labels:** `"IBM Plex Sans", system-ui, sans-serif`. 9px, uppercase, 1.4px letter-spacing, color `muted`.
- **Numeric inputs:** `ui-monospace, "SF Mono", Menlo, monospace`. 13px.

| Element | Font | Size | Weight | Style |
|---|---|---|---|---|
| Title-bar form name | IBM Plex Sans | 13 | 400 | uppercase, 1px tracking |
| Form name (header) | Crimson Text | 26 | 600 | italic, ink-red 2px underline, rotate(-0.3deg) |
| Type stamp | IBM Plex Sans | 9 | 600 | uppercase, 2px tracking, 1.5px solid accent border, rotate(-0.6deg) |
| Field micro-label | IBM Plex Sans | 9 | 400 | uppercase, 1.4px tracking, muted |
| Field value (text) | Crimson Text | 15 | 600 | italic |
| Field value (numeric) | mono | 13 | 400 | normal |
| Section header | Crimson Text | 13 | 600 | italic |
| Description prose | Crimson Text | 14 | 400 | italic, 23px line-height |

### 1.3 Borders, spacing, decoration

- **Sheet outer width:** 560px (Ability, Equipment, Weapon ≈ 460 tall; Spell ≈ 620 tall).
- **Title bar height:** ~32px, padding `8px 14px`.
- **Body padding:** 14px around the paper card.
- **Paper card padding:** `20px 22px`, with `gap: 14px` between row groups.
- **Folded corner:** `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)`.
- **Tape strip:** 110×18 absolute, top:-8 centered, `rgba(220,200,150,0.7)` + 135° striped overlay, `rotate(-1.2deg)`, z-index 2.
- **Field card:** `1px dashed #7a6b56` on `rgba(255,255,255,0.55)`, `5px 8px` (single-line) or `6px 8px` (multiline) padding.
- **Section card:** `1px solid #7a6b56` with `0 1px 3px rgba(0,0,0,0.1)` shadow; header strip `6px 10px` on `rgba(0,0,0,0.03)`.
- **Ruled paper:** `repeating-linear-gradient(transparent 0 22px, #c8b890 22px 23px)` offset 6px.

### 1.4 Wood mat (outer container)
```
background: #3a2a1a;
background-image:
  radial-gradient(ellipse at 20% 30%, rgba(120,90,60,0.4), transparent 70%),
  repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px);
```

## 2. Shared shell

Every form shares the same outer chrome:

```
┌──────────────────────────────────────────────────────┐  ← Title bar (wood-grain dark gradient)
│  STABBY  ◆  WEAPON              ⚙ Sheet   ✕ Close    │
├──────────────────────────────────────────────────────┤
│ ┌──────────────tape strip ─ rotate(-1.2deg)─┐        │
│ │                                            │        │
│ │  ┌────┐  Stabby                            │        │
│ │  │ ⚔  │  ─────────  ink-red underline      │  ← Header
│ │  └────┘  [WEAPON]   ← stamp                │        │
│ │                                            │        │
│ │  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │  ← Field row(s)
│ │  │PRC │ │WGT │ │ EV │ │DMG │  (dashed)     │
│ │  └────┘ └────┘ └────┘ └────┘               │        │
│ │                                            │        │
│ │  …                                         │        │
│ │                                folded ──┐  │        │
│ │                                corner ──┘  │        │
│ └────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────┘
```

### 2.1 Title bar
- Left: Form name (uppercase, Crimson Text 13/600 italic), `◆` glyph, item type label (uppercase, IBM Plex Sans 11, opacity 0.65).
- Right: `⚙ Sheet`, `✕ Close` — restyle existing Foundry controls to use `titleBarText` and IBM Plex Sans 12.

### 2.2 Header
- **Icon tile** 60×60: cream background with diagonal hatch, 2px muted border, 4px radius, tape strip across the top (32×11, rotate(-2deg)). Bind to the existing item image — fall back to a Crimson Text glyph (✦/⚒/✶/⚔ for Ability/Equipment/Spell/Weapon).
- **Form name**: Crimson Text 26 italic 600 ink-red, 2px ink-red underline, rotate(-0.3deg). This is an editable input that looks like text — when focused, no chrome change other than caret.
- **Type stamp**: small uppercase pill below the name (see §1.2).

## 3. Field component

Every input in every form uses one of these primitives. They are defined once and reused.

### 3.1 `StampInput`
Stacked: micro-label on top, single-line input below with dashed border. Numeric variant uses mono. Optional `suffix` (e.g. `gp`, `lb`) renders as small uppercase muted text inside the right edge.

### 3.2 `StampMultilineInput`
Same chrome as `StampInput` but wraps a textarea (used for `Feature Hover Text` and `Spell Summary`). 3 rows by default.

### 3.3 `StampSelect`
Dashed-border select with a custom muted SVG chevron (no native arrow). Used for `Class` on the Spell form.

### 3.4 `RuledArea`
Borderless textarea over a ruled-paper background, inside a `Section`. Used for the Spell Description.

### 3.5 `Section`
Bordered card with an italic Crimson Text header strip. Used to wrap the Spell Description.

## 4. Per-form layout

### 4.1 Ability
Body height ~460. After header:
- Row 1: `Roll Formula` (mono, 180 wide).
- `Feature Hover Text` — full-width StampMultilineInput, 3 rows.

### 4.2 Equipment
Body height ~460. After header:
- Row 1: `Quantity` (mono, 110), `Price` (mono, 110), `Weight` (mono, 110), `EV` (mono, 110).

(No description in the source.)

### 4.3 Spell
Body height ~620. After header:
- Row 1: `Cast Time` (mono, 100), `Range` (mono, 90), `Duration` (mono, 130), `Level` (mono, 70).
- Row 2: `SV` (mono, 80), `SR` (mono, 80), `Comp` (mono, 100), `Damage` (mono, 120), `Prepared` (mono, 80).
- Row 3: `Components` (Crimson Text, flex), `Class` (Crimson Text, 180).
- Row 4: `Spell Summary` — full-width single-line StampInput.
- Section: **"Spell Description — Hover for important alert"** wrapping a `RuledArea`, ~6 rows. Flex 1 1 auto so it grows.

### 4.4 Weapon
Body height ~460. After header:
- Row 1: `Price` (mono, 120), `Weight` (mono, 120), `EV` (mono, 120), `Damage` (mono, 130).
- Row 2: `Bonus AB` (mono, 120), `Range` (mono, 150).

## 5. States

- **Empty** — input has no value; placeholder is empty (do not show ghost text).
- **Focused** — caret shows; no border color change. (Optional polish: 1px solid muted instead of dashed on focus. Match Character Sheet's behavior if it has one.)
- **Disabled** — opacity 0.5, no caret. Same treatment as the Character Sheet.

## 6. Mapping to existing templates

The system already has `templates/items/<type>-sheet.html` (or equivalent — confirm exact path during step 1 of the tasks). Each existing template should be wrapped in the new shell partial and its inputs rewritten to use the new field primitive partials. **Do not change the input `name=` attributes** — they bind to the data model.

## 7. CSS architecture

Suggested:
- `styles/_tokens.scss` (or extend the existing one) — colors, fonts, spacing.
- `styles/_paper-card.scss` — shared shell (title bar, paper card, folded corner, tape strip).
- `styles/_stamp-fields.scss` — `StampInput`, `StampMultilineInput`, `StampSelect`, `RuledArea`, `Section`.
- `styles/items.scss` — per-form layout overrides if any.

Compile into the system's existing CSS bundle. Don't ship a separate stylesheet for these forms.

## 8. Reference

The prototype `item-forms.jsx` in this bundle is the authoritative pixel reference. When in doubt, copy the literal CSS values from there.
