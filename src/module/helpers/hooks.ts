// @ts-ignore
// import { Hooks, game } from 'foundry.js';
import { TLGCC } from './constants';
import { tlgccActor } from '../documents/actor';
import { tlgccItem } from '../documents/item';
import { TlgccActorSheet } from '../sheets/actor-sheet';
import { TlgccItemSheet } from '../sheets/item-sheet';
import { preloadHandlebarsTemplates } from './templates';
import { rollItemMacro, createItemMacro } from './macros';
import Settings from './settings';
import { Logger, LogLevel} from '../utils/logger';

const logger = Logger.getInstance();

Hooks.once('init', async function () {

  // Set logging level as a setting for the system
  // @ts-ignore
  Settings.registerSettings();

  // Set initial log level from settings
  // @ts-ignore
  const savedLogLevel = Settings.logLevel as keyof typeof LogLevel;
  logger.setLogLevel(LogLevel[savedLogLevel.toUpperCase()]);
  logger.info(`Initializing the Castles & Crusades Game System\n${TLGCC.ASCII}`);
  logger.debug('It\'s Dr. Pepper Time!', TLGCC.PEPPERCOLOR);
  logger.debug(TLGCC.PEPPERTIME, TLGCC.PEPPERCOLOR);

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
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

// ... other hooks
/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  logger.debug('Ready hook called');
  // @ts-ignore
  logger.info(`Castles & Crusades (${game.system.version}) is ready to play!`);
  Hooks.on('hotbarDrop', (bar: any, data: any, slot: number) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Character Creation Hooks                    */
/* -------------------------------------------- */

Hooks.on('createActor', async function (actor) {
  logger.debug('createActor hook called');
  if (actor.type === 'character') {
    actor.data.token.actorLink = true;
  }
});

/* -------------------------------------------- */
/*  Token Creation Hooks                        */
/* -------------------------------------------- */

Hooks.on('createToken', async function (token, options, id) {
  logger.debug('createToken hook called');
  if (token.actor.type === 'monster') {
    /* Monster token creation hooks */

    if (token.actor.system.xp.value.includes('+')) {
      /* Generate HP/XP stats if the monster is a template.*/

      let tokenHitDice = token.actor.system.hitDice;

      /* Calculate and set hitPoints.max and hitPoints.value */
      let newHitPoints = new Roll(
        `${tokenHitDice.number}${tokenHitDice.size}+${tokenHitDice.mod}`,
      );
      await newHitPoints.evaluate({ async: true });
      token.actor.system.hitPoints.value = Math.max(1, newHitPoints.total || 0);
      token.actor.system.hitPoints.max = Math.max(1, newHitPoints.total || 0);

      /* Calculate XP based on hitPoints.max */
      token.actor.system.xp.value =
        Number(token.actor.system.xp.value.split('+')[1]) *
        token.actor.system.hitPoints.max +
        Number(token.actor.system.xp.value.split('+')[0]);
    }
  }
});