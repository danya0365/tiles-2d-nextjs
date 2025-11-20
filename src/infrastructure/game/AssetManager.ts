import { ImageSource, Sound, SpriteSheet } from "excalibur";

/**
 * Asset Manager for loading and managing game assets
 * Handles sprites, sounds, and other resources
 */
export class AssetManager {
  private static images: Map<string, ImageSource> = new Map();
  private static sounds: Map<string, Sound> = new Map();
  private static spriteSheets: Map<string, SpriteSheet> = new Map();
  private static initialized = false;

  /**
   * Base path for Sprout Lands assets
   */
  private static readonly ASSET_BASE_PATH = "/SproutLands";

  /**
   * Initialize asset definitions (idempotent)
   */
  static initialize(): void {
    if (this.initialized) return;

    // Define all assets in memory
    this.loadImages();
    this.loadSounds();

    this.initialized = true;
    console.log("Asset manager initialized");
  }

  /**
   * Load image assets
   */
  private static loadImages(): void {
    // Character sprites
    const characterPath = `${this.ASSET_BASE_PATH}/Characters`;
    this.addImage(
      "player-basic",
      `${characterPath}/Basic Charakter Spritesheet.png`
    );

    // Object sprites
    const objectsPath = `${this.ASSET_BASE_PATH}/Objects`;
    this.addImage(
      "objects-basic",
      `${objectsPath}/Basic tools and meterials.png`
    );
    this.addImage("objects-wooden", `${objectsPath}/Wooden House.png`);

    // Tileset sprites (if available)
    // Note: Add more tilesets as needed from Sprout Lands folder
  }

  /**
   * Load sound assets
   */
  private static loadSounds(): void {
    // TODO: Add sound files when available
    // Example:
    // this.addSound('bgm-spring', '/sounds/spring-theme.mp3');
    // this.addSound('sfx-footstep', '/sounds/footstep.wav');
  }

  /**
   * Add an image definition
   */
  private static addImage(key: string, path: string): void {
    const imageSource = new ImageSource(path);
    this.images.set(key, imageSource);
  }

  /**
   * Add a sound definition
   */
  private static addSound(key: string, path: string): void {
    const sound = new Sound(path);
    this.sounds.set(key, sound);
  }

  /**
   * Preload all assets with optional progress callback
   */
  static async preloadAll(
    onProgress?: (progress: number) => void
  ): Promise<void> {
    // Ensure asset definitions exist
    this.initialize();

    const images = Array.from(this.images.values());
    const total = images.length;

    if (total === 0) {
      onProgress?.(1);
      return;
    }

    let loaded = 0;

    for (const img of images) {
      await img.load();
      loaded += 1;
      onProgress?.(loaded / total);
    }

    // TODO: When sounds are added, extend this to preload them as well
  }

  /**
   * Get an image by key
   */
  static getImage(key: string): ImageSource | undefined {
    return this.images.get(key);
  }

  /**
   * Get a sound by key
   */
  static getSound(key: string): Sound | undefined {
    return this.sounds.get(key);
  }

  /**
   * Create a sprite sheet from an image
   */
  static createSpriteSheet(
    imageKey: string,
    columns: number,
    rows: number,
    spriteWidth: number,
    spriteHeight: number
  ): SpriteSheet | null {
    const image = this.getImage(imageKey);
    if (!image) {
      console.error(`Image not found: ${imageKey}`);
      return null;
    }

    const spriteSheet = SpriteSheet.fromImageSource({
      image,
      grid: {
        rows,
        columns,
        spriteWidth,
        spriteHeight,
      },
    });

    this.spriteSheets.set(imageKey, spriteSheet);
    return spriteSheet;
  }

  /**
   * Get a sprite sheet by key
   */
  static getSpriteSheet(key: string): SpriteSheet | undefined {
    return this.spriteSheets.get(key);
  }
}
