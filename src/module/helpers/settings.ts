import { Logger, LogLevel } from '../utils/logger';
import { TLGCC } from './constants';
import { MINIMAL_STATUS_EFFECTS, DEFAULT_STATUS_EFFECTS } from '../config/statusEffects';
import type { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token';

const logger = Logger.getInstance();

export default class Settings {
  // Make original status effects static and public for hooks.ts
  static readonly MINIMAL_STATUS_EFFECTS = MINIMAL_STATUS_EFFECTS;
  private static originalStatusEffects: StatusEffect[] = [];

  private static initStatusEffects(): void {
    if (!this.originalStatusEffects.length) {
      // @ts-ignore - CONFIG.statusEffects is compatible but TypeScript doesn't know that
      this.originalStatusEffects = CONFIG.statusEffects ? 
        foundry.utils.deepClone(CONFIG.statusEffects) : 
        DEFAULT_STATUS_EFFECTS;
    }
  }

  private static async updateTokens(): Promise<void> {
    if (!canvas?.ready) return;

    for (const token of canvas.tokens?.placeables || []) {
      if (!token?.actor) continue;
      await token.drawEffects();
      // @ts-ignore
      if (token.hasActiveHUD) token.refreshHUD();
    }

    // @ts-ignore
    ui.tokens?.render(true);
    ui.controls?.render(true);
  }

  public static async updateStatusEffects(useMinimal: boolean): Promise<void> {
    try {
      this.initStatusEffects();
      // @ts-ignore
      CONFIG.statusEffects = foundry.utils.deepClone(
        useMinimal ? MINIMAL_STATUS_EFFECTS : this.originalStatusEffects
      );
      await this.updateTokens();
    } catch (error) {
      logger.error('Error updating status effects:', error);
      ui.notifications?.error("Error updating status effects");
    }
  }

  static registerSettings(): void {
    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'systemMigrationVersion', {
      name: 'System Migration Version',
      scope: 'world',
      config: false,
      type: Number,
      default: 0
    });

    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'logLevel', {
      name: 'Logging Level',
      hint: 'Set the level of logging (F12 dev tools)',
      scope: 'world',
      config: true,
      type: String,
      choices: {
        debug: 'Debug',
        info: 'Info',
        warn: 'Warning',
        error: 'Error'
      },
      default: 'info',
      onChange: (value: string) => {
        logger.setLogLevel(LogLevel[value.toUpperCase() as keyof typeof LogLevel]);
      }
    });

    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'showDetailedFormulas', {
      name: 'TLGCC.Settings.ShowDetailedFormulas.Name',
      hint: 'TLGCC.Settings.ShowDetailedFormulas.Hint',
      scope: 'client',
      config: true,
      type: Boolean,
      default: true,
      onChange: () => {
        Object.values(ui.windows).forEach(app => {
          if (app.constructor.name === "TlgccActorSheet") {
            app.render();
          }
        });
      }
    });

    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'useMinimalStatusEffects', {
      name: 'TLGCC.Settings.UseMinimalStatusEffects.Name',
      hint: 'TLGCC.Settings.UseMinimalStatusEffects.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
      onChange: async (value: boolean) => await Settings.updateStatusEffects(value)
    });

    // @ts-ignore
    game.settings.register(TLGCC.SYSTEM_ID, 'rerollInitiativeEachRound', {
      name: 'TLGCC.Settings.RerollInitiativeEachRound.Name',
      hint: 'TLGCC.Settings.RerollInitiativeEachRound.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });
  }

  // Getters with simplified error handling
  static get systemMigrationVersion(): number {
    // @ts-ignore
    return game.settings.get(TLGCC.SYSTEM_ID, 'systemMigrationVersion') ?? 0;
  }

  static get logLevel(): string {
    // @ts-ignore
    return game.settings.get(TLGCC.SYSTEM_ID, 'logLevel') ?? 'info';
  }

  static get showDetailedFormulas(): boolean {
    // @ts-ignore
    return game.settings.get(TLGCC.SYSTEM_ID, 'showDetailedFormulas') ?? true;
  }

  static get useMinimalStatusEffects(): boolean {
    // @ts-ignore
    return game.settings.get(TLGCC.SYSTEM_ID, 'useMinimalStatusEffects') ?? false;
  }

  static get rerollInitiativeEachRound(): boolean {
    // @ts-ignore
    return game.settings.get(TLGCC.SYSTEM_ID, 'rerollInitiativeEachRound') ?? true;
  }
}