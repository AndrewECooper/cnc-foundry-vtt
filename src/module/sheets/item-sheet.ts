/**
 * Extend the basic ItemSheet with some very simple modifications
 * @augments {ItemSheet}
 */
export class tlgccItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['tlgcc', 'sheet', 'item'],
      width: 520,
      height: 480,
    });
  }

  /** @override */
  get template() {
    const path = 'systems/castles-and-crusades/templates/item';
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */
  async _enrichTextFields(data, fieldNameArr) {
    for (let t = 0; t < fieldNameArr.length; t++) {
      if (foundry.utils.hasProperty(data, fieldNameArr[t])) {
        foundry.utils.setProperty(
          data,
          fieldNameArr[t],
          await TextEditor.enrichHTML(
            foundry.utils.getProperty(data, fieldNameArr[t]),
            {
              async: true,
            },
          ),
        );
      }
    }
  }

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = super.getData();
    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    let enrichedFields = ['system.description'];
    await this._enrichTextFields(context, enrichedFields);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
