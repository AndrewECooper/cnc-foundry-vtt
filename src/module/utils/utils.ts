import { Logger } from './logger';

interface ConfigCollection {
  collection: {
    instance: any;
  };
}

// utils.ts
interface GameConfig {
  [key: string]: {
    collection: {
      instance: Collection<any>;
    };
  };
}

// @ts-ignore - game.config exists in foundry
const config = game.config as GameConfig;

const logger = Logger.getInstance();

/* Copyright notice and license */
// ... (Keep the existing copyright notice)

/* -------------------------------------------- */
/*  Object Helpers                              */
/* -------------------------------------------- */

/**
 * Sort the provided object by its values or by an inner sortKey.
 * @param obj The object to sort.
 * @param sortKey An inner key upon which to sort.
 * @returns A copy of the original object that has been sorted.
 */
export function sortObjectEntries<T extends Record<string, any>>(
  obj: T,
  sortKey?: keyof T[keyof T],
): T {
  const sorted = Object.entries(obj).sort(([, a], [, b]) => {
    if (sortKey) {
      return (a[sortKey] as string).localeCompare(b[sortKey] as string);
    }
    return (a as string).localeCompare(b as string);
  });
  return Object.fromEntries(sorted) as T;
}

/* -------------------------------------------- */

/**
 * Retrieve the indexed data for a Document using its UUID. Will never return a result for embedded documents.
 * @param uuid The UUID of the Document index to retrieve.
 * @returns Document's index if one could be found.
 */
export function indexFromUuid(uuid: string): object | null {
  const parts = uuid.split('.');
  let index: object | undefined;

  if (parts[0] === 'Compendium') {
    const [, scope, packName, id] = parts;
    // @ts-ignore
    const pack = game.packs.get(`${scope}.${packName}`);
    index = pack?.index.get(id);
  } else if (parts.length < 3) {
    const [docName, id] = parts;
    const collection = config[docName].collection.instance;
    index = collection.get(id);
  }

  return index ?? null;
}

/* -------------------------------------------- */

/**
 * Creates an HTML document link for the provided UUID.
 * @param uuid UUID for which to produce the link.
 * @returns Link to the item or empty string if item wasn't found.
 */
export function createUuidLink(uuid: string): string {
  // @ts-ignore
  const index = game.tlgcc.utils.indexFromUuid(uuid);
  // @ts-ignore
  const linkText = index ? index.name : game.i18n.localize('TLGCC.Unknown');
  const link = `@UUID[${uuid}]{${linkText}}`;
  // @ts-ignore
  return TextEditor.enrichHTML(link, { async: false, relativeTo: null });
}

/* -------------------------------------------- */
/*  Config Pre-Localization                     */
/* -------------------------------------------- */

interface PreLocalizationOptions {
  key?: string;
  keys?: string[];
  sort?: boolean;
}

interface PreLocalizationRegistration {
  keys: string[];
  sort: boolean;
}

const _preLocalizationRegistrations: Record<
  string,
  PreLocalizationRegistration
> = {};

/**
 * Mark the provided config key to be pre-localized during the init stage.
 * @param configKey Key within `CONFIG.DND5E` to localize.
 * @param options Options for pre-localization.
 */
export function preLocalize(
  configKey: string,
  options: PreLocalizationOptions = {},
): void {
  const { key, keys = [], sort = false } = options;
  const finalKeys = key ? [key, ...keys] : keys;
  _preLocalizationRegistrations[configKey] = { keys: finalKeys, sort };
}

/**
 * Execute previously defined pre-localization tasks on the provided config object.
 * @param config The `CONFIG.DND5E` object to localize and sort. *Will be mutated.*
 */
export function performPreLocalization(config: Record<string, any>): void {
  for (const [key, settings] of Object.entries(_preLocalizationRegistrations)) {
    _localizeObject(config[key], settings.keys);
    if (settings.sort) {
      config[key] = sortObjectEntries(config[key], settings.keys[0]);
    }
  }
}

/**
 * Localize the values of a configuration object by translating them in-place.
 * @param obj The configuration object to localize.
 * @param keys List of inner keys that should be localized if this is an object.
 */
function _localizeObject(obj: Record<string, any>, keys: string[]): void {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      // @ts-ignore
      obj[k] = game.i18n.localize(v);
    } else if (typeof v === 'object' && v !== null) {
      if (!keys.length) {
        logger.error(
          'Localization keys must be provided for pre-localizing when target is an object.',
        );
        continue;
      }
      for (const key of keys) {
        if (v[key]) {
          // @ts-ignore
          v[key] = game.i18n.localize(v[key]);
        }
      }
    } else {
      logger.error(
        `Pre-localized configuration values must be a string or object, ${typeof v} found for "${k}" instead.`,
      );
    }
  }
}
