// @ts-ignore
// import { game } from 'foundry.js';
// @ts-ignore
// import { ChatMessage } from 'foundry.js';

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @returns {Promise}
 * @param item
 */
async function createMacro(item): Promise<Macro> {
  const command = `game.tlgcc.rollItemMacro("${item.name}");`;
  // @ts-ignore
  let macro = game.macros.find(
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

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @returns {Promise}
 * @param data
 * @param slot
 */
async function createItemMacro(data: { type?: string; data?: any }, slot: number): Promise<any> {
  if (data.type !== 'Item' || !data.data) {
    // @ts-ignore
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
function rollItemMacro(itemName: string): Promise<any> {
  const speaker = ChatMessage.getSpeaker();
  let actor: any;

  if (game instanceof Game) {
    // @ts-ignore
    actor = speaker.token ? game.actors.tokens[speaker.token] : game.actors.get(speaker.actor);
  }

  if (!actor) {
    // @ts-ignore
    return ui.notifications.warn(`No valid actor found.`);
  }

  const item = actor.items.find((i) => i.name === itemName);

  if (!item) {
    // @ts-ignore
    return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);
  }

  // Trigger the item roll
  return item.roll();
}


export { createItemMacro, rollItemMacro };