// Import document classes.
import { tlgccActor } from './documents/actor';
import { tlgccItem } from './documents/item';
// Import sheet classes.
import { tlgccActorSheet } from './sheets/actor-sheet';
import { tlgccItemSheet } from './sheets/item-sheet';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates';
import { TLGCC } from './helpers/config';
import './helpers/handlebars';
import './helpers/hooks';

// /* -------------------------------------------- */
// /*  Init Hook                                   */
// /* -------------------------------------------- */
//
// Hooks.once('init', async function () {
//   console.log(
//     `TLGCC | Initializing the Castles & Crusades Game System!!\n${TLGCC.ASCII}`,
//   );
//
//   // Add utility classes to the global game object so that they're more easily
//   // accessible in global contexts.
//   game.tlgcc = {
//     tlgccActor,
//     tlgccItem,
//     rollItemMacro,
//   };
//
//   // Add custom constants for configuration.
//   CONFIG.TLGCC = TLGCC;
//
//   /**
//    * Set an initiative formula for the system
//    * @type {string}
//    */
//   CONFIG.Combat.initiative = {
//     formula: 'max(1, 1d10)',
//     decimals: 0,
//   };
//
//   // Define custom Document classes
//   CONFIG.Actor.documentClass = tlgccActor;
//   CONFIG.Item.documentClass = tlgccItem;
//
//   // Register sheet application classes
//   Actors.unregisterSheet('core', ActorSheet);
//   Actors.registerSheet('tlgcc', tlgccActorSheet, { makeDefault: true });
//   Items.unregisterSheet('core', ItemSheet);
//   Items.registerSheet('tlgcc', tlgccItemSheet, { makeDefault: true });
//
//   // Preload Handlebars templates.
//   return preloadHandlebarsTemplates();
// });






