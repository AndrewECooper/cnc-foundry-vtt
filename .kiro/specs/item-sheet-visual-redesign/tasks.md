# Tasks — C&C Item Sheets Visual Redesign

Run in order. Each task ends with a verifiable state. All work goes on `feature/item-sheet-visual-redesign`.

---

## 1. Audit existing templates and CSS

- [ ] Read all five item templates and record every `name="..."` attribute — these must not change.
  - `src/templates/item/item-feature-sheet.html`
  - `src/templates/item/item-item-sheet.html`
  - `src/templates/item/item-spell-sheet.html`
  - `src/templates/item/item-weapon-sheet.html`
  - `src/templates/item/item-armor-sheet.html`
- [ ] Read `src/styles/castles_crusades.css` and confirm which `--cc-*` custom properties are already defined.
- [ ] Note any `--cc-title-bar-bg` / `--cc-title-bar-text` tokens — add them if missing.
- [ ] Read `src/module/helpers/templates.ts` to understand how partials are registered.

**Done when:** you have a complete list of field bindings and know which CSS tokens need to be added.

---

## 2. Add missing CSS tokens and item sheet shell styles

- [ ] In `src/styles/castles_crusades.css`, add `--cc-title-bar-bg` and `--cc-title-bar-text` to the `:root` block if not already present.
- [ ] Add the item sheet shell CSS block (`.tlgcc.sheet.item`, `.cc-item-paper`, tape strip `::before`, wood-grain background) per `design.md §2` and `§6`.
- [ ] Add the item header CSS (`.cc-item-header`, `.cc-item-icon`, `.cc-item-name`, `.cc-type-stamp`) per `design.md §2.3`.
- [ ] Add the field primitive CSS (`.cc-stamp-field`, `.cc-stamp-row`) per `design.md §3` and `§6`.
- [ ] Add the form section CSS (`.cc-form-section`, `.cc-form-section-header`, `.cc-ruled-area`) per `design.md §3.5` and `§6`.
- [ ] Run `npm run build` and confirm no CSS errors.

**Done when:** build passes and the new CSS classes exist in `dist/`.

---

## 3. Create Handlebars partials

- [ ] Create `src/templates/item/parts/` directory.
- [ ] Create `src/templates/item/parts/stamp-input.html` — wraps a single `<input>` with micro-label and dashed border per `design.md §3.1`.
- [ ] Create `src/templates/item/parts/stamp-multiline.html` — wraps a `<textarea>` per `design.md §3.2`.
- [ ] Create `src/templates/item/parts/form-section.html` — bordered card with header strip per `design.md §3.5`.
- [ ] Create `src/templates/item/parts/ruled-area.html` — ruled-paper textarea per `design.md §3.4`.
- [ ] Register all four partials in `src/module/helpers/templates.ts`.
- [ ] Run `npm run build` and confirm no template errors.

**Done when:** partials are registered and build passes.

---

## 4. Restyle Equipment form

- [ ] Rewrite `src/templates/item/item-item-sheet.html` using the new shell and partials per `design.md §4.2`.
- [ ] Preserve all `name="system.*"` attributes exactly.
- [ ] Preserve `data-edit="img"` on the icon.
- [ ] Run `npm run build`. Open an Equipment item in Foundry and confirm it matches the Equipment artboard in `design_handoff_item_forms/Item Forms.html`.
- [ ] Edit a field value and save — confirm the value persists.

**Done when:** Equipment dialog matches the prototype and saves correctly.

---

## 5. Restyle Ability (Feature) form

- [ ] Rewrite `src/templates/item/item-feature-sheet.html` per `design.md §4.1`.
- [ ] Preserve `name="system.formula.value"` and `name="system.feature.value"`.
- [ ] Run `npm run build`. Open an Ability item and confirm it matches the Ability artboard.
- [ ] Confirm save round-trips.

**Done when:** Ability dialog matches the prototype and saves correctly.

---

## 6. Restyle Weapon form

- [ ] Rewrite `src/templates/item/item-weapon-sheet.html` per `design.md §4.4`.
- [ ] Preserve all six field `name=` attributes.
- [ ] Run `npm run build`. Open a Weapon item and confirm it matches the Weapon artboard.
- [ ] Confirm save round-trips.

**Done when:** Weapon dialog matches the prototype and saves correctly.

---

## 7. Restyle Armor form

- [ ] Rewrite `src/templates/item/item-armor-sheet.html` per `design.md §4.5`.
- [ ] Preserve `name="system.price.value"`, `name="system.weight.value"`, `name="system.itemev.value"`, `name="system.armorClass.value"`.
- [ ] Run `npm run build`. Open an Armor item and confirm it matches the visual language of the other forms.
- [ ] Confirm save round-trips.

**Done when:** Armor dialog matches the Tabletop Hybrid look and saves correctly.

---

## 8. Restyle Spell form

- [ ] Rewrite `src/templates/item/item-spell-sheet.html` per `design.md §4.3`.
- [ ] Preserve all field `name=` attributes (13 fields total).
- [ ] Preserve the `{{editor}}` call for `system.description` inside the `.cc-form-section` / ruled-area wrapper.
- [ ] Run `npm run build`. Open a Spell item and confirm it matches the Spell artboard.
- [ ] Confirm the description editor still opens and saves.
- [ ] Confirm save round-trips for all other fields.

**Done when:** Spell dialog matches the prototype, the description editor works, and all fields save correctly.

---

## 9. Update `TlgccItemSheet` default width

- [ ] In `src/module/sheets/item-sheet.ts`, change `width: 720` to `width: 560` in `defaultOptions`.
- [ ] Run `npm run build`. Open each of the five item dialogs and confirm they render at the correct width without clipping.

**Done when:** all five dialogs open at 560px wide with no layout overflow.

---

## 10. QA sweep

- [ ] Open all five item sheets in Foundry. Compare each to the corresponding artboard in `design_handoff_item_forms/Item Forms.html` (or the visual language of the other forms, for Armor).
- [ ] Tab through fields in each form — order matches visual order top-to-bottom, left-to-right.
- [ ] Open the browser console — no new warnings or errors.
- [ ] Open the Character Sheet and Monster Sheet — confirm they are visually unchanged.
- [ ] Open an existing actor's inventory — existing items render correctly in the inventory list.
- [ ] Edit and save a value in each form type — confirm persistence.

**Done when:** all five sheets pass the comparison, no regressions, no console noise.

---

## 11. Cleanup

- [ ] Remove any dead CSS from the old item sheet styling that is no longer referenced.
- [ ] Confirm `tweaks-panel.jsx` and `design-canvas.jsx` from the handoff bundle are not imported anywhere in `src/`.
- [ ] Add an entry to `CHANGELOG.md` noting the item sheet visual refresh.
- [ ] Run `npm run build` one final time — clean build, no warnings.

**Done when:** dead code is removed, changelog updated, and final build is clean.
