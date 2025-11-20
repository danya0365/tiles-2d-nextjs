import { PlayerStats } from "./entities/Player";
import { TimeState } from "./TimeManager";

/**
 * Save data structure
 */
export interface SaveData {
  version: string;
  timestamp: number;
  player: {
    stats: PlayerStats;
    position: { x: number; y: number };
  };
  time: TimeState;
  farm: Record<string, unknown>;
  world: Record<string, unknown>;
  progress: {
    achievements: string[];
    unlockedAreas: string[];
  };
}

/**
 * Save Manager
 * Handles save/load game state to LocalStorage
 */
export class SaveManager {
  private static readonly SAVE_KEY_PREFIX = "stardew_save_";
  private static readonly CURRENT_VERSION = "1.0.0";
  private static readonly MAX_SAVE_SLOTS = 3;

  /**
   * Save game to specified slot
   */
  static save(slotNumber: number, data: Partial<SaveData>): boolean {
    if (slotNumber < 1 || slotNumber > this.MAX_SAVE_SLOTS) {
      console.error(`Invalid save slot: ${slotNumber}`);
      return false;
    }

    try {
      const saveData: SaveData = {
        version: this.CURRENT_VERSION,
        timestamp: Date.now(),
        player: data.player || {
          stats: {
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            money: 500,
            speed: 100,
            runSpeedMultiplier: 1.5,
          },
          position: { x: 0, y: 0 },
        },
        time:
          data.time ||
          ({
            hour: 6,
            minute: 0,
            day: 1,
            season: "spring",
            year: 1,
            weather: "sunny",
          } as TimeState),
        farm: data.farm || {},
        world: data.world || {},
        progress: data.progress || {
          achievements: [],
          unlockedAreas: [],
        },
      };

      const key = this.getSaveKey(slotNumber);
      const serialized = JSON.stringify(saveData);

      localStorage.setItem(key, serialized);

      console.log(`Game saved to slot ${slotNumber}`);
      return true;
    } catch (error) {
      console.error("Error saving game:", error);
      return false;
    }
  }

  /**
   * Load game from specified slot
   */
  static load(slotNumber: number): SaveData | null {
    if (slotNumber < 1 || slotNumber > this.MAX_SAVE_SLOTS) {
      console.error(`Invalid save slot: ${slotNumber}`);
      return null;
    }

    try {
      const key = this.getSaveKey(slotNumber);
      const serialized = localStorage.getItem(key);

      if (!serialized) {
        console.log(`No save data found in slot ${slotNumber}`);
        return null;
      }

      const data: SaveData = JSON.parse(serialized);

      // Validate save version
      if (!this.validateSaveVersion(data.version)) {
        console.warn(`Save version mismatch. Attempting migration...`);
        // TODO: Implement save migration if needed
      }

      console.log(`Game loaded from slot ${slotNumber}`);
      return data;
    } catch (error) {
      console.error("Error loading game:", error);
      return null;
    }
  }

  /**
   * Delete save from specified slot
   */
  static deleteSave(slotNumber: number): boolean {
    if (slotNumber < 1 || slotNumber > this.MAX_SAVE_SLOTS) {
      console.error(`Invalid save slot: ${slotNumber}`);
      return false;
    }

    try {
      const key = this.getSaveKey(slotNumber);
      localStorage.removeItem(key);

      console.log(`Save deleted from slot ${slotNumber}`);
      return true;
    } catch (error) {
      console.error("Error deleting save:", error);
      return false;
    }
  }

  /**
   * Check if save exists in slot
   */
  static hasSave(slotNumber: number): boolean {
    if (slotNumber < 1 || slotNumber > this.MAX_SAVE_SLOTS) {
      return false;
    }

    const key = this.getSaveKey(slotNumber);
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get save info (timestamp, playtime, etc.) without loading full data
   */
  static getSaveInfo(
    slotNumber: number
  ): { timestamp: number; version: string } | null {
    if (slotNumber < 1 || slotNumber > this.MAX_SAVE_SLOTS) {
      return null;
    }

    try {
      const key = this.getSaveKey(slotNumber);
      const serialized = localStorage.getItem(key);

      if (!serialized) {
        return null;
      }

      const data = JSON.parse(serialized);
      return {
        timestamp: data.timestamp,
        version: data.version,
      };
    } catch (error) {
      console.error("Error getting save info:", error);
      return null;
    }
  }

  /**
   * Get all available save slots with info
   */
  static getAllSaves(): Array<{
    slot: number;
    info: { timestamp: number; version: string } | null;
  }> {
    const saves = [];
    for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
      saves.push({
        slot: i,
        info: this.getSaveInfo(i),
      });
    }
    return saves;
  }

  /**
   * Export save data as JSON string
   */
  static exportSave(slotNumber: number): string | null {
    const data = this.load(slotNumber);
    if (!data) {
      return null;
    }

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import save data from JSON string
   */
  static importSave(slotNumber: number, jsonString: string): boolean {
    try {
      const data: SaveData = JSON.parse(jsonString);

      // Validate save data
      if (!data.version || !data.timestamp) {
        console.error("Invalid save data format");
        return false;
      }

      const key = this.getSaveKey(slotNumber);
      localStorage.setItem(key, jsonString);

      console.log(`Save imported to slot ${slotNumber}`);
      return true;
    } catch (error) {
      console.error("Error importing save:", error);
      return false;
    }
  }

  /**
   * Get save key for LocalStorage
   */
  private static getSaveKey(slotNumber: number): string {
    return `${this.SAVE_KEY_PREFIX}${slotNumber}`;
  }

  /**
   * Validate save version
   */
  private static validateSaveVersion(version: string): boolean {
    // Simple version check - can be expanded for proper semantic versioning
    return version === this.CURRENT_VERSION;
  }

  /**
   * Clear all saves (use with caution!)
   */
  static clearAllSaves(): void {
    for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
      this.deleteSave(i);
    }
    console.log("All saves cleared");
  }
}
