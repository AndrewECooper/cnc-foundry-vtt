// src/module/types.ts

export interface TLGCCActor extends Actor {
  showDetailedFormulas: boolean;
  system: ActorSystemData;
  // @ts-ignore
  items: foundry.documents.EmbeddedCollection<foundry.documents.BaseItem>;
}

export interface TLGCCItem extends foundry.documents.BaseItem {
  system: ItemSystemData;
  name: string;
}

export interface ActorSystemData {
  abilities?: {
    str?: { bonus?: number };
    dex?: { bonus?: number };
  };
  attackBonus?: { value: number };
  type?: string;
}

export interface ItemSystemData {
  bonusAb?: { value: number };
  damage?: { value: string };
  range?: { value: string };
  spelldmg?: { value: string };
}

export interface WeaponData extends ItemSystemData {
  range?: {
    value: string;
    label: string;
  };
  weaponType?: {
    value: 'melee' | 'ranged' | 'both';
    label: string;
  };
}

export interface HTMLElementWithDataset extends HTMLElement {
  dataset: DOMStringMap;
}

export interface DocumentSheetOptions {
  showDetailedFormulas?: boolean;
}

export interface SettingsData {
  disableStatusEffects: boolean;
}
