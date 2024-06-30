// @ts-ignore
import { game } from 'foundry.js';
// @ts-ignore
import { ChatMessage } from 'foundry.js';

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createMacro(item: any): Promise<Macro> {
  const command = `game.tlgcc.rollItemMacro("${item.name}");`;
  let macro = game.macros?.find(
    (m) => m.name === item.name && m.command === command,
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'tlgcc.itemMacro': true },
    });
  }
  return macro;
}

async function createItemMacro(data: { type?: string; data?: any }, slot: number): Promise<any> {
  if (data.type !== 'Item' || !data.data) {
    return ui.notifications.warn('You can only create macro buttons for owned Items');
  }

  const macro = await createMacro(data.data);

  if (game instanceof Game) {
    await game.user?.assignHotbarMacro(macro, slot);
  }
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @returns {Promise}
 */
function rollItemMacro(itemName: string) {
  const speaker = ChatMessage.getSpeaker();
  let actor;

  if (game instanceof Game) {
    actor = speaker.token ? game.actors.tokens[speaker.token] : game.actors.get(speaker.actor);
  }

  if (!actor) {
    return ui.notifications.warn(`No valid actor found.`);
  }

  const item = actor.items.find((i) => i.name === itemName);

  if (!item) {
    return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);
  }

  // Trigger the item roll
  return item.roll();
}


export { createItemMacro, rollItemMacro };