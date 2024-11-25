import { TLGCC } from './constants';
import { tlgccActor } from '../documents/actor';
import { tlgccItem } from '../documents/item';
import { TlgccActorSheet } from '../sheets/actor-sheet';
import { TlgccItemSheet } from '../sheets/item-sheet';
import { preloadHandlebarsTemplates } from './templates';
import { rollItemMacro, createItemMacro } from './macros';
import Settings from './settings';
import { Logger, LogLevel } from '../utils/logger';
import { MigrationManager } from '../migration/migration_manager';

const logger = Logger.getInstance();

Hooks.once('init', async function () {
  Settings.registerSettings();

  const savedLogLevel = Settings.logLevel as keyof typeof LogLevel;
  logger.setLogLevel(
    LogLevel[savedLogLevel.toUpperCase() as keyof typeof LogLevel],
  );

  logger.info(
    `Initializing the Castles & Crusades Game System\n${TLGCC.ASCII}`,
  );

  // Define custom Document classes
  CONFIG.Actor.documentClass = tlgccActor;
  // @ts-ignore
  CONFIG.Item.documentClass = tlgccItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('tlgcc', TlgccActorSheet, { makeDefault: true });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('tlgcc', TlgccItemSheet, { makeDefault: true });

  // Initialize status effects
  await Settings.updateStatusEffects(Settings.disableStatusEffects);

  // Set initiative formula
  CONFIG.Combat.initiative = {
    formula: 'max(1, 1d10)',
    decimals: 0,
  };

  // Add utility classes to the global game object
  // @ts-ignore
  game.tlgcc = {
    tlgccActor,
    tlgccItem,
    rollItemMacro,
  };

  // Add custom constants for configuration
  // @ts-ignore
  CONFIG.TLGCC = TLGCC;

  // Preload Handlebars templates
  return preloadHandlebarsTemplates();
});

Hooks.once('ready', async function () {
  logger.debug('Ready hook called');

  try {
    await MigrationManager.checkAndMigrate();
  } catch (error) {
    logger.error('Error during system migration:', error);
    // @ts-ignore
    ui.notifications?.error('Error during Castles & Crusades system migration. Check console for details.');
  }

  // Initialize status effects
  try {
    if (Settings.disableStatusEffects) {
      CONFIG.statusEffects = foundry.utils.deepClone(Settings.MINIMAL_STATUS_EFFECTS);

      // Update existing tokens if needed
      if (canvas?.ready) {
        // @ts-ignore
        for (const token of canvas.tokens?.placeables || []) {
          if (token?.actor) {
            await token.drawEffects();
            // @ts-ignore
            if (token.hasActiveHUD) token.refreshHUD();
          }
        }
      }
    }
  } catch (error) {
    logger.warn('Non-critical error initializing status effects:', error);
  }

  // @ts-ignore
  logger.info(`Castles & Crusades (${game.system.version}) is ready to play!`);

  // Register hotbar drop hook
  Hooks.on('hotbarDrop', (bar: any, data: any, slot: number) =>
    createItemMacro(data, slot),
  );
});

// Keep existing hooks
Hooks.on('createActor', async function (actor: Actor) {
  logger.debug('createActor hook called');
  if (actor.type === 'character') {
    actor.data.token.actorLink = true;
  }
});

Hooks.on('createToken', async function (token: TokenDocument, options: any, id: string) {
  logger.debug('createToken hook called');
  if (token.actor && token.actor.type === 'monster') {
    const actor = token.actor;

    // @ts-ignore
    if (typeof actor.system.xp.value === 'string' && actor.system.xp.value.includes('+')) {
      // @ts-ignore
      let tokenHitDice = actor.system.hitDice;

      let newHitPoints = new Roll(
        `${tokenHitDice.number}${tokenHitDice.size}+${tokenHitDice.mod}`,
      );
      await newHitPoints.evaluate({ async: true });
      // @ts-ignore
      actor.system.hitPoints.value = Math.max(1, newHitPoints.total || 0);
      // @ts-ignore
      actor.system.hitPoints.max = Math.max(1, newHitPoints.total || 0);

      // @ts-ignore
      const [baseXP, multiplier] = actor.system.xp.value.split('+').map(Number);
      // @ts-ignore
      actor.system.xp.value = String(baseXP + multiplier * actor.system.hitPoints.max);
    }
  }
});