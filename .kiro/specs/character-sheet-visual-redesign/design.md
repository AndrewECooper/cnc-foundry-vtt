# Design Document: Character Sheet Visual Redesign

## Overview

This document describes the technical design for the "Tabletop Hybrid" visual redesign of the Castles & Crusades Foundry VTT Player Character sheet. The scope is strictly look and feel: restructuring the HTML layout, adding new CSS component styles, and bundling two new webfont families. No data model changes, no new JavaScript, no new Foundry API usage.

The reference prototype lives in `design_handoff_character_sheet/` (React/JSX). The task is to translate that prototype into Handlebars templates and CSS inside the existing system, preserving every functional hook that `TlgccActorSheet` depends on.

### Key constraints

- Edit `src/` only. Rollup copies `src/templates/`, `src/styles/`, and `src/assets/` verbatim to `dist/`.
- `src/module/sheets/actor-sheet.ts` requires no changes beyond optionally updating `defaultOptions.width`.
- All existing `.rollable`, `.item-edit`, `.item-delete`, `.item-create`, `.spell-prepare`, `name="system.*"`, `data-edit="img"`, `data-group`, `data-tab`, `data-roll`, `data-roll-type`, `data-attack`, `data-label`, `data-change`, `data-item-id`, `data-type`, and `data-spell-level-value` attributes must be preserved exactly.
- The Foundry `Tabs` controller (`navSelector: '.sheet-tabs'`, `contentSelector: '.sheet-body'`, `initial: 'combat'`) continues to drive tab switching without any JS changes.

---

## Architecture

The redesign touches three layers:

1. **Fonts** — two new webfont families added to `src/styles/` and declared via `@font-face` in `castles_crusades.css`.
2. **CSS** — new `.cc-*` component styles appended to `castles_crusades.css`, scoped under `.tlgcc`, using CSS custom properties declared on `.tlgcc`.
3. **HTML** — six Handlebars template files restructured to use the new layout and component classes.

No new TypeScript files. No new Handlebars helpers. No changes to the data model or system manifest.

### Dependency graph

```
castles_crusades.css
  ├── @font-face: Crimson Text (8 declarations: 4 weights × woff2+woff)
  ├── @font-face: IBM Plex Sans (6 declarations: 3 weights × woff2+woff)
  ├── CSS custom properties on .tlgcc (11 tokens)
  └── .cc-* component rules (scoped under .tlgcc)

actor-character-sheet.html  (root template)
  ├── .cc-sheet-body
  │   ├── .cc-sidebar
  │   │   ├── nav.sheet-tabs (Foundry Tabs controller — unchanged selector)
  │   │   └── .cc-sidebar-identity
  │   └── .cc-paper-card
  │       ├── .cc-sheet-header
  │       └── section.sheet-body (Foundry Tabs content — unchanged selector)
  │           ├── .tab[data-tab=combat]      → actor-combat.html partial
  │           ├── .tab[data-tab=features]    → actor-features.html partial
  │           ├── .tab[data-tab=items]       → actor-items.html partial
  │           ├── .tab[data-tab=spells]      → actor-spells.html partial
  │           └── .tab[data-tab=description] → actor-description.html partial
```

The Foundry `Tabs` controller finds the nav via `.sheet-tabs` and the content panes via `.sheet-body`. Both selectors are unchanged; only the nav moves from a horizontal strip at the top of the form into the sidebar column.

---

## Components and Interfaces

### CSS Custom Properties (Design Tokens)

All tokens declared on `.tlgcc`:

| Property | Value | Usage |
|---|---|---|
| `--cc-outer-bg` | `#3a2a1a` | Wood-mat background |
| `--cc-text` | `#2a2418` | Primary body text |
| `--cc-muted` | `#7a6b56` | Secondary text, dashed borders |
| `--cc-accent` | `#a02a2a` | Ink red — name, PRIME stamp, modifiers |
| `--cc-parchment` | `#f7efde` | Paper card background |
| `--cc-plain` | `#fbf6e8` | Section card fill |
| `--cc-card-border` | `#d4c5a0` | Soft section card border |
| `--cc-card-line` | `#c8b890` | Dotted row separators |
| `--cc-sidebar-bg` | `linear-gradient(180deg, #4a3826 0%, #3a2a1a 100%)` | Sidebar |
| `--cc-tab-active-bg` | `rgba(255,250,235,0.95)` | Active tab pill |
| `--cc-tab-text` | `#d8c8a8` | Inactive tab label |

### Typography

| Role | Stack | Key sizes |
|---|---|---|
| Heading/display | `"Crimson Text", Georgia, serif` | Name 30px/600/italic; stat value 26px/600; section title 14px/600/italic; stamp value 13px |
| Body/labels | `"IBM Plex Sans", system-ui, sans-serif` | Tab label 14px; stamp label 8px/uppercase; table header 9px/500/uppercase |
| Numeric/formula | `ui-monospace, monospace` | Modifier 11px/600; damage 11px; weight 11px |

### Font Bundling

Crimson Text and IBM Plex Sans are bundled as local webfonts in `src/styles/`, following the exact same `@font-face` pattern as the existing Soutane and TeX Gyre Adventor declarations.

**Crimson Text** — 4 weights required:

| Weight | Style | Filename pattern |
|---|---|---|
| 400 | normal | `crimsontext-regular-webfont.woff2`, `.woff` |
| 400 | italic | `crimsontext-italic-webfont.woff2`, `.woff` |
| 600 | normal | `crimsontext-semibold-webfont.woff2`, `.woff` |
| 600 | italic | `crimsontext-semibolditalic-webfont.woff2`, `.woff` |

**IBM Plex Sans** — 3 weights required:

| Weight | Style | Filename pattern |
|---|---|---|
| 400 | normal | `ibmplexsans-regular-webfont.woff2`, `.woff` |
| 500 | normal | `ibmplexsans-medium-webfont.woff2`, `.woff` |
| 600 | normal | `ibmplexsans-semibold-webfont.woff2`, `.woff` |

Source: download from [Google Fonts](https://fonts.google.com) or [Fontsource](https://fontsource.org). Latin subset preferred to minimize file size.

Each `@font-face` declaration follows this pattern (matching existing Soutane declarations):

```css
@font-face {
  font-family: 'Crimson Text';
  src: url('crimsontext-regular-webfont.woff2') format('woff2'),
       url('crimsontext-regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
```

Note: the existing Soutane declarations include `.eot`, `.ttf`, and `.svg` formats for legacy IE support. The new fonts only need `woff2` and `woff` — Foundry runs on Chromium/Electron and does not need IE fallbacks.

### HTML Components

#### `.cc-sheet-body`
Top-level flex row inside the `<form>`. Fills the Foundry application window. Contains `.cc-sidebar` (fixed 140px, `flex-shrink: 0`) and `.cc-paper-card` (`flex: 1`).

The `<form>` retains its existing classes (`tlgcc sheet actor character flexcol`) but removes the `.tlgbackground` class (the watermark background is replaced by the new wood-mat on `.cc-sheet-body`).

#### `.cc-sidebar`
Dark gradient column. Styles: `background: var(--cc-sidebar-bg)`, `width: 140px`, `flex-shrink: 0`, `display: flex`, `flex-direction: column`, `padding: 14px 0`, `box-shadow: inset -2px 0 6px rgba(0,0,0,0.3)`.

Contains:
- `nav.sheet-tabs.tabs[data-group=primary]` — five `<a class="item">` tab links. Foundry adds/removes `.active` automatically.
- `.cc-sidebar-identity` — character name, level·class, race. Separated from the nav by a 1px divider (`border-top: 1px solid rgba(0,0,0,0.3)`).

Tab link HTML:
```html
<nav class="sheet-tabs tabs" data-group="primary">
  <a class="item" data-tab="combat">⚔ <span>Combat</span></a>
  <a class="item" data-tab="features">✦ <span>Abilities</span></a>
  <a class="item" data-tab="items">⚒ <span>Equipment</span></a>
  <a class="item" data-tab="spells">✶ <span>Spells</span></a>
  <a class="item" data-tab="description">☙ <span>Description</span></a>
</nav>
```

Active tab styling (`.tlgcc .sheet-tabs .item.active`):
- `background: var(--cc-tab-active-bg)`
- `border-left: 3px solid var(--cc-accent)`
- `font-family: "Crimson Text", Georgia, serif`
- `font-weight: 600; font-style: italic`
- Glyph color: `var(--cc-accent)`

Inactive tab styling (`.tlgcc .sheet-tabs .item`):
- `background: transparent`
- `border-left: 3px solid transparent`
- `color: var(--cc-tab-text)`

Identity strip (`.cc-sidebar-identity`):
```html
<div class="cc-sidebar-identity">
  <div class="cc-sidebar-name">{{actor.name}}</div>
  <div class="cc-sidebar-meta">Lvl {{system.level.value}} · {{system.class.value}}</div>
  <div class="cc-sidebar-meta">{{system.race.value}}</div>
</div>
```
Styles: name 13px/Crimson Text/`#f0e0c0`; meta 10px/`#b8a888`; `padding: 12px 14px`.

#### `.cc-paper-card`
Parchment content area. Styles:
- `background: var(--cc-parchment)`
- `padding: 18px 22px 20px`
- `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)`
- `box-shadow: 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)`
- `display: flex; flex-direction: column; gap: 12px; overflow: hidden`

`::before` tape strip:
```css
.tlgcc .cc-paper-card::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(-1.2deg);
  width: 110px;
  height: 18px;
  background: rgba(220,200,150,0.7);
  background-image: repeating-linear-gradient(135deg, rgba(255,255,255,0.3) 0 4px, transparent 4px 8px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  z-index: 2;
}
```

#### `.cc-sheet-header`
Horizontal flex row at the top of `.cc-paper-card`. `flex-shrink: 0`. Contains `.cc-portrait` and `.cc-identity`.

`.cc-portrait` — wrapper for the portrait image:
```html
<div class="cc-portrait">
  <img class="profile-img" src="{{actor.img}}" data-edit="img" title="{{actor.name}}" width="64" height="64" />
</div>
```
Styles: `width: 64px; height: 64px; position: relative; flex-shrink: 0`. Border: `1px dashed var(--cc-muted)`. `::before` tape strip: `width: 36px; height: 12px; background: rgba(220,200,150,0.8); transform: translateX(-50%) rotate(-2deg); top: -6px; left: 50%`.

`.cc-identity` — name + stamp fields:
```html
<div class="cc-identity">
  <input class="cc-char-name" name="name" type="text" value="{{actor.name}}" />
  <div class="cc-stamp-row">
    <!-- stamp fields -->
  </div>
</div>
```
`.cc-char-name`: `font-family: "Crimson Text", Georgia, serif; font-size: 30px; font-weight: 600; font-style: italic; color: var(--cc-accent); border-bottom: 2px solid var(--cc-accent); transform: rotate(-0.3deg); display: inline-block`.

#### `.cc-stamp-field`
Dashed-border labeled input tile:
```html
<div class="cc-stamp-field">
  <span class="cc-stamp-label">HP</span>
  <div class="cc-stamp-inputs">
    <input name="system.hitPoints.value" value="{{system.hitPoints.value}}" />
    <span>/</span>
    <input name="system.hitPoints.max" value="{{system.hitPoints.max}}" />
  </div>
</div>
```
Styles: `border: 1px dashed var(--cc-muted); background: rgba(255,255,255,0.4); padding: 2px 8px; display: inline-flex; flex-direction: column; min-width: 40px`.
Label (`.cc-stamp-label`): `font-size: 8px; letter-spacing: 1px; text-transform: uppercase; color: var(--cc-muted); font-family: "IBM Plex Sans", system-ui, sans-serif`.
Value inputs: `font-family: "Crimson Text", Georgia, serif; font-size: 13px; color: var(--cc-text)`.

#### `.cc-stat-panel` / `.cc-stat-panel--prime`
Ability score card:
```html
<div class="cc-stat-panel {{#if ability.ccprimary}}cc-stat-panel--prime{{/if}}">
  {{#if ability.ccprimary}}<span class="cc-prime-stamp">PRIME</span>{{/if}}
  <label class="cc-stat-abbr rollable"
         data-roll="d20+@abilities.{{key}}.bonus+@level.value"
         data-label="<b>{{ability.label}}</b> Ability CHECK. <br><b>Prime: <em>{{ability.ccprimary}}</em></b>">
    {{ability.label}}
  </label>
  <input class="cc-stat-value" type="text"
         name="system.abilities.{{key}}.value"
         value="{{ability.value}}" data-dtype="Number" />
  <span class="cc-stat-mod">{{numberFormat ability.bonus decimals=0 sign=true}}</span>
  <span class="cc-stat-roll">roll</span>
  <input type="checkbox" class="cc-prime-checkbox"
         name="system.abilities.{{key}}.ccprimary"
         {{checked ability.ccprimary}} />
</div>
```

Base panel: `padding: 8px 4px 6px; text-align: center; position: relative`.
Non-prime: `border: 1px dashed var(--cc-muted); transform: rotate(0.2deg); background: var(--cc-plain)`.
Prime: `border: 2px solid var(--cc-accent); transform: rotate(-0.4deg); background: #fff8e1; box-shadow: 0 2px 0 rgba(160,42,42,0.15)`.

`.cc-stat-abbr`: `font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--cc-muted); font-family: "IBM Plex Sans", system-ui, sans-serif; cursor: pointer`.
`.cc-stat-value`: `font-size: 26px; font-weight: 600; font-family: "Crimson Text", Georgia, serif; color: var(--cc-text); width: 100%; text-align: center`.
`.cc-stat-mod`: `font-size: 11px; font-weight: 600; font-family: ui-monospace, monospace; color: var(--cc-accent)`.
`.cc-stat-roll`: `font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--cc-muted)`.
`.cc-prime-stamp`: `position: absolute; top: -8px; right: -6px; background: var(--cc-accent); color: #fff8e1; font-size: 8px; letter-spacing: 1px; padding: 2px 5px; font-weight: 600; transform: rotate(8deg); border: 1px solid #fff`.

#### `.cc-section` / `.cc-section--pinned`
Generic bordered content card:
```html
<div class="cc-section {{#if pinned}}cc-section--pinned{{/if}}">
  <div class="cc-section-header">
    <span class="cc-section-title">Weapons</span>
    <a class="item-create cc-add-btn" data-type="weapon">+ Add</a>
  </div>
  <div class="cc-section-body"><!-- content --></div>
</div>
```
Styles: `background: var(--cc-plain); border: 1px solid var(--cc-muted); box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column`.
Header: `padding: 6px 10px; border-bottom: 1px solid var(--cc-muted); background: rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: space-between`.
Title: `font-family: "Crimson Text", Georgia, serif; font-size: 14px; font-style: italic; font-weight: 600; color: var(--cc-text)`.

`.cc-section--pinned::before`: `content: ''; position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #ff6868, #b02020); box-shadow: 0 2px 3px rgba(0,0,0,0.3); z-index: 1`.

#### `.cc-coin-tile`
Currency input tile:
```html
<div class="cc-coin-tile cc-coin-tile--gold">
  <span class="cc-stamp-label">Gold</span>
  <input type="number" name="system.money.gp.value" value="{{system.money.gp.value}}" />
</div>
```
Base: `background: var(--cc-plain); border: 1px dashed var(--cc-muted); padding: 6px 8px; text-align: center; position: relative`.
Coin dot (`::after`): `position: absolute; top: 4px; right: 4px; width: 10px; height: 10px; border-radius: 50%; opacity: 0.7; box-shadow: inset 0 1px 2px rgba(0,0,0,0.3)`.
`.cc-coin-tile--platinum::after { background: #a0a0b8 }`
`.cc-coin-tile--gold::after { background: #c8a13a }`
`.cc-coin-tile--silver::after { background: #a8a8a0 }`
`.cc-coin-tile--copper::after { background: #b07050 }`

#### `.cc-ruled-prose`
Rich-text editor container:
```html
<div class="cc-ruled-prose {{#if pinned}}cc-section--pinned{{/if}}">
  <div class="cc-section-header">
    <span class="cc-section-title">Appearance</span>
  </div>
  <div class="cc-ruled-prose-body">
    {{editor system.appearance target="system.appearance" rollData=rollData button=true owner=owner editable=editable}}
  </div>
</div>
```
`.cc-ruled-prose-body`: `padding: 10px 14px; font-family: "Crimson Text", Georgia, serif; font-size: 14px; font-style: italic; line-height: 1.55; color: var(--cc-text); background-image: repeating-linear-gradient(transparent 0 22px, #c8b890 22px 23px); background-position: 0 6px`.


---

## Data Models

No data model changes. All fields used in the redesigned templates map directly to the existing schema. The table below confirms the mapping for every new component:

| Component | Field path(s) |
|---|---|
| Portrait | `actor.img` |
| Character name | `actor.name` (via `name="name"`) |
| HP stamp | `system.hitPoints.value`, `system.hitPoints.max` |
| LVL stamp | `system.level.value` |
| CLASS stamp | `system.class.value` |
| RACE stamp | `system.race.value` |
| DEITY stamp | `system.deity.value` |
| TITLE stamp | `system.title.value` |
| ALIGNMENT stamp | `system.alignment.value` |
| XP stamp | `system.xp.value`, `system.xp.next` |
| Stat panels | `system.abilities.{str,dex,con,int,wis,cha}.{value,bonus,ccprimary,label}` |
| AC tile | `system.armorClass.value` |
| BTH tile | `system.attackBonus.value` |
| Move tile | `system.move.value` |
| HD tile | `system.hdSize.value` |
| Resources | `system.resources.{key}.{name,value}` |
| Coin tiles | `system.money.{pp,gp,sp,cp}.value` |
| Valuables | `system.valuables.value` |
| Spell slots | `system.spellsPerLevel.value.{0-9}` |
| Description facts | `system.{size,height,sex,weight,age}.value` |
| Language | `system.language.value` |
| Origin | `system.origin.value` |
| Appearance | `system.appearance` |
| Biography | `system.biography` |

---

## Tab Content Specifications

### Combat Tab (`actor-combat.html` + root template)

The combat tab content is split between the root template (ability stat panels and resources) and the `actor-combat.html` partial (combat stats, weapons, armor). The redesign consolidates all combat content into `actor-combat.html` and restructures the root template accordingly.

**Layout:**
```
.tab.combat
  .cc-stat-grid (6-column grid)
    .cc-stat-panel × 6  ({{#each system.abilities}})
  .cc-combat-columns (grid: 1.5fr 1fr)
    .cc-combat-left
      .cc-combat-stat-row (4 stamp tiles: AC, BTH, Move, HD)
      .cc-section "Weapons"
        table.cc-table (header + {{#each weapons}} rows)
      .cc-section "Armor"
        table.cc-table (header + {{#each armors}} rows)
    .cc-section.cc-section--pinned "Trackable Resources"
      {{#each system.resources}} rows
```

Weapons table columns: Weapon (Crimson Text 13px) · Atk/Dmg (attack buttons + damage button, existing SVG icons) · Actions (item-edit, item-delete). The existing melee/ranged/damage `<a class="rollable attack-button">` elements with their `data-roll-type`, `data-attack`, `data-roll`, `data-label` attributes are preserved exactly — only wrapped in the new table structure.

Armor table columns: Armor · AC · Actions.

Resources: each row is `name input (left) + value input (right)`, preserving `name="system.resources.{{key}}.name"` and `name="system.resources.{{key}}.value"`.

### Features Tab (`actor-features.html`)

Single section card "Special Abilities & Class Features".

Table columns: Feature (✦ glyph + italic Crimson Text name, `.rollable` on the image) · Formula (monospace, `.item-formula.item-prop.rollable` with `data-roll` and `data-label`) · Actions (item-edit, item-delete).

The ✦ glyph is added in the template before the feature name `<h4>`. The existing `data-item-id` on the `<li>` and all `.item-*` classes are preserved.

### Equipment Tab (`actor-items.html`)

**Layout:**
```
.tab.items
  .cc-coin-row (grid: repeat(4, 80px) 1fr)
    .cc-coin-tile--platinum
    .cc-coin-tile--gold
    .cc-coin-tile--silver
    .cc-coin-tile--copper
    .cc-valuables-tile (wider, italic Crimson Text input)
  .cc-section "Equipment"
    table.cc-table (header with carriedWeight + {{#each gear}} rows)
```

Gear table columns: Qty (monospace `×N`) · Item (Crimson Text) · Weight (right-aligned monospace) · Actions.

### Spells Tab (`actor-spells.html`)

**Layout:**
```
.tab.spells
  .cc-spell-slots (dashed-border tile)
    header row: "Spell Slots" title + helper text
    .cc-slot-grid (10-column: {{#each system.spellsPerLevel.value}})
      .cc-slot-tile per level (label + input)
  .cc-section "Spells Known & Prepared"
    {{#each spells as |spells spellLevel|}}
      .cc-spell-level-header (tinted band: "Level N" + "Prepared")
      {{#each spells as |item id|}}
        .cc-spell-row (prepared controls + name + cast affordance + actions)
```

Each spell row preserves: `.rollable` with `data-roll-type="item"` and `data-label` on the cast image; `.spell-prepare` with `data-change="-1"` and `data-change="+1"`; `.item-edit`, `.item-delete`; `data-item-id` on the row; optional damage `.rollable` with `data-roll-type="damage"`.

The `.item-create` anchor preserves `data-spell-level-value="{{spellLevel}}"` and `data-type="spell"`.

### Description Tab (`actor-description.html`)

**Layout:**
```
.tab.biography
  .cc-fact-row (5-column grid: Size, Height, Sex, Weight, Age stamp tiles)
  .cc-text-row (2-column grid: Language tile, Origin tile)
  .cc-prose-row (2-column grid: flex 1)
    .cc-ruled-prose "Appearance"
    .cc-ruled-prose.cc-section--pinned "Biography & Notes"
```

All `name="system.*"` and `id` attributes on fact tile inputs are preserved. The `{{editor}}` helper calls for Appearance and Biography are unchanged — only wrapped in `.cc-ruled-prose-body`.

---

## Error Handling

This feature has no new runtime logic, so there are no new error paths to handle. The relevant failure modes are all build-time or load-time:

**Font files missing from `src/styles/`**
The browser silently falls back to the next font in the stack (Georgia for Crimson Text, system-ui for IBM Plex Sans). The sheet remains functional; typography degrades gracefully. Mitigation: verify all font files are present before committing.

**Broken `@font-face` `src:` URL**
Same graceful degradation. Foundry serves files from `systems/castles-and-crusades/styles/`; the `@font-face` declarations use relative URLs (matching the existing Soutane pattern), which resolve correctly when the CSS is served from that path.

**CSS `clip-path` not supported**
`clip-path: polygon(...)` has broad support in Chromium-based Foundry clients. No fallback needed; the card renders without the folded corner if unsupported.

**Functional hook accidentally removed**
If a `name="system.*"` attribute or a `.rollable`/`.item-edit`/etc. class is omitted during template restructuring, Foundry's form submission or event listeners silently fail (no data saved, no roll triggered). Mitigation: the task list includes an explicit audit step comparing each redesigned partial against the original before marking the task complete.

**`defaultOptions.width` not updated**
The sidebar adds 140px of fixed width. If `defaultOptions.width` remains at 780, the paper card gets 640px of content width — workable but tighter than the prototype's 740px. Recommended update: `width: 880` to match the prototype dimensions. This is the only change needed in `actor-sheet.ts`.

---

## Testing Strategy

Property-based testing is not applicable to this feature. The feature consists entirely of HTML template restructuring and CSS authoring — UI rendering and layout work. There is no pure function logic, no data transformation, and no input space that benefits from randomized iteration. This is explicitly one of the cases where PBT should not be used (UI rendering and layout).

The appropriate testing approach is:

### 1. Template Audit (manual, pre-merge)

Before marking any template task complete, diff the redesigned partial against the original and verify:

- Every `name="system.*"` attribute present in the original is present in the redesign.
- Every `.rollable`, `.item-edit`, `.item-delete`, `.item-create`, `.spell-prepare` class is present.
- Every `data-roll`, `data-roll-type`, `data-attack`, `data-label`, `data-change`, `data-item-id`, `data-type`, `data-spell-level-value` attribute is present.
- `data-edit="img"` is on the portrait `<img>`.
- `data-group="primary"` is on the `<nav>` and `data-tab` is on every tab link and content div.
- All `{{editor}}` and `{{localize}}` helper calls are unchanged.

This audit is the primary correctness gate for Requirement 12.

### 2. Build Verification (automated, CI)

`npm run build` must complete without errors. Verify:
- All modified files appear in `dist/templates/` and `dist/styles/`.
- New font files appear in `dist/styles/`.
- No TypeScript compilation errors.

### 3. Visual Smoke Test (manual, in Foundry)

Open a character sheet in Foundry after deploying the build:
- All five tabs are accessible and switch correctly.
- The sidebar renders with the dark gradient and correct tab glyphs.
- The paper card renders with parchment background and folded corner.
- The sheet header shows portrait, name, and stamp fields.
- Ability stat panels render with correct prime/non-prime styling.
- Fonts load (Crimson Text visible on character name and stat values; IBM Plex Sans on labels).
- No console errors related to missing templates or styles.

### 4. Functional Regression Test (manual, in Foundry)

After visual smoke test passes:
- Click each ability stat panel — confirm roll dialog appears.
- Click melee/ranged/damage buttons on a weapon — confirm roll dialog appears.
- Click Cast on a spell — confirm roll dialog appears.
- Toggle a spell's prepared count — confirm value updates.
- Edit a weapon, armor, gear, spell, or feature — confirm item sheet opens.
- Delete an item — confirm it is removed.
- Edit the character name and HP — confirm values save on close/reopen.
- Click the portrait — confirm file picker opens.

### 5. Cross-tab Layout Check (manual)

Switch to each of the five tabs and confirm:
- No layout overflow or clipping of content.
- Section cards render with correct borders and push-pin decorations where specified.
- Ruled-paper background appears in Appearance and Biography editors.
- Coin tiles show correct metal-color dots.
- Spell slot tiles render in a 10-column row.
