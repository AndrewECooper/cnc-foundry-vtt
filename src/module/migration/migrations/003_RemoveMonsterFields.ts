// src/module/migrations/migrations/Migration003RemoveMonsterFields.ts
import { Logger } from '../../utils/logger';

const logger = Logger.getInstance();

interface tlgccActor extends Actor {
  system: {
    saves?: unknown;
    resources?: unknown;
  };
}

export class Migration003RemoveMonsterFields {
  static readonly version = 3;

  static async migrate(): Promise<void> {
    logger.info('Starting migration: Remove monster saves and resources fields');
    let worldActorCount = 0;
    let compendiumActorCount = 0;

    // Migrate world monsters
    // @ts-ignore - game.actors exists at runtime
    const monsters = game.actors?.filter((a: tlgccActor) => a.type === 'monster') ?? [];

    for (const actor of monsters) {
      try {
        await this.migrateMonsterData(actor as tlgccActor);
        worldActorCount++;
      } catch(err) {
        logger.error(`Error migrating monster ${actor.name}:`, err);
      }
    }
    
    // Migrate compendium monsters
    // @ts-ignore - game.packs exists at runtime
    const actorPacks = game.packs?.filter((p: CompendiumCollection) => p.metadata.type === "Actor") ?? [];
    
    for (const pack of actorPacks) {
      logger.debug(`Processing compendium: ${pack.collection}`);
      const documents = await pack.getDocuments();
      const monsters = documents.filter((d: tlgccActor) => d.type === 'monster');
      
      for (const actor of monsters) {
        try {
          await this.migrateMonsterData(actor as tlgccActor);
          compendiumActorCount++;
        } catch(err) {
          logger.error(`Error migrating compendium monster ${actor.name}:`, err);
        }
      }
    }

    logger.info('Completed migration: Remove monster saves and resources fields');
    logger.debug(`- World monsters processed: ${worldActorCount}`);
    logger.debug(`- Compendium monsters processed: ${compendiumActorCount}`);
    logger.debug(`- Total monsters processed: ${worldActorCount + compendiumActorCount}`);
  }

  private static async migrateMonsterData(actor: tlgccActor): Promise<void> {
    const updateData: Record<string, unknown> = {};
    
    if (actor.system) {
      // Check and remove saves
      if ('saves' in actor.system) {
        logger.debug(`Removing saves from monster: ${actor.name}`);
        updateData['system.-=saves'] = null;
      }
      
      // Check and remove resources
      if ('resources' in actor.system) {
        logger.debug(`Removing resources from monster: ${actor.name}`);
        updateData['system.-=resources'] = null;
      }
    }

    // Only update if there are changes to make
    if (Object.keys(updateData).length > 0) {
      await actor.update(updateData);
    }
  }
}