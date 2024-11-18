import { TLGCC } from './constants';
import { Logger, LogLevel } from '../utils/logger';

const logger = Logger.getInstance();

class Settings {
  static registerSettings(): void {
    // Add a log level setting to the system settings
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
      }
    });

    // game.settings.register(MODULE_ID, 'exampleSetting', {
    //   name: 'Example Setting',
    //   hint: 'This is an example setting.',
    //   scope: 'world',
    //   config: true,
    //   default: true,
    //   type: Boolean,
    //   onChange: (value) => {
    //     console.log(`Example setting changed to ${value}`);
    //   },
    // });
  }

  static get logLevel(): string {
    // @ts-ignore
    return game.settings.get(TLGCC.SYSTEM_ID, 'logLevel');
  }
}

export default Settings;
