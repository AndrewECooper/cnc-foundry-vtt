export class tlgccItem extends Item {
  [x: string]: any;
  override prepareData(): void {
    super.prepareData();
  }

  // @ts-ignore
  override getRollData(): object | null {
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    // @ts-ignore
    rollData.item = foundry.utils.deepClone(this.system);
    return rollData;
  }

  async roll(): Promise<Roll | void> {
    if (!this.actor) {
      console.warn("Cannot roll item without an associated actor");
      return;
    }

    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    // @ts-ignore
    const rollMode = game.settings.get('core', 'rollMode');
    // @ts-ignore
    const label = `Roll: ${game.i18n.localize(`ITEM.Type${this.type.capitalize()}`)} - ${this.name}`;

    if (!this.system.formula?.value) {
      // @ts-ignore
      return ChatMessage.create({
        speaker,
        rollMode,
        flavor: label,
        content: this.system.description ?? '',
      });
    }

    const rollData = this.getRollData();
    if (!rollData) {
      console.error("Failed to get roll data");
      return;
    }

    try {
      // @ts-ignore
      const roll = new Roll(String(rollData.item.formula.value), rollData);
      await roll.evaluate({ async: true });
      await roll.toMessage({
        speaker,
        rollMode,
        flavor: label,
      });
      return roll;
    } catch (error) {
      console.error("Error during roll:", error);
      ui.notifications?.error("There was an error processing the roll.");
    }
  }
}