// Access the system object
export const TLGCC = {
  SYSTEM_ID: 'castles-and-crusades', // This should match the "id" field in your module's manifest
  ASCII: `_________________________________________________________________________________

███████████                    ████  ████                       █████      ███
░█░░░███░░░█                   ░░███ ░░███                      ░░███      ░███
░   ░███  ░  ████████   ██████  ░███  ░███   █████████  ██████   ░███████  ░███
    ░███    ░░███░░███ ███░░███ ░███  ░███  ░█░░░░███  ░░░░░███  ░███░░███ ░███
    ░███     ░███ ░░░ ░███ ░███ ░███  ░███  ░   ███░    ███████  ░███ ░███ ░███
    ░███     ░███     ░███ ░███ ░███  ░███    ███░   █ ███░░███  ░███ ░███ ░░░ 
    █████    █████    ░░██████  █████ █████  █████████░░████████ ████ █████ ███
   ░░░░░    ░░░░░      ░░░░░░  ░░░░░ ░░░░░  ░░░░░░░░░  ░░░░░░░░ ░░░░ ░░░░░ ░░░ 

_________________________________________________________________________________`,
  PEPPERTIME: `
%c      ____________________      
     |  ________________  |     
     | |                | |     
     | |   Dr. Pepper   | |     
     | |                | |     
     | |    ________    | |     
     | |   |        |   | |     
     | |   |        |   | |     
     | |   |        |   | |     
     | |   |________|   | |     
     | |                | |     
     | |________________| |     
     |____________________|     
`,
  PEPPERCOLOR: 'color: #8B0000; font-weight: bold; font-size: 12px;',
  abilities: {
    str: 'TLGCC.AbilityStr',
    dex: 'TLGCC.AbilityDex',
    con: 'TLGCC.AbilityCon',
    int: 'TLGCC.AbilityInt',
    wis: 'TLGCC.AbilityWis',
    cha: 'TLGCC.AbilityCha',
  },
  abilityAbbreviations: {
    str: 'TLGCC.AbilityStrAbbr',
    dex: 'TLGCC.AbilityDexAbbr',
    con: 'TLGCC.AbilityConAbbr',
    int: 'TLGCC.AbilityIntAbbr',
    wis: 'TLGCC.AbilityWisAbbr',
    cha: 'TLGCC.AbilityChaAbbr',
  },
  abilitySave: {
    str: 'TLGCC.AbilityStrSave',
    dex: 'TLGCC.AbilityDexSave',
    con: 'TLGCC.AbilityConSave',
    int: 'TLGCC.AbilityIntSave',
    wis: 'TLGCC.AbilityWisSave',
    cha: 'TLGCC.AbilityChaSave',
  },
  saves: {
    death: 'TLGCC.SaveDeath',
    wands: 'TLGCC.SaveWands',
    paralysis: 'TLGCC.SaveParalysis',
    breath: 'TLGCC.SaveBreath',
    spells: 'TLGCC.SaveSpells',
  },
  money: {
    pp: 'TLGCC.Platinum',
    gp: 'TLGCC.Gold',
    sp: 'TLGCC.Silver',
    cp: 'TLGCC.Copper',
  },
};
