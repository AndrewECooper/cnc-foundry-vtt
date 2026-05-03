# Visual Language — Castles & Crusades Foundry System

This steering doc applies to **all** UI work in the C&C Foundry system repo. Kiro should consult it before generating or editing any sheet, dialog, chat card, or HUD element.

## Core direction
**Tabletop Hybrid** — a parchment paper card on a wood-grain mat. Every surface should feel like a thing on a table: tape, ink, ruled paper, dashed-stamp labels.

## Always
- Use Crimson Text italic for headlines, names, and value text.
- Use IBM Plex Sans uppercase 9px with 1.4px letter-spacing for micro-labels above fields.
- Use monospace for any numeric input (price, weight, dice formulas, levels).
- Wrap any new sheet/dialog body in a paper card with the folded corner and tape strip.
- Use `1px dashed #7a6b56` for field borders, `1px solid #7a6b56` for section card borders.
- Use the ink-red accent `#a02a2a` for the primary affordance only — name underlines, primary buttons, prepared checkmarks.

## Never
- Add fields to forms beyond what the existing data model already has.
- Introduce new colors, fonts, or radii outside the token table.
- Hand-draw decorative SVGs. The tape, the corner, the ruled lines, the hatch on the icon tile — all CSS.
- Use emoji as functional UI (the few glyphs in use — ⚔ ✦ ⚒ ✶ ◆ ✕ ⚙ — are intentional placeholders).
- Add filler content, helper paragraphs, or "explainer" copy to forms.
- Introduce React, Vue, or any framework. The system is Handlebars + vanilla JS.

## Tokens
Color, font, spacing, and decoration tokens live in the shared SCSS partial established by the Character Sheet refresh. **Reuse them.** If a value is missing, add it to the partial and use it everywhere — never inline a new color in a per-component file.

## Reference bundles
- `design_handoff_character_sheet/` — five-tab Character Sheet redesign.
- `design_handoff_monster_sheet/` — Monster Sheet redesign.
- `design_handoff_item_forms/` — Ability / Equipment / Spell / Weapon dialogs.

When in doubt, open the prototype JSX in those bundles and copy the literal values.
