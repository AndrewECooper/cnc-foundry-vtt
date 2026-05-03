# Castles & Crusades Item Sheets — Visual Refresh (Kiro Handoff)

A visual redesign of the four item dialogs in the Castles & Crusades Foundry VTT system: **Ability**, **Equipment**, **Spell**, and **Weapon**. Each remains its own dialog opened from the character sheet — **only the look and feel changes**. No fields are added or removed; the data model is untouched.

## What's in this bundle

| Path | Purpose |
|---|---|
| `Item Forms.html` | Prototype shell. Open in a browser to interact with all four forms side-by-side. |
| `item-forms.jsx` | All four forms + shared tokens, primitives, and shell. **Single source of truth for the design.** |
| `design-canvas.jsx` | Tooling for the side-by-side artboard view. **Not for production.** |
| `tweaks-panel.jsx` | Tooling for the parchment toggle. **Not for production.** |
| `.kiro/specs/cnc-item-sheets/requirements.md` | What the redesign must deliver. |
| `.kiro/specs/cnc-item-sheets/design.md` | Tokens, layout, per-form spec. |
| `.kiro/specs/cnc-item-sheets/tasks.md` | Step-by-step implementation plan for Kiro. |
| `.kiro/steering/visual-language.md` | Persistent style guide so Kiro keeps the look consistent across follow-ups. |

## How to use this with Kiro

1. Drop the `.kiro/` directory into the root of the Foundry system repo (the same repo that holds the existing C&C system code).
2. In Kiro, open the spec at `.kiro/specs/cnc-item-sheets/` — Kiro will pick up the three spec docs automatically.
3. Run the tasks in order. The spec is self-contained and references the prototype files in this bundle; keep this `design_handoff_item_forms/` folder available so Kiro can read the exact CSS values out of `item-forms.jsx` when needed.
4. The steering file in `.kiro/steering/visual-language.md` applies repo-wide so Kiro doesn't drift from the Tabletop Hybrid look on later edits.

## Design direction (one-line summary)

**Tabletop Hybrid** — a parchment paper card on a wood-grain mat, with a tape-strip header, folded-corner clip, masking-tape stamp fields, ruled-paper text areas, ink-red accents, Crimson Text italic headlines, IBM Plex Sans labels, monospace numerics. Matches the already-shipped Character Sheet redesign exactly.

## Field inventory (verbatim from the existing forms — DO NOT add or remove)

- **Ability** — Name, Roll Formula, Feature Hover Text
- **Equipment** — Name, Quantity, Price, Weight, EV
- **Spell** — Name, Cast Time, Range, Duration, Level, SV, SR, Comp, Damage, Prepared, Components, Class, Spell Summary, Spell Description
- **Weapon** — Name, Price, Weight, EV, Damage, Bonus AB, Range

Each form also has the existing image/icon slot and existing description body (where present today). Window-chrome controls (`⚙ Sheet`, `✕ Close`) are unchanged in behavior.

## Fidelity

**High.** Reproduce colors, typography, spacing, dashed borders, tape strip, folded corner, and the slight rotation on the title underline pixel-close. Sample values shown in the prototype (`d100`, `Stabby`, `1d6`, etc.) are placeholders — bind the real item data in their place.

## What NOT to do

- Do not add fields beyond the inventory above.
- Do not introduce React. Recreate using the system's existing Handlebars templates.
- Do not ship `tweaks-panel.jsx` or `design-canvas.jsx` — those are prototype tooling.
- Do not change behaviors — clicking Save still saves, Close still closes, etc.
