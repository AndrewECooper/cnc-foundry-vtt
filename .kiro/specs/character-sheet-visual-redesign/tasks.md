# Implementation Plan: Character Sheet Visual Redesign

## Overview

Translate the "Tabletop Hybrid" design prototype into production Handlebars templates and CSS inside the existing system. Work proceeds layer by layer: fonts → CSS tokens and component styles → root template restructure → tab partials → actor-sheet.ts width update → build verification. No TypeScript logic changes beyond the `defaultOptions.width` update.

All edits are in `src/` only. The build copies `src/styles/`, `src/templates/`, and `src/assets/` verbatim to `dist/`.

## Tasks

- [x] 1. Bundle webfonts
  - Download Crimson Text (400 normal, 400 italic, 600 normal, 600 italic) and IBM Plex Sans (400, 500, 600) from Google Fonts or Fontsource as woff2 + woff files, Latin subset
  - Place all 14 font files in `src/styles/` using the naming convention: `crimsontext-regular-webfont.woff2`, `crimsontext-regular-webfont.woff`, `crimsontext-italic-webfont.woff2`, `crimsontext-italic-webfont.woff`, `crimsontext-semibold-webfont.woff2`, `crimsontext-semibold-webfont.woff`, `crimsontext-semibolditalic-webfont.woff2`, `crimsontext-semibolditalic-webfont.woff`, `ibmplexsans-regular-webfont.woff2`, `ibmplexsans-regular-webfont.woff`, `ibmplexsans-medium-webfont.woff2`, `ibmplexsans-medium-webfont.woff`, `ibmplexsans-semibold-webfont.woff2`, `ibmplexsans-semibold-webfont.woff`
  - Append 14 `@font-face` declarations to `src/styles/castles_crusades.css` following the exact same pattern as the existing Soutane declarations (woff2 + woff only — no eot/ttf/svg needed for Foundry's Chromium runtime)
  - Do NOT add any `@import` URL pointing to an external CDN
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Add CSS design tokens and component styles
  - [x] 2.1 Declare CSS custom properties and base layout styles
    - Append a clearly-marked `/* === Tabletop Hybrid Redesign === */` section to `src/styles/castles_crusades.css`
    - Declare all 11 CSS custom properties on `.tlgcc`: `--cc-outer-bg`, `--cc-text`, `--cc-muted`, `--cc-accent`, `--cc-parchment`, `--cc-plain`, `--cc-card-border`, `--cc-card-line`, `--cc-sidebar-bg`, `--cc-tab-active-bg`, `--cc-tab-text` with the exact values from the design document
    - Add `.cc-sheet-body` flex-row container styles (fills window, no overflow)
    - Add wood-mat background on `.tlgcc` form: `--cc-outer-bg` base + radial gradient + repeating linear gradient texture
    - _Requirements: 2.1, 2.2, 2.3, 3.2_

  - [x] 2.2 Add sidebar and tab navigation styles
    - Add `.cc-sidebar` styles: 140px fixed width, `--cc-sidebar-bg`, flex column, `padding: 14px 0`, inset right shadow
    - Add `.tlgcc .sheet-tabs .item` (inactive) styles: transparent bg, `--cc-tab-text` color, 3px transparent left border, full-width block display
    - Add `.tlgcc .sheet-tabs .item.active` styles: `--cc-tab-active-bg` bg, 3px `--cc-accent` left border, Crimson Text 600 italic, glyph in `--cc-accent`
    - Add `.cc-sidebar-identity` styles: `padding: 12px 14px`, `border-top: 1px solid rgba(0,0,0,0.3)`, name 13px Crimson Text `#f0e0c0`, meta 10px `#b8a888`
    - _Requirements: 3.1, 4.3, 4.4, 4.6_

  - [x] 2.3 Add paper card and sheet header styles
    - Add `.cc-paper-card` styles: `--cc-parchment` bg, padding, folded-corner `clip-path`, box-shadow, flex column, gap 12px, overflow hidden, `position: relative`
    - Add `.cc-paper-card::before` tape-strip pseudo-element: 110×18px, `rgba(220,200,150,0.7)`, striped overlay, `rotate(-1.2deg)`, centered top
    - Add `.cc-sheet-header` flex-row styles
    - Add `.cc-portrait` styles: 64×64, `1px dashed --cc-muted`, `position: relative`, flex-shrink 0
    - Add `.cc-portrait::before` tape-strip pseudo-element: 36×12px, `rotate(-2deg)`, centered top
    - Add `.cc-identity` and `.cc-char-name` styles: 30px Crimson Text 600 italic, `--cc-accent` color, 2px solid `--cc-accent` border-bottom, `rotate(-0.3deg)`
    - Add `.cc-stamp-field` styles: `1px dashed --cc-muted`, `rgba(255,255,255,0.4)` bg, inline-flex column, `min-width: 40px`, padding `2px 8px`
    - Add `.cc-stamp-label` styles: 8px IBM Plex Sans, uppercase, 1px letter-spacing, `--cc-muted` color
    - Add `.cc-stamp-inputs` and value input styles: 13px Crimson Text, `--cc-text` color
    - _Requirements: 3.3, 3.4, 5.1, 5.2, 5.3, 5.4_

  - [x] 2.4 Add stat panel styles
    - Add `.cc-stat-grid` 6-column grid styles
    - Add `.cc-stat-panel` base styles: `padding: 8px 4px 6px`, `text-align: center`, `position: relative`, `--cc-plain` bg, `1px dashed --cc-muted` border, `rotate(0.2deg)`
    - Add `.cc-stat-panel--prime` override styles: `2px solid --cc-accent` border, `rotate(-0.4deg)`, `#fff8e1` bg, box-shadow
    - Add `.cc-prime-stamp` styles: absolute top-right, `--cc-accent` bg, cream text, 8px, `rotate(8deg)`, 1px white border, padding `2px 5px`
    - Add `.cc-stat-abbr` styles: 9px IBM Plex Sans, uppercase, 1.5px letter-spacing, `--cc-muted`, cursor pointer
    - Add `.cc-stat-value` styles: 26px Crimson Text 600, `--cc-text`, width 100%, text-align center
    - Add `.cc-stat-mod` styles: 11px monospace 600, `--cc-accent`
    - Add `.cc-stat-roll` styles: 9px, uppercase, letter-spacing, `--cc-muted`
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [x] 2.5 Add section card, table, and remaining component styles
    - Add `.cc-section` styles: `--cc-plain` bg, `1px solid --cc-muted` border, `0 1px 3px rgba(0,0,0,0.1)` shadow, flex column, `position: relative`
    - Add `.cc-section-header` styles: `6px 10px` padding, `1px solid --cc-muted` bottom border, `rgba(0,0,0,0.03)` bg, flex row space-between
    - Add `.cc-section-title` styles: 14px Crimson Text 600 italic, `--cc-text`
    - Add `.cc-add-btn` styles: 11px IBM Plex Sans, `--cc-muted`
    - Add `.cc-section--pinned` and its `::before` push-pin pseudo-element: 14×14px, `radial-gradient(circle at 35% 30%, #ff6868, #b02020)`, drop shadow, centered above card
    - Add `.cc-table` styles: width 100%, border-collapse collapse
    - Add `.cc-table th` styles: 9px IBM Plex Sans 500, uppercase, 1px letter-spacing, `--cc-muted`, `6px 8px` padding
    - Add `.cc-table td` styles: `6px 8px` padding, `1px dotted --cc-card-line` bottom border, vertical-align middle
    - Add `.cc-table tr:last-child td` border-bottom none
    - Add `.cc-combat-columns` two-column grid styles (1.5fr 1fr)
    - Add `.cc-combat-stat-row` flex row styles for the four combat stat tiles
    - Add `.cc-coin-row` grid styles (repeat(4, 80px) 1fr)
    - Add `.cc-coin-tile` base styles: `--cc-plain` bg, `1px dashed --cc-muted`, `6px 8px` padding, text-align center, `position: relative`
    - Add `.cc-coin-tile::after` coin-dot pseudo-element: 10×10px, absolute top-right, border-radius 50%, `opacity: 0.7`, inset shadow
    - Add `.cc-coin-tile--platinum::after`, `--gold::after`, `--silver::after`, `--copper::after` with correct colors
    - Add `.cc-spell-slots` dashed-border tile styles
    - Add `.cc-slot-grid` 10-column grid styles
    - Add `.cc-slot-tile` styles
    - Add `.cc-spell-level-header` tinted band styles: `--cc-plain` bg tinted, italic `--cc-accent` level number, flex row space-between
    - Add `.cc-ruled-prose` and `.cc-ruled-prose-body` styles: 14px Crimson Text italic, 1.55 line-height, `--cc-text`, ruled-paper `repeating-linear-gradient` bg offset 6px
    - Add `.cc-fact-row` 5-column grid and `.cc-text-row` 2-column grid styles
    - Add `.cc-prose-row` 2-column grid styles
    - _Requirements: 7.4, 8.4, 9.1, 9.2, 10.1, 10.2, 11.5, 13.1, 13.2, 13.3, 13.4_

- [x] 3. Restructure root template (`actor-character-sheet.html`)
  - Replace the `<form>` class list: remove `tlgbackground`, keep `{{cssClass}} {{actor.type}} tlgcc sheet actor flexcol`
  - Replace the entire form body with the new `.cc-sheet-body` flex structure:
    - `.cc-sidebar` containing `<nav class="sheet-tabs tabs" data-group="primary">` with five `<a class="item" data-tab="...">` links using the Unicode glyphs (⚔ Combat, ✦ Abilities, ⚒ Equipment, ✶ Spells, ☙ Description) and `.cc-sidebar-identity` strip below
    - `.cc-paper-card` containing `.cc-sheet-header` (portrait + name + stamp fields) and `<section class="sheet-body">` with the five tab `<div>` panes
  - Move the ability stat grid and resources loop out of the root template and into `actor-combat.html` (the root template no longer contains tab content directly)
  - Preserve `data-group="primary"` on the `<nav>` and `data-tab` on every `<a>` and tab `<div>`
  - Preserve `data-edit="img"` on the portrait `<img>`
  - Preserve all `name="system.*"` attributes on every stamp field input (HP value/max, LVL, CLASS, RACE, DEITY, TITLE, ALIGNMENT, XP value/next)
  - Preserve all `{{localize}}` calls
  - Before marking complete: diff against the original and confirm every Functional_Hook attribute listed in Requirement 12 is present
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 12.1–12.8_

- [x] 4. Rewrite `actor-combat.html` partial
  - Add the six-up `.cc-stat-grid` with `.cc-stat-panel` / `.cc-stat-panel--prime` cards using `{{#each system.abilities}}`
    - Each panel: `.cc-stat-abbr.rollable` with existing `data-roll` and `data-label` attributes, `.cc-stat-value` input with `name="system.abilities.{{key}}.value"`, `.cc-stat-mod` span, `.cc-prime-stamp` conditional on `{{ability.ccprimary}}`, `.cc-prime-checkbox` with `name="system.abilities.{{key}}.ccprimary"`
  - Add `.cc-combat-columns` two-column grid below the stat grid
  - Left column: `.cc-combat-stat-row` with four `.cc-stamp-field` tiles (AC, BTH, Move, HD) preserving `name="system.armorClass.value"`, `name="system.attackBonus.value"`, `name="system.move.value"`, `name="system.hdSize.value"`; `.cc-section` "Weapons" with `.cc-table` preserving all existing weapon row markup (`.rollable`, `.attack-button`, `data-roll-type`, `data-attack`, `data-roll`, `data-label`, `.item-edit`, `.item-delete`, `.item-create`, `data-item-id`); `.cc-section` "Armor" with `.cc-table` preserving all existing armor row markup
  - Right column: `.cc-section.cc-section--pinned` "Trackable Resources" with the `{{#each system.resources}}` loop preserving `name="system.resources.{{key}}.name"` and `name="system.resources.{{key}}.value"`
  - Before marking complete: diff against original `actor-combat.html` and the ability grid in the original root template; confirm every Functional_Hook is present
  - _Requirements: 6.1–6.7, 7.1–7.5, 12.1–12.8_

- [x] 5. Rewrite `actor-features.html` partial
  - Wrap content in a `.cc-section` "Special Abilities & Class Features" with `.cc-section-header` and `.cc-section-body`
  - Replace the `<ol class="items-list">` with a `.cc-table` inside `.cc-section-body`
  - Table header row: Feature · Formula · Actions (9px IBM Plex Sans uppercase)
  - Each feature row: preserve `data-item-id` on the row, ✦ glyph before the feature name `<h4>`, `.rollable` on the feature image with `data-roll-type="item"`, `.item-formula.item-prop.rollable` with `data-roll` and `data-label`, `.item-edit` and `.item-delete` controls
  - Preserve `.item-create` anchor with `data-type="feature"`
  - Before marking complete: diff against original `actor-features.html`; confirm every Functional_Hook is present
  - _Requirements: 8.1–8.4, 12.1–12.8_

- [x] 6. Rewrite `actor-items.html` partial
  - Replace the money grid with a `.cc-coin-row` containing four `.cc-coin-tile` elements (`.cc-coin-tile--platinum`, `--gold`, `--silver`, `--copper`) preserving `name="system.money.{pp,gp,sp,cp}.value"` inputs, plus a `.cc-valuables-tile` preserving `name="system.valuables.value"`
  - Replace the gear `<ol class="items-list">` with a `.cc-section` "Equipment" containing a `.cc-table`
  - Table header row: Qty · Item · Weight · Actions, with carried weight shown in the header
  - Each gear row: quantity (monospace `×N`), item name (Crimson Text), weight (right-aligned monospace), `.item-edit` and `.item-delete` controls; preserve `data-item-id` and `.rollable` on the item image
  - Preserve `.item-create` anchor with `data-type="item"`
  - Before marking complete: diff against original `actor-items.html`; confirm every Functional_Hook is present
  - _Requirements: 9.1–9.4, 12.1–12.8_

- [x] 7. Rewrite `actor-spells.html` partial
  - Replace the spell slots section with a `.cc-spell-slots` dashed-border tile containing a `.cc-slot-grid` (10 columns) using `{{#each system.spellsPerLevel.value}}`, preserving `name="system.spellsPerLevel.value.{{level}}"` inputs
  - Replace the spell list `<ol>` with a `.cc-section` "Spells Known & Prepared" containing grouped spell rows
  - For each spell level group: `.cc-spell-level-header` tinted band with level number and "Prepared" label; preserve `.item-create` anchor with `data-spell-level-value="{{spellLevel}}"` and `data-type="spell"`
  - Each spell row: preserve `data-item-id`, `.rollable` with `data-roll-type="item"` and `data-label` on the cast image, optional damage `.rollable` with `data-roll-type="damage"` and `data-roll`, `.spell-prepare` anchors with `data-change="-1"` and `data-change="+1"`, prepared count display, `.item-edit` and `.item-delete` controls
  - Before marking complete: diff against original `actor-spells.html`; confirm every Functional_Hook is present
  - _Requirements: 10.1–10.4, 12.1–12.8_

- [x] 8. Rewrite `actor-description.html` partial
  - Replace the facts grid with a `.cc-fact-row` (5-column) containing five `.cc-stamp-field` tiles for Size, Height, Sex, Weight, Age — preserving all `id` and `name="system.*"` attributes and `{{localize}}` calls
  - Add a `.cc-text-row` (2-column) with Language and Origin tiles, preserving `name="system.language.value"` and `name="system.origin.value"`
  - Add a `.cc-prose-row` (2-column) containing:
    - `.cc-ruled-prose` "Appearance" wrapping the existing `{{editor system.appearance target="system.appearance" rollData=rollData button=true owner=owner editable=editable}}` call unchanged inside `.cc-ruled-prose-body`
    - `.cc-ruled-prose.cc-section--pinned` "Biography & Notes" wrapping the existing `{{editor system.biography target="system.biography" rollData=rollData button=true owner=owner editable=editable}}` call unchanged inside `.cc-ruled-prose-body`
  - Before marking complete: diff against original `actor-description.html`; confirm every `{{editor}}` and `{{localize}}` call is unchanged and every `name="system.*"` attribute is preserved
  - _Requirements: 11.1–11.5, 12.7, 12.8_

- [x] 9. Update sheet width in `actor-sheet.ts`
  - Change `width: 780` to `width: 880` in `TlgccActorSheet.defaultOptions` to accommodate the 140px sidebar without compressing the paper card content area
  - This is the only change to `actor-sheet.ts`
  - _Requirements: 14.2_

- [x] 10. Build verification and functional audit
  - Run `npm run build` and confirm it completes without errors
  - Confirm all modified template files appear in `dist/templates/` and all new font files appear in `dist/styles/`
  - Open a character sheet in Foundry and perform the functional regression checklist from the design document's Testing Strategy section:
    - All five tabs switch correctly via the sidebar
    - Ability stat panel rolls fire correctly
    - Melee, ranged, and damage weapon rolls fire correctly
    - Spell cast roll fires correctly
    - Spell prepared count increments and decrements
    - Item edit opens the item sheet
    - Item delete removes the item
    - Character name and HP save on close/reopen
    - Portrait click opens the file picker
  - _Requirements: 14.1, 14.4_

## Notes

- There are no optional (`*`) sub-tasks in this feature — the design explicitly excludes property-based and unit tests for UI rendering work (see design document Testing Strategy section)
- The functional audit in Task 10 is the primary correctness gate for Requirement 12; it cannot be automated and must be done in Foundry
- Font files (Task 1) must be present before running the build in Task 10 — the CSS `@font-face` declarations will reference them
- Tasks 2–8 can be worked in parallel once Task 1 is complete; Task 9 is independent and can be done at any point
- Do not remove any existing CSS rules that may be used by the monster sheet or item sheets
