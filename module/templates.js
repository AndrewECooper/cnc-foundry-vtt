import { _linkForUuid } from "./utils.js";

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @returns {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Shared Partials
    "systems/cnc/templates/actors/parts/active-effects.html",

    // Actor Sheet Partials
    "systems/cnc/templates/actors/parts/actor-traits.html",
    "systems/cnc/templates/actors/parts/actor-inventory.html",
    "systems/cnc/templates/actors/parts/actor-features.html",
    "systems/cnc/templates/actors/parts/actor-spellbook.html",
    "systems/cnc/templates/actors/parts/actor-warnings.html",

    // Item Sheet Partials
    "systems/cnc/templates/items/parts/item-action.html",
    "systems/cnc/templates/items/parts/item-activation.html",
    "systems/cnc/templates/items/parts/item-advancement.html",
    "systems/cnc/templates/items/parts/item-description.html",
    "systems/cnc/templates/items/parts/item-mountable.html",
    "systems/cnc/templates/items/parts/item-spellcasting.html",

    // Advancement Partials
    "systems/cnc/templates/advancement/parts/advancement-controls.html"
  ]);
};

/* -------------------------------------------- */

/**
 * Register custom Handlebars helpers used by Cnc.
 */
export const registerHandlebarsHelpers = function() {
  Handlebars.registerHelper({
    getProperty: foundry.utils.getProperty,
    "cnc-linkForUuid": _linkForUuid
  });
};
