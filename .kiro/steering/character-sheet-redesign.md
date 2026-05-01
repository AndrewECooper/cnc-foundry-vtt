# Character Sheet Redesign: Tabletop Hybrid

## Direction

"Tabletop Hybrid" — a parchment paper card sitting on a dark wood-grain mat. Tactile details: masking-tape strip, pinned-paper push-pin, ruled-paper prose areas, dashed stamp-field borders, slightly rotated stat cards. Reference prototype is in `design_handoff_character_sheet/` (HTML/JSX, not production code).

**Scope: look and feel only. No data model changes. No new functionality.**

## Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `--cc-outer-bg` | `#3a2a1a` | Wood-mat background (sheet window body) |
| `--cc-text` | `#2a2418` | Primary body text |
| `--cc-muted` | `#7a6b56` | Secondary text, dashed borders, table headers |
| `--cc-accent` | `#a02a2a` | Ink red — name underline, PRIME stamp, attack mods |
| `--cc-parchment` | `#f7efde` | Paper card background |
| `--cc-plain` | `#fbf6e8` | Section card fill |
| `--cc-card-border` | `#d4c5a0` | Soft section card border |
| `--cc-card-line` | `#c8b890` | Dotted row separators |
| `--cc-sidebar-bg` | `linear-gradient(180deg, #4a3826 0%, #3a2a1a 100%)` | Vertical tab sidebar |
| `--cc-tab-active-bg` | `rgba(255,250,235,0.95)` | Active sidebar tab |
| `--cc-tab-text` | `#d8c8a8` | Inactive sidebar tab label |

Coin dot colors (Equipment tab): Platinum `#a0a0b8`, Gold `#c8a13a`, Silver `#a8a8a0`, Copper `#b07050` — all at 70% opacity with 1px inset shadow.

### Typography

Fonts are **bundled as local webfonts** in `src/styles/` (same pattern as Soutane). Do not use Google Fonts `@import`.

| Role | Font stack |
|---|---|
| Heading/display | `"Crimson Text", Georgia, serif` |
| Body/labels | `"IBM Plex Sans", system-ui, sans-serif` |
| Numeric/formula | `ui-monospace, monospace` |

Key sizes:
| Element | Size | Weight | Notes |
|---|---|---|---|
| Character name | 30px | 600 | italic, 2px solid `#a02a2a` underline, `rotate(-0.3deg)` |
| Sidebar tab label | 14px | 400/600 active | italic when active |
| Stat panel value | 26px | 600 | Crimson Text |
| Stat panel abbr | 9px | 400 | uppercase, 1.5px letter-spacing |
| Stat panel modifier | 11px | 600 | monospace, ink red |
| Combat stat value | 22px | 600 | Crimson Text |
| Section title | 14px | 600 | italic, Crimson Text |
| Stamp field label | 8px | 400 | uppercase, 1px letter-spacing, muted |
| Stamp field value | 13px | normal | Crimson Text |
| Table header | 9px | 500 | uppercase, 1px letter-spacing, muted |
| Table row name | 13px | normal | Crimson Text |
| Prose blocks | 14px | normal | italic, 1.55 line-height, ruled-paper bg |

### Spacing & Borders

- Sheet: fluid width, fixed sidebar 140px. Height fluid (Foundry resizable).
- Paper card padding: `18px 22px 20px`, gap `12px` between sections.
- Section card: `1px solid #7a6b56`, shadow `0 1px 3px rgba(0,0,0,0.1)`.
- Section header: `6px 10px` padding, `1px solid #7a6b56` bottom border.
- Dashed field border: `1px dashed #7a6b56`.
- Table row separator: `1px dotted #c8b890`.
- Stat panel (prime): `2px solid #a02a2a`, `rotate(-0.4deg)`.
- Stat panel (non-prime): `1px dashed #7a6b56`, `rotate(0.2deg)`.

### Decorative Details

- **Folded corner** on paper card: `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)`
- **Tape strip** top-center of paper card: 110×18px, `rgba(220,200,150,0.7)`, striped overlay, `rotate(-1.2deg)`
- **Portrait tape**: 36×12px strip across portrait top, `rotate(-2deg)`
- **Push-pin**: 14×14px red circle above "pinned" sections (Resources, Biography). `radial-gradient(circle at 35% 30%, #ff6868, #b02020)`
- **PRIME stamp**: absolute top-right of prime stat panels, ink-red bg, cream text, `rotate(8deg)`, 1px white border
- **Ruled paper**: `repeating-linear-gradient(transparent 0 22px, #c8b890 22px 23px)` offset 6px — used in Appearance and Biography prose areas
- **Wood-mat texture**: outer bg uses `radial-gradient(ellipse at 20% 30%, rgba(120,90,60,0.4), transparent 70%)` + `repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px)`

## Layout Architecture

### Overall Structure

```
<form.tlgcc.sheet.actor>
  .cc-sheet-body (flex row)
    .cc-sidebar (140px, dark gradient)
      nav.sheet-tabs[data-group=primary]   ← Foundry Tabs controller
        a[data-tab=combat]
        a[data-tab=features]
        a[data-tab=items]
        a[data-tab=spells]
        a[data-tab=description]
      .cc-sidebar-identity
    .cc-paper-card (flex 1, parchment)
      .cc-sheet-header (portrait + stamp fields)
      .sheet-body
        .tab[data-tab=combat]
        .tab[data-tab=features]
        .tab[data-tab=items]
        .tab[data-tab=spells]
        .tab[data-tab=description]
```

The existing Foundry `Tabs` controller is reused unchanged — only the nav markup moves from a horizontal strip to a vertical sidebar column. The `navSelector`, `contentSelector`, and `initial` values in `defaultOptions` stay the same.

### Sidebar Tabs

| Glyph | Label | data-tab |
|---|---|---|
| ⚔ | Combat | combat |
| ✦ | Abilities | features |
| ⚒ | Equipment | items |
| ✶ | Spells | spells |
| ☙ | Description | description |

Active tab: `--cc-tab-active-bg` background, 3px left border in `--cc-accent`, italic Crimson Text 600, glyph in ink red.
Inactive: transparent bg, `--cc-tab-text` color.

Bottom of sidebar: identity strip — character name (Crimson Text 13px cream), level · class, race. Separated by 1px divider.

### Sheet Header (shared, top of paper card)

- Portrait: 64×64, `data-edit="img"` preserved, dashed border, tape strip pseudo-element
- Identity block: large italic ink-red name with red underline; row of stamp fields below (HP, LVL, CLASS, RACE, DEITY, TITLE, ALIGNMENT, XP)
- Stamp fields are `<input>` elements styled as dashed-border tiles — they remain editable

## Tab Content Notes

### Combat Tab
- Six-up ability grid: each ability is a `.cc-stat-panel` button with `.rollable` preserved, prime detection via `{{ability.ccprimary}}`
- Four combat stat tiles (AC, BTH, Move, HD) — editable inputs styled as dashed tiles
- Weapons list: preserve existing `.item`, `.rollable`, `.item-edit`, `.item-delete`, `.item-create` classes
- Armor list: same class preservation
- Resources sidebar: existing `system.resources` loop, styled as pip-tracker rows (name left, numeric value right — keep as input for now, pip UI is a future enhancement)

### Features Tab (Abilities in design)
- Preserve existing `.item`, `.rollable`, `.item-edit`, `.item-delete`, `.item-create` classes
- Add ✦ glyph before feature name in CSS or template

### Equipment Tab (Items in design)
- Currency row: existing money inputs styled as dashed tiles with coin-color dots
- Valuables: existing `system.valuables.value` input
- Gear list: preserve all existing classes

### Spells Tab
- Spell slots strip: existing `system.spellsPerLevel.value` inputs styled as dashed tiles
- Spell list: preserve `.spell-prepare`, `.rollable`, `.item-edit`, `.item-delete`, `.item-create`

### Description Tab
- Fact tiles: Size, Height, Sex, Weight, Age — existing inputs styled as dashed tiles
- Language + Origin: existing inputs
- Appearance + Biography: existing `{{editor}}` blocks, wrapped in ruled-paper containers

## What Must Be Preserved (Functional Constraints)

- All `.rollable` click targets and their `data-roll`, `data-roll-type`, `data-attack`, `data-label` attributes
- All `.item-edit`, `.item-delete`, `.item-create` anchors and their `data-type`, `data-item-id` attributes
- All `.spell-prepare` anchors and `data-change` attributes
- All `name="system.*"` input attributes (Foundry binds these for saving)
- All `data-edit="img"` on the portrait
- The `data-group="primary"` / `data-tab` structure for Foundry's Tabs controller
- The `{{editor}}` helper calls for Appearance and Biography (rich text)
- The `{{localize}}` calls (i18n)

## Font Bundling

Crimson Text and IBM Plex Sans webfonts go in `src/styles/` alongside the existing Soutane/TeX Gyre Adventor files. Declare them with `@font-face` in `castles_crusades.css` using the same pattern as the existing font declarations. Subset to Latin if possible to keep file size reasonable.

Sources: download from Google Fonts or Fontsource. Required weights:
- Crimson Text: 400 normal, 400 italic, 600 normal, 600 italic
- IBM Plex Sans: 400, 500, 600

## CSS Strategy

All new styles go in `src/styles/castles_crusades.css`, scoped under `.tlgcc`. Existing utility classes (`.grid-*col`, `.flex-group-*`, etc.) can be reused or overridden. New component classes use the `.cc-` prefix to avoid collisions with Foundry's own classes.

Do not remove existing CSS that may be used by the monster sheet or item sheets.
