import { Logger } from '../../utils/logger';

const logger = Logger.getInstance();

export class Migration002AddMonsterSanity {
  static readonly version = 2;

  static async migrate(): Promise<void> {
    logger.info('Starting migration 002: Adding monster sanity field and removing resources');

    // @ts-ignore - game.actors exists at runtime
    for (const actor of game.actors) {
      try {
        // Skip non-monster actors
        if (actor.type !== 'monster') continue;

        const updates: Record<string, unknown> = {
          // Initialize sanity field if it doesn't exist
          'system.sanity': {
            value: '',
            label: 'TLGCC.Sanity'
          }
        };

        // Remove resource fields if they exist
        if (actor.system?.resources) {
          // Using -=suffix to remove fields in Foundry
          updates['system.resources.first'] = null;
          updates['system.resources.second'] = null;
          updates['system.resources.third'] = null;
          updates['system.resources.fourth'] = null;
          updates['system.resources.fifth'] = null;
        }

        await actor.update(updates);
        logger.info(`Migrated actor ${actor.name} (${actor.id})`);
      } catch (error) {
        logger.error(`Error migrating actor ${actor.name} (${actor.id}):`, error);
        // Continue with other actors even if one fails
      }
    }
  }
}