import { TLGCC } from './constants';
import { Logger, LogLevel } from '../utils/logger';

const logger = Logger.getInstance();

interface SettingsData {
  logLevel: string;
  systemMigrationVersion: number;
}

class Settings {
  /**
   * Register all game settings for the system
   */
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
  }

  /**
   * Get the current system migration version
   */
  static get systemMigrationVersion(): number {
    try {
      // @ts-ignore
      return game.settings.get(TLGCC.SYSTEM_ID, 'systemMigrationVersion') ?? 0;
    } catch (error) {
      logger.error('Error getting system migration version:', error);
      return 0;
    }
  }

  /**
   * Set the system migration version
   */
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

  /**
   * Get the current log level
   */
  static get logLevel(): string {
    try {
      // @ts-ignore
      return game.settings.get(TLGCC.SYSTEM_ID, 'logLevel');
    } catch (error) {
      logger.error('Error getting log level:', error);
      return 'info'; // Default to info level if there's an error
    }
  }

  /**
   * Reset all settings to their default values
   */
  static async resetSettings(): Promise<void> {
    try {
      const defaultSettings: SettingsData = {
        logLevel: 'info',
        systemMigrationVersion: 0
      };

      for (const [key, value] of Object.entries(defaultSettings)) {
        // @ts-ignore
        await game.settings.set(TLGCC.SYSTEM_ID, key, value);
      }
      logger.info('All settings reset to defaults');
    } catch (error) {
      logger.error('Error resetting settings:', error);
      throw error;
    }
  }

  /**
   * Get all current settings as an object
   */
  static getAllSettings(): Partial<SettingsData> {
    try {
      return {
        logLevel: this.logLevel,
        systemMigrationVersion: this.systemMigrationVersion
      };
    } catch (error) {
      logger.error('Error getting all settings:', error);
      return {};
    }
  }
}

export default Settings;