// src/module/utils/number-appearing.ts
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

interface RangeResult {
  min: number;
  max: number;
}

interface NumberAppearingResult {
  value: number;
  detail: string;
}

export class NumberAppearingRoller {
  /**
   * Check if a format string needs rolling (not just "1")
   * @param format - The format string to check
   * @returns boolean indicating if rolling is needed
   */
  static needsRoll(format: string): boolean {
    const trimmed = format?.trim() || '';
    return trimmed !== '1' && trimmed !== '';
  }

  /**
   * Parse a range string in the format "1" or "10-40" or "10-40, 50-100"
   * @param range - The range string to parse
   * @returns The parsed range result with minimum and maximum values
   */
  private static parseRange(range: string): RangeResult {
    range = range.trim();

    // If it's just a number
    if (!isNaN(Number(range))) {
      const value = Number(range);
      return { min: value, max: value };
    }

    // If it's a range like "10-40"
    const rangeParts = range.split('-');
    if (rangeParts.length === 2) {
      const min = Number(rangeParts[0].trim());
      const max = Number(rangeParts[1].trim());

      if (!isNaN(min) && !isNaN(max)) {
        return { min, max };
      }
    }

    // If we can't parse it, return 1 as default
    logger.warn(`Invalid range format: ${range}, defaulting to 1`);
    return { min: 1, max: 1 };
  }

  /**
   * Roll for number appearing based on the provided format
   * @param format - The format string (e.g., "1", "10-40", or "10-40, 50-100")
   * @returns The roll result and explanation
   */
  static roll(format: string): NumberAppearingResult {
    try {
      // Handle empty or invalid input
      if (!format || typeof format !== 'string') {
        return {
          value: 1,
          detail: "Invalid format, defaulting to 1"
        };
      }

      // Split on comma to handle multiple ranges
      const ranges = format.split(',');

      // If we have multiple ranges, randomly choose one
      const selectedRange = ranges[Math.floor(Math.random() * ranges.length)].trim();

      // Parse the selected range
      const { min, max } = this.parseRange(selectedRange);

      // Generate random number within range
      const value = Math.floor(Math.random() * (max - min + 1)) + min;

      // Create detail message
      let detail = `Rolled ${value}`;
      if (ranges.length > 1) {
        detail += ` (using range: ${selectedRange})`;
      }
      if (min !== max) {
        detail += ` [${min}-${max}]`;
      }

      return { value, detail };
    } catch (error) {
      logger.error('Error rolling number appearing:', error);
      return {
        value: 1,
        detail: "Error in roll calculation, defaulting to 1"
      };
    }
  }
}