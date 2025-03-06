import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @augments {Actor}
 */
export class tlgccActor extends Actor {
  [x: string]: any;
  override prepareData() {
    super.prepareData();
  }

  override prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    this._cleanLevelValue();
  }

  override prepareDerivedData() {
    const actorData = this;
    logger.debug('Actor data:', actorData);

    if (actorData.type === 'character') {
      this._prepareCharacterData(actorData);
    } else if (actorData.type === 'monster') {
      this._prepareMonsterData(actorData);
    }
  }

  /**
   * Cleans up the level value by removing any appended class name
   * and ensuring it's a proper integer
   * @private
   */
  private _cleanLevelValue(): void {
    if (this.type !== 'character') return;

    const levelData = this.system?.level;
    if (!levelData) return;

    let currentValue = levelData.value;

    // If the value is undefined or null, set it to 1
    if (currentValue === undefined || currentValue === null) {
      levelData.value = 1;
      return;
    }

    // Convert to string to handle all cases
    currentValue = String(currentValue);

    // If it contains a comma, take only the number part
    if (currentValue.includes(',')) {
      currentValue = currentValue.split(',')[0];
    }

    // Remove any non-numeric characters
    currentValue = currentValue.replace(/[^\d]/g, '');

    // Convert to integer, defaulting to 1 if invalid
    const cleanedValue = parseInt(currentValue);
    levelData.value = isNaN(cleanedValue) ? 1 : cleanedValue;

    logger.debug('Cleaned level value:', levelData.value);
  }

  private _prepareCharacterData(actorData: this) {
    logger.debug('Character data:', actorData);
    const data = actorData.system;

    // Initialize abilities
    for (const [, ability] of Object.entries(data.abilities)) {
      // @ts-ignore
      ability.bonus = this._calculateAbilityBonus(ability.value);
    }

    // Initialize resources if they don't exist
    if (!data.resources) {
      data.resources = {
        resource1: { name: 'Resource 1', value: 0 },
        resource2: { name: 'Resource 2', value: 0 },
        resource3: { name: 'Resource 3', value: 0 },
        resource4: { name: 'Resource 4', value: 0 },
        resource5: { name: 'Resource 5', value: 0 }
      };
    }
  }

  private _calculateAbilityBonus(abilityScore: number): number {
    if (abilityScore <= 3) return -3;
    if (abilityScore <= 5) return -2;
    if (abilityScore <= 8) return -1;
    if (abilityScore <= 12) return 0;
    if (abilityScore <= 15) return 1;
    if (abilityScore <= 17) return 2;
    if (abilityScore <= 19) return 3;
    if (abilityScore <= 21) return 4;
    if (abilityScore <= 23) return 5;
    if (abilityScore <= 25) return 6;
    return 0;
  }

  private _prepareMonsterData(actorData: this) {
    const data = actorData.system;
    if (data.hitDice?.number) {
      // Set attack bonus equal to HD
      data.attackBonus.value = this._calculateMonsterAttackBonus(data.hitDice.number);
    } else {
      data.attackBonus.value = 0;
    }
  }

  private _calculateMonsterAttackBonus(hitDiceNumber: number): number {
    return Math.max(0, hitDiceNumber); // Just return HD, but never negative
  }

  override getRollData() {
    const data = super.getRollData();

    if (this.type === 'character') {
      this._getCharacterRollData(data);
    } else if (this.type === 'monster') {
      this._getMonsterRollData(data);
    }

    this._getActorRollData(data);

    return data;
  }

  private _getCharacterRollData(data: any) {
    logger.debug('Character roll data:', data);

    if (data.abilities) {
      Object.entries(data.abilities).forEach(([k, v]) => {
        data[k] = foundry.utils.deepClone(v);
      });
    }

    data.lvl = data.level?.value ?? 0;
  }

  private _getMonsterRollData(data: any) {
    logger.debug('Monster roll data:', data);
    // Process additional NPC data here.
  }

  private _getActorRollData(data: any) {
    logger.debug('Actor roll data:', data);
    data.ab = data.attackBonus?.value ?? 0;
  }
}