import { Logger } from '../utils/logger';
import { TLGCCActor, TLGCCItem, ActorSystemData, ItemSystemData, WeaponData, HTMLElementWithDataset } from '../types';
import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects';


const logger = Logger.getInstance();

export class TlgccActorSheet extends ActorSheet<ActorSheet.Options, TLGCCActor> {
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
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'combat',
      }],
    });
  }

  override get template() {
    return `systems/castles-and-crusades/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  private async _enrichTextFields(data: Record<string, any>, fieldNames: string[]): Promise<void> {
    for (const fieldName of fieldNames) {
      if (foundry.utils.hasProperty(data, fieldName)) {
        // @ts-ignore
        const enrichedText = await TextEditor.enrichHTML(foundry.utils.getProperty(data, fieldName), { async: true });
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
    // @ts-ignore
    context.effects = prepareActiveEffectCategories(this.actor.effects);
    return context;
  }

  private async _prepareCharacterData(context: Record<string, any>): Promise<void> {
    this._prepareItems(context);
    this._prepareActorData(context);
    await this._enrichTextFields(context, ['system.appearance', 'system.biography']);
    this._prepareAbilities(context);
    this._prepareMoney(context);
  }

  private async _prepareMonsterData(context: Record<string, any>): Promise<void> {
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
    const range = (weapon.system as WeaponData).range?.value?.toLowerCase() || '';

    // Definite ranged weapons
    const rangedOnly = [
      'bow', 'crossbow', 'sling'
    ];

    // Weapons that can be both thrown and used in melee
    const throwableWeapons = [
      'dagger', 'handaxe', 'spear', 'hammer', 'javelin'
    ];

    // Check if it's explicitly a ranged weapon
    if (rangedOnly.some(w => name.includes(w))) {
      return 'ranged';
    }

    // Check if it's a throwable weapon
    if (throwableWeapons.some(w => name.includes(w)) || range.includes('thrown')) {
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

    // Add attack type information to weapons
    const processedWeapons = weapons.map(weapon => {
      const attackType = this._determineWeaponType(weapon);
      return {
        ...weapon,
        attackType,
        canMelee: attackType === 'melee' || attackType === 'both',
        canRanged: attackType === 'ranged' || attackType === 'both'
      };
    });

    const carriedWeight = this._calculateCarriedWeight(gear, processedWeapons, armors, context.system.money);

    Object.assign(context, {
      gear,
      weapons: processedWeapons,
      armors,
      spells,
      features,
      carriedWeight: Math.floor(carriedWeight)
    });
  }

  private _categorizeItems(items: any[]): Record<string, any[]> {
    const categories = {
      gear: [],
      weapons: [],
      armors: [],
      spells: Array(10).fill(null).map(() => []),
      features: []
    };

    for (const item of items ?? []) {
      // @ts-ignore
      item.img = item.img || DEFAULT_TOKEN;
      const category = this._getItemCategory(item);
      if (category === 'spell') {
        const spellLevel = Number(item.system.spellLevel?.value) || 0;
        if (spellLevel >= 0 && spellLevel < 10) {
          // @ts-ignore
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
      case 'item': return 'gear';
      case 'weapon': return 'weapons';
      case 'armor': return 'armors';
      case 'spell': return 'spell';
      case 'feature': return 'features';
      default: return null;
    }
  }

  private _calculateCarriedWeight(gear: any[], weapons: any[], armors: any[], money: Record<string, any>): number {
    const itemWeight = [...gear, ...weapons, ...armors].reduce((acc, item) => {
      const weight = Number(item.system.weight?.value) || 0;
      const quantity = Number(item.system.quantity?.value) || 1;
      return acc + weight * quantity;
    }, 0);

    const moneyWeight = Object.values(money ?? {}).reduce((acc, v) => acc + Math.floor(Number(v.value) / 10), 0);

    return itemWeight + moneyWeight;
  }

  override activateListeners(html: JQuery): void {
    super.activateListeners(html);

    html.find('.item-edit').click(this._onItemEdit.bind(this));
    if (!this.isEditable) return;

    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));
    html.find('.spell-prepare').click(this._onSpellPrepare.bind(this));
    // @ts-ignore
    html.find('.effect-control').click(ev => onManageActiveEffect(ev, this.actor));
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

    this.actor.createEmbeddedDocuments('Item', [itemData], { render: true }) // @ts-ignore
      .then(items => items[0]?.sheet.render(true));
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

  private _onRoll(event: JQuery.ClickEvent): Roll | undefined {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Add debug logging
    logger.debug('Roll clicked', {
      element: element,
      dataset: dataset,
      rollType: dataset.rollType,
      attackType: dataset.attack
    });

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

  private _isFinesseMeleeWeapon(weaponName: string | null): boolean {
    if (!weaponName) return false;
    const finesseWeapons = ['dagger', 'rapier', 'short sword'];
    return finesseWeapons.some(weapon => weaponName.toLowerCase().includes(weapon));
  }

  private _rollWeapon(element: HTMLElement, dataset: DOMStringMap): Roll | undefined {
    logger.debug('Rolling weapon', { element, dataset });

    const itemElement = element.closest('.item') as HTMLElementWithDataset | null;
    if (!itemElement?.dataset?.itemId) return;

    const itemId = itemElement.dataset.itemId;
    const item = this.actor?.items?.get(itemId);
    logger.debug('Found item:', item);

    if (!item) {
      logger.error('No item found for ID:', itemId);
      return;
    }

    // Get attack type (melee or ranged)
    const attackType = dataset.attack;
    logger.debug('Attack type:', attackType);

    // Determine which ability modifier to use
    let abilityMod = 0;
    let abilityUsed = '';

    if (this.actor?.type === 'character') {
      const actorData = this.actor.system as ActorSystemData;

      // Handle melee weapons
      if (attackType === 'melee') {
        // For finesse weapons, allow choice of DEX or STR
        if (item.name && this._isFinesseMeleeWeapon(item.name)) {
          // Use the better modifier between STR and DEX
          const strMod = actorData.abilities?.str?.bonus || 0;
          const dexMod = actorData.abilities?.dex?.bonus || 0;
          abilityMod = Math.max(strMod, dexMod);
          abilityUsed = abilityMod === strMod ? 'STR' : 'DEX';
        } else {
          // Regular melee weapons use STR
          abilityMod = actorData.abilities?.str?.bonus || 0;
          abilityUsed = 'STR';
        }
      }
      // Handle ranged weapons
      else if (attackType === 'ranged') {
        // All ranged attacks use DEX for hit
        abilityMod = actorData.abilities?.dex?.bonus || 0;
        abilityUsed = 'DEX';
      }
    }

    const itemData = item.system as ItemSystemData;
    const actorData = this.actor?.system as ActorSystemData;

    const attackBonus = parseInt(String(itemData.bonusAb?.value || 0));
    const baseAttackBonus = parseInt(String(actorData.attackBonus?.value || 0));

    logger.debug('Attack bonuses:', {
      attackBonus,
      baseAttackBonus,
      abilityMod,
      abilityUsed,
      itemData,
      actorData
    });

    const rollFormula = `d20 + ${baseAttackBonus} + ${attackBonus} + ${abilityMod}`;

    logger.debug('Roll formula:', rollFormula);

    const roll = new Roll(rollFormula, this.actor.getRollData());

    const flavor = `${item.name} Attack Roll<br>1d20 + ${baseAttackBonus} (Base) + ${attackBonus} (Weapon) + ${abilityMod} (${abilityUsed})`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: flavor,
      rollMode: this.ROLL_MODE,
    });

    return roll;
  }

  private _rollDamage(element: HTMLElement, dataset: DOMStringMap): Roll | undefined {
    const itemElement = element.closest('.item') as HTMLElementWithDataset | null;
    if (!itemElement?.dataset?.itemId) return;

    const itemId = itemElement.dataset.itemId;
    const item = this.actor?.items?.get(itemId);
    if (!item) return;

    let damageBonus = 0;
    let abilityUsed = '';

    if (this.actor?.type === 'character') {
      const actorData = this.actor.system as ActorSystemData;
      const itemSystem = item.system as ItemSystemData;
      const itemRange = itemSystem.range?.value?.toLowerCase() || '';
      const isFinesse = item.name && this._isFinesseMeleeWeapon(item.name);
      const isBow = item.name ? item.name.toLowerCase().includes('bow') : false;

      // Melee weapons
      if (itemRange.includes('melee') || !itemRange.includes('ft')) {
        if (isFinesse) {
          // For finesse weapons, use the same ability that was best for attack
          const strMod = actorData.abilities?.str?.bonus || 0;
          const dexMod = actorData.abilities?.dex?.bonus || 0;
          damageBonus = Math.max(strMod, dexMod);
          abilityUsed = damageBonus === strMod ? 'STR' : 'DEX';
        } else {
          // Regular melee weapons use STR
          damageBonus = actorData.abilities?.str?.bonus || 0;
          abilityUsed = 'STR';
        }
      }
      // Ranged weapons
      else {
        // Bows don't get ability bonus to damage
        if (isBow) {
          damageBonus = 0;
          abilityUsed = 'none';
        }
        // Thrown weapons would get STR to damage
        else if (itemRange.includes('thrown')) {
          damageBonus = actorData.abilities?.str?.bonus || 0;
          abilityUsed = 'STR';
        }
      }
    }

    const itemData = item.system as ItemSystemData;
    let rollFormula = itemData.damage?.value || '';

    if (damageBonus !== 0) {
      rollFormula += damageBonus >= 0 ? ` + ${damageBonus}` : ` - ${Math.abs(damageBonus)}`;
    }

    const roll = new Roll(rollFormula, this.actor?.getRollData());
    const label = `${item.name || 'Unknown Item'} Damage${damageBonus !== 0 ? ` (includes ${abilityUsed} mod: ${damageBonus})` : ''}`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      rollMode: this.ROLL_MODE,
    });

    return roll;
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
}