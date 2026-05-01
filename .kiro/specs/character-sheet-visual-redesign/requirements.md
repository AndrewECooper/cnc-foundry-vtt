# Requirements Document

## Introduction

This feature implements the "Tabletop Hybrid" visual redesign of the Castles & Crusades Foundry VTT Player Character sheet. The redesign replaces the current utilitarian layout with a parchment-on-wood-grain aesthetic: a cream paper card sitting on a dark wood-grain mat, with tactile decorative details (masking-tape strips, push-pin indicators, ruled-paper prose areas, dashed stamp-field borders, and slightly rotated stat cards).

**Scope is strictly look and feel.** No data model changes, no new roll logic, no new Foundry API usage. All existing functional hooks, input bindings, and Handlebars helpers are preserved exactly. The source files to edit are `src/templates/actor/actor-character-sheet.html`, `src/templates/actor/parts/*.html`, and `src/styles/castles_crusades.css`.

## Glossary

- **Sheet**: The Foundry VTT application window that renders the Player Character sheet, driven by `TlgccActorSheet`.
- **Paper_Card**: The cream/parchment-colored content area (`#f7efde`) that sits inside the Sheet window, styled to resemble a physical character sheet.
- **Sidebar**: The 140px-wide vertical column on the left of the Sheet that contains the tab navigation and the identity strip.
- **Tabs_Controller**: Foundry's built-in `Tabs` class, driven by `data-group` and `data-tab` attributes, which manages tab visibility without custom JavaScript.
- **Stamp_Field**: A dashed-border labeled input tile used for character identity fields (HP, LVL, CLASS, RACE, DEITY, TITLE, ALIGNMENT, XP).
- **Stat_Panel**: A slightly-rotated card displaying one ability score (STR, DEX, CON, INT, WIS, CHA), its numeric value, its modifier, and a PRIME stamp when the ability is marked as a prime.
- **PRIME_Stamp**: A small rotated ink-red badge placed on a Stat_Panel when `ability.ccprimary` is true.
- **Section_Card**: A bordered, lightly-shadowed container grouping related content within a tab (e.g., Weapons, Armor, Resources).
- **Pip_Tracker**: A future-enhancement placeholder; for this release, resource values remain numeric inputs.
- **Ruled_Prose**: A text editor area styled with a repeating horizontal-line background to resemble ruled notebook paper, used for Appearance and Biography.
- **Coin_Tile**: A dashed-border currency input tile with a small colored dot indicating the metal type (Platinum, Gold, Silver, Copper).
- **Webfont**: A font file bundled locally in `src/styles/` and declared via `@font-face`, following the existing Soutane/TeX Gyre Adventor pattern.
- **CSS_Token**: A CSS custom property (e.g., `--cc-outer-bg`) declared on `.tlgcc` and used throughout the redesign styles.
- **Functional_Hook**: Any HTML attribute or CSS class that the `TlgccActorSheet` JavaScript relies on: `.rollable`, `.item-edit`, `.item-delete`, `.item-create`, `.spell-prepare`, `name="system.*"`, `data-edit="img"`, `data-group`, `data-tab`, `data-roll`, `data-roll-type`, `data-attack`, `data-label`, `data-change`, `data-item-id`, `data-type`.

---

## Requirements

### Requirement 1: Font Bundling

**User Story:** As a GM or player, I want the redesigned sheet to display correctly without an internet connection, so that the new typography works in offline Foundry sessions.

#### Acceptance Criteria

1. THE Sheet SHALL load Crimson Text (weights 400 normal, 400 italic, 600 normal, 600 italic) from Webfont files stored in `src/styles/`, declared with `@font-face` rules in `src/styles/castles_crusades.css`.
2. THE Sheet SHALL load IBM Plex Sans (weights 400, 500, 600) from Webfont files stored in `src/styles/`, declared with `@font-face` rules in `src/styles/castles_crusades.css`.
3. THE Sheet SHALL NOT reference any external font CDN (e.g., Google Fonts `@import` URLs) in `castles_crusades.css` or any template file.
4. THE Sheet SHALL apply Crimson Text as the heading/display font stack (`"Crimson Text", Georgia, serif`) for character names, stat values, section titles, and table row names.
5. THE Sheet SHALL apply IBM Plex Sans as the body/label font stack (`"IBM Plex Sans", system-ui, sans-serif`) for labels, tab text, and table headers.
6. THE Sheet SHALL apply `ui-monospace, monospace` for numeric formulas, damage values, and weight figures.

---

### Requirement 2: CSS Design Tokens

**User Story:** As a developer maintaining the sheet, I want all colors and key visual values defined as CSS custom properties, so that future tweaks require changes in one place.

#### Acceptance Criteria

1. THE Sheet SHALL declare the following CSS custom properties on the `.tlgcc` selector: `--cc-outer-bg` (`#3a2a1a`), `--cc-text` (`#2a2418`), `--cc-muted` (`#7a6b56`), `--cc-accent` (`#a02a2a`), `--cc-parchment` (`#f7efde`), `--cc-plain` (`#fbf6e8`), `--cc-card-border` (`#d4c5a0`), `--cc-card-line` (`#c8b890`), `--cc-sidebar-bg` (`linear-gradient(180deg, #4a3826 0%, #3a2a1a 100%)`), `--cc-tab-active-bg` (`rgba(255,250,235,0.95)`), `--cc-tab-text` (`#d8c8a8`).
2. THE Sheet SHALL use these CSS_Tokens (not hardcoded hex values) in all new `.cc-*` component styles.
3. THE Sheet SHALL scope all new CSS rules under `.tlgcc` to avoid collisions with Foundry's own styles and the monster sheet.

---

### Requirement 3: Sheet Layout — Sidebar and Paper Card

**User Story:** As a player, I want the character sheet to have a vertical tab sidebar and a parchment content area, so that the sheet looks like a physical tabletop character card.

#### Acceptance Criteria

1. THE Sheet SHALL render a horizontal flex container (`.cc-sheet-body`) that fills the Foundry application window, containing a `.cc-sidebar` (fixed 140px width) and a `.cc-paper-card` (flex 1, remaining width).
2. THE Sheet SHALL set the Sheet window background to `--cc-outer-bg` (`#3a2a1a`) with a wood-grain texture composed of a radial gradient and a repeating linear gradient, as specified in the design tokens.
3. THE Paper_Card SHALL have a background of `--cc-parchment` (`#f7efde`), padding `18px 22px 20px`, and a folded-corner `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)`.
4. THE Paper_Card SHALL display a tape-strip decoration (110×18px, `rgba(220,200,150,0.7)`, striped overlay, `rotate(-1.2deg)`) centered at its top edge via a `::before` pseudo-element.
5. THE Sheet SHALL be fluid in both width and height (Foundry-resizable), with only the Sidebar fixed at 140px.
6. THE Sheet SHALL remove the existing horizontal `<nav class="sheet-tabs">` strip from the top of the form and replace it with the vertical Sidebar navigation described in Requirement 4.

---

### Requirement 4: Vertical Sidebar Navigation

**User Story:** As a player, I want to switch between sheet tabs using a vertical sidebar, so that more horizontal space is available for character data.

#### Acceptance Criteria

1. THE Sidebar SHALL contain a `<nav class="sheet-tabs tabs" data-group="primary">` element with five `<a>` tab links: `data-tab="combat"`, `data-tab="features"`, `data-tab="items"`, `data-tab="spells"`, `data-tab="description"`.
2. THE Sidebar SHALL display each tab link with a Unicode glyph and a text label: ⚔ Combat, ✦ Abilities, ⚒ Equipment, ✶ Spells, ☙ Description.
3. WHEN a tab is active, THE Sidebar SHALL style that tab link with `--cc-tab-active-bg` background, a 3px left border in `--cc-accent`, Crimson Text 600 italic label, and the glyph in `--cc-accent`.
4. WHILE a tab is inactive, THE Sidebar SHALL style that tab link with a transparent background and `--cc-tab-text` label color.
5. THE Tabs_Controller SHALL continue to function using the existing `data-group="primary"` / `data-tab` attribute structure without any changes to `TlgccActorSheet` JavaScript.
6. THE Sidebar SHALL display an identity strip at its bottom, separated by a 1px divider, showing the character name (Crimson Text 13px, cream), level · class, and race in small muted-cream text.

---

### Requirement 5: Sheet Header — Portrait and Stamp Fields

**User Story:** As a player, I want the sheet header to show my character portrait and key identity fields as styled stamp tiles, so that the header feels like a physical character card.

#### Acceptance Criteria

1. THE Sheet_Header SHALL render the character portrait as a 64×64 image with `data-edit="img"` preserved, a dashed border (`1px dashed --cc-muted`), and a tape-strip pseudo-element (36×12px, `rotate(-2deg)`) across its top.
2. THE Sheet_Header SHALL render the character name as a `<input name="name">` styled at 30px, weight 600, italic, Crimson Text, with a 2px solid `--cc-accent` underline and `rotate(-0.3deg)` transform.
3. THE Sheet_Header SHALL render the following fields as Stamp_Fields in a wrapping row below the name: HP (value/max), LVL, CLASS, RACE, DEITY, TITLE, ALIGNMENT, XP (value/next).
4. EACH Stamp_Field SHALL display a small uppercase muted label (8px, 1px letter-spacing) above a Crimson Text value input (13px), all inside a `1px dashed --cc-muted` bordered tile on `rgba(255,255,255,0.4)` background.
5. ALL `name="system.*"` attributes on Stamp_Field inputs SHALL be preserved exactly as they exist in the current template, so that Foundry's data binding continues to function.
6. THE Sheet_Header SHALL be rendered at the top of the Paper_Card and SHALL be visible on all five tabs.

---

### Requirement 6: Combat Tab — Ability Stat Panels

**User Story:** As a player, I want the six ability scores displayed as styled stat cards with prime indicators, so that I can quickly identify my prime abilities and roll checks.

#### Acceptance Criteria

1. THE Combat_Tab SHALL render the six abilities (STR, DEX, CON, INT, WIS, CHA) as a row of six Stat_Panels using the existing `{{#each system.abilities}}` loop.
2. EACH Stat_Panel SHALL display the ability abbreviation (9px, uppercase, 1.5px letter-spacing), the numeric score (26px, weight 600, Crimson Text), and the modifier (11px, weight 600, monospace, `--cc-accent` color).
3. WHEN `ability.ccprimary` is true, THE Stat_Panel SHALL apply a `2px solid --cc-accent` border, `rotate(-0.4deg)` transform, and a PRIME_Stamp badge.
4. WHILE `ability.ccprimary` is false, THE Stat_Panel SHALL apply a `1px dashed --cc-muted` border and `rotate(0.2deg)` transform.
5. THE PRIME_Stamp SHALL be positioned absolute at top-right of the Stat_Panel, with ink-red background, cream text, `rotate(8deg)` transform, and a 1px white border.
6. THE Stat_Panel SHALL preserve the `.rollable` class and all `data-roll`, `data-label` attributes on the clickable element, so that ability check rolls continue to function.
7. THE Stat_Panel SHALL preserve the `name="system.abilities.{key}.value"` input and the `name="system.abilities.{key}.ccprimary"` checkbox so that score editing and prime toggling continue to function.

---

### Requirement 7: Combat Tab — Combat Stats, Weapons, Armor, and Resources

**User Story:** As a player, I want the combat stats, weapons, armor, and resource tracker displayed in a clear two-column layout, so that I can reference combat information quickly during play.

#### Acceptance Criteria

1. THE Combat_Tab SHALL render AC, Attack Bonus (BTH), Move, and HD Size as four dashed-border Stamp_Field tiles in a row, each containing an editable `<input>` with its existing `name="system.*"` attribute preserved.
2. THE Combat_Tab SHALL render the weapons list in a Section_Card with a header row (Weapon · Atk/Dmg · Actions) and one row per weapon, preserving `.item`, `.rollable`, `.item-edit`, `.item-delete`, `.item-create` classes and all `data-*` attributes on each row.
3. THE Combat_Tab SHALL render the armor list in a Section_Card with a header row (Armor · AC · Actions) and one row per armor, preserving `.item`, `.item-edit`, `.item-delete`, `.item-create` classes.
4. THE Combat_Tab SHALL render the resource tracker in a Section_Card with a push-pin decoration (14×14px red radial-gradient circle) above it, displaying each resource as a row with the resource name input on the left and the numeric value input on the right, preserving `name="system.resources.{key}.name"` and `name="system.resources.{key}.value"` attributes.
5. THE Combat_Tab SHALL arrange the combat stats row, weapons Section_Card, and armor Section_Card in a wider left column, and the resources Section_Card in a narrower right column.

---

### Requirement 8: Features Tab

**User Story:** As a player, I want my class features and special abilities displayed in a clean table with roll affordances, so that I can reference and use them during play.

#### Acceptance Criteria

1. THE Features_Tab SHALL render features in a Section_Card table with columns: Feature (italic Crimson Text, leading ✦ glyph), Formula (monospace), and Actions (edit, delete).
2. EACH feature row SHALL preserve the `.item`, `.rollable` class on the feature image/name, and `.item-edit`, `.item-delete` classes on the action controls, along with all existing `data-*` attributes.
3. THE Features_Tab SHALL preserve the `.item-create` anchor with `data-type="feature"` for adding new features.
4. THE Features_Tab SHALL separate rows with a `1px dotted --cc-card-line` border.

---

### Requirement 9: Equipment Tab

**User Story:** As a player, I want my currency and gear displayed with clear visual hierarchy, so that I can track encumbrance and wealth at a glance.

#### Acceptance Criteria

1. THE Equipment_Tab SHALL render Platinum, Gold, Silver, and Copper as four Coin_Tiles in a row, each with a small colored dot (Platinum `#a0a0b8`, Gold `#c8a13a`, Silver `#a8a8a0`, Copper `#b07050`, all at 70% opacity with 1px inset shadow) and an editable `<input>` preserving `name="system.money.{pp,gp,sp,cp}.value"`.
2. THE Equipment_Tab SHALL render Valuables as a wider dashed-border tile with an italic Crimson Text input preserving `name="system.valuables.value"`.
3. THE Equipment_Tab SHALL render the gear list in a Section_Card with a header showing carried weight and an add-item control, preserving `.item`, `.item-edit`, `.item-delete`, `.item-create` classes and all `data-*` attributes.
4. EACH gear row SHALL display quantity and item name (Crimson Text), weight (right-aligned monospace), and row actions.

---

### Requirement 10: Spells Tab

**User Story:** As a player, I want my spell slots and spell list displayed with prepared-state controls, so that I can manage spellcasting during play.

#### Acceptance Criteria

1. THE Spells_Tab SHALL render the spell slots strip as a row of dashed-border tiles (one per spell level 0–9) using the existing `{{#each system.spellsPerLevel.value}}` loop, preserving `name="system.spellsPerLevel.value.{level}"` inputs.
2. THE Spells_Tab SHALL render spells grouped by level using the existing `{{#each spells}}` loop, with each level group showing a tinted band header (level number in italic `--cc-accent`, "Prepared" label on the right).
3. EACH spell row SHALL preserve the `.rollable` class and `data-roll-type`, `data-label` attributes on the cast affordance, the `.spell-prepare` class and `data-change` attribute on the +/− prepared controls, and `.item-edit`, `.item-delete` classes on row actions.
4. THE Spells_Tab SHALL preserve the `.item-create` anchor with `data-spell-level-value` and `data-type="spell"` attributes for adding new spells.

---

### Requirement 11: Description Tab

**User Story:** As a player, I want my character's physical description and biography displayed in a handwritten-feeling layout, so that the description tab feels like a personal journal page.

#### Acceptance Criteria

1. THE Description_Tab SHALL render Size, Height, Sex/Gender, Weight, and Age as five dashed-border Stamp_Field tiles in a row, preserving all `name="system.*"` and `id` attributes on their inputs.
2. THE Description_Tab SHALL render Language and Origin/Hometown as two dashed-border tiles with italic Crimson Text inputs, preserving `name="system.language.value"` and `name="system.origin.value"`.
3. THE Description_Tab SHALL render the Appearance editor in a Ruled_Prose container using the existing `{{editor system.appearance target="system.appearance" ...}}` helper call, unchanged.
4. THE Description_Tab SHALL render the Biography editor in a Ruled_Prose container with a push-pin decoration above it, using the existing `{{editor system.biography target="system.biography" ...}}` helper call, unchanged.
5. EACH Ruled_Prose container SHALL apply a `repeating-linear-gradient(transparent 0 22px, #c8b890 22px 23px)` background offset 6px, and italic Crimson Text 14px at 1.55 line-height.

---

### Requirement 12: Preservation of All Functional Hooks

**User Story:** As a developer, I want every existing JavaScript event listener to continue working after the visual redesign, so that no gameplay functionality is broken.

#### Acceptance Criteria

1. THE Sheet SHALL preserve every `.rollable` element and its `data-roll`, `data-roll-type`, `data-attack`, and `data-label` attributes exactly as they exist in the current templates.
2. THE Sheet SHALL preserve every `.item-edit`, `.item-delete`, and `.item-create` anchor element and its `data-type`, `data-item-id`, and `data-spell-level-value` attributes exactly as they exist in the current templates.
3. THE Sheet SHALL preserve every `.spell-prepare` anchor and its `data-change` attribute exactly as it exists in the current template.
4. THE Sheet SHALL preserve every `name="system.*"` attribute on every `<input>` element so that Foundry's form submission and data binding continue to function.
5. THE Sheet SHALL preserve `data-edit="img"` on the portrait `<img>` element.
6. THE Sheet SHALL preserve `data-group="primary"` on the `<nav>` element and `data-tab` on every tab link and tab content `<div>`, so that the Tabs_Controller continues to function.
7. THE Sheet SHALL preserve all `{{editor}}`, `{{localize}}`, and other Handlebars helper calls in their current form.
8. IF any Functional_Hook attribute is absent from the redesigned template where it existed in the original, THEN THE Sheet SHALL be considered non-compliant and the omission SHALL be treated as a defect.

---

### Requirement 13: Section Card Visual Style

**User Story:** As a player, I want grouped content areas to have a consistent bordered card appearance, so that the sheet is visually organized and easy to scan.

#### Acceptance Criteria

1. THE Section_Card SHALL have a background of `--cc-plain` (`#fbf6e8`), a `1px solid --cc-muted` border, and a `0 1px 3px rgba(0,0,0,0.1)` box shadow.
2. THE Section_Card header row SHALL have `6px 10px` padding, a `1px solid --cc-muted` bottom border, and a `rgba(0,0,0,0.03)` background tint.
3. THE Section_Card header SHALL display the section title in italic Crimson Text 14px weight 600, and an optional action control (e.g., "+ Add") on the right.
4. WHERE a Section_Card is designated as "pinned" (Resources on Combat tab, Biography on Description tab), THE Section_Card SHALL display a push-pin decoration (14×14px, `radial-gradient(circle at 35% 30%, #ff6868, #b02020)`, with drop shadow) centered above the card.

---

### Requirement 14: Build and Distribution

**User Story:** As a developer, I want the redesigned files to be built and distributed correctly, so that Foundry loads the updated sheet without manual file copying.

#### Acceptance Criteria

1. THE build system SHALL copy all modified files from `src/templates/`, `src/styles/`, and any new Webfont files in `src/styles/` to `dist/` when `npm run build` is executed.
2. THE Sheet SHALL NOT require any changes to `src/module/sheets/actor-sheet.ts` beyond updating `defaultOptions.width` if the sheet dimensions change.
3. THE Sheet SHALL NOT require any changes to the data model, migration scripts, or Foundry system manifest (`system.json`).
4. WHEN `npm run build` completes without errors, THE Sheet SHALL be loadable in Foundry VTT with all five tabs functional and all visual styles applied.
