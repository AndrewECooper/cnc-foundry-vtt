// import { ItemSheet } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents/item.js";
// import { TextEditor } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/apps/text-editor.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 */
export class TlgccItemSheet extends ItemSheet {
  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['tlgcc', 'sheet', 'item'],
      width: 720,
      height: 480,
    });
  }

  override get template() {
    const path = 'systems/castles-and-crusades/templates/item';
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  private async enrichTextFields(
    data: Record<string, any>,
    fieldNames: string[],
  ): Promise<void> {
    for (const fieldName of fieldNames) {
      if (foundry.utils.hasProperty(data, fieldName)) {
        const enrichedHTML = await TextEditor.enrichHTML(
          foundry.utils.getProperty(data, fieldName), //@ts-ignore
          { async: true },
        );
        foundry.utils.setProperty(data, fieldName, enrichedHTML);
      }
    }
  }

  // @ts-ignore
  override async getData(
    options?: Partial<DocumentSheetOptions>,
  ): Promise<ItemSheetData> {
    const context = await super.getData(options);
    const itemData = context.item;

    // @ts-ignore
    context.rollData = {};
    const actor = this.object?.parent ?? null;
    if (actor) {
      // @ts-ignore
      context.rollData = actor.getRollData();
    }

    // @ts-ignore
    context.system = itemData.system;
    // @ts-ignore
    context.flags = itemData.flags;

    await this.enrichTextFields(context, ['system.description']);

    // @ts-ignore
    return context;
  }

  override activateListeners(html: JQuery): void {
    super.activateListeners(html);

    if (!this.isEditable) return;

    // Add event listeners here
  }
}

interface ItemSheetData {
  item: foundry.documents.BaseItem;
  rollData: Record<string, any>;
  system: Record<string, any>;
  flags: Record<string, any>;
}