import { Color, DisplayMode, Engine, Scene, Vector } from "excalibur";

/**
 * Main Excalibur Game Engine Configuration
 * Stardew Valley-style farming RPG game
 */
export class ExcaliburGame {
  private static instance: Engine | null = null;

  /**
   * Initialize the game engine (Singleton pattern)
   */
  static initialize(canvasElement: HTMLCanvasElement): Engine {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new Engine({
      // Canvas configuration
      canvasElement,

      // Display settings
      displayMode: DisplayMode.FitScreen,
      width: 1280,
      height: 720,

      // Graphics settings
      antialiasing: true,
      pixelArt: true, // Enable pixel-perfect rendering
      pixelRatio: 2, // Retina display support

      // Physics settings
      physics: {
        enabled: true,
        gravity: Vector.Zero, // Top-down game, no gravity
      },

      // Performance settings
      fixedUpdateFps: 60,
      maxFps: 60,

      // Background color
      backgroundColor: Color.fromHex("#1a1a2e"),

      // Suppress play button (auto-start)
      suppressPlayButton: true,

      // Enable debugging in development
      suppressMinimumBrowserFeatureDetection: true,
    });

    // Configure scenes
    this.setupScenes();

    return this.instance;
  }

  /**
   * Setup game scenes
   */
  private static setupScenes(): void {
    if (!this.instance) return;

    // Main menu scene
    const mainMenuScene = new Scene();
    this.instance.addScene("mainMenu", mainMenuScene);

    // Game scene (farm)
    const gameScene = new Scene();
    this.instance.addScene("game", gameScene);

    // Loading scene
    const loadingScene = new Scene();
    this.instance.addScene("loading", loadingScene);

    // Set initial scene
    this.instance.goToScene("loading");
  }

  /**
   * Get the game engine instance
   */
  static getInstance(): Engine | null {
    return this.instance;
  }

  /**
   * Start the game
   */
  static async start(): Promise<void> {
    if (!this.instance) {
      throw new Error("Game engine not initialized. Call initialize() first.");
    }

    await this.instance.start();
  }

  /**
   * Stop the game
   */
  static stop(): void {
    if (this.instance) {
      this.instance.stop();
      this.instance = null;
    }
  }

  /**
   * Go to a specific scene
   */
  static goToScene(sceneName: string): void {
    if (this.instance) {
      this.instance.goToScene(sceneName);
    }
  }
}
