// src/module/helpers/settings.ts

import { Logger, LogLevel } from '../utils/logger';
import { TLGCC } from './constants';

const logger = Logger.getInstance();

export default class Settings {
  static registerSettings(): void {
    // System Migration Version
    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'systemMigrationVersion', {
      name: 'System Migration Version',
      scope: 'world',
      config: false,
      type: Number,
      default: 0,
      onChange: (newVersion: number) => {
        logger.debug(`System migration version updated to ${newVersion}`);
      }
    });

    // Logging Level
    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'logLevel', {
      name: 'Logging Level',
      hint: 'Set the level of logging for the system in Developer Tools (F12)',
      scope: 'world',
      config: true,
      type: String,
      choices: {
        debug: 'Debug',
        info: 'Info',
        warn: 'Warning',
        error: 'Error',
      },
      default: 'info',
      onChange: (value: string) => {
        const level = LogLevel[value.toUpperCase() as keyof typeof LogLevel];
        logger.setLogLevel(level);
        logger.info(`Log level changed to ${value}`);
      },
    });

    // Add new setting for detailed roll formulas
    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'showDetailedFormulas', {
      name: 'TLGCC.Settings.ShowDetailedFormulas.Name',
      hint: 'TLGCC.Settings.ShowDetailedFormulas.Hint',
      scope: 'client',
      config: true,
      type: Boolean,
      default: true,
      onChange: () => {
        // Instead of directly referencing TlgccActorSheet, we'll update all windows
        // @ts-ignore
        Object.values(ui.windows).forEach((app) => {
          if (app.constructor.name === "TlgccActorSheet") {
            app.render();
          }
        });
      }
    });
  }

  static get systemMigrationVersion(): number {
    try {
      // @ts-ignore
      return game.settings.get(TLGCC.SYSTEM_ID, 'systemMigrationVersion') ?? 0;
    } catch (error) {
      logger.error('Error getting system migration version:', error);
      return 0;
    }
  }

  static async setSystemMigrationVersion(version: number): Promise<void> {
    try {
      // @ts-ignore
      await game.settings.set(TLGCC.SYSTEM_ID, 'systemMigrationVersion', version);
      logger.debug(`Set system migration version to ${version}`);
    } catch (error) {
      logger.error('Error setting system migration version:', error);
      throw error;
    }
  }

  static get logLevel(): string {
    try {
      // @ts-ignore
      return game.settings.get(TLGCC.SYSTEM_ID, 'logLevel');
    } catch (error) {
      logger.error('Error getting log level:', error);
      return 'info';
    }
  }

  static get showDetailedFormulas(): boolean {
    try {
      // @ts-ignore
      return game.settings.get(TLGCC.SYSTEM_ID, 'showDetailedFormulas');
    } catch (error) {
      logger.error('Error getting showDetailedFormulas setting:', error);
      return true;
    }
  }
}