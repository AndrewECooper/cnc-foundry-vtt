# Requirements Document

## Introduction

This feature implements the "Tabletop Hybrid" visual redesign of the Castles & Crusades Foundry VTT Monster (NPC/Bestiary) sheet. The redesign applies the same parchment-on-wood-grain aesthetic established by the Character Sheet redesign: a cream paper card on a dark wood-grain mat, with vertical sidebar tabs, dashed stamp-field borders, ruled-paper prose areas, masking-tape strips, push-pin indicators, and a bestiary-specific corner stamp.

**Scope is strictly look and feel.** No data model changes, no new roll logic, no new Foundry API usage. All existing functional hooks, input bindings, and Handlebars helpers are preserved exactly. The source files to edit are `src/templates/actor/actor-monster-sheet.html`, `src/templates/actor/parts/monster-combat.html`, and `src/styles/castles_crusades.css`.

The monster sheet shares all design tokens, fonts, and CSS component classes with the character sheet redesign. Where a component already exists in `castles_crusades.css` (e.g., `.cc-paper-card`, `.cc-sidebar`, `.cc-stamp-field`, `.cc-section`, `.cc-ruled-prose`), it is reused directly. Monster-specific variants are added under the `.cc-monster-*` prefix only where the monster sheet genuinely diverges.

## Glossary

- **Monster_Sheet**: The Foundry VTT application window that renders the Monster/NPC sheet, driven by `TlgccActorSheet` with actor type `monster`.
- **Paper_Card**: The cream/parchment-colored content area (`#f7efde`) that sits inside the Monster_Sheet window, styled to resemble a physical bestiary entry card.
- **Sidebar**: The 140px-wide vertical column on the left of the Monster_Sheet containing the three tab links and the monster identity strip.
- **Tabs_Controller**: Foundry's built-in `Tabs` class, driven by `data-group` and `data-tab` attributes, which manages tab visibility without custom JavaScript.
- **Stamp_Field**: A dashed-border labeled input tile used for monster identity fields (HD, HP, SAVES, NUMBER, INT, DISPOSITION, TREASURE, XP). Shared component from the character sheet redesign.
- **Stat_Tile**: A dashed-border clickable tile displaying one of the six saving-throw ability scores (STR, DEX, CON, INT, WIS, CHA) for the monster. Unlike the character sheet's Stat_Panel, monster tiles have no PRIME concept — all six use the same non-prime dashed style.
- **Combat_Tile**: A dashed-border non-clickable tile displaying a single combat stat (AC, Base to Hit, Move, Attacks, Sanity).
- **Section_Card**: A bordered, lightly-shadowed container grouping related content within a tab. Shared component from the character sheet redesign.
- **Bestiary_Stamp**: A rotated decorative text badge (`Bestiary · No. <id>`) placed in the top-right corner of the Paper_Card, rendered in italic Crimson Text with an ink-red border.
- **Bestiary_Badge**: A small inline badge reading "BESTIARY" displayed in the title bar to the right of the monster name.
- **Ruled_Prose**: A text editor area styled with a repeating horizontal-line background to resemble ruled notebook paper. Shared component from the character sheet redesign.
- **CSS_Token**: A CSS custom property (e.g., `--cc-outer-bg`) declared on `.tlgcc`. Already declared from the character sheet redesign.
- **Functional_Hook**: Any HTML attribute or CSS class that `TlgccActorSheet` JavaScript relies on: `.rollable`, `.item-edit`, `.item-delete`, `.item-create`, `.spell-prepare`, `name="system.*"`, `data-edit="img"`, `data-group`, `data-tab`, `data-roll`, `data-roll-type`, `data-attack`, `data-label`, `data-change`, `data-item-id`, `data-type`, `data-spell-level-value`, `data-roll-type="monster-save"`.

---

## Requirements

### Requirement 1: Shared Design Tokens and Fonts

**User Story:** As a GM, I want the monster sheet to use the same visual language as the character sheet, so that both sheets feel like they belong to the same system.

#### Acceptance Criteria

1. THE Monster_Sheet SHALL reuse the CSS custom properties already declared on `.tlgcc` by the character sheet redesign: `--cc-outer-bg`, `--cc-text`, `--cc-muted`, `--cc-accent`, `--cc-parchment`, `--cc-plain`, `--cc-card-border`, `--cc-card-line`, `--cc-sidebar-bg`, `--cc-tab-active-bg`, `--cc-tab-text`.
2. THE Monster_Sheet SHALL reuse the Crimson Text and IBM Plex Sans `@font-face` declarations already present in `castles_crusades.css` from the character sheet redesign, without adding duplicate declarations.
3. THE Monster_Sheet SHALL apply Crimson Text (`"Crimson Text", Georgia, serif`) for the monster name, stat values, section titles, and table row names.
4. THE Monster_Sheet SHALL apply IBM Plex Sans (`"IBM Plex Sans", system-ui, sans-serif`) for labels, tab text, and table headers.
5. THE Monster_Sheet SHALL apply `ui-monospace, monospace` for numeric formulas and damage values.

---

### Requirement 2: Sheet Layout — Sidebar and Paper Card

**User Story:** As a GM, I want the monster sheet to have the same parchment-on-wood-grain layout as the character sheet, so that the visual experience is consistent across actor types.

#### Acceptance Criteria

1. THE Monster_Sheet SHALL render a `.cc-sheet-body` flex container filling the Foundry application window, containing a `.cc-sidebar` (fixed 140px width) and a `.cc-paper-card` (flex 1, remaining width).
2. THE Monster_Sheet SHALL set the sheet window background to `--cc-outer-bg` with the same wood-grain texture (radial gradient + repeating linear gradient) used by the character sheet.
3. THE Paper_Card SHALL have a background of `--cc-parchment`, padding `18px 22px 20px`, and the folded-corner `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)`.
4. THE Paper_Card SHALL display a tape-strip decoration (110x18px, `rgba(220,200,150,0.7)`, striped overlay, `rotate(-1.2deg)`) centered at its top edge via a `::before` pseudo-element.
5. THE Monster_Sheet SHALL be fluid in both width and height (Foundry-resizable), with only the Sidebar fixed at 140px.
6. THE Monster_Sheet SHALL remove the existing horizontal `<nav class="sheet-tabs">` strip from the top of the form and replace it with the vertical Sidebar navigation described in Requirement 3.

---

### Requirement 3: Vertical Sidebar Navigation

**User Story:** As a GM, I want to switch between monster sheet tabs using a vertical sidebar, so that the layout is consistent with the character sheet and maximizes horizontal space for monster data.

#### Acceptance Criteria

1. THE Sidebar SHALL contain a `<nav class="sheet-tabs tabs" data-group="primary">` element with three `<a>` tab links: `data-tab="combat"`, `data-tab="spells"`, `data-tab="description"`.
2. THE Sidebar SHALL display each tab link with a Unicode glyph and a text label: ⚔ Combat, ✶ Spells, ☙ Description.
3. WHEN a tab is active, THE Sidebar SHALL style that tab link with `--cc-tab-active-bg` background, a 3px left border in `--cc-accent`, Crimson Text 600 italic label, and the glyph in `--cc-accent`.
4. WHILE a tab is inactive, THE Sidebar SHALL style that tab link with a transparent background and `--cc-tab-text` label color.
5. THE Tabs_Controller SHALL continue to function using the existing `data-group="primary"` / `data-tab` attribute structure without any changes to `TlgccActorSheet` JavaScript.
6. THE Sidebar SHALL display a monster identity strip at its bottom, separated by a 1px divider, showing the monster name (Crimson Text 13px, `#f0e0c0`), size and type on one line, and HD and disposition on a second line, in small muted-cream text (`#b8a888`, 10px).

---

### Requirement 4: Sheet Header — Portrait and Stamp Fields

**User Story:** As a GM, I want the monster sheet header to show the monster portrait and key stats as styled stamp tiles, so that the most important bestiary information is visible on every tab.

#### Acceptance Criteria

1. THE Sheet_Header SHALL render the monster portrait as a 64x64 image with `data-edit="img"` preserved, a dashed border (`1px dashed --cc-muted`), and a tape-strip pseudo-element (36x12px, `rotate(-2deg)`) across its top.
2. THE Sheet_Header SHALL render the monster name as a `<input name="name">` styled at 30px, weight 600, italic, Crimson Text, with a 2px solid `--cc-accent` underline and `rotate(-0.3deg)` transform.
3. THE Sheet_Header SHALL render a small uppercase muted subtitle line below the name showing size and type (e.g., "Medium · Beast"), sourced from `system.size.value` and `system.type.value`.
4. THE Sheet_Header SHALL render the following fields as Stamp_Fields in a wrapping row: HD (displaying `<hitDice.number><hitDice.size>`, e.g., "1d8"), HP (value/max), SAVES, NUMBER, INT, DISPOSITION, TREASURE, XP.
5. EACH Stamp_Field SHALL display a small uppercase muted label (8px, 1px letter-spacing) above a Crimson Text value input (13px), inside a `1px dashed --cc-muted` bordered tile on `rgba(255,255,255,0.4)` background.
6. ALL `name="system.*"` attributes on Stamp_Field inputs SHALL be preserved exactly as they exist in the current template, so that Foundry's data binding continues to function.
7. THE Sheet_Header SHALL be rendered at the top of the Paper_Card and SHALL be visible on all three tabs.
8. THE Paper_Card SHALL display a Bestiary_Stamp in its top-right corner: italic Crimson Text 11px, uppercase, 1.5px letter-spacing, text "Bestiary · No. <id>", 2px solid `--cc-accent` border, `rotate(8deg)`, `opacity: 0.55`.

---

### Requirement 5: Combat Tab — Saving Throw Stat Tiles

**User Story:** As a GM, I want the six saving-throw ability scores displayed as clickable stat tiles, so that I can roll monster saves quickly during play.

#### Acceptance Criteria

1. THE Combat_Tab SHALL render the six saving-throw abilities (STR, DEX, CON, INT, WIS, CHA) as a row of six Stat_Tiles using the existing saving-throw data available on the monster actor.
2. EACH Stat_Tile SHALL display the ability abbreviation (9px, uppercase, 1.5px letter-spacing, `--cc-muted`), the numeric score (22px, weight 600, Crimson Text, `--cc-text`), and a "ROLL" hint label (9px, uppercase, `--cc-muted`).
3. EACH Stat_Tile SHALL use a `1px dashed --cc-muted` border and a slight `rotate(0.2deg)` transform. No PRIME variant exists for monsters.
4. EACH Stat_Tile SHALL be clickable and preserve the existing roll mechanism for monster saves (the `.rollable` class with `data-roll-type="monster-save"` or equivalent, as used in the current template).
5. THE Stat_Tile grid SHALL use a 6-column layout.

---

### Requirement 6: Combat Tab — Core Combat Stats

**User Story:** As a GM, I want AC, Base to Hit, Move, Attacks, and Sanity displayed as prominent dashed tiles, so that I can reference the monster's core combat numbers at a glance.

#### Acceptance Criteria

1. THE Combat_Tab SHALL render AC, Base to Hit, Move, Attacks, and Sanity as five Combat_Tiles in a row, each containing an editable `<input>` with its existing `name="system.*"` attribute preserved.
2. EACH Combat_Tile SHALL use a `1px dashed --cc-muted` border, `--cc-plain` background, and centered layout with a small uppercase label (9px, `--cc-muted`) above the value.
3. THE AC, Base to Hit, Move, and Sanity tiles SHALL display their values in Crimson Text 22px weight 600.
4. THE Attacks tile SHALL display its value in Crimson Text 14px (smaller than the numeric tiles) because the attacks field contains a text routine (e.g., "2 claws / 1 bite") rather than a single number.
5. ALL existing `name="system.*"` attributes and tooltips on Combat_Tile inputs SHALL be preserved exactly as they exist in the current `monster-combat.html` partial.

---

### Requirement 7: Combat Tab — Weapons, Armor, and Special Abilities

**User Story:** As a GM, I want the monster's weapons, armor, and special abilities displayed in styled section cards, so that I can reference attack options and abilities quickly during combat.

#### Acceptance Criteria

1. THE Combat_Tab SHALL render the weapons list in a Section_Card titled "Weapons & Natural Attacks" with a header row (Attack · Atk · Dmg · Notes · Roll) and one row per weapon, preserving `.item`, `.rollable`, `.item-edit`, `.item-delete`, `.item-create` classes and all `data-*` attributes on each row.
2. THE Combat_Tab SHALL render the armor list in a Section_Card titled "Armor" with a header row (Armor · AC · Actions) and one row per armor, preserving `.item`, `.item-edit`, `.item-delete`, `.item-create` classes.
3. THE Combat_Tab SHALL render the special abilities (features) in a Section_Card titled "Special Abilities" with a push-pin decoration above it, using a table with columns: Feature (italic Crimson Text, leading ✦ glyph) · Description · Roll · Actions.
4. EACH feature row SHALL preserve the `.item`, `.rollable`, `.item-edit`, `.item-delete` classes and all existing `data-*` attributes.
5. THE Special Abilities Section_Card SHALL preserve the `.item-create` anchor with `data-type="feature"` for adding new features.
6. TABLE row separators SHALL use `1px dotted --cc-card-line`.

---

### Requirement 8: Spells Tab

**User Story:** As a GM, I want the monster's spell slots and spells displayed with the same layout as the character sheet spells tab, so that spellcasting monsters are easy to manage during play.

#### Acceptance Criteria

1. THE Spells_Tab SHALL render the spell slots strip as a row of dashed-border tiles (one per spell level 0–9) using the existing `{{#each system.spellsPerLevel.value}}` loop, preserving `name="system.spellsPerLevel.value.{level}"` inputs.
2. THE Spells_Tab SHALL render spells grouped by level using the existing `{{#each spells}}` loop, with each level group showing a tinted band header (level number in italic `--cc-accent`, "Prepared" label on the right).
3. EACH spell row SHALL preserve the `.rollable` class and `data-roll-type`, `data-label` attributes on the cast affordance, the `.spell-prepare` class and `data-change` attribute on the +/- prepared controls, and `.item-edit`, `.item-delete` classes on row actions.
4. THE Spells_Tab SHALL preserve the `.item-create` anchor with `data-spell-level-value` and `data-type="spell"` attributes for adding new spells.
5. WHEN the monster has no spells, THE Spells_Tab SHALL display a centered empty state: italic Crimson Text 18px "No spells known." with a small body-font hint below it.

---

### Requirement 9: Description Tab

**User Story:** As a GM, I want the monster's environmental context and prose descriptions displayed in a handwritten-feeling layout, so that the description tab reads like a physical bestiary entry.

#### Acceptance Criteria

1. THE Description_Tab SHALL render Biome, Climate, Type, and Size as four dashed-border Stamp_Field tiles in a row, preserving `name="system.biome.value"`, `name="system.climate.value"`, `name="system.type.value"`, and `name="system.size.value"` on their inputs.
2. THE Description_Tab SHALL render the monster's biography/description in a Ruled_Prose container using the existing `{{editor system.biography target="system.biography" ...}}` helper call, unchanged.
3. EACH Ruled_Prose container SHALL apply a `repeating-linear-gradient(transparent 0 22px, #c8b890 22px 23px)` background offset 6px, and italic Crimson Text 14px at 1.55 line-height.
4. THE Description_Tab SHALL use a two-column layout where the left column contains the Description prose block and the right column is reserved for future Tactics and Ecology prose blocks; if those fields do not exist in the current data model, the right column SHALL be omitted and the Description block SHALL span the full width.

---

### Requirement 10: Preservation of All Functional Hooks

**User Story:** As a developer, I want every existing JavaScript event listener to continue working after the visual redesign, so that no gameplay functionality is broken.

#### Acceptance Criteria

1. THE Monster_Sheet SHALL preserve every `.rollable` element and its `data-roll`, `data-roll-type`, `data-attack`, and `data-label` attributes exactly as they exist in the current templates.
2. THE Monster_Sheet SHALL preserve every `.item-edit`, `.item-delete`, and `.item-create` anchor element and its `data-type`, `data-item-id`, and `data-spell-level-value` attributes exactly as they exist in the current templates.
3. THE Monster_Sheet SHALL preserve every `.spell-prepare` anchor and its `data-change` attribute exactly as it exists in the current template.
4. THE Monster_Sheet SHALL preserve every `name="system.*"` attribute on every `<input>` element so that Foundry's form submission and data binding continue to function.
5. THE Monster_Sheet SHALL preserve `data-edit="img"` on the portrait `<img>` element.
6. THE Monster_Sheet SHALL preserve `data-group="primary"` on the `<nav>` element and `data-tab` on every tab link and tab content `<div>`, so that the Tabs_Controller continues to function.
7. THE Monster_Sheet SHALL preserve all `{{editor}}`, `{{localize}}`, and other Handlebars helper calls in their current form.
8. IF any Functional_Hook attribute is absent from the redesigned template where it existed in the original, THEN THE Monster_Sheet SHALL be considered non-compliant and the omission SHALL be treated as a defect.

---

### Requirement 11: Monster-Specific Decorative Elements

**User Story:** As a GM, I want the monster sheet to have bestiary-specific decorative details that distinguish it from the character sheet while sharing the same visual language.

#### Acceptance Criteria

1. THE Paper_Card SHALL display a Bestiary_Stamp in its top-right corner with the text "Bestiary · No. <id>", styled as: italic Crimson Text 11px, uppercase, 1.5px letter-spacing, 2px solid `--cc-accent` border, `3px 10px` padding, cream wash background `rgba(255,250,235,0.4)`, `rotate(8deg)`, `opacity: 0.55`.
2. THE Monster_Sheet title bar SHALL display a Bestiary_Badge to the right of the monster name: text "BESTIARY", IBM Plex Sans 9px, 1.5px letter-spacing, background `rgba(160,42,42,0.4)`, border `1px solid rgba(255,200,180,0.3)`, color `#f0d8c0`, padding `1px 7px`.
3. THE Special Abilities Section_Card SHALL display a push-pin decoration (14x14px, `radial-gradient(circle at 35% 30%, #ff6868, #b02020)`, with drop shadow) centered above the card, using the shared `.cc-section--pinned` class.

---

### Requirement 12: CSS Scoping and Shared Component Reuse

**User Story:** As a developer, I want the monster sheet styles to reuse existing character sheet CSS components and add only monster-specific overrides, so that the stylesheet stays maintainable and the two sheets stay visually consistent.

#### Acceptance Criteria

1. THE Monster_Sheet SHALL reuse the following existing CSS component classes without modification: `.cc-sheet-body`, `.cc-sidebar`, `.cc-paper-card`, `.cc-sheet-header`, `.cc-stamp-field`, `.cc-stamp-label`, `.cc-section`, `.cc-section--pinned`, `.cc-section-header`, `.cc-section-title`, `.cc-ruled-prose`, `.cc-ruled-prose-body`, `.cc-add-btn`.
2. WHERE the monster sheet requires a visual variant that differs from the character sheet (e.g., the Stat_Tile without PRIME styling, the Bestiary_Stamp, the Bestiary_Badge), THE Monster_Sheet SHALL add new CSS rules scoped under `.tlgcc` using the `.cc-monster-*` prefix.
3. THE Monster_Sheet SHALL NOT remove or override any existing `.cc-*` CSS rules that are used by the character sheet.
4. ALL new CSS rules for the monster sheet SHALL be scoped under `.tlgcc` to avoid collisions with Foundry's own styles.

---

### Requirement 13: Build and Distribution

**User Story:** As a developer, I want the redesigned monster sheet files to be built and distributed correctly, so that Foundry loads the updated sheet without manual file copying.

#### Acceptance Criteria

1. THE build system SHALL copy all modified files from `src/templates/` and `src/styles/` to `dist/` when `npm run build` is executed, without requiring any changes to `rollup.config.js`.
2. THE Monster_Sheet SHALL NOT require any changes to `src/module/sheets/actor-sheet.ts` beyond updating `defaultOptions.width` if the sheet dimensions change.
3. THE Monster_Sheet SHALL NOT require any changes to the data model, migration scripts, or Foundry system manifest.
4. WHEN `npm run build` completes without errors, THE Monster_Sheet SHALL be loadable in Foundry VTT with all three tabs functional and all visual styles applied.
