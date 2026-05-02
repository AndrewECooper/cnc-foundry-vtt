# Design Document: Monster Sheet Visual Redesign

## Overview

This document describes the technical design for the "Tabletop Hybrid" visual redesign of the Castles & Crusades Foundry VTT Monster (NPC/Bestiary) sheet. The scope is strictly look and feel: restructuring the HTML layout and adding new CSS component styles. No data model changes, no new JavaScript, no new Foundry API usage.

The reference prototype lives in `design_handoff_monster_sheet/` (React/JSX). The task is to translate that prototype into Handlebars templates and CSS inside the existing system, preserving every functional hook that `TlgccActorSheet` depends on.

The monster sheet shares all design tokens, fonts, and base CSS component classes with the character sheet redesign already implemented in `castles_crusades.css`. Monster-specific variants are added under the `.cc-monster-*` prefix only where the monster sheet genuinely diverges from the character sheet.

### Key constraints

- Edit `src/` only. Rollup copies `src/templates/`, `src/styles/`, and `src/assets/` verbatim to `dist/`.
- `src/module/sheets/actor-sheet.ts` requires no changes. `defaultOptions.width` is already 880.
- All existing `.rollable`, `.item-edit`, `.item-delete`, `.item-create`, `.spell-prepare`, `name="system.*"`, `data-edit="img"`, `data-group`, `data-tab`, `data-roll`, `data-roll-type`, `data-attack`, `data-label`, `data-change`, `data-item-id`, `data-type`, `data-spell-level-value`, and `data-roll-type="monster-save"` attributes must be preserved exactly.
- The Foundry `Tabs` controller (`navSelector: ".sheet-tabs"`, `contentSelector: ".sheet-body"`, `initial: "combat"`) continues to drive tab switching without any JS changes.

---

## Architecture

The redesign touches two layers:

1. **CSS** — new `.cc-monster-*` component styles appended to `castles_crusades.css`, scoped under `.tlgcc`, reusing all existing `.cc-*` tokens and components from the character sheet redesign.
2. **HTML** — two Handlebars template files restructured to use the new layout and component classes: `actor-monster-sheet.html` (root) and `src/templates/actor/parts/monster-combat.html` (combat partial). The spells partial (`actor-spells.html`) is reused as-is.

No new TypeScript files. No new Handlebars helpers. No changes to the data model or system manifest.

### Dependency graph

```
castles_crusades.css
  ├── (existing) CSS custom properties on .tlgcc — reused unchanged
  ├── (existing) @font-face: Crimson Text, IBM Plex Sans — reused unchanged
  ├── (existing) .cc-* component rules — reused unchanged
  └── (new) .cc-monster-* rules — monster-specific variants only

actor-monster-sheet.html  (root template)
  ├── .cc-sheet-body
  │   ├── .cc-sidebar
  │   │   ├── nav.sheet-tabs (Foundry Tabs controller — unchanged selector)
  │   │   │   ├── a[data-tab=combat]      ⚔ Combat
  │   │   │   ├── a[data-tab=spells]      ✶ Spells
  │   │   │   └── a[data-tab=description] ☙ Description
  │   │   └── .cc-sidebar-identity (monster name, size/type, HD/disposition)
  │   └── .cc-paper-card
  │       ├── .cc-monster-bestiary-stamp (decorative corner badge)
  │       ├── .cc-sheet-header (portrait + stamp fields)
  │       └── section.sheet-body (Foundry Tabs content — unchanged selector)
  │           ├── .tab[data-tab=combat]       → monster-combat.html partial
  │           ├── .tab[data-tab=spells]       → actor-spells.html partial (reused)
  │           └── .tab[data-tab=description]  → inline description content
```

The Foundry `Tabs` controller finds the nav via `.sheet-tabs` and the content panes via `.sheet-body`. Both selectors are unchanged; only the nav moves from a horizontal strip at the top of the form into the sidebar column.

---

## Components and Interfaces

### Reused Character Sheet Components (no changes needed)

The following CSS classes and their rules are already present in `castles_crusades.css` and are used directly by the monster sheet without modification:

| Class | Purpose |
|---|---|
| `.cc-sheet-body` | Top-level flex row container |
| `.cc-sidebar` | 140px dark gradient sidebar |
| `.cc-sidebar-identity` | Bottom identity strip in sidebar |
| `.cc-sidebar-name` | Monster name in sidebar (Crimson Text 13px cream) |
| `.cc-sidebar-meta` | Size/type and HD/disposition lines (IBM Plex Sans 10px muted) |
| `.cc-paper-card` | Parchment content area with folded corner and tape strip |
| `.cc-sheet-header` | Portrait + identity flex row |
| `.cc-portrait` | 64×64 portrait wrapper with tape strip pseudo-element |
| `.cc-identity` | Name + stamp fields column |
| `.cc-char-name` | 30px italic ink-red name input |
| `.cc-stamp-row` | Wrapping flex row for stamp fields |
| `.cc-stamp-field` | Dashed-border labeled input tile |
| `.cc-stamp-label` | 8px uppercase muted label |
| `.cc-stamp-inputs` | Flex row for split inputs (e.g., HP cur/max) |
| `.cc-section` | Bordered section card |
| `.cc-section--pinned` | Section card with push-pin decoration |
| `.cc-section-header` | Section card header row |
| `.cc-section-title` | Italic Crimson Text section title |
| `.cc-add-btn` | "+ Add" anchor link |
| `.cc-table` | Styled data table |
| `.cc-ruled-prose` | Ruled-paper prose container |
| `.cc-ruled-prose-body` | Prose body with ruled-paper background |
| `.cc-spell-slots` | Spell slots strip container |
| `.cc-slot-grid` | 10-column spell slot grid |
| `.cc-slot-tile` | Individual spell slot tile |
| `.cc-spell-level-header` | Tinted level band header |
| `.cc-item-img` | 24×24 item image in tables |
| `.cc-attack-btns` | Attack button flex row |
| `.sheet-tabs .item` | Sidebar tab link (inactive) |
| `.sheet-tabs .item.active` | Sidebar tab link (active) |

### New Monster-Specific CSS Components

These classes are added to `castles_crusades.css` under a `/* === Monster Sheet === */` section, all scoped under `.tlgcc`.

#### `.cc-monster-bestiary-stamp`

Decorative rotated corner badge on the paper card.

```css
.tlgcc .cc-monster-bestiary-stamp {
  position: absolute;
  top: 16px;
  right: 30px;
  transform: rotate(8deg);
  border: 2px solid var(--cc-accent);
  color: var(--cc-accent);
  padding: 3px 10px;
  font-family: "Crimson Text", Georgia, serif;
  font-size: 11px;
  font-style: italic;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: rgba(255, 250, 235, 0.4);
  opacity: 0.55;
  pointer-events: none;
  z-index: 1;
}
```

#### `.cc-monster-stat-grid` and `.cc-monster-stat-tile`

6-column grid for the saving-throw stat tiles on the combat tab. Uses the non-prime dashed style only — monsters have no PRIME concept.

```css
.tlgcc .cc-monster-stat-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.tlgcc .cc-monster-stat-tile {
  padding: 6px 4px;
  text-align: center;
  background: var(--cc-plain);
  border: 1px dashed var(--cc-muted);
  transform: rotate(0.2deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}

.tlgcc .cc-monster-stat-tile:hover {
  border-color: var(--cc-accent);
}

.tlgcc .cc-monster-stat-abbr {
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--cc-muted);
}

.tlgcc .cc-monster-stat-value {
  font-family: "Crimson Text", Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--cc-text);
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
  text-align: center;
}

.tlgcc .cc-monster-stat-roll {
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--cc-muted);
}
```

#### `.cc-monster-combat-row` and `.cc-monster-combat-tile`

5-column row for the core combat stat tiles (AC, BTH, Move, Attacks, Sanity).

```css
.tlgcc .cc-monster-combat-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.tlgcc .cc-monster-combat-tile {
  background: var(--cc-plain);
  border: 1px dashed var(--cc-muted);
  padding: 7px 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.tlgcc .cc-monster-combat-tile .cc-stamp-label {
  display: block;
}

.tlgcc .cc-monster-combat-tile input {
  font-family: "Crimson Text", Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--cc-text);
  background: transparent;
  border: none;
  padding: 0;
  text-align: center;
  width: 100%;
}

/* Attacks tile: smaller font for text routine */
.tlgcc .cc-monster-combat-tile--attacks input {
  font-size: 14px;
  font-weight: 400;
}
```

#### `.cc-monster-desc-tiles` and `.cc-monster-desc-tile`

4-column grid for the Biome, Climate, Type, Size tiles on the description tab.

```css
.tlgcc .cc-monster-desc-tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.tlgcc .cc-monster-desc-tile {
  background: var(--cc-plain);
  border: 1px dashed var(--cc-muted);
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tlgcc .cc-monster-desc-tile input {
  font-family: "Crimson Text", Georgia, serif;
  font-size: 14px;
  font-style: italic;
  color: var(--cc-text);
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
}
```

#### `.cc-monster-desc-prose`

Full-width prose layout for the description tab.

```css
.tlgcc .cc-monster-desc-prose {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tlgcc .cc-monster-desc-prose .cc-ruled-prose {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
```

#### `.cc-monster-spells-empty`

Empty state for the spells tab when the monster has no spells.

```css
.tlgcc .cc-monster-spells-empty {
  padding: 40px 24px;
  text-align: center;
}

.tlgcc .cc-monster-spells-empty-title {
  font-family: "Crimson Text", Georgia, serif;
  font-size: 18px;
  font-style: italic;
  margin-bottom: 6px;
  color: var(--cc-muted);
}

.tlgcc .cc-monster-spells-empty-hint {
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-size: 12px;
  color: var(--cc-muted);
}
```

### HTML Template Structure

#### `actor-monster-sheet.html` (root template)

The root template is restructured from the current flat header+nav+body layout to the sidebar+paper-card layout. The `<form>` retains its existing classes (`tlgcc sheet actor monster flexcol`) but the interior is replaced.

Key structural changes from the current template:
- The `<header class="sheet-header">` block is removed and replaced with `.cc-sheet-header` inside `.cc-paper-card`.
- The `<nav class="sheet-tabs">` moves from a top-level sibling of `.sheet-body` into `.cc-sidebar`.
- The `<section class="sheet-body">` moves inside `.cc-paper-card`.
- The description tab content moves from a bare `{{editor}}` call to a structured `.cc-monster-desc-tiles` + `.cc-monster-desc-prose` layout.

Sidebar identity strip fields:
- Monster name: `{{actor.name}}`
- Size · Type: `{{system.size.value}} {{system.type.value}}`
- HD · Disposition: `HD {{system.hitDice.number}}{{system.hitDice.size}} · {{system.alignment.value}}`

Sheet header stamp fields (in order): HD, HP, SAVES, NUMBER, INT, DISPOSITION, TREASURE, XP.

The HD stamp tile contains three separate inputs for `system.hitDice.number`, `system.hitDice.size`, and `system.hitDice.mod` (preserving the existing bindings), displayed inline as `<number><size>+<mod>`.

The Bestiary Stamp text is `Bestiary · No. {{actor.id}}` — using the Foundry actor ID as the bestiary number. A null-guard is applied: `{{#if actor.id}}Bestiary · No. {{actor.id}}{{else}}Bestiary{{/if}}`.

#### `monster-combat.html` (combat partial)

The combat partial is restructured from the current flat `<div class="section resources">` + two `<ol class="items-list">` layout to the new component structure. The features partial is inlined (not included via `{{>}}`) so that `.cc-section--pinned` can be applied to the Special Abilities section without modifying the shared `actor-features.html` partial.


---

## Data Models

No data model changes. All fields used in the redesigned templates map directly to the existing monster schema:

| Component | Field path(s) |
|---|---|
| Portrait | `actor.img` |
| Monster name | `actor.name` (via `name="name"`) |
| Bestiary stamp number | `actor.id` (read-only display) |
| HD stamp | `system.hitDice.number`, `system.hitDice.size`, `system.hitDice.mod` |
| HP stamp | `system.hitPoints.value`, `system.hitPoints.max` |
| SAVES stamp | `system.msaves.value` |
| NUMBER stamp | `system.numberAppearing.value` |
| INT stamp | `system.monsterINT.value` |
| DISPOSITION stamp | `system.alignment.value` |
| TREASURE stamp | `system.treasureType.value` |
| XP stamp | `system.xp.value` |
| Sidebar size/type | `system.size.value`, `system.type.value` |
| Sidebar HD/disposition | `system.hitDice.number`, `system.hitDice.size`, `system.alignment.value` |
| Stat tiles | `system.abilities.{str,dex,con,int,wis,cha}.{value,label}` |
| AC tile | `system.armorClass.value` |
| BTH tile | `system.attackBonus.value` |
| Move tile | `system.move.value` |
| Attacks tile | `system.attacks.value` |
| Sanity tile | `system.sanity.value` |
| Weapons | `weapons` context array (from `_prepareItems`) |
| Armors | `armors` context array (from `_prepareItems`) |
| Features | `features` context array (from `_prepareItems`) |
| Spell slots | `system.spellsPerLevel.value` (array, index = level) |
| Spells | `spells` context array (from `_prepareItems`) |
| Biome tile | `system.biome.value` |
| Climate tile | `system.climate.value` |
| Type tile | `system.type.value` |
| Size tile | `system.size.value` |
| Biography | `system.biography` (rich text) |

### Open questions resolved

**Tactics / Ecology fields:** The current data model has no separate Tactics or Ecology fields. Per Requirement 9.4, the right column of the description tab is omitted and the Description (biography) block spans the full width. If Tactics/Ecology fields are added in a future migration, the description tab layout can be updated to a two-column grid at that time.

**Bestiary stamp number:** The stamp uses `actor.id` (the Foundry document ID). This is always available, requires no new field, and gives each monster a unique identifier. A dedicated `system.bestiaryNumber` field can be added later if a sequential index is needed.

**Empty spells tab:** The Spells tab is always shown in the sidebar for all monsters. When the monster has no spells, the tab content shows the empty state message. This avoids conditional sidebar rendering, which would require JavaScript changes.

**`hasSpells` context variable:** The empty state in the spells tab is controlled by a `hasSpells` boolean added to the monster context in `_prepareMonsterData`. This is a one-line addition (`context.hasSpells = context.spells.some(level => level.length > 0)`) and is the only change to `actor-sheet.ts`. If this is considered out of scope, the empty state message can be omitted and the tab will simply show the spell slots strip and an empty spells section.

---

## Tab Content Specifications

### Combat Tab (`monster-combat.html`)

```
.tab.combat
  .cc-monster-stat-grid
    .cc-monster-stat-tile × 6  (STR, DEX, CON, INT, WIS, CHA)
      — each: .rollable with data-roll-type="monster-save"
  .cc-monster-combat-row
    .cc-monster-combat-tile (AC)
    .cc-monster-combat-tile (Base to Hit)
    .cc-monster-combat-tile (Move)
    .cc-monster-combat-tile.cc-monster-combat-tile--attacks (Attacks)
    .cc-monster-combat-tile (Sanity)
  .cc-section "Weapons & Natural Attacks"
    .cc-table (header + {{#each weapons}} rows)
  .cc-section "Armor"
    .cc-table (header + {{#each armors}} rows)
  .cc-section.cc-section--pinned "Special Abilities"
    .cc-table (inlined features table — same structure as actor-features.html)
```

**Stat tile roll behavior:** The existing `_rollMonsterSave()` handler fires on any `.rollable[data-roll-type="monster-save"]` click. Each stat tile gets this class and attribute. The handler uses `system.hitDice.number` for the save bonus — it does not use the individual ability score values. This is correct C&C monster save behavior and requires no change to `actor-sheet.ts`.

**Weapons table columns:** Attack (item image + name) · Atk/Dmg (melee button + ranged button + `/` + damage button) · Actions (item-edit, item-delete). The existing `<a class="rollable attack-button">` elements with their `data-roll-type`, `data-attack`, `data-roll`, `data-label` attributes are preserved exactly — only wrapped in the new `.cc-table` structure.

**Armor table columns:** Armor (item image + name) · AC · Actions.

**Special Abilities:** The features table is inlined in `monster-combat.html` (not included via `{{>}}`) so that `.cc-section--pinned` can be applied directly. The table structure is identical to `actor-features.html` — same columns (Feature · Formula · Actions), same `.rollable`, `.item-edit`, `.item-delete`, `.item-create` classes, same `data-*` attributes.

### Spells Tab

The spells tab in `actor-monster-sheet.html` includes `actor-spells.html` via `{{> "systems/castles-and-crusades/templates/actor/parts/actor-spells.html"}}`. No changes to that partial are needed.

The empty state is rendered conditionally using `hasSpells`:

```handlebars
{{#unless hasSpells}}
<div class="cc-monster-spells-empty">
  <div class="cc-monster-spells-empty-title">No spells known.</div>
  <div class="cc-monster-spells-empty-hint">
    Spellcasting monsters list known spells grouped by level here,
    with prepared toggles and Cast affordances.
  </div>
</div>
{{/unless}}
{{> "systems/castles-and-crusades/templates/actor/parts/actor-spells.html"}}
```

When `hasSpells` is false, the empty state shows above the (empty) spell slots strip. When true, only the spell content renders.

### Description Tab

```
.tab.biography
  .cc-monster-desc-tiles
    .cc-monster-desc-tile (Biome)   — name="system.biome.value"
    .cc-monster-desc-tile (Climate) — name="system.climate.value"
    .cc-monster-desc-tile (Type)    — name="system.type.value"
    .cc-monster-desc-tile (Size)    — name="system.size.value"
  .cc-monster-desc-prose
    .cc-ruled-prose
      .cc-section-header "Description"
      .cc-ruled-prose-body
        {{editor system.biography target="system.biography" button=true owner=owner editable=editable}}
```

All `name="system.*"` attributes on the tile inputs are preserved. The `{{editor}}` helper call is unchanged from the current template.

---

## Error Handling

This feature has no new runtime logic, so there are no new error paths to handle. The relevant failure modes are all build-time or load-time:

**Font files missing from `src/styles/`**
The browser silently falls back to the next font in the stack (Georgia for Crimson Text, system-ui for IBM Plex Sans). The fonts are already present from the character sheet redesign — this is not a new risk.

**CSS `clip-path` not supported**
`clip-path: polygon(...)` has broad support in Chromium-based Foundry clients. No fallback needed.

**Functional hook accidentally removed**
If a `name="system.*"` attribute or a `.rollable`/`.item-edit`/etc. class is omitted during template restructuring, Foundry's form submission or event listeners silently fail. Mitigation: the task list includes an explicit audit step comparing each redesigned template against the original before marking the task complete.

**`actor.id` unavailable for Bestiary Stamp**
`actor.id` is always available in the Foundry template context. The null-guard `{{#if actor.id}}` handles any edge case gracefully.

**`hasSpells` not added to context**
If the `hasSpells` addition to `_prepareMonsterData` is deferred, the `{{#unless hasSpells}}` block evaluates as truthy (undefined is falsy in Handlebars, so `#unless` would show the empty state always). The fix: either add `hasSpells` or remove the `{{#unless}}` block and accept no empty state message.

---

## Testing Strategy

Property-based testing is not applicable to this feature. The feature consists entirely of HTML template restructuring and CSS authoring — UI rendering and layout work. There is no pure function logic, no data transformation, and no input space that benefits from randomized iteration. This is explicitly one of the cases where PBT should not be used (UI rendering and layout).

All acceptance criteria in the requirements document classify as SMOKE tests (one-time configuration/structural checks), EXAMPLE tests (specific scenario verification), or INTEGRATION tests (Foundry runtime behavior). None meet the criteria for property-based testing.

### 1. Template Audit (manual, pre-merge)

Before marking any template task complete, diff the redesigned template against the original and verify:

- Every `name="system.*"` attribute present in the original is present in the redesign.
- Every `.rollable`, `.item-edit`, `.item-delete`, `.item-create`, `.spell-prepare` class is present.
- Every `data-roll`, `data-roll-type`, `data-attack`, `data-label`, `data-change`, `data-item-id`, `data-type`, `data-spell-level-value` attribute is present.
- `data-roll-type="monster-save"` is on the SAVES label in the header and on each stat tile.
- `data-edit="img"` is on the portrait `<img>`.
- `data-group="primary"` is on the `<nav>` and `data-tab` is on every tab link and content div.
- All `{{editor}}` and `{{localize}}` helper calls are unchanged.

This audit is the primary correctness gate for Requirement 10.

### 2. Build Verification (automated, CI)

`npm run build` must complete without errors. Verify:
- All modified files appear in `dist/templates/` and `dist/styles/`.
- TypeScript compilation succeeds (if `hasSpells` is added to `actor-sheet.ts`).

### 3. Visual Smoke Test (manual, in Foundry)

Open a monster sheet in Foundry after deploying the build:
- All three tabs are accessible and switch correctly.
- The sidebar renders with the dark gradient, correct tab glyphs (⚔ ✶ ☙), and monster identity strip.
- The paper card renders with parchment background and folded corner.
- The bestiary stamp appears in the top-right corner of the paper card.
- The sheet header shows portrait, monster name, size/type subtitle, and all eight stamp fields.
- Fonts load (Crimson Text visible on monster name and stat values; IBM Plex Sans on labels).
- No console errors related to missing templates or styles.

### 4. Functional Regression Test (manual, in Foundry)

After visual smoke test passes:
- Click each saving-throw stat tile — confirm roll dialog appears with correct formula.
- Click melee/ranged/damage buttons on a weapon — confirm roll dialog appears.
- Click the SAVES stamp field label — confirm monster save roll dialog appears.
- Edit a weapon, armor, or feature — confirm item sheet opens.
- Delete an item — confirm it is removed.
- Edit the monster name and HP — confirm values save on close/reopen.
- Click the portrait — confirm file picker opens.
- Switch to the Spells tab — confirm spell slots strip renders; confirm empty state shows for a monster with no spells.
- Switch to the Description tab — confirm Biome/Climate/Type/Size tiles render; confirm biography editor is accessible.

### 5. Cross-tab Layout Check (manual)

Switch to each of the three tabs and confirm:
- No layout overflow or clipping of content.
- Stat tiles render in a 6-column row with correct dashed borders and slight rotation.
- Combat tiles render in a 5-column row; Attacks tile uses smaller font.
- Special Abilities section has the push-pin decoration.
- Ruled-paper background appears in the biography editor.
- Description tiles render with italic Crimson Text values.
