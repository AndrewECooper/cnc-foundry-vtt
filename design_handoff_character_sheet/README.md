# Handoff: Castles & Crusades Character Sheet — Visual Refresh

## Overview
A visual redesign of the Castles & Crusades Foundry VTT system Character Sheet. The sheet has five tabs (Combat, Character Abilities, Equipment, Spells, Description). **Content and data model are unchanged from the existing system** — this handoff covers the **look and feel only**.

The chosen direction is **"Tabletop Hybrid"**: a paper character card sitting on a wood-grain mat, with masking-tape and pinned-paper tactile details, ruled-paper text areas, and stamped/dashed field labels. The sidebar tab layout replaces the existing horizontal tab strip.

## About the Design Files
The files in this bundle are **design references created in HTML/JSX** — a prototype showing the intended look and behavior. They are **not production code to copy directly into Foundry**. The task is to **recreate this design inside the existing Castles & Crusades Foundry VTT system codebase**, using Foundry's templating system (Handlebars), the system's existing data schema, and the project's established patterns. Do not introduce React.

## Fidelity
**High fidelity.** Colors, typography, spacing, borders, and decorative details (tape strips, pinned-paper red dot, slight rotations on stat cards, ruled-paper line backgrounds, dashed field borders) are intentional and should be reproduced pixel-close. Sample data shown in the prototype (character name "Bob", stats, spells, equipment) is placeholder — bind real character data in its place.

## Files in This Bundle
- `Character Sheet.html` — the prototype shell (loads React + Babel and the JSX files)
- `character-sheet.jsx` — all five tabs, layout, tokens, and components (single source of truth for the design)
- `tweaks-panel.jsx` — design-system tooling for the parchment-on/off toggle (not needed in production; reference only)

Open `Character Sheet.html` in a browser to interact with the prototype: click sidebar tabs to switch surfaces; the Tweaks toggle (when active) flips the parchment texture.

## Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| `outerBg` | `#3a2a1a` | Wood-mat background behind the paper card |
| `text` | `#2a2418` | Primary body text |
| `muted` | `#7a6b56` | Secondary text, dashed borders, table headers |
| `accent` | `#a02a2a` | Ink red — character name underline, PRIME stamp, attack mods, Cast button text, prepared checkbox fill |
| `accentSoft` | `#5a8a6a` | Sage green — reserved for secondary affordances |
| `parchmentBg` | `#f7efde` | Paper card background (parchment ON) |
| `plainBg` | `#fbf6e8` | Paper card + section card background (parchment OFF / inner cards) |
| `cardBg` | `#fbf6e8` | Section card fill |
| `cardBorder` | `#d4c5a0` | Soft section card border |
| `cardLine` | `#c8b890` | Dotted row separators inside tables |
| `titleBarBg` | `linear-gradient(#2a1f12, #1f160a)` | Top window-chrome bar |
| `titleBarText` | `#e0d0a8` | Top bar text |
| `sidebarBg` | `linear-gradient(180deg, #4a3826 0%, #3a2a1a 100%)` | Vertical tab sidebar |
| `tabActiveBg` | `rgba(255,250,235,0.95)` | Active sidebar tab pill |
| `tabActiveText` | `#2a2418` | Active sidebar tab label |
| `tabText` | `#d8c8a8` | Inactive sidebar tab label |

Coin-pouch dot colors (Equipment tab): Platinum `#a0a0b8`, Gold `#c8a13a`, Silver `#a8a8a0`, Copper `#b07050`, all at 70% opacity with a 1px inset shadow.

### Typography
- **Heading / display:** `"Crimson Text", "Crimson Pro", Georgia, serif`. Italic for character name, section titles, spell names, feature names, prose blocks. Weight 600 for emphasis.
- **Body / labels:** `"IBM Plex Sans", system-ui, sans-serif`. Weight 400/500/600.
- **Numeric:** `ui-monospace, monospace` for damage formulas, weights, ability roll formulas.

Sizes:
| Element | Size | Weight | Style |
|---|---|---|---|
| Character name | 30px | 600 | italic, 2px solid `#a02a2a` underline, rotate(-0.3deg) |
| Title bar character name | 14px | normal | 1px letter-spacing, uppercase |
| Sidebar tab label | 14px | 400 / 600 active | italic when active |
| Stat panel value | 26px | 600 | Crimson Text |
| Stat panel label (STR/DEX/…) | 9px | 400 | uppercase, 1.5px letter-spacing |
| Stat panel modifier | 11px | 600 | mono, ink red |
| Combat stat value (AC, BTH, …) | 22px | 600 | Crimson Text |
| Section title | 14px | 600 | italic |
| Field stamp label | 8px | 400 | uppercase, 1px letter-spacing, muted |
| Field stamp value | 13px | normal | Crimson Text |
| Table header | 9px | 500 | uppercase, 1px letter-spacing, muted |
| Table row name | 13px | normal | Crimson Text |
| Table row notes | 11px | normal | muted |
| Prose blocks (Appearance, Biography) | 14px | normal | italic, 1.55 line-height, on ruled paper |

### Spacing & Borders
- Sheet outer width × height (the prototype): **880 × 760**.
- Sidebar width: **140px**.
- Paper card padding: **18px 22px 20px**, gap `12px` between sections.
- Section card border: `1px solid #7a6b56` with `0 1px 3px rgba(0,0,0,0.1)` shadow.
- Section header: `6px 10px` padding, `1px solid #7a6b56` bottom border, `rgba(0,0,0,0.03)` tint.
- Dashed-field card border: `1px dashed #7a6b56` (used for stamp fields, coin pouches, combat stat tiles).
- Table row separator: `1px dotted #c8b890`.
- Stat panel: 8px 4px 6px padding; prime `2px solid #a02a2a` border; non-prime `1px dashed #7a6b56` border.
- Stat panel rotation: prime `rotate(-0.4deg)`, non-prime `rotate(0.2deg)`. (Each stat panel is independently rotated; do not rotate the row.)

### Decorative Details
- **Folded corner on the paper card:** `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)`.
- **Tape strip** at the top-center of the paper card: 110×18, `rgba(220,200,150,0.7)` with a 135° striped overlay, `rotate(-1.2deg)`.
- **Portrait tape:** 36×12 strip across the top of the avatar, `rotate(-2deg)`.
- **Pinned section indicator:** a 14×14 round red push-pin centered above sections marked `pinned` (Resources on Combat tab, Biography on Description tab). Background: `radial-gradient(circle at 35% 30%, #ff6868, #b02020)` with shadow.
- **PRIME stamp:** absolute, top:-8 right:-6, ink-red fill on cream text, `rotate(8deg)`, 1px white border. Placed only on prime ability stats.
- **Ruled paper background** (Appearance / Biography): `repeating-linear-gradient(transparent 0 22px, #c8b890 22px 23px)` offset 6px down.
- **Wood-mat texture:** outer container uses `radial-gradient(ellipse at 20% 30%, rgba(120,90,60,0.4), transparent 70%)` layered with `repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px)` to suggest wood grain.

## Layout Architecture

### Window Chrome
1. **Title bar** (height ≈ 32px): dark gradient. Left: character name in caps + small ◆ glyph. Right: `⚙ Sheet`, `◐ Token`, `✕ Close`. These should map to existing Foundry window controls.
2. **Body**: horizontal flex — sidebar (140px) + content (flex 1).

### Sidebar (replaces existing horizontal tabs)
Vertical column, dark gradient. Five tabs:

| Glyph | Label | Key |
|---|---|---|
| ⚔ | Combat | combat |
| ✦ | Abilities | abilities |
| ⚒ | Equipment | equipment |
| ✶ | Spells | spells |
| ☙ | Description | desc |

Active tab: cream background, ink-red 3px left border, italic Crimson Text 600, glyph in ink red. Inactive tabs: transparent background, muted cream text.

Bottom of sidebar: identity strip with character name, level/class, race — small muted-cream meta text on top of a 1px divider.

### Paper Card (per-tab content area)
Inside the body, padded by 14px, the content area is a single paper card (cream / parchment) with the folded-corner clip-path and tape strip. **Every tab renders the SheetHeader at the top, then tab-specific content below.**

### Sheet Header (shared across all tabs)
Horizontal row:
- **Portrait** 64×64, dashed-line cream background with diagonal hatch pattern, 2px muted border, tape strip across top, ☻ glyph as placeholder. Replace with the character's actor image.
- **Identity block**: large italic ink-red character name with red underline; below it a wrap of dashed-border "stamp fields" — HP, LVL, CLASS, RACE, DEITY, TITLE, DISPOSITION, XP. Each stamp field: small uppercase muted label above a Crimson Text value, all inside a `1px dashed #7a6b56` box on `rgba(255,255,255,0.4)`.

## Tab Specifications

### 1. Combat Tab
Vertical stack:
1. **Six-up stat panel grid** (STR, DEX, CON, INT, WIS, CHA). Each panel shows the abbreviation, score, modifier, and the word "ROLL" — clicking the panel rolls a d20 against that ability. Prime stats use a 2px ink-red border, slight glow shadow, the rotated PRIME stamp, and the slight reverse rotation. Non-prime stats use a dashed muted border.
2. **Two-column layout** below the stats: left column wider (1.5fr), right (1fr).
   - **Left column:**
     - **Combat stat row** — four dashed tiles: AC, Base to Hit, Move, Class HD.
     - **Weapons section** — table: Weapon · Atk · Dmg · Notes · Roll. The Atk column is bold ink red; Dmg is monospace; the Roll column shows ⚄ as a click-to-roll affordance.
     - **Armor section** — table: Armor · AC · Notes.
   - **Right column:**
     - **Trackable Resources** — pinned section. List of resources, each row: italic Crimson Text name on the left, **pip tracker** on the right. Filled (ink-red) pips = remaining; empty (outlined) pips = used. (Do not show numeric counters — pips replace number fields per the design direction.)

### 2. Character Abilities Tab
Single section "Special Abilities & Class Features" filling the card. Table columns: Feature (italic Crimson Text with leading ✦), Description (body), Roll (monospace; muted "—" for non-rollable, ink red when there is a formula like `d20`), Actions (✎ edit, 🗑 delete). Each row separated by dotted line, top-aligned.

### 3. Equipment Tab
Vertical stack:
1. **Currency row** — five dashed tiles: Platinum, Gold, Silver, Copper, Valuables. Each metal tile shows a small colored coin dot in the top-right corner. Valuables tile is wider and shows free text in italic Crimson Text.
2. **Equipment section** — header right side shows `Load: <total> lbs` and `+ Add`. Table columns: Qty (mono `×N`), Item (Crimson Text), Weight (right-aligned mono), Actions.

### 4. Spells Tab
Vertical stack:
1. **Spell Slots strip** — dashed-border tile spanning full width. Header row: title "Spell Slots" + helper text "Filled = used · Open = available". Below: 10-column grid (levels 0–9). Each column shows the level number and a row of pips. Empty levels (0 total) show an em-dash.
2. **Spells Known & Prepared** section. Grouped by spell level. Each level group has a tinted band with "Level N" in italic ink red on the left and "Prepared" muted-uppercase label on the right. Within each group, rows of: prepared checkbox (16×16 ink-red box, ✓ when prepared), spell name + one-line description, "Cast" button (dashed border, ink red), row actions.

### 5. Description Tab
Vertical stack:
1. **Five-up fact tiles**: Size, Height, Gender, Weight, Age — dashed border tiles, label above value.
2. **Languages + Hometown** — two dashed tiles, italic Crimson Text values.
3. **Two-column prose row**: Appearance (left) and Biography & Notes (right, pinned). Each prose card uses **ruled-paper** background and italic Crimson Text 14px to feel handwritten.

## Interactions & Behavior

| Interaction | Behavior |
|---|---|
| Click sidebar tab | Swap visible tab content; persist active tab on the actor flag (so the sheet reopens to the last tab) |
| Click stat panel | Roll d20 + ability modifier (use existing system roll handler) |
| Click ⚄ on weapon row | Roll attack + damage for that weapon |
| Click "Cast" on spell | Trigger spell cast flow (existing system handler) |
| Click prepared checkbox | Toggle prepared state on the spell |
| Click pip on a resource | Toggle that pip used/available |
| Click "+ Add" | Open the existing Add Item / Add Spell / Add Feature dialog |
| Click ✎ / 🗑 in row actions | Existing edit / delete behavior |
| Tweaks: parchment toggle | (Prototype-only — discard. Default to parchment ON in production.) |

No animations are required. Tab switches can be instant.

## Component Inventory (for reuse / Handlebars partials)
- `WindowChrome` — title bar with character name + window controls
- `Sidebar` — vertical tab strip + bottom identity card
- `PaperCard` — folded-corner card with tape strip
- `SheetHeader` — portrait + name + stamp-field grid
- `StampField(label, value)` — dashed-border labeled value box
- `StatPanel(stat)` — rotated stat card with PRIME stamp variant
- `Section(title, action, pinned)` — generic section card with optional push-pin
- `Pips(used, max)` — pip tracker (filled = remaining)
- `RowActions` — ✎ + 🗑 cluster
- `RuledProse(text)` — ruled-paper italic text block

## Implementation Notes for the Foundry System
- Replace the prototype's React components with Handlebars templates rendered by the existing `ActorSheet`/`CharacterSheet` class.
- Map data via the existing schema; the placeholder values in `character-sheet.jsx` show the shape of each field.
- The current sheet's horizontal tab strip should be removed and replaced with the vertical sidebar. Foundry's built-in `Tabs` controller can drive `data-tab` switching.
- Existing roll macros, spellcasting, and item-management flows are unchanged — wire the click handlers in `activateListeners` to the controls described above.
- The prototype's "Tweaks" panel and `tweaks-panel.jsx` are tooling for the design exploration; do **not** ship them.
- Fonts (Crimson Text, IBM Plex Sans) are loaded from Google Fonts in the prototype. In the system, either include them as packaged assets or rely on a CSS @import in the system stylesheet.

## Open Questions for the Developer
- Are the current sheet's content fields a 1:1 match with the system's existing template variables? If new fields are needed (e.g., the Title or Disposition stamp fields), confirm they already exist on the actor schema.
- Should the sheet remain at 880px or scale to the user's window? Recommend making the outer frame fluid and only fixing the sidebar width.
- Confirm any accessibility constraints (font size minimums, tab keyboard navigation).
