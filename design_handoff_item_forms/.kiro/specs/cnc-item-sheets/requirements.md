# Requirements — C&C Item Sheets Visual Refresh

## Goal
Replace the visual styling of the four C&C item dialogs (Ability, Equipment, Spell, Weapon) with the **Tabletop Hybrid** skin already used on the Character Sheet. **Behavior and data are unchanged.**

## Scope

### In scope
- Visual styling of the four item sheet templates (Handlebars partials + system CSS).
- Window chrome (title bar, close/sheet buttons) — restyle only.
- Header (icon + name + type label).
- All form fields shown in the screenshots referenced below.
- Empty / placeholder appearance for each input.

### Out of scope
- Adding, removing, or renaming any field.
- Changing data model, validation, save flow, or roll handlers.
- Animations or transitions.
- The Character Sheet (already shipped).

## Functional requirements

### FR-1 — Field inventory is preserved verbatim
Each form must include exactly these fields and no others:

| Form | Fields |
|---|---|
| Ability | Name, Roll Formula, Feature Hover Text |
| Equipment | Name, Quantity, Price, Weight, EV |
| Spell | Name, Cast Time, Range, Duration, Level, SV, SR, Comp, Damage, Prepared, Components, Class, Spell Summary, Spell Description |
| Weapon | Name, Price, Weight, EV, Damage, Bonus AB, Range |

### FR-2 — Existing image/icon slot
Each form retains its image slot in the same position (top-left of the body), restyled to match the Character Sheet's Portrait component.

### FR-3 — Existing window controls
The title bar continues to expose the "Sheet" and "Close" controls and they do exactly what they do today.

### FR-4 — Save / persistence
Form submits, field bindings, and dirty-state behavior are unchanged. Only the markup and CSS classes change.

### FR-5 — Spell description rich text
The "Spell Description" area remains a rich-text-capable editor (or whatever it is today). It is restyled to look like a ruled-paper area but its editing capability is unchanged.

## Non-functional requirements

### NFR-1 — Visual fidelity
Pixel-close match to `item-forms.jsx`:
- Colors from the token table in `design.md`.
- Crimson Text italic for the name + section headers + value text.
- IBM Plex Sans uppercase letter-spaced micro-labels.
- Monospace for numeric inputs (price, weight, dice formulas).
- Tape strip, folded corner, dashed field borders, ruled-paper text area — all reproduced.

### NFR-2 — Consistent with Character Sheet
Use the same tokens already defined in the system CSS for the Character Sheet redesign. **Do not introduce parallel color or font variables.** If a token doesn't exist yet from the previous handoff, add it to the shared stylesheet and reuse.

### NFR-3 — No React
The forms are rendered through Foundry's Handlebars system. The JSX prototype is reference, not source.

### NFR-4 — Accessibility
- All inputs keep their `<label>` association.
- Color contrast at the dashed-border field stays AA against the parchment background.
- Tab order top-to-bottom, left-to-right matches the visual order.

## Acceptance criteria
1. Opening any of the four forms in Foundry shows the Tabletop Hybrid look matching the prototype.
2. No field is added or removed compared to the current production forms.
3. Save, close, and any roll affordances work exactly as before.
4. The visual style matches the Character Sheet — same wood mat, same parchment, same tape strip, same accent red, same fonts.
5. No console warnings introduced.
