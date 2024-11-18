/**
 * Manage Active Effect instances through the Actor Sheet via effect control buttons.
 * @param event - The left-click event on the effect control
 * @param owner - The owning document which manages this effect
 * @returns The created or updated effect, or void if deleting
 */
export async function onManageActiveEffect(
  event: MouseEvent | null,
  owner: Actor | Item,
): Promise<ActiveEffect | ActiveEffect[] | void> {
  if (!event) return;

  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  const li = target.closest('li');
  if (!li) return;

  const effectId = li.dataset.effectId;
  const effect = effectId ? owner.effects.get(effectId) : null;

  switch (target.dataset.action) {
    case 'create':
      // @ts-ignore
      return owner.createEmbeddedDocuments('ActiveEffect', [
        {
          label: 'New Effect',
          icon: 'icons/svg/aura.svg',
          origin: owner.uuid,
          duration: {
            rounds: li.dataset.effectType === 'temporary' ? 1 : undefined,
          },
          disabled: li.dataset.effectType === 'inactive',
        },
      ]);
    case 'edit':
      // @ts-ignore
      return effect?.sheet.render(true);
    case 'delete':
      return effect?.delete();
    case 'toggle':
      // @ts-ignore
      return effect?.update({ disabled: !effect.disabled });
    default:
      console.warn(`Unhandled action: ${target.dataset.action}`);
  }
}

interface EffectCategory {
  type: 'temporary' | 'passive' | 'inactive';
  label: string;
  effects: ActiveEffect[];
}

type EffectCategories = Record<EffectCategory['type'], EffectCategory>;

/**
 * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
 * @param effects - The array of Active Effect instances to prepare sheet data for
 * @returns Data for rendering
 */
export function prepareActiveEffectCategories(
  effects: ActiveEffect[],
): EffectCategories {
  const categories: EffectCategories = {
    temporary: {
      type: 'temporary',
      label: 'Temporary Effects',
      effects: [],
    },
    passive: {
      type: 'passive',
      label: 'Passive Effects',
      effects: [],
    },
    inactive: {
      type: 'inactive',
      label: 'Inactive Effects',
      effects: [],
    },
  };

  for (const effect of effects) {
    // @ts-ignore
    effect._getSourceName(); // Trigger a lookup for the source name
    // @ts-ignore
    if (effect.disabled) {
      categories.inactive.effects.push(effect);
    } else if (effect.isTemporary) {
      categories.temporary.effects.push(effect);
    } else {
      categories.passive.effects.push(effect);
    }
  }

  return categories;
}
