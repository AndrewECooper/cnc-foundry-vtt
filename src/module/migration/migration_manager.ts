// src/module/migrations/MigrationManager.ts
import { Logger } from '../utils/logger';
import { Migration001CleanLevelValues } from './migrations/001_CleanLevelValues';
import { Migration002AddMonsterSanity } from './migrations/002_AddMonsterSanity';
import { Migration003RemoveMonsterFields } from './migrations/003_RemoveMonsterFields';

const logger = Logger.getInstance();

export class MigrationManager {
  private static readonly MIGRATION_KEY = 'systemMigrationVersion';
  private static readonly migrations = [
    Migration001CleanLevelValues,
    Migration002AddMonsterSanity,
    Migration003RemoveMonsterFields
  ];

  static async checkAndMigrate(): Promise<void> {
    // @ts-ignore - game.settings exists at runtime
    const currentVersion = game.settings.get('castles-and-crusades', this.MIGRATION_KEY) ?? 0;
    const pendingMigrations = this.migrations.filter(m => m.version > currentVersion);

    if (pendingMigrations.length === 0) {
      return;
    }

    logger.info(`Applying ${pendingMigrations.length} pending migrations...`);

    // Sort migrations by version number
    pendingMigrations.sort((a, b) => {
      const verA = String(a.version);
      const verB = String(b.version);
      return Number(verA.replace(/\./g, '')) - Number(verB.replace(/\./g, ''));
    });

    for (const migration of pendingMigrations) {
      try {
        await migration.migrate();
        // @ts-ignore - game.settings exists at runtime
        await game.settings.set('castles-and-crusades', this.MIGRATION_KEY, migration.version);
        logger.info(`Migration ${migration.version} completed successfully`);
      } catch (error) {
        logger.error(`Error during migration ${migration.version}:`, error);
        throw error; // Re-throw to prevent further migrations
      }
    }

    logger.info('All migrations completed successfully');
  }
}