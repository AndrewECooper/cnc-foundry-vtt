// @ts-ignore
import { Hooks, game } from 'foundry.js';
import { TLGCC } from './constants';
import { tlgccActor } from '../documents/actor';
import { tlgccItem } from '../documents/item';
import { tlgccActorSheet } from '../sheets/actor-sheet';
import { tlgccItemSheet } from '../sheets/item-sheet';
import { preloadHandlebarsTemplates } from './templates';
import { rollItemMacro, createItemMacro } from './macros';

Hooks.once('init', async function () {
  console.log(
    `TLGCC | Initializing the Castles & Crusades Game System!!\n${TLGCC.ASCII}`,
  );

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
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
  CONFIG.Item.documentClass = tlgccItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('tlgcc', tlgccActorSheet, { makeDefault: true });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('tlgcc', tlgccItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

// ... other hooks
/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Character Creation Hooks                    */
/* -------------------------------------------- */

Hooks.on('createActor', async function (actor) {
  if (actor.type === 'character') {
    actor.data.token.actorLink = true;
  }
});

/* -------------------------------------------- */
/*  Token Creation Hooks                        */
/* -------------------------------------------- */

Hooks.on('createToken', async function (token, options, id) {
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