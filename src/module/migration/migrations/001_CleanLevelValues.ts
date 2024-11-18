// src/module/migrations/migrations/Migration001CleanLevelValues.ts
import { Logger } from '../../utils/logger';

const logger = Logger.getInstance();

export class Migration001CleanLevelValues {
  static readonly version = 1;

  static async migrate(): Promise<void> {
    logger.info('Starting migration: Clean level values');

    // Get all character actors
    // @ts-ignore - game.actors exists at runtime
    const characters = game.actors?.filter(actor => actor.type === 'character') ?? [];

    for (const actor of characters) {
      try {
        const levelData = actor.system?.level;
        if (!levelData) continue;

        let currentValue = levelData.value;

        // Skip if already a clean number
        if (typeof currentValue === 'number' && Number.isInteger(currentValue)) {
          continue;
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
        const newValue = isNaN(cleanedValue) ? 1 : cleanedValue;

        // Only update if the value has changed
        if (newValue !== levelData.value) {
          logger.debug(`Migrating actor ${actor.name}: Level value from ${levelData.value} to ${newValue}`);
          await actor.update({ 'system.level.value': newValue });
        }
      } catch (error) {
        logger.error(`Error migrating level value for actor ${actor.name}:`, error);
      }
    }

    logger.info('Completed migration: Clean level values');
  }
}