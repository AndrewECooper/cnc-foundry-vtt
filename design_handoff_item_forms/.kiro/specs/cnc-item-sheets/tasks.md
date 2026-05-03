# Tasks — C&C Item Sheets Visual Refresh

Run these in order. Each task is small enough for a single Kiro session and ends with a verifiable state.

## 1. Locate the existing item sheets
- [ ] Find each item sheet template in the system repo. Likely paths:
  - `templates/item/ability-sheet.html` (or `.hbs`)
  - `templates/item/equipment-sheet.html`
  - `templates/item/spell-sheet.html`
  - `templates/item/weapon-sheet.html`
- [ ] Find the `ItemSheet` subclasses (`module/sheets/item-*-sheet.js` or similar) that register them.
- [ ] Find the existing CSS file(s) for item sheets.
- [ ] Note the current field bindings (input `name=` attributes) — these are sacred and must not change.

**Done when:** you have a checklist of every file you'll touch.

## 2. Reuse / promote tokens from the Character Sheet redesign
- [ ] Open the Character Sheet's stylesheet partial.
- [ ] If colors/fonts/spacing live in a shared partial already, confirm it. Otherwise extract them into `styles/_tokens.scss` per the design doc §1.
- [ ] Add the IBM Plex Sans + Crimson Text font import (or asset file) if not already present.

**Done when:** all tokens from `design.md §1` resolve in CSS without redefining them locally.

## 3. Build the shared shell partial
- [ ] Create `templates/item/_partials/shell.html` containing:
  - Wood-mat outer container.
  - Title bar with `name`, `◆`, `type` label, and the existing `⚙ Sheet` / `✕ Close` controls (restyled).
  - Paper card with folded corner (`clip-path`) and tape strip.
  - Header partial (icon tile + name input + type stamp).
- [ ] Add CSS in `styles/_paper-card.scss` to back it.
- [ ] Render one of the existing item sheets (pick Equipment — simplest) using the new shell.

**Done when:** opening an Equipment item shows the new shell wrapping the existing fields, even if the inner fields still look old.

## 4. Build the field primitives
- [ ] Create partials for:
  - `_partials/stamp-input.html` (single line; supports `mono`, `width`, `suffix`)
  - `_partials/stamp-multiline.html` (textarea variant)
  - `_partials/stamp-select.html` (custom-arrow select)
  - `_partials/section.html` (bordered card with header strip)
  - `_partials/ruled-area.html` (textarea on ruled paper)
- [ ] Style each in `styles/_stamp-fields.scss` per `design.md §3`.
- [ ] Verify against `item-forms.jsx` — open the HTML prototype side-by-side.

**Done when:** the primitives render identically in isolation to the prototype.

## 5. Restyle Equipment form
- [ ] Replace the existing Equipment template body with one row of four `stamp-input` fields: Quantity, Price, Weight, EV.
- [ ] Keep input `name=` attributes intact.
- [ ] Confirm save round-trips correctly.

**Done when:** Equipment dialog matches the Equipment artboard in the prototype and saves work.

## 6. Restyle Ability form
- [ ] Header + one `stamp-input` for Roll Formula + a `stamp-multiline` for Feature Hover Text.

**Done when:** Ability dialog matches its artboard and saves work.

## 7. Restyle Weapon form
- [ ] Header + two rows of `stamp-input` per `design.md §4.4`.

**Done when:** Weapon dialog matches its artboard and saves work.

## 8. Restyle Spell form
- [ ] Header + four field rows + a `section` wrapping a `ruled-area` for the description.
- [ ] Make sure the description preserves whatever rich-text editor the original used (TinyMCE / ProseMirror — match existing system).
- [ ] Confirm `Components`, `Class`, and `Spell Summary` keep their existing bindings.

**Done when:** Spell dialog matches its artboard, the description editor still works, and saves round-trip.

## 9. QA sweep
- [ ] Open all four sheets in Foundry. Compare to prototype screenshots side-by-side.
- [ ] Tab through fields — order matches visual order.
- [ ] No console warnings.
- [ ] Open an existing actor's inventory; existing items render correctly.
- [ ] Confirm Character Sheet still looks unchanged.

**Done when:** all four sheets pass the comparison and existing data is intact.

## 10. Cleanup
- [ ] Remove any unused old CSS classes from the prior item sheet styling.
- [ ] Do **not** import `tweaks-panel.jsx` or `design-canvas.jsx` — those stay in the design bundle only.
- [ ] Update CHANGELOG / system notes.

**Done when:** dead code is gone and the changelog mentions the visual refresh.
