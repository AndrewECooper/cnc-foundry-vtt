// macros.ts
/**
 * This represents the type of data needed to create a macro
 */
interface MacroConfig {
  name: string;
  type: 'script' | 'chat';
  img: string | null;
  command: string;
  flags: Record<string, unknown>;
}

interface FoundryMacro extends Macro {
  name: string;
  command: string;
}


/**
 * Create a macro from an Item drop.
 * @param data     The dropped data
 * @param slot     The hotbar slot to use
 * @returns       A Promise that resolves to the created Macro
 */
async function createItemMacro(
  data: any,
  slot: number,
): Promise<StoredDocument<Macro> | null> {
  if (!('data' in data)) return null;

  const item: Item = data.data;

  // Search for existing macro
  const command = `game.tlgcc.rollItemMacro("${item.name}");`;
  // @ts-ignore
  const macro = game.macros.find(
    (m: FoundryMacro) => m.name === item.name && m.command === command,
  );

  if (macro) {
    return macro;
  }

  // Create the macro command
  const macroData: MacroConfig = {
    name: item.name || '',
    type: 'script',
    img: item.img || null,
    command: command,
    flags: { 'tlgcc.itemMacro': true },
  };

  try {
    // Create the macro
    const newMacro = (await Macro.create(macroData, {
      renderSheet: false,
    })) as StoredDocument<Macro>;

    if (!newMacro) {
      console.error('Failed to create macro');
      return null;
    }

    // Assign to hotbar if we have a slot and user
    // @ts-ignore
    if (game.user) {
      // @ts-ignore
      await game.user.assignHotbarMacro(newMacro, slot);
    }

    return newMacro;
  } catch (error) {
    console.error('Error creating macro:', error);
    return null;
  }
}

/**
 * Roll an item macro from a hotbar macro click
 * @param itemName - Name of the item to roll
 * @returns Promise that resolves to the roll result
 */
async function rollItemMacro(itemName: string): Promise<Roll | null> {
  const speaker = ChatMessage.getSpeaker();
  let actor: Actor | null = null;

  // Check for token actor
  // @ts-ignore - Foundry types
  if (speaker.token && game.actors) {
    // @ts-ignore - Foundry types
    const tokenActor = game.actors.tokens[speaker.token];
    actor = tokenActor ?? null;
  }
  // Fall back to regular actor
  // @ts-ignore - Foundry types
  else if (speaker.actor && game.actors) {
    // @ts-ignore - Foundry types
    actor = game.actors.get(speaker.actor) ?? null;
  }

  if (!actor) {
    ui.notifications?.warn('No valid actor found.');
    return null;
  }

  const item = actor.items.find((i) => i.name === itemName);
  if (!item) {
    ui.notifications?.warn(
      `Your controlled Actor does not have an item named ${itemName}`,
    );
    return null;
  }

  // @ts-ignore - roll exists but isn't typed
  return item.roll();
}

export { createItemMacro, rollItemMacro };
