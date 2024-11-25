// src/module/helpers/settings.ts
import { Logger, LogLevel } from '../utils/logger';
import { TLGCC } from './constants';

const logger = Logger.getInstance();

export default class Settings {
  public static readonly MINIMAL_STATUS_EFFECTS = [
    {
      id: "dead",
      label: "EFFECT.StatusDead",
      img: "icons/svg/skull.svg"  // Changed from icon to img
    },
    {
      id: "unconscious",
      label: "EFFECT.StatusUnconscious",
      img: "icons/svg/unconscious.svg"  // Changed from icon to img
    }
  ];

  // Store original status effects when we first initialize
  private static originalStatusEffects: any[] | null = null;

  private static captureOriginalEffects(): void {
    // Only capture if we haven't already
    if (!this.originalStatusEffects) {
      // @ts-ignore
      const current = CONFIG.statusEffects;
      this.originalStatusEffects = current ? foundry.utils.deepClone(current) : [
        { id: 'dead', label: 'EFFECT.StatusDead', img: 'icons/svg/skull.svg' },
        { id: 'blind', label: 'EFFECT.StatusBlind', img: 'icons/svg/blind.svg' },
        { id: 'charm', label: 'EFFECT.StatusCharm', img: 'icons/svg/charm.svg' },
        { id: 'deaf', label: 'EFFECT.StatusDeaf', img: 'icons/svg/deaf.svg' },
        { id: 'disease', label: 'EFFECT.StatusDisease', img: 'icons/svg/disease.svg' },
        { id: 'poison', label: 'EFFECT.StatusPoison', img: 'icons/svg/poison.svg' },
        { id: 'sleep', label: 'EFFECT.StatusAsleep', img: 'icons/svg/sleep.svg' },
        { id: 'stun', label: 'EFFECT.StatusStunned', img: 'icons/svg/daze.svg' },
        { id: 'prone', label: 'EFFECT.StatusProne', img: 'icons/svg/falling.svg' },
        { id: 'restrain', label: 'EFFECT.StatusRestrained', img: 'icons/svg/net.svg' },
        { id: 'paralysis', label: 'EFFECT.StatusParalysis', img: 'icons/svg/paralysis.svg' },
        { id: 'fly', label: 'EFFECT.StatusFlying', img: 'icons/svg/wing.svg' },
        { id: 'elevateDamage', label: 'EFFECT.StatusElevateDamage', img: 'icons/svg/upgrade.svg' },
        { id: 'reduceDamage', label: 'EFFECT.StatusReduceDamage', img: 'icons/svg/downgrade.svg' },
        { id: 'invisible', label: 'EFFECT.StatusInvisible', img: 'icons/svg/invisible.svg' },
        { id: 'target', label: 'EFFECT.StatusTarget', img: 'icons/svg/target.svg' },
        { id: 'mark', label: 'EFFECT.StatusMarked', img: 'icons/svg/combat.svg' }
      ];
      logger.debug('Captured original status effects:', this.originalStatusEffects);
    }
  }

  public static async updateStatusEffects(useMinimal: boolean): Promise<void> {
    try {
      logger.debug(`Updating status effects. Minimal mode: ${useMinimal}`);

      // Always ensure we have captured the original effects
      this.captureOriginalEffects();

      if (useMinimal) {
        logger.debug('Setting minimal status effects');
        CONFIG.statusEffects = foundry.utils.deepClone(this.MINIMAL_STATUS_EFFECTS);
      } else {
        logger.debug('Restoring full status effects');
        // @ts-ignore
        CONFIG.statusEffects = foundry.utils.deepClone(this.originalStatusEffects);
      }

      logger.debug('Current CONFIG.statusEffects:', CONFIG.statusEffects);

      // Only update tokens if canvas is ready
      if (!canvas?.ready) {
        logger.debug('Canvas not ready, skipping token updates');
        return;
      }

      try {
        // Update existing tokens
        // @ts-ignore
        for (const token of canvas.tokens?.placeables || []) {
          if (!token?.actor) continue;
          try {
            await token.drawEffects();
            // @ts-ignore
            if (token.hasActiveHUD) {
              token.refreshHUD();
              logger.debug(`Refreshed HUD for token: ${token.id}`);
            }
          } catch (err) {
            logger.warn(`Failed to refresh token ${token.id}:`, err);
          }
        }

        // Refresh UI elements
        // @ts-ignore
        if (ui.tokens) {
          // @ts-ignore
          ui.tokens.render(true);
          logger.debug('Rendered tokens UI');
        }
        // @ts-ignore
        if (ui.controls) {
          ui.controls.render(true);
          logger.debug('Rendered controls UI');
        }

      } catch (err) {
        logger.warn('Non-critical error updating tokens:', err);
      }

    } catch (error) {
      logger.error('Error updating status effects:', error);
      // @ts-ignore
      ui.notifications?.error("Error updating status effects. Check console for details.");
      return;
    }
  }

  static registerSettings(): void {
    // System Migration Version
    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'systemMigrationVersion', {
      name: 'System Migration Version',
      scope: 'world',
      config: false,
      type: Number,
      default: 0,
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
        // @ts-ignore
        Object.values(ui.windows).forEach((app) => {
          if (app.constructor.name === "TlgccActorSheet") {
            app.render();
          }
        });
      }
    });

    // Status effects setting
    // @ts-ignore
    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'disableStatusEffects', {
      name: 'TLGCC.Settings.DisableStatusEffects.Name',
      hint: 'TLGCC.Settings.DisableStatusEffects.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: false, // @ts-ignore
      onChange: async (value) => {
        await Settings.updateStatusEffects(value);
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

  static get disableStatusEffects(): boolean {
    try {
      // @ts-ignore
      return game.settings.get(TLGCC.SYSTEM_ID, 'disableStatusEffects');
    } catch (error) {
      logger.error('Error getting disableStatusEffects setting:', error);
      return false;
    }
  }
}