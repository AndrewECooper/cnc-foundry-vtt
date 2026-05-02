# Handoff: Castles & Crusades Monster Sheet — Visual Refresh

## Overview
Visual redesign of the Monster (NPC/Bestiary) sheet in the Castles & Crusades Foundry VTT system. Three tabs: **Combat**, **Spells**, **Description**. Same "Tabletop Hybrid" visual language as the Character Sheet — paper card on a wood mat, vertical sidebar tabs, dashed stamp fields, ruled-paper prose, masking-tape and pinned-paper details.

**Content and data fields are unchanged** from the existing system; only look and feel are updated.

## About the Design Files
The bundled HTML/JSX is a **design reference prototype**, not production code. Recreate the visuals inside the existing Foundry system codebase using its established patterns (Handlebars templates, the system's data schema, existing roll handlers). Do not introduce React.

## Fidelity
**High fidelity.** Reproduce colors, typography, spacing, dashed/dotted borders, slight rotations, tape strips, push-pin, and the "Bestiary · No. 037" rotated corner stamp pixel-close. Sample data ("Ralf") is placeholder — bind real monster fields in its place.

## Files in This Bundle
- `Monster Sheet.html` — prototype shell
- `monster-sheet.jsx` — all three tabs, layout, tokens, components
- `tweaks-panel.jsx` — design-only tooling (do **not** ship)

## Consistency With the Character Sheet
The Monster Sheet shares **all** design tokens, fonts, and component patterns with the Character Sheet handoff (`design_handoff_character_sheet/`). If both are being implemented, extract the shared tokens and partials into a single system stylesheet/component library:

- `WindowChrome`, `Sidebar`, `PaperCard`, `SheetHeader`, `StampField`, `Section`, `Pips`, `RowActions`, `RuledProse`, `AddBtn`
- All color, type, and spacing tokens (see Character Sheet README §Design Tokens)
- The vertical sidebar pattern (active-tab styling, identity strip at the bottom)
- The wood-mat outer container, the paper card with folded-corner clip-path and tape strip

## Sheet-Specific Differences From the Character Sheet

### Window Chrome
A small **BESTIARY** badge sits to the right of the monster name in the title bar:
- Padding `1px 7px`, font 9px, 1.5px letter-spacing, IBM Plex Sans
- Background `rgba(160,42,42,0.4)`, border `1px solid rgba(255,200,180,0.3)`, color `#f0d8c0`

### Decorative Corner Stamp on the Paper Card
Top-right of the paper card:
- Text: `Bestiary · No. <id>` in italic Crimson Text 11px, uppercase, 1.5px letter-spacing
- 2px solid ink-red (`#a02a2a`) border, 3px 10px padding, cream wash background
- `rotate(8deg)`, `opacity: 0.55`
- The number is sourced from the monster's bestiary entry / actor flag.

### Sidebar Tabs (only three)
| Glyph | Label | Key |
|---|---|---|
| ⚔ | Combat | combat |
| ✶ | Spells | spells |
| ☙ | Description | desc |

Sidebar identity strip (bottom): italic monster name, then `<Size> <Type>`, then `HD <level><die> · <Disposition>`.

### Sheet Header (shared across tabs)
Same portrait + identity layout, but:
- After the italic monster name, append a small uppercase muted line: `<Size> · <Type>`.
- Stamp fields shown: **HD**, **HP**, **SAVES**, **NUMBER**, **INT**, **DISPOSITION**, **TREASURE**, **XP**.
  - HD value is `<level><die>` (e.g. `1d8`).
  - INT field shows the monster's intelligence shorthand (Animal, Average, P, etc.).
  - SAVES shows the monster's save category (Physical, Mental, etc.).

## Tab Specifications

### 1. Combat Tab
Vertical stack:
1. **Saving-throw stats grid** (6-up): STR, DEX, CON, INT, WIS, CHA.
   - Each tile: dashed muted border, slight `rotate(0.2deg)`, click-to-roll.
   - Layout: small uppercase abbreviation, large Crimson Text 22px score, "ROLL" hint.
   - Unlike Character Sheet stats, monsters have **no PRIME concept** — all six tiles use the dashed (non-prime) variant.
2. **Core combat row** — four dashed tiles: AC, Base to Hit, Move, Attacks.
   - The Attacks tile shows the attack routine as text (e.g. "2 claws / 1 bite") at smaller 14px Crimson Text rather than the giant numeric value used in the other three.
3. **Weapons & Natural Attacks** — table (Weapon · Atk · Dmg · Notes · Roll). Same style as Character Sheet weapons table; "natural" is implied by the monster context.
4. **Armor** — table (Armor · AC · Notes). Armor row's AC column may use `+N` or absolute values depending on whether it's natural armor or worn.
5. **Special Abilities** — pinned section (red push-pin), full feature table: Feature · Description · Roll · Actions. Pinned because monster special abilities are usually the most important thing to keep in view during combat.

### 2. Spells Tab
Vertical stack:
1. **Spell Slots strip** — same 10-column pip strip as the Character Sheet. Levels with 0 total show an em-dash. Most monsters will show all dashes.
2. **Spells Known & Prepared** — section card. When the monster has spells, group them by level exactly like the Character Sheet's Spells tab (Level header band + rows of: prepared checkbox, name + description, Cast button, row actions).
3. **Empty state** (when no spells): centered italic Crimson Text 18px "No spells known." plus a small body-font hint about how the section will populate. Render this only when the spells collection is empty.

### 3. Description Tab
Vertical stack:
1. **Biome / Climate / Type / Size** — four dashed tiles, italic Crimson Text 14px values.
2. **Two-column prose layout** filling the rest of the card:
   - **Left column:** Description (single section, ruled paper).
   - **Right column:** stacked Tactics (pinned) + Ecology & Lore. Both ruled paper.
   - All three prose blocks use the shared `RuledProse` component.

## Field & Data Mapping
The current monster sheet template fields map onto the new design as follows:

| Existing field | New location |
|---|---|
| Name | Header (italic ink-red w/ underline) |
| Level / HD die / HP bonus | Header `HD` stamp = `<level><die>`; HP stamp `<cur>/<max>` |
| HP | Header HP stamp + (future) HP tracker — current design does not include an inline HP slider; reuse system's existing HP control or add later |
| Saves | Header SAVES stamp |
| Number | Header NUMBER stamp |
| INT | Header INT stamp |
| Treasure | Header TREASURE stamp |
| XP | Header XP stamp |
| Disposition | Header DISPOSITION stamp + sidebar identity strip |
| Size | Header subtitle + Description tab tile |
| Type | Header subtitle + Description tab tile |
| Attacks | Combat tab "Attacks" tile (text routine) |
| Biome | Description tab Biome tile |
| Climate | Description tab Climate tile |
| AC | Combat tab AC tile |
| Base to Hit | Combat tab BTH tile |
| Move | Combat tab Move tile |
| Weapons (items) | Weapons & Natural Attacks table |
| Armor (items) | Armor table |
| Special Abilities (features) | Special Abilities pinned section |
| Spells | Spells tab |
| Description | Description tab — Description prose |

If your data model doesn't currently distinguish Tactics or Ecology, treat them as optional rich-text fields that fall back to hidden if empty. Or extend the template to add them.

## Interactions & Behavior

| Interaction | Behavior |
|---|---|
| Click sidebar tab | Swap visible tab content; persist on the actor flag |
| Click saving-throw stat tile | Roll save (use existing system roll handler) |
| Click ⚄ on weapon row | Roll attack + damage |
| Click "Cast" on spell | Trigger spell cast flow |
| Click pip on a slot | Toggle used / available |
| Click "+ Add" | Open existing Add Item / Add Spell / Add Feature dialog |
| Click ✎ / 🗑 in row actions | Existing edit / delete |

No animations required.

## Design Tokens
Identical to the Character Sheet handoff. See `design_handoff_character_sheet/README.md` §Design Tokens for the full token table. Notable additions used only on this sheet:
- Bestiary badge background: `rgba(160,42,42,0.4)`
- Bestiary badge text: `#f0d8c0`
- Bestiary corner stamp opacity: `0.55`

## Open Questions
- The current monster template doesn't have separate Tactics / Ecology fields. OK to add them, or fold both into the existing Description?
- Should the Bestiary corner stamp number be auto-generated from a Bestiary index, or manually entered per monster?
- Should the empty Spells state suppress the entire tab from the sidebar for non-casters, or always show it?
