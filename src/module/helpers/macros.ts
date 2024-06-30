import { game } from 'foundry.js';
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
async function createItemMacro(data, slot) {
  if (data.type !== 'Item') return;
  if (!('data' in data))
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items',
    );
  const item = data.data; //TODO: check this. Not sure if it is correct

  // Create the macro command
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
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) if (game instanceof Game) {
    actor = game.actors.tokens[speaker.token];
  }
  if (!actor) if (game instanceof Game) {
    actor = game.actors.get(speaker.actor);
  }
  const item = actor ? actor.items.find((i) => i.name === itemName) : null;
  if (!item) {
    return ui.notifications.warn(
      `Your controlled Actor does not have an item named ${itemName}`,
    );
  }

  // Trigger the item roll
  return item.roll();
}


export { createItemMacro, rollItemMacro };