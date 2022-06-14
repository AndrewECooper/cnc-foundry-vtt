/**
 * The Castles & Crusades game system for Foundry Virtual Tabletop
 * A system for playing the popular Castles & Crusades roleplaying game.
 * Author: KillerWabbit
 * Software License: GNU GPLv3
 * Repository: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades
 * Issue Tracker: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/issues
 */

// Import Modules
import { CNC } from "./module/config.js";
import { registerSystemSettings } from "./module/settings.js";
import { preloadHandlebarsTemplates, registerHandlebarsHelpers } from "./module/templates.js";
import { _getInitiativeFormula } from "./module/combat.js";
import { measureDistances } from "./module/canvas.js";

// Import Documents
import ActorCnc from "./module/actor/entity.js";
import ItemCnc from "./module/item/entity.js";
import { TokenDocumentCnc, TokenCnc } from "./module/token.js";

// Import Applications
import AbilityTemplate from "./module/pixi/ability-template.js";
import AbilityUseDialog from "./module/apps/ability-use-dialog.js";
import ActorAbilityConfig from "./module/apps/ability-config.js";
import ActorArmorConfig from "./module/apps/actor-armor.js";
import ActorHitDiceConfig from "./module/apps/hit-dice-config.js";
import ActorMovementConfig from "./module/apps/movement-config.js";
import ActorSensesConfig from "./module/apps/senses-config.js";
import ActorSheetFlags from "./module/apps/actor-flags.js";
import ActorSheetCncCharacter from "./module/actor/sheets/character.js";
import ActorSheetCncNPC from "./module/actor/sheets/npc.js";
import ActorSheetCncVehicle from "./module/actor/sheets/vehicle.js";
import ActorSkillConfig from "./module/apps/skill-config.js";
import ActorTypeConfig from "./module/apps/actor-type.js";
import ItemSheet5e from "./module/item/sheet.js";
import LongRestDialog from "./module/apps/long-rest.js";
import ProficiencySelector from "./module/apps/proficiency-selector.js";
import SelectItemsPrompt from "./module/apps/select-items-prompt.js";
import ShortRestDialog from "./module/apps/short-rest.js";
import TraitSelector from "./module/apps/trait-selector.js";

// Import Helpers
import advancement from "./module/advancement.js";
import * as chat from "./module/chat.js";
import * as dice from "./module/dice.js";
import * as macros from "./module/macros.js";
import * as migrations from "./module/migration.js";
import * as utils from "./module/utils.js";
import ActiveEffect5e from "./module/active-effect.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  console.log(`CNC | Initializing the CNC Game System\n${CNC.ASCII}`);

  // Create a namespace within the game global
  game.cnc = {
    advancement,
    applications: {
      AbilityUseDialog,
      ActorAbilityConfig,
      ActorArmorConfig,
      ActorHitDiceConfig,
      ActorMovementConfig,
      ActorSensesConfig,
      ActorSheetFlags,
      ActorSheetCncCharacter,
      ActorSheetCncNPC,
      ActorSheetCncVehicle,
      ActorSkillConfig,
      ActorTypeConfig,
      ItemSheet5e,
      LongRestDialog,
      ProficiencySelector,
      SelectItemsPrompt,
      ShortRestDialog,
      TraitSelector
    },
    canvas: {
      AbilityTemplate
    },
    config: CNC,
    dice,
    entities: {
      ActorCnc,
      ItemCnc,
      TokenDocumentCnc,
      TokenCnc
    },
    macros,
    migrations,
    rollItemMacro: macros.rollItem,
    utils,
    isV9: !foundry.utils.isNewerVersion("9.224", game.version)
  };

  // Record Configuration Values
  CONFIG.CNC = CNC;
  CONFIG.ActiveEffect.documentClass = ActiveEffect5e;
  CONFIG.Actor.documentClass = ActorCnc;
  CONFIG.Item.documentClass = ItemCnc;
  CONFIG.Token.documentClass = TokenDocumentCnc;
  CONFIG.Token.objectClass = TokenCnc;
  CONFIG.time.roundTime = 6;

  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  CONFIG.Dice.D20Roll = dice.D20Roll;

  // CnC cone RAW should be 53.13 degrees
  CONFIG.MeasuredTemplate.defaults.angle = 53.13;

  // Register System Settings
  registerSystemSettings();

  // Remove honor & sanity from configuration if they aren't enabled
  if ( !game.settings.get("cnc", "honorScore") ) {
    delete CNC.abilities.hon;
    delete CNC.abilityAbbreviations.hon;
  }
  if ( !game.settings.get("cnc", "sanityScore") ) {
    delete CNC.abilities.san;
    delete CNC.abilityAbbreviations.san;
  }

  // Patch Core Functions
  CONFIG.Combat.initiative.formula = "1d20 + @attributes.init.mod + @attributes.init.prof + @attributes.init.bonus + @abilities.dex.bonuses.check + @bonuses.abilities.check";
  Combatant.prototype._getInitiativeFormula = _getInitiativeFormula;

  // Register Roll Extensions
  CONFIG.Dice.rolls.push(dice.D20Roll);
  CONFIG.Dice.rolls.push(dice.DamageRoll);

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("cnc", ActorSheetCncCharacter, {
    types: ["character"],
    makeDefault: true,
    label: "CNC.SheetClassCharacter"
  });
  Actors.registerSheet("cnc", ActorSheetCncNPC, {
    types: ["npc"],
    makeDefault: true,
    label: "CNC.SheetClassNPC"
  });
  Actors.registerSheet("cnc", ActorSheetCncVehicle, {
    types: ["vehicle"],
    makeDefault: true,
    label: "CNC.SheetClassVehicle"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cnc", ItemSheet5e, {
    makeDefault: true,
    label: "CNC.SheetClassItem"
  });

  // Preload Handlebars helpers & partials
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
});


/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * Prepare attribute lists.
 */
Hooks.once("setup", function() {
  CONFIG.CNC.trackableAttributes = expandAttributeList(CONFIG.CNC.trackableAttributes);
  CONFIG.CNC.consumableResources = expandAttributeList(CONFIG.CNC.consumableResources);
});

/* --------------------------------------------- */

/**
 * Expand a list of attribute paths into an object that can be traversed.
 * @param {string[]} attributes  The initial attributes configuration.
 * @returns {object}  The expanded object structure.
 */
function expandAttributeList(attributes) {
  return attributes.reduce((obj, attr) => {
    foundry.utils.setProperty(obj, attr, true);
    return obj;
  }, {});
}

/* --------------------------------------------- */

/**
 * Perform one-time pre-localization and sorting of some configuration objects
 */
Hooks.once("i18nInit", () => utils.performPreLocalization(CONFIG.CNC));

/* -------------------------------------------- */
/*  Foundry VTT Ready                           */
/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {

  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => macros.create5eMacro(data, slot));

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const currentVersion = game.settings.get("cnc", "systemMigrationVersion");
  const NEEDS_MIGRATION_VERSION = "1.6.0";
  const COMPATIBLE_MIGRATION_VERSION = 0.80;
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
  if ( !currentVersion && totalDocuments === 0 ) return game.settings.set("cnc", "systemMigrationVersion", game.system.data.version);
  const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
  if ( !needsMigration ) return;

  // Perform the migration
  if ( currentVersion && isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion) ) {
    ui.notifications.error(game.i18n.localize("MIGRATION.5eVersionTooOldWarning"), {permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on("canvasInit", function() {
  // Extend Diagonal Measurement
  canvas.grid.diagonalRule = game.settings.get("cnc", "diagonalMovement");
  SquareGrid.prototype.measureDistances = measureDistances;
});


/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("renderChatMessage", (app, html, data) => {

  // Display action buttons
  chat.displayChatActionButtons(app, html, data);

  // Highlight critical success or failure die
  chat.highlightCriticalSuccessFailure(app, html, data);

  // Optionally collapse the content
  if (game.settings.get("cnc", "autoCollapseItemCards")) html.find(".card-content").hide();
});
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatLog", (app, html, data) => ItemCnc.chatListeners(html));
Hooks.on("renderChatPopout", (app, html, data) => ItemCnc.chatListeners(html));
Hooks.on("getActorDirectoryEntryContext", ActorCnc.addDirectoryContextOptions);
