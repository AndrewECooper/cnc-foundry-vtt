# Requirements — C&C Item Sheets Visual Redesign

## Goal

Replace the visual styling of the five C&C item dialogs — **Ability (Feature), Equipment, Spell, Weapon, and Armor** — with the **Tabletop Hybrid** skin already used on the Character Sheet and Monster Sheet. **Behavior and data are unchanged.**

## Scope

### In scope
- Visual styling of the five item sheet Handlebars templates.
- Window chrome (title bar area, close/sheet buttons) — restyle only.
- Header (icon + name + type label).
- All form fields present in the current production templates.
- Shared CSS additions to `src/styles/castles_crusades.css` (the single system stylesheet).

### Out of scope
- Adding, removing, or renaming any field.
- Changing data model, validation, save flow, or roll handlers.
- Animations or transitions.
- The Character Sheet and Monster Sheet (already shipped).
- The generic fallback `item-sheet.html` (not used in practice).

## Functional requirements

### FR-1 — Field inventory is preserved verbatim

Each form must include exactly these fields and no others:

| Form | Fields | Template file |
|---|---|---|
| Ability (Feature) | Name, Roll Formula, Feature Hover Text | `item-feature-sheet.html` |
| Equipment | Name, Quantity, Price, Weight, EV | `item-item-sheet.html` |
| Spell | Name, Cast Time, Range, Duration, Level, SV, SR, Comp, Damage, Prepared, Components, Class, Spell Summary, Spell Description | `item-spell-sheet.html` |
| Weapon | Name, Price, Weight, EV, Damage, Bonus AB, Range | `item-weapon-sheet.html` |
| Armor | Name, Price, Weight, EV, AC | `item-armor-sheet.html` |

### FR-2 — Existing image/icon slot
Each form retains its `<img data-edit="img">` slot in the same position (top-left of the body), restyled to match the icon tile in the prototype.

### FR-3 — Existing window controls
The title bar continues to expose the Foundry "Sheet" and "Close" controls and they behave exactly as today.

### FR-4 — Save / persistence
Form submits, `name="system.*"` field bindings, and dirty-state behavior are unchanged. Only markup and CSS classes change.

### FR-5 — Rich text editors
The `{{editor}}` helper calls in Spell Description (and any other description areas) are preserved verbatim. They are restyled to look like ruled-paper areas but their editing capability is unchanged.

### FR-6 — Armor sheet included
The Armor sheet (`item-armor-sheet.html`) receives the same Tabletop Hybrid treatment as the other four, even though it is not covered by the design handoff prototype. Its field layout (Price, Weight, EV, AC) follows the same stamp-input row pattern as Equipment and Weapon.

## Non-functional requirements

### NFR-1 — Visual fidelity
Pixel-close match to `design_handoff_item_forms/item-forms.jsx`:
- Colors, typography, spacing, dashed borders, tape strip, folded corner, and ruled-paper text area reproduced as specified in `design.md`.
- Armor sheet follows the same visual language by analogy (no separate prototype exists for it).

### NFR-2 — Consistent with Character Sheet and Monster Sheet
Use the CSS custom properties already defined in `src/styles/castles_crusades.css` from the previous redesigns. Do not introduce parallel color or font variables. If a token is missing, add it to the shared stylesheet and reuse it everywhere.

### NFR-3 — Single stylesheet
All new styles go in `src/styles/castles_crusades.css`, scoped under `.tlgcc`. The project does not use SCSS partials — do not introduce a build step or separate files. New component classes use the `.cc-` prefix.

### NFR-4 — No React
The forms are rendered through Foundry's Handlebars system. The JSX prototype is reference only.

### NFR-5 — Accessibility
- All inputs keep their `<label>` association (existing `for`/`id` pairs preserved).
- Color contrast at dashed-border fields stays AA against the parchment background.
- Tab order top-to-bottom, left-to-right matches the visual order.

### NFR-6 — No regressions
- Character Sheet and Monster Sheet continue to look and function correctly.
- No new browser console warnings.

## Acceptance criteria

1. Opening any of the five item forms in Foundry shows the Tabletop Hybrid look matching the prototype (or, for Armor, matching the visual language of the other forms).
2. No field is added or removed compared to the current production templates.
3. Save, close, and any roll affordances work exactly as before.
4. The visual style matches the Character Sheet — same wood mat, same parchment, same tape strip, same accent red, same fonts.
5. No console warnings introduced.
6. Character Sheet and Monster Sheet are visually unchanged.
