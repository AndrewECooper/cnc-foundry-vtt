import { preLocalize } from "./utils.mjs";

// Namespace Configuration Values
export const TLGCC = {};

// ASCII Artwork
TLGCC.ASCII = `_________________________________________________________________________________

███████████                    ████  ████                       █████      ███
░█░░░███░░░█                   ░░███ ░░███                      ░░███      ░███
░   ░███  ░  ████████   ██████  ░███  ░███   █████████  ██████   ░███████  ░███
    ░███    ░░███░░███ ███░░███ ░███  ░███  ░█░░░░███  ░░░░░███  ░███░░███ ░███
    ░███     ░███ ░░░ ░███ ░███ ░███  ░███  ░   ███░    ███████  ░███ ░███ ░███
    ░███     ░███     ░███ ░███ ░███  ░███    ███░   █ ███░░███  ░███ ░███ ░░░ 
    █████    █████    ░░██████  █████ █████  █████████░░████████ ████ █████ ███
   ░░░░░    ░░░░░      ░░░░░░  ░░░░░ ░░░░░  ░░░░░░░░░  ░░░░░░░░ ░░░░ ░░░░░ ░░░ 

_________________________________________________________________________________`;

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
 TLGCC.abilities = {
  "str": "TLGCC.AbilityStr",
  "dex": "TLGCC.AbilityDex",
  "con": "TLGCC.AbilityCon",
  "int": "TLGCC.AbilityInt",
  "wis": "TLGCC.AbilityWis",
  "cha": "TLGCC.AbilityCha"
};
preLocalize("abilities");

TLGCC.abilityAbbreviations = {
  "str": "TLGCC.AbilityStrAbbr",
  "dex": "TLGCC.AbilityDexAbbr",
  "con": "TLGCC.AbilityConAbbr",
  "int": "TLGCC.AbilityIntAbbr",
  "wis": "TLGCC.AbilityWisAbbr",
  "cha": "TLGCC.AbilityChaAbbr"
};
preLocalize("abilityAbbreviations");

TLGCC.abilitySave = {
  "str": "TLGCC.AbilityStrSave",
  "dex": "TLGCC.AbilityDexSave",
  "con": "TLGCC.AbilityConSave",
  "int": "TLGCC.AbilityIntSave",
  "wis": "TLGCC.AbilityWisSave",
  "cha": "TLGCC.AbilityChaSave"
};
preLocalize("abilitySave");

/**
 * The set of Saving Throws used within the sytem. FIXME - I would like to use this for tracking class resources.
 * @type {Object}
 */

TLGCC.saves = {
  "death": "TLGCC.SaveDeath",
  "wands": "TLGCC.SaveWands",
  "paralysis": "TLGCC.SaveParalysis",
  "breath": "TLGCC.SaveBreath",
  "spells": "TLGCC.SaveSpells"
};
preLocalize("saves");

/**
 * Money used within the sytem.
 * @type {Object}
 */
TLGCC.money = {
  "pp": "TLGCC.Platinum",
  "gp": "TLGCC.Gold",
  "sp": "TLGCC.Silver",
  "cp": "TLGCC.Copper"
};
preLocalize("money");
