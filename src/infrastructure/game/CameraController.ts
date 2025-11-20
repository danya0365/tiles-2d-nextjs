import { Actor, Camera, Engine, Vector } from "excalibur";

/**
 * Camera Controller
 * Smoothly follows the player with lerp interpolation
 */
export class CameraController {
  private camera: Camera;
  private target: Actor | null = null;
  private lerpFactor: number = 0.1; // Smoothness factor (0-1)
  private zoom: number = 1.0;
  private minZoom: number = 0.5;
  private maxZoom: number = 4.0;

  constructor(engine: Engine) {
    this.camera = engine.currentScene.camera;
  }

  /**
   * Set the camera target (usually the player)
   */
  setTarget(target: Actor): void {
    this.target = target;
  }

  /**
   * Update camera position (call in game loop)
   */
  update(_delta: number): void {
    if (!this.target) return;

    // Get target position
    const targetPos = this.target.pos;

    // Smooth camera movement (lerp)
    const currentPos = this.camera.pos;
    const newX = currentPos.x + (targetPos.x - currentPos.x) * this.lerpFactor;
    const newY = currentPos.y + (targetPos.y - currentPos.y) * this.lerpFactor;

    this.camera.pos = new Vector(newX, newY);
  }

  /**
   * Set camera zoom
   */
  setZoom(zoom: number): void {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    this.camera.zoom = this.zoom;
  }

  /**
   * Zoom in
   */
  zoomIn(amount: number = 0.1): void {
    this.setZoom(this.zoom + amount);
  }

  /**
   * Zoom out
   */
  zoomOut(amount: number = 0.1): void {
    this.setZoom(this.zoom - amount);
  }

  /**
   * Reset zoom to default
   */
  resetZoom(): void {
    this.setZoom(1.0);
  }

  /**
   * Get current zoom level
   */
  getZoom(): number {
    return this.zoom;
  }

  /**
   * Set camera lerp factor (smoothness)
   */
  setLerpFactor(factor: number): void {
    this.lerpFactor = Math.max(0, Math.min(1, factor));
  }

  /**
   * Camera shake effect
   */
  shake(_intensity: number, _duration: number): void {
    // TODO: Implement camera shake
    // Use engine.currentScene.camera.shake() when available
  }

  /**
   * Instantly move camera to position
   */
  snapTo(position: Vector): void {
    this.camera.pos = position;
  }
}
