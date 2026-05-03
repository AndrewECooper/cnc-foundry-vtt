# Design — C&C Item Sheets Visual Redesign

The authoritative pixel reference is `design_handoff_item_forms/item-forms.jsx`. When a value here conflicts with that file, the JSX wins. The Armor sheet has no prototype — apply the same visual language by analogy.

---

## 1. Tokens

All tokens are already defined in `src/styles/castles_crusades.css` as CSS custom properties from the Character Sheet redesign. Reuse them. Do not redefine locally.

| CSS custom property | Value | Usage |
|---|---|---|
| `--cc-outer-bg` | `#3a2a1a` | Wood-mat background |
| `--cc-text` | `#2a2418` | Primary body text |
| `--cc-muted` | `#7a6b56` | Secondary text, dashed borders, micro-labels |
| `--cc-accent` | `#a02a2a` | Ink red — name underline, type stamp, primary button |
| `--cc-parchment` | `#f7efde` | Paper card background |
| `--cc-plain` | `#fbf6e8` | Section card fill |
| `--cc-card-border` | `#d4c5a0` | Soft section card border |
| `--cc-card-line` | `#c8b890` | Ruled-paper rule line |

Additional values used in item sheets (add to the shared stylesheet if not already present):

| Variable | Value | Usage |
|---|---|---|
| `--cc-title-bar-bg` | `linear-gradient(#2a1f12, #1f160a)` | Item dialog title bar |
| `--cc-title-bar-text` | `#e0d0a8` | Title bar text |

### Typography

Fonts are already bundled as webfonts in `src/styles/`:
- **Crimson Text** — 400 normal, 400 italic, 600 normal, 600 italic (`.woff`/`.woff2` files present)
- **IBM Plex Sans** — 400, 500, 600 (`.woff`/`.woff2` files present)

| Element | Font | Size | Weight | Style |
|---|---|---|---|---|
| Title-bar item name | IBM Plex Sans | 13px | 400 | uppercase, 1px letter-spacing |
| Form name (header input) | Crimson Text | 26px | 600 | italic, ink-red 2px underline, `rotate(-0.3deg)` |
| Type stamp | IBM Plex Sans | 9px | 600 | uppercase, 2px letter-spacing, 1.5px solid accent border, `rotate(-0.6deg)` |
| Field micro-label | IBM Plex Sans | 9px | 400 | uppercase, 1.4px letter-spacing, `--cc-muted` |
| Field value (text) | Crimson Text | 15px | 600 | italic |
| Field value (numeric) | `ui-monospace, "SF Mono", Menlo, monospace` | 13px | 400 | normal |
| Section header | Crimson Text | 13px | 600 | italic |
| Description prose | Crimson Text | 14px | 400 | italic, 23px line-height |

---

## 2. Shared shell

Every item dialog shares the same outer chrome. This is implemented as a CSS layout applied to the existing `<form class="tlgcc sheet item">` element — no new wrapper element is needed.

```
┌──────────────────────────────────────────────────────┐  ← Title bar (Foundry-managed, dark gradient)
│  STABBY  ◆  WEAPON              ⚙ Sheet   ✕ Close    │
├──────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐ │
│  │         tape strip (rotate -1.2deg)             │ │
│  │  ┌────┐  Stabby                                 │ │
│  │  │ ⚔  │  ─────────  ink-red underline           │ │  ← .cc-item-header
│  │  └────┘  [WEAPON]   ← type stamp                │ │
│  │                                                 │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │ │  ← .cc-stamp-row
│  │  │ PRC  │ │ WGT  │ │  EV  │ │ DMG  │           │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘           │ │
│  │                                      folded ──┐ │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 2.1 Outer container (`.tlgcc.sheet.item`)
- `background: var(--cc-outer-bg)` with wood-grain texture overlays (same as character sheet).
- `width: 560px` — set in `TlgccItemSheet.defaultOptions` (currently 720; update to 560).
- Height varies per form type (see §4).

### 2.2 Paper card (`.cc-item-paper`)
- `background: var(--cc-parchment)` with parchment texture gradients.
- `padding: 20px 22px`, `gap: 14px` between row groups (flex column).
- `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)` — folded corner.
- `box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.5) inset`.
- Tape strip: `::before` pseudo-element, 110×18px, `rgba(220,200,150,0.7)`, `rotate(-1.2deg)`, centered at top.

### 2.3 Header (`.cc-item-header`)
Flex row, `gap: 12px`, `align-items: flex-start`.

**Icon tile** (`.cc-item-icon`):
- 60×60px, `background: #ede0bf` with diagonal hatch pattern.
- `border: 2px solid var(--cc-muted)`, `border-radius: 4px`.
- `box-shadow: 0 2px 4px rgba(0,0,0,0.3)`.
- Tape strip across top: `::before` pseudo, 32×11px, `rgba(220,200,150,0.8)`, `rotate(-2deg)`.
- The `<img data-edit="img">` sits inside this tile; `object-fit: cover`, `border-radius: 2px`.

**Name input** (`.cc-item-name`):
- Crimson Text 26px italic 600, `color: var(--cc-accent)`.
- `border-bottom: 2px solid var(--cc-accent)`, no other border.
- `transform: rotate(-0.3deg)`.
- Background transparent, no outline on focus.

**Type stamp** (`.cc-type-stamp`):
- `display: inline-block`, `padding: 3px 10px`.
- `border: 1.5px solid var(--cc-accent)`, `color: var(--cc-accent)`.
- IBM Plex Sans 9px 600 uppercase, 2px letter-spacing.
- `transform: rotate(-0.6deg)`.

---

## 3. Field primitives

Implemented as Handlebars partials in `src/templates/item/parts/`. Each partial wraps an existing `<input>` or `<textarea>` — the `name=` attribute is passed through unchanged.

### 3.1 `stamp-input` partial
```
label (micro-label, uppercase, 9px IBM Plex Sans, --cc-muted)
input (dashed border, parchment bg, Crimson Text italic 15px or mono 13px)
```
Parameters: `label`, `name`, `value`, `id`, `dtype`, `mono` (bool), `width` (px), `suffix` (optional unit label).

### 3.2 `stamp-multiline` partial
Same chrome as `stamp-input` but wraps a `<textarea>`. Used for Feature Hover Text.
Parameters: `label`, `name`, `value`, `id`, `rows` (default 3).

### 3.3 `stamp-select` partial
Dashed-border `<select>` with a custom muted SVG chevron (no native arrow). Used for Class on the Spell form.
Parameters: `label`, `name`, `value`, `id`, `options`.

### 3.4 `ruled-area` partial
Borderless `<textarea>` over a ruled-paper background, inside a `.cc-form-section`. Used for Spell Description.
Parameters: `name`, `value`, `rows` (default 6).

### 3.5 `.cc-form-section`
Bordered card with an italic Crimson Text header strip. Wraps the Spell Description ruled area.
- `border: 1px solid var(--cc-muted)`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`.
- Header strip: `padding: 6px 10px`, `border-bottom: 1px solid var(--cc-muted)`, `background: rgba(0,0,0,0.03)`.

### 3.6 `.cc-stamp-row`
Flex row, `gap: 10px`, used to group stamp inputs horizontally.

---

## 4. Per-form layout

### 4.1 Ability (`item-feature-sheet.html`)
Default height: 460px.
```
.cc-item-header
.cc-stamp-row
  stamp-input  label="Roll Formula"       name="system.formula.value"   mono  width=180
stamp-multiline  label="Feature Hover Text"  name="system.feature.value"  rows=3
```

### 4.2 Equipment (`item-item-sheet.html`)
Default height: 460px.
```
.cc-item-header
.cc-stamp-row
  stamp-input  label="Quantity"  name="system.quantity.value"  mono  width=110
  stamp-input  label="Price"     name="system.price.value"     mono  width=110
  stamp-input  label="Weight"    name="system.weight.value"    mono  width=110
  stamp-input  label="EV"        name="system.itemev.value"    mono  width=110
```

### 4.3 Spell (`item-spell-sheet.html`)
Default height: 620px.
```
.cc-item-header
.cc-stamp-row
  stamp-input  label="Cast Time"  name="system.cast.value"       mono  width=100
  stamp-input  label="Range"      name="system.range.value"      mono  width=90
  stamp-input  label="Duration"   name="system.duration.value"   mono  width=130
  stamp-input  label="Level"      name="system.spell.spelllevel" mono  width=70
.cc-stamp-row
  stamp-input  label="SV"       name="system.savevalue.value"   mono  width=80
  stamp-input  label="SR"       name="system.spellresist.value" mono  width=80
  stamp-input  label="Comp"     name="system.spellcomp.value"   mono  width=100
  stamp-input  label="Damage"   name="system.spelldmg.value"    mono  width=120
  stamp-input  label="Prepared" name="system.prepared.value"    mono  width=80
.cc-stamp-row
  stamp-input  label="Components"  name="system.component.value"  (flex 1)
  stamp-input  label="Class"       name="system.class.value"      width=180
stamp-input  label="Spell Summary"  name="system.spell.summary"  (full width)
.cc-form-section  title="Spell Description — Hover for important alert"
  ruled-area  name="system.description"  rows=6
  ({{editor}} call preserved inside the ruled-area wrapper)
```

### 4.4 Weapon (`item-weapon-sheet.html`)
Default height: 460px.
```
.cc-item-header
.cc-stamp-row
  stamp-input  label="Price"   name="system.price.value"   mono  width=120
  stamp-input  label="Weight"  name="system.weight.value"  mono  width=120
  stamp-input  label="EV"      name="system.itemev.value"  mono  width=120
  stamp-input  label="Damage"  name="system.damage.value"  mono  width=130
.cc-stamp-row
  stamp-input  label="Bonus AB"  name="system.bonusAb.value"  mono  width=120
  stamp-input  label="Range"     name="system.range.value"    mono  width=150
```

### 4.5 Armor (`item-armor-sheet.html`)
Default height: 460px. No prototype — follows Equipment/Weapon pattern.
```
.cc-item-header
.cc-stamp-row
  stamp-input  label="Price"   name="system.price.value"        mono  width=120
  stamp-input  label="Weight"  name="system.weight.value"       mono  width=120
  stamp-input  label="EV"      name="system.itemev.value"       mono  width=120
  stamp-input  label="AC"      name="system.armorClass.value"   mono  width=120
```

---

## 5. `TlgccItemSheet` changes

In `src/module/sheets/item-sheet.ts`, update `defaultOptions`:
- `width: 560` (from 720)
- Heights are set per-type by overriding `get template()` or by adding a `get defaultOptions()` override per sheet class if needed. For now, a single 560×480 default is acceptable; the paper card will flex to content.

No other TypeScript changes are needed.

---

## 6. CSS architecture

All styles go in `src/styles/castles_crusades.css`, scoped under `.tlgcc`. New classes use the `.cc-` prefix.

Sections to add (after existing character/monster sheet styles):
```css
/* ── Item Sheet Shell ──────────────────────────────── */
.tlgcc.sheet.item { ... }
.tlgcc .cc-item-paper { ... }
.tlgcc .cc-item-paper::before { /* tape strip */ }

/* ── Item Header ───────────────────────────────────── */
.tlgcc .cc-item-header { ... }
.tlgcc .cc-item-icon { ... }
.tlgcc .cc-item-icon::before { /* icon tape */ }
.tlgcc .cc-item-name { ... }
.tlgcc .cc-type-stamp { ... }

/* ── Field Primitives ──────────────────────────────── */
.tlgcc .cc-stamp-field { ... }
.tlgcc .cc-stamp-field label { ... }
.tlgcc .cc-stamp-field input,
.tlgcc .cc-stamp-field textarea { ... }
.tlgcc .cc-stamp-field.mono input { ... }
.tlgcc .cc-stamp-row { ... }

/* ── Form Section (Spell Description) ─────────────── */
.tlgcc .cc-form-section { ... }
.tlgcc .cc-form-section-header { ... }
.tlgcc .cc-ruled-area { ... }
```

---

## 7. Handlebars partials

Register new partials in `src/module/helpers/templates.ts` alongside the existing ones:

```
systems/castles-and-crusades/templates/item/parts/stamp-input.html
systems/castles-and-crusades/templates/item/parts/stamp-multiline.html
systems/castles-and-crusades/templates/item/parts/form-section.html
systems/castles-and-crusades/templates/item/parts/ruled-area.html
```

---

## 8. Reference

- Pixel reference: `design_handoff_item_forms/item-forms.jsx`
- Existing templates: `src/templates/item/item-*-sheet.html`
- Shared stylesheet: `src/styles/castles_crusades.css`
- Sheet class: `src/module/sheets/item-sheet.ts`
- Template registration: `src/module/helpers/templates.ts`
