import { AssetManager } from "@/src/infrastructure/game/AssetManager";
import {
  Actor,
  Animation,
  CollisionType,
  Color,
  Engine,
  Keys,
  Vector,
} from "excalibur";

/**
 * Player stats interface
 */
export interface PlayerStats {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  money: number;
  speed: number;
  runSpeedMultiplier: number;
}

/**
 * Player direction
 */
export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

/**
 * Player class - Main playable character
 * Top-down movement with 4-directional sprites
 */
export class Player extends Actor {
  private stats: PlayerStats;
  private currentDirection: Direction = Direction.Down;
  private isMoving: boolean = false;
  private isRunning: boolean = false;
  private animations: Map<string, Animation> = new Map();

  constructor(x: number, y: number) {
    super({
      pos: new Vector(x, y),
      width: 48,
      height: 48,
      collisionType: CollisionType.Active,
    });

    // Debug color so player is visible even without sprites
    this.color = Color.Red;

    console.log("Player constructed at", this.pos);

    // Initialize player stats
    this.stats = {
      health: 100,
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      money: 500, // Starting money
      speed: 100, // Base speed (pixels per second)
      runSpeedMultiplier: 1.5,
    };

    // Setup animations
    this.setupAnimations();
  }

  /**
   * Setup player animations
   */
  private setupAnimations(): void {
    // Create animations from sprite sheet when available
    const spriteSheet =
      AssetManager.getSpriteSheet("player-basic") ||
      AssetManager.createSpriteSheet("player-basic", 4, 4, 48, 48);

    if (!spriteSheet) {
      return;
    }

    // Frame indices (4x4 sheet, row-major):
    // Row 0: 0-3, Row 1: 4-7, Row 2: 8-11, Row 3: 12-15
    const mkAnim = (indices: number[], speed: number) =>
      Animation.fromSpriteSheet(spriteSheet, indices, speed);

    // Simple idle = first frame of each row, walk = loop over row
    this.animations.set("idle-down", mkAnim([0], 200));
    this.animations.set("walk-down", mkAnim([0, 1, 2, 3], 150));

    this.animations.set("idle-left", mkAnim([4], 200));
    this.animations.set("walk-left", mkAnim([4, 5, 6, 7], 150));

    this.animations.set("idle-right", mkAnim([8], 200));
    this.animations.set("walk-right", mkAnim([8, 9, 10, 11], 150));

    this.animations.set("idle-up", mkAnim([12], 200));
    this.animations.set("walk-up", mkAnim([12, 13, 14, 15], 150));

    // Use a default animation
    const defaultAnim = this.animations.get("idle-down");
    if (defaultAnim) {
      this.graphics.use(defaultAnim);
    }
  }

  /**
   * Handle player input
   */
  private handleInput(engine: Engine): void {
    const keyboard = engine.input.keyboard;
    const velocity = new Vector(0, 0);

    console.log("handleInput tick", keyboard);

    // Reset moving state
    this.isMoving = false;

    // Check if shift is held for running
    this.isRunning =
      keyboard.isHeld(Keys.ShiftLeft) || keyboard.isHeld(Keys.ShiftRight);

    // Calculate speed
    const currentSpeed = this.isRunning
      ? this.stats.speed * this.stats.runSpeedMultiplier
      : this.stats.speed;

    // Movement input
    if (keyboard.isHeld(Keys.W) || keyboard.isHeld(Keys.Up)) {
      console.log("W pressed");
      velocity.y = -1;
      this.currentDirection = Direction.Up;
      this.isMoving = true;
    }
    if (keyboard.isHeld(Keys.S) || keyboard.isHeld(Keys.Down)) {
      velocity.y = 1;
      this.currentDirection = Direction.Down;
      this.isMoving = true;
    }
    if (keyboard.isHeld(Keys.A) || keyboard.isHeld(Keys.Left)) {
      velocity.x = -1;
      this.currentDirection = Direction.Left;
      this.isMoving = true;
    }
    if (keyboard.isHeld(Keys.D) || keyboard.isHeld(Keys.Right)) {
      velocity.x = 1;
      this.currentDirection = Direction.Right;
      this.isMoving = true;
    }

    // Normalize diagonal movement
    if (velocity.x !== 0 && velocity.y !== 0) {
      velocity.x *= 0.707; // 1/sqrt(2)
      velocity.y *= 0.707;
    }

    // Apply velocity
    this.vel = velocity.scale(currentSpeed);

    // Consume energy while moving
    if (this.isMoving) {
      const energyCost = this.isRunning ? 0.3 : 0.1;
      this.consumeEnergy(energyCost * (engine.currentFrameLagMs / 1000));
    }

    // Update animation based on movement
    this.updateAnimation();
  }

  /**
   * Update player animation
   */
  private updateAnimation(): void {
    const state = this.isMoving ? "walk" : "idle";
    const animKey = `${state}-${this.currentDirection}`;
    const anim = this.animations.get(animKey);

    if (anim) {
      this.graphics.use(anim);
    }
  }

  /**
   * Consume energy
   */
  private consumeEnergy(amount: number): void {
    this.stats.energy = Math.max(0, this.stats.energy - amount);

    // If energy is depleted, slow down
    if (this.stats.energy <= 0) {
      this.isRunning = false;
    }
  }

  /**
   * Regenerate energy when idle
   */
  private regenerateEnergy(delta: number): void {
    const regenRate = 1; // 1 energy per second
    this.stats.energy = Math.min(
      this.stats.maxEnergy,
      this.stats.energy + (regenRate * delta) / 1000
    );
  }

  /**
   * Take damage
   */
  public takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);

    if (this.stats.health <= 0) {
      this.onDeath();
    }
  }

  /**
   * Heal health
   */
  public heal(amount: number): void {
    this.stats.health = Math.min(
      this.stats.maxHealth,
      this.stats.health + amount
    );
  }

  /**
   * Add/remove money
   */
  public addMoney(amount: number): void {
    this.stats.money += amount;
  }

  /**
   * Handle player death
   */
  private onDeath(): void {
    // TODO: Implement death logic (respawn, lose items, etc.)
    console.log("Player died!");
  }

  /**
   * Get player stats
   */
  public getStats(): PlayerStats {
    return { ...this.stats };
  }

  /**
   * Get current direction
   */
  public getDirection(): Direction {
    return this.currentDirection;
  }

  /**
   * Check if player is moving
   */
  public getIsMoving(): boolean {
    return this.isMoving;
  }
}
