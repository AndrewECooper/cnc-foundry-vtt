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

  private _prepareCharacterData(actorData: this) {
    logger.debug('Character data:', actorData);
    const data = actorData.system;

    for (const [, ability] of Object.entries(data.abilities)) {
      // @ts-ignore
      ability.bonus = this._calculateAbilityBonus(ability.value);
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
    data.attackBonus.value = this._calculateMonsterAttackBonus(data.hitDice.number);
  }

  private _calculateMonsterAttackBonus(hitDiceNumber: number): number {
    if (hitDiceNumber < 1) return 0;
    if (hitDiceNumber <= 8) return hitDiceNumber;
    if (hitDiceNumber <= 9) return 8;
    if (hitDiceNumber <= 11) return 9;
    if (hitDiceNumber <= 13) return 10;
    if (hitDiceNumber <= 15) return 11;
    if (hitDiceNumber <= 19) return 12;
    if (hitDiceNumber <= 23) return 13;
    if (hitDiceNumber <= 27) return 14;
    if (hitDiceNumber <= 31) return 15;
    return hitDiceNumber;
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