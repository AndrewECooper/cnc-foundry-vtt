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

interface TokenSystemData {
  xp: {
    value: string | number;
  };
  hitDice: any;
  hitPoints: {
    value: number;
    max: number;
  };
}

interface TokenActor extends Actor {
  system: TokenSystemData;
}

interface TokenDocument {
  actor: TokenActor | null;
}

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
  logger.debug("It's Dr. Pepper Time!", TLGCC.PEPPERCOLOR);
  logger.debug(TLGCC.PEPPERTIME, TLGCC.PEPPERCOLOR);

  // Define minimal status effects
  const MINIMAL_STATUS_EFFECTS = [
    {
      id: "dead",
      label: "EFFECT.StatusDead",
      icon: "icons/svg/skull.svg"
    },
    {
      id: "unconscious",
      label: "EFFECT.StatusUnconscious",
      icon: "icons/svg/unconscious.svg"
    }
  ];

  // Configure status effects based on setting
  // @ts-ignore - Foundry types don't properly expose statusEffects
  CONFIG.statusEffects = Settings.disableStatusEffects ? MINIMAL_STATUS_EFFECTS : CONFIG.statusEffects;

  // Add utility classes to the global game object
  // @ts-ignore
  game.tlgcc = {
    tlgccActor,
    tlgccItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  // @ts-ignore
  CONFIG.TLGCC = TLGCC;

  /**
   * Set an initiative formula for the system
   * @type {string}
   */
  CONFIG.Combat.initiative = {
    formula: 'max(1, 1d10)',
    decimals: 0,
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = tlgccActor;
  // @ts-ignore
  CONFIG.Item.documentClass = tlgccItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('tlgcc', TlgccActorSheet, { makeDefault: true });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('tlgcc', TlgccItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', async function () {
  logger.debug('Ready hook called');

  // Run migrations if needed
  try {
    await MigrationManager.checkAndMigrate();
  } catch (error) {
    logger.error('Error during system migration:', error);
    // @ts-ignore
    ui.notifications?.error('Error during Castles & Crusades system migration. Check console for details.');
  }

  // @ts-ignore
  logger.info(`Castles & Crusades (${game.system.version}) is ready to play!`);

  // Register hotbar drop hook
  Hooks.on('hotbarDrop', (bar: any, data: any, slot: number) =>
    createItemMacro(data, slot),
  );
});

/* -------------------------------------------- */
/*  Character Creation Hooks                    */
/* -------------------------------------------- */

Hooks.on('createActor', async function (actor: Actor) {
  logger.debug('createActor hook called');
  if (actor.type === 'character') {
    actor.data.token.actorLink = true;
  }
});

/* -------------------------------------------- */
/*  Token Creation Hooks                        */
/* -------------------------------------------- */

Hooks.on(
  'createToken',
  async function (token: TokenDocument, options: any, id: string) {
    logger.debug('createToken hook called');
    if (token.actor && token.actor.type === 'monster') {
      const actor = token.actor;

      if (
        typeof actor.system.xp.value === 'string' &&
        actor.system.xp.value.includes('+')
      ) {
        let tokenHitDice = actor.system.hitDice;

        let newHitPoints = new Roll(
          `${tokenHitDice.number}${tokenHitDice.size}+${tokenHitDice.mod}`,
        );
        await newHitPoints.evaluate({ async: true });
        actor.system.hitPoints.value = Math.max(1, newHitPoints.total || 0);
        actor.system.hitPoints.max = Math.max(1, newHitPoints.total || 0);

        // Calculate XP and convert to string
        const [baseXP, multiplier] = actor.system.xp.value
          .split('+')
          .map(Number);
        actor.system.xp.value = String(
          baseXP + multiplier * actor.system.hitPoints.max,
        );
      }
    }
  },
);