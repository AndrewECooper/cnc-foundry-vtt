# Project Overview: Castles & Crusades Foundry VTT System

## What This Is

A game system module for Foundry VTT implementing the Castles & Crusades tabletop RPG rules. This is a fork of the upstream TLG repo. The fork's first goal is a visual redesign of the Player Character sheet.

## Repository Structure

```
src/                    ← edit here
  module/               ← TypeScript source (compiled to dist/)
    sheets/
      actor-sheet.ts    ← ActorSheet subclass; all roll/item listeners live here
    helpers/
      templates.ts      ← preloadHandlebarsTemplates() — register partials here
      handlebars.ts     ← custom Handlebars helpers
  styles/
    castles_crusades.css  ← single stylesheet; copied verbatim to dist/
  templates/
    actor/
      actor-character-sheet.html   ← PC sheet root template
      actor-monster-sheet.html
      parts/                       ← Handlebars partials (one per tab body)
        actor-combat.html
        actor-description.html
        actor-items.html
        actor-spells.html
        actor-features.html
        monster-combat.html
  assets/               ← images, copied verbatim to dist/
  lang/                 ← YAML i18n files, compiled to JSON in dist/

dist/                   ← build output; never edit directly
```

## Build

```bash
npm run build           # development build (copies src → dist)
npm run build:watch     # watch mode with livereload
npm run build:ci        # production build
```

Rollup copies `src/templates`, `src/styles`, `src/assets`, `src/lang` verbatim into `dist/`. TypeScript is compiled separately. **Always edit `src/`; never edit `dist/` directly.**

## Foundry Integration

- System ID: `castles-and-crusades`
- Template path prefix in Foundry: `systems/castles-and-crusades/templates/...`
- Style path prefix: `systems/castles-and-crusades/styles/...`
- The sheet class is `TlgccActorSheet` in `src/module/sheets/actor-sheet.ts`
- Sheet dimensions set in `TlgccActorSheet.defaultOptions`: currently 780×600

## Key Conventions

- All sheet CSS is scoped under `.tlgcc` (the class added by `defaultOptions.classes`)
- Foundry's `Tabs` controller drives tab switching via `data-group` / `data-tab` attributes
- Roll listeners use `.rollable` class; item CRUD uses `.item-edit`, `.item-delete`, `.item-create`
- Spell prepare uses `.spell-prepare` with `data-change` attribute
- Handlebars partials are preloaded in `templates.ts` and included with `{{> "systems/...path..."}}`
- i18n keys follow `TLGCC.*` convention; defined in `src/lang/en.yml`

## Data Schema (Character)

Key paths used in templates:

| Field | Path |
|---|---|
| Name | `actor.name` |
| Portrait | `actor.img` |
| HP | `system.hitPoints.value` / `.max` |
| Level | `system.level.value` |
| Class | `system.class.value` |
| Race | `system.race.value` |
| Deity | `system.deity.value` |
| Title | `system.title.value` |
| Alignment | `system.alignment.value` |
| XP | `system.xp.value` / `.next` |
| Abilities | `system.abilities.{str,dex,con,int,wis,cha}.{value,bonus,ccprimary,label}` |
| AC | `system.armorClass.value` |
| Attack Bonus | `system.attackBonus.value` |
| Move | `system.move.value` |
| HD Size | `system.hdSize.value` |
| Resources | `system.resources.{key}.{name,value}` |
| Money | `system.money.{pp,gp,sp,cp}.value` |
| Valuables | `system.valuables.value` |
| Spell slots | `system.spellsPerLevel.value` (array, index = level) |
| Size | `system.size.value` |
| Height | `system.height.value` |
| Sex/Gender | `system.sex.value` |
| Weight | `system.weight.value` |
| Age | `system.age.value` |
| Language | `system.language.value` |
| Origin/Hometown | `system.origin.value` |
| Appearance | `system.appearance` (rich text) |
| Biography | `system.biography` (rich text) |

Prepared items (weapons, armors, gear, spells, features) are passed as context arrays by `_prepareItems()` in `actor-sheet.ts`.
