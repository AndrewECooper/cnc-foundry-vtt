export const registerSystemSettings = function() {

  const reload = foundry.utils.debounce(() => window.location.reload(), 250);

  // Internal System Migration Version
  game.settings.register("cnc", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Rest Recovery Rules
  game.settings.register("cnc", "restVariant", {
    name: "SETTINGS.CncRestN",
    hint: "SETTINGS.CncRestL",
    scope: "world",
    config: true,
    default: "normal",
    type: String,
    choices: {
      normal: "SETTINGS.CncRestPHB",
      gritty: "SETTINGS.CncRestGritty",
      epic: "SETTINGS.CncRestEpic"
    }
  });

  // Diagonal Movement Rule
  game.settings.register("cnc", "diagonalMovement", {
    name: "SETTINGS.CncDiagN",
    hint: "SETTINGS.CncDiagL",
    scope: "world",
    config: true,
    default: "555",
    type: String,
    choices: {
      555: "SETTINGS.CncDiagPHB",
      5105: "SETTINGS.CncDiagDMG",
      EUCL: "SETTINGS.CncDiagEuclidean"
    },
    onChange: rule => canvas.grid.diagonalRule = rule
  });

  // Proficiency modifier type
  game.settings.register("cnc", "proficiencyModifier", {
    name: "SETTINGS.CncProfN",
    hint: "SETTINGS.CncProfL",
    scope: "world",
    config: true,
    default: "bonus",
    type: String,
    choices: {
      bonus: "SETTINGS.CncProfBonus",
      dice: "SETTINGS.CncProfDice"
    }
  });

  // Use Honor ability score
  game.settings.register("cnc", "honorScore", {
    name: "SETTINGS.CncHonorN",
    hint: "SETTINGS.CncHonorL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  // Use Sanity ability score
  game.settings.register("cnc", "sanityScore", {
    name: "SETTINGS.CncSanityN",
    hint: "SETTINGS.CncSanityL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  // Apply Dexterity as Initiative Tiebreaker
  game.settings.register("cnc", "initiativeDexTiebreaker", {
    name: "SETTINGS.CncInitTBN",
    hint: "SETTINGS.CncInitTBL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Record Currency Weight
  game.settings.register("cnc", "currencyWeight", {
    name: "SETTINGS.CncCurWtN",
    hint: "SETTINGS.CncCurWtL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Disable Experience Tracking
  game.settings.register("cnc", "disableExperienceTracking", {
    name: "SETTINGS.CncNoExpN",
    hint: "SETTINGS.CncNoExpL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Advancements
  game.settings.register("cnc", "disableAdvancements", {
    name: "SETTINGS.CncNoAdvancementsN",
    hint: "SETTINGS.CncNoAdvancementsL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Collapse Item Cards (by default)
  game.settings.register("cnc", "autoCollapseItemCards", {
    name: "SETTINGS.CncAutoCollapseCardN",
    hint: "SETTINGS.CncAutoCollapseCardL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: s => {
      ui.chat.render();
    }
  });

  // Allow Polymorphing
  game.settings.register("cnc", "allowPolymorphing", {
    name: "SETTINGS.CncAllowPolymorphingN",
    hint: "SETTINGS.CncAllowPolymorphingL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Polymorph Settings
  game.settings.register("cnc", "polymorphSettings", {
    scope: "client",
    default: {
      keepPhysical: false,
      keepMental: false,
      keepSaves: false,
      keepSkills: false,
      mergeSaves: false,
      mergeSkills: false,
      keepClass: false,
      keepFeats: false,
      keepSpells: false,
      keepItems: false,
      keepBio: false,
      keepVision: true,
      transformTokens: true
    }
  });

  // Metric Unit Weights
  game.settings.register("cnc", "metricWeightUnits", {
    name: "SETTINGS.CncMetricN",
    hint: "SETTINGS.CncMetricL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Critical Damage Modifiers
  game.settings.register("cnc", "criticalDamageModifiers", {
    name: "SETTINGS.CncCriticalModifiersN",
    hint: "SETTINGS.CncCriticalModifiersL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Critical Damage Maximize
  game.settings.register("cnc", "criticalDamageMaxDice", {
    name: "SETTINGS.CncCriticalMaxDiceN",
    hint: "SETTINGS.CncCriticalMaxDiceL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
};
