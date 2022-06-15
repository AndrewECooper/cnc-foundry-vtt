import { ClassFeatures } from "./classFeatures.js";
import { preLocalize } from "./utils.js";

// Namespace Configuration Values
export const CNC = {};

// ASCII Artwork
CNC.ASCII = `_______________________________
_______  _        _______ 
(  ____ \\( (    /|(  ____ \\
| (    \\/|  \\  ( || (    \\/
| |      |   \\ | || |      
| |      | (\\ \\) || |      
| |      | | \\   || |      
| (____/\\| )  \\  || (____/\\
(_______/|/    )_)(_______/                        
_______________________________`;


/**
 * The set of Ability Scores used within the system.
 * @enum {string}
 */
CNC.abilities = {
  str: "CNC.AbilityStr",
  dex: "CNC.AbilityDex",
  con: "CNC.AbilityCon",
  int: "CNC.AbilityInt",
  wis: "CNC.AbilityWis",
  cha: "CNC.AbilityCha",
  hon: "CNC.AbilityHon",
  san: "CNC.AbilitySan"
};
preLocalize("abilities");

/**
 * Localized abbreviations for Ability Scores.
 * @enum {string}
 */
CNC.abilityAbbreviations = {
  str: "CNC.AbilityStrAbbr",
  dex: "CNC.AbilityDexAbbr",
  con: "CNC.AbilityConAbbr",
  int: "CNC.AbilityIntAbbr",
  wis: "CNC.AbilityWisAbbr",
  cha: "CNC.AbilityChaAbbr",
  hon: "CNC.AbilityHonAbbr",
  san: "CNC.AbilitySanAbbr"
};
preLocalize("abilityAbbreviations");

/* -------------------------------------------- */

/**
 * Character alignment options.
 * @enum {string}
 */
CNC.alignments = {
  lg: "CNC.AlignmentLG",
  ng: "CNC.AlignmentNG",
  cg: "CNC.AlignmentCG",
  ln: "CNC.AlignmentLN",
  tn: "CNC.AlignmentTN",
  cn: "CNC.AlignmentCN",
  le: "CNC.AlignmentLE",
  ne: "CNC.AlignmentNE",
  ce: "CNC.AlignmentCE"
};
preLocalize("alignments");

/* -------------------------------------------- */

/**
 * An enumeration of item attunement types.
 * @enum {number}
 */
CNC.attunementTypes = {
  NONE: 0,
  REQUIRED: 1,
  ATTUNED: 2
};

/**
 * An enumeration of item attunement states.
 * @type {{"0": string, "1": string, "2": string}}
 */
CNC.attunements = {
  0: "CNC.AttunementNone",
  1: "CNC.AttunementRequired",
  2: "CNC.AttunementAttuned"
};
preLocalize("attunements");

/* -------------------------------------------- */

/**
 * General weapon categories.
 * @enum {string}
 */
CNC.weaponProficiencies = {
  sim: "CNC.WeaponSimpleProficiency",
  mar: "CNC.WeaponMartialProficiency"
};
preLocalize("weaponProficiencies");

/**
 * A mapping between `CNC.weaponTypes` and `CNC.weaponProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
CNC.weaponProficienciesMap = {
  natural: true,
  simpleM: "sim",
  simpleR: "sim",
  martialM: "mar",
  martialR: "mar"
};

/**
 * The basic weapon types in CNC. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
CNC.weaponIds = {
  battleaxe: "I0WocDSuNpGJayPb",
  blowgun: "wNWK6yJMHG9ANqQV",
  club: "nfIRTECQIG81CvM4",
  dagger: "0E565kQUBmndJ1a2",
  dart: "3rCO8MTIdPGSW6IJ",
  flail: "UrH3sMdnUDckIHJ6",
  glaive: "rOG1OM2ihgPjOvFW",
  greataxe: "1Lxk6kmoRhG8qQ0u",
  greatclub: "QRCsxkCwWNwswL9o",
  greatsword: "xMkP8BmFzElcsMaR",
  halberd: "DMejWAc8r8YvDPP1",
  handaxe: "eO7Fbv5WBk5zvGOc",
  handcrossbow: "qaSro7kFhxD6INbZ",
  heavycrossbow: "RmP0mYRn2J7K26rX",
  javelin: "DWLMnODrnHn8IbAG",
  lance: "RnuxdHUAIgxccVwj",
  lightcrossbow: "ddWvQRLmnnIS0eLF",
  lighthammer: "XVK6TOL4sGItssAE",
  longbow: "3cymOVja8jXbzrdT",
  longsword: "10ZP2Bu3vnCuYMIB",
  mace: "Ajyq6nGwF7FtLhDQ",
  maul: "DizirD7eqjh8n95A",
  morningstar: "dX8AxCh9o0A9CkT3",
  net: "aEiM49V8vWpWw7rU",
  pike: "tC0kcqZT9HHAO0PD",
  quarterstaff: "g2dWN7PQiMRYWzyk",
  rapier: "Tobce1hexTnDk4sV",
  scimitar: "fbC0Mg1a73wdFbqO",
  shortsword: "osLzOwQdPtrK3rQH",
  sickle: "i4NeNZ30ycwPDHMx",
  spear: "OG4nBBydvmfWYXIk",
  shortbow: "GJv6WkD7D2J6rP6M",
  sling: "3gynWO9sN4OLGMWD",
  trident: "F65ANO66ckP8FDMa",
  warpick: "2YdfjN1PIIrSHZii",
  warhammer: "F0Df164Xv1gWcYt0",
  whip: "QKTyxoO0YDnAsbYe"
};

/* -------------------------------------------- */

/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 */
CNC.toolTypes = {
  art: "CNC.ToolArtisans",
  game: "CNC.ToolGamingSet",
  music: "CNC.ToolMusicalInstrument"
};
preLocalize("toolTypes", { sort: true });

/**
 * The categories of tool proficiencies that a character can gain.
 *
 * @enum {string}
 */
CNC.toolProficiencies = {
  ...CNC.toolTypes,
  vehicle: "CNC.ToolVehicle"
};
preLocalize("toolProficiencies", { sort: true });

/**
 * The basic tool types in CNC. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
CNC.toolIds = {
  alchemist: "SztwZhbhZeCqyAes",
  bagpipes: "yxHi57T5mmVt0oDr",
  brewer: "Y9S75go1hLMXUD48",
  calligrapher: "jhjo20QoiD5exf09",
  card: "YwlHI3BVJapz4a3E",
  carpenter: "8NS6MSOdXtUqD7Ib",
  cartographer: "fC0lFK8P4RuhpfaU",
  chess: "23y8FvWKf9YLcnBL",
  cobbler: "hM84pZnpCqKfi8XH",
  cook: "Gflnp29aEv5Lc1ZM",
  dice: "iBuTM09KD9IoM5L8",
  disg: "IBhDAr7WkhWPYLVn",
  drum: "69Dpr25pf4BjkHKb",
  dulcimer: "NtdDkjmpdIMiX7I2",
  flute: "eJOrPcAz9EcquyRQ",
  forg: "cG3m4YlHfbQlLEOx",
  glassblower: "rTbVrNcwApnuTz5E",
  herb: "i89okN7GFTWHsvPy",
  horn: "aa9KuBy4dst7WIW9",
  jeweler: "YfBwELTgPFHmQdHh",
  leatherworker: "PUMfwyVUbtyxgYbD",
  lute: "qBydtUUIkv520DT7",
  lyre: "EwG1EtmbgR3bM68U",
  mason: "skUih6tBvcBbORzA",
  navg: "YHCmjsiXxZ9UdUhU",
  painter: "ccm5xlWhx74d6lsK",
  panflute: "G5m5gYIx9VAUWC3J",
  pois: "il2GNi8C0DvGLL9P",
  potter: "hJS8yEVkqgJjwfWa",
  shawm: "G3cqbejJpfB91VhP",
  smith: "KndVe2insuctjIaj",
  thief: "woWZ1sO5IUVGzo58",
  tinker: "0d08g1i5WXnNrCNA",
  viol: "baoe3U5BfMMMxhCU",
  weaver: "ap9prThUB2y9lDyj",
  woodcarver: "xKErqkLo4ASYr5EP"
};

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
CNC.timePeriods = {
  inst: "CNC.TimeInst",
  turn: "CNC.TimeTurn",
  round: "CNC.TimeRound",
  minute: "CNC.TimeMinute",
  hour: "CNC.TimeHour",
  day: "CNC.TimeDay",
  month: "CNC.TimeMonth",
  year: "CNC.TimeYear",
  perm: "CNC.TimePerm",
  spec: "CNC.Special"
};
preLocalize("timePeriods");

/* -------------------------------------------- */

/**
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
CNC.abilityActivationTypes = {
  none: "CNC.None",
  action: "CNC.Action",
  bonus: "CNC.BonusAction",
  reaction: "CNC.Reaction",
  minute: CNC.timePeriods.minute,
  hour: CNC.timePeriods.hour,
  day: CNC.timePeriods.day,
  special: CNC.timePeriods.spec,
  legendary: "CNC.LegendaryActionLabel",
  lair: "CNC.LairActionLabel",
  crew: "CNC.VehicleCrewAction"
};
preLocalize("abilityActivationTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Different things that an ability can consume upon use.
 * @enum {string}
 */
CNC.abilityConsumptionTypes = {
  ammo: "CNC.ConsumeAmmunition",
  attribute: "CNC.ConsumeAttribute",
  hitDice: "CNC.ConsumeHitDice",
  material: "CNC.ConsumeMaterial",
  charges: "CNC.ConsumeCharges"
};
preLocalize("abilityConsumptionTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Creature sizes.
 * @enum {string}
 */
CNC.actorSizes = {
  tiny: "CNC.SizeTiny",
  sm: "CNC.SizeSmall",
  med: "CNC.SizeMedium",
  lg: "CNC.SizeLarge",
  huge: "CNC.SizeHuge",
  grg: "CNC.SizeGargantuan"
};
preLocalize("actorSizes");

/**
 * Default token image size for the values of `CNC.actorSizes`.
 * @enum {number}
 */
CNC.tokenSizes = {
  tiny: 0.5,
  sm: 1,
  med: 1,
  lg: 2,
  huge: 3,
  grg: 4
};

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
CNC.tokenHPColors = {
  damage: 0xFF0000,
  healing: 0x00FF00,
  temp: 0x66CCFF,
  tempmax: 0x440066,
  negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Default types of creatures.
 * *Note: Not pre-localized to allow for easy fetching of pluralized forms.*
 * @enum {string}
 */
CNC.creatureTypes = {
  aberration: "CNC.CreatureAberration",
  beast: "CNC.CreatureBeast",
  celestial: "CNC.CreatureCelestial",
  construct: "CNC.CreatureConstruct",
  dragon: "CNC.CreatureDragon",
  elemental: "CNC.CreatureElemental",
  fey: "CNC.CreatureFey",
  fiend: "CNC.CreatureFiend",
  giant: "CNC.CreatureGiant",
  humanoid: "CNC.CreatureHumanoid",
  monstrosity: "CNC.CreatureMonstrosity",
  ooze: "CNC.CreatureOoze",
  plant: "CNC.CreaturePlant",
  undead: "CNC.CreatureUndead"
};

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
CNC.itemActionTypes = {
  mwak: "CNC.ActionMWAK",
  rwak: "CNC.ActionRWAK",
  msak: "CNC.ActionMSAK",
  rsak: "CNC.ActionRSAK",
  save: "CNC.ActionSave",
  heal: "CNC.ActionHeal",
  abil: "CNC.ActionAbil",
  util: "CNC.ActionUtil",
  other: "CNC.ActionOther"
};
preLocalize("itemActionTypes");

/* -------------------------------------------- */

/**
 * Different ways in which item capacity can be limited.
 * @enum {string}
 */
CNC.itemCapacityTypes = {
  items: "CNC.ItemContainerCapacityItems",
  weight: "CNC.ItemContainerCapacityWeight"
};
preLocalize("itemCapacityTypes", { sort: true });

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {string}
 */
CNC.itemRarity = {
  common: "CNC.ItemRarityCommon",
  uncommon: "CNC.ItemRarityUncommon",
  rare: "CNC.ItemRarityRare",
  veryRare: "CNC.ItemRarityVeryRare",
  legendary: "CNC.ItemRarityLegendary",
  artifact: "CNC.ItemRarityArtifact"
};
preLocalize("itemRarity");

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability.
 * @enum {string}
 */
CNC.limitedUsePeriods = {
  sr: "CNC.ShortRest",
  lr: "CNC.LongRest",
  day: "CNC.Day",
  charges: "CNC.Charges"
};
preLocalize("limitedUsePeriods");

/* -------------------------------------------- */

/**
 * Specific equipment types that modify base AC.
 * @enum {string}
 */
CNC.armorTypes = {
  light: "CNC.EquipmentLight",
  medium: "CNC.EquipmentMedium",
  heavy: "CNC.EquipmentHeavy",
  natural: "CNC.EquipmentNatural",
  shield: "CNC.EquipmentShield"
};
preLocalize("armorTypes");

/* -------------------------------------------- */

/**
 * Equipment types that aren't armor.
 * @enum {string}
 */
CNC.miscEquipmentTypes = {
  clothing: "CNC.EquipmentClothing",
  trinket: "CNC.EquipmentTrinket",
  vehicle: "CNC.EquipmentVehicle"
};
preLocalize("miscEquipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character.
 * @enum {string}
 */
CNC.equipmentTypes = {
  ...CNC.miscEquipmentTypes,
  ...CNC.armorTypes
};
preLocalize("equipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
CNC.vehicleTypes = {
  air: "CNC.VehicleTypeAir",
  land: "CNC.VehicleTypeLand",
  water: "CNC.VehicleTypeWater"
};
preLocalize("vehicleTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have.
 * @type {object}
 */
CNC.armorProficiencies = {
  lgt: CNC.equipmentTypes.light,
  med: CNC.equipmentTypes.medium,
  hvy: CNC.equipmentTypes.heavy,
  shl: "CNC.EquipmentShieldProficiency"
};
preLocalize("armorProficiencies");

/**
 * A mapping between `CNC.equipmentTypes` and `CNC.armorProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
CNC.armorProficienciesMap = {
  natural: true,
  clothing: true,
  light: "lgt",
  medium: "med",
  heavy: "hvy",
  shield: "shl"
};

/**
 * The basic armor types in CNC. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
CNC.armorIds = {
  breastplate: "SK2HATQ4abKUlV8i",
  chainmail: "rLMflzmxpe8JGTOA",
  chainshirt: "p2zChy24ZJdVqMSH",
  halfplate: "vsgmACFYINloIdPm",
  hide: "n1V07puo0RQxPGuF",
  leather: "WwdpHLXGX5r8uZu5",
  padded: "GtKV1b5uqFQqpEni",
  plate: "OjkIqlW2UpgFcjZa",
  ringmail: "nsXZejlmgalj4he9",
  scalemail: "XmnlF5fgIO3tg6TG",
  splint: "cKpJmsJmU8YaiuqG",
  studded: "TIV3B1vbrVHIhQAm"
};

/**
 * The basic shield in CNC.
 * @enum {string}
 */
CNC.shieldIds = {
  shield: "sSs3hSzkKBMNBgTs"
};

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 */
CNC.armorClasses = {
  flat: {
    label: "CNC.ArmorClassFlat",
    formula: "@attributes.ac.flat"
  },
  natural: {
    label: "CNC.ArmorClassNatural",
    formula: "@attributes.ac.flat"
  },
  default: {
    label: "CNC.ArmorClassEquipment",
    formula: "@attributes.ac.armor + @attributes.ac.dex"
  },
  mage: {
    label: "CNC.ArmorClassMage",
    formula: "13 + @abilities.dex.mod"
  },
  draconic: {
    label: "CNC.ArmorClassDraconic",
    formula: "13 + @abilities.dex.mod"
  },
  unarmoredMonk: {
    label: "CNC.ArmorClassUnarmoredMonk",
    formula: "10 + @abilities.dex.mod + @abilities.wis.mod"
  },
  unarmoredBarb: {
    label: "CNC.ArmorClassUnarmoredBarbarian",
    formula: "10 + @abilities.dex.mod + @abilities.con.mod"
  },
  custom: {
    label: "CNC.ArmorClassCustom"
  }
};
preLocalize("armorClasses", { key: "label" });

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {string}
 */
CNC.consumableTypes = {
  ammo: "CNC.ConsumableAmmunition",
  potion: "CNC.ConsumablePotion",
  poison: "CNC.ConsumablePoison",
  food: "CNC.ConsumableFood",
  scroll: "CNC.ConsumableScroll",
  wand: "CNC.ConsumableWand",
  rod: "CNC.ConsumableRod",
  trinket: "CNC.ConsumableTrinket"
};
preLocalize("consumableTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * @enum {{
 *   label: string,
 *   abbreviation: string,
 *   [conversion]: {into: string, each: number}
 * }}
 */
CNC.currencies = {
  pp: {
    label: "CNC.CurrencyPP",
    abbreviation: "CNC.CurrencyAbbrPP"
  },
  gp: {
    label: "CNC.CurrencyGP",
    abbreviation: "CNC.CurrencyAbbrGP",
    conversion: {into: "pp", each: 10}
  },
  ep: {
    label: "CNC.CurrencyEP",
    abbreviation: "CNC.CurrencyAbbrEP",
    conversion: {into: "gp", each: 2}
  },
  sp: {
    label: "CNC.CurrencySP",
    abbreviation: "CNC.CurrencyAbbrSP",
    conversion: {into: "ep", each: 5}
  },
  cp: {
    label: "CNC.CurrencyCP",
    abbreviation: "CNC.CurrencyAbbrCP",
    conversion: {into: "sp", each: 10}
  }
};
preLocalize("currencies", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * Types of damage the can be caused by abilities.
 * @enum {string}
 */
CNC.damageTypes = {
  acid: "CNC.DamageAcid",
  bludgeoning: "CNC.DamageBludgeoning",
  cold: "CNC.DamageCold",
  fire: "CNC.DamageFire",
  force: "CNC.DamageForce",
  lightning: "CNC.DamageLightning",
  necrotic: "CNC.DamageNecrotic",
  piercing: "CNC.DamagePiercing",
  poison: "CNC.DamagePoison",
  psychic: "CNC.DamagePsychic",
  radiant: "CNC.DamageRadiant",
  slashing: "CNC.DamageSlashing",
  thunder: "CNC.DamageThunder"
};
preLocalize("damageTypes", { sort: true });

/**
 * Types of damage to which an actor can possess resistance, immunity, or vulnerability.
 * @enum {string}
 */
CNC.damageResistanceTypes = {
  ...CNC.damageTypes,
  physical: "CNC.DamagePhysical"
};
preLocalize("damageResistanceTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
CNC.movementTypes = {
  burrow: "CNC.MovementBurrow",
  climb: "CNC.MovementClimb",
  fly: "CNC.MovementFly",
  swim: "CNC.MovementSwim",
  walk: "CNC.MovementWalk"
};
preLocalize("movementTypes", { sort: true });

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
CNC.movementUnits = {
  ft: "CNC.DistFt",
  mi: "CNC.DistMi",
  m: "CNC.DistM",
  km: "CNC.DistKm"
};
preLocalize("movementUnits");

/**
 * The valid units of measure for the range of an action or effect.
 * This object automatically includes the movement units from `CNC.movementUnits`.
 * @enum {string}
 */
CNC.distanceUnits = {
  none: "CNC.None",
  self: "CNC.DistSelf",
  touch: "CNC.DistTouch",
  spec: "CNC.Special",
  any: "CNC.DistAny",
  ...CNC.movementUnits
};
preLocalize("distanceUnits");

/* -------------------------------------------- */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @enum {{ imperial: number, metric: number }}
 */
CNC.encumbrance = {
  currencyPerWeight: {
    imperial: 50,
    metric: 110
  },
  strMultiplier: {
    imperial: 15,
    metric: 6.8
  },
  vehicleWeightMultiplier: {
    imperial: 2000, // 2000 lbs in an imperial ton
    metric: 1000 // 1000 kg in a metric ton
  }
};

/* -------------------------------------------- */

/**
 * The types of single or area targets which can be applied to abilities.
 * @enum {string}
 */
CNC.targetTypes = {
  none: "CNC.None",
  self: "CNC.TargetSelf",
  creature: "CNC.TargetCreature",
  ally: "CNC.TargetAlly",
  enemy: "CNC.TargetEnemy",
  object: "CNC.TargetObject",
  space: "CNC.TargetSpace",
  radius: "CNC.TargetRadius",
  sphere: "CNC.TargetSphere",
  cylinder: "CNC.TargetCylinder",
  cone: "CNC.TargetCone",
  square: "CNC.TargetSquare",
  cube: "CNC.TargetCube",
  line: "CNC.TargetLine",
  wall: "CNC.TargetWall"
};
preLocalize("targetTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Mapping between `CNC.targetTypes` and `MeasuredTemplate` shape types to define
 * which templates are produced by which area of effect target type.
 * @enum {string}
 */
CNC.areaTargetTypes = {
  cone: "cone",
  cube: "rect",
  cylinder: "circle",
  line: "ray",
  radius: "circle",
  sphere: "circle",
  square: "rect",
  wall: "ray"
};

/* -------------------------------------------- */

/**
 * Different types of healing that can be applied using abilities.
 * @enum {string}
 */
CNC.healingTypes = {
  healing: "CNC.Healing",
  temphp: "CNC.HealingTemp"
};
preLocalize("healingTypes");

/* -------------------------------------------- */

/**
 * Denominations of hit dice which can apply to classes.
 * @type {string[]}
 */
CNC.hitDieTypes = ["d6", "d8", "d10", "d12"];

/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have.
 * @enum {string}
 */
CNC.senses = {
  blindsight: "CNC.SenseBlindsight",
  darkvision: "CNC.SenseDarkvision",
  tremorsense: "CNC.SenseTremorsense",
  truesight: "CNC.SenseTruesight"
};
preLocalize("senses", { sort: true });

/* -------------------------------------------- */

/**
 * The set of skill which can be trained.
 * @enum {string}
 */
CNC.skills = {
  acr: "CNC.SkillAcr",
  ani: "CNC.SkillAni",
  arc: "CNC.SkillArc",
  ath: "CNC.SkillAth",
  dec: "CNC.SkillDec",
  his: "CNC.SkillHis",
  ins: "CNC.SkillIns",
  itm: "CNC.SkillItm",
  inv: "CNC.SkillInv",
  med: "CNC.SkillMed",
  nat: "CNC.SkillNat",
  prc: "CNC.SkillPrc",
  prf: "CNC.SkillPrf",
  per: "CNC.SkillPer",
  rel: "CNC.SkillRel",
  slt: "CNC.SkillSlt",
  ste: "CNC.SkillSte",
  sur: "CNC.SkillSur"
};
preLocalize("skills", { sort: true });

/* -------------------------------------------- */

/**
 * Various different ways a spell can be prepared.
 */
CNC.spellPreparationModes = {
  prepared: "CNC.SpellPrepPrepared",
  pact: "CNC.PactMagic",
  always: "CNC.SpellPrepAlways",
  atwill: "CNC.SpellPrepAtWill",
  innate: "CNC.SpellPrepInnate"
};
preLocalize("spellPreparationModes");

/**
 * Subset of `CNC.spellPreparationModes` that consume spell slots.
 * @type {boolean[]}
 */
CNC.spellUpcastModes = ["always", "pact", "prepared"];

/**
 * Ways in which a class can contribute to spellcasting levels.
 * @enum {string}
 */
CNC.spellProgression = {
  none: "CNC.SpellNone",
  full: "CNC.SpellProgFull",
  half: "CNC.SpellProgHalf",
  third: "CNC.SpellProgThird",
  pact: "CNC.SpellProgPact",
  artificer: "CNC.SpellProgArt"
};
preLocalize("spellProgression");

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed.
 * @enum {string}
 */
CNC.spellScalingModes = {
  none: "CNC.SpellNone",
  cantrip: "CNC.SpellCantrip",
  level: "CNC.SpellLevel"
};
preLocalize("spellScalingModes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of types which a weapon item can take.
 * @enum {string}
 */
CNC.weaponTypes = {
  simpleM: "CNC.WeaponSimpleM",
  simpleR: "CNC.WeaponSimpleR",
  martialM: "CNC.WeaponMartialM",
  martialR: "CNC.WeaponMartialR",
  natural: "CNC.WeaponNatural",
  improv: "CNC.WeaponImprov",
  siege: "CNC.WeaponSiege"
};
preLocalize("weaponTypes");

/* -------------------------------------------- */

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
CNC.weaponProperties = {
  ada: "CNC.WeaponPropertiesAda",
  amm: "CNC.WeaponPropertiesAmm",
  fin: "CNC.WeaponPropertiesFin",
  fir: "CNC.WeaponPropertiesFir",
  foc: "CNC.WeaponPropertiesFoc",
  hvy: "CNC.WeaponPropertiesHvy",
  lgt: "CNC.WeaponPropertiesLgt",
  lod: "CNC.WeaponPropertiesLod",
  mgc: "CNC.WeaponPropertiesMgc",
  rch: "CNC.WeaponPropertiesRch",
  rel: "CNC.WeaponPropertiesRel",
  ret: "CNC.WeaponPropertiesRet",
  sil: "CNC.WeaponPropertiesSil",
  spc: "CNC.WeaponPropertiesSpc",
  thr: "CNC.WeaponPropertiesThr",
  two: "CNC.WeaponPropertiesTwo",
  ver: "CNC.WeaponPropertiesVer"
};
preLocalize("weaponProperties", { sort: true });

/**
 * Types of components that can be required when casting a spell.
 * @enum {object}
 */
CNC.spellComponents = {
  vocal: {
    label: "CNC.ComponentVerbal",
    abbr: "CNC.ComponentVerbalAbbr"
  },
  somatic: {
    label: "CNC.ComponentSomatic",
    abbr: "CNC.ComponentSomaticAbbr"
  },
  material: {
    label: "CNC.ComponentMaterial",
    abbr: "CNC.ComponentMaterialAbbr"
  }
};
preLocalize("spellComponents", {keys: ["label", "abbr"]});

/**
 * Supplementary rules keywords that inform a spell's use.
 * @enum {object}
 */
CNC.spellTags = {
  concentration: {
    label: "CNC.Concentration",
    abbr: "CNC.ConcentrationAbbr"
  },
  ritual: {
    label: "CNC.Ritual",
    abbr: "CNC.RitualAbbr"
  }
};
preLocalize("spellTags", {keys: ["label", "abbr"]});

/**
 * Schools to which a spell can belong.
 * @enum {string}
 */
CNC.spellSchools = {
  abj: "CNC.SchoolAbj",
  con: "CNC.SchoolCon",
  div: "CNC.SchoolDiv",
  enc: "CNC.SchoolEnc",
  evo: "CNC.SchoolEvo",
  ill: "CNC.SchoolIll",
  nec: "CNC.SchoolNec",
  trs: "CNC.SchoolTrs"
};
preLocalize("spellSchools", { sort: true });

/**
 * Valid spell levels.
 * @enum {string}
 */
CNC.spellLevels = {
  0: "CNC.SpellLevel0",
  1: "CNC.SpellLevel1",
  2: "CNC.SpellLevel2",
  3: "CNC.SpellLevel3",
  4: "CNC.SpellLevel4",
  5: "CNC.SpellLevel5",
  6: "CNC.SpellLevel6",
  7: "CNC.SpellLevel7",
  8: "CNC.SpellLevel8",
  9: "CNC.SpellLevel9"
};
preLocalize("spellLevels");

/**
 * Spell scroll item ID within the `CNC.sourcePacks` compendium for each level.
 * @enum {string}
 */
CNC.spellScrollIds = {
  0: "rQ6sO7HDWzqMhSI3",
  1: "9GSfMg0VOA2b4uFN",
  2: "XdDp6CKh9qEvPTuS",
  3: "hqVKZie7x9w3Kqds",
  4: "DM7hzgL836ZyUFB1",
  5: "wa1VF8TXHmkrrR35",
  6: "tI3rWx4bxefNCexS",
  7: "mtyw4NS1s7j2EJaD",
  8: "aOrinPg7yuDZEuWr",
  9: "O4YbkJkLlnsgUszZ"
};

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
CNC.sourcePacks = {
  ITEMS: "cnc.items"
};

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {number[][]}
 */
CNC.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

/**
 * Settings to configure how actors are merged when polymorphing is applied.
 * @enum {string}
 */
CNC.polymorphSettings = {
  keepPhysical: "CNC.PolymorphKeepPhysical",
  keepMental: "CNC.PolymorphKeepMental",
  keepSaves: "CNC.PolymorphKeepSaves",
  keepSkills: "CNC.PolymorphKeepSkills",
  mergeSaves: "CNC.PolymorphMergeSaves",
  mergeSkills: "CNC.PolymorphMergeSkills",
  keepClass: "CNC.PolymorphKeepClass",
  keepFeats: "CNC.PolymorphKeepFeats",
  keepSpells: "CNC.PolymorphKeepSpells",
  keepItems: "CNC.PolymorphKeepItems",
  keepBio: "CNC.PolymorphKeepBio",
  keepVision: "CNC.PolymorphKeepVision"
};
preLocalize("polymorphSettings", { sort: true });

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels.
 * The key for each level represents its proficiency multiplier.
 * @enum {string}
 */
CNC.proficiencyLevels = {
  0: "CNC.NotProficient",
  1: "CNC.Proficient",
  0.5: "CNC.HalfProficient",
  2: "CNC.Expertise"
};
preLocalize("proficiencyLevels");

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object. In cases where multiple pieces
 * of cover are in play, we take the highest value.
 * @enum {string}
 */
CNC.cover = {
  0: "CNC.None",
  .5: "CNC.CoverHalf",
  .75: "CNC.CoverThreeQuarters",
  1: "CNC.CoverTotal"
};
preLocalize("cover");

/* -------------------------------------------- */

/**
 * A selection of actor attributes that can be tracked on token resource bars.
 * @type {string[]}
 */
CNC.trackableAttributes = [
  "attributes.ac.value", "attributes.init.value", "attributes.movement", "attributes.senses", "attributes.spelldc",
  "attributes.spellLevel", "details.cr", "details.spellLevel", "details.xp.value", "skills.*.passive",
  "abilities.*.value"
];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
CNC.consumableResources = [
  "item.quantity", "item.weight", "item.duration.value", "currency", "details.xp.value", "abilities.*.value",
  "attributes.senses", "attributes.movement", "attributes.ac.flat", "item.armor.value", "item.target", "item.range",
  "item.save.dc"
];

/* -------------------------------------------- */

/**
 * Conditions that can effect an actor.
 * @enum {string}
 */
CNC.conditionTypes = {
  blinded: "CNC.ConBlinded",
  charmed: "CNC.ConCharmed",
  deafened: "CNC.ConDeafened",
  diseased: "CNC.ConDiseased",
  exhaustion: "CNC.ConExhaustion",
  frightened: "CNC.ConFrightened",
  grappled: "CNC.ConGrappled",
  incapacitated: "CNC.ConIncapacitated",
  invisible: "CNC.ConInvisible",
  paralyzed: "CNC.ConParalyzed",
  petrified: "CNC.ConPetrified",
  poisoned: "CNC.ConPoisoned",
  prone: "CNC.ConProne",
  restrained: "CNC.ConRestrained",
  stunned: "CNC.ConStunned",
  unconscious: "CNC.ConUnconscious"
};
preLocalize("conditionTypes", { sort: true });

/**
 * Languages a character can learn.
 * @enum {string}
 */
CNC.languages = {
  common: "CNC.LanguagesCommon",
  aarakocra: "CNC.LanguagesAarakocra",
  abyssal: "CNC.LanguagesAbyssal",
  aquan: "CNC.LanguagesAquan",
  auran: "CNC.LanguagesAuran",
  celestial: "CNC.LanguagesCelestial",
  deep: "CNC.LanguagesDeepSpeech",
  draconic: "CNC.LanguagesDraconic",
  druidic: "CNC.LanguagesDruidic",
  dwarvish: "CNC.LanguagesDwarvish",
  elvish: "CNC.LanguagesElvish",
  giant: "CNC.LanguagesGiant",
  gith: "CNC.LanguagesGith",
  gnomish: "CNC.LanguagesGnomish",
  goblin: "CNC.LanguagesGoblin",
  gnoll: "CNC.LanguagesGnoll",
  halfling: "CNC.LanguagesHalfling",
  ignan: "CNC.LanguagesIgnan",
  infernal: "CNC.LanguagesInfernal",
  orc: "CNC.LanguagesOrc",
  primordial: "CNC.LanguagesPrimordial",
  sylvan: "CNC.LanguagesSylvan",
  terran: "CNC.LanguagesTerran",
  cant: "CNC.LanguagesThievesCant",
  undercommon: "CNC.LanguagesUndercommon"
};
preLocalize("languages", { sort: true });

/**
 * Maximum allowed character level.
 * @type {number}
 */
CNC.maxLevel = 20;

/**
 * XP required to achieve each character level.
 * @type {number[]}
 */
CNC.CHARACTER_EXP_LEVELS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

/**
 * XP granted for each challenge rating.
 * @type {number[]}
 */
CNC.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

/**
 * Character features automatically granted by classes & subclasses at certain levels.
 * @type {object}
 * @deprecated since 1.6.0, targeted for removal in 1.8
 */
CNC.classFeatures = ClassFeatures;

/**
 * Special character flags.
 * @enum {{
 *   name: string,
 *   hint: string,
 *   [abilities]: string[],
 *   [choices]: object<string, string>,
 *   [skills]: string[],
 *   section: string,
 *   type: any,
 *   placeholder: any
 * }}
 */
CNC.characterFlags = {
  diamondSoul: {
    name: "CNC.FlagsDiamondSoul",
    hint: "CNC.FlagsDiamondSoulHint",
    section: "CNC.Feats",
    type: Boolean
  },
  elvenAccuracy: {
    name: "CNC.FlagsElvenAccuracy",
    hint: "CNC.FlagsElvenAccuracyHint",
    section: "CNC.RacialTraits",
    type: Boolean
  },
  halflingLucky: {
    name: "CNC.FlagsHalflingLucky",
    hint: "CNC.FlagsHalflingLuckyHint",
    section: "CNC.RacialTraits",
    type: Boolean
  },
  initiativeAdv: {
    name: "CNC.FlagsInitiativeAdv",
    hint: "CNC.FlagsInitiativeAdvHint",
    section: "CNC.Feats",
    type: Boolean
  },
  initiativeAlert: {
    name: "CNC.FlagsAlert",
    hint: "CNC.FlagsAlertHint",
    section: "CNC.Feats",
    type: Boolean
  },
  jackOfAllTrades: {
    name: "CNC.FlagsJOAT",
    hint: "CNC.FlagsJOATHint",
    section: "CNC.Feats",
    type: Boolean
  },
  observantFeat: {
    name: "CNC.FlagsObservant",
    hint: "CNC.FlagsObservantHint",
    skills: ["prc", "inv"],
    section: "CNC.Feats",
    type: Boolean
  },
  powerfulBuild: {
    name: "CNC.FlagsPowerfulBuild",
    hint: "CNC.FlagsPowerfulBuildHint",
    section: "CNC.RacialTraits",
    type: Boolean
  },
  reliableTalent: {
    name: "CNC.FlagsReliableTalent",
    hint: "CNC.FlagsReliableTalentHint",
    section: "CNC.Feats",
    type: Boolean
  },
  remarkableAthlete: {
    name: "CNC.FlagsRemarkableAthlete",
    hint: "CNC.FlagsRemarkableAthleteHint",
    abilities: ["str", "dex", "con"],
    section: "CNC.Feats",
    type: Boolean
  },
  weaponCriticalThreshold: {
    name: "CNC.FlagsWeaponCritThreshold",
    hint: "CNC.FlagsWeaponCritThresholdHint",
    section: "CNC.Feats",
    type: Number,
    placeholder: 20
  },
  spellCriticalThreshold: {
    name: "CNC.FlagsSpellCritThreshold",
    hint: "CNC.FlagsSpellCritThresholdHint",
    section: "CNC.Feats",
    type: Number,
    placeholder: 20
  },
  meleeCriticalDamageDice: {
    name: "CNC.FlagsMeleeCriticalDice",
    hint: "CNC.FlagsMeleeCriticalDiceHint",
    section: "CNC.Feats",
    type: Number,
    placeholder: 0
  }
};
preLocalize("characterFlags", { keys: ["name", "hint", "section"] });

/**
 * Flags allowed on actors. Any flags not in the list may be deleted during a migration.
 * @type {string[]}
 */
CNC.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(CNC.characterFlags));
