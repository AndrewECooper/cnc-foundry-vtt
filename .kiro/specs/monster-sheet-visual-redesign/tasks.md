# Implementation Plan: Monster Sheet Visual Redesign

## Overview

Translate the "Tabletop Hybrid" monster sheet prototype into production Handlebars templates and CSS. The work touches three files: `actor-monster-sheet.html` (root template), `monster-combat.html` (combat partial), and `castles_crusades.css` (new Monster Sheet section appended at the end). A one-line addition to `actor-sheet.ts` adds the `hasSpells` context variable. `actor-spells.html` and `actor-features.html` are reused unchanged.

Each template task includes an explicit audit step to verify all functional hooks are preserved before the task is marked complete.

## Tasks

- [x] 1. Add monster-specific CSS to `castles_crusades.css`
  - Append a `/* === Monster Sheet === */` section at the end of `src/styles/castles_crusades.css`, after all existing rules
  - All new rules must be scoped under `.tlgcc`
  - Add `.cc-monster-bestiary-stamp`: absolute positioned rotated corner badge (`top: 16px`, `right: 30px`, `rotate(8deg)`, `2px solid var(--cc-accent)`, `opacity: 0.55`, `pointer-events: none`)
  - Add `.cc-monster-stat-grid` (6-column grid, `gap: 8px`) and `.cc-monster-stat-tile` (dashed border, `rotate(0.2deg)`, flex column, centered) with `.cc-monster-stat-abbr`, `.cc-monster-stat-value` (22px Crimson Text 600), `.cc-monster-stat-roll` (9px uppercase muted)
  - Add `.cc-monster-combat-row` (5-column grid, `gap: 8px`) and `.cc-monster-combat-tile` (dashed border, `--cc-plain` bg, centered flex column) with input styled at 22px Crimson Text 600; add `.cc-monster-combat-tile--attacks` variant with 14px non-bold input
  - Add `.cc-monster-desc-tiles` (4-column grid, `gap: 8px`) and `.cc-monster-desc-tile` (dashed border, flex column) with 14px italic Crimson Text input
  - Add `.cc-monster-desc-prose` (flex column, `flex: 1 1 auto`, `min-height: 0`) and its `.cc-ruled-prose` child override
  - Add `.cc-monster-spells-empty` (centered, `padding: 40px 24px`) with `.cc-monster-spells-empty-title` (18px italic Crimson Text muted) and `.cc-monster-spells-empty-hint` (12px IBM Plex Sans muted)
  - Do NOT remove or modify any existing `.cc-*` rules
  - _Requirements: 1.1, 1.2, 5.3, 6.2, 6.4, 8.5, 9.3, 11.1, 12.1, 12.2, 12.3, 12.4_

- [x] 2. Add `hasSpells` to monster context in `actor-sheet.ts`
  - In `_prepareMonsterData()`, after the existing `_prepareItems()` call, add one line:
    `context.hasSpells = (context.spells as any[][]).some((level: any[]) => level.length > 0);`
  - This is the only change to `actor-sheet.ts`
  - Verify TypeScript compiles without errors (`npm run build`)
  - _Requirements: 8.5, 13.2_

- [x] 3. Restructure `actor-monster-sheet.html` — layout skeleton and sidebar
  - Read the current `actor-monster-sheet.html` in full before making any changes
  - Replace the interior of the `<form>` (keeping the `<form>` tag and its existing classes `{{cssClass}} {{actor.type}} flexcol`) with the new `.cc-sheet-body` flex layout
  - Add `.cc-sidebar` containing:
    - `<nav class="sheet-tabs tabs" data-group="primary">` with three `<a class="item" data-tab="...">` links: `⚔ Combat`, `✶ Spells`, `☙ Description` (each glyph in a `<span class="cc-tab-glyph">`)
    - `.cc-sidebar-identity` strip at the bottom showing monster name (`{{actor.name}}`), size · type line (`{{system.size.value}} · {{system.type.value}}`), and HD · disposition line (`HD {{system.hitDice.number}}{{system.hitDice.size}} · {{system.alignment.value}}`)
  - **Audit before marking complete:** confirm `data-group="primary"` is on the `<nav>`, `data-tab` is on all three `<a>` links, and the `<nav>` uses class `sheet-tabs tabs`
  - _Requirements: 2.1, 2.2, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 10.6_

- [x] 4. Restructure `actor-monster-sheet.html` — paper card, header, and bestiary stamp
  - Add `.cc-paper-card` (with `position: relative`) inside `.cc-sheet-body`, after `.cc-sidebar`
  - Inside `.cc-paper-card`, add:
    - `.cc-monster-bestiary-stamp` with text `{{#if actor.id}}Bestiary · No. {{actor.id}}{{else}}Bestiary{{/if}}`
    - `.cc-sheet-header` containing:
      - `.cc-portrait` with `<img class="profile-img" data-edit="img" src="{{actor.img}}" title="{{actor.name}}" width="96" height="96" />`
      - `.cc-identity` containing:
        - `<input class="cc-char-name" name="name" type="text" value="{{actor.name}}" />`
        - A small subtitle `<div>` showing `{{system.size.value}} · {{system.type.value}}`
        - `.cc-stamp-row` with eight `.cc-stamp-field` tiles: HD (three inputs for `system.hitDice.number`, `system.hitDice.size`, `system.hitDice.mod` inside `.cc-stamp-inputs`), HP (`system.hitPoints.value` / `system.hitPoints.max`), SAVES (`system.msaves.value` with `data-roll-type="monster-save"` on the label), NUMBER (`system.numberAppearing.value`), INT (`system.monsterINT.value`), DISPOSITION (`system.alignment.value`), TREASURE (`system.treasureType.value`), XP (`system.xp.value`)
  - **Audit before marking complete:** verify `data-edit="img"` on the portrait `<img>`; verify all eight `name="system.*"` attributes match the originals exactly; verify `data-roll-type="monster-save"` is on the SAVES label
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 10.1, 10.4, 10.5, 11.1_

- [x] 5. Restructure `actor-monster-sheet.html` — tab content panes
  - Inside `.cc-paper-card`, after `.cc-sheet-header`, add `<section class="sheet-body">` containing three tab `<div>` elements with `data-group="primary"` and the correct `data-tab` values
  - Combat tab (`data-tab="combat"`): include the combat partial `{{> "systems/castles-and-crusades/templates/actor/parts/monster-combat.html"}}`
  - Spells tab (`data-tab="spells"`): add the `{{#unless hasSpells}}` empty state block (`.cc-monster-spells-empty` with title and hint), then include `{{> "systems/castles-and-crusades/templates/actor/parts/actor-spells.html"}}`
  - Description tab (`data-tab="description"`): add `.cc-monster-desc-tiles` with four `.cc-monster-desc-tile` tiles (Biome `name="system.biome.value"`, Climate `name="system.climate.value"`, Type `name="system.type.value"`, Size `name="system.size.value"`), then `.cc-monster-desc-prose` containing `.cc-ruled-prose` with a `cc-section-header` "Description" and `.cc-ruled-prose-body` wrapping `{{editor system.biography target="system.biography" button=true owner=owner editable=editable}}`
  - Remove the old `<header class="sheet-header">` block entirely — it is replaced by `.cc-sheet-header` inside `.cc-paper-card`
  - **Audit before marking complete:** verify `data-group="primary"` on `<section class="sheet-body">`; verify `data-tab` on all three content `<div>` elements; verify all four `name="system.*"` attributes on description tile inputs; verify `{{editor}}` call is unchanged; verify `{{localize}}` calls are present on all labels
  - _Requirements: 2.6, 8.5, 9.1, 9.2, 9.4, 10.4, 10.6, 10.7_

- [x] 6. Checkpoint — build and template audit
  - Run `npm run build` and confirm it completes without errors
  - Confirm `dist/templates/actor/actor-monster-sheet.html` exists and reflects the changes
  - Confirm `dist/styles/castles_crusades.css` contains the new `/* === Monster Sheet === */` section
  - Ensure all tests pass, ask the user if questions arise before proceeding to the combat partial

- [x] 7. Restructure `monster-combat.html` — stat tiles and combat tiles
  - Read the current `monster-combat.html` in full before making any changes
  - Replace the existing `<div class="section resources grid grid-4col">` block with:
    - `.cc-monster-stat-grid` containing six `.cc-monster-stat-tile` elements, one per ability (STR, DEX, CON, INT, WIS, CHA); each tile has a `.rollable` anchor wrapping the content with `data-roll-type="monster-save"`, the `.cc-monster-stat-abbr` label, a `.cc-monster-stat-value` input bound to `system.abilities.{key}.value`, and a `.cc-monster-stat-roll` "ROLL" hint
    - `.cc-monster-combat-row` containing five `.cc-monster-combat-tile` elements: AC (`name="system.armorClass.value"`), Base to Hit (`name="system.attackBonus.value"`), Move (`name="system.move.value"`), Attacks (`name="system.attacks.value"`, add modifier class `.cc-monster-combat-tile--attacks`), Sanity (`name="system.sanity.value"`)
  - Preserve all existing `data-dtype`, `title`, and `{{localize}}` attributes on inputs
  - **Audit before marking complete:** verify `data-roll-type="monster-save"` is on each stat tile's `.rollable` element; verify all five `name="system.*"` attributes on combat tiles match the originals exactly; verify `title` tooltip on Sanity input is preserved
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 10.1, 10.4_

- [x] 8. Restructure `monster-combat.html` — weapons and armor section cards
  - Replace the first `<ol class="items-list">` (weapons) with a `.cc-section` containing:
    - `.cc-section-header` with `.cc-section-title` "Weapons & Natural Attacks" and an `.item-create.cc-add-btn` anchor with `data-type="weapon"`
    - `.cc-table` with `<thead>` (Attack · Atk/Dmg · Actions columns) and `<tbody>` with `{{#each weapons}}` rows; each row is a `<tr class="item" data-item-id="{{weapon._id}}">` containing the item image `<td>`, the attack buttons `<td>` (melee `.rollable.attack-button` with `data-roll-type="weapon" data-attack="melee"`, ranged `.rollable.attack-button` with `data-roll-type="weapon" data-attack="ranged"`, `/` separator, damage `.rollable.attack-button` with `data-roll-type="damage" data-roll data-label`), and item controls `<td>` (`.item-edit`, `.item-delete`)
  - Replace the second `<ol class="items-list">` (armors) with a `.cc-section` containing:
    - `.cc-section-header` with `.cc-section-title` "Armor" and an `.item-create.cc-add-btn` anchor with `data-type="armor"`
    - `.cc-table` with `<thead>` (Armor · AC · Actions) and `<tbody>` with `{{#each armors}}` rows preserving the existing AC display and `.item-edit`, `.item-delete` controls
  - **Audit before marking complete:** verify every `.rollable`, `data-roll-type`, `data-attack`, `data-roll`, `data-label` attribute from the original weapons list is present; verify `{{#unless weapon.canMelee}}disabled{{/unless}}` and `{{#unless weapon.canRanged}}disabled{{/unless}}` logic is preserved; verify `.item-create` anchors have correct `data-type`; verify `data-item-id` is on every item row
  - _Requirements: 7.1, 7.2, 7.6, 10.1, 10.2, 10.4_

- [x] 9. Restructure `monster-combat.html` — Special Abilities section (inlined features table)
  - After the armor section, add a `.cc-section.cc-section--pinned` containing:
    - `.cc-section-header` with `.cc-section-title` "Special Abilities" and an `.item-create.cc-add-btn` anchor with `data-type="feature"`
    - `.cc-table` with the same structure as `actor-features.html`: `<thead>` (Feature · Formula · Actions), `<tbody>` with `{{#each features}}` rows; each row is `<tr class="item" data-item-id="{{item._id}}">` with the item image + name cell (`.rollable` with `data-roll-type="item"`, `✦ <em>{{item.name}}</em>`), the formula cell (`.item-formula.item-prop.rollable` with `data-roll` and `data-label`), and item controls (`.item-edit`, `.item-delete`)
  - This table is inlined (not via `{{>}}`) so `.cc-section--pinned` can be applied directly; `actor-features.html` is NOT modified
  - **Audit before marking complete:** diff this inlined table against `actor-features.html` and confirm every `.rollable`, `data-roll-type`, `data-roll`, `data-label`, `data-item-id`, `.item-edit`, `.item-delete`, `.item-create` attribute is present and matches; confirm `showDetailedFormulas` conditional on `data-label` is preserved
  - _Requirements: 7.3, 7.4, 7.5, 10.1, 10.2, 10.4, 11.3_

- [x] 10. Final checkpoint — build and full hook audit
  - Run `npm run build` and confirm it completes without errors
  - Confirm `dist/templates/actor/parts/monster-combat.html` reflects all changes
  - Do a final diff of both redesigned templates against their originals and confirm no `name="system.*"`, `.rollable`, `.item-edit`, `.item-delete`, `.item-create`, `.spell-prepare`, `data-roll`, `data-roll-type`, `data-attack`, `data-label`, `data-change`, `data-item-id`, `data-type`, `data-spell-level-value`, `data-edit="img"`, or `data-group`/`data-tab` attribute has been dropped
  - Ensure all tests pass, ask the user if questions arise

## Notes

- No tasks are marked optional (`*`) — this feature has no PBT candidates; it is pure UI/CSS work
- Tasks 3–5 all edit `actor-monster-sheet.html`; complete them in order since each builds on the previous structure
- Tasks 7–9 all edit `monster-combat.html`; complete them in order
- Task 1 (CSS) and Task 2 (`hasSpells`) are independent and can be done in any order before the template tasks
- The `actor-spells.html` and `actor-features.html` partials are never modified — they are reused as-is
- Each task's audit step is the primary correctness gate for Requirement 10
