// src/module/helpers/settings.ts
import { Logger } from '../utils/logger';
import {
  TLGCCActor,
  TLGCCItem,
  ActorSystemData,
  ItemSystemData,
  WeaponData,
  HTMLElementWithDataset,
} from '../types';
import Settings from '../helpers/settings';
// import { DocumentSheetOptions } from '../types';
import { NumberAppearingRoller } from '../utils/number-appearing';

interface WeaponAttackOverrides {
  temporaryEnableAllAttacks: boolean;
}

interface ItemCategories {
  gear: any[];
  weapons: any[];
  armors: any[];
  spells: any[][];
  features: any[];
  [key: string]: any[] | any[][];
}

const logger = Logger.getInstance();

export class TlgccActorSheet extends ActorSheet<
  ActorSheet.Options,
  TLGCCActor
> {
  // Add this as a static property of the class
  private static readonly CONFIG_OVERRIDES: WeaponAttackOverrides = {
    temporaryEnableAllAttacks: true // Set this to true to enable all attacks
  };

  // Remove the declare actor line and instead override the getter
  override get actor(): TLGCCActor {
    // @ts-ignore - We know this will be our custom actor type
    return super.actor;
  }
  // @ts-ignore
  private ROLL_MODE = game.settings.get('core', 'rollMode');

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['tlgcc', 'sheet', 'actor'],
      template: 'systems/castles-and-crusades/templates/actor/actor-sheet.html',
      width: 780,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'combat',
        },
      ],
    });
  }

  override get template() {
    return `systems/castles-and-crusades/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  // actor-sheet.ts
  private async _enrichTextFields(
    data: Record<string, any>,
    fieldNames: string[],
  ): Promise<void> {
    for (const fieldName of fieldNames) {
      if (foundry.utils.hasProperty(data, fieldName)) {
        // @ts-ignore - foundry types don't match actual API
        const enrichedText = await TextEditor.enrichHTML(
          foundry.utils.getProperty(data, fieldName),
          {
            secrets: this.actor.isOwner,
            rollData: this.actor?.getRollData(),
          },
        );
        foundry.utils.setProperty(data, fieldName, enrichedText);
      }
    }
  }

  // @ts-ignore
  override async getData(): Promise<Record<string, any>> {
    const context = await super.getData();
    logger.debug('ActorSheet Context:', context);
    const actorData = this.actor.toObject(false);

    // @ts-ignore
    context.system = actorData.system;
    // @ts-ignore
    context.flags = actorData.flags;

    if (actorData.type === 'character') {
      await this._prepareCharacterData(context);
    } else if (actorData.type === 'monster') {
      await this._prepareMonsterData(context);
    }

    // @ts-ignore
    context.rollData = this.actor.getRollData();
    context.showDetailedFormulas = Settings.showDetailedFormulas;
    return context;
  }

  private async _prepareCharacterData(
    context: Record<string, any>,
  ): Promise<void> {
    this._prepareItems(context);
    this._prepareActorData(context);
    await this._enrichTextFields(context, [
      'system.appearance',
      'system.biography',
    ]);
    this._prepareAbilities(context);
    this._prepareMoney(context);
  }

  private async _prepareMonsterData(
    context: Record<string, any>,
  ): Promise<void> {
    this._prepareItems(context);
    this._prepareActorData(context);
    await this._enrichTextFields(context, ['system.biography']);
  }

  private _prepareActorData(context: Record<string, any>): void {
    for (const [k, v] of Object.entries(context.system.saves ?? {})) {
      // @ts-ignore
      v.label = game.i18n.localize(CONFIG.TLGCC.saves[k]) ?? k;
    }
  }

  private _prepareAbilities(context: Record<string, any>): void {
    for (const [k, v] of Object.entries(context.system.abilities ?? {})) {
      // @ts-ignore
      v.label = game.i18n.localize(CONFIG.TLGCC.abilities[k]) ?? k;
    }
  }

  private _prepareMoney(context: Record<string, any>): void {
    for (const [k, v] of Object.entries(context.system.money ?? {})) {
      // @ts-ignore
      v.label = game.i18n.localize(CONFIG.TLGCC.money[k]) ?? k;
    }
  }

  private _determineWeaponType(weapon: TLGCCItem): 'melee' | 'ranged' | 'both' {
    if (!weapon?.name || !weapon.system) return 'melee'; // Default to melee if no data

    const name = weapon.name.toLowerCase();
    const range =
      (weapon.system as WeaponData).range?.value?.toLowerCase() || '';

    // Definite ranged weapons
    const rangedOnly = ['bow', 'crossbow', 'sling'];

    // Weapons that can be both thrown and used in melee
    const throwableWeapons = [
      'dagger',
      'handaxe',
      'spear',
      'hammer',
      'javelin',
    ];

    // Check if it's explicitly a ranged weapon
    if (rangedOnly.some((w) => name.includes(w))) {
      return 'ranged';
    }

    // Check if it's a throwable weapon
    if (
      throwableWeapons.some((w) => name.includes(w)) ||
      range.includes('thrown')
    ) {
      return 'both';
    }

    // By default, weapons are melee unless they have a range value with feet
    if (range.includes('ft') && !range.includes('thrown')) {
      return 'ranged';
    }

    return 'melee';
  }

  private _prepareItems(context: Record<string, any>): void {
    const { gear, weapons, armors, spells, features } = this._categorizeItems(context.items);

    // Add attack type information to weapons with override
    const processedWeapons = weapons.map((weapon) => {
      const attackType = this._determineWeaponType(weapon);
      return {
        ...weapon,
        attackType,
        // Override the canMelee and canRanged flags if temporaryEnableAllAttacks is true
        canMelee: TlgccActorSheet.CONFIG_OVERRIDES.temporaryEnableAllAttacks ? true : (attackType === 'melee' || attackType === 'both'),
        canRanged: TlgccActorSheet.CONFIG_OVERRIDES.temporaryEnableAllAttacks ? true : (attackType === 'ranged' || attackType === 'both'),
      };
    });

    const carriedWeight = this._calculateCarriedWeight(
      gear,
      processedWeapons,
      armors,
      context.system.money,
    );

    Object.assign(context, {
      gear,
      weapons: processedWeapons,
      armors,
      spells,
      features,
      carriedWeight: Math.floor(carriedWeight),
      showDetailedFormulas: Settings.showDetailedFormulas,
    });
  }

  private _categorizeItems(items: any[]): ItemCategories {
    const categories: ItemCategories = {
      gear: [],
      weapons: [],
      armors: [],
      spells: Array(10)
        .fill(null)
        .map(() => []),
      features: [],
    };

    for (const item of items ?? []) {
      // @ts-ignore
      item.img = item.img || DEFAULT_TOKEN;
      const category = this._getItemCategory(item);
      if (category === 'spell') {
        // Update this section to check both possible locations for spell level
        const spellLevel = Number(item.system.spell?.spelllevel) || Number(item.system.spellLevel?.value) || 0;
        if (spellLevel >= 0 && spellLevel < 10) {
          categories.spells[spellLevel].push(item);
        }
      } else if (category) {
        categories[category].push(item);
      }
    }

    return categories;
  }

  private _getItemCategory(item: any): string | null {
    switch (item.type) {
      case 'item':
        return 'gear';
      case 'weapon':
        return 'weapons';
      case 'armor':
        return 'armors';
      case 'spell':
        return 'spell';
      case 'feature':
        return 'features';
      default:
        return null;
    }
  }

  private _calculateCarriedWeight(
    gear: any[],
    weapons: any[],
    armors: any[],
    money: Record<string, any>,
  ): number {
    const itemWeight = [...gear, ...weapons, ...armors].reduce((acc, item) => {
      const weight = Number(item.system.weight?.value) || 0;
      const quantity = Number(item.system.quantity?.value) || 1;
      return acc + weight * quantity;
    }, 0);

    const moneyWeight = Object.values(money ?? {}).reduce(
      (acc, v) => acc + Math.floor(Number(v.value) / 10),
      0,
    );

    return itemWeight + moneyWeight;
  }

  override activateListeners(html: JQuery): void {
    super.activateListeners(html);

    // Add new listeners for monster attribute checks and saves
    if (this.actor.type === 'monster') {
      html.find('.monster-attribute-check').click(this._rollMonsterAttributeCheck.bind(this));
      html.find('.monster-save').click(this._onMonsterSave.bind(this));
    }

    html.find('.item-edit').click(this._onItemEdit.bind(this));
    if (!this.isEditable) return;

    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));
    html.find('.spell-prepare').click(this._onSpellPrepare.bind(this));
    html.find('.rollable').click(this._onRoll.bind(this));

    if (this.actor.isOwner) {
      this._setupDragListeners(html);
    }
  }

  private _setupDragListeners(html: JQuery): void {
    html.find('li.item:not(.inventory-header)').each((_, li) => {
      li.setAttribute('draggable', 'true');
      li.addEventListener('dragstart', this._onDragStart.bind(this), false);
    });
  }

  private _onItemEdit(event: JQuery.ClickEvent): void {
    const itemId = $(event.currentTarget).closest('.item').data('itemId');
    const item = this.actor.items.get(itemId);
    // @ts-ignore
    item?.sheet.render(true);
  }

  private _onItemCreate(event: JQuery.ClickEvent): void {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = foundry.utils.duplicate(header.dataset);

    if (type === 'spell') {
      data.spellLevel = { value: data.spellLevelValue };
      delete data.spellLevelValue;
    }

    const itemData = {
      name: `New ${type.capitalize()}`,
      type,
      system: foundry.utils.deepClone(data),
    };

    this.actor
      .createEmbeddedDocuments('Item', [itemData], { render: true }) // @ts-ignore
      .then((items) => items[0]?.sheet.render(true));
  }

  private _onItemDelete(event: JQuery.ClickEvent): void {
    const li = $(event.currentTarget).closest('.item');
    const itemId = li.data('itemId');
    this.actor.items.get(itemId)?.delete();
    li.slideUp(200, () => this.render(false));
  }

  private _onSpellPrepare(event: JQuery.ClickEvent): void {
    const change = parseInt(event.currentTarget.dataset.change ?? '0');
    if (change) {
      const li = $(event.currentTarget).closest('.item');
      const item = this.actor.items.get(li.data('itemId'));
      if (item) {
        // @ts-ignore
        const newValue = (item.system.prepared?.value ?? 0) + change;
        item.update({ 'system.prepared.value': newValue });
      }
    }
  }

  private async _onRoll(event: JQuery.ClickEvent): Promise<Roll | undefined> {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Add debug logging
    logger.debug('Roll clicked', {
      element: element,
      dataset: dataset,
      rollType: dataset.rollType,
    });

    if (dataset.rollType === 'numberAppearing') {
      return this._rollNumberAppearing(element);
    }

    if (dataset.rollType === 'weapon') {
      return this._rollWeapon(element, dataset);
    } else if (dataset.rollType === 'damage') {
      return this._rollDamage(element, dataset);
    } else if (dataset.rollType === 'item') {
      return this._rollItem(element);
    } else if (dataset.roll) {
      return this._rollGeneric(dataset);
    }
  }

  /*private _isFinesseMeleeWeapon(weaponName: string | null): boolean {
    if (!weaponName) return false;
    const finesseWeapons = ['dagger', 'rapier', 'short sword'];
    return finesseWeapons.some((weapon) =>
      weaponName.toLowerCase().includes(weapon),
    );
  }*/

  private _rollWeapon(element: HTMLElement, dataset: DOMStringMap): Roll | undefined {
    const itemElement = element.closest('.item') as HTMLElementWithDataset | null;
    if (!itemElement?.dataset?.itemId) return;

    const itemId = itemElement.dataset.itemId;
    const item = this.actor?.items.get(itemId);
    if (!item) return;

    // Get attack type (melee or ranged)
    const attackType = dataset.attack;

    // Initialize variables
    let abilityMod = 0;
    let abilityUsed = '';
    let rollParts: string[] = ['1d20']; // Start with base d20 roll
    let rollData: Record<string, number> = {};

    // Only apply ability modifiers for characters, not monsters
    if (this.actor?.type === 'character') {
      const actorData = this.actor.system as ActorSystemData;

      // Handle melee weapons
      if (attackType === 'melee') {
        if (item.name && this._isFinesseMelee(item.name)) {
          const strMod = actorData.abilities?.str?.bonus || 0;
          const dexMod = actorData.abilities?.dex?.bonus || 0;
          abilityMod = Math.max(strMod, dexMod);
          abilityUsed = abilityMod === strMod ? 'STR' : 'DEX';
        } else {
          abilityMod = actorData.abilities?.str?.bonus || 0;
          abilityUsed = 'STR';
        }
      }
      else if (attackType === 'ranged') {
        abilityMod = actorData.abilities?.dex?.bonus || 0;
        abilityUsed = 'DEX';
      }
    }

    const itemData = item.system as ItemSystemData;
    const actorData = this.actor?.system as ActorSystemData;

    // Add base attack bonus
    const baseAttackBonus = parseInt(String(actorData.attackBonus?.value || 0));
    if (baseAttackBonus) {
      rollParts.push(`${baseAttackBonus}`);
      rollData.bab = baseAttackBonus;
    }

    // Add weapon bonus
    const weaponBonus = parseInt(String(itemData.bonusAb?.value || 0));
    if (weaponBonus) {
      rollParts.push(`${weaponBonus}`);
      rollData.weaponBonus = weaponBonus;
    }

    // Add ability modifier
    if (abilityMod !== 0) {
      rollParts.push(`${abilityMod}`);
      rollData.abilityMod = abilityMod;
    }

    // Create the roll formula
    const rollFormula = rollParts.join(' + ');

    // Create the roll
    const roll = new Roll(rollFormula, rollData);

    // Create attack type label
    const attackLabel = attackType === 'melee' ? 'Melee Attack' : 'Ranged Attack';
    let flavor = `Roll: <b>${attackLabel} &rarr; ${item.name}</b>`;

    // Add formula details if enabled
    if (Settings.showDetailedFormulas) {
      const detailedParts = [];
      detailedParts.push('1d20');
      if (baseAttackBonus) detailedParts.push('@ab');
      if (abilityMod) {
        const abilityKey = abilityUsed.toLowerCase();
        detailedParts.push(`@abilities.${abilityKey}.bonus`);
      }
      if (weaponBonus) detailedParts.push(`${weaponBonus}`);

      flavor += `<br><em>(${detailedParts.join(' + ')})</em>`;
    }

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: flavor,
      rollMode: this.ROLL_MODE,
    });

    return roll;
  }

  private async _rollDamage(element: HTMLElement, dataset: DOMStringMap): Promise<Roll | undefined> {
    const itemElement = element.closest('.item') as HTMLElementWithDataset | null;
    if (!itemElement?.dataset?.itemId) return;

    const itemId = itemElement.dataset.itemId;
    const item = this.actor?.items.get(itemId);
    if (!item) return;

    let rollParts: string[] = [];
    let rollData: Record<string, number> = {};

    const itemData = item.system as ItemSystemData;

    if (item.type === 'weapon') {
      const baseDamage = itemData.damage?.value || '';
      if (!baseDamage) return;
      rollParts.push(baseDamage);

      // Add ability modifier for weapons
      if (this.actor?.type === 'character') {
        const actorData = this.actor.system as ActorSystemData;

        // For melee weapons
        if (this._isFinesseMelee(item.name)) {
          // Use higher of STR or DEX for finesse weapons
          const strMod = actorData.abilities?.str?.bonus || 0;
          const dexMod = actorData.abilities?.dex?.bonus || 0;
          const abilityMod = Math.max(strMod, dexMod);
          if (abilityMod) {
            rollParts.push(abilityMod.toString());
            rollData.abilityMod = abilityMod;
          }
        } else if (!itemData.range?.value?.toLowerCase().includes('ft')) {
          // Regular melee weapons use STR
          const strMod = actorData.abilities?.str?.bonus || 0;
          if (strMod) {
            rollParts.push(strMod.toString());
            rollData.abilityMod = strMod;
          }
        } else {
          // Ranged weapons don't add ability mod to damage
        }
      }
    } else if (item.type === 'spell') {
      const spellDamage = (itemData as any).spelldmg?.value || '';
      if (!spellDamage) return;
      rollParts.push(spellDamage);
    }

    const rollFormula = rollParts.join(' + ');
    if (!rollFormula) return;

    const roll = new Roll(rollFormula, this.actor?.getRollData());

    let flavor = `Roll: <b>Damage &rarr; ${item.name}</b>`;

    // Add formula details if enabled
    if (Settings.showDetailedFormulas) {
      const detailedParts = [];

      if (item.type === 'weapon') {
        detailedParts.push(itemData.damage?.value);

        if (this.actor?.type === 'character') {
          if (this._isFinesseMelee(item.name)) {
            detailedParts.push('max(@abilities.str.bonus, @abilities.dex.bonus)');
          } else if (!itemData.range?.value?.toLowerCase().includes('ft')) {
            detailedParts.push('@abilities.str.bonus');
          }
        }
      } else if (item.type === 'spell') {
        detailedParts.push((itemData as any).spelldmg?.value);
      }

      flavor += `<br><em>(${detailedParts.join(' + ')})</em>`;
    }

    try {
      // Evaluate the roll before sending to chat
      await roll.evaluate({ async: true });

      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: flavor,
        rollMode: this.ROLL_MODE,
      });

      return roll;
    } catch (error) {
      logger.error('Error creating roll:', error);
      return undefined;
    }
  }

  private _isFinesseMelee(weaponName: string): boolean {
    const finesseWeapons = ['dagger', 'rapier', 'short sword'];
    return finesseWeapons.some((weapon) =>
      weaponName.toLowerCase().includes(weapon),
    );
  }

  private _rollItem(element: HTMLElement): Roll | undefined {
    // @ts-ignore
    const itemId = element.closest('.item')?.dataset.itemId;
    // @ts-ignore
    return this.actor.items.get(itemId)?.roll();
  }

  private _rollGeneric(dataset: DOMStringMap): Roll {
    const label = dataset.label ? `Roll: ${dataset.label}` : '';
    const roll = new Roll(dataset.roll ?? '', this.actor.getRollData());
    // @ts-ignore
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      rollMode: this.ROLL_MODE,
    });
    return roll;
  }

  private _rollNumberAppearing(element: HTMLElement): Roll | undefined {
    try {
      // @ts-ignore
      const format = this.actor.system.numberAppearing.value;

      // Early return if the value is "1"
      if (!NumberAppearingRoller.needsRoll(format)) {
        return undefined;
      }

      const result = NumberAppearingRoller.roll(format);

      // Create a roll to represent this result
      const roll = new Roll('1d1', { result: result.value });
      roll.evaluate({ async: false });

      // Create chat message with private roll mode
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `<h2>${this.actor.name}: Number Appearing</h2>${result.detail}`,
        content: `<h3>Total: ${result.value}</h3>`,
        rollMode: 'gmroll',
        // @ts-ignore - whisper property exists but isn't in types
        whisper: [game.user?.id || '']
      });

      return roll;
    } catch (error) {
      logger.error('Error in _rollNumberAppearing:', error);
      ui.notifications?.error('Error rolling number appearing. Check the console for details.');
      return undefined;
    }
  }

  private _rollMonsterAttributeCheck(event: JQuery.ClickEvent): void {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const attribute = dataset.attribute;

    if (this.actor.type !== 'monster') return;

    // @ts-ignore
    const hitDice = this.actor.system.hitDice.number;
    const roll = new Roll(`1d20+${hitDice}`);

    let label = `${this.actor.name} - ${attribute} Check`;
    if (Settings.showDetailedFormulas) {
      label += `<br><em>(1d20 + ${hitDice} [HD])</em>`;
    }

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      rollMode: this.ROLL_MODE
    });
  }

  private _onMonsterSave(event: JQuery.ClickEvent): void {
    if (this.actor.type !== 'monster') return;

    const element = event.currentTarget;
    const dataset = element.dataset;
    const save = dataset.save;
    // @ts-ignore
    const hitDice = this.actor.system.hitDice.number;

    const roll = new Roll(`1d20+${hitDice}`);

    let label = `${this.actor.name} - ${save} Save`;
    if (Settings.showDetailedFormulas) {
      label += `<br><em>(1d20 + ${hitDice} [HD])</em>`;
    }

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      rollMode: this.ROLL_MODE
    });
  }

}
